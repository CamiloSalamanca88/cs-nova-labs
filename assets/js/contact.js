/**
 * CS Nova Labs — contact.js
 * Validación del formulario y envío por WhatsApp con mensaje prellenado.
 * No hay backend: los datos no se guardan en ningún servidor.
 */
(function () {
  "use strict";

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var cfg = window.CSNOVA_CONFIG || {};
  var status = form.querySelector("[data-form-status]");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Reglas por campo: devuelven el mensaje de error o "" si es válido.
  var rules = {
    nombre: function (v) {
      if (!v) return "Escribe tu nombre.";
      if (v.length < 2) return "El nombre debe tener al menos 2 caracteres.";
      return "";
    },
    correo: function (v) {
      if (!v) return "Escribe tu correo electrónico.";
      if (!EMAIL_RE.test(v)) return "Revisa el formato del correo, por ejemplo ana@empresa.com.";
      return "";
    },
    servicio: function (v) {
      return v ? "" : "Selecciona el tipo de servicio.";
    },
    mensaje: function (v) {
      if (!v) return "Cuéntanos brevemente qué necesitas.";
      if (v.length < 20) return "Agrega un poco más de detalle (mínimo 20 caracteres).";
      return "";
    }
  };

  function validateField(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var msg = rule(field.value.trim());
    var wrapper = field.closest(".field");
    var errorEl = document.getElementById(field.getAttribute("aria-describedby"));
    wrapper.classList.toggle("has-error", Boolean(msg));
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (errorEl) errorEl.textContent = msg;
    return !msg;
  }

  // Valida al salir del campo y limpia el error mientras se corrige.
  Array.prototype.forEach.call(form.elements, function (field) {
    if (!rules[field.name]) return;
    field.addEventListener("blur", function () { if (field.value) validateField(field); });
    field.addEventListener("input", function () {
      if (field.closest(".field").classList.contains("has-error")) validateField(field);
    });
    field.addEventListener("change", function () {
      if (field.closest(".field").classList.contains("has-error")) validateField(field);
    });
  });

  function buildMessage(data) {
    return [
      "Hola, CS Nova Labs. Quisiera solicitar una cotización.",
      "",
      "Nombre: " + data.nombre,
      "Correo: " + data.correo,
      "Servicio: " + data.servicio,
      "",
      "Proyecto:",
      data.mensaje
    ].join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    status.classList.remove("is-warning");

    var fields = ["nombre", "correo", "servicio", "mensaje"].map(function (n) { return form.elements[n]; });
    var firstInvalid = null;
    fields.forEach(function (f) {
      if (!validateField(f) && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    if (!cfg.whatsappNumber) {
      status.textContent = "El número de WhatsApp aún no está configurado en assets/js/config.js.";
      status.classList.add("is-warning");
      return;
    }

    var data = {};
    fields.forEach(function (f) { data[f.name] = f.value.trim(); });

    var url = "https://wa.me/" + cfg.whatsappNumber + "?text=" + encodeURIComponent(buildMessage(data));
    window.open(url, "_blank", "noopener");
    status.textContent = "Se abrió WhatsApp con tu mensaje. Solo falta presionar enviar.";
  });
})();
