/**
 * CS Nova Labs — main.js
 * Navegación (header, menú móvil, sección activa) y aplicación de config.js.
 */
(function () {
  "use strict";

  var cfg = window.CSNOVA_CONFIG || {};

  /* ---------- Header con fondo al hacer scroll ---------- */
  var header = document.querySelector("[data-header]");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".sr-only").textContent = open ? "Cerrar menú" : "Abrir menú";
    nav.classList.toggle("is-open", open);
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 861px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Sección activa en el menú ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));
  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove("is-active"); });
        var link = byId[entry.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Aplicar datos de config.js ---------- */
  document.querySelectorAll("[data-config-text]").forEach(function (el) {
    var value = cfg[el.getAttribute("data-config-text")];
    if (value) el.textContent = value;
  });

  document.querySelectorAll("[data-whatsapp-link]").forEach(function (el) {
    if (cfg.whatsappNumber) {
      el.href = "https://wa.me/" + cfg.whatsappNumber;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.href = "#contacto";
    }
  });

  document.querySelectorAll("[data-email-link]").forEach(function (el) {
    el.href = cfg.email ? "mailto:" + cfg.email : "#contacto";
  });

  document.querySelectorAll("[data-social]").forEach(function (el) {
    var url = cfg.social && cfg.social[el.getAttribute("data-social")];
    if (url) el.href = url;
    else el.closest("li").hidden = true;
  });
  // Si no hay ninguna red configurada, se oculta la columna completa.
  document.querySelectorAll(".footer-col").forEach(function (col) {
    var socials = col.querySelectorAll("[data-social]");
    if (socials.length && !col.querySelector("li:not([hidden])")) col.hidden = true;
  });

  document.querySelectorAll("[data-project-link]").forEach(function (el) {
    var url = cfg.projects && cfg.projects[el.getAttribute("data-project-link")];
    if (url) { el.href = url; el.target = "_blank"; el.rel = "noopener"; }
    else el.hidden = true;
  });

  /* ---------- "Consultar" en servicios preselecciona el servicio ---------- */
  var select = document.getElementById("f-servicio");
  document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (select) {
        select.value = link.getAttribute("data-service");
        select.dispatchEvent(new Event("change"));
      }
    });
  });

  /* ---------- Año del footer ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
