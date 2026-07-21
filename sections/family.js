export default function createFamily(content) {
  const section = document.createElement("section");
  section.className = "family-section";
  section.innerHTML = `
    <div class="family-rule"></div>
    <p>${content.groomParents.father} · ${content.groomParents.mother}의 아들&nbsp;&nbsp;${content.groomName}</p>
    <p>${content.brideParents.father} · ${content.brideParents.mother}의 딸&nbsp;&nbsp;${content.brideName}</p>
  `;

  return section;
}
