import { sanitizeText } from "@/lib/sanitize";
import { KagePublishedConfig } from "./schema";
import {
  renderModulesHtml,
  renderReactionsAndReplyHtml,
  renderPrintKeepsakeButton,
  PRINT_MEDIA_STYLES,
  getModulesClientScript,
} from "@/modules/ssrModules";

export function renderKageSsrHtml(config: KagePublishedConfig, publicId: string = ""): string {
  const partnerName = sanitizeText(config.partnerName || "Dearest");
  const greeting = sanitizeText(config.greeting || "Where stillness reveals the unseen");
  const message = sanitizeText(config.message || "In the quiet of the night, every thought of you is a light through the shadows.");
  const signOff = sanitizeText(config.signOff || "With all my heart");
  const senderName = sanitizeText(config.senderName || "Yours Always");

  const modulesHtml = renderModulesHtml(config.modules, config.moduleOrder, publicId);
  const interactionsHtml = renderReactionsAndReplyHtml(publicId);
  const printKeepsakeBtn = renderPrintKeepsakeButton();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>A Kyoto Sanctuary Valentine for ${partnerName} — Valentino</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta property="og:title" content="A Valentine Experience" />
  <meta property="og:description" content="A tranquil Kyoto mountain sanctuary Valentine experience." />
  <meta property="og:type" content="website" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/landing-pages/secret-pathways-assets/fonts.css" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      min-height: 100vh;
      overflow-x: hidden;
      background: #070B09;
      color: #DFE7E0;
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
      padding: 2rem 1.5rem;
      background: radial-gradient(ellipse at 50% 15%, #121A15 0%, #070B09 70%, #030504 100%);
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 1rem;
      border-radius: 9999px;
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #A3B8AA;
      background: rgba(16, 25, 20, 0.85);
      border: 1px solid rgba(16, 185, 129, 0.25);
      margin-bottom: 1rem;
    }
    h1 {
      font-family: Georgia, Cambria, 'Times New Roman', serif;
      font-size: 2.5rem;
      font-weight: 300;
      color: #FAF8F5;
      letter-spacing: 0.05em;
      margin-bottom: 2rem;
      text-align: center;
    }
    .card {
      max-width: 36rem;
      width: 100%;
      background: rgba(15, 23, 19, 0.9);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 1.25rem;
      padding: 2.5rem 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
      position: relative;
      margin-bottom: 2rem;
    }
    .gold-rim {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(to right, transparent, #E0231C, transparent);
    }
    .letter-message {
      font-family: Georgia, Cambria, 'Times New Roman', serif;
      font-size: 1.125rem;
      line-height: 1.75;
      color: #EDF3EF;
      font-weight: 300;
      white-space: pre-wrap;
      margin-bottom: 2rem;
    }
    .signoff {
      text-align: right;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(16, 185, 129, 0.15);
    }
    .signoff-title {
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #88998D;
      margin-bottom: 0.25rem;
    }
    .signoff-sender {
      font-family: Georgia, Cambria, 'Times New Roman', serif;
      font-size: 1.75rem;
      color: #FAF8F5;
    }
    .hidden { display: none !important; }
    footer {
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(136, 153, 141, 0.4);
      padding: 2rem 0 1rem;
      text-align: center;
    }
    .deep-bg-layer {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(ellipse at 50% 20%, #0B120E 0%, #070B09 60%, #030504 100%);
    }
    .distant-env-layer {
      position: fixed;
      inset: 0;
      z-index: 1;
      pointer-events: none;
    }
    .lantern-radial {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 65% 55% at 50% 10%, rgba(224, 35, 28, 0.16) 0%, rgba(255, 90, 60, 0.07) 35%, rgba(16, 185, 129, 0.05) 55%, transparent 75%);
    }
    .mountain-silhouette {
      position: absolute;
      bottom: 0;
      inset-x: 0;
      height: 14rem;
      opacity: 0.3;
      background: radial-gradient(ellipse at 50% 100%, rgba(3, 5, 4, 0.95) 0%, rgba(7, 11, 9, 0.75) 60%, transparent 100%);
    }
    .atmosphere-layer {
      position: fixed;
      inset: 0;
      z-index: 2;
      pointer-events: none;
    }
    .cedar-mist {
      position: absolute;
      bottom: 0;
      left: -10%;
      right: -10%;
      height: 380px;
      background: radial-gradient(ellipse at 50% 100%, rgba(16, 185, 129, 0.08) 0%, rgba(6, 78, 59, 0.04) 50%, transparent 80%);
      filter: blur(20px);
    }
    .foreground-wrap-layer {
      position: fixed;
      inset: 0;
      z-index: 20;
      pointer-events: none;
      opacity: 0.7;
      background: radial-gradient(circle at center, transparent 55%, rgba(5, 9, 7, 0.75) 100%);
    }
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
    }
    ${PRINT_MEDIA_STYLES}
  </style>
</head>
<body>
  <div class="wrapper" data-dimensional-world="kage" data-scene="welcome" data-testid="kage-container">
    <div data-layer="0-deep-background" class="deep-bg-layer" aria-hidden="true"></div>
    <div data-layer="1-distant-environment" class="distant-env-layer" aria-hidden="true">
      <div class="lantern-radial"></div>
      <div class="mountain-silhouette"></div>
    </div>
    <div data-layer="2-atmosphere" class="atmosphere-layer" aria-hidden="true">
      <div class="cedar-mist"></div>
    </div>

    <div data-layer="4-primary-story" style="text-align: center; width: 100%; max-width: 36rem; margin: auto 0; position: relative; z-index: 10;">
      <span class="badge">${greeting}</span>
      <h1 data-testid="recipient-name">${partnerName}</h1>
      <div class="card">
        <div class="gold-rim"></div>
        <!-- Soundtrack & Read Aloud Buttons -->
        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
          ${(config as any).soundtrackUrl ? `
          <button
            type="button"
            id="soundtrack-toggle"
            data-soundtrack-url="${sanitizeText((config as any).soundtrackUrl)}"
            aria-label="Play Soundtrack"
            style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; color: #6EE7B7; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); cursor: pointer; transition: all 0.2s;"
          >
            <span>🎵</span> <span>Play Music</span>
          </button>
          ` : ''}
          <button
            type="button"
            id="read-aloud-btn"
            data-testid="read-aloud-btn"
            aria-label="Listen to Letter"
            style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; color: #6EE7B7; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); cursor: pointer; transition: all 0.2s;"
          >
            <span>🔊</span> <span>Listen to Letter</span>
          </button>
        </div>
        <div class="letter-message" data-testid="letter-message">${message}</div>
        <div class="signoff">
          <p class="signoff-title">${signOff}</p>
          <p class="signoff-sender" data-testid="sender-name">${senderName}</p>
        </div>

        ${modulesHtml}

        ${interactionsHtml}

        ${printKeepsakeBtn}
      </div>
    </div>
    <footer style="position: relative; z-index: 10;">
      <span>VALENTINO</span> · <span>KAGE WORLD</span> · <span>KYOTO SANCTUARY</span>
    </footer>
    <div data-layer="5-foreground-wrap" class="foreground-wrap-layer" aria-hidden="true"></div>
  </div>

  <script>
    (function() {
      function setup() {
        var musicBtn = document.getElementById('soundtrack-toggle');
        if (musicBtn) {
          var url = musicBtn.getAttribute('data-soundtrack-url');
          if (url) {
            var audio = new Audio(url);
            audio.loop = true;
            var isPlaying = false;
            musicBtn.addEventListener('click', function() {
              if (isPlaying) {
                audio.pause();
                isPlaying = false;
                musicBtn.innerHTML = '<span>🎵</span> <span>Play Music</span>';
              } else {
                audio.play().then(function() {
                  isPlaying = true;
                  musicBtn.innerHTML = '<span>🎶</span> <span>Pause Music</span>';
                }).catch(function() {});
              }
            });
          }
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
