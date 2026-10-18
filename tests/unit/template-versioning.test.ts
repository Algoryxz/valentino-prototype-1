import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import {
  getTemplate,
  registerTemplate,
  unregisterTemplate,
} from "@/templates/registry";
import { ExperienceRenderer } from "@/templates/ExperienceRenderer";
import { TemplateDefinition } from "@/templates/types";
import { z } from "zod";

describe("Milestone 2 — Template Version Immutability & Migration Contract", () => {
  const TEST_TEMPLATE_ID = "immutability-test-world";

  // Mock v1 definition
  const mockV1DraftSchema = z.object({
    partnerName: z.string().default(""),
    letter: z.string().default(""),
  });
  const mockV1PublishSchema = z.object({
    partnerName: z.string().min(1),
    letter: z.string().min(1),
  });

  const mockV1: TemplateDefinition = {
    id: TEST_TEMPLATE_ID,
    version: "v1",
    name: "Immutable World (v1)",
    description: "Version 1 release of the world",
    active: true,
    draftSchema: mockV1DraftSchema,
    publishSchema: mockV1PublishSchema,
    defaultConfig: { partnerName: "", letter: "" },
    normalizeConfig: (raw: any) => ({
      partnerName: raw?.partnerName || "Anonymous",
      letter: raw?.letter || "A silent note.",
      _versionMarker: "normalized-v1",
    }),
    Component: ({ config }: any) =>
      React.createElement(
        "div",
        { "data-testid": "mock-v1-canvas" },
        React.createElement("h1", null, config.partnerName),
        React.createElement("p", null, config.letter)
      ),
  };

  // Mock v2 definition with changed fields and migrateConfig hook
  const mockV2DraftSchema = z.object({
    recipient: z.string().default(""),
    messageBody: z.string().default(""),
    starlightMood: z.boolean().default(true),
  });
  const mockV2PublishSchema = z.object({
    recipient: z.string().min(1),
    messageBody: z.string().min(1),
    starlightMood: z.boolean(),
  });

  const mockV2: TemplateDefinition = {
    id: TEST_TEMPLATE_ID,
    version: "v2",
    name: "Immutable World (v2)",
    description: "Version 2 release with redesigned field names",
    active: true,
    draftSchema: mockV2DraftSchema,
    publishSchema: mockV2PublishSchema,
    defaultConfig: { recipient: "", messageBody: "", starlightMood: true },
    normalizeConfig: (raw: any) => ({
      recipient: raw?.recipient || "Anonymous",
      messageBody: raw?.messageBody || "A glowing note.",
      starlightMood: raw?.starlightMood ?? true,
      _versionMarker: "normalized-v2",
    }),
    Component: ({ config }: any) =>
      React.createElement(
        "div",
        { "data-testid": "mock-v2-canvas" },
        React.createElement("h1", null, config.recipient),
        React.createElement("p", null, config.messageBody)
      ),
    migrateConfig: (fromVersion: string, toVersion: string, rawConfig: any) => {
      if (fromVersion === "v1" && toVersion === "v2") {
        return {
          recipient: rawConfig?.partnerName || "",
          messageBody: rawConfig?.letter || "",
          starlightMood: true,
        };
      }
      return rawConfig;
    },
  };

  afterEach(() => {
    unregisterTemplate(TEST_TEMPLATE_ID, "v1");
    unregisterTemplate(TEST_TEMPLATE_ID, "v2");
  });

  it("strictly pins stored experiences to their exact templateVersion even when v2 is registered", () => {
    // 1. Register v1
    registerTemplate(mockV1);

    // Simulated stored database experience record created during v1
    const storedExperience = {
      templateId: TEST_TEMPLATE_ID,
      templateVersion: "v1",
      publishedConfig: {
        partnerName: "Ananya",
        letter: "Forever yours under the stars.",
      },
    };

    // Resolves v1 via authoritative getTemplate
    const resolvedV1Before = getTemplate(storedExperience.templateId, storedExperience.templateVersion);
    expect(resolvedV1Before).toBeDefined();
    expect(resolvedV1Before?.version).toBe("v1");
    expect(resolvedV1Before?.name).toBe("Immutable World (v1)");

    const normalizedV1Before = resolvedV1Before?.normalizeConfig(storedExperience.publishedConfig);
    expect(normalizedV1Before).toEqual({
      partnerName: "Ananya",
      letter: "Forever yours under the stars.",
      _versionMarker: "normalized-v1",
    });

    // Resolves v1 via authoritative ExperienceRenderer
    const renderedBefore = ExperienceRenderer({
      templateId: storedExperience.templateId,
      templateVersion: storedExperience.templateVersion,
      mode: "public",
      rawConfig: storedExperience.publishedConfig,
    });
    expect(React.isValidElement(renderedBefore)).toBe(true);
    if (React.isValidElement<{ config: { _versionMarker: string } }>(renderedBefore)) {
      expect(renderedBefore.props.config._versionMarker).toBe("normalized-v1");
    }

    // 2. Now register v2 in the template system (simulating platform deployment of a newer version)
    registerTemplate(mockV2);

    // 3. Crucial verification: Stored experience requesting v1 MUST still resolve exact v1
    const resolvedV1After = getTemplate(storedExperience.templateId, storedExperience.templateVersion);
    expect(resolvedV1After).toBeDefined();
    expect(resolvedV1After?.version).toBe("v1");
    expect(resolvedV1After?.name).toBe("Immutable World (v1)");

    // Normalization contract must not be altered or polluted by v2
    const normalizedV1After = resolvedV1After?.normalizeConfig(storedExperience.publishedConfig);
    expect(normalizedV1After).toEqual(normalizedV1Before);
    expect(normalizedV1After?._versionMarker).toBe("normalized-v1");

    // ExperienceRenderer continues to resolve and render v1 component
    const renderedAfter = ExperienceRenderer({
      templateId: storedExperience.templateId,
      templateVersion: storedExperience.templateVersion,
      mode: "public",
      rawConfig: storedExperience.publishedConfig,
    });
    expect(React.isValidElement(renderedAfter)).toBe(true);
    if (React.isValidElement<{ config: { _versionMarker: string } }>(renderedAfter)) {
      expect(renderedAfter.props.config._versionMarker).toBe("normalized-v1");
    }

    // 4. A new experience created for v2 resolves v2 independently
    const resolvedV2 = getTemplate(TEST_TEMPLATE_ID, "v2");
    expect(resolvedV2).toBeDefined();
    expect(resolvedV2?.version).toBe("v2");
    expect(resolvedV2?.name).toBe("Immutable World (v2)");

    const renderedV2 = ExperienceRenderer({
      templateId: TEST_TEMPLATE_ID,
      templateVersion: "v2",
      mode: "public",
      rawConfig: { recipient: "Rohan", messageBody: "Stars aligned." },
    });
    expect(React.isValidElement(renderedV2)).toBe(true);
    if (React.isValidElement<{ config: { _versionMarker: string } }>(renderedV2)) {
      expect(renderedV2.props.config._versionMarker).toBe("normalized-v2");
    }
  });

  it("returns null on unsupported version and refuses to silently upgrade or fallback", () => {
    registerTemplate(mockV1);
    registerTemplate(mockV2);

    // Experience with unreleased or non-existent version v3
    const resolvedMissing = getTemplate(TEST_TEMPLATE_ID, "v3");
    expect(resolvedMissing).toBeNull();

    // Authoritative ExperienceRenderer displays not-found container rather than silent fallback
    const renderedMissing = ExperienceRenderer({
      templateId: TEST_TEMPLATE_ID,
      templateVersion: "v3",
      mode: "public",
      rawConfig: {},
    });
    expect(JSON.stringify(renderedMissing)).toContain("not found");
  });

  it("executes migrateConfig hook deterministically on explicit upgrade without mutating v1", () => {
    registerTemplate(mockV1);
    registerTemplate(mockV2);

    const oldV1Config = {
      partnerName: "Maya",
      letter: "Our quiet mornings are my favorite memories.",
    };

    const targetTemplateV2 = getTemplate(TEST_TEMPLATE_ID, "v2");
    expect(targetTemplateV2?.migrateConfig).toBeDefined();

    if (targetTemplateV2?.migrateConfig) {
      const migrated = targetTemplateV2.migrateConfig("v1", "v2", oldV1Config);
      expect(migrated).toEqual({
        recipient: "Maya",
        messageBody: "Our quiet mornings are my favorite memories.",
        starlightMood: true,
      });

      // Verify migrated config validates cleanly against v2 publish schema
      const parseResult = targetTemplateV2.publishSchema.safeParse(migrated);
      expect(parseResult.success).toBe(true);

      // Verify original v1 config is untouched
      expect(oldV1Config.partnerName).toBe("Maya");
    }
  });
});
