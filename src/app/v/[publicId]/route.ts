import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ExperienceStatus } from "@prisma/client";
import { sanitizeText } from "@/lib/sanitize";
import { getTemplateDefinition, midnightRoseV1 } from "@/templates/registry";
import {
  normalizeValentineDecor,
  getPaperOption,
  getRibbonOption,
  getSealOption,
  getBloomSlots,
  CHARM_POSITIONS,
  CURATED_FLOWERS,
  CURATED_CHARMS,
} from "@/types/decor";
import {
  renderModulesHtml,
  renderReactionsAndReplyHtml,
  renderPrintKeepsakeButton,
  PRINT_MEDIA_STYLES,
  getModulesClientScript,
} from "@/modules/ssrModules";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ publicId: string }>;
}

const COMMON_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
};

function render404Html(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Valentine Not Found — Valentino</title>
  <meta name="robots" content="noindex, nofollow" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0A090C;
      background-image: radial-gradient(ellipse at 50% 20%, #17151D 0%, #0A090C 80%, #050507 100%);
      color: #FAF8F5;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 1.5rem;
    }
    .card {
      max-width: 28rem;
      width: 100%;
      padding: 2.75rem 2rem;
      background: rgba(22, 20, 28, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    .icon { font-size: 2.5rem; margin-bottom: 1rem; }
    h1 {
      font-family: Georgia, Cambria, 'Times New Roman', serif;
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 500;
      color: #FAF8F5;
      letter-spacing: -0.02em;
    }
    p {
      font-size: 0.875rem;
      color: #9A94A7;
      margin-bottom: 1.75rem;
      line-height: 1.6;
      font-weight: 300;
    }
    a {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #FAF8F5 0%, #E5DFC9 100%);
      color: #0A090C;
      text-decoration: none;
      box-shadow: 0 10px 20px -5px rgba(255, 255, 255, 0.12);
      transition: all 0.2s ease;
    }
    a:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="card" data-testid="not-found-404-container">
    <div class="icon">🔍</div>
    <h1>Valentine Not Found</h1>
    <p>This Valentine link doesn't exist or has not been published yet.</p>
    <a href="/create">Create Your Own Valentine</a>
  </div>
</body>
</html>`;
}

function render410Html(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Valentine Retired — Valentino</title>
  <meta name="robots" content="noindex, nofollow" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0A090C;
      background-image: radial-gradient(ellipse at 50% 20%, #17151D 0%, #0A090C 80%, #050507 100%);
      color: #FAF8F5;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 1.5rem;
    }
    .card {
      max-width: 28rem;
      width: 100%;
      padding: 2.75rem 2rem;
      background: rgba(22, 20, 28, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    .icon { font-size: 2.5rem; margin-bottom: 1rem; }
    h1 {
      font-family: Georgia, Cambria, 'Times New Roman', serif;
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 500;
      color: #FAF8F5;
      letter-spacing: -0.02em;
    }
    p {
      font-size: 0.875rem;
      color: #9A94A7;
      margin-bottom: 1.75rem;
      line-height: 1.6;
      font-weight: 300;
    }
    a {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #FAF8F5 0%, #E5DFC9 100%);
      color: #0A090C;
      text-decoration: none;
      box-shadow: 0 10px 20px -5px rgba(255, 255, 255, 0.12);
      transition: all 0.2s ease;
    }
    a:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="card" data-testid="gone-410-container">
    <div class="icon">🥀</div>
    <h1>This Experience is No Longer Available</h1>
    <p>The creator has removed or disabled this Valentine.</p>
    <a href="/create">Create Your Own Valentine</a>
  </div>
</body>
</html>`;
}

function renderLockedCountdownHtml(unlockAt: Date, publicId: string): string {
  const targetIso = unlockAt.toISOString();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>A Valentine Sealed in Time — Valentino</title>
  <meta name="robots" content="noindex, nofollow" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0A090C;
      background-image: radial-gradient(ellipse at 50% 20%, #1c0f18 0%, #0A090C 80%, #050406 100%);
      color: #FAF8F5;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 1.5rem;
    }
    .countdown-card {
      max-width: 32rem;
      width: 100%;
      padding: 3rem 2rem;
      background: rgba(26, 12, 22, 0.88);
      border: 1px solid rgba(244, 63, 94, 0.3);
      border-radius: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(225, 29, 72, 0.15);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      background: rgba(225, 29, 72, 0.2);
      border: 1px solid rgba(251, 113, 133, 0.4);
      color: #FDA4AF;
      margin-bottom: 1.25rem;
    }
    .lock-icon { font-size: 3rem; margin-bottom: 0.75rem; animation: pulse 3s infinite ease-in-out; }
    h1 {
      font-family: Georgia, serif;
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
      color: #FAF8F5;
      font-weight: 400;
    }
    p.desc {
      font-size: 0.875rem;
      color: #D5CEBF;
      font-style: italic;
      margin-bottom: 2rem;
      line-height: 1.5;
    }
    .timer-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-bottom: 2rem;
    }
    .timer-unit {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 0.85rem 0.25rem;
    }
    .unit-value {
      display: block;
      font-size: 1.75rem;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: #FDA4AF;
      font-family: system-ui, sans-serif;
    }
    .unit-label {
      display: block;
      font-size: 0.65rem;
      color: rgba(250, 248, 245, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 0.25rem;
    }
    .note {
      font-size: 0.75rem;
      color: rgba(250, 248, 245, 0.5);
      letter-spacing: 0.05em;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.05); opacity: 1; }
    }
  </style>
</head>
<body>
  <div class="countdown-card" data-testid="scheduled-countdown-container" data-unlock-iso="${targetIso}">
    <div class="badge">✦ TIME-LOCKED VALENTINE — sealed until appointed date ✦</div>
    <div class="lock-icon">🔒</div>
    <h1>TIME-LOCKED VALENTINE</h1>
    <p class="desc">This Valentine is sealed until the appointed hour and will reveal its contents automatically.</p>

    <div class="timer-grid">
      <div class="timer-unit">
        <span class="unit-value" data-testid="countdown-days" id="cd-days">00</span>
        <span class="unit-label">Days</span>
      </div>
      <div class="timer-unit">
        <span class="unit-value" data-testid="countdown-hours" id="cd-hours">00</span>
        <span class="unit-label">Hours</span>
      </div>
      <div class="timer-unit">
        <span class="unit-value" data-testid="countdown-minutes" id="cd-minutes">00</span>
        <span class="unit-label">Mins</span>
      </div>
      <div class="timer-unit">
        <span class="unit-value" data-testid="countdown-seconds" id="cd-seconds">00</span>
        <span class="unit-label">Secs</span>
      </div>
    </div>

    <div class="note">✦ Automatically unseals when the countdown completes ✦</div>
  </div>

  <script>
    (function() {
      var targetTime = new Date("${targetIso}").getTime();
      function update() {
        var now = Date.now();
        var diff = targetTime - now;
        if (diff <= 0) {
          window.location.reload();
          return;
        }
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);

        var dEl = document.getElementById("cd-days");
        var hEl = document.getElementById("cd-hours");
        var mEl = document.getElementById("cd-minutes");
        var sEl = document.getElementById("cd-seconds");

        if (dEl) dEl.textContent = String(days).padStart(2, "0");
        if (hEl) hEl.textContent = String(hours).padStart(2, "0");
        if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
        if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
      }
      update();
      setInterval(update, 1000);
    })();
  </script>
</body>
</html>`;
}

interface PublishedConfig {
  partnerName?: string;
  senderName?: string;
  greeting?: string;
  message?: string;
  signOff?: string;
  accentTheme?: string;
  heroMediaId?: string | null;
  decor?: unknown;
  modules?: any;
  moduleOrder?: string[];
  soundtrackUrl?: string | null;
}

const ACCENTS: Record<
  string,
  {
    glow: string;
    sealBg: string;
    sealBorder: string;
    sealShadow: string;
    border: string;
    badge: string;
    accentText: string;
    paperAccent: string;
  }
> = {
  "crimson-rose": {
    glow: "radial-gradient(circle at center, rgba(225, 29, 72, 0.22) 0%, rgba(219, 39, 119, 0.1) 45%, transparent 70%)",
    sealBg: "linear-gradient(135deg, #E11D48 0%, #BE123C 60%, #881337 100%)",
    sealBorder: "#FB7185",
    sealShadow: "0 0 35px rgba(225, 29, 72, 0.4), 0 12px 24px rgba(0, 0, 0, 0.6)",
    border: "rgba(244, 63, 94, 0.25)",
    badge: "color: #FDA4AF; background: rgba(76, 5, 25, 0.6); border: 1px solid rgba(159, 18, 57, 0.5);",
    accentText: "#FDA4AF",
    paperAccent: "#9F1239",
  },
  "midnight-violet": {
    glow: "radial-gradient(circle at center, rgba(147, 51, 234, 0.22) 0%, rgba(79, 70, 229, 0.1) 45%, transparent 70%)",
    sealBg: "linear-gradient(135deg, #9333EA 0%, #7E22CE 60%, #581C87 100%)",
    sealBorder: "#C084FC",
    sealShadow: "0 0 35px rgba(147, 51, 234, 0.4), 0 12px 24px rgba(0, 0, 0, 0.6)",
    border: "rgba(168, 85, 247, 0.25)",
    badge: "color: #D8B4FE; background: rgba(59, 7, 100, 0.6); border: 1px solid rgba(107, 33, 168, 0.5);",
    accentText: "#D8B4FE",
    paperAccent: "#6B21A8",
  },
  "champagne-gold": {
    glow: "radial-gradient(circle at center, rgba(217, 119, 6, 0.22) 0%, rgba(202, 138, 4, 0.1) 45%, transparent 70%)",
    sealBg: "linear-gradient(135deg, #F59E0B 0%, #D97706 60%, #78350F 100%)",
    sealBorder: "#FBBF24",
    sealShadow: "0 0 35px rgba(217, 119, 6, 0.35), 0 12px 24px rgba(0, 0, 0, 0.6)",
    border: "rgba(245, 158, 11, 0.25)",
    badge: "color: #FDE68A; background: rgba(69, 26, 3, 0.6); border: 1px solid rgba(146, 64, 14, 0.5);",
    accentText: "#FDE68A",
    paperAccent: "#92400E",
  },
};

function renderPublicHtml(config: PublishedConfig, publicId: string = ""): string {
  const theme = ACCENTS[config.accentTheme || "crimson-rose"] || ACCENTS["crimson-rose"];
  const greeting = sanitizeText(config.greeting || "To My Favorite Person");
  const partnerName = sanitizeText(config.partnerName || "Dearest");
  const message = sanitizeText(config.message || "My heart is fuller every day because of you.");
  const signOff = sanitizeText(config.signOff || "With all my love");
  const senderName = sanitizeText(config.senderName || "Yours Always");

  const modulesHtml = renderModulesHtml(config.modules, config.moduleOrder, publicId, (config as any).narrative);
  const interactionsHtml = renderReactionsAndReplyHtml(publicId);
  const printKeepsakeBtn = renderPrintKeepsakeButton();

  const decor = normalizeValentineDecor(config.decor);
  const paper = getPaperOption(decor.paper);
  const ribbon = getRibbonOption(decor.ribbon);
  const seal = getSealOption(decor.waxSeal);
  const bloomSlots = getBloomSlots(decor.blooms.length);

  const bloomsHtml = decor.blooms
    .map((bloomId, index) => {
      const flower = CURATED_FLOWERS.find((f) => f.id === bloomId);
      if (!flower) return "";
      const slot = bloomSlots[index % bloomSlots.length];
      return `<div class="bouquet-bloom" data-decor-bloom="${flower.id}" style="transform: translate(${slot.x}px, ${slot.y}px) rotate(${slot.rotate}deg) scale(${slot.scale}); z-index: ${slot.zIndex};"><span class="bloom-emoji">${flower.emoji}</span></div>`;
    })
    .join("\n");

  const charmsHtml = decor.charms
    .map((charmId, index) => {
      const charm = CURATED_CHARMS.find((c) => c.id === charmId);
      if (!charm) return "";
      const pos = CHARM_POSITIONS[index % CHARM_POSITIONS.length];
      return `<div class="orbiting-charm" data-decor-charm="${charm.id}" style="transform: translate(${pos.x}px, ${pos.y}px);"><span class="charm-emoji">${charm.emoji}</span></div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>A Valentine for ${partnerName} — Valentino</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta property="og:title" content="A Valentine Experience" />
  <meta property="og:description" content="A personal, romantic Valentine experience." />
  <meta property="og:type" content="website" />
  <link rel="icon" href="/favicon.ico" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      min-height: 100vh;
      overflow-x: hidden;
      background: #12030A;
      background-image: radial-gradient(ellipse at 50% 15%, #2A0815 0%, #12030A 70%, #080104 100%);
      color: #FAF8F5;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
    }
    .wrapper {
      position: relative;
      min-height: 100vh;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1rem;
      overflow-x: hidden;
    }
    .ambient-glow {
      position: absolute;
      inset: 0;
      background: ${theme.glow};
      pointer-events: none;
      opacity: 0.65;
    }
    .deep-bg-layer {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(ellipse at 50% 15%, #18030E 0%, #0D0207 60%, #050103 100%);
    }
    .distant-env-layer {
      position: fixed;
      inset: 0;
      z-index: 1;
      pointer-events: none;
    }
    .moonbeam-cone {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 70% 85% at 50% -5%, rgba(255, 245, 235, 0.12) 0%, rgba(244, 63, 94, 0.08) 45%, transparent 80%);
    }
    .garden-silhouette {
      position: absolute;
      bottom: 0;
      inset-x: 0;
      height: 12rem;
      opacity: 0.25;
      background: radial-gradient(ellipse at 50% 100%, rgba(24, 4, 16, 0.95) 0%, rgba(13, 2, 7, 0.7) 60%, transparent 100%);
    }
    .atmosphere-layer {
      position: fixed;
      inset: 0;
      z-index: 2;
      pointer-events: none;
    }
    .midnight-mist {
      position: absolute;
      bottom: 0;
      left: -10%;
      right: -10%;
      height: 380px;
      background: radial-gradient(ellipse at 50% 100%, rgba(225, 29, 72, 0.12) 0%, rgba(136, 19, 55, 0.06) 50%, transparent 80%);
      filter: blur(20px);
    }
    .foreground-wrap-layer {
      position: fixed;
      inset: 0;
      z-index: 20;
      pointer-events: none;
      opacity: 0.6;
      background: radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.6) 100%);
    }
    .content-container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 32rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .bouquet-bloom {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35));
      pointer-events: none;
    }
    .bloom-emoji {
      font-size: 2.25rem;
      user-select: none;
    }
    .orbiting-charm {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 4px 10px rgba(244, 63, 94, 0.4));
      pointer-events: none;
      z-index: 25;
    }
    .charm-emoji {
      font-size: 1.5rem;
      user-select: none;
    }
    .ribbon-band {
      position: absolute;
      left: -24px;
      right: -24px;
      height: 2.25rem;
      background: ${ribbon.inlineGradient};
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      z-index: 1;
    }
    @media (min-width: 640px) {
      .ribbon-band { left: -40px; right: -40px; }
    }
    .ribbon-stitch-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1.5px;
      background: ${ribbon.inlineStitch};
    }
    .ribbon-stitch-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1.5px;
      background: ${ribbon.inlineStitch};
    }
    .ribbon-text {
      font-size: 0.55rem;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      font-family: system-ui, sans-serif;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      user-select: none;
    }
    .card {
      width: 100%;
      border-radius: 1.75rem;
      background: rgba(28, 5, 18, 0.88);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid ${theme.border};
      padding: 2.5rem 1.75rem;
      box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    @media (min-width: 640px) {
      .card { padding: 3rem 2.5rem; }
    }
    .header { text-align: center; margin-bottom: 2rem; }
    .badge {
      display: inline-block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      padding: 0.3rem 0.85rem;
      border-radius: 9999px;
      margin-bottom: 1rem;
      ${theme.badge}
    }
    h1 {
      font-family: Georgia, Cambria, 'Times New Roman', serif;
      font-size: 2rem;
      font-weight: 500;
      color: #FFFFFF;
      letter-spacing: 0.02em;
      line-height: 1.25;
    }
    @media (min-width: 640px) {
      h1 { font-size: 2.5rem; }
    }
    .seal-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      text-align: center;
    }
    .seal-wrapper {
      position: relative;
    }
    .pulse-halo {
      position: absolute;
      inset: -0.75rem;
      border-radius: 9999px;
      background: rgba(225, 29, 72, 0.2);
      filter: blur(8px);
      animation: pulseHalo 3s infinite ease-in-out;
    }
    @keyframes pulseHalo {
      0%, 100% { opacity: 0.4; transform: scale(0.98); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    .wax-seal {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 6.5rem;
      height: 6.5rem;
      min-width: 44px;
      min-height: 44px;
      border-radius: 9999px;
      border: 2px solid ${seal.inlineBorder};
      background: ${seal.inlineGradient};
      box-shadow: ${theme.sealShadow};
      cursor: pointer;
      outline: none;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .wax-seal:hover { transform: scale(1.06); }
    .wax-seal:active { transform: scale(0.95); }
    .wax-seal-inner {
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.15);
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
    }
    .wax-seal .emoji {
      font-size: 2.25rem;
      user-select: none;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
    }
    .seal-label {
      position: absolute;
      bottom: -2rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      color: #D5CEBF;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      white-space: nowrap;
      font-family: system-ui, sans-serif;
      font-weight: 500;
    }
    .letter-box {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      color: #2C0D17;
      line-height: 1.8;
      font-size: 1.05rem;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.35s ease-out forwards;
    }
    .paper-card {
      position: relative;
      background: ${paper.inlineBg};
      color: ${paper.inlineText};
      border: 1px solid ${paper.inlineBorder};
      border-radius: 1.25rem;
      padding: 2rem 1.75rem;
      box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.45);
      overflow: hidden;
      transition: all 0.5s ease-out;
    }
    @media (min-width: 640px) {
      .paper-card { padding: 2.5rem 2.25rem; }
    }
    .paper-gold-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent);
    }
    .message-card {
      white-space: pre-wrap;
      font-family: Georgia, Cambria, 'Times New Roman', serif;
      font-size: 1.125rem;
      line-height: 1.85;
      color: ${paper.inlineText};
      font-weight: 400;
      position: relative;
      z-index: 2;
    }
    .signoff-box {
      text-align: right;
      padding-top: 1.5rem;
      margin-top: 1.5rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 2;
    }
    .signoff-label {
      font-size: 0.75rem;
      opacity: 0.7;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 0.35rem;
      font-family: system-ui, sans-serif;
    }
    .sender-title {
      font-family: Georgia, Cambria, 'Times New Roman', serif;
      font-size: 1.6rem;
      font-weight: 600;
      color: ${theme.paperAccent};
    }
    .hidden { display: none !important; }
    @media (prefers-reduced-motion: reduce) {
      html, body {
        scroll-behavior: auto !important;
      }
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      .pulse-halo { display: none; }
    }
    ${PRINT_MEDIA_STYLES}
  </style>
  <noscript>
    <style>
      .seal-box { display: none !important; }
      .letter-box { display: flex !important; opacity: 1 !important; transform: none !important; }
      #reseal-btn { display: none !important; }
    </style>
  </noscript>
</head>
<body>
  <div class="wrapper" data-dimensional-world="midnight-rose" data-scene="welcome" data-testid="experience-container">
    <div data-layer="0-deep-background" class="deep-bg-layer" aria-hidden="true"></div>
    <div data-layer="1-distant-environment" class="distant-env-layer" aria-hidden="true">
      <div class="moonbeam-cone"></div>
      <div class="garden-silhouette"></div>
    </div>
    <div data-layer="2-atmosphere" class="atmosphere-layer" aria-hidden="true">
      <div class="midnight-mist"></div>
    </div>
    <div class="ambient-glow"></div>

    <!-- Top Navigation / Controls Bar -->
    <div style="position: relative; z-index: 30; width: 100%; max-width: 32rem; margin: 0 auto 1rem auto; display: flex; align-items: center; justify-content: space-between; padding: 0 0.5rem;">
      <div style="font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(254,205,211,0.5); font-family: system-ui, sans-serif;">
        Private Correspondence
      </div>
      <button
        type="button"
        id="soundtrack-toggle"
        data-soundtrack-url="${sanitizeText(config.soundtrackUrl || "")}"
        aria-label="Play romantic soundtrack"
        style="display: flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.85rem; border-radius: 9999px; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; font-family: system-ui, sans-serif; border: 1px solid rgba(244,63,94,0.4); background: rgba(76,5,25,0.6); color: #FDA4AF; backdrop-filter: blur(8px); cursor: pointer; transition: all 0.3s;"
      >
        <span style="font-size: 0.8rem;">♡</span>
        <span>Our Song</span>
      </button>
    </div>

    <div data-layer="4-primary-story" class="content-container">
      <div class="blooms-container" style="position: absolute; top: 120px; left: 0; right: 0; height: 0; pointer-events: none; z-index: 20; display: flex; align-items: center; justify-content: center;">
        ${bloomsHtml}
        ${charmsHtml}
      </div>
      <div class="card" data-decor-paper="${paper.id}" style="position: relative; z-index: 10;">
        <div class="header">
          <span class="badge">${greeting}</span>
          <h1 data-testid="recipient-name">${partnerName}</h1>
        </div>

        <div class="seal-box" data-testid="seal-container" style="position: relative;">
          <div class="ribbon-band" data-decor-ribbon="${ribbon.id}">
            <div class="ribbon-stitch-top"></div>
            <div class="ribbon-stitch-bottom"></div>
            <span class="ribbon-text">SEALED</span>
            <span class="ribbon-text">WITH DEVOTION</span>
          </div>

          <div class="seal-wrapper" style="position: relative; z-index: 10; margin: 1rem 0;">
            <div class="pulse-halo"></div>
            <button
              type="button"
              class="wax-seal"
              data-testid="wax-seal-button"
              data-decor-seal="${seal.id}"
              aria-label="Break the wax seal to read letter"
            >
              <div class="wax-seal-inner">
                <span class="emoji">${seal.emblem}</span>
              </div>
              <span class="seal-label">Tap to open</span>
            </button>
          </div>
        </div>

        <div class="letter-box hidden" data-testid="unsealed-letter">
          <div class="paper-card">
            <div class="paper-gold-line"></div>

            <!-- Read Aloud Speech Synthesis Button -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 0.75rem;">
              <button
                type="button"
                id="read-aloud-btn"
                data-testid="read-aloud-btn"
                aria-label="Listen to Letter"
                style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; color: #9F1239; background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.25); cursor: pointer; transition: all 0.2s;"
              >
                <span>🔊</span> <span>Listen to Letter</span>
              </button>
            </div>

            <div class="message-card" data-testid="letter-message">${message}</div>
            <div class="signoff-box">
              <div class="signoff-label">${signOff}</div>
              <div class="sender-title" data-testid="sender-name">${senderName}</div>
            </div>
          </div>

          ${
            config.heroMediaId
              ? `
          <div class="memory-card" style="margin-top: 1.25rem;">
            <div style="background: #FAF8F5; padding: 0.85rem; border-radius: 0.85rem; box-shadow: 0 16px 36px rgba(0,0,0,0.55); border: 1px solid rgba(255,255,255,0.8); transform: rotate(-1deg); max-width: 22rem; margin: 0 auto;">
              <div style="width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 0.5rem; background: #eee;">
                <img src="${sanitizeText(config.heroMediaId)}" alt="A Cherished Moment" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div style="text-align: center; padding-top: 0.65rem; font-family: Georgia, serif; font-style: italic; font-size: 0.8rem; color: #57534E;">
                A memory kept forever close
              </div>
            </div>
          </div>
          `
              : ""
          }

          ${modulesHtml}

          ${interactionsHtml}

          ${printKeepsakeBtn}

          <div class="closing-scene" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.85rem;">
            <div style="width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(244,63,94,0.3), transparent);"></div>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: rgba(254,205,211,0.6); letter-spacing: 0.15em; text-transform: uppercase;">
              <span>✦</span>
              <span>Midnight Rose Keepsake</span>
              <span>✦</span>
            </div>
            <button
              type="button"
              id="reseal-btn"
              data-testid="reseal-button"
              aria-label="Seal & Read Again"
              style="padding: 0.35rem 1rem; border-radius: 9999px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(254,205,211,0.8); background: rgba(76,5,25,0.5); border: 1px solid rgba(244,63,94,0.3); cursor: pointer; transition: all 0.3s;"
            >
              Seal & Read Again
            </button>
          </div>
        </div>
      </div>
    </div>
    <div data-layer="5-foreground-wrap" class="foreground-wrap-layer" aria-hidden="true"></div>
  </div>

  <script>
    (function() {
      function setup() {
        var sealBox = document.querySelector('[data-testid="seal-container"]');
        var letterBox = document.querySelector('[data-testid="unsealed-letter"]');
        var sealBtn = document.querySelector('[data-testid="wax-seal-button"]');
        var resealBtn = document.getElementById('reseal-btn');
        var musicBtn = document.getElementById('soundtrack-toggle');
        if (!sealBox || !letterBox) return;

        function unseal() {
          sealBox.classList.add('hidden');
          letterBox.classList.remove('hidden');
          letterBox.classList.add('animate-fadeIn');
        }

        function reseal() {
          letterBox.classList.add('hidden');
          letterBox.classList.remove('animate-fadeIn');
          sealBox.classList.remove('hidden');
        }

        var mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mql.matches) {
          unseal();
        }
        mql.addEventListener('change', function(e) {
          if (e.matches) unseal();
        });

        if (sealBtn) sealBtn.addEventListener('click', unseal);
        if (resealBtn) resealBtn.addEventListener('click', reseal);

        // Ambient soundscape Web Audio or custom audio toggle
        var audioCtx = null;
        var isPlaying = false;
        var oscs = [];
        var gainNode = null;
        var customAudio = null;

        if (musicBtn) {
          var customUrl = musicBtn.getAttribute('data-soundtrack-url');
          if (customUrl) {
            customAudio = new Audio(customUrl);
            customAudio.loop = true;
          }

          musicBtn.addEventListener('click', function() {
            if (customAudio) {
              if (isPlaying) {
                customAudio.pause();
                isPlaying = false;
                musicBtn.setAttribute('aria-label', 'Play romantic soundtrack');
              } else {
                customAudio.play().then(function() {
                  isPlaying = true;
                  musicBtn.setAttribute('aria-label', 'Mute romantic soundtrack');
                }).catch(function(){});
              }
              return;
            }

            if (isPlaying) {
              if (gainNode && audioCtx) {
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
                setTimeout(function() {
                  oscs.forEach(function(o) { try { o.stop(); o.disconnect(); } catch(e){} });
                  oscs = [];
                  isPlaying = false;
                  musicBtn.setAttribute('aria-label', 'Play romantic soundtrack');
                }, 300);
              } else {
                isPlaying = false;
                musicBtn.setAttribute('aria-label', 'Play romantic soundtrack');
              }
              return;
            }

            try {
              var AudioCtx = window.AudioContext || window.webkitAudioContext;
              if (!AudioCtx) return;
              audioCtx = audioCtx || new AudioCtx();
              if (audioCtx.state === 'suspended') audioCtx.resume();

              var master = audioCtx.createGain();
              master.gain.setValueAtTime(0.001, audioCtx.currentTime);
              master.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 1.0);
              master.connect(audioCtx.destination);
              gainNode = master;

              [220, 277.18, 329.63].forEach(function(f) {
                var o = audioCtx.createOscillator();
                o.type = 'sine';
                o.frequency.setValueAtTime(f, audioCtx.currentTime);
                o.connect(master);
                o.start();
                oscs.push(o);
              });

              isPlaying = true;
              musicBtn.setAttribute('aria-label', 'Mute romantic soundtrack');
            } catch(e) {
              isPlaying = false;
            }
          });
        }

        // Quiz interactions
        var quizOptBtns = document.querySelectorAll('.quiz-opt-btn');
        var feedbackPill = document.getElementById('quiz-feedback');
        var nextBtn = document.getElementById('quiz-next');
        if (quizOptBtns.length > 0) {
          quizOptBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
              if (feedbackPill) feedbackPill.classList.remove('hidden');
              if (nextBtn) nextBtn.classList.remove('hidden');
            });
          });
        }

        // Tap-to-Reveal Secret (non-question locked)
        var revealSecretBtn = document.getElementById('reveal-secret-btn');
        var revealedSecretEl = document.getElementById('revealed-secret');
        if (revealSecretBtn && revealedSecretEl) {
          revealSecretBtn.addEventListener('click', function() {
            revealSecretBtn.disabled = true;
            revealSecretBtn.textContent = 'Unfolding secret...';
            fetch('/api/experiences/' + encodeURIComponent('${publicId}') + '/secret')
              .then(function(res) { return res.json(); })
              .then(function(data) {
                if (data.secretContent) {
                  revealedSecretEl.textContent = data.secretContent;
                  revealedSecretEl.classList.remove('hidden');
                  revealSecretBtn.classList.add('hidden');
                } else {
                  revealSecretBtn.disabled = false;
                  revealSecretBtn.textContent = 'Tap to Reveal Secret';
                }
              })
              .catch(function() {
                revealSecretBtn.disabled = false;
                revealSecretBtn.textContent = 'Retry reveal';
              });
          });
        }

        ${getModulesClientScript(publicId)}
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
      } else {
        setup();
      }
    })();
  </script>
</body>
</html>`;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { publicId } = await params;

  let experience;
  try {
    experience = await db.experience.findUnique({
      where: { publicId },
    });
  } catch (err) {
    console.error("Database lookup error in /v/[publicId]:", err);
    return new NextResponse(render404Html(), { status: 404, headers: COMMON_HEADERS });
  }

  // 1. Unknown experiences return real HTTP 404
  if (!experience) {
    return new NextResponse(render404Html(), { status: 404, headers: COMMON_HEADERS });
  }

  // 2. Disabled or Deleted experiences return real HTTP 410 Gone
  if (experience.status === ExperienceStatus.DISABLED || experience.status === ExperienceStatus.DELETED) {
    return new NextResponse(render410Html(), { status: 410, headers: COMMON_HEADERS });
  }

  // 3. Draft-only (unpublished) experiences return real HTTP 404
  if (experience.status === ExperienceStatus.DRAFT || !experience.publishedConfig) {
    return new NextResponse(render404Html(), { status: 404, headers: COMMON_HEADERS });
  }

  // 4. Server-Enforced Scheduled Reveal: if locked in the future, render locked countdown view
  if (experience.scheduledUnlockAt) {
    const unlockTime = new Date(experience.scheduledUnlockAt).getTime();
    if (Date.now() < unlockTime) {
      return new NextResponse(renderLockedCountdownHtml(experience.scheduledUnlockAt, publicId), {
        status: 200,
        headers: COMMON_HEADERS,
      });
    }
  }

  // 5. Published experience renders with real HTTP 200 OK
  if (experience.status === ExperienceStatus.PUBLISHED) {
    let rawConfig: unknown;
    try {
      rawConfig = JSON.parse(experience.publishedConfig);
    } catch {
      return new NextResponse(render404Html(), { status: 404, headers: COMMON_HEADERS });
    }

    const template = getTemplateDefinition(experience.templateId, experience.templateVersion) || midnightRoseV1;
    const config = template.normalizeConfig(rawConfig, true);

    if (template.renderSsrHtml) {
      return new NextResponse(template.renderSsrHtml(config, publicId), { status: 200, headers: COMMON_HEADERS });
    }

    return new NextResponse(renderPublicHtml(config as PublishedConfig, publicId), { status: 200, headers: COMMON_HEADERS });
  }

  return new NextResponse(render404Html(), { status: 404, headers: COMMON_HEADERS });
}
