/**
 * 청첩장 내용 설정
 * 이름, 일정, 문구, 사진 경로는 이 파일에서 관리합니다.
 */
const weddingConfig = {
  groomLastName: "김",
  groomFirstName: "영진",
  brideLastName: "장",
  brideFirstName: "예슬",
  groomParents: {
    father: "김승환",
    mother: "송은봉",
  },
  brideParents: {
    father: "장자성",
    mother: "이인덕",
  },
  about: {
    title: "ABOUT US",
    subtitle: "서로의 영화 속에 걸어들어온\n두 사람을 소개합니다.",
    groom: {
      photo: "./photos/thumbs/PYD02330_thumb.webp",
      fullPhoto: "./photos/PYD02330.webp",
      photoAlt: "김영진의 사진",
      introduction: "1994년 5월, 햇살이 짙어지던 날\n그날의 따스한 햇살을 받아\n온화하고 한결같은 마음을 가진 이과소년",
    },
    bride: {
      photo: "./photos/thumbs/PYD01455_thumb.webp",
      fullPhoto: "./photos/PYD01455.webp",
      photoAlt: "장예슬의 사진",
      introduction: "1998년 1월, 설날의 설렘이 채 가시지 않은 날\n새해의 따스한 복을 품고 태어나\n정이 많고 세심한 마음을 가진 문과소녀",
    },
  },
  galleryTitle: "OUR MOMENTS",
  galleryIntro: "두 사람이 함께한\n아름다운 순간들",
  gallery: [
    "PYD00410.jpg", "PYD01360.jpg", "PYD01749.jpg", "PYD01623.jpg", "PYD01700.jpg", "PYD01794.jpg", "PYD00907.jpg",
    "PYD01890.jpg", "PYD01731.jpg", "PYD00052.jpg", "PYD01191.jpg", "PYD02069.jpg", "PYD02795.jpg",
    "PYD02816.jpg", "PYD02349.jpg", "PYD03061.jpg", "PYD02744.jpg", "KKO000EX.jpg", "PYD02449.jpg", "PYD03481.jpg",
    "PYD03966.jpg",
  ].map((fileName, index) => ({
    src: `./photos/${fileName.replace(".jpg", ".webp")}`,
    thumb: `./photos/thumbs/${fileName.replace(".jpg", "_thumb.webp")}`,
    isRetouched: true,
    thumbnailLandscape: ["KKO000EX.jpg", "PYD03966.jpg"].includes(fileName),
    thumbnailObjectPosition: fileName === "KKO000EX.jpg" ? "50% 28%" : null,
    thumbnailZoom: fileName === "PYD03966.jpg" ? 1.16 : null,
    thumbnailHoverZoom: fileName === "PYD03966.jpg" ? 1.22 : null,
    photoNumber: fileName.startsWith("PYD") ? fileName.match(/\d{5}/)[0].slice(-4) : null,
    alt: `김영진과 장예슬의 웨딩 사진 ${index + 1}`,
  })),
  galleryNavigationOrder: [1, 4, 2, 5, 3, 8, 6, 9, 7, 10, 11, 13, 14, 12, 15, 16, 18, 19, 17, 21, 20],
  date: "2026-11-22T12:20:00+09:00",
  venueName: "스타시티아트홀",
  hallName: "",
  address: ["서울특별시 광진구 화양동 능동로 110", "스타시티영존 5층"],
  location: {
    title: "LOCATION",
    kakaoMapKey: "886e9a6033ce9ce9d2a60e10e2f7dcc0",
    transitTitle: "PUBLIC TRANSPORT",
    subway: {
      station: "건대입구역",
      lines: [
        { number: "2", label: "2호선", exit: "2번 출구" },
        { number: "7", label: "7호선", exit: "3번 출구" },
      ],
      description: "두 출구 바로 앞 건물",
    },
    busStop: "건대입구역 · 건대입구역 사거리 하차",
    buses: [
      { type: "간선", routes: "240 · 721 · N61 · N62", style: "trunk" },
      { type: "지선", routes: "2016 · 2222 · 3217 · 3220 · 4212", style: "branch" },
      { type: "직행", routes: "102 · 3500", style: "express" },
      { type: "공항", routes: "6013", style: "airport" },
    ],
    driving: {
      title: "BY CAR",
      label: "PARKING",
      description: "웨딩홀 건물 지하 주차장 · 2시간 무료\n인근 건대병원 지하 주차장 · 1시간 30분 무료",
      capacity: "총 1,000대 수용 가능",
    },
    phone: "02-430-8000",
    naverDirections: "https://map.naver.com/p/directions/-/3zlA18,2AKXDr,%EC%8A%A4%ED%83%80%EC%8B%9C%ED%8B%B0%20%EC%95%84%ED%8A%B8%ED%99%80,,/-/transit?c=15.00,0,0,0,dh",
    kakaoDirections: "https://map.kakao.com/link/search/%EC%8A%A4%ED%83%80%EC%8B%9C%ED%8B%B0%EC%95%84%ED%8A%B8%ED%99%80",
  },
  venueGuide: {
    title: "VENUE GUIDE",
    intro: "편안한 하루를 위한\n예식장 이용 안내입니다.",
    cards: [
      {
        label: "STAR CITY ART HALL",
        title: "예식장 이용 안내",
        items: [
          {
            title: "홀 위치",
            description: "스타시티영존 5층 전체 (단독 예식)",
          },
          {
            title: "주차 공간",
            description: "웨딩홀 건물 B1~B5층 · 2시간 무료\n인근 건대병원 주차장 · 1시간 30분 무료\n총 1,000대 수용\n주차권 - 5층 주차 확인 데스크 발급",
            actionLabel: "주차 · 대중교통 영상 보기",
            actionUrl: "https://www.youtube.com/watch?v=2RpMauyPUWU",
          },
          {
            title: "ATM & 휴식 공간",
            description: "5층 카페테리아 · ATM 이용 가능\n하객 휴식 공간",
            image: "./photos/infos/cafeteria.webp",
            imageAlt: "스타시티아트홀 카페테리아",
          },
        ],
      },
      {
        label: "STAR CITY ART HALL",
        title: "식사 안내",
        description: "한식 한상차림 · 세미 뷔페\n이용 시간 - 오전 11시 50분(예식 30분 전)부터 2시간\n대인 · 식권 필요 / 소인 · 무료",
        images: [
          { src: "./photos/infos/dining1.webp", alt: "스타시티아트홀 한상 차림" },
          { src: "./photos/infos/dining2.webp", alt: "스타시티아트홀 세미 뷔페" },
        ],
      },
    ],
  },
  guestbook: {
    title: "GUESTBOOK",
    intro: "두 사람의 새로운 시작을 축복하는\n따뜻한 마음을 남겨주세요.",
    endpoint: "https://script.google.com/macros/s/AKfycbwBxYpoG9qaSa8Jg9E95tVzQsRb4fZuvbnkFcKxhv8it7EKoMdNM5eUbdaBe2Lf31gCyg/exec",
    submitLabel: "축하의 마음 남기기",
  },
  share: {
    title: "SHARE WITH LOVE",
    intro: "두 사람의 시작을 함께 나눠주세요.",
    url: "https://kyj7479.github.io/weddings/",
    kakaoJavaScriptKey: "886e9a6033ce9ce9d2a60e10e2f7dcc0",
    imageUrl: "https://kyj7479.github.io/weddings/assets/kakao-preview.jpg",
  },
  heart: {
    title: "마음 전하기",
    intro: "축하의 마음을 전해주시는 분들을 위해\n계좌 정보를 안내드립니다.",
    families: [
      {
        title: "신랑측에게",
        couple: { role: "신랑", name: "김영진", bank: "기업은행", account: "140-088241-01-011", holder: "김영진" },
        parents: [
          { role: "신랑 아버지", name: "김승환", bank: "기업은행", account: "010-2585-7479", holder: "김승환" },
          { role: "신랑 어머니", name: "송은봉", bank: "신한은행", account: "110-443-797038", holder: "송은봉" },
        ],
      },
      {
        title: "신부측에게",
        couple: { role: "신부", name: "장예슬", bank: "우리은행", account: "1002-559-656017", holder: "장예슬" },
        parents: [
          { role: "신부 아버지", name: "장자성", bank: "국민은행", account: "033-21-0619-674", holder: "장자성" },
          { role: "신부 어머니", name: "이인덕", bank: "국민은행", account: "582502-01-242196", holder: "이인덕" },
        ],
      },
    ],
  },
  contactPhone: "010-0000-0000",
  heroPhoto: "./photos/PYD00070.webp",
  heroFullPhoto: "./photos/PYD00070_full.webp",
  heroPhotoAlt: "김영진과 장예슬의 웨딩 사진",
  heroLabel: "WE ARE GETTING MARRIED",
  heroMessage: "두 사람이 함께 써 내려갈 영화의 첫 장면,\n그 자리에 여러분을 초대합니다.",
  invitationTitle: "소중한 분들을 초대합니다",
  invitationMessage: "저마다의 인생이라는 영화의 주인공이었던 두 사람이\n우연히 서로의 영화 속으로 걸어 들어와\n웃고, 때론 기대며,\n서로의 영화에 없어서는 안 될 사람이 되어갔습니다.\n이제 두 사람은 평생이라는 새로운 영화를\n함께 만들어가려 합니다.\n그 첫 장면을 여는 날,\n소중한 여러분께서 함께하시어 축복해 주신다면\n더없는 기쁨으로 오래도록 기억될 것입니다.",
  locationButton: "오시는 길",
  contactButton: "마음 전하기",
};

export default weddingConfig;
