/* ==========================================================================
   Motion — Lenis + GSAP/ScrollTrigger carregados SOB DEMANDA.
   O HTML não traz mais esses 137 KB no caminho crítico: este arquivo injeta
   as bibliotecas quando o navegador estiver ocioso (e nunca, se o visitante
   pediu "prefers-reduced-motion").
   Sem GSAP, cai num fallback por IntersectionObserver.
   ========================================================================== */
(function () {
  "use strict";

  var self = document.currentScript;
  var jsBase = self ? self.src.replace(/motion\.js(\?.*)?$/, "") : "assets/js/";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------- utilidades ---------------------------- */
  function inject(src, onload) {
    var s = document.createElement("script");
    s.src = src;
    s.async = false; // preserva a ordem de execução
    s.onload = onload;
    s.onerror = onload;
    document.head.appendChild(s);
  }

  function whenIdle(cb) {
    if ("requestIdleCallback" in window) window.requestIdleCallback(cb, { timeout: 1800 });
    else setTimeout(cb, 150);
  }

  function revealAll() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  function counterText(el, value) {
    var dec = parseInt(el.getAttribute("data-dec"), 10) || 0;
    el.textContent = value.toFixed(dec) + (el.getAttribute("data-suffix") || "");
  }

  function simpleCounters() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      counterText(el, parseFloat(el.getAttribute("data-count")) || 0);
    });
  }

  /* ------------------------------ modo GSAP ------------------------------ */
  function gsapMode() {
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    var lenis = null;
    if (window.Lenis) {
      lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1 });
      lenis.on("scroll", window.ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      // Se o fallback já revelou este elemento, não reanima (evita piscar).
      if (el.classList.contains("is-in")) {
        el.classList.remove("is-in");
        gsap.set(el, { clearProps: "opacity,transform,visibility" });
        return;
      }
      gsap.fromTo(
        el,
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.85, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }
      );
    });

    gsap.utils.toArray("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: function () {
          counterText(el, obj.v);
        },
        onComplete: function () {
          counterText(el, target);
        },
      });
    });

    gsap.utils.toArray("[data-parallax]").forEach(function (el) {
      var amount = parseFloat(el.getAttribute("data-parallax")) || 60;
      gsap.fromTo(
        el,
        { y: -amount * 0.5 },
        { y: amount * 0.5, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
      );
    });

    var mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", function () {
      var wrap = document.querySelector("[data-hscroll]");
      var track = wrap && wrap.querySelector("[data-hscroll-track]");
      if (!track) return;
      var distance = function () {
        return Math.max(0, track.scrollWidth - window.innerWidth + 64);
      };
      gsap.to(track, {
        x: function () {
          return -distance();
        },
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: function () {
            return "+=" + distance();
          },
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    });

    window.addEventListener("load", function () {
      window.ScrollTrigger.refresh();
    });
  }

  /* -------------------------------- boot --------------------------------- */
  // 1. Acessibilidade/movimento reduzido: nada de libs, conteúdo já visível.
  if (reduce) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-in");
    });
    simpleCounters();
    return;
  }

  // 2. Sem contexto visual pesado: revela já e melhora depois, se der.
  revealAll();

  whenIdle(function () {
    var files = ["vendor/lenis.min.js", "vendor/gsap.min.js", "vendor/ScrollTrigger.min.js"];
    var last = files[files.length - 1];
    files.forEach(function (f) {
      inject(jsBase + f, f === last ? boot : null);
    });
  });

  function boot() {
    if (window.gsap && window.ScrollTrigger) {
      document.documentElement.classList.add("gsap");
      gsapMode();
    } else {
      simpleCounters();
    }
  }
})();
