import { z } from "zod";
import { graphemeMax } from "@/lib/security";

export const adventureItemDraftSchema = z
  .object({
    id: z.string().max(50).optional(),
    title: graphemeMax(150),
    status: z.enum(["completed", "planned", "someday"]).optional().default("planned"),
    notes: graphemeMax(300).optional().default(""),
    description: graphemeMax(300).optional(),
    category: graphemeMax(50).optional(),
  })
  .passthrough();

export const adventureItemPublishSchema = z
  .object({
    id: z.string().max(50).optional().default("adventure-item"),
    title: graphemeMax(150),
    status: z.enum(["completed", "planned", "someday"]).optional().default("planned"),
    notes: graphemeMax(300).optional().default(""),
    description: graphemeMax(300).optional(),
    category: graphemeMax(50).optional(),
  })
  .passthrough();

export const futureAdventuresDraftSchema = z
  .object({
    enabled: z.boolean().default(false),
    title: graphemeMax(100).optional().default("Future Adventures"),
    subtitle: graphemeMax(200).optional().default("Places we'll go, memories we've made, and dreams yet to unfold"),
    items: z.array(adventureItemDraftSchema).max(50).optional().default([]),
    adventures: z.array(adventureItemDraftSchema).max(50).optional(),
  })
  .passthrough();

export const futureAdventuresPublishSchema = z
  .object({
    enabled: z.boolean(),
    title: graphemeMax(100).optional().default("Future Adventures"),
    subtitle: graphemeMax(200).optional(),
    items: z.array(adventureItemPublishSchema).max(50).optional().default([]),
    adventures: z.array(adventureItemPublishSchema).max(50).optional(),
  })
  .passthrough();

export type AdventureItem = z.infer<typeof adventureItemPublishSchema>;
export type FutureAdventuresDraftConfig = z.infer<typeof futureAdventuresDraftSchema>;
export type FutureAdventuresPublishedConfig = z.infer<typeof futureAdventuresPublishSchema>;

export function normalizeFutureAdventuresConfig(raw: unknown, _isPublic: boolean = false): FutureAdventuresPublishedConfig {
  if (!raw || typeof raw !== "object") {
    return {
      enabled: false,
      title: "Future Adventures",
      subtitle: "Places we'll go, memories we've made, and dreams yet to unfold",
      items: [],
    };
  }

  const obj = raw as Record<string, any>;
  const rawItems = Array.isArray(obj.items) && obj.items.length > 0 ? obj.items : Array.isArray(obj.adventures) ? obj.adventures : [];

  const validStatuses = ["completed", "planned", "someday"] as const;

  const items: AdventureItem[] = rawItems
    .filter((a: any) => a && typeof a === "object" && typeof a.title === "string" && a.title.trim().length > 0)
    .map((a: any, idx: number) => ({
      id: typeof a.id === "string" && a.id.trim() ? a.id.trim() : `adv-${idx + 1}`,
      title: typeof a.title === "string" ? a.title.trim().slice(0, 150) : "",
      status: validStatuses.includes(a.status) ? a.status : "planned",
      notes: typeof a.notes === "string" && a.notes.trim() ? a.notes.trim().slice(0, 300) : typeof a.description === "string" ? a.description.trim().slice(0, 300) : "",
      description: typeof a.description === "string" ? a.description.trim().slice(0, 300) : undefined,
      category: typeof a.category === "string" ? a.category.trim().slice(0, 50) : undefined,
    }));

  return {
    enabled: Boolean(obj.enabled && items.length > 0),
    title: typeof obj.title === "string" && obj.title.trim() ? obj.title.trim().slice(0, 100) : "Future Adventures",
    subtitle: typeof obj.subtitle === "string" && obj.subtitle.trim() ? obj.subtitle.trim().slice(0, 200) : "Places we'll go, memories we've made, and dreams yet to unfold",
    items,
  };
}
