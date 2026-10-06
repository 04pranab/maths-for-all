(() => {
  const input = document.getElementById("wiki-search-input");
  const cards = [...document.querySelectorAll(".wiki-card")];
  if (!input) return;
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    cards.forEach(card => {
      const text = (card.dataset.search + " " + card.textContent).toLowerCase();
      card.classList.toggle("wiki-hidden", Boolean(query && !text.includes(query)));
    });
  });
})();