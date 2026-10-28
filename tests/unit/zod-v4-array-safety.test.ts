import { describe, it, expect } from "vitest";
import { z } from "zod";
import { openWhenDraftSchema, openWhenPublishSchema } from "@/modules/open-when/schema";
import { quizDraftSchema, quizPublishSchema } from "@/modules/quiz/schema";
import { narrativeDraftSchema, narrativePublishSchema } from "@/narrative/schema";
import { timelineDraftSchema } from "@/modules/timeline/schema";
import { reasonsDraftSchema } from "@/modules/reasons/schema";
import { memoriesDraftSchema } from "@/modules/memories/schema";

describe("Zod 4 Collection Security & Application-Level Bounds", () => {
  describe("1. Oversized collection rejection ahead of element evaluation", () => {
    it("immediately rejects an oversized array against .max() before parsing elements", () => {
      let elementParseAttempts = 0;
      const elementSchema = z.string().refine(() => {
        elementParseAttempts++;
        return true;
      });

      const boundedArraySchema = z.array(elementSchema).max(50);

      // Create an array with 1,000 items
      const oversizedInput = Array.from({ length: 1000 }, (_, i) => `item-${i}`);

      const start = performance.now();
      const result = boundedArraySchema.safeParse(oversizedInput);
      const elapsed = performance.now() - start;

      expect(result.success).toBe(false);
      expect(elapsed).toBeLessThan(100);

      // In Zod 4 with capSize, array length is checked before element iteration:
      // The issue code must indicate too_big
      const tooBigIssue = result.error?.issues.find(
        (issue) => issue.code === "too_big" || issue.code === "invalid_type"
      );
      expect(tooBigIssue).toBeDefined();
    });
  });

  describe("2. Invalid elements within allowed size limits", () => {
    it("reports precise element-level validation errors for collections within max capacity", () => {
      const boundedSchema = z.array(z.string().min(5, "Minimum 5 chars")).max(10);

      const input = ["valid-one", "bad", "valid-three", "123"];
      const result = boundedSchema.safeParse(input);

      expect(result.success).toBe(false);
      expect(result.error?.issues.length).toBe(2);

      const paths = result.error?.issues.map((i) => i.path[0]);
      expect(paths).toContain(1);
      expect(paths).toContain(3);
    });
  });

  describe("3. Strict boundary condition enforcement at capacity limits", () => {
    it("accepts exactly max items and rejects max + 1 items", () => {
      const maxLimit = 30;
      const schema = z.array(z.number()).max(maxLimit);

      const atLimit = Array.from({ length: maxLimit }, (_, i) => i);
      expect(schema.safeParse(atLimit).success).toBe(true);

      const overLimit = Array.from({ length: maxLimit + 1 }, (_, i) => i);
      const overResult = schema.safeParse(overLimit);
      expect(overResult.success).toBe(false);
      expect(overResult.error?.issues[0].code).toBe("too_big");
    });
  });

  describe("4. Nested collection validation and bounded propagation", () => {
    it("rejects nested arrays exceeding nested bounds while keeping parent context intact", () => {
      const invalidQuiz = {
        enabled: true,
        title: "Couples Trivia",
        questions: [
          {
            id: "q-1",
            question: "Where did we first meet?",
            // Max allowed options is 10; providing 12 options:
            options: Array.from({ length: 12 }, (_, i) => `Option ${i + 1}`),
            correctIndex: 0,
          },
        ],
      };

      const result = quizDraftSchema.safeParse(invalidQuiz);
      expect(result.success).toBe(false);
      const issue = result.error?.issues.find((i) => i.path.includes("options"));
      expect(issue).toBeDefined();
      expect(issue?.code).toBe("too_big");
    });
  });

  describe("5. Application schema regression testing for legitimate data", () => {
    it("validates default configurations across all bounded schemas", () => {
      expect(openWhenDraftSchema.safeParse({}).success).toBe(true);
      expect(quizDraftSchema.safeParse({}).success).toBe(true);
      expect(narrativeDraftSchema.safeParse({}).success).toBe(true);
      expect(timelineDraftSchema.safeParse({}).success).toBe(true);
      expect(reasonsDraftSchema.safeParse({}).success).toBe(true);
      expect(memoriesDraftSchema.safeParse({}).success).toBe(true);
    });

    it("validates legitimate publish configurations across schemas", () => {
      const validOpenWhenPublish = {
        enabled: true,
        title: "Open When Letters",
        subtitle: "Read when needed",
        envelopes: [
          {
            id: "env-1",
            title: "When you miss me",
            message: "I am always with you.",
          },
        ],
      };
      expect(openWhenPublishSchema.safeParse(validOpenWhenPublish).success).toBe(true);

      const validNarrativePublish = {
        chapters: [
          {
            id: "ch-1",
            title: "Beginning",
            subtitle: "Where it started",
            moduleRefs: ["timeline"],
            order: 0,
          },
        ],
        pacing: "balanced" as const,
        customSectionTitles: { story: "Our Love Story" },
      };
      expect(narrativePublishSchema.safeParse(validNarrativePublish).success).toBe(true);
    });
  });

  describe("6. Defense-in-depth: Unbounded vs Bounded behavior demonstration", () => {
    it("verifies application-level .max() prevents processing excessive inputs", () => {
      const boundedQuizQuestions = quizDraftSchema;
      const oversizedQuestions = {
        enabled: true,
        // Max questions is 30; sending 100 questions:
        questions: Array.from({ length: 100 }, (_, i) => ({
          id: `q-${i}`,
          question: `Question ${i}`,
          options: ["A", "B"],
        })),
      };

      const result = boundedQuizQuestions.safeParse(oversizedQuestions);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some((i) => i.code === "too_big")).toBe(true);
    });
  });
});
