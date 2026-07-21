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
      photo: "./photos/PYD02324.jpg",
      photoAlt: "김영진의 사진",
      introduction: "1994년 5월 서울 출생\n따스하고 한결같은 이과소년",
    },
    bride: {
      photo: "./photos/PYD01455.jpg",
      photoAlt: "장예슬의 사진",
      introduction: "1998년 1월 서울 출생\n섬세하고 아름다운 문과소녀",
    },
  },
  date: "2026-11-22T12:20:00+09:00",
  venueName: "스타시티아트홀",
  hallName: "",
  address: "서울특별시 광진구 화양동 능동로 110 스타시티영존 5층",
  contactPhone: "010-0000-0000",
  heroPhoto: "./photos/PYD00070.jpg",
  heroPhotoAlt: "김영진과 장예슬의 웨딩 사진",
  heroLabel: "WE ARE GETTING MARRIED",
  heroMessage: "서로의 가장 빛나는 순간을\n함께해 주시면 감사하겠습니다.",
  invitationTitle: "소중한 분들을 초대합니다",
  invitationMessage: "오랜 시간 서로를 바라보며 걸어온 두 사람이\n이제 같은 길을 함께 걸어가려 합니다.\n따뜻한 마음으로 축복해 주시면 감사하겠습니다.",
  locationButton: "오시는 길",
  contactButton: "마음 전하기",
};

export default weddingConfig;
