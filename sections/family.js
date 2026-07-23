export default function createFamily(content) {
  const section = document.createElement("section");
  section.className = "family-section";
  section.innerHTML = `
    <div class="family-rule"></div>
    <div class="family-list">
      <p class="family-row">
        <span class="parent-name father">${content.groomParents.father}</span>
        <span class="separator">·</span>
        <span class="parent-name mother">${content.groomParents.mother}</span>
        <span class="possessive">의</span>
        <span class="relationship">장남</span>
        <span class="role">신랑</span>
        <span class="name">${content.groomName}</span>
      </p>
      <p class="family-row">
        <span class="parent-name father">${content.brideParents.father}</span>
        <span class="separator">·</span>
        <span class="parent-name mother">${content.brideParents.mother}</span>
        <span class="possessive">의</span>
        <span class="relationship">장녀</span>
        <span class="role">신부</span>
        <span class="name">${content.brideName}</span>
      </p>
    </div>
  `;

  return section;
}
