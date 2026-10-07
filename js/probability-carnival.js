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
    randomRun: null,
    busy: false,
    session: 0,
    score: readNumber("score"),
    streak: readNumber("streak")
  };

  function $(id) { return document.getElementById(id); }

  function readNumber(key) {
    try {
      const value = Number(localStorage.getItem(STORAGE_KEY + "_" + key));
      return Number.isFinite(value) && value >= 0 ? value : 0;
    } catch {
      return 0;
    }
  }

  function setText(id, value) {
    const node = $(id);
    if (node) node.textContent = String(value);
  }

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
    state.randomRun = null;
    state.busy = false;
    state.session += 1;
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
    $("pc-stage-badge").textContent = String(state.stage);
    $("pc-stage-note").textContent = stage.note;
    document.querySelectorAll("[data-stage]").forEach(button => {
      button.classList.toggle("is-active", Number(button.dataset.stage) === state.stage);
    });
  }

  function renderLevel() {
    const level = levels.find(item => item.id === state.level);
    if (!level) return;
    const stage = stages[level.stage - 1];
    $("pc-level-number").textContent = String(level.id);
    $("pc-level-kicker").textContent = "Stage " + level.stage + " · " + stage.name;
    $("pc-level-title").textContent = level.title;
    $("pc-level-prompt").textContent = level.prompt;
    const scene = $("pc-scene");
    const choices = $("pc-choice-area");
    scene.innerHTML = "";
    choices.innerHTML = "";
    scene.className = "pc-scene pc-scene-" + level.type + " pc-scene-variant-" + (((level.id - 1) % 6) + 1);
    $("pc-next").disabled = !state.completed.has(level.id) || level.id === levels.length;
    const machinePanel = document.createElement("div");
    machinePanel.className = "pc-machine-panel";
    machinePanel.innerHTML = '<div class="pc-machine-lights"><i class="pc-machine-light"></i><i class="pc-machine-light"></i><i class="pc-machine-light"></i></div><div class="pc-machine-label">PROBABILITY ENGINE · UNIT ' + String(level.id).padStart(2, "0") + '</div><span class="pc-machine-stage">READY</span>';
    scene.appendChild(machinePanel);
    feedback(
      state.completed.has(level.id)
        ? "⭐ Discovery collected. Replay it or move to the next level."
        : "Your move.",
      "neutral"
    );
    if (level.type === "intuition") renderIntuition(level, scene, choices);
    if (level.type === "compare") renderCompare(level, scene, choices);
    if (level.type === "build") renderBuild(level, scene, choices);
    if (level.type === "experiment") renderExperiment(level, scene, choices);
    if (level.type === "randomness") renderRandomness(level, scene, choices);
    if (level.type === "detective") renderDetective(level, scene, choices);
    if (level.type === "dice") renderDice(level, scene, choices);
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
    button.disabled = state.busy;
    container.appendChild(button);
    return button;
  }

  function tokenCounts(level) {
    const scenarios = {
      1: { sun: 8, moon: 0 },
      2: { sun: 8, moon: 0 },
      3: { sun: 7, moon: 1 },
      4: { sun: 1, moon: 7 },
      5: { sun: 4, moon: 4 },
      6: { sun: 0, moon: 8 },
      7: { sun: 8, moon: 0 },
      8: { sun: 8, moon: 1 },
      9: { sun: 1, moon: 8 },
      10: { sun: 5, moon: 5 }
    };
    return scenarios[level.id] || { sun: 4, moon: 4 };
  }

  function renderIntuition(level, scene, choices) {
    const counts = tokenCounts(level);
    const wheel = document.createElement("div");
    wheel.className = "pc-arcade-intuition";
    wheel.innerHTML =
      '<div class="pc-wheel-wrap"><div class="pc-pointer"></div><div class="pc-wheel" style="--sun:' + counts.sun + ';--moon:' + counts.moon + '"><span>☀</span><span>☾</span></div><div class="pc-wheel-label">PROBABILITY DIAL</div></div>' +
      '<div class="pc-arcade-copy"><strong>' + level.scenario + '</strong><span>' + level.outcome + '</span><div class="pc-probability-legend"><span>☀ Sun: ' + counts.sun + '</span><span>☾ Moon: ' + counts.moon + '</span></div><small>Make your prediction, then activate the machine.</small></div>';
    scene.appendChild(wheel);
    level.choices.forEach(choice => addChoice(choices, choice, choice));
    actionButton(choices, "⚙ Activate machine", () => spinIntuition(level), "pc-main-action");
  }

  function spinIntuition(level) {
    if (!state.selected || state.busy) {
      feedback(
        state.busy ? "The machine is running..." : "Choose your prediction first, then pull the lever.",
        "notice"
      );
      return;
    }
    state.busy = true;
    const session = state.session;
    const action = document.querySelector("#pc-choice-area .pc-main-action");
    if (action) action.disabled = true;
    const wheel = document.querySelector(".pc-wheel");
    wheel?.classList.remove("pc-spin");
    void wheel?.offsetWidth;
    wheel?.classList.add("pc-spin");
    window.setTimeout(() => {
      if (session !== state.session) return;
      state.revealed = true;
      state.busy = false;
      if (state.selected === level.answer) {
        complete(level.id, "⚡ Good prediction. The machine produced evidence that fits your idea.");
      } else {
        if (action) action.disabled = false;
        feedback("The machine surprised you. That is useful evidence. Reconsider the chance and try again.", "notice");
      }
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
    actionButton(choices, "⚙ Run machine", () => check(level), "pc-main-action");
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
    actionButton(choices, "⚙ Run " + total + " times", () => runExperiment(level), "pc-main-action");
  }

  function runExperiment(level) {
    if (!state.selected || state.busy) {
      feedback(
        state.busy ? "The machine is already running..." : "Make your prediction before pulling the lever.",
        "notice"
      );
      return;
    }
    state.busy = true;
    state.experimentResults = library.drawMany(level.bag, level.trials);
    renderLevel();
    complete(level.id, "⚙ Machine cycle complete. Compare the prediction with the evidence.");
  }

  function renderRandomness(level, scene, choices) {
    const trials = level.trials;
    const expected = Math.round(trials * 0.75);
    const surprisingSun = Math.max(0, Math.round(expected - trials * 0.35));
    const runs = [
      [Math.max(0, expected - 1), trials - Math.max(0, expected - 1)],
      [Math.min(trials, expected + 1), Math.max(0, trials - Math.min(trials, expected + 1))],
      [surprisingSun, Math.max(0, trials - surprisingSun)]
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
        state.randomRun = index;
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
    if (state.randomRun === null) {
      feedback("Pick a run first. What catches your eye?", "notice");
      return;
    }
    const choice = document.querySelector("#pc-choice-area .pc-choice.is-selected")?.dataset.value;
    const run = runs[Number(state.randomRun)];
    const ratioGap = Math.abs(run[0] / Math.max(1, level.trials) - 0.75);
    const answer = ratioGap >= 0.30 ? "surprising" : "close";
    if (choice === answer) complete(level.id, "🔦 Nice detective eye. Random runs can wobble around the theoretical chance.");
    else feedback("Look at the counts again. A short run can wander quite far from 3:1 without changing the machine.", "notice");
  }

  function renderDice(level, scene, choices) {
    const board = document.createElement("div");
    board.className = "pc-dice-lab";
    board.innerHTML = '<div class="pc-dice-machine"><span class="pc-dice-label">DICE LAB · NO STAKES</span><div class="pc-dice-row"></div><small>Rolls are experiments. There are no bets, prizes, or rewards for the roll.</small></div><div class="pc-dice-lesson">' + level.lesson + '</div>';
    const diceRow = board.querySelector(".pc-dice-row");
    for (let index = 0; index < level.dice; index += 1) {
      const die = document.createElement("div");
      die.className = "pc-die";
      die.textContent = "•";
      die.setAttribute("aria-label", "Die " + (index + 1) + " not rolled");
      diceRow.appendChild(die);
    }
    scene.appendChild(board);
    level.choices.forEach(choice => addChoice(choices, choice, choice));
    actionButton(choices, "🎲 Roll to test the idea", () => rollDice(level, diceRow), "pc-main-action");
  }

  function rollDice(level, diceRow) {
    if (!state.selected || state.busy) {
      feedback(state.busy ? "The dice are rolling..." : "Choose your prediction first, then run the experiment.", "notice");
      return;
    }
    state.busy = true;
    const dice = Array.from(diceRow.querySelectorAll(".pc-die"));
    dice.forEach((die, index) => {
      const value = Math.floor(Math.random() * 6) + 1;
      die.textContent = String(value);
      die.setAttribute("aria-label", "Die " + (index + 1) + " shows " + value);
      die.classList.remove("pc-die-roll");
      void die.offsetWidth;
      die.classList.add("pc-die-roll");
    });
    const session = state.session;
    window.setTimeout(() => {
      if (session !== state.session) return;
      state.busy = false;
      if (state.selected === level.answer) {
        complete(level.id, "🎲 Prediction checked. The roll is evidence, not a guarantee. " + level.lesson);
      } else {
        state.streak = 0;
        saveProgress();
        const action = document.querySelector("#pc-choice-area .pc-main-action");
        if (action) action.disabled = false;
        feedback("Not quite. Re-read the possible outcomes, then test the idea again.", "notice");
      }
    }, 360);
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
    state.busy = false;
    const firstTime = !state.completed.has(id);
    if (firstTime) {
      state.completed.add(id);
      state.score += 10 + Math.min(20, state.streak * 2);
      state.streak += 1;
      saveProgress();
    }
    renderLevelMap();
    const next = $("pc-next");
    if (next) next.disabled = !state.completed.has(id) || id === levels.length;
    document.querySelectorAll("#pc-choice-area button").forEach(button => { button.disabled = false; });
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
      if (state.selected === level.answer) complete(level.id, "⚙ Machine run complete. You chose from the machine's design.");
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
    if (state.busy) return;
    if (!state.completed.has(state.level)) {
      feedback("Complete this level first. Your prediction is still being tested.", "notice");
      return;
    }
    if (state.level >= levels.length) return;
    selectLevel(state.level + 1);
  }

  function showWorld() { selectLevel(state.level); }

  function openStory(id) {
    const map = { "curious-machine": 1, "machine-builder": 21, "mystery-tent": 51, "fairness-workshop": 56 };
    selectLevel(map[id] || 1);
  }

  return { open, close, selectStage, selectLevel, resetLevel, check, next, openStory, showWorld };
})();