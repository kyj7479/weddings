const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
const weekdaysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function createCalendarDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: firstDay }, () => '<span class="calendar-day empty"></span>');

  for (let day = 1; day <= lastDate; day += 1) {
    const dayOfWeek = new Date(year, month, day).getDay();
    const isWeddingDay = day === date.getDate();
    const classes = ["calendar-day", dayOfWeek === 0 ? "sunday" : "", isWeddingDay ? "wedding-day" : ""].filter(Boolean).join(" ");
    days.push(`<span class="${classes}">${day}</span>`);
  }

  return days.join("");
}

function getCountdown(targetDate) {
  const remaining = Math.max(targetDate.getTime() - Date.now(), 0);
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
  };
}

export default function createCalendar(content) {
  const weddingDate = new Date(content.date);
  const section = document.createElement("section");
  section.className = "calendar-section";
  section.innerHTML = `
    <h2 class="calendar-title">WEDDING DAY</h2>
    <p class="calendar-korean-date">${content.koreanDate}</p>
    <p class="calendar-english-date">${weekdaysEn[weddingDate.getDay()]}, ${monthsEn[weddingDate.getMonth()]} ${weddingDate.getDate()}, ${weddingDate.getFullYear()} ${weddingDate.getHours() < 12 ? "AM" : "PM"} ${weddingDate.getHours() % 12 || 12}:${String(weddingDate.getMinutes()).padStart(2, "0")}</p>
    <div class="calendar-rule"></div>
    <div class="calendar-weekdays">${weekdays.map((day, index) => `<span class="${index === 0 ? "sunday" : ""}">${day}</span>`).join("")}</div>
    <div class="calendar-days">${createCalendarDays(weddingDate)}</div>
    <div class="calendar-rule bottom-rule"></div>
    <div class="countdown" aria-label="결혼식까지 남은 시간">
      <div class="countdown-item"><strong data-countdown="days">0</strong><span>DAYS</span></div>
      <div class="countdown-item"><strong data-countdown="hours">0</strong><span>HOURS</span></div>
      <div class="countdown-item"><strong data-countdown="minutes">0</strong><span>MINUTES</span></div>
      <div class="countdown-item"><strong data-countdown="seconds">0</strong><span>SECONDS</span></div>
    </div>
    <p class="countdown-message">결혼식까지 <strong data-countdown="days">0</strong>일 남았습니다</p>
  `;

  const updateCountdown = () => {
    const countdown = getCountdown(weddingDate);
    section.querySelectorAll("[data-countdown]").forEach((element) => {
      element.textContent = countdown[element.dataset.countdown];
    });
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
  return section;
}
