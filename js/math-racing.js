/* Math Racing game. Uses the shared QuestionBank and Encourage helpers. */

const Racing = (function () {
  let selectedTimer = 30,
    difficulty = "easy",
    playerName = "";
  let timeLeft = 30,
    timerInterval = null;
  let score = 0,
    correctCount = 0,
    wrongCount = 0;
  let currentAnswer = 0,
    totalDuration = 30,
    questionStartedAt = 0;
  let raceActive = false;
  let questionLocked = false;
  let nextQuestionTimeout = null;
  let raceGeneration = 0;
  let leaderboard = [];
  const LEADERBOARD_KEY = "mfa_race_leaderboard_v1";

  function init() {
    stop();
    show("race-setup-panel");
    hide("race-play-panel");
    hide("race-result-panel");
    loadLeaderboard();
    renderLeaderboard();
    setTimer(30);
    setDifficulty("easy");
  }
  function setTimer(seconds) {
    selectedTimer = seconds;
    ["30", "60", "90"].forEach((t) => {
      const el = document.getElementById("timer-" + t);
      if (el) el.classList.toggle("active", t === String(seconds));
    });
  }
  function setDifficulty(level) {
    difficulty = level;
    ["easy", "medium", "hard"].forEach((d) => {
      const el = document.getElementById("race-" + d);
      if (el) el.classList.toggle("active-diff", d === level);
    });
  }
  function start() {
    stop();
    raceGeneration++;
    const nameInput = document.getElementById("race-player-name");
    playerName = (nameInput && nameInput.value.trim()) || "Student";
    if (timerInterval) clearInterval(timerInterval);
    score = correctCount = wrongCount = 0;
    timeLeft = totalDuration = selectedTimer;
    raceActive = true;
    questionLocked = false;
    document.getElementById("race-player-display").textContent = playerName;
    document.getElementById("race-live-score").textContent = "0";
    document.getElementById("race-top-score").textContent = "0";
    updateTimerDisplay();
    hide("race-setup-panel");
    hide("race-result-panel");
    show("race-play-panel");
    hide("race-feedback");
    const timerEl = document.getElementById("race-timer");
    if (timerEl) timerEl.className = "hud-timer";
    const fill = document.getElementById("race-progress-fill");
    if (fill) fill.style.width = "100%";
    Analytics.log("race", "start", { difficulty, timer: selectedTimer });
    nextQuestion();
    timerInterval = setInterval(tick, 1000);
  }
  function tick() {
    timeLeft--;
    updateTimerDisplay();
    const fill = document.getElementById("race-progress-fill");
    if (fill) fill.style.width = Math.max(0, (timeLeft / totalDuration) * 100) + "%";
    const timerEl = document.getElementById("race-timer");
    if (timerEl)
      timerEl.className =
        timeLeft <= 5 ? "hud-timer danger" : timeLeft <= 10 ? "hud-timer warning" : "hud-timer";
    if (timeLeft <= 0) endRace();
  }
  function updateTimerDisplay() {
    const el = document.getElementById("race-timer");
    if (el) el.textContent = Math.max(0, timeLeft);
  }
  function nextQuestion() {
    if (!raceActive || timeLeft <= 0) return;
    questionLocked = false;
    const q = QuestionBank.generate(difficulty);
    currentAnswer = q.answer;
    const questionEl = document.getElementById("race-question");
    const inputEl = document.getElementById("race-input");
    if (questionEl) questionEl.textContent = q.text;
    if (inputEl) {
      inputEl.value = "";
      inputEl.focus();
    }
    questionStartedAt = performance.now();
  }
  function submit() {
    if (!raceActive || timeLeft <= 0 || questionLocked) return;
    questionLocked = true;
    const inputEl = document.getElementById("race-input");
    const rawVal = inputEl ? inputEl.value.trim() : "";
    if (!rawVal) {
      showRaceFeedback("Type an answer before you press Go!", "wrong");
      return;
    }
    const isCorrect = parseFloat(rawVal) === currentAnswer;
    if (isCorrect) {
      correctCount++;
      score += 10;
      showRaceFeedback("✅ Correct! Keep going!", "correct");
    } else {
      wrongCount++;
      showRaceFeedback("🙂 Not quite. Keep racing and try the next one!", "wrong");
    }
    Analytics.log("race", "answer", {
      difficulty,
      correct: isCorrect,
      timeMs: Math.round(performance.now() - questionStartedAt),
    });
    const live = document.getElementById("race-live-score");
    const top = document.getElementById("race-top-score");
    if (live) live.textContent = score;
    if (top) top.textContent = score;
    if (nextQuestionTimeout) clearTimeout(nextQuestionTimeout);
    const generation = raceGeneration;
    nextQuestionTimeout = setTimeout(() => {
      nextQuestionTimeout = null;
      if (generation === raceGeneration && raceActive && timeLeft > 0) nextQuestion();
    }, 180);
  }
  function showRaceFeedback(msg, type) {
    const el = document.getElementById("race-feedback");
    if (!el) return;
    el.textContent = msg;
    el.className = "feedback " + type;
    show("race-feedback");
  }
  function endRace() {
    raceGeneration++;
    if (nextQuestionTimeout) {
      clearTimeout(nextQuestionTimeout);
      nextQuestionTimeout = null;
    }
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    raceActive = false;
    questionLocked = true;
    timeLeft = 0;
    updateTimerDisplay();
    const total = correctCount + wrongCount;
    const accuracy = total ? Math.round((correctCount / total) * 100) : 0;
    Analytics.log("race", "round_complete", {
      difficulty,
      timer: totalDuration,
      correct: correctCount,
      wrong: wrongCount,
      score,
    });
    leaderboard.push({
      name: playerName || "Student",
      score,
      correct: correctCount,
      accuracy,
      timer: totalDuration,
      ts: Date.now(),
    });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    saveLeaderboard();
    renderLeaderboard();
    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    set("result-player-name", playerName || "Student");
    set("result-final-score", score);
    set("result-correct", correctCount);
    set("result-wrong", wrongCount);
    set("result-accuracy", accuracy + "%");
    set(
      "result-message",
      accuracy >= 80
        ? "Fantastic focus!"
        : accuracy >= 60
          ? "Good work! Keep practising."
          : "Every question is practice. Keep going!",
    );
    hide("race-play-panel");
    show("race-result-panel");
    window.CompletionOverlay?.show({
      title: "Race complete!",
      message: "Your race is finished. Your score and accuracy are ready to review.",
      actionLabel: "View results",
    });
  }
  function loadLeaderboard() {
    try {
      leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
    } catch (e) {
      leaderboard = [];
    }
  }
  function saveLeaderboard() {
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    } catch (e) {}
  }
  function renderLeaderboard() {
    loadLeaderboard();
    const el = document.getElementById("leaderboard-list");
    if (!el) return;
    if (!leaderboard.length) {
      el.innerHTML = '<p class="leaderboard-empty">No scores yet — be the first!</p>';
      return;
    }
    el.innerHTML = leaderboard
      .map(
        (entry, index) =>
          '<div class="leaderboard-row"><span>#' +
          (index + 1) +
          " " +
          String(entry.name).replace(/[<>&"']/g, "") +
          "</span><strong>" +
          entry.score +
          "</strong></div>",
      )
      .join("");
  }
  function clearLeaderboard() {
    leaderboard = [];
    saveLeaderboard();
    renderLeaderboard();
  }
  function stop() {
    raceGeneration++;
    raceActive = false;
    questionLocked = true;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (nextQuestionTimeout) {
      clearTimeout(nextQuestionTimeout);
      nextQuestionTimeout = null;
    }
  }
  function back() {
    stop();
    hide("race-play-panel");
    hide("race-result-panel");
    show("race-setup-panel");
  }
  return {
    init,
    setTimer,
    setDifficulty,
    start,
    submit,
    back,
    backToSetup: back,
    playAgain: start,
    stop,
    clearLeaderboard,
  };
})();

window.Racing = Racing;

const raceAnswerInput = document.getElementById("race-input");
raceAnswerInput?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.isComposing) return;
  event.preventDefault();
  Racing.submit();
});
