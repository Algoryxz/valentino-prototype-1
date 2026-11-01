import { z } from "zod";
import { graphemeMax } from "@/lib/security";

export const reasonItemDraftSchema = z.object({
  id: z.string().max(50),
  title: graphemeMax(100).optional().default(""),
  text: graphemeMax(500),
  mediaUrl: z.string().max(500).optional().nullable(),
});

export const reasonItemPublishSchema = z.union([
  z.object({
    id: z.string().max(50).optional().default("reason-item"),
    title: graphemeMax(100).optional().default(""),
    text: graphemeMax(500),
    mediaUrl: z.string().max(500).optional().nullable(),
  }),
  graphemeMax(500).transform((text) => ({
    id: `reason-${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    text,
    mediaUrl: null,
  })),
]);

export const reasonsDraftSchema = z
  .object({
    enabled: z.boolean().default(false),
    title: graphemeMax(100).optional().default("Reasons I Love You"),
    subtitle: graphemeMax(200).optional().default("Countless little things that make you irreplaceable"),
    viewMode: z.enum(["step", "all"]).optional().default("step"),
    items: z.array(reasonItemDraftSchema).max(100).default([]),
  })
  .passthrough();

export const reasonsPublishSchema = z
  .object({
    enabled: z.boolean(),
    title: graphemeMax(100).optional().default("Reasons I Love You"),
    subtitle: graphemeMax(200).optional(),
    viewMode: z.enum(["step", "all"]).optional().default("step"),
    items: z.array(reasonItemPublishSchema).max(100).optional().default([]),
  })
  .passthrough();

export type ReasonItem = z.infer<typeof reasonItemPublishSchema>;
export type ReasonsDraftConfig = z.infer<typeof reasonsDraftSchema>;
export type ReasonsPublishedConfig = z.infer<typeof reasonsPublishSchema>;

export function normalizeReasonsConfig(raw: unknown, _isPublic: boolean = false): ReasonsPublishedConfig {
  if (!raw || typeof raw !== "object") {
    return {
      enabled: false,
      title: "Reasons I Love You",
      subtitle: "Countless little things that make you irreplaceable",
      viewMode: "step",
      items: [],
    };
  }

  const obj = raw as Record<string, any>;
  const rawItems = Array.isArray(obj.items) ? obj.items : [];

  const items: ReasonItem[] = rawItems
    .filter((item: any) => item && typeof item === "object" && typeof item.text === "string" && item.text.trim().length > 0)
    .map((item: any, idx: number) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `reason-${idx + 1}`,
      title: typeof item.title === "string" ? item.title.trim().slice(0, 100) : "",
      text: typeof item.text === "string" ? item.text.trim().slice(0, 500) : "",
      mediaUrl: typeof item.mediaUrl === "string" && item.mediaUrl.trim() ? item.mediaUrl.trim() : null,
    }));

  return {
    enabled: Boolean(obj.enabled && items.length > 0),
    title: typeof obj.title === "string" && obj.title.trim() ? obj.title.trim().slice(0, 100) : "Reasons I Love You",
    subtitle: typeof obj.subtitle === "string" && obj.subtitle.trim() ? obj.subtitle.trim().slice(0, 200) : "Countless little things that make you irreplaceable",
    viewMode: obj.viewMode === "all" ? "all" : "step",
    items,
  };
}
