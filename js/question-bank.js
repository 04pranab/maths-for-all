/* Shared question generation and encouragement helpers for Arithmetic Quiz and Math Racing. */

const QuestionBank = (function () {
  const NAMES = [
    "Riya",
    "Arjun",
    "Meera",
    "Kabir",
    "Anaya",
    "Dev",
    "Zara",
    "Ishaan",
    "Priya",
    "Sam",
  ];
  const ITEM_EMOJI = {
    marbles: "🔵",
    mangoes: "🥭",
    pencils: "✏️",
    stickers: "⭐",
    laddoos: "🟠",
    books: "📚",
    flowers: "🌸",
    coins: "🪙",
    balloons: "🎈",
    cookies: "🍪",
  };
  const ITEMS = Object.keys(ITEM_EMOJI);
  const COUNT_EMOJI = ["🍎", "⭐", "🐝", "🌸", "🎈", "🟢", "🍬", "🐠"];

  function name() {
    return Utils.pick(NAMES);
  }
  function item() {
    return Utils.pick(ITEMS);
  }

  /* Several playful phrasings per operation so the SAME sum can show
     up looking different each time — keeps drilling from feeling
     like drilling. */
  function addText(a, b) {
    const it = item(),
      emoji = ITEM_EMOJI[it];
    return Utils.pick([
      `${a} + ${b} = ?`,
      `🎉 ${a} + ${b} = ?`,
      `${emoji} You have ${a} ${it}. A friend hands you ${b} more.\nHow many ${it} in total?`,
      `Add them up! ${a} + ${b} = ?`,
    ]);
  }
  function subText(a, b) {
    const it = item(),
      emoji = ITEM_EMOJI[it];
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
    const n = Utils.randInt(1, 40);
    return {
      text: `${emoji.repeat(n)}\nHow many are there? 🤔`,
      answer: n,
      spoken: `Count the pictures. How many are there?`,
    };
  }
  function easyCompare() {
    let a = Utils.randInt(1, 30),
      b = Utils.randInt(1, 30);
    while (a === b) b = Utils.randInt(1, 50);
    return { text: `🔍 Which number is BIGGER: ${a} or ${b}?`, answer: Math.max(a, b) };
  }
  function easyAdd() {
    const a = Utils.randInt(1, 50),
      b = Utils.randInt(1, 40);
    return { text: addText(a, b), answer: a + b };
  }
  function easySub() {
    let a = Utils.randInt(2, 60),
      b = Utils.randInt(1, a);
    return { text: subText(a, b), answer: a - b };
  }
  function easyMissing() {
    const a = Utils.randInt(1, 50),
      b = Utils.randInt(1, 40);
    return {
      text: `🕵️ Mystery number! ${a} + ❓ = ${a + b}`,
      answer: b,
      spoken: `${a} plus what number equals ${a + b}?`,
    };
  }
  const EASY_GENS = [easyCounting, easyCompare, easyAdd, easySub, easyMissing];

  /* ---------------- MEDIUM: Class 2 & 3 ---------------- */
  function medAdd() {
    const a = Utils.randInt(10, 120),
      b = Utils.randInt(10, 120);
    return { text: addText(a, b), answer: a + b };
  }
  function medSub() {
    let a = Utils.randInt(20, 150),
      b = Utils.randInt(1, a);
    return { text: subText(a, b), answer: a - b };
  }
  function medMult() {
    const a = Utils.randInt(2, 12),
      b = Utils.randInt(1, 12);
    return { text: multText(a, b), answer: a * b };
  }
  function medDiv() {
    const b = Utils.randInt(2, 12),
      ans = Utils.randInt(2, 12);
    return { text: divText(b * ans, b), answer: ans };
  }
  function medWordAdd() {
    const n = name(),
      it = item(),
      emoji = ITEM_EMOJI[it];
    const a = Utils.randInt(10, 40),
      b = Utils.randInt(5, 30);
    return {
      text: `${emoji} ${n} has ${a} ${it}. A friend gives ${n} ${b} more.\nHow many ${it} does ${n} have now?`,
      answer: a + b,
    };
  }
  function medWordSub() {
    const n = name(),
      it = item(),
      emoji = ITEM_EMOJI[it];
    const a = Utils.randInt(30, 90),
      b = Utils.randInt(5, a - 1);
    return {
      text: `${emoji} ${n} has ${a} ${it} and gives away ${b}.\nHow many ${it} are left?`,
      answer: a - b,
    };
  }
  const MEDIUM_GENS = [medAdd, medSub, medMult, medDiv, medWordAdd, medWordSub];

  /* ---------------- HARD: Class 4 ----------------
     Champion is deliberately word-problem heavy. The child must
     understand the situation before choosing an operation. */
  function hardWordTwoStep() {
    const n = name(),
      it = item(),
      emoji = ITEM_EMOJI[it];
    const a = Utils.randInt(80, 200),
      b = Utils.randInt(10, 40),
      c = Utils.randInt(10, 40);
    const safeC = Math.min(c, Math.max(1, a - b - 1));
    return {
      text: `${emoji} A shop had ${a} ${it}. ${b} were sold in the morning and ${safeC} in the evening.\nHow many ${it} are left?`,
      answer: a - b - safeC,
      hint: `Start with the total. What should you take away first?`,
      explanation: `First subtract the morning sales: ${a} − ${b} = ${a - b}. Then subtract the evening sales: ${a - b} − ${safeC} = ${a - b - safeC}.`,
    };
  }
  function hardWordMult() {
    const n = name(),
      it = item(),
      emoji = ITEM_EMOJI[it];
    const groups = Utils.randInt(3, 15),
      each = Utils.randInt(4, 20);
    return {
      text: `${emoji} ${n} packs ${groups} boxes. Each box has ${each} ${it}.\nHow many ${it} are there altogether?`,
      answer: groups * each,
      hint: `There are equal groups. Which operation combines equal groups?`,
      explanation: `${groups} groups of ${each}: ${groups} × ${each} = ${groups * each}.`,
    };
  }
  function hardWordDiv() {
    const n = name(),
      it = item(),
      emoji = ITEM_EMOJI[it];
    const each = Utils.randInt(4, 20),
      groups = Utils.randInt(3, 12),
      total = each * groups;
    return {
      text: `${emoji} ${n} has ${total} ${it} and shares them equally among ${groups} children.\nHow many does each child get?`,
      answer: each,
      hint: `The total is being shared equally. What operation finds one equal share?`,
      explanation: `${total} ÷ ${groups} = ${each}. Each child gets ${each}.`,
    };
  }
  function hardWordComparison() {
    const it = item(),
      emoji = ITEM_EMOJI[it];
    const a = Utils.randInt(30, 150),
      extra = Utils.randInt(5, 60),
      b = a + extra;
    return {
      text: `${emoji} A library has ${a} ${it}. Another library has ${extra} more.\nHow many ${it} does the second library have?`,
      answer: b,
      hint: `“${extra} more” means the second library has more than ${a}. Which operation fits?`,
      explanation: `${a} + ${extra} = ${b}.`,
    };
  }
  function hardWordMoney() {
    const n = name();
    const price = Utils.randInt(5, 50),
      count = Utils.randInt(2, 12);
    return {
      text: `🪙 ${n} buys ${count} notebooks at ₹${price} each.\nHow many rupees does ${n} spend?`,
      answer: price * count,
      hint: `The price is the same for every notebook. How many equal groups of ₹${price} are there?`,
      explanation: `${count} × ₹${price} = ₹${price * count}.`,
    };
  }
  function hardWordFraction() {
    const it = item();
    const total = Utils.randInt(2, 30) * 4;
    return {
      text: `🍕 A class has ${total} ${it}. One quarter of them are put on a table.\nHow many ${it} are on the table?`,
      answer: total / 4,
      hint: `One quarter means divide the whole amount into 4 equal parts.`,
      explanation: `${total} ÷ 4 = ${total / 4}.`,
    };
  }
  function hardWordPerimeter() {
    const l = Utils.randInt(5, 30),
      w = Utils.randInt(3, 20);
    return {
      text: `📏 A rectangular garden is ${l} m long and ${w} m wide. A child walks all the way around it.\nHow many metres does the child walk?`,
      answer: 2 * (l + w),
      hint: `Walking all the way around means finding the perimeter. Add all four sides.`,
      explanation: `Two lengths and two widths: ${l} + ${w} + ${l} + ${w} = ${2 * (l + w)} m.`,
    };
  }
  const HARD_GENS = [
    hardWordTwoStep,
    hardWordMult,
    hardWordDiv,
    hardWordComparison,
    hardWordMoney,
    hardWordFraction,
    hardWordPerimeter,
  ];

  const TIER_GENS = { easy: EASY_GENS, medium: MEDIUM_GENS, hard: HARD_GENS };
  // A displayed number may occur twice, but never three times in the
  // active pool. This keeps generated questions varied without making
  // long sessions run out of useful arithmetic combinations immediately.
  const numberCounts = { easy: new Map(), medium: new Map(), hard: new Map() };
  const MAX_NUMBER = 250;
  const MAX_NUMBER_USES = 2;
  const usedAnswers = { easy: new Map(), medium: new Map(), hard: new Map() };

  function extractNumbers(text) {
    return (String(text).match(/\d+(?:\.\d+)?/g) || []).map(Number);
  }

  function canUseQuestion(level, q) {
    if (!Number.isFinite(q.answer)) return false;
    const answerUses = usedAnswers[level].get(q.answer) || 0;
    if (answerUses >= MAX_NUMBER_USES) return false;

    const counts = new Map();
    for (const n of extractNumbers(q.text)) {
      const next = (counts.get(n) || 0) + 1;
      if (next > MAX_NUMBER_USES) return false;
      if ((numberCounts[level].get(n) || 0) + next > MAX_NUMBER_USES) return false;
      counts.set(n, next);
    }
    return true;
  }

  function remember(level, q) {
    usedAnswers[level].set(q.answer, (usedAnswers[level].get(q.answer) || 0) + 1);
    extractNumbers(q.text).forEach((n) => {
      numberCounts[level].set(n, (numberCounts[level].get(n) || 0) + 1);
    });
  }

  function generate(difficulty) {
    const level = TIER_GENS[difficulty] ? difficulty : "easy";
    const gens = TIER_GENS[level];

    // Search aggressively for a question whose every numeric value is new.
    // Never reset the used-number pool just because generation is difficult.
    for (let tries = 0; tries < 500; tries++) {
      const candidate = Utils.pick(gens)();
      const nums = extractNumbers(candidate.text);
      if (
        nums.every((n) => Number.isInteger(n) && n >= 1 && n <= MAX_NUMBER) &&
        canUseQuestion(level, candidate)
      ) {
        if (!candidate.spoken)
          candidate.spoken = candidate.text.replace(/\n/g, ". ").replace(/❓/g, "what number");
        remember(level, candidate);
        return candidate;
      }
    }

    // If this pool is exhausted, begin a fresh pool. The reset is explicit,
    // so no number can silently appear three times in one active pool.
    numberCounts[level].clear();
    usedAnswers[level].clear();
    return generate(level);
  }

  return { generate };
})();

const Encourage = (function () {
  const CORRECT = [
    "✅ Correct! Wonderful work!",
    "✅ Yes! You've got it!",
    "✅ Nicely done!",
    "✅ That's right — great thinking!",
    "✅ Super! On to the next one.",
  ];
  const TRY_AGAIN = [
    "🙂 Not quite yet. Take another look and think about what the question is asking.",
    "🌱 Good attempt. You can try the same question again.",
    "💭 Close thinking. Pause, reread the problem, and choose your next step.",
    "💪 Keep working on it. Your first answer does not have to be your final answer.",
  ];
  function correct() {
    return Utils.pick(CORRECT);
  }
  function tryAgain() {
    return Utils.pick(TRY_AGAIN);
  }
  return { correct, tryAgain };
})();
