/* ==========================================================================
   Cinematic Scroll — motor do filme.
   O vídeo nunca é "tocado": o scroll escolhe o frame e desenha no <canvas>.
   Sem suavização dupla: apenas Lenis (smooth scroll) + listener de scroll rAF.
   ========================================================================== */
(function () {
  "use strict";

  var section = document.querySelector(".scroll-film");
  if (!section) return;

  var reduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return; // CSS mostra o .film-fallback

  var canvas = section.querySelector("#film");
  var ctx = canvas && canvas.getContext("2d", { alpha: false });
  if (!canvas || !ctx) return;

  var count = parseInt(section.getAttribute("data-frame-count"), 10) || 240;
  var ext = section.getAttribute("data-frame-ext") || "webp";
  var dirDesktop = section.getAttribute("data-frames-desktop") || "frames/desktop";
  var dirMobile = section.getAttribute("data-frames-mobile") || "frames/mobile";

  var captions = Array.prototype.slice.call(section.querySelectorAll(".film-caption"));
  var progressBar = document.querySelector(".film-progress i");
  var hint = document.querySelector(".scroll-hint");
  var preloader = document.querySelector(".preloader");
  var preBar = preloader && preloader.querySelector(".preloader__bar i");
  var prePct = preloader && preloader.querySelector(".preloader__pct");

  var isMobile = window.matchMedia("(max-width: 768px)").matches;
  var loader = new window.FrameLoader({
    count: count,
    dir: isMobile ? dirMobile : dirDesktop,
    ext: ext,
    concurrency: isMobile ? 4 : 8,
    onProgress: function (p) {
      if (preBar) preBar.style.width = Math.round(p * 100) + "%";
      if (prePct) prePct.textContent = Math.round(p * 100) + "%";
    },
    onReady: function () {
      if (preBar) preBar.style.width = "100%";
      if (preloader) preloader.classList.add("is-done");
      requestAnimationFrame(update);
    },
  });

  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var lastIndex = -1;

  function resize() {
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    lastIndex = -1;
  }

  function draw(img) {
    var cw = canvas.width;
    var ch = canvas.height;
    if (!img || !img.naturalWidth) return;
    var s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    var w = img.naturalWidth * s;
    var h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  var ticking = false;

  function update() {
    ticking = false;
    var rect = section.getBoundingClientRect();
    var scrollable = section.offsetHeight - window.innerHeight;
    var progress = clamp(-rect.top / (scrollable > 0 ? scrollable : 1), 0, 1);

    var index = Math.round(progress * (count - 1));
    if (index !== lastIndex) {
      draw(loader.nearest(index));
      lastIndex = index;
    }

    if (progressBar) progressBar.style.width = (progress * 100).toFixed(2) + "%";

    var inView = rect.top < window.innerHeight && rect.bottom > 0;
    var overlay = inView ? "" : "none";
    if (progressBar && progressBar.parentElement)
      progressBar.parentElement.style.opacity = overlay === "none" ? "0" : "1";
    var capWrap = section.querySelector(".film-captions");
    if (capWrap) capWrap.style.visibility = overlay === "none" ? "hidden" : "visible";
    if (hint) {
      hint.classList.toggle("is-hidden", progress > 0.03 || !inView);
      hint.style.visibility = overlay === "none" ? "hidden" : "visible";
    }

    for (var i = 0; i < captions.length; i++) {
      var c = captions[i];
      var from = parseFloat(c.getAttribute("data-from")) || 0;
      var to = parseFloat(c.getAttribute("data-to")) || 1;
      c.classList.toggle("is-active", progress >= from && progress < to);
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  resize();
  window.addEventListener("resize", function () {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    resize();
    update();
  });
  window.addEventListener("scroll", onScroll, { passive: true });

  // Smooth scroll — uma só camada (Lenis). Sem lenis, scroll nativo já funciona.
  if (window.Lenis) {
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1 });
    function raf(t) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on("scroll", onScroll);
  }

  loader.start();

  // poster imediato (frame 0) assim que disponível
  var poster = new Image();
  poster.onload = function () {
    lastIndex = -1;
  };
  poster.src = loader.src(0);
})();
