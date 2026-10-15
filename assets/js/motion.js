/* ==========================================================================
   Motion — Lenis (smooth scroll) + GSAP ScrollTrigger.
   Uma única camada de suavização: o Lenis move o scroll e o ScrollTrigger
   apenas LÊ a posição (scrub sem suavização própria).
   Se o GSAP não carregar, cai num fallback por IntersectionObserver.
   ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var lenis = null;

  // ---- 1. Smooth scroll (instância única) --------------------------------
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1 });
  }

  // ---- 2. Fallback: revela o que precisa aparecer ------------------------
  function revealFallback() {
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
    var suffix = el.getAttribute("data-suffix") || "";
    el.textContent = value.toFixed(dec) + suffix;
  }

  // ---- 3. Sem GSAP: revela + conta de forma simples ----------------------
  function simpleMode() {
    revealFallback();
    var els = document.querySelectorAll("[data-count]");
    els.forEach(function (el) {
      el.textContent = (parseFloat(el.getAttribute("data-count")) || 0) + (el.getAttribute("data-suffix") || "");
    });
    if (lenis) {
      function raf(t) {
        lenis.raf(t);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // ---- 4. Com GSAP + ScrollTrigger ---------------------------------------
  function gsapMode() {
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    if (lenis) {
      lenis.on("scroll", window.ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // Reveals
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.fromTo(
        el,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    });

    // Contadores
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

    // Parallax
    gsap.utils.toArray("[data-parallax]").forEach(function (el) {
      var amount = parseFloat(el.getAttribute("data-parallax")) || 60;
      gsap.fromTo(
        el,
        { y: -amount * 0.5 },
        {
          y: amount * 0.5,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });

    // Faixa horizontal fixada (só em telas largas)
    var mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", function () {
      var wrap = document.querySelector("[data-hscroll]");
      if (!wrap) return;
      var track = wrap.querySelector("[data-hscroll-track]");
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

    // Se a mídia mudar (mobile<->desktop), recalcula.
    window.addEventListener("load", function () {
      window.ScrollTrigger.refresh();
    });
  }

  // ---- 5. Boot -----------------------------------------------------------
  if (hasGsap && !reduce) {
    document.documentElement.classList.add("gsap");
    gsapMode();
  } else {
    simpleMode();
    if (lenis) {
      function raf(t) {
        lenis.raf(t);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }
})();
