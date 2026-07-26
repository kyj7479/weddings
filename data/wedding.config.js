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
      introduction: "1994년 5월, 햇살이 짙어지던 날\n그날의 따스함을 닮아 태어난 한결같은 이과소년",
    },
    bride: {
      photo: "./photos/thumbs/PYD01455_thumb.webp",
      fullPhoto: "./photos/PYD01455.webp",
      photoAlt: "장예슬의 사진",
      introduction: "스물의 끝자락에서 가장 아름다운 순간을\n소중한 사람과의 설렘으로 맞이하는 문과소녀",
    },
  },
  galleryTitle: "OUR MOMENTS",
  galleryIntro: "두 사람이 함께한\n아름다운 순간들",
  gallery: [
    "PYD00055.jpg", "PYD00410.jpg", "PYD01794.jpg", "PYD00907.jpg", "PYD01191.jpg",
    "PYD01731.jpg", "PYD01890.jpg", "PYD01360.jpg", "PYD02349.jpg", "PYD02795_R.jpg",
    "KKO000EX.jpg", "PYD03245.jpg", "PYD03374.jpg", "PYD03089.jpg", "PYD03464.jpg",
    "PYD03719.jpg", "PYD03871.jpg", "PYD04301.jpg",
  ].map((fileName, index) => ({
    src: `./photos/${fileName.replace(".jpg", ".webp")}`,
    thumb: `./photos/thumbs/${fileName.replace(".jpg", "_thumb.webp")}`,
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
    subway: "2호선 건대입구역 2번 출구와 7호선 건대입구역 3번 출구 앞 건물",
    busStop: "건대입구역 · 건대입구역 사거리 하차",
    buses: [
      ["간선", "240번, 721번, N61번, N62번"],
      ["지선", "2016번, 2222번, 3217번, 3220번, 4212번"],
      ["직행", "102번, 3500번"],
      ["공항", "6013번"],
    ],
    phone: "02-430-8000",
    naverDirections: "https://map.naver.com/p/directions/-/3zlA18,2AKXDr,%EC%8A%A4%ED%83%80%EC%8B%9C%ED%8B%B0%20%EC%95%84%ED%8A%B8%ED%99%80,,/-/transit?c=15.00,0,0,0,dh",
    kakaoDirections: "https://map.kakao.com/link/search/%EC%8A%A4%ED%83%80%EC%8B%9C%ED%8B%B0%EC%95%84%ED%8A%B8%ED%99%80",
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
