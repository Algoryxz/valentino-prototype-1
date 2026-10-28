import { z } from "zod";
import { countGraphemes } from "@/lib/sanitize";

const graphemeMax = (max: number) =>
  z.string().refine((val) => countGraphemes(val) <= max, {
    message: `Must not exceed ${max} characters`,
  });

export const TIMELINE_CATEGORIES = [
  "FIRSTS",
  "MEMORIES",
  "PLACES",
  "ADVENTURES",
  "SPECIAL DAYS",
  "FUTURE",
] as const;

export type TimelineCategory = (typeof TIMELINE_CATEGORIES)[number] | string;

export const timelineItemDraftSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  title: graphemeMax(100).default(""),
  date: graphemeMax(60).default(""),
  description: graphemeMax(1000).default(""),
  mediaId: z.string().max(200).optional().nullable(),
  location: graphemeMax(80).optional(),
  category: graphemeMax(50).optional().default("MEMORIES"),
  relatedMemoryId: z.string().max(100).optional().nullable(),
  nextStepMessage: graphemeMax(200).optional(),
  nextModuleRef: z.string().max(100).optional(),
  order: z.number().int().default(0),
  accent: z.string().max(50).optional(),
});

export const timelineDraftSchema = z.object({
  enabled: z.boolean().default(false),
  title: graphemeMax(100).default("Timeline of Us"),
  subtitle: graphemeMax(200).default("The milestones that shaped our story"),
  items: z.array(timelineItemDraftSchema).max(50).default([]),
});

export type TimelineDraftConfig = z.infer<typeof timelineDraftSchema>;
export type TimelineItemConfig = z.infer<typeof timelineItemDraftSchema>;

export const timelineItemPublishSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Milestone title required").max(100),
  date: z.string().max(60).optional().default(""),
  description: z.string().max(1000).optional().default(""),
  mediaId: z.string().max(200).optional().nullable(),
  location: z.string().max(80).optional(),
  category: z.string().max(50).optional().default("MEMORIES"),
  relatedMemoryId: z.string().max(100).optional().nullable(),
  nextStepMessage: z.string().max(200).optional(),
  nextModuleRef: z.string().max(100).optional(),
  order: z.number().int().default(0),
  accent: z.string().max(50).optional(),
});

export const timelinePublishSchema = z.object({
  enabled: z.boolean().default(false),
  title: z.string().max(100).default("Timeline of Us"),
  subtitle: z.string().max(200).default("The milestones that shaped our story"),
  items: z.array(timelineItemPublishSchema).max(50).default([]),
});

export type TimelinePublishedConfig = z.infer<typeof timelinePublishSchema>;

export function normalizeTimelineConfig(raw: unknown): TimelinePublishedConfig {
  if (!raw || typeof raw !== "object") {
    return {
      enabled: false,
      title: "Timeline of Us",
      subtitle: "The milestones that shaped our story",
      items: [],
    };
  }

  const obj = raw as Record<string, any>;
  const rawItems = Array.isArray(obj.items)
    ? obj.items
    : Array.isArray(obj.milestones)
    ? obj.milestones
    : [];

  const normalizedItems: TimelineItemConfig[] = rawItems
    .filter((item: any) => item && typeof item === "object")
    .map((item: any, idx: number) => ({
      id: typeof item.id === "string" ? item.id : `milestone-${idx}`,
      title: typeof item.title === "string" ? item.title.trim() : "",
      date: typeof item.date === "string" ? item.date.trim() : "",
      description: typeof item.description === "string" ? item.description.trim() : "",
      mediaId: typeof item.mediaId === "string" ? item.mediaId.trim() : null,
      location: typeof item.location === "string" && item.location.trim() ? item.location.trim() : undefined,
      category: typeof item.category === "string" && item.category.trim() ? item.category.trim() : "MEMORIES",
      relatedMemoryId: typeof item.relatedMemoryId === "string" && item.relatedMemoryId.trim() ? item.relatedMemoryId.trim() : null,
      nextStepMessage: typeof item.nextStepMessage === "string" && item.nextStepMessage.trim() ? item.nextStepMessage.trim() : undefined,
      nextModuleRef: typeof item.nextModuleRef === "string" && item.nextModuleRef.trim() ? item.nextModuleRef.trim() : undefined,
      order: typeof item.order === "number" ? item.order : idx,
      accent: typeof item.accent === "string" ? item.accent.trim() : undefined,
    }))
    .filter((item) => item.title.length > 0 || item.description.length > 0)
    .sort((a, b) => a.order - b.order);

  return {
    enabled: Boolean(obj.enabled && normalizedItems.length > 0),
    title: typeof obj.title === "string" && obj.title.trim() ? obj.title.trim() : "Timeline of Us",
    subtitle: typeof obj.subtitle === "string" && obj.subtitle.trim() ? obj.subtitle.trim() : "The milestones that shaped our story",
    items: normalizedItems,
  };
}
