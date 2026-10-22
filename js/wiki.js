(() => {
  const input = document.getElementById("wiki-search-input");
  const cards = [...document.querySelectorAll(".wiki-card")];
  const picker = document.querySelector(".game-picker");
  const detail = document.getElementById("game-detail");
  const close = document.getElementById("game-detail-close");

  const games = {
    arithmetic: {
      title: "🧮 Arithmetic Quiz",
      summary: "A flexible place to practise number sense and core arithmetic, one question at a time.",
      how: "Read a question, work out an answer and use feedback to decide what to try next.",
      skills: ["Counting and number sense", "Addition, subtraction, multiplication and division", "Applying arithmetic to simple situations"],
      prompt: "Can you solve it another way? How did you know which operation to use?",
      note: "Helpful for short practice sessions. Encourage the learner to explain their thinking, not just chase speed."
    },
    racing: {
      title: "🏁 Math Racing",
      summary: "Arithmetic practice with the energy of a friendly race, focused on personal progress.",
      how: "Answer arithmetic questions as you move through the race and try to improve your own rhythm.",
      skills: ["Mental calculation", "Arithmetic fluency", "Attention and steady effort"],
      prompt: "Which question type felt easier this time? What could you practise next?",
      note: "Keep the emphasis on improving from your own starting point rather than comparing children."
    },
    sudoku: {
      title: "🔢 Sudoku Challenge",
      summary: "A logic puzzle where every placement should follow from clues and constraints.",
      how: "Choose a difficulty, inspect the empty cells and place numbers that fit the row, column and box rules.",
      skills: ["Pattern recognition", "Logical deduction", "Planning and persistence"],
      prompt: "Which numbers are impossible in this cell, and what clue helped you decide?",
      note: "A hint can be a useful nudge. Ask the learner to explain why a placement works."
    },
    "shape-fitting": {
      title: "🔷 Shape Fitting",
      summary: "A spatial puzzle about fitting pieces into a target arrangement.",
      how: "Inspect the available shapes, consider how they are oriented and try arrangements until the board fits.",
      skills: ["Shape recognition", "Rotation and orientation", "Spatial reasoning and decomposition"],
      prompt: "What changes if you rotate this piece? Could another piece fit the same space?",
      note: "Talking through a plan before moving a piece can help make spatial thinking visible."
    },
    slab: {
      title: "🧺 Slab Maths",
      summary: "A hands-on way to think about subtraction as a sequence of choices.",
      how: "Move number slabs into the basket and work toward bringing the target down to zero.",
      skills: ["Subtraction", "Breaking numbers into parts", "Planning and number relationships"],
      prompt: "Can you reach zero using a different combination of slabs?",
      note: "Invite the learner to compare two valid routes and explain which felt simpler."
    },
    architect: {
      title: "🏗️ Shape Architect",
      summary: "Build pictures from geometric pieces, combining mathematics with imagination.",
      how: "Choose a picture and arrange, rotate and combine shapes to recreate it.",
      skills: ["Geometry and spatial relationships", "Rotation and composition", "Planning, creativity and patience"],
      prompt: "Which shape helped you solve the trickiest part? What would happen if you rotated it?",
      note: "There may be more than one sensible route. Let the learner experiment before stepping in."
    },
    bakery: {
      title: "🥐 Fraction Bakery",
      summary: "A bakery-themed way to explore how parts combine to make a whole.",
      how: "Work through recipe-style orders and use visual portions to reason about fractions.",
      skills: ["Fractions and equal parts", "Part-whole relationships", "Comparing and combining portions"],
      prompt: "How many equal pieces make the whole? How could you show the same amount another way?",
      note: "Use the pictures to connect fraction symbols with quantities the learner can see."
    },
    "math-court": {
      title: "⚖️ Math Court",
      summary: "A story-driven courtroom investigation where mathematical claims must stand up to evidence.",
      how: "Call the case, inspect the source record, solve a mathematical exhibit, hear new evidence, cross-examine the reasoning and deliver a verdict.",
      skills: ["Arithmetic, ratios, geometry, data and logic across 100 cases", "Evidence interpretation and testing assumptions", "Explaining uncertainty, fairness and why a conclusion follows"],
      prompt: "What does the evidence prove? What remains uncertain? Which calculation or record supports your verdict?",
      note: "Ten chapters share a seven-stage courtroom structure. Cases are untimed, answers can be retried, and progress is kept on this device. The planned 8–12 minute pacing still needs learner testing."
    },
    "number-maze": {
      title: "🧩 Number Maze",
      summary: "A path puzzle that combines ordered numbered checkpoints with filling every open square exactly once.",
      how: "Start at checkpoint 1 and trace a single orthogonal route. Reach each later checkpoint in order, never revisit a square, and fill every open square before the final checkpoint.",
      skills: ["Spatial reasoning and path planning", "Sequencing and constraint-based deduction", "Perseverance, working memory and planning"],
      prompt: "Which square could close off a route if you leave it too late? What clue helps you know which checkpoint comes next?",
      note: "The game offers three guided starters, unlimited untimed attempts, Undo, Reset and hints. Generated boards are solver-checked for a unique complete route. Copyable puzzle codes reproduce the exact board, and progress stays on the current device."
    },
    shop: {
      title: "🍎 Little Shop",
      summary: "An open-ended fruit counter where customers keep arriving and the learner runs the shop.",
      how: "Fill the basket to match an order, make the bill, handle short or exact payment, and return change when needed.",
      skills: ["Counting items and quantities", "Addition and money totals", "Subtraction, payment and change"],
      prompt: "How much is still owed? If the customer pays extra, how can you return the right change?",
      note: "The money is simulated. The counter uses larger labels and a wide, responsive shelf for easier reading."
    }
  };

  function closeDetail() {
    if (detail) detail.hidden = true;
    picker?.querySelectorAll(".game-choice").forEach(button => button.setAttribute("aria-expanded", "false"));
  }

  picker?.addEventListener("click", event => {
    const button = event.target.closest(".game-choice");
    if (!button) return;
    const game = games[button.dataset.game];
    if (!game || !detail) return;

    picker.querySelectorAll(".game-choice").forEach(choice => {
      choice.setAttribute("aria-expanded", String(choice === button));
    });
    document.getElementById("game-detail-title").textContent = game.title;
    document.getElementById("game-detail-summary").textContent = game.summary;
    document.getElementById("game-detail-how").textContent = game.how;
    document.getElementById("game-detail-prompt").textContent = game.prompt;
    document.getElementById("game-detail-note").textContent = game.note;

    const skills = document.getElementById("game-detail-skills");
    skills.replaceChildren(...game.skills.map(skill => {
      const item = document.createElement("li");
      item.textContent = skill;
      return item;
    }));

    detail.hidden = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    detail.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  });

  close?.addEventListener("click", closeDetail);

  if (input) {
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      cards.forEach(card => {
        const text = ((card.dataset.search || "") + " " + card.textContent).toLowerCase();
        card.classList.toggle("wiki-hidden", Boolean(query && !text.includes(query)));
      });
    });
  }
})();
