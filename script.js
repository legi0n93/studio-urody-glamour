const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");

const protectPolishShortWords = (element) => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let currentNode = walker.nextNode();

  while (currentNode) {
    currentNode.nodeValue = currentNode.nodeValue.replace(
      /(^|[\s([{"„])([aiouwzAIUOWZ])\s+(?=\S)/gu,
      "$1$2\u00a0"
    );
    currentNode = walker.nextNode();
  }
};

const preventWidow = (element) => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let currentNode = walker.nextNode();

  while (currentNode) {
    if (currentNode.nodeValue.trim()) textNodes.push(currentNode);
    currentNode = walker.nextNode();
  }

  for (let index = textNodes.length - 1; index >= 0; index -= 1) {
    const node = textNodes[index];
    const value = node.nodeValue;
    const ending = value.match(/(\S+)(\s+)(\S+)(\s*)$/u);

    if (!ending) continue;

    node.nodeValue = `${value.slice(0, ending.index)}${ending[1]}\u00a0${ending[3]}${ending[4]}`;
    break;
  }
};

const typographicElements = document.querySelectorAll(
  [
    "h1",
    "h2",
    "h3",
    "p",
    "blockquote",
    "figcaption",
    "address",
    "dt",
    "dd",
    ".button",
    ".text-link",
    ".hero-note a",
    ".service-card > a",
    ".messenger-button",
    ".detail-group > a",
  ].join(", ")
);

typographicElements.forEach((element) => {
  protectPolishShortWords(element);
  preventWidow(element);
});

if (year) {
  year.textContent = new Date().getFullYear();
}

const setMenuState = (isOpen) => {
  if (!nav || !navToggle) return;

  nav.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
  document.body.classList.toggle("nav-open", isOpen);
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  setMenuState(!isOpen);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuState(false);
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll("[data-reveal]");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.08 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}
