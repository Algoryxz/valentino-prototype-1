import { z } from "zod";
import { countGraphemes } from "@/lib/sanitize";

const graphemeMax = (max: number) =>
  z.string().refine((val) => countGraphemes(val) <= max, {
    message: `Must not exceed ${max} characters`,
  });

export const quizQuestionDraftSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  question: graphemeMax(200).default(""),
  options: z.array(graphemeMax(100)).max(10).default(["", ""]),
  correctIndex: z.number().int().min(0).max(10).default(0),
  explanation: graphemeMax(300).optional().default(""),
});

export const quizDraftSchema = z.object({
  enabled: z.boolean().default(false),
  title: graphemeMax(100).default("How Well Do You Know Us?"),
  subtitle: graphemeMax(200).default("A sweet little test of our story"),
  completionMessage: graphemeMax(500).default("No matter what, my favorite place is with you. ❤️"),
  questions: z.array(quizQuestionDraftSchema).max(30).default([]),
});

export type QuizDraftConfig = z.infer<typeof quizDraftSchema>;
export type QuizQuestionConfig = z.infer<typeof quizQuestionDraftSchema>;

export const quizQuestionPublishSchema = z.object({
  id: z.string(),
  question: z.string().min(1, "Question required").max(200),
  options: z.array(z.string().min(1, "Option required").max(100)).min(2, "At least two options required").max(10),
  correctIndex: z.number().int().min(0),
  explanation: z.string().max(300).optional(),
});

export const quizPublishSchema = z.object({
  enabled: z.boolean().default(false),
  title: z.string().max(100).default("How Well Do You Know Us?"),
  subtitle: z.string().max(200).default("A sweet little test of our story"),
  completionMessage: z.string().max(500).default("No matter what, my favorite place is with you. ❤️"),
  questions: z.array(quizQuestionPublishSchema).max(30).default([]),
});

export type QuizPublishedConfig = z.infer<typeof quizPublishSchema>;

export function normalizeQuizConfig(raw: unknown): QuizPublishedConfig {
  if (!raw || typeof raw !== "object") {
    return {
      enabled: false,
      title: "How Well Do You Know Us?",
      subtitle: "A sweet little test of our story",
      completionMessage: "No matter what, my favorite place is with you. ❤️",
      questions: [],
    };
  }

  const obj = raw as Record<string, any>;
  const rawQuestions = Array.isArray(obj.questions) ? obj.questions : [];
  const normalizedQuestions: QuizQuestionConfig[] = rawQuestions
    .filter((q: any) => q && typeof q === "object")
    .map((q: any, idx: number) => {
      const options = Array.isArray(q.options)
        ? q.options.map((opt: any) => (typeof opt === "string" ? opt.trim() : "")).filter((opt: string) => opt.length > 0)
        : [];
      const correctIndex = typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < options.length ? q.correctIndex : 0;
      return {
        id: typeof q.id === "string" ? q.id : `q-${idx}`,
        question: typeof q.question === "string" ? q.question.trim() : "",
        options,
        correctIndex,
        explanation: typeof q.explanation === "string" && q.explanation.trim() ? q.explanation.trim() : undefined,
      };
    })
    .filter((q) => q.question.length > 0 && q.options.length >= 2);

  return {
    enabled: Boolean(obj.enabled && normalizedQuestions.length > 0),
    title: typeof obj.title === "string" && obj.title.trim() ? obj.title.trim() : "How Well Do You Know Us?",
    subtitle: typeof obj.subtitle === "string" && obj.subtitle.trim() ? obj.subtitle.trim() : "A sweet little test of our story",
    completionMessage: typeof obj.completionMessage === "string" && obj.completionMessage.trim() ? obj.completionMessage.trim() : "No matter what, my favorite place is with you. ❤️",
    questions: normalizedQuestions,
  };
}
