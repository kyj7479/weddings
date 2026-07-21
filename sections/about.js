function createPortrait(profile, name) {
  if (profile.photo) {
    return `<img src="${profile.photo}" alt="${profile.photoAlt}" />`;
  }

  return `<span class="portrait-placeholder" aria-label="${profile.photoAlt}">PHOTO<br />COMING SOON</span>`;
}

function createProfile(role, name, profile) {
  return `
    <article class="about-profile ${role.toLowerCase()}-profile">
      <div class="portrait">${createPortrait(profile, name)}</div>
      <div class="profile-copy">
        <p class="profile-role">${role}</p>
        <h3>${name}</h3>
        <p class="profile-introduction">${profile.introduction}</p>
      </div>
    </article>
  `;
}

export default function createAbout(content) {
  const section = document.createElement("section");
  section.className = "about-section";
  section.innerHTML = `
    <div class="about-heading">
      <h2>${content.about.title}</h2>
      <p>${content.about.subtitle}</p>
    </div>
    <div class="about-profiles">
      ${createProfile("GROOM", content.groomName, content.about.groom)}
      ${createProfile("BRIDE", content.brideName, content.about.bride)}
    </div>
  `;

  return section;
}
