# Math for All 🧮

A simple, friendly mathematics learning website designed to help children practise arithmetic through questions, reflection, and repeated attempts.

## 🌱 What is Math for All?

Math for All is a browser-based learning experience built with plain **HTML, CSS, and JavaScript**. The goal is not only to tell a child whether an answer is right or wrong, but to give them space to **think, try again, understand their mistake, and continue when they are ready**.

The project currently focuses on arithmetic practice with multiple difficulty levels, including a harder level built around contextual word problems.

## ✨ Features

- 🧮 Arithmetic practice with generated questions
- 🎚️ Multiple difficulty levels
- 🏆 Hard/Champion questions are heavily based on word problems
- 🔁 Retry the same question instead of being forced forward
- 💡 Contextual hints that encourage the child to reason about the problem
- 🧠 Step-by-step explanations when the learner wants help
- ➡️ Learner-controlled progression to the next question
- 🌱 Learning-focused mastery tracking based on recent understanding, not just score
- 🎲 Diverse generated answers with short-term repetition control
- 📊 Basic quiz statistics and scoring
- 📱 Responsive, lightweight interface
- 🚫 No framework or build system required

## 🌱 Mastery instead of just score

The Arithmetic Quiz includes a small mastery meter that looks at the learner's recent questions. A question answered correctly on the first attempt contributes fully; a question solved after retries still contributes to progress, while an unanswered question does not.

The meter is intentionally described as **practice mastery**, not a permanent judgement of ability. It is there to answer a more useful question than "What is my score?":

> **Am I becoming more confident with these problems?**

The indicator considers the most recent ten completed questions and shows a simple state: **Starting → Building → Growing → Strong**.

## 🧠 Learning-first quiz flow

The quiz is intentionally designed so that answering a question does **not** immediately move the learner to another one.

The intended loop is:

**Attempt → Feedback → Think → Hint / Try Again / Explanation → Decide when to continue**

A wrong answer is treated as part of the learning process. The learner can reread the question, ask for a hint, retry the same question, or see an explanation before choosing to move on.

A correct answer also does not force an immediate transition. The learner decides when they are ready for the next question.

## 📚 Hard / Champion Level

The hardest arithmetic level is deliberately **word-problem heavy**. Instead of relying mainly on isolated calculations, questions place arithmetic in familiar situations such as:

- Shopping and quantities
- Equal groups and multiplication
- Sharing equally and division
- Comparing quantities
- Money and repeated prices
- Fractions of a collection
- Perimeter and measurement
- Multi-step everyday situations

The purpose is to make the learner identify **what the problem is asking and which operation is appropriate**, rather than simply performing a calculation.

## 🗂️ Project Structure

```text
maths-for-all/
├── index.html
├── css/
│   ├── style.css
│   └── slabmath.css
└── js/
    ├── questions.js
    └── script.js
```

### Main files

| File | Purpose |
| --- | --- |
| `index.html` | Main application page and quiz interface |
| `css/style.css` | Main layout, components, responsive styling, and quiz controls |
| `css/slabmath.css` | Typography / visual styling |
| `js/questions.js` | Question generation, difficulty levels, quiz logic, feedback, hints, and explanations |
| `js/script.js` | General site behaviour and UI interactions |

## 🚀 Run locally

No installation or build step is required.

Clone the repository:

```bash
git clone https://github.com/04pranab/maths-for-all.git
cd maths-for-all
```

Then open `index.html` in a browser.

For a local development server, you can also use:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## 📦 Release

**Current release: `v2.0.0`**

This release is the stable educational-app baseline. Research data collection, authentication, database, and telemetry infrastructure are intentionally outside the v2 scope and are planned for v3.

## 🛠️ Technology

- HTML5
- CSS3
- Vanilla JavaScript
- No external framework required
- Client-side question generation

## 🎯 Design principles

Math for All is guided by a few simple principles:

1. **Learning before scoring**  
   A score should support learning, not replace it.

2. **Mistakes are information**  
   A wrong answer should create an opportunity to rethink the problem.

3. **Give the learner time**  
   The interface should not rush a child into the next question.

4. **Explain the reasoning**  
   When help is requested, the learner should see how the answer can be reached.

5. **Let the learner choose**  
   The child should have control over retrying, getting help, or continuing.

6. **Make arithmetic meaningful**  
   Word problems connect mathematical operations with situations a learner can understand.

## 🤝 Contributing

Suggestions, improvements, educational ideas, and bug reports are welcome.

When changing the quiz experience, keep the learning-first philosophy in mind: avoid unnecessary automation that removes the learner's opportunity to think.

## 🤝 Contributors & Acknowledgements

### Om Pranab Mohanty
Project creator and primary developer.

### ChatGPT (OpenAI)
Development assistant and contributing collaborator for parts of the project, including the learning-focused arithmetic quiz flow, word-problem design, interface refinements, documentation, and code review.

The project remains human-directed: educational decisions, project direction, and final changes are owned by the project creator.

## 📄 License

See the repository license file for the terms under which this project is distributed.

---

Built as an educational mathematics project by **Om Pranab Mohanty**, with development assistance from **ChatGPT (OpenAI)**.
