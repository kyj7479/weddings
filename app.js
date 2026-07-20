const config = window.WEDDING_CONFIG;
const date = new Date(config.date);
const pad = (value) => String(value).padStart(2, "0");
const weekKo = ["일", "월", "화", "수", "목", "금", "토"];
const weekEn = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const monthEn = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
const hour = date.getHours();
const minute = date.getMinutes();
const content = {
  ...config,
  groomName: `${config.groomLastName}${config.groomFirstName}`,
  brideName: `${config.brideLastName}${config.brideFirstName}`,
  shortDate: `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}`,
  englishDate: `${weekEn[date.getDay()]} · ${monthEn[date.getMonth()]} ${date.getDate()} · ${date.getFullYear()}`,
  koreanDate: `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekKo[date.getDay()]}요일 ${hour < 12 ? "오전" : "오후"} ${hour % 12 || 12}시${minute ? ` ${minute}분` : ""}`,
  venue: [config.venueName, config.hallName].filter(Boolean).join(" "),
};
document.title = `${content.groomName} & ${content.brideName}의 결혼식`;
document.querySelectorAll("[data-wedding]").forEach((element) => {
  const key = element.dataset.wedding;
  if (key === "contactLink") element.href = `tel:${config.contactPhone.replace(/[^0-9+]/g, "")}`;
  else element.textContent = content[key];
});
document.querySelectorAll("[data-wedding-image]").forEach((image) => {
  image.src = config[image.dataset.weddingImage];
  image.alt = config[image.dataset.weddingAlt] || "";
});
