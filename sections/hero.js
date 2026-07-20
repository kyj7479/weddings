export default function createHero(content) {
  const section = document.createElement("section");
  section.className = "hero";
  section.innerHTML = `
    <div class="topline"><span>THE WEDDING DAY</span><span>${content.shortDate}</span></div>
    <figure class="photo-frame">
      <img src="${content.heroPhoto}" alt="${content.heroPhotoAlt}" />
    </figure>
    <p class="intro">${content.heroLabel}</p>
    <h1>${content.groomName}<i>&amp;</i>${content.brideName}</h1>
    <p class="date">${content.englishDate}</p>
    <p class="notice">${content.heroMessage}</p>
  `;

  return section;
}
