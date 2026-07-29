function renderAccount(person, allowContact = false) {
  const phone = person.phone?.replace(/[^0-9+]/g, "");

  return `
    <article class="heart-account-card">
      <div class="heart-account-heading">
        <span>${person.role}</span>
        <strong>${person.name}</strong>
      </div>
      ${allowContact ? `
        <div class="heart-contact-actions">
          <a href="tel:${phone}">통화</a>
          <a href="sms:${phone}">문자</a>
        </div>
      ` : ""}
      <div class="heart-account-detail">
        <span>${person.bank} · ${person.holder}</span>
        <div>
          <b>${person.account}</b>
          <button type="button" data-copy-account="${person.account}">복사</button>
        </div>
      </div>
    </article>
  `;
}

function copyAccount(account, button) {
  const fallback = () => {
    const input = document.createElement("textarea");
    input.value = account;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  };

  const copied = navigator.clipboard?.writeText(account) ?? Promise.reject();
  copied.catch(fallback).finally(() => {
    const label = button.textContent;
    button.textContent = "복사됨";
    window.setTimeout(() => { button.textContent = label; }, 1300);
  });
}

function createHeartSheet(content) {
  const sheet = document.createElement("div");
  sheet.className = "heart-sheet";
  sheet.hidden = true;
  sheet.innerHTML = `
    <div class="heart-sheet-backdrop"></div>
    <section class="heart-sheet-card" role="dialog" aria-modal="true" aria-labelledby="heart-sheet-title">
      <button class="heart-sheet-close" type="button" aria-label="마음 전하기 닫기">×</button>
      <header>
        <span>WITH LOVE</span>
        <h2 id="heart-sheet-title">${content.heart.title}</h2>
        <p>${content.heart.intro}</p>
      </header>
      <div class="heart-sheet-group">
        <h3>GROOM & BRIDE</h3>
        ${content.heart.couple.map((person) => renderAccount(person, true)).join("")}
      </div>
      <div class="heart-sheet-group heart-sheet-family">
        <h3>FAMILY</h3>
        ${content.heart.family.map((person) => renderAccount(person)).join("")}
      </div>
    </section>
  `;
  document.body.append(sheet);

  const closeButton = sheet.querySelector(".heart-sheet-close");
  let isOpen = false;
  let restoreOverflow = "";

  const close = (fromHistory = false) => {
    if (!isOpen) return;
    isOpen = false;
    sheet.classList.remove("is-open");
    document.body.style.overflow = restoreOverflow;
    window.setTimeout(() => { sheet.hidden = true; }, 230);
    if (!fromHistory && history.state?.heartSheet) history.back();
  };

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    restoreOverflow = document.body.style.overflow;
    sheet.hidden = false;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => sheet.classList.add("is-open"));
    history.pushState({ ...(history.state || {}), heartSheet: true }, "");
    closeButton.focus();
  };

  sheet.querySelector(".heart-sheet-backdrop").addEventListener("click", () => close());
  closeButton.addEventListener("click", () => close());
  sheet.querySelectorAll("[data-copy-account]").forEach((button) => {
    button.addEventListener("click", () => copyAccount(button.dataset.copyAccount, button));
  });
  window.addEventListener("popstate", () => close(true));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  return open;
}

export default function createInvitation(content) {
  const section = document.createElement("section");
  section.className = "details";
  section.id = "invitation";
  section.innerHTML = `
    <div class="eyebrow">Invitation</div>
    <h2>${content.invitationTitle}</h2>
    <p class="message">${content.invitationMessage}</p>
    <hr class="divider" />
    <div class="schedule"><strong>${content.koreanDate}</strong><span>${content.venue}</span></div>
    <p class="location">${content.address}</p>
    <div class="buttons">
      <a class="button" href="#location">${content.locationButton}</a>
      <button class="button primary heart-sheet-trigger" type="button">${content.contactButton}</button>
    </div>
  `;

  const openHeartSheet = createHeartSheet(content);
  section.querySelector(".heart-sheet-trigger").addEventListener("click", openHeartSheet);

  return section;
}
