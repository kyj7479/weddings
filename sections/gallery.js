function createCarouselItem(photo, index) {
  return `
    <button class="gallery-carousel-item" type="button" data-gallery-index="${index}" aria-label="${photo.alt} 크게 보기">
      <img src="${photo.thumb || photo.src}" alt="${photo.alt}" loading="lazy" draggable="false" />
    </button>
  `;
}

export default function createGallery(content) {
  const photos = content.gallery;
  const repeatedPhotos = [...photos, ...photos, ...photos];
  const section = document.createElement("section");
  section.className = "gallery-section";
  section.innerHTML = `
    <div class="gallery-heading">
      <h2>${content.galleryTitle}</h2>
      <p>${content.galleryIntro}</p>
    </div>
    <button class="gallery-feature" type="button" aria-label="대표 사진 크게 보기">
      <img class="gallery-feature-image" src="${photos[0].src}" alt="${photos[0].alt}" />
      <span class="gallery-feature-count">01 / ${String(photos.length).padStart(2, "0")}</span>
    </button>
    <div class="gallery-carousel" aria-label="웨딩 사진 갤러리">
      <div class="gallery-carousel-track">
        ${repeatedPhotos.map((photo, index) => createCarouselItem(photo, index % photos.length)).join("")}
      </div>
    </div>
    <p class="gallery-hint">DRAG OR SWIPE TO EXPLORE</p>
    <dialog class="gallery-lightbox" aria-label="웨딩 사진 크게 보기">
      <button class="lightbox-close" type="button" aria-label="닫기">×</button>
      <button class="lightbox-arrow previous" type="button" aria-label="이전 사진">‹</button>
      <img class="lightbox-image" alt="" />
      <button class="lightbox-arrow next" type="button" aria-label="다음 사진">›</button>
      <p class="lightbox-count"></p>
    </dialog>
  `;

  const carousel = section.querySelector(".gallery-carousel");
  const track = section.querySelector(".gallery-carousel-track");
  const feature = section.querySelector(".gallery-feature");
  const featureImage = section.querySelector(".gallery-feature-image");
  const featureCount = section.querySelector(".gallery-feature-count");
  const dialog = section.querySelector(".gallery-lightbox");
  const lightboxImage = section.querySelector(".lightbox-image");
  const counter = section.querySelector(".lightbox-count");
  const items = [...section.querySelectorAll(".gallery-carousel-item")];
  let activeIndex = 0;
  let itemStep = 0;
  let isDragging = false;
  let dragMoved = false;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let animationFrame;

  const getItemStep = () => {
    const item = items[0];
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    return item.offsetWidth + gap;
  };

  const updateFeature = () => {
    const photo = photos[activeIndex];
    featureImage.src = photo.src;
    featureImage.alt = photo.alt;
    featureCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
  };

  const updateFocusedItem = () => {
    const carouselCenter = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
    let closestItem;
    let closestDistance = Infinity;
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - carouselCenter);
      item.classList.toggle("is-active", distance < rect.width * .42);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });

    const nextIndex = Number(closestItem.dataset.galleryIndex);
    if (nextIndex !== activeIndex) {
      activeIndex = nextIndex;
      updateFeature();
    }
  };

  const keepInfinite = () => {
    const cycleWidth = itemStep * photos.length;
    if (!cycleWidth) return;
    if (carousel.scrollLeft < cycleWidth * .45) carousel.scrollLeft += cycleWidth;
    if (carousel.scrollLeft > cycleWidth * 2.55) carousel.scrollLeft -= cycleWidth;
  };

  const initializeCarousel = () => {
    itemStep = getItemStep();
    const sideSpace = Math.max((carousel.clientWidth - items[0].offsetWidth) / 2, 0);
    track.style.paddingInline = `${sideSpace}px`;
    carousel.scrollLeft = itemStep * photos.length;
    updateFocusedItem();
  };

  const onScroll = () => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = window.requestAnimationFrame(() => {
      keepInfinite();
      updateFocusedItem();
    });
  };

  const updateLightbox = () => {
    const photo = photos[activeIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
  };

  const updateLightboxHistory = (method) => {
    const state = { galleryLightbox: true, photoIndex: activeIndex };
    const url = `#gallery-${activeIndex + 1}`;
    window.history[method](state, "", url);
  };

  const openLightbox = () => {
    updateLightbox();
    updateLightboxHistory("pushState");
    dialog.showModal();
  };

  carousel.addEventListener("scroll", onScroll, { passive: true });
  carousel.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    isDragging = true;
    dragMoved = false;
    dragStartX = event.clientX;
    dragStartScroll = carousel.scrollLeft;
    carousel.setPointerCapture(event.pointerId);
    carousel.classList.add("is-dragging");
  });
  carousel.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    const distance = event.clientX - dragStartX;
    if (Math.abs(distance) > 4) dragMoved = true;
    carousel.scrollLeft = dragStartScroll - distance;
  });
  carousel.addEventListener("pointerup", () => {
    isDragging = false;
    window.setTimeout(() => { dragMoved = false; }, 120);
    carousel.classList.remove("is-dragging");
  });
  carousel.addEventListener("pointercancel", () => {
    isDragging = false;
    carousel.classList.remove("is-dragging");
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      if (isDragging || dragMoved) return;
      activeIndex = Number(item.dataset.galleryIndex);
      updateFeature();
      carousel.scrollTo({
        left: item.offsetLeft - (carousel.clientWidth - item.offsetWidth) / 2,
        behavior: "smooth",
      });
    });
  });

  feature.addEventListener("click", () => {
    openLightbox();
  });

  section.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
  section.querySelector(".previous").addEventListener("click", () => {
    activeIndex = (activeIndex - 1 + photos.length) % photos.length;
    updateLightbox();
    updateLightboxHistory("replaceState");
  });
  section.querySelector(".next").addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % photos.length;
    updateLightbox();
    updateLightboxHistory("replaceState");
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") section.querySelector(".previous").click();
    if (event.key === "ArrowRight") section.querySelector(".next").click();
  });
  dialog.addEventListener("close", () => {
    if (window.history.state?.galleryLightbox) window.history.back();
  });
  window.addEventListener("popstate", (event) => {
    const { state } = event;
    if (state?.galleryLightbox) {
      activeIndex = state.photoIndex;
      updateLightbox();
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  });

  window.requestAnimationFrame(initializeCarousel);
  return section;
}
