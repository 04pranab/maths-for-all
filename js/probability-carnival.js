/* ===== Bundled from js/probability-carnival-library.js ===== */
window.ProbabilityCarnivalLibrary = (() => {
  function createBag(sunCount = 3, moonCount = 1) {
    return [
      ...Array.from({ length: sunCount }, () => "sun"),
      ...Array.from({ length: moonCount }, () => "moon"),
    ];
  }

  function draw(bag) {
    if (!Array.isArray(bag) || bag.length === 0) {
      throw new Error("A probability machine needs at least one token.");
    }

    return bag[Math.floor(Math.random() * bag.length)];
  }

  function drawMany(bag, count) {
    const results = [];

    for (let i = 0; i < count; i += 1) {
      results.push(draw(bag));
    }

    return results;
  }

  function counts(results) {
    return results.reduce(
      (total, result) => {
        total[result] = (total[result] || 0) + 1;
        return total;
      },
      { sun: 0, moon: 0 },
    );
  }

  function dominant(count) {
    if (count.sun === count.moon) {
      return "equal";
    }

    return count.sun > count.moon ? "sun" : "moon";
  }

  function probability(tokens, result) {
    if (!tokens.length) {
      return 0;
    }

    return tokens.filter((token) => token === result).length / tokens.length;
  }

  return {
    createBag,
    draw,
    drawMany,
    counts,
    dominant,
    probability,
  };
})();

;

/* ===== Bundled from js/probability-carnival-stories.js ===== */
window.ProbabilityCarnivalStories = (() => {
  const stages = [
    {
      number: 1,
      name: "Probability intuition",
      range: "Levels 1–12",
      note: "Learn the language of chance by making quick predictions.",
      objective:
        "Decide whether an outcome is impossible, certain, likely, unlikely, or equally likely.",
    },
    {
      number: 2,
      name: "Compare",
      range: "Levels 13–24",
      note: "Put two chances side by side and decide which is greater, smaller, or equal.",
      objective: "Compare chances before the machine gives you an answer.",
    },
    {
      number: 3,
      name: "Build",
      range: "Levels 25–36",
      note: "Build machines with simple ratios and make the requested chance.",
      objective: "Change the token mix to construct a probability machine.",
    },
    {
      number: 4,
      name: "Experiment",
      range: "Levels 37–48",
      note: "Run trials, collect results, and compare what happened.",
      objective:
        "Use experimental results as evidence rather than expecting every run to match perfectly.",
    },
    {
      number: 5,
      name: "Randomness",
      range: "Levels 49–60",
      note: "Investigate short runs, longer runs, theoretical probability, and sample size.",
      objective:
        "Explain why random results can wobble and why more trials often give a clearer picture.",
    },
    {
      number: 6,
      name: "Probability Detective",
      range: "Levels 61–72",
      note: "Use clues to uncover hidden machines and identify fair or unfair designs.",
      objective: "Infer a hidden configuration from evidence and explain your reasoning.",
    },
    {
      number: 7,
      name: "Dice Lab",
      range: "Levels 73–84",
      note: "Explore fair dice, two-dice sums, repeated rolls, and independent events with no betting or prizes.",
      objective:
        "Use sample spaces, equally likely outcomes, and repeated experiments to reason about chance.",
    },
  ];
  const intuitionScenarios = [
    ["A sealed machine has no Moon tokens.", "Moon appears.", "impossible"],
    ["A machine has only Sun tokens.", "Moon appears.", "impossible"],
    ["A bag has 7 blue tokens and 1 red token.", "Red appears.", "unlikely"],
    ["A bag has 1 blue token and 7 red tokens.", "Red appears.", "likely"],
    ["A bag has 4 blue tokens and 4 red tokens.", "Blue appears.", "equally likely"],
    ["A machine has only Moon tokens.", "Moon appears.", "certain"],
    ["A machine has only Sun tokens.", "Sun appears.", "certain"],
    ["A machine has 8 Sun tokens and 1 Moon token.", "Moon appears.", "unlikely"],
    ["A machine has 1 Sun token and 8 Moon tokens.", "Moon appears.", "likely"],
    ["A machine has 5 Sun tokens and 5 Moon tokens.", "Sun appears.", "equally likely"],
    ["A machine has 2 Sun tokens and 6 Moon tokens.", "Sun appears.", "unlikely"],
    ["A machine has 6 Sun tokens and 2 Moon tokens.", "Sun appears.", "likely"],
  ];
  const comparePairs = [
    [[3, 1], [1, 3], "sun"],
    [[1, 3], [3, 1], "moon"],
    [[2, 2], [2, 2], "equal"],
    [[4, 2], [2, 4], "sun"],
    [[2, 4], [4, 2], "moon"],
    [[3, 3], [1, 1], "equal"],
    [[5, 1], [3, 3], "sun"],
    [[1, 5], [3, 3], "moon"],
    [[2, 2], [1, 3], "sun"],
    [[1, 3], [2, 2], "moon"],
    [[6, 2], [3, 3], "sun"],
    [[3, 3], [2, 6], "moon"],
  ];
  const buildTargets = [
    [1, 1, "equal"],
    [2, 1, "sun"],
    [3, 1, "sun"],
    [1, 3, "moon"],
    [2, 2, "equal"],
    [3, 1, "sun"],
    [1, 2, "moon"],
    [3, 3, "equal"],
    [1, 3, "moon"],
    [3, 1, "sun"],
    [2, 1, "sun"],
    [1, 2, "moon"],
  ];
  const experimentTrials = [5, 10, 20, 5, 10, 20, 5, 10, 20, 20, 10, 20];
  const randomnessSamples = [
    [5, "short"],
    [20, "long"],
    [5, "short"],
    [20, "long"],
    [10, "medium"],
    [20, "long"],
    [5, "short"],
    [20, "long"],
    [10, "medium"],
    [20, "long"],
    [10, "medium"],
    [5, "short"],
  ];
  const mysteryConfigs = [
    [4, 4, "fair"],
    [6, 2, "sun"],
    [2, 6, "moon"],
    [5, 3, "sun"],
    [3, 5, "moon"],
    [4, 4, "fair"],
    [7, 1, "sun"],
    [1, 7, "moon"],
    [4, 4, "fair"],
    [6, 2, "sun"],
    [5, 3, "sun"],
    [3, 5, "moon"],
  ];
  const diceLevels = [
    {
      title: "Fair die: one face",
      prompt:
        "A fair six-sided die is rolled once. Is rolling a 1 more likely, rolling a 6 more likely, or are they equally likely?",
      choices: ["Rolling a 1", "Rolling a 6", "They are equally likely"],
      answer: "They are equally likely",
      dice: 1,
      lesson: "Every face on a fair die has the same chance.",
    },
    {
      title: "Even or odd?",
      prompt:
        "A fair six-sided die is rolled once. Is an even result more likely, an odd result more likely, or are they equally likely?",
      choices: ["Even", "Odd", "They are equally likely"],
      answer: "They are equally likely",
      dice: 1,
      lesson: "Three faces are even and three are odd.",
    },
    {
      title: "Four faces or two?",
      prompt: "On a fair die, which is more likely: rolling 1, 2, 3, or 4, or rolling 5 or 6?",
      choices: ["1–4", "5–6", "They are equally likely"],
      answer: "1–4",
      dice: 1,
      lesson: "Four equally likely faces beat two equally likely faces.",
    },
    {
      title: "Two dice: find 7",
      prompt: "Two fair dice are rolled. Which total is more likely: a sum of 7 or a sum of 2?",
      choices: ["Sum 7", "Sum 2", "They are equally likely"],
      answer: "Sum 7",
      dice: 2,
      lesson: "There are six ways to make 7, but only one way to make 2.",
    },
    {
      title: "Two dice: 8 or 12?",
      prompt: "Two fair dice are rolled. Which total is more likely: a sum of 8 or a sum of 12?",
      choices: ["Sum 8", "Sum 12", "They are equally likely"],
      answer: "Sum 8",
      dice: 2,
      lesson: "Several pairs make 8; only 6+6 makes 12.",
    },
    {
      title: "Even totals",
      prompt:
        "Two fair dice are rolled. Is an even total more likely, an odd total more likely, or are they equally likely?",
      choices: ["Even total", "Odd total", "They are equally likely"],
      answer: "They are equally likely",
      dice: 2,
      lesson: "The 36 equally likely ordered pairs split evenly by total parity.",
    },
    {
      title: "Big totals",
      prompt:
        "Two fair dice are rolled. Which is more likely: a total of 10 or more, or a total below 10?",
      choices: ["10 or more", "Below 10", "They are equally likely"],
      answer: "Below 10",
      dice: 2,
      lesson: "The sample space contains many more totals below 10.",
    },
    {
      title: "One six or two sixes?",
      prompt:
        "Two fair dice are rolled. Which event is more likely: at least one die shows 6, or both dice show 6?",
      choices: ["At least one 6", "Two sixes", "They are equally likely"],
      answer: "At least one 6",
      dice: 2,
      lesson: "An event can have many successful outcomes even when each roll is fair.",
    },
    {
      title: "Twelve rolls",
      prompt: "A fair die is rolled 12 times. Must every face appear exactly twice?",
      choices: ["Yes, exactly twice", "No, not guaranteed", "Only if the first roll is a 6"],
      answer: "No, not guaranteed",
      dice: 1,
      lesson: "Probability describes chance, not a promise about a short run.",
    },
    {
      title: "The next roll",
      prompt:
        "A fair die has not shown 6 for several rolls. On the next roll, is 6 now more likely than the other faces?",
      choices: ["Yes, 6 is due", "No, all faces are still equally likely", "Only if we roll twice"],
      answer: "No, all faces are still equally likely",
      dice: 1,
      lesson: "Past independent rolls do not change the probability of the next fair roll.",
    },
    {
      title: "Three dice: 3 or 4?",
      prompt: "Three fair dice are rolled. Which total is more likely: 3 or 4?",
      choices: ["Sum 3", "Sum 4", "They are equally likely"],
      answer: "Sum 4",
      dice: 3,
      lesson: "Three dice can make 4 in three ordered ways, but only one way makes 3.",
    },
    {
      title: "Same or different?",
      prompt:
        "Two fair dice are rolled. Which event is more likely: both dice match, or the dice show different numbers?",
      choices: ["Same number", "Different numbers", "They are equally likely"],
      answer: "Different numbers",
      dice: 2,
      lesson: "There are 6 matching pairs and 30 different-number pairs.",
    },
  ];
  function buildLevels() {
    const levels = [];
    intuitionScenarios.forEach((item, index) =>
      levels.push({
        id: index + 1,
        stage: 1,
        type: "intuition",
        title: "Chance check",
        prompt: item[0] + " What do you think about: " + item[1],
        scenario: item[0],
        outcome: item[1],
        choices: ["impossible", "unlikely", "equally likely", "likely", "certain"],
        answer: item[2],
      }),
    );
    comparePairs.forEach((item, index) =>
      levels.push({
        id: 13 + index,
        stage: 2,
        type: "compare",
        title: "Which chance wins?",
        prompt:
          "Compare the two machines. Choose which gives Sun the greater chance, Moon the greater chance, or whether they are equal.",
        machineA: item[0],
        machineB: item[1],
        choices: ["A", "equal", "B"],
        answer: item[2] === "equal" ? "equal" : item[2] === "sun" ? "A" : "B",
      }),
    );
    buildTargets.forEach((item, index) =>
      levels.push({
        id: 25 + index,
        stage: 3,
        type: "build",
        title: "Build " + item[0] + ":" + item[1],
        prompt:
          "Build a machine with " +
          item[0] +
          " Sun token" +
          (item[0] === 1 ? "" : "s") +
          " and " +
          item[1] +
          " Moon token" +
          (item[1] === 1 ? "" : "s") +
          ".",
        sun: item[0],
        moon: item[1],
        answer: item[2],
      }),
    );
    experimentTrials.forEach((trials, index) =>
      levels.push({
        id: 37 + index,
        stage: 4,
        type: "experiment",
        title: "Run " + trials + " trials",
        prompt: "Predict which result will be more common, then run exactly " + trials + " trials.",
        trials,
        bag: ["sun", "sun", "sun", "moon"],
        answer: "sun",
      }),
    );
    randomnessSamples.forEach((item, index) =>
      levels.push({
        id: 49 + index,
        stage: 5,
        type: "randomness",
        title: "What does the sample tell us?",
        prompt:
          "A 3:1 machine is tested. Choose the best explanation for a " +
          item[1] +
          " run of " +
          item[0] +
          " trials.",
        trials: item[0],
        sampleKind: item[1],
        choices: [
          "Random results can vary from the exact theoretical ratio.",
          "A short run proves the machine has changed.",
          "Theoretical probability guarantees every run exactly.",
        ],
        answer: "Random results can vary from the exact theoretical ratio.",
      }),
    );
    mysteryConfigs.forEach((config, index) =>
      levels.push({
        id: 61 + index,
        stage: 6,
        type: "detective",
        title: "Crack the mystery",
        prompt: "The machine is hidden. Collect clues, then identify the hidden design.",
        hiddenSun: config[0],
        hiddenMoon: config[1],
        hiddenKind: config[2],
        choices: ["Mostly Sun", "Fair", "Mostly Moon"],
        answer: config[2] === "sun" ? "Mostly Sun" : config[2] === "moon" ? "Mostly Moon" : "Fair",
      }),
    );
    diceLevels.forEach((item, index) =>
      levels.push({
        id: 73 + index,
        stage: 7,
        type: "dice",
        title: item.title,
        prompt: item.prompt,
        choices: item.choices,
        answer: item.answer,
        dice: item.dice,
        lesson: item.lesson,
      }),
    );
    return levels;
  }
  return { stages, levels: buildLevels() };
})();

;

/* ===== Bundled from js/probability-carnival-canvas.js ===== */
window.ProbabilityCarnivalCanvas = (() => {
  const TOKENS = {
    sun: { label: "☀", color: "#e39a2d", light: "#fff0c8" },
    moon: { label: "☾", color: "#74658d", light: "#eee9f7" },
  };

  function setup(canvas) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    return { ctx, width, height };
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.max(0, Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawAwning(ctx, centerX, topY, width) {
    const segment = width / 7;

    for (let index = 0; index < 7; index += 1) {
      ctx.fillStyle = index % 2 === 0 ? "#765a72" : "#f4b942";
      ctx.beginPath();
      ctx.moveTo(centerX - width / 2 + index * segment, topY);
      ctx.lineTo(centerX - width / 2 + (index + 1) * segment, topY);
      ctx.lineTo(centerX - width / 2 + (index + 1) * segment - 8, topY + 24);
      ctx.quadraticCurveTo(
        centerX - width / 2 + (index + 0.5) * segment,
        topY + 34,
        centerX - width / 2 + index * segment + 8,
        topY + 24,
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawToken(ctx, x, y, token, radius) {
    const item = TOKENS[token];

    ctx.fillStyle = item.light;
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fffdf8";
    ctx.font = "800 " + Math.round(radius * 1.15) + "px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.label, x, y + 1);
  }

  function drawMachine(ctx, width, height, tokens, result) {
    const centerX = width / 2;
    const machineWidth = Math.max(260, Math.min(width * 0.78, 430));
    const machineHeight = Math.max(170, Math.min(height * 0.68, 250));
    const machineX = centerX - machineWidth / 2;
    const machineY = height * 0.18;

    drawAwning(ctx, centerX, machineY - 20, machineWidth * 0.86);

    ctx.fillStyle = "#fffdf8";
    ctx.strokeStyle = "#263238";
    ctx.lineWidth = 5;
    roundedRect(ctx, machineX, machineY + 5, machineWidth, machineHeight, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#263238";
    ctx.font = "900 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PROBABILITY ENGINE", centerX, machineY + 35);

    const chamberX = machineX + 24;
    const chamberY = machineY + 52;
    const chamberWidth = machineWidth - 48;
    const chamberHeight = machineHeight - 86;

    ctx.fillStyle = "#edf5e9";
    ctx.strokeStyle = "#b9ccbf";
    ctx.lineWidth = 3;
    roundedRect(ctx, chamberX, chamberY, chamberWidth, chamberHeight, 18);
    ctx.fill();
    ctx.stroke();

    const maxVisible = Math.min(tokens.length, 12);
    const columns = maxVisible <= 6 ? maxVisible : 6;
    const rows = Math.ceil(maxVisible / columns);
    const gapX = chamberWidth / (columns + 1);
    const gapY = chamberHeight / (rows + 1);
    const radius = Math.min(20, gapX * 0.27, gapY * 0.27);

    for (let index = 0; index < maxVisible; index += 1) {
      const column = index % columns;
      const row = Math.floor(index / columns);
      drawToken(
        ctx,
        chamberX + gapX * (column + 1),
        chamberY + gapY * (row + 1),
        tokens[index],
        radius,
      );
    }

    const chuteY = machineY + machineHeight - 14;

    ctx.fillStyle = "#263238";
    roundedRect(ctx, centerX - 36, chuteY, 72, 42, 10);
    ctx.fill();

    if (result) {
      drawToken(ctx, centerX, chuteY + 21, result, 17);

      ctx.fillStyle = TOKENS[result].color;
      ctx.font = "900 22px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(result === "sun" ? "SUN!" : "MOON!", centerX, height * 0.91);
    } else {
      ctx.fillStyle = "#56666b";
      ctx.font = "800 15px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Choose your move, then spin the machine!", centerX, height * 0.91);
    }
  }

  function drawBars(ctx, width, height, values, labels) {
    const max = Math.max(1, ...values);
    const baseY = height - 42;
    const barWidth = Math.min(120, width / (values.length * 2.2));
    const gap = barWidth * 0.55;
    const totalWidth = values.length * barWidth + (values.length - 1) * gap;
    let x = (width - totalWidth) / 2;

    values.forEach((value, index) => {
      const barHeight = (height - 110) * (value / max);

      ctx.fillStyle = index === 0 ? TOKENS.sun.color : TOKENS.moon.color;
      roundedRect(ctx, x, baseY - barHeight, barWidth, Math.max(8, barHeight), 10);
      ctx.fill();

      ctx.fillStyle = "#263238";
      ctx.font = "800 15px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[index], x + barWidth / 2, baseY + 24);
      ctx.fillText(String(value), x + barWidth / 2, baseY - barHeight - 10);

      x += barWidth + gap;
    });
  }

  function render(canvas, scene = {}) {
    const { ctx, width, height } = setup(canvas);
    const tokens = scene.tokens || ["sun", "sun", "sun", "moon"];

    ctx.fillStyle = "#fffaf0";
    ctx.fillRect(0, 0, width, height);

    if (scene.kind === "bars") {
      drawBars(ctx, width, height, scene.values || [0, 0], scene.labels || ["Sun", "Moon"]);
      return;
    }

    drawMachine(ctx, width, height, tokens, scene.result || null);

    if (scene.highlight) {
      ctx.strokeStyle = "#f4b942";
      ctx.lineWidth = 5;
      ctx.setLineDash([8, 7]);
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.5, Math.min(width, height) * 0.39, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function animateResult(canvas, tokens, result, onComplete) {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const duration = reduced ? 0 : 520;

    if (!duration) {
      render(canvas, { tokens, result });
      onComplete?.();
      return;
    }

    const start = performance.now();

    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);

      render(canvas, {
        tokens,
        result: progress > 0.58 ? result : null,
        highlight: progress < 0.68,
      });

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        onComplete?.();
      }
    }

    requestAnimationFrame(frame);
  }

  return {
    render,
    animateResult,
  };
})();

;

/* ===== Bundled from js/probability-carnival.js ===== */
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
    streak: readNumber("streak"),
  };

  function $(id) {
    return document.getElementById(id);
  }

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
    } catch {
      return new Set();
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY + "_completed", JSON.stringify([...state.completed]));
      localStorage.setItem(STORAGE_KEY + "_score", String(state.score));
      localStorage.setItem(STORAGE_KEY + "_streak", String(state.streak));
    } catch {}
  }

  function open() {
    if (typeof Game !== "undefined") Game.setRoute("probability-machine");
    document.getElementById("screen-menu")?.classList.remove("active");
    const screen = $("screen-probability-carnival");
    screen?.classList.add("active");
    if (screen) screen.hidden = false;
    selectLevel(state.level);
  }

  function close() {
    if (typeof Game !== "undefined") { Game.goHome(); return; }
    const screen = $("screen-probability-carnival");
    screen?.classList.remove("active");
    if (screen) screen.hidden = true;
    document.getElementById("screen-menu")?.classList.add("active");
  }

  function selectStage(stage) {
    selectLevel((stage - 1) * 12 + 1);
  }

  function selectLevel(id) {
    const level = levels.find((item) => item.id === Number(id));
    if (!level) return;
    state.level = level.id;
    state.stage = level.stage;
    resetLevel(false);
    renderLevelMap();
    renderLevel();
  }

  function resetLevel(render = true) {
    const level = levels.find((item) => item.id === state.level);
    state.selected = null;
    state.builtTokens = [];
    state.experimentResults = [];
    state.clues = [];
    state.revealed = false;
    state.randomRun = null;
    state.busy = false;
    state.session += 1;
    if (level?.type === "build") {
      state.builtTokens = Array.from({ length: 12 }, (_, i) => (i < 6 ? "sun" : "moon"));
    }
    if (render) renderLevel();
  }

  function renderLevelMap() {
    const grid = $("pc-level-grid");
    if (!grid) return;
    grid.innerHTML = "";
    const first = (state.stage - 1) * 12 + 1;
    for (let id = first; id <= first + 11; id += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "pc-level-button" +
        (id === state.level ? " is-current" : "") +
        (state.completed.has(id) ? " is-complete" : "");
      button.textContent = String(id);
      button.setAttribute(
        "aria-label",
        "Level " + id + (state.completed.has(id) ? ", complete" : ""),
      );
      button.setAttribute("aria-pressed", id === state.level ? "true" : "false");
      button.addEventListener("click", () => selectLevel(id));
      grid.appendChild(button);
    }
    const stage = stages[state.stage - 1];
    $("pc-level-range").textContent = stage.range;
    $("pc-stage-badge").textContent = String(state.stage);
    $("pc-stage-note").textContent = stage.note;
    document.querySelectorAll("[data-stage]").forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.stage) === state.stage);
    });
  }

  function renderLevel() {
    const level = levels.find((item) => item.id === state.level);
    if (!level) return;
    const stage = stages[level.stage - 1];
    $("pc-level-number").textContent = String(level.id);
    $("pc-level-range").textContent =
      "LEVEL " + String(level.id).padStart(2, "0") + " / " + String(levels.length).padStart(2, "0");
    $("pc-machine-stage").textContent = "Stage " + level.stage + " · " + stage.name;
    $("pc-system-state").textContent = state.completed.has(level.id)
      ? "DISCOVERY SAVED"
      : "SYSTEM ONLINE";
    $("pc-level-title").textContent = level.title;
    $("pc-level-prompt").textContent = level.prompt;
    const scene = $("pc-scene");
    const choices = $("pc-choice-area");
    scene.innerHTML = "";
    choices.innerHTML = "";
    scene.className =
      "pc-scene pc-scene-" + level.type + " pc-scene-variant-" + (((level.id - 1) % 6) + 1);
    $("pc-next").disabled = !state.completed.has(level.id) || level.id === levels.length;
    const playPanel = document.querySelector(".pc-play-panel");
    if (playPanel) {
      playPanel.dataset.completed = state.completed.has(level.id) ? "true" : "false";
      playPanel.dataset.stage = String(level.stage);
      playPanel.dataset.level = String(level.id);
    }
    const machinePanel = document.createElement("div");
    machinePanel.className = "pc-machine-panel";
    machinePanel.innerHTML =
      '<div class="pc-machine-lights"><i class="pc-machine-light"></i><i class="pc-machine-light"></i><i class="pc-machine-light"></i></div><div class="pc-machine-label">PROBABILITY ENGINE // UNIT ' +
      String(level.id).padStart(2, "0") +
      '</div><span class="pc-machine-stage">STAGE ' +
      String(level.stage) +
      ' · READY</span><span class="pc-machine-level">LEVEL ' +
      String(level.id).padStart(2, "0") +
      " / " +
      String(levels.length).padStart(2, "0") +
      "</span>";
    scene.appendChild(machinePanel);
    feedback(
      state.completed.has(level.id)
        ? "⭐ Discovery collected. Replay it or move to the next level."
        : "Your move.",
      "neutral",
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
      container
        .querySelectorAll(".pc-choice")
        .forEach((item) => item.classList.toggle("is-selected", item === button));
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
      10: { sun: 5, moon: 5 },
    };
    return scenarios[level.id] || { sun: 4, moon: 4 };
  }

  function renderIntuition(level, scene, choices) {
    const counts = tokenCounts(level);
    const wheel = document.createElement("div");
    wheel.className = "pc-arcade-intuition";
    wheel.innerHTML =
      '<div class="pc-wheel-wrap"><div class="pc-pointer"></div><div class="pc-wheel" style="--sun:' +
      counts.sun +
      ";--moon:" +
      counts.moon +
      '"><span>☀</span><span>☾</span></div><div class="pc-wheel-label">PROBABILITY DIAL</div></div>' +
      '<div class="pc-arcade-copy"><strong>' +
      level.scenario +
      "</strong><span>" +
      level.outcome +
      '</span><div class="pc-probability-legend"><span>☀ Sun: ' +
      counts.sun +
      "</span><span>☾ Moon: " +
      counts.moon +
      "</span></div><small>Make your prediction, then activate the machine.</small></div>";
    scene.appendChild(wheel);
    level.choices.forEach((choice) => addChoice(choices, choice, choice));
    actionButton(choices, "⚙ Activate machine", () => spinIntuition(level), "pc-main-action");
  }

  function spinIntuition(level) {
    if (!state.selected || state.busy) {
      feedback(
        state.busy
          ? "The machine is running..."
          : "Choose your prediction first, then pull the lever.",
        "notice",
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
        complete(
          level.id,
          "⚡ Good prediction. The machine produced evidence that fits your idea.",
        );
      } else {
        if (action) action.disabled = false;
        feedback(
          "The machine surprised you. That is useful evidence. Reconsider the chance and try again.",
          "notice",
        );
      }
    }, 480);
  }

  function machineCard(tokens, label, clickable = false) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "pc-machine-card" + (clickable ? " pc-machine-choice" : "");
    const sun = tokens[0],
      moon = tokens[1];
    card.dataset.machine = label;
    card.innerHTML =
      "<h3>" +
      label +
      '</h3><div class="pc-token-row">' +
      '<span class="pc-token sun">☀️</span>'.repeat(Math.min(sun, 9)) +
      '<span class="pc-token moon">🌙</span>'.repeat(Math.min(moon, 9)) +
      "</div><p>" +
      sun +
      " Sun · " +
      moon +
      " Moon</p>";
    return card;
  }

  function renderCompare(level, scene, choices) {
    const row = document.createElement("div");
    row.className = "pc-machine-pair";
    const a = machineCard(level.machineA, "Machine A", true);
    const b = machineCard(level.machineB, "Machine B", true);
    [a, b].forEach((card) =>
      card.addEventListener("click", () => {
        state.selected = card.dataset.machine === "Machine A" ? "A" : "B";
        row
          .querySelectorAll(".pc-machine-choice")
          .forEach((item) => item.classList.toggle("is-selected", item === card));
        choices
          .querySelectorAll(".pc-choice")
          .forEach((item) =>
            item.classList.toggle("is-selected", item.dataset.value === state.selected),
          );
      }),
    );
    row.append(a, b);
    scene.appendChild(row);
    addChoice(choices, "A", "A has the greater chance");
    addChoice(choices, "equal", "They have equal chances");
    addChoice(choices, "B", "B has the greater chance");
    actionButton(choices, "⚙ Run machine", () => check(level), "pc-main-action");
  }

  function renderBuild(level, scene, choices) {
    const target = document.createElement("div");
    target.className = "pc-build-target";
    target.innerHTML =
      "<strong>Build " +
      level.sun +
      ":" +
      level.moon +
      "</strong><span>Tap a token to flip it.</span>";
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
    const sun = state.builtTokens.filter((x) => x === "sun").length;
    const moon = state.builtTokens.length - sun;
    const meter = document.createElement("div");
    meter.className = "pc-build-meter";
    meter.innerHTML =
      "<span>☀ " +
      sun +
      '</span><div><i style="width:' +
      (sun / 12) * 100 +
      '%"></i></div><span>☾ ' +
      moon +
      "</span>";
    scene.appendChild(meter);
    actionButton(choices, "🔧 Test my machine", () => check(level), "pc-main-action");
    actionButton(
      choices,
      "🔀 Shuffle the tokens",
      () => {
        state.builtTokens.sort(() => Math.random() - 0.5);
        renderLevel();
        feedback("Fresh arrangement. The ratio stays the same until you flip a token.", "neutral");
      },
      "pc-secondary-action",
    );
  }

  function renderExperiment(level, scene, choices) {
    const total = level.trials;
    const sun = state.experimentResults.filter((x) => x === "sun").length;
    const moon = state.experimentResults.length - sun;
    const track = document.createElement("div");
    track.className = "pc-experiment-board";
    track.innerHTML =
      '<div class="pc-machine-mini"><span>☀ ☀ ☀ ☾</span><strong>3 : 1</strong><small>Pull to test it</small></div><div class="pc-result-track" aria-label="Experiment results"></div><div class="pc-experiment-count">' +
      state.experimentResults.length +
      "/" +
      total +
      "</div>";
    scene.appendChild(track);
    const dots = track.querySelector(".pc-result-track");
    state.experimentResults.forEach((result) => {
      const dot = document.createElement("span");
      dot.className = "pc-result-dot " + result;
      dot.textContent = result === "sun" ? "☀" : "☾";
      dots.appendChild(dot);
    });
    const stat = document.createElement("div");
    stat.className = "pc-experiment-stats";
    stat.innerHTML = "<span>☀ " + sun + "</span><span>☾ " + moon + "</span>";
    scene.appendChild(stat);
    addChoice(choices, "sun", "☀ Predict Sun will lead");
    addChoice(choices, "moon", "☾ Predict Moon will lead");
    actionButton(
      choices,
      "⚙ Run " + total + " times",
      () => runExperiment(level),
      "pc-main-action",
    );
  }

  function runExperiment(level) {
    if (!state.selected || state.busy) {
      feedback(
        state.busy
          ? "The machine is already running..."
          : "Make your prediction before pulling the lever.",
        "notice",
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
      [surprisingSun, Math.max(0, trials - surprisingSun)],
    ];
    const card = document.createElement("div");
    card.className = "pc-sample-board";
    card.innerHTML =
      "<strong>Three mystery runs from the same 3:1 machine</strong><small>Tap the run that looks most surprising for only " +
      trials +
      " trials.</small>";
    const runRow = document.createElement("div");
    runRow.className = "pc-sample-runs";
    runs.forEach((run, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pc-sample-run";
      button.dataset.value = String(index);
      button.innerHTML =
        "<b>Run " +
        (index + 1) +
        "</b><span>" +
        "☀ ".repeat(run[0]) +
        "☾ ".repeat(run[1]) +
        "</span><small>" +
        run[0] +
        " Sun · " +
        run[1] +
        " Moon</small>";
      button.addEventListener("click", () => {
        state.randomRun = index;
        runRow
          .querySelectorAll(".pc-sample-run")
          .forEach((item) => item.classList.toggle("is-selected", item === button));
      });
      runRow.appendChild(button);
    });
    card.appendChild(runRow);
    scene.appendChild(card);
    addChoice(choices, "close", "This is close to the expected pattern");
    addChoice(choices, "surprising", "This is a surprising short run");
    addChoice(choices, "guaranteed", "The exact ratio is guaranteed");
    actionButton(
      choices,
      "🔦 Reveal the evidence",
      () => checkRandomness(level, runs),
      "pc-main-action",
    );
  }

  function checkRandomness(level, runs) {
    if (state.randomRun === null) {
      feedback("Pick a run first. What catches your eye?", "notice");
      return;
    }
    const choice = document.querySelector("#pc-choice-area .pc-choice.is-selected")?.dataset.value;
    const run = runs[Number(state.randomRun)];
    const ratioGap = Math.abs(run[0] / Math.max(1, level.trials) - 0.75);
    const answer = ratioGap >= 0.3 ? "surprising" : "close";
    if (choice === answer)
      complete(
        level.id,
        "🔦 Nice detective eye. Random runs can wobble around the theoretical chance.",
      );
    else
      feedback(
        "Look at the counts again. A short run can wander quite far from 3:1 without changing the machine.",
        "notice",
      );
  }

  function renderDice(level, scene, choices) {
    const board = document.createElement("div");
    board.className = "pc-dice-lab";
    board.innerHTML =
      '<div class="pc-dice-machine"><span class="pc-dice-label">DICE LAB · NO STAKES</span><div class="pc-dice-row"></div><small>Rolls are experiments. There are no bets, prizes, or rewards for the roll.</small></div><div class="pc-dice-lesson">' +
      level.lesson +
      "</div>";
    const diceRow = board.querySelector(".pc-dice-row");
    for (let index = 0; index < level.dice; index += 1) {
      const die = document.createElement("div");
      die.className = "pc-die";
      die.textContent = "•";
      die.setAttribute("aria-label", "Die " + (index + 1) + " not rolled");
      diceRow.appendChild(die);
    }
    scene.appendChild(board);
    level.choices.forEach((choice) => addChoice(choices, choice, choice));
    actionButton(
      choices,
      "🎲 Roll to test the idea",
      () => rollDice(level, diceRow),
      "pc-main-action",
    );
  }

  function rollDice(level, diceRow) {
    if (!state.selected || state.busy) {
      feedback(
        state.busy
          ? "The dice are rolling..."
          : "Choose your prediction first, then run the experiment.",
        "notice",
      );
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
        complete(
          level.id,
          "🎲 Prediction checked. The roll is evidence, not a guarantee. " + level.lesson,
        );
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
    card.innerHTML =
      '<span class="pc-vault-icon">🔐</span><div><strong>' +
      (clueCount ? "Evidence board: " + clueCount + " clues" : "A locked machine is humming...") +
      "</strong><p>" +
      (clueCount
        ? "☀ Sun: " + clueCountOf("sun") + " · ☾ Moon: " + clueCountOf("moon")
        : "Collect the clues, then open the case.") +
      "</p></div>";
    scene.appendChild(card);
    const evidence = document.createElement("div");
    evidence.className = "pc-evidence-strip";
    state.clues.slice(0, 12).forEach((result) => {
      const chip = document.createElement("span");
      chip.textContent = result === "sun" ? "☀" : "☾";
      chip.className = result;
      evidence.appendChild(chip);
    });
    scene.appendChild(evidence);
    actionButton(
      choices,
      clueCount < 12 ? "🔎 Collect 12 clues" : "🗝️ Open the case",
      () => {
        if (clueCount < 12) {
          state.clues = library.drawMany(library.createBag(level.hiddenSun, level.hiddenMoon), 12);
          renderLevel();
          feedback("Evidence collected. Now inspect the pattern and make your call.", "neutral");
        } else {
          check(level);
        }
      },
      "pc-main-action",
    );
    level.choices.forEach((choice) =>
      addChoice(
        choices,
        choice,
        choice === "Fair" ? "⚖ Fair" : choice === "Mostly Sun" ? "☀ Mostly Sun" : "☾ Mostly Moon",
      ),
    );
  }

  function clueCountOf(value) {
    return state.clues.filter((x) => x === value).length;
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
    const playPanel = document.querySelector(".pc-play-panel");
    if (playPanel) playPanel.dataset.completed = "true";
    setText("pc-system-state", "DISCOVERY SAVED");
    const next = $("pc-next");
    if (next) next.disabled = !state.completed.has(id) || id === levels.length;
    document.querySelectorAll("#pc-choice-area button").forEach((button) => {
      button.disabled = false;
    });
    feedback(message + (firstTime ? " +10 discovery points!" : ""), "success");
    document.querySelector(".pc-play-panel")?.classList.remove("pc-celebrate");
    void document.querySelector(".pc-play-panel")?.offsetWidth;
    document.querySelector(".pc-play-panel")?.classList.add("pc-celebrate");
  }

  function check(levelOverride) {
    const level = levelOverride || levels.find((item) => item.id === state.level);
    if (!level) return;
    if (level.type === "build") {
      const sun = state.builtTokens.filter((x) => x === "sun").length;
      const moon = state.builtTokens.length - sun;
      if (sun * level.moon === moon * level.sun)
        complete(level.id, "🔧 Machine tuned! The token ratio is right.");
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
      if (state.selected === level.answer)
        complete(level.id, "⚙ Machine run complete. You chose from the machine's design.");
      else {
        state.streak = 0;
        saveProgress();
        feedback(
          "The launch missed the best choice. Inspect the token counts and try again.",
          "notice",
        );
      }
      return;
    }
    if (level.type === "detective") {
      if (state.clues.length < 12) {
        feedback("Collect all twelve clues before opening the case.", "notice");
        return;
      }
      if (state.selected === level.answer)
        complete(level.id, "🕵️ Case solved. Your evidence matched the hidden machine.");
      else {
        state.streak = 0;
        saveProgress();
        feedback(
          "The evidence is still telling you something else. Recount the clues and try again.",
          "notice",
        );
      }
      return;
    }
    if (!state.selected) {
      feedback("Choose an answer first.", "notice");
      return;
    }
    if (state.selected === level.answer)
      complete(level.id, "Correct. You found the probability pattern.");
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

  function showWorld() {
    selectLevel(state.level);
  }

  function openStory(id) {
    const map = {
      "curious-machine": 1,
      "machine-builder": 21,
      "mystery-tent": 51,
      "fairness-workshop": 56,
    };
    selectLevel(map[id] || 1);
  }

  return { open, close, selectStage, selectLevel, resetLevel, check, next, openStory, showWorld };
})();
