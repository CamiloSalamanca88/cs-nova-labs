/**
 * CS Nova Labs — hero-nova.js
 * Elemento visual del hero: una "nova", estallido de rayos finos que se
 * enciende al cargar la página y luego rota muy lentamente.
 * - Respeta prefers-reduced-motion (dibuja el estado final sin animar).
 * - Se pausa cuando el hero no está visible o la pestaña está oculta.
 */
(function () {
  "use strict";

  var canvas = document.querySelector("[data-nova]");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var RAY_COUNT = 150;
  var IGNITE_MS = 1800;
  var rays = [];
  var w = 0, h = 0, dpr = 1, cx = 0, cy = 0, radius = 0, mobile = false;
  var start = null, rafId = null, visible = true;

  // Generador pseudoaleatorio con semilla: la nova se ve igual en cada visita.
  var seed = 7;
  function rand() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  function buildRays() {
    rays = [];
    for (var i = 0; i < RAY_COUNT; i++) {
      var long = rand() < 0.14;
      rays.push({
        angle: (i / RAY_COUNT) * Math.PI * 2 + (rand() - 0.5) * 0.05,
        length: long ? 0.75 + rand() * 0.25 : 0.22 + Math.pow(rand(), 1.6) * 0.55,
        inner: 0.035 + rand() * 0.05,
        width: long ? 1.2 : 0.5 + rand() * 0.6,
        alpha: long ? 0.75 : 0.18 + rand() * 0.4,
        delay: rand() * 0.35,
        phase: rand() * Math.PI * 2
      });
    }
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    mobile = w < 760;
    cx = mobile ? w * 0.86 : w * 0.74;
    cy = mobile ? h * 0.2 : h * 0.47;
    radius = mobile ? Math.max(w, h) * 0.42 : Math.min(w * 0.36, h * 0.62);
    if (reduceMotion || !rafId) draw(performance.now());
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function draw(now) {
    if (start === null) start = now;
    // rAF puede entregar una marca de tiempo anterior a la del primer dibujo: se acota a 0.
    var elapsed = Math.max(0, now - start);
    var ignite = reduceMotion ? 1 : Math.min(elapsed / IGNITE_MS, 1);
    var rotation = reduceMotion ? 0 : elapsed * 0.000012;
    var globalAlpha = mobile ? 0.45 : 1;

    ctx.clearRect(0, 0, w, h);

    // Órbitas tenues
    ctx.lineWidth = 1;
    [0.38, 0.62, 0.9].forEach(function (f, i) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius * f * easeOut(ignite), 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(143,168,255," + (0.07 - i * 0.015) * globalAlpha + ")";
      ctx.stroke();
    });

    // Rayos
    for (var i = 0; i < rays.length; i++) {
      var r = rays[i];
      var local = Math.max(0, Math.min((ignite - r.delay) / (1 - r.delay), 1));
      if (local <= 0) continue;
      var grow = easeOut(local);
      var twinkle = reduceMotion ? 1 : 0.8 + 0.2 * Math.sin(elapsed * 0.0012 + r.phase);
      var a = r.angle + rotation;
      var cos = Math.cos(a), sin = Math.sin(a);
      var r0 = radius * r.inner;
      var r1 = r0 + (radius * r.length - r0) * grow;

      var x0 = cx + cos * r0, y0 = cy + sin * r0;
      var x1 = cx + cos * r1, y1 = cy + sin * r1;
      var grad = ctx.createLinearGradient(x0, y0, x1, y1);
      var alpha = r.alpha * twinkle * globalAlpha;
      grad.addColorStop(0, "rgba(201,212,255," + alpha + ")");
      grad.addColorStop(1, "rgba(143,168,255,0)");

      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = grad;
      ctx.lineWidth = r.width;
      ctx.stroke();
    }

    // Núcleo
    var core = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.12);
    core.addColorStop(0, "rgba(232,238,255," + 0.95 * easeOut(ignite) * globalAlpha + ")");
    core.addColorStop(0.25, "rgba(143,168,255," + 0.35 * easeOut(ignite) * globalAlpha + ")");
    core.addColorStop(1, "rgba(143,168,255,0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  function loop(now) {
    draw(now);
    rafId = visible && !document.hidden ? requestAnimationFrame(loop) : null;
  }

  function play() {
    if (reduceMotion || rafId) return;
    rafId = requestAnimationFrame(loop);
  }

  buildRays();
  resize();
  window.addEventListener("resize", resize);

  if (!reduceMotion) {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) play();
      }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) play();
    });
    play();
  }
})();
