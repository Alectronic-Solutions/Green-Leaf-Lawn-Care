"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";

// Small leaves that drop from behind the cursor and drift down, swaying,
// as they fade. One fixed canvas for the whole page; the animation loop only
// runs while leaves are alive, so an idle cursor costs nothing.
//
// Off on touch screens, for reduced motion, and over form fields and the
// mowing game (where it would get in the way).

type Leaf = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  spin: number;
  size: number;
  age: number;
  life: number;
  sway: number;
  phase: number;
  color: string;
};

const SPAWN_EVERY_PX = 18;
const MAX_LEAVES = 40;
const QUIET_SELECTOR = "input, textarea, select, [role='combobox'], [role='listbox'], [data-no-leaves]";

function readPalette() {
  const css = getComputedStyle(document.documentElement);
  const pick = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  // Mostly greens with the occasional wheat or ember leaf.
  return [
    pick("--forest-500", "#4c8a4a"),
    pick("--forest-500", "#4c8a4a"),
    pick("--moss-300", "#a8cf7e"),
    pick("--moss-300", "#a8cf7e"),
    pick("--forest-700", "#2f6b3a"),
    pick("--wheat-400", "#e9c46a"),
    pick("--ember", "#c7773e"),
  ];
}

function drawLeaf(ctx: CanvasRenderingContext2D, leaf: Leaf, alpha: number) {
  const s = leaf.size;
  ctx.save();
  ctx.translate(leaf.x, leaf.y);
  ctx.rotate(leaf.rot);
  ctx.globalAlpha = alpha;

  // Blade: two quadratic curves meeting at the tip and the stem.
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(s * 0.75, -s * 0.2, 0, s);
  ctx.quadraticCurveTo(-s * 0.75, -s * 0.2, 0, -s);
  ctx.fillStyle = leaf.color;
  ctx.fill();

  // Midrib and a short stem, drawn lighter so the leaf reads as 3D.
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.85);
  ctx.lineTo(0, s * 1.25);
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = Math.max(0.6, s * 0.09);
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.restore();
}

export function LeafTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!site.effects.leafTrail) return;
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const palette = readPalette();
    const leaves: Leaf[] = [];
    let raf = 0;
    let running = false;
    let last = performance.now();
    let travel = 0;
    let prev: { x: number; y: number } | null = null;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (x: number, y: number, dx: number, dy: number) => {
      if (leaves.length >= MAX_LEAVES) leaves.shift();
      leaves.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        // A little of the cursor's momentum, then gravity takes over.
        vx: -dx * 0.02 + (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.4,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.06,
        size: 4 + Math.random() * 4,
        age: 0,
        life: 1200 + Math.random() * 600,
        sway: 0.6 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const k = dt / 16.67;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];
        l.age += dt;
        if (l.age >= l.life) {
          leaves.splice(i, 1);
          continue;
        }
        const t = l.age / l.life;
        l.vy = Math.min(1.4, l.vy + 0.035 * k);
        l.vx *= 0.985;
        l.x += (l.vx + Math.sin(l.phase + l.age * 0.004) * l.sway * 0.5) * k;
        l.y += l.vy * k;
        l.rot += (l.spin + Math.cos(l.phase + l.age * 0.004) * 0.02) * k;
        // Fade in fast, hold, then fade out over the last 40% of life.
        const alpha = Math.min(1, t * 8) * (t > 0.6 ? 1 - (t - 0.6) / 0.4 : 1) * 0.9;
        drawLeaf(ctx, l, alpha);
      }

      if (leaves.length) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const target = e.target as Element | null;
      if (target?.closest?.(QUIET_SELECTOR)) {
        prev = null;
        return;
      }
      if (prev) {
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;
        travel += Math.hypot(dx, dy);
        if (travel >= SPAWN_EVERY_PX) {
          travel = 0;
          spawn(e.clientX, e.clientY, dx, dy);
          start();
        }
      }
      prev = { x: e.clientX, y: e.clientY };
    };

    const onLeave = () => {
      prev = null;
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
        leaves.length = 0;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-70"
    />
  );
}
