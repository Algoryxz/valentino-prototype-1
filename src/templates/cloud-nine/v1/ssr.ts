import { sanitizeText } from "@/lib/sanitize";
import { CloudNinePublishedConfig } from "./schema";
import { resolveTemplateDecor } from "../../shared/compatibility";
import {
  renderModulesHtml,
  renderReactionsAndReplyHtml,
  renderPrintKeepsakeButton,
  PRINT_MEDIA_STYLES,
  getModulesClientScript,
} from "@/modules/ssrModules";
import { getPublicSharingMetaHtml } from "@/lib/metadata";

const THEME_ACCENTS: Record<
  string,
  {
    glow: string;
    border: string;
    badgeStyle: string;
    accentText: string;
    musicBtnStyle: string;
  }
> = {
  "blush-sky": {
    glow: "radial-gradient(circle at center, rgba(244, 114, 182, 0.25) 0%, rgba(186, 230, 253, 0.2) 50%, transparent 75%)",
    border: "rgba(244, 114, 182, 0.3)",
    badgeStyle: "color: #831843; background: rgba(253, 242, 248, 0.9); border: 1px solid rgba(244, 114, 182, 0.4);",
    accentText: "#BE185D",
    musicBtnStyle: "background: rgba(255, 255, 255, 0.85); border: 1px solid rgba(244, 114, 182, 0.4); color: #831843;",
  },
  "peach-sorbet": {
    glow: "radial-gradient(circle at center, rgba(254, 215, 170, 0.3) 0%, rgba(254, 205, 211, 0.25) 50%, transparent 75%)",
    border: "rgba(251, 146, 60, 0.3)",
    badgeStyle: "color: #7C2D12; background: rgba(255, 247, 237, 0.9); border: 1px solid rgba(251, 146, 60, 0.4);",
    accentText: "#C2410C",
    musicBtnStyle: "background: rgba(255, 255, 255, 0.85); border: 1px solid rgba(251, 146, 60, 0.4); color: #7C2D12;",
  },
  "lavender-mist": {
    glow: "radial-gradient(circle at center, rgba(233, 213, 255, 0.3) 0%, rgba(224, 231, 255, 0.25) 50%, transparent 75%)",
    border: "rgba(192, 132, 252, 0.3)",
    badgeStyle: "color: #581C87; background: rgba(250, 245, 255, 0.9); border: 1px solid rgba(192, 132, 252, 0.4);",
    accentText: "#7E22CE",
    musicBtnStyle: "background: rgba(255, 255, 255, 0.85); border: 1px solid rgba(192, 132, 252, 0.4); color: #581C87;",
  },
};

export function renderCloudNineSsrHtml(config: CloudNinePublishedConfig, publicId: string = ""): string {
  const theme = THEME_ACCENTS[config.accentTheme || "blush-sky"] || THEME_ACCENTS["blush-sky"];
  const greeting = sanitizeText(config.greeting || "To My Sweetest Soul");
  const partnerName = sanitizeText(config.partnerName || "Dearest");
  const message = sanitizeText(config.message || "You lift my spirits into the clouds, making every day feel like sweet magic.");
  const signOff = sanitizeText(config.signOff || "Forever in the clouds");
  const senderName = sanitizeText(config.senderName || "Yours in Starlight");

  const modulesHtml = renderModulesHtml(config.modules, config.moduleOrder, publicId);
  const interactionsHtml = renderReactionsAndReplyHtml(publicId);
  const printKeepsakeBtn = renderPrintKeepsakeButton();

  const presentation = resolveTemplateDecor(config.decor, "cloud-nine");
  const { paper, ribbon, waxSeal, blooms, charms } = presentation;

  const bloomsHtml = blooms
    .map((b) => {
      return `<div class="bouquet-bloom" data-decor-bloom="${b.option.id}" style="transform: translate(${b.slot.x}px, ${b.slot.y}px) rotate(${b.slot.rotate}deg) scale(${b.slot.scale}); z-index: ${b.slot.zIndex};"><span class="bloom-emoji">${b.option.emoji}</span></div>`;
    })
    .join("\n");

  const charmsHtml = charms
    .map((c) => {
      return `<div class="orbiting-charm" data-decor-charm="${c.option.id}" style="transform: translate(${c.pos.x}px, ${c.pos.y}px);"><span class="charm-emoji">${c.option.emoji}</span></div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>A Valentine Experience — Valentino</title>
  ${getPublicSharingMetaHtml(publicId, "A dreamy celestial Valentine experience.")}
  <link rel="icon" href="/favicon.ico" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      min-height: 100vh;
      overflow-x: hidden;
      background: #FFF5F7;
      background-image: radial-gradient(ellipse at 50% 15%, rgba(251, 207, 232, 0.7) 0%, rgba(240, 249, 255, 0.5) 50%, #FFF5F7 100%);
      color: #4A1D2F;
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
      justify-content: space-between;
      padding: 1.5rem 1rem;
      overflow-x: hidden;
    }
    .ambient-glow {
      position: absolute;
      inset: 0;
      background: ${theme.glow};
      pointer-events: none;
      opacity: 0.7;
    }
    .deep-bg-layer {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(ellipse at 50% 15%, #FFF5F7 0%, #FFEBF2 45%, #FDE2ED 75%, #FBCFE8 100%);
    }
    .distant-env-layer {
      position: fixed;
      inset: -5% -5% auto -5%;
      height: 115%;
      z-index: 1;
      pointer-events: none;
      opacity: 0.35;
      background-image: url('/clouds/sunset-sky.jpg');
      background-size: cover;
      background-position: center;
      mix-blend-mode: soft-light;
      filter: blur(1px);
    }
    .atmosphere-layer {
      position: fixed;
      inset: 0;
      z-index: 2;
      pointer-events: none;
    }
    .atmosphere-mist {
      position: absolute;
      top: 15%;
      left: -10%;
      right: -10%;
      height: 550px;
      background: radial-gradient(ellipse 65% 50% at 50% 50%, rgba(255, 255, 255, 0.85) 0%, rgba(254, 215, 226, 0.45) 45%, transparent 75%);
      filter: blur(28px);
    }
    .foreground-wrap-layer {
      position: fixed;
      inset: 0;
      z-index: 20;
      pointer-events: none;
      opacity: 0.35;
      mix-blend-mode: soft-light;
      background: radial-gradient(circle at center, transparent 65%, rgba(251, 207, 232, 0.6) 100%);
    }
    .top-bar {
      position: relative;
      z-index: 30;
      width: 100%;
      max-width: 32rem;
      margin: 0 auto 1rem auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.5rem;
    }
    .top-label {
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(131, 24, 67, 0.6);
      font-family: system-ui, sans-serif;
    }
    .music-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.95rem;
      border-radius: 9999px;
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-family: system-ui, sans-serif;
      ${theme.musicBtnStyle}
      box-shadow: 0 2px 8px rgba(244, 114, 182, 0.15);
      cursor: pointer;
      outline: none;
      transition: all 0.3s;
    }
    .content-container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 32rem;
      margin: auto auto;
      display: flex;
      flex-direction: column;
      align-items: center;
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
      ${theme.badgeStyle}
    }
    h1 {
      font-family: Georgia, Cambria, 'Times New Roman', serif;
      font-size: 2rem;
      font-weight: 500;
      color: #4A1D2F;
      letter-spacing: 0.02em;
      line-height: 1.25;
    }
    @media (min-width: 640px) { h1 { font-size: 2.5rem; } }
    .blooms-container {
      position: absolute;
      top: 120px;
      left: 0;
      right: 0;
      height: 0;
      pointer-events: none;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bouquet-bloom, .orbiting-charm {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .bloom-emoji { font-size: 2.25rem; user-select: none; filter: drop-shadow(0 4px 10px rgba(244, 114, 182, 0.3)); }
    .charm-emoji { font-size: 1.5rem; user-select: none; filter: drop-shadow(0 3px 8px rgba(244, 114, 182, 0.3)); }
    .envelope-card {
      width: 100%;
      border-radius: 1.75rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(244, 114, 182, 0.35);
      padding: 2.5rem 1.75rem;
      box-shadow: 0 25px 60px -15px rgba(244, 114, 182, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9);
      transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    @media (min-width: 640px) { .envelope-card { padding: 3rem 2.5rem; } }
    .seal-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      text-align: center;
      position: relative;
    }
    .ribbon-band {
      position: absolute;
      left: -24px;
      right: -24px;
      height: 2.25rem;
      background: linear-gradient(90deg, #F472B6 0%, #FB7185 50%, #F472B6 100%);
      box-shadow: 0 4px 14px rgba(244, 114, 182, 0.3);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      z-index: 1;
    }
    @media (min-width: 640px) { .ribbon-band { left: -40px; right: -40px; } }
    .ribbon-stitch-top, .ribbon-stitch-bottom {
      position: absolute;
      left: 0;
      right: 0;
      height: 1.5px;
      background: rgba(255, 255, 255, 0.8);
    }
    .ribbon-stitch-top { top: 0; }
    .ribbon-stitch-bottom { bottom: 0; }
    .ribbon-text {
      font-size: 0.55rem;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      font-family: system-ui, sans-serif;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      user-select: none;
    }
    .seal-wrapper { position: relative; z-index: 10; margin: 1rem 0; }
    .pulse-halo {
      position: absolute;
      inset: -0.75rem;
      border-radius: 9999px;
      background: rgba(244, 114, 182, 0.35);
      filter: blur(10px);
      animation: pulseHalo 3s infinite ease-in-out;
    }
    @keyframes pulseHalo {
      0%, 100% { opacity: 0.4; transform: scale(0.98); }
      50% { opacity: 0.8; transform: scale(1.06); }
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
      border: 2px solid rgba(244, 114, 182, 0.6);
      background: linear-gradient(135deg, #FBCFE8 0%, #FDA4AF 60%, #F472B6 100%);
      box-shadow: 0 0 35px rgba(244, 114, 182, 0.4), 0 10px 20px rgba(0, 0, 0, 0.1);
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
      border: 1px solid rgba(255, 255, 255, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.3);
      box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4);
    }
    .wax-seal .emoji { font-size: 2.25rem; user-select: none; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15)); }
    .seal-label {
      position: absolute;
      bottom: -2rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      color: #831843;
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
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .paper-card {
      position: relative;
      background: ${paper.inlineBg || "#FFFFFF"};
      color: ${paper.inlineText || "#4A1D2F"};
      border: 1px solid ${paper.inlineBorder || "rgba(244, 114, 182, 0.3)"};
      border-radius: 1.25rem;
      padding: 2rem 1.75rem;
      box-shadow: 0 15px 40px -10px rgba(244, 114, 182, 0.25);
      overflow: hidden;
    }
    @media (min-width: 640px) { .paper-card { padding: 2.5rem 2.25rem; } }
    .paper-gold-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2.5px;
      background: linear-gradient(90deg, transparent, rgba(244, 114, 182, 0.7), transparent);
    }
    .message-card {
      white-space: pre-wrap;
      font-family: Georgia, Cambria, 'Times New Roman', serif;
      font-size: 1.125rem;
      line-height: 1.85;
      color: #4A1D2F;
      font-weight: 400;
      position: relative;
      z-index: 2;
    }
    .signoff-box {
      text-align: right;
      padding-top: 1.5rem;
      margin-top: 1.5rem;
      border-top: 1px solid rgba(244, 114, 182, 0.2);
      position: relative;
      z-index: 2;
    }
    .signoff-label {
      font-size: 0.75rem;
      opacity: 0.75;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 0.35rem;
      font-family: system-ui, sans-serif;
      color: #831843;
    }
    .sender-title {
      font-family: Georgia, Cambria, 'Times New Roman', serif;
      font-size: 1.6rem;
      font-weight: 600;
      color: ${theme.accentText};
    }
    .star-wish-box {
      margin-top: 0.5rem;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(253, 242, 248, 0.85);
      border: 1px solid rgba(244, 114, 182, 0.35);
      text-align: center;
    }
    .star-wish-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1.1rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-family: system-ui, sans-serif;
      font-weight: 500;
      color: #831843;
      background: #FFFFFF;
      border: 1px solid rgba(244, 114, 182, 0.4);
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(244, 114, 182, 0.15);
      transition: all 0.3s;
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
  <div class="wrapper" data-dimensional-world="cloud-nine" data-scene="welcome" data-testid="experience-container" data-decor-paper="${paper.id}" data-decor-ribbon="${ribbon.id}" data-decor-seal="${waxSeal.id}">
    <div data-layer="0-deep-background" class="deep-bg-layer" aria-hidden="true"></div>
    <div data-layer="1-distant-environment" class="distant-env-layer" aria-hidden="true"></div>
    <div data-layer="2-atmosphere" class="atmosphere-layer" aria-hidden="true">
      <div class="atmosphere-mist"></div>
    </div>
    <div class="ambient-glow"></div>

    <div class="top-bar">
      <div class="top-label">Celestial Love Letter</div>
      <button type="button" id="soundtrack-toggle" data-soundtrack-url="${sanitizeText((config as any).soundtrackUrl || '')}" aria-label="Play soundtrack" class="music-btn">
        <span style="font-size: 0.8rem;">♡</span>
        <span>${(config as any).soundtrackUrl ? 'Play Music' : 'Our Song'}</span>
      </button>
    </div>

    <div data-layer="4-primary-story" class="content-container">
      <div class="blooms-container">
        ${bloomsHtml}
        ${charmsHtml}
      </div>

      <div class="envelope-card" data-decor-paper="${paper.id}" style="position: relative; z-index: 10;">
        <div class="header">
          <span class="badge">${greeting}</span>
          <h1 data-testid="recipient-name">${partnerName}</h1>
        </div>

        <div class="seal-box" data-testid="seal-container">
          <div class="ribbon-band" data-decor-ribbon="${ribbon.id}">
            <div class="ribbon-stitch-top"></div>
            <div class="ribbon-stitch-bottom"></div>
            <span class="ribbon-text">HEAVEN SENT</span>
            <span class="ribbon-text">IN THE CLOUDS</span>
          </div>

          <div class="seal-wrapper">
            <div class="pulse-halo"></div>
            <button
              type="button"
              class="wax-seal"
              data-testid="wax-seal-button"
              data-decor-seal="${waxSeal.id}"
              aria-label="Break the wax seal to read letter"
            >
              <div class="wax-seal-inner">
                <span class="emoji">${waxSeal.emblem || "☁️"}</span>
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
                style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; color: #831843; background: rgba(244,114,182,0.15); border: 1px solid rgba(244,114,182,0.4); cursor: pointer; transition: all 0.2s;"
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
            <div style="background: #FFFFFF; padding: 0.85rem; border-radius: 1rem; box-shadow: 0 15px 35px rgba(244,114,182,0.25); border: 1px solid rgba(244,114,182,0.3); transform: rotate(-1deg); max-width: 22rem; margin: 0 auto;">
              <div style="width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 0.75rem; background: #FFF5F7;">
                <img src="${sanitizeText(config.heroMediaId)}" alt="A Cherished Cloud Moment" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div style="text-align: center; padding-top: 0.65rem; font-family: Georgia, serif; font-style: italic; font-size: 0.8rem; color: #831843;">
                Our sweetest moment above the clouds
              </div>
            </div>
          </div>
          `
              : ""
          }

          ${modulesHtml}

          <!-- Signature Cloud Nine Interaction -->
          <div class="star-wish-box">
            <button type="button" id="celestial-wish-btn" class="star-wish-btn" aria-label="Release a celestial blessing">
              <span style="font-size: 1rem;">🌟</span>
              <span>Release a Celestial Blessing</span>
            </button>
            <div id="celestial-wish-msg" class="hidden" style="margin-top: 0.5rem;">
              <p style="font-family: Georgia, serif; font-style: italic; font-size: 0.85rem; color: #4A1D2F; font-weight: 500;">
                “May our love always soar higher than the clouds.”
              </p>
              <p style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(131,24,67,0.7); margin-top: 0.25rem;">
                A blessing released to the heavens
              </p>
            </div>
          </div>

          ${interactionsHtml}

          ${printKeepsakeBtn}

          <div class="closing-scene" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(244,114,182,0.25); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.85rem;">
            <div style="width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(244,114,182,0.5), transparent);"></div>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: rgba(131,24,67,0.7); letter-spacing: 0.15em; text-transform: uppercase;">
              <span>☁️</span>
              <span>Cloud Nine Keepsake</span>
              <span>☁️</span>
            </div>
            <button
              type="button"
              id="reseal-btn"
              data-testid="reseal-button"
              aria-label="Seal & Read Again"
              style="padding: 0.35rem 1.1rem; border-radius: 9999px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #831843; background: rgba(253,242,248,0.9); border: 1px solid rgba(244,114,182,0.4); cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 6px rgba(244,114,182,0.15);"
            >
              Seal & Read Again
            </button>
          </div>
        </div>
      </div>
    </div>

    <footer style="position: relative; z-index: 20; width: 100%; padding: 1rem 0; text-align: center; font-size: 0.7rem; color: rgba(131,24,67,0.5); letter-spacing: 0.15em; text-transform: uppercase;">
      <span>VALENTINO</span>
      <span style="margin: 0 0.5rem;">·</span>
      <span>CLOUD NINE</span>
    </footer>
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
        var wishBtn = document.getElementById('celestial-wish-btn');
        var wishMsg = document.getElementById('celestial-wish-msg');

        if (!sealBox || !letterBox) return;

        try {
          document.title = "A Celestial Valentine for ${partnerName} — Valentino";
        } catch (e) {}

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
        if (mql.matches) unseal();
        mql.addEventListener('change', function(e) { if (e.matches) unseal(); });

        if (sealBtn) sealBtn.addEventListener('click', unseal);
        if (resealBtn) resealBtn.addEventListener('click', reseal);

        if (wishBtn && wishMsg) {
          wishBtn.addEventListener('click', function() {
            wishBtn.classList.add('hidden');
            wishMsg.classList.remove('hidden');
          });
        }

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
              master.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 1.0);
              master.connect(audioCtx.destination);
              gainNode = master;

              [440, 554.37, 659.25, 830.61].forEach(function(f) {
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
