import React from "react";
import { z } from "zod";

export type RenderMode = "preview" | "public";

export type AccentTheme = "crimson-rose" | "midnight-violet" | "champagne-gold";

export interface TemplateRenderProps<T = unknown> {
  config: T;
  mode: RenderMode;
  publicId?: string;
}


export type TemplateAvailability = "available" | "experimental" | "coming-soon";

export interface TemplateDefinition<TDraft = any, TPublished = any> {
  id: string;
  version: string;
  name: string;
  description: string;
  tagline?: string;
  atmosphere?: string;
  signature?: string;
  availability?: TemplateAvailability;
  category?: string;
  supportedModules?: string[];
  draftSchema: z.ZodType<TDraft, any>;
  publishSchema: z.ZodType<TPublished, any>;
  defaultConfig: TDraft;
  normalizeConfig: (raw: unknown, isPublic?: boolean) => TPublished;
  Component: React.ComponentType<TemplateRenderProps<TPublished>>;

  /**
   * Flag indicating if the template is active and selectable by creators in the studio/gallery.
   * Defaults to true if omitted or undefined.
   * If explicitly false, the template remains resolvable via getTemplate for existing experiences
   * but is excluded from listActiveTemplates().
   */
  active?: boolean;
  previewAsset?: string;
  migrateConfig?: (fromVersion: string, toVersion: string, rawConfig: unknown) => unknown;

  renderSsrHtml?: (config: TPublished, publicId?: string, nonce?: string) => string;
}
