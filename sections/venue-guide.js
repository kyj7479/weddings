function createCard(card) {
  if (card.items) {
    return `
      <article class="venue-guide-card venue-guide-card-combined">
        <div class="venue-guide-card-content">
          <span class="venue-guide-card-label">${card.label}</span>
          <h3>${card.title}</h3>
          <div class="venue-guide-items">
            ${card.items.map((item) => `
              <section class="venue-guide-item">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                ${item.image ? `<img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />` : ""}
                ${item.actionUrl ? `<a class="venue-guide-card-link" href="${item.actionUrl}" target="_blank" rel="noreferrer">${item.actionLabel}<span aria-hidden="true">↗</span></a>` : ""}
              </section>
            `).join("")}
          </div>
        </div>
      </article>
    `;
  }

  if (card.images) {
    return `
      <article class="venue-guide-card venue-guide-dining-card">
        <div class="venue-guide-card-content">
          <span class="venue-guide-card-label">${card.label}</span>
          <h3>${card.title}</h3>
          <p class="venue-guide-dining-description">${card.description}</p>
          <div class="venue-guide-dining-images">
            ${card.images.map((image) => `<img src="${image.src}" alt="${image.alt}" loading="lazy" />`).join("")}
          </div>
        </div>
      </article>
    `;
  }

  const image = card.image
    ? `<img class="venue-guide-card-image" src="${card.image}" alt="${card.imageAlt}" loading="lazy" />`
    : "";
  const action = card.actionUrl
    ? `<a class="venue-guide-card-link" href="${card.actionUrl}" target="_blank" rel="noreferrer">${card.actionLabel}<span aria-hidden="true">↗</span></a>`
    : "";

  return `
    <article class="venue-guide-card ${card.image ? "has-image" : ""}">
      ${image}
      <div class="venue-guide-card-content">
        <span class="venue-guide-card-label">${card.label}</span>
        <h3>${card.title}</h3>
        <p>${card.description}</p>
        ${action}
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
    <div class="venue-guide-carousel" aria-label="예식장 이용 안내">
      <div class="venue-guide-track">
        ${guide.cards.map(createCard).join("")}
      </div>
    </div>
    ${guide.cards.length > 1 ? `
      <div class="venue-guide-indicator" aria-hidden="true">
        ${guide.cards.map((_, index) => `<span class="${index === 0 ? "is-active" : ""}"></span>`).join("")}
      </div>
    ` : ""}
  `;

  const carousel = section.querySelector(".venue-guide-carousel");
  const cards = [...section.querySelectorAll(".venue-guide-card")];
  const indicator = [...section.querySelectorAll(".venue-guide-indicator span")];
  let isDragging = false;
  let dragMoved = false;
  let startX = 0;
  let startScroll = 0;
  let animationFrame;

  const updateIndicator = () => {
    const center = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
    let activeCard = 0;
    let closestDistance = Infinity;
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeCard = index;
      }
    });
    indicator.forEach((dot, index) => dot.classList.toggle("is-active", index === activeCard));
  };

  carousel.addEventListener("scroll", () => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = window.requestAnimationFrame(updateIndicator);
  }, { passive: true });
  carousel.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    isDragging = true;
    dragMoved = false;
    startX = event.clientX;
    startScroll = carousel.scrollLeft;
    carousel.setPointerCapture(event.pointerId);
    carousel.classList.add("is-dragging");
  });
  carousel.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 4) dragMoved = true;
    carousel.scrollLeft = startScroll - distance;
  });
  carousel.addEventListener("pointerup", () => {
    isDragging = false;
    carousel.classList.remove("is-dragging");
    window.setTimeout(() => { dragMoved = false; }, 120);
  });
  carousel.addEventListener("pointercancel", () => {
    isDragging = false;
    carousel.classList.remove("is-dragging");
  });
  carousel.addEventListener("click", (event) => {
    if (dragMoved) event.preventDefault();
  });

  return section;
}
