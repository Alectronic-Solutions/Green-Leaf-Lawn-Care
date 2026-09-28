"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icon3D } from "@/components/site/icon-3d";
import { site } from "@/config/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { DURATION, EASE_SOFT } from "@/lib/motion";
import { ACCURACY_GOAL, type Result } from "./engine";
import { levels, PROMO_LEVEL_INDEX, type Level } from "./levels";
import { EMPTY_HUD, GameController, type Hud } from "./controller";

const STORE_KEY = "gl-mower-v2";

type Progress = Record<string, { stars: number; bestMs: number }>;
type Store = { progress: Progress; sound: boolean; guide: boolean; promo: boolean };

// This component only ever renders in the browser (it is loaded with
// ssr: false), so reading localStorage during the first render is safe.
function loadStore(): Store {
  const fallback: Store = { progress: {}, sound: true, guide: true, promo: false };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function saveStore(store: Store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    // Storage blocked: progress just won't persist between visits.
  }
}

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

function isUnlocked(progress: Progress, index: number) {
  return index === 0 || (progress[levels[index - 1].id]?.stars ?? 0) > 0;
}

type Screen = "playing" | "select" | "result";
type FinishedResult = Result & { isBest: boolean; promoNew: boolean };

export function MowerGame() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctrlRef = useRef<GameController | null>(null);

  const [store, setStore] = useState<Store>(loadStore);
  // Start on the first lawn not yet cleared.
  const [levelIndex, setLevelIndex] = useState(() => Math.max(0, levels.findIndex((l) => !store.progress[l.id]?.stars)));
  const [screen, setScreen] = useState<Screen>("playing");
  const [hud, setHud] = useState<Hud>(EMPTY_HUD);
  const [result, setResult] = useState<FinishedResult | null>(null);
  const [keyboardHint, setKeyboardHint] = useState(false);
  const [shared, setShared] = useState(false);
  const level: Level = levels[levelIndex];

  // Latest finish handler, kept in a ref so the controller can stay
  // mounted across renders.
  const onFinishRef = useRef<(level: Level, r: Result) => void>(() => {});
  useEffect(() => {
    onFinishRef.current = (finished, r) => {
      const eligible = levels.indexOf(finished) >= PROMO_LEVEL_INDEX || r.stars === 3;
      const old = store.progress[finished.id];
      const next: Store = {
        ...store,
        promo: store.promo || eligible,
        progress: {
          ...store.progress,
          [finished.id]: { stars: Math.max(old?.stars ?? 0, r.stars), bestMs: Math.min(old?.bestMs ?? Infinity, r.ms) },
        },
      };
      saveStore(next);
      setStore(next);
      setResult({ ...r, isBest: !old || r.ms < old.bestMs, promoNew: eligible && !store.promo });
      if (eligible && !store.promo) track("game_promo_unlocked", { level: finished.id });
      track("game_level_complete", { level: finished.id, stars: r.stars, ms: Math.round(r.ms) });
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(() => {
        setScreen("result");
        ctrlRef.current?.playStars(r.stars);
      }, reduced ? 0 : 650);
    };
  });

  // Create the controller once; it reads the saved sound and guide
  // settings at startup and is told about changes through its setters.
  const initialSettings = useRef({ sound: store.sound, guide: store.guide });
  useEffect(() => {
    const ctrl = new GameController(
      wrapRef.current!,
      canvasRef.current!,
      { onHud: setHud, onFinish: (l, r) => onFinishRef.current(l, r) },
      initialSettings.current
    );
    ctrlRef.current = ctrl;
    return () => ctrl.destroy();
  }, []);

  useEffect(() => {
    ctrlRef.current?.load(levels[levelIndex]);
  }, [levelIndex]);

  useEffect(() => {
    ctrlRef.current?.setActive(screen === "playing");
  }, [screen]);

  const goTo = (index: number) => {
    setResult(null);
    setShared(false);
    setScreen("playing");
    if (index === levelIndex) ctrlRef.current?.load(levels[index]);
    else setLevelIndex(index);
  };

  const toggleSound = () => {
    const next = { ...store, sound: !store.sound };
    ctrlRef.current?.setSound(next.sound);
    saveStore(next);
    setStore(next);
  };

  const toggleGuide = () => {
    const next = { ...store, guide: !store.guide };
    ctrlRef.current?.setGuide(next.guide);
    saveStore(next);
    setStore(next);
  };

  const share = async () => {
    const stars = "\u2b50".repeat(result?.stars ?? 1);
    const text = `I striped "${level.name}" in ${seconds(result?.ms ?? 0)} ${stars}. Think you can beat it?`;
    const url = `${site.url}/#mow`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${site.shortName} mowing challenge`, text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setShared(true);
      }
      track("game_share", { level: level.id });
    } catch {
      // Share sheet dismissed.
    }
  };

  const totalStars = Object.values(store.progress).reduce((n, p) => n + p.stars, 0);
  const promoHref = `/quote?promo=${site.offers.gamePromo.code}&service=lawn-mowing`;
  const hasNext = levelIndex < levels.length - 1;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
      {/* HUD */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-border px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-display text-2xl font-semibold text-forest-500 tabular-nums">{levelIndex + 1}</span>
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">{level.name}</p>
            <p className="text-xs text-muted-foreground">
              {level.neighborhood} · par {level.par}s
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5 rounded-full bg-sage-50 px-3 py-1.5 font-semibold tabular-nums" aria-label="Time">
            <Icon3D name="stopwatch" size={18} />
            {seconds(hud.elapsed)}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-sage-50 px-3 py-1.5 font-semibold tabular-nums" aria-label="Bumps and trampled flowers">
            <Icon3D name="rock" size={18} />
            {hud.mishaps}
          </span>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={store.sound ? "Mute sound" : "Turn sound on"}
            aria-pressed={store.sound}
            className="group flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-sage-100"
          >
            <Icon3D name={store.sound ? "speaker" : "muted"} size={22} float />
          </button>
          <Button type="button" size="sm" variant="outline" onClick={() => setScreen(screen === "select" ? "playing" : "select")}>
            <Icon3D name="map" size={18} />
            Lawns
          </Button>
        </div>
      </div>

      {/* Playfield */}
      <div
        ref={wrapRef}
        tabIndex={0}
        role="application"
        aria-label={`Mowing game, ${level.name}. Use the mouse, touch, or arrow keys to mow.`}
        onKeyDown={(e) => {
          if (ctrlRef.current?.keyDown(e.key)) e.preventDefault();
        }}
        onKeyUp={(e) => ctrlRef.current?.keyUp(e.key)}
        onFocus={() => setKeyboardHint(true)}
        onBlur={() => {
          setKeyboardHint(false);
          ctrlRef.current?.blur();
        }}
        data-no-leaves
        className="relative w-full touch-none select-none bg-sage-100 outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-wheat-400"
        style={{ aspectRatio: `${level.map[0].length} / ${level.map.length}` }}
      >
        <canvas
          ref={canvasRef}
          className={cn("absolute inset-0 h-full w-full", screen === "playing" ? "cursor-none" : "")}
          onPointerMove={(e) => ctrlRef.current?.pointerMove(e.nativeEvent)}
          onPointerDown={(e) => ctrlRef.current?.pointerDown(e.nativeEvent)}
          onPointerUp={(e) => {
            if (e.pointerType !== "mouse") ctrlRef.current?.pointerEnd();
          }}
          onPointerLeave={() => ctrlRef.current?.pointerEnd()}
          onPointerCancel={() => ctrlRef.current?.pointerEnd()}
        />

        {/* Level hint, until the first cut */}
        <AnimatePresence>
          {screen === "playing" && !hud.started && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DURATION.ui, ease: EASE_SOFT }}
              className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-3"
            >
              <p className="max-w-md rounded-2xl bg-forest-950/85 px-4 py-2.5 text-center text-sm font-medium text-cream shadow-lift backdrop-blur-sm">
                {level.hint}
                {keyboardHint && <span className="mt-1 block text-xs text-cream/70">Arrow keys or WASD to steer.</span>}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level select */}
        <AnimatePresence>
          {screen === "select" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.ui, ease: EASE_SOFT }}
              className="absolute inset-0 overflow-y-auto bg-cream/95 p-4 backdrop-blur-sm sm:p-6"
            >
              <div className="mx-auto max-w-3xl">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-xl font-semibold">Pick a lawn</p>
                  <p className="flex items-center gap-1.5 text-sm font-semibold tabular-nums">
                    <Icon3D name="star" size={18} />
                    {totalStars} / {levels.length * 3}
                  </p>
                </div>
                {(["Starter Yard", "Suburban", "Estate"] as const).map((hood) => (
                  <div key={hood} className="mt-4">
                    <p className="eyebrow text-[11px]">{hood}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {levels.map((l, i) =>
                        l.neighborhood !== hood ? null : (
                          <button
                            key={l.id}
                            type="button"
                            disabled={!isUnlocked(store.progress, i)}
                            onClick={() => goTo(i)}
                            className={cn(
                              "group lift flex flex-col items-start rounded-2xl border bg-card p-3 text-left disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
                              i === levelIndex ? "border-primary" : "border-border"
                            )}
                          >
                            <span className="flex w-full items-center justify-between">
                              <span className="font-display text-lg font-semibold text-forest-500">{i + 1}</span>
                              {!isUnlocked(store.progress, i) && <Icon3D name="lock" size={18} label="Locked" />}
                            </span>
                            <span className="mt-0.5 text-sm font-semibold leading-tight">{l.name}</span>
                            <span className="mt-1.5 flex gap-0.5">
                              {[0, 1, 2].map((n) => (
                                <Icon3D key={n} name="star" size={14} className={n < (store.progress[l.id]?.stars ?? 0) ? "" : "opacity-25 grayscale"} />
                              ))}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {screen === "result" && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.ui, ease: EASE_SOFT }}
              className="absolute inset-0 flex items-center justify-center overflow-y-auto bg-forest-950/45 p-3 backdrop-blur-[3px] sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: DURATION.ui, ease: EASE_SOFT }}
                role="dialog"
                aria-label={`${level.name} complete`}
                className="max-h-full w-full max-w-md overflow-y-auto rounded-3xl bg-cream p-5 text-center shadow-lift sm:p-7"
              >
                <div className="flex justify-center gap-2">
                  {[0, 1, 2].map((n) => (
                    <motion.span
                      key={n}
                      initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
                      animate={n < result.stars ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0.25, scale: 0.85, rotate: 0 }}
                      transition={{ delay: 0.15 + n * 0.22, duration: DURATION.ui, ease: EASE_SOFT }}
                      className={n < result.stars ? "" : "grayscale"}
                    >
                      <Icon3D name="star" size={n === 1 ? 64 : 50} />
                    </motion.span>
                  ))}
                </div>
                <p className="font-display mt-3 text-2xl font-semibold">
                  {result.stars === 3 ? "Perfect finish" : result.stars === 2 ? "Clean cut" : "Lawn mowed"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {seconds(result.ms)}
                  {result.isBest ? " · new best" : ""}
                  {level.target !== "any" ? ` · ${Math.round(result.accuracy * 100)}% pattern match` : ""}
                </p>

                <ul className="mt-4 space-y-2 text-left text-sm">
                  {[
                    { icon: "flag" as const, ok: true, text: "Every blade cut" },
                    { icon: "stopwatch" as const, ok: result.beatPar, text: result.beatPar ? `Beat par of ${level.par}s` : `Beat par of ${level.par}s next time` },
                    {
                      icon: "sparkles" as const,
                      ok: result.clean,
                      text:
                        level.target === "any"
                          ? result.clean ? "No bumps, no trampled flowers" : `${result.mishaps} bump${result.mishaps === 1 ? "" : "s"}. Go clean for the last star`
                          : result.clean ? `Clean and ${Math.round(ACCURACY_GOAL * 100)}%+ on pattern` : `Go clean with a ${Math.round(ACCURACY_GOAL * 100)}% pattern match`,
                    },
                  ].map((row) => (
                    <li key={row.icon} className={cn("flex items-center gap-3 rounded-xl px-3 py-2", row.ok ? "bg-sage-100" : "bg-sage-50 text-muted-foreground")}>
                      <Icon3D name={row.icon} size={22} className={row.ok ? "" : "opacity-40 grayscale"} />
                      {row.text}
                    </li>
                  ))}
                </ul>

                {store.promo && (
                  <div className="mt-4 rounded-2xl border border-wheat-400/60 bg-wheat-100 p-4 text-left">
                    <div className="flex items-center gap-3">
                      <Icon3D name="gift" size={40} />
                      <div>
                        <p className="font-semibold leading-tight">
                          {result.promoNew ? "You unlocked " : "Your reward: "}
                          {site.offers.gamePromo.pct}% off your first mow
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          Code <span className="rounded-md bg-card px-1.5 py-0.5 font-mono font-semibold text-foreground">{site.offers.gamePromo.code}</span>
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="cta" className="mt-3 w-full">
                      <Link href={promoHref} onClick={() => track("game_promo_claimed", { level: level.id })}>
                        Claim it on a free quote
                      </Link>
                    </Button>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {hasNext ? (
                    <Button variant={store.promo ? "default" : "cta"} onClick={() => goTo(levelIndex + 1)} className="col-span-2">
                      <span className="arrow-link">Next lawn</span>
                    </Button>
                  ) : (
                    <p className="col-span-2 text-sm font-medium text-primary">You have mowed every lawn in the neighborhood.</p>
                  )}
                  <Button variant="outline" onClick={() => goTo(levelIndex)}>
                    <Icon3D name="repeat" size={18} />
                    Try again
                  </Button>
                  <Button variant="outline" onClick={share}>
                    <Icon3D name="link" size={18} />
                    {shared ? "Copied" : "Share"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-sm sm:px-6">
        <div className="flex min-w-48 flex-1 items-center gap-3">
          <span className="text-muted-foreground">Mowed</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-sage-100" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(hud.progress * 100)} aria-label="Lawn mowed">
            <div className="h-full rounded-full bg-linear-to-r from-forest-500 to-wheat-400 transition-[width] duration-(--dur-micro)" style={{ width: `${Math.floor(hud.progress * 100)}%` }} />
          </div>
          <span className="w-10 text-right font-semibold tabular-nums">{Math.floor(hud.progress * 100)}%</span>
        </div>
        {level.target !== "any" && (
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">Pattern</span>
            <span className={cn("font-semibold tabular-nums", hud.accuracy >= ACCURACY_GOAL ? "text-primary" : "")}>{Math.round(hud.accuracy * 100)}%</span>
            <button
              type="button"
              onClick={toggleGuide}
              aria-pressed={store.guide}
              className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition-colors hover:bg-sage-50"
            >
              Guide {store.guide ? "on" : "off"}
            </button>
          </div>
        )}
        <button type="button" onClick={() => goTo(levelIndex)} className="group flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <Icon3D name="repeat" size={16} float />
          Restart
        </button>
      </div>
    </div>
  );
}
