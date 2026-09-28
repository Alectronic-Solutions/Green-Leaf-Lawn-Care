import type { Level, Target } from "./levels";

// Pure game logic, no DOM. Positions are in cell units (1 = one grid cell),
// so the same state renders at any canvas size.

export enum Kind {
  Lawn = 0,
  House = 1,
  Drive = 2,
  Bed = 3,
  Tree = 4,
  Evergreen = 5,
  Sprinkler = 6,
  Rock = 7,
  Pool = 8,
}

/** Stripe shade a cell was cut to. Real mower stripes come from direction:
 *  grass bent away from you reads light, toward you reads dark. */
export enum Shade {
  Uncut = 0,
  Light = 1,
  Dark = 2,
}

const CHAR_KIND: Record<string, Kind> = {
  ".": Kind.Lawn,
  "#": Kind.House,
  "=": Kind.Drive,
  "*": Kind.Bed,
  T: Kind.Tree,
  E: Kind.Evergreen,
  o: Kind.Sprinkler,
  r: Kind.Rock,
  "~": Kind.Pool,
};

/** Grass is cut on a grid this many times finer than the map, so mowed
 *  swaths have smooth edges instead of blocky steps. */
export const SUB = 3;
export const DECK_RADIUS = 0.95; // cutting radius
const BODY_RADIUS = 0.42; // collision radius
const MAX_SPEED = 32; // cells per second, pointer control
export const KEY_SPEED = 7.5; // cells per second, keyboard control
const DOG_SPEED = 1.6;

export function isSolid(k: Kind) {
  return k === Kind.House || k === Kind.Tree || k === Kind.Evergreen || k === Kind.Sprinkler || k === Kind.Rock || k === Kind.Pool;
}

/** Solid cells shrink a little so the mower can skim past small things. */
function solidInset(k: Kind) {
  if (k === Kind.Sprinkler) return 0.34;
  if (k === Kind.Rock) return 0.15;
  if (k === Kind.Tree || k === Kind.Evergreen) return 0.2;
  return 0;
}

export type Flower = { c: number; r: number; x: number; y: number; alive: boolean; variant: 0 | 1; scale: number };
export type Dog = { x: number; y: number; vx: number; vy: number; flee: number; cooldown: number; turn: number };

export type GameEvent =
  | { type: "bump"; x: number; y: number }
  | { type: "trample"; x: number; y: number }
  | { type: "dog"; x: number; y: number }
  | { type: "cut"; count: number }
  | { type: "finish" };

export type GameState = {
  level: Level;
  cols: number;
  rows: number;
  kind: Uint8Array;
  /** Fine grid (cols * SUB by rows * SUB) of cut shades and targets. */
  fcols: number;
  frows: number;
  cut: Uint8Array;
  target: Uint8Array;
  lawnTotal: number;
  cutCount: number;
  flowers: Flower[];
  dogs: Dog[];
  mower: { x: number; y: number; heading: number; speed: number; shade: Shade };
  inContact: boolean;
  bumps: number;
  trampled: number;
  dogBumps: number;
  startedAt: number | null;
  finishedAt: number | null;
  lastCutAt: number;
  /** Fine cells whose look changed since the renderer last drew them. */
  dirty: number[];
};

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function targetShade(target: Target, c: number, r: number): Shade {
  switch (target) {
    case "vstripes":
      return Math.floor(c / 2) % 2 === 0 ? Shade.Light : Shade.Dark;
    case "hstripes":
      return Math.floor(r / 2) % 2 === 0 ? Shade.Light : Shade.Dark;
    case "checker":
      return (Math.floor(c / 3) + Math.floor(r / 3)) % 2 === 0 ? Shade.Light : Shade.Dark;
    case "diamond": {
      const lx = mod(c, 6) - 2.5;
      const ly = mod(r, 6) - 2.5;
      return Math.abs(lx) + Math.abs(ly) < 3 ? Shade.Light : Shade.Dark;
    }
    default:
      return Shade.Uncut;
  }
}

// Small deterministic PRNG so flower placement is the same every play.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function createGame(level: Level): GameState {
  const rows = level.map.length;
  const cols = level.map[0].length;
  const kind = new Uint8Array(cols * rows);
  const fcols = cols * SUB;
  const frows = rows * SUB;
  const target = new Uint8Array(fcols * frows);
  const flowers: Flower[] = [];
  const rand = rng(level.id.length * 7919 + cols * 31 + rows);
  let lawnTotal = 0;

  for (let r = 0; r < rows; r++) {
    const line = level.map[r];
    for (let c = 0; c < cols; c++) {
      const k = CHAR_KIND[line[c]] ?? Kind.Lawn;
      const i = r * cols + c;
      kind[i] = k;
      if (k === Kind.Lawn) {
        const t = targetShade(level.target, c, r);
        for (let fr = r * SUB; fr < (r + 1) * SUB; fr++) {
          for (let fc = c * SUB; fc < (c + 1) * SUB; fc++) target[fr * fcols + fc] = t;
        }
        lawnTotal += SUB * SUB;
      }
      if (k === Kind.Bed && rand() < 0.8) {
        flowers.push({
          c,
          r,
          x: c + 0.25 + rand() * 0.5,
          y: r + 0.25 + rand() * 0.5,
          alive: true,
          variant: rand() < 0.5 ? 0 : 1,
          scale: 0.8 + rand() * 0.35,
        });
      }
    }
  }

  // Start the mower on the first open lawn cell near the bottom-left.
  let start = { x: 1, y: rows - 1 };
  outer: for (let r = rows - 1; r >= 0; r--) {
    for (let c = 0; c < cols; c++) {
      if (kind[r * cols + c] === Kind.Lawn) {
        // Nudge inward so the whole deck starts on the lawn, not off the edge.
        start = { x: Math.min(cols - 1, c + 1.1), y: Math.max(1, r - 0.1) };
        break outer;
      }
    }
  }

  const dogs: Dog[] = [];
  for (let d = 0; d < (level.dogs ?? 0); d++) {
    const angle = rand() * Math.PI * 2;
    dogs.push({
      x: cols * (0.35 + 0.3 * rand()),
      y: rows * (0.3 + 0.3 * rand()),
      vx: Math.cos(angle) * DOG_SPEED,
      vy: Math.sin(angle) * DOG_SPEED,
      flee: 0,
      cooldown: 0,
      turn: 0,
    });
  }

  return {
    level,
    cols,
    rows,
    kind,
    fcols,
    frows,
    cut: new Uint8Array(fcols * frows),
    target,
    lawnTotal,
    cutCount: 0,
    flowers,
    dogs,
    mower: { ...start, heading: -Math.PI / 2, speed: 0, shade: Shade.Light },
    inContact: false,
    bumps: 0,
    trampled: 0,
    dogBumps: 0,
    startedAt: null,
    finishedAt: null,
    lastCutAt: 0,
    dirty: [],
  };
}

function kindAt(s: GameState, c: number, r: number): Kind | -1 {
  if (c < 0 || r < 0 || c >= s.cols || r >= s.rows) return -1;
  return s.kind[r * s.cols + c] as Kind;
}

function collides(s: GameState, x: number, y: number) {
  const minC = Math.floor(x - BODY_RADIUS);
  const maxC = Math.floor(x + BODY_RADIUS);
  const minR = Math.floor(y - BODY_RADIUS);
  const maxR = Math.floor(y + BODY_RADIUS);
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      const k = kindAt(s, c, r);
      if (k === -1 || !isSolid(k)) continue;
      const inset = solidInset(k);
      const nx = Math.max(c + inset, Math.min(x, c + 1 - inset));
      const ny = Math.max(r + inset, Math.min(y, r + 1 - inset));
      if ((x - nx) ** 2 + (y - ny) ** 2 < BODY_RADIUS ** 2) return true;
    }
  }
  return false;
}

function shadeFor(dx: number, dy: number, fallback: Shade): Shade {
  if (Math.abs(dx) < 1e-4 && Math.abs(dy) < 1e-4) return fallback;
  if (Math.abs(dy) >= Math.abs(dx)) return dy < 0 ? Shade.Light : Shade.Dark;
  return dx > 0 ? Shade.Light : Shade.Dark;
}

function cutAround(s: GameState, x: number, y: number, shade: Shade, now: number): number {
  let fresh = 0;
  // Work in fine-cell units.
  const R = DECK_RADIUS * SUB;
  const fx = x * SUB;
  const fy = y * SUB;
  for (let r = Math.floor(fy - R); r <= Math.floor(fy + R); r++) {
    for (let c = Math.floor(fx - R); c <= Math.floor(fx + R); c++) {
      if (c < 0 || r < 0 || c >= s.fcols || r >= s.frows) continue;
      if (kindAt(s, Math.floor(c / SUB), Math.floor(r / SUB)) !== Kind.Lawn) continue;
      const dx = c + 0.5 - fx;
      const dy = r + 0.5 - fy;
      if (dx * dx + dy * dy > R * R) continue;
      const i = r * s.fcols + c;
      const prev = s.cut[i];
      if (prev === shade) continue;
      if (prev === Shade.Uncut) fresh++;
      s.cut[i] = shade;
      s.dirty.push(i);
    }
  }
  if (fresh) {
    s.cutCount += fresh;
    s.lastCutAt = now;
    if (s.startedAt === null) s.startedAt = now;
  }
  return fresh;
}

/**
 * Advance the mower toward a goal point (pointer control) or along a
 * velocity (keyboard control). Returns the events that happened.
 */
export function stepMower(
  s: GameState,
  dt: number,
  now: number,
  input: { goal?: { x: number; y: number } | null; vel?: { x: number; y: number } | null }
): GameEvent[] {
  const events: GameEvent[] = [];
  if (s.finishedAt !== null) return events;
  const m = s.mower;

  let dx = 0;
  let dy = 0;
  if (input.vel && (input.vel.x || input.vel.y)) {
    dx = input.vel.x * KEY_SPEED * dt;
    dy = input.vel.y * KEY_SPEED * dt;
  } else if (input.goal) {
    const gx = input.goal.x - m.x;
    const gy = input.goal.y - m.y;
    const dist = Math.hypot(gx, gy);
    const maxStep = MAX_SPEED * dt;
    if (dist > 0.02) {
      const k = Math.min(1, maxStep / dist);
      dx = gx * k;
      dy = gy * k;
    }
  }

  const moved = Math.hypot(dx, dy);
  m.speed = dt > 0 ? moved / dt : 0;
  if (moved < 1e-5) {
    s.inContact = false;
    return events;
  }

  // Walk the move in small steps so fast strokes still cut every cell
  // they cross and can't tunnel through a tree.
  const steps = Math.max(1, Math.ceil(moved / 0.2));
  const sx = dx / steps;
  const sy = dy / steps;
  let hit = false;
  let fresh = 0;
  for (let i = 0; i < steps; i++) {
    let nx = Math.min(s.cols - 0.05, Math.max(0.05, m.x + sx));
    let ny = Math.min(s.rows - 0.05, Math.max(0.05, m.y + sy));
    if (collides(s, nx, ny)) {
      hit = true;
      // Slide along whichever axis is still free.
      if (!collides(s, nx, m.y)) ny = m.y;
      else if (!collides(s, m.x, ny)) nx = m.x;
      else break;
    }
    const shade = shadeFor(nx - m.x, ny - m.y, m.shade);
    m.shade = shade;
    m.x = nx;
    m.y = ny;
    fresh += cutAround(s, m.x, m.y, shade, now);

    // Flower beds under the mower's center get trampled.
    const c = Math.floor(m.x);
    const r = Math.floor(m.y);
    if (kindAt(s, c, r) === Kind.Bed) {
      for (const f of s.flowers) {
        if (f.alive && f.c === c && f.r === r && Math.hypot(f.x - m.x, f.y - m.y) < 0.75) {
          f.alive = false;
          s.trampled++;
          events.push({ type: "trample", x: f.x, y: f.y });
        }
      }
    }
  }

  // Ease the heading toward the travel direction so the mower turns
  // smoothly instead of snapping.
  const want = Math.atan2(dy, dx);
  let diff = want - m.heading;
  diff = Math.atan2(Math.sin(diff), Math.cos(diff));
  m.heading += diff * Math.min(1, dt * 14);

  if (hit && !s.inContact) {
    s.bumps++;
    events.push({ type: "bump", x: m.x + Math.cos(m.heading) * 0.6, y: m.y + Math.sin(m.heading) * 0.6 });
  }
  s.inContact = hit;
  if (fresh) events.push({ type: "cut", count: fresh });

  if (s.cutCount >= s.lawnTotal && s.finishedAt === null) {
    s.finishedAt = now;
    events.push({ type: "finish" });
  }
  return events;
}

export function stepDogs(s: GameState, dt: number): GameEvent[] {
  const events: GameEvent[] = [];
  const m = s.mower;
  for (const d of s.dogs) {
    d.cooldown = Math.max(0, d.cooldown - dt);
    d.flee = Math.max(0, d.flee - dt);
    d.turn -= dt;
    if (d.flee <= 0 && d.turn <= 0) {
      // Wander: pick a new lazy heading every couple of seconds.
      const a = Math.atan2(d.vy, d.vx) + (Math.random() - 0.5) * 1.6;
      const sp = DOG_SPEED * (0.5 + Math.random() * 0.7);
      d.vx = Math.cos(a) * sp;
      d.vy = Math.sin(a) * sp;
      d.turn = 1.2 + Math.random() * 2;
    }
    const nx = d.x + d.vx * dt;
    const ny = d.y + d.vy * dt;
    const k = kindAt(s, Math.floor(nx), Math.floor(ny));
    if (k === -1 || isSolid(k) || k === Kind.Bed) {
      d.vx = -d.vx;
      d.vy = -d.vy;
    } else {
      d.x = nx;
      d.y = ny;
    }

    const dist = Math.hypot(d.x - m.x, d.y - m.y);
    if (dist < 1.05 && d.cooldown <= 0 && s.finishedAt === null && m.speed > 0.5) {
      s.dogBumps++;
      d.cooldown = 1.5;
      d.flee = 1;
      const away = Math.atan2(d.y - m.y, d.x - m.x);
      d.vx = Math.cos(away) * DOG_SPEED * 2.6;
      d.vy = Math.sin(away) * DOG_SPEED * 2.6;
      events.push({ type: "dog", x: d.x, y: d.y });
    }
  }
  return events;
}

export function accuracy(s: GameState) {
  if (s.level.target === "any") return 1;
  let total = 0;
  let match = 0;
  for (let i = 0; i < s.target.length; i++) {
    if (!s.target[i]) continue;
    total++;
    if (s.cut[i] === s.target[i]) match++;
  }
  return total ? match / total : 1;
}

export const ACCURACY_GOAL = 0.85;

export type Result = {
  ms: number;
  stars: 1 | 2 | 3;
  beatPar: boolean;
  clean: boolean;
  accuracy: number;
  mishaps: number;
};

export function scoreGame(s: GameState): Result {
  const ms = Math.max(0, (s.finishedAt ?? 0) - (s.startedAt ?? s.finishedAt ?? 0));
  const acc = accuracy(s);
  const mishaps = s.bumps + s.trampled + s.dogBumps;
  const beatPar = ms <= s.level.par * 1000;
  const clean = mishaps === 0 && acc >= ACCURACY_GOAL;
  return { ms, stars: (1 + (beatPar ? 1 : 0) + (clean ? 1 : 0)) as 1 | 2 | 3, beatPar, clean, accuracy: acc, mishaps };
}
