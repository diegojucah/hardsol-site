#!/usr/bin/env node
/**
 * Gerador do FILME SINTÉTICO de teste (método Cinematic Scroll).
 *
 * Renderiza uma única tomada contínua — "amanhecer solar" — como uma sequência
 * de frames PNG. Serve para validar todo o motor de scroll antes de trocar pelos
 * clipes reais de vídeo IA (basta substituir frames/desktop e frames/mobile).
 *
 * Uso:
 *   node tools/make_synthetic_film.js --frames 300 --w 1600 --h 900 --out /tmp/film_png
 *
 * Sem dependências nativas: usa apenas `pngjs` (presente em tools/node_modules).
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

function parseArgs(argv) {
  const out = { frames: 300, w: 1600, h: 900, out: "/tmp/film_png" };
  for (let i = 2; i < argv.length; i += 2) {
    const k = argv[i].replace(/^--/, "");
    const v = argv[i + 1];
    if (k === "frames" || k === "w" || k === "h") out[k] = parseInt(v, 10);
    else if (k === "out") out[k] = v;
  }
  return out;
}

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => [
  lerp(c1[0], c2[0], t),
  lerp(c1[1], c2[1], t),
  lerp(c1[2], c2[2], t),
];
const smooth = (t) => t * t * (3 - 2 * t);

// PRNG determinístico (mulberry32) — grain/partículas idênticos entre execuções.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Paleta da marca HardSol (âmbar solar + teal profundo).
const SKY = {
  nightTop: [6, 10, 20],
  nightBot: [16, 28, 46],
  dawnTop: [40, 52, 92],
  dawnBot: [250, 150, 70],
  dayTop: [58, 112, 152],
  dayBot: [255, 206, 150],
};
const GROUND_DARK = [8, 12, 20];
const GROUND_LIGHT = [34, 46, 62];
const SUN_CORE = [255, 244, 214];
const SUN_GLOW = [255, 170, 70];

const args = parseArgs(process.argv);
const { frames: N, w: W, h: H } = args;
const OUT = args.out;

fs.mkdirSync(OUT, { recursive: true });

const ROW = W * 4;
const horizonBase = Math.round(H * 0.66);

// Camadas de "painéis solares" em perspectiva (linhas que se aproximam).
const panelRows = [];
for (let r = 0; r < 6; r++) {
  const depth = r / 5; // 0 = longe, 1 = perto
  panelRows.push({
    y: horizonBase + Math.round(Math.pow(depth, 1.35) * (H - horizonBase) * 0.95),
    pw: Math.round(lerp(58, 210, depth)), // largura do painel
    ph: Math.round(lerp(10, 46, depth)), // altura
    gap: Math.round(lerp(10, 40, depth)),
    skew: lerp(6, 34, depth), // inclinação lateral (perspectiva)
  });
}

const rand = mulberry32(20260415);
const GRAIN = new Float32Array(W * H);
for (let i = 0; i < GRAIN.length; i++) GRAIN[i] = (rand() - 0.5) * 3.5;

const buf = Buffer.allocUnsafe(W * H * 4);
const png = new PNG({ width: W, height: H });

function renderFrame(fi) {
  const t = N === 1 ? 1 : fi / (N - 1);
  const e = smooth(clamp(t, 0, 1));

  // Posição/ascensão do sol; horizonte desce de leve (dolly "para frente").
  const sunX = W * (0.42 + 0.12 * e);
  const sunY = lerp(horizonBase + 40, H * 0.26, e);
  const sunR = lerp(46, 86, e);
  const glowR = sunR * lerp(4.5, 6.5, e);
  const horizon = horizonBase + Math.round(lerp(0, H * 0.03, e));

  // Céu: noite -> aurora -> dia.
  const top = t < 0.5 ? mix(SKY.nightTop, SKY.dawnTop, smooth(t / 0.5)) : mix(SKY.dawnTop, SKY.dayTop, smooth((t - 0.5) / 0.5));
  const bot = t < 0.5 ? mix(SKY.nightBot, SKY.dawnBot, smooth(t / 0.5)) : mix(SKY.dawnBot, SKY.dayBot, smooth((t - 0.5) / 0.5));

  const ground = mix(GROUND_DARK, GROUND_LIGHT, e);

  for (let y = 0; y < H; y++) {
    let base;
    if (y < horizon) {
      const v = y / horizon;
      base = [lerp(top[0], bot[0], v), lerp(top[1], bot[1], v), lerp(top[2], bot[2], v)];
    } else {
      const v = (y - horizon) / Math.max(1, H - horizon);
      base = [lerp(ground[0], ground[0] * 0.6, v), lerp(ground[1], ground[1] * 0.6, v), lerp(ground[2], ground[2] * 0.6, v)];
    }
    const o = y * ROW;
    for (let x = 0; x < W; x++) {
      const idx = o + x * 4;
      const g = GRAIN[y * W + x];
      buf[idx] = clamp(base[0] + g, 0, 255);
      buf[idx + 1] = clamp(base[1] + g, 0, 255);
      buf[idx + 2] = clamp(base[2] + g, 0, 255);
      buf[idx + 3] = 255;
    }
  }

  // Glow do sol (aditivo) — bounding box apenas.
  const gx0 = Math.max(0, Math.floor(sunX - glowR));
  const gx1 = Math.min(W - 1, Math.ceil(sunX + glowR));
  const gy0 = Math.max(0, Math.floor(sunY - glowR));
  const gy1 = Math.min(H - 1, Math.ceil(sunY + glowR));
  for (let y = gy0; y <= gy1; y++) {
    const dy = y - sunY;
    const o = y * ROW;
    for (let x = gx0; x <= gx1; x++) {
      const dx = x - sunX;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > glowR) continue;
      const idx = o + x * 4;
      // halo suave + disco central
      const halo = Math.pow(1 - d / glowR, 2.4) * (0.55 + 0.45 * e);
      const core = d < sunR ? Math.pow(1 - d / sunR, 0.7) : 0;
      const gi = clamp(halo * 0.9 + core, 0, 1.6);
      buf[idx] = clamp(buf[idx] + SUN_GLOW[0] * halo + SUN_CORE[0] * core, 0, 255);
      buf[idx + 1] = clamp(buf[idx + 1] + SUN_GLOW[1] * halo + SUN_CORE[1] * core, 0, 255);
      buf[idx + 2] = clamp(buf[idx + 2] + SUN_GLOW[2] * halo + SUN_CORE[2] * core, 0, 255);
      void gi;
    }
  }

  // Linhas de "energia" fluindo sobre os painéis (a luz vira corrente).
  const energy = Math.pow(clamp((t - 0.28) / 0.72, 0, 1), 0.8);
  for (let r = 0; r < panelRows.length; r++) {
    const row = panelRows[r];
    const lit = clamp(energy * 1.25 - r * 0.08, 0, 1);
    const yTop = row.y - row.ph;
    for (let y = yTop; y <= row.y; y++) {
      if (y < 0 || y >= H) continue;
      const o = y * ROW;
      for (let x = 0; x < W; x++) {
        // painel em perspectiva: x deslocado conforme profundidade/row
        const local = ((x + row.skew * (y - yTop)) % (row.pw + row.gap) + (row.pw + row.gap)) % (row.pw + row.gap);
        const inPanel = local < row.pw;
        const idx = o + x * 4;
        if (!inPanel) continue;
        // escurece o painel e adiciona trilho/brilho conforme acende
        const v = (y - yTop) / row.ph;
        const shade = 0.5 - 0.25 * v;
        buf[idx] = clamp(buf[idx] * shade, 0, 255);
        buf[idx + 1] = clamp(buf[idx + 1] * shade, 0, 255);
        buf[idx + 2] = clamp(buf[idx + 2] * shade + 18 * lit, 0, 255);
      }
    }
    // trilho de luz correndo ao longo do topo do painel
    const beamY = yTop;
    const speed = 0.6 + r * 0.12;
    const center = ((t * speed * 2.2 + r * 0.21) % 1.2) - 0.1;
    const beamW = 0.06;
    for (let y = beamY - 2; y <= beamY + 2; y++) {
      if (y < 0 || y >= H) continue;
      const o = y * ROW;
      for (let x = 0; x < W; x++) {
        const rel = x / W;
        const d = Math.abs(rel - center);
        if (d > beamW) continue;
        const a = (1 - d / beamW) * lit;
        const idx = o + x * 4;
        buf[idx] = clamp(buf[idx] + 255 * a, 0, 255);
        buf[idx + 1] = clamp(buf[idx + 1] + 205 * a, 0, 255);
        buf[idx + 2] = clamp(buf[idx + 2] + 120 * a, 0, 255);
      }
    }
  }

  // Vinheta cinematográfica.
  const cx = W / 2, cy = H / 2;
  const maxD = Math.sqrt(cx * cx + cy * cy);
  for (let y = 0; y < H; y++) {
    const dy = y - cy;
    const o = y * ROW;
    for (let x = 0; x < W; x++) {
      const dx = x - cx;
      const d = Math.sqrt(dx * dx + dy * dy) / maxD;
      const vg = 1 - 0.32 * d * d;
      const idx = o + x * 4;
      buf[idx] *= vg;
      buf[idx + 1] *= vg;
      buf[idx + 2] *= vg;
    }
  }
}

const t0 = Date.now();
for (let i = 0; i < N; i++) {
  renderFrame(i);
  png.data = buf;
  const name = "frame_" + String(i + 1).padStart(4, "0") + ".png";
  fs.writeFileSync(path.join(OUT, name), PNG.sync.write(png));
  if (i % 25 === 0 || i === N - 1) {
    process.stdout.write(`  frame ${i + 1}/${N}\n`);
  }
}
const secs = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`OK  ${N} frames em ${OUT} (${W}x${H}) — ${secs}s`);
