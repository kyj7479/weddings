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
    "PYD00070.jpg", "PYD00360.jpg", "PYD00466.jpg", "PYD00559.jpg", "PYD00907.jpg",
    "PYD01191.jpg", "PYD01265.jpg", "PYD01455.jpg", "PYD01823.jpg", "PYD01890.jpg",
    "PYD02034.jpg", "PYD02330.jpg", "PYD02349.jpg", "PYD03255.jpg", "PYD03331.jpg",
  ].map((fileName, index) => ({
    src: `./photos/${fileName.replace(".jpg", ".webp")}`,
    thumb: `./photos/thumbs/${fileName.replace(".jpg", "_thumb.webp")}`,
    alt: `김영진과 장예슬의 웨딩 사진 ${index + 1}`,
  })),
  date: "2026-11-22T12:20:00+09:00",
  venueName: "스타시티아트홀",
  hallName: "",
  address: "서울특별시 광진구 화양동 능동로 110 스타시티영존 5층",
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
