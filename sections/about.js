function createPortrait(profile, name, profileId) {
  if (profile.photo) {
    return `
      <button class="portrait" type="button" data-profile-id="${profileId}" data-profile-photo="${profile.fullPhoto || profile.photo}" data-profile-alt="${profile.photoAlt}" aria-label="${name} 사진 크게 보기">
        <img src="${profile.photo}" alt="${profile.photoAlt}" />
      </button>
    `;
  }

  return `<div class="portrait"><span class="portrait-placeholder" aria-label="${profile.photoAlt}">PHOTO<br />COMING SOON</span></div>`;
}

function createProfile(role, name, profile) {
  const introduction = profile.introduction
    .split("\n")
    .map((line) => `<span class="profile-introduction-line">${line}</span>`)
    .join("");

  return `
    <article class="about-profile ${role.toLowerCase()}-profile">
      <div class="profile-card-header">
        ${createPortrait(profile, name, role.toLowerCase())}
        <div class="profile-copy">
          <p class="profile-role">${role}</p>
          <h3>${name}</h3>
        </div>
      </div>
      <p class="profile-introduction">${introduction}</p>
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
  let zoomScale = 1;
  const resetZoom = () => {
    zoomScale = 1;
    fullImage.style.transform = "";
    fullImage.classList.remove("is-zoomed");
  };
  const applyZoom = () => {
    if (zoomScale <= 1) {
      resetZoom();
      return;
    }
    fullImage.style.transform = `scale(${zoomScale})`;
    fullImage.classList.add("is-zoomed");
  };
  const showPhoto = (photo, alt) => {
    resetZoom();
    fullImage.src = photo;
    fullImage.alt = alt;
  };
  const openLightbox = (profile) => {
    showPhoto(profile.photo, profile.alt);
    window.history.pushState({ aboutLightbox: true, ...profile }, "", `#about-${profile.id}`);
    dialog.showModal();
  };

  section.querySelectorAll("[data-profile-photo]").forEach((portrait) => {
    portrait.addEventListener("click", () => {
      openLightbox({
        id: portrait.dataset.profileId,
        photo: portrait.dataset.profilePhoto,
        alt: portrait.dataset.profileAlt,
      });
    });
  });
  section.querySelector(".about-lightbox-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("wheel", (event) => {
    if (event.target.closest(".about-lightbox-close")) return;
    event.preventDefault();
    zoomScale = Math.min(3, Math.max(1, zoomScale + (event.deltaY < 0 ? .16 : -.16)));
    applyZoom();
  }, { passive: false });
  dialog.addEventListener("close", () => {
    resetZoom();
    if (window.history.state?.aboutLightbox) window.history.back();
  });
  window.addEventListener("popstate", (event) => {
    const { state } = event;
    if (state?.aboutLightbox) {
      showPhoto(state.photo, state.alt);
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  });

  return section;
}
