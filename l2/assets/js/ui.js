/* ==========================================================================
   UI — topbar, reveal, slots de foto e formulário com estados.
   ========================================================================== */
(function () {
  "use strict";

  /* topbar sólida após 40px */
  var top = document.querySelector(".top");
  function onScroll() {
    if (top) top.classList.toggle("solid", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* reveal */
  var els = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!els.length) { /* nada */ }
  else if (!("IntersectionObserver" in window) || reduce) {
    els.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* slots de foto: some com o placeholder só quando a imagem carrega */
  Array.prototype.slice.call(document.querySelectorAll("img[data-photo]")).forEach(function (img) {
    var slot = img.closest("[data-slot]");
    if (!slot) return;
    function ok() { slot.classList.add("loaded"); }
    if (img.complete && img.naturalWidth > 0) ok();
    else {
      img.addEventListener("load", ok);
      img.addEventListener("error", function () {
        img.removeAttribute("src");
        slot.classList.remove("loaded");
      });
    }
  });

  /* formulário */
  var form = document.querySelector("[data-form]");
  if (!form) return;
  var fb = form.querySelector(".fb");
  var saving = false;

  function render(state, msg) {
    form.setAttribute("data-state", state);
    form.setAttribute("aria-busy", state === "loading" ? "true" : "false");
    if (fb && msg) fb.innerHTML = msg;
  }

  function payload() {
    var data = {
      source: "site-l2",
      event: form.getAttribute("data-intent") || "orcamento",
      page: location.pathname,
      submittedAt: new Date().toISOString(),
      fields: {},
    };
    var txt = document.createElement("textarea");
    form.querySelectorAll("[name]").forEach(function (el) {
      txt.innerHTML = (el.value || "").trim();
      data.fields[el.name] = txt.value;
    });
    return data;
  }

  function whatsapp(d) {
    var f = d.fields;
    var lines = [
      "*Orçamento — L2 Construtora*",
      f.nome ? "Nome: " + f.nome : "",
      f.telefone ? "Telefone: " + f.telefone : "",
      f.tipo ? "Tipo: " + f.tipo : "",
      f.area ? "Área: " + f.area + " m²" : "",
      f.mensagem ? "Obs: " + f.mensagem : "",
    ].filter(Boolean);
    window.open(
      "https://api.whatsapp.com/send?phone=558235222755&text=" + encodeURIComponent(lines.join("\n")),
      "_blank",
      "noopener"
    );
  }

  function send() {
    if (saving) return;
    if (!form.checkValidity()) {
      render("error", "Confira os campos obrigatórios antes de enviar.");
      var bad = form.querySelector(":invalid");
      if (bad) bad.focus();
      return;
    }
    saving = true;
    render("loading", "Enviando…");
    var d = payload();
    var hook = window.L2_WEBHOOK || "";
    var done = function () {
      render("success", "<strong>Recebido.</strong> A engenharia responde com escopo e prazo em até 1 dia útil.");
      form.reset();
      saving = false;
    };
    var fail = function () {
      render("error", "<strong>Não foi possível enviar.</strong> Chame no WhatsApp para garantir o atendimento.");
      saving = false;
    };
    if (!hook) {
      setTimeout(function () { whatsapp(d); done(); }, 350);
      return;
    }
    fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); done(); })
      .catch(fail);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); send(); });
})();
