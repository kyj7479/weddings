function createGalleryWallItem(photo, index, position, navigationNumber, useFullImage = false) {
  const debugIndex = document.documentElement.dataset.debug === "viewport"
    ? `<span class="gallery-debug-index">${String(navigationNumber).padStart(2, "0")}</span>`
    : "";
  const styleValues = [
    photo.frameRatio && `--gallery-frame-ratio: ${photo.frameRatio}`,
    photo.thumbnailObjectPosition && `--thumbnail-position: ${photo.thumbnailObjectPosition}`,
    photo.thumbnailZoom && `--thumbnail-scale: ${photo.thumbnailZoom}`,
    photo.thumbnailHoverZoom && `--thumbnail-hover-scale: ${photo.thumbnailHoverZoom}`,
  ].filter(Boolean);
  const frameStyle = styleValues.length ? ` style="${styleValues.join("; ")}"` : "";
  const thumbnailClass = photo.thumbnailLandscape ? " is-landscape-thumbnail" : "";

  return `
    <button class="gallery-wall-item gallery-wall-item--${position}${thumbnailClass}${index === 0 ? " is-active" : ""}" type="button" data-gallery-index="${index}"${frameStyle} aria-label="${photo.alt} 크게 보기">
      <span class="gallery-wall-image"><img src="${useFullImage ? photo.src : (photo.thumb || photo.src)}" alt="${photo.alt}" loading="lazy" draggable="false" /></span>
      ${debugIndex}
    </button>
  `;
}

function createGalleryWall(photos, navigation) {
  const clusterSize = 5;
  const useWideFinalCluster = photos.length > 6 && photos.length % clusterSize === 1;
  const regularPhotos = useWideFinalCluster ? photos.slice(0, -6) : photos;
  const clusters = Array.from({ length: Math.ceil(regularPhotos.length / clusterSize) }, (_, clusterIndex) => ({
    startIndex: clusterIndex * clusterSize,
    photos: regularPhotos.slice(clusterIndex * clusterSize, (clusterIndex + 1) * clusterSize),
  }));

  if (useWideFinalCluster) clusters.push({ startIndex: photos.length - 6, photos: photos.slice(-6), wide: true });

  return clusters.map((cluster, clusterIndex) => {
    return `
      <div class="gallery-wall-cluster gallery-wall-cluster--${clusterIndex + 1}${cluster.wide ? " gallery-wall-cluster--wide-grid" : ""}">
        ${cluster.photos.map((photo, index) => {
          const position = index + 1;
          const useFullImage = position === 3 || (cluster.wide && position === 6);
          return createGalleryWallItem(photo, cluster.startIndex + index, position, navigation.indexOf(photo) + 1, useFullImage);
        }).join("")}
      </div>
    `;
  }).join("");
}

export default function createGallery(content) {
  const photos = content.gallery;
  const requestedOrder = content.galleryNavigationOrder || [];
  const navigation = requestedOrder.length === photos.length && new Set(requestedOrder).size === photos.length
    ? requestedOrder.map((position) => photos[position - 1])
    : photos;
  const section = document.createElement("section");
  section.className = "gallery-section";
  section.innerHTML = `
    <div class="gallery-heading">
      <h2>${content.galleryTitle}</h2>
      <p>${content.galleryIntro}</p>
    </div>
    <div class="gallery-wall" aria-label="웨딩 사진 갤러리">
      ${createGalleryWall(photos, navigation)}
    </div>
    <p class="gallery-hint">${String(photos.length).padStart(2, "0")} PHOTOS · TAP TO EXPLORE</p>
    <dialog class="gallery-lightbox" aria-label="웨딩 사진 크게 보기">
      <button class="lightbox-close" type="button" aria-label="닫기">×</button>
      <button class="lightbox-arrow previous" type="button" aria-label="이전 사진">‹</button>
      <img class="lightbox-image" alt="" />
      <span class="lightbox-unretouched-mark" aria-hidden="true"><small></small>김앤장<br />미보정</span>
      <button class="lightbox-arrow next" type="button" aria-label="다음 사진">›</button>
      <p class="lightbox-count"></p>
    </dialog>
  `;

  const items = [...section.querySelectorAll(".gallery-wall-item")];
  const dialog = section.querySelector(".gallery-lightbox");
  const lightboxImage = section.querySelector(".lightbox-image");
  const counter = section.querySelector(".lightbox-count");
  const lightboxMark = section.querySelector(".lightbox-unretouched-mark");
  const lightboxMarkNumber = lightboxMark.querySelector("small");
  const lightboxTouches = new Map();
  let activeIndex = 0;
  let swipeStart = null;
  let panStart = null;
  let pinchStartDistance = 0;
  let pinchStartScale = 1;
  let zoomScale = 1;
  let zoomX = 0;
  let zoomY = 0;
  let lastTapTime = 0;
  let didSwitchWhilePanning = false;

  const updateActiveItem = () => {
    const activePhoto = navigation[activeIndex];
    items.forEach((item, index) => item.classList.toggle("is-active", photos[index] === activePhoto));
  };

  const updateLightbox = (direction) => {
    const photo = navigation[activeIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(navigation.length).padStart(2, "0")}`;
    lightboxMark.hidden = photo.isRetouched;
    lightboxMarkNumber.hidden = !photo.photoNumber;
    lightboxMarkNumber.textContent = photo.photoNumber || "";

    if (!direction || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lightboxImage.getAnimations().forEach((animation) => animation.cancel());
    const offset = direction === "next" ? 22 : -22;
    window.requestAnimationFrame(() => {
      lightboxImage.animate([
        { opacity: .15, transform: `translateX(${offset}px) scale(.99)` },
        { opacity: 1, transform: "translateX(0) scale(1)" },
      ], { duration: 220, easing: "cubic-bezier(.22, 1, .36, 1)" });
    });
  };

  const resetZoom = () => {
    zoomScale = 1;
    zoomX = 0;
    zoomY = 0;
    lightboxImage.style.transform = "";
    lightboxImage.classList.remove("is-zoomed");
  };

  const getPanBounds = () => ({
    x: Math.max(0, (lightboxImage.clientWidth * zoomScale - dialog.clientWidth) / 2),
    y: Math.max(0, (lightboxImage.clientHeight * zoomScale - dialog.clientHeight) / 2),
  });

  const clampPan = () => {
    const bounds = getPanBounds();
    zoomX = Math.min(bounds.x, Math.max(-bounds.x, zoomX));
    zoomY = Math.min(bounds.y, Math.max(-bounds.y, zoomY));
  };

  const applyZoom = () => {
    if (zoomScale <= 1) return resetZoom();
    clampPan();
    lightboxImage.style.transform = `translate(${zoomX}px, ${zoomY}px) scale(${zoomScale})`;
    lightboxImage.classList.add("is-zoomed");
  };

  const getTouchPoints = () => [...lightboxTouches.values()];
  const getDistance = ([first, second]) => Math.hypot(second.x - first.x, second.y - first.y);
  const updateHistory = (method) => window.history[method]({ galleryLightbox: true, photoIndex: activeIndex }, "", `#gallery-${activeIndex + 1}`);

  const openLightbox = () => {
    updateLightbox();
    updateHistory("pushState");
    dialog.showModal();
  };

  const movePhoto = (direction) => {
    activeIndex = (activeIndex + direction + navigation.length) % navigation.length;
    updateActiveItem();
    resetZoom();
    updateLightbox(direction > 0 ? "next" : "previous");
    updateHistory("replaceState");
  };

  items.forEach((item) => {
    item.addEventListener("click", () => {
      activeIndex = navigation.indexOf(photos[Number(item.dataset.galleryIndex)]);
      updateActiveItem();
      openLightbox();
    });
  });

  section.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
  section.querySelector(".previous").addEventListener("click", () => movePhoto(-1));
  section.querySelector(".next").addEventListener("click", () => movePhoto(1));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") movePhoto(-1);
    if (event.key === "ArrowRight") movePhoto(1);
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
      didSwitchWhilePanning = false;
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
    } else if (zoomScale > 1 && panStart) {
      const intendedX = panStart.zoomX + event.clientX - panStart.x;
      const intendedY = panStart.zoomY + event.clientY - panStart.y;
      const bounds = getPanBounds();
      const isHorizontalDrag = Math.abs(event.clientX - panStart.x) > Math.abs(event.clientY - panStart.y);
      const overflow = 48;

      if (!didSwitchWhilePanning && isHorizontalDrag && bounds.x > 0) {
        if (intendedX < -bounds.x - overflow) {
          didSwitchWhilePanning = true;
          movePhoto(1);
          return;
        }
        if (intendedX > bounds.x + overflow) {
          didSwitchWhilePanning = true;
          movePhoto(-1);
          return;
        }
      }

      zoomX = intendedX;
      zoomY = intendedY;
      applyZoom();
    }
  });
  dialog.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "touch" || !lightboxTouches.has(event.pointerId)) return;
    const touchStart = swipeStart;
    lightboxTouches.delete(event.pointerId);
    if (lightboxTouches.size === 0 && !didSwitchWhilePanning && zoomScale === 1 && touchStart) {
      const swipeX = event.clientX - touchStart.x;
      const swipeY = event.clientY - touchStart.y;
      if (Math.abs(swipeX) > 42 && Math.abs(swipeX) > Math.abs(swipeY)) movePhoto(swipeX < 0 ? 1 : -1);
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
    didSwitchWhilePanning = false;
  });
  dialog.addEventListener("close", () => {
    lightboxTouches.clear();
    resetZoom();
    if (window.history.state?.galleryLightbox) window.history.back();
  });
  window.addEventListener("popstate", (event) => {
    if (event.state?.galleryLightbox) {
      activeIndex = event.state.photoIndex;
      updateActiveItem();
      updateLightbox();
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) dialog.close();
  });

  return section;
}
