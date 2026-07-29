let kakaoMapSdk;

function loadKakaoMapSdk(appKey) {
  if (window.kakao?.maps) return Promise.resolve(window.kakao);
  if (kakaoMapSdk) return kakaoMapSdk;

  kakaoMapSdk = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao));
    script.onerror = () => reject(new Error("Kakao Map SDK could not be loaded."));
    document.head.append(script);
  });

  return kakaoMapSdk;
}

function renderKakaoMap(container, content) {
  loadKakaoMapSdk(content.location.kakaoMapKey)
    .then((kakao) => {
      const geocoder = new kakao.maps.services.Geocoder();
      const createMap = (position) => {
        const map = new kakao.maps.Map(container, {
          center: position,
          level: 3,
          draggable: false,
          zoomable: false,
        });
        new kakao.maps.Marker({ position, map });
        new kakao.maps.CustomOverlay({
          position,
          yAnchor: 2.2,
          content: `<div class="location-map-label">${content.venue}</div>`,
          map,
        });
      };

      const searchVenue = () => {
        const places = new kakao.maps.services.Places();
        places.keywordSearch(content.venueName, (results, status) => {
          if (status !== kakao.maps.services.Status.OK || !results[0]) {
            container.classList.add("map-unavailable");
            container.querySelector("p").textContent = "지도를 불러오지 못했습니다.";
            return;
          }
          createMap(new kakao.maps.LatLng(results[0].y, results[0].x));
        });
      };

      geocoder.addressSearch(content.address, (results, status) => {
        if (status !== kakao.maps.services.Status.OK || !results[0]) {
          searchVenue();
          return;
        }
        createMap(new kakao.maps.LatLng(results[0].y, results[0].x));
      });
    })
    .catch(() => {
      container.classList.add("map-unavailable");
      container.querySelector("p").textContent = "지도를 불러오지 못했습니다.";
    });
}

export default function createLocation(content) {
  const { location } = content;
  const section = document.createElement("section");
  section.className = "location-section";
  section.id = "location";
  section.innerHTML = `
    <header class="location-heading">
      <h2>${location.title}</h2>
      <p>${content.venue}</p>
    </header>
    <div class="location-address">
      <p>${content.address}</p>
      <a href="tel:${location.phone.replaceAll("-", "")}">${location.phone}</a>
    </div>
    <div class="kakao-map" aria-label="${content.venue} 위치 지도">
      <p>지도를 불러오는 중입니다.</p>
    </div>
    <div class="location-links">
      <a href="${location.kakaoDirections}" target="_blank" rel="noreferrer">카카오맵 길찾기</a>
      <a href="${location.naverDirections}" target="_blank" rel="noreferrer">네이버지도 길찾기</a>
    </div>
    <div class="location-rule"></div>
    <div class="driving-guide">
      <h3>${location.driving.title}</h3>
      <div class="transport-row driving-row">
        <strong>${location.driving.label}</strong>
        <div>
          <p>${location.driving.description}</p>
          <small>${location.driving.capacity}</small>
        </div>
      </div>
    </div>
    <div class="transport-guide">
      <h3>${location.transitTitle}</h3>
      <div class="transport-row subway-row">
        <strong>SUBWAY</strong>
        <div class="subway-guide">
          <div class="subway-station">
            ${location.subway.lines.map((line) => `<span class="subway-badge line-${line.number}">${line.number}</span>`).join("")}
            <b>${location.subway.station}</b>
          </div>
          <p>${location.subway.lines.map((line) => `${line.label} ${line.exit}`).join(" · ")}</p>
          <small>${location.subway.description}</small>
        </div>
      </div>
      <div class="transport-row bus-row">
        <strong>BUS</strong>
        <div>
          <p>${location.busStop}</p>
          <dl class="bus-list">
            ${location.buses.map((bus) => `<div class="bus-${bus.style}"><dt>${bus.type}</dt><dd>${bus.routes}</dd></div>`).join("")}
          </dl>
        </div>
      </div>
    </div>
  `;

  const mapContainer = section.querySelector(".kakao-map");
  window.requestAnimationFrame(() => renderKakaoMap(mapContainer, content));

  return section;
}
