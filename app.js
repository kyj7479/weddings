import weddingConfig from "./data/wedding.config.js";
import sectionOrder from "./data/sections.config.js";
import createHero from "./sections/hero.js";
import createInvitation from "./sections/invitation.js";
import createCalendar from "./sections/calendar.js";
import formatWedding from "./lib/format-wedding.js";

const sectionRegistry = {
  hero: createHero,
  invitation: createInvitation,
  calendar: createCalendar,
};

const content = formatWedding(weddingConfig);
const invitation = document.querySelector("#invitation");

document.title = `${content.groomName} & ${content.brideName}의 결혼식`;

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
