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
    subtitle: "서로의 일상에 스며든\n두 사람을 소개합니다.",
    groom: {
      photo: "./photos/thumbs/PYD02330_thumb.webp",
      fullPhoto: "./photos/PYD02330.webp",
      photoAlt: "김영진의 사진",
      introduction: "1994년 5월, 햇살이 짙어지던 날\n그날의 따스함을 닮아 따뜻한 마음을 가진 한결같은 이과소년",
    },
    bride: {
      photo: "./photos/thumbs/PYD01455_thumb.webp",
      fullPhoto: "./photos/PYD01455.webp",
      photoAlt: "장예슬의 사진",
      introduction: "1998년 1월, 새해가 찾아와 반기던 날\n그날의 설렘처럼 소중한 사람과 새로운 시작을 맞이하는 문과소녀",
    },
  },
  galleryTitle: "OUR MOMENTS",
  galleryIntro: "두 사람이 함께한\n아름다운 순간들",
  gallery: [
    "PYD00052_R.jpg", "PYD00410_R.jpg", "PYD01700_R.jpg", "PYD01623_R.jpg", "PYD01794_R.jpg", "PYD00907.jpg",
    "PYD01191.jpg", "PYD01731.jpg", "PYD01890_R.jpg", "PYD01360.jpg", "PYD02349_R.jpg", "PYD02795_R.jpg",
    "KKO000EX.jpg", "PYD03061_R.jpg", "PYD03168_R.jpg", "PYD03374.jpg", "PYD03481_R.jpg",
    "PYD03966.jpg",
  ].map((fileName, index) => ({
    src: `./photos/${fileName.replace(".jpg", ".webp")}`,
    thumb: `./photos/thumbs/${fileName.replace(".jpg", "_thumb.webp")}`,
    isRetouched: fileName.includes("_R."),
    photoNumber: fileName.startsWith("PYD") ? fileName.match(/\d{5}/)[0].slice(-4) : null,
    alt: `김영진과 장예슬의 웨딩 사진 ${index + 1}`,
  })),
  date: "2026-11-22T12:20:00+09:00",
  venueName: "스타시티아트홀",
  hallName: "",
  address: "서울특별시 광진구 화양동 능동로 110 스타시티영존 5층",
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
            title: "5층 단독홀",
            description: "스타시티아트홀은 5층 전체를 사용하는 단독홀입니다.",
          },
          {
            title: "주차 공간",
            description: "같은 건물 지하 4층과 지하 5층에 약 1,000대 규모의 주차장이 마련되어 있습니다. (2시간 무료 주차)",
            actionLabel: "주차 · 대중교통 영상 보기",
            actionUrl: "https://www.youtube.com/watch?v=2RpMauyPUWU",
          },
          {
            title: "ATM & 휴식 공간",
            description: "예식장과 같은 5층에 하객을 위한 카페테리아가 마련되어 있습니다. (ATM 이용 가능)",
            image: "./photos/infos/cafeteria.webp",
            imageAlt: "스타시티아트홀 카페테리아",
          },
        ],
      },
      {
        label: "STAR CITY ART HALL",
        title: "식사 안내",
        description: "식사는 한식 한상 차림 & 세미 뷔페입니다.",
        instagramUrl: "https://www.instagram.com/starcity_weddinghall/reel/DZ9YA4gTR01/",
      },
    ],
  },
  guestbook: {
    title: "GUESTBOOK",
    intro: "두 사람의 새로운 시작을 축복하는\n따뜻한 마음을 남겨주세요.",
    endpoint: "https://script.google.com/macros/s/AKfycbwBxYpoG9qaSa8Jg9E95tVzQsRb4fZuvbnkFcKxhv8it7EKoMdNM5eUbdaBe2Lf31gCyg/exec",
    submitLabel: "축하의 마음 남기기",
  },
  contactPhone: "010-0000-0000",
  heroPhoto: "./photos/PYD00070.webp",
  heroPhotoAlt: "김영진과 장예슬의 웨딩 사진",
  heroLabel: "WE ARE GETTING MARRIED",
  heroMessage: "서로의 가장 빛나는 순간을\n함께해 주시면 감사하겠습니다.",
  invitationTitle: "소중한 분들을 초대합니다",
  invitationMessage: "오랜 시간 서로를 바라보며 걸어온 두 사람이\n이제 같은 길을 함께 걸어가려 합니다.\n따뜻한 마음으로 축복해 주시면 감사하겠습니다.",
  locationButton: "오시는 길",
  contactButton: "마음 전하기",
};

export default weddingConfig;
