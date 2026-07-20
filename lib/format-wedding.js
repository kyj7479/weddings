const weekdaysKo = ["일", "월", "화", "수", "목", "금", "토"];
const weekdaysEn = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const monthsEn = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

const pad = (value) => String(value).padStart(2, "0");

export default function formatWedding(config) {
  const date = new Date(config.date);
  const hour = date.getHours();
  const minute = date.getMinutes();

  return {
    ...config,
    groomName: `${config.groomLastName}${config.groomFirstName}`,
    brideName: `${config.brideLastName}${config.brideFirstName}`,
    shortDate: `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}`,
    englishDate: `${weekdaysEn[date.getDay()]} · ${monthsEn[date.getMonth()]} ${date.getDate()} · ${date.getFullYear()}`,
    koreanDate: `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdaysKo[date.getDay()]}요일 ${hour < 12 ? "오전" : "오후"} ${hour % 12 || 12}시${minute ? ` ${minute}분` : ""}`,
    venue: [config.venueName, config.hallName].filter(Boolean).join(" "),
  };
}
