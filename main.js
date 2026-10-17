(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  const year = document.querySelector("#current-year");
  const carousel = document.querySelector("[data-carousel]");

  if (year) year.textContent = String(new Date().getFullYear());

  if (carousel) {
    const rotationButton = carousel.querySelector("[data-carousel-rotation]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let manuallyPaused = reduceMotion.matches;
    let slideFocused = false;

    const syncRotation = () => {
      const paused = manuallyPaused || slideFocused || document.hidden;
      carousel.classList.toggle("is-paused", paused);
      carousel.classList.toggle("is-running", !paused);
      rotationButton.setAttribute("aria-pressed", String(manuallyPaused));
      rotationButton.setAttribute("aria-label", manuallyPaused ? "Iniciar apresentação" : "Pausar apresentação");
    };

    rotationButton.addEventListener("click", () => {
      manuallyPaused = !manuallyPaused;
      syncRotation();
    });
    carousel.addEventListener("focusout", (event) => {
      if (event.target.closest(".hero-slide__link")) {
        slideFocused = event.relatedTarget instanceof Element && Boolean(event.relatedTarget.closest(".hero-slide__link"));
        syncRotation();
      }
    });
    carousel.addEventListener("focusin", (event) => {
      if (event.target.closest(".hero-slide__link")) {
        slideFocused = true;
        syncRotation();
      }
    });
    document.addEventListener("visibilitychange", syncRotation);
    reduceMotion.addEventListener("change", (event) => {
      if (event.matches) manuallyPaused = true;
      syncRotation();
    });

    syncRotation();
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
        nav.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
        nav.classList.remove("is-open");
        menuButton.focus();
      }
    });
  }

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const motion = gsap.matchMedia();
  motion.add(
    {
      desktop: "(min-width: 761px)",
      compact: "(max-width: 760px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    },
    (context) => {
      const { desktop, reduceMotion } = context.conditions;
      const heroItems = ".hero-eyebrow, .hero-title__line > span, .hero-intro, .hero-actions > *, .hero-note, .hero-visual";

      if (reduceMotion) {
        gsap.set(heroItems + ", [data-reveal]", { clearProps: "all" });
        return;
      }

      const entrance = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.12
      });

      entrance
        .from(".brand", { autoAlpha: 0, y: -10, duration: 0.55 })
        .from(".site-nav > a", { autoAlpha: 0, y: -8, duration: 0.45, stagger: 0.055 }, "-=0.32")
        .from(".hero-eyebrow", { autoAlpha: 0, y: 12, duration: 0.52 }, "-=0.12")
        .from(".hero-title__line > span", { yPercent: 108, duration: 0.92, stagger: 0.1, ease: "power4.out" }, "-=0.18")
        .from(".hero-intro", { autoAlpha: 0, y: 18, duration: 0.64 }, "-=0.5")
        .from(".hero-actions > *", { autoAlpha: 0, y: 12, duration: 0.48, stagger: 0.1 }, "-=0.35")
        .from(".hero-note", { autoAlpha: 0, y: 12, duration: 0.5 }, "-=0.28")
        .from(".hero-media", { autoAlpha: 0, y: 22, scale: 0.97, duration: 1.1, ease: "power3.out" }, "-=0.85");

      gsap.utils.toArray("[data-reveal]").forEach((element, index) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: index % 2 === 0 ? 28 : 20,
          duration: 0.78,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true
          }
        });
      });

      gsap.from(".service-row__symbol", {
        scale: 0.82,
        rotate: -8,
        duration: 0.65,
        stagger: 0.12,
        ease: "back.out(1.35)",
        scrollTrigger: {
          trigger: ".service-list",
          start: "top 78%",
          once: true
        }
      });

      if (desktop) {
        gsap.to(".hero-media", {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.85
          }
        });
      }
    }
  );
})();
