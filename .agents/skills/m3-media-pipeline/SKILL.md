---
name: m3-media-pipeline
description: "Milestone 3 for Valentino Prototype 1. Builds the safe image upload, processing, storage, and cleanup pipeline so creators' photos flow from upload to preview to published page. Use after M2 is approved and the storage provider decision is made."
---

# M3 — Media pipeline

**Media storage provider settled in ADR-0007 (Cloudinary for production, local-disk adapter for dev/test; application and database hosting remain deferred).** See `docs/decisions.md`. Implementation requires explicit owner authorization.

## Do
1. **Storage abstraction**: an interface (`put`, `getUrl`, `delete`) with a local-disk adapter for dev and one adapter for the chosen provider. Never store binary files in the database. Store metadata in `MediaAsset` (random `storageKey`, mime, bytes, width, height, `altText`, status).
2. **Upload endpoint**: authenticated by the edit secret, rate limited. Validate by magic bytes (JPEG, PNG, WebP; no SVG/GIF unless approved), enforce max bytes and max pixels **before decoding**, cap the number of images per experience.
3. **Processing** (e.g. `sharp`): re-encode, resize to sensible maximums, generate a small preview size, **strip all metadata including GPS EXIF**, ignore the user's filename.
4. **Editor UX**: upload progress, retry, remove, reorder, alt text field, friendly errors for wrong type, too large, network failure.
5. **Renderer**: templates receive resolved media with explicit dimensions. Missing or deleted media falls back gracefully; no broken-image icons ever reach the recipient.
6. **Cleanup**: remove media when an experience is deleted or a draft image is removed, plus a script or job for orphaned uploads. Document the strategy.
7. **Tests**: valid upload; wrong type disguised by extension; oversized bytes; oversized pixels; corrupt file; metadata stripped (assert no EXIF in output); missing media rendering; e2e upload -> preview -> publish -> public page.

## Gate
A real user's photos flow safely from upload to preview to published page on mobile and desktop. Security review done. Checkpoint report posted.
