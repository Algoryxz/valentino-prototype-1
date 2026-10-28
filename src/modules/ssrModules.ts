import {
  sanitizeText as baseSanitizeText,
  escapeHtml,
  escapeHtmlAttr,
  safeJsonForScript,
  sanitizeUrl,
} from "@/lib/sanitize";

/**
 * In SSR HTML generation, user content must be both Unicode-sanitized AND HTML entity-escaped.
 */
function sanitizeText(
  input: string | null | undefined,
  options?: { allowNewlines?: boolean }
): string {
  return escapeHtml(baseSanitizeText(input || "", options));
}

export interface SsrRenderOptions {
  publicId?: string;
  theme?: "midnight-rose" | "cloud-nine" | "kage";
}

export function renderModulesHtml(
  modulesConfig?: Record<string, any>,
  moduleOrder?: string[],
  publicId: string = "",
  narrative?: any
): string {
  if ((!modulesConfig || typeof modulesConfig !== "object") && !narrative?.welcome?.enabled) {
    return "";
  }

  const rendered: string[] = [];

  // 0. Welcome Banner
  if (narrative?.welcome?.enabled) {
    rendered.push(`
      <div class="narrative-welcome-banner" data-testid="narrative-welcome-banner" style="margin-top: 1.5rem; padding: 1.5rem; border-radius: 1.25rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.3); text-align: center;">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🌹✨</div>
        <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.25rem; font-weight: 600;">${sanitizeText(narrative.welcome.greeting || "Welcome, My Love")}</div>
        ${narrative.welcome.recipientName ? `<h2 style="font-family: Georgia, serif; font-size: 1.5rem; color: #FAF8F5; margin-bottom: 0.5rem;">${sanitizeText(narrative.welcome.recipientName)}</h2>` : ""}
        ${narrative.welcome.message ? `<p style="font-size: 0.9rem; color: #D5CEBF; font-style: italic; line-height: 1.6;">${sanitizeText(narrative.welcome.message)}</p>` : ""}
      </div>
    `);
  }

  // Emotional Recap
  if (narrative?.recap?.enabled && modulesConfig) {
    const memoryCount = (modulesConfig.memories?.items || []).length;
    const milestoneCount = (modulesConfig.timeline?.items || []).length;
    const reasonsCount = (modulesConfig.reasons?.items || []).length;
    const promisesCount = (modulesConfig.promises?.items || []).length;

    rendered.push(`
      <div class="narrative-recap-banner" data-testid="narrative-emotional-recap" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.75); border: 1px solid rgba(244, 63, 94, 0.25); text-align: center;">
        <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">${sanitizeText(narrative.recap.title || "Our Story in Moments")}</div>
        <p style="font-size: 0.8rem; color: #D5CEBF; font-style: italic; margin-bottom: 0.75rem;">${sanitizeText(narrative.recap.reflection || "")}</p>
        <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
          ${milestoneCount > 0 ? `<div style="padding: 0.5rem 0.85rem; border-radius: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);"><div style="font-size: 1.25rem; font-weight: 600; color: #FAF8F5;">${milestoneCount}</div><div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase;">Milestones</div></div>` : ""}
          ${memoryCount > 0 ? `<div style="padding: 0.5rem 0.85rem; border-radius: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);"><div style="font-size: 1.25rem; font-weight: 600; color: #FAF8F5;">${memoryCount}</div><div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase;">Cherished Photos</div></div>` : ""}
          ${reasonsCount > 0 ? `<div style="padding: 0.5rem 0.85rem; border-radius: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);"><div style="font-size: 1.25rem; font-weight: 600; color: #FAF8F5;">${reasonsCount}</div><div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase;">Reasons I Love Us</div></div>` : ""}
          ${promisesCount > 0 ? `<div style="padding: 0.5rem 0.85rem; border-radius: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);"><div style="font-size: 1.25rem; font-weight: 600; color: #FAF8F5;">${promisesCount}</div><div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase;">Sacred Promises</div></div>` : ""}
        </div>
      </div>
    `);
  }

  const order =
    Array.isArray(moduleOrder) && moduleOrder.length > 0
      ? [...moduleOrder]
      : ["voiceNote", "videoMemory", "memories", "timeline", "quiz", "secret", "openWhen"];

  if (modulesConfig) {
    for (const modId of Object.keys(modulesConfig)) {
      if (modulesConfig[modId]?.enabled && !order.includes(modId)) {
        order.push(modId);
      }
    }

    for (const modId of order) {
      const m = modulesConfig[modId];
      if (!m || !m.enabled) continue;

    // 1. Voice Note Module
    if (modId === "voiceNote" && m.url) {
      rendered.push(`
        <div class="module-voice-card" data-testid="module-voice-note" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25); text-align: center;">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">🎙️ Voice Note Audio Seal</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.35rem;">${sanitizeText(m.title || "Voice Note")}</h3>
          <p data-testid="voice-caption" style="font-size: 0.8rem; color: #D5CEBF; font-style: italic; margin-bottom: 0.85rem;">${sanitizeText(m.caption || "A personal message from my heart to yours")}</p>
          <audio id="voice-audio-el" src="${escapeHtmlAttr(sanitizeUrl(m.url))}" preload="metadata"></audio>
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; max-width: 20rem; margin: 0 auto;">
            <button type="button" id="voice-play-btn" data-testid="voice-play-btn" aria-label="Play voice note" style="width: 2.25rem; height: 2.25rem; border-radius: 9999px; background: #E11D48; color: white; border: none; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; cursor: pointer;">▶</button>
            <input type="range" id="voice-scrub-bar" data-testid="voice-scrub-bar" min="0" max="100" value="0" style="flex: 1; accent-color: #FB7185; cursor: pointer;" />
            <span id="voice-time-display" data-testid="voice-time-display" style="font-size: 0.75rem; color: #FDA4AF; font-variant-numeric: tabular-nums;">0:00</span>
          </div>
        </div>
      `);
    }

    // 2. Video Memory Capsule Module
    if (modId === "videoMemory" && m.url) {
      rendered.push(`
        <div class="module-video-card" data-testid="module-video-memory" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25);">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">🎞️ Video Memory Capsule</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.5rem;">${sanitizeText(m.title || "Video Memory")}</h3>
          <div style="position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: 0.75rem; background: #000; border: 1px solid rgba(255,255,255,0.15);">
            <video id="video-memory-el" data-testid="video-memory-player" src="${escapeHtmlAttr(sanitizeUrl(m.url))}" poster="${escapeHtmlAttr(sanitizeUrl(m.posterUrl || ""))}" controls playsinline preload="metadata" style="width: 100%; height: 100%; object-fit: contain;"></video>
          </div>
          ${m.caption ? `<p data-testid="video-memory-caption" style="text-align: center; font-size: 0.8rem; color: #D5CEBF; font-style: italic; margin-top: 0.65rem;">${sanitizeText(m.caption)}</p>` : ""}
        </div>
      `);
    }

    // 3. Our Memories Photo Gallery Module
    if (modId === "memories" && m.items && m.items.length > 0) {
      rendered.push(`
        <div class="module-memories-card" data-testid="module-memories" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25);">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">📸 Our Memories</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.85rem;">${sanitizeText(m.title || "Our Cherished Memories")}</h3>
          
          <div class="memories-stage" style="position: relative; max-width: 24rem; margin: 0 auto;">
            <div style="background: #FAF8F5; padding: 0.85rem; border-radius: 0.85rem; box-shadow: 0 16px 36px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.9); text-align: center;">
              <div id="memory-photo-container" style="width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 0.5rem; background: #222; cursor: zoom-in;" title="Click to enlarge">
                <img id="memory-active-photo" data-testid="memory-active-photo" src="${escapeHtmlAttr(sanitizeUrl(m.items[0]?.url || ""))}" alt="Memory photo" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" />
              </div>
              <div style="padding-top: 0.65rem;">
                <div id="memory-item-date" data-testid="memory-item-date" style="font-size: 0.7rem; color: #BE123C; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${sanitizeText(m.items[0]?.date || "")}</div>
                <div id="memory-item-title" data-testid="memory-item-title" style="font-size: 0.95rem; font-weight: 600; color: #1C1917; margin-top: 0.15rem;">${sanitizeText(m.items[0]?.title || "")}</div>
                <div id="memory-item-caption" data-testid="memory-item-caption" style="font-family: Georgia, serif; font-style: italic; font-size: 0.85rem; color: #57534E; margin-top: 0.25rem;">${sanitizeText(m.items[0]?.caption || "")}</div>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem;">
              <button type="button" id="memory-prev-btn" data-testid="memory-prev-btn" aria-label="Previous memory" style="padding: 0.4rem 0.85rem; border-radius: 9999px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FAF8F5; font-size: 0.75rem; cursor: pointer;">← Prev</button>
              <span id="memory-counter" style="font-size: 0.75rem; color: #FDA4AF; font-family: monospace;">1 / ${m.items.length}</span>
              <button type="button" id="memory-next-btn" data-testid="memory-next-btn" aria-label="Next memory" style="padding: 0.4rem 0.85rem; border-radius: 9999px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FAF8F5; font-size: 0.75rem; cursor: pointer;">Next →</button>
            </div>

            <div class="memory-thumbnails" style="display: flex; gap: 0.4rem; overflow-x: auto; padding: 0.5rem 0; margin-top: 0.5rem;">
              ${m.items.map((item: any, idx: number) => `
                <button type="button" class="memory-thumb-btn" data-testid="memory-thumbnail-${idx}" data-idx="${idx}" aria-label="View photo ${idx + 1}" style="flex-shrink: 0; width: 3rem; height: 2.25rem; border-radius: 0.35rem; overflow: hidden; border: 2px solid ${idx === 0 ? '#FB7185' : 'transparent'}; cursor: pointer; padding: 0; background: none;">
                  <img src="${escapeHtmlAttr(sanitizeUrl(item.url))}" alt="Thumb ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;" />
                </button>
              `).join("")}
            </div>

            <!-- Lightbox Modal -->
            <div id="memory-lightbox" class="hidden" style="position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.92); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem;">
              <button type="button" id="lightbox-close-btn" data-testid="lightbox-close" aria-label="Close photo view" style="position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.2); border: none; color: white; width: 2.5rem; height: 2.5rem; border-radius: 9999px; font-size: 1.25rem; cursor: pointer;">✕</button>
              <img id="lightbox-img" src="" alt="Enlarged memory" style="max-width: 90vw; max-height: 75vh; object-fit: contain; border-radius: 0.5rem; box-shadow: 0 20px 50px rgba(0,0,0,0.8);" />
              <div id="lightbox-caption" style="margin-top: 1rem; color: #FAF8F5; text-align: center; max-width: 30rem; font-family: Georgia, serif; font-style: italic; font-size: 0.95rem;"></div>
            </div>

            <script id="memories-data" type="application/json">
              ${safeJsonForScript(m.items)}
            </script>
          </div>
        </div>
      `);
    }

    // 4. Timeline of Us Module
    if (modId === "timeline" && m.items && m.items.length > 0) {
      rendered.push(`
        <div class="module-timeline-card" data-testid="module-timeline" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25);">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">⏳ Timeline of Us</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.85rem;">${sanitizeText(m.title || "Our Journey")}</h3>
          <div style="display: flex; flex-direction: column; gap: 0.85rem; border-left: 2px solid rgba(244, 63, 94, 0.3); padding-left: 0.85rem; margin-left: 0.35rem;">
            ${(m.items || []).map((item: any, mIdx: number) => `
              <div class="timeline-item" data-testid="timeline-milestone-${mIdx}" style="position: relative;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem; flex-wrap: wrap;">
                  <span style="font-size: 0.7rem; color: #FDA4AF; font-weight: 500;">${sanitizeText(item.date || "")}</span>
                  ${item.category ? `<span style="font-size: 0.6rem; padding: 0.1rem 0.4rem; border-radius: 9999px; background: rgba(255,255,255,0.1); color: #FAF8F5; text-transform: uppercase;">${sanitizeText(item.category)}</span>` : ""}
                  ${item.location ? `<span style="font-size: 0.65rem; color: #D5CEBF; opacity: 0.8;">📍 ${sanitizeText(item.location)}</span>` : ""}
                </div>
                <div style="font-size: 0.95rem; font-weight: 600; color: #FAF8F5;">${sanitizeText(item.title || "")}</div>
                <div style="font-size: 0.8rem; color: #D5CEBF; font-weight: 300; margin-top: 0.15rem;">${sanitizeText(item.description || "")}</div>
                ${item.nextStepMessage ? `<div style="font-size: 0.75rem; font-style: italic; color: #FDA4AF; margin-top: 0.25rem;">✨ ${sanitizeText(item.nextStepMessage)}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      `);
    }

    // 5. Love Quiz Module
    if (modId === "quiz" && m.questions && m.questions.length > 0) {
      rendered.push(`
        <div class="module-quiz-card" data-testid="module-quiz" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25);">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">💘 Love Quiz</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.85rem;">${sanitizeText(m.title || "How Well Do You Know Us?")}</h3>
          <div id="quiz-container">
            <div id="quiz-question" style="font-size: 0.9rem; color: #FAF8F5; margin-bottom: 0.65rem;">
              ${sanitizeText(m.questions[0]?.question || "")}
            </div>
            <div class="quiz-options" style="display: flex; flex-direction: column; gap: 0.4rem;">
              ${(m.questions[0]?.options || []).map((opt: string, optIdx: number) => `
                <button type="button" data-testid="quiz-option-${optIdx}" class="quiz-opt-btn" style="padding: 0.55rem 0.85rem; border-radius: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: #FAF8F5; text-align: left; cursor: pointer; font-size: 0.8rem; transition: background 0.2s;">
                  ${sanitizeText(opt)}
                </button>
              `).join("")}
            </div>
            <div id="quiz-feedback" data-testid="quiz-feedback-pill" class="hidden" style="margin-top: 0.65rem; padding: 0.45rem 0.65rem; border-radius: 0.5rem; font-size: 0.75rem; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #6EE7B7;">
              ✓ ${sanitizeText(m.questions[0]?.explanation || "Everything about you makes my heart smile.")}
            </div>
            <button type="button" id="quiz-next" data-testid="quiz-next-button" class="hidden" style="margin-top: 0.65rem; padding: 0.35rem 0.75rem; border-radius: 9999px; background: #E11D48; color: white; border: none; font-size: 0.7rem; font-weight: 500; cursor: pointer;">
              Complete Quiz
            </button>
          </div>
        </div>
      `);
    }

    // 6. Secret Note Module
    if (modId === "secret") {
      rendered.push(`
        <div class="module-secret-card" data-testid="module-secret" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25);">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">🔐 Secret Note</div>
          ${m.questionLock?.enabled ? `
            <div data-testid="secret-question-card" class="secret-question-card" style="text-align: center; padding: 0.5rem 0;">
              <div style="font-size: 1.75rem; margin-bottom: 0.25rem;">🗝️</div>
              <h4 style="font-family: Georgia, serif; font-size: 1rem; color: #FAF8F5; margin-bottom: 0.25rem;">Secret Question</h4>
              <p style="font-size: 0.85rem; color: #FDA4AF; font-style: italic; margin-bottom: 0.85rem;">${sanitizeText(m.questionLock.question)}</p>
              <form id="secret-verify-form" style="display: flex; flex-direction: column; gap: 0.5rem; max-width: 18rem; margin: 0 auto;">
                <input type="text" id="secret-answer-input" data-testid="secret-question-input" placeholder="Type your answer..." required style="padding: 0.5rem 0.85rem; border-radius: 0.75rem; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: #fff; text-align: center; font-size: 0.8rem;" />
                <button type="submit" id="secret-verify-submit" data-testid="secret-question-submit" style="padding: 0.5rem 1rem; border-radius: 9999px; background: linear-gradient(135deg, #E11D48, #9F1239); color: white; border: 1px solid #FB7185; font-size: 0.75rem; font-weight: 500; cursor: pointer;">Unlock Secret</button>
              </form>
              <div id="secret-verify-error" data-testid="secret-verify-error" class="hidden" style="color: #FDA4AF; font-size: 0.75rem; margin-top: 0.5rem;"></div>
            </div>
          ` : `
            <p style="font-size: 0.9rem; color: #FAF8F5; margin-bottom: 0.85rem;">${sanitizeText(m.prompt || "A secret note just for you")}</p>
            <button type="button" id="reveal-secret-btn" data-testid="reveal-secret-button" style="padding: 0.5rem 1.15rem; border-radius: 9999px; background: linear-gradient(135deg, #E11D48, #9F1239); color: white; border: 1px solid #FB7185; font-size: 0.75rem; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem;">
              <span>✨</span> <span>Tap to Reveal Secret</span>
            </button>
          `}
          <div id="revealed-secret" data-testid="revealed-secret-content" class="hidden" style="margin-top: 0.75rem; padding: 0.85rem; border-radius: 0.75rem; background: rgba(0,0,0,0.4); border: 1px solid rgba(244, 63, 94, 0.3); font-family: Georgia, serif; font-style: italic; color: #FDA4AF; font-size: 0.9rem; line-height: 1.5; text-align: center;"></div>
        </div>
      `);
    }

    // 7. Open When Letters Module
    const openWhenItems = m.envelopes || m.letters;
    if (modId === "openWhen" && Array.isArray(openWhenItems) && openWhenItems.length > 0) {
      rendered.push(`
        <div class="module-openwhen-card" data-testid="module-open-when" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25);">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">💌 Open When...</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.85rem;">${sanitizeText(m.title || "Open When You Need Me")}</h3>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${openWhenItems.map((letter: any, lIdx: number) => `
              <div class="openwhen-item" data-testid="open-when-envelope-${lIdx}" style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 0.85rem; font-weight: 600; color: #FDA4AF;">${sanitizeText(letter.title || letter.situation || "")}</div>
                ${letter.context ? `<div style="font-size: 0.7rem; color: #D5CEBF; opacity: 0.75; font-style: italic;">${sanitizeText(letter.context)}</div>` : ""}
                <div style="font-size: 0.8rem; color: #FAF8F5; font-style: italic; margin-top: 0.35rem; line-height: 1.4;">${sanitizeText(letter.message || "")}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `);
    }

    // 8. Reasons I Love You Module
    if (modId === "reasons" && Array.isArray(m.items) && m.items.length > 0) {
      rendered.push(`
        <div class="module-reasons-card" data-testid="reasons-module-container" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25); text-align: center;">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">💖 Reasons I Love You</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.35rem;">${sanitizeText(m.title || "Reasons I Love You")}</h3>
          ${m.subtitle ? `<p style="font-size: 0.8rem; color: #D5CEBF; margin-bottom: 0.85rem;">${sanitizeText(m.subtitle)}</p>` : ""}
          <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 0.75rem; padding: 1.25rem; max-width: 22rem; margin: 0 auto; min-height: 8rem; display: flex; flex-direction: column; justify-content: center;">
            <div id="reasons-step-number" data-testid="reasons-counter" style="font-size: 0.7rem; color: #FDA4AF; font-family: monospace; margin-bottom: 0.35rem;">Reason 1 of ${m.items.length}</div>
            <h4 id="reasons-item-title" data-testid="reasons-item-title" style="font-size: 1rem; color: #FAF8F5; font-weight: 600; margin-bottom: 0.25rem;">${sanitizeText(m.items[0]?.title || "")}</h4>
            <p id="reasons-item-text" data-testid="reasons-item-text" style="font-family: Georgia, serif; font-style: italic; color: #FDA4AF; font-size: 0.9rem; line-height: 1.4;">${sanitizeText(m.items[0]?.text || "")}</p>
          </div>
          <div style="display: flex; justify-content: center; gap: 0.75rem; margin-top: 0.85rem;">
            <button type="button" id="reasons-prev-btn" data-testid="reasons-prev-btn" aria-label="Previous reason" style="padding: 0.35rem 0.85rem; border-radius: 9999px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FAF8F5; font-size: 0.75rem; cursor: pointer;">← Previous</button>
            <button type="button" id="reasons-next-btn" data-testid="reasons-next-btn" aria-label="Next reason" style="padding: 0.35rem 0.85rem; border-radius: 9999px; background: #E11D48; border: none; color: #fff; font-size: 0.75rem; font-weight: 500; cursor: pointer;">Next Reason →</button>
          </div>
          <script id="reasons-data" type="application/json">${safeJsonForScript(m.items)}</script>
        </div>
      `);
    }

    // 9. Compliment Machine Module
    const compPool = Array.isArray(m.pool) && m.pool.length > 0 ? m.pool : (Array.isArray(m.items) ? m.items : []);
    if (modId === "compliments" && compPool.length > 0) {
      rendered.push(`
        <div class="module-compliments-card" data-testid="compliments-module-container" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25); text-align: center;">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">✨ Compliment Machine</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.85rem;">${sanitizeText(m.title || "Heartfelt Reminders")}</h3>
          <div id="compliment-display-card" data-testid="compliment-display" style="background: rgba(0,0,0,0.35); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 0.75rem; padding: 1rem; max-width: 22rem; margin: 0 auto 0.85rem; min-height: 4.5rem; display: flex; align-items: center; justify-content: center;">
            <p id="compliment-display-text" data-testid="compliment-display-text" style="font-family: Georgia, serif; font-style: italic; color: #FDA4AF; font-size: 0.95rem; line-height: 1.4;">${sanitizeText(compPool[0] || "")}</p>
          </div>
          <button type="button" id="compliment-trigger-btn" data-testid="compliment-trigger-btn" style="padding: 0.5rem 1.25rem; border-radius: 9999px; background: linear-gradient(135deg, #E11D48, #BE123C); color: white; border: 1px solid #FB7185; font-size: 0.75rem; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
            <span>✨</span> <span>${sanitizeText(m.buttonLabel || "Tell Me Something Sweet")}</span>
          </button>
          <script id="compliments-data" type="application/json">${safeJsonForScript(compPool)}</script>
        </div>
      `);
    }

    // 10. Fortune Cookie Module
    const fortList = Array.isArray(m.fortunes) && m.fortunes.length > 0 ? m.fortunes : (Array.isArray(m.items) ? m.items : []);
    if (modId === "fortuneCookie" && fortList.length > 0) {
      rendered.push(`
        <div class="module-fortune-card" data-testid="fortune-cookie-module-container" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25); text-align: center;">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">🥠 Fortune Cookie</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.5rem;">${sanitizeText(m.title || "Your Fortune Awaits")}</h3>
          <div style="margin: 1rem 0;">
            <button type="button" id="fortune-crack-btn" data-testid="crack-cookie-btn" aria-label="Crack open fortune cookie" style="background: none; border: none; font-size: 3rem; cursor: pointer; transition: transform 0.2s;">
              🥠
            </button>
          </div>
          <div id="fortune-slip" data-testid="fortune-slip" style="background: #FFFBEB; color: #78350F; border: 1px dashed #D97706; border-radius: 0.5rem; padding: 0.85rem; max-width: 20rem; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #B45309; margin-bottom: 0.25rem;">Secret Fortune</div>
            <p id="fortune-slip-text" style="font-family: Georgia, serif; font-style: italic; font-size: 0.85rem; line-height: 1.4;">${sanitizeText(fortList[0] || "")}</p>
          </div>
          <script id="fortunes-data" type="application/json">${safeJsonForScript(fortList)}</script>
        </div>
      `);
    }

    // 11. Scratch Card Module
    if (modId === "scratchCard" && (m.hiddenMessage || m.enabled)) {
      rendered.push(`
        <div class="module-scratch-card" data-testid="scratch-card-module-container" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25); text-align: center;">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">🪄 Scratch to Reveal</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.35rem;">${sanitizeText(m.title || "Scratch to Reveal")}</h3>
          <p style="font-size: 0.8rem; color: #D5CEBF; margin-bottom: 0.85rem;">${sanitizeText(m.frontMessage || "Scratch below to unveil my secret message")}</p>
          <div style="position: relative; width: 18rem; max-width: 90vw; height: 7.5rem; margin: 0 auto; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.5); border: 1px solid rgba(244,63,94,0.4);">
            <div id="scratch-hidden-content" data-testid="scratch-hidden-content" style="position: absolute; inset: 0; background: linear-gradient(135deg, #1C0512, #3B0723); display: flex; align-items: center; justify-content: center; padding: 1rem; text-align: center;">
              <span id="scratch-revealed-text" data-testid="scratch-revealed-text" style="font-family: Georgia, serif; font-style: italic; color: #FDA4AF; font-size: 0.95rem; line-height: 1.4;">${sanitizeText(m.hiddenMessage || "Surprise Uncovered! You are my forever.")}</span>
            </div>
            <canvas id="scratch-card-canvas" data-testid="scratch-card-canvas" width="288" height="120" style="position: absolute; inset: 0; width: 100%; height: 100%; cursor: crosshair; touch-action: none;"></canvas>
          </div>

          <div style="margin-top: 0.75rem;">
            <button type="button" id="scratch-reveal-btn" data-testid="scratch-reveal-btn" aria-label="Reveal secret message" style="font-size: 0.75rem; color: #FDA4AF; background: none; border: 1px solid rgba(244,63,94,0.3); border-radius: 9999px; padding: 0.3rem 0.85rem; cursor: pointer;">
              Reveal Instantly
            </button>
          </div>
        </div>
      `);
    }

    // 12. Promise Wall Module
    const promList = Array.isArray(m.promises) && m.promises.length > 0 ? m.promises : (Array.isArray(m.items) ? m.items : []);
    if (modId === "promises" && promList.length > 0) {
      rendered.push(`
        <div class="module-promises-card" data-testid="promises-module-container" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25);">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600; text-align: center;">💍 Promise Wall</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.35rem; text-align: center;">${sanitizeText(m.title || "My Vows & Promises")}</h3>
          ${m.subtitle ? `<p style="font-size: 0.8rem; color: #D5CEBF; text-align: center; margin-bottom: 0.85rem;">${sanitizeText(m.subtitle)}</p>` : ""}
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); gap: 0.65rem;">
            ${promList.map((p: any, pIdx: number) => `
              <div class="promise-item" data-testid="promise-card-${pIdx}" style="padding: 0.75rem; border-radius: 0.65rem; background: rgba(0,0,0,0.35); border: 1px solid rgba(244, 63, 94, 0.2); display: flex; flex-direction: column; justify-content: space-between;">
                ${p.category ? `<div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.25rem;">${sanitizeText(p.category)}</div>` : ""}
                <div style="font-family: Georgia, serif; font-style: italic; color: #FAF8F5; font-size: 0.85rem; line-height: 1.4;">${sanitizeText(p.text || "")}</div>
                <div style="margin-top: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                  <span class="promise-tag" style="font-size: 0.6rem; color: #FDA4AF; opacity: 0.8;">HELD IN HEART</span>
                  <button type="button" class="promise-heart-btn" data-testid="promise-heart-btn-${pIdx}" aria-label="Heart this promise" style="background: none; border: none; font-size: 0.9rem; cursor: pointer; color: #FDA4AF;">🤍</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `);
    }

    // 13. Future Adventures Module
    const advList = Array.isArray(m.adventures) && m.adventures.length > 0 ? m.adventures : (Array.isArray(m.items) ? m.items : []);
    if (modId === "futureAdventures" && advList.length > 0) {
      rendered.push(`
        <div class="module-adventures-card" data-testid="future-adventures-module-container" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25);">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600; text-align: center;">🗺️ Future Adventures</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.35rem; text-align: center;">${sanitizeText(m.title || "Our Bucket List")}</h3>
          <div style="display: flex; justify-content: center; gap: 0.35rem; margin-bottom: 0.85rem; flex-wrap: wrap;">
            <button type="button" class="adv-filter-btn" data-filter="all" data-testid="adventure-filter-all" style="padding: 0.25rem 0.65rem; border-radius: 9999px; background: #E11D48; color: white; border: none; font-size: 0.7rem; cursor: pointer;">All</button>
            <button type="button" class="adv-filter-btn" data-filter="planned" data-testid="adventure-filter-planned" style="padding: 0.25rem 0.65rem; border-radius: 9999px; background: rgba(255,255,255,0.1); color: #FAF8F5; border: 1px solid rgba(255,255,255,0.2); font-size: 0.7rem; cursor: pointer;">Planned</button>
            <button type="button" class="adv-filter-btn" data-filter="completed" data-testid="adventure-filter-completed" style="padding: 0.25rem 0.65rem; border-radius: 9999px; background: rgba(255,255,255,0.1); color: #FAF8F5; border: 1px solid rgba(255,255,255,0.2); font-size: 0.7rem; cursor: pointer;">Completed</button>
            <button type="button" class="adv-filter-btn" data-filter="someday" data-testid="adventure-filter-someday" style="padding: 0.25rem 0.65rem; border-radius: 9999px; background: rgba(255,255,255,0.1); color: #FAF8F5; border: 1px solid rgba(255,255,255,0.2); font-size: 0.7rem; cursor: pointer;">Someday</button>
          </div>
          <div id="adventures-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${advList.map((adv: any) => `
              <div class="adventure-item" data-testid="adventure-item" data-status="${sanitizeText(adv.status || 'planned')}" style="padding: 0.65rem 0.85rem; border-radius: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 0.85rem; font-weight: 600; color: #FAF8F5;">${sanitizeText(adv.title || "")}</div>
                  ${adv.description ? `<div style="font-size: 0.75rem; color: #D5CEBF; font-style: italic;">${sanitizeText(adv.description)}</div>` : ""}
                </div>
                <span style="font-size: 0.65rem; padding: 0.15rem 0.45rem; border-radius: 9999px; text-transform: uppercase; font-weight: 600; ${adv.status === 'completed' ? 'background: rgba(16,185,129,0.2); color: #6EE7B7;' : adv.status === 'someday' ? 'background: rgba(168,85,247,0.2); color: #C084FC;' : 'background: rgba(244,63,94,0.2); color: #FDA4AF;'}">${sanitizeText(adv.status || "planned")}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `);
    }

    // 14. Adventure Spinner Module
    const spinOptions = Array.isArray(m.options) ? m.options.map((o: any) => typeof o === "string" ? o : (o?.label || "")) : [];
    if (modId === "adventureSpinner" && spinOptions.length > 0) {
      rendered.push(`
        <div class="module-spinner-card" data-testid="adventure-spinner-module-container" style="margin-top: 1.5rem; padding: 1.25rem; border-radius: 1rem; background: rgba(32, 6, 21, 0.85); border: 1px solid rgba(244, 63, 94, 0.25); text-align: center;">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">🎡 Adventure Spinner</div>
          <h3 style="font-family: Georgia, serif; font-size: 1.15rem; color: #FAF8F5; margin-bottom: 0.85rem;">${sanitizeText(m.title || "What Should We Do Next?")}</h3>
          <div style="position: relative; width: 10rem; height: 10rem; margin: 0 auto 1rem; border-radius: 9999px; border: 4px solid #FB7185; background: radial-gradient(circle, #380720 0%, #15020E 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 25px rgba(244,63,94,0.3);">
            <div id="spinner-pointer" style="position: absolute; top: -10px; font-size: 1.25rem; color: #FDA4AF; z-index: 2;">▼</div>
            <div id="spinner-wheel-display" data-testid="spinner-wheel" style="transition: transform 3s cubic-bezier(0.15, 0.9, 0.2, 1); font-size: 2.25rem;">
              🎡
            </div>
          </div>

          <div id="spinner-result" data-testid="spinner-result-card" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 0.5rem; padding: 0.75rem; max-width: 18rem; margin: 0 auto 0.75rem; font-family: Georgia, serif; font-style: italic; color: #FDA4AF; font-size: 0.9rem; min-height: 2.5rem; display: flex; align-items: center; justify-content: center;">
            Spin the wheel to decide!
          </div>

          <div style="display: flex; justify-content: center; gap: 0.5rem;">
            <button type="button" id="spinner-spin-btn" data-testid="spinner-spin-btn" style="padding: 0.45rem 1.15rem; border-radius: 9999px; background: linear-gradient(135deg, #E11D48, #BE123C); color: white; border: 1px solid #FB7185; font-size: 0.75rem; font-weight: 500; cursor: pointer;">Spin Wheel</button>
            <button type="button" id="spinner-pick-btn" data-testid="spinner-fallback-btn" style="padding: 0.45rem 0.85rem; border-radius: 9999px; background: rgba(255,255,255,0.1); color: #FAF8F5; border: 1px solid rgba(255,255,255,0.2); font-size: 0.75rem; cursor: pointer;">Quick Pick</button>
          </div>
          <script id="spinner-data" type="application/json">${safeJsonForScript(spinOptions)}</script>
        </div>
      `);
    }

    // 15. Finale Module
    if (modId === "finale" && m.declaration) {
      rendered.push(`
        <div class="module-finale-card" data-testid="finale-module-container" style="margin-top: 2rem; padding: 1.75rem 1.25rem; border-radius: 1.25rem; background: linear-gradient(180deg, rgba(32, 6, 21, 0.9) 0%, rgba(15, 2, 10, 0.95) 100%); border: 1px solid rgba(244, 63, 94, 0.4); text-align: center; position: relative; overflow: hidden;">
          <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 0.5rem; font-weight: 600;">🌹 Final Declaration</div>
          <h2 style="font-family: Georgia, serif; font-size: 1.35rem; color: #FAF8F5; margin-bottom: 0.85rem;">${sanitizeText(m.title || "To You, Always")}</h2>
          <div data-testid="finale-declaration" style="font-family: Georgia, serif; font-size: 1.05rem; line-height: 1.6; color: #FDA4AF; font-style: italic; max-width: 26rem; margin: 0 auto 1.25rem;">
            ${sanitizeText(m.declaration)}
          </div>
          ${m.promisesHighlight ? `
            <div data-testid="finale-promises" style="background: rgba(0,0,0,0.35); border-left: 2px solid #FB7185; padding: 0.65rem 1rem; max-width: 22rem; margin: 0 auto 1.25rem; font-size: 0.8rem; color: #FAF8F5; font-style: italic;">
              ${sanitizeText(m.promisesHighlight)}
            </div>
          ` : ""}
          <div style="margin-top: 1rem;">
            <button type="button" id="finale-seal-btn" data-testid="finale-seal-journey-btn" style="padding: 0.6rem 1.5rem; border-radius: 9999px; background: linear-gradient(135deg, #E11D48, #9F1239); color: white; border: 1px solid #FB7185; font-size: 0.8rem; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(225,29,72,0.4);">
              ${sanitizeText(m.sealText || "Seal Our Forever")}
            </button>
          </div>
          <div id="finale-seal-toast" data-testid="finale-seal-toast" class="hidden" style="margin-top: 0.85rem; font-size: 0.85rem; color: #6EE7B7; font-weight: 500;">
            ✨ Sealed in My Heart forever.
          </div>
        </div>
      `);
    }
  }
  }

  return rendered.join("\n");
}

export function renderReactionsAndReplyHtml(publicId: string): string {
  return `
    <!-- P1: Recipient Reactions Bar -->
    <div class="recipient-interactions-section" style="margin-top: 2rem; width: 100%;">
      <div style="text-align: center; margin-bottom: 0.75rem;">
        <span style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #FDA4AF; opacity: 0.85; font-weight: 600;">Leave a Reaction</span>
      </div>
      <div data-testid="recipient-reactions-bar" style="display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">
        <button type="button" class="reaction-trigger-btn" data-testid="reaction-btn-heart" data-reaction="heart" aria-label="Send Love reaction" style="display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; border-radius: 9999px; background: rgba(225, 29, 72, 0.2); border: 1px solid rgba(244, 63, 94, 0.4); color: #FDA4AF; font-size: 0.8rem; cursor: pointer; transition: transform 0.2s, background 0.2s;">
          <span>❤️</span> <span>Love</span>
        </button>
        <button type="button" class="reaction-trigger-btn" data-testid="reaction-btn-sparkles" data-reaction="sparkles" aria-label="Send Magic reaction" style="display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; border-radius: 9999px; background: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.35); color: #FDE68A; font-size: 0.8rem; cursor: pointer; transition: transform 0.2s, background 0.2s;">
          <span>✨</span> <span>Magic</span>
        </button>
        <button type="button" class="reaction-trigger-btn" data-testid="reaction-btn-tears_of_joy" data-reaction="tears_of_joy" aria-label="Send Touched reaction" style="display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; border-radius: 9999px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.35); color: #BFDBFE; font-size: 0.8rem; cursor: pointer; transition: transform 0.2s, background 0.2s;">
          <span>🥹</span> <span>Touched</span>
        </button>
        <button type="button" class="reaction-trigger-btn" data-testid="reaction-btn-warm_smile" data-reaction="warm_smile" aria-label="Send Warmth reaction" style="display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; border-radius: 9999px; background: rgba(249, 115, 22, 0.15); border: 1px solid rgba(249, 115, 22, 0.35); color: #FED7AA; font-size: 0.8rem; cursor: pointer; transition: transform 0.2s, background 0.2s;">
          <span>🥰</span> <span>Warmth</span>
        </button>
        <button type="button" class="reaction-trigger-btn" data-testid="reaction-btn-rose" data-reaction="rose" aria-label="Send Rose reaction" style="display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; border-radius: 9999px; background: rgba(225, 29, 72, 0.2); border: 1px solid rgba(244, 63, 94, 0.4); color: #FDA4AF; font-size: 0.8rem; cursor: pointer; transition: transform 0.2s, background 0.2s;">
          <span>🌹</span> <span>Rose</span>
        </button>
      </div>
      <div id="reaction-toast" data-testid="reaction-sent-toast" class="hidden" style="text-align: center; margin-top: 0.5rem; font-size: 0.75rem; color: #FDA4AF; font-weight: 500;">
        Reaction sent with love! ❤️
      </div>
    </div>

    <!-- P1: Recipient Reply Card -->
    <div data-testid="recipient-reply-card" style="margin-top: 1.75rem; padding: 1.25rem; border-radius: 1rem; background: rgba(28, 5, 18, 0.9); border: 1px solid rgba(244, 63, 94, 0.3); text-align: center;">
      <div style="font-size: 0.65rem; color: #FDA4AF; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.35rem; font-weight: 600;">Private Reply</div>
      <h3 style="font-family: Georgia, serif; font-size: 1.1rem; color: #FAF8F5; margin-bottom: 0.5rem;">Send a Loving Note Back</h3>
      <p style="font-size: 0.75rem; color: #D5CEBF; margin-bottom: 0.85rem;">Only the creator of this experience will see your private reply.</p>
      
      <form id="recipient-reply-form" style="display: flex; flex-direction: column; gap: 0.65rem; max-width: 22rem; margin: 0 auto;">
        <input type="text" id="recipient-reply-name" data-testid="recipient-reply-name" placeholder="Your name or nickname (optional)" style="padding: 0.5rem 0.85rem; border-radius: 0.5rem; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); color: white; font-size: 0.8rem;" />
        <textarea id="recipient-reply-input" data-testid="recipient-reply-input" placeholder="Write your heartfelt reply..." required rows="3" style="padding: 0.65rem 0.85rem; border-radius: 0.5rem; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); color: white; font-size: 0.8rem; resize: vertical;"></textarea>
        <button type="submit" id="recipient-reply-submit" data-testid="recipient-reply-submit" style="padding: 0.5rem 1.25rem; border-radius: 9999px; background: linear-gradient(135deg, #E11D48, #9F1239); color: white; border: 1px solid #FB7185; font-size: 0.75rem; font-weight: 500; cursor: pointer;">Send Private Reply</button>
      </form>
      <div id="recipient-reply-success" data-testid="recipient-reply-success" class="hidden" style="margin-top: 0.75rem; padding: 0.65rem; border-radius: 0.5rem; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #6EE7B7; font-size: 0.8rem;">
        ✓ Your heartfelt reply has been delivered privately.
      </div>
      <div id="recipient-reply-error" data-testid="recipient-reply-error" class="hidden" style="margin-top: 0.5rem; color: #FDA4AF; font-size: 0.75rem;"></div>
    </div>
  `;
}

export function renderPrintKeepsakeButton(): string {
  return `
    <div style="margin-top: 1.25rem; text-align: center;">
      <button
        type="button"
        id="print-keepsake-btn"
        data-testid="print-keepsake-btn"
        aria-label="Save or print this keepsake"
        style="display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 1.15rem; border-radius: 9999px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #FDA4AF; background: rgba(76,5,25,0.5); border: 1px solid rgba(244,63,94,0.35); cursor: pointer; transition: all 0.2s;"
      >
        <span>🖨️</span>
        <span>Save as Keepsake / Print</span>
      </button>
    </div>
  `;
}

export const PRINT_MEDIA_STYLES = `
  @media print {
    body, html {
      background: #FFFFFF !important;
      color: #1C1917 !important;
      font-size: 12pt !important;
    }
    .ambient-glow, .blooms-container, .top-bar, #soundtrack-toggle,
    .seal-box, #reseal-btn, .recipient-interactions-section,
    [data-testid="recipient-reply-card"], #print-keepsake-btn,
    #read-aloud-btn, #voice-play-btn, #voice-scrub-bar, #memory-prev-btn,
    #memory-next-btn, .memory-thumbnails, #secret-verify-form, #reveal-secret-btn,
    #reasons-prev-btn, #reasons-next-btn, #compliment-trigger-btn,
    #fortune-crack-btn, #scratch-card-canvas, #scratch-reveal-btn,
    .promise-heart-btn, .adv-filter-btn, #spinner-spin-btn, #spinner-pick-btn,
    #finale-seal-btn {
      display: none !important;
    }
    .wrapper {
      padding: 0 !important;
      min-height: auto !important;
    }
    .content-container, .card, .envelope-card {
      box-shadow: none !important;
      border: none !important;
      background: transparent !important;
      max-width: 100% !important;
      padding: 0 !important;
    }
    .letter-box {
      display: block !important;
    }
    .paper-card {
      border: 1px solid #D6D3D1 !important;
      box-shadow: none !important;
      background: #FAFAF9 !important;
      color: #1C1917 !important;
      padding: 2rem !important;
    }
    .message-card {
      color: #1C1917 !important;
      font-size: 13pt !important;
    }
    .module-memories-card, .module-voice-card, .module-video-card,
    .module-timeline-card, .module-quiz-card, .module-secret-card,
    .module-openwhen-card, .module-reasons-card, .module-compliments-card,
    .module-fortune-card, .module-scratch-card, .module-promises-card,
    .module-adventures-card, .module-spinner-card, .module-finale-card {
      background: transparent !important;
      border: 1px solid #E7E5E4 !important;
      color: #1C1917 !important;
      page-break-inside: avoid;
    }
  }
`;

export function getModulesClientScript(publicId: string): string {
  return `
    // Read-Aloud Speech Synthesis
    var readAloudBtn = document.getElementById('read-aloud-btn');
    var isReading = false;
    if (readAloudBtn && 'speechSynthesis' in window) {
      readAloudBtn.addEventListener('click', function() {
        if (isReading) {
          window.speechSynthesis.cancel();
          isReading = false;
          readAloudBtn.innerHTML = '<span>🔊</span> <span>Listen to Letter</span>';
          return;
        }
        var letterText = document.querySelector('[data-testid="letter-message"]');
        if (!letterText) return;
        var text = letterText.innerText || letterText.textContent;
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.onend = function() {
          isReading = false;
          readAloudBtn.innerHTML = '<span>🔊</span> <span>Listen to Letter</span>';
        };
        utterance.onerror = function() {
          isReading = false;
          readAloudBtn.innerHTML = '<span>🔊</span> <span>Listen to Letter</span>';
        };
        window.speechSynthesis.speak(utterance);
        isReading = true;
        readAloudBtn.innerHTML = '<span>⏹</span> <span>Stop Listening</span>';
      });
    }

    // Printable Keepsake
    var printKeepsakeBtn = document.getElementById('print-keepsake-btn');
    if (printKeepsakeBtn) {
      printKeepsakeBtn.addEventListener('click', function() {
        window.print();
      });
    }

    // Voice Note Player
    var voiceAudio = document.getElementById('voice-audio-el');
    var voicePlayBtn = document.getElementById('voice-play-btn');
    var voiceScrub = document.getElementById('voice-scrub-bar');
    var voiceTime = document.getElementById('voice-time-display');
    if (voiceAudio && voicePlayBtn) {
      voicePlayBtn.addEventListener('click', function() {
        if (voiceAudio.paused) {
          voiceAudio.play();
          voicePlayBtn.textContent = '⏸';
        } else {
          voiceAudio.pause();
          voicePlayBtn.textContent = '▶';
        }
      });
      voiceAudio.addEventListener('timeupdate', function() {
        if (voiceAudio.duration) {
          var pct = (voiceAudio.currentTime / voiceAudio.duration) * 100;
          if (voiceScrub) voiceScrub.value = pct;
          if (voiceTime) {
            var mins = Math.floor(voiceAudio.currentTime / 60);
            var secs = Math.floor(voiceAudio.currentTime % 60);
            voiceTime.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
          }
        }
      });
      voiceAudio.addEventListener('ended', function() {
        voicePlayBtn.textContent = '▶';
        if (voiceScrub) voiceScrub.value = 0;
      });
      if (voiceScrub) {
        voiceScrub.addEventListener('input', function() {
          if (voiceAudio.duration) {
            voiceAudio.currentTime = (voiceScrub.value / 100) * voiceAudio.duration;
          }
        });
      }
    }

    // Memories Slideshow & Lightbox
    var memDataEl = document.getElementById('memories-data');
    var memItems = [];
    if (memDataEl) {
      try { memItems = JSON.parse(memDataEl.textContent || '[]'); } catch(e){}
    }
    if (memItems.length > 0) {
      var currentIdx = 0;
      var activePhoto = document.getElementById('memory-active-photo');
      var itemDate = document.getElementById('memory-item-date');
      var itemTitle = document.getElementById('memory-item-title');
      var itemCaption = document.getElementById('memory-item-caption');
      var counter = document.getElementById('memory-counter');
      var prevBtn = document.getElementById('memory-prev-btn');
      var nextBtn = document.getElementById('memory-next-btn');
      var thumbs = document.querySelectorAll('.memory-thumb-btn');
      var lightbox = document.getElementById('memory-lightbox');
      var lightboxImg = document.getElementById('lightbox-img');
      var lightboxCaption = document.getElementById('lightbox-caption');
      var lightboxClose = document.getElementById('lightbox-close-btn');
      var photoContainer = document.getElementById('memory-photo-container');

      function updateMemory(idx) {
        if (idx < 0) idx = memItems.length - 1;
        if (idx >= memItems.length) idx = 0;
        currentIdx = idx;
        var item = memItems[currentIdx];
        if (activePhoto) activePhoto.src = item.url;
        if (itemDate) itemDate.textContent = item.date || '';
        if (itemTitle) itemTitle.textContent = item.title || '';
        if (itemCaption) itemCaption.textContent = item.caption || '';
        if (counter) counter.textContent = (currentIdx + 1) + ' / ' + memItems.length;

        thumbs.forEach(function(tb, i) {
          tb.style.borderColor = i === currentIdx ? '#FB7185' : 'transparent';
        });
      }

      if (prevBtn) prevBtn.addEventListener('click', function() { updateMemory(currentIdx - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function() { updateMemory(currentIdx + 1); });

      thumbs.forEach(function(tb) {
        tb.addEventListener('click', function() {
          var idx = parseInt(tb.getAttribute('data-idx') || '0', 10);
          updateMemory(idx);
        });
      });

      // Lightbox open
      if (photoContainer && lightbox) {
        photoContainer.addEventListener('click', function() {
          var item = memItems[currentIdx];
          if (lightboxImg) lightboxImg.src = item.url;
          if (lightboxCaption) lightboxCaption.textContent = (item.title ? item.title + ' — ' : '') + (item.caption || '');
          lightbox.classList.remove('hidden');
        });
      }
      if (lightboxClose && lightbox) {
        lightboxClose.addEventListener('click', function() {
          lightbox.classList.add('hidden');
        });
      }
      if (lightbox) {
        lightbox.addEventListener('click', function(e) {
          if (e.target === lightbox) lightbox.classList.add('hidden');
        });
      }

      // Keyboard navigation
      window.addEventListener('keydown', function(e) {
        if (lightbox && !lightbox.classList.contains('hidden')) {
          if (e.key === 'Escape') lightbox.classList.add('hidden');
        } else {
          if (e.key === 'ArrowLeft') updateMemory(currentIdx - 1);
          if (e.key === 'ArrowRight') updateMemory(currentIdx + 1);
        }
      });

      // Touch swipe
      var touchStartX = 0;
      if (photoContainer) {
        photoContainer.addEventListener('touchstart', function(e) {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        photoContainer.addEventListener('touchend', function(e) {
          var diff = e.changedTouches[0].screenX - touchStartX;
          if (diff > 40) updateMemory(currentIdx - 1);
          else if (diff < -40) updateMemory(currentIdx + 1);
        }, { passive: true });
      }
    }

    // Secret Verification Form (Question Lock)
    var secretForm = document.getElementById('secret-verify-form');
    var secretInput = document.getElementById('secret-answer-input');
    var secretError = document.getElementById('secret-verify-error');
    var secretCard = document.querySelector('.secret-question-card');
    var revealedContent = document.getElementById('revealed-secret');
    if (secretForm && secretInput) {
      secretForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var answer = secretInput.value.trim();
        if (!answer) return;
        var submitBtn = document.getElementById('secret-verify-submit');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Verifying...'; }
        if (secretError) secretError.classList.add('hidden');

        fetch('/api/experiences/' + encodeURIComponent('${publicId}') + '/secret/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer: answer })
        })
        .then(function(res) {
          return res.json().then(function(data) {
            return { status: res.status, ok: res.ok, data: data };
          });
        })
        .then(function(result) {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Unlock Secret'; }
          if (result.ok && result.data.secretContent) {
            if (secretCard) secretCard.classList.add('hidden');
            if (revealedContent) {
              revealedContent.textContent = result.data.secretContent;
              revealedContent.classList.remove('hidden');
            }
          } else {
            if (secretError) {
              secretError.textContent = result.data.error || 'Incorrect answer. Try again!';
              secretError.classList.remove('hidden');
            }
          }
        })
        .catch(function(err) {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Unlock Secret'; }
          if (secretError) {
            secretError.textContent = 'Network error. Please try again.';
            secretError.classList.remove('hidden');
          }
        });
      });
    }

    // Tap-to-Reveal Secret (without Question Lock)
    var revealSecretBtn = document.getElementById('reveal-secret-btn');
    if (revealSecretBtn) {
      revealSecretBtn.addEventListener('click', function() {
        revealSecretBtn.disabled = true;
        revealSecretBtn.textContent = 'Revealing...';
        fetch('/api/experiences/' + encodeURIComponent('${publicId}') + '/secret', {
          headers: { 'Cache-Control': 'no-store' }
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
          revealSecretBtn.classList.add('hidden');
          if (revealedContent && data.secretContent) {
            revealedContent.textContent = data.secretContent;
            revealedContent.classList.remove('hidden');
          }
        })
        .catch(function() {
          revealSecretBtn.disabled = false;
          revealSecretBtn.textContent = 'Tap to Reveal Secret';
        });
      });
    }

    // Recipient Reactions
    var reactionBtns = document.querySelectorAll('.reaction-trigger-btn');
    var reactionToast = document.getElementById('reaction-toast');
    if (reactionBtns.length > 0) {
      reactionBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var reactionType = btn.getAttribute('data-reaction');
          if (!reactionType) return;
          btn.style.transform = 'scale(1.2)';
          setTimeout(function() { btn.style.transform = 'scale(1)'; }, 200);

          fetch('/api/experiences/' + encodeURIComponent('${publicId}') + '/reactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reactionType: reactionType })
          })
          .then(function(res) { return res.json(); })
          .then(function(data) {
            if (reactionToast) {
              reactionToast.classList.remove('hidden');
              setTimeout(function() { reactionToast.classList.add('hidden'); }, 3000);
            }
          })
          .catch(function(){});
        });
      });
    }

    // Recipient Reply Form
    var replyForm = document.getElementById('recipient-reply-form');
    var replyInput = document.getElementById('recipient-reply-input');
    var replyName = document.getElementById('recipient-reply-name');
    var replySuccess = document.getElementById('recipient-reply-success');
    var replyError = document.getElementById('recipient-reply-error');
    var replySubmit = document.getElementById('recipient-reply-submit');
    if (replyForm && replyInput) {
      replyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var replyText = replyInput.value.trim();
        if (!replyText) return;
        var senderName = replyName ? replyName.value.trim() : '';
        if (replySubmit) { replySubmit.disabled = true; replySubmit.textContent = 'Sending...'; }
        if (replyError) replyError.classList.add('hidden');

        fetch('/api/experiences/' + encodeURIComponent('${publicId}') + '/replies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ replyText: replyText, senderName: senderName || undefined })
        })
        .then(function(res) {
          return res.json().then(function(data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function(result) {
          if (replySubmit) { replySubmit.disabled = false; replySubmit.textContent = 'Send Private Reply'; }
          if (result.ok) {
            replyForm.classList.add('hidden');
            if (replySuccess) replySuccess.classList.remove('hidden');
          } else {
            if (replyError) {
              replyError.textContent = result.data.error || 'Failed to send reply.';
              replyError.classList.remove('hidden');
            }
          }
        })
        .catch(function() {
          if (replySubmit) { replySubmit.disabled = false; replySubmit.textContent = 'Send Private Reply'; }
          if (replyError) {
            replyError.textContent = 'Network error. Please try again.';
            replyError.classList.remove('hidden');
          }
        });
      });
    }

    // Reasons I Love You Interaction
    var reasonsDataEl = document.getElementById('reasons-data');
    var reasonsList = [];
    if (reasonsDataEl) {
      try { reasonsList = JSON.parse(reasonsDataEl.textContent || '[]'); } catch(e){}
    }
    if (reasonsList.length > 0) {
      var reasonIdx = 0;
      var rStep = document.getElementById('reasons-step-number');
      var rTitle = document.getElementById('reasons-item-title');
      var rText = document.getElementById('reasons-item-text');
      var rPrev = document.getElementById('reasons-prev-btn');
      var rNext = document.getElementById('reasons-next-btn');

      function showReason(idx) {
        if (idx < 0) idx = reasonsList.length - 1;
        if (idx >= reasonsList.length) idx = 0;
        reasonIdx = idx;
        var r = reasonsList[reasonIdx];
        if (rStep) rStep.textContent = 'Reason ' + (reasonIdx + 1) + ' of ' + reasonsList.length;
        if (rTitle) rTitle.textContent = r.title || '';
        if (rText) rText.textContent = r.text || '';
      }

      if (rPrev) rPrev.addEventListener('click', function() { showReason(reasonIdx - 1); });
      if (rNext) rNext.addEventListener('click', function() { showReason(reasonIdx + 1); });
    }

    // Compliment Machine Interaction
    var compDataEl = document.getElementById('compliments-data');
    var compPool = [];
    if (compDataEl) {
      try { compPool = JSON.parse(compDataEl.textContent || '[]'); } catch(e){}
    }
    var compBtn = document.getElementById('compliment-trigger-btn');
    var compText = document.getElementById('compliment-display-text');
    var lastCompIdx = 0;
    if (compBtn && compPool.length > 0) {
      compBtn.addEventListener('click', function() {
        var nextIdx = lastCompIdx;
        if (compPool.length > 1) {
          while (nextIdx === lastCompIdx) {
            nextIdx = Math.floor(Math.random() * compPool.length);
          }
        } else {
          nextIdx = 0;
        }
        lastCompIdx = nextIdx;
        if (compText) {
          compText.style.opacity = '0';
          setTimeout(function() {
            compText.textContent = compPool[nextIdx];
            compText.style.opacity = '1';
          }, 150);
        }
      });
    }

    // Fortune Cookie Interaction
    var fortDataEl = document.getElementById('fortunes-data');
    var fortPool = [];
    if (fortDataEl) {
      try { fortPool = JSON.parse(fortDataEl.textContent || '[]'); } catch(e){}
    }
    var fortBtn = document.getElementById('fortune-crack-btn');
    var fortSlip = document.getElementById('fortune-slip');
    var fortSlipText = document.getElementById('fortune-slip-text');
    var lastFortIdx = 0;
    if (fortBtn && fortPool.length > 0) {
      fortBtn.addEventListener('click', function() {
        var rand = Math.floor(Math.random() * fortPool.length);
        lastFortIdx = rand;
        fortBtn.style.transform = 'scale(1.2) rotate(15deg)';
        setTimeout(function() {
          fortBtn.style.transform = 'scale(1) rotate(0deg)';
          if (fortSlipText) fortSlipText.textContent = fortPool[rand];
          if (fortSlip) {
            fortSlip.style.display = 'block';
            fortSlip.style.animation = 'fadeIn 0.4s ease';
          }
        }, 200);
      });
    }

    // Scratch Card Interaction
    var scratchCanvas = document.getElementById('scratch-card-canvas');
    var scratchRevealBtn = document.getElementById('scratch-reveal-btn');
    if (scratchCanvas) {
      var sCtx = scratchCanvas.getContext('2d');
      if (sCtx) {
        var sW = scratchCanvas.width;
        var sH = scratchCanvas.height;
        // Draw metallic gradient foil
        var grad = sCtx.createLinearGradient(0, 0, sW, sH);
        grad.addColorStop(0, '#E11D48');
        grad.addColorStop(0.5, '#BE123C');
        grad.addColorStop(1, '#881337');
        sCtx.fillStyle = grad;
        sCtx.fillRect(0, 0, sW, sH);

        sCtx.fillStyle = '#FDA4AF';
        sCtx.font = 'bold 12px sans-serif';
        sCtx.textAlign = 'center';
        sCtx.fillText('✦ SCRATCH HERE ✦', sW / 2, sH / 2 + 4);

        var isScratching = false;

        function scratch(e) {
          if (!isScratching) return;
          var rect = scratchCanvas.getBoundingClientRect();
          var scaleX = scratchCanvas.width / rect.width;
          var scaleY = scratchCanvas.height / rect.height;
          var clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
          var clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
          var x = (clientX - rect.left) * scaleX;
          var y = (clientY - rect.top) * scaleY;

          sCtx.globalCompositeOperation = 'destination-out';
          sCtx.beginPath();
          sCtx.arc(x, y, 18, 0, Math.PI * 2);
          sCtx.fill();
        }

        scratchCanvas.addEventListener('mousedown', function(e) { isScratching = true; scratch(e); });
        window.addEventListener('mouseup', function() { isScratching = false; });
        scratchCanvas.addEventListener('mousemove', scratch);

        scratchCanvas.addEventListener('touchstart', function(e) { isScratching = true; scratch(e); }, { passive: true });
        window.addEventListener('touchend', function() { isScratching = false; });
        scratchCanvas.addEventListener('touchmove', scratch, { passive: true });
      }
    }
    if (scratchRevealBtn && scratchCanvas) {
      scratchRevealBtn.addEventListener('click', function() {
        var sCtx = scratchCanvas.getContext('2d');
        if (sCtx) {
          sCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
        }
        scratchCanvas.style.display = 'none';
      });
    }

    // Promise Wall Hearts
    var promiseHeartBtns = document.querySelectorAll('.promise-heart-btn');
    if (promiseHeartBtns.length > 0) {
      promiseHeartBtns.forEach(function(pBtn) {
        pBtn.addEventListener('click', function() {
          if (pBtn.textContent === '🤍') {
            pBtn.textContent = '❤️';
            pBtn.style.transform = 'scale(1.25)';
          } else {
            pBtn.textContent = '🤍';
            pBtn.style.transform = 'scale(1)';
          }
          setTimeout(function() { pBtn.style.transform = 'scale(1)'; }, 200);
        });
      });
    }

    // Future Adventures Filter
    var advFilterBtns = document.querySelectorAll('.adv-filter-btn');
    var advItems = document.querySelectorAll('.adventure-item');
    if (advFilterBtns.length > 0 && advItems.length > 0) {
      advFilterBtns.forEach(function(fBtn) {
        fBtn.addEventListener('click', function() {
          var targetFilter = fBtn.getAttribute('data-filter') || 'all';
          advFilterBtns.forEach(function(b) {
            b.style.background = 'rgba(255,255,255,0.1)';
            b.style.color = '#FAF8F5';
          });
          fBtn.style.background = '#E11D48';
          fBtn.style.color = 'white';

          advItems.forEach(function(item) {
            var s = item.getAttribute('data-status');
            if (targetFilter === 'all' || s === targetFilter) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }

    // Adventure Spinner Interaction
    var spinDataEl = document.getElementById('spinner-data');
    var spinOptions = [];
    if (spinDataEl) {
      try { spinOptions = JSON.parse(spinDataEl.textContent || '[]'); } catch(e){}
    }
    var spinBtn = document.getElementById('spinner-spin-btn');
    var pickBtn = document.getElementById('spinner-pick-btn');
    var wheelEl = document.getElementById('spinner-wheel-display');
    var resultEl = document.getElementById('spinner-result');
    var currentRotation = 0;

    function selectAdventure(opt) {
      if (resultEl) {
        resultEl.textContent = '✦ ' + opt + ' ✦';
        resultEl.style.color = '#FDA4AF';
        resultEl.style.fontWeight = 'bold';
      }
    }

    if (spinOptions.length > 0) {
      if (spinBtn) {
        spinBtn.addEventListener('click', function() {
          var chosenIdx = Math.floor(Math.random() * spinOptions.length);
          currentRotation += 720 + Math.floor(Math.random() * 360);
          if (wheelEl) wheelEl.style.transform = 'rotate(' + currentRotation + 'deg)';
          if (resultEl) resultEl.textContent = 'Spinning for you...';
          setTimeout(function() {
            selectAdventure(spinOptions[chosenIdx]);
          }, 3000);
        });
      }
      if (pickBtn) {
        pickBtn.addEventListener('click', function() {
          var chosenIdx = Math.floor(Math.random() * spinOptions.length);
          selectAdventure(spinOptions[chosenIdx]);
        });
      }
    }

    // Finale Seal Interaction
    var finaleSealBtn = document.getElementById('finale-seal-btn');
    var finaleToast = document.getElementById('finale-seal-toast');
    if (finaleSealBtn) {
      finaleSealBtn.addEventListener('click', function() {
        finaleSealBtn.disabled = true;
        finaleSealBtn.style.opacity = '0.6';
        finaleSealBtn.textContent = 'Sealed in My Heart 💖';
        if (finaleToast) {
          finaleToast.classList.remove('hidden');
        }
      });
    }
  `;
}
