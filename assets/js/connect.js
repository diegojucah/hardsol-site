/* ==========================================================================
   Formulário de conexão — máquina de estado (idle → loading → success/error)
   e envio de payload JSON limpo para webhook (n8n / API).

   A URL vem de brand.json → "webhook". Sem webhook configurado, o payload é
   formatado e aberto no WhatsApp — nenhum lead fica preso.
   ========================================================================== */
(function () {
  "use strict";

  var state = { saving: false };
  var form = document.querySelector("[data-form]");
  if (!form) return;
  var button = form.querySelector("[data-submit]");
  var label = button ? button.querySelector("[data-label]") : null;
  var feedback = form.querySelector(".form-feedback");

  function render(stateName, message) {
    form.setAttribute("data-state", stateName);
    if (feedback && message) {
      // aria-live é só no container do feedback.
      feedback.innerHTML = message;
    }
    form.setAttribute("aria-busy", stateName === "loading" ? "true" : "false");
  }

  function payload() {
    var data = {
      source: "site-hardsol",
      event: form.getAttribute("data-intent") || "avaliacao-viabilidade",
      brand: form.getAttribute("data-brand") || "hardsol",
      page: location.pathname,
      submittedAt: new Date().toISOString(),
      fields: {},
    };
    var txt = document.createElement("textarea");
    form.querySelectorAll("[name]").forEach(function (el) {
      var v = (el.value || "").trim();
      var key = el.name;
      txt.innerHTML = v;
      data.fields[key] = txt.value;
    });
    return data;
  }

  function whatsapp(payloadData) {
    var f = payloadData.fields;
    var lines = [
      "*" + (payloadData.event || "contato") + "*",
      f.nome ? "• Nome: " + f.nome : "",
      f.empresa ? "• Empresa: " + f.empresa : "",
      f.telefone ? "• Telefone: " + f.telefone : "",
      f.email ? "• E-mail: " + f.email : "",
      f.perfil ? "• Perfil: " + f.perfil : "",
      f.consumo ? "• Consumo médio: " + f.consumo + " kWh/mês" : "",
      f.mensagem ? "• Obs: " + f.mensagem : "",
      "• Origem: " + location.href,
    ].filter(Boolean);
    var url = "https://api.whatsapp.com/send?phone=" +
      (window.BRAND && window.BRAND.whatsapp ? window.BRAND.whatsapp : "5582996262545") +
      "&text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  }

  async function send() {
    if (state.saving) return;
    if (!form.checkValidity()) {
      form.setAttribute("data-state", "error");
      render("error", "Confira os campos destacados antes de enviar.");
      form.querySelector(":invalid") && form.querySelector(":invalid").focus();
      return;
    }
    state.saving = true;
    render("loading", label && label.getAttribute("data-loading")
      ? label.getAttribute("data-loading")
      : "Enviando...");

    try {
      var body = JSON.stringify(payload());
      var hook = (window.BRAND && window.BRAND.webhook) || "";
      if (hook) {
        var res = await fetch(hook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
        });
        if (!res.ok) throw new Error("webhook " + res.status);
      } else {
        await new Promise(function (r) { setTimeout(r, 400); });
        whatsapp(payload());
      }
      render(
        "success",
        "<strong>Solicitação registrada.</strong> Nossa equipe responde em até 1 dia útil " +
          "com o desenho preliminar e a projeção de geração do seu sistema."
      );
      form.reset();
    } catch (err) {
      render(
        "error",
        "<strong>Não foi possível enviar.</strong> " +
          "Fale direto no WhatsApp para garantir o atendimento."
      );
    } finally {
      state.saving = false;
    }
  }

  button && button.addEventListener("click", function (e) {
    e.preventDefault();
    send();
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    send();
  });
})();
