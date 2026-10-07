window.ProbabilityCarnival = (() => {
  const { stages, levels } = window.ProbabilityCarnivalStories;
  const library = window.ProbabilityCarnivalLibrary;
  const STORAGE_KEY = "mfa_probability_carnival_v2";
  const state = {
    level: 1,
    stage: 1,
    completed: loadCompleted(),
    selected: null,
    builtTokens: [],
    experimentResults: [],
    clues: [],
    checked: false
  };

  function $(id) { return document.getElementById(id); }

  function loadCompleted() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return new Set(Array.isArray(value) ? value : []);
    } catch { return new Set(); }
  }

  function saveCompleted() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.completed])); } catch {}
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
    const target = Math.min(60, Math.max(1, (stage - 1) * 10 + 1));
    selectLevel(target);
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

    document.querySelectorAll("[data-stage]").forEach(button => {
      button.classList.toggle("is-active", Number(button.dataset.stage) === state.stage);
    });
  }

  function resetLevel(render = true) {
    const level = levels.find(item => item.id === state.level);
    state.selected = null;
    state.builtTokens = [];
    state.experimentResults = [];
    state.clues = [];
    state.checked = false;
    if (level?.type === "build") {
      state.builtTokens = Array.from({ length: 12 }, (_, i) => i < 6 ? "sun" : "moon");
    }
    if (render) renderLevel();
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
    $("pc-feedback").textContent = state.completed.has(level.id) ? "Level complete. You can replay it or move on." : "Make your move.";

    if (level.type === "intuition") renderIntuition(level, scene, choices);
    if (level.type === "compare") renderCompare(level, scene, choices);
    if (level.type === "build") renderBuild(level, scene, choices);
    if (level.type === "experiment") renderExperiment(level, scene, choices);
    if (level.type === "randomness") renderRandomness(level, scene, choices);
    if (level.type === "detective") renderDetective(level, scene, choices);
    renderLevelMap();
  }

  function addChoice(container, value, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pc-choice";
    button.dataset.value = value;
    button.textContent = label;
    button.addEventListener("click", () => {
      state.selected = value;
      container.querySelectorAll(".pc-choice").forEach(item => item.classList.toggle("is-selected", item === button));
    });
    container.appendChild(button);
  }

  function renderIntuition(level, scene, choices) {
    scene.innerHTML = '<div class="pc-situation"><span>🎡</span><div><strong>' + level.scenario + '</strong><small>' + level.outcome + '</small></div></div>';
    level.choices.forEach(choice => addChoice(choices, choice, choice));
  }

  function machineCard(tokens, label) {
    const card = document.createElement("div");
    card.className = "pc-machine-card";
    const sun = tokens[0], moon = tokens[1];
    card.innerHTML = '<h3>' + label + '</h3><div class="pc-token-row">' +
      '<span class="pc-token sun">☀️</span>'.repeat(Math.min(sun, 9)) +
      '<span class="pc-token moon">🌙</span>'.repeat(Math.min(moon, 9)) +
      '</div><p>' + sun + ' Sun · ' + moon + ' Moon</p>';
    return card;
  }

  function renderCompare(level, scene, choices) {
    const row = document.createElement("div");
    row.className = "pc-machine-pair";
    row.appendChild(machineCard(level.machineA, "Machine A"));
    row.appendChild(machineCard(level.machineB, "Machine B"));
    scene.appendChild(row);
    addChoice(choices, "A", "A has the greater chance");
    addChoice(choices, "equal", "They have equal chances");
    addChoice(choices, "B", "B has the greater chance");
  }

  function renderBuild(level, scene, choices) {
    const target = document.createElement("div");
    target.className = "pc-build-target";
    target.innerHTML = '<strong>Target: ' + level.sun + ' Sun · ' + level.moon + ' Moon</strong><span>Tap tokens to switch them.</span>';
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
        renderLevel();
      });
      slots.appendChild(button);
    });
    scene.appendChild(slots);
    const count = document.createElement("div");
    count.className = "pc-live-count";
    count.textContent = "Your machine: " + state.builtTokens.filter(x => x === "sun").length + " Sun · " + state.builtTokens.filter(x => x === "moon").length + " Moon";
    scene.appendChild(count);
    choices.innerHTML = '<span class="pc-action-hint">When the machine looks right, press Check.</span>';
  }

  function renderExperiment(level, scene, choices) {
    scene.appendChild(machineCard([3, 1], "3 : 1 machine"));
    const status = document.createElement("div");
    status.className = "pc-experiment-status";
    status.innerHTML = '<strong>' + (state.experimentResults.length ? state.experimentResults.length + " results collected" : "No trials yet") + '</strong>' +
      '<span>Sun: ' + state.experimentResults.filter(x => x === "sun").length + ' · Moon: ' + state.experimentResults.filter(x => x === "moon").length + '</span>';
    scene.appendChild(status);
    ["sun","moon"].forEach(value => addChoice(choices, value, value === "sun" ? "Predict Sun will be more common" : "Predict Moon will be more common"));
    const run = document.createElement("button");
    run.type = "button";
    run.className = "pc-run-button";
    run.textContent = "🎡 Run " + level.trials + " trials";
    run.addEventListener("click", () => runExperiment(level));
    choices.appendChild(run);
  }

  function runExperiment(level) {
    if (!state.selected) {
      feedback("Make a prediction before running the machine.", "notice");
      return;
    }
    state.experimentResults = library.drawMany(level.bag, level.trials);
    renderLevel();
    feedback("Experiment complete. You saw " + state.experimentResults.filter(x => x === "sun").length + " Sun and " + state.experimentResults.filter(x => x === "moon").length + " Moon results.", "success");
    state.checked = true;
    markComplete(level.id);
  }

  function renderRandomness(level, scene, choices) {
    const card = document.createElement("div");
    card.className = "pc-randomness-card";
    card.innerHTML = '<span class="pc-sample-icon">🔬</span><strong>' + level.trials + '-trial ' + level.sampleKind + ' run</strong><p>The machine is still a 3:1 machine. A random run does not have to reproduce the ratio exactly.</p>';
    scene.appendChild(card);
    level.choices.forEach(choice => addChoice(choices, choice, choice));
  }

  function renderDetective(level, scene, choices) {
    const clueCount = state.clues.length;
    const card = document.createElement("div");
    card.className = "pc-detective-card";
    card.innerHTML = '<span>🔎</span><strong>' + (clueCount ? "Clues collected: " + clueCount : "The machine is hidden") + '</strong><p>' +
      (clueCount ? "Sun: " + state.clues.filter(x => x === "sun").length + " · Moon: " + state.clues.filter(x => x === "moon").length : "Collect clues before making your call.") + '</p>';
    scene.appendChild(card);

    const collect = document.createElement("button");
    collect.type = "button";
    collect.className = "pc-run-button";
    collect.textContent = clueCount < 12 ? "🔎 Collect " + (12 - clueCount) + " clues" : "🔎 Clues collected";
    collect.disabled = clueCount >= 12;
    collect.addEventListener("click", () => {
      state.clues = library.drawMany(library.createBag(level.hiddenSun, level.hiddenMoon), 12);
      renderLevel();
      feedback("Twelve clues collected. Now make your detective call.", "neutral");
    });
    choices.appendChild(collect);

    level.choices.forEach(choice => addChoice(choices, choice, choice));
  }

  function check() {
    const level = levels.find(item => item.id === state.level);
    if (!level) return;

    if (level.type === "build") {
      const sun = state.builtTokens.filter(x => x === "sun").length;
      const moon = state.builtTokens.length - sun;
      const matchesRatio = sun * level.moon === moon * level.sun;
      if (sun + moon === state.builtTokens.length && matchesRatio) {
        markComplete(level.id);
        feedback("Machine built! You matched the requested ratio.", "success");
      } else {
        feedback("Not quite. Count the Sun and Moon tokens and try again.", "notice");
      }
      renderLevel();
      return;
    }

    if (level.type === "experiment") {
      if (!state.experimentResults.length) {
        feedback("Run the experiment first. Your prediction comes before the evidence.", "notice");
        return;
      }
      markComplete(level.id);
      feedback("Good experiment. A run gives evidence, not a guarantee about every future run.", "success");
      renderLevel();
      return;
    }

    if (level.type === "detective" && state.clues.length < 12) {
      feedback("Collect twelve clues before making your final detective call.", "notice");
      return;
    }

    if (!state.selected) {
      feedback("Choose an answer first.", "notice");
      return;
    }

    if (state.selected === level.answer) {
      markComplete(level.id);
      feedback(level.stage === 6 ? "Case solved. You used evidence to infer the hidden machine." : "Correct. Keep going and see how the next challenge changes.", "success");
    } else {
      feedback("Not quite. Treat the result as a clue and try again.", "notice");
    }
    renderLevel();
  }

  function markComplete(id) {
    state.completed.add(id);
    saveCompleted();
    state.checked = true;
  }

  function next() {
    if (state.level >= 60) return;
    selectLevel(state.level + 1);
  }

  function feedback(message, kind) {
    const box = $("pc-feedback");
    if (!box) return;
    box.textContent = message;
    box.className = "pc-feedback pc-feedback-" + (kind || "neutral");
  }

  function openStory(id) {
    const map = { "curious-machine": 1, "machine-builder": 21, "mystery-tent": 51, "fairness-workshop": 56 };
    selectLevel(map[id] || 1);
  }

  function showWorld() {
    selectLevel(state.level);
  }

  return {
    open, close, selectStage, selectLevel, resetLevel, check, next, openStory, showWorld
  };
})();