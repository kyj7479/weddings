import weddingConfig from "./data/wedding.config.js";
import sectionOrder from "./data/sections.config.js";
import createHero from "./sections/hero.js";
import createInvitation from "./sections/invitation.js";
import createCalendar from "./sections/calendar.js";
import createFamily from "./sections/family.js";
import createAbout from "./sections/about.js";
import createGallery from "./sections/gallery.js";
import createLocation from "./sections/location.js";
import createVenueGuide from "./sections/venue-guide.js";
import createGuestbook from "./sections/guestbook.js";
import createShare from "./sections/share.js";
import formatWedding from "./lib/format-wedding.js";

const sectionRegistry = {
  hero: createHero,
  invitation: createInvitation,
  calendar: createCalendar,
  family: createFamily,
  about: createAbout,
  gallery: createGallery,
  location: createLocation,
  venueGuide: createVenueGuide,
  guestbook: createGuestbook,
  share: createShare,
};

const content = formatWedding(weddingConfig);
const invitation = document.querySelector("#invitation");

if (new URLSearchParams(window.location.search).get("debug") === "viewport") {
  const viewportBadge = document.createElement("output");
  viewportBadge.className = "viewport-debug";
  viewportBadge.setAttribute("aria-label", "현재 반응형 화면 크기");
  const updateViewportBadge = () => {
    viewportBadge.textContent = `${window.innerWidth}px × ${window.innerHeight}px`;
  };
  updateViewportBadge();
  window.addEventListener("resize", updateViewportBadge);
  document.body.append(viewportBadge);
}

const topButton = document.createElement("button");
topButton.className = "floating-top";
topButton.type = "button";
topButton.setAttribute("aria-label", "맨 위로 이동");
topButton.innerHTML = '<span aria-hidden="true">↑</span><small>TOP</small>';
document.body.append(topButton);

const updateTopButton = () => {
  topButton.classList.toggle("is-visible", window.scrollY > 420);
};

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
window.addEventListener("scroll", updateTopButton, { passive: true });
updateTopButton();

const sectionObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 }) : null;

document.title = "김앤장웨딩청첩장";

sectionOrder
  .filter((section) => section.enabled)
  .forEach((section) => {
    const createSection = sectionRegistry[section.id];

    if (!createSection) {
      console.warn(`등록되지 않은 청첩장 섹션입니다: ${section.id}`);
      return;
    }

    const sectionElement = createSection(content);
    sectionElement.classList.add("section-reveal");
    invitation.append(sectionElement);
    if (sectionObserver) sectionObserver.observe(sectionElement);
    else sectionElement.classList.add("is-visible");
  });
