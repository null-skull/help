/*
 * Helpperr — vanilla JS for the static export (vanilla/).
 *
 * Re-implements, without React, every interactive piece of the Next.js site:
 * smooth scrolling, scroll reveals, the preloader, the nav (mobile menu +
 * hide-on-scroll header), FAQ accordions, the Book a Demo modal, the pricing
 * seat picker, home-page scroll animations, the contact/newsletter forms, the
 * privacy-policy table of contents and the full login flow.
 *
 * Each block mirrors the React component named in its heading — same timings,
 * same Tailwind classes (all present in the site's compiled styles.css).
 * Copy comes from content.js and icons from icons.js (both generated).
 */
(function () {
  "use strict";

  var C = window.HELPPERR_CONTENT || {};
  var ICONS = window.HELPPERR_ICONS || {};
  var PAGE = document.body.dataset.page;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    // Only re-measure on width changes (mobile address bar = height only).
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  // ---------------------------------------------------------------- helpers

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  /** lucide icon markup at a given size, with extra classes. */
  function icon(name, size, cls, strokeWidth) {
    var svg = ICONS[name] || "";
    size = size || 24;
    svg = svg.replace('width="24"', 'width="' + size + '"').replace('height="24"', 'height="' + size + '"');
    if (strokeWidth) svg = svg.replace(/stroke-width="[^"]*"/, 'stroke-width="' + strokeWidth + '"');
    svg = svg.replace('class="', 'aria-hidden="true" class="' + (cls ? cls + " " : ""));
    return svg;
  }

  function swap(el, remove, add) {
    remove.split(" ").forEach(function (c) { if (c) el.classList.remove(c); });
    add.split(" ").forEach(function (c) { if (c) el.classList.add(c); });
  }

  /** Sets an attribute, or removes it when value is null. */
  function setAttr(el, name, value) {
    if (value === null) el.removeAttribute(name);
    else el.setAttribute(name, value);
  }

  function rem() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  }

  // ------------------------------------------------- preloader gate (lib/preloader-gate)
  // Entrance animations wait for the preloader; pages without one run at once.

  var preloadPending = false;
  var preloadQueue = [];
  function onPreloadDone(cb) {
    if (preloadPending) preloadQueue.push(cb);
    else cb();
  }
  function completePreload() {
    if (!preloadPending) return;
    preloadPending = false;
    preloadQueue.splice(0).forEach(function (cb) { cb(); });
  }

  // ----------------------------------------------- smooth scroll (SmoothScroll + lib/lenis)

  var lenis = null;
  if (!reduceMotion && window.Lenis && gsap) {
    lenis = new window.Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
    });
    if (ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToSection(hash) {
    if (!hash || hash.charAt(0) !== "#" || hash.length < 2) return;
    var el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return;
    if (lenis) {
      // 5.5rem clears the fixed header (rem: the root font-size is fluid).
      lenis.scrollTo(el, { offset: -5.5 * rem(), duration: 1.1 });
      return;
    }
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function lockScroll(lock) {
    document.body.style.overflow = lock ? "hidden" : "";
    if (lenis) {
      if (lock) lenis.stop();
      else lenis.start();
    }
  }

  // Same-page links (lib/site-links): on the home page, "index.html#x" and
  // "index.html" smooth-scroll instead of reloading the page.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    if (a.dataset.action === "book-demo") return; // handled by the modal
    var href = a.getAttribute("href");
    if (PAGE === "home" && (href === "index.html" || href.indexOf("index.html#") === 0)) {
      e.preventDefault();
      scrollToSection(href === "index.html" ? "#hero" : href.slice("index.html".length));
    } else if (href.charAt(0) === "#" && href.length > 1 && document.getElementById(href.slice(1)) && !a.closest("[data-legal-toc]")) {
      e.preventDefault();
      scrollToSection(href);
    }
  });

  // Arriving with a hash (e.g. index.html#faq): scroll once the page is ready.
  function hashScroll() {
    if (location.hash.length < 2) return;
    onPreloadDone(function () {
      requestAnimationFrame(function () { scrollToSection(location.hash); });
    });
  }

  // ------------------------------------------------------------- Preloader (home)

  function preloader() {
    var root = $("[data-preloader]");
    if (!root) return;

    // Plays once per visit; returning to the home page skips it.
    var played = false;
    try { played = sessionStorage.getItem("hp-preloaded") === "1"; } catch {}
    if (played) { root.remove(); return; }

    preloadPending = true;
    lockScroll(true);

    var fill = $("[data-preloader-fill]", root);
    var wave = $(".preloader-wave-mask", root);
    var label = $("[data-preloader-progress]", root);
    function setProgress(p) {
      if (fill) fill.style.clipPath = "inset(" + (100 - p) + "% 0 0 0)";
      if (wave) wave.style.backgroundPositionY = "calc(" + (100 - p) + "% - 2.5vw)";
      if (label) label.textContent = p + "%";
    }
    function finish() {
      try { sessionStorage.setItem("hp-preloaded", "1"); } catch {}
      root.remove();
      lockScroll(false);
      completePreload();
    }

    if (reduceMotion || !gsap) {
      setTimeout(function () { setProgress(100); finish(); }, 150);
      return;
    }
    var counter = { value: 0 };
    gsap.timeline()
      .to(counter, { value: 100, duration: 2.2, ease: "power2.inOut", onUpdate: function () { setProgress(Math.round(counter.value)); } })
      .to(root, { opacity: 0, duration: 0.6, ease: "power2.inOut", delay: 0.3 })
      .call(finish);
  }

  // ------------------------------------------------------------------ Reveal

  function reveals() {
    $$("[data-reveal]").forEach(function (el) {
      var sel = el.dataset.revealSelector;
      var targets = sel ? $$(sel, el) : Array.prototype.slice.call(el.children);
      if (!targets.length) return;
      if (reduceMotion || !gsap) {
        targets.forEach(function (t) { t.style.opacity = "1"; t.style.transform = "none"; });
        return;
      }
      var y = parseFloat(el.dataset.revealY || "30");
      var stagger = parseFloat(el.dataset.revealStagger || "0.1");
      gsap.set(targets, { opacity: 0, y: y });
      onPreloadDone(function () {
        gsap.to(targets, {
          opacity: 1, y: 0, duration: 1, stagger: stagger, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    });
  }

  // --------------------------------------------------------------------- Nav

  function nav() {
    var header = $("header");
    if (!header) return;

    // Hide while scrolling down, show on scroll up (always shown near the top).
    var lastY = window.scrollY;
    var frame = 0;
    var menuOpen = false;
    // The pre-rendered header carries "translate-y-0"; swap it like React does.
    function setHidden(h) {
      if (h && !menuOpen) swap(header, "translate-y-0", "-translate-y-full");
      else swap(header, "-translate-y-full", "translate-y-0");
    }
    window.addEventListener("scroll", function () {
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = 0;
        var y = window.scrollY;
        if (y < 120) setHidden(false);
        else if (y - lastY > 6) setHidden(true);
        else if (lastY - y > 6) setHidden(false);
        else return;
        lastY = y;
      });
    }, { passive: true });

    // Mobile menu — built from the desktop links (React only renders it open).
    var toggle = $('button[aria-label="Toggle menu"]', header);
    if (!toggle) return;
    var links = $$("nav a", header);
    var login = $('a[href="login.html"]', header);
    var getStarted = $(".lg\\:flex button", header);
    var panel = document.createElement("div");
    panel.setAttribute("data-lenis-prevent", "");
    panel.className = "absolute inset-x-0 top-full h-[calc(100dvh-100%)] overflow-y-auto overscroll-contain border-t border-line bg-page lg:hidden";
    panel.hidden = true;
    var inner = '<div class="flex flex-col gap-1 px-gutter py-4">';
    links.forEach(function (a) {
      var active = a.getAttribute("aria-current") === "page";
      inner += '<a href="' + esc(a.getAttribute("href")) + '"' + (active ? ' aria-current="page"' : "") +
        ' class="cursor-pointer rounded-lg px-3 py-3 text-base font-medium ' + (active ? "bg-card text-fg" : "text-fg-muted") + '">' +
        esc(a.textContent) + "</a>";
    });
    if (login) {
      inner += '<a href="login.html" class="mt-2 rounded-full border border-line-strong bg-card-2 px-btn-x py-btn-y text-center text-base font-medium text-fg transition hover:border-primary hover:bg-card-hover">' + esc(login.textContent) + "</a>";
    }
    inner += '<button class="mt-1 cursor-pointer rounded-full bg-primary px-btn-x py-btn-y text-base font-medium text-fg transition hover:bg-primary-hover active:bg-primary-active shadow-primary active:scale-[0.98]">' +
      esc(getStarted ? getStarted.textContent : "Get Started") + "</button></div>";
    panel.innerHTML = inner;
    (header.querySelector("section") || header).appendChild(panel);

    function setMenu(open) {
      menuOpen = open;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = icon(open ? "X" : "Menu", 22);
      lockScroll(open);
      if (open) setHidden(false);
    }
    toggle.addEventListener("click", function () { setMenu(!menuOpen); });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) setMenu(false);
    });
  }

  // ----------------------------------------------------------------- FAQ

  function faqs() {
    $$("section#faq, section#pricing-faq").forEach(function (section) {
      var buttons = $$("button[aria-expanded]", section);
      function setOpen(btn, open) {
        var item = btn.parentElement;
        var label = btn.querySelector("span");
        var chevron = btn.querySelector("svg");
        var panel = btn.nextElementSibling;
        btn.setAttribute("aria-expanded", String(open));
        if (label) swap(label, open ? "text-fg-muted" : "text-fg", open ? "text-fg" : "text-fg-muted");
        if (chevron) swap(chevron, open ? "text-fg-muted" : "rotate-180 text-accent", open ? "rotate-180 text-accent" : "text-fg-muted");
        if (panel) swap(panel, open ? "grid-rows-[0fr]" : "grid-rows-[1fr] pt-2", open ? "grid-rows-[1fr] pt-2" : "grid-rows-[0fr]");
        return item;
      }
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var wasOpen = btn.getAttribute("aria-expanded") === "true";
          buttons.forEach(function (b) { if (b !== btn) setOpen(b, false); });
          setOpen(btn, !wasOpen);
        });
      });
    });
  }

  // ------------------------------------------------------- Book a Demo modal

  var modalEl = null;
  function openBookDemo() {
    if (modalEl) return;
    modalEl = document.createElement("div");
    modalEl.className = "fixed inset-0 z-[90] flex items-center justify-center p-4";
    var field = "rounded-lg border border-line-strong bg-card-2 px-4 py-2.5 text-base text-fg placeholder:text-fg-subtle outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/25";
    modalEl.innerHTML =
      '<div data-modal-backdrop aria-hidden="true" class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>' +
      '<div data-modal-panel data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="book-demo-title" class="relative max-h-[calc(100dvh-2rem)] w-full max-w-modal overflow-y-auto overscroll-contain rounded-2xl border border-line bg-card p-card shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">' +
      '<button type="button" data-modal-close aria-label="Close" class="absolute right-4 top-4 cursor-pointer text-fg-subtle transition-colors hover:text-fg">' + icon("X", 20) + "</button>" +
      '<div data-modal-body>' +
      '<h3 id="book-demo-title" class="text-2xl font-medium text-fg">Book a Demo</h3>' +
      '<p class="mt-2 text-sm leading-relaxed text-fg-muted">Tell us a bit about yourself and we&#39;ll get back to you shortly.</p>' +
      '<form class="mt-6 flex flex-col gap-4">' +
      '<div class="flex flex-col gap-1.5"><label for="demo-name" class="text-sm font-medium text-fg">Name</label>' +
      '<input id="demo-name" name="name" type="text" required placeholder="Jane Doe" class="' + field + '"/></div>' +
      '<div class="flex flex-col gap-1.5"><label for="demo-email" class="text-sm font-medium text-fg">Email</label>' +
      '<input id="demo-email" name="email" type="email" required placeholder="jane@company.com" class="' + field + '"/></div>' +
      '<div class="flex flex-col gap-1.5"><label for="demo-message" class="text-sm font-medium text-fg">Message <span class="text-fg-subtle">(optional)</span></label>' +
      '<textarea id="demo-message" name="message" rows="3" placeholder="What would you like to see?" class="resize-none ' + field + '"></textarea></div>' +
      '<button type="submit" class="mt-2 cursor-pointer rounded-full bg-primary px-btn-x py-btn-y text-base font-medium text-fg transition hover:scale-[1.02] hover:bg-primary-hover active:bg-primary-active shadow-primary active:scale-[0.98]">Send Request</button>' +
      "</form></div></div>";
    document.querySelector(".home-new").appendChild(modalEl);
    lockScroll(true);

    var panel = $("[data-modal-panel]", modalEl);
    var backdrop = $("[data-modal-backdrop]", modalEl);
    if (gsap && !reduceMotion) {
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(panel, { opacity: 0, y: 20, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
    }

    function close() {
      if (!modalEl) return;
      modalEl.remove();
      modalEl = null;
      lockScroll(false);
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    backdrop.addEventListener("click", close);
    $("[data-modal-close]", modalEl).addEventListener("click", close);
    $("form", modalEl).addEventListener("submit", function (e) {
      e.preventDefault();
      $("[data-modal-body]", modalEl).innerHTML =
        '<div class="flex flex-col items-center gap-3 py-8 text-center">' +
        '<span class="flex size-12 items-center justify-center rounded-full bg-success">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="var(--hn-bg)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>' +
        '<h3 class="text-title font-medium text-fg">Request received</h3>' +
        '<p class="text-sm leading-relaxed text-fg-muted">Thanks for reaching out — our team will follow up by email shortly.</p></div>';
    });
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest && e.target.closest('[data-action="book-demo"]');
    if (!trigger) return;
    e.preventDefault();
    openBookDemo();
  });

  // ----------------------------------------------------- Pricing seat picker

  function seatPickers() {
    $$("[data-team-card]").forEach(function (card) {
      var toggle = $("[data-seat-toggle]", card);
      if (!toggle) return;
      var price = Number(card.dataset.seatPrice);
      var credits = Number(card.dataset.seatCredits);
      var min = Number(card.dataset.seatMin);
      var max = Number(card.dataset.seatMax);
      var seats = Number($("[data-seat-count]", toggle).textContent) || min;
      var list = null;

      function render() {
        $("[data-seat-count]", toggle).textContent = seats;
        var summary = $("[data-seat-summary]", card);
        if (summary) summary.textContent = "$" + price * seats + "/month total for " + seats + " seats · " + min + "–" + max + " users";
        var total = $("[data-seat-credits-total]", card);
        if (total) total.textContent = (credits * seats).toLocaleString() + " credits";
      }
      function close() {
        if (!list) return;
        list.remove();
        list = null;
        toggle.setAttribute("aria-expanded", "false");
        var chev = toggle.querySelector("svg:last-of-type");
        if (chev) chev.classList.remove("rotate-180");
        document.removeEventListener("mousedown", outside);
      }
      function outside(e) { if (!toggle.parentElement.contains(e.target)) close(); }
      function open() {
        list = document.createElement("ul");
        list.setAttribute("role", "listbox");
        list.setAttribute("data-lenis-prevent", "");
        list.className = "absolute right-0 top-full z-10 mt-2 max-h-56 w-24 overflow-y-auto overscroll-contain rounded-lg border border-line bg-card py-1 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]";
        var html = "";
        for (var n = min; n <= max; n++) {
          html += '<li><button type="button" role="option" aria-selected="' + (n === seats) + '" data-seat="' + n + '" class="w-full cursor-pointer px-3 py-1.5 text-left text-sm transition-colors ' +
            (n === seats ? "bg-accent text-page" : "text-fg-muted hover:bg-accent/10 hover:text-fg") + '">' + n + "</button></li>";
        }
        list.innerHTML = html;
        toggle.parentElement.appendChild(list);
        toggle.setAttribute("aria-expanded", "true");
        var chev = toggle.querySelector("svg:last-of-type");
        if (chev) chev.classList.add("rotate-180");
        list.addEventListener("click", function (e) {
          var b = e.target.closest("[data-seat]");
          if (!b) return;
          seats = Number(b.dataset.seat);
          render();
          close();
        });
        document.addEventListener("mousedown", outside);
      }
      toggle.addEventListener("click", function () {
        if (list) close();
        else open();
      });
    });
  }

  // ------------------------------------------------------- CountUp (Stats)

  function countUps() {
    $$("[data-countup]").forEach(function (el) {
      var value = el.dataset.countup;
      var match = value.match(/^(\d+(?:\.\d+)?)/);
      if (!match || reduceMotion || !gsap) { el.textContent = value; return; }
      var target = parseFloat(match[1]);
      var decimals = match[1].indexOf(".") > -1 ? match[1].split(".")[1].length : 0;
      var suffix = value.slice(match[1].length);
      el.textContent = "0" + suffix;
      onPreloadDone(function () {
        var proxy = { val: 0 };
        gsap.to(proxy, {
          val: target, duration: 1.8, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: function () { el.textContent = proxy.val.toFixed(decimals) + suffix; },
        });
      });
    });
  }

  // ------------------------------------------- Hero2 (scroll-scrubbed mockup)

  function mockupZoom() {
    var mockup = $("#product-showcase .will-change-transform");
    if (!mockup || reduceMotion || !gsap) return;
    gsap.fromTo(mockup, { scale: 0.92, y: 40 }, {
      scale: 1.06, y: -10, ease: "none",
      scrollTrigger: { trigger: mockup, start: "top 90%", end: "top 20%", scrub: 0.9 },
    });
    var video = mockup.querySelector("video");
    if (video) video.addEventListener("loadedmetadata", function () { ScrollTrigger.refresh(); });
  }

  // --------------------------------------- HowItWorks (line drawn on scroll)

  function stepsPath() {
    var diagram = $("#how-it-works .h-steps-diagram");
    var rect = $("#how-it-works-reveal rect");
    if (!diagram || !rect || reduceMotion || !gsap) return;
    gsap.fromTo(rect, { attr: { width: 0 } }, {
      attr: { width: 110 }, ease: "none",
      scrollTrigger: { trigger: diagram, start: "top 75%", end: "bottom 65%", scrub: 0.9 },
    });
  }

  // ----------------------------------------------------- FeaturesSticky

  function featuresSticky() {
    var steps = $$("[data-feature-step]");
    var panels = $$("[data-feature-panel]");
    if (!steps.length) return;
    function setActive(active) {
      steps.forEach(function (step, i) {
        var num = $("[data-feature-num]", step);
        var title = $("[data-feature-title]", step);
        var on = i === active;
        if (num) swap(num, on ? "text-fg-subtle" : "text-accent", on ? "text-accent" : "text-fg-subtle");
        if (title) swap(title, on ? "text-fg-subtle" : "text-fg", on ? "text-fg" : "text-fg-subtle");
      });
      panels.forEach(function (panel, i) {
        var on = i === active;
        swap(panel, on ? "opacity-0" : "opacity-100", on ? "opacity-100" : "opacity-0");
        var video = panel.querySelector("video");
        if (!video) return;
        if (on) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
        else video.pause();
      });
    }
    setActive(0);
    if (reduceMotion || !ScrollTrigger) return;
    steps.forEach(function (step, i) {
      ScrollTrigger.create({
        trigger: step, start: "top center", end: "bottom center",
        onToggle: function (self) { if (self.isActive) setActive(i); },
      });
    });
  }

  // -------------------------------------------------------- Contact form

  function contactForm() {
    if (PAGE !== "contact") return;
    var form = $("main form");
    if (!form) return;
    var s = C.contact && C.contact.success;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var done = document.createElement("div");
      done.className = "flex flex-col items-center gap-3 rounded-2xl border border-line bg-card p-card py-16 text-center";
      done.innerHTML =
        '<span class="flex size-12 items-center justify-center rounded-full bg-success text-page">' + icon("Check", 22, "", 2.5) + "</span>" +
        '<h2 class="text-title font-medium text-fg">' + esc(s ? s.title : "Message sent") + "</h2>" +
        '<p class="max-w-sm text-sm leading-relaxed text-fg-muted">' + esc(s ? s.body : "") + "</p>" +
        '<button type="button" class="mt-2 cursor-pointer text-sm font-medium text-accent hover:text-primary-hover">Send another message</button>';
      form.replaceWith(done);
      $("button", done).addEventListener("click", function () {
        form.reset();
        done.replaceWith(form);
      });
    });
  }

  // ---------------------------------------------------- Footer newsletter

  function newsletter() {
    var form = $("footer form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var p = document.createElement("p");
      p.setAttribute("role", "status");
      p.className = "flex items-center gap-3 rounded-full border border-success/30 bg-success/10 px-btn-x py-btn-y text-base text-fg";
      p.innerHTML = '<span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-page">' + icon("Check", 14, "", 3) + "</span>" +
        esc((C.newsletter && C.newsletter.success) || "You're subscribed!");
      form.replaceWith(p);
    });
  }

  // ------------------------------------------- Legal page table of contents

  function legalToc() {
    var nav = $('nav[aria-label="On this page"]');
    var allLinks = $$('aside a[href^="#"]');
    if (!allLinks.length) return;
    allLinks.forEach(function (a) {
      a.closest("aside").setAttribute("data-legal-toc", "");
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var hash = a.getAttribute("href");
        scrollToSection(hash);
        history.replaceState(null, "", hash);
      });
    });
    if (!nav || !("IntersectionObserver" in window)) return;
    var links = $$("a", nav);
    function setActive(id) {
      links.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + id;
        var num = a.querySelector("span");
        setAttr(a, "aria-current", on ? "location" : null);
        swap(a, on ? "border-transparent text-fg-muted hover:text-fg" : "border-accent text-fg", on ? "border-accent text-fg" : "border-transparent text-fg-muted hover:text-fg");
        if (num) swap(num, on ? "text-fg-subtle" : "text-accent", on ? "text-accent" : "text-fg-subtle");
      });
    }
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (en) { return en.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-20% 0px -65% 0px" });
    links.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute("href").slice(1));
      if (sec) observer.observe(sec);
    });
  }

  // ------------------------------------------- Login: showcase panel (right)

  function authShowcase() {
    var panel = $(".lg\\:block .auth-step-in");
    var slides = C.auth && C.auth.showcase;
    if (!panel || !slides) return;
    var box = panel.parentElement; // the aria-live caption wrapper
    var root = box.parentElement;
    var dots = $$('button[aria-label^="Show message"]', root);
    var index = 0;
    var paused = false;
    function show(i) {
      index = i;
      var next = document.createElement("div");
      next.className = "auth-step-in flex flex-col items-center gap-2";
      next.innerHTML = '<h2 class="text-title font-medium text-fg">' + esc(slides[i].heading) + "</h2>" +
        '<p class="text-sm leading-relaxed text-fg-muted">' + esc(slides[i].sub) + "</p>";
      box.innerHTML = "";
      box.appendChild(next);
      dots.forEach(function (d, j) {
        var on = j === i;
        setAttr(d, "aria-current", on ? "true" : null);
        swap(d, on ? "w-1.5 bg-fg-subtle/50 hover:bg-fg-subtle" : "w-6 bg-accent", on ? "w-6 bg-accent" : "w-1.5 bg-fg-subtle/50 hover:bg-fg-subtle");
      });
    }
    dots.forEach(function (d, j) { d.addEventListener("click", function () { show(j); }); });
    ["mouseenter", "focusin"].forEach(function (ev) { root.addEventListener(ev, function () { paused = true; }); });
    ["mouseleave", "focusout"].forEach(function (ev) { root.addEventListener(ev, function () { paused = false; }); });
    if (reduceMotion) return;
    setInterval(function () { if (!paused) show((index + 1) % slides.length); }, 6000);
  }

  // -------------------------------------------- Login: flow (AuthFlow + mock client)

  function authFlow() {
    if (PAGE !== "login") return;
    var A = C.auth;
    var emailInput = $('main input[name="email"]');
    if (!A || !emailInput) return;
    var root = emailInput.closest(".auth-step-in");
    var emailTemplate = root.innerHTML; // the server-rendered email step
    var state = { email: "" };

    // Mock backend — same rules as lib/auth-client.ts.
    var REGISTERED = ["demo@company.com", "jane@company.com"];
    var TAKEN = ["admin", "helpperr", "support", "demo", "jane", "root", "team"];
    var NETWORK = "Something went wrong on our side. Please try again.";
    function simulate(fn, ms) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () { try { resolve(fn()); } catch (e) { reject(e); } }, ms || 750);
      });
    }
    var api = {
      checkEmail: function (email) {
        return simulate(function () {
          var n = email.trim().toLowerCase();
          if (n.indexOf("error") > -1) throw new Error(NETWORK);
          return { registered: /@helpperr\.com$/.test(n) || REGISTERED.indexOf(n) > -1 };
        });
      },
      checkUsername: function (u) {
        return simulate(function () {
          if (u.indexOf("error") > -1) throw new Error("Couldn't check this username. Please try again.");
          return { available: TAKEN.indexOf(u) === -1 };
        }, 500);
      },
      signUp: function (email, u) {
        return simulate(function () {
          if (TAKEN.indexOf(u) > -1) throw new Error("That username was just taken. Please choose another.");
        });
      },
      sendMagicLink: function (email) {
        return simulate(function () { if (email.indexOf("error") > -1) throw new Error(NETWORK); });
      },
      google: function () {
        return simulate(function () { throw new Error("Google sign-in isn't connected yet — please continue with email for now."); }, 600);
      },
    };

    var FIELD = "w-full rounded-full border bg-card-2 px-5 py-btn-y text-base text-fg placeholder:text-fg-subtle outline-none transition focus:ring-3 disabled:opacity-60";
    var FIELD_OK = "border-line-strong focus:border-primary focus:ring-primary/25";
    var FIELD_ERROR = "border-error focus:border-error focus:ring-error/25";
    var PRIMARY = "inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-btn-x py-btn-y text-base font-medium text-fg shadow-primary transition hover:bg-primary-hover active:scale-[0.98] active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:bg-primary disabled:active:scale-100";
    var SECONDARY = "inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-line-strong bg-card-2 px-btn-x py-btn-y text-base font-medium text-fg transition hover:border-primary hover:bg-card-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-line-strong disabled:hover:bg-card-2 disabled:active:scale-100";
    var spinner = function (cls) { return icon("LoaderCircle", 18, "animate-spin " + (cls || "")); };
    function message(tone, text, id) {
      var ico = tone === "error" ? icon("CircleAlert", 16, "mt-px shrink-0") : tone === "success" ? icon("CircleCheck", 16, "mt-px shrink-0") : "";
      var color = tone === "error" ? "text-error" : tone === "success" ? "text-success" : "text-fg-subtle";
      return '<p' + (id ? ' id="' + id + '"' : "") + ' class="flex items-start gap-2 text-sm leading-snug ' + color + '">' + ico + "<span>" + esc(text) + "</span></p>";
    }
    function header(heading, subHtml) {
      return '<div class="flex flex-col items-center gap-2 text-center"><h1 tabindex="-1" class="text-h3 font-medium leading-[1.15] text-fg outline-none">' + esc(heading) + "</h1>" +
        (subHtml ? '<p class="text-base leading-relaxed text-fg-muted">' + subHtml + "</p>" : "") + "</div>";
    }
    function setLoading(btn, loading, label) {
      btn.disabled = loading || btn.dataset.blocked === "1";
      setAttr(btn, "aria-busy", loading ? "true" : null);
      if (label !== undefined) btn.innerHTML = (loading ? spinner() : "") + label;
    }
    function render(html, focusSel) {
      var next = document.createElement("div");
      next.className = "auth-step-in";
      next.innerHTML = html;
      root.replaceWith(next);
      root = next;
      var f = focusSel && $(focusSel, root);
      if (f) { f.focus(); if (f.select) f.select(); }
    }

    // 1. Email ------------------------------------------------------------
    function bindEmail(focus) {
      var form = $("form", root);
      var input = $('input[name="email"]', root);
      var cont = $('button[type="submit"]', root);
      var google = $$("button", root).filter(function (b) { return b.type === "button"; })[0];
      var googleWrap = google && google.parentElement;
      var googleHtml = google && google.innerHTML;
      var contLabel = cont.textContent;
      var field = input.parentElement;
      input.value = state.email;
      if (focus) { input.focus(); input.select(); }

      function showError(text) {
        var old = $('[data-email-error]', field);
        if (old) old.remove();
        swap(input, text ? FIELD_OK : FIELD_ERROR, text ? FIELD_ERROR : FIELD_OK);
        if (!text) { input.removeAttribute("aria-invalid"); input.removeAttribute("aria-describedby"); return; }
        var box = document.createElement("div");
        box.setAttribute("role", "alert");
        box.setAttribute("data-email-error", "");
        box.innerHTML = message("error", text, "auth-email-error");
        field.appendChild(box);
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", "auth-email-error");
      }
      function showGoogleError(text) {
        var old = $("[data-google-error]", googleWrap);
        if (old) old.remove();
        if (!text) return;
        var box = document.createElement("div");
        box.setAttribute("role", "alert");
        box.setAttribute("data-google-error", "");
        box.innerHTML = message("error", text);
        googleWrap.appendChild(box);
      }
      input.addEventListener("input", function () { if ($("[data-email-error]", field)) showError(null); });

      var busy = false;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (busy) return;
        var email = input.value.trim();
        var problem = !email ? A.email.errors.required : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? A.email.errors.invalid : null;
        if (problem) { showError(problem); input.focus(); return; }
        showError(null);
        showGoogleError(null);
        busy = true;
        input.disabled = true;
        if (google) google.disabled = true;
        setLoading(cont, true, esc(contLabel));
        api.checkEmail(email).then(function (r) {
          state.email = email.toLowerCase();
          if (r.registered) inboxStep(false);
          else usernameStep();
        }, function (err) {
          busy = false;
          input.disabled = false;
          if (google) google.disabled = false;
          setLoading(cont, false, esc(contLabel));
          showError(err.message);
        });
      });

      if (google) google.addEventListener("click", function () {
        if (busy) return;
        busy = true;
        showError(null);
        showGoogleError(null);
        cont.disabled = true;
        google.disabled = true;
        google.innerHTML = spinner() + googleHtml.replace(/<img[^>]*>/, "");
        api.google().catch(function (err) { showGoogleError(err.message); }).then(function () {
          busy = false;
          cont.disabled = false;
          google.disabled = false;
          google.innerHTML = googleHtml;
        });
      });
    }

    function emailStep() {
      render(emailTemplate);
      bindEmail(true);
    }

    // 2. Username -----------------------------------------------------------
    function usernameStep() {
      var U = A.username;
      render(
        '<div class="flex flex-col gap-7">' + header(U.heading, esc(U.sub)) +
        '<p class="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line bg-card-2 px-4 py-3 text-sm text-fg-muted">' + esc(U.signingUpAs) +
        '<strong class="min-w-0 break-all font-medium text-fg">' + esc(state.email) + "</strong>" +
        '<button type="button" data-change class="ml-auto cursor-pointer font-medium text-accent transition-colors hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-60">' + esc(U.change) + "</button></p>" +
        '<form novalidate class="flex flex-col gap-4"><div class="flex flex-col gap-1.5">' +
        '<label for="auth-username" class="text-sm font-medium text-fg">' + esc(U.label) + "</label>" +
        '<div class="relative">' + icon("AtSign", 16, "pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-fg-subtle") +
        '<input id="auth-username" name="username" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="20" placeholder="' + esc(U.placeholder) + '" aria-describedby="auth-username-status" class="' + FIELD + " pl-11 pr-12 " + FIELD_OK + '"/>' +
        '<span aria-hidden="true" data-trail class="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2"></span></div>' +
        '<div id="auth-username-status" aria-live="polite"></div></div>' +
        '<button type="submit" disabled class="' + PRIMARY + '">' + esc(U.cta) + "</button></form></div>",
        "#auth-username"
      );

      var input = $("#auth-username", root);
      var status = $("#auth-username-status", root);
      var trail = $("[data-trail]", root);
      var submit = $('button[type="submit"]', root);
      var change = $("[data-change]", root);
      var s = { value: "", touched: false, availability: "idle", checkError: null, submitting: false, submitError: null };
      var timer = 0;
      var latest = "";

      function problemFor(v) {
        var e = U.errors;
        if (!v) return e.required;
        if (!/^[a-z]/.test(v)) return e.start;
        if (!/^[a-z0-9._-]+$/.test(v)) return e.chars;
        if (v.length < 3) return e.tooShort;
        if (v.length > 20) return e.tooLong;
        return null;
      }
      function paint() {
        var problem = problemFor(s.value);
        var showProblem = problem && (s.touched || (s.value.length > 0 && problem !== U.errors.tooShort));
        var html, invalid = false;
        if (s.submitError) { html = message("error", s.submitError); invalid = true; }
        else if (showProblem) { html = message("error", problem); invalid = true; }
        else if (s.availability === "checking") html = '<p class="flex items-center gap-2 text-sm text-fg-muted">' + spinner("size-4") + esc(U.status.checking) + "</p>";
        else if (s.availability === "available") html = message("success", U.status.available.replace("{username}", s.value));
        else if (s.availability === "taken") { html = '<p class="flex items-start gap-2 text-sm leading-snug text-error">' + icon("CircleX", 16, "mt-px shrink-0") + "<span>" + esc(U.status.taken.replace("{username}", s.value)) + "</span></p>"; invalid = true; }
        else if (s.availability === "error") { html = message("error", s.checkError); invalid = true; }
        else html = message("muted", U.hint);
        status.innerHTML = html;
        trail.innerHTML =
          (s.availability === "checking" && !showProblem ? spinner("size-4 text-fg-muted") : "") +
          (s.availability === "available" && !s.submitError && !showProblem ? icon("CircleCheck", 18, "text-success") : "") +
          (invalid ? icon("CircleX", 18, "text-error") : "");
        swap(input, invalid ? FIELD_OK : FIELD_ERROR, invalid ? FIELD_ERROR : FIELD_OK);
        setAttr(input, "aria-invalid", invalid ? "true" : null);
        submit.dataset.blocked = s.availability === "available" ? "0" : "1";
        setLoading(submit, s.submitting, esc(U.cta));
        input.disabled = s.submitting;
        change.disabled = s.submitting;
      }
      paint();

      input.addEventListener("input", function () {
        var next = input.value.toLowerCase().replace(/\s+/g, "");
        if (next !== input.value) input.value = next;
        s.value = next;
        s.submitError = null;
        s.checkError = null;
        clearTimeout(timer);
        latest = next;
        if (problemFor(next)) { s.availability = "idle"; paint(); return; }
        s.availability = "checking";
        paint();
        timer = setTimeout(function () {
          api.checkUsername(next).then(function (r) {
            if (latest !== next) return;
            s.availability = r.available ? "available" : "taken";
            paint();
          }, function (err) {
            if (latest !== next) return;
            s.checkError = err.message;
            s.availability = "error";
            paint();
          });
        }, 400);
      });
      input.addEventListener("blur", function () { s.touched = true; paint(); });
      change.addEventListener("click", emailStep);
      $("form", root).addEventListener("submit", function (e) {
        e.preventDefault();
        s.touched = true;
        if (s.submitting || s.availability !== "available") { paint(); if (problemFor(s.value)) input.focus(); return; }
        s.submitError = null;
        s.submitting = true;
        paint();
        api.signUp(state.email, s.value).then(function () { inboxStep(true); }, function (err) {
          s.submitting = false;
          s.submitError = err.message;
          if (/taken/i.test(err.message)) s.availability = "taken";
          paint();
          input.focus();
        });
      });
    }

    // 3. Check your inbox -------------------------------------------------
    function inboxStep(isNew) {
      var B = A.inbox;
      var sub = esc(isNew ? B.newUser : B.existing).replace("{email}", '<strong class="break-all font-medium text-fg">' + esc(state.email) + "</strong>");
      render(
        '<div class="flex flex-col gap-7">' +
        '<span class="flex size-14 items-center justify-center self-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">' + icon("MailCheck", 26) + "</span>" +
        header(B.heading, sub) +
        '<div class="flex flex-col gap-3"><button type="button" data-resend class="' + SECONDARY + '"></button><div aria-live="polite" data-notice></div></div>' +
        '<div class="flex flex-col items-center gap-3 border-t border-line pt-6 text-center">' +
        '<button type="button" data-change class="inline-flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-primary-hover">' + icon("ArrowLeft", 16) + esc(B.change) + "</button>" +
        '<p class="text-sm text-fg-subtle">' + esc(B.help) + "</p></div></div>",
        "h1"
      );
      var resend = $("[data-resend]", root);
      var notice = $("[data-notice]", root);
      var cooldownUntil = Date.now() + 30000;
      var resending = false;
      var tick = 0;
      function paint() {
        var left = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
        resend.disabled = resending || left > 0;
        setAttr(resend, "aria-busy", resending ? "true" : null);
        resend.innerHTML = resending ? spinner() + esc(B.resending) : esc(left > 0 ? B.cooldown.replace("{seconds}", left) : B.resend);
        if (left <= 0) clearInterval(tick);
      }
      function startCooldown() {
        cooldownUntil = Date.now() + 30000;
        clearInterval(tick);
        tick = setInterval(paint, 1000);
        paint();
      }
      startCooldown();
      resend.addEventListener("click", function () {
        if (resend.disabled) return;
        notice.innerHTML = "";
        resending = true;
        paint();
        api.sendMagicLink(state.email).then(function () {
          resending = false;
          notice.innerHTML = message("success", B.resent);
          startCooldown();
        }, function (err) {
          resending = false;
          notice.innerHTML = message("error", err.message);
          paint();
        });
      });
      $("[data-change]", root).addEventListener("click", function () {
        clearInterval(tick);
        emailStep();
      });
    }

    bindEmail(false);
  }

  // ------------------------------------------------------------------ boot

  preloader();
  reveals();
  nav();
  faqs();
  seatPickers();
  countUps();
  mockupZoom();
  stepsPath();
  featuresSticky();
  contactForm();
  newsletter();
  legalToc();
  authShowcase();
  authFlow();
  hashScroll();
})();
