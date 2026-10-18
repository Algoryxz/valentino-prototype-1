import { describe, it, expect, afterEach } from "vitest";
import {
  getTemplate,
  getTemplateDefinition,
  listActiveTemplates,
  getAllTemplates,
  registerTemplate,
  unregisterTemplate,
  midnightRoseV1,
  cloudNineV1,
} from "@/templates/registry";
import { TemplateDefinition } from "@/templates/types";
import { z } from "zod";

describe("Milestone 2 — Template Registry Behavior & API", () => {
  const TEST_INACTIVE_ID = "test-inactive-world";

  afterEach(() => {
    unregisterTemplate(TEST_INACTIVE_ID, "v1");
  });

  it("exports getTemplate and resolves registered templates by id and version", () => {
    const template = getTemplate("midnight-rose", "v1");
    expect(template).toBeDefined();
    expect(template?.id).toBe("midnight-rose");
    expect(template?.version).toBe("v1");
    expect(template?.name).toBe("Midnight Rose");
    expect(template?.active).toBe(true);
  });

  it("maintains getTemplateDefinition as an exact alias of getTemplate for backward compatibility", () => {
    expect(getTemplateDefinition).toBe(getTemplate);
    const def1 = getTemplateDefinition("cloud-nine", "v1");
    const def2 = getTemplate("cloud-nine", "v1");
    expect(def1).toBe(def2);
    expect(def1?.id).toBe("cloud-nine");
  });

  it("returns null for non-existent template IDs", () => {
    const template = getTemplate("non-existent-world-xyz", "v1");
    expect(template).toBeNull();
  });

  it("returns null for non-existent template versions", () => {
    const template = getTemplate("midnight-rose", "v999");
    expect(template).toBeNull();
  });

  it("listActiveTemplates returns only active templates and excludes inactive templates", () => {
    const activeTemplates = listActiveTemplates();
    expect(activeTemplates.length).toBeGreaterThanOrEqual(2);

    // Verify all returned templates have active !== false
    for (const t of activeTemplates) {
      expect(t.active).toBe(true);
    }

    // Register a temporary inactive template to verify filtering
    const inactiveTemplate: TemplateDefinition = {
      id: TEST_INACTIVE_ID,
      version: "v1",
      name: "Inactive Test World",
      description: "Should not appear in active list",
      active: false,
      availability: "available",
      draftSchema: z.object({}),
      publishSchema: z.object({}),
      defaultConfig: {},
      normalizeConfig: () => ({}),
      Component: () => null,
    };

    registerTemplate(inactiveTemplate);

    // Should be retrievable by direct id/version lookup
    expect(getTemplate(TEST_INACTIVE_ID, "v1")).toBeDefined();

    // Must be excluded from listActiveTemplates
    const filteredActive = listActiveTemplates();
    expect(filteredActive.some((t) => t.id === TEST_INACTIVE_ID)).toBe(false);

    // But included in getAllTemplates
    const all = getAllTemplates();
    expect(all.some((t) => t.id === TEST_INACTIVE_ID)).toBe(true);
  });

  it("defaults active to true when active property is omitted or undefined", () => {
    const TEST_DEFAULT_ACTIVE_ID = "test-default-active-world";
    const omittedActiveTemplate: TemplateDefinition = {
      id: TEST_DEFAULT_ACTIVE_ID,
      version: "v1",
      name: "Default Active Test World",
      description: "Tests default active behavior when property is omitted",
      // active omitted
      draftSchema: z.object({}),
      publishSchema: z.object({}),
      defaultConfig: {},
      normalizeConfig: () => ({}),
      Component: () => null,
    };

    registerTemplate(omittedActiveTemplate);
    try {
      const active = listActiveTemplates();
      expect(active.some((t) => t.id === TEST_DEFAULT_ACTIVE_ID)).toBe(true);
    } finally {
      unregisterTemplate(TEST_DEFAULT_ACTIVE_ID, "v1");
    }
  });

  it("safely rejects registration of malformed template definitions missing id or version", () => {
    expect(() => registerTemplate({} as any)).toThrow(
      "Template must provide valid non-empty id and version"
    );
    expect(() => registerTemplate({ id: "valid-id" } as any)).toThrow(
      "Template must provide valid non-empty id and version"
    );
  });

  it("guarantees both M1 flagship (Midnight Rose) and M2 secondary (Cloud Nine) are active", () => {
    const active = listActiveTemplates();
    const hasMidnight = active.some((t) => t.id === "midnight-rose" && t.version === "v1");
    const hasCloudNine = active.some((t) => t.id === "cloud-nine" && t.version === "v1");

    expect(hasMidnight).toBe(true);
    expect(hasCloudNine).toBe(true);
  });
});
