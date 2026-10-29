/* ==========================================================================
   Prancha viva — desenho técnico que se constrói com o scroll.
   Sem vídeo, sem foto: só geometria, cota e memorial. ~0 KB de asset.
   ========================================================================== */
(function () {
  "use strict";

  var stage = document.querySelector(".stage");
  var canvas = document.getElementById("board");
  if (!stage || !canvas) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx = canvas.getContext("2d");
  var caps = Array.prototype.slice.call(document.querySelectorAll(".cap"));
  var pct = document.querySelector("[data-pct]");
  var bar = document.querySelector(".bar i");
  var cue = document.querySelector(".cue");

  var W = 0, H = 0, dpr = 1;
  var lastP = -1;
  var ticking = false;

  var INK = "23,24,26";
  var GREEN = "0,167,79";
  var MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  /* janela normalizada de um estágio */
  function win(p, t0, t1) { return clamp((p - t0) / (t1 - t0), 0, 1); }

  function line(x1, y1, x2, y2, alpha, color, w) {
    if (alpha <= 0.001) return;
    ctx.strokeStyle = "rgba(" + (color || INK) + "," + alpha + ")";
    ctx.lineWidth = w || 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function label(text, x, y, alpha, color, size, align) {
    if (alpha <= 0.001) return;
    ctx.fillStyle = "rgba(" + (color || INK) + "," + alpha + ")";
    ctx.font = (size || 10) + "px " + MONO;
    ctx.textAlign = align || "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }

  function arrow(x, y, dx, dy, alpha) {
    if (alpha <= 0.001) return;
    ctx.strokeStyle = "rgba(" + INK + "," + alpha + ")";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lastP = -1;
  }

  function draw(p) {
    if (!W || !H) return;
    ctx.clearRect(0, 0, W, H);

    /* geometria */
    var mx = W * 0.10;
    var bx0 = W * 0.20, bx1 = W * 0.80;
    var top = H * 0.26, base = H * 0.80;
    var bh = base - top;
    var cols = 5;
    var floors = 4;

    /* ---- 1. grid de papel + eixos ---- */
    var g = win(p, 0, 0.14);
    var step = Math.max(28, W / 34);
    ctx.save();
    for (var x = mx; x < W - mx * 0.4; x += step) line(x, H * 0.10, x, base + H * 0.07, 0.055 * g, INK, 0.5);
    for (var y = H * 0.14; y < base + H * 0.07; y += step) line(mx * 0.6, y, W - mx * 0.35, y, 0.055 * g, INK, 0.5);
    ctx.restore();

    /* eixos A..E e 1..4 */
    for (var i = 0; i < cols; i++) {
      var ax = lerp(bx0, bx1, i / (cols - 1));
      var a = win(p, 0.02 + i * 0.012, 0.16 + i * 0.012);
      ctx.beginPath();
      ctx.arc(ax, base + H * 0.055, 11, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(" + INK + "," + 0.35 * a + ")";
      ctx.lineWidth = 1;
      ctx.stroke();
      label("ABCDE"[i], ax, base + H * 0.055 + 0.5, 0.7 * a, INK, 9, "center");
      line(ax, top - H * 0.02, ax, base + H * 0.035, 0.10 * a, INK, 0.5);
    }

    /* ---- 2. terreno + hachura ---- */
    var gr = win(p, 0.06, 0.24);
    line(mx * 0.6, base, W - mx * 0.35, base, 0.55 * gr, INK, 1.2);
    for (var hx = mx * 0.6; hx < W - mx * 0.35; hx += 12) {
      line(hx, base, hx - 8, base + 9, 0.28 * gr, INK, 0.7);
    }

    /* ---- 3. pilares (sobem) ---- */
    var cp = win(p, 0.20, 0.48);
    for (var c = 0; c < cols; c++) {
      var cx = lerp(bx0, bx1, c / (cols - 1));
      var h = bh * win(cp, c * 0.08, 0.55 + c * 0.075);
      line(cx, base, cx, base - h, 0.75, INK, 1.5);
      line(cx - 4, base, cx - 4, base - h, 0.16, INK, 0.6);
      line(cx + 4, base, cx + 4, base - h, 0.16, INK, 0.6);
    }

    /* ---- 4. lajes ---- */
    var sp = win(p, 0.44, 0.66);
    for (var f = 1; f <= floors; f++) {
      var fy = base - (bh * f) / floors;
      var w = bx0 + (bx1 - bx0) * win(sp, (f - 1) * 0.12, 0.55 + (f - 1) * 0.1);
      line(bx0, fy, w, fy, 0.8, INK, 2);
      line(bx0, fy + 5, w, fy + 5, 0.2, INK, 0.7);
      label(f + "P", bx0 - 10, fy, 0.5 * sp, INK, 8, "right");
    }

    /* ---- 5. cobertura + fachada ---- */
    var rf = win(p, 0.62, 0.82);
    var roofY = top + 6;
    line(bx0, base - bh, lerp(bx0, bx1, rf * 1.0), base - bh, 0.85, INK, 2);
    if (rf > 0.45) {
      var k = win(p, 0.7, 0.86);
      line(bx0, base - bh, bx0 - 18, base - bh + 26, 0.5 * k, INK, 1.4);
      line(bx1, base - bh, bx1 + 18, base - bh + 26, 0.5 * k, INK, 1.4);
      for (var fxs = bx0 + 14; fxs < bx1; fxs += 26) {
        line(fxs, base - bh + 8, fxs, base - 8, 0.10 * k, INK, 0.6);
      }
    }
    /* faixa verde: a última laje executada */
    if (rf > 0.2) {
      ctx.strokeStyle = "rgba(" + GREEN + "," + (0.9 * win(rf, 0.2, 0.8)) + ")";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bx0, base - bh);
      ctx.lineTo(lerp(bx0, bx1, win(rf, 0.2, 1)), base - bh);
      ctx.stroke();
    }

    /* ---- 6. cotas ---- */
    var dm = win(p, 0.78, 0.94);
    /* largura */
    var cy = base - bh - H * 0.055;
    line(bx0, cy, lerp(bx0, bx1, dm), cy, 0.6 * dm, INK, 1);
    arrow(bx0, cy, 7, 0, 0.6 * dm);
    arrow(bx0, cy, -7, 0, 0.6 * dm);
    line(bx0, base - bh - 8, bx0, cy, 0.3 * dm, INK, 0.6);
    line(bx1, base - bh - 8, bx1, cy, 0.3 * dm, INK, 0.6);
    if (dm > 0.6) label("12,40 m", (bx0 + bx1) / 2, cy - 9, win(dm, 0.6, 1), INK, 10, "center");
    /* altura */
    var cx2 = bx0 - H * 0.075;
    line(cx2, base, cx2, lerp(base, base - bh, dm), 0.6 * dm, INK, 1);
    arrow(cx2, base, 0, 7, 0.6 * dm);
    arrow(cx2, base, 0, -7, 0.6 * dm);
    line(bx0 - 8, base, cx2, base, 0.3 * dm, INK, 0.6);
    line(bx0 - 8, base - bh, cx2, base - bh, 0.3 * dm, INK, 0.6);
    if (dm > 0.6) {
      ctx.save();
      ctx.translate(cx2 - 10, (base + base - bh) / 2);
      ctx.rotate(-Math.PI / 2);
      label("9,60 m", 0, 0, win(dm, 0.6, 1), INK, 10, "center");
      ctx.restore();
    }

    /* ---- 7. carimbo (title block) ---- */
    var tb = win(p, 0.88, 1);
    if (tb > 0) {
      var tw = 196, th = 62, tx = W - mx * 0.35 - tw, ty = base + H * 0.03;
      ctx.strokeStyle = "rgba(" + INK + "," + 0.5 * tb + ")";
      ctx.lineWidth = 1;
      ctx.strokeRect(tx, ty, tw, th);
      line(tx, ty + 20, tx + tw, ty + 20, 0.4 * tb, INK, 0.8);
      line(tx + 92, ty + 20, tx + 92, ty + th, 0.4 * tb, INK, 0.8);
      label("L2 CONSTRUTORA", tx + 9, ty + 10, 0.8 * tb, INK, 9);
      label("PRANCHA 01", tx + 9, ty + 32, 0.55 * tb, INK, 8);
      label("IMPLANTAÇÃO", tx + 9, ty + 46, 0.55 * tb, INK, 8);
      label("ESC 1:100", tx + 101, ty + 32, 0.55 * tb, GREEN, 8);
      label("2021", tx + 101, ty + 46, 0.55 * tb, INK, 8);
    }

    /* ---- 8. linha de varredura ---- */
    if (p > 0.02 && p < 0.995) {
      var sx = lerp(mx * 0.6, W - mx * 0.35, p);
      var grd = ctx.createLinearGradient(sx - 40, 0, sx + 2, 0);
      grd.addColorStop(0, "rgba(" + GREEN + ",0)");
      grd.addColorStop(1, "rgba(" + GREEN + ",0.20)");
      ctx.fillStyle = grd;
      ctx.fillRect(sx - 40, H * 0.12, 42, base - H * 0.12 + H * 0.06);
      line(sx, H * 0.12, sx, base + H * 0.06, 0.5, GREEN, 1);
      ctx.fillStyle = "rgba(" + GREEN + ",0.55)";
      ctx.fillRect(sx - 1.5, H * 0.12, 3, 3);
    }
  }

  function captions(p) {
    for (var i = 0; i < caps.length; i++) {
      var c = caps[i];
      var from = parseFloat(c.getAttribute("data-from")) || 0;
      var to = parseFloat(c.getAttribute("data-to")) || 1;
      c.classList.toggle("on", p >= from && p < to);
    }
  }

  function update() {
    ticking = false;
    var r = stage.getBoundingClientRect();
    var scrollable = stage.offsetHeight - window.innerHeight;
    var p = clamp(-r.top / (scrollable > 0 ? scrollable : 1), 0, 1);
    if (Math.abs(p - lastP) < 0.0008) return;
    lastP = p;

    draw(p);
    captions(p);
    if (pct) pct.textContent = Math.round(p * 100) + "%";
    if (bar) bar.style.width = (p * 100).toFixed(1) + "%";
    if (cue) cue.classList.toggle("off", p > 0.03);
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  resize();
  window.addEventListener("resize", function () { resize(); update(); });
  window.addEventListener("scroll", onScroll, { passive: true });

  if (reduce) {
    /* estado final, estático */
    draw(1);
    caps.forEach(function (c, i) { c.classList.toggle("on", i === caps.length - 1); });
    if (pct) pct.textContent = "100%";
    if (bar) bar.style.width = "100%";
    if (cue) cue.classList.add("off");
  } else {
    update();
  }
})();
