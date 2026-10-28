# Decisions

## Settled

### ADR-0001 — Stack
- **Decision**: TypeScript, Next.js (App Router), Tailwind CSS, PostgreSQL + Prisma, Zod, pnpm, Vitest, Playwright. Modular monolith.
- **Context**: Greenfield prototype, solo owner, needs SSR/ISR for fast public pages and one language across client and server.
- **Options**: Vite SPA + separate API; Remix; Next.js full-stack.
- **Reason**: One codebase, server components keep the public page light, mature tooling.
- **Tradeoffs**: Framework coupling; some Next.js conventions to learn. Revisit only with owner approval.

### ADR-0002 — Vertical slice first
- **Decision**: Milestones M0–M6 build one working end-to-end slice (M1) before extracting the template system, adding media, and building the gallery.
- **Reason**: Routing, persistence, and the shared-renderer contract get proven early instead of after many horizontal phases.
- **Mapping to the original 11 phases**: M0 = Phase 0; M1 = thin 1+4+5+7; M2 = Phase 2; M3 = Phase 6; M4 = Phase 3 + landing; M5 = Phase 8; M6 = Phases 9+10.

### ADR-0003 — Antigravity configuration layout
- **Decision**: Short always-on `AGENTS.md` + `.agents/rules/` for standing rules; milestone procedures as Skills in `.agents/skills/`; reviewers as subagents in `.agents/agents/`.
- **Reason**: Rules files are capped at 12,000 characters each. Antigravity's Workflows are deprecated and scheduled to retire on 2026-11-01 in favor of Skills, which also load on demand instead of bloating every prompt.
### ADR-0004 — Anonymous Cookie-Based Edit Sessions
- **Decision**: No user accounts in M1. The creator authenticates via an HttpOnly, SameSite, Secure (in production, `__Host-` prefixed) cookie named per-experience (`__Host-edit-token-[publicId]` in prod, `edit-token-[publicId]` in local dev). The server verifies that the credential matches the keyed HMAC-SHA-256 hash (`editCredentialHash`) for the requested experience.
- **Session Lifetime**: 90-day sliding inactivity lifetime, strictly capped at 180 days absolute from `editCredentialIssuedAt` (enforced server-side). Browser cookie expiry ≠ server-side credential validity.
- **Recovery**: M1 does not implement recovery links or magic links; an editor reminder banner informs the creator that edit access is saved in this browser. Architecture remains recovery-ready with `editCredentialHash` and `editCredentialVersion`.
- **Reason**: Lowest friction for prototype creators while maintaining strict security without credential leaks.

### ADR-0005 — Separate Draft/Published State with Optimistic Revisions
- **Decision**: `draftConfig` and `publishedConfig` are isolated. The public route `/v/[publicId]` renders `publishedConfig` only and ignores edit cookies entirely.
- **Concurrency**: Draft saves require `baseRevision` and increment `draftRevision` (409 Conflict on mismatch). Publish requires `expectedRevision`, validates against a strict schema, and creates the published snapshot inside a single atomic database transaction.
- **Reason**: Prevents unfinished edits from reaching recipients, protects against lost updates across tabs/concurrent saves, and ensures published state is deterministic.

### ADR-0006 — Public Route Caching Strategy (M1 no-store)
- **Decision**: In M1, `/v/*`, `/edit/*`, and `/api/*` send `Cache-Control: no-store`. No public caching, ISR, revalidation, or CDN caching is introduced in M1.
- **Reason**: Eliminates the risk of serving stale recipient content following a republish, disable, or deletion. Public caching and CDN revalidation will be evaluated during M5 and decided in M6 after a thorough privacy and invalidation review. LCP measurements in M1 are informational evidence only.

### ADR-0007 — Media Storage Provider (Decision D3)
- **Decision**:
  - **Production Media Storage**: Cloudinary is the decided production media-storage provider.
  - **Development and Test Storage**: A local-disk storage adapter is approved for local development and automated testing environments.
  - **Application Hosting**: Deferred. Selecting Cloudinary for media storage does not select, assume, or couple to an application hosting provider.
  - **Database Hosting**: Deferred. No database hosting provider is selected; remains undecided.
  - **Implementation Authorization**: M3 implementation is not yet authorized. This record formalizes the architectural provider selection only.
- **Context**: Milestone 3 builds the media pipeline allowing creators to upload photos to their romantic experiences. The pipeline requires a storage abstraction (`put`, `getUrl`, `delete`) that decouples application business logic from physical storage providers.
- **Consequences & Architecture Constraints**:
  - **Decoupled Storage Abstraction**: Application business logic and template renderers interact strictly with an abstract storage interface (`put`, `getUrl`, `delete`); neither templates nor routes couple directly to Cloudinary-specific APIs.
  - **Dual Adapter Strategy**: A local-disk adapter supports offline local development, CI pipelines, and unit/integration tests without external network dependencies or credentials. A Cloudinary adapter serves production delivery.
  - **Database Binary Isolation**: Raw image binary files are never stored in the database. PostgreSQL stores only metadata in `MediaAsset` records (random `storageKey`, MIME type, byte size, width, height, `altText`, and status).
  - **Uncompromised Server-Side Validation**: Selecting Cloudinary does not eliminate or reduce application-side security obligations. The application server remains authoritative: validating magic bytes (JPEG, PNG, WebP; no SVG/GIF uploads), enforcing byte size and pixel dimension limits prior to decoding, stripping all metadata including GPS EXIF, and ignoring user-supplied filenames.
  - **Lifecycle and Cleanup**: The pipeline must provide deterministic cleanup of media when experiences or draft images are removed, alongside an orphaned-upload cleanup strategy.
  - **Resilient Fallbacks**: Renderers receive explicit dimensions, and missing or deleted media must fall back gracefully with zero broken-image icons reaching recipients.
- **Reason**: Cloudinary provides reliable, managed media delivery and optimization for production without managing raw object-storage buckets, while the local-disk adapter guarantees hermetic, dependency-free local development and automated testing.

### ADR-0008 — Production Hosting & Infrastructure Architecture (Decision D3 Reconciliation)
- **Decision**:
  - **Application Hosting**: Vercel Serverless Platform running Next.js App Router with Node.js runtime.
  - **Production Database**: Managed PostgreSQL accessed via Prisma Client with pooling (`DATABASE_URL` via connection pooling with SSL mode `require`).
  - **Production Media Storage**: Cloudinary (as established in ADR-0007), accessed via `CloudinaryStorageAdapter`.
  - **Dev & Test Infrastructure**: Hermetic local filesystem / in-memory storage adapters, local PostgreSQL in Docker/CI.
- **Context**: Milestone 6 establishes the final production release preparation, deployment runbook, and infrastructure architecture.
- **Reason**: Vercel provides native zero-configuration deployments for Next.js 15, edge routing, automatic SSL certificate provisioning, and environment segregation. Cloudinary provides high-performance media delivery without object storage operational overhead. Managed PostgreSQL provides transactional integrity, cascade deletions, and index-backed query execution.

### ADR-0009 — Licensing and Code Ownership (Decision D6)
- **Decision**: Proprietary / All Rights Reserved (`"private": true` in `package.json`).
- **Context**: The repository is proprietary software created by the owner. Public visibility on GitHub allows code collaboration and inspection, but does not grant open-source re-distribution, sub-licensing, or commercialization rights.
- **Reason**: The owner retains all copyright and intellectual property. No open-source license (such as MIT, Apache, or AGPL) is applied.

## Settled Decisions Log

| ID | Decision | Resolution | Settlement Milestone |
|----|----------|------------|----------------------|
| D1 | Public product name | Retain "Valentino" as internal prototype codename throughout M6 | Settled M6 |
| D2 | Creator identity | No accounts; cookie-based edit session per experience | Settled M1 (ADR-0004) |
| D3 | Hosting, database, media | Vercel application hosting + Managed PostgreSQL + Cloudinary media storage | Settled M6 (ADR-0008) |
| D4 | Personalized link previews | Generic previews only; no personal names or letters in Open Graph | Settled M5 |
| D5 | Link lifetime | Active until creator disables or deletes; 180-day creator edit session cutoff | Settled M1 / M6 |
| D6 | Licensing | Proprietary / All Rights Reserved (`"private": true`) | Settled M6 (ADR-0009) |
| D7 | Audio/music support | Creator-uploaded background audio with server-side validation & size caps | Settled M4 / M5 |
