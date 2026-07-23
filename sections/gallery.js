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
  const lightboxTouches = new Map();
  let swipeStart = null;
  let panStart = null;
  let pinchStartDistance = 0;
  let pinchStartScale = 1;
  let zoomScale = 1;
  let zoomX = 0;
  let zoomY = 0;
  let lastTapTime = 0;

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

  const updateLightbox = (direction) => {
    const photo = photos[activeIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;

    if (direction) {
      lightboxImage.classList.remove("slide-from-next", "slide-from-previous");
      void lightboxImage.offsetWidth;
      lightboxImage.classList.add(direction === "next" ? "slide-from-next" : "slide-from-previous");
    }
  };

  const resetZoom = () => {
    zoomScale = 1;
    zoomX = 0;
    zoomY = 0;
    lightboxImage.style.transform = "";
    lightboxImage.classList.remove("is-zoomed");
  };

  const applyZoom = () => {
    if (zoomScale <= 1) {
      resetZoom();
      return;
    }
    lightboxImage.style.transform = `translate(${zoomX}px, ${zoomY}px) scale(${zoomScale})`;
    lightboxImage.classList.add("is-zoomed");
  };

  const getTouchPoints = () => [...lightboxTouches.values()];
  const getDistance = ([first, second]) => Math.hypot(second.x - first.x, second.y - first.y);

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

  const showPreviousPhoto = () => {
    resetZoom();
    activeIndex = (activeIndex - 1 + photos.length) % photos.length;
    updateLightbox("previous");
    updateLightboxHistory("replaceState");
  };

  const showNextPhoto = () => {
    resetZoom();
    activeIndex = (activeIndex + 1) % photos.length;
    updateLightbox("next");
    updateLightboxHistory("replaceState");
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
    showPreviousPhoto();
  });
  section.querySelector(".next").addEventListener("click", () => {
    showNextPhoto();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showPreviousPhoto();
    if (event.key === "ArrowRight") showNextPhoto();
  });
  dialog.addEventListener("wheel", (event) => {
    if (event.target.closest(".lightbox-close")) return;
    event.preventDefault();
    zoomScale = Math.min(3, Math.max(1, zoomScale + (event.deltaY < 0 ? .16 : -.16)));
    applyZoom();
  }, { passive: false });
  dialog.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch" || event.target.closest(".lightbox-close")) return;
    dialog.setPointerCapture(event.pointerId);
    lightboxTouches.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = getTouchPoints();

    if (points.length === 1) {
      const now = Date.now();
      if (now - lastTapTime < 260) resetZoom();
      lastTapTime = now;
      swipeStart = { x: event.clientX, y: event.clientY };
      panStart = { x: event.clientX, y: event.clientY, zoomX, zoomY };
    }

    if (points.length === 2) {
      swipeStart = null;
      pinchStartDistance = getDistance(points);
      pinchStartScale = zoomScale;
    }
  });
  dialog.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "touch" || !lightboxTouches.has(event.pointerId)) return;
    lightboxTouches.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = getTouchPoints();

    if (points.length >= 2) {
      zoomScale = Math.min(3, Math.max(1, pinchStartScale * (getDistance(points) / pinchStartDistance)));
      applyZoom();
      return;
    }

    if (zoomScale > 1 && panStart) {
      zoomX = panStart.zoomX + event.clientX - panStart.x;
      zoomY = panStart.zoomY + event.clientY - panStart.y;
      applyZoom();
    }
  });
  dialog.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "touch" || !lightboxTouches.has(event.pointerId)) return;
    const touchStart = swipeStart;
    lightboxTouches.delete(event.pointerId);

    if (lightboxTouches.size === 0 && zoomScale === 1 && touchStart) {
      const swipeX = event.clientX - touchStart.x;
      const swipeY = event.clientY - touchStart.y;
      if (Math.abs(swipeX) > 42 && Math.abs(swipeX) > Math.abs(swipeY)) {
        if (swipeX < 0) showNextPhoto();
        else showPreviousPhoto();
      }
    }

    if (lightboxTouches.size < 2) {
      const [remainingTouch] = getTouchPoints();
      if (remainingTouch) panStart = { x: remainingTouch.x, y: remainingTouch.y, zoomX, zoomY };
    }
    swipeStart = null;
  });
  dialog.addEventListener("pointercancel", (event) => {
    lightboxTouches.delete(event.pointerId);
    swipeStart = null;
  });
  dialog.addEventListener("close", () => {
    lightboxTouches.clear();
    resetZoom();
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
