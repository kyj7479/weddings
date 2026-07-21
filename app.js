import weddingConfig from "./data/wedding.config.js";
import sectionOrder from "./data/sections.config.js";
import createHero from "./sections/hero.js";
import createInvitation from "./sections/invitation.js";
import createCalendar from "./sections/calendar.js";
import createFamily from "./sections/family.js";
import createAbout from "./sections/about.js";
import formatWedding from "./lib/format-wedding.js";

const sectionRegistry = {
  hero: createHero,
  invitation: createInvitation,
  calendar: createCalendar,
  family: createFamily,
  about: createAbout,
};

const content = formatWedding(weddingConfig);
const invitation = document.querySelector("#invitation");

document.title = "김앤장웨딩청첩장";

sectionOrder
  .filter((section) => section.enabled)
  .forEach((section) => {
    const createSection = sectionRegistry[section.id];

    if (!createSection) {
      console.warn(`등록되지 않은 청첩장 섹션입니다: ${section.id}`);
      return;
    }

    invitation.append(createSection(content));
  });
