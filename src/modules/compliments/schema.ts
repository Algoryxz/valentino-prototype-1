import { z } from "zod";
import { graphemeMax } from "@/lib/security";

export const complimentsDraftSchema = z
  .object({
    enabled: z.boolean().default(false),
    title: graphemeMax(100).optional().default("Compliment Machine"),
    subtitle: graphemeMax(200).optional().default("Press the button whenever you need a reminder of how wonderful you are"),
    items: z.array(graphemeMax(300)).max(50).optional().default([]),
    pool: z.array(graphemeMax(300)).max(50).optional(),
    buttonLabel: graphemeMax(50).optional().default("Tell Me Something Sweet"),
  })
  .passthrough();

export const complimentsPublishSchema = z
  .object({
    enabled: z.boolean(),
    title: graphemeMax(100).optional().default("Compliment Machine"),
    subtitle: graphemeMax(200).optional(),
    items: z.array(graphemeMax(300)).optional().default([]),
    pool: z.array(graphemeMax(300)).optional(),
    buttonLabel: graphemeMax(50).optional().default("Tell Me Something Sweet"),
  })
  .passthrough();

export type ComplimentsDraftConfig = z.infer<typeof complimentsDraftSchema>;
export type ComplimentsPublishedConfig = z.infer<typeof complimentsPublishSchema>;

export function normalizeComplimentsConfig(raw: unknown, _isPublic: boolean = false): ComplimentsPublishedConfig {
  if (!raw || typeof raw !== "object") {
    return {
      enabled: false,
      title: "Compliment Machine",
      subtitle: "Press the button whenever you need a reminder of how wonderful you are",
      items: [],
      buttonLabel: "Tell Me Something Sweet",
    };
  }

  const obj = raw as Record<string, any>;
  const rawList = Array.isArray(obj.items) && obj.items.length > 0 ? obj.items : Array.isArray(obj.pool) ? obj.pool : [];

  const items: string[] = rawList
    .filter((s: any) => typeof s === "string" && s.trim().length > 0)
    .map((s: string) => s.trim().slice(0, 300));

  return {
    enabled: Boolean(obj.enabled && items.length > 0),
    title: typeof obj.title === "string" && obj.title.trim() ? obj.title.trim().slice(0, 100) : "Compliment Machine",
    subtitle: typeof obj.subtitle === "string" && obj.subtitle.trim() ? obj.subtitle.trim().slice(0, 200) : "Press the button whenever you need a reminder of how wonderful you are",
    items,
    buttonLabel: typeof obj.buttonLabel === "string" && obj.buttonLabel.trim() ? obj.buttonLabel.trim().slice(0, 50) : "Tell Me Something Sweet",
  };
}
