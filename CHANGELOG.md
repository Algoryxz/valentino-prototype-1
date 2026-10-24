# Changelog

All notable changes to this project are recorded here. Format: Keep a Changelog. Versioning: none yet (prototype).

## [M4 - Gallery and Landing] - 2026-10-23
### Added
- **Template Discovery & Category Filtering**: Implemented accessible category filtering (`All`, `Cinematic`, `Dreamy`, `Immersive`, `Analog`, `Botanical`, `Oceanic`) in `/templates` wired to `listActiveTemplates()`.
- **Live Preview System**: Embedded shared `<ExperienceRenderer mode="preview">` inside the live sanctuary preview modal, driven by realistic schema-valid sample data for all 6 active templates (`midnight-rose`, `cloud-nine`, `kage`, `apricot-film`, `wildflower-paper`, `ocean-letter`).
- **Sample Preview Labeling**: Clear notification banner (`✦ Sample Preview — Fictional Data ✦`) distinguishing preview data from the recipient experience.
- **Direct Template Selection Route**: Implemented `/create/[templateId]` with server-side validation against `getTemplateDefinition()`, HttpOnly edit cookie provisioning, and seamless redirect to `/edit/[publicId]`.
- **Friendly Fallback UI**: Graceful error card (`data-testid="template-not-found-card"`) with "Browse Available Atmospheres" CTA when invalid or inactive templates are requested.
- **Test Coverage**: Added comprehensive Playwright E2E suite (`tests/e2e/m4-gallery-selection.spec.ts`) and unit test suite (`tests/unit/template-sample-data.test.ts`), verifying category filtering, live preview, direct creation, and fallback behavior.

## [M1 - Walking Skeleton] - 2026-09-19
### Added
- **Walking Skeleton End-to-End**: Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma ORM, SQLite/Postgres.
- **Anonymous Per-Experience Auth**: 256-bit cryptographically secure edit credentials hashed with HMAC-SHA-256 + secret pepper. Stored in per-experience HttpOnly, SameSite cookie with sliding 90-day expiry and 180-day absolute expiration cutoff.
- **CSRF & Origin Security**: Origin validation against `APP_URL` and `application/json` Content-Type enforcement.
- **Optimistic Concurrency**: `draftRevision` increments on write; 409 conflict returned on stale baseRevision; publish requires explicit `expectedRevision`.
- **Snapshot Isolation**: Public recipient page `/v/[publicId]` serves strictly from `publishedConfig` and completely ignores edit cookies.
- **HTTP 404 & 410 Routing**: Real HTTP 404 for unknown or unpublished experiences; real HTTP 410 for disabled or deleted experiences.
- **Midnight Rose v1 Template**: Dark romantic aesthetic with animated wax seal unsealing, responsive across 360px to 1920px viewports, and instant unseal for `prefers-reduced-motion`.
- **Acceptance Gates A-D**: Vitest integration/unit tests (19 tests) and Playwright E2E suites (8 tests) passing across mobile and desktop.
- **CI Workflow**: GitHub Actions pipeline executing lint, typecheck, unit tests, production build, and Playwright E2E.
