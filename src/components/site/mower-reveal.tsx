"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STEPS = [
  {
    step: "01",
    title: "Tell us about your lawn",
    desc: "Answer a few questions and see your estimated price immediately. No waiting for a callback.",
  },
  {
    step: "02",
    title: "We confirm on site",
    desc: "A crew lead stops by to verify the estimate and note specifics like gate codes or problem areas.",
  },
  {
    step: "03",
    title: "Service begins",
    desc: "Same crew, same day, every week. You get a text when we are on the way and when we are done.",
  },
];

// Logical game grid. Rows are recomputed per resize to match the canvas's
// physical aspect ratio, so patterns never look stretched or squashed.
const COLS = 20;
const MIN_ROWS = 8;
const MAX_ROWS = 16;
// Every cell of the grid has to be cut before the next pattern comes up.
// No percentage, no rounding: 100% or it doesn't count.
const ALL_TIME_KEY = "gl-mower-game-count";
const SOUND_KEY = "gl-mower-game-sound";
const BEST_KEY = "gl-mower-game-best";

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function formatSeconds(ms: number) {
  return `${(ms / 1000).toFixed(1)}s`;
}

// Haptic tick where the device supports it (Android Chrome, mostly). A
// no-op everywhere else, so it's safe to call freely.
function buzz(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Some browsers throw on vibrate() without a user gesture. Ignore.
  }
}

function scuffLabel(scuffs: number) {
  if (scuffs === 0) return "Clean cut, not a single scuff.";
  if (scuffs < 8) return `${scuffs} scuff${scuffs === 1 ? "" : "s"}, still counts.`;
  return `${scuffs} scuffs. Rough around the edges, but done.`;
}

// The direction a real mower has to walk to lay down each finish. "any"
// means it doesn't matter (a checkerboard is crisscrossed anyway).
type Grain = "vertical" | "horizontal" | "diagonal" | "any";

const GRAIN_LABEL: Record<Grain, string> = {
  vertical: "up and down",
  horizontal: "side to side",
  diagonal: "on the diagonal",
  any: "any direction",
};

// Each pattern is a two-tone finish real mowing crews stripe into a lawn.
// cell() just says which of the two tones a grid cell belongs to; grain is
// the pass direction that actually cuts it (mowing the wrong way just
// doesn't cut, same as a real mower deck riding over already-bent grass).
const PATTERNS: {
  name: string;
  grain: Grain;
  cell: (col: number, row: number) => boolean;
}[] = [
  {
    name: "Classic Stripes",
    grain: "vertical",
    cell: (c) => Math.floor(c / 2) % 2 === 0,
  },
  {
    name: "Horizontal Stripes",
    grain: "horizontal",
    cell: (_c, r) => Math.floor(r / 2) % 2 === 0,
  },
  {
    name: "Checkerboard",
    grain: "any",
    cell: (c, r) => (Math.floor(c / 2) + Math.floor(r / 2)) % 2 === 0,
  },
  {
    name: "Diamond Cut",
    grain: "any",
    cell: (c, r) => {
      const tile = 6;
      const lx = mod(c, tile) - tile / 2;
      const ly = mod(r, tile) - tile / 2;
      return Math.abs(lx) + Math.abs(ly) < 3;
    },
  },
  {
    name: "Wave",
    grain: "any",
    cell: (c, r) => Math.floor((c + 2.2 * Math.sin(r * 0.55)) / 3) % 2 === 0,
  },
];

// Classifies a drag segment's direction against a 1.8:1 axis dominance
// ratio. Roughly-equal dx/dy reads as diagonal; a short jitter reads as
// null (ignored rather than judged).
function classifyDirection(dx: number, dy: number): Grain | null {
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  if (adx < 3 && ady < 3) return null;
  const ratio = adx / (ady || 0.001);
  if (ratio > 1.8) return "horizontal";
  if (ratio < 1 / 1.8) return "vertical";
  return "diagonal";
}

function MowerIcon({
  onWheelRef,
}: {
  onWheelRef?: (index: number, el: SVGGElement | null) => void;
}) {
  return (
    <svg
      width="48"
      height="44"
      viewBox="0 0 56 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
    >
      {/* Ground contact shadow, so the mower reads as sitting on the lawn
          rather than floating over it. */}
      <ellipse cx="31" cy="49.5" rx="17" ry="2.2" fill="rgba(0,0,0,0.28)" />
      <path
        d="M14 8 L34 30"
        stroke="oklch(0.28 0.02 156)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="6" r="3.5" fill="oklch(0.28 0.02 156)" />
      <rect x="16" y="26" width="26" height="14" rx="5" fill="oklch(0.646 0.222 41.116)" />
      <rect x="16" y="26" width="26" height="5" rx="2.5" fill="oklch(0.72 0.19 55)" />
      {[22, 40].map((cx, i) => (
        <g
          key={cx}
          ref={(el) => onWheelRef?.(i, el)}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx={cx} cy="44" r="6" fill="oklch(0.21 0.015 160)" />
          <circle cx={cx} cy="44" r="2.2" fill="oklch(0.7 0.01 100)" />
          {/* Off-center spoke so the wheel's spin is actually visible,
              not just a circle rotating into itself. */}
          <line
            x1={cx}
            y1="44"
            x2={cx}
            y2="39.5"
            stroke="oklch(0.7 0.01 100)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}

const CONFETTI_COLORS = [
  "oklch(0.646 0.222 41.116)",
  "oklch(0.795 0.16 85)",
  "oklch(0.6 0.09 156)",
  "oklch(0.7 0.11 90)",
];

export function MowerReveal() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const grassCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const mowerRef = useRef<HTMLDivElement>(null);
  const wheelsRef = useRef<(SVGGElement | null)[]>([null, null]);
  const particleLayerRef = useRef<HTMLDivElement>(null);

  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const lastMoveTime = useRef(0);
  const lastParticleTime = useRef(0);
  const wheelSpinDeg = useRef(0);
  const wrongStreakRef = useRef(0);
  // Total wrong-direction segments for the current pattern (the "scuffs"
  // reported on the finish card), as opposed to the consecutive streak
  // that drives the warning banner.
  const scuffsRef = useRef(0);
  // +1 faces right, -1 faces left. The mower is drawn side-on, so it
  // mirrors to face wherever it's being pushed.
  const headingRef = useRef(1);
  const patternStartRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const colsRef = useRef(COLS);
  const rowsRef = useRef(12);
  const cellWRef = useRef(0);
  const cellHRef = useRef(0);
  const mowerWidthRef = useRef(60);
  const patternGridRef = useRef<Uint8Array>(new Uint8Array(0));
  const visitedRef = useRef<Uint8Array>(new Uint8Array(0));
  const patternIndexRef = useRef(0);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafPending = useRef(false);

  // Synthesized engine hum plus completion chime. No audio assets, just
  // oscillators/noise built up on first interaction (autoplay policies
  // require a user gesture, which mowing itself provides).
  const audioCtxRef = useRef<AudioContext | null>(null);
  const engineOscRef = useRef<OscillatorNode | null>(null);
  const engineGainRef = useRef<GainNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);

  // These read window/localStorage, so they must start at a value that
  // matches the server-rendered markup (false / 0) and only pick up the
  // real client value after mount. Reading them eagerly in a useState
  // initializer would render differently on the server vs. the client and
  // trip a hydration mismatch.
  const [reducedMotion, setReducedMotion] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [phase, setPhase] = useState<"playing" | "success">("playing");
  const [progress, setProgress] = useState(0);
  const [patternName, setPatternName] = useState(PATTERNS[0].name);
  const [patternGrain, setPatternGrain] = useState<Grain>(PATTERNS[0].grain);
  const [directionWarning, setDirectionWarning] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [allTimeCount, setAllTimeCount] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [bestTimes, setBestTimes] = useState<Record<string, number>>({});
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [lastResult, setLastResult] = useState<{
    ms: number;
    isBest: boolean;
    scuffs: number;
  } | null>(null);

  useEffect(() => {
    // Deferred a frame so this reads as "sync from an external system in a
    // callback", not a setState called directly in the effect body, and it
    // still lands before the player can interact.
    const id = requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      reducedMotionRef.current = reduce;
      setReducedMotion(reduce);
      try {
        const v = window.localStorage.getItem(ALL_TIME_KEY);
        if (v) setAllTimeCount(parseInt(v, 10) || 0);
        const s = window.localStorage.getItem(SOUND_KEY);
        if (s === "off") setSoundOn(false);
        const b = window.localStorage.getItem(BEST_KEY);
        if (b) {
          const parsed: unknown = JSON.parse(b);
          if (parsed && typeof parsed === "object") {
            setBestTimes(parsed as Record<string, number>);
          }
        }
      } catch {
        // Storage can be unavailable (private browsing, blocked cookies),
        // so the count just won't persist across visits, which is fine.
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Stopwatch ticks only while a pattern is actively being cut.
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      if (patternStartRef.current != null) {
        setElapsedMs(performance.now() - patternStartRef.current);
      }
    }, 100);
    return () => clearInterval(id);
  }, [timerRunning]);

  const pickPatternIndex = useCallback((exclude: number) => {
    if (PATTERNS.length <= 1) return 0;
    let next = Math.floor(Math.random() * PATTERNS.length);
    while (next === exclude) {
      next = Math.floor(Math.random() * PATTERNS.length);
    }
    return next;
  }, []);

  const ensureAudioGraph = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();

    // Low sawtooth = the engine's tone; a band of filtered noise layered
    // on top = the blade/air whir. Both idle at zero gain until mowing.
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 70;
    const engineFilter = ctx.createBiquadFilter();
    engineFilter.type = "lowpass";
    engineFilter.frequency.value = 400;
    const engineGain = ctx.createGain();
    engineGain.gain.value = 0;
    osc.connect(engineFilter).connect(engineGain).connect(ctx.destination);
    osc.start();

    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 1200;
    noiseFilter.Q.value = 0.7;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0;
    noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
    noise.start();

    audioCtxRef.current = ctx;
    engineOscRef.current = osc;
    engineGainRef.current = engineGain;
    noiseGainRef.current = noiseGain;
    return ctx;
  }, []);

  const startEngine = useCallback(() => {
    if (!soundOn) return;
    const ctx = ensureAudioGraph();
    if (!ctx || !engineGainRef.current || !noiseGainRef.current) return;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    // Rev up from a low cough to idle, like a pull-start catching.
    const osc = engineOscRef.current;
    if (osc) {
      osc.frequency.cancelScheduledValues(now);
      osc.frequency.setValueAtTime(38, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.35);
    }
    engineGainRef.current.gain.cancelScheduledValues(now);
    engineGainRef.current.gain.linearRampToValueAtTime(0.05, now + 0.15);
    noiseGainRef.current.gain.cancelScheduledValues(now);
    noiseGainRef.current.gain.linearRampToValueAtTime(0.025, now + 0.15);
  }, [ensureAudioGraph, soundOn]);

  const stopEngine = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || !engineGainRef.current || !noiseGainRef.current) return;
    const now = ctx.currentTime;
    engineGainRef.current.gain.cancelScheduledValues(now);
    engineGainRef.current.gain.linearRampToValueAtTime(0, now + 0.25);
    noiseGainRef.current.gain.cancelScheduledValues(now);
    noiseGainRef.current.gain.linearRampToValueAtTime(0, now + 0.25);
  }, []);

  const updateEngineSpeed = useCallback((pxPerMs: number, cutting: boolean) => {
    const ctx = audioCtxRef.current;
    const osc = engineOscRef.current;
    const noise = noiseGainRef.current;
    if (!ctx || !osc || !noise) return;
    const now = ctx.currentTime;
    // Under load (actually cutting) the engine bogs down a touch and the
    // blade whir gets louder. Freewheeling over grass it can't cut, it
    // revs cleaner and quieter.
    const base = cutting ? 58 : 70;
    const freq = base + Math.min(55, pxPerMs * 30);
    osc.frequency.linearRampToValueAtTime(freq, now + 0.05);
    if (noise.gain.value > 0.001) {
      noise.gain.linearRampToValueAtTime(cutting ? 0.045 : 0.015, now + 0.08);
    }
  }, []);

  const playChime = useCallback(() => {
    if (!soundOn) return;
    const ctx = ensureAudioGraph();
    if (!ctx) return;
    const now = ctx.currentTime;
    [660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain).connect(ctx.destination);
      const t = now + i * 0.12;
      gain.gain.linearRampToValueAtTime(0.07, t + 0.02);
      gain.gain.linearRampToValueAtTime(0, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.32);
    });
  }, [ensureAudioGraph, soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      const next = !on;
      if (!next) stopEngine();
      try {
        window.localStorage.setItem(SOUND_KEY, next ? "on" : "off");
      } catch {
        // Storage can be unavailable, so the preference just won't persist.
      }
      return next;
    });
  }, [stopEngine]);

  const spawnClippings = useCallback((x: number, y: number) => {
    const layer = particleLayerRef.current;
    if (!layer) return;
    for (let i = 0; i < 2; i++) {
      const el = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const dist = 14 + Math.random() * 18;
      el.className = "grass-fleck absolute h-1.5 w-1 rounded-[1px]";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.backgroundColor = `oklch(${(0.45 + Math.random() * 0.25).toFixed(2)} 0.12 ${(130 + Math.random() * 25).toFixed(0)})`;
      el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      el.style.setProperty("--dy", `${Math.sin(angle) * dist - 10}px`);
      el.style.setProperty("--rot", `${Math.round(Math.random() * 240 - 120)}deg`);
      el.addEventListener("animationend", () => el.remove(), { once: true });
      layer.appendChild(el);
    }
  }, []);

  // A few puffs of exhaust when the engine catches.
  const spawnPuff = useCallback((x: number, y: number) => {
    const layer = particleLayerRef.current;
    if (!layer) return;
    for (let i = 0; i < 3; i++) {
      const el = document.createElement("span");
      el.className = "grass-fleck absolute h-2.5 w-2.5 rounded-full";
      el.style.left = `${x - 18 + Math.random() * 8}px`;
      el.style.top = `${y + 6}px`;
      el.style.backgroundColor = `oklch(${(0.7 + Math.random() * 0.15).toFixed(2)} 0.01 100 / 0.7)`;
      el.style.setProperty("--dx", `${-10 - Math.random() * 14}px`);
      el.style.setProperty("--dy", `${-16 - Math.random() * 14}px`);
      el.style.setProperty("--rot", "0deg");
      el.addEventListener("animationend", () => el.remove(), { once: true });
      layer.appendChild(el);
    }
  }, []);

  // Soft darkening toward the edges, drawn on both layers so mowed and
  // unmowed areas share the same lighting.
  const drawVignette = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const g = ctx.createRadialGradient(
      w / 2,
      h / 2,
      Math.min(w, h) * 0.35,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.75
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // One light source, upper-left, on both layers. Sells the depth far
    // more than any single texture does.
    const sun = ctx.createLinearGradient(0, 0, w * 0.6, h);
    sun.addColorStop(0, "rgba(255,255,235,0.16)");
    sun.addColorStop(0.5, "rgba(255,255,235,0)");
    sun.addColorStop(1, "rgba(0,0,0,0.12)");
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, w, h);
  }, []);

  const drawBackground = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cols = colsRef.current;
      const rows = rowsRef.current;
      const cellW = cellWRef.current;
      const cellH = cellHRef.current;
      const grid = patternGridRef.current;
      const vertical = PATTERNS[patternIndexRef.current].grain === "horizontal";

      for (let r = 0; r < rows; r++) {
        const t = r / rows;
        const lightA = 0.66 - t * 0.16;
        const lightB = 0.56 - t * 0.16;
        for (let c = 0; c < cols; c++) {
          const isA = grid[r * cols + c] === 1;
          const light = isA ? lightA : lightB;
          const hue = isA ? 150 : 145;
          const chroma = isA ? 0.08 : 0.085;
          // Each band gets a soft sheen across it, the way rolled grass
          // catches light on one side of the stripe and falls off on the
          // other. Runs along the mowing direction of the pattern.
          const x0 = c * cellW;
          const y0 = r * cellH;
          const sheen = vertical
            ? ctx.createLinearGradient(x0, y0, x0, y0 + cellH)
            : ctx.createLinearGradient(x0, y0, x0 + cellW, y0);
          sheen.addColorStop(0, `oklch(${(light + 0.05).toFixed(2)} ${chroma} ${hue})`);
          sheen.addColorStop(1, `oklch(${(light - 0.04).toFixed(2)} ${chroma} ${hue})`);
          ctx.fillStyle = sheen;
          ctx.fillRect(x0, y0, cellW + 1, cellH + 1);
        }
      }

      // Short stubble over the flat two-tone so a freshly cut lawn still
      // reads as grass rather than painted stripes.
      const stubbleCount = Math.round((w * h) / 210);
      ctx.lineCap = "round";
      ctx.lineWidth = 1;
      for (let i = 0; i < stubbleCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const len = 2 + Math.random() * 3;
        const light = 0.5 + Math.random() * 0.3;
        ctx.strokeStyle = `oklch(${light.toFixed(2)} 0.09 148 / 0.4)`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 2, y - len);
        ctx.stroke();
      }

      drawVignette(ctx, w, h);
    },
    [drawVignette]
  );

  const drawGrass = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);

    const cols = colsRef.current;
    const rows = rowsRef.current;
    const cellW = cellWRef.current;
    const cellH = cellHRef.current;
    const grid = patternGridRef.current;

    for (let r = 0; r < rows; r++) {
      const t = r / rows;
      const lightA = 0.5 - t * 0.16;
      const lightB = 0.44 - t * 0.14;
      for (let c = 0; c < cols; c++) {
        const isA = grid[r * cols + c] === 1;
        ctx.fillStyle = isA
          ? `oklch(${lightA.toFixed(2)} 0.07 150)`
          : `oklch(${lightB.toFixed(2)} 0.075 145)`;
        ctx.fillRect(c * cellW, r * cellH, cellW + 1, cellH + 1);
      }
    }

    // Blades are drawn back-to-front (sorted by root y) so nearer blades
    // overlap farther ones, and each one is a shaded body plus a thin lit
    // edge on the sun side, which is what makes them read as round stalks
    // instead of flat green lines.
    const bladeCount = Math.round((w * h) / 70);
    const blades: { x: number; y: number; bh: number; lean: number; light: number; hue: number; lw: number }[] = [];
    for (let i = 0; i < bladeCount; i++) {
      blades.push({
        x: Math.random() * w,
        y: Math.random() * h,
        bh: 10 + Math.random() * 24,
        lean: (Math.random() - 0.5) * 14,
        light: 0.3 + Math.random() * 0.24,
        hue: 138 + Math.random() * 22,
        lw: 1.6 + Math.random() * 1.6,
      });
    }
    blades.sort((a, b) => a.y - b.y);
    ctx.lineCap = "round";
    for (const b of blades) {
      const cx = b.x + b.lean / 2;
      const cy = b.y - b.bh / 2;
      const tx = b.x + b.lean;
      const ty = b.y - b.bh;

      // Shadow side / body.
      ctx.strokeStyle = `oklch(${b.light.toFixed(2)} 0.11 ${b.hue.toFixed(0)})`;
      ctx.lineWidth = b.lw;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.quadraticCurveTo(cx, cy, tx, ty);
      ctx.stroke();

      // Lit edge, offset up-left toward the light.
      ctx.strokeStyle = `oklch(${(b.light + 0.22).toFixed(2)} 0.12 ${(b.hue + 6).toFixed(0)} / 0.85)`;
      ctx.lineWidth = Math.max(0.6, b.lw * 0.4);
      ctx.beginPath();
      ctx.moveTo(b.x - 0.7, b.y - 1);
      ctx.quadraticCurveTo(cx - 0.7, cy - 1, tx - 0.5, ty - 0.5);
      ctx.stroke();
    }

    drawVignette(ctx, w, h);
  }, [drawVignette]);

  const computePatternGrid = useCallback((patternIndex: number) => {
    const cols = colsRef.current;
    const rows = rowsRef.current;
    const pattern = PATTERNS[patternIndex];
    const grid = new Uint8Array(cols * rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (pattern.cell(c, r)) grid[r * cols + c] = 1;
      }
    }
    patternGridRef.current = grid;
  }, []);

  const setupPattern = useCallback(
    (index: number, animateRegrow: boolean) => {
      patternIndexRef.current = index;
      computePatternGrid(index);
      visitedRef.current = new Uint8Array(colsRef.current * rowsRef.current);
      lastPoint.current = null;
      wrongStreakRef.current = 0;
      scuffsRef.current = 0;
      patternStartRef.current = null;
      setTimerRunning(false);
      setElapsedMs(0);
      setPatternName(PATTERNS[index].name);
      setPatternGrain(PATTERNS[index].grain);
      setDirectionWarning(false);
      setProgress(0);

      const grassCanvas = grassCanvasRef.current;
      const bgCanvas = bgCanvasRef.current;
      const grassCtx = grassCanvas?.getContext("2d");
      const bgCtx = bgCanvas?.getContext("2d");
      const rect = grassCanvas?.getBoundingClientRect();
      if (grassCanvas && grassCtx && rect) {
        drawGrass(grassCtx, rect.width, rect.height);

        // "Grow" the fresh grass in from the ground rather than popping it
        // into place. Skipped on resize (no story to tell) and under
        // reduced motion.
        if (animateRegrow && !reducedMotionRef.current) {
          grassCanvas.style.transition = "none";
          grassCanvas.style.opacity = "0";
          grassCanvas.style.transform = "scaleY(0.6)";
          // Force the browser to commit the start state before transitioning.
          void grassCanvas.getBoundingClientRect();
          requestAnimationFrame(() => {
            grassCanvas.style.transition = "";
            grassCanvas.style.opacity = "";
            grassCanvas.style.transform = "";
          });
        } else {
          // The finish fades the old grass out, so make sure the new grass
          // is fully visible right away.
          grassCanvas.style.transition = "none";
          grassCanvas.style.opacity = "";
          grassCanvas.style.transform = "";
          void grassCanvas.getBoundingClientRect();
          grassCanvas.style.transition = "";
        }
      }
      if (bgCanvas && bgCtx && rect) {
        drawBackground(bgCtx, rect.width, rect.height);
      }
    },
    [computePatternGrid, drawGrass, drawBackground]
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const grassCanvas = grassCanvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!wrap || !grassCanvas || !bgCanvas) return;
    const grassCtx = grassCanvas.getContext("2d");
    const bgCtx = bgCanvas.getContext("2d");
    if (!grassCtx || !bgCtx) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      for (const [canvas, ctx] of [
        [grassCanvas, grassCtx],
        [bgCanvas, bgCtx],
      ] as const) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      colsRef.current = COLS;
      rowsRef.current = Math.max(
        MIN_ROWS,
        Math.min(MAX_ROWS, Math.round(COLS / (rect.width / rect.height)))
      );
      cellWRef.current = rect.width / colsRef.current;
      cellHRef.current = rect.height / rowsRef.current;
      mowerWidthRef.current = Math.max(30, Math.min(90, rect.width / 8));

      setupPattern(patternIndexRef.current, false);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => {
      ro.disconnect();
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, [setupPattern]);

  const markVisited = useCallback((x0: number, y0: number, x1: number, y1: number) => {
    const cols = colsRef.current;
    const rows = rowsRef.current;
    const cellW = cellWRef.current;
    const cellH = cellHRef.current;
    const cellMin = Math.min(cellW, cellH) || 1;
    const visited = visitedRef.current;
    const mowerR = mowerWidthRef.current / 2;
    const rCells = Math.ceil(mowerR / cellMin) + 1;

    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / (cellMin / 2)));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      const col = Math.floor(x / cellW);
      const row = Math.floor(y / cellH);
      for (let dr = -rCells; dr <= rCells; dr++) {
        const rr = row + dr;
        if (rr < 0 || rr >= rows) continue;
        for (let dc = -rCells; dc <= rCells; dc++) {
          const cc = col + dc;
          if (cc < 0 || cc >= cols) continue;
          const cx = (cc + 0.5) * cellW;
          const cy = (rr + 0.5) * cellH;
          // Strict: the cell's center has to pass under the deck itself.
          // No slack, so "100%" means the whole lawn really got cut.
          if (Math.hypot(cx - x, cy - y) <= mowerR) {
            visited[rr * cols + cc] = 1;
          }
        }
      }
    }
  }, []);

  const completePattern = useCallback(() => {
    stopEngine();
    playChime();
    buzz([40, 60, 40]);

    // Every cell center has been under the deck, so whatever hairline
    // slivers are left at the very edges get the final pass for free.
    const grassCanvas = grassCanvasRef.current;
    if (grassCanvas) grassCanvas.style.opacity = "0";

    const name = PATTERNS[patternIndexRef.current].name;
    const start = patternStartRef.current;
    const ms = start != null ? performance.now() - start : 0;
    const prevBest = bestTimes[name];
    const isBest = prevBest == null || ms < prevBest;
    setTimerRunning(false);
    setElapsedMs(ms);
    setLastResult({ ms, isBest, scuffs: scuffsRef.current });
    if (isBest) {
      const next = { ...bestTimes, [name]: ms };
      setBestTimes(next);
      try {
        window.localStorage.setItem(BEST_KEY, JSON.stringify(next));
      } catch {
        // Storage can be unavailable, so the best just won't persist.
      }
    }

    setPhase("success");
    setCompletedCount((c) => c + 1);
    setAllTimeCount((c) => {
      const next = c + 1;
      try {
        window.localStorage.setItem(ALL_TIME_KEY, String(next));
      } catch {
        // Storage can be unavailable (private browsing, blocked cookies),
        // so the count just won't persist across visits, which is fine.
      }
      return next;
    });

    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    successTimeoutRef.current = setTimeout(
      () => {
        setupPattern(pickPatternIndex(patternIndexRef.current), true);
        setPhase("playing");
      },
      reducedMotion ? 1200 : 2400
    );
  }, [bestTimes, pickPatternIndex, playChime, reducedMotion, setupPattern, stopEngine]);

  const mowAt = useCallback(
    (x: number, y: number, cut: boolean) => {
      const canvas = grassCanvasRef.current;
      if (!canvas || phase !== "playing") return;
      const prev = lastPoint.current;
      lastPoint.current = { x, y };

      // Dragging the wrong way for this pattern's grain: the deck just
      // rides over already-bent grass and cuts nothing, so the mower still
      // moves but the canvas and visited grid are left untouched.
      if (!cut) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // The clock starts on the first real stroke, not on the dot the mower
      // leaves when it first rolls onto the lawn.
      if (prev && patternStartRef.current == null) {
        patternStartRef.current = performance.now();
        setTimerRunning(true);
      }

      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = mowerWidthRef.current;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      if (prev) {
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(x, y);
        markVisited(prev.x, prev.y, x, y);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 0.01, y + 0.01);
        markVisited(x, y, x, y);
      }
      ctx.stroke();

      if (!rafPending.current) {
        rafPending.current = true;
        requestAnimationFrame(() => {
          rafPending.current = false;
          const cols = colsRef.current;
          const rows = rowsRef.current;
          const visited = visitedRef.current;
          let hit = 0;
          for (let i = 0; i < cols * rows; i++) {
            if (visited[i] === 1) hit++;
          }
          const total = cols * rows;
          setProgress(total ? hit / total : 0);
          if (total > 0 && hit >= total) {
            completePattern();
          }
        });
      }
    },
    [phase, markVisited, completePattern]
  );

  // Does this segment pass over any grass that hasn't been cut yet?
  const crossesUncut = useCallback((x0: number, y0: number, x1: number, y1: number) => {
    const cols = colsRef.current;
    const rows = rowsRef.current;
    const cellW = cellWRef.current;
    const cellH = cellHRef.current;
    const cellMin = Math.min(cellW, cellH) || 1;
    const visited = visitedRef.current;
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / (cellMin / 2)));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const col = Math.floor((x0 + (x1 - x0) * t) / cellW);
      const row = Math.floor((y0 + (y1 - y0) * t) / cellH);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      if (visited[row * cols + col] !== 1) return true;
    }
    return false;
  }, []);

  const registerDirection = useCallback(
    (dir: Grain | null, x0: number, y0: number, x1: number, y1: number) => {
      const grain = PATTERNS[patternIndexRef.current].grain;
      const matches = grain === "any" || dir === null || dir === grain;
      if (matches) {
        wrongStreakRef.current = 0;
        setDirectionWarning(false);
      } else if (crossesUncut(x0, y0, x1, y1)) {
        // Wrong way over standing grass: that's a scuff, and a warning if
        // it keeps happening.
        wrongStreakRef.current += 1;
        scuffsRef.current += 1;
        if (wrongStreakRef.current === 3) {
          setDirectionWarning(true);
          buzz(30);
        }
      } else {
        // Wrong way, but only over grass that's already cut. Rolling the
        // mower across a finished row to line up the next one is fine.
        wrongStreakRef.current = 0;
        setDirectionWarning(false);
      }
      return matches;
    },
    [crossesUncut]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (phase !== "playing") return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      const mower = mowerRef.current;

      const prev = lastPoint.current;
      const angle = prev ? Math.max(-18, Math.min(18, (x - prev.x) * 1.4)) : 0;
      let cut = true;

      if (!prev) {
        // Fresh touch-down after being lifted, so start the engine back up.
        startEngine();
        if (!reducedMotion) spawnPuff(x, y);
      } else {
        const dt = Math.max(1, now - lastMoveTime.current);
        const dx = x - prev.x;
        const dist = Math.hypot(dx, y - prev.y);
        cut = registerDirection(
          classifyDirection(dx, y - prev.y),
          prev.x,
          prev.y,
          x,
          y
        );
        updateEngineSpeed(dist / dt, cut);
        if (dx > 2) headingRef.current = 1;
        else if (dx < -2) headingRef.current = -1;

        // Exaggerated on purpose, since a real wheel radius would barely turn
        // visibly at this scale, and the point is to sell the motion.
        wheelSpinDeg.current += dist * 3.2 * headingRef.current;
        const spin = `rotate(${wheelSpinDeg.current}deg)`;
        for (const wheel of wheelsRef.current) {
          if (wheel) wheel.style.transform = spin;
        }

        if (cut && !reducedMotion && now - lastParticleTime.current > 45) {
          lastParticleTime.current = now;
          spawnClippings(x, y);
        }
      }
      lastMoveTime.current = now;

      mowAt(x, y, cut);
      setInteracted(true);

      if (mower) {
        // scaleX mirrors the side-on mower to face its direction of travel;
        // the rotate leans it into the push.
        mower.style.transform = `translate3d(${x - 24}px, ${y - 22}px, 0) rotate(${angle}deg) scaleX(${headingRef.current})`;
      }
    },
    [
      mowAt,
      phase,
      reducedMotion,
      registerDirection,
      spawnClippings,
      spawnPuff,
      startEngine,
      updateEngineSpeed,
    ]
  );

  const handlePointerLeave = useCallback(() => {
    lastPoint.current = null;
    wrongStreakRef.current = 0;
    setDirectionWarning(false);
    stopEngine();
  }, [stopEngine]);

  // Hovering cuts, so a mouse click means nothing mid-stroke. A finger or
  // pen lifting off, though, really is the mower coming off the lawn.
  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === "mouse") return;
      handlePointerLeave();
    },
    [handlePointerLeave]
  );

  const handleNewPattern = useCallback(() => {
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    stopEngine();
    setupPattern(pickPatternIndex(patternIndexRef.current), true);
    setPhase("playing");
  }, [pickPatternIndex, setupPattern, stopEngine]);

  // Fully tear down the audio graph on unmount so nothing keeps humming
  // (or holding a live AudioContext) after the section is gone.
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            How it works
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Three steps from quote to a maintained lawn
          </h2>
        </div>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3">
          {/* Uncut grass, automatically mowed away left to right on load
              like a loading bar, revealing a clean stripe behind the mower.
              Desktop only — there's no room to read this at mobile widths. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 hidden h-16 overflow-hidden md:block"
          >
            <div className="mow-track-grass absolute inset-0" />
            <div className="mow-track-cut absolute inset-y-0 left-0" />
            <svg
              width="30"
              height="26"
              viewBox="0 0 40 32"
              fill="none"
              className="mow-track-icon absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
            >
              <path
                d="M8 4 L22 18"
                stroke="oklch(0.28 0.02 156)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="7" cy="3" r="2.3" fill="oklch(0.28 0.02 156)" />
              <rect
                x="10"
                y="16"
                width="18"
                height="9"
                rx="3.5"
                fill="oklch(0.646 0.222 41.116)"
              />
              <circle cx="14" cy="27" r="4" fill="oklch(0.21 0.015 160)" />
              <circle cx="26" cy="27" r="4" fill="oklch(0.21 0.015 160)" />
            </svg>
          </div>
          {STEPS.map((s, i) => (
            <div key={s.step} className="relative text-center">
              <div className="relative z-10 flex h-16 items-center justify-center">
                <span
                  className="mow-digit font-display text-4xl font-bold tabular-nums sm:text-5xl"
                  style={{ "--mow-i": i } as React.CSSProperties}
                >
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ===== MOW-THE-LAWN MINI GAME ===== */}
        <div className="mx-auto mt-16 max-w-3xl lg:mt-20">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rating">
              Just for fun
            </p>
            <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight text-balance">
              Think you can stripe a lawn?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              No clicking, just run the mower over the grass. Classic stripes
              go up and down, horizontal stripes go side to side, and
              everything else cuts any way you like. Every last blade has to
              come down before the next pattern grows in.
            </p>
          </div>

          <div
            ref={wrapRef}
            className="relative mt-6 aspect-4/3 w-full touch-none select-none overflow-hidden rounded-3xl border border-border shadow-[0_24px_48px_-20px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] sm:aspect-video"
          >
            <canvas ref={bgCanvasRef} className="absolute inset-0 block h-full w-full" />
            <canvas
              ref={grassCanvasRef}
              className="absolute inset-0 block h-full w-full origin-bottom cursor-none touch-none drop-shadow-[0_4px_5px_rgba(0,0,0,0.5)] transition-[opacity,transform] duration-700 ease-out"
              onPointerDown={handlePointerMove}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
            />

            {/* Grass clippings fly here, above the canvases and below the UI. */}
            <div
              ref={particleLayerRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            />

            {phase === "playing" && (
              <div
                ref={mowerRef}
                className="pointer-events-none absolute left-0 top-0 will-change-transform"
                style={{ transform: "translate3d(-9999px,-9999px,0)" }}
              >
                <MowerIcon
                  onWheelRef={(i, el) => {
                    wheelsRef.current[i] = el;
                  }}
                />
              </div>
            )}

            {phase === "playing" && directionWarning && (
              <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center px-4">
                <span className="motion-safe:animate-bounce max-w-full truncate rounded-full bg-destructive px-4 py-1.5 text-center text-xs font-semibold text-background shadow-sm">
                  Wrong way. Mow {GRAIN_LABEL[patternGrain]}
                </span>
              </div>
            )}

            {!interacted && phase === "playing" && !directionWarning && (
              <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center px-4">
                <span className="motion-safe:animate-bounce max-w-full truncate rounded-full bg-foreground/85 px-4 py-1.5 text-center text-xs font-semibold text-background backdrop-blur-sm">
                  Mow {GRAIN_LABEL[patternGrain]} for a {patternName} finish
                </span>
              </div>
            )}

            {phase === "success" && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/30 backdrop-blur-[2px]">
                <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 relative z-10 max-w-[90%] rounded-2xl bg-background/95 px-6 py-4 text-center shadow-lg">
                  <p className="text-lg font-bold">
                    {reducedMotion
                      ? `Nice ${patternName.toLowerCase()} finish!`
                      : `Nice ${patternName.toLowerCase()} finish! \u{1F389}`}
                  </p>
                  {lastResult && (
                    <p className="mt-1 text-sm font-medium tabular-nums">
                      Done in {formatSeconds(lastResult.ms)}
                      {lastResult.isBest ? (
                        <span className="text-rating"> · New best!</span>
                      ) : (
                        <span className="text-muted-foreground">
                          {" "}· Best {formatSeconds(bestTimes[patternName] ?? lastResult.ms)}
                        </span>
                      )}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lastResult ? scuffLabel(lastResult.scuffs) : ""} A new
                    pattern is growing in...
                  </p>
                </div>
                {!reducedMotion &&
                  Array.from({ length: 14 }).map((_, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className="absolute top-1/2 h-2 w-2 rounded-sm motion-safe:animate-bounce"
                      style={{
                        left: `${8 + ((i * 71) % 84)}%`,
                        backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                        animationDelay: `${(i % 5) * 80}ms`,
                        animationDuration: "700ms",
                      }}
                    />
                  ))}
              </div>
            )}

            {/* Progress bar. Floored, not rounded, so it never reads 100%
                while a single cell is still standing. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-foreground/10">
              <div
                className="h-full bg-rating transition-[width] duration-150 ease-out"
                style={{ width: `${Math.min(100, Math.floor(progress * 100))}%` }}
              />
            </div>
          </div>

          {/* Controls live below the lawn on purpose: anything sitting on
              top of the canvas would swallow pointer events and leave the
              grass under it uncuttable. */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span>
              Pattern: <span className="font-medium text-foreground">{patternName}</span>
              {bestTimes[patternName] != null && (
                <>
                  {" "}· Best{" "}
                  <span className="font-medium tabular-nums text-foreground">
                    {formatSeconds(bestTimes[patternName])}
                  </span>
                </>
              )}
              {(timerRunning || elapsedMs > 0) && (
                <span className="tabular-nums">
                  {" "}· Time{" "}
                  <span className="font-medium text-foreground">
                    {formatSeconds(elapsedMs)}
                  </span>
                </span>
              )}
            </span>
            <span className="flex items-center gap-3">
              <span>
                Mowed:{" "}
                <span className="font-medium text-foreground">{completedCount}</span>
                {allTimeCount > completedCount && (
                  <> · All-time <span className="font-medium text-foreground">{allTimeCount}</span></>
                )}
              </span>
              <button
                type="button"
                onClick={toggleSound}
                aria-label={soundOn ? "Mute mower sound" : "Unmute mower sound"}
                aria-pressed={soundOn}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm shadow-sm transition-colors hover:bg-muted"
              >
                {soundOn ? "\u{1F50A}" : "\u{1F507}"}
              </button>
              <button
                type="button"
                onClick={handleNewPattern}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
              >
                New pattern
              </button>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
