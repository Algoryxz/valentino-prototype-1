import { describe, it, expect } from "vitest";
import { TEMPLATE_SAMPLE_DATA, getTemplateSampleData } from "@/templates/sampleData";
import { listActiveTemplates, getTemplateDefinition } from "@/templates/registry";

describe("Template Sample Data", () => {
  const activeTemplates = listActiveTemplates();

  it("provides sample data for all active templates", () => {
    expect(activeTemplates.length).toBeGreaterThanOrEqual(6);

    for (const template of activeTemplates) {
      const sample = getTemplateSampleData(template.id, template.version);
      expect(sample).toBeDefined();
      expect(sample.partnerName).toBeTruthy();
      expect(sample.senderName).toBeTruthy();
      expect(sample.greeting).toBeTruthy();
      expect(sample.message).toBeTruthy();
      expect(sample.signOff).toBeTruthy();
    }
  });

  it("validates that all sample data conforms to draft and publish schemas", () => {
    for (const template of activeTemplates) {
      const sample = getTemplateSampleData(template.id, template.version);

      // Must validate with draft schema
      const draftResult = template.draftSchema.safeParse(sample);
      expect(
        draftResult.success,
        `Sample data for ${template.id} failed draftSchema validation: ${JSON.stringify(
          !draftResult.success ? draftResult.error.format() : null
        )}`
      ).toBe(true);

      // Must validate with publish schema
      const publishResult = template.publishSchema.safeParse(sample);
      expect(
        publishResult.success,
        `Sample data for ${template.id} failed publishSchema validation: ${JSON.stringify(
          !publishResult.success ? publishResult.error.format() : null
        )}`
      ).toBe(true);
    }
  });

  it("normalizes cleanly in both preview and public modes", () => {
    for (const template of activeTemplates) {
      const sample = getTemplateSampleData(template.id, template.version);

      const previewConfig = template.normalizeConfig(sample, false);
      expect(previewConfig).toBeDefined();
      expect(previewConfig.partnerName).toBe(sample.partnerName);

      const publicConfig = template.normalizeConfig(sample, true);
      expect(publicConfig).toBeDefined();
      expect(publicConfig.partnerName).toBe(sample.partnerName);
    }
  });

  it("falls back to default config if unknown template is requested", () => {
    const unknownSample = getTemplateSampleData("non-existent-world", "v1");
    expect(unknownSample).toBeDefined();
    expect(unknownSample.partnerName).toBe("Dearest");
  });
});
