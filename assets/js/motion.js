/* ==========================================================================
   Interatividade básica — sem dependências.
   Revela elementos com IntersectionObserver e anima contadores.
   Suave o suficiente para parecer desenho, leve o suficiente para LCP.
   ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function counterText(el, value) {
    var dec = parseInt(el.getAttribute("data-dec"), 10) || 0;
    el.textContent = value.toFixed(dec) + (el.getAttribute("data-suffix") || "");
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    if (reduce) {
      counterText(el, target);
      return;
    }
    var start = null;
    var dur = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      counterText(el, target * eased);
      if (p < 1) requestAnimationFrame(step);
      else counterText(el, target);
    }
    requestAnimationFrame(step);
  }

  function reveal(els) {
    if (!els.length) return;
    if (!("IntersectionObserver" in window) || reduce) {
      els.forEach(function (el) { el.classList.add("is-in"); });
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  function counters(els) {
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        counterText(el, parseFloat(el.getAttribute("data-count")) || 0);
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            runCounter(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.4 }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  window.addEventListener("DOMContentLoaded", function () {
    reveal(Array.prototype.slice.call(document.querySelectorAll("[data-reveal]")));
    counters(Array.prototype.slice.call(document.querySelectorAll("[data-count]")));
  });

  // Ano do rodapé
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
