export default function createMonogram() {
  const divider = document.createElement("div");
  divider.className = "monogram-section";
  divider.setAttribute("role", "img");
  divider.setAttribute("aria-label", "KIM AND JANG");
  divider.innerHTML = `
    <span class="monogram-line" aria-hidden="true"></span>
    <span class="monogram-mark" aria-hidden="true">KIM <i>&amp;</i> JANG</span>
    <span class="monogram-line" aria-hidden="true"></span>
  `;
  return divider;
}
