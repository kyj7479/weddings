export default function createFamily(content) {
  const section = document.createElement("section");
  section.className = "family-section";
  section.innerHTML = `
    <div class="family-rule"></div>
    <div class="family-list">
      <p class="family-row">
        <span class="parents">${content.groomParents.father} · ${content.groomParents.mother}의</span>
        <span class="relationship">아들</span>
        <span class="role">신랑</span>
        <span class="name">${content.groomName}</span>
      </p>
      <p class="family-row">
        <span class="parents">${content.brideParents.father} · ${content.brideParents.mother}의</span>
        <span class="relationship">딸</span>
        <span class="role">신부</span>
        <span class="name">${content.brideName}</span>
      </p>
    </div>
  `;

  return section;
}
