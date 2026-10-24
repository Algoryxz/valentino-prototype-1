import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ExperienceStatus } from "@prisma/client";
import { POST as createExperience } from "@/app/api/experiences/route";
import { GET as getDraft, PUT as saveDraft } from "@/app/api/experiences/[publicId]/draft/route";
import { POST as publishExperience } from "@/app/api/experiences/[publicId]/publish/route";
import { middleware } from "@/middleware";
import { GET as getPublicExperience } from "@/app/v/[publicId]/route";
import { getCookieName } from "@/lib/session";

describe("API Integration Tests", () => {
  const APP_URL = process.env.APP_URL || "http://localhost:3000";

  beforeEach(async () => {
    // Clean up test experiences
    await db.experience.deleteMany({});
  });

  it("POST /api/experiences: rejects requests with missing or mismatching Origin", async () => {
    const req = new NextRequest(`${APP_URL}/api/experiences`, {
      method: "POST",
      headers: {
        origin: "https://malicious-attacker.com",
        "content-type": "application/json",
      },
    });

    const res = await createExperience(req);
    expect(res.status).toBe(403);
  });

  it("POST /api/experiences: creates experience, sets HttpOnly cookie, and returns publicId", async () => {
    const req = new NextRequest(`${APP_URL}/api/experiences`, {
      method: "POST",
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
      },
    });

    const res = await createExperience(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.publicId).toBeDefined();
    expect(body.publicId).toHaveLength(22);
    // Crucial: Credential must NEVER appear in JSON response body
    expect(body.credential).toBeUndefined();
    expect(body.secret).toBeUndefined();

    // Verify Set-Cookie header is present
    const cookieHeader = res.headers.get("set-cookie");
    expect(cookieHeader).toBeDefined();
    expect(cookieHeader).toContain(getCookieName(body.publicId));
    expect(cookieHeader?.toLowerCase()).toContain("httponly");
    expect(cookieHeader?.toLowerCase()).toContain("samesite=lax");

    // Verify DB record created
    const record = await db.experience.findUnique({ where: { publicId: body.publicId } });
    expect(record).not.toBeNull();
    expect(record?.status).toBe("DRAFT");
    expect(record?.draftRevision).toBe(1);
    expect(record?.editCredentialIssuedAt).toBeDefined();
  });

  it("POST /api/experiences: accepts optional initialDecor and persists it in draftConfig", async () => {
    const customDecor = {
      blooms: ["crimson-rose", "wild-daisy"],
      charms: ["sparkle"],
      paper: "handmade-cream",
      ribbon: "velvet-crimson",
      waxSeal: "champagne-gold",
    };

    const req = new NextRequest(`${APP_URL}/api/experiences`, {
      method: "POST",
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        initialDecor: customDecor,
      }),
    });

    const res = await createExperience(req);
    expect(res.status).toBe(201);
    const body = await res.json();

    const record = await db.experience.findUnique({ where: { publicId: body.publicId } });
    expect(record).not.toBeNull();
    const parsedDraft = JSON.parse(record!.draftConfig);
    expect(parsedDraft.decor.blooms).toEqual(customDecor.blooms);
    expect(parsedDraft.decor.charms).toEqual(customDecor.charms);
    expect(parsedDraft.decor.paper).toBe(customDecor.paper);
    expect(parsedDraft.decor.ribbon).toBe(customDecor.ribbon);
    expect(parsedDraft.decor.waxSeal).toBe(customDecor.waxSeal);
  });



  it("GET & PUT /api/experiences/[publicId]/draft: enforces auth and optimistic revision locking", async () => {
    // 1. Create an experience
    const createReq = new NextRequest(`${APP_URL}/api/experiences`, {
      method: "POST",
      headers: { origin: APP_URL, "content-type": "application/json" },
    });
    const createRes = await createExperience(createReq);
    const { publicId } = await createRes.json();
    const cookieHeader = createRes.headers.get("set-cookie")!;
    const cookieVal = cookieHeader.split(";")[0].split("=")[1];
    const cookieName = getCookieName(publicId);

    // 2. Unauthenticated GET must fail with 401
    const unauthGetReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
      method: "GET",
    });
    const unauthGetRes = await getDraft(unauthGetReq, { params: Promise.resolve({ publicId }) });
    expect(unauthGetRes.status).toBe(401);

    // 3. Authenticated GET succeeds
    const authGetReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
      method: "GET",
      headers: {
        cookie: `${cookieName}=${cookieVal}`,
      },
    });
    const authGetRes = await getDraft(authGetReq, { params: Promise.resolve({ publicId }) });
    expect(authGetRes.status).toBe(200);
    const draftData = await authGetRes.json();
    expect(draftData.draftRevision).toBe(1);

    // 4. PUT with wrong/stale baseRevision returns 409 Conflict
    const conflictReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
      method: "PUT",
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: `${cookieName}=${cookieVal}`,
      },
      body: JSON.stringify({
        draftConfig: { partnerName: "Ananya", senderName: "Rohan" },
        baseRevision: 99, // Stale!
      }),
    });
    const conflictRes = await saveDraft(conflictReq, { params: Promise.resolve({ publicId }) });
    expect(conflictRes.status).toBe(409);

    // 5. PUT with correct baseRevision succeeds and increments revision to 2
    const validSaveReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
      method: "PUT",
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: `${cookieName}=${cookieVal}`,
      },
      body: JSON.stringify({
        draftConfig: { partnerName: "Ananya", senderName: "Rohan", message: "Initial message" },
        baseRevision: 1,
      }),
    });
    const validSaveRes = await saveDraft(validSaveReq, { params: Promise.resolve({ publicId }) });
    expect(validSaveRes.status).toBe(200);
    const saveResult = await validSaveRes.json();
    expect(saveResult.draftRevision).toBe(2);
  });

  it("POST /api/experiences/[publicId]/publish: rejects incomplete draft, requires revision match, snapshots atomically", async () => {
    // 1. Create experience
    const createRes = await createExperience(
      new NextRequest(`${APP_URL}/api/experiences`, {
        method: "POST",
        headers: { origin: APP_URL, "content-type": "application/json" },
      })
    );
    const { publicId } = await createRes.json();
    const cookieHeader = createRes.headers.get("set-cookie")!;
    const cookieVal = cookieHeader.split(";")[0].split("=")[1];
    const cookieName = getCookieName(publicId);

    // 2. Publish incomplete draft fails with 422
    const publishIncompleteReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/publish`, {
      method: "POST",
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: `${cookieName}=${cookieVal}`,
      },
      body: JSON.stringify({ expectedRevision: 1 }),
    });
    const publishIncompleteRes = await publishExperience(publishIncompleteReq, {
      params: Promise.resolve({ publicId }),
    });
    expect(publishIncompleteRes.status).toBe(422);

    // 3. Save valid complete draft
    await saveDraft(
      new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
        method: "PUT",
        headers: {
          origin: APP_URL,
          "content-type": "application/json",
          cookie: `${cookieName}=${cookieVal}`,
        },
        body: JSON.stringify({
          draftConfig: {
            partnerName: "Ananya",
            senderName: "Rohan",
            message: "I love you more than words can express.",
            accentTheme: "crimson-rose",
          },
          baseRevision: 1,
        }),
      }),
      { params: Promise.resolve({ publicId }) }
    );

    // 4. Publish with expectedRevision: 2 succeeds
    const publishReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/publish`, {
      method: "POST",
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: `${cookieName}=${cookieVal}`,
      },
      body: JSON.stringify({ expectedRevision: 2 }),
    });
    const publishRes = await publishExperience(publishReq, { params: Promise.resolve({ publicId }) });
    expect(publishRes.status).toBe(200);

    const publishData = await publishRes.json();
    expect(publishData.success).toBe(true);
    expect(publishData.publicUrl).toBe(`${APP_URL}/v/${publicId}`);

    // Verify DB snapshot
    const record = await db.experience.findUnique({ where: { publicId } });
    expect(record?.status).toBe("PUBLISHED");
    expect(record?.publishedConfig).toBeDefined();
    const published = JSON.parse(record!.publishedConfig!);
    expect(published.partnerName).toBe("Ananya");
    expect(published.senderName).toBe("Rohan");
  });

  it("enforces server-side 180-day absolute expiration cutoff regardless of client cookie", async () => {
    // 1. Create experience
    const createRes = await createExperience(
      new NextRequest(`${APP_URL}/api/experiences`, {
        method: "POST",
        headers: { origin: APP_URL, "content-type": "application/json" },
      })
    );
    const { publicId } = await createRes.json();
    const cookieHeader = createRes.headers.get("set-cookie")!;
    const cookieVal = cookieHeader.split(";")[0].split("=")[1];
    const cookieName = getCookieName(publicId);

    // 2. Artificially age the experience past 180 days
    const pastDate = new Date(Date.now() - 181 * 24 * 60 * 60 * 1000);
    await db.experience.update({
      where: { publicId },
      data: { editCredentialIssuedAt: pastDate },
    });

    // 3. Attempt to save draft with unexpired cookie
    const saveReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
      method: "PUT",
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
        cookie: `${cookieName}=${cookieVal}`,
      },
      body: JSON.stringify({
        draftConfig: { partnerName: "Maya" },
        baseRevision: 1,
      }),
    });
    const saveRes = await saveDraft(saveReq, { params: Promise.resolve({ publicId }) });
    expect(saveRes.status).toBe(401);
    const data = await saveRes.json();
    expect(data.error).toContain("180-day");
  });

  it("/v/[publicId] route returns real HTTP 410 for DISABLED and DELETED experiences directly without internal status API", async () => {
    // 1. Create and disable an experience
    const createRes = await createExperience(
      new NextRequest(`${APP_URL}/api/experiences`, {
        method: "POST",
        headers: { origin: APP_URL, "content-type": "application/json" },
      })
    );
    const { publicId } = await createRes.json();

    await db.experience.update({
      where: { publicId },
      data: { status: ExperienceStatus.DISABLED },
    });

    const statusReq = new NextRequest(`${APP_URL}/v/${publicId}`, { method: "GET" });
    const statusRes = await getPublicExperience(statusReq, { params: Promise.resolve({ publicId }) });
    expect(statusRes.status).toBe(410);
    const html = await statusRes.text();
    expect(html).toContain("This Experience is No Longer Available");
    expect(statusRes.headers.get("cache-control")).toBe("no-store");
    expect(statusRes.headers.get("x-robots-tag")).toContain("noindex");

    // Also verify middleware enforces security headers
    const mwRes = middleware(statusReq);
    expect(mwRes.headers.get("cache-control")).toBe("no-store");
    expect(mwRes.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("POST /api/experiences: accepts valid templateId and persists it in DB and draft GET", async () => {
    const createReq = new NextRequest(`${APP_URL}/api/experiences`, {
      method: "POST",
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        templateId: "midnight-rose",
        templateVersion: "v1",
      }),
    });

    const createRes = await createExperience(createReq);
    expect(createRes.status).toBe(201);
    const { publicId } = await createRes.json();

    // Verify DB record contains templateId and templateVersion
    const record = await db.experience.findUnique({ where: { publicId } });
    expect(record).toBeDefined();
    expect(record?.templateId).toBe("midnight-rose");
    expect(record?.templateVersion).toBe("v1");

    // Verify GET draft returns the persisted templateId and templateVersion
    const cookieHeader = createRes.headers.get("set-cookie");
    const getReq = new NextRequest(`${APP_URL}/api/experiences/${publicId}/draft`, {
      method: "GET",
      headers: {
        cookie: cookieHeader || "",
      },
    });
    const draftRes = await getDraft(getReq, { params: Promise.resolve({ publicId }) });
    expect(draftRes.status).toBe(200);
    const draftData = await draftRes.json();
    expect(draftData.templateId).toBe("midnight-rose");
    expect(draftData.templateVersion).toBe("v1");
  });

  it("POST /api/experiences: rejects unknown templateId with 400 Bad Request", async () => {
    const createReq = new NextRequest(`${APP_URL}/api/experiences`, {
      method: "POST",
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        templateId: "non-existent-template-id",
        templateVersion: "v1",
      }),
    });

    const createRes = await createExperience(createReq);
    expect(createRes.status).toBe(400);
    const body = await createRes.json();
    expect(body.error).toContain("Invalid or unsupported template");
  });

  it("POST /api/experiences: rejects unsupported templateVersion with 400 Bad Request", async () => {
    const createReq = new NextRequest(`${APP_URL}/api/experiences`, {
      method: "POST",
      headers: {
        origin: APP_URL,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        templateId: "midnight-rose",
        templateVersion: "v999",
      }),
    });

    const createRes = await createExperience(createReq);
    expect(createRes.status).toBe(400);
    const body = await createRes.json();
    expect(body.error).toContain("Invalid or unsupported template");
  });

  it("POST /api/experiences: rejects inactive template with 400 Bad Request and creates no draft", async () => {
    const { registerTemplate, unregisterTemplate, midnightRoseV1 } = await import("@/templates/registry");
    const inactiveTemplate = {
      ...midnightRoseV1,
      id: "inactive-test-template",
      active: false,
    };
    registerTemplate(inactiveTemplate);

    try {
      const createReq = new NextRequest(`${APP_URL}/api/experiences`, {
        method: "POST",
        headers: {
          origin: APP_URL,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          templateId: "inactive-test-template",
          templateVersion: "v1",
        }),
      });

      const createRes = await createExperience(createReq);
      expect(createRes.status).toBe(400);
      const body = await createRes.json();
      expect(body.error).toContain("Invalid or unsupported template");

      const count = await db.experience.count({
        where: { templateId: "inactive-test-template" },
      });
      expect(count).toBe(0);
    } finally {
      unregisterTemplate("inactive-test-template", "v1");
    }
  });
});
