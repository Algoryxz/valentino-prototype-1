# Changelog

All notable changes to this project are recorded here. Format: Keep a Changelog. Versioning: none yet (prototype).

## [M6 - Hardening & Release Preparation] - 2026-10-24
### Security & Infrastructure Hardening
- **Stored XSS Remediation**: Implemented central HTML entity escaping utilities (`escapeHtml`, `escapeHtmlAttr`, `safeJsonForScript`, `sanitizeUrl`) in `src/lib/sanitize.ts`. Hardened all SSR rendering routes (`/v/[publicId]`, `Cloud Nine`, `Kage`, modules) against script breakouts, SVG vectors, and event handler injection while preserving multilingual Unicode, Hindi, punctuation, and emoji.
- **Dynamic Nonce Content Security Policy (CSP)**: Generated cryptographic 128-bit random nonces in middleware, applied `script-src 'self' 'nonce-...' 'strict-dynamic'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' blob: data: https://res.cloudinary.com`, `media-src 'self' blob: data: https://res.cloudinary.com`, `object-src 'none'`, `frame-ancestors 'none'`, and `X-Frame-Options: DENY`.
- **Abuse Reporting Workflow**: Added `ExperienceReport` Prisma model and forward-only additive migration `20261024225500_add_experience_report`. Built `POST /api/experiences/[publicId]/report` with Zod validation, canonical Origin verification, 5/hr rate limits, and privacy-preserving pepper-keyed reporter IP hashing. Integrated accessible report dialog into recipient view.
- **Creator Management & Media Cleanup**: Added `PATCH /api/experiences/[publicId]/status` (disable/re-enable public link) and `DELETE /api/experiences/[publicId]`. Built reliable physical media cleanup ensuring all associated assets in Cloudinary/local storage are erased before database records are deleted, with 0 orphaned files.
- **Studio Danger Zone UI**: Added accessible "Manage Experience & Access" section to the Studio editor with disable/re-enable triggers, permanent delete modal dialog with confirmation, and safe return to `/templates`.
- **Infrastructure Resilience**: Added calm 500 error boundary on `/v/[publicId]` when the database is unreachable without leaking internal diagnostics; added database readiness check to `/api/health`.
- **Unified Rate Limiting**: Migrated reactions and replies routes onto the central `rateLimiter` abstraction with standardized 429 responses and `Retry-After` headers.
- **Next.js Security Upgrade**: Upgraded Next.js from `15.2.8` to patched release `15.5.28` (and PostCSS to `8.5.31`), dropping audit vulnerabilities from 43 to 0 critical.
- **Architecture Decisions & Runbooks**: Settled D1 (retaining "Valentino" codename), recorded ADR-0008 (Vercel + Managed PostgreSQL + Cloudinary), settled D6 (proprietary licensing in ADR-0009), and updated `docs/deployment.md` with complete pre-migration backup and post-deployment smoke-test runbooks.

## [M5 - Quality and Polish] - 2026-10-24
### Added & Improved
- **Decision D4 Social Sharing & Open Graph Metadata**: Created official high-resolution social share card (`public/og-share-card.png`, 1200x630) and implemented shared metadata utility (`src/lib/metadata.ts`). Enforced Decision D4 strict invariant: link previews on `/v/[publicId]` strictly present generic metadata (`og:title="A Valentine Experience"`), preventing chat crawlers (iMessage, WhatsApp, Telegram, Signal) from caching or leaking private partner names.
- **Accessibility & Modal Focus Trapping**: Implemented keyboard focus trapping and Escape focus restoration for the sanctuary preview modal in `/templates`. Added ARIA dialog attributes (`role="dialog"`, `aria-modal="true"`, `aria-label`) and high-contrast visible focus rings (`focus-visible:ring-rose-400`).
- **Mobile Touch Ergonomics**: Standardized interactive touch targets across studio editor chips, theme options, and world triggers to meet the 44px minimum touch recommendation (`min-h-[44px]`), and verified 0 horizontal scroll overflow on mobile viewports (360x640).
- **Motion Ergonomics (`prefers-reduced-motion`)**: Verified `prefers-reduced-motion: reduce` suppresses CSS transitions/animations globally, disables pulse halos, and immediately unseals letters for recipients with motion sensitivities.
- **Editorial Error Handling**: Verified 404 (`Lost in Starlight`) and error boundaries present calm, non-technical copy with zero stack trace or internal detail leakage.
- **Test Coverage**: Added unit test suite `tests/unit/metadata.test.ts` (123/123 passing) and Playwright E2E suite `tests/e2e/m5-polish.spec.ts`.

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
