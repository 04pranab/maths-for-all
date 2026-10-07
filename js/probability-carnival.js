window.ProbabilityCarnival = (() => {
  const library = window.ProbabilityCarnivalLibrary;
  const canvasApi = window.ProbabilityCarnivalCanvas;
  const stories = window.ProbabilityCarnivalStories.stories;
  const state = { prediction: null, sun: 0, moon: 0, bag: library.createBag() };

  function $(id) { return document.getElementById(id); }
  function visible(id, value) { const el = $(id); if (el) el.hidden = !value; }

  function open() {
    visible("screen-menu", false);
    visible("screen-probability-carnival", true);
    showWorld();
  }

  function close() {
    visible("screen-probability-carnival", false);
    visible("screen-menu", true);
  }

  function showWorld() {
    const grid = $("probability-carnival-story-grid");
    grid.innerHTML = "";
    stories.forEach(story => {
      const button = document.createElement("button");
      button.className = "pc-story-card" + (story.state === "soon" ? " is-soon" : "");
      button.disabled = story.state === "soon";
      button.innerHTML =
        '<span class="pc-story-symbol" aria-hidden="true">' + story.symbol + '</span>' +
        '<span class="pc-story-kicker">' + story.kicker + '</span>' +
        '<strong>' + story.title + '</strong>' +
        '<span>' + story.description + '</span>' +
        '<small>' + (story.state === "ready" ? "Explore" : "Coming next") + '</small>';
      if (story.state === "ready") button.addEventListener("click", openStory);
      grid.appendChild(button);
    });
    visible("probability-carnival-world", true);
    visible("probability-carnival-story", false);
  }

  function openStory() {
    reset();
    visible("probability-carnival-world", false);
    visible("probability-carnival-story", true);
    $("pc-story-title").textContent = "The Curious Machine";
    $("pc-story-intro").textContent = "Four sky tokens are inside: three suns and one moon. Make a prediction, then investigate.";
    canvasApi.render($("pc-machine-canvas"));
    update();
  }

  function predict(value) {
    state.prediction = value;
    document.querySelectorAll("[data-prediction]").forEach(button => {
      button.classList.toggle("is-selected", button.dataset.prediction === value);
    });
    $("pc-feedback").textContent = "Prediction saved. Now investigate the machine.";
  }

  function run(count) {
    if (!state.prediction) {
      $("pc-feedback").textContent = "Make a prediction first. There is no wrong prediction.";
      return;
    }
    for (let i = 0; i < count; i += 1) {
      const result = library.draw(state.bag);
      if (result === "sun") state.sun += 1;
      else state.moon += 1;
    }
    canvasApi.render($("pc-machine-canvas"), state.sun >= state.moon ? "sun" : "moon");
    update();
    const total = state.sun + state.moon;
    $("pc-feedback").textContent = total < 8
      ? "Interesting. The results can wobble. What happens if we try again?"
      : "Now there is a longer trail of evidence. What pattern do you notice?";
  }

  function update() {
    const total = state.sun + state.moon;
    $("pc-sun-count").textContent = state.sun;
    $("pc-moon-count").textContent = state.moon;
    $("pc-total-count").textContent = total;
    $("pc-sun-bar").style.width = (total ? state.sun / total * 100 : 0) + "%";
    $("pc-moon-bar").style.width = (total ? state.moon / total * 100 : 0) + "%";
    $("pc-evidence").textContent = total
      ? "Evidence so far: " + state.sun + " sun results and " + state.moon + " moon results."
      : "No evidence yet. The machine is waiting.";
  }

  function reset() {
    state.prediction = null;
    state.sun = 0;
    state.moon = 0;
    state.bag = library.createBag();
    document.querySelectorAll("[data-prediction]").forEach(button => button.classList.remove("is-selected"));
    $("pc-feedback").textContent = "What do you think will happen more often?";
  }

  return { open, close, predict, run, showWorld };
})();