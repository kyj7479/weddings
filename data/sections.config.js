/**
 * 청첩장 섹션의 표시 순서와 노출 여부를 관리합니다.
 * 순서를 바꾸려면 객체 줄의 위치를 옮기고,
 * 숨기려면 enabled 값을 false로 바꾸세요.
 */
const sectionOrder = [
  { id: "hero", enabled: true },
  { id: "invitation", enabled: true },
  { id: "calendar", enabled: true },
  { id: "family", enabled: true },
  { id: "about", enabled: true },
  { id: "gallery", enabled: true },
  { id: "location", enabled: true },
];

export default sectionOrder;
