import { iconSrc } from "@/components/site/icon-3d";
import { MowerAudio } from "./audio";
import { accuracy, createGame, scoreGame, stepDogs, stepMower, type GameState, type Result } from "./engine";
import type { Level } from "./levels";
import {
  drawBumpRing,
  drawCanopies,
  drawCell,
  drawDogs,
  drawFlowers,
  drawLawnLayer,
  drawMissedSpots,
  drawMower,
  drawParticles,
  drawStaticLayer,
  readPalette,
  spawnClippings,
  spawnLeafBurst,
  stepParticles,
  type Palette,
  type Particle,
  type Sprites,
} from "./render";

// Owns everything imperative about the game: the canvas, the animation
// loop, input, and sound. The React component only renders the UI around it
// and listens for HUD updates and the finish event.

export type Hud = { progress: number; elapsed: number; mishaps: number; accuracy: number; started: boolean };
export const EMPTY_HUD: Hud = { progress: 0, elapsed: 0, mishaps: 0, accuracy: 1, started: false };

type Callbacks = {
  onHud: (hud: Hud) => void;
  onFinish: (level: Level, result: Result) => void;
};

const KEYMAP: Record<string, "up" | "down" | "left" | "right"> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};

export class GameController {
  private wrap: HTMLElement;
  private canvas: HTMLCanvasElement;
  private staticLayer = document.createElement("canvas");
  private lawnLayer = document.createElement("canvas");
  private game: GameState | null = null;
  private palette: Palette;
  private sprites: Sprites = {};
  private cs = 20;
  private dpr = 1;
  private particles: Particle[] = [];
  private rings: { x: number; y: number; t: number }[] = [];
  private goal: { x: number; y: number } | null = null;
  private keys = new Set<string>();
  private raf = 0;
  private last = 0;
  private hudAt = 0;
  private visible = false;
  private active = true;
  private guide = true;
  private reduced: boolean;
  private audio = new MowerAudio();
  private cb: Callbacks;
  private ro: ResizeObserver;
  private io: IntersectionObserver;

  constructor(wrap: HTMLElement, canvas: HTMLCanvasElement, cb: Callbacks, opts: { sound: boolean; guide: boolean }) {
    this.wrap = wrap;
    this.canvas = canvas;
    this.cb = cb;
    this.guide = opts.guide;
    this.audio.enabled = opts.sound;
    this.palette = readPalette();
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (["tulip", "blossom", "tree", "evergreen", "rock", "dog"] as const).forEach((name) => {
      const img = new Image();
      img.src = iconSrc(name);
      img.onload = () => {
        this.sprites[name] = img;
        if (name === "rock") this.redrawStatic();
      };
    });

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(wrap);
    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.startLoop();
      else this.audio.stop();
    });
    this.io.observe(wrap);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.audio.dispose();
  }

  private onVisibility = () => {
    if (document.hidden) this.audio.stop();
    else this.startLoop();
  };

  // ------------------------------------------------------------ levels

  load(level: Level) {
    this.game = createGame(level);
    this.particles = [];
    this.rings = [];
    this.goal = null;
    this.keys.clear();
    this.cb.onHud(EMPTY_HUD);
    this.resize();
    this.startLoop();
  }

  /** Input is ignored while an overlay (level select, results) is open. */
  setActive(active: boolean) {
    this.active = active;
    if (!active) {
      this.goal = null;
      this.keys.clear();
      this.audio.stop();
    }
  }

  setSound(on: boolean) {
    this.audio.enabled = on;
    if (!on) this.audio.stop();
  }

  setGuide(on: boolean) {
    this.guide = on;
    this.redrawLawn();
  }

  playStars(count: number) {
    for (let n = 0; n < count; n++) window.setTimeout(() => this.audio.star(n), 150 + n * 220);
  }

  // ------------------------------------------------------------ drawing

  private resize() {
    const g = this.game;
    if (!g) return;
    const width = this.wrap.clientWidth;
    if (!width) return;
    this.cs = width / g.cols;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const height = this.cs * g.rows;
    for (const c of [this.canvas, this.staticLayer, this.lawnLayer]) {
      c.width = Math.round(width * this.dpr);
      c.height = Math.round(height * this.dpr);
    }
    this.redrawStatic();
    this.redrawLawn();
    this.draw(performance.now());
  }

  private redrawStatic() {
    if (!this.game) return;
    const ctx = this.staticLayer.getContext("2d")!;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    drawStaticLayer(ctx, this.game, this.cs, this.palette, this.sprites);
  }

  private redrawLawn() {
    if (!this.game) return;
    const ctx = this.lawnLayer.getContext("2d")!;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    drawLawnLayer(ctx, this.game, this.cs, this.palette, this.guide);
  }

  private draw(now: number) {
    const g = this.game;
    if (!g) return;
    const cs = this.cs;
    if (g.dirty.length) {
      const lctx = this.lawnLayer.getContext("2d")!;
      lctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      for (const i of g.dirty) drawCell(lctx, g, i, cs, this.palette, this.guide);
      g.dirty.length = 0;
    }
    const ctx = this.canvas.getContext("2d")!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.staticLayer, 0, 0);
    ctx.drawImage(this.lawnLayer, 0, 0);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    drawFlowers(ctx, g, cs, this.sprites);
    drawParticles(ctx, this.particles.filter((q) => !q.leaf), cs);
    drawDogs(ctx, g, cs, this.sprites, now);
    drawMower(ctx, g, cs, this.palette, now);
    drawCanopies(ctx, g, cs, this.sprites);
    if (this.active && g.finishedAt === null && g.cutCount / g.lawnTotal > 0.92 && now - g.lastCutAt > 1400) {
      drawMissedSpots(ctx, g, cs, now);
    }
    this.rings = this.rings.filter((r) => now - r.t < 450);
    for (const r of this.rings) drawBumpRing(ctx, r.x, r.y, cs, (now - r.t) / 450);
    drawParticles(ctx, this.particles.filter((q) => q.leaf), cs);
  }

  // ------------------------------------------------------------ loop

  private startLoop() {
    if (this.raf || !this.visible || document.hidden) return;
    this.last = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    this.raf = 0;
    const g = this.game;
    if (!g) return;
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000);
    this.last = now;

    if (this.active) {
      const vx = (this.keys.has("right") ? 1 : 0) - (this.keys.has("left") ? 1 : 0);
      const vy = (this.keys.has("down") ? 1 : 0) - (this.keys.has("up") ? 1 : 0);
      const len = Math.hypot(vx, vy) || 1;
      const events = [
        ...stepMower(g, dt, now, { goal: this.goal, vel: vx || vy ? { x: vx / len, y: vy / len } : null }),
        ...stepDogs(g, dt),
      ];
      let cutting = false;
      for (const e of events) {
        if (e.type === "cut") {
          cutting = true;
          if (!this.reduced) spawnClippings(this.particles, g, this.palette, Math.min(4, 1 + Math.floor(e.count / 2)));
        } else if (e.type === "bump") {
          this.audio.bump();
          this.rings.push({ x: e.x, y: e.y, t: now });
          try {
            navigator.vibrate?.(30);
          } catch {}
        } else if (e.type === "trample") {
          this.audio.squish();
          this.rings.push({ x: e.x, y: e.y, t: now });
        } else if (e.type === "dog") {
          this.audio.bark();
          this.rings.push({ x: e.x, y: e.y, t: now });
        } else if (e.type === "finish") {
          this.finish();
        }
      }
      this.audio.update(g.mower.speed, cutting);
    }

    stepParticles(this.particles, dt);
    this.draw(now);

    if (now - this.hudAt > 100) {
      this.hudAt = now;
      const started = g.startedAt !== null;
      this.cb.onHud({
        progress: g.cutCount / g.lawnTotal,
        elapsed: started ? (g.finishedAt ?? now) - g.startedAt! : 0,
        mishaps: g.bumps + g.trampled + g.dogBumps,
        accuracy: accuracy(g),
        started,
      });
    }

    // Keep animating while visible: dogs wander and particles settle even
    // when the player is idle.
    if (this.visible && !document.hidden) this.raf = requestAnimationFrame(this.frame);
  };

  private finish() {
    const g = this.game!;
    const result = scoreGame(g);
    this.audio.stop();
    this.audio.win();
    if (!this.reduced) spawnLeafBurst(this.particles, g, this.palette);
    this.goal = null;
    this.keys.clear();
    this.cb.onFinish(g.level, result);
  }

  // ------------------------------------------------------------ input

  private toCells(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const cs = rect.width / (this.game?.cols ?? 1);
    return { x: (clientX - rect.left) / cs, y: (clientY - rect.top) / cs };
  }

  pointerMove(e: PointerEvent) {
    if (!this.active) return;
    // Mouse mows on hover; touch and pen mow while pressed so a stray
    // swipe doesn't cut grass.
    if (e.pointerType !== "mouse" && e.buttons === 0) return;
    this.goal = this.toCells(e.clientX, e.clientY);
    this.audio.start();
    this.startLoop();
  }

  pointerDown(e: PointerEvent) {
    if (!this.active) return;
    if (e.pointerType !== "mouse") this.canvas.setPointerCapture?.(e.pointerId);
    this.goal = this.toCells(e.clientX, e.clientY);
    this.audio.start();
    this.startLoop();
  }

  pointerEnd() {
    this.goal = null;
    this.audio.stop();
  }

  /** Returns true when the key was a steering key (so the page shouldn't scroll). */
  keyDown(key: string) {
    const dir = KEYMAP[key];
    if (!dir || !this.active) return false;
    this.keys.add(dir);
    this.goal = null;
    this.audio.start();
    this.startLoop();
    return true;
  }

  keyUp(key: string) {
    const dir = KEYMAP[key];
    if (!dir) return;
    this.keys.delete(dir);
    if (!this.keys.size) this.audio.stop();
  }

  blur() {
    this.keys.clear();
    this.audio.stop();
  }
}
