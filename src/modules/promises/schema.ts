import { z } from "zod";
import { graphemeMax } from "@/lib/security";

export const promiseItemDraftSchema = z.object({
  id: z.string().max(50),
  text: graphemeMax(300),
  category: graphemeMax(50).optional().default("vow"),
});

export const promiseItemPublishSchema = z.union([
  z.object({
    id: z.string().max(50).optional().default("vow-item"),
    text: graphemeMax(300),
    category: graphemeMax(50).optional().default("vow"),
  }),
  graphemeMax(300).transform((text) => ({
    id: `promise-${Math.random().toString(36).slice(2, 7)}`,
    text,
    category: "vow",
  })),
]);

export const promisesDraftSchema = z
  .object({
    enabled: z.boolean().default(false),
    title: graphemeMax(100).optional().default("Our Promise Wall"),
    subtitle: graphemeMax(200).optional().default("Words etched into our shared future"),
    items: z.array(promiseItemDraftSchema).max(50).optional().default([]),
    promises: z.array(promiseItemDraftSchema).max(50).optional(),
  })
  .passthrough();

export const promisesPublishSchema = z
  .object({
    enabled: z.boolean(),
    title: graphemeMax(100).optional().default("Our Promise Wall"),
    subtitle: graphemeMax(200).optional(),
    items: z.array(promiseItemPublishSchema).max(50).optional().default([]),
    promises: z.array(promiseItemPublishSchema).max(50).optional(),
  })
  .passthrough();

export type PromiseItem = z.infer<typeof promiseItemPublishSchema>;
export type PromisesDraftConfig = z.infer<typeof promisesDraftSchema>;
export type PromisesPublishedConfig = z.infer<typeof promisesPublishSchema>;

export function normalizePromisesConfig(raw: unknown, _isPublic: boolean = false): PromisesPublishedConfig {
  if (!raw || typeof raw !== "object") {
    return {
      enabled: false,
      title: "Our Promise Wall",
      subtitle: "Words etched into our shared future",
      items: [],
    };
  }

  const obj = raw as Record<string, any>;
  const rawItems = Array.isArray(obj.items) && obj.items.length > 0 ? obj.items : Array.isArray(obj.promises) ? obj.promises : [];

  const items: PromiseItem[] = rawItems
    .filter((p: any) => p && typeof p === "object" && typeof p.text === "string" && p.text.trim().length > 0)
    .map((p: any, idx: number) => ({
      id: typeof p.id === "string" && p.id.trim() ? p.id.trim() : `promise-${idx + 1}`,
      text: typeof p.text === "string" ? p.text.trim().slice(0, 300) : "",
      category: typeof p.category === "string" && p.category.trim() ? p.category.trim().slice(0, 50) : "vow",
    }));

  return {
    enabled: Boolean(obj.enabled && items.length > 0),
    title: typeof obj.title === "string" && obj.title.trim() ? obj.title.trim().slice(0, 100) : "Our Promise Wall",
    subtitle: typeof obj.subtitle === "string" && obj.subtitle.trim() ? obj.subtitle.trim().slice(0, 200) : "Words etched into our shared future",
    items,
  };
}
