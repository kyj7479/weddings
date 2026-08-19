export default function createHero(content) {
  const section = document.createElement("section");
  section.className = "hero";
  section.innerHTML = `
    <div class="topline"><span>THE WEDDING DAY</span><span>${content.shortDate}</span></div>
    <button class="photo-frame hero-photo-trigger" type="button" aria-label="대문 사진 크게 보기">
      <img src="${content.heroPhoto}" alt="${content.heroPhotoAlt}" />
    </button>
    <p class="intro">${content.heroLabel}</p>
    <h1>${content.groomName}<i>&amp;</i>${content.brideName}</h1>
    <p class="date">${content.englishDate}</p>
    <p class="notice">${content.heroMessage}</p>
    <dialog class="hero-lightbox" aria-label="대문 사진 크게 보기">
      <button class="hero-lightbox-close" type="button" aria-label="닫기">×</button>
      <img class="hero-lightbox-image" alt="" />
    </dialog>
  `;

  const trigger = section.querySelector(".hero-photo-trigger");
  const dialog = section.querySelector(".hero-lightbox");
  const fullImage = section.querySelector(".hero-lightbox-image");
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

  const openLightbox = () => {
    resetZoom();
    fullImage.src = content.heroFullPhoto || content.heroPhoto;
    fullImage.alt = content.heroPhotoAlt;
    window.history.pushState({ ...(window.history.state || {}), heroLightbox: true }, "", "#hero-photo");
    dialog.showModal();
  };

  trigger.addEventListener("click", openLightbox);
  section.querySelector(".hero-lightbox-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("wheel", (event) => {
    if (event.target.closest(".hero-lightbox-close")) return;
    event.preventDefault();
    zoomScale = Math.min(3, Math.max(1, zoomScale + (event.deltaY < 0 ? .16 : -.16)));
    applyZoom();
  }, { passive: false });
  dialog.addEventListener("close", () => {
    resetZoom();
    if (window.history.state?.heroLightbox) window.history.back();
  });
  window.addEventListener("popstate", (event) => {
    if (event.state?.heroLightbox) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  });

  return section;
}
