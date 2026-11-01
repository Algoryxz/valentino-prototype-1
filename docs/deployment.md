# Deployment Architecture & Production Release Runbook

## 1. Overview & Hosting Architecture (ADR-0008)
Valentino Prototype 1 is architected as a modular Next.js App Router monolith deployed to **Vercel** with a managed **PostgreSQL** database and **Cloudinary** media storage:
- **Application Runtime**: Vercel Serverless Platform (Node.js runtime, zero-configuration SSL, edge routing).
- **Relational Persistence**: Managed PostgreSQL (TLS required, connection pooling enabled).
- **Physical Media Storage**: Cloudinary (for uploaded partner photos and soundtracks), isolated via `CloudinaryStorageAdapter`.
- **Database Migrations**: Declarative, forward-only migrations via Prisma (`prisma migrate deploy`).

---

## 2. Environments & Database Isolation
CRITICAL: Production, Preview, and Local environments must **never** share a database instance or media bucket.
- **Production (`main` branch)**:
  - Deployed automatically when owner merges PR into `main`.
  - Connected to dedicated Production PostgreSQL database.
  - Connected to dedicated production Cloudinary folder (`valentino/production`).
- **Preview (Feature branches & Pull Requests)**:
  - Deployed automatically by Vercel on feature branch pushes.
  - Connected to dedicated Preview PostgreSQL database / isolated schema.
  - The Preview `DATABASE_URL` must **never** point to the live production database.
  - Preview deployments do **not** automatically run database migrations (see Section 5).
- **Local Development / CI**:
  - Hermetic PostgreSQL in Docker / local environment.
  - Local filesystem or memory media storage (`STORAGE_PROVIDER=local` or `memory`).

> [!IMPORTANT]
> **Owner External Verification Requirement**: Source code controls alone cannot guarantee database isolation because environment variable bindings reside in external Vercel project settings. The repository owner must independently verify in the Vercel Dashboard that `DATABASE_URL` for the Preview environment scope is completely separate from the Production database connection string.

---

## 3. Production Environment Variables Checklist (Names-Only)

> [!CAUTION]
> Never commit actual secret values to git or print them in terminal logs. Use this names-only checklist when configuring Vercel environment settings.

| Variable Name | Environment Scope | Required Value / Description |
|---|---|---|
| `DATABASE_URL` | Production / Preview | Managed PostgreSQL connection string with SSL mode (`sslmode=require`) and connection pooling. **Preview and Production MUST use separate connection strings/instances.** |
| `APP_URL` | Production | Canonical public URL (e.g. `https://valentino.love` or `https://valentino-prototype-1.vercel.app`) |
| `EDIT_SECRET_PEPPER` | Production / Preview | High-entropy cryptographic random string (min 32 bytes hex) used for keyed HMAC edit token hashing and reporter IP privacy hashing |
| `STORAGE_PROVIDER` | Production | Set to `cloudinary` for production media storage |
| `CLOUDINARY_URL` | Production | Cloudinary environment URL (e.g. `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`) or individual keys below |
| `CLOUDINARY_CLOUD_NAME` | Production | Cloudinary Cloud Name (if `CLOUDINARY_URL` not used) |
| `CLOUDINARY_API_KEY` | Production | Cloudinary API Key (if `CLOUDINARY_URL` not used) |
| `CLOUDINARY_API_SECRET` | Production | Cloudinary API Secret (if `CLOUDINARY_URL` not used) |
| `CLOUDINARY_FOLDER` | Production | Root folder for media assets (e.g. `valentino/media`) |
| `VERCEL_ENV` | Managed | Automatically injected by Vercel (`production` or `preview`) |
| `NODE_ENV` | Managed | Automatically set to `production` |

---

## 4. Pre-Migration Backup & Safety Procedures
Before applying any migration to the production database:
1. **Take an On-Demand Database Snapshot**:
   - In your PostgreSQL cloud console (Neon, Supabase, or AWS RDS), trigger an immediate on-demand backup.
   - Alternatively, execute an encrypted schema and data dump:
     ```bash
     pg_dump -d "$DATABASE_URL" -Fc -f "valentino_backup_$(date +%Y%m%d_%H%M%S).dump"
     ```
2. **Verify Migration Additivity**:
   - Confirm that the migration file in `prisma/migrations/` is forward-only (e.g. `CREATE TABLE`, `ADD COLUMN`, `CREATE INDEX`).
   - Destructive migrations (`DROP TABLE`, `DROP COLUMN`) require explicit owner authorization and two-phase deployment.
3. **Dry-Run Migration in Preview / Staging**:
   - Verify that the migration applied cleanly to the preview database and that all existing routes remain healthy.

---

## 5. Non-Destructive Migration & Build Procedure
Vercel executes the automated build script defined in `package.json`:
```json
"vercel-build": "node scripts/vercel-build.mjs"
```
When Vercel builds the deployment:
1. **Prisma Generation**: Always runs `npx prisma generate` to generate the type-safe client matching the schema.
2. **Conditional Migration Execution**:
   - **Production releases (`VERCEL_ENV === "production"`)**: Executes `npx prisma migrate deploy` to automatically apply unapplied forward migrations against the production database in transaction blocks.
   - **Preview builds (`VERCEL_ENV === "preview"` or non-production)**: **Skips** automatic `prisma migrate deploy` with an explicit build notice. This prevents feature branch builds and PR previews from mutating or migrating any database automatically.
3. **Applying Migrations to Preview Databases**:
   - When preview testing requires schema updates, the release operator applies migrations to the isolated preview database manually or via a dedicated preview deploy step:
     ```bash
     DATABASE_URL="<preview_database_connection_string>" pnpm db:migrate
     ```
4. **Next.js Production Build**: Runs `npx next build` to optimize bundles, prerender pages, and validate TypeScript.

---

## 6. Post-Migration & Deployment Health Verification
Immediately following deployment:
1. **Health Check Endpoint**:
   - Probe `https://<APP_URL>/api/health`
   - Expect HTTP 200 with `{ "status": "ok", "db": "connected" }`.
2. **Database Migration Verification**:
   - Check `_prisma_migrations` table in the database to confirm the latest migration timestamp is recorded as `finished_at != null`.
3. **Security Headers Verification**:
   - Inspect response headers on `GET /` and `GET /v/<publicId>`:
     - `Content-Security-Policy`: Contains dynamic nonce, `script-src 'self' 'nonce-...'`, `object-src 'none'`, `frame-ancestors 'none'`.
     - `X-Frame-Options`: `DENY`
     - `X-Content-Type-Options`: `nosniff`
     - `Cache-Control`: `no-store` (for `/v/*` and `/edit/*`)
     - `X-Robots-Tag`: `noindex, nofollow`

---

## 7. Rollback & Recovery Runbook

### Scenario A: Application Code Regression (Database Untouched)
1. Navigate to the **Vercel Dashboard** -> **Deployments**.
2. Locate the previous stable deployment.
3. Click the three dots menu (`...`) and select **Redeploy** or **Promote to Production**.
4. Traffic instantly shifts back to the previous immutable release bundle.

### Scenario B: Database Migration Regression
1. Because all migrations are forward-only, older application code remains compatible with additive database tables or columns.
2. If a migration must be reverted, write an explicit forward migration that reverses the change, test locally and in preview, and commit it to a feature branch.
3. In catastrophic corruption emergencies, restore the database from the pre-migration snapshot taken in Step 4.

---

## 8. Domain & DNS Configuration
When binding a custom apex or subdomain (e.g. `valentino.love` or `prototype.valentino.love`):
1. In Vercel Project Settings -> **Domains**, add the domain.
2. In your DNS registrar:
   - Apex domain (`example.com`): `A` record pointing to `76.76.21.21`.
   - Subdomain (`www` or `prototype`): `CNAME` record pointing to `cname.vercel-dns.com`.
3. Allow automated Let's Encrypt SSL certificate provisioning to complete.
4. Ensure `APP_URL` in Vercel environment variables matches the custom domain protocol and host.

---

## 9. Post-Deployment Smoke-Test Checklist
The release operator must execute this 10-step manual verification after each production deployment:

- [ ] **1. Health Check**: `curl -I https://<APP_URL>/api/health` returns HTTP 200 with `db: "connected"`.
- [ ] **2. Protected Homepage**: Navigate to `/`; confirm hero animations, typography, and "Create Your Valentine" button display properly.
- [ ] **3. Template Gallery**: Navigate to `/templates`; verify all template cards render with previews and interactive sample views.
- [ ] **4. Create Valentine**: Click "Craft Your Valentine"; verify creator is redirected to `/edit/<publicId>` and session cookie is set with HttpOnly and Secure flags.
- [ ] **5. Inscribe & Autosave**: Enter partner name and love letter; confirm "Saved" indicator appears in the studio header.
- [ ] **6. Media Upload**: Upload a test photo / song; confirm upload succeeds and displays in the preview canvas.
- [ ] **7. Publish Valentine**: Click "Publish Valentine"; confirm publish modal opens with unguessable share link (`/v/<publicId>`).
- [ ] **8. Recipient Public Route**: Open share link in incognito or mobile browser (390×844); confirm recipient view renders with ambient world styling and without edit controls.
- [ ] **9. Report Abuse**: In recipient view, open "Report Experience"; submit test report; confirm discreet success confirmation and 201 response.
- [ ] **10. Creator Disable & Delete**: Return to `/edit/<publicId>`; test "Disable Public Link" (verify `/v/<publicId>` shows deactivated state); test "Permanently Delete" with confirmation dialog (verify redirect to `/templates` and media erasure).
