import { z } from "zod";
import { graphemeMax } from "@/lib/security";

export const fortuneCookieDraftSchema = z.object({
  enabled: z.boolean().default(false),
  title: graphemeMax(100).optional().default("A Fortune For Us"),
  subtitle: graphemeMax(200).optional().default("Crack open the cookie to reveal what destiny has in store"),
  fortunes: z.array(graphemeMax(300)).max(50).default([]),
});

export const fortuneCookiePublishSchema = z.object({
  enabled: z.boolean(),
  title: graphemeMax(100).optional().default("A Fortune For Us"),
  subtitle: graphemeMax(200).optional(),
  fortunes: z.array(graphemeMax(300)).optional().default([]),
  items: z.array(graphemeMax(300)).max(50).optional(),
});

export type FortuneCookieDraftConfig = z.infer<typeof fortuneCookieDraftSchema>;
export type FortuneCookiePublishedConfig = z.infer<typeof fortuneCookiePublishSchema>;

export function normalizeFortuneCookieConfig(raw: unknown, _isPublic: boolean = false): FortuneCookiePublishedConfig {
  if (!raw || typeof raw !== "object") {
    return {
      enabled: false,
      title: "A Fortune For Us",
      subtitle: "Crack open the cookie to reveal what destiny has in store",
      fortunes: [],
    };
  }

  const obj = raw as Record<string, any>;
  const rawFortunes = Array.isArray(obj.fortunes) ? obj.fortunes : [];

  const fortunes: string[] = rawFortunes
    .filter((f: any) => typeof f === "string" && f.trim().length > 0)
    .map((f: string) => f.trim().slice(0, 300));

  return {
    enabled: Boolean(obj.enabled && fortunes.length > 0),
    title: typeof obj.title === "string" && obj.title.trim() ? obj.title.trim().slice(0, 100) : "A Fortune For Us",
    subtitle: typeof obj.subtitle === "string" && obj.subtitle.trim() ? obj.subtitle.trim().slice(0, 200) : "Crack open the cookie to reveal what destiny has in store",
    fortunes,
  };
}
