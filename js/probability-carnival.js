window.ProbabilityCarnival = (() => {
  const library = window.ProbabilityCarnivalLibrary;
  const canvasApi = window.ProbabilityCarnivalCanvas;
  const stories = window.ProbabilityCarnivalStories.stories;
  const STORAGE_KEY = "mfa_probability_carnival_v1";

  const state = {
    storyId: null,
    prediction: null,
    sun: 0,
    moon: 0,
    bag: library.createBag(),
    builderTokens: ["sun", "sun", "sun", "sun", "sun", "sun", "moon", "moon"],
    builderSun: 0,
    builderMoon: 0,
    mysteryBag: [],
    mysteryPrediction: null,
    mysterySun: 0,
    mysteryMoon: 0,
    mysteryRevealed: false,
    fairnessPrediction: null,
    fairnessA: { sun: 0, moon: 0 },
    fairnessB: { sun: 0, moon: 0 },
    fairnessJudged: false,
    completed: loadCompleted()
  };

  function $(id) {
    return document.getElementById(id);
  }

  function setHidden(id, hidden) {
    const element = $(id);

    if (element) {
      element.hidden = hidden;
    }
  }

  function loadCompleted() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return new Set(Array.isArray(data) ? data : []);
    } catch {
      return new Set();
    }
  }

  function saveCompleted() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.completed]));
    } catch {
      // Local progress is optional and the game remains playable without storage.
    }
  }

  function open() {
    document.getElementById("screen-menu")?.classList.remove("active");
    setHidden("screen-probability-carnival", false);
    showWorld();
  }

  function close() {
    setHidden("screen-probability-carnival", true);
    document.getElementById("screen-menu")?.classList.add("active");
  }

  function showWorld() {
    state.storyId = null;
    setHidden("probability-carnival-world", false);
    setHidden("probability-carnival-story", true);
    renderStoryCards();
  }

  function renderStoryCards() {
    const grid = $("probability-carnival-story-grid");
    if (!grid) return;

    grid.innerHTML = "";

    stories.forEach(story => {
      const completed = state.completed.has(story.id);
      const button = document.createElement("button");

      button.type = "button";
      button.className = "pc-story-card" + (completed ? " is-complete" : "");
      button.addEventListener("click", () => openStory(story.id));
      button.innerHTML =
        '<span class="pc-story-symbol" aria-hidden="true">' +
        story.symbol +
        "</span>" +
        '<span class="pc-story-kicker">' +
        story.kicker +
        "</span>" +
        "<strong>" +
        story.title +
        "</strong>" +
        "<span>" +
        story.description +
        "</span>" +
        "<small>" +
        (completed ? "Discovery complete" : "Explore this tent") +
        "</small>";

      grid.appendChild(button);
    });

    $("pc-completed-count").textContent = String(state.completed.size);
  }

  function openStory(id) {
    const story = stories.find(item => item.id === id);
    if (!story) return;

    state.storyId = id;
    resetStoryState();
    setHidden("probability-carnival-world", true);
    setHidden("probability-carnival-story", false);

    document.querySelectorAll("[data-story-panel]").forEach(panel => {
      panel.hidden = panel.dataset.storyPanel !== id;
    });

    $("pc-story-kicker").textContent = story.kicker;
    $("pc-story-title").textContent = story.title;
    $("pc-story-intro").textContent = story.description;
    $("pc-story-objective").textContent = story.objective;
    $("pc-learning").hidden = true;

    renderStory();
  }

  function resetStoryState() {
    state.prediction = null;
    state.sun = 0;
    state.moon = 0;
    state.bag = library.createBag();
    state.builderTokens = ["sun", "sun", "sun", "sun", "sun", "sun", "moon", "moon"];
    state.builderSun = 0;
    state.builderMoon = 0;
    state.mysteryBag = createMysteryBag();
    state.mysteryPrediction = null;
    state.mysterySun = 0;
    state.mysteryMoon = 0;
    state.mysteryRevealed = false;
    state.fairnessPrediction = null;
    state.fairnessA = { sun: 0, moon: 0 };
    state.fairnessB = { sun: 0, moon: 0 };
    state.fairnessJudged = false;

    document
      .querySelectorAll("[data-prediction], [data-mystery-prediction], [data-fairness-prediction]")
      .forEach(button => button.classList.remove("is-selected"));
  }

  function renderStory() {
    if (state.storyId === "curious-machine") {
      renderMachineStory();
    }

    if (state.storyId === "machine-builder") {
      renderBuilderStory();
    }

    if (state.storyId === "mystery-tent") {
      renderMysteryStory();
    }

    if (state.storyId === "fairness-workshop") {
      renderFairnessStory();
    }
  }

  function setPrediction(value) {
    state.prediction = value;

    document.querySelectorAll("[data-prediction]").forEach(button => {
      button.classList.toggle("is-selected", button.dataset.prediction === value);
    });

    setFeedback(
      "Prediction saved. Now run the experiment. A prediction can be wrong and still be useful.",
      "neutral"
    );
  }

  function runMachine(count) {
    if (!state.prediction) {
      setFeedback("Choose a prediction first. There is no wrong prediction.", "notice");
      return;
    }

    const results = library.drawMany(state.bag, count);
    const latest = results[results.length - 1];

    results.forEach(result => {
      if (result === "sun") {
        state.sun += 1;
      } else {
        state.moon += 1;
      }
    });

    canvasApi.animateResult($("pc-machine-canvas"), state.bag, latest, updateMachineEvidence);
    updateMachineEvidence();

    const total = state.sun + state.moon;

    if (total >= 20) {
      completeStory("curious-machine");
      setFeedback(
        "You have a useful trail of evidence. Compare the counts with the four tokens inside the machine.",
        "success"
      );
    } else if (total >= 8) {
      setFeedback(
        "The pattern is starting to speak. Try more trials and see whether the picture becomes clearer.",
        "neutral"
      );
    } else {
      setFeedback("Interesting. Short runs can wobble. That is part of the experiment.", "neutral");
    }
  }

  function updateMachineEvidence() {
    const total = state.sun + state.moon;

    $("pc-sun-count").textContent = String(state.sun);
    $("pc-moon-count").textContent = String(state.moon);
    $("pc-total-count").textContent = String(total);
    $("pc-sun-bar").style.width = (total ? state.sun / total * 100 : 0) + "%";
    $("pc-moon-bar").style.width = (total ? state.moon / total * 100 : 0) + "%";
    $("pc-evidence").textContent = total
      ? "Evidence so far: " + state.sun + " Sun results and " + state.moon + " Moon results."
      : "No evidence yet.";

    $("pc-canvas-description").textContent = total
      ? "The machine contains three Sun tokens and one Moon token. The latest result is shown in the machine. There have been " +
        total +
        " trials."
      : "A visible machine contains three Sun tokens and one Moon token. No trial has been run yet.";
  }

  function renderMachineStory() {
    canvasApi.render($("pc-machine-canvas"), { tokens: state.bag });
    updateMachineEvidence();
    setFeedback("What do you think will happen more often?", "neutral");
  }

  function renderBuilderStory() {
    const slots = $("pc-builder-slots");
    if (!slots) return;

    slots.innerHTML = "";

    state.builderTokens.forEach((token, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "pc-builder-slot" + (token === "moon" ? " is-moon" : "");
      button.dataset.builderSlot = String(index);
      button.setAttribute(
        "aria-label",
        "Token " + (index + 1) + ": " + (token === "sun" ? "Sun" : "Moon")
      );
      button.textContent = token === "sun" ? "☀️" : "🌙";
      button.addEventListener("click", () => toggleBuilderSlot(index));
      slots.appendChild(button);
    });

    canvasApi.render($("pc-builder-canvas"), {
      tokens: state.builderTokens
    });
    updateBuilderEvidence();
    setFeedback(
      "Your machine starts with six Sun tokens and two Moon tokens. Change the design, then test it.",
      "neutral"
    );
  }

  function toggleBuilderSlot(index) {
    state.builderTokens[index] = state.builderTokens[index] === "sun" ? "moon" : "sun";
    renderBuilderStory();

    const sun = state.builderTokens.filter(token => token === "sun").length;
    const moon = state.builderTokens.length - sun;

    setFeedback(
      "Your machine now has " + sun + " Sun tokens and " + moon + " Moon tokens.",
      "neutral"
    );
  }

  function runBuilder() {
    if (!state.prediction) {
      setFeedback("Predict which result will be more common before testing your machine.", "notice");
      return;
    }

    const results = library.drawMany(state.builderTokens, 20);
    const count = library.counts(results);

    state.builderSun += count.sun;
    state.builderMoon += count.moon;

    canvasApi.animateResult(
      $("pc-builder-canvas"),
      state.builderTokens,
      results[results.length - 1],
      updateBuilderEvidence
    );
    updateBuilderEvidence();

    if (state.builderSun + state.builderMoon >= 20) {
      completeStory("machine-builder");
      setFeedback(
        "Your machine has spoken. Compare the evidence with the share of Sun and Moon tokens you built.",
        "success"
      );
    }
  }

  function updateBuilderEvidence() {
    const total = state.builderSun + state.builderMoon;
    const sunTokens = state.builderTokens.filter(token => token === "sun").length;
    const moonTokens = state.builderTokens.length - sunTokens;
    const sunChance = Math.round(library.probability(state.builderTokens, "sun") * 100);
    const moonChance = Math.round(library.probability(state.builderTokens, "moon") * 100);

    $("pc-builder-sun-tokens").textContent = String(sunTokens);
    $("pc-builder-moon-tokens").textContent = String(moonTokens);
    $("pc-builder-sun-chance").textContent = sunChance + "%";
    $("pc-builder-moon-chance").textContent = moonChance + "%";
    $("pc-builder-sun-count").textContent = String(state.builderSun);
    $("pc-builder-moon-count").textContent = String(state.builderMoon);
    $("pc-builder-total-count").textContent = String(total);
    $("pc-builder-sun-bar").style.width = (total ? state.builderSun / total * 100 : 0) + "%";
    $("pc-builder-moon-bar").style.width = (total ? state.builderMoon / total * 100 : 0) + "%";

    $("pc-builder-canvas-description").textContent =
      "Your machine has " +
      sunTokens +
      " Sun tokens and " +
      moonTokens +
      " Moon tokens. Sun has a " +
      sunChance +
      "% chance and Moon has a " +
      moonChance +
      "% chance on each draw.";
  }

  function createMysteryBag() {
    const choices = [
      library.createBag(6, 2),
      library.createBag(4, 4),
      library.createBag(2, 6)
    ];

    return choices[Math.floor(Math.random() * choices.length)];
  }

  function renderMysteryStory() {
    canvasApi.render($("pc-mystery-canvas"), {
      tokens: ["sun", "moon", "sun", "moon"]
    });
    updateMysteryEvidence();
    $("pc-mystery-reveal-text").textContent = "The machine is still hidden.";
    $("pc-mystery-reveal").disabled = true;
    setFeedback("What might be inside? Make a prediction before collecting clues.", "neutral");
  }

  function setMysteryPrediction(value) {
    state.mysteryPrediction = value;

    document.querySelectorAll("[data-mystery-prediction]").forEach(button => {
      button.classList.toggle("is-selected", button.dataset.mysteryPrediction === value);
    });

    setFeedback("Clue chosen. Now collect evidence from the hidden machine.", "neutral");
  }

  function runMystery() {
    if (!state.mysteryPrediction) {
      setFeedback("Choose the pattern you think is most likely first.", "notice");
      return;
    }

    if (state.mysterySun + state.mysteryMoon >= 12) {
      setFeedback("You already have twelve clues. Open the reveal when you are ready.", "neutral");
      return;
    }

    const remaining = 12 - (state.mysterySun + state.mysteryMoon);
    const results = library.drawMany(state.mysteryBag, remaining);
    const count = library.counts(results);

    state.mysterySun += count.sun;
    state.mysteryMoon += count.moon;

    canvasApi.animateResult(
      $("pc-mystery-canvas"),
      ["sun", "moon", "sun", "moon"],
      results[results.length - 1],
      updateMysteryEvidence
    );
    updateMysteryEvidence();

    if (state.mysterySun + state.mysteryMoon >= 12) {
      $("pc-mystery-reveal").disabled = false;
      setFeedback("You have twelve clues. Make your final call, then reveal the machine.", "neutral");
    }
  }

  function revealMystery() {
    if (state.mysterySun + state.mysteryMoon < 12) {
      setFeedback("Collect twelve clues before opening the reveal.", "notice");
      return;
    }

    state.mysteryRevealed = true;
    const actualCounts = library.counts(state.mysteryBag);
    const actual = library.dominant(actualCounts);
    const predicted = state.mysteryPrediction;

    $("pc-mystery-reveal-text").textContent =
      "Inside were " +
      actualCounts.sun +
      " Sun tokens and " +
      actualCounts.moon +
      " Moon tokens.";

    $("pc-mystery-reveal").disabled = true;
    completeStory("mystery-tent");
    canvasApi.render($("pc-mystery-canvas"), { tokens: state.mysteryBag });

    if (predicted === actual) {
      setFeedback(
        "Your evidence led you to the hidden pattern. The important part is how you used the clues, not whether the guess was lucky.",
        "success"
      );
    } else {
      setFeedback(
        "The hidden machine surprised you. That is useful information too. A small sample can support an idea without making it certain.",
        "neutral"
      );
    }
  }

  function updateMysteryEvidence() {
    const total = state.mysterySun + state.mysteryMoon;

    $("pc-mystery-sun-count").textContent = String(state.mysterySun);
    $("pc-mystery-moon-count").textContent = String(state.mysteryMoon);
    $("pc-mystery-total-count").textContent = String(total);
    $("pc-mystery-sun-bar").style.width = (total ? state.mysterySun / total * 100 : 0) + "%";
    $("pc-mystery-moon-bar").style.width = (total ? state.mysteryMoon / total * 100 : 0) + "%";

    $("pc-mystery-canvas-description").textContent =
      "The machine is hidden. Evidence so far is " +
      state.mysterySun +
      " Sun results and " +
      state.mysteryMoon +
      " Moon results from " +
      total +
      " trials.";
  }

  function renderFairnessStory() {
    updateFairnessEvidence();
    $("pc-fairness-judge").disabled = true;
    $("pc-fairness-judge-text").textContent =
      "The machine designs stay hidden until you make your call.";
    setFeedback("Which machine do you think gives Sun and Moon equal chances?", "neutral");
  }

  function setFairnessPrediction(value) {
    state.fairnessPrediction = value;

    document.querySelectorAll("[data-fairness-prediction]").forEach(button => {
      button.classList.toggle("is-selected", button.dataset.fairnessPrediction === value);
    });

    setFeedback("Prediction saved. Now compare the two machines using repeated evidence.", "neutral");
  }

  function runFairness() {
    if (!state.fairnessPrediction) {
      setFeedback("Choose which machine you think is fair first.", "notice");
      return;
    }

    const machineA = library.createBag(4, 4);
    const machineB = library.createBag(6, 2);
    const resultsA = library.drawMany(machineA, 12);
    const resultsB = library.drawMany(machineB, 12);
    const countA = library.counts(resultsA);
    const countB = library.counts(resultsB);

    state.fairnessA.sun += countA.sun;
    state.fairnessA.moon += countA.moon;
    state.fairnessB.sun += countB.sun;
    state.fairnessB.moon += countB.moon;

    updateFairnessEvidence();

    if (state.fairnessA.sun + state.fairnessA.moon >= 24) {
      $("pc-fairness-judge").disabled = false;
      setFeedback(
        "You have a larger evidence set now. Decide what the machine designs tell you.",
        "neutral"
      );
    }
  }

  function judgeFairness() {
    if (state.fairnessA.sun + state.fairnessA.moon < 24) {
      setFeedback(
        "Run the comparison again so you have enough evidence to discuss the machines.",
        "notice"
      );
      return;
    }

    state.fairnessJudged = true;
    completeStory("fairness-workshop");

    const correct = state.fairnessPrediction === "a";

    setFeedback(
      correct
        ? "Good reasoning. Machine A is built with four Sun and four Moon tokens, so the two outcomes have equal chances."
        : "The evidence is worth revisiting. Machine A is the equal-chance design: four Sun and four Moon tokens.",
      correct ? "success" : "neutral"
    );

    $("pc-fairness-judge-text").textContent =
      "Machine A is balanced: 4 Sun + 4 Moon. Machine B is not balanced: 6 Sun + 2 Moon.";
  }

  function updateFairnessEvidence() {
    const totalA = state.fairnessA.sun + state.fairnessA.moon;
    const totalB = state.fairnessB.sun + state.fairnessB.moon;

    $("pc-fair-a-sun").textContent = String(state.fairnessA.sun);
    $("pc-fair-a-moon").textContent = String(state.fairnessA.moon);
    $("pc-fair-b-sun").textContent = String(state.fairnessB.sun);
    $("pc-fair-b-moon").textContent = String(state.fairnessB.moon);
    $("pc-fair-a-total").textContent = String(totalA);
    $("pc-fair-b-total").textContent = String(totalB);

    $("pc-fair-a-sun-bar").style.width = (totalA ? state.fairnessA.sun / totalA * 100 : 0) + "%";
    $("pc-fair-a-moon-bar").style.width = (totalA ? state.fairnessA.moon / totalA * 100 : 0) + "%";
    $("pc-fair-b-sun-bar").style.width = (totalB ? state.fairnessB.sun / totalB * 100 : 0) + "%";
    $("pc-fair-b-moon-bar").style.width = (totalB ? state.fairnessB.moon / totalB * 100 : 0) + "%";

    canvasApi.render($("pc-fairness-canvas"), {
      kind: "bars",
      values: [state.fairnessA.sun, state.fairnessB.sun],
      labels: ["A · Sun", "B · Sun"]
    });

    $("pc-fairness-canvas-description").textContent =
      "Machine A has " +
      state.fairnessA.sun +
      " Sun and " +
      state.fairnessA.moon +
      " Moon results. Machine B has " +
      state.fairnessB.sun +
      " Sun and " +
      state.fairnessB.moon +
      " Moon results.";
  }

  function completeStory(id) {
    if (!state.completed.has(id)) {
      state.completed.add(id);
      saveCompleted();
      renderStoryCards();
    }
  }

  function setFeedback(message, kind) {
    const feedback = $("pc-feedback");

    if (!feedback) return;

    feedback.textContent = message;
    feedback.className = "pc-feedback pc-feedback-" + kind;
  }

  function resetCurrentStory() {
    if (!state.storyId) return;

    resetStoryState();
    renderStory();
  }

  function openLearning() {
    const story = stories.find(item => item.id === state.storyId);
    if (!story) return;

    $("pc-learning-title").textContent = "What did the experiment show?";
    $("pc-learning-text").textContent = story.learning;
    setHidden("pc-learning", false);
  }

  function reflect(value) {
    const responses = {
      surprised: "Surprise is useful. It tells us to look at the evidence more carefully.",
      pattern: "Noticing a pattern is the beginning. More trials can help us see whether it stays.",
      question: "Questions are part of mathematics. You do not need to know the answer before investigating."
    };

    $("pc-reflection-response").textContent = responses[value] || "";
  }

  return {
    open,
    close,
    showWorld,
    openStory,
    setPrediction,
    runMachine,
    toggleBuilderSlot,
    runBuilder,
    setMysteryPrediction,
    runMystery,
    revealMystery,
    setFairnessPrediction,
    runFairness,
    judgeFairness,
    resetCurrentStory,
    openLearning,
    reflect
  };
})();
