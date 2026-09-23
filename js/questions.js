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
    const n = Utils.randInt(3, 10);
    return { text: `${emoji.repeat(n)}\nHow many are there? 🤔`, answer: n,
      spoken: `Count the pictures. How many are there?` };
  }
  function easyCompare() {
    let a = Utils.randInt(1, 20), b = Utils.randInt(1, 20);
    while (a === b) b = Utils.randInt(1, 20);
    return { text: `🔍 Which number is BIGGER: ${a} or ${b}?`, answer: Math.max(a, b) };
  }
  function easyAdd() {
    const a = Utils.randInt(1, 12), b = Utils.randInt(1, 10);
    return { text: addText(a, b), answer: a + b };
  }
  function easySub() {
    let a = Utils.randInt(2, 20), b = Utils.randInt(1, a);
    return { text: subText(a, b), answer: a - b };
  }
  function easyMissing() {
    const a = Utils.randInt(1, 10), b = Utils.randInt(1, 9);
    return { text: `🕵️ Mystery number! ${a} + ❓ = ${a + b}`, answer: b,
      spoken: `${a} plus what number equals ${a + b}?` };
  }
  const EASY_GENS = [easyCounting, easyCounting, easyCompare, easyAdd, easyAdd, easySub, easyMissing];

  /* ---------------- MEDIUM: Class 2 & 3 ---------------- */
  function medAdd() {
    const a = Utils.randInt(10, 89), b = Utils.randInt(10, 99);
    return { text: addText(a, b), answer: a + b };
  }
  function medSub() {
    let a = Utils.randInt(20, 99), b = Utils.randInt(1, a);
    return { text: subText(a, b), answer: a - b };
  }
  function medMult() {
    const a = Utils.randInt(2, 10), b = Utils.randInt(1, 10);
    return { text: multText(a, b), answer: a * b };
  }
  function medDiv() {
    const b = Utils.randInt(2, 10), ans = Utils.randInt(2, 10);
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
  const MEDIUM_GENS = [medAdd, medSub, medMult, medMult, medDiv, medWordAdd, medWordSub];

  /* ---------------- HARD: Class 4 (partial) ---------------- */
  function hardMult() {
    const a = Utils.randInt(11, 30), b = Utils.randInt(2, 12);
    return { text: multText(a, b), answer: a * b };
  }
  function hardDiv() {
    const b = Utils.randInt(2, 12), ans = Utils.randInt(6, 20);
    return { text: divText(b * ans, b), answer: ans };
  }
  function hardWordTwoStep() {
    const n = name(), it = item(), emoji = ITEM_EMOJI[it];
    const a = Utils.randInt(80, 200), b = Utils.randInt(10, 40), c = Utils.randInt(10, 40);
    const safeC = Math.min(c, Math.max(1, a - b - 1));
    return { text: `${emoji} A shop had ${a} ${it}. ${b} were sold in the morning and ${safeC} in the evening.\nHow many ${it} are left?`, answer: a - b - safeC };
  }
  function hardFractionHalf() {
    const n = Utils.randInt(2, 40) * 2;
    return { text: `🍕 What is half of ${n}?`, answer: n / 2, spoken: `What is one half of ${n}?` };
  }
  function hardFractionQuarter() {
    const n = Utils.randInt(2, 20) * 4;
    return { text: `🍕 What is one quarter (¼) of ${n}?`, answer: n / 4 };
  }
  function hardPerimeter() {
    const l = Utils.randInt(3, 20), w = Utils.randInt(2, 20);
    return { text: `A rectangle is ${l} cm long and ${w} cm wide.\nWhat is its perimeter (in cm)?`, answer: 2 * (l + w) };
  }
  const HARD_GENS = [hardMult, hardMult, hardDiv, hardWordTwoStep, hardFractionHalf, hardFractionQuarter, hardPerimeter];

  const TIER_GENS = { easy: EASY_GENS, medium: MEDIUM_GENS, hard: HARD_GENS };

  function generate(difficulty) {
    const gens = TIER_GENS[difficulty] || EASY_GENS;
    let q = null, tries = 0;
    do { q = Utils.pick(gens)(); tries++; } while ((!Number.isFinite(q.answer)) && tries < 10);
    if (!q.spoken) q.spoken = q.text.replace(/\n/g, '. ').replace(/❓/g, 'what number');
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
  const TRY_AGAIN = (ans) => [
    `😊 Not quite — the answer was ${ans}. You're learning!`,
    `🙂 Close! It was ${ans}. Let's try another.`,
    `💪 Almost — the answer was ${ans}. Keep going!`,
    `🌱 Good try — it was ${ans}. Every attempt helps you grow.`,
  ];
  function correct() { return Utils.pick(CORRECT); }
  function tryAgain(ans) { return Utils.pick(TRY_AGAIN(ans)); }
  return { correct, tryAgain };
})();


/* =============================================================
   SECTION – ARITHMETIC QUIZ
   ============================================================= */
const Quiz = (function () {
  let difficulty = 'easy';
  let score = 0, correctCount = 0, wrongCount = 0, questionNum = 0;
  let currentAnswer = 0;
  let feedbackTimer = null;
  let questionStartedAt = 0;

  const DIFF_LABEL = { easy: 'Starter', medium: 'Growing', hard: 'Champion' };

  function init() {
    score = correctCount = wrongCount = questionNum = 0;
    show('quiz-difficulty-panel');
    hide('quiz-play-panel');
    hide('quiz-feedback');
    updateScoreDisplay();
  }

  function setDifficulty(level) {
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
    const q = QuestionBank.generate(difficulty);
    currentAnswer = q.answer;

    questionNum++;
    document.getElementById('quiz-q-number').textContent = questionNum;
    document.getElementById('quiz-question').textContent = q.text;

    const inp = document.getElementById('quiz-input');
    inp.value = '';
    hide('quiz-feedback');
    clearTimeout(feedbackTimer);
    inp.focus();

    questionStartedAt = performance.now();
  }

  function submit() {
    const inputEl = document.getElementById('quiz-input');
    const rawVal = inputEl.value.trim();
    if (rawVal === '') { showFeedback('Type your answer first — take your time!', 'wrong'); return; }

    const playerAnswer = parseFloat(rawVal);
    const isCorrect = playerAnswer === currentAnswer;
    const timeMs = Math.round(performance.now() - questionStartedAt);

    if (isCorrect) {
      correctCount++; score += 10;
      showFeedback(Encourage.correct(), 'correct');
    } else {
      wrongCount++;
      showFeedback(Encourage.tryAgain(currentAnswer), 'wrong');
    }
    Analytics.log('quiz', 'answer', { difficulty, correct: isCorrect, timeMs });

    updateScoreDisplay();
    feedbackTimer = setTimeout(() => nextQuestion(), 1400);
  }

  function showFeedback(msg, type) {
    const el = document.getElementById('quiz-feedback');
    el.textContent = msg;
    el.className = `feedback ${type}`;
    show('quiz-feedback');
  }

  function updateScoreDisplay() {
    document.getElementById('quiz-score').textContent = score;
    document.getElementById('quiz-correct').textContent = correctCount;
    document.getElementById('quiz-wrong').textContent = wrongCount;
    document.getElementById('quiz-total').textContent = correctCount + wrongCount;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('quiz-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  });

  return { init, setDifficulty, changeDifficulty, submit };
})();


/* =============================================================
   SECTION – MATH RACING
   ============================================================= */
const Racing = (function () {
  let selectedTimer = 30;
  let difficulty = 'easy';
  let playerName = '';
  let timeLeft = 30;
  let timerInterval = null;
  let score = 0, correctCount = 0, wrongCount = 0;
  let currentAnswer = 0;
  let totalDuration = 30;
  let leaderboard = [];

  const DIFF_LABEL = { easy: 'Starter', medium: 'Growing', hard: 'Champion' };

  function init() {
    show('race-setup-panel');
    hide('race-play-panel');
    hide('race-result-panel');
    renderLeaderboard();
    setTimer(30);
    setDifficulty('easy');
  }

  function setTimer(seconds) {
    selectedTimer = seconds;
    ['30','60','90'].forEach(t => document.getElementById(`timer-${t}`).classList.toggle('active', t === String(seconds)));
  }

  function setDifficulty(level) {
    difficulty = level;
    ['easy','medium','hard'].forEach(d => {
      const el = document.getElementById(`race-${d}`);
      if (el) el.classList.toggle('active-diff', d === level);
    });
  }

  function start() {
    const nameInput = document.getElementById('race-player-name').value.trim();
    playerName = nameInput || 'Student';

    score = correctCount = wrongCount = 0;
    timeLeft = selectedTimer;
    totalDuration = selectedTimer;

    document.getElementById('race-player-display').textContent = playerName;
    document.getElementById('race-live-score').textContent = '0';
    document.getElementById('race-top-score').textContent = '0';
    updateTimerDisplay();

    hide('race-setup-panel'); hide('race-result-panel'); show('race-play-panel'); hide('race-feedback');
    document.getElementById('race-timer').className = 'hud-timer';

    Analytics.log('race', 'start', { difficulty, timer: selectedTimer });
    nextQuestion();
    document.getElementById('race-input').focus();
    timerInterval = setInterval(tick, 1000);
  }

  function tick() {
    timeLeft--;
    updateTimerDisplay();
    const pct = (timeLeft / totalDuration) * 100;
    document.getElementById('race-progress-fill').style.width = pct + '%';
    const timerEl = document.getElementById('race-timer');
    if (timeLeft <= 5) timerEl.className = 'hud-timer danger';
    else if (timeLeft <= 10) timerEl.className = 'hud-timer warning';
    if (timeLeft <= 0) endRace();
  }

  function updateTimerDisplay() { document.getElementById('race-timer').textContent = timeLeft; }

  function nextQuestion() {
    const q = QuestionBank.generate(difficulty);
    currentAnswer = q.answer;
    document.getElementById('race-question').textContent = q.text;
    const inp = document.getElementById('race-input');
    inp.value = '';
    inp.focus();
  }

  function submit() {
    if (timeLeft <= 0) return;
    const inp = document.getElementById('race-input');
    const val = inp.value.trim();
    if (val === '') return;

    const playerAns = parseFloat(val);
    const isCorrect = playerAns === currentAnswer;

    if (isCorrect) {
      correctCount++; score++;
      document.getElementById('race-live-score').textContent = score;
      document.getElementById('race-top-score').textContent = score;
      showRaceFeedback('✅ +1', 'correct');
    } else {
      wrongCount++;
      showRaceFeedback(`🙂 It was ${currentAnswer}`, 'wrong');
    }
    Analytics.log('race', 'answer', { difficulty, correct: isCorrect });
    nextQuestion();
  }

  function showRaceFeedback(msg, type) {
    const el = document.getElementById('race-feedback');
    el.textContent = msg;
    el.className = `feedback ${type}`;
    show('race-feedback');
    setTimeout(() => hide('race-feedback'), 600);
  }

  function endRace() {
    clearInterval(timerInterval);
    Analytics.log('race', 'round_complete', { difficulty, score, correctCount, wrongCount });

    leaderboard.push({ name: playerName, score, correct: correctCount, wrong: wrongCount, difficulty, timer: totalDuration, time: new Date().toLocaleTimeString() });
    leaderboard.sort((a,b) => b.score - a.score);

    hide('race-play-panel'); show('race-result-panel');
    document.getElementById('result-player-name').textContent = playerName;
    document.getElementById('result-final-score').textContent = score;
    document.getElementById('result-correct').textContent = correctCount;
    document.getElementById('result-wrong').textContent = wrongCount;

    const total = correctCount + wrongCount;
    const acc = total > 0 ? Math.round((correctCount/total)*100) : 0;
    document.getElementById('result-accuracy').textContent = acc + '%';

    let emoji, msg;
    if (score >= 20)      { emoji = '🏆'; msg = 'Outstanding! You are a Math Champion!'; }
    else if (score >= 15) { emoji = '🥇'; msg = 'Excellent work! Keep it up!'; }
    else if (score >= 10) { emoji = '🥈'; msg = 'Great job! You are improving!'; }
    else if (score >= 5)  { emoji = '🥉'; msg = 'Good effort! Try again to beat your score!'; }
    else                  { emoji = '💪'; msg = 'Every round makes you stronger — keep practising!'; }

    document.getElementById('result-emoji').textContent = emoji;
    document.getElementById('result-message').textContent = msg;
  }

  function playAgain() { start(); }
  function backToSetup() { hide('race-play-panel'); hide('race-result-panel'); show('race-setup-panel'); renderLeaderboard(); }
  function clearLeaderboard() { leaderboard = []; renderLeaderboard(); }

  function renderLeaderboard() {
    const listEl = document.getElementById('leaderboard-list');
    if (leaderboard.length === 0) {
      listEl.innerHTML = '<p class="leaderboard-empty">No scores yet — be the first!</p>';
      return;
    }
    const medals = ['🥇','🥈','🥉'];
    listEl.innerHTML = leaderboard.slice(0, 10).map((entry, i) => `
      <div class="leaderboard-item">
        <div class="lb-rank">${medals[i] || (i+1)+'.'}</div>
        <div class="lb-info">
          <div class="lb-name">${Utils.escapeHtml(entry.name)}</div>
          <div class="lb-meta">${entry.difficulty} · ${entry.timer}s · ${entry.time}</div>
        </div>
        <div class="lb-score">${entry.score}</div>
      </div>`).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('race-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  });

  return { init, setTimer, setDifficulty, start, submit, playAgain, backToSetup, clearLeaderboard };
})();
