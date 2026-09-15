// Otolab — shared behaviour: corner marks, mobile nav, reveal-on-scroll, mailto contact form.
(function () {
  "use strict";

  function addCorners() {
    document.querySelectorAll(".frame, .card, .callout, .contact-box, .ficha-pac, .alert-box").forEach(function (el) {
      if (el.dataset.cornersDone) return;
      el.dataset.cornersDone = "1";
      ["tl", "tr", "bl", "br"].forEach(function (pos) {
        var i = document.createElement("i");
        i.className = "corner corner--" + pos;
        i.textContent = "+";
        i.setAttribute("aria-hidden", "true");
        el.appendChild(i);
      });
    });
  }

  function initNav() {
    var burger = document.querySelector("[data-burger]");
    var overlay = document.querySelector("[data-menu-overlay]");
    if (!burger || !overlay) return;
    function close() {
      burger.setAttribute("aria-expanded", "false");
      overlay.classList.remove("open");
    }
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      overlay.classList.toggle("open", !open);
    });
    overlay.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
  }

  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (el) { el.style.animation = "none"; el.style.opacity = "1"; });
      return;
    }
    els.forEach(function (el) { el.style.animation = "none"; el.style.opacity = "0"; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, k) {
        if (!e.isIntersecting) return;
        e.target.style.animation = "ot-fade-up .55s cubic-bezier(.2,.7,.3,1) " + (k * 70) + "ms both";
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#cf-name").value.trim();
      var email = form.querySelector("#cf-email").value.trim();
      var message = form.querySelector("#cf-message").value.trim();
      var subject = "Contacto Otolab — " + (name || "sin nombre");
      var body = message + (email ? "\n\nResponder a: " + email : "");
      window.location.href = "mailto:hola@otolab.cl?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  function initCopyEmail() {
    document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var email = "hola@otolab.cl";
        var label = btn.querySelector("[data-copy-label]");
        function flash(text) {
          if (!label) return;
          label.textContent = text;
          setTimeout(function () { label.textContent = "COPIAR"; }, 1600);
        }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(email).then(function () { flash("COPIADO"); }).catch(function () { flash("COPIAR"); });
        }
      });
    });
  }

  window.__otolabAddCorners = addCorners;

  document.addEventListener("DOMContentLoaded", function () {
    addCorners();
    initNav();
    initReveal();
    initContactForm();
    initCopyEmail();
  });
})();
