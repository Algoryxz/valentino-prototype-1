/**
 * Valentino Milestone 4: Sample Preview Data System
 *
 * Provides schema-valid, romantic, fictional sample configurations
 * for all active templates so users can preview the authentic experience
 * before creating their own.
 */

import { DEFAULT_VALENTINE_DECOR } from "@/types/decor";
import { getTemplateDefinition } from "./registry";

export interface TemplateSampleConfig {
  partnerName: string;
  senderName: string;
  greeting: string;
  message: string;
  signOff: string;
  accentTheme: string;
  heroMediaId: null;
  decor: typeof DEFAULT_VALENTINE_DECOR;
  modules?: Record<string, unknown>;
  [key: string]: unknown;
}

export const TEMPLATE_SAMPLE_DATA: Record<string, TemplateSampleConfig> = {
  "midnight-rose": {
    partnerName: "Maya",
    senderName: "Julian",
    greeting: "To the quiet star in my midnight sky",
    message:
      "In a world of constant motion, you are my still point. Every late-night conversation, every shared laugh across quiet rooms, and every silence we haven't needed to fill has brought me closer to you. You are my home after dark, my constant warmth, and the poetry in everything I do.\n\nThank you for choosing me every single day. Here's to every midnight still ahead of us.",
    signOff: "Yours through every constellation",
    accentTheme: "crimson-rose",
    heroMediaId: null,
    decor: {
      ...DEFAULT_VALENTINE_DECOR,
      paper: "cream",
      waxSeal: "crimson-heart",
      ribbon: "satin-rose",
    },
    modules: {
      memories: {
        enabled: true,
        title: "Midnight Memories",
        subtitle: "Moments we whispered into the dark",
        items: [],
      },
    },
  },

  "cloud-nine": {
    partnerName: "Sora",
    senderName: "Kenji",
    greeting: "To my sweetest soul in the clouds",
    message:
      "Before you, everything felt grounded in the everyday. But since you walked into my life, every morning feels like golden sunlight breaking through morning mist. You make laughter effortless, burdens weightless, and dreams feel like things we are already living.\n\nMay this year bring us even higher, gentle and luminous together.",
    signOff: "Forever weightless with you",
    accentTheme: "blush-sky",
    heroMediaId: null,
    decor: {
      ...DEFAULT_VALENTINE_DECOR,
      paper: "petal-blush",
      waxSeal: "rose-gold",
      ribbon: "organza-peach",
    },
    modules: {
      memories: {
        enabled: true,
        title: "Luminous Days",
        subtitle: "Lightness captured along the way",
        items: [],
      },
    },
  },

  kage: {
    partnerName: "Aoi",
    senderName: "Ren",
    greeting: "Where stillness reveals the unseen",
    message:
      "In the quiet shade beneath the ancient cedars, amidst the mist and the soft glow of stone lanterns, I found what words could never capture. With you, love is not loud or hurried; it is steady, profound, and etched into the quiet moments between heartbeats.\n\nMay our path always remain serene and true.",
    signOff: "With every quiet breath",
    accentTheme: "sanctuary-emerald",
    heroMediaId: null,
    decor: {
      ...DEFAULT_VALENTINE_DECOR,
      paper: "cream",
      waxSeal: "crimson-heart",
    },
    modules: {
      memories: {
        enabled: true,
        title: "Echoes of Stillness",
        subtitle: "Footsteps along the temple path",
        items: [],
      },
    },
  },

  "apricot-film": {
    partnerName: "Clara",
    senderName: "Leo",
    greeting: "To my favorite golden afternoon",
    message:
      "Every memory with you feels like an overexposed 16mm frame bathed in golden hour sunbeams. The sound of our favorite record turning, warm tea on the wooden table, the light leaking through amber blinds. I wouldn't trade a single frame of our story for the world.\n\nKeep dancing through the light with me.",
    signOff: "Forever in golden hour",
    accentTheme: "apricot-amber",
    heroMediaId: null,
    decor: {
      ...DEFAULT_VALENTINE_DECOR,
      paper: "cream",
      waxSeal: "crimson-heart",
    },
    modules: {
      memories: {
        enabled: true,
        title: "16mm Reel",
        subtitle: "Stills from our favorite seasons",
        items: [],
      },
    },
  },

  "wildflower-paper": {
    partnerName: "Hannah",
    senderName: "Oliver",
    greeting: "To my gentlest blossom",
    message:
      "We grew this love slowly, like wildflowers pushing through rich spring meadow soil — patient, honest, and unadorned. You teach me kindness in every sentence and grace in every quiet gesture. Here on deckled paper, with pressed sage and meadow dew, I promise to cherish you in every season.",
    signOff: "Grown with all my love",
    accentTheme: "sage-botanical",
    heroMediaId: null,
    decor: {
      ...DEFAULT_VALENTINE_DECOR,
      paper: "cream",
      waxSeal: "crimson-heart",
    },
    modules: {
      memories: {
        enabled: true,
        title: "Pressed Flora & Keepsakes",
        subtitle: "Treasured petals collected together",
        items: [],
      },
    },
  },

  "ocean-letter": {
    partnerName: "Elena",
    senderName: "Marcus",
    greeting: "To my steady anchor",
    message:
      "Devotion like ours isn't a fleeting summer wave; it is the rhythm of the deep tide that never fails to return to shore. Across miles, across long days, your voice brings me back to calm waters. This message in sea glass is a reminder that no matter how far the sea stretches, my heart rests with you.",
    signOff: "With every returning tide",
    accentTheme: "fog-blue",
    heroMediaId: null,
    decor: {
      ...DEFAULT_VALENTINE_DECOR,
      paper: "cream",
      waxSeal: "crimson-heart",
    },
    modules: {
      memories: {
        enabled: true,
        title: "Tidal Notes",
        subtitle: "Letters cast upon the sea",
        items: [],
      },
    },
  },
};

/**
 * Returns schema-valid sample data for live previewing a template.
 * If no custom sample exists for the requested template ID, falls back
 * to the template's default configuration.
 */
export function getTemplateSampleData(
  templateId: string,
  version: string = "v1"
): Record<string, unknown> {
  if (TEMPLATE_SAMPLE_DATA[templateId]) {
    return { ...TEMPLATE_SAMPLE_DATA[templateId] };
  }

  const def = getTemplateDefinition(templateId, version);
  if (def?.defaultConfig) {
    return { ...def.defaultConfig };
  }

  return {
    partnerName: "Dearest",
    senderName: "Yours Always",
    greeting: "To my favorite person",
    message: "A preview of the memories we hold dear.",
    signOff: "With all my love",
    accentTheme: "crimson-rose",
    heroMediaId: null,
    decor: DEFAULT_VALENTINE_DECOR,
  };
}
