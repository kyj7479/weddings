function createGuideItem(item) {
  return `
    <section class="venue-guide-item">
      <h4>${item.title}</h4>
      <p>${item.description}</p>
      ${item.image ? `<img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />` : ""}
      ${item.actionUrl ? `<a class="venue-guide-card-link" href="${item.actionUrl}" target="_blank" rel="noreferrer">${item.actionLabel}<span aria-hidden="true">↗</span></a>` : ""}
    </section>
  `;
}

function createGuideSheet(cards) {
  const venue = cards.find((card) => card.items);
  const dining = cards.find((card) => card.images);
  const label = venue?.label || dining?.label || "VENUE GUIDE";

  return `
    <article class="venue-guide-card venue-guide-sheet">
      <div class="venue-guide-sheet-content">
        ${venue ? `
          <header class="venue-guide-sheet-header">
            <span class="venue-guide-card-label">${label}</span>
            <h3>${venue.title}</h3>
          </header>
          <div class="venue-guide-items">
            ${venue.items.map(createGuideItem).join("")}
          </div>
        ` : ""}
        ${venue && dining ? '<div class="venue-guide-sheet-divider" aria-hidden="true"><span></span></div>' : ""}
        ${dining ? `
          <section class="venue-guide-dining">
            <h3>${dining.title}</h3>
            <p class="venue-guide-dining-description">${dining.description}</p>
            <div class="venue-guide-dining-images">
              ${dining.images.map((image) => `<img src="${image.src}" alt="${image.alt}" loading="lazy" />`).join("")}
            </div>
          </section>
        ` : ""}
      </div>
    </article>
  `;
}

export default function createVenueGuide(content) {
  const guide = content.venueGuide;
  const section = document.createElement("section");
  section.className = "venue-guide-section";
  section.innerHTML = `
    <header class="venue-guide-heading">
      <h2>${guide.title}</h2>
      <p>${guide.intro}</p>
    </header>
    ${createGuideSheet(guide.cards)}
  `;

  return section;
}
