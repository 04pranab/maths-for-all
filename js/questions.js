/* =============================================================
   MATH FOR ALL – questions.js
   QuestionBank: generates a brand-new question every single call
   (never replays a fixed set), organised by NEP 2020 foundational
   numeracy stages:
     easy   → Nursery & Class 1   (counting, numbers to 20)
     medium → Class 2 & 3         (numbers to 100, tables, ÷)
     hard   → Class 4             (larger numbers, fractions, word problems)
   Also contains the Quiz and Racing game modules, which both just
   ask QuestionBank for the next question.
   ============================================================= */

const QuestionBank = (function () {

  const NAMES  = ['Riya','Arjun','Meera','Kabir','Anaya','Dev','Zara','Ishaan','Priya','Sam'];
  const ITEM_EMOJI = { marbles:'🔵', mangoes:'🥭', pencils:'✏️', stickers:'⭐', laddoos:'🟠', books:'📚', flowers:'🌸', coins:'🪙', balloons:'🎈', cookies:'🍪' };
  const ITEMS  = Object.keys(ITEM_EMOJI);
  const COUNT_EMOJI = ['🍎','⭐','🐝','🌸','🎈','🟢','🍬','🐠'];

  function name() { return Utils.pick(NAMES); }
  function item() { return Utils.pick(ITEMS); }

  /* Several playful phrasings per operation so the SAME sum can show
     up looking different each time — keeps drilling from feeling
     like drilling. */
  function addText(a, b) {
    const it = item(), emoji = ITEM_EMOJI[it];
    return Utils.pick([
      `${a} + ${b} = ?`,
      `🎉 ${a} + ${b} = ?`,
      `${emoji} You have ${a} ${it}. A friend hands you ${b} more.\nHow many ${it} in total?`,
      `Add them up! ${a} + ${b} = ?`,
    ]);
  }
  function subText(a, b) {
    const it = item(), emoji = ITEM_EMOJI[it];
    return Utils.pick([
      `${a} − ${b} = ?`,
      `${emoji} You had ${a} ${it} and shared ${b} away.\nHow many ${it} are left?`,
      `Take away time! ${a} − ${b} = ?`,
    ]);
  }
  function multText(a, b) {
    return Utils.pick([
      `${a} × ${b} = ?`,
      `🧩 ${a} groups of ${b} — how many in all?`,
      `Quick multiply! ${a} × ${b} = ?`,
    ]);
  }
  function divText(a, b) {
    return Utils.pick([
      `${a} ÷ ${b} = ?`,
      `🍰 ${a} shared equally into ${b} groups. How many in each group?`,
    ]);
  }

  /* ---------------- EASY: Nursery & Class 1 ---------------- */
  function easyCounting() {
    const emoji = Utils.pick(COUNT_EMOJI);
    const n = Utils.randInt(3, 12);
    return { text: `${emoji.repeat(n)}\nHow many are there? 🤔`, answer: n,
      spoken: `Count the pictures. How many are there?` };
  }
  function easyCompare() {
    let a = Utils.randInt(1, 30), b = Utils.randInt(1, 30);
    while (a === b) b = Utils.randInt(1, 20);
    return { text: `🔍 Which number is BIGGER: ${a} or ${b}?`, answer: Math.max(a, b) };
  }
  function easyAdd() {
    const a = Utils.randInt(1, 20), b = Utils.randInt(1, 15);
    return { text: addText(a, b), answer: a + b };
  }
  function easySub() {
    let a = Utils.randInt(2, 30), b = Utils.randInt(1, a);
    return { text: subText(a, b), answer: a - b };
  }
  function easyMissing() {
    const a = Utils.randInt(1, 15), b = Utils.randInt(1, 12);
    return { text: `🕵️ Mystery number! ${a} + ❓ = ${a + b}`, answer: b,
      spoken: `${a} plus what number equals ${a + b}?` };
  }
  const EASY_GENS = [easyCounting, easyCompare, easyAdd, easySub, easyMissing];

  /* ---------------- MEDIUM: Class 2 & 3 ---------------- */
  function medAdd() {
    const a = Utils.randInt(10, 99), b = Utils.randInt(10, 99);
    return { text: addText(a, b), answer: a + b };
  }
  function medSub() {
    let a = Utils.randInt(20, 120), b = Utils.randInt(1, a);
    return { text: subText(a, b), answer: a - b };
  }
  function medMult() {
    const a = Utils.randInt(2, 12), b = Utils.randInt(1, 12);
    return { text: multText(a, b), answer: a * b };
  }
  function medDiv() {
    const b = Utils.randInt(2, 12), ans = Utils.randInt(2, 12);
    return { text: divText(b * ans, b), answer: ans };
  }
  function medWordAdd() {
    const n = name(), it = item(), emoji = ITEM_EMOJI[it];
    const a = Utils.randInt(10, 40), b = Utils.randInt(5, 30);
    return { text: `${emoji} ${n} has ${a} ${it}. A friend gives ${n} ${b} more.\nHow many ${it} does ${n} have now?`, answer: a + b };
  }
  function medWordSub() {
    const n = name(), it = item(), emoji = ITEM_EMOJI[it];
    const a = Utils.randInt(30, 90), b = Utils.randInt(5, a - 1);
    return { text: `${emoji} ${n} has ${a} ${it} and gives away ${b}.\nHow many ${it} are left?`, answer: a - b };
  }
  const MEDIUM_GENS = [medAdd, medSub, medMult, medDiv, medWordAdd, medWordSub];

  /* ---------------- HARD: Class 4 ----------------
     Champion is deliberately word-problem heavy. The child must
     understand the situation before choosing an operation. */
  function hardWordTwoStep() {
    const n = name(), it = item(), emoji = ITEM_EMOJI[it];
    const a = Utils.randInt(80, 200), b = Utils.randInt(10, 40), c = Utils.randInt(10, 40);
    const safeC = Math.min(c, Math.max(1, a - b - 1));
    return { text: `${emoji} A shop had ${a} ${it}. ${b} were sold in the morning and ${safeC} in the evening.\nHow many ${it} are left?`, answer: a - b - safeC,
      hint: `Start with the total. What should you take away first?`, explanation: `First subtract the morning sales: ${a} − ${b} = ${a - b}. Then subtract the evening sales: ${a - b} − ${safeC} = ${a - b - safeC}.` };
  }
  function hardWordMult() {
    const n = name(), it = item(), emoji = ITEM_EMOJI[it];
    const groups = Utils.randInt(6, 15), each = Utils.randInt(4, 12);
    return { text: `${emoji} ${n} packs ${groups} boxes. Each box has ${each} ${it}.\nHow many ${it} are there altogether?`, answer: groups * each,
      hint: `There are equal groups. Which operation combines equal groups?`, explanation: `${groups} groups of ${each}: ${groups} × ${each} = ${groups * each}.` };
  }
  function hardWordDiv() {
    const n = name(), it = item(), emoji = ITEM_EMOJI[it];
    const each = Utils.randInt(4, 12), groups = Utils.randInt(3, 8), total = each * groups;
    return { text: `${emoji} ${n} has ${total} ${it} and shares them equally among ${groups} children.\nHow many does each child get?`, answer: each,
      hint: `The total is being shared equally. What operation finds one equal share?`, explanation: `${total} ÷ ${groups} = ${each}. Each child gets ${each}.` };
  }
  function hardWordComparison() {
    const it = item(), emoji = ITEM_EMOJI[it];
    const a = Utils.randInt(50, 120), extra = Utils.randInt(15, 45), b = a + extra;
    return { text: `${emoji} A library has ${a} ${it}. Another library has ${extra} more.\nHow many ${it} does the second library have?`, answer: b,
      hint: `“${extra} more” means the second library has more than ${a}. Which operation fits?`, explanation: `${a} + ${extra} = ${b}.` };
  }
  function hardWordMoney() {
    const n = name();
    const price = Utils.randInt(12, 35), count = Utils.randInt(3, 8);
    return { text: `🪙 ${n} buys ${count} notebooks at ₹${price} each.\nHow many rupees does ${n} spend?`, answer: price * count,
      hint: `The price is the same for every notebook. How many equal groups of ₹${price} are there?`, explanation: `${count} × ₹${price} = ₹${price * count}.` };
  }
  function hardWordFraction() {
    const it = item();
    const total = Utils.randInt(3, 12) * 4;
    return { text: `🍕 A class has ${total} ${it}. One quarter of them are put on a table.\nHow many ${it} are on the table?`, answer: total / 4,
      hint: `One quarter means divide the whole amount into 4 equal parts.`, explanation: `${total} ÷ 4 = ${total / 4}.` };
  }
  function hardWordPerimeter() {
    const l = Utils.randInt(5, 18), w = Utils.randInt(3, 12);
    return { text: `📏 A rectangular garden is ${l} m long and ${w} m wide. A child walks all the way around it.\nHow many metres does the child walk?`, answer: 2 * (l + w),
      hint: `Walking all the way around means finding the perimeter. Add all four sides.`, explanation: `Two lengths and two widths: ${l} + ${w} + ${l} + ${w} = ${2 * (l + w)} m.` };
  }
  const HARD_GENS = [hardWordTwoStep, hardWordMult, hardWordDiv, hardWordComparison, hardWordMoney, hardWordFraction, hardWordPerimeter];

  const TIER_GENS = { easy: EASY_GENS, medium: MEDIUM_GENS, hard: HARD_GENS };
  const recentAnswers = { easy: [], medium: [], hard: [] };
  const recentNumberSets = { easy: [], medium: [], hard: [] };

  function numberSignature(text) {
    return (String(text).match(/\d+(?:\.\d+)?/g) || []).join(',');
  }

  function remember(difficulty, q) {
    recentAnswers[difficulty].push(q.answer);
    recentNumberSets[difficulty].push(numberSignature(q.text));
    if (recentAnswers[difficulty].length > 24) recentAnswers[difficulty].shift();
    if (recentNumberSets[difficulty].length > 18) recentNumberSets[difficulty].shift();
  }

  function generate(difficulty) {
    const level = TIER_GENS[difficulty] ? difficulty : 'easy';
    const gens = TIER_GENS[level];
    let q = null, tries = 0;

    do {
      q = Utils.pick(gens)();
      tries++;
    } while (
      tries < 40 &&
      (!Number.isFinite(q.answer) ||
       recentAnswers[level].includes(q.answer) ||
       recentNumberSets[level].includes(numberSignature(q.text)))
    );

    if (!q.spoken) q.spoken = q.text.replace(/\n/g, '. ').replace(/❓/g, 'what number');
    remember(level, q);
    return q;
  }

  return { generate };
})();


/* =============================================================
   ENCOURAGING FEEDBACK — never harsh, never a red "WRONG"
   ============================================================= */
const Encourage = (function () {
  const CORRECT = [
    '✅ Correct! Wonderful work!',
    '✅ Yes! You\'ve got it!',
    '✅ Nicely done!',
    '✅ That\'s right — great thinking!',
    '✅ Super! On to the next one.',
  ];
  const TRY_AGAIN = [
    '🙂 Not quite yet. Take another look and think about what the question is asking.',
    '🌱 Good attempt. You can try the same question again.',
    '💭 Close thinking. Pause, reread the problem, and choose your next step.',
    '💪 Keep working on it. Your first answer does not have to be your final answer.',
  ];
  function correct() { return Utils.pick(CORRECT); }
  function tryAgain() { return Utils.pick(TRY_AGAIN); }
  return { correct, tryAgain };
})();


/* =============================================================
   SECTION – ARITHMETIC QUIZ
   ============================================================= */
const Quiz = (function () {
  let difficulty = 'easy';
  let score = 0, correctCount = 0, wrongCount = 0, questionNum = 0;
  let currentAnswer = 0;
  let currentQuestion = null;
  let attemptCount = 0;
  let questionStartedAt = 0;
  let masteryHistory = [];
  let questionResolved = false;
  let currentMasteryValue = null;

  const DIFF_LABEL = { easy: 'Starter', medium: 'Growing', hard: 'Champion' };

  function init() {
    score = correctCount = wrongCount = questionNum = 0;
    masteryHistory = [];
    questionResolved = false;
    currentMasteryValue = null;
    updateMasteryDisplay();
    show('quiz-difficulty-panel');
    hide('quiz-play-panel');
    hide('quiz-feedback');
    updateScoreDisplay();
  }

  function setDifficulty(level) {
    recordMasteryResult();
    masteryHistory = [];
    difficulty = level;
    document.getElementById('quiz-diff-badge').textContent = DIFF_LABEL[level] || level;
    hide('quiz-difficulty-panel');
    show('quiz-play-panel');
    hide('quiz-feedback');
    nextQuestion();
  }

  function changeDifficulty() {
    show('quiz-difficulty-panel');
    hide('quiz-play-panel');
    hide('quiz-feedback');
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
    document.getElementById('quiz-q-number').textContent = questionNum;
    document.getElementById('quiz-question').textContent = currentQuestion.text;

    const inp = document.getElementById('quiz-input');
    inp.value = '';
    hide('quiz-feedback');
    renderQuizActions();
    inp.focus();

    questionStartedAt = performance.now();
  }

  function replayQuestion() {
    if (!currentQuestion) return;
    attemptCount = 0;
    questionResolved = false;
    document.getElementById('quiz-question').textContent = currentQuestion.text;
    document.getElementById('quiz-input').value = '';
    hide('quiz-feedback');
    renderQuizActions();
    document.getElementById('quiz-input').focus();
    questionStartedAt = performance.now();
  }

  function retryQuestion() {
    if (!currentQuestion) return;
    hide('quiz-feedback');
    document.getElementById('quiz-input').value = '';
    renderQuizActions();
    document.getElementById('quiz-input').focus();
  }

  function showHint() {
    if (!currentQuestion) return;
    const hint = currentQuestion.hint || 'Reread the question slowly. What information do you know, and what are you trying to find?';
    showFeedback(`💡 Hint: ${hint}`, 'hint');
    renderQuizActions();
  }

  function showExplanation() {
    if (!currentQuestion) return;
    const explanation = currentQuestion.explanation || `Try identifying the operation first, then calculate carefully. The answer is ${currentAnswer}.`;
    showFeedback(`🧠 Let’s think it through: ${explanation}`, 'explanation');
    renderQuizActions(true);
  }

  function renderQuizActions(revealAnswer = false) {
    const el = document.getElementById('quiz-actions');
    if (!el) return;
    el.innerHTML = `
      <button class="quiz-action secondary" onclick="Quiz.retry()">🔁 Try This Again</button>
      <button class="quiz-action secondary" onclick="Quiz.replay()">↺ Replay Question</button>
      <button class="quiz-action secondary" onclick="Quiz.hint()">💡 Give Me a Hint</button>
      ${revealAnswer ? '' : '<button class="quiz-action secondary" onclick="Quiz.explain()">🧠 Show Me How</button>'}
      <button class="quiz-action primary" onclick="Quiz.next()">➡ Next Question</button>
    `;
  }

  function showFeedback(msg, type) {
    const el = document.getElementById('quiz-feedback');
    el.textContent = msg;
    el.className = `feedback ${type}`;
    show('quiz-feedback');
  }

  function updateScoreDisplay() {
    const scoreEl = document.getElementById('quiz-score');
    if (scoreEl) scoreEl.textContent = score;
    const correctEl = document.getElementById('quiz-correct');
    if (correctEl) correctEl.textContent = correctCount;
    const wrongEl = document.getElementById('quiz-wrong');
    if (wrongEl) wrongEl.textContent = wrongCount;
    const totalEl = document.getElementById('quiz-total');
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
    Analytics.log('quiz', 'mastery', {
      difficulty,
      value: masteryHistory[masteryHistory.length - 1],
      attempts: attemptCount,
      resolved: questionResolved
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
    const fill = document.getElementById('quiz-mastery-fill');
    const label = document.getElementById('quiz-mastery-label');
    const note = document.getElementById('quiz-mastery-note');
    if (!fill || !label || !note) return;

    fill.style.width = value + '%';
    const top = document.getElementById('quiz-mastery-top');
    if (top) top.textContent = value + '%';

    if (value >= 85) {
      label.textContent = 'Strong';
      note.textContent = 'You are solving these confidently. Keep checking your reasoning!';
    } else if (value >= 65) {
      label.textContent = 'Growing';
      note.textContent = 'Nice progress. A few more thoughtful attempts can strengthen this skill.';
    } else if (value > 0) {
      label.textContent = 'Building';
      note.textContent = 'Keep practising. Hints and retries are part of learning.';
    } else {
      label.textContent = 'Starting';
      note.textContent = 'Try a few questions first. Mastery grows through understanding, not speed.';
    }
  }

  function submit() {
    if (!currentQuestion || questionResolved) return;
    const input = document.getElementById('quiz-input');
    const raw = input ? input.value.trim() : '';
    if (!raw) {
      showFeedback('Type an answer first, then press Submit.', 'hint');
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
      showFeedback(Encourage.correct(), 'correct');
    } else {
      wrongCount++;
      currentMasteryValue = 0;
      showFeedback(Encourage.tryAgain(), 'wrong');
    }

    Analytics.log('quiz', 'answer', {
      difficulty,
      correct,
      timeMs,
      attempts: attemptCount,
      expected: currentAnswer,
    });

    updateScoreDisplay();
    renderQuizActions(questionResolved);

    if (correct) {
      setTimeout(() => {
        if (questionResolved) nextQuestion();
      }, 500);
    }
  }

  function next() {
    nextQuestion();
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

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('quiz-input');
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  });

  return { init, setDifficulty, changeDifficulty, submit, next, retry, hint, explain, replay: replayQuestion };
})();


/* =============================================================
   SECTION – MATH RACING
   ============================================================= */
const Racing = (function () {
  let selectedTimer = 30, difficulty = 'easy', playerName = '';
  let timeLeft = 30, timerInterval = null;
  let score = 0, correctCount = 0, wrongCount = 0;
  let currentAnswer = 0, totalDuration = 30, questionStartedAt = 0;
  let raceActive = false;
  let questionLocked = false;
  let leaderboard = [];
  const LEADERBOARD_KEY = 'mfa_race_leaderboard_v1';

  function init() {
    show('race-setup-panel'); hide('race-play-panel'); hide('race-result-panel');
    loadLeaderboard(); renderLeaderboard(); setTimer(30); setDifficulty('easy');
  }
  function setTimer(seconds) {
    selectedTimer = seconds;
    ['30','60','90'].forEach(t => {
      const el = document.getElementById('timer-' + t);
      if (el) el.classList.toggle('active', t === String(seconds));
    });
  }
  function setDifficulty(level) {
    difficulty = level;
    ['easy','medium','hard'].forEach(d => {
      const el = document.getElementById('race-' + d);
      if (el) el.classList.toggle('active-diff', d === level);
    });
  }
  function start() {
    const nameInput = document.getElementById('race-player-name');
    playerName = (nameInput && nameInput.value.trim()) || 'Student';
    if (timerInterval) clearInterval(timerInterval);
    score = correctCount = wrongCount = 0;
    timeLeft = totalDuration = selectedTimer;
    raceActive = true;
    questionLocked = false;
    document.getElementById('race-player-display').textContent = playerName;
    document.getElementById('race-live-score').textContent = '0';
    document.getElementById('race-top-score').textContent = '0';
    updateTimerDisplay();
    hide('race-setup-panel'); hide('race-result-panel'); show('race-play-panel');
    hide('race-feedback');
    const timerEl = document.getElementById('race-timer');
    if (timerEl) timerEl.className = 'hud-timer';
    const fill = document.getElementById('race-progress-fill');
    if (fill) fill.style.width = '100%';
    Analytics.log('race', 'start', { difficulty, timer: selectedTimer });
    nextQuestion();
    timerInterval = setInterval(tick, 1000);
  }
  function tick() {
    timeLeft--; updateTimerDisplay();
    const fill = document.getElementById('race-progress-fill');
    if (fill) fill.style.width = Math.max(0, (timeLeft / totalDuration) * 100) + '%';
    const timerEl = document.getElementById('race-timer');
    if (timerEl) timerEl.className = timeLeft <= 5 ? 'hud-timer danger' : timeLeft <= 10 ? 'hud-timer warning' : 'hud-timer';
    if (timeLeft <= 0) endRace();
  }
  function updateTimerDisplay() {
    const el = document.getElementById('race-timer');
    if (el) el.textContent = Math.max(0, timeLeft);
  }
  function nextQuestion() {
    if (!raceActive || timeLeft <= 0) return;
    questionLocked = false;
    const q = QuestionBank.generate(difficulty);
    currentAnswer = q.answer;
    const questionEl = document.getElementById('race-question');
    const inputEl = document.getElementById('race-input');
    if (questionEl) questionEl.textContent = q.text;
    if (inputEl) { inputEl.value = ''; inputEl.focus(); }
    questionStartedAt = performance.now();
  }
  function submit() {
    if (!raceActive || timeLeft <= 0 || questionLocked) return;
    questionLocked = true;
    const inputEl = document.getElementById('race-input');
    const rawVal = inputEl ? inputEl.value.trim() : '';
    if (!rawVal) { showRaceFeedback('Type an answer before you press Go!', 'wrong'); return; }
    const isCorrect = parseFloat(rawVal) === currentAnswer;
    if (isCorrect) { correctCount++; score += 10; showRaceFeedback('✅ Correct! Keep going!', 'correct'); }
    else { wrongCount++; showRaceFeedback('🙂 Not quite. Keep racing and try the next one!', 'wrong'); }
    Analytics.log('race', 'answer', { difficulty, correct: isCorrect, timeMs: Math.round(performance.now() - questionStartedAt) });
    const live = document.getElementById('race-live-score');
    const top = document.getElementById('race-top-score');
    if (live) live.textContent = score;
    if (top) top.textContent = score;
    setTimeout(() => { if (timeLeft > 0) nextQuestion(); }, 180);
  }
  function showRaceFeedback(msg, type) {
    const el = document.getElementById('race-feedback');
    if (!el) return;
    el.textContent = msg; el.className = 'feedback ' + type; show('race-feedback');
  }
  function endRace() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    raceActive = false;
    questionLocked = true;
    timeLeft = 0; updateTimerDisplay();
    const total = correctCount + wrongCount;
    const accuracy = total ? Math.round(correctCount / total * 100) : 0;
    Analytics.log('race', 'round_complete', { difficulty, timer: totalDuration, correct: correctCount, wrong: wrongCount, score });
    leaderboard.push({ name: playerName || 'Student', score, correct: correctCount, accuracy, timer: totalDuration, ts: Date.now() });
    leaderboard.sort((a, b) => b.score - a.score); leaderboard = leaderboard.slice(0, 10);
    saveLeaderboard(); renderLeaderboard();
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    set('result-player-name', playerName || 'Student'); set('result-final-score', score);
    set('result-correct', correctCount); set('result-wrong', wrongCount); set('result-accuracy', accuracy + '%');
    set('result-message', accuracy >= 80 ? 'Fantastic focus!' : accuracy >= 60 ? 'Good work! Keep practising.' : 'Every question is practice. Keep going!');
    hide('race-play-panel'); show('race-result-panel');
  }
  function loadLeaderboard() {
    try { leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || []; } catch (e) { leaderboard = []; }
  }
  function saveLeaderboard() {
    try { localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard)); } catch (e) {}
  }
  function renderLeaderboard() {
    loadLeaderboard();
    const el = document.getElementById('leaderboard-list');
    if (!el) return;
    if (!leaderboard.length) { el.innerHTML = '<p class="leaderboard-empty">No scores yet — be the first!</p>'; return; }
    el.innerHTML = leaderboard.map((entry, index) =>
      '<div class="leaderboard-row"><span>#' + (index + 1) + ' ' + String(entry.name).replace(/[<>&"']/g, '') + '</span><strong>' + entry.score + '</strong></div>'
    ).join('');
  }
  function clearLeaderboard() { leaderboard = []; saveLeaderboard(); renderLeaderboard(); }
  function back() { raceActive = false; questionLocked = true; if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } hide('race-play-panel'); hide('race-result-panel'); show('race-setup-panel'); }
  return { init, setTimer, setDifficulty, start, submit, back, clearLeaderboard };
})();

// =============================================================
// Global exports
// =============================================================
window.Quiz = Quiz;
window.Racing = Racing;
