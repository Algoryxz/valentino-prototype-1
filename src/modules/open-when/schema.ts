import { z } from "zod";
import { countGraphemes } from "@/lib/sanitize";

const graphemeMax = (max: number) =>
  z.string().refine((val) => countGraphemes(val) <= max, {
    message: `Must not exceed ${max} characters`,
  });

export const OPEN_WHEN_CATEGORIES = [
  "miss-me",
  "stressed",
  "proud",
  "hard-day",
  "laugh",
  "reminder",
  "remember-us",
  "custom",
] as const;

export type OpenWhenCategory = (typeof OPEN_WHEN_CATEGORIES)[number];

export const openWhenEnvelopeDraftSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  title: graphemeMax(100).default(""),
  category: z.string().max(50).optional().default("miss-me"),
  context: graphemeMax(100).optional().default(""),
  message: graphemeMax(2000).default(""),
  mediaId: z.string().max(200).optional().nullable(),
});

export const openWhenDraftSchema = z.object({
  enabled: z.boolean().default(false),
  title: graphemeMax(100).default("Open When..."),
  subtitle: graphemeMax(200).default("Envelopes for the days ahead"),
  envelopes: z.array(openWhenEnvelopeDraftSchema).default([
    {
      id: "env-1",
      title: "Open when you miss me",
      category: "miss-me",
      context: "For quiet evenings",
      message: "Close your eyes and remember how tightly I hold you. Distance can't touch what we have.",
    },
    {
      id: "env-2",
      title: "Open when you're having a hard day",
      category: "hard-day",
      context: "When things feel heavy",
      message: "Take a deep breath. You are stronger than you know, and I believe in you with my whole heart.",
    },
    {
      id: "env-3",
      title: "Open when you can't sleep",
      category: "miss-me",
      context: "Late night comfort",
      message: "Think of my favorite laugh of yours, and let peace find you. Tomorrow is waiting for us.",
    },
  ]),
});

export type OpenWhenDraftConfig = z.infer<typeof openWhenDraftSchema>;
export type OpenWhenEnvelopeConfig = z.infer<typeof openWhenEnvelopeDraftSchema>;

export const openWhenEnvelopePublishSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Envelope title required").max(100),
  category: z.string().max(50).optional().default("miss-me"),
  context: z.string().max(100).optional(),
  message: z.string().min(1, "Message required").max(2000),
  mediaId: z.string().max(200).optional().nullable(),
});

export const openWhenPublishSchema = z.object({
  enabled: z.boolean().default(false),
  title: z.string().max(100).default("Open When..."),
  subtitle: z.string().max(200).default("Envelopes for the days ahead"),
  envelopes: z.array(openWhenEnvelopePublishSchema).default([]),
});

export type OpenWhenPublishedConfig = z.infer<typeof openWhenPublishSchema>;

export function normalizeOpenWhenConfig(raw: unknown): OpenWhenPublishedConfig {
  if (!raw || typeof raw !== "object") {
    return {
      enabled: false,
      title: "Open When...",
      subtitle: "Envelopes for the days ahead",
      envelopes: [],
    };
  }

  const obj = raw as Record<string, any>;
  const rawEnvelopes = Array.isArray(obj.envelopes) ? obj.envelopes : [];
  const normalizedEnvelopes: OpenWhenEnvelopeConfig[] = rawEnvelopes
    .filter((env: any) => env && typeof env === "object")
    .map((env: any, idx: number) => ({
      id: typeof env.id === "string" ? env.id : `env-${idx}`,
      title: typeof env.title === "string" ? env.title.trim() : "",
      category: typeof env.category === "string" ? env.category.trim() : "miss-me",
      context: typeof env.context === "string" ? env.context.trim() : undefined,
      message: typeof env.message === "string" ? env.message.trim() : "",
      mediaId: typeof env.mediaId === "string" ? env.mediaId.trim() : null,
    }))
    .filter((env) => env.title.length > 0 && env.message.length > 0);

  return {
    enabled: Boolean(obj.enabled && normalizedEnvelopes.length > 0),
    title: typeof obj.title === "string" && obj.title.trim() ? obj.title.trim() : "Open When...",
    subtitle: typeof obj.subtitle === "string" && obj.subtitle.trim() ? obj.subtitle.trim() : "Envelopes for the days ahead",
    envelopes: normalizedEnvelopes,
  };
}
