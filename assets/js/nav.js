/* ==========================================================================
   UI — header (claro sobre o filme / sólido depois), menu mobile,
   filtro do portfólio e ano do rodapé.
   (Animações de entrada, contadores e parallax ficam no motion.js)
   ========================================================================== */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var hero = document.querySelector(".hero");

  function updateHeader() {
    if (!header) return;
    var open = header.classList.contains("is-open");
    var heroH = hero ? hero.offsetHeight : 0;
    var overHero = false;
    if (heroH > 0) {
      overHero = window.scrollY < heroH - 80;
    }
    header.classList.toggle("is-over-film", overHero && !open);
    header.classList.toggle("is-solid", !overHero || open);
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
    window.addEventListener("load", updateHeader);
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
