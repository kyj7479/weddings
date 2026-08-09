let kakaoSdk;

function copyText(value) {
  const fallback = () => {
    const input = document.createElement("textarea");
    input.value = value;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  };

  return (navigator.clipboard?.writeText(value) ?? Promise.reject()).catch(() => fallback());
}

function loadKakaoSdk(appKey) {
  if (window.Kakao?.isInitialized?.() && window.Kakao?.Share) return Promise.resolve(window.Kakao);
  if (kakaoSdk) return kakaoSdk;

  kakaoSdk = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js";
    script.async = true;
    script.onload = () => {
      try {
        if (!window.Kakao) throw new Error("Kakao SDK could not be loaded.");
        if (!window.Kakao.isInitialized()) window.Kakao.init(appKey);
        if (!window.Kakao.Share) throw new Error("Kakao Share could not be initialized.");
        resolve(window.Kakao);
      } catch (error) {
        reject(error);
      }
    };
    script.onerror = () => reject(new Error("Kakao SDK could not be loaded."));
    document.head.append(script);
  });

  return kakaoSdk;
}

export default function createShare(content) {
  const share = content.share;
  const section = document.createElement("section");
  section.className = "share-section";
  section.innerHTML = `
    <div class="share-rule"></div>
    <header class="share-heading">
      <h2>${share.title}</h2>
      <p>${share.intro}</p>
    </header>
    <div class="share-actions">
      <button class="share-link-copy" type="button">청첩장 링크 복사</button>
      <button class="share-kakao" type="button">카카오톡 공유하기</button>
    </div>
    <p class="share-status" aria-live="polite"></p>
  `;

  const status = section.querySelector(".share-status");
  const copyButton = section.querySelector(".share-link-copy");
  const kakaoButton = section.querySelector(".share-kakao");
  kakaoButton.disabled = true;
  kakaoButton.textContent = "카카오톡 준비 중";

  loadKakaoSdk(share.kakaoJavaScriptKey)
    .then(() => {
      kakaoButton.disabled = false;
      kakaoButton.textContent = "카카오톡 공유하기";
    })
    .catch(() => {
      kakaoButton.textContent = "카카오톡 공유 불가";
      status.textContent = "카카오톡 공유를 준비하지 못했습니다.";
    });

  copyButton.addEventListener("click", () => {
    copyText(share.url).then(() => {
      status.textContent = "청첩장 링크를 복사했습니다.";
      window.setTimeout(() => { status.textContent = ""; }, 1800);
    });
  });

  kakaoButton.addEventListener("click", () => {
    try {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "김영진 & 장예슬의 결혼식",
          description: `${content.koreanDate} · ${content.venue}`,
          imageUrl: share.imageUrl,
          imageWidth: 1200,
          imageHeight: 630,
          link: { mobileWebUrl: share.url, webUrl: share.url },
        },
        buttons: [{
          title: "청첩장 보기",
          link: { mobileWebUrl: share.url, webUrl: share.url },
        }],
      });
      status.textContent = "";
    } catch {
      status.textContent = "카카오톡 공유를 열지 못했습니다.";
    }
  });

  return section;
}
