import { DECK_RADIUS, Kind, SUB, Shade, type GameState } from "./engine";

// Canvas drawing for the mowing game. Colors come from the site palette
// (read from CSS variables once per level) so the game matches the page.

export type Palette = {
  uncut: string[];
  light: string;
  lightEdge: string;
  dark: string;
  darkEdge: string;
  soil: string;
  roof: string;
  roofEdge: string;
  drive: string;
  driveJoint: string;
  mulch: string;
  mulchFleck: string;
  water: string;
  waterLight: string;
  deck: string;
  deckRim: string;
  body: string;
  wheel: string;
  steel: string;
  steelLight: string;
  clip: string[];
  leaf: string[];
};

export function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim() || "#4a7a45";
  return {
    uncut: [v("--grass-1"), v("--grass-2"), v("--grass-3"), v("--grass-4")],
    light: v("--stripe-light"),
    lightEdge: v("--stripe-light-edge"),
    dark: v("--stripe-dark"),
    darkEdge: v("--stripe-dark-edge"),
    soil: v("--soil"),
    roof: v("--forest-900"),
    roofEdge: v("--forest-950"),
    drive: v("--concrete"),
    driveJoint: v("--concrete-joint"),
    mulch: v("--mulch"),
    mulchFleck: v("--mulch-fleck"),
    water: v("--water"),
    waterLight: v("--water-light"),
    deck: v("--wheat-400"),
    deckRim: v("--wheat-500"),
    body: v("--forest-900"),
    wheel: v("--rubber"),
    steel: v("--steel"),
    steelLight: v("--steel-light"),
    clip: [v("--stripe-light"), v("--grass-4"), v("--moss-300")],
    leaf: [v("--forest-500"), v("--moss-300"), v("--wheat-400"), v("--ember")],
  };
}

export type Sprites = Partial<Record<"tulip" | "blossom" | "tree" | "evergreen" | "rock" | "dog", HTMLImageElement>>;

// Deterministic per-cell noise so the grass texture never shimmers.
function hash(i: number, salt = 0) {
  let x = (i * 374761393 + salt * 668265263) | 0;
  x = (x ^ (x >>> 13)) * 1274126177;
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

/** Draws one fine lawn cell into the lawn layer: tall grass or a mowed stripe.
 *  `cs` is the map cell size; fine cells are cs / SUB. */
export function drawCell(ctx: CanvasRenderingContext2D, s: GameState, i: number, mapCs: number, p: Palette, guide: boolean) {
  const cs = mapCs / SUB;
  const c = i % s.fcols;
  const r = Math.floor(i / s.fcols);
  const x = c * cs;
  const y = r * cs;
  const shade = s.cut[i] as Shade;
  // Slight overlap hides hairline seams between cells.
  ctx.clearRect(x, y, cs, cs);

  if (shade === Shade.Uncut) {
    // One even base color with a whisper of per-cell variation, so tall
    // grass reads as a field rather than a mosaic of tiles.
    ctx.fillStyle = p.uncut[0];
    ctx.fillRect(x, y, cs + 0.5, cs + 0.5);
    const v = hash(i, 97) - 0.5;
    ctx.fillStyle = v > 0 ? `rgba(200,240,150,${v * 0.1})` : `rgba(10,40,15,${-v * 0.12})`;
    ctx.fillRect(x, y, cs + 0.5, cs + 0.5);
    // Guide: a faint wash showing which way this cell should be cut.
    if (guide && s.target[i]) {
      ctx.fillStyle = s.target[i] === Shade.Light ? "rgba(255,255,240,0.13)" : "rgba(0,20,0,0.12)";
      ctx.fillRect(x, y, cs + 0.5, cs + 0.5);
    }
    // Tall blades.
    const blades = 3;
    ctx.lineCap = "round";
    for (let b = 0; b < blades; b++) {
      const bx = x + hash(i, b + 1) * cs;
      const by = y + cs * (0.55 + hash(i, b + 11) * 0.5);
      const h = cs * (0.9 + hash(i, b + 21) * 0.9);
      const lean = (hash(i, b + 31) - 0.5) * cs * 0.8;
      ctx.strokeStyle = hash(i, b + 41) > 0.5 ? "rgba(190,230,140,0.55)" : "rgba(20,60,25,0.45)";
      ctx.lineWidth = Math.max(1, cs * 0.16);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + lean * 0.3, by - h * 0.6, bx + lean, by - h);
      ctx.stroke();
    }
    return;
  }

  const light = shade === Shade.Light;
  ctx.fillStyle = light ? p.light : p.dark;
  ctx.fillRect(x, y, cs + 0.5, cs + 0.5);
  // Short, fine texture laid along the cut so stripes read as grass.
  ctx.strokeStyle = light ? p.lightEdge : p.darkEdge;
  ctx.lineWidth = Math.max(0.6, cs * 0.035);
  ctx.lineWidth = Math.max(0.6, cs * 0.08);
  for (let b = 0; b < 2; b++) {
    const bx = x + hash(i, b + 51) * cs;
    const by = y + hash(i, b + 61) * cs;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + cs * 0.1, by - cs * 0.4);
    ctx.stroke();
  }
}

export function drawLawnLayer(ctx: CanvasRenderingContext2D, s: GameState, cs: number, p: Palette, guide: boolean) {
  ctx.clearRect(0, 0, s.cols * cs, s.rows * cs);
  for (let i = 0; i < s.target.length; i++) {
    const c = Math.floor((i % s.fcols) / SUB);
    const r = Math.floor(Math.floor(i / s.fcols) / SUB);
    if (s.kind[r * s.cols + c] === Kind.Lawn) drawCell(ctx, s, i, cs, p, guide);
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Everything that never changes during a level: soil, roofs, drives, beds, water. */
export function drawStaticLayer(ctx: CanvasRenderingContext2D, s: GameState, cs: number, p: Palette, sprites: Sprites) {
  const W = s.cols * cs;
  const H = s.rows * cs;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = p.soil;
  ctx.fillRect(0, 0, W, H);

  for (let r = 0; r < s.rows; r++) {
    for (let c = 0; c < s.cols; c++) {
      const i = r * s.cols + c;
      const k = s.kind[i] as Kind;
      const x = c * cs;
      const y = r * cs;
      switch (k) {
        case Kind.House:
          ctx.fillStyle = p.roof;
          ctx.fillRect(x, y, cs + 0.5, cs + 0.5);
          // Shingle rows.
          ctx.strokeStyle = p.roofEdge;
          ctx.lineWidth = 1;
          for (let k2 = 1; k2 < 3; k2++) {
            ctx.beginPath();
            ctx.moveTo(x, y + (cs * k2) / 3);
            ctx.lineTo(x + cs, y + (cs * k2) / 3);
            ctx.stroke();
          }
          break;
        case Kind.Drive:
          ctx.fillStyle = p.drive;
          ctx.fillRect(x, y, cs + 0.5, cs + 0.5);
          if (r % 3 === 0) {
            ctx.fillStyle = p.driveJoint;
            ctx.fillRect(x, y, cs, 1);
          }
          break;
        case Kind.Bed:
          ctx.fillStyle = p.mulch;
          ctx.fillRect(x, y, cs + 0.5, cs + 0.5);
          ctx.fillStyle = p.mulchFleck;
          for (let f = 0; f < 5; f++) {
            ctx.fillRect(x + hash(i, f + 71) * cs, y + hash(i, f + 81) * cs, cs * 0.12, cs * 0.05);
          }
          break;
        case Kind.Pool: {
          const g = ctx.createLinearGradient(x, y, x + cs, y + cs);
          g.addColorStop(0, p.waterLight);
          g.addColorStop(1, p.water);
          ctx.fillStyle = g;
          ctx.fillRect(x, y, cs + 0.5, cs + 0.5);
          break;
        }
        default:
          break;
      }
    }
  }

  // House: a soft ridge line and drop shadow so the roof reads as a volume.
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = cs * 0.6;
  ctx.shadowOffsetY = cs * 0.2;
  for (let r = 0; r < s.rows; r++) {
    for (let c = 0; c < s.cols; c++) {
      if (s.kind[r * s.cols + c] === Kind.House && (r + 1 >= s.rows || s.kind[(r + 1) * s.cols + c] !== Kind.House)) {
        ctx.fillStyle = p.roofEdge;
        ctx.fillRect(c * cs, (r + 1) * cs - cs * 0.12, cs + 0.5, cs * 0.12);
      }
    }
  }
  ctx.restore();

  // Rocks and sprinkler heads sit on the ground layer.
  for (let r = 0; r < s.rows; r++) {
    for (let c = 0; c < s.cols; c++) {
      const k = s.kind[r * s.cols + c] as Kind;
      const cx = (c + 0.5) * cs;
      const cy = (r + 0.5) * cs;
      if (k === Kind.Rock) {
        ctx.fillStyle = p.uncut[0];
        ctx.fillRect(c * cs, r * cs, cs + 0.5, cs + 0.5);
        if (sprites.rock) ctx.drawImage(sprites.rock, cx - cs * 0.6, cy - cs * 0.6, cs * 1.2, cs * 1.2);
      } else if (k === Kind.Sprinkler || k === Kind.Tree || k === Kind.Evergreen) {
        ctx.fillStyle = p.uncut[0];
        ctx.fillRect(c * cs, r * cs, cs + 0.5, cs + 0.5);
        if (k === Kind.Sprinkler) {
          ctx.fillStyle = p.steel;
          ctx.beginPath();
          ctx.arc(cx, cy, cs * 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = p.steelLight;
          ctx.beginPath();
          ctx.arc(cx, cy, cs * 0.09, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
}

export function drawFlowers(ctx: CanvasRenderingContext2D, s: GameState, cs: number, sprites: Sprites) {
  for (const f of s.flowers) {
    if (!f.alive) continue;
    const img = f.variant === 0 ? sprites.tulip : sprites.blossom;
    if (!img) continue;
    const size = cs * 0.95 * f.scale;
    ctx.drawImage(img, f.x * cs - size / 2, f.y * cs - size / 2, size, size);
  }
}

export function drawCanopies(ctx: CanvasRenderingContext2D, s: GameState, cs: number, sprites: Sprites) {
  const m = s.mower;
  for (let r = 0; r < s.rows; r++) {
    for (let c = 0; c < s.cols; c++) {
      const k = s.kind[r * s.cols + c];
      if (k !== Kind.Tree && k !== Kind.Evergreen) continue;
      const img = k === Kind.Tree ? sprites.tree : sprites.evergreen;
      if (!img) continue;
      const size = cs * (k === Kind.Tree ? 2.8 : 2.2);
      const cx = (c + 0.5) * cs;
      const cy = (r + 0.5) * cs;
      // Fade the canopy when the mower is underneath so it stays visible.
      const near = Math.hypot(m.x - (c + 0.5), m.y - (r + 0.2)) < 1.6;
      ctx.globalAlpha = near ? 0.45 : 1;
      ctx.drawImage(img, cx - size / 2, cy - size * 0.72, size, size);
      ctx.globalAlpha = 1;
    }
  }
}

export function drawDogs(ctx: CanvasRenderingContext2D, s: GameState, cs: number, sprites: Sprites, t: number) {
  if (!sprites.dog) return;
  for (const d of s.dogs) {
    const size = cs * 1.7;
    const bob = Math.sin(t * 0.012 + d.x) * cs * 0.05;
    ctx.save();
    ctx.translate(d.x * cs, d.y * cs + bob);
    if (d.vx < 0) ctx.scale(-1, 1);
    ctx.drawImage(sprites.dog, -size / 2, -size / 2, size, size);
    ctx.restore();
  }
}

/** Top-down push mower: deck, engine, four wheels, and the handle behind. */
export function drawMower(ctx: CanvasRenderingContext2D, s: GameState, cs: number, p: Palette, t: number) {
  const m = s.mower;
  const deckW = DECK_RADIUS * 2 * cs * 0.92;
  const deckL = deckW * 0.82;
  ctx.save();
  ctx.translate(m.x * cs, m.y * cs);
  ctx.rotate(m.heading);
  // Engine rumble while moving.
  if (m.speed > 0.3) ctx.translate(Math.sin(t * 0.09) * cs * 0.015, 0);

  // Shadow.
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  roundRect(ctx, -deckL / 2 + cs * 0.06, -deckW / 2 + cs * 0.08, deckL, deckW, deckW * 0.28);
  ctx.fill();

  // Handle behind the deck.
  ctx.strokeStyle = p.body;
  ctx.lineWidth = Math.max(2, cs * 0.1);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-deckL * 0.35, -deckW * 0.3);
  ctx.lineTo(-deckL * 1.05, -deckW * 0.34);
  ctx.moveTo(-deckL * 0.35, deckW * 0.3);
  ctx.lineTo(-deckL * 1.05, deckW * 0.34);
  ctx.moveTo(-deckL * 1.05, -deckW * 0.38);
  ctx.lineTo(-deckL * 1.05, deckW * 0.38);
  ctx.stroke();

  // Wheels.
  ctx.fillStyle = p.wheel;
  const wl = deckL * 0.26;
  const ww = deckW * 0.14;
  for (const [wx, wy] of [
    [deckL * 0.28, -deckW / 2],
    [deckL * 0.28, deckW / 2],
    [-deckL * 0.3, -deckW / 2],
    [-deckL * 0.3, deckW / 2],
  ]) {
    roundRect(ctx, wx - wl / 2, wy - ww / 2, wl, ww, ww / 2);
    ctx.fill();
  }

  // Deck with a lighter top face and a darker rim.
  ctx.fillStyle = p.deckRim;
  roundRect(ctx, -deckL / 2, -deckW / 2, deckL, deckW, deckW * 0.28);
  ctx.fill();
  const g = ctx.createLinearGradient(0, -deckW / 2, 0, deckW / 2);
  g.addColorStop(0, "rgba(255,255,255,0.45)");
  g.addColorStop(0.5, "rgba(255,255,255,0)");
  ctx.fillStyle = p.deck;
  roundRect(ctx, -deckL / 2 + 2, -deckW / 2 + 2, deckL - 4, deckW - 4, deckW * 0.24);
  ctx.fill();
  ctx.fillStyle = g;
  ctx.fill();

  // Engine block and a spinning blade hint.
  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.arc(0, 0, deckW * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = Math.max(1, cs * 0.05);
  ctx.beginPath();
  const spin = t * 0.04;
  ctx.moveTo(Math.cos(spin) * deckW * 0.14, Math.sin(spin) * deckW * 0.14);
  ctx.lineTo(-Math.cos(spin) * deckW * 0.14, -Math.sin(spin) * deckW * 0.14);
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- particles

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  age: number;
  size: number;
  rot: number;
  spin: number;
  color: string;
  leaf: boolean;
};

export function spawnClippings(list: Particle[], s: GameState, p: Palette, count: number) {
  const m = s.mower;
  for (let i = 0; i < count; i++) {
    // Clippings shoot out the side discharge, to the mower's right.
    const side = m.heading + Math.PI / 2 + (Math.random() - 0.5) * 0.9;
    const sp = 2 + Math.random() * 3;
    list.push({
      x: m.x + Math.cos(side) * 0.6,
      y: m.y + Math.sin(side) * 0.6,
      vx: Math.cos(side) * sp,
      vy: Math.sin(side) * sp,
      life: 350 + Math.random() * 250,
      age: 0,
      size: 0.08 + Math.random() * 0.07,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 12,
      color: p.clip[Math.floor(Math.random() * p.clip.length)],
      leaf: false,
    });
  }
  if (list.length > 220) list.splice(0, list.length - 220);
}

export function spawnLeafBurst(list: Particle[], s: GameState, p: Palette) {
  for (let i = 0; i < 70; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 3 + Math.random() * 7;
    list.push({
      x: s.cols / 2 + (Math.random() - 0.5) * 2,
      y: s.rows / 2 + (Math.random() - 0.5) * 2,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 3,
      life: 1400 + Math.random() * 900,
      age: 0,
      size: 0.22 + Math.random() * 0.18,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 6,
      color: p.leaf[Math.floor(Math.random() * p.leaf.length)],
      leaf: true,
    });
  }
}

export function stepParticles(list: Particle[], dt: number) {
  for (let i = list.length - 1; i >= 0; i--) {
    const q = list[i];
    q.age += dt * 1000;
    if (q.age >= q.life) {
      list.splice(i, 1);
      continue;
    }
    const drag = q.leaf ? 0.97 : 0.9;
    q.vx *= drag;
    q.vy = q.vy * drag + (q.leaf ? 6 * dt : 0);
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.rot += q.spin * dt;
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D, list: Particle[], cs: number) {
  for (const q of list) {
    const t = q.age / q.life;
    ctx.globalAlpha = Math.max(0, 1 - t * t);
    ctx.save();
    ctx.translate(q.x * cs, q.y * cs);
    ctx.rotate(q.rot);
    ctx.fillStyle = q.color;
    const s = q.size * cs;
    if (q.leaf) {
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * 0.75, -s * 0.2, 0, s);
      ctx.quadraticCurveTo(-s * 0.75, -s * 0.2, 0, -s);
      ctx.fill();
    } else {
      ctx.fillRect(-s / 2, -s * 1.4, s, s * 2.8);
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

/** Pulsing rings on the last few uncut cells, so nobody hunts for them. */
export function drawMissedSpots(ctx: CanvasRenderingContext2D, s: GameState, cs: number, t: number) {
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.006);
  ctx.strokeStyle = `rgba(255, 244, 200, ${0.35 + pulse * 0.5})`;
  ctx.lineWidth = Math.max(1.5, cs * 0.08);
  const f = cs / SUB;
  for (let i = 0; i < s.cut.length; i++) {
    if (s.cut[i] !== Shade.Uncut) continue;
    const fc = i % s.fcols;
    const fr = Math.floor(i / s.fcols);
    if (s.kind[Math.floor(fr / SUB) * s.cols + Math.floor(fc / SUB)] !== Kind.Lawn) continue;
    ctx.beginPath();
    ctx.arc((fc + 0.5) * f, (fr + 0.5) * f, f * (0.6 + pulse * 0.5), 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function drawBumpRing(ctx: CanvasRenderingContext2D, x: number, y: number, cs: number, progress: number) {
  ctx.strokeStyle = `rgba(255,255,255,${0.8 * (1 - progress)})`;
  ctx.lineWidth = Math.max(2, cs * 0.1);
  ctx.beginPath();
  ctx.arc(x * cs, y * cs, cs * (0.3 + progress * 0.9), 0, Math.PI * 2);
  ctx.stroke();
}
