/* Arithmetic Quiz game. Uses the shared QuestionBank and Encourage helpers. */

const Quiz = (function () {
  let difficulty = "easy";
  let score = 0,
    correctCount = 0,
    wrongCount = 0,
    questionNum = 0;
  let currentAnswer = 0;
  let currentQuestion = null;
  let attemptCount = 0;
  let questionStartedAt = 0;
  let masteryHistory = [];
  let questionResolved = false;
  let currentMasteryValue = null;
  let advanceTimeout = null;

  const DIFF_LABEL = { easy: "Starter", medium: "Growing", hard: "Champion" };

  function init() {
    score = correctCount = wrongCount = questionNum = 0;
    masteryHistory = [];
    questionResolved = false;
    currentMasteryValue = null;
    updateMasteryDisplay();
    show("quiz-difficulty-panel");
    hide("quiz-play-panel");
    hide("quiz-feedback");
    updateScoreDisplay();
  }

  function setDifficulty(level) {
    recordMasteryResult();
    masteryHistory = [];
    difficulty = level;
    document.getElementById("quiz-diff-badge").textContent = DIFF_LABEL[level] || level;
    hide("quiz-difficulty-panel");
    show("quiz-play-panel");
    hide("quiz-feedback");
    nextQuestion();
  }

  function changeDifficulty() {
    show("quiz-difficulty-panel");
    hide("quiz-play-panel");
    hide("quiz-feedback");
  }

  function nextQuestion() {
    recordMasteryResult();
    if (currentQuestion && questionNum) recordMasteryResult();
    currentQuestion = QuestionBank.generate(difficulty);
    currentAnswer = currentQuestion.answer;
    attemptCount = 0;
    questionResolved = false;
    currentMasteryValue = null;

    questionNum++;
    document.getElementById("quiz-q-number").textContent = questionNum;
    document.getElementById("quiz-question").textContent = currentQuestion.text;

    const inp = document.getElementById("quiz-input");
    inp.value = "";
    hide("quiz-feedback");
    renderQuizActions();
    inp.focus();

    questionStartedAt = performance.now();
  }

  function replayQuestion() {
    if (!currentQuestion) return;
    attemptCount = 0;
    questionResolved = false;
    document.getElementById("quiz-question").textContent = currentQuestion.text;
    document.getElementById("quiz-input").value = "";
    hide("quiz-feedback");
    renderQuizActions();
    document.getElementById("quiz-input").focus();
    questionStartedAt = performance.now();
  }

  function retryQuestion() {
    if (!currentQuestion) return;
    hide("quiz-feedback");
    document.getElementById("quiz-input").value = "";
    renderQuizActions();
    document.getElementById("quiz-input").focus();
  }

  function showHint() {
    if (!currentQuestion) return;
    const hint =
      currentQuestion.hint ||
      "Reread the question slowly. What information do you know, and what are you trying to find?";
    showFeedback(`💡 Hint: ${hint}`, "hint");
    renderQuizActions();
  }

  function showExplanation() {
    if (!currentQuestion) return;
    const explanation =
      currentQuestion.explanation ||
      `Try identifying the operation first, then calculate carefully. The answer is ${currentAnswer}.`;
    showFeedback(`🧠 Let’s think it through: ${explanation}`, "explanation");
    renderQuizActions(true);
  }

  function renderQuizActions(revealAnswer = false) {
    const el = document.getElementById("quiz-actions");
    if (!el) return;
    el.innerHTML = `
      <button class="quiz-action secondary" onclick="Quiz.retry()">🔁 Try This Again</button>
      <button class="quiz-action secondary" onclick="Quiz.replay()">↺ Replay Question</button>
      <button class="quiz-action secondary" onclick="Quiz.hint()">💡 Give Me a Hint</button>
      ${revealAnswer ? "" : '<button class="quiz-action secondary" onclick="Quiz.explain()">🧠 Show Me How</button>'}
      <button class="quiz-action primary" onclick="Quiz.next()">➡ Next Question</button>
    `;
  }

  function showFeedback(msg, type) {
    const el = document.getElementById("quiz-feedback");
    el.textContent = msg;
    el.className = `feedback ${type}`;
    show("quiz-feedback");
  }

  function updateScoreDisplay() {
    const scoreEl = document.getElementById("quiz-score");
    if (scoreEl) scoreEl.textContent = score;
    const correctEl = document.getElementById("quiz-correct");
    if (correctEl) correctEl.textContent = correctCount;
    const wrongEl = document.getElementById("quiz-wrong");
    if (wrongEl) wrongEl.textContent = wrongCount;
    const totalEl = document.getElementById("quiz-total");
    if (totalEl) totalEl.textContent = correctCount + wrongCount;
    updateMasteryDisplay();
  }

  function recordMasteryResult() {
    if (!currentQuestion || !questionNum) return;
    if (!questionResolved) {
      masteryHistory.push(0);
    } else {
      masteryHistory.push(attemptCount === 1 ? 1 : 0.75);
    }
    currentMasteryValue = null;
    if (masteryHistory.length > 10) masteryHistory.shift();
    Analytics.log("quiz", "mastery", {
      difficulty,
      value: masteryHistory[masteryHistory.length - 1],
      attempts: attemptCount,
      resolved: questionResolved,
    });
    updateMasteryDisplay();
  }

  function getMastery() {
    const values = masteryHistory.slice();
    if (currentMasteryValue !== null) values.push(currentMasteryValue);
    if (!values.length) return 0;
    return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100);
  }

  function updateMasteryDisplay() {
    const value = getMastery();
    const fill = document.getElementById("quiz-mastery-fill");
    const label = document.getElementById("quiz-mastery-label");
    const note = document.getElementById("quiz-mastery-note");
    if (!fill || !label || !note) return;

    fill.style.width = value + "%";
    const top = document.getElementById("quiz-mastery-top");
    if (top) top.textContent = value + "%";

    if (value >= 85) {
      label.textContent = "Strong";
      note.textContent = "You are solving these confidently. Keep checking your reasoning!";
    } else if (value >= 65) {
      label.textContent = "Growing";
      note.textContent = "Nice progress. A few more thoughtful attempts can strengthen this skill.";
    } else if (value > 0) {
      label.textContent = "Building";
      note.textContent = "Keep practising. Hints and retries are part of learning.";
    } else {
      label.textContent = "Starting";
      note.textContent =
        "Try a few questions first. Mastery grows through understanding, not speed.";
    }
  }

  function submit() {
    if (!currentQuestion || questionResolved) return;
    const input = document.getElementById("quiz-input");
    const raw = input ? input.value.trim() : "";
    if (!raw) {
      showFeedback("Type an answer first, then press Submit.", "hint");
      return;
    }

    const value = Number(raw);
    attemptCount++;
    const correct = Number.isFinite(value) && value === currentAnswer;
    const timeMs = Math.round(performance.now() - questionStartedAt);

    if (correct) {
      correctCount++;
      score += 10;
      questionResolved = true;
      currentMasteryValue = attemptCount === 1 ? 1 : 0.75;
      showFeedback(Encourage.correct(), "correct");
    } else {
      wrongCount++;
      currentMasteryValue = 0;
      showFeedback(Encourage.tryAgain(), "wrong");
    }

    Analytics.log("quiz", "answer", {
      difficulty,
      correct,
      timeMs,
      attempts: attemptCount,
      expected: currentAnswer,
    });

    updateScoreDisplay();
    renderQuizActions(questionResolved);

    if (correct) {
      if (advanceTimeout) clearTimeout(advanceTimeout);
      advanceTimeout = setTimeout(() => {
        advanceTimeout = null;
        if (questionResolved) nextQuestion();
      }, 500);
    }
  }

  function next() {
    if (advanceTimeout) {
      clearTimeout(advanceTimeout);
      advanceTimeout = null;
    }
    nextQuestion();
  }

  function stop() {
    if (advanceTimeout) {
      clearTimeout(advanceTimeout);
      advanceTimeout = null;
    }
    questionResolved = true;
  }

  function retry() {
    retryQuestion();
  }

  function hint() {
    showHint();
  }

  function explain() {
    showExplanation();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const quizInput = document.getElementById("quiz-input");
    if (quizInput)
      quizInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      });

    const raceInput = document.getElementById("race-input");
    if (raceInput)
      raceInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      });
  });

  return {
    init,
    setDifficulty,
    changeDifficulty,
    submit,
    next,
    retry,
    hint,
    explain,
    replay: replayQuestion,
    stop,
  };
})();

window.Quiz = Quiz;
