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

const MESSAGES_PER_PAGE = 5;

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
    <nav class="guestbook-pagination" aria-label="방명록 메시지 페이지" hidden>
      <button class="guestbook-page-button" type="button" data-page-direction="previous">이전</button>
      <span class="guestbook-page-indicator" aria-live="polite"></span>
      <button class="guestbook-page-button" type="button" data-page-direction="next">다음</button>
    </nav>
  `;

  const form = section.querySelector(".guestbook-form");
  const deleteForm = section.querySelector(".guestbook-delete-form");
  const submitFrame = section.querySelector(".guestbook-submit-frame");
  const submitButton = form.querySelector("button");
  const notice = form.querySelector(".guestbook-form-notice");
  const list = section.querySelector(".guestbook-list");
  const status = section.querySelector(".guestbook-status");
  const pagination = section.querySelector(".guestbook-pagination");
  const previousPageButton = pagination.querySelector('[data-page-direction="previous"]');
  const nextPageButton = pagination.querySelector('[data-page-direction="next"]');
  const pageIndicator = pagination.querySelector(".guestbook-page-indicator");
  let pendingDeletionId = null;
  let submittedMessage = false;
  let messages = [];
  let currentPage = 1;

  const showEmpty = (text) => {
    const empty = document.createElement("p");
    empty.className = "guestbook-empty";
    empty.textContent = text;
    list.replaceChildren(empty);
  };

  const formatMessageStatus = ({ start, end }) => (
    messages.length ? `${messages.length}개의 축하 메시지 · ${start}–${end} 표시` : "0개의 축하 메시지"
  );

  const renderMessages = () => {
    if (!messages.length) {
      currentPage = 1;
      pagination.hidden = true;
      showEmpty("첫 번째 축하의 마음을 기다리고 있습니다.");
      return { start: 0, end: 0 };
    }

    const totalPages = Math.ceil(messages.length / MESSAGES_PER_PAGE);
    currentPage = Math.min(currentPage, totalPages);
    const startIndex = (currentPage - 1) * MESSAGES_PER_PAGE;
    const pageMessages = messages.slice(startIndex, startIndex + MESSAGES_PER_PAGE);
    list.replaceChildren(...pageMessages.map((message) => createMessage(message, requestDelete)));

    pagination.hidden = totalPages === 1;
    previousPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
    pageIndicator.textContent = `${currentPage} / ${totalPages}`;
    return { start: startIndex + 1, end: startIndex + pageMessages.length };
  };

  const loadMessages = ({ resetPage = false } = {}) => {
    const callbackName = `guestbookFeed${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const feed = document.createElement("script");

    window[callbackName] = (payload) => {
      messages = payload?.messages || [];
      const deleted = pendingDeletionId && !messages.some((message) => message.id === pendingDeletionId);
      if (resetPage) currentPage = 1;
      const pageRange = renderMessages();
      status.textContent = pendingDeletionId
        ? (deleted ? "메시지를 삭제했습니다." : "삭제 번호가 맞지 않거나 처리하지 못했습니다.")
        : formatMessageStatus(pageRange);
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

  previousPageButton.addEventListener("click", () => {
    currentPage -= 1;
    status.textContent = formatMessageStatus(renderMessages());
  });

  nextPageButton.addEventListener("click", () => {
    currentPage += 1;
    status.textContent = formatMessageStatus(renderMessages());
  });

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
    submittedMessage = true;
    submitButton.disabled = true;
    submitButton.textContent = "마음을 전달하고 있습니다";
    notice.textContent = "소중한 메시지가 바로 공개되었습니다.";
  });

  submitFrame.addEventListener("load", () => {
    if (!submittedMessage) return;
    submittedMessage = false;
    form.reset();
    submitButton.disabled = false;
    submitButton.textContent = guestbook.submitLabel;
    loadMessages({ resetPage: true });
  });

  return section;
}
