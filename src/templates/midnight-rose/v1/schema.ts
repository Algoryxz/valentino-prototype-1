import { z } from "zod";
import { countGraphemes } from "@/lib/sanitize";

export const ACCENT_THEMES = ["crimson-rose", "midnight-violet", "champagne-gold"] as const;
export type AccentTheme = (typeof ACCENT_THEMES)[number];

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

// Lenient schema for draft saves (everything optional, length caps enforced)
export const midnightRoseDraftSchema = z.object({
  partnerName: graphemeMax(60).optional().default(""),
  senderName: graphemeMax(60).optional().default(""),
  greeting: graphemeMax(100).optional().default(""),
  message: graphemeMax(2000).optional().default(""),
  signOff: graphemeMax(100).optional().default(""),
  accentTheme: z.enum(ACCENT_THEMES).optional().default("crimson-rose"),
  heroMediaId: z.string().max(200).optional().nullable(),
  soundtrackUrl: z.string().max(500).optional().nullable(),
  scheduledUnlockAt: z.string().max(100).optional().nullable(),
  decor: valentineDecorSchema,
  modules: modulesDraftSchema,
  moduleOrder: z.array(z.string()).max(20).optional(),
  narrative: narrativeDraftSchema.optional(),
});

export type MidnightRoseDraftConfig = z.infer<typeof midnightRoseDraftSchema>;

// Strict schema for publishing
export const midnightRosePublishSchema = z.object({
  partnerName: graphemeMinMax(1, 60, "Partner name"),
  senderName: graphemeMinMax(1, 60, "Your name"),
  greeting: graphemeMax(100).optional().default("To my favorite person"),
  message: graphemeMinMax(1, 2000, "Letter / message"),
  signOff: graphemeMax(100).optional().default("With all my love"),
  accentTheme: z.enum(ACCENT_THEMES).default("crimson-rose"),
  heroMediaId: z.string().max(200).optional().nullable(),
  soundtrackUrl: z.string().max(500).optional().nullable(),
  scheduledUnlockAt: z.string().max(100).optional().nullable(),
  decor: valentineDecorSchema,
  modules: modulesPublishSchema,
  moduleOrder: z.array(z.string()).max(20).optional(),
  narrative: narrativePublishSchema.optional(),
});

export type MidnightRosePublishedConfig = z.infer<typeof midnightRosePublishSchema> & {
  modules?: ModulesConfig;
  narrative?: NarrativePublishedConfig;
};

