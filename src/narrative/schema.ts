import { z } from "zod";
import { countGraphemes } from "@/lib/sanitize";

const graphemeMax = (max: number) =>
  z.string().refine((val) => countGraphemes(val) <= max, {
    message: `Must not exceed ${max} characters`,
  });

export const NARRATIVE_PACING_OPTIONS = ["calm", "balanced", "cinematic"] as const;
export type NarrativePacing = (typeof NARRATIVE_PACING_OPTIONS)[number];

// Chapter definition
export const storyChapterSchema = z.object({
  id: z.string().min(1),
  title: graphemeMax(100).default("Chapter"),
  subtitle: graphemeMax(200).optional(),
  moduleRefs: z.array(z.string()).default([]),
  order: z.number().int().default(0),
});

export type StoryChapter = z.infer<typeof storyChapterSchema>;

// Personal Welcome definition
export const personalWelcomeDraftSchema = z.object({
  enabled: z.boolean().default(false),
  greeting: graphemeMax(100).optional().default("Welcome, my love"),
  recipientName: graphemeMax(60).optional(),
  message: graphemeMax(500).optional().default("Take a quiet breath and step into our world."),
  mediaId: z.string().max(200).optional().nullable(),
});

export const personalWelcomePublishSchema = z.object({
  enabled: z.boolean().default(false),
  greeting: z.string().max(100).default("Welcome, my love"),
  recipientName: z.string().max(60).optional(),
  message: z.string().max(500).default("Take a quiet breath and step into our world."),
  mediaId: z.string().max(200).optional().nullable(),
});

export type PersonalWelcomeConfig = z.infer<typeof personalWelcomeDraftSchema>;

// Personal Closing definition
export const personalClosingDraftSchema = z.object({
  enabled: z.boolean().default(false),
  title: graphemeMax(100).optional().default("Always & Forever"),
  message: graphemeMax(1000).optional().default("Thank you for every laugh, every walk, and every memory."),
  signature: graphemeMax(100).optional().default("With all my heart"),
  date: graphemeMax(60).optional(),
  promise: graphemeMax(300).optional(),
});

export const personalClosingPublishSchema = z.object({
  enabled: z.boolean().default(false),
  title: z.string().max(100).default("Always & Forever"),
  message: z.string().max(1000).default("Thank you for every laugh, every walk, and every memory."),
  signature: z.string().max(100).default("With all my heart"),
  date: z.string().max(60).optional(),
  promise: z.string().max(300).optional(),
});

export type PersonalClosingConfig = z.infer<typeof personalClosingDraftSchema>;

// Emotional Recap definition
export const emotionalRecapDraftSchema = z.object({
  enabled: z.boolean().default(true),
  title: graphemeMax(100).optional().default("Our Story in Moments"),
  reflection: graphemeMax(500).optional().default("Every milestone, every reason, and every promise brought us to this moment."),
});

export const emotionalRecapPublishSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().max(100).default("Our Story in Moments"),
  reflection: z.string().max(500).default("Every milestone, every reason, and every promise brought us to this moment."),
});

export type EmotionalRecapConfig = z.infer<typeof emotionalRecapDraftSchema>;

// Narrative Draft Schema
export const narrativeDraftSchema = z.object({
  chapters: z.array(storyChapterSchema).optional(),
  pacing: z.enum(NARRATIVE_PACING_OPTIONS).optional().default("balanced"),
  welcome: personalWelcomeDraftSchema.optional(),
  closing: personalClosingDraftSchema.optional(),
  recap: emotionalRecapDraftSchema.optional(),
  customSectionTitles: z.record(z.string(), z.string()).optional().default({}),
});

// Narrative Publish Schema
export const narrativePublishSchema = z.object({
  chapters: z.array(storyChapterSchema).default([]),
  pacing: z.enum(NARRATIVE_PACING_OPTIONS).default("balanced"),
  welcome: personalWelcomePublishSchema.optional(),
  closing: personalClosingPublishSchema.optional(),
  recap: emotionalRecapPublishSchema.optional(),
  customSectionTitles: z.record(z.string(), z.string()).default({}),
});

export type NarrativeDraftConfig = z.infer<typeof narrativeDraftSchema>;
export type NarrativePublishedConfig = z.infer<typeof narrativePublishSchema>;

export const DEFAULT_STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "chapter-origins",
    title: "How We Started",
    subtitle: "The earliest whispers of our journey together",
    moduleRefs: ["memories", "timeline"],
    order: 0,
  },
  {
    id: "chapter-devotion",
    title: "What I Love About Us",
    subtitle: "The truths, the sweetness, and the memories I hold close",
    moduleRefs: ["reasons", "compliments", "fortuneCookie", "quiz", "scratchCard"],
    order: 1,
  },
  {
    id: "chapter-future",
    title: "Where We're Going",
    subtitle: "Our sacred vows, spontaneous adventures, and future letters",
    moduleRefs: ["promises", "futureAdventures", "adventureSpinner", "openWhen", "secret"],
    order: 2,
  },
  {
    id: "chapter-finale",
    title: "Our Forever",
    subtitle: "The breathtaking culmination of our love story",
    moduleRefs: ["finale"],
    order: 3,
  },
];

export function normalizeNarrativeConfig(
  raw: unknown,
  _isPublic: boolean = false,
  modulesConfig?: Record<string, any>
): NarrativePublishedConfig {
  if (!raw || typeof raw !== "object") {
    return {
      chapters: DEFAULT_STORY_CHAPTERS,
      pacing: "balanced",
      customSectionTitles: {},
      recap: {
        enabled: true,
        title: "Our Story in Moments",
        reflection: "Every milestone, every reason, and every promise brought us to this moment.",
      },
      welcome: {
        enabled: false,
        greeting: "Welcome, my love",
        message: "Take a quiet breath and step into our world.",
      },
      closing: {
        enabled: false,
        title: "Always & Forever",
        message: "Thank you for every laugh, every walk, and every memory.",
        signature: "With all my heart",
      },
    };
  }

  const obj = raw as Record<string, any>;
  const pacing: NarrativePacing = NARRATIVE_PACING_OPTIONS.includes(obj.pacing)
    ? obj.pacing
    : "balanced";

  // Normalize chapters
  let chapters: StoryChapter[] = [];
  if (Array.isArray(obj.chapters) && obj.chapters.length > 0) {
    const seenRefs = new Set<string>();
    chapters = obj.chapters
      .filter((c: any) => c && typeof c === "object")
      .map((c: any, idx: number) => {
        const rawRefs = Array.isArray(c.moduleRefs) ? c.moduleRefs : [];
        const uniqueRefs: string[] = [];
        for (const ref of rawRefs) {
          if (typeof ref === "string" && !seenRefs.has(ref)) {
            seenRefs.add(ref);
            uniqueRefs.push(ref);
          }
        }
        return {
          id: typeof c.id === "string" && c.id.trim() ? c.id.trim() : `chapter-${idx}`,
          title: typeof c.title === "string" && c.title.trim() ? c.title.trim() : `Chapter ${idx + 1}`,
          subtitle: typeof c.subtitle === "string" && c.subtitle.trim() ? c.subtitle.trim() : undefined,
          moduleRefs: uniqueRefs,
          order: typeof c.order === "number" ? c.order : idx,
        };
      })
      .sort((a, b) => a.order - b.order);
  } else {
    chapters = DEFAULT_STORY_CHAPTERS;
  }

  // Ensure any active modules that are not in any chapter get safely attached
  if (modulesConfig && typeof modulesConfig === "object") {
    const allAssigned = new Set<string>();
    for (const ch of chapters) {
      for (const ref of ch.moduleRefs) {
        allAssigned.add(ref);
      }
    }
    const unassigned: string[] = [];
    for (const [key, val] of Object.entries(modulesConfig)) {
      if (val && val.enabled && !allAssigned.has(key)) {
        unassigned.push(key);
      }
    }
    if (unassigned.length > 0) {
      // Append to the second-to-last or first chapter
      if (chapters.length > 1) {
        const targetChapter = chapters[chapters.length - 2];
        targetChapter.moduleRefs = [...targetChapter.moduleRefs, ...unassigned];
      } else if (chapters.length === 1) {
        chapters[0].moduleRefs = [...chapters[0].moduleRefs, ...unassigned];
      }
    }
  }

  // Normalize welcome
  let welcome: PersonalWelcomeConfig | undefined;
  if (obj.welcome && typeof obj.welcome === "object") {
    welcome = {
      enabled: Boolean(obj.welcome.enabled),
      greeting: typeof obj.welcome.greeting === "string" && obj.welcome.greeting.trim()
        ? obj.welcome.greeting.trim().slice(0, 100)
        : "Welcome, my love",
      recipientName: typeof obj.welcome.recipientName === "string" && obj.welcome.recipientName.trim()
        ? obj.welcome.recipientName.trim().slice(0, 60)
        : undefined,
      message: typeof obj.welcome.message === "string" && obj.welcome.message.trim()
        ? obj.welcome.message.trim().slice(0, 500)
        : "Take a quiet breath and step into our world.",
      mediaId: typeof obj.welcome.mediaId === "string" && obj.welcome.mediaId.trim()
        ? obj.welcome.mediaId.trim()
        : null,
    };
  }

  // Normalize closing
  let closing: PersonalClosingConfig | undefined;
  if (obj.closing && typeof obj.closing === "object") {
    closing = {
      enabled: Boolean(obj.closing.enabled),
      title: typeof obj.closing.title === "string" && obj.closing.title.trim()
        ? obj.closing.title.trim().slice(0, 100)
        : "Always & Forever",
      message: typeof obj.closing.message === "string" && obj.closing.message.trim()
        ? obj.closing.message.trim().slice(0, 1000)
        : "Thank you for every laugh, every walk, and every memory.",
      signature: typeof obj.closing.signature === "string" && obj.closing.signature.trim()
        ? obj.closing.signature.trim().slice(0, 100)
        : "With all my heart",
      date: typeof obj.closing.date === "string" && obj.closing.date.trim()
        ? obj.closing.date.trim().slice(0, 60)
        : undefined,
      promise: typeof obj.closing.promise === "string" && obj.closing.promise.trim()
        ? obj.closing.promise.trim().slice(0, 300)
        : undefined,
    };
  }

  // Normalize recap
  let recap: EmotionalRecapConfig | undefined;
  if (obj.recap && typeof obj.recap === "object") {
    recap = {
      enabled: Boolean(obj.recap.enabled ?? true),
      title: typeof obj.recap.title === "string" && obj.recap.title.trim()
        ? obj.recap.title.trim().slice(0, 100)
        : "Our Story in Moments",
      reflection: typeof obj.recap.reflection === "string" && obj.recap.reflection.trim()
        ? obj.recap.reflection.trim().slice(0, 500)
        : "Every milestone, every reason, and every promise brought us to this moment.",
    };
  } else {
    recap = {
      enabled: true,
      title: "Our Story in Moments",
      reflection: "Every milestone, every reason, and every promise brought us to this moment.",
    };
  }

  // Normalize customSectionTitles
  const customSectionTitles: Record<string, string> = {};
  if (obj.customSectionTitles && typeof obj.customSectionTitles === "object") {
    for (const [k, v] of Object.entries(obj.customSectionTitles)) {
      if (typeof v === "string" && v.trim()) {
        customSectionTitles[k] = v.trim().slice(0, 100);
      }
    }
  }

  return {
    chapters,
    pacing,
    welcome,
    closing,
    recap,
    customSectionTitles,
  };
}
