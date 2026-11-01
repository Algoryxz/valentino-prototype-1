import React from "react";
import { z } from "zod";

export type RenderMode = "preview" | "public";

export type ModuleId =
  | "timeline"
  | "quiz"
  | "secret"
  | "openWhen"
  | (string & {});

export interface ModuleRenderProps<T = unknown> {
  config: T;
  mode: RenderMode;
  publicId?: string;
  theme?: string;
  className?: string;
}

export interface ModuleEditorProps<T = unknown> {
  config: T;
  onChange: (updated: T) => void;
  publicId?: string;
}

export interface ModuleDefinition<TDraft = any, TPublished = any> {
  id: string;
  version: string;
  name: string;
  description: string;
  icon: string;
  draftSchema: z.ZodType<TDraft, any>;
  publishSchema: z.ZodType<TPublished, any>;
  defaultConfig: TDraft;
  normalizeConfig: (raw: unknown, isPublic?: boolean) => TPublished;
  Component: React.ComponentType<ModuleRenderProps<TPublished>>;
  EditorComponent?: React.ComponentType<ModuleEditorProps<TDraft>>;
}

export type ModuleState = "disabled" | "enabled" | "configured";
