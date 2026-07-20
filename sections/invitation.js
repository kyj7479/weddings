export default function createInvitation(content) {
  const section = document.createElement("section");
  section.className = "details";
  section.id = "location";
  section.innerHTML = `
    <div class="eyebrow">Invitation</div>
    <h2>${content.invitationTitle}</h2>
    <p class="message">${content.invitationMessage}</p>
    <hr class="divider" />
    <div class="schedule"><strong>${content.koreanDate}</strong><span>${content.venue}</span></div>
    <p class="location">${content.address}</p>
    <div class="buttons">
      <a class="button" href="#location">${content.locationButton}</a>
      <a class="button primary" href="tel:${content.contactPhone.replace(/[^0-9+]/g, "")}">${content.contactButton}</a>
    </div>
  `;

  return section;
}
