/* ==========================================================================
   UI geral: header (claro/escuro conforme o filme), menu mobile, reveal,
   contadores, filtro de portfólio e ano do rodapé.
   ========================================================================== */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var film = document.querySelector(".scroll-film");

  function updateHeader() {
    if (!header) return;
    var open = header.classList.contains("is-open");
    var filmHeight = film ? film.offsetHeight : 0;
    var overFilm = false;
    if (filmHeight > 0) {
      var end = filmHeight - window.innerHeight;
      overFilm = window.scrollY < end - 40;
    }
    header.classList.toggle("is-over-film", overFilm && !open);
    header.classList.toggle("is-solid", !overFilm || open);
  }

  if (header) {
    var toggle = header.querySelector(".nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = header.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        updateHeader();
      });
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
  }

  // Reveal
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  // Contadores
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var dec = (el.getAttribute("data-dec") | 0) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    var dur = 1300;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            runCounter(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      cio.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  }

  // Filtro de portfólio
  var filters = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll("[data-tags]");
  if (filters.length && items.length) {
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        filters.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        items.forEach(function (it) {
          var tags = (it.getAttribute("data-tags") || "").split(/\s+/);
          it.classList.toggle("is-hidden", !(f === "todos" || tags.indexOf(f) >= 0));
        });
      });
    });
  }

  // Ano do rodapé
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
