# Valentino

> An intimate, reusable Valentine's web experience platform. Pick a template, personalize your message, preview it in real time, and share a private, beautifully sealed digital experience with someone you love.

[![Production Deployment](https://img.shields.io/badge/Production-Live-10b981?style=flat-square)](https://valentino-prototype-1.vercel.app)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.28-black?style=flat-square)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Prisma-4169e1?style=flat-square)](https://www.prisma.io)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](#license)

**Live Production:** [valentino-prototype-1.vercel.app](https://valentino-prototype-1.vercel.app)  
**Status:** Milestone 1 (Walking Skeleton) & Milestone 7 (Vercel Production & PostgreSQL) active and verified.

---

## The Concept

Valentino is designed for moments that matter. Rather than sending a generic card or an unformatted text message, creators can build an intimate, personal web experience in seconds—with zero sign-up friction.

The experience is centered around two distinct perspectives:

* **The Creator:** Discovers templates, tailors romantic notes and personal greetings, watches changes reflected instantly in a desktop/mobile live preview, and publishes with a single click. Edits remain private to the creator's browser session via cryptographically secure, passwordless credentials.
* **The Recipient:** Receives a private, unguessable link. Opening it presents an uninterrupted, cinematic experience—such as an envelope sealed with digital wax—optimized specifically for mobile screens and in-app chat browsers.

```
Discover Template → Customize & Style → Live Real-Time Preview → Instant Publish → Private Recipient Reveal
```

---

## Architectural Highlights

* **Single-Engine Rendering Contract:** The exact same template component and normalization pipeline powers both the creator's real-time editor preview (`mode="preview"`) and the recipient's public view (`mode="public"`). What you see while drafting is byte-for-byte what your partner sees.
* **Zero-Sign-Up Security:** Creators do not need to create an account or provide an email. Authorization is handled via 256-bit cryptographic edit secrets hashed with HMAC-SHA256 and stored in secure, scoped HTTP-only `__Host-` cookies.
* **Privacy by Default:** Public Valentine links are unindexed (`noindex, nofollow`), send strict `Cache-Control: no-store` headers, and feature high-entropy 128-bit unguessable identifiers.
* **Optimistic Concurrency:** Drafts enforce integer revision tracking (`draftRevision`) to safeguard against accidental overwrites or multi-tab race conditions.
* **Automated Live Delivery:** Integrated into Vercel with automatic branch preview deployments and zero-downtime production database migrations via Prisma and PostgreSQL.

---

## Included Templates

### 1. Midnight Rose (`v1`)
* **Tone:** Intimate, starlight-themed love letter sealed with digital wax.
* **Color Themes:** Crimson Rose, Midnight Violet, Champagne Gold.
* **Features:** Unseal animation, responsive letter typography, custom greetings, romantic letter body, and warm ambient glowing accents.

---

## Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Node.js runtime) | Server Route Handlers, high-performance static/dynamic rendering |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) | End-to-end type safety across schemas, API routes, and components |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Curated dark romantic aesthetic, glassmorphism, responsive utility system |
| **Persistence** | [Prisma ORM](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) | Type-safe queries, migration tracking, and relational consistency |
| **Validation** | [Zod](https://zod.dev/) | Strict server-authoritative schema validation with Unicode grapheme boundary support |
| **Testing** | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | Unit, integration, optimistic concurrency, and end-to-end browser suites |

---

## Repository Structure

```text
valentino-prototype-1/
├── src/
│   ├── app/                      # Next.js App Router (pages & API route handlers)
│   │   ├── api/experiences/      # Creator API: create, draft read/save, publish
│   │   ├── create/               # Instant experience generator client entrypoint
│   │   ├── edit/[publicId]/      # Split-screen live customizer & editor
│   │   ├── v/[publicId]/         # Public recipient route handler (200 / 404 / 410)
│   │   └── page.tsx              # Landing page
│   ├── templates/                # Template registry and individual template implementations
│   │   ├── registry.ts           # Central template registry
│   │   └── midnight-rose/v1/     # Midnight Rose v1 schema, normalization & UI
│   └── lib/                      # Core utilities: security, cookies, IDs, database client
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema with ExperienceStatus enum
│   └── migrations/               # Checked-in SQL migrations for deployment
├── docs/                         # Architecture, product, security, and operations documentation
└── .github/workflows/            # GitHub Actions automated verification pipeline
```

---

## Quickstart & Local Development

### Prerequisites
* **Node.js**: `v20+` or `v24+`
* **Package Manager**: `pnpm v9+`
* **Database**: Local or cloud PostgreSQL instance

### 1. Clone & Install
```bash
git clone https://github.com/Lurkaee/valentino-prototype-1.git
cd valentino-prototype-1
pnpm install --frozen-lockfile
```

### 2. Environment Configuration
Create a `.env.local` file in the project root:
```ini
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/valentino_dev"
APP_URL="http://localhost:3000"
EDIT_SECRET_PEPPER="replace-with-a-random-32-character-secret-string"
```

### 3. Database Initialization
Apply existing migrations to your local database and generate the Prisma Client:
```bash
pnpm prisma migrate deploy
pnpm prisma generate
```

### 4. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Verification & Quality Gates

The codebase enforces strict linting, typechecking, and multi-tier test suites:

```bash
# Run ESLint validation
pnpm lint

# Run TypeScript compiler typecheck
pnpm typecheck

# Run unit and integration tests (Vitest)
pnpm test

# Run end-to-end browser test suite (Playwright)
pnpm test:e2e

# Run production build verification
pnpm build
```

---

## Documentation Index

Comprehensive engineering notes, product vision, and operational guides are organized in the [`docs/`](docs/) directory:

* [Product Vision & Journey](docs/product.md) — User personas, product lifecycle, and roadmap boundaries.
* [System Architecture](docs/architecture.md) — Monolith domain breakdown, data models, and the rendering contract.
* [Security Architecture & Threat Model](docs/security.md) — Secret protection, CSRF prevention, sanitization, and abuse defenses.
* [Deployment Architecture](docs/deployment.md) — Vercel environments, database isolation, and migration workflows.
* [Development & Deployment Workflow](docs/workflow.md) — Live progression system and review loops.
* [Decision Log](docs/decisions.md) — Architectural Decision Records (ADRs) detailing technology choices.

---

## License

Proprietary / All Rights Reserved. Copyright (c) the repository owner.

This software is marked `"private": true` in `package.json`. While public visibility on GitHub permits source code inspection and collaborative review, no license (open-source or otherwise) is granted to copy, redistribute, sub-license, modify for redistribution, or commercialize this code without express written authorization from the copyright holder.
