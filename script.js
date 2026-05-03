// THE MEDISPA — small enhancement script.
// Sticky-nav state, treatments dropdown, testimonial pager, scroll reveal.

(() => {
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 4);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Treatments dropdown — click + hover open, click-outside / Escape close.
  const dd = document.querySelector("[data-dropdown]");
  if (dd) {
    const trigger = dd.querySelector("a");
    const open = () => { dd.classList.add("is-open"); trigger.setAttribute("aria-expanded", "true"); };
    const close = () => { dd.classList.remove("is-open"); trigger.setAttribute("aria-expanded", "false"); };
    dd.addEventListener("mouseenter", open);
    dd.addEventListener("mouseleave", close);
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      dd.classList.contains("is-open") ? close() : open();
    });
    document.addEventListener("click", (e) => { if (!dd.contains(e.target)) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  // Testimonial pager.
  const dots = [...document.querySelectorAll(".testi__dot")];
  const slides = [...document.querySelectorAll(".testi__slide")];
  if (dots.length && slides.length) {
    let i = 0;
    const show = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
    };
    dots.forEach((d, idx) => d.addEventListener("click", () => { show(idx); restart(); }));
    let timer;
    const restart = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 6500); };
    restart();
  }

  // Scroll reveal.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Mobile burger toggle (rough drawer using a class on body).
  const burger = document.querySelector(".nav__burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const links = document.querySelector(".nav__links");
      if (!links) return;
      const open = links.classList.toggle("is-open-mobile");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();
