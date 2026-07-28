function createMessage(message, onDelete) {
  const item = document.createElement("article");
  item.className = "guestbook-message";

  const meta = document.createElement("div");
  meta.className = "guestbook-message-meta";
  const identity = document.createElement("div");
  identity.className = "guestbook-message-identity";
  const name = document.createElement("strong");
  name.textContent = message.name;
  const date = document.createElement("time");
  date.textContent = message.createdAt;
  identity.append(name, date);

  const deleteButton = document.createElement("button");
  deleteButton.className = "guestbook-delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "삭제";
  deleteButton.addEventListener("click", () => onDelete(message.id));
  meta.append(identity, deleteButton);

  const body = document.createElement("p");
  body.textContent = message.message;
  item.append(meta, body);
  return item;
}

export default function createGuestbook(content) {
  const guestbook = content.guestbook;
  const section = document.createElement("section");
  section.className = "guestbook-section";
  section.innerHTML = `
    <header class="guestbook-heading">
      <h2>${guestbook.title}</h2>
      <p>${guestbook.intro}</p>
    </header>
    <form class="guestbook-form" action="${guestbook.endpoint}" method="post" target="guestbook-submit-frame">
      <input name="action" type="hidden" value="create" />
      <label>
        <span>NAME</span>
        <input name="name" type="text" maxlength="20" autocomplete="name" required placeholder="성함을 입력해 주세요" />
      </label>
      <label>
        <span>MESSAGE</span>
        <textarea name="message" maxlength="200" required placeholder="축하의 마음을 남겨주세요"></textarea>
      </label>
      <label>
        <span>DELETE CODE</span>
        <input name="deleteCode" type="tel" inputmode="numeric" pattern="[0-9]{4}" minlength="4" maxlength="4" autocomplete="off" required placeholder="삭제 시 사용할 숫자 4자리" />
      </label>
      <input class="guestbook-honeypot" name="website" tabindex="-1" autocomplete="off" />
      <button type="submit">${guestbook.submitLabel}</button>
      <p class="guestbook-form-notice">메시지 삭제에 사용할 숫자 4자리를 기억해 주세요.</p>
    </form>
    <form class="guestbook-delete-form" action="${guestbook.endpoint}" method="post" target="guestbook-submit-frame">
      <input name="action" type="hidden" value="delete" />
      <input name="id" type="hidden" />
      <input name="deleteCode" type="hidden" />
    </form>
    <iframe class="guestbook-submit-frame" name="guestbook-submit-frame" title="방명록 제출"></iframe>
    <div class="guestbook-rule"></div>
    <div class="guestbook-list-header"><span>MESSAGES</span><span class="guestbook-status">불러오는 중</span></div>
    <div class="guestbook-list" aria-live="polite"></div>
  `;

  const form = section.querySelector(".guestbook-form");
  const deleteForm = section.querySelector(".guestbook-delete-form");
  const submitButton = form.querySelector("button");
  const notice = form.querySelector(".guestbook-form-notice");
  const list = section.querySelector(".guestbook-list");
  const status = section.querySelector(".guestbook-status");
  let pendingDeletionId = null;

  const showEmpty = (text) => {
    const empty = document.createElement("p");
    empty.className = "guestbook-empty";
    empty.textContent = text;
    list.replaceChildren(empty);
  };

  const loadMessages = () => {
    const callbackName = `guestbookFeed${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const feed = document.createElement("script");

    window[callbackName] = (payload) => {
      const messages = payload?.messages || [];
      const deleted = pendingDeletionId && !messages.some((message) => message.id === pendingDeletionId);
      if (!messages.length) showEmpty("첫 번째 축하의 마음을 기다리고 있습니다.");
      else list.replaceChildren(...messages.map((message) => createMessage(message, requestDelete)));
      status.textContent = pendingDeletionId
        ? (deleted ? "메시지를 삭제했습니다." : "삭제 번호가 맞지 않거나 처리하지 못했습니다.")
        : `${messages.length} MESSAGE${messages.length === 1 ? "" : "S"}`;
      pendingDeletionId = null;
      delete window[callbackName];
      feed.remove();
    };

    feed.src = `${guestbook.endpoint}?callback=${callbackName}&_=${Date.now()}`;
    feed.async = true;
    feed.onerror = () => {
      showEmpty("메시지를 불러오지 못했습니다.");
      status.textContent = "TEMPORARILY UNAVAILABLE";
      pendingDeletionId = null;
      delete window[callbackName];
      feed.remove();
    };
    document.head.append(feed);
  };

  const requestDelete = (id) => {
    const deleteCode = window.prompt("작성 시 입력한 4자리 삭제 번호를 입력해 주세요.");
    if (deleteCode === null) return;
    if (!/^\d{4}$/.test(deleteCode)) {
      window.alert("숫자 4자리를 입력해 주세요.");
      return;
    }

    deleteForm.elements.id.value = id;
    deleteForm.elements.deleteCode.value = deleteCode;
    pendingDeletionId = id;
    status.textContent = "삭제 요청을 처리하고 있습니다.";
    deleteForm.requestSubmit();
    window.setTimeout(loadMessages, 900);
  };

  loadMessages();

  form.addEventListener("submit", () => {
    submitButton.disabled = true;
    submitButton.textContent = "마음을 전달하고 있습니다";
    notice.textContent = "소중한 메시지가 바로 공개되었습니다.";
    window.setTimeout(() => {
      form.reset();
      submitButton.disabled = false;
      submitButton.textContent = guestbook.submitLabel;
    }, 900);
  });

  return section;
}
