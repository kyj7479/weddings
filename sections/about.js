function createPortrait(profile, name) {
  if (profile.photo) {
    return `
      <button class="portrait" type="button" data-profile-photo="${profile.fullPhoto || profile.photo}" data-profile-alt="${profile.photoAlt}" aria-label="${name} 사진 크게 보기">
        <img src="${profile.photo}" alt="${profile.photoAlt}" />
      </button>
    `;
  }

  return `<div class="portrait"><span class="portrait-placeholder" aria-label="${profile.photoAlt}">PHOTO<br />COMING SOON</span></div>`;
}

function createProfile(role, name, profile) {
  return `
    <article class="about-profile ${role.toLowerCase()}-profile">
      ${createPortrait(profile, name)}
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
    <dialog class="about-lightbox" aria-label="인물 사진 크게 보기">
      <button class="about-lightbox-close" type="button" aria-label="닫기">×</button>
      <img class="about-lightbox-image" alt="" />
    </dialog>
  `;

  const dialog = section.querySelector(".about-lightbox");
  const fullImage = section.querySelector(".about-lightbox-image");
  section.querySelectorAll("[data-profile-photo]").forEach((portrait) => {
    portrait.addEventListener("click", () => {
      fullImage.src = portrait.dataset.profilePhoto;
      fullImage.alt = portrait.dataset.profileAlt;
      dialog.showModal();
    });
  });
  section.querySelector(".about-lightbox-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  return section;
}
