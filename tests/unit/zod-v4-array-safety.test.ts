import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Zod 4 Array Parsing Safety (GHSA-mrhx-c7xc-m3w5 Verification)", () => {
  it("safely handles large malformed array inputs without crashing or hanging", () => {
    // Array of 5,000 invalid items (e.g. invalid string length or wrong types)
    const malformedArray = Array.from({ length: 5000 }, () => 12345);
    const schema = z.array(z.string());

    const startTime = performance.now();
    const result = schema.safeParse(malformedArray);
    const duration = performance.now() - startTime;

    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBeGreaterThan(0);
    // Parsing 5,000 items should complete in well under 250ms
    expect(duration).toBeLessThan(250);
  });

  it("preserves template and module schema validation with zod 4", () => {
    const memorySchema = z.object({
      id: z.string(),
      title: z.string().min(1),
      description: z.string().optional(),
    });

    const parsedValid = memorySchema.safeParse({ id: "m-1", title: "First Met" });
    expect(parsedValid.success).toBe(true);

    const parsedInvalid = memorySchema.safeParse({ id: "m-1", title: "" });
    expect(parsedInvalid.success).toBe(false);
  });
});
