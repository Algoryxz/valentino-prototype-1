"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ExperienceRenderer } from "@/templates/ExperienceRenderer";
import {
  MidnightRoseDraftConfig,
  ACCENT_THEMES,
  AccentTheme,
} from "@/templates/midnight-rose/v1/schema";
import {
  DEFAULT_VALENTINE_DECOR,
  CURATED_FLOWERS,
  CURATED_CHARMS,
  CURATED_PAPERS,
  CURATED_RIBBONS,
  CURATED_SEALS,
  normalizeValentineDecor,
} from "@/types/decor";
import { getTemplateDefinition, getAllTemplates } from "@/templates/registry";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AtmosphericGlow } from "@/components/ui/AtmosphericGlow";
import { ValentinoAtmosphere } from "@/components/ui/ValentinoAtmosphere";
import { StudioHeader, SaveStatus } from "@/components/studio/StudioHeader";
import { StudioStageStepper, StudioStageId } from "@/components/studio/StudioStageStepper";
import { StoryChaptersVisualizer } from "@/components/studio/StoryChaptersVisualizer";
import { WorldSelectorModal } from "@/components/studio/WorldSelectorModal";
import { FeatureDiscoveryDrawer } from "@/components/studio/FeatureDiscoveryDrawer";
import { ModuleManager } from "@/modules/editor/ModuleManager";
import { MultimediaStorySection } from "@/components/studio/MultimediaStorySection";
import { PreviewAndSendSection } from "@/components/studio/PreviewAndSendSection";
import { MobileWorkspaceSwitcher } from "@/components/studio/MobileWorkspaceSwitcher";
import { FeatureDefinition } from "@/features/types";

const STAGE_ORDER: StudioStageId[] = [
  "personalize",
  "world",
  "story",
  "mood",
  "preview",
];

const STAGE_NEXT_LABELS: Record<StudioStageId, string> = {
  personalize: "Continue to Atmosphere",
  world: "Continue to Story & Keepsakes",
  story: "Continue to Stationery & Styling",
  mood: "Continue to Delivery & Keepsakes",
  preview: "Publish Valentine",
  moments: "Continue to Stationery & Styling",
};

// World-derived subtle accent tokens for inspector controls
const WORLD_ACCENT_TOKENS: Record<
  string,
  {
    text: string;
    border: string;
    bgSubtle: string;
    glow: string;
    dot: string;
    bar: string;
    ring: string;
  }
> = {
  "cloud-nine": {
    text: "text-amber-200",
    border: "border-amber-300/40",
    bgSubtle: "bg-amber-400/10",
    glow: "shadow-[0_0_12px_rgba(252,211,77,0.35)]",
    dot: "bg-amber-300",
    bar: "bg-amber-300",
    ring: "focus:border-amber-300/60 focus:ring-amber-300/20",
  },
  "midnight-rose": {
    text: "text-rose-300",
    border: "border-rose-400/40",
    bgSubtle: "bg-rose-500/10",
    glow: "shadow-[0_0_12px_rgba(244,63,94,0.35)]",
    dot: "bg-rose-400",
    bar: "bg-rose-400",
    ring: "focus:border-rose-400/60 focus:ring-rose-400/20",
  },
  kage: {
    text: "text-purple-300",
    border: "border-purple-400/40",
    bgSubtle: "bg-purple-500/10",
    glow: "shadow-[0_0_12px_rgba(167,139,250,0.35)]",
    dot: "bg-purple-300",
    bar: "bg-purple-300",
    ring: "focus:border-purple-400/60 focus:ring-purple-400/20",
  },
  "apricot-film": {
    text: "text-amber-300",
    border: "border-amber-400/40",
    bgSubtle: "bg-amber-500/10",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.35)]",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
    ring: "focus:border-amber-400/60 focus:ring-amber-400/20",
  },
  "wildflower-paper": {
    text: "text-emerald-300",
    border: "border-emerald-400/40",
    bgSubtle: "bg-emerald-500/10",
    glow: "shadow-[0_0_12px_rgba(52,211,153,0.35)]",
    dot: "bg-emerald-400",
    bar: "bg-emerald-400",
    ring: "focus:border-emerald-400/60 focus:ring-emerald-400/20",
  },
  "ocean-letter": {
    text: "text-sky-300",
    border: "border-sky-400/40",
    bgSubtle: "bg-sky-500/10",
    glow: "shadow-[0_0_12px_rgba(56,189,248,0.35)]",
    dot: "bg-sky-400",
    bar: "bg-sky-400",
    ring: "focus:border-sky-400/60 focus:ring-sky-400/20",
  },
};

// Subtle atmospheric canvas environments per living world
const WORLD_AMBIENCE: Record<
  string,
  {
    bgGradient: string;
    glowColor: string;
  }
> = {
  "midnight-rose": {
    bgGradient:
      "radial-gradient(ellipse at 50% 35%, rgba(159, 18, 57, 0.20), transparent 70%), radial-gradient(ellipse at 50% 80%, rgba(244, 63, 94, 0.08), transparent 60%)",
    glowColor: "rgba(244, 63, 94, 0.25)",
  },
  "cloud-nine": {
    bgGradient:
      "radial-gradient(ellipse at 50% 30%, rgba(224, 242, 254, 0.18), transparent 70%), radial-gradient(ellipse at 50% 75%, rgba(254, 243, 199, 0.12), transparent 60%)",
    glowColor: "rgba(252, 211, 77, 0.25)",
  },
  "kage": {
    bgGradient:
      "radial-gradient(ellipse at 50% 35%, rgba(167, 139, 250, 0.15), transparent 70%), radial-gradient(ellipse at 50% 75%, rgba(52, 211, 153, 0.08), transparent 60%)",
    glowColor: "rgba(167, 139, 250, 0.25)",
  },
  "apricot-film": {
    bgGradient:
      "radial-gradient(ellipse at 50% 35%, rgba(245, 158, 11, 0.18), transparent 70%), radial-gradient(ellipse at 50% 75%, rgba(217, 119, 6, 0.10), transparent 60%)",
    glowColor: "rgba(245, 158, 11, 0.25)",
  },
  "wildflower-paper": {
    bgGradient:
      "radial-gradient(ellipse at 50% 35%, rgba(16, 185, 129, 0.16), transparent 70%), radial-gradient(ellipse at 50% 75%, rgba(244, 114, 182, 0.10), transparent 60%)",
    glowColor: "rgba(52, 211, 153, 0.25)",
  },
  "ocean-letter": {
    bgGradient:
      "radial-gradient(ellipse at 50% 35%, rgba(56, 189, 248, 0.18), transparent 70%), radial-gradient(ellipse at 50% 75%, rgba(2, 132, 199, 0.10), transparent 60%)",
    glowColor: "rgba(56, 189, 248, 0.25)",
  },
};

function EditExperienceContent() {
  const params = useParams<{ publicId: string }>();
  const publicId = params.publicId;

  const [config, setConfig] = useState<MidnightRoseDraftConfig>({
    partnerName: "",
    senderName: "",
    greeting: "To my favorite person",
    message: "",
    signOff: "With all my love",
    accentTheme: "crimson-rose",
    decor: DEFAULT_VALENTINE_DECOR,
    modules: {},
  });

  const [templateMeta, setTemplateMeta] = useState<{ id: string; version: string; name: string }>({
    id: "midnight-rose",
    version: "v1",
    name: "Midnight Rose",
  });

  const [revision, setRevision] = useState<number>(1);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Modals & Navigation
  const [worldModalOpen, setWorldModalOpen] = useState(false);
  const [featureDrawerOpen, setFeatureDrawerOpen] = useState(false);
  const [activeMomentKey, setActiveMomentKey] = useState<
    | "timeline"
    | "quiz"
    | "secret"
    | "openWhen"
    | "reasons"
    | "compliments"
    | "fortuneCookie"
    | "scratchCard"
    | "promises"
    | "futureAdventures"
    | "adventureSpinner"
    | "finale"
    | null
  >(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishErrors, setPublishErrors] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [activeSection, setActiveSection] = useState<StudioStageId>("personalize");
  const [previewDeviceMode, setPreviewDeviceMode] = useState<"phone" | "tablet" | "expanded">("phone");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showAdvancedStory, setShowAdvancedStory] = useState(false);
  const [showMultimediaSection, setShowMultimediaSection] = useState(false);
  const searchParams = useSearchParams();

  const inspectorRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const savedInspectorScrollTop = useRef<number>(0);
  const savedPreviewScrollTop = useRef<number>(0);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Monitor virtual keyboard / active typing focus on mobile
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        setIsInputFocused(true);
      }
    };
    const handleFocusOut = () => {
      setIsInputFocused(false);
    };
    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  // Seamless scroll preservation when switching between Editor and Preview on mobile
  const handleMobileTabChange = useCallback((nextTab: "form" | "preview") => {
    if (nextTab === mobileTab) return;

    if (mobileTab === "form") {
      if (inspectorRef.current) {
        savedInspectorScrollTop.current = inspectorRef.current.scrollTop;
      }
    } else {
      if (previewScrollRef.current) {
        savedPreviewScrollTop.current = previewScrollRef.current.scrollTop;
      }
    }

    setMobileTab(nextTab);

    // Restore scroll position after layout repaints
    requestAnimationFrame(() => {
      if (nextTab === "form") {
        if (inspectorRef.current && savedInspectorScrollTop.current > 0) {
          inspectorRef.current.scrollTop = savedInspectorScrollTop.current;
        }
      } else {
        if (previewScrollRef.current && savedPreviewScrollTop.current > 0) {
          previewScrollRef.current.scrollTop = savedPreviewScrollTop.current;
        }
      }
    });
  }, [mobileTab]);

  const handleToggleAdvancedStory = useCallback(() => {
    setShowAdvancedStory((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          const input = document.getElementById("greeting");
          if (input) {
            input.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 100);
      }
      return next;
    });
  }, []);

  const scrollToSection = useCallback((sectionId: StudioStageId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element && inspectorRef.current) {
      const containerTop = inspectorRef.current.getBoundingClientRect().top;
      const elementTop = element.getBoundingClientRect().top;
      const targetScroll = inspectorRef.current.scrollTop + (elementTop - containerTop) - 64;
      inspectorRef.current.scrollTo({ top: Math.max(0, targetScroll), behavior: "smooth" });
    } else if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleInspectorScroll = useCallback(() => {
    if (!inspectorRef.current) return;
    const containerTop = inspectorRef.current.getBoundingClientRect().top;

    let candidate: StudioStageId = "personalize";
    for (const id of STAGE_ORDER) {
      const el = document.getElementById(`section-${id}`);
      if (el) {
        const top = el.getBoundingClientRect().top - containerTop;
        if (top <= 140) {
          candidate = id;
        }
      }
    }
    setActiveSection(candidate);
  }, []);

  // Deep-linking focus support
  useEffect(() => {
    const focus = searchParams?.get("focus");
    if (!focus) return;
    if (focus === "letter" || focus === "personalize") {
      setActiveSection("personalize");
      scrollToSection("personalize");
    } else if (focus === "story" || focus === "chapters") {
      setActiveSection("story");
      scrollToSection("story");
    } else if (
      focus === "timeline" ||
      focus === "quiz" ||
      focus === "secret" ||
      focus === "openWhen" ||
      focus === "reasons" ||
      focus === "compliments" ||
      focus === "fortuneCookie" ||
      focus === "scratchCard" ||
      focus === "promises" ||
      focus === "futureAdventures" ||
      focus === "adventureSpinner" ||
      focus === "finale"
    ) {
      setActiveSection("moments");
      setActiveMomentKey(focus as any);
      scrollToSection("moments");
    } else if (focus === "mood" || focus === "decor") {
      setActiveSection("mood");
      scrollToSection("mood");
    } else if (focus === "world") {
      setWorldModalOpen(true);
    } else if (focus === "preview") {
      setActiveSection("preview");
      scrollToSection("preview");
    } else if (focus === "send") {
      setActiveSection("preview");
      scrollToSection("preview");
    }
  }, [searchParams, scrollToSection]);

  const configRef = useRef(config);
  configRef.current = config;
  const templateMetaRef = useRef(templateMeta);
  templateMetaRef.current = templateMeta;
  const revisionRef = useRef(revision);
  revisionRef.current = revision;
  const isDirtyRef = useRef(false);
  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Draft Fetch
  useEffect(() => {
    let isMounted = true;
    async function loadDraft() {
      try {
        const res = await fetch(`/api/experiences/${publicId}/draft`, {
          headers: { "Cache-Control": "no-store" },
        });

        if (res.status === 401 || res.status === 403) {
          if (isMounted) setAuthError("You do not have creator edit access for this Valentine.");
          return;
        }

        if (res.status === 404) {
          if (isMounted) setAuthError("Experience draft not found.");
          return;
        }

        if (!res.ok) {
          if (isMounted) setAuthError("Unable to retrieve experience draft.");
          return;
        }

        const data = await res.json();
        if (isMounted) {
          const loadedConfig = data.draftConfig || {};
          setConfig({
            partnerName: loadedConfig.partnerName || "",
            senderName: loadedConfig.senderName || "",
            greeting: loadedConfig.greeting || "To my favorite person",
            message: loadedConfig.message || "",
            signOff: loadedConfig.signOff || "With all my love",
            accentTheme: loadedConfig.accentTheme || "crimson-rose",
            decor: normalizeValentineDecor(loadedConfig.decor),
            modules: loadedConfig.modules || {},
            heroMediaId: loadedConfig.heroMediaId || null,
            soundtrackUrl: loadedConfig.soundtrackUrl || null,
            scheduledUnlockAt: loadedConfig.scheduledUnlockAt || null,
            narrative: loadedConfig.narrative || {
              chapters: [],
              pacing: "balanced",
              welcome: { enabled: false },
            },
          } as any);

          if (data.templateId) {
            const def = getTemplateDefinition(data.templateId, data.templateVersion || "v1");
            setTemplateMeta({
              id: data.templateId,
              version: data.templateVersion || "v1",
              name: def?.name || data.templateId,
            });
          }

          const initialRev = data.draftRevision ?? data.revision ?? 1;
          setRevision(initialRev);
          revisionRef.current = initialRev;
          setSaveStatus("saved");
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setAuthError("A network error occurred while loading your draft.");
          setIsLoading(false);
        }
      }
    }

    loadDraft();

    return () => {
      isMounted = false;
    };
  }, [publicId]);

  // 2. Perform Save API Call
  const performSave = useCallback(
    async (keepalive = false): Promise<boolean> => {
      if (isSavingRef.current) {
        pendingSaveRef.current = true;
        return false;
      }

      isSavingRef.current = true;
      setSaveStatus("saving");

      const payload = {
        draftConfig: configRef.current,
        baseRevision: revisionRef.current,
        templateId: templateMetaRef.current.id,
        templateVersion: templateMetaRef.current.version,
      };

      try {
        const fetchOptions: RequestInit = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
          body: JSON.stringify(payload),
        };

        if (keepalive) {
          fetchOptions.keepalive = true;
        }

        const res = await fetch(`/api/experiences/${publicId}/draft`, fetchOptions);

        if (res.status === 409) {
          setSaveStatus("conflict");
          isSavingRef.current = false;
          return false;
        }

        if (!res.ok) {
          setSaveStatus("error");
          isSavingRef.current = false;
          return false;
        }

        const data = await res.json();
        const nextRev = data.draftRevision ?? data.revision ?? revisionRef.current + 1;
        setRevision(nextRev);
        revisionRef.current = nextRev;
        isDirtyRef.current = false;
        setSaveStatus("saved");
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        isSavingRef.current = false;

        if (pendingSaveRef.current) {
          pendingSaveRef.current = false;
          return performSave();
        }

        return true;
      } catch (err) {
        setSaveStatus("error");
        isSavingRef.current = false;
        return false;
      }
    },
    [publicId]
  );

  // 3. Trigger Autosave on Config Changes
  const triggerAutosave = useCallback(() => {
    isDirtyRef.current = true;
    setSaveStatus("idle");

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSave();
    }, 1500);
  }, [performSave]);

  const handleConfigChange = (updater: (prev: MidnightRoseDraftConfig) => MidnightRoseDraftConfig) => {
    setConfig((prev) => {
      const next = updater(prev);
      configRef.current = next;
      return next;
    });
    triggerAutosave();
  };

  const handleModulesChange = useCallback(
    (updater: (prevModules: any) => any) => {
      setConfig((prev) => {
        const nextModules = updater(prev.modules || {});
        const next = { ...prev, modules: nextModules };
        configRef.current = next;
        return next;
      });
      triggerAutosave();
    },
    [triggerAutosave]
  );

  // 4. Handle World Switching
  const handleSelectWorld = (templateId: string, templateVersion: string) => {
    const def = getTemplateDefinition(templateId, templateVersion);
    setTemplateMeta({
      id: templateId,
      version: templateVersion,
      name: def?.name || templateId,
    });
    templateMetaRef.current = {
      id: templateId,
      version: templateVersion,
      name: def?.name || templateId,
    };
    setWorldModalOpen(false);

    // Immediate save after world switch
    isDirtyRef.current = true;
    setSaveStatus("idle");

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      performSave();
    }, 500);
  };

  // 5. Lifecycle Flushes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isDirtyRef.current) {
        performSave(true);
      }
    };

    const handlePageHide = () => {
      if (isDirtyRef.current) {
        performSave(true);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [performSave]);

  // 6. Handle Publish Action
  const handlePublish = async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (isDirtyRef.current || saveStatus === "saving") {
      const saved = await performSave();
      if (!saved) return;
    }

    setIsPublishing(true);
    setPublishErrors([]);

    try {
      let res = await fetch(`/api/experiences/${publicId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({
          expectedRevision: revisionRef.current,
        }),
      });

      if (res.status === 409) {
        const data = await res.json().catch(() => ({}));
        if (data.currentRevision) {
          revisionRef.current = data.currentRevision;
          setRevision(data.currentRevision);
          res = await fetch(`/api/experiences/${publicId}/publish`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
            body: JSON.stringify({
              expectedRevision: data.currentRevision,
            }),
          });
        }
      }

      if (res.status === 409) {
        const data = await res.json().catch(() => ({}));
        setPublishErrors(["Draft was modified. Please review changes and publish again."]);
        if (data.currentRevision) setRevision(data.currentRevision);
        return;
      }

      if (res.status === 422) {
        const errData = await res.json();
        const fieldErrors = Object.values(errData.validationErrors?.fieldErrors || {}).flat() as string[];
        setPublishErrors(fieldErrors.length > 0 ? fieldErrors : ["Please complete all required fields."]);
        return;
      }

      if (!res.ok) {
        setPublishErrors(["Failed to publish experience. Please try again."]);
        return;
      }

      const data = await res.json();
      setPublicUrl(data.publicUrl || `${window.location.origin}/v/${publicId}`);
      setPublishModalOpen(true);
    } catch (err) {
      setPublishErrors(["A network error occurred while publishing. Please try again."]);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSelectFeature = useCallback(
    (feature: FeatureDefinition) => {
      if (feature.targetModuleKey) {
        const modKey = feature.targetModuleKey;
        handleModulesChange((prev) => {
          const current = prev?.[modKey] || {};
          return {
            ...prev,
            [modKey]: {
              ...current,
              enabled: true,
            },
          };
        });
        setActiveMomentKey(modKey);
        setFeatureDrawerOpen(false);
        scrollToSection("moments");
      } else if (feature.actionType === "open-world-modal") {
        setWorldModalOpen(true);
        setFeatureDrawerOpen(false);
      } else if (feature.targetSection) {
        setFeatureDrawerOpen(false);
        scrollToSection(feature.targetSection as any);
      }
    },
    [scrollToSection, handleModulesChange]
  );

  const activeMomentsCount = Object.values(config.modules || {}).filter(
    (m: any) => m && m.enabled
  ).length;

  const currentTemplateDef = getTemplateDefinition(templateMeta.id, templateMeta.version);

  // Completion calculation for stages
  const stageCompletion: Record<StudioStageId, boolean> = {
    personalize: Boolean(config.partnerName?.trim() && config.senderName?.trim() && config.message?.trim()),
    world: Boolean(templateMeta.id),
    story: Boolean((config as any).narrative?.welcome?.enabled || (config as any).narrative?.pacing || activeMomentsCount > 0),
    moments: activeMomentsCount > 0,
    mood: Boolean(config.decor?.paper && config.decor?.waxSeal),
    preview: Boolean(config.partnerName?.trim() && config.message?.trim()),
  };

  const currentStageIndex = STAGE_ORDER.indexOf(activeSection);
  const nextStageLabel = STAGE_NEXT_LABELS[activeSection] || "Continue";

  const goToPreviousStage = () => {
    if (currentStageIndex > 0) {
      scrollToSection(STAGE_ORDER[currentStageIndex - 1]);
    }
  };

  const goToNextStage = () => {
    if (activeSection === "preview") {
      handlePublish();
    } else if (currentStageIndex < STAGE_ORDER.length - 1) {
      scrollToSection(STAGE_ORDER[currentStageIndex + 1]);
    }
  };

  const ambience = WORLD_AMBIENCE[templateMeta.id] || WORLD_AMBIENCE["midnight-rose"];
  const accents = WORLD_ACCENT_TOKENS[templateMeta.id] || WORLD_ACCENT_TOKENS["midnight-rose"];

  // Auth Error State
  if (authError) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center p-6 text-center bg-[#0A090C] text-[#FAF8F5]">
        <AtmosphericGlow theme="crimson-rose" intensity="subtle" />
        <Card variant="glass" className="max-w-md w-full p-8 border-white/[0.12] text-center space-y-4 relative z-10 bg-[#121017]">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-2xl">
            🔒
          </div>
          <h1 className="text-xl font-display font-medium text-white">Edit Access Unavailable</h1>
          <p className="text-sm text-white/70 font-ui font-light leading-relaxed">{authError}</p>
          <div className="pt-2">
            <Link href="/create">
              <Button size="md" variant="primary">
                Create a New Valentine
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] flex flex-col bg-[#0B090F] text-[#FAF8F5] font-ui antialiased overflow-hidden">
      {/* 1. Mandatory Owner Reminder Banner */}
      <div
        data-testid="browser-storage-reminder"
        className="bg-rose-950/20 backdrop-blur-md border-b border-rose-500/10 px-4 py-1.5 text-center text-xs text-rose-200/80 font-ui flex items-center justify-center gap-2 select-none shrink-0"
      >
        <span>💌</span>
        <span>
          <strong className="text-white">Edit access is stored in this browser.</strong> Keep this device available if you want to edit this Valentine later.
        </span>
      </div>

      {/* 2. Fixed Studio Header */}
      <StudioHeader
        partnerName={config.partnerName}
        templateName={templateMeta.name}
        templateVersion={templateMeta.version}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        isPublishing={isPublishing}
        mobileTab={mobileTab}
        onChangeWorldClick={() => setWorldModalOpen(true)}
        onPublishClick={handlePublish}
        onMobileTabChange={handleMobileTabChange}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
        previewDeviceMode={previewDeviceMode}
        onPreviewDeviceModeChange={setPreviewDeviceMode}
      />

      {/* World Selector Modal */}
      <WorldSelectorModal
        isOpen={worldModalOpen}
        currentTemplateId={templateMeta.id}
        onClose={() => setWorldModalOpen(false)}
        onSelectWorld={handleSelectWorld}
      />

      {/* 3. Studio Cockpit: 2-Column Creative Workstation Layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT COLUMN: Persistent Live Visual Canvas (Never scrolls away!) */}
        <div
          id="studio-preview-canvas"
          data-testid="studio-preview-canvas"
          className={`flex-1 min-w-0 bg-[#07060A] flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 relative select-none overflow-hidden h-full ${
            mobileTab === "form" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* World-specific ambient lighting with seamless crossfade */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`ambience-${templateMeta.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-0"
              style={{ background: ambience.bgGradient }}
            />
          </AnimatePresence>

          {/* Canonical Global Atmosphere in serene studio mode */}
          <ValentinoAtmosphere
            context="studio"
            world={templateMeta.id}
            intensity="subtle"
            scrollReactive={false}
          />

          {/* Live Preview Indicator */}
          <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
              Live Preview · Updates instantly
            </span>
          </div>

          {/* Desktop Device Mode / World Label */}
          <div className="hidden lg:flex items-center justify-between w-full max-w-[420px] mb-3 px-2 text-xs font-mono z-20 text-white/40">
            <span>{templateMeta.name}</span>
            <span>{previewDeviceMode.toUpperCase()} VIEW</span>
          </div>

          {/* Centered Device Frame (Scaled 55–70% of available height) */}
          <div
            className={`w-full transition-all duration-300 relative z-10 flex flex-col items-center justify-center ${
              previewDeviceMode === "tablet"
                ? "max-w-[560px]"
                : previewDeviceMode === "expanded"
                ? "max-w-[660px]"
                : "max-w-[380px] sm:max-w-[400px]"
            }`}
          >
            <div className="w-full rounded-[38px] p-2.5 sm:p-3 bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-black/95 shadow-[0_30px_90px_rgba(0,0,0,0.9)] border border-white/[0.1] relative">
              <div className="rounded-[30px] overflow-hidden bg-[#0A090C] border border-black/80 flex flex-col h-[70vh] sm:h-[65vh] min-h-[460px] max-h-[740px] shadow-inner relative">
                {/* Minimal Device Top Bar */}
                <div className="h-5 w-full bg-black/60 flex items-center justify-between px-5 pt-0.5 select-none z-30 shrink-0">
                  <span className="text-[10px] text-white/50 font-ui font-medium">9:41</span>
                  <div className="w-12 h-2.5 rounded-full bg-black border border-white/10" />
                  <div className="flex items-center gap-1 text-[9px] text-white/50 font-ui">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Screen Content: Real ExperienceRenderer with cinematic crossfade */}
                <div ref={previewScrollRef} className="flex-1 overflow-y-auto relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`renderer-${templateMeta.id}`}
                      initial={{ opacity: 0.85 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0.85 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="min-h-full"
                    >
                      <ExperienceRenderer
                        templateId={templateMeta.id}
                        templateVersion={templateMeta.version}
                        mode="preview"
                        rawConfig={config}
                        publicId={publicId}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Soft floor shadow underneath device */}
            <div className="w-3/4 h-5 mt-2 bg-black/70 blur-lg rounded-full pointer-events-none" />
          </div>
        </div>

        {/* RIGHT COLUMN: Independently Scrolling Creative Inspector Rail */}
        {!isFocusMode && (
          <div
            id="studio-inspector-pane"
            ref={inspectorRef}
            onScroll={handleInspectorScroll}
            data-lenis-prevent="true"
            className={`w-full lg:w-[480px] xl:w-[520px] 2xl:w-[560px] h-full shrink-0 border-t lg:border-t-0 lg:border-l border-white/[0.06] bg-[#0E0C12] overflow-y-auto ${
              mobileTab === "preview" ? "hidden lg:flex" : "flex flex-col"
            }`}
          >
            {/* Sticky Compact Stage Navigation Spine */}
            <StudioStageStepper
              activeStage={activeSection}
              onSelectStage={scrollToSection}
              completedStages={stageCompletion}
              worldId={templateMeta.id}
              className="sticky top-0 z-30"
            />

            {/* Workbench Body */}
            <div className="p-5 sm:p-7 space-y-9 flex-1 pb-32 sm:pb-24">
              {/* ------------------------------------------------------------- */}
              {/* STAGE 01: Dedication & Love Letter                            */}
              {/* ------------------------------------------------------------- */}
              <section id="section-personalize" className="space-y-5 scroll-mt-20">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono ${accents.text}`}>01</span>
                      <h2 className="text-sm font-serif uppercase tracking-widest text-white">Dedication & Love Letter</h2>
                    </div>
                    {config.partnerName?.trim() && config.message?.trim() ? (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <span>✓</span>
                        <span>Inscribed</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-rose-300/80">
                        Required to publish
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-serif italic text-white/50">
                    &ldquo;The personal words and devotion meant for their eyes only&rdquo;
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Recipient & Author Compact Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="partnerName"
                          className="block text-[11px] uppercase tracking-wider text-white/60 font-mono"
                        >
                          Who is this for? <span className={accents.text}>*</span>
                        </label>
                        <span className="text-[10px] text-white/40 font-mono">
                          {(config.partnerName || "").length}/60
                        </span>
                      </div>
                      <input
                        id="partnerName"
                        data-testid="input-partner-name"
                        type="text"
                        maxLength={60}
                        placeholder="e.g. Maya, Ananya, Alex"
                        value={config.partnerName || ""}
                        onChange={(e) =>
                          handleConfigChange((prev) => ({
                            ...prev,
                            partnerName: e.target.value,
                          }))
                        }
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-white placeholder-white/25 focus:outline-none focus:border-white/30 ${accents.ring} text-xs font-ui transition-all`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="senderName"
                          className="block text-[11px] uppercase tracking-wider text-white/60 font-mono"
                        >
                          And who are you? <span className={accents.text}>*</span>
                        </label>
                        <span className="text-[10px] text-white/40 font-mono">
                          {(config.senderName || "").length}/60
                        </span>
                      </div>
                      <input
                        id="senderName"
                        data-testid="input-sender-name"
                        type="text"
                        maxLength={60}
                        placeholder="e.g. Rohan, Chris, or your pet name"
                        value={config.senderName || ""}
                        onChange={(e) =>
                          handleConfigChange((prev) => ({
                            ...prev,
                            senderName: e.target.value,
                          }))
                        }
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-white placeholder-white/25 focus:outline-none focus:border-white/30 ${accents.ring} text-xs font-ui transition-all`}
                      />
                    </div>
                  </div>

                  {/* Love Letter Writing Surface (Stationery Feel) */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="message"
                        className="block text-[11px] uppercase tracking-wider text-white/60 font-mono"
                      >
                        Say what&apos;s in your heart <span className={accents.text}>*</span>
                      </label>
                      <span className="text-[10px] text-white/40 font-mono">
                        {(config.message || "").length}/2000
                      </span>
                    </div>
                    <textarea
                      id="message"
                      data-testid="input-message"
                      rows={6}
                      maxLength={2000}
                      placeholder="Write your personal letter here. Mention favorite memories, the quiet moments you cherish, or why they make the world beautiful…"
                      value={config.message || ""}
                      onChange={(e) =>
                        handleConfigChange((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-3.5 rounded-xl bg-[#16131D]/90 border border-white/[0.12] text-white placeholder-white/25 focus:outline-none focus:border-white/40 ${accents.ring} text-sm leading-relaxed transition-all resize-y font-romantic text-base shadow-inner`}
                    />
                  </div>

                  {/* Collapsed by default: Salutation & Sign-Off */}
                  <div className="pt-1">
                    <button
                      type="button"
                      id="accordion-toggle-salutation"
                      aria-expanded={showAdvancedStory}
                      aria-controls="accordion-content-salutation"
                      onClick={handleToggleAdvancedStory}
                      className="min-h-[44px] py-2 px-1 text-xs font-serif italic text-white/60 hover:text-white flex items-center gap-2 transition-colors cursor-pointer select-none"
                    >
                      <span className="text-[10px] w-3">{showAdvancedStory ? "▾" : "▸"}</span>
                      <span>Customize Salutation & Sign-Off</span>
                    </button>

                    {showAdvancedStory && (
                      <div
                        id="accordion-content-salutation"
                        className={`space-y-3 pt-3 pl-3 border-l ${accents.border} mt-1 animate-fadeIn transition-all duration-300`}
                      >
                        <div className="space-y-1">
                          <label
                            htmlFor="greeting"
                            className="block text-[11px] uppercase tracking-wider text-white/50 font-mono"
                          >
                            Salutation / Greeting
                          </label>
                          <input
                            id="greeting"
                            data-testid="input-greeting"
                            type="text"
                            maxLength={100}
                            placeholder="To my favorite person"
                            value={config.greeting || ""}
                            onChange={(e) =>
                              handleConfigChange((prev) => ({
                                ...prev,
                                greeting: e.target.value,
                              }))
                            }
                            className={`w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.1] text-white placeholder-white/25 focus:outline-none focus:border-white/30 ${accents.ring} text-xs font-ui`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="signOff"
                            className="block text-[11px] uppercase tracking-wider text-white/50 font-mono"
                          >
                            Sign-off Closing
                          </label>
                          <input
                            id="signOff"
                            data-testid="input-sign-off"
                            type="text"
                            maxLength={100}
                            placeholder="With all my love"
                            value={config.signOff || ""}
                            onChange={(e) =>
                              handleConfigChange((prev) => ({
                                ...prev,
                                signOff: e.target.value,
                              }))
                            }
                            className={`w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.1] text-white placeholder-white/25 focus:outline-none focus:border-white/30 ${accents.ring} text-xs font-ui`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Collapsed by default: Multimedia & Audio Keepsakes */}
                  <div className="pt-2 border-t border-white/[0.04]">
                    <button
                      type="button"
                      id="accordion-toggle-multimedia"
                      aria-expanded={showMultimediaSection}
                      aria-controls="accordion-content-multimedia"
                      onClick={() => setShowMultimediaSection(!showMultimediaSection)}
                      className="min-h-[44px] py-2 px-1 text-xs font-serif italic text-white/60 hover:text-white flex items-center gap-2 transition-colors cursor-pointer select-none"
                    >
                      <span className="text-[10px] w-3">{showMultimediaSection ? "▾" : "▸"}</span>
                      <span>Multimedia, Memories & Audio</span>
                    </button>

                    {showMultimediaSection && (
                      <div id="accordion-content-multimedia" className="pt-3 animate-fadeIn">
                        <MultimediaStorySection
                          publicId={publicId}
                          modules={config.modules}
                          onChange={handleModulesChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* ------------------------------------------------------------- */}
              {/* STAGE 02: Visual Atmosphere                                   */}
              {/* ------------------------------------------------------------- */}
              <section id="section-world" className="space-y-4 scroll-mt-20 border-t border-white/[0.06] pt-8">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono ${accents.text}`}>02</span>
                      <h2 className="text-sm font-serif uppercase tracking-widest text-white">Visual Atmosphere</h2>
                    </div>
                    <button
                      type="button"
                      data-testid="section-change-world-trigger"
                      onClick={() => setWorldModalOpen(true)}
                      className="min-h-[44px] py-1 px-2.5 text-[11px] font-mono text-white/50 hover:text-white underline cursor-pointer flex items-center"
                    >
                      All Worlds ⇄
                    </button>
                  </div>
                  <p className="text-xs font-serif italic text-white/50">
                    &ldquo;The atmosphere and realm they step into&rdquo;
                  </p>
                </div>

                {/* Active World Spotlight */}
                <div className="pt-1 pb-1 space-y-1 border-b border-white/[0.04] pb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/40">Active:</span>
                    <span className="text-lg font-serif text-white font-normal">{templateMeta.name}</span>
                  </div>
                  <p className="text-xs font-serif italic text-white/70">
                    &ldquo;{currentTemplateDef?.tagline || "For the love that feels like starlight"}&rdquo;
                  </p>
                  <p className="text-xs text-white/50 font-light leading-relaxed">
                    {currentTemplateDef?.atmosphere}
                  </p>
                </div>

                {/* Tactile World Material Rail */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                    Living Atmospheres
                  </span>
                  <div className="flex flex-wrap gap-2 py-1">
                    {[
                      { id: "cloud-nine", icon: "☁️", name: "Cloud Nine", sample: "Sky Aerogramme" },
                      { id: "midnight-rose", icon: "🌹", name: "Midnight Rose", sample: "Velvet Seal" },
                      { id: "kage", icon: "🏮", name: "Kage", sample: "Washi Scroll" },
                      { id: "apricot-film", icon: "🎞️", name: "Apricot Film", sample: "16mm Celluloid" },
                      { id: "wildflower-paper", icon: "🌿", name: "Wildflower Paper", sample: "Cotton Rag" },
                      { id: "ocean-letter", icon: "🌊", name: "Ocean Letter", sample: "Sea-Glass Bottle" },
                    ].map((w) => {
                      const isSelected = templateMeta.id === w.id;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          data-testid={`world-sample-${w.id}`}
                          onClick={() => handleSelectWorld(w.id, "v1")}
                          className={`py-1.5 px-3 rounded-full border text-xs flex items-center gap-2 transition-all cursor-pointer group select-none ${
                            isSelected
                              ? `${accents.border} bg-white/[0.08] text-white font-medium shadow-xs`
                              : "border-white/[0.06] bg-transparent text-white/60 hover:text-white hover:border-white/15"
                          }`}
                        >
                          <span className="text-sm select-none">{w.icon}</span>
                          <span className="font-serif tracking-wide">{w.name}</span>
                          {isSelected && <span className={`w-1.5 h-1.5 rounded-full ${accents.dot} shrink-0`} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* ------------------------------------------------------------- */}
              {/* STAGE 03: Story & Keepsakes                                   */}
              {/* ------------------------------------------------------------- */}
              <section id="section-story" className="space-y-4 scroll-mt-20 border-t border-white/[0.06] pt-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${accents.text}`}>03</span>
                    <h2 className="text-sm font-serif uppercase tracking-widest text-white">Story & Keepsakes</h2>
                  </div>
                  <p className="text-xs font-serif italic text-white/50">
                    &ldquo;Narrative chapters, photo memories & discovered moments&rdquo;
                  </p>
                </div>

                <StoryChaptersVisualizer
                  welcomeEnabled={Boolean((config as any).narrative?.welcome?.enabled)}
                  onToggleWelcome={() =>
                    handleConfigChange((prev: any) => {
                      const cur = prev.narrative?.welcome || { enabled: false };
                      return {
                        ...prev,
                        narrative: {
                          ...(prev.narrative || {}),
                          welcome: {
                            ...cur,
                            enabled: !cur.enabled,
                            recipientName: cur.recipientName || prev.partnerName || "",
                            greeting: cur.greeting || "Welcome, My Love",
                            message: cur.message || "A private story made only for you.",
                          },
                        },
                      };
                    })
                  }
                  welcomeGreeting={(config as any).narrative?.welcome?.greeting || ""}
                  welcomeMessage={(config as any).narrative?.welcome?.message || ""}
                  onWelcomeGreetingChange={(val) =>
                    handleConfigChange((prev: any) => ({
                      ...prev,
                      narrative: {
                        ...(prev.narrative || {}),
                        welcome: {
                          ...(prev.narrative?.welcome || {}),
                          greeting: val,
                        },
                      },
                    }))
                  }
                  onWelcomeMessageChange={(val) =>
                    handleConfigChange((prev: any) => ({
                      ...prev,
                      narrative: {
                        ...(prev.narrative || {}),
                        welcome: {
                          ...(prev.narrative?.welcome || {}),
                          message: val,
                        },
                      },
                    }))
                  }
                  pacing={(config as any).narrative?.pacing || "balanced"}
                  onPacingChange={(newPacing) =>
                    handleConfigChange((prev: any) => ({
                      ...prev,
                      narrative: {
                        ...(prev.narrative || {}),
                        pacing: newPacing,
                      },
                    }))
                  }
                  activeMomentsCount={activeMomentsCount}
                />
              </section>

              {/* Keepsakes Module Subsection */}
              <section id="section-moments" className="space-y-4 scroll-mt-20 border-t border-white/[0.04] pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-serif uppercase tracking-wider text-white/90">Interactive Keepsakes</h3>
                    <p className="text-xs font-serif italic text-white/50">
                      &ldquo;Little surprises they discover inside your world&rdquo;
                    </p>
                  </div>
                  <Badge variant="neutral" size="sm" className={`text-[10px] font-mono ${accents.text} ${accents.border}`}>
                    {activeMomentsCount} Active
                  </Badge>
                </div>

                <ModuleManager
                  modules={config.modules}
                  hasHeroMedia={Boolean(config.heroMediaId)}
                  onChange={handleModulesChange}
                  onOpenFeatureDrawer={() => setFeatureDrawerOpen(true)}
                  onSelectFeature={handleSelectFeature}
                  externalActiveMoment={activeMomentKey}
                />
              </section>

              {/* ------------------------------------------------------------- */}
              {/* STAGE 04: Stationery & Seals                                  */}
              {/* ------------------------------------------------------------- */}
              <section id="section-mood" className="space-y-5 scroll-mt-20 border-t border-white/[0.06] pt-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${accents.text}`}>04</span>
                    <h2 className="text-sm font-serif uppercase tracking-widest text-white">Stationery & Seals</h2>
                  </div>
                  <p className="text-xs font-serif italic text-white/50">
                    &ldquo;Tactile craft: stationery paper, velvet ribbon, wax seal monogram, bouquet & charms&rdquo;
                  </p>
                </div>

                {/* 1-Click Curated Presets: Editorial Uppercase Typography */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                    Quick Styling Presets
                  </span>
                  <div className="flex flex-wrap items-center gap-6 pt-1">
                    {[
                      { id: "classic", label: "Classic Romance" },
                      { id: "wildflower", label: "Wildflower Dream" },
                      { id: "royal", label: "Royal Devotion" },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        data-testid={`preset-option-${preset.id}`}
                        onClick={() => {
                          if (preset.id === "classic") {
                            handleConfigChange((prev) => ({
                              ...prev,
                              decor: {
                                blooms: ["crimson-rose", "french-tulip"],
                                flowers: ["crimson-rose", "french-tulip"],
                                charms: ["heart", "sparkle"],
                                paper: "petal-blush",
                                ribbon: "velvet-crimson",
                                waxSeal: "crimson-heart",
                                seal: "crimson-heart",
                              },
                            }));
                          } else if (preset.id === "wildflower") {
                            handleConfigChange((prev) => ({
                              ...prev,
                              decor: {
                                blooms: ["wild-lavender", "wild-daisy", "blush-peony"],
                                flowers: ["wild-lavender", "wild-daisy", "blush-peony"],
                                charms: ["butterfly", "sparkle"],
                                paper: "soft-lavender",
                                ribbon: "satin-rose",
                                waxSeal: "rose-quartz",
                                seal: "rose-quartz",
                              },
                            }));
                          } else if (preset.id === "royal") {
                            handleConfigChange((prev) => ({
                              ...prev,
                              decor: {
                                blooms: ["crimson-rose", "french-tulip", "blush-peony"],
                                flowers: ["crimson-rose", "french-tulip", "blush-peony"],
                                charms: ["bow", "sparkle"],
                                paper: "deckled-parchment",
                                ribbon: "velvet-crimson",
                                waxSeal: "royal-burgundy",
                                seal: "royal-burgundy",
                              },
                            }));
                          }
                        }}
                        className="group flex flex-col items-start gap-1 text-left cursor-pointer transition-colors"
                      >
                        <span className="text-xs font-serif uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                          {preset.label}
                        </span>
                        <span className="w-full h-px bg-white/20 group-hover:bg-white/60 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stationery Paper: Physical Tactile Material Samples */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                    Stationery Paper
                  </span>
                  <div className="flex flex-wrap gap-2 py-1">
                    {CURATED_PAPERS.map((paper) => {
                      const isSelected = normalizeValentineDecor(config.decor).paper === paper.id;
                      return (
                        <button
                          key={paper.id}
                          type="button"
                          data-testid={`decor-option-paper-${paper.id}`}
                          onClick={() =>
                            handleConfigChange((prev) => ({
                              ...prev,
                              decor: { ...normalizeValentineDecor(prev.decor), paper: paper.id },
                            }))
                          }
                          className={`min-h-[44px] px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-all cursor-pointer font-serif ${
                            isSelected
                              ? `${accents.border} bg-white/[0.06] text-white font-medium shadow-sm`
                              : "border-transparent bg-transparent text-white/50 hover:text-white hover:bg-white/[0.02]"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-xs border border-white/20 shrink-0 shadow-inner"
                            style={{ backgroundColor: paper.previewColor }}
                          />
                          <span>{paper.name}</span>
                          {isSelected ? (
                            <span className={`text-[10px] ${accents.text}`}>✓</span>
                          ) : (
                            <span className="text-white/20 text-[10px]">·</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Silk & Velvet Ribbon: Physical Tactile Material Samples */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                    Silk & Velvet Ribbon
                  </span>
                  <div className="flex flex-wrap gap-2 py-1">
                    {CURATED_RIBBONS.map((ribbon) => {
                      const isSelected = normalizeValentineDecor(config.decor).ribbon === ribbon.id;
                      return (
                        <button
                          key={ribbon.id}
                          type="button"
                          data-testid={`decor-option-ribbon-${ribbon.id}`}
                          onClick={() =>
                            handleConfigChange((prev) => ({
                              ...prev,
                              decor: { ...normalizeValentineDecor(prev.decor), ribbon: ribbon.id },
                            }))
                          }
                          className={`min-h-[44px] px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-all cursor-pointer font-serif ${
                            isSelected
                              ? `${accents.border} bg-white/[0.06] text-white font-medium shadow-sm`
                              : "border-transparent bg-transparent text-white/50 hover:text-white hover:bg-white/[0.02]"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-xs border border-white/20 shrink-0 shadow-inner"
                            style={{ backgroundColor: ribbon.previewColor }}
                          />
                          <span>{ribbon.name}</span>
                          {isSelected ? (
                            <span className={`text-[10px] ${accents.text}`}>✓</span>
                          ) : (
                            <span className="text-white/20 text-[10px]">·</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Digital Wax Seal: Physical Tactile Material Samples */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                    Digital Wax Seal
                  </span>
                  <div className="flex flex-wrap gap-2 py-1">
                    {CURATED_SEALS.map((seal) => {
                      const isSelected = normalizeValentineDecor(config.decor).waxSeal === seal.id;
                      return (
                        <button
                          key={seal.id}
                          type="button"
                          data-testid={`decor-option-seal-${seal.id}`}
                          onClick={() =>
                            handleConfigChange((prev) => ({
                              ...prev,
                              decor: {
                                ...normalizeValentineDecor(prev.decor),
                                waxSeal: seal.id,
                                seal: seal.id,
                              },
                            }))
                          }
                          className={`min-h-[44px] px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-all cursor-pointer font-serif ${
                            isSelected
                              ? `${accents.border} bg-white/[0.06] text-white font-medium shadow-sm`
                              : "border-transparent bg-transparent text-white/50 hover:text-white hover:bg-white/[0.02]"
                          }`}
                        >
                          <span className="text-sm select-none">{seal.emblem}</span>
                          <span>{seal.name}</span>
                          {isSelected ? (
                            <span className={`text-[10px] ${accents.text}`}>✓</span>
                          ) : (
                            <span className="text-white/20 text-[10px]">·</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bouquet Blooms: Specimen Tokens with Horizontal Scroll & Bottom Accent Line */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                      Bouquet Blooms (1–4)
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      {normalizeValentineDecor(config.decor).blooms.length} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                    {CURATED_FLOWERS.map((flower) => {
                      const isSelected = normalizeValentineDecor(config.decor).blooms.includes(flower.id);
                      return (
                        <button
                          key={flower.id}
                          type="button"
                          data-testid={`decor-option-bloom-${flower.id}`}
                          onClick={() =>
                            handleConfigChange((prev) => {
                              const existing = normalizeValentineDecor(prev.decor);
                              let nextBlooms = [...existing.blooms];
                              if (nextBlooms.includes(flower.id)) {
                                if (nextBlooms.length > 1) {
                                  nextBlooms = nextBlooms.filter((b) => b !== flower.id);
                                }
                              } else {
                                if (nextBlooms.length >= 4) nextBlooms.shift();
                                nextBlooms.push(flower.id);
                              }
                              return {
                                ...prev,
                                decor: {
                                  ...existing,
                                  blooms: nextBlooms,
                                  flowers: nextBlooms,
                                },
                              };
                            })
                          }
                          className={`min-h-[44px] relative py-2 px-3 rounded-lg text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer shrink-0 font-serif border ${
                            isSelected
                              ? `bg-white/[0.07] ${accents.border} text-white shadow-sm`
                              : "bg-white/[0.02] border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm select-none">{flower.emoji}</span>
                            <span className="whitespace-nowrap">{flower.name}</span>
                          </div>
                          {isSelected ? (
                            <span className={`w-full h-[1.5px] rounded-full ${accents.bar}`} />
                          ) : (
                            <span className="w-full h-[1.5px] rounded-full bg-transparent" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Orbiting Charms: Specimen Tokens with Horizontal Scroll & Bottom Accent Line */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                      Orbiting Charms (1–3)
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      {normalizeValentineDecor(config.decor).charms.length} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                    {CURATED_CHARMS.map((charm) => {
                      const isSelected = normalizeValentineDecor(config.decor).charms.includes(charm.id);
                      return (
                        <button
                          key={charm.id}
                          type="button"
                          data-testid={`decor-option-charm-${charm.id}`}
                          onClick={() =>
                            handleConfigChange((prev) => {
                              const existing = normalizeValentineDecor(prev.decor);
                              let nextCharms = [...existing.charms];
                              if (nextCharms.includes(charm.id)) {
                                nextCharms = nextCharms.filter((c) => c !== charm.id);
                              } else {
                                if (nextCharms.length >= 3) nextCharms.shift();
                                nextCharms.push(charm.id);
                              }
                              return {
                                ...prev,
                                decor: {
                                  ...existing,
                                  charms: nextCharms,
                                },
                              };
                            })
                          }
                          className={`min-h-[44px] relative py-2 px-3 rounded-lg text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer shrink-0 font-serif border ${
                            isSelected
                              ? `bg-white/[0.07] ${accents.border} text-white shadow-sm`
                              : "bg-white/[0.02] border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm select-none">{charm.emoji}</span>
                            <span className="whitespace-nowrap">{charm.name}</span>
                          </div>
                          {isSelected ? (
                            <span className={`w-full h-[1.5px] rounded-full ${accents.bar}`} />
                          ) : (
                            <span className="w-full h-[1.5px] rounded-full bg-transparent" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Atmospheric Mood Accent */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                    Atmospheric Mood Accent
                  </span>
                  <div className="flex flex-wrap gap-2 py-1">
                    {ACCENT_THEMES.map((theme) => {
                      const isSelected = (config.accentTheme || "crimson-rose") === theme;
                      const meta = {
                        "crimson-rose": { label: "Crimson", color: "bg-rose-500" },
                        "midnight-violet": { label: "Violet", color: "bg-purple-500" },
                        "champagne-gold": { label: "Gold", color: "bg-amber-500" },
                      }[theme];

                      return (
                        <button
                          key={theme}
                          type="button"
                          data-testid={`theme-option-${theme}`}
                          onClick={() =>
                            handleConfigChange((prev) => ({
                              ...prev,
                              accentTheme: theme as AccentTheme,
                            }))
                          }
                          className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-serif border flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? `${accents.border} bg-white/[0.06] text-white font-medium shadow-sm`
                              : "border-transparent bg-transparent text-white/50 hover:text-white hover:bg-white/[0.02]"
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${meta.color}`} />
                          <span>{meta.label}</span>
                          {isSelected ? (
                            <span className={`text-[10px] ${accents.text}`}>✓</span>
                          ) : (
                            <span className="text-white/20 text-[10px]">·</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* ------------------------------------------------------------- */}
              {/* STAGE 05: Delivery & Keepsakes                                */}
              {/* ------------------------------------------------------------- */}
              <section id="section-preview" className="space-y-6 scroll-mt-20 border-t border-white/[0.06] pt-8 pb-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${accents.text}`}>05</span>
                    <h2 className="text-sm font-serif uppercase tracking-widest text-white">Delivery & Keepsakes</h2>
                  </div>
                  <p className="text-xs font-serif italic text-white/50">
                    &ldquo;Your Valentine is ready to become a private world&rdquo;
                  </p>
                </div>

                {/* Editorial Keepsake Summary: 4 quiet columns separated by fine hairlines */}
                <div className="py-3 border-y border-white/[0.06] space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06] text-left">
                    <div className="py-2 sm:py-0 sm:pr-4">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Letter</span>
                      <span className="font-serif text-white text-sm">
                        {config.partnerName?.trim() && config.message?.trim() ? "Inscribed" : "Incomplete"}
                      </span>
                    </div>
                    <div className="py-2 sm:py-0 sm:px-4">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">World</span>
                      <span className="font-serif text-white text-sm">{templateMeta.name}</span>
                    </div>
                    <div className="py-2 sm:py-0 sm:px-4">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Story & Moments</span>
                      <span className="font-serif text-white text-sm">{activeMomentsCount} Active</span>
                    </div>
                    <div className="py-2 sm:py-0 sm:pl-4">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Style</span>
                      <span className="font-serif text-white text-sm">Bespoke</span>
                    </div>
                  </div>

                  {/* Mobile Preview View Button */}
                  <div className="pt-2 border-t border-white/[0.04] lg:hidden">
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={() => handleMobileTabChange("preview")}
                      className="w-full min-h-[44px] text-xs rounded-full font-serif"
                    >
                      Open Live Canvas Preview →
                    </Button>
                  </div>
                </div>

                {/* Soundtrack & Delivery Schedule */}
                <PreviewAndSendSection
                  publicId={publicId}
                  partnerName={config.partnerName}
                  soundtrackUrl={config.soundtrackUrl}
                  scheduledUnlockAt={config.scheduledUnlockAt}
                  onSoundtrackChange={(url) => handleConfigChange((prev) => ({ ...prev, soundtrackUrl: url }))}
                  onScheduleChange={(isoDate) => handleConfigChange((prev) => ({ ...prev, scheduledUnlockAt: isoDate }))}
                />

                {/* Validation Errors */}
                {publishErrors.length > 0 && (
                  <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800/60 text-xs text-rose-200 space-y-2 animate-fadeIn">
                    <span className="font-semibold block text-rose-300 font-ui">
                      Please complete the following before publishing:
                    </span>
                    {publishErrors.map((err, i) => (
                      <p key={i} className="flex items-center gap-1.5 font-ui">
                        <span>•</span> {err}
                      </p>
                    ))}
                    <button
                      type="button"
                      onClick={() => scrollToSection("personalize")}
                      className="pt-1 text-xs font-serif italic text-rose-300 hover:text-white underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Inscribe Dedication & Letter in Step 01 →</span>
                    </button>
                  </div>
                )}

                {/* Form Action Controls */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    data-testid="save-draft-button"
                    variant="outline"
                    size="md"
                    onClick={() => performSave()}
                    className="flex-1 min-h-[44px] text-xs border-white/15 text-[#FAF8F5] rounded-full font-serif cursor-pointer hover:bg-white/[0.05]"
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="button"
                    data-testid="publish-button"
                    variant="romantic"
                    size="md"
                    disabled={saveStatus === "saving" || isPublishing}
                    onClick={handlePublish}
                    className="flex-1 min-h-[44px] text-xs rounded-full font-serif shadow-lg shadow-rose-950/50 cursor-pointer"
                  >
                    {isPublishing ? "Publishing…" : "Publish Valentine"}
                  </Button>
                </div>
              </section>
            </div>

            {/* Persistent Global Continue Action Footer */}
            <div className="sticky bottom-0 z-30 px-5 sm:px-7 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[#0E0C12]/95 backdrop-blur-md border-t border-white/[0.06] flex items-center justify-between gap-4 mt-auto">
              <button
                type="button"
                disabled={currentStageIndex === 0}
                onClick={goToPreviousStage}
                className={`min-h-[44px] px-3 py-2 text-xs font-serif italic text-white/50 hover:text-white transition-colors cursor-pointer flex items-center ${
                  currentStageIndex === 0 ? "invisible" : ""
                }`}
              >
                ← Previous stage
              </button>
              <button
                type="button"
                onClick={goToNextStage}
                disabled={activeSection === "preview" && (saveStatus === "saving" || isPublishing)}
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs font-serif italic transition-all flex items-center justify-center gap-1.5 cursor-pointer border select-none ${
                  activeSection === "preview"
                    ? "bg-rose-600/90 hover:bg-rose-500 text-white font-medium border-rose-400/50 shadow-lg shadow-rose-950/60 ring-1 ring-rose-400/30"
                    : "bg-white/[0.06] hover:bg-white/[0.1] text-white border-white/10"
                }`}
              >
                <span>{nextStageLabel}</span>
                {activeSection !== "preview" && <span>→</span>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Mobile Workspace Switcher (Thumb Zone Dock) */}
      <MobileWorkspaceSwitcher
        activeTab={mobileTab}
        onTabChange={handleMobileTabChange}
        isInputFocused={isInputFocused}
      />

      {/* Feature Discovery Drawer */}
      <FeatureDiscoveryDrawer
        isOpen={featureDrawerOpen}
        onClose={() => setFeatureDrawerOpen(false)}
        onSelectFeature={handleSelectFeature}
        activeModuleKeys={Object.keys(config.modules || {}).filter(
          (k) => Boolean((config.modules as any)?.[k]?.enabled)
        )}
        activeTemplateId={templateMeta.id}
      />

      {/* Published Completion Modal */}
      {publishModalOpen && (
        <div
          data-testid="publish-success-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="max-w-md w-full p-8 sm:p-10 border border-white/[0.15] bg-[#131118] text-center space-y-6 shadow-2xl shadow-black/95 relative rounded-3xl z-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-rose-600 via-rose-700 to-[#7A1428] border border-rose-400/60 flex items-center justify-center shadow-xl text-3xl select-none animate-float">
              💌
            </div>

            <div className="space-y-2">
              <Badge variant="rose" size="sm" className="bg-rose-950/80 border-rose-400/40 text-rose-200 font-ui">
                Published & Sealed
              </Badge>
              <h2 className="text-2xl font-display font-medium text-white">Your Valentine is Ready</h2>
              <p className="text-xs sm:text-sm text-white/70 font-ui font-light leading-relaxed">
                Send this private link to your partner. When they open it, they will enter your custom {templateMeta.name} world.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.1] flex items-center gap-2">
              <input
                data-testid="public-url-input"
                readOnly
                value={publicUrl}
                className="flex-1 bg-transparent text-xs text-rose-100 outline-none select-all font-mono"
              />
              <button
                type="button"
                data-testid="copy-link-button"
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium tracking-wide transition-colors shrink-0 shadow-md font-ui cursor-pointer"
              >
                {copied ? "Copied! 💌" : "Copy Link"}
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="open-public-page-link"
                className="flex-1 py-3 rounded-xl border border-white/15 text-white text-xs font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 font-ui"
              >
                <span>Open Valentine</span>
                <span>↗</span>
              </a>
              <button
                type="button"
                data-testid="close-publish-modal-button"
                onClick={() => setPublishModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-white/[0.06] text-white/70 text-xs font-medium hover:bg-white/[0.12] hover:text-white transition-colors font-ui cursor-pointer"
              >
                Back to Studio
              </button>
            </div>

            <p className="text-[11px] text-white/40 font-ui">
              🔒 Completely private. Never indexed by search engines.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditExperiencePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0E0D12] text-white flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
        </div>
      }
    >
      <EditExperienceContent />
    </Suspense>
  );
}
