import { TemplateDefinition } from "./types";
import {
  midnightRoseDraftSchema,
  midnightRosePublishSchema,
  MidnightRoseDraftConfig,
  MidnightRosePublishedConfig,
} from "./midnight-rose/v1/schema";
import { normalizeMidnightRoseConfig } from "./midnight-rose/v1/normalize";
import { MidnightRoseComponent } from "./midnight-rose/v1/Component";

import {
  cloudNineDraftSchema,
  cloudNinePublishSchema,
  CloudNineDraftConfig,
  CloudNinePublishedConfig,
} from "./cloud-nine/v1/schema";
import { normalizeCloudNineConfig } from "./cloud-nine/v1/normalize";
import { CloudNineComponent } from "./cloud-nine/v1/Component";
import { renderCloudNineSsrHtml } from "./cloud-nine/v1/ssr";

import { DEFAULT_VALENTINE_DECOR } from "@/types/decor";

export const midnightRoseV1: TemplateDefinition<
  MidnightRoseDraftConfig,
  MidnightRosePublishedConfig
> = {
  id: "midnight-rose",
  version: "v1",
  name: "Midnight Rose",
  description: "An intimate, starlight-themed love letter sealed with digital wax.",
  tagline: "For the love that feels like midnight",
  atmosphere: "Intimate, starlight-themed love letter sealed with digital wax.",
  signature: "Physical envelope + interactive wax seal reveal",
  availability: "available",
  active: true,
  category: "Cinematic",
  supportedModules: ["letter", "memories", "voiceNote", "videoMemory", "timeline", "quiz", "secret", "openWhen"],
  draftSchema: midnightRoseDraftSchema,
  publishSchema: midnightRosePublishSchema,
  defaultConfig: {
    partnerName: "",
    senderName: "",
    greeting: "To my favorite person",
    message: "",
    signOff: "With all my love",
    accentTheme: "crimson-rose",
    heroMediaId: null,
    decor: DEFAULT_VALENTINE_DECOR,
  },
  normalizeConfig: normalizeMidnightRoseConfig,
  Component: MidnightRoseComponent,
};

export const cloudNineV1: TemplateDefinition<
  CloudNineDraftConfig,
  CloudNinePublishedConfig
> = {
  id: "cloud-nine",
  version: "v1",
  name: "Cloud Nine",
  description: "A luminous, dreamy pastel sanctuary of soft clouds and celestial devotion.",
  tagline: "For the person who makes everything lighter",
  atmosphere: "Luminous pastel dreamscape of soft clouds and celestial devotion.",
  signature: "Celestial star blessing + pearl wax seal",
  availability: "available",
  active: true,
  category: "Dreamy",
  supportedModules: ["letter", "memories", "voiceNote", "videoMemory", "timeline", "quiz", "openWhen"],
  draftSchema: cloudNineDraftSchema,
  publishSchema: cloudNinePublishSchema,
  defaultConfig: {
    partnerName: "",
    senderName: "",
    greeting: "To my sweetest soul",
    message: "",
    signOff: "Forever in the clouds",
    accentTheme: "blush-sky",
    heroMediaId: null,
    decor: DEFAULT_VALENTINE_DECOR,
  },
  normalizeConfig: normalizeCloudNineConfig,
  Component: CloudNineComponent,
  renderSsrHtml: renderCloudNineSsrHtml,
};

import {
  kageDraftSchema,
  kagePublishSchema,
  KageDraftConfig,
  KagePublishedConfig,
} from "./kage/v1/schema";
import { normalizeKageConfig } from "./kage/v1/normalize";
import { KageComponent } from "./kage/v1/Component";
import { renderKageSsrHtml } from "./kage/v1/ssr";

export const kageV1: TemplateDefinition<
  KageDraftConfig,
  KagePublishedConfig
> = {
  id: "kage",
  version: "v1",
  name: "Kage",
  description: "A tranquil, atmospheric Kyoto mountain temple after dark, where shadows embrace starlight.",
  tagline: "A Kyoto sanctuary where shadows embrace starlight",
  atmosphere: "Tranquil Kyoto mountain temple after dark, mist & sacred stone lanterns.",
  signature: "Exact-source ThreeUI shaders + spatial temple path",
  availability: "available",
  active: true,
  category: "Immersive",
  supportedModules: ["letter", "memories", "voiceNote", "videoMemory", "secret"],
  draftSchema: kageDraftSchema,
  publishSchema: kagePublishSchema,
  defaultConfig: {
    partnerName: "",
    senderName: "",
    greeting: "Where stillness reveals the unseen",
    message: "",
    signOff: "With all my heart",
    accentTheme: "kyoto-crimson",
    heroMediaId: null,
    decor: DEFAULT_VALENTINE_DECOR,
  },
  normalizeConfig: normalizeKageConfig,
  Component: KageComponent,
  renderSsrHtml: renderKageSsrHtml,
};

import {
  apricotFilmDraftSchema,
  apricotFilmPublishSchema,
  ApricotFilmDraftConfig,
  ApricotFilmPublishedConfig,
} from "./apricot-film/v1/schema";
import { normalizeApricotFilmConfig } from "./apricot-film/v1/normalize";
import { ApricotFilmComponent } from "./apricot-film/v1/Component";

export const apricotFilmV1: TemplateDefinition<
  ApricotFilmDraftConfig,
  ApricotFilmPublishedConfig
> = {
  id: "apricot-film",
  version: "v1",
  name: "Apricot Film",
  description: "A warm, nostalgic 16mm golden memory reel bathed in golden afternoon sunlight.",
  tagline: "For the memories that feel like warm analog cinema",
  atmosphere: "16mm golden memory reel, sunbeams, tobacco amber, warm grain, and nostalgic warmth.",
  signature: "Analog film slide + golden hour light leak",
  availability: "available",
  active: true,
  category: "Analog",
  supportedModules: ["letter", "memories", "voiceNote", "videoMemory", "timeline", "quiz", "openWhen"],
  draftSchema: apricotFilmDraftSchema,
  publishSchema: apricotFilmPublishSchema,
  defaultConfig: {
    partnerName: "",
    senderName: "",
    greeting: "To my favorite memory",
    message: "",
    signOff: "Forever in golden hour",
    accentTheme: "apricot-amber",
    heroMediaId: null,
    decor: DEFAULT_VALENTINE_DECOR,
  },
  normalizeConfig: normalizeApricotFilmConfig,
  Component: ApricotFilmComponent,
};

import {
  wildflowerPaperDraftSchema,
  wildflowerPaperPublishSchema,
  WildflowerPaperDraftConfig,
  WildflowerPaperPublishedConfig,
} from "./wildflower-paper/v1/schema";
import { normalizeWildflowerPaperConfig } from "./wildflower-paper/v1/normalize";
import { WildflowerPaperComponent } from "./wildflower-paper/v1/Component";

export const wildflowerPaperV1: TemplateDefinition<
  WildflowerPaperDraftConfig,
  WildflowerPaperPublishedConfig
> = {
  id: "wildflower-paper",
  version: "v1",
  name: "Wildflower Paper",
  description: "An organic, deckled cotton paper sanctuary adorned with pressed meadow flora and honest words.",
  tagline: "For a love cultivated slowly with honesty and grace",
  atmosphere: "Deckled cotton fibers, pressed meadow botanicals, sage, and dried lilac.",
  signature: "Botanical twine unbind + pressed floral reveal",
  availability: "available",
  active: true,
  category: "Botanical",
  supportedModules: ["letter", "memories", "voiceNote", "videoMemory", "timeline", "secret", "openWhen"],
  draftSchema: wildflowerPaperDraftSchema,
  publishSchema: wildflowerPaperPublishSchema,
  defaultConfig: {
    partnerName: "",
    senderName: "",
    greeting: "To my gentlest blossom",
    message: "",
    signOff: "Grown in love",
    accentTheme: "sage-botanical",
    heroMediaId: null,
    decor: DEFAULT_VALENTINE_DECOR,
  },
  normalizeConfig: normalizeWildflowerPaperConfig,
  Component: WildflowerPaperComponent,
};

import {
  oceanLetterDraftSchema,
  oceanLetterPublishSchema,
  OceanLetterDraftConfig,
  OceanLetterPublishedConfig,
} from "./ocean-letter/v1/schema";
import { normalizeOceanLetterConfig } from "./ocean-letter/v1/normalize";
import { OceanLetterComponent } from "./ocean-letter/v1/Component";

export const oceanLetterV1: TemplateDefinition<
  OceanLetterDraftConfig,
  OceanLetterPublishedConfig
> = {
  id: "ocean-letter",
  version: "v1",
  name: "Ocean Letter",
  description: "A tranquil coastal world of frosted sea glass, tidal foam, and enduring oceanic devotion.",
  tagline: "For devotion as vast and steady as the tides",
  atmosphere: "Coastal twilight horizon, frosted sea glass, deep oceanic teal, and tidal foam.",
  signature: "Sea glass message in a bottle + tidal ripple",
  availability: "available",
  active: true,
  category: "Oceanic",
  supportedModules: ["letter", "memories", "voiceNote", "videoMemory", "timeline", "quiz", "secret", "openWhen"],
  draftSchema: oceanLetterDraftSchema,
  publishSchema: oceanLetterPublishSchema,
  defaultConfig: {
    partnerName: "",
    senderName: "",
    greeting: "To my steady anchor",
    message: "",
    signOff: "With every tide",
    accentTheme: "fog-blue",
    heroMediaId: null,
    decor: DEFAULT_VALENTINE_DECOR,
  },
  normalizeConfig: normalizeOceanLetterConfig,
  Component: OceanLetterComponent,
};

export interface RoadmapWorld {
  id: string;
  name: string;
  tagline: string;
  atmosphere: string;
  signature: string;
  availability: "coming-soon";
  category: string;
}

export const ROADMAP_WORLDS: RoadmapWorld[] = [
  {
    id: "golden-hour",
    name: "Golden Hour",
    tagline: "For the memories worth keeping",
    atmosphere: "Warm peach, coral & champagne sunbeams over film memories.",
    signature: "Film reel + sunset transition",
    availability: "coming-soon",
    category: "Vintage",
  },
  {
    id: "love-letter",
    name: "Love Letter",
    tagline: "For something timeless",
    atmosphere: "Parchment, burgundy ink, pressed botanical florals & postmark stamps.",
    signature: "Pressed florals + postmark stamp",
    availability: "coming-soon",
    category: "Vintage",
  },
  {
    id: "stardust",
    name: "Stardust",
    tagline: "For a love written in the stars",
    atmosphere: "Violet indigo cosmos & shimmering celestial dust.",
    signature: "Constellation reveal + cosmic finale",
    availability: "coming-soon",
    category: "Celestial",
  },
];

const templates = new Map<string, TemplateDefinition<any, any>>();

function getKey(id: string, version: string): string {
  return `${id}@${version}`;
}

templates.set(getKey(midnightRoseV1.id, midnightRoseV1.version), midnightRoseV1);
templates.set(getKey(cloudNineV1.id, cloudNineV1.version), cloudNineV1);
templates.set(getKey(kageV1.id, kageV1.version), kageV1);
templates.set(getKey(apricotFilmV1.id, apricotFilmV1.version), apricotFilmV1);
templates.set(getKey(wildflowerPaperV1.id, wildflowerPaperV1.version), wildflowerPaperV1);
templates.set(getKey(oceanLetterV1.id, oceanLetterV1.version), oceanLetterV1);

export function getTemplate(
  id: string,
  version: string
): TemplateDefinition<any, any> | null {
  return templates.get(getKey(id, version)) || null;
}

export const getTemplateDefinition = getTemplate;

export function listActiveTemplates(): TemplateDefinition<any, any>[] {
  return Array.from(templates.values()).filter((t) => t.active !== false);
}

export function getAllTemplates(): TemplateDefinition<any, any>[] {
  return Array.from(templates.values());
}

export function registerTemplate(template: TemplateDefinition<any, any>): void {
  if (!template?.id || !template?.version) {
    throw new Error("Template must provide valid non-empty id and version");
  }
  templates.set(getKey(template.id, template.version), template);
}

export function unregisterTemplate(id: string, version: string): void {
  if (id && version) {
    templates.delete(getKey(id, version));
  }
}

