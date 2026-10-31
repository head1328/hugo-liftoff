(() => {
  "use strict";

  const root = document.documentElement;
  const storageKey = "liftoff.theme";

  /* Theme: initial selection from storage or prefers-color-scheme. */

  const getInitialTheme = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
  };

  applyTheme(getInitialTheme());

  /* Tabs */

  document.querySelectorAll(".tabs").forEach((tabs) => {
    const buttons = tabs.querySelectorAll('[role="tab"]');
    const panels = tabs.querySelectorAll(".tabs__panel");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");
        buttons.forEach((b) => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
        panels.forEach((p) => {
          p.hidden = p.getAttribute("data-panel") !== target;
        });
      });
      btn.addEventListener("keydown", (e) => {
        const list = Array.from(buttons);
        const idx = list.indexOf(btn);
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const dir = e.key === "ArrowRight" ? 1 : -1;
          const next = list[(idx + dir + list.length) % list.length];
          next.click();
          next.focus();
        }
      });
    });
  });

  /* Repo stats: client-side fetch with 1h localStorage cache. */

  const fetchRepoStats = async (el) => {
    const { repoHost, repoOwner, repoName } = el.dataset;
    if (!repoOwner || !repoName) return;
    const cacheKey = `liftoff.repo.${repoHost}.${repoOwner}.${repoName}`;
    const now = Date.now();
    const ttlMs = 60 * 60 * 1000;
    let data = null;
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      if (cached && now - cached.t < ttlMs) data = cached.d;
    } catch (e) { /* ignore */ }

    if (!data) {
      const url = repoHost === "github"
        ? `https://api.github.com/repos/${repoOwner}/${repoName}`
        : `https://codeberg.org/api/v1/repos/${repoOwner}/${repoName}`;
      try {
        const res = await fetch(url, { headers: { accept: "application/json" } });
        if (!res.ok) return;
        data = await res.json();
        localStorage.setItem(cacheKey, JSON.stringify({ t: now, d: data }));
      } catch (e) { return; }
    }

    const stars = data.stargazers_count ?? data.stars_count;
    if (typeof stars === "number") {
      const target = el.querySelector('[data-stat="stars"]');
      if (target) target.textContent = stars.toLocaleString();
    }
  };

  document.querySelectorAll(".repo-stats").forEach(fetchRepoStats);

  /* Click-outside closes the language dropdown. */

  document.addEventListener("click", (event) => {
    document.querySelectorAll("details.lang-switcher[open]").forEach((d) => {
      if (!d.contains(event.target)) d.removeAttribute("open");
    });
  });

  /* Lightbox for links marked with data-lightbox. One shared <dialog>,
     created on first use; Esc closing comes with showModal(). */

  let lightbox;

  const getLightbox = () => {
    if (lightbox) return lightbox;
    lightbox = document.createElement("dialog");
    lightbox.className = "lightbox";
    lightbox.innerHTML =
      '<button class="lightbox__close" type="button">&times;</button>' +
      '<figure class="lightbox__figure"><img alt=""><figcaption></figcaption></figure>';
    // A click outside the figure lands on the dialog itself (the backdrop).
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.closest(".lightbox__close")) {
        lightbox.close();
      }
    });
    document.body.append(lightbox);
    return lightbox;
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-lightbox]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    const box = getLightbox();
    box.querySelector(".lightbox__close")
      .setAttribute("aria-label", link.dataset.closeLabel || "Close");
    const img = box.querySelector("img");
    img.src = link.href;
    img.alt = link.querySelector("img")?.alt ?? "";
    const caption = box.querySelector("figcaption");
    caption.textContent = link.dataset.caption ?? "";
    caption.hidden = !link.dataset.caption;
    box.showModal();
  });

  /* Carousel: arrows, dots and optional autoplay on top of the
     scroll-snap track. Each slide is as wide as the track. */

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel__track");
    const slides = Array.from(track.children);
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    if (slides.length < 2) return;
    let current = 0;

    const goTo = (index) => {
      const next = (index + slides.length) % slides.length;
      track.scrollTo({ left: next * track.clientWidth });
    };

    // Tracks swipes and native scrolling as well as goTo().
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        current = slides.indexOf(entry.target);
        dots.forEach((dot, i) => dot.setAttribute("aria-current", i === current ? "true" : "false"));
      });
    }, { root: track, threshold: 0.6 });
    slides.forEach((slide) => observer.observe(slide));

    carousel.addEventListener("click", (event) => {
      if (event.target.closest("[data-carousel-prev]")) goTo(current - 1);
      else if (event.target.closest("[data-carousel-next]")) goTo(current + 1);
      else {
        const dot = event.target.closest("[data-carousel-dot]");
        if (dot) goTo(Number(dot.dataset.carouselDot));
      }
    });

    const interval = Number(carousel.dataset.interval) || 0;
    if (interval > 0 && !reducedMotion.matches) {
      // Paused while hovered, focused or in a hidden tab.
      let timer;
      let hovered = false;
      let focused = false;
      const sync = () => {
        clearInterval(timer);
        if (hovered || focused || document.hidden) return;
        timer = setInterval(() => goTo(current + 1), interval);
      };
      carousel.addEventListener("mouseenter", () => { hovered = true; sync(); });
      carousel.addEventListener("mouseleave", () => { hovered = false; sync(); });
      carousel.addEventListener("focusin", () => { focused = true; sync(); });
      carousel.addEventListener("focusout", (event) => {
        focused = carousel.contains(event.relatedTarget);
        sync();
      });
      document.addEventListener("visibilitychange", sync);
      sync();
    }

    carousel.setAttribute("data-ready", "");
  });

  /* Funding banner: rendered hidden, shown until dismissed once. */

  const fundingKey = "liftoff.funding.dismissed";
  const fundingBanner = document.querySelector("[data-funding-banner]");
  if (fundingBanner && !localStorage.getItem(fundingKey)) fundingBanner.hidden = false;

  /* Sponsor button: optional attention animation. Runs once per tab,
     or again every data-attention-repeat seconds across page loads.
     Stops for the tab once the visitor opened the popover. */

  const attentionKey = "liftoff.sponsor.attention";
  const engagedKey = "liftoff.sponsor.engaged";
  const sponsorButton = document.querySelector(".sponsor-button[data-attention]");
  if (sponsorButton && !reducedMotion.matches) {
    const repeatMs = Number(sponsorButton.dataset.attentionRepeat || 0) * 1000;
    let timer;
    const play = () => {
      sessionStorage.setItem(attentionKey, String(Date.now()));
      // Re-adding the class only restarts the CSS animation after a reflow.
      sponsorButton.classList.remove("is-attention");
      void sponsorButton.offsetWidth;
      sponsorButton.classList.add("is-attention");
    };
    const schedule = () => {
      clearTimeout(timer);
      if (document.hidden || sessionStorage.getItem(engagedKey)) return;
      const last = Number(sessionStorage.getItem(attentionKey)) || 0;
      if (last && !repeatMs) return;
      const wait = last ? Math.max(0, last + repeatMs - Date.now()) : 0;
      timer = setTimeout(() => { play(); schedule(); }, wait);
    };
    sponsorButton.addEventListener("click", () => {
      sessionStorage.setItem(engagedKey, "1");
      clearTimeout(timer);
    });
    document.addEventListener("visibilitychange", schedule);
    schedule();
  }

  /* Click delegation: theme toggle, mobile menu, code copy, funding
     banner, blueprint filter. */

  document.addEventListener("click", (event) => {
    const themeToggle = event.target.closest('[data-action="toggle-theme"]');
    if (themeToggle) {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(storageKey, next);
      applyTheme(next);
      return;
    }

    const menuToggle = event.target.closest('[data-action="toggle-menu"]');
    if (menuToggle) {
      const header = menuToggle.closest(".site-header");
      if (!header) return;
      const open = header.getAttribute("data-menu-open") === "true";
      header.setAttribute("data-menu-open", open ? "false" : "true");
      menuToggle.setAttribute("aria-expanded", open ? "false" : "true");
      return;
    }

    const copyBtn = event.target.closest('[data-action="copy-code"]');
    if (copyBtn) {
      const block = copyBtn.closest(".codeblock");
      const code = block && block.querySelector("pre");
      if (!code || !navigator.clipboard) return;
      navigator.clipboard.writeText(code.innerText).then(() => {
        const original = copyBtn.textContent;
        copyBtn.setAttribute("data-state", "copied");
        copyBtn.textContent = copyBtn.getAttribute("data-copied-label") || "Copied";
        setTimeout(() => {
          copyBtn.removeAttribute("data-state");
          copyBtn.textContent = original;
        }, 1500);
      });
      return;
    }

    const dismissFunding = event.target.closest('[data-action="dismiss-funding"]');
    if (dismissFunding) {
      localStorage.setItem(fundingKey, "1");
      dismissFunding.closest("[data-funding-banner]").hidden = true;
      return;
    }

    const filterBtn = event.target.closest("[data-blueprint-filter]");
    if (filterBtn) {
      const tag = filterBtn.getAttribute("data-blueprint-filter");
      const group = filterBtn.closest(".blueprints");
      if (!group) return;
      group.querySelectorAll("[data-blueprint-filter]").forEach((b) => {
        const active = b === filterBtn;
        b.setAttribute("data-active", active ? "true" : "false");
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      group.querySelectorAll(".blueprint-card").forEach((card) => {
        const tags = (card.getAttribute("data-tags") || "").split(",");
        const show = tag === "*" || tags.includes(tag);
        card.setAttribute("data-hidden", show ? "false" : "true");
      });
    }
  });
})();
