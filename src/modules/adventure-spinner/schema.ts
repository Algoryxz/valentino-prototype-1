import { z } from "zod";
import { graphemeMax } from "@/lib/security";

export const spinnableItemDraftSchema = z.union([
  z.object({
    id: z.string().max(50).optional(),
    label: graphemeMax(100),
  }),
  graphemeMax(100),
]);

export const spinnableItemPublishSchema = z.union([
  z.object({
    id: z.string().max(50).optional().default("spin-item"),
    label: graphemeMax(100),
  }),
  graphemeMax(100).transform((label) => ({
    id: `spin-${Math.random().toString(36).slice(2, 7)}`,
    label,
  })),
]);

export const adventureSpinnerDraftSchema = z
  .object({
    enabled: z.boolean().default(false),
    title: graphemeMax(100).optional().default("The Adventure Wheel"),
    subtitle: graphemeMax(200).optional().default("Can't decide on date night? Let destiny take the wheel"),
    options: z.array(spinnableItemDraftSchema).max(30).default([]),
  })
  .passthrough();

export const adventureSpinnerPublishSchema = z
  .object({
    enabled: z.boolean(),
    title: graphemeMax(100).optional().default("The Adventure Wheel"),
    subtitle: graphemeMax(200).optional(),
    options: z.array(spinnableItemPublishSchema).min(2).max(30),
  })
  .passthrough();

export type SpinnableItem = z.infer<typeof spinnableItemPublishSchema>;
export type AdventureSpinnerDraftConfig = z.infer<typeof adventureSpinnerDraftSchema>;
export type AdventureSpinnerPublishedConfig = z.infer<typeof adventureSpinnerPublishSchema>;

export function normalizeAdventureSpinnerConfig(raw: unknown, _isPublic: boolean = false): AdventureSpinnerPublishedConfig {
  if (!raw || typeof raw !== "object") {
    return {
      enabled: false,
      title: "The Adventure Wheel",
      subtitle: "Can't decide on date night? Let destiny take the wheel",
      options: [],
    };
  }

  const obj = raw as Record<string, any>;
  const rawOptions = Array.isArray(obj.options) ? obj.options : [];

  const options: SpinnableItem[] = rawOptions
    .map((o: any, idx: number) => {
      if (typeof o === "string" && o.trim().length > 0) {
        return {
          id: `spin-${idx + 1}`,
          label: o.trim().slice(0, 100),
        };
      }
      if (o && typeof o === "object" && typeof o.label === "string" && o.label.trim().length > 0) {
        return {
          id: typeof o.id === "string" && o.id.trim() ? o.id.trim() : `spin-${idx + 1}`,
          label: o.label.trim().slice(0, 100),
        };
      }
      return null;
    })
    .filter((o): o is SpinnableItem => o !== null);

  return {
    enabled: Boolean(obj.enabled && options.length >= 2),
    title: typeof obj.title === "string" && obj.title.trim() ? obj.title.trim().slice(0, 100) : "The Adventure Wheel",
    subtitle: typeof obj.subtitle === "string" && obj.subtitle.trim() ? obj.subtitle.trim().slice(0, 200) : "Can't decide on date night? Let destiny take the wheel",
    options,
  };
}
