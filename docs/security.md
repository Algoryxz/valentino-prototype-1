# Security Architecture & Threat Model

> **Status:** Production-grade security baseline active (enforcing `.agents/rules/10-security-baseline.md`).

Valentino handles deeply personal romantic messages, names, and memories. A critical premise of the product is that **recipients never signed up for an account**—they receive a link shared in confidence. Protecting their privacy and ensuring that creators retain sovereign, leak-free control over their experiences is paramount.

---

## 1. What We Protect

1. **Recipients:** Individuals who receive a private experience link. They must never be tracked, profiled, indexed by search engines, or exposed to hostile scripts or content injection.
2. **Creators:** Users who compose intimate letters without an account. Their ability to edit, update, disable, or delete their creation must remain securely tied to their session without exposing them to credential theft or tampering.
3. **Personal Content:** Partner names, personal greetings, romantic letters, and uploaded media. These must never leak into search engine indexes, open logs, or public scrapers.

---

## 2. Threat Model & Mitigations

| Threat Vector | Potential Impact | Implemented Mitigation |
| :--- | :--- | :--- |
| **Stored XSS & HTML Injection** | Malicious script execution in recipient's browser | Strict context-aware HTML entity escaping (`escapeHtml`, `escapeHtmlAttr`); safe script serialization (`safeJsonForScript`); URL protocol sanitization (`sanitizeUrl`); zero `dangerouslySetInnerHTML`. |
| **Script Execution & Clickjacking** | Unauthorized script execution or framing attacks | Dynamic nonce-based Content Security Policy (`script-src 'self' 'nonce-...' 'strict-dynamic'`); `frame-ancestors 'none'`; `X-Frame-Options: DENY`. |
| **Link Enumeration & Guessing** | Strangers discovering private love letters | High-entropy 128-bit unguessable identifiers (`nanoid` custom alphabet); no public listing, sitemap, or directory of created experiences. |
| **Credential & Edit Theft** | Unauthorized tampering or deletion of letters | 256-bit random edit secrets; HMAC-SHA256 hashed with server-side pepper; constant-time comparison; scoped `__Host-` cookies; zero credential leakage in JSON/DOM/logs. |
| **Search Engine Scraping** | Intimate letters appearing in Google search results | Strict `X-Robots-Tag: noindex, nofollow` headers; `<meta name="robots" content="noindex">`; `Cache-Control: no-store` on all sensitive views. |
| **Cross-Site Request Forgery (CSRF)** | Third-party sites modifying or publishing drafts | Origin verification on all state-changing endpoints (`POST`, `PATCH`, `DELETE`); strict canonical host matching in production; rejection with `403 Forbidden`. |
| **Concurrent Overwrite Races** | Lost edits when editing across tabs or devices | Integer revision tracking (`draftRevision`); optimistic concurrency checks reject out-of-order writes with `409 Conflict`. |
| **Unchecked Media & Exploits** | Decompression bombs, SVG malware, EXIF leakage | Server-side MIME magic byte verification; re-encoding to strip EXIF GPS metadata; strict 10 MB caps; random UUID storage keys. |
| **Content Abuse & Harassment** | Non-consensual content or abusive public links | Discreet in-experience reporting modal (`POST /api/experiences/[publicId]/report`); rate-limited; privacy-preserving pepper-keyed reporter hashing. |

---

## 3. Cryptographic & Credential Architecture

### Identifiers vs. Edit Secrets
Each experience has two decoupled identifiers:
* **`publicId` (Share Link):** A 128-bit high-entropy unguessable string used exclusively for routing and public view.
* **`editSecret` (Author Secret):** A 256-bit cryptographically secure random token generated at creation time.

### Storage & Verification
1. **Never Stored in Plaintext:** The database stores only `editSecretHash`:
   $$\text{editSecretHash} = \text{HMAC-SHA256}(\text{editSecret}, \text{EDIT\_SECRET\_PEPPER})$$
2. **Constant-Time Verification:** When an author accesses the editor or submits an edit, the provided token is hashed and verified using `crypto.timingSafeEqual()` to eliminate timing attack vectors.
3. **Absolute Session Expiration:** Edit sessions enforce a 180-day hard limit (`editCredentialIssuedAt`). Expired sessions are rejected with `401 Unauthorized`.

### Cookie Security Specs
Edit tokens are transmitted exclusively through secure HTTP cookies:
* **Name:** `__Host-edit-token-[publicId]` (Production) / `edit-token-[publicId]` (Development)
* **Attributes:** `HttpOnly`, `Secure` (Production), `SameSite=Lax`, `Path=/`
* **Zero Leakage Rule:** Edit secrets are never returned in JSON response bodies, never rendered into the DOM, never placed in URL query parameters, and never logged in server telemetry.

---

## 4. Public Route Isolation (`/v/[publicId]`)

The public recipient route operates under a zero-trust model:
* **Ignores Edit Cookies:** The route handler completely ignores any edit cookie present in the request. A creator viewing their own published link sees exactly what a recipient sees, with zero creator privileges active.
* **True HTTP Status Codes:**
  * `404 Not Found` — Experience does not exist or has never been published.
  * `410 Gone` — Experience has been explicitly disabled by the author.
  * `500 Internal Server Error` — Database or infrastructure outage (rendered via calm fallback screen; never misleads visitors that the experience was deleted).
  * `200 OK` — Experience is actively published.
* **Strict Cache Controls:** Emits `Cache-Control: no-store` to prevent intermediary proxies, CDNs, or browser caches from retaining private correspondence after deletion or modification.

---

## 5. Content Security Policy (CSP) & Defense-in-Depth

Every request passes through Next.js middleware which injects security headers:
* **Dynamic Nonce:** Every request generates a cryptographically secure 128-bit nonce (`x-nonce`), attached to the CSP and forwarded to SSR scripts.
* **Strict Directives:**
  ```text
  default-src 'self';
  script-src 'self' 'nonce-<dynamic>' 'strict-dynamic';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://res.cloudinary.com;
  media-src 'self' blob: data: https://res.cloudinary.com;
  font-src 'self' data:;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
  ```
* **Framing Defense:** `X-Frame-Options: DENY` and `frame-ancestors 'none'` prevent embedding in malicious iframes.
* **MIME Sniffing Defense:** `X-Content-Type-Options: nosniff`.

---

## 6. Abuse Reporting & Content Moderation

1. **Endpoint**: `POST /api/experiences/[publicId]/report`
2. **Rate Limiting**: Strictly capped at 5 reports per hour per client IP via the central rate limiter, returning HTTP 429 with `Retry-After`.
3. **Privacy-Preserving Reporter ID**: Client IP addresses are never stored in raw form. They are hashed using HMAC-SHA-256 keyed with `EDIT_SECRET_PEPPER`:
   $$\text{reporterHash} = \text{HMAC-SHA256}(\text{clientIp}, \text{EDIT\_SECRET\_PEPPER})$$
4. **Data Privacy**: Report details are stored in the `ExperienceReport` table with default status `PENDING`. Reports are never disclosed in creator interfaces or public endpoints.

---

## 7. Creator Management: Disable & Reliable Media Erasure

1. **Disable Public Link**: `PATCH /api/experiences/[publicId]/status` with `{ "status": "DISABLED" }`. The public route immediately serves an honest deactivated notice (HTTP 410) without deleting data. The creator can re-enable at any time.
2. **Permanent Deletion**: `DELETE /api/experiences/[publicId]`.
   - **Reliable Physical Media Cleanup**: Queries all associated `ExperienceMedia` records and invokes `mediaStorage.delete(storageKey)` with retry logic before deleting database records.
   - **Zero Orphaned Files**: If any storage file fails to delete, database deletion is aborted and HTTP 500 is returned, ensuring no unreferenced files linger in Cloudinary or local storage.
   - **Cookie Erasure**: Clears the creator edit token cookie upon successful deletion.

---

## 8. Operational Security & Incident Reporting

* **Secrets in Code:** Automated pre-commit scanning, Git secret prevention, and zero committed `.env` files.
* **Dependencies:** Regularly audited via `pnpm audit --prod`. Next.js is pinned to patched versions (`>=15.5.28`).
* **Security Contact:** For vulnerability disclosures or abuse reports regarding hosted experiences, please submit an issue on the canonical repository: [Algoryxz/valentino-prototype-1](https://github.com/Algoryxz/valentino-prototype-1).
