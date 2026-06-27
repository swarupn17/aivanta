/* ============================================================
   Aivanta Scholar Foundation — shared site script
   Injects header + footer (DRY) and wires up interactions.
   Each page sets <body data-page="..."> for active-nav state.
   ============================================================ */

(function () {
  "use strict";

  // ---- Pull everything editable from the central config (with safe fallbacks) ----
  const CFG = window.ASF_CONFIG || {};
  const ORG = CFG.org || {};
  const CONTACT = Object.assign(
    {
      email: "info@aivantascholar.org",
      phone: "+91 99999 00000",
      site: "www.aivantascholar.org",
      place: "Pimpri-Chinchwad, Pune, Maharashtra"
    },
    CFG.contact || {}
  );
  const SOCIAL = CFG.social || {};
  const LANGS = CFG.languages || [{ code: "en", label: "EN", active: true }];
  const LEGAL = CFG.legal || { privacy: "#", terms: "#" };
  const ORG_NAME = ORG.name || "Aivanta Scholar Foundation";
  const ORG_SHORT = ORG.shortName || "Aivanta Scholar";
  const ORG_SUFFIX = ORG.suffixWord || "Foundation";
  const ORG_MICRO = ORG.microTagline || "Awareness · Skills · Values";
  const ORG_TAGLINE = ORG.tagline || "Empowering today's students to build tomorrow's India";

  // ---- Navigation model (single source of truth) ----
  const NAV = [
    { key: "home", label: "Home", href: "index.html" },
    { key: "about", label: "About Us", href: "about.html" },
    {
      key: "assessments", label: "Assessments", href: "assessments.html",
      children: [
        { label: "Financial Awareness (FAA)", href: "assessments.html#faa" },
        { label: "Cyber Intelligence (CIA)", href: "assessments.html#cia" },
        { label: "Artificial Intelligence (AIA)", href: "assessments.html#aia" },
        { label: "Class-wise Syllabus", href: "syllabus.html" }
      ]
    },
    { key: "welfare", label: "Social Welfare", href: "social-welfare.html" },
    { key: "publications", label: "Publications", href: "publications.html" },
    { key: "registration", label: "Registration", href: "registration.html" },
    { key: "contact", label: "Contact", href: "contact.html" }
  ];

  const activePage = document.body.getAttribute("data-page") || "home";

  /* ---------- Logo (placeholder, swap real asset later) ---------- */
  function logoMark(size) {
    return `
      <span class="inline-flex items-center justify-center rounded-xl shrink-0"
            style="width:${size}px;height:${size}px;
                   background:linear-gradient(135deg,var(--asf-navy),var(--asf-sky));
                   box-shadow:0 6px 16px -6px rgba(12,45,107,.6)">
        <span class="font-display font-extrabold text-white"
              style="font-size:${size * 0.42}px;line-height:1">A</span>
      </span>`;
  }

  /* ---------- Header ---------- */
  function buildHeader() {
    const items = NAV.map((n) => {
      const isActive = n.key === activePage;
      const base =
        "nav-link px-3 py-2 text-sm font-semibold rounded-md transition-colors";
      const state = isActive
        ? "text-[var(--asf-navy)] bg-amber-50"
        : "text-slate-700 hover:text-[var(--asf-navy)] hover:bg-slate-50";

      if (n.children) {
        const sub = n.children
          .map(
            (c) =>
              `<a href="${c.href}" role="menuitem"
                  class="block px-4 py-2.5 text-sm text-slate-700 hover:bg-amber-50 hover:text-[var(--asf-navy)]">${c.label}</a>`
          )
          .join("");
        return `
          <li class="nav-item relative">
            <a href="${n.href}" class="${base} ${state} inline-flex items-center gap-1"
               aria-haspopup="true" aria-expanded="false">
              ${n.label}
              <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
              </svg>
            </a>
            <div class="nav-dropdown absolute left-0 top-full pt-2 w-64 z-50" role="menu">
              <div class="bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden py-1">${sub}</div>
            </div>
          </li>`;
      }
      return `<li class="nav-item"><a href="${n.href}" class="${base} ${state}">${n.label}</a></li>`;
    }).join("");

    const mobileItems = NAV.map((n) => {
      const links = [
        `<a href="${n.href}" class="block px-4 py-3 font-semibold text-slate-800 border-b border-slate-100">${n.label}</a>`
      ];
      if (n.children) {
        n.children.forEach((c) =>
          links.push(
            `<a href="${c.href}" class="block px-8 py-2.5 text-sm text-slate-600 border-b border-slate-100">– ${c.label}</a>`
          )
        );
      }
      return links.join("");
    }).join("");

    return `
    <div class="tricolour-strip" aria-hidden="true"></div>

    <!-- Utility bar -->
    <div class="bg-[var(--asf-navy)] text-white text-xs">
      <div class="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
        <p class="hidden sm:block font-medium tracking-wide">
          ${ORG_TAGLINE}
        </p>
        <div class="flex items-center gap-4 ml-auto">
          <a href="mailto:${CONTACT.email}" class="hover:text-[var(--asf-gold-light)] inline-flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span class="hidden sm:inline">${CONTACT.email}</span>
          </a>
          <a href="tel:${CONTACT.phone.replace(/\s/g, "")}" class="hover:text-[var(--asf-gold-light)] inline-flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3l2 5-2.5 1.5a11 11 0 005 5L17 12l5 2v3a2 2 0 01-2 2A16 16 0 013 5z"/></svg>
            ${CONTACT.phone}
          </a>
          <div class="hidden md:flex items-center gap-1 border-l border-white/20 pl-3" role="group" aria-label="Choose language">
            ${LANGS.map(
              (l, idx) =>
                `${idx > 0 ? '<span class="text-white/40" aria-hidden="true">|</span>' : ''}` +
                `<button type="button" data-lang="${l.code}" class="asf-lang px-1 hover:text-[var(--asf-gold-light)]" aria-pressed="${l.active ? 'true' : 'false'}">${l.label}</button>`
            ).join("")}
          </div>
        </div>
      </div>
    </div>

    <!-- Main bar -->
    <div class="bg-white/95 backdrop-blur sticky top-0 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="h-20 flex items-center justify-between gap-4">
          <a href="index.html" class="flex items-center gap-3 shrink-0" aria-label="${ORG_NAME} home">
            ${logoMark(48)}
            <span class="leading-tight">
              <span class="block font-display font-extrabold text-lg text-[var(--asf-navy)]">${ORG_SHORT}</span>
              <span class="block text-[11px] font-semibold tracking-[0.18em] text-[var(--asf-gold)] uppercase">${ORG_SUFFIX}</span>
            </span>
          </a>

          <nav aria-label="Primary" class="hidden lg:block">
            <ul class="flex items-center gap-1">${items}</ul>
          </nav>

          <div class="flex items-center gap-2">
            <a href="registration.html"
               class="hidden sm:inline-flex items-center gap-2 bg-[var(--asf-gold)] hover:bg-[var(--asf-gold-light)] text-[var(--asf-navy-900)] font-bold text-sm px-4 py-2.5 rounded-lg transition-colors">
              Register School
            </a>
            <button id="asf-burger" class="lg:hidden p-2 rounded-md text-[var(--asf-navy)] hover:bg-slate-100"
                    aria-label="Open menu" aria-expanded="false" aria-controls="asf-mobile-nav">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile nav -->
      <div id="asf-mobile-nav" class="lg:hidden asf-mnav border-t border-slate-100 bg-white">
        ${mobileItems}
        <div class="p-4">
          <a href="registration.html" class="block text-center bg-[var(--asf-gold)] text-[var(--asf-navy-900)] font-bold px-4 py-3 rounded-lg">Register School</a>
        </div>
      </div>
    </div>`;
  }

  /* ---------- Footer ---------- */
  function buildFooter() {
    const col = (title, links) => `
      <div>
        <h3 class="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">${title}</h3>
        <ul class="space-y-2.5 text-sm">
          ${links
            .map(
              (l) =>
                `<li><a href="${l.href}" class="text-slate-300 hover:text-[var(--asf-gold-light)] transition-colors">${l.label}</a></li>`
            )
            .join("")}
        </ul>
      </div>`;

    return `
    <footer class="bg-[var(--asf-navy-900)] text-white">
      <div class="tricolour-strip" aria-hidden="true"></div>
      <div class="max-w-7xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div class="lg:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            ${logoMark(44)}
            <span class="leading-tight">
              <span class="block font-display font-extrabold text-lg">${ORG_NAME}</span>
              <span class="block text-[11px] font-semibold tracking-[0.18em] text-[var(--asf-gold-light)] uppercase">${ORG_MICRO}</span>
            </span>
          </div>
          <p class="text-slate-300 text-sm leading-relaxed max-w-sm">
            A national student awareness initiative preparing school students to become
            financially aware, digitally safe, and AI-ready citizens — aligned with the
            vision of <span class="text-[var(--asf-gold-light)] font-semibold">Viksit Bharat 2047</span>.
          </p>
          <div class="flex items-center gap-3 mt-5">
            ${["facebook", "instagram", "linkedin", "youtube"]
              .filter((s) => SOCIAL[s])
              .map(
                (s) =>
                  `<a href="${SOCIAL[s]}" target="_blank" rel="noopener noreferrer" aria-label="${s} (opens in a new tab)" class="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-[var(--asf-gold)] hover:text-[var(--asf-navy-900)] transition-colors">
                     <span class="text-xs font-bold uppercase">${s[0]}</span>
                   </a>`
              )
              .join("")}
          </div>
        </div>
        ${col("Assessments", [
          { label: "Financial Awareness", href: "assessments.html#faa" },
          { label: "Cyber Intelligence", href: "assessments.html#cia" },
          { label: "Artificial Intelligence", href: "assessments.html#aia" },
          { label: "Class-wise Syllabus", href: "syllabus.html" }
        ])}
        ${col("Foundation", [
          { label: "About Us", href: "about.html" },
          { label: "Social Welfare", href: "social-welfare.html" },
          { label: "Publications", href: "publications.html" },
          { label: "Register a School", href: "registration.html" }
        ])}
        <div>
          <h3 class="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Reach Us</h3>
          <ul class="space-y-3 text-sm text-slate-300">
            <li>${CONTACT.place}</li>
            <li><a class="hover:text-[var(--asf-gold-light)]" href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
            <li><a class="hover:text-[var(--asf-gold-light)]" href="tel:${CONTACT.phone.replace(/\s/g, "")}">${CONTACT.phone}</a></li>
            <li>${CONTACT.site}</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© ${new Date().getFullYear()} ${ORG_NAME}. All rights reserved.</p>
          <p class="flex items-center gap-4">
            <a href="${LEGAL.privacy}" class="hover:text-[var(--asf-gold-light)]">Privacy Policy</a>
            <a href="${LEGAL.terms}" class="hover:text-[var(--asf-gold-light)]">Terms of Use</a>
            <a href="contact.html" class="hover:text-[var(--asf-gold-light)]">Contact</a>
          </p>
        </div>
      </div>
    </footer>`;
  }

  /* ---------- Interactions ---------- */
  function wireMobileNav() {
    const burger = document.getElementById("asf-burger");
    const menu = document.getElementById("asf-mobile-nav");
    if (!burger || !menu) return;
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
  }

  function wireCarousel() {
    const root = document.querySelector("[data-carousel]");
    if (!root) return;
    const slides = Array.from(root.querySelectorAll(".carousel-slide"));
    const dots = Array.from(root.querySelectorAll(".carousel-dot"));
    if (slides.length < 2) return;
    let i = 0;
    let timer;
    const go = (n) => {
      slides[i].classList.remove("is-active");
      dots[i] && dots[i].classList.remove("is-active");
      i = (n + slides.length) % slides.length;
      slides[i].classList.add("is-active");
      dots[i] && dots[i].classList.add("is-active");
    };
    const start = () => (timer = setInterval(() => go(i + 1), 6000));
    const stop = () => clearInterval(timer);
    dots.forEach((d, n) =>
      d.addEventListener("click", () => {
        stop();
        go(n);
        start();
      })
    );
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    start();
  }

  function wireReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((e) => io.observe(e));
  }

  function wireCounters() {
    const nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    const run = (el) => {
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      const dur = 1400;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString("en-IN") + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            run(en.target);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    nums.forEach((n) => io.observe(n));
  }

  function wireLanguage() {
    const btns = Array.from(document.querySelectorAll(".asf-lang"));
    if (!btns.length) return;
    const saved = (function () {
      try { return localStorage.getItem("asf-lang"); } catch (e) { return null; }
    })();
    const paint = (code) => {
      document.documentElement.setAttribute("lang", code);
      btns.forEach((b) => {
        const on = b.getAttribute("data-lang") === code;
        b.setAttribute("aria-pressed", String(on));
        b.classList.toggle("text-[var(--asf-gold-light)]", on);
        b.classList.toggle("font-bold", on);
      });
    };
    const initial =
      saved ||
      (LANGS.find((l) => l.active) || LANGS[0]).code;
    paint(initial);
    btns.forEach((b) =>
      b.addEventListener("click", () => {
        const code = b.getAttribute("data-lang");
        try { localStorage.setItem("asf-lang", code); } catch (e) {}
        paint(code);
      })
    );
  }

  function renderTicker() {
    const track = document.getElementById("asf-ticker");
    if (!track) return;
    const items = CFG.announcements || [];
    if (!items.length) return;
    // Duplicate the list so the marquee loops seamlessly.
    const one = items
      .map((t) => `<span class="px-8">${t}</span>`)
      .join("");
    track.innerHTML = one + one;
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const h = document.getElementById("asf-header");
    const f = document.getElementById("asf-footer");
    if (h) h.innerHTML = buildHeader();
    if (f) f.innerHTML = buildFooter();
    wireMobileNav();
    wireLanguage();
    renderTicker();
    wireCarousel();
    wireReveal();
    wireCounters();
    const y = document.getElementById("asf-year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
