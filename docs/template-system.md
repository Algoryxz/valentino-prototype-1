# Valentino — Template System Architecture & Authoring Guide

The Valentino template system powers customizable digital love letters. It provides a data-driven, registry-based architecture where each romantic world is an isolated, versioned package adhering to a unified rendering contract.

---

## 1. Unified Rendering Contract

The central architectural rule of Valentino is that the creator's live editor preview and the recipient's public view consume the exact same template component through the exact same normalization pipeline:

```
[ Creator Studio Draft State ]  ──┐
                                  ├──> getTemplate(id, version) ──> template.normalizeConfig() ──> <ExperienceRenderer mode="..." />
[ DB Published Snapshot Config ] ─┘
```

- **Preview Mode (`mode="preview"`):** Renders interactive canvas inside the Creator Studio workbench.
- **Public Mode (`mode="public"`):** Renders the finished romantic experience for the recipient at `/v/[publicId]`.

Because both modes flow through `normalizeConfig()`, any layout that looks correct in the Studio is guaranteed to render identically for the recipient.

---

## 2. Template Registry Architecture

The registry lives in [`src/templates/registry.ts`](file:///c:/Users/akrit/OneDrive/Desktop/Valentino/valentino-prototype-1/src/templates/registry.ts) and maintains an in-memory dictionary of versioned template definitions keyed by `${templateId}@${version}`.

### Canonical Registry API

```typescript
// Look up a specific template by ID and version
export function getTemplate(id: string, version: string): TemplateDefinition | null;

// Backwards-compatible alias for getTemplate
export const getTemplateDefinition = getTemplate;

// Retrieve all active templates ready for creator use (filters out templates with active: false)
export function listActiveTemplates(): TemplateDefinition[];

// Retrieve all registered template definitions
export function getAllTemplates(): TemplateDefinition[];

// Registration utilities for test harnesses and dynamic world extensions (safely guarded)
export function registerTemplate(template: TemplateDefinition): void;
export function unregisterTemplate(id: string, version: string): void;
```

---

## 3. Template Definition Contract

Every template implements the `TemplateDefinition` interface defined in [`src/templates/types.ts`](file:///c:/Users/akrit/OneDrive/Desktop/Valentino/valentino-prototype-1/src/templates/types.ts):

```typescript
export interface TemplateDefinition<TDraft = any, TPublished = any> {
  // Identity & Versioning
  id: string;                                   // Unique kebab-case slug (e.g. 'midnight-rose')
  version: string;                              // Semver or epoch string (e.g. 'v1')
  name: string;                                 // Human-readable title (e.g. 'Midnight Rose')
  description: string;                          // Editorial summary
  tagline?: string;                             // Poetic tagline displayed in studio
  atmosphere?: string;                          // Sensory mood description
  signature?: string;                           // Characteristic physical motif

  // Lifecycle & Availability
  active?: boolean;                             // Defaults to true. If false, excluded from creator selection
  availability?: "available" | "experimental" | "coming-soon";
  category?: string;                            // Category grouping (e.g. 'Cinematic', 'Botanical')
  previewAsset?: string;                        // Thumbnail or preview asset reference
  supportedModules?: string[];                  // Allowed interactive keepsakes

  // Validation & Data Transformation
  draftSchema: z.ZodType<TDraft>;               // Lenient Zod schema for editor autosave
  publishSchema: z.ZodType<TPublished>;         // Strict Zod schema required for publishing
  defaultConfig: TDraft;                        // Default initial configuration
  normalizeConfig: (raw: unknown, isPublic?: boolean) => TPublished; // Pure normalization function

  // UI Component
  Component: React.ComponentType<TemplateRenderProps<TPublished>>;
  renderSsrHtml?: (config: TPublished, publicId?: string) => string; // Optional custom SSR string

  // Version Migration Hook
  migrateConfig?: (fromVersion: string, toVersion: string, rawConfig: unknown) => unknown;
}
```

---

## 4. Dual Validation Schemas

To balance fluid creator authoring with strict recipient guarantees, every template provides two Zod schemas:

1. **`draftSchema` (Lenient):**
   - Applied during editor typing and debounced autosave (`PUT /api/experiences/[publicId]/draft`).
   - All fields are optional or have defaults.
   - Enforces basic types and upper character bounds (e.g., recipient name ≤ 60 chars, devotion letter ≤ 2000 chars).
   - Allows creators to save partial, incomplete letters without friction.

2. **`publishSchema` (Strict):**
   - Applied atomically during publication (`POST /api/experiences/[publicId]/publish`).
   - Requires essential fields (recipient name, sender name, message body).
   - Validates that selected decorative tokens and color palettes belong to the approved domain.
   - Rejection blocks publication and returns descriptive validation errors to the creator.

---

## 5. Version Pinning and Immutability

### Immutability Rule
**Published template versions are immutable.** Once a template version (e.g., `midnight-rose@v1`) is shipped, its rendering output, styling tokens, and schema contracts must never be modified in a breaking manner.

### How Experiences Are Pinned
When an experience is created, the database record stores:
- `templateId` (e.g. `"midnight-rose"`)
- `templateVersion` (e.g. `"v1"`)

Both the editor preview and the public recipient route (`/v/[publicId]`) retrieve the template by passing the exact stored `(templateId, templateVersion)` pair to `getTemplate()`.

### Shipping `v2` of an Existing World
When creating a major visual overhaul or breaking schema change:
1. Create a new version directory: `src/templates/<id>/v2/`.
2. Implement `v2` schemas, normalizer, and component.
3. Register `<id>@v2` alongside `<id>@v1` in `src/templates/registry.ts`.
4. Implement `migrateConfig("v1", "v2", v1Config)` on the `v2` definition.
5. Existing experiences remain pinned to `v1` and render unchanged.
6. Silent upgrades are prohibited: experiences only migrate when an explicit creator action upgrades the draft.

---

## 6. How to Add a New Template: Step-by-Step

Follow this checklist to add a new romantic world (e.g., `stardust`):

### Step 1: Create the Template Directory Structure
```
src/templates/stardust/v1/
├── schema.ts         # Zod draftSchema and publishSchema + TypeScript types
├── normalize.ts      # Pure normalizeStardustConfig function
└── Component.tsx     # React component accepting TemplateRenderProps
```

### Step 2: Define Schemas (`schema.ts`)
```typescript
import { z } from "zod";

export const stardustDraftSchema = z.object({
  partnerName: z.string().max(60).default(""),
  senderName: z.string().max(60).default(""),
  message: z.string().max(2000).default(""),
  accentTheme: z.enum(["cosmic-violet", "starlight-gold"]).default("cosmic-violet"),
});

export const stardustPublishSchema = z.object({
  partnerName: z.string().min(1).max(60),
  senderName: z.string().min(1).max(60),
  message: z.string().min(1).max(2000),
  accentTheme: z.enum(["cosmic-violet", "starlight-gold"]),
});
```

### Step 3: Implement Pure Normalization (`normalize.ts`)
```typescript
import { StardustPublishedConfig, stardustDraftSchema } from "./schema";

export function normalizeStardustConfig(raw: unknown, isPublic = false): StardustPublishedConfig {
  const parsed = stardustDraftSchema.safeParse(raw);
  const data = parsed.success ? parsed.data : stardustDraftSchema.parse({});

  return {
    partnerName: data.partnerName.trim() || (isPublic ? "My Love" : ""),
    senderName: data.senderName.trim() || (isPublic ? "Yours" : ""),
    message: data.message.trim() || (isPublic ? "You are my entire cosmos." : ""),
    accentTheme: data.accentTheme,
  };
}
```

### Step 4: Implement Component (`Component.tsx`)
```typescript
import React from "react";
import { TemplateRenderProps } from "@/templates/types";
import { StardustPublishedConfig } from "./schema";

export const StardustComponent: React.FC<TemplateRenderProps<StardustPublishedConfig>> = ({
  config,
  mode,
}) => {
  return (
    <div className="min-h-screen bg-[#0A051B] text-purple-100 p-8 flex flex-col items-center">
      <h1 className="font-serif text-3xl">{config.partnerName}</h1>
      <p className="font-romantic mt-4 text-lg">{config.message}</p>
      <span className="font-mono text-xs mt-6 text-purple-400">— {config.senderName}</span>
    </div>
  );
};
```

### Step 5: Register in `src/templates/registry.ts`
Add the template definition and register it:
```typescript
export const stardustV1: TemplateDefinition<StardustDraftConfig, StardustPublishedConfig> = {
  id: "stardust",
  version: "v1",
  name: "Stardust",
  description: "A cosmic sanctuary of celestial dust and constellation reveals.",
  tagline: "For a love written in the stars",
  availability: "available",
  active: true,
  category: "Celestial",
  draftSchema: stardustDraftSchema,
  publishSchema: stardustPublishSchema,
  defaultConfig: { partnerName: "", senderName: "", message: "", accentTheme: "cosmic-violet" },
  normalizeConfig: normalizeStardustConfig,
  Component: StardustComponent,
};

templates.set(getKey(stardustV1.id, stardustV1.version), stardustV1);
```

### Step 6: Verify
1. Run `npm run typecheck` and `npm run lint`.
2. Add schema and normalization tests in `tests/unit/template.test.ts`.
3. Verify in browser that the new template appears in the Studio world picker and renders cleanly on both desktop and mobile viewports.
