import { z } from "zod";
import { countGraphemes } from "@/lib/sanitize";

export const CLOUD_NINE_THEMES = ["blush-sky", "peach-sorbet", "lavender-mist"] as const;
export type CloudNineTheme = (typeof CLOUD_NINE_THEMES)[number];

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

export const valentineDecorSchema = z
  .object({
    blooms: z.array(z.string().max(50)).max(20).default(["rose", "tulip"]),
    flowers: z.array(z.string().max(50)).max(20).optional(),
    charms: z.array(z.string().max(50)).max(20).default(["sparkles", "hearts"]),
    paper: z.string().max(50).default("cream"),
    ribbon: z.string().max(50).default("crimson"),
    waxSeal: z.string().max(50).default("crimson"),
    seal: z.string().max(50).optional(),
  })
  .optional();

export type ValentineDecorConfig = z.infer<typeof valentineDecorSchema>;

import { modulesDraftSchema, modulesPublishSchema, ModulesConfig } from "@/modules/registry";
import {
  narrativeDraftSchema,
  narrativePublishSchema,
  NarrativeDraftConfig,
  NarrativePublishedConfig,
} from "@/narrative/schema";

// Lenient schema for draft saves
export const cloudNineDraftSchema = z.object({
  partnerName: graphemeMax(60).optional().default(""),
  senderName: graphemeMax(60).optional().default(""),
  greeting: graphemeMax(100).optional().default(""),
  message: graphemeMax(2000).optional().default(""),
  signOff: graphemeMax(100).optional().default(""),
  accentTheme: z.string().max(50).optional().default("blush-sky"),
  heroMediaId: z.string().max(200).optional().nullable(),
  soundtrackUrl: z.string().max(500).optional().nullable(),
  decor: valentineDecorSchema,
  modules: modulesDraftSchema,
  moduleOrder: z.array(z.string()).max(20).optional(),
  narrative: narrativeDraftSchema.optional(),
});

export type CloudNineDraftConfig = z.infer<typeof cloudNineDraftSchema>;

// Strict schema for publishing
export const cloudNinePublishSchema = z.object({
  partnerName: graphemeMinMax(1, 60, "Partner name"),
  senderName: graphemeMinMax(1, 60, "Your name"),
  greeting: graphemeMax(100).optional().default("To my sweetest soul"),
  message: graphemeMinMax(1, 2000, "Letter / message"),
  signOff: graphemeMax(100).optional().default("Forever in the clouds"),
  accentTheme: z
    .string()
    .max(50)
    .optional()
    .transform((val) => {
      if (val && CLOUD_NINE_THEMES.includes(val as CloudNineTheme)) return val as CloudNineTheme;
      return "blush-sky" as CloudNineTheme;
    })
    .default("blush-sky"),
  heroMediaId: z.string().max(200).optional().nullable(),
  soundtrackUrl: z.string().max(500).optional().nullable(),
  decor: valentineDecorSchema,
  modules: modulesPublishSchema,
  moduleOrder: z.array(z.string()).max(20).optional(),
  narrative: narrativePublishSchema.optional(),
});

export type CloudNinePublishedConfig = z.infer<typeof cloudNinePublishSchema> & {
  modules?: ModulesConfig;
  narrative?: NarrativePublishedConfig;
};

