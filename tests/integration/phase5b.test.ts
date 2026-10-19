import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import sharp from "sharp";
import { db } from "@/lib/db";
import { POST as createExperience } from "@/app/api/experiences/route";
import { PUT as saveDraft } from "@/app/api/experiences/[publicId]/draft/route";
import { POST as publishExperience } from "@/app/api/experiences/[publicId]/publish/route";
import { POST as uploadMedia } from "@/app/api/experiences/[publicId]/media/route";
import { GET as getDraftMedia } from "@/app/api/experiences/[publicId]/media/[mediaId]/route";
import { GET as getPublicMedia } from "@/app/api/media/[publicId]/[mediaId]/route";
import { POST as verifySecret } from "@/app/api/experiences/[publicId]/secret/verify/route";
import { POST as postReaction, GET as getReactions } from "@/app/api/experiences/[publicId]/reactions/route";
import { POST as postReply, GET as getReplies } from "@/app/api/experiences/[publicId]/replies/route";
import { GET as getPublicExperience } from "@/app/v/[publicId]/route";
import { getCookieName } from "@/lib/session";

describe("Phase 5B Integration Tests - Multimedia, Media Isolation, Secret Lock & Delivery", () => {
  const APP_URL = process.env.APP_URL || "http://localhost:3000";

  beforeEach(async () => {
    // Delete in order to respect cascade
    await db.experienceReaction.deleteMany({});
    await db.experienceReply.deleteMany({});
    await db.experienceMedia.deleteMany({});
    await db.experience.deleteMany({});
  });

  async function createValidJpegBuffer() {
    return sharp({
      create: {
        width: 20,
        height: 20,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .jpeg()
      .toBuffer();
  }

  // Helper to create an experience and return publicId & cookie header
  async function createTestExperience() {
    const createReq = new NextRequest(`${APP_URL}/api/experiences`, {
      method: "POST",
      headers: { origin: APP_URL, "content-type": "application/json" },
    });
    const createRes = await createExperience(createReq);
    const { publicId } = await createRes.json();
    const cookieHeader = createRes.headers.get("set-cookie")!;
    const cookieVal = cookieHeader.split(";")[0].split("=")[1];
    const cookieName = getCookieName(publicId);
    return { publicId, cookieName, cookieVal };
  }

  describe("Media Storage & Draft Protection", () => {
    it("POST /api/experiences/[publicId]/media: rejects unauthenticated upload", async () => {
      const { publicId } = await createTestExperience();
      const formData = new FormData();
      const file = new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], { type: "image/jpeg" });
      formData.append("file", file, "photo.jpg");
      formData.append("type", "photo");

      const req = new NextRequest(`${APP_URL}/api/experiences/${publicId}/media`, {
        method: "POST",
        headers: { origin: APP_URL },
        body: formData,
      });

      const res = await uploadMedia(req, { params: Promise.resolve({ publicId }) });
      expect(res.status).toBe(401);
    });

    it("POST /api/experiences/[publicId]/media: validates magic bytes and persists media", async () => {
      const { publicId, cookieName, cookieVal } = await createTestExperience();

      // Valid JPEG image buffer
      const jpegBuffer = await createValidJpegBuffer();
      const formData = new FormData();
      formData.append("file", new Blob([jpegBuffer], { type: "image/jpeg" }), "romantic.jpg");
      formData.append("type", "photo");

      const req = new NextRequest(`${APP_URL}/api/experiences/${publicId}/media`, {
        method: "POST",
        headers: { origin: APP_URL, cookie: `${cookieName}=${cookieVal}` },
        body: formData,
      });

      const res = await uploadMedia(req, { params: Promise.resolve({ publicId }) });
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.media.id).toBeDefined();
      expect(data.media.mediaType).toBe("PHOTO");
      expect(data.media.mimeType).toBe("image/jpeg");

      // Verify draft media stream endpoint serves it to creator
      const streamReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/media/${data.media.id}`, {
        method: "GET",
        headers: { cookie: `${cookieName}=${cookieVal}` },
      });
      const streamRes = await getDraftMedia(streamReq, {
        params: Promise.resolve({ publicId, mediaId: data.media.id }),
      });
      expect(streamRes.status).toBe(200);
      expect(streamRes.headers.get("content-type")).toBe("image/jpeg");
    });

    it("POST /api/experiences/[publicId]/media: rejects fake extension with bad magic bytes", async () => {
      const { publicId, cookieName, cookieVal } = await createTestExperience();

      // Plain text pretending to be JPEG
      const fakeBytes = new TextEncoder().encode("<html><body>malicious payload</body></html>");
      const formData = new FormData();
      formData.append("file", new Blob([fakeBytes], { type: "image/jpeg" }), "fake.jpg");
      formData.append("type", "photo");

      const req = new NextRequest(`${APP_URL}/api/experiences/${publicId}/media`, {
        method: "POST",
        headers: { origin: APP_URL, cookie: `${cookieName}=${cookieVal}` },
        body: formData,
      });

      const res = await uploadMedia(req, { params: Promise.resolve({ publicId }) });
      expect(res.status).toBe(422);
      const data = await res.json();
      expect(data.error).toMatch(/unsupported|unrecognized|signature/i);
    });
  });

  describe("Publishing, Media Snapshots & Isolation", () => {
    it("snapshots media upon publish, rewrites draft URLs to public URLs, and protects published state from draft edits", async () => {
      const { publicId, cookieName, cookieVal } = await createTestExperience();

      // 1. Upload a photo
      const jpegBuffer = await createValidJpegBuffer();
      const formData = new FormData();
      formData.append("file", new Blob([jpegBuffer], { type: "image/jpeg" }), "photo.jpg");
      formData.append("type", "photo");

      const uploadReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/media`, {
        method: "POST",
        headers: { origin: APP_URL, cookie: `${cookieName}=${cookieVal}` },
        body: formData,
      });
      const uploadRes = await uploadMedia(uploadReq, { params: Promise.resolve({ publicId }) });
      const { media } = await uploadRes.json();
      const mediaId = media.id;

      // 2. Add memories module in draft referencing this media
      const saveDraftReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
        method: "PUT",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=${cookieVal}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          baseRevision: 1,
          draftConfig: {
            partnerName: "Taylor",
            senderName: "Jordan",
            greeting: "My love",
            message: "A published love story.",
            signOff: "Forever",
            accentTheme: "crimson-rose",
            decor: { blooms: [], charms: [], paper: "deckled-parchment", ribbon: "velvet-crimson", waxSeal: "velvet-crimson" },
            modules: {
              memories: {
                enabled: true,
                items: [
                  {
                    id: "m-1",
                    title: "First Sunset",
                    date: "2024-06-15",
                    caption: "Unforgettable evening together",
                    mediaId: mediaId,
                    url: `/api/experiences/${publicId}/media/${mediaId}`,
                  },
                ],
              },
            },
          },
        }),
      });
      await saveDraft(saveDraftReq, { params: Promise.resolve({ publicId }) });

      // 3. Publish experience
      const pubReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/publish`, {
        method: "POST",
        headers: {
          origin: APP_URL,
          "content-type": "application/json",
          cookie: `${cookieName}=${cookieVal}`,
        },
        body: JSON.stringify({ expectedRevision: 2 }),
      });
      const pubRes = await publishExperience(pubReq, { params: Promise.resolve({ publicId }) });
      expect(pubRes.status).toBe(200);

      // Verify media record status in DB is now PUBLISHED
      const dbMedia = await db.experienceMedia.findUnique({ where: { id: mediaId } });
      expect(dbMedia?.status).toBe("PUBLISHED");

      // Verify published config in DB rewrote the URL to /api/media/...
      const publishedExp = await db.experience.findUnique({ where: { publicId } });
      const pubConfig = JSON.parse(publishedExp!.publishedConfig!);
      expect(pubConfig.modules.memories.items[0].url).toBe(`/api/media/${publicId}/${mediaId}`);

      // Verify public media route serves it
      const publicMediaReq = new NextRequest(`${APP_URL}/api/media/${publicId}/${mediaId}`, {
        method: "GET",
      });
      const publicMediaRes = await getPublicMedia(publicMediaReq, {
        params: Promise.resolve({ publicId, mediaId }),
      });
      expect(publicMediaRes.status).toBe(200);
      expect(publicMediaRes.headers.get("cache-control")).toContain("public");

      // 4. Edit draft after publishing: delete the memory in draft
      const mutateDraftReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
        method: "PUT",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=${cookieVal}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          baseRevision: 2,
          draftConfig: {
            partnerName: "Taylor",
            senderName: "Jordan",
            greeting: "My love",
            message: "Draft changed, but published must remain stable.",
            signOff: "Forever",
            accentTheme: "crimson-rose",
            decor: { blooms: [], charms: [], paper: "deckled-parchment", ribbon: "velvet-crimson", waxSeal: "velvet-crimson" },
            modules: { memories: { enabled: false, items: [] } },
          },
        }),
      });
      await saveDraft(mutateDraftReq, { params: Promise.resolve({ publicId }) });

      // 5. Verify published experience view still renders the original published snapshot
      const publicViewReq = new NextRequest(`${APP_URL}/v/${publicId}`, { method: "GET" });
      const publicViewRes = await getPublicExperience(publicViewReq, {
        params: Promise.resolve({ publicId }),
      });
      const publicHtml = await publicViewRes.text();
      expect(publicHtml).toContain("First Sunset");
      expect(publicHtml).toContain(`/api/media/${publicId}/${mediaId}`);
    });
  });

  describe("Secret Question Lock Cryptography & Verification", () => {
    it("strips secret plain-text answer and concealed note from publishedConfig and verifies securely via timing-safe check", async () => {
      const { publicId, cookieName, cookieVal } = await createTestExperience();

      // Configure draft with secret question lock
      const saveDraftReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
        method: "PUT",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=${cookieVal}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          baseRevision: 1,
          draftConfig: {
            partnerName: "Taylor",
            senderName: "Jordan",
            greeting: "To Taylor",
            message: "Our love letter.",
            signOff: "Yours",
            accentTheme: "crimson-rose",
            decor: { blooms: [], charms: [], paper: "deckled-parchment", ribbon: "velvet-crimson", waxSeal: "velvet-crimson" },
            modules: {
              secret: {
                enabled: true,
                prompt: "A sealed secret",
                question: "Where did we first kiss?",
                answer: "Central Park",
                concealedSecret: "You make my entire life brighter every day.",
              },
            },
          },
        }),
      });
      await saveDraft(saveDraftReq, { params: Promise.resolve({ publicId }) });

      // Publish
      const pubReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/publish`, {
        method: "POST",
        headers: {
          origin: APP_URL,
          "content-type": "application/json",
          cookie: `${cookieName}=${cookieVal}`,
        },
        body: JSON.stringify({ expectedRevision: 2 }),
      });
      const pubRes = await publishExperience(pubReq, { params: Promise.resolve({ publicId }) });
      expect(pubRes.status).toBe(200);

      // Crucial: check publishedConfig NEVER has answer or concealedSecret
      const record = await db.experience.findUnique({ where: { publicId } });
      const pubConfig = JSON.parse(record!.publishedConfig!);
      expect(pubConfig.modules.secret.answer).toBeUndefined();
      expect(pubConfig.modules.secret.concealedSecret).toBeUndefined();
      expect(pubConfig.modules.secret.salt).toBeDefined();
      expect(pubConfig.modules.secret.answerHash).toBeDefined();

      // Test incorrect verification attempt
      const wrongReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/secret/verify`, {
        method: "POST",
        headers: { origin: APP_URL, "content-type": "application/json" },
        body: JSON.stringify({ answer: "Brooklyn Bridge" }),
      });
      const wrongRes = await verifySecret(wrongReq, { params: Promise.resolve({ publicId }) });
      expect(wrongRes.status).toBe(401);
      const wrongBody = await wrongRes.json();
      expect(wrongBody.success).toBe(false);
      expect(wrongBody.concealedSecret).toBeUndefined();

      // Test correct verification attempt (case-insensitive + whitespace trimmed)
      const correctReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/secret/verify`, {
        method: "POST",
        headers: { origin: APP_URL, "content-type": "application/json" },
        body: JSON.stringify({ answer: "  central park  " }),
      });
      const correctRes = await verifySecret(correctReq, { params: Promise.resolve({ publicId }) });
      expect(correctRes.status).toBe(200);
      const correctBody = await correctRes.json();
      expect(correctBody.success).toBe(true);
      expect(correctBody.concealedSecret).toBe("You make my entire life brighter every day.");
    });
  });

  describe("Scheduled Reveal Server-Side Enforcement", () => {
    it("locks experience when scheduledUnlockAt is in the future and unlocks when past", async () => {
      const { publicId, cookieName, cookieVal } = await createTestExperience();

      // Set scheduled reveal 2 hours in the future
      const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

      const saveDraftReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
        method: "PUT",
        headers: {
          origin: APP_URL,
          cookie: `${cookieName}=${cookieVal}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          baseRevision: 1,
          draftConfig: {
            partnerName: "Taylor",
            senderName: "Jordan",
            greeting: "To Taylor",
            message: "Top secret future message.",
            signOff: "Yours",
            accentTheme: "crimson-rose",
            scheduledUnlockAt: futureDate,
            decor: { blooms: [], charms: [], paper: "deckled-parchment", ribbon: "velvet-crimson", waxSeal: "velvet-crimson" },
            modules: {},
          },
        }),
      });
      await saveDraft(saveDraftReq, { params: Promise.resolve({ publicId }) });

      // Publish
      const pubReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/publish`, {
        method: "POST",
        headers: {
          origin: APP_URL,
          "content-type": "application/json",
          cookie: `${cookieName}=${cookieVal}`,
        },
        body: JSON.stringify({ expectedRevision: 2 }),
      });
      const pubRes = await publishExperience(pubReq, { params: Promise.resolve({ publicId }) });
      expect(pubRes.status).toBe(200);

      // View public experience -> MUST be locked!
      const lockedReq = new NextRequest(`${APP_URL}/v/${publicId}`, { method: "GET" });
      const lockedRes = await getPublicExperience(lockedReq, { params: Promise.resolve({ publicId }) });
      const lockedHtml = await lockedRes.text();
      expect(lockedHtml).toContain("TIME-LOCKED VALENTINE");
      expect(lockedHtml).toContain("sealed until");
      // Must not leak message!
      expect(lockedHtml).not.toContain("Top secret future message.");

      // Now update scheduledUnlockAt in database to 1 hour in the past
      const pastDate = new Date(Date.now() - 1 * 60 * 60 * 1000);
      await db.experience.update({
        where: { publicId },
        data: { scheduledUnlockAt: pastDate },
      });

      // View public experience -> MUST now be unlocked!
      const unlockedReq = new NextRequest(`${APP_URL}/v/${publicId}`, { method: "GET" });
      const unlockedRes = await getPublicExperience(unlockedReq, { params: Promise.resolve({ publicId }) });
      const unlockedHtml = await unlockedRes.text();
      expect(unlockedHtml).not.toContain("TIME-LOCKED VALENTINE");
      expect(unlockedHtml).toContain("Top secret future message.");
    });
  });

  describe("Recipient Reactions & Private Replies", () => {
    it("accepts valid recipient reaction and allows creator to retrieve aggregated tallies", async () => {
      const { publicId, cookieName, cookieVal } = await createTestExperience();

      // Save valid draft with minimum message length (>=10 chars)
      await saveDraft(
        new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
          method: "PUT",
          headers: {
            origin: APP_URL,
            "content-type": "application/json",
            cookie: `${cookieName}=${cookieVal}`,
          },
          body: JSON.stringify({
            baseRevision: 1,
            draftConfig: {
              partnerName: "Taylor",
              senderName: "Jordan",
              message: "I love you with all of my heart.",
              accentTheme: "crimson-rose",
            },
          }),
        }),
        { params: Promise.resolve({ publicId }) }
      );

      // Publish experience first
      const pubReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/publish`, {
        method: "POST",
        headers: {
          origin: APP_URL,
          "content-type": "application/json",
          cookie: `${cookieName}=${cookieVal}`,
        },
        body: JSON.stringify({ expectedRevision: 2 }),
      });
      const pubRes = await publishExperience(pubReq, { params: Promise.resolve({ publicId }) });
      expect(pubRes.status).toBe(200);

      // Recipient sends "heart" reaction
      const reactReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/reactions`, {
        method: "POST",
        headers: { origin: APP_URL, "content-type": "application/json" },
        body: JSON.stringify({ type: "heart" }),
      });
      const reactRes = await postReaction(reactReq, { params: Promise.resolve({ publicId }) });
      expect(reactRes.status).toBe(201);

      // Recipient tries invalid reaction
      const badReactReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/reactions`, {
        method: "POST",
        headers: { origin: APP_URL, "content-type": "application/json" },
        body: JSON.stringify({ type: "evil_hack" }),
      });
      const badReactRes = await postReaction(badReactReq, { params: Promise.resolve({ publicId }) });
      expect(badReactRes.status).toBe(400);

      // Creator retrieves reactions
      const getReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/reactions`, {
        method: "GET",
        headers: { cookie: `${cookieName}=${cookieVal}` },
      });
      const getRes = await getReactions(getReq, { params: Promise.resolve({ publicId }) });
      expect(getRes.status).toBe(200);
      const data = await getRes.json();
      expect(data.tallies.heart).toBe(1);
    });

    it("accepts recipient reply and allows creator to retrieve private messages", async () => {
      const { publicId, cookieName, cookieVal } = await createTestExperience();

      // Save valid draft with minimum message length (>=10 chars)
      await saveDraft(
        new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
          method: "PUT",
          headers: {
            origin: APP_URL,
            "content-type": "application/json",
            cookie: `${cookieName}=${cookieVal}`,
          },
          body: JSON.stringify({
            baseRevision: 1,
            draftConfig: {
              partnerName: "Taylor",
              senderName: "Jordan",
              message: "I love you with all of my heart.",
              accentTheme: "crimson-rose",
            },
          }),
        }),
        { params: Promise.resolve({ publicId }) }
      );

      // Publish experience
      const pubReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/publish`, {
        method: "POST",
        headers: {
          origin: APP_URL,
          "content-type": "application/json",
          cookie: `${cookieName}=${cookieVal}`,
        },
        body: JSON.stringify({ expectedRevision: 2 }),
      });
      const pubRes = await publishExperience(pubReq, { params: Promise.resolve({ publicId }) });
      expect(pubRes.status).toBe(200);

      // Recipient sends heartfelt reply
      const replyReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/replies`, {
        method: "POST",
        headers: { origin: APP_URL, "content-type": "application/json" },
        body: JSON.stringify({
          authorName: "Taylor",
          message: "This made me cry happy tears. I love you!",
        }),
      });
      const replyRes = await postReply(replyReq, { params: Promise.resolve({ publicId }) });
      expect(replyRes.status).toBe(201);

      // Creator retrieves replies
      const getReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/replies`, {
        method: "GET",
        headers: { cookie: `${cookieName}=${cookieVal}` },
      });
      const getRes = await getReplies(getReq, { params: Promise.resolve({ publicId }) });
      expect(getRes.status).toBe(200);
      const data = await getRes.json();
      expect(data.replies).toHaveLength(1);
      expect(data.replies[0].authorName).toBe("Taylor");
      expect(data.replies[0].message).toContain("happy tears");
    });
  });
});
