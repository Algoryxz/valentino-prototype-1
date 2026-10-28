import { z } from "zod";
import { countGraphemes } from "@/lib/sanitize";
import { valentineDecorSchema } from "@/templates/midnight-rose/v1/schema";
import { modulesDraftSchema, modulesPublishSchema, ModulesConfig } from "@/modules/registry";
import {
  narrativeDraftSchema,
  narrativePublishSchema,
  NarrativeDraftConfig,
  NarrativePublishedConfig,
} from "@/narrative/schema";

const graphemeMax = (max: number) =>
  z.string().refine((val) => countGraphemes(val) <= max, {
    message: `Must not exceed ${max} characters`,
  });

const graphemeMinMax = (min: number, max: number, fieldName: string) =>
  z
    .string()
    .refine((val) => countGraphemes(val.trim()) >= min, {
      message: `${fieldName} is required`,
    })
    .refine((val) => countGraphemes(val) <= max, {
      message: `${fieldName} must not exceed ${max} characters`,
    });

export const APRICOT_THEMES = ["apricot-amber", "terracotta-sun", "tobacco-espresso"] as const;
export type ApricotTheme = (typeof APRICOT_THEMES)[number];

export const apricotFilmDraftSchema = z.object({
  partnerName: graphemeMax(60).optional().default(""),
  senderName: graphemeMax(60).optional().default(""),
  greeting: graphemeMax(100).optional().default("To my favorite memory"),
  message: graphemeMax(2000).optional().default(""),
  signOff: graphemeMax(100).optional().default("Forever in golden hour"),
  accentTheme: z.string().max(50).optional().default("apricot-amber"),
  heroMediaId: z.string().max(200).optional().nullable(),
  soundtrackUrl: z.string().max(500).optional().nullable(),
  decor: valentineDecorSchema,
  modules: modulesDraftSchema,
  moduleOrder: z.array(z.string()).max(20).optional(),
  narrative: narrativeDraftSchema.optional(),
});

export type ApricotFilmDraftConfig = z.infer<typeof apricotFilmDraftSchema>;

export const apricotFilmPublishSchema = z.object({
  partnerName: graphemeMinMax(1, 60, "Partner name"),
  senderName: graphemeMinMax(1, 60, "Your name"),
  greeting: graphemeMax(100).optional().default("To my favorite memory"),
  message: graphemeMinMax(1, 2000, "Letter / message"),
  signOff: graphemeMax(100).optional().default("Forever in golden hour"),
  accentTheme: z.string().max(50).optional().default("apricot-amber"),
  heroMediaId: z.string().max(200).optional().nullable(),
  soundtrackUrl: z.string().max(500).optional().nullable(),
  decor: valentineDecorSchema,
  modules: modulesPublishSchema,
  moduleOrder: z.array(z.string()).max(20).optional(),
  narrative: narrativePublishSchema.optional(),
});

export type ApricotFilmPublishedConfig = z.infer<typeof apricotFilmPublishSchema> & {
  modules?: ModulesConfig;
  narrative?: NarrativePublishedConfig;
};
