window.ProbabilityCarnival = (() => {
  const { stages, levels } = window.ProbabilityCarnivalStories;
  const library = window.ProbabilityCarnivalLibrary;
  const STORAGE_KEY = "mfa_probability_carnival_v3";
  const state = {
    level: 1,
    stage: 1,
    completed: loadSet("completed"),
    selected: null,
    builtTokens: [],
    experimentResults: [],
    clues: [],
    revealed: false,
    score: Number(localStorage.getItem(STORAGE_KEY + "_score")) || 0,
    streak: Number(localStorage.getItem(STORAGE_KEY + "_streak")) || 0
  };

  function $(id) { return document.getElementById(id); }

  function loadSet(key) {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY + "_" + key));
      return new Set(Array.isArray(value) ? value : []);
    } catch { return new Set(); }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY + "_completed", JSON.stringify([...state.completed]));
      localStorage.setItem(STORAGE_KEY + "_score", String(state.score));
      localStorage.setItem(STORAGE_KEY + "_streak", String(state.streak));
    } catch {}
  }

  function open() {
    document.getElementById("screen-menu")?.classList.remove("active");
    const screen = $("screen-probability-carnival");
    screen?.classList.add("active");
    if (screen) screen.hidden = false;
    selectLevel(state.level);
  }

  function close() {
    const screen = $("screen-probability-carnival");
    screen?.classList.remove("active");
    if (screen) screen.hidden = true;
    document.getElementById("screen-menu")?.classList.add("active");
  }

  function selectStage(stage) {
    selectLevel((stage - 1) * 10 + 1);
  }

  function selectLevel(id) {
    const level = levels.find(item => item.id === Number(id));
    if (!level) return;
    state.level = level.id;
    state.stage = level.stage;
    resetLevel(false);
    renderLevelMap();
    renderLevel();
  }

  function resetLevel(render = true) {
    const level = levels.find(item => item.id === state.level);
    state.selected = null;
    state.builtTokens = [];
    state.experimentResults = [];
    state.clues = [];
    state.revealed = false;
    if (level?.type === "build") {
      state.builtTokens = Array.from({ length: 12 }, (_, i) => i < 6 ? "sun" : "moon");
    }
    if (render) renderLevel();
  }

  function renderLevelMap() {
    const grid = $("pc-level-grid");
    if (!grid) return;
    grid.innerHTML = "";
    const first = (state.stage - 1) * 10 + 1;
    for (let id = first; id <= first + 9; id += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pc-level-button" + (id === state.level ? " is-current" : "") + (state.completed.has(id) ? " is-complete" : "");
      button.textContent = String(id);
      button.setAttribute("aria-label", "Level " + id + (state.completed.has(id) ? ", complete" : ""));
      button.setAttribute("aria-pressed", id === state.level ? "true" : "false");
      button.addEventListener("click", () => selectLevel(id));
      grid.appendChild(button);
    }
    const stage = stages[state.stage - 1];
    $("pc-level-range").textContent = stage.range;
    $("pc-stage-name").textContent = stage.name;
    $("pc-stage-badge").textContent = String(state.stage);
    $("pc-stage-note").textContent = stage.note;
    $("pc-completed-count").textContent = String(state.completed.size);
    $("pc-score").textContent = String(state.score);
    $("pc-streak").textContent = String(state.streak);
    document.querySelectorAll("[data-stage]").forEach(button => {
      button.classList.toggle("is-active", Number(button.dataset.stage) === state.stage);
    });
  }

  function renderLevel() {
    const level = levels.find(item => item.id === state.level);
    if (!level) return;
    const stage = stages[level.stage - 1];
    $("pc-current-level").textContent = String(level.id);
    $("pc-level-number").textContent = String(level.id);
    $("pc-level-kicker").textContent = "Stage " + level.stage + " · " + stage.name;
    $("pc-level-title").textContent = level.title;
    $("pc-level-prompt").textContent = level.prompt;
    const scene = $("pc-scene");
    const choices = $("pc-choice-area");
    scene.innerHTML = "";
    choices.innerHTML = "";
    $("pc-next").disabled = !state.completed.has(level.id) || level.id === 60;
    $("pc-feedback").textContent = state.completed.has(level.id) ? "⭐ Discovery collected. Replay it or move to the next level." : "Your move.";
    if (level.type === "intuition") renderIntuition(level, scene, choices);
    if (level.type === "compare") renderCompare(level, scene, choices);
    if (level.type === "build") renderBuild(level, scene, choices);
    if (level.type === "experiment") renderExperiment(level, scene, choices);
    if (level.type === "randomness") renderRandomness(level, scene, choices);
    if (level.type === "detective") renderDetective(level, scene, choices);
    renderLevelMap();
  }

  function addChoice(container, value, label, extraClass = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pc-choice " + extraClass;
    button.dataset.value = value;
    button.textContent = label;
    button.addEventListener("click", () => {
      state.selected = value;
      container.querySelectorAll(".pc-choice").forEach(item => item.classList.toggle("is-selected", item === button));
    });
    container.appendChild(button);
    return button;
  }

  function actionButton(container, label, handler, className = "pc-main-action") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", handler);
    container.appendChild(button);
    return button;
  }

  function tokenCounts(level) {
    if (level.answer === "impossible") return { sun: 8, moon: 0 };
    if (level.answer === "certain") return { sun: 0, moon: 8 };
    if (level.answer === "equally likely") return { sun: 4, moon: 4 };
    if (level.answer === "likely") return { sun: 2, moon: 6 };
    return { sun: 6, moon: 2 };
  }

  function renderIntuition(level, scene, choices) {
    const counts = tokenCounts(level);
    const wheel = document.createElement("div");
    wheel.className = "pc-arcade-intuition";
    wheel.innerHTML =
      '<div class="pc-wheel-wrap"><div class="pc-pointer"></div><div class="pc-wheel" style="--sun:' + counts.sun + ';--moon:' + counts.moon + '"><span>☀</span><span>☾</span></div><div class="pc-wheel-label">CHANCE WHEEL</div></div>' +
      '<div class="pc-arcade-copy"><strong>' + level.scenario + '</strong><span>' + level.outcome + '</span><small>Pick your prediction, then pull the carnival lever.</small></div>';
    scene.appendChild(wheel);
    level.choices.forEach(choice => addChoice(choices, choice, choice));
    actionButton(choices, "🎡 Pull the lever", () => spinIntuition(level), "pc-main-action");
  }

  function spinIntuition(level) {
    if (!state.selected) {
      feedback("Choose your prediction first, then pull the lever.", "notice");
      return;
    }
    const wheel = document.querySelector(".pc-wheel");
    wheel?.classList.remove("pc-spin");
    void wheel?.offsetWidth;
    wheel?.classList.add("pc-spin");
    window.setTimeout(() => {
      state.revealed = true;
      if (state.selected === level.answer) complete(level.id, "🎟️ Great call! The wheel agrees with your prediction.");
      else feedback("The wheel surprised you. That is useful evidence. Try the prediction again.", "notice");
    }, 480);
  }

  function machineCard(tokens, label, clickable = false) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "pc-machine-card" + (clickable ? " pc-machine-choice" : "");
    const sun = tokens[0], moon = tokens[1];
    card.dataset.machine = label;
    card.innerHTML = '<h3>' + label + '</h3><div class="pc-token-row">' +
      '<span class="pc-token sun">☀️</span>'.repeat(Math.min(sun, 9)) +
      '<span class="pc-token moon">🌙</span>'.repeat(Math.min(moon, 9)) +
      '</div><p>' + sun + ' Sun · ' + moon + ' Moon</p>';
    return card;
  }

  function renderCompare(level, scene, choices) {
    const row = document.createElement("div");
    row.className = "pc-machine-pair";
    const a = machineCard(level.machineA, "Machine A", true);
    const b = machineCard(level.machineB, "Machine B", true);
    [a,b].forEach(card => card.addEventListener("click", () => {
      state.selected = card.dataset.machine === "Machine A" ? "A" : "B";
      row.querySelectorAll(".pc-machine-choice").forEach(item => item.classList.toggle("is-selected", item === card));
      choices.querySelectorAll(".pc-choice").forEach(item => item.classList.toggle("is-selected", item.dataset.value === state.selected));
    }));
    row.append(a,b);
    scene.appendChild(row);
    addChoice(choices, "A", "A has the greater chance");
    addChoice(choices, "equal", "They have equal chances");
    addChoice(choices, "B", "B has the greater chance");
    actionButton(choices, "🚀 Launch a token", () => check(level), "pc-main-action");
  }

  function renderBuild(level, scene, choices) {
    const target = document.createElement("div");
    target.className = "pc-build-target";
    target.innerHTML = '<strong>Build ' + level.sun + ':' + level.moon + '</strong><span>Tap a token to flip it.</span>';
    scene.appendChild(target);
    const slots = document.createElement("div");
    slots.className = "pc-build-slots";
    state.builtTokens.forEach((token, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pc-build-token " + token;
      button.textContent = token === "sun" ? "☀️" : "🌙";
      button.setAttribute("aria-label", "Token " + (index + 1) + ", " + token);
      button.addEventListener("click", () => {
        state.builtTokens[index] = token === "sun" ? "moon" : "sun";
        button.classList.add("pc-token-flip");
        window.setTimeout(() => renderLevel(), 150);
      });
      slots.appendChild(button);
    });
    scene.appendChild(slots);
    const sun = state.builtTokens.filter(x => x === "sun").length;
    const moon = state.builtTokens.length - sun;
    const meter = document.createElement("div");
    meter.className = "pc-build-meter";
    meter.innerHTML = '<span>☀ ' + sun + '</span><div><i style="width:' + (sun / 12 * 100) + '%"></i></div><span>☾ ' + moon + '</span>';
    scene.appendChild(meter);
    actionButton(choices, "🔧 Test my machine", () => check(level), "pc-main-action");
    actionButton(choices, "🔀 Shuffle the tokens", () => {
      state.builtTokens.sort(() => Math.random() - 0.5);
      renderLevel();
      feedback("Fresh arrangement. The ratio stays the same until you flip a token.", "neutral");
    }, "pc-secondary-action");
  }

  function renderExperiment(level, scene, choices) {
    const total = level.trials;
    const sun = state.experimentResults.filter(x => x === "sun").length;
    const moon = state.experimentResults.length - sun;
    const track = document.createElement("div");
    track.className = "pc-experiment-board";
    track.innerHTML = '<div class="pc-machine-mini"><span>☀ ☀ ☀ ☾</span><strong>3 : 1</strong><small>Pull to test it</small></div><div class="pc-result-track" aria-label="Experiment results"></div><div class="pc-experiment-count">' + state.experimentResults.length + '/' + total + '</div>';
    scene.appendChild(track);
    const dots = track.querySelector(".pc-result-track");
    state.experimentResults.forEach(result => {
      const dot = document.createElement("span");
      dot.className = "pc-result-dot " + result;
      dot.textContent = result === "sun" ? "☀" : "☾";
      dots.appendChild(dot);
    });
    const stat = document.createElement("div");
    stat.className = "pc-experiment-stats";
    stat.innerHTML = '<span>☀ ' + sun + '</span><span>☾ ' + moon + '</span>';
    scene.appendChild(stat);
    addChoice(choices, "sun", "☀ Predict Sun will lead");
    addChoice(choices, "moon", "☾ Predict Moon will lead");
    actionButton(choices, "🎠 Pull " + total + " times", () => runExperiment(level), "pc-main-action");
  }

  function runExperiment(level) {
    if (!state.selected) {
      feedback("Make your prediction before pulling the lever.", "notice");
      return;
    }
    state.experimentResults = library.drawMany(level.bag, level.trials);
    renderLevel();
    window.setTimeout(() => complete(level.id, "🎠 Experiment complete. Your prediction met real random results."), 80);
  }

  function renderRandomness(level, scene, choices) {
    const trials = level.trials;
    const expected = Math.round(trials * 0.75);
    const runs = [
      [Math.max(0, expected - 1), trials - Math.max(0, expected - 1)],
      [Math.min(trials, expected + 2), Math.max(0, trials - (expected + 2))],
      [Math.max(0, expected - 3), Math.max(0, trials - Math.max(0, expected - 3))]
    ];
    const card = document.createElement("div");
    card.className = "pc-sample-board";
    card.innerHTML = '<strong>Three mystery runs from the same 3:1 machine</strong><small>Tap the run that looks most surprising for only ' + trials + ' trials.</small>';
    const runRow = document.createElement("div");
    runRow.className = "pc-sample-runs";
    runs.forEach((run,index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pc-sample-run";
      button.dataset.value = String(index);
      button.innerHTML = '<b>Run ' + (index + 1) + '</b><span>' + "☀ ".repeat(run[0]) + "☾ ".repeat(run[1]) + '</span><small>' + run[0] + ' Sun · ' + run[1] + ' Moon</small>';
      button.addEventListener("click", () => {
        state.selected = String(index);
        runRow.querySelectorAll(".pc-sample-run").forEach(item => item.classList.toggle("is-selected", item === button));
      });
      runRow.appendChild(button);
    });
    card.appendChild(runRow);
    scene.appendChild(card);
    addChoice(choices, "close", "This is close to the expected pattern");
    addChoice(choices, "surprising", "This is a surprising short run");
    addChoice(choices, "guaranteed", "The exact ratio is guaranteed");
    actionButton(choices, "🔦 Reveal the evidence", () => checkRandomness(level, runs), "pc-main-action");
  }

  function checkRandomness(level, runs) {
    if (state.selected === null) {
      feedback("Pick a run first. What catches your eye?", "notice");
      return;
    }
    const choice = document.querySelector("#pc-choice-area .pc-choice.is-selected")?.dataset.value;
    const run = runs[Number(state.selected)];
    const ratioGap = Math.abs(run[0] / Math.max(1, level.trials) - 0.75);
    const answer = ratioGap > 0.35 ? "surprising" : "close";
    if (choice === answer) complete(level.id, "🔦 Nice detective eye. Random runs can wobble around the theoretical chance.");
    else feedback("Look at the counts again. A short run can wander quite far from 3:1 without changing the machine.", "notice");
  }

  function renderDetective(level, scene, choices) {
    const clueCount = state.clues.length;
    const card = document.createElement("div");
    card.className = "pc-detective-card pc-vault";
    card.innerHTML = '<span class="pc-vault-icon">🔐</span><div><strong>' + (clueCount ? "Evidence board: " + clueCount + " clues" : "A locked machine is humming...") + '</strong><p>' +
      (clueCount ? "☀ Sun: " + clueCountOf("sun") + ' · ☾ Moon: ' + clueCountOf("moon") : "Collect the clues, then open the case.") + '</p></div>';
    scene.appendChild(card);
    const evidence = document.createElement("div");
    evidence.className = "pc-evidence-strip";
    state.clues.slice(0,12).forEach(result => {
      const chip = document.createElement("span");
      chip.textContent = result === "sun" ? "☀" : "☾";
      chip.className = result;
      evidence.appendChild(chip);
    });
    scene.appendChild(evidence);
    actionButton(choices, clueCount < 12 ? "🔎 Collect 12 clues" : "🗝️ Open the case", () => {
      if (clueCount < 12) {
        state.clues = library.drawMany(library.createBag(level.hiddenSun, level.hiddenMoon), 12);
        renderLevel();
        feedback("Evidence collected. Now inspect the pattern and make your call.", "neutral");
      } else {
        check(level);
      }
    }, "pc-main-action");
    level.choices.forEach(choice => addChoice(choices, choice, choice === "Fair" ? "⚖ Fair" : choice === "Mostly Sun" ? "☀ Mostly Sun" : "☾ Mostly Moon"));
  }

  function clueCountOf(value) {
    return state.clues.filter(x => x === value).length;
  }

  function complete(id, message) {
    const firstTime = !state.completed.has(id);
    if (firstTime) {
      state.completed.add(id);
      state.score += 10 + Math.min(20, state.streak * 2);
      state.streak += 1;
      saveProgress();
    }
    renderLevelMap();
    $("pc-score").textContent = String(state.score);
    $("pc-streak").textContent = String(state.streak);
    feedback(message + (firstTime ? " +10 discovery points!" : ""), "success");
    document.querySelector(".pc-play-panel")?.classList.remove("pc-celebrate");
    void document.querySelector(".pc-play-panel")?.offsetWidth;
    document.querySelector(".pc-play-panel")?.classList.add("pc-celebrate");
  }

  function check(levelOverride) {
    const level = levelOverride || levels.find(item => item.id === state.level);
    if (!level) return;
    if (level.type === "build") {
      const sun = state.builtTokens.filter(x => x === "sun").length;
      const moon = state.builtTokens.length - sun;
      if (sun * level.moon === moon * level.sun) complete(level.id, "🔧 Machine tuned! The token ratio is right.");
      else {
        state.streak = 0;
        saveProgress();
        feedback("Not quite. Tune the Sun and Moon counts, then test again.", "notice");
      }
      return;
    }
    if (level.type === "compare") {
      if (!state.selected) {
        feedback("Choose a machine or answer below before launching.", "notice");
        return;
      }
      if (state.selected === level.answer) complete(level.id, "🚀 Launch successful. You chose using the machine design.");
      else {
        state.streak = 0;
        saveProgress();
        feedback("The launch missed the best choice. Inspect the token counts and try again.", "notice");
      }
      return;
    }
    if (level.type === "detective") {
      if (state.clues.length < 12) {
        feedback("Collect all twelve clues before opening the case.", "notice");
        return;
      }
      if (state.selected === level.answer) complete(level.id, "🕵️ Case solved. Your evidence matched the hidden machine.");
      else {
        state.streak = 0;
        saveProgress();
        feedback("The evidence is still telling you something else. Recount the clues and try again.", "notice");
      }
      return;
    }
    if (!state.selected) {
      feedback("Choose an answer first.", "notice");
      return;
    }
    if (state.selected === level.answer) complete(level.id, "Correct. You found the probability pattern.");
    else {
      state.streak = 0;
      saveProgress();
      feedback("Not quite. Treat the result as a clue and try again.", "notice");
    }
  }

  function feedback(message, kind) {
    const box = $("pc-feedback");
    if (!box) return;
    box.textContent = message;
    box.className = "pc-feedback pc-feedback-" + (kind || "neutral");
  }

  function next() {
    if (state.level >= 60) return;
    selectLevel(state.level + 1);
  }

  function showWorld() { selectLevel(state.level); }

  function openStory(id) {
    const map = { "curious-machine": 1, "machine-builder": 21, "mystery-tent": 51, "fairness-workshop": 56 };
    selectLevel(map[id] || 1);
  }

  return { open, close, selectStage, selectLevel, resetLevel, check, next, openStory, showWorld };
})();