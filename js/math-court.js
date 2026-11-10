/* ===== Bundled from js/math-court-data.js ===== */
/* Math Court's 100-case season. Data-only module, safe to load in browser or Node. */
(function (root) {
  "use strict";
  const cases = [
    {
      id: 1,
      chapter: 1,
      title: "The Festival's Full Count",
      story:
        "The festival's craft team received 52 crates in two carts. They carefully recorded 37 crates from the first cart and are using the second cart's tally to complete the picture.",
      claim: "The early tally leaves 15 crates for the second cart's record.",
      prompt: "How many crates had not yet been recorded as unloaded?",
      options: ["15", "25", "89"],
      answer: 0,
      explanation:
        "52 − 37 = 15 crates were recorded on the second cart. The two tallies add to the full order of 52 crates.",
      twist:
        "Pip finds the second cart's neat manifest, recorded ten minutes later. Adding 37 and 15 completes the 52-crate order: each note captured a different moment.",
      moral: "Patience and careful checking help a community see the whole picture.",
      verdict: "disproved",
      check: "calculation",
      evidence:
        "Delivery order: 52 crates. First cart tally: 37 crates. Second cart record: 15 crates.",
      challenge: {
        prompt:
          "Use the two records to check the total shipment: 37 crates were unloaded first and 15 were on the later cart. How many crates were delivered altogether?",
        options: ["52 crates", "42 crates", "62 crates"],
        answer: 0,
        explanation: "37 + 15 = 52. The later manifest reconciles the shipment.",
      },
      virtue: "Perseverance",
      narrative:
        "A team of patient planners is preparing a shared celebration and wants the numbers to support a smooth day.\n\nThe festival's craft team received 52 crates in two carts. They carefully recorded 37 crates from the first cart and are using the second cart's tally to complete the picture.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Judge Mira",
      voice:
        "Before the festival begins, let’s count each cart carefully so every craft table gets what it needs.",
      opening:
        "At sunrise, Mira opens the festival courtyard; each craft stall is counting its supplies before the first guests arrive.",
    },
    {
      id: 2,
      chapter: 1,
      title: "The Banner of Two Totals",
      story: "A banner maker received two handwritten totals. One says 407; the other says 470.",
      claim: "The clerk claims the quantities differ by 73.",
      prompt: "What is the difference between 470 and 407?",
      options: ["53", "63", "73"],
      answer: 1,
      explanation: "470 − 407 = 63. Check the difference by adding it back: 407 + 63 = 470.",
      twist:
        "The original page shows the last digit of 407 was smudged, so arithmetic alone cannot tell which total was intended.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence: "Two copies read 407 and 470; the original is smudged.",
      challenge: {
        prompt: "Add the correct difference back to the smaller quantity. What should you get?",
        options: ["470", "460", "480"],
        answer: 0,
        explanation: "407 + 63 = 470, returning to the larger recorded quantity.",
      },
      virtue: "Perseverance",
      narrative:
        "Festival lanterns are warming the square, and Pip is helping neighbours get ready for a joyful gathering.\n\nA banner maker received two handwritten totals. One says 407; the other says 470.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Pip",
      voice:
        "That last digit changes the banner’s story. Let’s compare the totals and see how far apart they are.",
      opening:
        "Pip is preparing a bright banner for the town square and wants the number pattern to run neatly across the cloth.",
    },
    {
      id: 3,
      chapter: 1,
      title: "The Receipt Puzzle",
      story:
        "A receipt lists items costing ₹18, ₹12 and ₹12. The customer and maker compare item notes to check whether the final ₹12 line refers to a separate purchase.",
      claim: "The customer claims the corrected bill is ₹42.",
      prompt: "What is the bill after removing the duplicated ₹12 line?",
      options: ["₹30", "₹42", "₹24"],
      answer: 0,
      explanation:
        "₹18 + ₹12 = ₹30. Removing the duplicate line avoids charging twice for the same item.",
      twist:
        "The item notes match the two ₹12 lines to the same purchase. The customer and maker update the receipt together and confirm the total from the items actually supplied.",
      moral:
        "Honesty and care make shared records dependable. Clear details help everyone move forward with confidence.",
      verdict: "disproved",
      check: "records",
      evidence: "The item notes show that both ₹12 lines refer to the same purchase.",
      challenge: {
        prompt:
          "The corrected bill is ₹30 and the customer pays ₹50. How much change should be returned?",
        options: ["₹20", "₹18", "₹30"],
        answer: 0,
        explanation: "₹50 − ₹30 = ₹20 change.",
      },
      virtue: "Honesty",
      narrative:
        "The community hall is bright with ribbons; the helpers are checking little details so every guest feels welcome.\n\nA receipt lists items costing ₹18, ₹12 and ₹12. The customer and maker compare item notes to check whether the final ₹12 line refers to a separate purchase.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Asha",
      voice:
        "A clear receipt helps the customer and maker trust the same list. Let’s check each item together.",
      opening:
        "In the community hall, the maker and customer sit side by side to prepare a clear receipt everyone can trust.",
    },
    {
      id: 4,
      chapter: 1,
      title: "A Seat for Everyone",
      story:
        "Six rows of seats hold eight people each. A photograph shows every seat occupied, but a marshal counted people also standing near the entrance.",
      claim: "The marshal estimates 56 people were seated.",
      prompt: "How many people fit in six full rows of eight?",
      options: ["42", "48", "56"],
      answer: 1,
      explanation:
        "Six complete rows of eight seats give 6 × 8 = 48 seats. The nearby crowd is not part of the seating capacity.",
      twist: "The marshal included people outside the seating rows in the estimate.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence: "There are six rows and eight seats in every row.",
      challenge: {
        prompt: "If two more rows with eight seats each are added, how many seats will there be?",
        options: ["64 seats", "56 seats", "72 seats"],
        answer: 0,
        explanation: "Eight rows × eight seats = 64 seats.",
      },
      virtue: "Curiosity",
      narrative:
        "A team of patient planners is preparing a shared celebration and wants the numbers to support a smooth day.\n\nSix rows of seats hold eight people each. A photograph shows every seat occupied, but a marshal counted people also standing near the entrance.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Dot",
      voice: "Every seat matters. Let’s count the rows and make room for everyone who has a place.",
      opening:
        "The seating team is arranging a welcoming celebration, with a comfortable place planned for each guest.",
    },
    {
      id: 5,
      chapter: 1,
      title: "Seven Carts of Water Jars",
      story:
        "Six carts carry 12 full jars each. A seventh cart arrives with only six jars because it was loaded halfway.",
      claim: "The storekeeper claims the delivery contains 84 jars.",
      prompt: "How many jars arrived altogether?",
      options: ["72", "78", "84"],
      answer: 1,
      explanation: "6 × 12 + 6 = 78 jars.",
      twist: "The final cart was half full, so counting seven full carts overstates the delivery.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence: "Six carts have 12 jars each; the last cart has 6 jars.",
      challenge: {
        prompt:
          "How many jars are carried by the six full carts, not including the half-full final cart?",
        options: ["72 jars", "78 jars", "66 jars"],
        answer: 0,
        explanation: "Six full carts × 12 jars = 72 jars.",
      },
      virtue: "Perseverance",
      narrative:
        "Festival lanterns are warming the square, and Pip is helping neighbours get ready for a joyful gathering.\n\nSix carts carry 12 full jars each. A seventh cart arrives with only six jars because it was loaded halfway.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Judge Mira",
      voice:
        "Let’s honour the half-full cart as it is, then add all the jars to plan the water station.",
      opening:
        "The water-jug team is stocking tables for a warm festival afternoon and wants every cart counted fairly.",
    },
    {
      id: 6,
      chapter: 1,
      title: "The Coin Count",
      story:
        "Two ledger pages show 304 coins and 34 coins. The clerk invites the team to work out the difference, then compare when each total was recorded.",
      claim: "The clerk claims the difference is 280 coins.",
      prompt: "What is 304 − 34?",
      options: ["270", "280", "370"],
      answer: 0,
      explanation:
        "304 − 34 = 270 coins. The difference is 270, and the timestamps show why the pages do not describe the same moment.",
      twist:
        "The smaller total was recorded before the day's final deposit, so the pages describe different moments. The timeline helps the team understand both totals.",
      moral: "Clear, accurate records help everyone trust the picture and make decisions together.",
      verdict: "disproved",
      check: "records",
      evidence:
        "Ledger page A: 304 coins. Ledger page B: 34 coins. The pages were written at different times.",
      challenge: {
        prompt: "Check the subtraction using addition. What is 34 + 270?",
        options: ["304", "338", "270"],
        answer: 0,
        explanation: "34 + 270 = 304, confirming the subtraction.",
      },
      virtue: "Honesty",
      narrative:
        "The community hall is bright with ribbons; the helpers are checking little details so every guest feels welcome.\n\nTwo ledger pages show 304 coins and 34 coins. The clerk invites the team to work out the difference, then compare when each total was recorded.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Pip",
      voice:
        "These ledger pages may describe different moments. Let’s compare the numbers and the times.",
      opening:
        "Asha is helping the archive team line up daily records so the council can plan tomorrow's work with confidence.",
    },
    {
      id: 7,
      chapter: 1,
      title: "The Two-Gate Visitor Count",
      story:
        "There are 28 visitors at the north gate and 17 at the south. Five people appear on both lists because they passed through both gates.",
      claim: "The report states that 45 distinct visitors attended.",
      prompt: "How many distinct visitors are represented?",
      options: ["40", "45", "50"],
      answer: 0,
      explanation: "28 + 17 − 5 = 40 distinct visitors.",
      twist:
        "The same five visitors were counted at both gates. Both gate counts were accurate, but their sum was not a unique-person count.",
      moral: "Clear, accurate records help everyone trust the picture and make decisions together.",
      verdict: "disproved",
      check: "records",
      evidence: "North gate: 28. South gate: 17. Duplicates: 5.",
      challenge: {
        prompt:
          "If only three people appeared on both gate lists rather than five, how many distinct visitors would the lists represent?",
        options: ["42", "40", "45"],
        answer: 0,
        explanation: "28 + 17 − 3 = 42 distinct visitors.",
      },
      virtue: "Honesty",
      narrative:
        "A team of patient planners is preparing a shared celebration and wants the numbers to support a smooth day.\n\nThere are 28 visitors at the north gate and 17 at the south. Five people appear on both lists because they passed through both gates.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Asha",
      voice:
        "Several guests used both gates. Let’s count each person once so the welcome team can plan well.",
      opening:
        "The welcome team stands at both gates and wants to know how many different guests have arrived.",
    },
    {
      id: 8,
      chapter: 1,
      title: "The Helper's Number Check",
      story:
        "A helper subtracts 47 from 83 and writes 46. A second helper invites the group to check the result with addition.",
      claim: "The first helper says 83 − 47 = 46.",
      prompt: "What is the correct difference?",
      options: ["36", "46", "56"],
      answer: 0,
      explanation: "83 − 47 = 36. Check it by adding back: 36 + 47 = 83.",
      twist:
        "Adding 47 to 46 gives 93, so the inverse-operation check guides the team to 36. The helper uses the discovery to strengthen their next calculation.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence: "The answer should combine with 47 to return to 83.",
      challenge: {
        prompt: "Which sum checks the corrected answer to 83 − 47?",
        options: ["36 + 47 = 83", "46 + 47 = 83", "36 + 57 = 83"],
        answer: 0,
        explanation: "Adding the subtracted quantity back must recover the starting number.",
      },
      virtue: "Perseverance",
      narrative:
        "Festival lanterns are warming the square, and Pip is helping neighbours get ready for a joyful gathering.\n\nA helper subtracts 47 from 83 and writes 46. A second helper invites the group to check the result with addition.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Dot",
      voice:
        "Everyone learns by trying. Let’s use addition to check the helper’s subtraction together.",
      opening:
        "A young helper is practising subtraction, and the team turns the calculation into a shared discovery.",
    },
    {
      id: 9,
      chapter: 1,
      title: "The Mayor's Rounded Estimate",
      story:
        "A report rounds a visitor count to the nearest ten and records 80. The mayor treats 80 as an exact count.",
      claim: "The mayor claims exactly 80 people attended.",
      prompt: "Which exact counts round to 80 to the nearest ten?",
      options: ["70 to 79", "75 to 84", "85 to 94"],
      answer: 1,
      explanation:
        "Whole-number counts 75 through 84 round to 80 under standard nearest-ten rounding.",
      twist:
        "The original tally was recycled, so the exact count cannot be recovered from the rounded total alone.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "uncertain",
      check: "assumptions",
      evidence: "The only surviving record is rounded to the nearest ten.",
      challenge: {
        prompt: "Which count cannot round to 80 to the nearest ten?",
        options: ["74", "77", "82"],
        answer: 0,
        explanation: "74 rounds to 70; 77 and 82 round to 80.",
      },
      virtue: "Curiosity",
      narrative:
        "The community hall is bright with ribbons; the helpers are checking little details so every guest feels welcome.\n\nA report rounds a visitor count to the nearest ten and records 80. The mayor treats 80 as an exact count.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Judge Mira",
      voice: "A rounded total tells a range, not every detail. Let’s discover which counts fit.",
      opening:
        "The mayor is preparing a joyful parade report and wants the number to be both quick to read and mathematically clear.",
    },
    {
      id: 10,
      chapter: 1,
      title: "Candles for the Bell Tower",
      story: "The tower began with 120 candles, received 65 more and used 143 during the ceremony.",
      claim: "The keeper reports 52 candles remain.",
      prompt: "How many candles should remain?",
      options: ["32", "42", "52"],
      answer: 1,
      explanation: "120 + 65 − 143 = 42 candles.",
      twist: "The keeper accidentally used the opening stock twice when writing the note.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence: "Opening stock 120; delivery 65; used 143.",
      challenge: {
        prompt: "How many candles were available immediately before the ceremony?",
        options: ["185", "143", "42"],
        answer: 0,
        explanation: "120 opening candles + 65 delivered candles = 185 available.",
      },
      virtue: "Perseverance",
      narrative:
        "A team of patient planners is preparing a shared celebration and wants the numbers to support a smooth day.\n\nThe tower began with 120 candles, received 65 more and used 143 during the ceremony.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Pip",
      voice:
        "The tower lanterns made the evening glow. Let’s find what remains for tomorrow’s gathering.",
      opening:
        "The bell-tower crew is preparing a glowing evening ceremony and counting candles for the gathering.",
    },
    {
      id: 11,
      chapter: 2,
      title: "The Three-Digit Practice Lock",
      story:
        "The archive practice lock accepts a three-digit code divisible by three. The clerk suggests 425 because every digit is odd.",
      claim: "The clerk claims 425 fits the lock's rule.",
      prompt: "Which candidate is divisible by three?",
      options: ["425", "426", "427"],
      answer: 1,
      explanation:
        "4 + 2 + 6 = 12, which is divisible by three; therefore 426 is divisible by three.",
      twist: "The lock's rule concerns divisibility, not whether the digits are odd.",
      moral: "Precise words and definitions help us explain ideas so everyone can follow.",
      verdict: "disproved",
      check: "definition",
      evidence: "The code must be divisible by 3.",
      challenge: {
        prompt:
          "What is the digit sum of 425, the candidate that fails the divisibility-by-three test?",
        options: ["11", "12", "14"],
        answer: 0,
        explanation: "4 + 2 + 5 = 11, which is not divisible by three.",
      },
      virtue: "Clarity",
      narrative:
        "The archive's practice locks and number seals turn arithmetic into a friendly puzzle for the young apprentices.\n\nThe archive practice lock accepts a three-digit code divisible by three. The clerk suggests 425 because every digit is odd.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Asha",
      voice: "Let’s test the lock’s number rule, not just how the digits look.",
      opening:
        "The archive apprentices are trying a practice lock, where a simple number rule opens a new puzzle.",
    },
    {
      id: 12,
      chapter: 2,
      title: "The Prime Orchard",
      story:
        "A gardener labels 21 a prime number because it is odd. The court checks whether it has factors besides 1 and itself.",
      claim: "The gardener claims 21 is prime.",
      prompt: "Which number below is prime?",
      options: ["21", "23", "27"],
      answer: 1,
      explanation: "23 has no positive factors other than 1 and 23; 21 and 27 are composite.",
      twist: "The gardener checked only whether the number was even.",
      moral: "Precise words and definitions help us explain ideas so everyone can follow.",
      verdict: "disproved",
      check: "definition",
      evidence: "21 = 3 × 7 and 27 = 3 × 9.",
      challenge: {
        prompt: "Which factorisation explains why 21 is not prime?",
        options: ["3 × 7", "3 × 8", "2 × 11"],
        answer: 0,
        explanation: "21 = 3 × 7, so it has factors besides 1 and itself.",
      },
      virtue: "Clarity",
      narrative:
        "The bell-tower crew loves discovering rules and checking how a pattern grows.\n\nA gardener labels 21 a prime number because it is odd. The court checks whether it has factors besides 1 and itself.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Dot",
      voice: "Prime numbers follow a special rule. Let’s look for a divisor we can test together.",
      opening:
        "In the orchard, a gardener is arranging seed packets by their number properties before planting day.",
    },
    {
      id: 13,
      chapter: 2,
      title: "Lanterns for Four Teams",
      story:
        "Twenty-nine lanterns must be split among four equal teams. The organiser says no lantern will remain.",
      claim: "The organiser claims the split has no remainder.",
      prompt: "How many lanterns remain after giving each team seven?",
      options: ["0", "1", "3"],
      answer: 1,
      explanation: "4 × 7 = 28, leaving one lantern.",
      twist:
        "The rule requires whole lanterns and equal team sizes; the remainder cannot disappear.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence: "29 lanterns are split into four equal whole-number groups.",
      challenge: {
        prompt:
          "One more lantern arrives, making 30. If four teams receive equal whole-number shares, what is the result?",
        options: ["7 each, with 2 left", "8 each, with none left", "6 each, with 6 left"],
        answer: 0,
        explanation: "4 × 7 = 28, leaving two lanterns.",
      },
      virtue: "Perseverance",
      narrative:
        "In the Number Garden, every clue is a stepping stone; the learners compare patterns with curiosity.\n\nTwenty-nine lanterns must be split among four equal teams. The organiser says no lantern will remain.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Judge Mira",
      voice: "Every team deserves a fair share. Let’s see what happens to the final lantern.",
      opening:
        "The lantern crew is setting four bright tables for a shared celebration, hoping every team receives a fair bundle.",
    },
    {
      id: 14,
      chapter: 2,
      title: "The Fair-Team Challenge",
      story:
        "Groups of 24 and 36 volunteers must be divided into same-sized teams with no one left out.",
      claim: "A planner claims teams of 18 work for both groups.",
      prompt: "What is the largest possible team size that works for both groups?",
      options: ["6", "12", "18"],
      answer: 1,
      explanation: "The greatest common divisor of 24 and 36 is 12.",
      twist: "A size of 18 works only for the second group if the first group is ignored.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence: "Both 24 and 36 must be divisible by the team size.",
      challenge: {
        prompt: "If every team has 12 volunteers, how many teams can be formed from each group?",
        options: [
          "2 teams from 24 and 3 from 36",
          "3 teams from 24 and 2 from 36",
          "4 teams from 24 and 6 from 36",
        ],
        answer: 0,
        explanation: "24 ÷ 12 = 2 teams and 36 ÷ 12 = 3 teams.",
      },
      virtue: "Perseverance",
      narrative:
        "The archive's practice locks and number seals turn arithmetic into a friendly puzzle for the young apprentices.\n\nGroups of 24 and 36 volunteers must be divided into same-sized teams with no one left out.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Pip",
      voice:
        "We need a team size that works for both groups. Common factors can help everyone belong.",
      opening:
        "A volunteer coordinator wants teams of equal size so everyone can join an activity with friends.",
    },
    {
      id: 15,
      chapter: 2,
      title: "The Bell's Secret Rhythm",
      story:
        "A bell keeper records 4, 7, 10, 13. A witness predicts 17 because the values increase.",
      claim: "The witness claims the next value is 17.",
      prompt: "If the rule is to add three, what comes next?",
      options: ["15", "16", "17"],
      answer: 1,
      explanation:
        "The differences are 3, 3 and 3, so the next value under the stated pattern is 13 + 3 = 16, not 17.",
      twist: "The witness noticed direction but not the size of each change.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence: "The first four terms increase by three each time.",
      challenge: {
        prompt: "Following the same add-three rule, what is the tenth term of 4, 7, 10, 13, …?",
        options: ["31", "28", "34"],
        answer: 0,
        explanation: "The tenth term is 4 + 9 × 3 = 31.",
      },
      virtue: "Curiosity",
      narrative:
        "The bell-tower crew loves discovering rules and checking how a pattern grows.\n\nA bell keeper records 4, 7, 10, 13. A witness predicts 17 because the values increase.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Asha",
      voice:
        "The bell keeps a steady rhythm. Listen to the gap between each number and grow the pattern.",
      opening:
        "The bell keeper is tuning the festival rhythm and notices a sequence growing in steady steps.",
    },
    {
      id: 16,
      chapter: 2,
      title: "The Expanding Stone Path",
      story:
        "A path has a 4 by 4 grid of stones. A builder doubles both side lengths and claims the number of stones merely doubles.",
      claim: "The builder claims the new path needs 32 stones.",
      prompt: "How many stones are in the new 8 by 8 grid?",
      options: ["32", "48", "64"],
      answer: 2,
      explanation: "8 × 8 = 64, four times the original 16.",
      twist: "The new grid reveals how doubling both dimensions quadruples area.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence: "Original grid: 4 by 4. New grid: 8 by 8.",
      challenge: {
        prompt:
          "The original grid had 16 stones. How many additional stones does the 8 by 8 grid use?",
        options: ["48 more", "32 more", "64 more"],
        answer: 0,
        explanation: "64 − 16 = 48 additional stones.",
      },
      virtue: "Fairness",
      narrative:
        "In the Number Garden, every clue is a stepping stone; the learners compare patterns with curiosity.\n\nA path has a 4 by 4 grid of stones. A builder doubles both side lengths and claims the number of stones merely doubles.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Dot",
      voice:
        "A path that doubles in both directions grows in two dimensions. Let’s build and count it.",
      opening:
        "The paving team is extending a little stone path so more families can walk together through the garden.",
    },
    {
      id: 17,
      chapter: 2,
      title: "The Digit-Sum Seal",
      story:
        "An archive code must be divisible by three. Three candidates differ by only one digit.",
      claim: "The clerk claims 574 passes the divisibility test.",
      prompt: "Which candidate passes?",
      options: ["573", "574", "575"],
      answer: 0,
      explanation: "5 + 7 + 3 = 15, divisible by three. The other digit sums are 16 and 17.",
      twist:
        "A faded stamp made the last digit hard to read, but divisibility helps verify the candidate.",
      moral: "Precise words and definitions help us explain ideas so everyone can follow.",
      verdict: "disproved",
      check: "definition",
      evidence: "A number is divisible by 3 when its digit sum is divisible by 3.",
      challenge: {
        prompt: "Why does 574 fail the divisibility-by-three test?",
        options: ["Its digit sum is 16", "Its digit sum is 15", "Its digit sum is 17"],
        answer: 0,
        explanation: "5 + 7 + 4 = 16, not divisible by three.",
      },
      virtue: "Clarity",
      narrative:
        "The archive's practice locks and number seals turn arithmetic into a friendly puzzle for the young apprentices.\n\nAn archive code must be divisible by three. Three candidates differ by only one digit.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Judge Mira",
      voice: "The digit sum is a small clue hidden inside a whole number. Let’s uncover it.",
      opening:
        "At the archive desk, three possible codes are waiting to be tested against a simple divisibility rule.",
    },
    {
      id: 18,
      chapter: 2,
      title: "The Parade's Rounded Count",
      story:
        "A parade report records 340 visitors rounded to the nearest ten. A speaker announces that exactly 340 people attended.",
      claim: "The speaker claims 340 is exact.",
      prompt: "Which whole-number counts could round to 340?",
      options: ["330 to 339", "335 to 344", "345 to 354"],
      answer: 1,
      explanation: "Counts from 335 through 344 round to 340.",
      twist: "The counter recorded rounded estimates, not an exact total.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "partly",
      check: "assumptions",
      evidence: "The report was rounded to the nearest ten.",
      challenge: {
        prompt: "Which count would not round to 340 to the nearest ten?",
        options: ["334", "338", "344"],
        answer: 0,
        explanation: "334 rounds to 330; 338 and 344 round to 340.",
      },
      virtue: "Curiosity",
      narrative:
        "The bell-tower crew loves discovering rules and checking how a pattern grows.\n\nA parade report records 340 visitors rounded to the nearest ten. A speaker announces that exactly 340 people attended.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Pip",
      voice:
        "The parade was full of colour. A rounded report still leaves several exact counts possible.",
      opening:
        "The parade committee wants its attendance sign to be accurate as well as easy for visitors to read.",
    },
    {
      id: 19,
      chapter: 2,
      title: "Boats for Fifteen Friends",
      story:
        "Fifteen people need boats holding two people each. The organiser claims every boat can be full and everyone can travel.",
      claim: "The organiser claims seven boats are enough.",
      prompt: "What is the minimum number of boats needed?",
      options: ["7", "8", "9"],
      answer: 1,
      explanation: "Seven boats carry 14 people, so an eighth boat is needed.",
      twist: "The organiser omitted the possibility of one partly occupied boat.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence: "Each boat carries at most two people; a boat may carry one.",
      challenge: {
        prompt:
          "Eight two-person boats have how many seats total, and how many are unused if all 15 people board?",
        options: ["16 seats, 1 unused", "15 seats, none unused", "18 seats, 3 unused"],
        answer: 0,
        explanation: "Eight boats hold 16 people, leaving one seat empty.",
      },
      virtue: "Curiosity",
      narrative:
        "In the Number Garden, every clue is a stepping stone; the learners compare patterns with curiosity.\n\nFifteen people need boats holding two people each. The organiser claims every boat can be full and everyone can travel.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Asha",
      voice: "Let’s plan enough boats for every friend and make each seat count.",
      opening:
        "Fifteen friends are heading to the river picnic, and the boat guide wants each journey to feel safe and roomy.",
    },
    {
      id: 20,
      chapter: 2,
      title: "The Frozen Fountain's Temperature",
      story:
        "A thermometer reads −2°C before sunrise. By noon, the temperature rises by 5 degrees. A witness treats the rise as a negative change.",
      claim: "The witness claims the noon reading is −7°C.",
      prompt: "What is the noon temperature?",
      options: ["−7°C", "3°C", "7°C"],
      answer: 1,
      explanation:
        "The temperature starts at −2°C and rises by five degrees: −2 + 5 = 3°C. Moving right on the number line reaches 3.",
      twist: "The witness confused a negative starting value with a negative change.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence:
        "A thermometer reads −2°C before sunrise. By noon, the temperature rises by 5 degrees. A witness treats the rise as a negative change.",
      challenge: {
        prompt:
          "After noon, the temperature falls by another 4 degrees from 3°C. What is the new temperature?",
        options: ["−1°C", "1°C", "7°C"],
        answer: 0,
        explanation: "3 − 4 = −1°C. This confirms the stated relationship.",
      },
      virtue: "Perseverance",
      narrative:
        "The archive's practice locks and number seals turn arithmetic into a friendly puzzle for the young apprentices.\n\nA thermometer reads −2°C before sunrise. By noon, the temperature rises by 5 degrees. A witness treats the rise as a negative change.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Dot",
      voice:
        "The morning began below zero. Watch the thermometer climb as the sunlight warms the fountain.",
      opening:
        "At dawn, the fountain thermometer catches the first rays of sunlight and records the day's changing temperature.",
    },
    {
      id: 21,
      chapter: 3,
      title: "The Fair-Slice Puzzle",
      story:
        "Two identical pies are compared. One slice is 1/4 of a pie and another is 1/6. A witness says the sixth must be larger because six is larger than four.",
      claim: "The witness claims 1/6 is larger than 1/4.",
      prompt: "Which fraction is larger?",
      options: ["1/4", "1/6", "They are equal"],
      answer: 0,
      explanation: "A quarter is larger than a sixth when the wholes are equal.",
      twist: "Both pies are the same size, so comparing the denominators is meaningful here.",
      moral: "Precise words and definitions help us explain ideas so everyone can follow.",
      verdict: "disproved",
      check: "definition",
      evidence:
        "Two identical pies are compared. One slice is 1/4 of a pie and another is 1/6. A witness says the sixth must be larger because six is larger than four.",
      challenge: {
        prompt: "Which fraction with denominator 12 is equivalent to one quarter?",
        options: ["3/12", "2/12", "4/12"],
        answer: 0,
        explanation: "Multiplying numerator and denominator of 1/4 by 3 gives 3/12.",
      },
      virtue: "Clarity",
      narrative:
        "At the community kitchen, careful portions help every guest enjoy the shared feast.\n\nTwo identical pies are compared. One slice is 1/4 of a pie and another is 1/6. A witness says the sixth must be larger because six is larger than four.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Judge Mira",
      voice: "Let’s cut each pie into equal parts before comparing the slices.",
      opening:
        "The bakery team lays out two pies and invites the apprentices to compare the size of their slices.",
    },
    {
      id: 22,
      chapter: 3,
      title: "The Festival Punch Recipe",
      story:
        "One jug mixes 2 cups concentrate with 3 cups water. Another mixes 3 cups concentrate with 6 cups water. The second contains more liquid overall.",
      claim: "The organiser claims the second mixture is stronger.",
      prompt: "Which mixture has the stronger concentrate-to-water ratio?",
      options: ["First jug", "Second jug", "Same strength"],
      answer: 0,
      explanation:
        "The first ratio is 2:3; the second is 3:6 = 1:2. The first mixture has more concentrate per unit of water.",
      twist: "The larger jug is more diluted despite containing more liquid.",
      moral: "Compare ratios, not just totals.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "One jug mixes 2 cups concentrate with 3 cups water. Another mixes 3 cups concentrate with 6 cups water. The second contains more liquid overall.",
      challenge: {
        prompt:
          "To keep the first jug's 2:3 concentrate-to-water ratio, how much concentrate is needed with 6 cups of water?",
        options: ["4 cups", "3 cups", "2 cups"],
        answer: 0,
        explanation: "Doubling the water from 3 to 6 cups doubles concentrate from 2 to 4 cups.",
      },
      virtue: "Fairness",
      narrative:
        "The market team is comparing measures and prices so families can make confident choices.\n\nOne jug mixes 2 cups concentrate with 3 cups water. Another mixes 3 cups concentrate with 6 cups water. The second contains more liquid overall.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Pip",
      voice: "More liquid does not always mean a stronger recipe. Let’s compare the ratios.",
      opening:
        "The festival kitchen is mixing refreshing drinks, hoping to make the same balanced flavour in every jug.",
    },
    {
      id: 23,
      chapter: 3,
      title: "The Meter's Extra Decimal",
      story:
        "Two measuring devices show 2.4 m and 2.40 m. The measurement team wants to understand why the displays look different and what each one communicates.",
      claim: "The team wonders whether 2.40 m represents a longer object than 2.4 m.",
      prompt: "Which statement correctly compares the two measurements?",
      options: ["2.40 m is longer", "They represent the same length", "2.4 m is twice as long"],
      answer: 1,
      explanation:
        "2.4 and 2.40 have the same numerical value, though they may communicate different precision.",
      twist:
        "A measuring guide explains that both displays represent the same numerical length, while the extra zero can communicate the precision of the recording.",
      moral:
        "Curiosity helps us look beyond appearances and understand what a measurement really tells us.",
      verdict: "disproved",
      check: "units",
      evidence:
        "Two devices show 2.4 m and 2.40 m. A clerk declares one must be longer because it has more digits.",
      challenge: {
        prompt: "How many centimetres are in 2.4 metres?",
        options: ["240 cm", "24 cm", "204 cm"],
        answer: 0,
        explanation: "2.4 × 100 = 240 cm. This confirms the stated relationship.",
      },
      virtue: "Carefulness",
      narrative:
        "The recipe club is scaling its favourite dishes and learning how ratios keep flavours balanced.\n\nTwo measuring devices show 2.4 m and 2.40 m. The measurement team wants to understand why the displays look different and what each one communicates.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Asha",
      voice:
        "Both measurements describe the same path. Their displays tell us different things about precision.",
      opening:
        "The measuring team is mapping a garden path and comparing how two instruments describe the same length.",
    },
    {
      id: 24,
      chapter: 3,
      title: "The Twenty-Percent Poster",
      story:
        "A jacket costs ₹500. A sign says 20% off. The cashier reduces the price by ₹20 and says that is the promised saving.",
      claim: "The cashier claims the discounted price is ₹480.",
      prompt: "What is the discounted price?",
      options: ["₹400", "₹480", "₹420"],
      answer: 0,
      explanation: "20% of ₹500 is ₹100, so the discounted price is ₹400.",
      twist: "The cashier treated 20 percent as 20 rupees.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence:
        "A jacket costs ₹500. A sign says 20% off. The cashier reduces the price by ₹20 and says that is the promised saving.",
      challenge: {
        prompt: "Which fraction of the original ₹500 price is a 20% discount?",
        options: ["1/5", "1/4", "1/10"],
        answer: 0,
        explanation: "20% = 20/100 = 1/5. This confirms the stated relationship.",
      },
      virtue: "Perseverance",
      narrative:
        "At the community kitchen, careful portions help every guest enjoy the shared feast.\n\nA jacket costs ₹500. A sign says 20% off. The cashier reduces the price by ₹20 and says that is the promised saving.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Dot",
      voice: "A percentage is a part of the starting price. Let’s find the promised saving.",
      opening:
        "A market stall displays a discount poster, and the shopkeeper wants every family to understand the saving clearly.",
    },
    {
      id: 25,
      chapter: 3,
      title: "The Two Cake Wholes",
      story:
        "A quarter of a small cake is compared with a quarter of a large cake. The larger cake is twice the area of the smaller one.",
      claim: "A witness claims the two pieces are equal because both are quarters.",
      prompt: "Which statement is correct?",
      options: [
        "The pieces are equal",
        "The piece from the large cake is larger",
        "The piece from the small cake is larger",
      ],
      answer: 1,
      explanation:
        "The same fraction of a larger whole is larger; the large cake's quarter has twice the area.",
      twist: "Both witnesses used the word quarter but imagined different wholes.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "A quarter of a small cake is compared with a quarter of a large cake. The larger cake is twice the area of the smaller one.",
      challenge: {
        prompt:
          "If the small cake has area 80 cm² and the large cake has twice that area, how large is a quarter of the large cake?",
        options: ["40 cm²", "20 cm²", "80 cm²"],
        answer: 0,
        explanation: "The large cake has area 160 cm²; one quarter is 40 cm².",
      },
      virtue: "Fairness",
      narrative:
        "The market team is comparing measures and prices so families can make confident choices.\n\nA quarter of a small cake is compared with a quarter of a large cake. The larger cake is twice the area of the smaller one.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Judge Mira",
      voice:
        "A bigger whole can make an equally named fraction larger. Let’s compare the cakes fairly.",
      opening:
        "At the cake table, a small cake and a large cake are ready to be shared in equal fractions.",
    },
    {
      id: 26,
      chapter: 3,
      title: "The Recipe Scaling Studio",
      story:
        "A recipe for four people needs 200 g of rice. A cook prepares ten servings using 300 g.",
      claim: "The cook claims 300 g is enough to preserve the recipe.",
      prompt: "How much rice is needed for ten people at the same rate?",
      options: ["400 g", "500 g", "600 g"],
      answer: 1,
      explanation: "200 ÷ 4 = 50 g per person; 50 × 10 = 500 g.",
      twist: "The cook increased the batch without preserving its ratio.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "A recipe for four people needs 200 g of rice. A cook prepares ten servings using 300 g.",
      challenge: {
        prompt: "At the same rate of 50 g per person, how much rice is needed for 12 people?",
        options: ["600 g", "550 g", "650 g"],
        answer: 0,
        explanation: "50 × 12 = 600 g. This confirms the stated relationship.",
      },
      virtue: "Fairness",
      narrative:
        "The recipe club is scaling its favourite dishes and learning how ratios keep flavours balanced.\n\nA recipe for four people needs 200 g of rice. A cook prepares ten servings using 300 g.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Pip",
      voice: "A recipe can welcome more guests when every ingredient grows at the same rate.",
      opening:
        "The recipe club is preparing lunch for a larger group and wants every guest to receive the same generous portion.",
    },
    {
      id: 27,
      chapter: 3,
      title: "The Two-Batch Cost",
      story:
        "A batch costs ₹240 in ingredients plus a fixed ₹60 equipment fee per cooking session. Two batches are cooked in one session.",
      claim: "The clerk claims the total is ₹600.",
      prompt: "What is the cost for two batches and one fixed fee?",
      options: ["₹540", "₹600", "₹660"],
      answer: 0,
      explanation: "2 × ₹240 + ₹60 = ₹540.",
      twist: "The second batch does not require a second equipment fee in this arrangement.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence:
        "A batch costs ₹240 in ingredients plus a fixed ₹60 equipment fee per cooking session. Two batches are cooked in one session.",
      challenge: {
        prompt: "What would three batches cost if the same ₹60 equipment fee is charged once?",
        options: ["₹780", "₹900", "₹720"],
        answer: 0,
        explanation: "Three ingredient batches cost ₹720; adding one ₹60 fee gives ₹780.",
      },
      virtue: "Curiosity",
      narrative:
        "At the community kitchen, careful portions help every guest enjoy the shared feast.\n\nA batch costs ₹240 in ingredients plus a fixed ₹60 equipment fee per cooking session. Two batches are cooked in one session.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Asha",
      voice: "Let’s separate the one-time equipment fee from the cost of each batch.",
      opening:
        "The cooking team is preparing two batches together and needs to separate ingredients from a shared equipment fee.",
    },
    {
      id: 28,
      chapter: 3,
      title: "The Two-Discount Calculation",
      story:
        "A ₹1,000 item receives a 10% discount followed by another 10% off the reduced price. A seller says this equals 20% off the original price.",
      claim: "The seller claims the final price is ₹800.",
      prompt: "What is the final price after both discounts?",
      options: ["₹800", "₹810", "₹900"],
      answer: 1,
      explanation: "First ₹1,000 becomes ₹900; 10% of ₹900 is ₹90, leaving ₹810.",
      twist: "The second discount applies to ₹900, not the original ₹1,000.",
      moral: "Check the base amount each time a percentage is applied.",
      verdict: "disproved",
      check: "assumptions",
      evidence:
        "A ₹1,000 item receives a 10% discount followed by another 10% off the reduced price. A seller says this equals 20% off the original price.",
      challenge: {
        prompt:
          "How much more expensive is the successive-discount price than the price after one 20% discount?",
        options: ["₹10", "₹20", "₹90"],
        answer: 0,
        explanation: "Successive discounts leave ₹810; a single 20% discount leaves ₹800.",
      },
      virtue: "Curiosity",
      narrative:
        "The market team is comparing measures and prices so families can make confident choices.\n\nA ₹1,000 item receives a 10% discount followed by another 10% off the reduced price. A seller says this equals 20% off the original price.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Dot",
      voice: "The second discount uses a changed price. Let’s follow both steps in order.",
      opening:
        "A shopper is comparing a two-step discount with a single saving before choosing a useful gift.",
    },
    {
      id: 29,
      chapter: 3,
      title: "The T-Shirt Ratio",
      story:
        "Team A has 12 shirts for 8 players. Team B has 15 shirts for 12 players. A manager says B is better supplied because it has more shirts.",
      claim: "The manager claims Team B has more shirts per player.",
      prompt: "Which team has more shirts per player?",
      options: ["Team A", "Team B", "Same amount"],
      answer: 0,
      explanation: "A has 12 ÷ 8 = 1.5 per player; B has 15 ÷ 12 = 1.25.",
      twist: "The larger total belongs to a larger team.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "Team A has 12 shirts for 8 players. Team B has 15 shirts for 12 players. A manager says B is better supplied because it has more shirts.",
      challenge: {
        prompt:
          "How many shirts would a 12-player team need to match Team A's rate of 1.5 shirts per player?",
        options: ["18 shirts", "15 shirts", "20 shirts"],
        answer: 0,
        explanation: "12 × 1.5 = 18 shirts.",
      },
      virtue: "Fairness",
      narrative:
        "The recipe club is scaling its favourite dishes and learning how ratios keep flavours balanced.\n\nTeam A has 12 shirts for 8 players. Team B has 15 shirts for 12 players. A manager says B is better supplied because it has more shirts.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Judge Mira",
      voice: "A team is well supplied when we consider each player, not only the pile of shirts.",
      opening:
        "The sports club is packing shirts for two teams and wants each player to have a comfortable fit.",
    },
    {
      id: 30,
      chapter: 3,
      title: "The Reservoir Agreement",
      story:
        "A supply of 120 litres is divided in ratio 2:3 between two neighbourhood tanks. A proposal assigns 60 L and 90 L.",
      claim: "The proposal claims to fit within the available 120-litre supply.",
      prompt: "How much should the first tank receive?",
      options: ["40 L", "48 L", "60 L"],
      answer: 1,
      explanation: "There are five parts: 120 ÷ 5 = 24 L per part; the first gets 48 L.",
      twist: "The proposal totals 150 L, more than the available supply.",
      moral:
        "Creative thinking finds a good solution while respecting real limits and people's needs.",
      verdict: "disproved",
      check: "constraints",
      evidence:
        "A supply of 120 litres is divided in ratio 2:3 between two neighbourhood tanks. A proposal assigns 60 L and 90 L.",
      challenge: {
        prompt: "If 120 litres are split in ratio 2:3, how much should the second tank receive?",
        options: ["72 L", "48 L", "60 L"],
        answer: 0,
        explanation: "The second tank receives 3/5 × 120 = 72 L.",
      },
      virtue: "Creativity",
      narrative:
        "At the community kitchen, careful portions help every guest enjoy the shared feast.\n\nA supply of 120 litres is divided in ratio 2:3 between two neighbourhood tanks. A proposal assigns 60 L and 90 L.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Pip",
      voice: "Both neighbourhood tanks matter. Let’s share the full supply using the agreed ratio.",
      opening:
        "Two neighbourhoods are planning garden watering, and they agree to share a supply in a chosen ratio.",
    },
    {
      id: 31,
      chapter: 4,
      title: "The Fence Around the Garden",
      story:
        "A 3 m by 8 m plot and a 4 m by 6 m plot both have area 24 m². A builder says they need equal lengths of fence.",
      claim: "The builder claims the 3 m by 8 m perimeter is 20 m.",
      prompt: "What is the perimeter of the 3 m by 8 m plot?",
      options: ["11 m", "22 m", "24 m"],
      answer: 1,
      explanation: "Perimeter is 2(3 + 8) = 22 m; the other plot has perimeter 20 m.",
      twist: "Equal area does not imply equal boundary length.",
      moral: "Precise words and definitions help us explain ideas so everyone can follow.",
      verdict: "disproved",
      check: "definition",
      evidence:
        "A 3 m by 8 m plot and a 4 m by 6 m plot both have area 24 m². A builder says they need equal lengths of fence.",
      challenge: {
        prompt:
          "If the 3 m by 8 m plot needs 22 m of fencing and the 4 m by 6 m plot needs 20 m, how much more does the first need?",
        options: ["2 m", "4 m", "6 m"],
        answer: 0,
        explanation: "22 − 20 = 2 m. This confirms the stated relationship.",
      },
      virtue: "Clarity",
      narrative:
        "The builders spread their plan across a bright table, ready to test each measurement.\n\nA 3 m by 8 m plot and a 4 m by 6 m plot both have area 24 m². A builder says they need equal lengths of fence.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Asha",
      voice: "Equal garden areas can still have different boundaries. Let’s walk around the edges.",
      opening:
        "The garden builders are drawing two equally sized plots and estimating the fence needed for each one.",
    },
    {
      id: 32,
      chapter: 4,
      title: "The Compass Sign",
      story:
        "A sign faces east. A worker turns it clockwise a quarter-turn, then claims it faces north.",
      claim: "The worker claims the sign faces north.",
      prompt: "Where does it face?",
      options: ["North", "South", "West"],
      answer: 1,
      explanation: "A clockwise quarter-turn from east points south.",
      twist: "The worker imagined a counterclockwise turn while saying clockwise.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence:
        "A sign faces east. A worker turns it clockwise a quarter-turn, then claims it faces north.",
      challenge: {
        prompt:
          "After facing south, a sign is turned clockwise by another quarter-turn. Which way does it face?",
        options: ["West", "East", "North"],
        answer: 0,
        explanation: "A clockwise quarter-turn from south points west.",
      },
      virtue: "Curiosity",
      narrative:
        "The town makers are sketching places where people can gather, travel and explore.\n\nA sign faces east. A worker turns it clockwise a quarter-turn, then claims it faces north.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Dot",
      voice: "The compass turns one quarter at a time. Let’s follow the arrow together.",
      opening:
        "The sign painter is setting up a compass rose so festival visitors can find the activity tents.",
    },
    {
      id: 33,
      chapter: 4,
      title: "The Tower and Its Shadow",
      story:
        "A 2 m pole casts a 3 m shadow. At the same moment, a tower casts a 24 m shadow on level ground.",
      claim: "A witness estimates the tower is 18 m tall.",
      prompt: "What height follows from the similar-triangle model?",
      options: ["12 m", "16 m", "18 m"],
      answer: 1,
      explanation: "The height-to-shadow ratio is 2:3. Tower height is 24 × 2 ÷ 3 = 16 m.",
      twist:
        "A second shadow was measured later after the sun angle changed, so only the simultaneous measurement fits the model.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence: "Pole: 2 m tall, 3 m shadow. Tower shadow: 24 m at the same time.",
      challenge: {
        prompt:
          "The pole-to-shadow ratio is 2:3. If the tower shadow is 30 m at the same time, how tall is the tower?",
        options: ["20 m", "18 m", "22 m"],
        answer: 0,
        explanation: "Tower height = 30 × 2/3 = 20 m.",
      },
      virtue: "Curiosity",
      narrative:
        "A group of young designers is using shapes and measurements to make the town easier to navigate.\n\nA 2 m pole casts a 3 m shadow. At the same moment, a tower casts a 24 m shadow on level ground.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Judge Mira",
      voice:
        "The pole and tower share the same sunlight. Similar triangles can reveal the tower’s height.",
      opening:
        "The tower crew compares a pole and its shadow to plan a safe and well-lit gathering place.",
    },
    {
      id: 34,
      chapter: 4,
      title: "The Mosaic Symmetry Puzzle",
      story:
        "A mosaic outline is symmetrical, but its left half contains three blue tiles while the reflected right half has two.",
      claim: "The artist claims the full design has reflection symmetry.",
      prompt: "What must be true for reflection symmetry?",
      options: [
        "Only the outside border must match",
        "Every part must match its reflected position",
        "Both sides only need equal area",
      ],
      answer: 1,
      explanation: "Reflection symmetry requires corresponding parts on both sides to match.",
      twist: "The outline was mirrored, but an inner tile was changed later.",
      moral: "Precise words and definitions help us explain ideas so everyone can follow.",
      verdict: "disproved",
      check: "definition",
      evidence:
        "A mosaic outline is symmetrical, but its left half contains three blue tiles while the reflected right half has two.",
      challenge: {
        prompt:
          "The outline is symmetrical but one inside tile differs. What would make the whole mosaic symmetrical?",
        options: [
          "Every tile must match its reflected position",
          "Only the outer border must match",
          "Both sides only need equal area",
        ],
        answer: 0,
        explanation: "Reflection symmetry applies to all corresponding parts.",
      },
      virtue: "Clarity",
      narrative:
        "The builders spread their plan across a bright table, ready to test each measurement.\n\nA mosaic outline is symmetrical, but its left half contains three blue tiles while the reflected right half has two.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Pip",
      voice:
        "A mirror line reflects every tile, not only the outline. Let’s check each matching place.",
      opening:
        "The mosaic artists are finishing a mirror-patterned wall that will welcome visitors into the library.",
    },
    {
      id: 35,
      chapter: 4,
      title: "The Wheel's Rotation",
      story:
        "A wheel mark starts at the top, turns half a turn and then another quarter-turn clockwise. The witness reports only the first turn.",
      claim: "The witness claims the mark ends at the bottom.",
      prompt: "Where does the mark end?",
      options: ["Top", "Right", "Left"],
      answer: 2,
      explanation:
        "Half-turn moves top to bottom; the next clockwise quarter-turn moves bottom to the left.",
      twist: "The report omitted the extra quarter-turn.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence:
        "A wheel mark starts at the top, turns half a turn and then another quarter-turn clockwise. The witness reports only the first turn.",
      challenge: {
        prompt:
          "A wheel mark reaches the left side after its turns. One more clockwise quarter-turn takes it where?",
        options: ["Bottom", "Top", "Right"],
        answer: 0,
        explanation: "From the left side, a clockwise quarter-turn moves the mark to the bottom.",
      },
      virtue: "Curiosity",
      narrative:
        "The town makers are sketching places where people can gather, travel and explore.\n\nA wheel mark starts at the top, turns half a turn and then another quarter-turn clockwise. The witness reports only the first turn.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Asha",
      voice: "Let’s follow the wheel mark through both turns, not stop halfway.",
      opening: "A toy maker turns a wheel to mark the direction for a small mechanical exhibit.",
    },
    {
      id: 36,
      chapter: 4,
      title: "The Neighbourhood Map",
      story:
        "The library is at coordinate (3, 7). A courier swaps the coordinates and goes to (7, 3).",
      claim: "The courier claims the two coordinate pairs name the same location.",
      prompt: "How many coordinates remain in the same ordered position?",
      options: ["Neither", "One", "Both"],
      answer: 0,
      explanation:
        "Neither coordinate stays in the same position: the first changes from 3 to 7 and the second from 7 to 3.",
      twist: "The courier assumed an ordered pair can be rearranged without changing location.",
      moral: "Precise words and definitions help us explain ideas so everyone can follow.",
      verdict: "disproved",
      check: "definition",
      evidence: "Library: (3, 7); courier went to (7, 3).",
      challenge: {
        prompt: "To move from coordinate (3, 7) to (7, 3), which movement is needed?",
        options: [
          "4 units east and 4 south",
          "4 units west and 4 north",
          "3 units east and 7 south",
        ],
        answer: 0,
        explanation: "The x-coordinate increases by 4 and the y-coordinate decreases by 4.",
      },
      virtue: "Clarity",
      narrative:
        "A group of young designers is using shapes and measurements to make the town easier to navigate.\n\nThe library is at coordinate (3, 7). A courier swaps the coordinates and goes to (7, 3).\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Dot",
      voice:
        "Coordinates are an ordered pair. Swapping the places can send a courier to another part of town.",
      opening:
        "A courier is mapping the route between the library and the community hall using ordered coordinates.",
    },
    {
      id: 37,
      chapter: 4,
      title: "The Split Parcel",
      story:
        "A 10 m by 6 m parcel is divided into two equal 5 m by 6 m rectangles. A gardener claims each half has area 25 m².",
      claim: "The gardener claims each half is 25 m².",
      prompt: "What is the area of each half?",
      options: ["15 m²", "30 m²", "60 m²"],
      answer: 1,
      explanation: "Each half is 5 × 6 = 30 m².",
      twist: "The gardener used one dimension twice and omitted the other.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence:
        "A 10 m by 6 m parcel is divided into two equal 5 m by 6 m rectangles. A gardener claims each half has area 25 m².",
      challenge: {
        prompt:
          "The two equal halves are each 30 m². What is the original 10 m by 6 m parcel's area?",
        options: ["60 m²", "30 m²", "120 m²"],
        answer: 0,
        explanation: "The two 30 m² halves total 60 m², matching 10 × 6.",
      },
      virtue: "Perseverance",
      narrative:
        "The builders spread their plan across a bright table, ready to test each measurement.\n\nA 10 m by 6 m parcel is divided into two equal 5 m by 6 m rectangles. A gardener claims each half has area 25 m².\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Judge Mira",
      voice:
        "Each garden half comes from the full parcel. Let’s measure the area instead of guessing.",
      opening:
        "The parcel team is dividing a garden into two equal spaces for children to plant herbs.",
    },
    {
      id: 38,
      chapter: 4,
      title: "The Parcel in Three Dimensions",
      story:
        "A box's internal dimensions are 4 cm by 5 cm by 6 cm. A seller multiplies the dimensions correctly but calls the result square centimetres.",
      claim: "The seller claims the box volume is 120 cm².",
      prompt: "What is its correct volume and unit?",
      options: ["120 cm³", "120 cm²", "30 cm³"],
      answer: 0,
      explanation: "4 × 5 × 6 = 120 cubic centimetres. Volume is three-dimensional.",
      twist: "The number was correct but the unit was not.",
      moral: "Careful measurement respects every detail and helps our results be useful.",
      verdict: "partly",
      check: "units",
      evidence:
        "A box's internal dimensions are 4 cm by 5 cm by 6 cm. A seller multiplies the dimensions correctly but calls the result square centimetres.",
      challenge: {
        prompt:
          "If the box height doubles while its base stays 4 cm by 5 cm, what happens to its volume?",
        options: ["It doubles to 240 cm³", "It stays 120 cm³", "It halves to 60 cm³"],
        answer: 0,
        explanation: "Doubling height doubles the volume: 4 × 5 × 12 = 240 cm³.",
      },
      virtue: "Carefulness",
      narrative:
        "The town makers are sketching places where people can gather, travel and explore.\n\nA box's internal dimensions are 4 cm by 5 cm by 6 cm. A seller multiplies the dimensions correctly but calls the result square centimetres.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Pip",
      voice: "A box has length, width and height. The unit tells us what kind of measure we have.",
      opening:
        "A craft maker builds a box for a treasured keepsake and wants its volume labelled correctly.",
    },
    {
      id: 39,
      chapter: 4,
      title: "The Accessible Ramp",
      story:
        "A ramp rises 1 m over 5 m horizontal run. A new design rises 2 m over the same 5 m run.",
      claim: "The designer claims the slope is unchanged.",
      prompt: "What run preserves the original rise-to-run ratio for a 2 m rise?",
      options: ["5 m", "8 m", "10 m"],
      answer: 2,
      explanation: "The original ratio is 1:5. Doubling the rise requires a 10 m run.",
      twist: "The proposed layout halves neither rise nor ratio; it doubles steepness.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "A ramp rises 1 m over 5 m horizontal run. A new design rises 2 m over the same 5 m run.",
      challenge: {
        prompt:
          "If a ramp rises 1.5 m and keeps the original 1:5 rise-to-run ratio, what run is required?",
        options: ["7.5 m", "5 m", "10 m"],
        answer: 0,
        explanation: "The run is five times the rise: 1.5 × 5 = 7.5 m.",
      },
      virtue: "Fairness",
      narrative:
        "A group of young designers is using shapes and measurements to make the town easier to navigate.\n\nA ramp rises 1 m over 5 m horizontal run. A new design rises 2 m over the same 5 m run.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Asha",
      voice: "An accessible ramp needs a thoughtful slope and enough room for everyone to travel.",
      opening:
        "The accessibility team is designing a ramp so every visitor can reach the community garden comfortably.",
    },
    {
      id: 40,
      chapter: 4,
      title: "The Round Stage Design",
      story:
        "A circular stage has diameter 14 m. Using π ≈ 22/7, a builder says the distance around it is 14 m.",
      claim: "The builder claims the circumference is 14 m.",
      prompt: "What is the approximate circumference?",
      options: ["22 m", "44 m", "88 m"],
      answer: 1,
      explanation: "Circumference is πd ≈ (22/7) × 14 = 44 m.",
      twist: "The builder confused the diameter across the stage with the distance around it.",
      moral: "Choose the formula for the quantity being measured.",
      verdict: "disproved",
      check: "definition",
      evidence:
        "A circular stage has diameter 14 m. Using π ≈ 22/7, a builder says the distance around it is 14 m.",
      challenge: {
        prompt: "Using π ≈ 22/7, what is the circumference of a circle with diameter 7 m?",
        options: ["22 m", "44 m", "14 m"],
        answer: 0,
        explanation: "Circumference ≈ πd = (22/7) × 7 = 22 m.",
      },
      virtue: "Clarity",
      narrative:
        "The builders spread their plan across a bright table, ready to test each measurement.\n\nA circular stage has diameter 14 m. Using π ≈ 22/7, a builder says the distance around it is 14 m.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Dot",
      voice: "Let’s measure all the way around the circle using its diameter.",
      opening:
        "The festival builders are marking a circular stage and estimating the distance around its edge.",
    },
    {
      id: 41,
      chapter: 5,
      title: "The Timeline Puzzle",
      story: "A meeting begins at 10:45 and finishes at 12:15. A witness reports 70 minutes.",
      claim: "The witness claims the meeting lasted 70 minutes.",
      prompt: "How long did it last?",
      options: ["70 minutes", "90 minutes", "110 minutes"],
      answer: 1,
      explanation: "From 10:45 to 11:45 is 60 minutes, then 30 more minutes: 90 minutes.",
      twist: "The witness subtracted the minute digits without accounting for the hour boundary.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence: "A meeting begins at 10:45 and finishes at 12:15. A witness reports 70 minutes.",
      challenge: {
        prompt: "A meeting starts at 2:35 pm and lasts 90 minutes. When does it finish?",
        options: ["4:05 pm", "3:65 pm", "4:15 pm"],
        answer: 0,
        explanation: "Add 1 hour and then 30 minutes to get 4:05 pm.",
      },
      virtue: "Perseverance",
      narrative:
        "The transport crew studies distances and times to keep a busy community day flowing smoothly.\n\nA meeting begins at 10:45 and finishes at 12:15. A witness reports 70 minutes.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Judge Mira",
      voice: "The meeting spans two clock hours. Let’s trace each minute to the finish.",
      opening:
        "The schedule team is organising a long meeting so each speaker has enough time to contribute.",
    },
    {
      id: 42,
      chapter: 5,
      title: "The Bus Schedule",
      story:
        "A bus was scheduled for 9:20 and arrived at 9:32. The report says it was 20 minutes late.",
      claim: "The report claims a 20-minute delay.",
      prompt: "How many minutes late was the bus?",
      options: ["8 minutes", "12 minutes", "20 minutes"],
      answer: 1,
      explanation: "9:32 − 9:20 = 12 minutes.",
      twist: "The report compared the arrival with a time not listed on the schedule.",
      moral: "Clear, accurate records help everyone trust the picture and make decisions together.",
      verdict: "disproved",
      check: "records",
      evidence:
        "A bus was scheduled for 9:20 and arrived at 9:32. The report says it was 20 minutes late.",
      challenge: {
        prompt: "If the bus were scheduled for 9:20 and arrived at 9:40, how late would it be?",
        options: ["20 minutes", "12 minutes", "10 minutes"],
        answer: 0,
        explanation: "9:40 − 9:20 = 20 minutes.",
      },
      virtue: "Honesty",
      narrative:
        "A bell, a bus and a calendar all keep their own rhythm; the team wants to see how they fit together.\n\nA bus was scheduled for 9:20 and arrived at 9:32. The report says it was 20 minutes late.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Pip",
      voice: "A fair timetable uses the actual difference between the scheduled and arrival times.",
      opening:
        "The bus coordinator is checking arrival times to help students and families plan their journeys.",
    },
    {
      id: 43,
      chapter: 5,
      title: "The Hundred-Metre Measurement",
      story:
        "A path is recorded as 250 cm on one map and 2.5 m on another. A clerk declares the records disagree.",
      claim: "The clerk claims the lengths differ.",
      prompt: "Which statement is correct?",
      options: ["250 cm = 25 m", "250 cm = 2.5 m", "250 cm = 0.25 m"],
      answer: 1,
      explanation: "100 cm = 1 m, so 250 cm = 2.5 m.",
      twist: "The reports used different units but describe the same length.",
      moral: "Careful measurement respects every detail and helps our results be useful.",
      verdict: "disproved",
      check: "units",
      evidence:
        "A path is recorded as 250 cm on one map and 2.5 m on another. A clerk declares the records disagree.",
      challenge: {
        prompt: "Convert a length of 3.2 metres to centimetres?",
        options: ["320 cm", "32 cm", "302 cm"],
        answer: 0,
        explanation: "3.2 × 100 = 320 cm. This confirms the stated relationship.",
      },
      virtue: "Carefulness",
      narrative:
        "The day's journeys are being planned so teams can arrive on time and help one another.\n\nA path is recorded as 250 cm on one map and 2.5 m on another. A clerk declares the records disagree.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Asha",
      voice:
        "Centimetres and metres are two ways to describe the same path. Let’s connect the units.",
      opening:
        "The mapping team compares centimetres and metres while marking a path through the town garden.",
    },
    {
      id: 44,
      chapter: 5,
      title: "The Market Scale",
      story:
        "A basket with fruit weighs 3.2 kg; the empty basket weighs 0.4 kg. The seller charges for 3.2 kg of fruit.",
      claim: "The seller claims the fruit alone weighs 3.2 kg.",
      prompt: "What is the fruit's mass?",
      options: ["2.8 kg", "3.2 kg", "3.6 kg"],
      answer: 0,
      explanation:
        "The fruit alone weighs 3.2 − 0.4 = 2.8 kg. Remove the empty basket's mass before charging for the fruit.",
      twist: "The scale reading included the basket.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence:
        "A basket with fruit weighs 3.2 kg; the empty basket weighs 0.4 kg. The seller charges for 3.2 kg of fruit.",
      challenge: {
        prompt:
          "Five baskets each have 3.2 kg gross mass and 0.4 kg basket mass. What is the total fruit mass?",
        options: ["14 kg", "16 kg", "18 kg"],
        answer: 0,
        explanation: "Each basket contains 2.8 kg of fruit; 5 × 2.8 = 14 kg.",
      },
      virtue: "Curiosity",
      narrative:
        "The transport crew studies distances and times to keep a busy community day flowing smoothly.\n\nA basket with fruit weighs 3.2 kg; the empty basket weighs 0.4 kg. The seller charges for 3.2 kg of fruit.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Dot",
      voice: "The basket travels with the fruit, but only the fruit is being weighed for sale.",
      opening:
        "A market seller weighs a fruit basket and wants to show the fruit's own mass clearly.",
    },
    {
      id: 45,
      chapter: 5,
      title: "The Canal Flow Study",
      story:
        "Water flows at 12 L/min for five minutes, then slows to 6 L/min for five more minutes.",
      claim: "The keeper estimates 120 L entered during ten minutes.",
      prompt: "How much water entered?",
      options: ["60 L", "90 L", "120 L"],
      answer: 1,
      explanation: "First phase: 60 L. Second phase: 30 L. Total 90 L.",
      twist: "The report assumed the original rate stayed constant.",
      moral: "Model changing rates in separate intervals.",
      verdict: "disproved",
      check: "assumptions",
      evidence:
        "Water flows at 12 L/min for five minutes, then slows to 6 L/min for five more minutes.",
      challenge: {
        prompt:
          "A constant-rate estimate predicts 120 L, but the measured total is 90 L. By how much did the estimate overstate the flow?",
        options: ["30 L", "20 L", "12 L"],
        answer: 0,
        explanation: "120 − 90 = 30 L. This confirms the stated relationship.",
      },
      virtue: "Curiosity",
      narrative:
        "A bell, a bus and a calendar all keep their own rhythm; the team wants to see how they fit together.\n\nWater flows at 12 L/min for five minutes, then slows to 6 L/min for five more minutes.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Judge Mira",
      voice: "The canal’s flow changes midway. Let’s add the two parts of the journey.",
      opening:
        "The canal team observes a water flow that changes midway through a test, and records both parts.",
    },
    {
      id: 46,
      chapter: 5,
      title: "The Cyclists' Route Study",
      story:
        "Cyclist A travels 18 km in one hour. Cyclist B travels 24 km in two hours. A witness says B is faster because 24 is greater than 18.",
      claim: "The witness claims B has the higher average speed.",
      prompt: "Who has the greater average speed?",
      options: ["Cyclist A", "Cyclist B", "Equal speed"],
      answer: 0,
      explanation: "A travels at 18 km/h; B at 12 km/h.",
      twist: "The witness compared distance without considering time.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "Cyclist A travels 18 km in one hour. Cyclist B travels 24 km in two hours. A witness says B is faster because 24 is greater than 18.",
      challenge: {
        prompt: "If Cyclist A keeps 18 km/h for three hours, how far will A travel?",
        options: ["54 km", "36 km", "72 km"],
        answer: 0,
        explanation: "Distance = speed × time = 18 × 3 = 54 km.",
      },
      virtue: "Fairness",
      narrative:
        "The day's journeys are being planned so teams can arrive on time and help one another.\n\nCyclist A travels 18 km in one hour. Cyclist B travels 24 km in two hours. A witness says B is faster because 24 is greater than 18.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Pip",
      voice: "A longer journey is not always a faster one. Let’s compare distance per hour.",
      opening:
        "Two cyclists are preparing for a community ride and comparing how quickly each route can be travelled.",
    },
    {
      id: 47,
      chapter: 5,
      title: "The Fuel-Budget Route",
      story:
        "Route A is 60 km at ₹8 per km. Route B is 75 km at ₹6 per km. The planner chooses A because it is shorter.",
      claim: "The planner claims Route A costs less.",
      prompt: "Which route has the lower operating cost?",
      options: ["Route A at ₹480", "Route B at ₹450", "Both cost ₹500"],
      answer: 1,
      explanation: "A costs ₹480; B costs ₹450.",
      twist: "The longer route costs less because its rate per kilometre is lower.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "Route A is 60 km at ₹8 per km. Route B is 75 km at ₹6 per km. The planner chooses A because it is shorter.",
      challenge: {
        prompt: "If Route B costs ₹6 per kilometre, what will 80 km cost?",
        options: ["₹480", "₹450", "₹500"],
        answer: 0,
        explanation: "80 × ₹6 = ₹480. This confirms the stated relationship.",
      },
      virtue: "Fairness",
      narrative:
        "The transport crew studies distances and times to keep a busy community day flowing smoothly.\n\nRoute A is 60 km at ₹8 per km. Route B is 75 km at ₹6 per km. The planner chooses A because it is shorter.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Asha",
      voice: "A thoughtful route balances distance and cost, not distance alone.",
      opening:
        "The route planner is helping a delivery team choose a journey that uses its budget thoughtfully.",
    },
    {
      id: 48,
      chapter: 5,
      title: "The Leap-Year Calendar",
      story:
        "A task begins on 27 February in a leap year and lasts three days, counting the start as day one. The clerk records 1 March.",
      claim: "The clerk claims day three is 1 March.",
      prompt: "What is day three?",
      options: ["28 February", "29 February", "1 March"],
      answer: 1,
      explanation: "27 February is day one; 28 February is day two; 29 February is day three.",
      twist: "The clerk used a non-leap-year calendar.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence:
        "A task begins on 27 February in a leap year and lasts three days, counting the start as day one. The clerk records 1 March.",
      challenge: {
        prompt: "If 27 February in a leap year is day one, what is day four?",
        options: ["1 March", "2 March", "28 February"],
        answer: 0,
        explanation: "27, 28, 29 February are the first three days; 1 March is day four.",
      },
      virtue: "Curiosity",
      narrative:
        "A bell, a bus and a calendar all keep their own rhythm; the team wants to see how they fit together.\n\nA task begins on 27 February in a leap year and lasts three days, counting the start as day one. The clerk records 1 March.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Dot",
      voice: "The leap-year calendar has one extra day. Let’s count every date in order.",
      opening:
        "The calendar club is building a leap-year chart to help the community plan a three-day celebration.",
    },
    {
      id: 49,
      chapter: 5,
      title: "The Thermometer Readings",
      story:
        "One thermometer reads 21.4°C and another 21.6°C. Each has stated uncertainty of ±0.5°C.",
      claim: "A witness claims the first reading proves the room is colder.",
      prompt: "What is the strongest conclusion?",
      options: [
        "The first proves it is colder",
        "The second proves it is warmer",
        "The readings alone do not establish a reliable difference",
      ],
      answer: 2,
      explanation:
        "The uncertainty ranges overlap, so the small difference cannot establish a reliable temperature difference.",
      twist: "Repeated measurements under controlled conditions would provide better evidence.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "uncertain",
      check: "assumptions",
      evidence:
        "One thermometer reads 21.4°C and another 21.6°C. Each has stated uncertainty of ±0.5°C.",
      challenge: {
        prompt: "The uncertainty intervals are 20.9–21.9°C and 21.1–22.1°C. Do they overlap?",
        options: ["Yes, from 21.1°C to 21.9°C", "No, there is a gap", "Only at exactly 21.4°C"],
        answer: 0,
        explanation: "The intervals share values from 21.1°C through 21.9°C.",
      },
      virtue: "Curiosity",
      narrative:
        "The day's journeys are being planned so teams can arrive on time and help one another.\n\nOne thermometer reads 21.4°C and another 21.6°C. Each has stated uncertainty of ±0.5°C.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Judge Mira",
      voice:
        "Both thermometers have uncertainty. Their ranges help us compare the readings fairly.",
      opening:
        "The science booth compares two thermometers and shows visitors how measurement uncertainty works.",
    },
    {
      id: 50,
      chapter: 5,
      title: "When Will the Bells Ring Together?",
      story:
        "One bell rings every six minutes and another every eight minutes. Both ring at noon. The keeper predicts they next coincide after 14 minutes.",
      claim: "The keeper claims they next coincide after 14 minutes.",
      prompt: "How long until the bells next coincide?",
      options: ["12 minutes", "24 minutes", "48 minutes"],
      answer: 1,
      explanation: "The least common multiple of 6 and 8 is 24 minutes.",
      twist: "The keeper added the intervals rather than finding a common multiple.",
      moral: "Reason about repeating cycles, not sums of periods.",
      verdict: "disproved",
      check: "calculation",
      evidence:
        "One bell rings every six minutes and another every eight minutes. Both ring at noon. The keeper predicts they next coincide after 14 minutes.",
      challenge: {
        prompt:
          "If one bell rings every 6 minutes and another every 9 minutes, when do they first ring together again?",
        options: ["18 minutes", "24 minutes", "54 minutes"],
        answer: 0,
        explanation: "The least common multiple of 6 and 9 is 18.",
      },
      virtue: "Perseverance",
      narrative:
        "The transport crew studies distances and times to keep a busy community day flowing smoothly.\n\nOne bell rings every six minutes and another every eight minutes. Both ring at noon. The keeper predicts they next coincide after 14 minutes.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Pip",
      voice: "The bells share a rhythm. Let’s find the first moment both cycles meet again.",
      opening:
        "Two bells mark the market opening and the garden walk; their shared rhythm will help everyone meet together.",
    },
    {
      id: 51,
      chapter: 6,
      title: "The Garden Chart's Scale",
      story:
        "A garden chart records 100 visitors in May, 110 in June and 120 in July. Its vertical axis starts at 90 and makes the final bar look three times as tall.",
      claim: "The headline says visits tripled from May to July.",
      prompt: "What was the percentage increase from May to July?",
      options: ["20%", "50%", "200%"],
      answer: 0,
      explanation: "The increase is 20 visitors; relative to 100, this is 20%.",
      twist: "The data are real, but the truncated axis exaggerates the visible difference.",
      moral:
        "Describe data clearly and give readers the scale, context and calculation they need to interpret it.",
      verdict: "disproved",
      check: "representation",
      evidence: "May 100 visitors; June 110; July 120. Axis begins at 90.",
      challenge: {
        prompt:
          "A change from 100 visitors to 120 visitors is what fraction of the starting count?",
        options: ["1/5", "1/2", "2/1"],
        answer: 0,
        explanation: "The increase is 20 out of 100, which simplifies to 1/5.",
      },
      virtue: "Honest communication",
      narrative:
        "The community data garden gathers observations from many voices; the chart should help everyone see the pattern.\n\nA garden chart records 100 visitors in May, 110 in June and 120 in July. Its vertical axis starts at 90 and makes the final bar look three times as tall.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Asha",
      voice:
        "The chart tells a dramatic story. Let’s check its scale and calculate the actual change.",
      opening:
        "The garden chart is being prepared for a public display, and the team wants the graph to tell the story fairly.",
    },
    {
      id: 52,
      chapter: 6,
      title: "The Average and the Team",
      story:
        "Four teams score 6, 8, 10 and 12 points. The organiser says the mean proves each team scored 9.",
      claim: "The organiser claims each team scored 9.",
      prompt: "What is the mean score?",
      options: ["8", "9", "10"],
      answer: 1,
      explanation: "(6 + 8 + 10 + 12) ÷ 4 = 9; the mean does not say each team scored 9.",
      twist: "No team received 9 points, even though the mean is 9.",
      moral: "Precise words and definitions help us explain ideas so everyone can follow.",
      verdict: "partly",
      check: "definition",
      evidence:
        "Four teams score 6, 8, 10 and 12 points. The organiser says the mean proves each team scored 9.",
      challenge: {
        prompt: "What is the median of the scores 6, 8, 10 and 12?",
        options: ["9", "8", "10"],
        answer: 0,
        explanation: "For four ordered values, median = (8 + 10)/2 = 9.",
      },
      virtue: "Clarity",
      narrative:
        "The festival visitors are curious about what the numbers say, and the presenters want a fair, clear picture.\n\nFour teams score 6, 8, 10 and 12 points. The organiser says the mean proves each team scored 9.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Dot",
      voice:
        "The mean gives one summary. Let’s see what it can and cannot tell us about every team.",
      opening:
        "The games club compares four team scores and discusses what an average can tell the audience.",
    },
    {
      id: 53,
      chapter: 6,
      title: "The Median in the Garden",
      story:
        "Waiting times are 2, 3, 3, 4 and 18 minutes. A witness says a typical wait must be six minutes because that is the mean.",
      claim: "The witness claims the median is six minutes.",
      prompt: "What is the median?",
      options: ["3 minutes", "4 minutes", "6 minutes"],
      answer: 0,
      explanation: "The middle ordered value is 3 minutes; the long wait pulls the mean upward.",
      twist: "One unusually long wait belongs to an exceptional incident.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "Waiting times are 2, 3, 3, 4 and 18 minutes. A witness says a typical wait must be six minutes because that is the mean.",
      challenge: {
        prompt: "What is the mean of the waiting times 2, 3, 3, 4 and 18 minutes?",
        options: ["6 minutes", "3 minutes", "18 minutes"],
        answer: 0,
        explanation: "The sum is 30 minutes and 30 ÷ 5 = 6 minutes.",
      },
      virtue: "Fairness",
      narrative:
        "The data team gathers measurements carefully before explaining what they mean.\n\nWaiting times are 2, 3, 3, 4 and 18 minutes. A witness says a typical wait must be six minutes because that is the mean.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Judge Mira",
      voice: "A typical wait can be described in different ways. Let’s compare mean and median.",
      opening:
        "The garden volunteers record waiting times at the welcome table and choose a useful way to describe them.",
    },
    {
      id: 54,
      chapter: 6,
      title: "The School-Wide Survey",
      story:
        "A survey asks three friends from one club whether the whole school prefers football. All three say yes, and the organiser generalises to the whole school.",
      claim: "The organiser claims the school prefers football.",
      prompt: "What is the main weakness in the evidence?",
      options: [
        "The sample is small and not representative",
        "The answers cannot be used because they are numbers",
        "Three answers always prove a majority",
      ],
      answer: 0,
      explanation: "Three friends from one club cannot reliably represent the whole school.",
      twist: "The answers may be sincere, but the sample was selected from one group.",
      moral: "Listening to a range of voices helps a group understand the people it serves.",
      verdict: "insufficient",
      check: "sample",
      evidence:
        "A survey asks three friends from one club whether the whole school prefers football. All three say yes, and the organiser generalises to the whole school.",
      challenge: {
        prompt: "Which change would most improve the school-preference survey?",
        options: [
          "Randomly invite students from across the school",
          "Ask more friends from the same club",
          "Ask only the club leader",
        ],
        answer: 0,
        explanation: "A broader suitable sample is more likely to represent the school.",
      },
      virtue: "Inclusion",
      narrative:
        "The community data garden gathers observations from many voices; the chart should help everyone see the pattern.\n\nA survey asks three friends from one club whether the whole school prefers football. All three say yes, and the organiser generalises to the whole school.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Pip",
      voice: "To understand the whole school, let’s invite voices from across the school.",
      opening:
        "The student council wants to hear from the whole school before choosing a new game for activity day.",
    },
    {
      id: 55,
      chapter: 6,
      title: "The Summer Garden Mystery",
      story:
        "Ice-cream sales and swimming accidents both increase on hot days. A report claims ice cream causes the accidents.",
      claim: "The report claims ice cream causes accidents.",
      prompt: "What can the records alone establish?",
      options: [
        "Ice cream caused every accident",
        "The measures rose together, but causation is not established",
        "There is no relationship of any kind",
      ],
      answer: 1,
      explanation:
        "Both measures may be related to hot weather; co-movement alone does not prove cause.",
      twist: "Weather was not included in the comparison.",
      moral:
        "Open-minded thinkers consider more than one explanation before deciding what caused a result.",
      verdict: "insufficient",
      check: "causation",
      evidence:
        "Ice-cream sales and swimming accidents both increase on hot days. A report claims ice cream causes the accidents.",
      challenge: {
        prompt:
          "Which factor could help explain both higher ice-cream sales and more swimming accidents?",
        options: ["Hot weather", "The wrapper colour", "The pool's name"],
        answer: 0,
        explanation:
          "Hot weather could influence both; association alone does not establish direct causation.",
      },
      virtue: "Open-mindedness",
      narrative:
        "The festival visitors are curious about what the numbers say, and the presenters want a fair, clear picture.\n\nIce-cream sales and swimming accidents both increase on hot days. A report claims ice cream causes the accidents.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Asha",
      voice:
        "Hot weather can influence both events. Let’s keep a shared pattern separate from a cause.",
      opening:
        "The summer garden team notices several things flourish on hot days and wonders how the records relate.",
    },
    {
      id: 56,
      chapter: 6,
      title: "The Complete Data Table",
      story:
        "A table has entries 14, 18 and one unknown value; its row total is 50. The clerk suggests that the unknown value is 20.",
      claim: "The clerk claims the unknown value is 20.",
      prompt: "What is the unknown value?",
      options: ["18", "20", "22"],
      answer: 0,
      explanation:
        "50 − 14 − 18 = 18. The unknown value is 18, so the clerk's first suggestion can be refined using the total.",
      twist:
        "The team subtracts the known entries from the total. The remaining amount completes the row and shows how a total can guide us to an unknown.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence: "A table has entries 14, 18 and one unknown value; its row total is 50.",
      challenge: {
        prompt:
          "If the row total changes from 50 to 52 while the other entries remain 14 and 18, what is the unknown value?",
        options: ["20", "22", "18"],
        answer: 0,
        explanation: "52 − 14 − 18 = 20. The row total helps us work out the unknown.",
      },
      virtue: "Perseverance",
      narrative:
        "The data team gathers measurements carefully before explaining what they mean.\n\nA table has entries 14, 18 and one unknown value; its row total is 50. The clerk suggests that the unknown value is 20.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Dot",
      voice: "One value is waiting to be found. The row total gives us a useful clue.",
      opening:
        "A data helper has one value left to find in a complete table before the results can be shared.",
    },
    {
      id: 57,
      chapter: 6,
      title: "The Unusual Garden Reading",
      story:
        "Five measurements are 4, 5, 5, 6 and 30. A researcher wants to delete 30 because it looks unusual.",
      claim: "The researcher claims 30 should be removed automatically.",
      prompt: "What should happen first?",
      options: [
        "Delete 30 automatically",
        "Keep it and investigate whether it is valid",
        "Replace it with 6",
      ],
      answer: 1,
      explanation:
        "An unusual value should be checked for measurement or recording errors, not removed merely because it is inconvenient.",
      twist: "The value came from a second instrument and needs verification.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence:
        "Five measurements are 4, 5, 5, 6 and 30. A researcher wants to delete 30 because it looks unusual.",
      challenge: {
        prompt: "What is the mean of measurements 4, 5, 5, 6 and 30, including the unusual value?",
        options: ["10", "5", "30"],
        answer: 0,
        explanation:
          "The total is 50 and 50 ÷ 5 = 10. Investigate the outlier before excluding it.",
      },
      virtue: "Curiosity",
      narrative:
        "The community data garden gathers observations from many voices; the chart should help everyone see the pattern.\n\nFive measurements are 4, 5, 5, 6 and 30. A researcher wants to delete 30 because it looks unusual.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Judge Mira",
      voice:
        "An unusual reading invites investigation. Let’s understand it before deciding how to use it.",
      opening:
        "A researcher finds one unusually large garden reading and invites the group to learn what it may mean.",
    },
    {
      id: 58,
      chapter: 6,
      title: "The Best-Team Trophy",
      story:
        "Team A has 10 people averaging 8 points each. Team B has 30 people averaging 6 points. The organiser averages 8 and 6 equally.",
      claim: "The organiser claims the combined mean is 7.",
      prompt: "What is the combined mean across all 40 people?",
      options: ["6.5", "7", "7.5"],
      answer: 0,
      explanation: "Total points are 10×8 + 30×6 = 260; divide by 40 to get 6.5.",
      twist: "The groups differ in size, so their means cannot be weighted equally.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "Team A has 10 people averaging 8 points each. Team B has 30 people averaging 6 points. The organiser averages 8 and 6 equally.",
      challenge: {
        prompt:
          "If Team A and Team B had equal numbers of people, what would the simple average of means 8 and 6 be?",
        options: ["7", "6.5", "14"],
        answer: 0,
        explanation: "With equal group sizes, the combined mean is (8 + 6)/2 = 7.",
      },
      virtue: "Fairness",
      narrative:
        "The festival visitors are curious about what the numbers say, and the presenters want a fair, clear picture.\n\nTeam A has 10 people averaging 8 points each. Team B has 30 people averaging 6 points. The organiser averages 8 and 6 equally.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Pip",
      voice:
        "People count too: a group of thirty should contribute thirty scores to the combined mean.",
      opening:
        "The tournament organiser combines results from two teams of different sizes and wants every person's score included fairly.",
    },
    {
      id: 59,
      chapter: 6,
      title: "The Shop's Busy Hour",
      story:
        "Shop A serves 40 customers in two hours. Shop B serves 54 in three hours. A poster says B is faster because it served more people.",
      claim: "The poster claims Shop B serves customers faster.",
      prompt: "Which shop serves more customers per hour?",
      options: ["Shop A at 20 per hour", "Shop B at 18 per hour", "Both at 22 per hour"],
      answer: 0,
      explanation: "A serves 20 per hour; B serves 18 per hour.",
      twist: "Shop B was open longer, explaining its greater total.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "Shop A serves 40 customers in two hours. Shop B serves 54 in three hours. A poster says B is faster because it served more people.",
      challenge: {
        prompt:
          "If Shop A serves 20 customers per hour for three hours, how many customers does it serve?",
        options: ["60", "54", "40"],
        answer: 0,
        explanation: "20 customers per hour × 3 hours = 60 customers.",
      },
      virtue: "Fairness",
      narrative:
        "The data team gathers measurements carefully before explaining what they mean.\n\nShop A serves 40 customers in two hours. Shop B serves 54 in three hours. A poster says B is faster because it served more people.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Asha",
      voice: "Let’s compare how many customers each shop serves in one hour.",
      opening:
        "Two shops are planning service hours and comparing how many customers each can welcome in an hour.",
    },
    {
      id: 60,
      chapter: 6,
      title: "The Question That Shapes the Survey",
      story:
        "One survey asks whether people support a new park. Another asks whether they support an expensive park that raises fees. The results differ.",
      claim: "The organiser claims the two survey percentages can be compared directly.",
      prompt: "Can they be compared as if the question were identical?",
      options: [
        "Yes, wording never matters",
        "No, wording changes what respondents are answering",
        "Only the larger result is valid",
      ],
      answer: 1,
      explanation:
        "The wording frames the issue differently, so the surveys do not measure exactly the same prompt.",
      twist: "Both records are authentic, but the question wording differs.",
      moral: "Listening to a range of voices helps a group understand the people it serves.",
      verdict: "partly",
      check: "sample",
      evidence:
        "One survey asks whether people support a new park. Another asks whether they support an expensive park that raises fees. The results differ.",
      challenge: {
        prompt: "Which survey question is the most neutral?",
        options: [
          "Do you support building a park?",
          "Don't you agree the town deserves a park?",
          "Do you support an expensive park that raises fees?",
        ],
        answer: 0,
        explanation: "The first asks about support without embedding positive or negative framing.",
      },
      virtue: "Inclusion",
      narrative:
        "The community data garden gathers observations from many voices; the chart should help everyone see the pattern.\n\nOne survey asks whether people support a new park. Another asks whether they support an expensive park that raises fees. The results differ.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Dot",
      voice: "The wording of a question can shape an answer. Let’s compare the prompts fairly.",
      opening:
        "The community survey team is checking that question wording invites people to share their views freely.",
    },
    {
      id: 61,
      chapter: 7,
      title: "The Mystery Machine",
      story:
        "A machine maps 2 to 5, 3 to 7 and 4 to 9. A visitor claims the rule is add three because it fits the first input.",
      claim: "The visitor claims the rule is n + 3.",
      prompt: "Which rule fits all three observations?",
      options: ["2n + 1", "n + 3", "3n − 1"],
      answer: 0,
      explanation: "For n = 2, 3, 4, the rule 2n + 1 gives 5, 7, 9.",
      twist:
        "A fourth test input can distinguish this rule from other rules fitting fewer observations.",
      moral:
        "Thoughtful reasoning checks each step and makes sure a conclusion follows from its clues.",
      verdict: "disproved",
      check: "logic",
      evidence:
        "A machine maps 2 to 5, 3 to 7 and 4 to 9. A visitor claims the rule is add three because it fits the first input.",
      challenge: {
        prompt: "The machine follows n ↦ 2n + 1. What output should it produce for input 10?",
        options: ["21", "19", "20"],
        answer: 0,
        explanation: "2 × 10 + 1 = 21. This confirms the stated relationship.",
      },
      virtue: "Thoughtful reasoning",
      narrative:
        "The council's formula notebook holds patterns waiting to be tested with clear reasoning.\n\nA machine maps 2 to 5, 3 to 7 and 4 to 9. A visitor claims the rule is add three because it fits the first input.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Judge Mira",
      voice: "Three examples are clues to a rule. Let’s test one rule on all of them.",
      opening:
        "The puzzle club is testing a number machine and wants a rule that explains all its examples.",
    },
    {
      id: 62,
      chapter: 7,
      title: "The Ledger's Hidden Variable",
      story:
        "A venue charges a fixed ₹50 booking fee plus ₹20 per ticket. Three tickets total ₹110. A witness divides the total evenly and says each ticket costs ₹30.",
      claim: "The witness claims each ticket costs ₹30.",
      prompt: "What is the price per ticket?",
      options: ["₹20", "₹30", "₹50"],
      answer: 0,
      explanation: "₹110 − ₹50 = ₹60 for three tickets, so each costs ₹20.",
      twist:
        "The witness divided the whole total by the ticket count without removing the fixed fee.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence:
        "A venue charges a fixed ₹50 booking fee plus ₹20 per ticket. Three tickets total ₹110. A witness divides the total evenly and says each ticket costs ₹30.",
      challenge: {
        prompt:
          "The venue charges ₹50 fixed plus ₹20 per ticket. What is the cost for five tickets?",
        options: ["₹150", "₹100", "₹120"],
        answer: 0,
        explanation: "₹50 + 5 × ₹20 = ₹150.",
      },
      virtue: "Perseverance",
      narrative:
        "Inside the Inventors' Club, every rule machine is an invitation to experiment.\n\nA venue charges a fixed ₹50 booking fee plus ₹20 per ticket. Three tickets total ₹110. A witness divides the total evenly and says each ticket costs ₹30.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Pip",
      voice: "A fixed booking fee belongs to the total, while each ticket adds the same amount.",
      opening:
        "A venue manager needs to separate a one-time booking fee from the cost of each ticket.",
    },
    {
      id: 63,
      chapter: 7,
      title: "The Club's Budget Plan",
      story:
        "A club has ₹500. Each kit costs ₹70 and delivery has a one-time ₹80 fee. The organiser says seven kits fit.",
      claim: "The organiser claims seven kits fit the budget.",
      prompt: "What is the maximum number of kits?",
      options: ["5", "6", "7"],
      answer: 1,
      explanation:
        "After delivery, ₹420 remains. Six kits cost ₹420; seven plus delivery exceed ₹500.",
      twist: "The organiser forgot the fixed delivery fee.",
      moral:
        "Creative thinking finds a good solution while respecting real limits and people's needs.",
      verdict: "disproved",
      check: "constraints",
      evidence:
        "A club has ₹500. Each kit costs ₹70 and delivery has a one-time ₹80 fee. The organiser says seven kits fit.",
      challenge: {
        prompt:
          "The club spends ₹80 delivery plus six kits at ₹70 each from a ₹500 budget. How much budget remains?",
        options: ["₹0", "₹70", "₹80"],
        answer: 0,
        explanation: "₹80 + 6 × ₹70 = ₹500, so nothing remains.",
      },
      virtue: "Creativity",
      narrative:
        "The apprentice mathematicians love trying a rule, checking the result and sharing what they discover.\n\nA club has ₹500. Each kit costs ₹70 and delivery has a one-time ₹80 fee. The organiser says seven kits fit.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Asha",
      voice: "Every kit helps the club. Let’s see how many fit after delivery is paid.",
      opening:
        "The club is budgeting for learning kits and wants to invite as many members as its funds allow.",
    },
    {
      id: 64,
      chapter: 7,
      title: "The Two Contracts",
      story:
        "Contract A costs 10 + 4n; Contract B costs 2n + 18. They both cost 26 when n = 4. A clerk says they are equivalent.",
      claim: "The clerk claims the expressions are identical for every n.",
      prompt: "What is the best test?",
      options: [
        "One matching example proves equivalence",
        "Test another input, such as n = 1",
        "The letters make them equivalent",
      ],
      answer: 1,
      explanation:
        "At n = 1, A costs 14 and B costs 20, so they are not equivalent. The matching total at n = 4 is only one shared example.",
      twist: "The matching total at n = 3 was accidental.",
      moral:
        "Thoughtful reasoning checks each step and makes sure a conclusion follows from its clues.",
      verdict: "disproved",
      check: "logic",
      evidence:
        "Contract A costs 10 + 4n; Contract B costs 2n + 18. They both cost 22 when n = 3. A clerk says they are equivalent.",
      challenge: {
        prompt:
          "At n = 5, Contract A costs 10 + 4n and B costs 2n + 18. How much more does A cost?",
        options: ["₹2", "₹0", "₹4"],
        answer: 0,
        explanation: "A costs 30 and B costs 28, a difference of 2.",
      },
      virtue: "Thoughtful reasoning",
      narrative:
        "The council's formula notebook holds patterns waiting to be tested with clear reasoning.\n\nContract A costs 10 + 4n; Contract B costs 2n + 18. They both cost 26 when n = 4. A clerk says they are equivalent.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Dot",
      voice:
        "One shared total is a clue, not the whole story. Let’s test both contracts at another value.",
      opening:
        "Two suppliers offer different pricing rules, and the procurement team wants to compare them beyond a single order.",
    },
    {
      id: 65,
      chapter: 7,
      title: "The Infinite Staircase",
      story: "A sequence is 5, 9, 13, 17. The planner claims the 20th term is 80.",
      claim: "The planner claims the 20th term is 80.",
      prompt: "What is the 20th term if four is added each time?",
      options: ["77", "81", "85"],
      answer: 1,
      explanation: "The nth term is 5 + 4(n − 1); for n = 20 it is 81.",
      twist: "The planner used 20 additions after the first term instead of 19.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence: "A sequence is 5, 9, 13, 17. The planner claims the 20th term is 80.",
      challenge: {
        prompt: "What is the tenth term of 5, 9, 13, 17, …?",
        options: ["41", "40", "45"],
        answer: 0,
        explanation: "The tenth term is 5 + 9 × 4 = 41.",
      },
      virtue: "Perseverance",
      narrative:
        "Inside the Inventors' Club, every rule machine is an invitation to experiment.\n\nA sequence is 5, 9, 13, 17. The planner claims the 20th term is 80.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Judge Mira",
      voice: "Each stair adds the same amount. Let’s use the step number to reach the twentieth.",
      opening:
        "The staircase artist adds the same number of lights to every new step and explores the growing pattern.",
    },
    {
      id: 66,
      chapter: 7,
      title: "The Two-Code Lock",
      story:
        "A two-digit code has digits summing to 9. Its tens digit is one more than its units digit.",
      claim: "A clerk claims the code is 45.",
      prompt: "What code satisfies both clues?",
      options: ["45", "54", "63"],
      answer: 1,
      explanation:
        "The digits are 5 and 4, giving 54. They sum to 9 and the tens digit is one greater.",
      twist:
        "A third note saying the code is even contradicts the other clues, showing it belongs to another lock.",
      moral: "Check every clue against the proposed answer.",
      verdict: "disproved",
      check: "logic",
      evidence:
        "A two-digit code has digits summing to 9. Its tens digit is one more than its units digit.",
      challenge: {
        prompt: "For code 54, what is the product of its two digits?",
        options: ["20", "9", "1"],
        answer: 0,
        explanation: "5 × 4 = 20; the digit sum is 9.",
      },
      virtue: "Thoughtful reasoning",
      narrative:
        "The apprentice mathematicians love trying a rule, checking the result and sharing what they discover.\n\nA two-digit code has digits summing to 9. Its tens digit is one more than its units digit.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Pip",
      voice: "Two digit clues work together. Let’s find a code that satisfies both.",
      opening:
        "The archive has a two-digit practice code, and each clue narrows the possibilities.",
    },
    {
      id: 67,
      chapter: 7,
      title: "The Captain's Training Rule",
      story:
        "A community team uses this rule: every captain has completed training. The learners explore whether completing training also proves that someone is a captain.",
      claim: "A learner suggests that anyone who completed training must be a captain.",
      prompt: "Which conclusion goes beyond the training rule?",
      options: [
        "Confusing a statement with its converse",
        "Reversing the given implication",
        "Rounding too early",
      ],
      answer: 0,
      explanation:
        "The rule says that every captain has completed training. It does not say that every trained person is a captain.",
      twist:
        "The team checks other trained helpers. They can be well prepared and still have different roles, so the reverse statement needs its own evidence.",
      moral:
        "Thoughtful reasoning checks each step and makes sure a conclusion follows from its clues.",
      verdict: "disproved",
      check: "logic",
      evidence:
        "A rule says: if a person is captain, they must have completed safety training. A witness says anyone who completed training must be a captain.",
      challenge: {
        prompt:
          "The rule says a captain must have completed training. Which implication is guaranteed?",
        options: [
          "Captain means trained",
          "Trained means captain",
          "No captain completed training",
        ],
        answer: 0,
        explanation: "The rule only guarantees that every captain has completed training.",
      },
      virtue: "Thoughtful reasoning",
      narrative:
        "The council's formula notebook holds patterns waiting to be tested with clear reasoning.\n\nA community team uses this rule: every captain has completed training. The learners explore whether completing training also proves that someone is a captain.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Asha",
      voice:
        "A rule points one way: captain means trained. Let’s be careful before turning it around.",
      opening:
        "The community team uses a training rule and wants to understand exactly what it tells them.",
    },
    {
      id: 68,
      chapter: 7,
      title: "Three Statements and One Ledger",
      story:
        "Witness A says the ledger is correct. B says its total is 20 higher than recorded. C says A and B are both correct. The arithmetic confirms the ledger.",
      claim: "The witnesses claim all three statements can be true.",
      prompt: "Which conclusion follows?",
      options: [
        "A is consistent; B and C are not",
        "All three are consistent",
        "The ledger total differs from the recorded sum",
      ],
      answer: 0,
      explanation:
        "If the ledger is correct, B's claim is false, so C cannot have both A and B true.",
      twist: "The contradiction does not prove that any witness intended to mislead the court.",
      moral:
        "Thoughtful reasoning checks each step and makes sure a conclusion follows from its clues.",
      verdict: "disproved",
      check: "logic",
      evidence:
        "Witness A says the ledger is correct. B says its total is 20 higher than recorded. C says A and B are both correct. The arithmetic confirms the ledger.",
      challenge: {
        prompt:
          "With a correct ledger, A says it is correct, B says its total is 20 higher than recorded, and C says both are true. How many statements are true?",
        options: ["One", "Two", "Three"],
        answer: 0,
        explanation: "A is true; B and C are false because A and B cannot both be true.",
      },
      virtue: "Thoughtful reasoning",
      narrative:
        "Inside the Inventors' Club, every rule machine is an invitation to experiment.\n\nWitness A says the ledger is correct. B says its total is 20 higher than recorded. C says A and B are both correct. The arithmetic confirms the ledger.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Dot",
      voice:
        "Three statements share one ledger. Let’s see which ones can fit the arithmetic together.",
      opening:
        "Three colleagues read the same ledger aloud, and the group checks which statements fit the recorded totals.",
    },
    {
      id: 69,
      chapter: 7,
      title: "The Logic of Three Keys",
      story:
        "Keys A, B and C open rooms 1, 2 and 3, one each. A does not open room 1; B opens room 3. A witness says A opens room 3.",
      claim: "The witness claims A opens room 3.",
      prompt: "Which key opens room 1?",
      options: ["A", "B", "C"],
      answer: 2,
      explanation: "B opens room 3, so A must open room 2 and C room 1.",
      twist: "A confident witness ignored the one-key-per-room constraint.",
      moral:
        "Thoughtful reasoning checks each step and makes sure a conclusion follows from its clues.",
      verdict: "disproved",
      check: "logic",
      evidence:
        "Keys A, B and C open rooms 1, 2 and 3, one each. A does not open room 1; B opens room 3. A witness says A opens room 3.",
      challenge: {
        prompt: "B opens room 3 and A cannot open room 1. Does A open room 2?",
        options: ["Yes", "No", "The clues do not determine it"],
        answer: 0,
        explanation: "With one key per room, A must open room 2 and C room 1.",
      },
      virtue: "Thoughtful reasoning",
      narrative:
        "The apprentice mathematicians love trying a rule, checking the result and sharing what they discover.\n\nKeys A, B and C open rooms 1, 2 and 3, one each. A does not open room 1; B opens room 3. A witness says A opens room 3.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Judge Mira",
      voice: "Each key opens one room. We can let the clues narrow the possibilities.",
      opening:
        "The key keeper has three keys and three rooms; careful clues will reveal the matching pairs.",
    },
    {
      id: 70,
      chapter: 7,
      title: "The Partnership Equation",
      story:
        "Two notebooks and three pens cost ₹39. One notebook and one pen cost ₹15. Prices are fixed whole-rupee values.",
      claim: "A receipt copy labels the pen price as the notebook price.",
      prompt: "What is the price of one notebook?",
      options: ["₹6", "₹9", "₹12"],
      answer: 0,
      explanation:
        "Let n be the notebook price and p the pen price. n + p = 15 and 2n + 3p = 39. Doubling the first gives 2n + 2p = 30, so p = 9 and n = 6.",
      twist:
        "The team lines up each original item label beside its price. Solving the two equations reveals the price of each notebook and pen.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "supported",
      check: "calculation",
      evidence:
        "Two notebooks and three pens cost ₹39. One notebook and one pen cost ₹15. Prices are fixed whole-rupee values.",
      challenge: {
        prompt:
          "If one notebook costs ₹6 and one pen costs ₹9, what do three notebooks and two pens cost?",
        options: ["₹36", "₹39", "₹42"],
        answer: 0,
        explanation: "3 × ₹6 + 2 × ₹9 = ₹36.",
      },
      virtue: "Perseverance",
      narrative:
        "The council's formula notebook holds patterns waiting to be tested with clear reasoning.\n\nTwo notebooks and three pens cost ₹39. One notebook and one pen cost ₹15. Prices are fixed whole-rupee values.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Pip",
      voice:
        "The partnership has two prices hidden in the totals. Let’s build equations to reveal them.",
      opening:
        "A notebook maker and pen maker have a shared price board, and two purchases hold the clues to each item's price.",
    },
    {
      id: 71,
      chapter: 8,
      title: "The Election Scoreboard",
      story:
        "Candidates receive 42, 35 and 23 votes. The candidate with 42 wins under the most-votes rule. A speaker says the winner has support from most voters.",
      claim: "The speaker claims the winner received more than half the votes.",
      prompt: "What share of all 100 votes did the winner receive?",
      options: ["42%", "50%", "58%"],
      answer: 0,
      explanation:
        "The winner received 42 out of 100 votes, or 42%, which is less than half. Most-votes wins is not the same as receiving a majority.",
      twist: "The winner has more votes than either rival, but 58 voters chose someone else.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "Candidates receive 42, 35 and 23 votes. The candidate with 42 wins under the most-votes rule. A speaker says the winner has support from most voters.",
      challenge: {
        prompt:
          "The two losing candidates received 35 and 23 votes. What share of all 100 votes did they receive together?",
        options: ["58%", "42%", "77%"],
        answer: 0,
        explanation: "35 + 23 = 58 votes, or 58%.",
      },
      virtue: "Fairness",
      narrative:
        "At the festival, the helpers are dividing time, seats and supplies so the whole team can thrive.\n\nCandidates receive 42, 35 and 23 votes. The candidate with 42 wins under the most-votes rule. A speaker says the winner has support from most voters.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Asha",
      voice:
        "Winning by having the most votes differs from winning a majority. Let’s calculate the share.",
      opening:
        "The festival voting booth displays all candidate totals so visitors can understand how the outcome was reached.",
    },
    {
      id: 72,
      chapter: 8,
      title: "The Seats in the Assembly",
      story:
        "Two districts have populations 60,000 and 90,000 and share 10 seats proportionally. A clerk proposes 4 and 6 seats.",
      claim: "The clerk claims a 4-to-6 split matches the population ratio.",
      prompt: "How should the 10 seats be split in the exact 2:3 ratio?",
      options: ["4 and 6", "5 and 5", "3 and 7"],
      answer: 0,
      explanation: "There are five total parts; 10 seats split into 4 and 6.",
      twist: "Other population ratios can require a stated rounding method.",
      moral:
        "Creative thinking finds a good solution while respecting real limits and people's needs.",
      verdict: "supported",
      check: "constraints",
      evidence:
        "Two districts have populations 60,000 and 90,000 and share 10 seats proportionally. A clerk proposes 4 and 6 seats.",
      challenge: {
        prompt:
          "If the same 2:3 population ratio shares 15 seats, how many seats does each district receive?",
        options: ["6 and 9", "5 and 10", "4 and 11"],
        answer: 0,
        explanation: "There are five parts and each part is three seats, giving 6 and 9.",
      },
      virtue: "Creativity",
      narrative:
        "The neighbourhood council compares outcomes with open minds and a shared sense of fairness.\n\nTwo districts have populations 60,000 and 90,000 and share 10 seats proportionally. A clerk proposes 4 and 6 seats.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Dot",
      voice: "A fair seat plan follows the agreed population ratio. Let’s place all ten seats.",
      opening:
        "The assembly hall is arranging seats between two districts using a published population ratio.",
    },
    {
      id: 73,
      chapter: 8,
      title: "The Festival Scorecard",
      story:
        "A score is 60% skill and 40% teamwork. Team A scores 90 and 50; Team B scores 70 and 90 respectively.",
      claim: "The posted scorecard claims Team A wins.",
      prompt: "Which weighted score is higher?",
      options: ["Team A: 74", "Team B: 78", "They tie"],
      answer: 1,
      explanation: "A = 0.6×90 + 0.4×50 = 74; B = 0.6×70 + 0.4×90 = 78.",
      twist:
        "The posted card had accidentally changed teamwork to 20% without updating other weights.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence:
        "A score is 60% skill and 40% teamwork. Team A scores 90 and 50; Team B scores 70 and 90 respectively.",
      challenge: {
        prompt:
          "With weights changed to 40% skill and 60% teamwork, what score does Team B get from skill 70 and teamwork 90?",
        options: ["82", "78", "72"],
        answer: 0,
        explanation: "0.4 × 70 + 0.6 × 90 = 82.",
      },
      virtue: "Perseverance",
      narrative:
        "The community panel wants its plans to serve people fairly, with every need considered.\n\nA score is 60% skill and 40% teamwork. Team A scores 90 and 50; Team B scores 70 and 90 respectively.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Judge Mira",
      voice: "Skill and teamwork both count. Let’s apply each weight before comparing the teams.",
      opening:
        "The festival scorecard recognises both skill and teamwork, and the committee wants the weights applied openly.",
    },
    {
      id: 74,
      chapter: 8,
      title: "A Balanced Duty Roster",
      story:
        "Four people each work three shifts. One roster gives all three late shifts to the same person. The coordinator says the totals are equal, so the roster is fair.",
      claim: "The coordinator claims equal shift totals prove fairness.",
      prompt: "What else should the court examine?",
      options: [
        "Only the total number of shifts",
        "How difficult and when shifts are distributed",
        "Who volunteered first",
      ],
      answer: 1,
      explanation:
        "Equal totals can hide unequal burdens; timing and difficulty matter to this roster.",
      twist: "A second week shows the same person repeatedly receives late shifts.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "partly",
      check: "comparison",
      evidence:
        "Four people each work three shifts. One roster gives all three late shifts to the same person. The coordinator says the totals are equal, so the roster is fair.",
      challenge: {
        prompt:
          "Two rosters give each person three shifts, but one person gets all the late shifts. What should be compared next?",
        options: [
          "The distribution of late shifts over time",
          "Only total shift count",
          "Alphabetic order of names",
        ],
        answer: 0,
        explanation: "Equal totals can hide an uneven distribution of difficult shifts.",
      },
      virtue: "Fairness",
      narrative:
        "At the festival, the helpers are dividing time, seats and supplies so the whole team can thrive.\n\nFour people each work three shifts. One roster gives all three late shifts to the same person. The coordinator says the totals are equal, so the roster is fair.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Pip",
      voice: "Equal shift totals can hide uneven late duties. Let’s look at the complete schedule.",
      opening:
        "The duty coordinator is preparing a roster that shares late shifts thoughtfully across the whole team.",
    },
    {
      id: 75,
      chapter: 8,
      title: "The Round-Robin Festival",
      story:
        "Eight teams play a round-robin tournament where every pair meets once. The organiser schedules only eight matches.",
      claim: "The organiser claims eight teams need eight matches.",
      prompt: "How many matches are needed?",
      options: ["16", "28", "56"],
      answer: 1,
      explanation: "There are 8×7/2 = 28 unique pairs.",
      twist: "The organiser counted teams rather than pairings.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence:
        "Eight teams play a round-robin tournament where every pair meets once. The organiser schedules only eight matches.",
      challenge: {
        prompt: "How many head-to-head matches are in a round-robin tournament with six teams?",
        options: ["15", "12", "30"],
        answer: 0,
        explanation: "Six teams make 6 × 5 ÷ 2 = 15 unique pairs.",
      },
      virtue: "Perseverance",
      narrative:
        "The neighbourhood council compares outcomes with open minds and a shared sense of fairness.\n\nEight teams play a round-robin tournament where every pair meets once. The organiser schedules only eight matches.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Asha",
      voice: "In a round-robin, every pair meets once. Let’s count each pairing only once.",
      opening:
        "The festival games manager is scheduling a round-robin where every team meets each other team once.",
    },
    {
      id: 76,
      chapter: 8,
      title: "The Community Supply Plan",
      story:
        "Three shelters need 11, 17 and 22 supply kits. A delivery contains 50 kits. The clerk proposes 15 for each shelter.",
      claim: "The clerk claims the equal split meets every stated need.",
      prompt: "How many kits remain after meeting stated needs exactly?",
      options: ["0", "2", "5"],
      answer: 0,
      explanation: "11 + 17 + 22 = 50, so no kits remain if those stated needs govern allocation.",
      twist: "An equal split leaves one shelter with extra kits and two short.",
      moral:
        "Creative thinking finds a good solution while respecting real limits and people's needs.",
      verdict: "disproved",
      check: "constraints",
      evidence:
        "Three shelters need 11, 17 and 22 supply kits. A delivery contains 50 kits. The clerk proposes 15 for each shelter.",
      challenge: {
        prompt:
          "If three shelters each receive 15 kits from a delivery of 50, how many kits remain?",
        options: ["5 kits", "2 kits", "0 kits"],
        answer: 0,
        explanation: "3 × 15 = 45, leaving 5 kits.",
      },
      virtue: "Creativity",
      narrative:
        "The community panel wants its plans to serve people fairly, with every need considered.\n\nThree shelters need 11, 17 and 22 supply kits. A delivery contains 50 kits. The clerk proposes 15 for each shelter.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Dot",
      voice: "Let’s first provide the stated kits, then see what remains for later needs.",
      opening:
        "The community pantry is packing supply kits for three shelters and checking the requested quantities first.",
    },
    {
      id: 77,
      chapter: 8,
      title: "The Queue with Two Doors",
      story:
        "Policy A produces waits of 2, 2, 2 and 18 minutes. Policy B produces 6, 6, 6 and 6 minutes.",
      claim: "The manager claims both policies are equally fair because their means match.",
      prompt: "Which policy has the lower longest wait?",
      options: ["Policy A", "Policy B", "They are equal"],
      answer: 1,
      explanation: "A's longest wait is 18 minutes; B's is six. Both means are six minutes.",
      twist: "The average hid the long wait experienced by one person.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "partly",
      check: "comparison",
      evidence:
        "Policy A produces waits of 2, 2, 2 and 18 minutes. Policy B produces 6, 6, 6 and 6 minutes.",
      challenge: {
        prompt:
          "Policy A's longest wait is 18 minutes; Policy B's is 6 minutes. By how much does B reduce the worst wait?",
        options: ["12 minutes", "6 minutes", "18 minutes"],
        answer: 0,
        explanation: "18 − 6 = 12 minutes.",
      },
      virtue: "Fairness",
      narrative:
        "At the festival, the helpers are dividing time, seats and supplies so the whole team can thrive.\n\nPolicy A produces waits of 2, 2, 2 and 18 minutes. Policy B produces 6, 6, 6 and 6 minutes.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Judge Mira",
      voice: "A good queue plan cares about the longest wait any person may face.",
      opening:
        "The welcome team compares two queue plans because every visitor's waiting time matters.",
    },
    {
      id: 78,
      chapter: 8,
      title: "The Bigger-Pack Bargain",
      story:
        "A small pack has 6 items for ₹90; a large pack has 10 items for ₹130. A poster says the small pack is better because its total price is lower.",
      claim: "The poster claims the small pack is better value.",
      prompt: "Which pack costs less per item?",
      options: ["Small at ₹15 each", "Large at ₹13 each", "Same cost"],
      answer: 1,
      explanation: "₹90 ÷ 6 = ₹15; ₹130 ÷ 10 = ₹13 per item.",
      twist: "A lower total price can still be worse value per item.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "A small pack has 6 items for ₹90; a large pack has 10 items for ₹130. A poster says the small pack is better because its total price is lower.",
      challenge: {
        prompt: "For ten items, what is the cost difference buying at ₹15 each and ₹13 each?",
        options: ["₹20", "₹15", "₹10"],
        answer: 0,
        explanation: "The per-item difference is ₹2, so ten items differ by ₹20.",
      },
      virtue: "Fairness",
      narrative:
        "The neighbourhood council compares outcomes with open minds and a shared sense of fairness.\n\nA small pack has 6 items for ₹90; a large pack has 10 items for ₹130. A poster says the small pack is better because its total price is lower.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Pip",
      voice: "A lower pack price can hide a higher cost per item. Let’s compare unit prices.",
      opening:
        "A family is comparing two packs of art supplies and wants to know which offers better value per item.",
    },
    {
      id: 79,
      chapter: 8,
      title: "The Fair Contest Score",
      story:
        "A contest adds a 10-point allowance to one participant. Raw scores are 85 and 90; the first participant receives the allowance.",
      claim: "The second participant should win because their raw score is higher.",
      prompt: "Who has the higher adjusted score?",
      options: ["First participant: 95", "Second participant: 90", "They tie"],
      answer: 0,
      explanation:
        "The first participant's adjusted score is 85 + 10 = 95, greater than the second participant's 90. The published allowance must be included.",
      twist: "The announcer compared raw scores despite the published allowance.",
      moral: "Understand and apply the rules consistently.",
      verdict: "disproved",
      check: "calculation",
      evidence:
        "A contest adds a 10-point allowance to one participant. Raw scores are 85 and 90; the first participant receives the allowance.",
      challenge: {
        prompt: "How many allowance points would a raw score of 85 need to tie a score of 90?",
        options: ["5 points", "10 points", "15 points"],
        answer: 0,
        explanation: "90 − 85 = 5 points. This confirms the stated relationship.",
      },
      virtue: "Perseverance",
      narrative:
        "The community panel wants its plans to serve people fairly, with every need considered.\n\nA contest adds a 10-point allowance to one participant. Raw scores are 85 and 90; the first participant receives the allowance.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Asha",
      voice: "Let’s apply the published allowance before comparing the final scores.",
      opening:
        "The contest committee applies a published allowance before posting its final scores.",
    },
    {
      id: 80,
      chapter: 8,
      title: "The Neighbourhood Grant Review",
      story:
        "A recreation grant is designed for groups with at least 20 members. A group of 19 also serves a remote area with few nearby services, so the community panel studies which details matter for a fair review.",
      claim:
        "The panel asks whether member count alone describes a group's value to its neighbourhood.",
      prompt: "What does the threshold establish by itself?",
      options: [
        "The group cannot be valuable",
        "It misses the size rule, but broader fairness needs more criteria",
        "The group must receive double funding",
      ],
      answer: 1,
      explanation:
        "The group has 19 members and misses the stated threshold. The rule alone does not measure need or impact.",
      twist:
        "A map adds travel distance and access needs to the discussion. The panel can now consider group size alongside the needs of the people served.",
      moral: "Fairness grows when we listen to each community and consider relevant evidence.",
      verdict: "disproved",
      check: "assumptions",
      evidence:
        "A recreation grant automatically goes to groups with at least 20 members. A group of 19 serves a remote area with few services and receives nothing.",
      challenge: {
        prompt:
          "If the grant threshold changed from 20 members to 18, would a group of 19 meet it?",
        options: ["Yes", "No", "The member count is irrelevant"],
        answer: 0,
        explanation: "19 is at least 18, so the group meets the changed threshold.",
      },
      virtue: "Fairness",
      narrative:
        "At the festival, the helpers are dividing time, seats and supplies so the whole team can thrive.\n\nA recreation grant is designed for groups with at least 20 members. A group of 19 also serves a remote area with few nearby services, so the community panel studies which details matter for a fair review.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Dot",
      voice:
        "A threshold gives one part of the picture. Let’s ask what the rule establishes and what needs context.",
      opening:
        "A neighbourhood grant panel reads a group application and considers which details the size threshold establishes.",
    },
    {
      id: 81,
      chapter: 9,
      title: "The Swiftest Route",
      story:
        "Route A has segments of 4, 4 and 4 minutes. Route B has segments of 5 and 3 minutes. A planner chooses A because it has fewer turns.",
      claim: "The planner claims Route A is faster.",
      prompt: "Which route takes less time?",
      options: ["Route A at 12 minutes", "Route B at 8 minutes", "They are equal"],
      answer: 1,
      explanation: "A takes 12 minutes; B takes 8. Compare total weights, not segment count.",
      twist: "Fewer turns did not mean less travel time.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "Route A has segments of 4, 4 and 4 minutes. Route B has segments of 5 and 3 minutes. A planner chooses A because it has fewer turns.",
      challenge: {
        prompt: "Route C takes 6 + 4 minutes. Which of Routes A (12), B (8) and C (10) is fastest?",
        options: ["Route B", "Route C", "Route A"],
        answer: 0,
        explanation: "Route B takes eight minutes, less than ten and twelve.",
      },
      virtue: "Fairness",
      narrative:
        "The explorers are drawing a map of the town, searching for routes that save time and resources.\n\nRoute A has segments of 4, 4 and 4 minutes. Route B has segments of 5 and 3 minutes. A planner chooses A because it has fewer turns.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Judge Mira",
      voice: "Count the minutes on every road, then find the journey with the smaller total.",
      opening:
        "The route team adds up every section of two possible journeys to find the quickest trip.",
    },
    {
      id: 82,
      chapter: 9,
      title: "The Seven-Bridge Challenge",
      story:
        "A network has four land areas; three areas have an odd number of bridges. The planner wants a closed walk crossing every bridge exactly once.",
      claim: "The planner claims connectivity alone makes the walk possible.",
      prompt: "Can every bridge be crossed exactly once and return to the start?",
      options: [
        "Yes, any connected network works",
        "No, odd-degree areas prevent such a closed route",
        "Only if the shortest bridge is first",
      ],
      answer: 1,
      explanation:
        "A closed route using each edge exactly once requires every vertex to have even degree.",
      twist: "The map is connected, but connectivity alone is insufficient.",
      moral:
        "Thoughtful reasoning checks each step and makes sure a conclusion follows from its clues.",
      verdict: "disproved",
      check: "logic",
      evidence:
        "A network has four land areas; three areas have an odd number of bridges. The planner wants a closed walk crossing every bridge exactly once.",
      challenge: {
        prompt:
          "A connected network has three odd-degree land areas. Can a single walk cross each bridge exactly once without returning to the start?",
        options: [
          "No, an open Euler trail allows at most two odd-degree vertices",
          "Yes, any connected network works",
          "Yes, if starting at the busiest area",
        ],
        answer: 0,
        explanation: "An Euler trail can have zero or two odd-degree vertices, but not three.",
      },
      virtue: "Thoughtful reasoning",
      narrative:
        "A group of curious planners builds journeys and compares combinations to find a good fit.\n\nA network has four land areas; three areas have an odd number of bridges. The planner wants a closed walk crossing every bridge exactly once.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Pip",
      voice: "This bridge puzzle has a beautiful graph rule. Let’s count the odd-degree places.",
      opening:
        "The town's bridge challenge lays out a network map and invites visitors to discover a beautiful graph rule.",
    },
    {
      id: 83,
      chapter: 9,
      title: "The Clockwork Cipher",
      story:
        "A dial cycles from 0 to 11 and returns to 0. It starts at 8 and advances 7 positions. A clerk writes 15 as the displayed value.",
      claim: "The clerk claims the dial displays 15.",
      prompt: "What value appears?",
      options: ["3", "5", "11"],
      answer: 0,
      explanation: "8 + 7 = 15; after one 12-step cycle, the dial displays 3.",
      twist: "The dial wraps around after 12 positions.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence:
        "A dial cycles from 0 to 11 and returns to 0. It starts at 8 and advances 7 positions. A clerk writes 15 as the displayed value.",
      challenge: {
        prompt: "A 12-position dial starts at 5 and advances 10 positions. What value appears?",
        options: ["3", "5", "11"],
        answer: 0,
        explanation: "5 + 10 = 15; after wrapping around 12 positions the dial displays 3.",
      },
      virtue: "Perseverance",
      narrative:
        "The engineering team tests models before choosing a design people can use.\n\nA dial cycles from 0 to 11 and returns to 0. It starts at 8 and advances 7 positions. A clerk writes 15 as the displayed value.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Asha",
      voice: "The dial wraps around at twelve positions. Let’s trace each step around the cycle.",
      opening:
        "The clockwork artist builds a dial that loops back to zero and checks how it behaves after each turn.",
    },
    {
      id: 84,
      chapter: 9,
      title: "The Best-Fitting Cargo",
      story:
        "A cargo hold has capacity 10 units. Crates of size 6, 5 and 4 are available, one of each. The loader takes the 6-unit crate and says no better load is possible.",
      claim: "The loader claims 6 units is the best achievable total.",
      prompt: "What is the greatest total size that fits?",
      options: ["6 units", "9 units", "10 units"],
      answer: 2,
      explanation:
        "The 6-unit and 4-unit crates fit exactly into the 10-unit hold. The best total is 10 units.",
      twist:
        "A careful measurement shows the 4-unit crate fits alongside the 6-unit crate. The first plan stopped too early.",
      moral:
        "Creative thinking finds a good solution while respecting real limits and people's needs.",
      verdict: "disproved",
      check: "constraints",
      evidence: "Hold capacity: 10 units. Crates available: 6, 5 and 4 units.",
      challenge: {
        prompt:
          "If the 4-unit crate is unavailable, what is the largest load possible with the remaining 6- and 5-unit crates in a capacity-10 hold?",
        options: ["6 units", "5 units", "10 units"],
        answer: 0,
        explanation:
          "The 6- and 5-unit crates cannot fit together, so the best single crate is 6 units.",
      },
      virtue: "Creativity",
      narrative:
        "The explorers are drawing a map of the town, searching for routes that save time and resources.\n\nA cargo hold has capacity 10 units. Crates of size 6, 5 and 4 are available, one of each. The loader takes the 6-unit crate and says no better load is possible.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Dot",
      voice: "The hold has a limit. Let’s fit the best combination without going over.",
      opening:
        "The loading team is packing a cargo hold with several crates and wants the best useful combination.",
    },
    {
      id: 85,
      chapter: 9,
      title: "The Best Supply Mix",
      story:
        "A team needs at least 20 L. Small containers hold 3 L for ₹12; large containers hold 7 L for ₹25. Both types are available.",
      claim: "The organiser claims three large containers are the cheapest feasible plan.",
      prompt: "What is the lowest-cost option listed that reaches at least 20 L?",
      options: [
        "Six small containers for ₹72",
        "Three large containers for ₹75",
        "Two large and two small for ₹74",
      ],
      answer: 2,
      explanation:
        "Six small containers provide only 18 L. Two large and two small provide 20 L for ₹74, less than three large containers at ₹75.",
      twist: "The apparently cheapest total does not meet the required volume.",
      moral:
        "Creative thinking finds a good solution while respecting real limits and people's needs.",
      verdict: "disproved",
      check: "constraints",
      evidence:
        "A team needs at least 20 L. Small containers hold 3 L for ₹12; large containers hold 7 L for ₹25. Both types are available.",
      challenge: {
        prompt:
          "To obtain at least 21 litres using 7 L containers for ₹25 and 3 L containers for ₹12, which option is cheapest?",
        options: [
          "Three large containers for ₹75",
          "Seven small containers for ₹84",
          "One large and five small for ₹85",
        ],
        answer: 0,
        explanation: "Three large containers provide 21 L for ₹75, below the other listed costs.",
      },
      virtue: "Creativity",
      narrative:
        "A group of curious planners builds journeys and compares combinations to find a good fit.\n\nA team needs at least 20 L. Small containers hold 3 L for ₹12; large containers hold 7 L for ₹25. Both types are available.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Judge Mira",
      voice: "The least expensive plan still needs enough water. Let’s compare possible mixes.",
      opening:
        "The water station is comparing small and large containers to fill a community tank with the least cost.",
    },
    {
      id: 86,
      chapter: 9,
      title: "The Growth Contract",
      story:
        "A fund starts at ₹100. Plan A adds ₹20 each year; Plan B increases the current amount by 10% each year. The first comparison is after one year.",
      claim: "A witness claims Plan B has more money after one year.",
      prompt: "Which plan has more after one year?",
      options: ["Plan A: ₹120", "Plan B: ₹110", "They tie"],
      answer: 0,
      explanation: "Plan A has ₹120; Plan B has ₹110.",
      twist: "Their long-term paths differ even though the first-year comparison is simple.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "A fund starts at ₹100. Plan A adds ₹20 each year; Plan B increases the current amount by 10% each year. The first comparison is after one year.",
      challenge: {
        prompt:
          "After two years, Plan A adds ₹20 per year from ₹100; Plan B grows 10% each year. Which balance is higher?",
        options: ["Plan A: ₹140", "Plan B: ₹121", "They are equal at ₹120"],
        answer: 0,
        explanation: "Plan A reaches ₹140; Plan B goes from ₹100 to ₹110 to ₹121.",
      },
      virtue: "Fairness",
      narrative:
        "The engineering team tests models before choosing a design people can use.\n\nA fund starts at ₹100. Plan A adds ₹20 each year; Plan B increases the current amount by 10% each year. The first comparison is after one year.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Pip",
      voice:
        "One fund grows by equal additions, the other by percentages. Let’s watch the paths diverge.",
      opening:
        "The finance club follows two savings plans, one growing by equal additions and the other by percentages.",
    },
    {
      id: 87,
      chapter: 9,
      title: "The Map's Changing Scale",
      story:
        "A square map tile has side length 3 cm. A revised map doubles the side length to 6 cm. The cartographer says area doubles.",
      claim: "The cartographer claims the new area is twice the old area.",
      prompt: "By what factor does the area change?",
      options: ["2 times", "3 times", "4 times"],
      answer: 2,
      explanation: "Area changes from 9 cm² to 36 cm², four times as large.",
      twist: "The cartographer applied a linear scale factor directly to area.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "A square map tile has side length 3 cm. A revised map doubles the side length to 6 cm. The cartographer says area doubles.",
      challenge: {
        prompt: "A square's area changes from 9 cm² to 36 cm². How much greater is the new area?",
        options: ["27 cm²", "18 cm²", "36 cm²"],
        answer: 0,
        explanation: "36 − 9 = 27 cm². This confirms the stated relationship.",
      },
      virtue: "Fairness",
      narrative:
        "The explorers are drawing a map of the town, searching for routes that save time and resources.\n\nA square map tile has side length 3 cm. A revised map doubles the side length to 6 cm. The cartographer says area doubles.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Asha",
      voice: "When a square’s sides double, its area changes by another factor. Let’s model it.",
      opening:
        "The map makers enlarge a square tile for a new town map and explore what happens to its area.",
    },
    {
      id: 88,
      chapter: 9,
      title: "The Poll with a Small Margin",
      story:
        "A poll shows 51% support and 49% oppose, based on a small sample with large uncertainty. A speaker declares overwhelming support.",
      claim: "The speaker claims the poll proves overwhelming support.",
      prompt: "What conclusion is justified?",
      options: [
        "Overwhelming support is proven",
        "A narrow lead is reported, but uncertainty limits the conclusion",
        "The poll proves nobody supports it",
      ],
      answer: 1,
      explanation:
        "A two-point difference with substantial uncertainty cannot establish overwhelming support.",
      twist: "The sample uncertainty was omitted from the chart.",
      moral: "Do not express more confidence than data allow.",
      verdict: "insufficient",
      check: "sample",
      evidence:
        "A poll shows 51% support and 49% oppose, based on a small sample with large uncertainty. A speaker declares overwhelming support.",
      challenge: {
        prompt:
          "A poll is 51% versus 49% with a small sample and large uncertainty. What would improve confidence?",
        options: [
          "A larger representative sample and a disclosed uncertainty estimate",
          "A dramatic graph title",
          "Removing responses that disagree",
        ],
        answer: 0,
        explanation:
          "Better sampling and explicit uncertainty help judge whether a narrow lead is meaningful.",
      },
      virtue: "Inclusion",
      narrative:
        "A group of curious planners builds journeys and compares combinations to find a good fit.\n\nA poll shows 51% support and 49% oppose, based on a small sample with large uncertainty. A speaker declares overwhelming support.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Dot",
      voice: "A narrow poll lead deserves careful interpretation and an open view of uncertainty.",
      opening:
        "The school poll is close, so the student council wants to describe the result with care and context.",
    },
    {
      id: 89,
      chapter: 9,
      title: "The Steps to Approval",
      story:
        "A community charter says that every approved package has passed its safety checks. The review team wants to know whether passing those checks alone is enough to establish approval.",
      claim: "A learner suggests that passing safety checks guarantees approval.",
      prompt: "Is that logically guaranteed?",
      options: [
        "Yes, the statements are identical",
        "No, passing checks does not prove approval",
        "Yes, safety checks always approve packages",
      ],
      answer: 1,
      explanation:
        "Approval implies safety checks under the rule, but checks may be necessary without being sufficient for approval.",
      twist:
        "The record shows that budget sign-off is another required step. The safety checks are valuable, and the full path to approval includes both requirements.",
      moral: "Careful logic checks the whole path, including every necessary step.",
      verdict: "disproved",
      check: "logic",
      evidence:
        "The charter states that approval requires completed safety checks. The review notes also list budget sign-off as a separate step.",
      challenge: {
        prompt:
          "A package passed safety checks and has budget approval. Is final approval guaranteed by those facts alone?",
        options: [
          "Not necessarily; other requirements may apply",
          "Yes, those are identical to approval",
          "No package can ever be approved",
        ],
        answer: 0,
        explanation: "Passing necessary checks does not establish every approval condition.",
      },
      virtue: "Thoughtful reasoning",
      narrative:
        "The engineering team tests models before choosing a design people can use.\n\nA community charter says that every approved package has passed its safety checks. The review team wants to know whether passing those checks alone is enough to establish approval.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Judge Mira",
      voice: "A safety check is important, and the full approval rule may ask for more.",
      opening:
        "The community charter lists important safety steps and invites the team to read what each step guarantees.",
    },
    {
      id: 90,
      chapter: 9,
      title: "The Rainy-Day Walkway Model",
      story:
        "A walkway model was built using measurements from dry ground. After rain changes the surface, the community checks whether the same travel-time estimate still describes the route.",
      claim:
        "The planner suggests that a correct calculation will describe the route under every condition.",
      prompt: "What should the court do?",
      options: [
        "Keep it because the arithmetic was correct",
        "Update assumptions and retest the model",
        "Discard all measurements forever",
      ],
      answer: 1,
      explanation:
        "A model is useful only while its assumptions describe the situation; changed conditions require new evidence.",
      twist:
        "The wet surface changes travel times, so the team gathers fresh measurements and improves the model for rainy days.",
      moral: "Curiosity welcomes new evidence and helps a model grow closer to reality.",
      verdict: "partly",
      check: "assumptions",
      evidence:
        "A walkway model assumes dry ground. Heavy rain changes the surface and makes its old travel-time estimate unreliable.",
      challenge: {
        prompt:
          "The walkway was modelled for dry ground but must now be assessed after heavy rain. What is the best next step?",
        options: [
          "Collect wet-weather measurements and update the assumptions",
          "Keep the old estimate because its arithmetic is correct",
          "Discard all prior evidence",
        ],
        answer: 0,
        explanation: "Changed conditions require new observations and a revised model.",
      },
      virtue: "Curiosity",
      narrative:
        "The explorers are drawing a map of the town, searching for routes that save time and resources.\n\nA walkway model was built using measurements from dry ground. After rain changes the surface, the community checks whether the same travel-time estimate still describes the route.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Pip",
      voice: "Rain changes the walking surface. Let’s gather fresh measures and update our model.",
      opening:
        "The walkway team has a dry-weather model and returns after rain to update it for the changing surface.",
    },
    {
      id: 91,
      chapter: 10,
      title: "The Festival's Clear Accounts",
      story:
        "The festival account lists ₹1,200 for materials, ₹450 for food and ₹350 for transport. A cancelled ₹200 order also appears in the reported total, so the treasurer checks which amounts were actually paid.",
      claim: "The first report includes the cancelled ₹200 order in the total spent.",
      prompt: "What is the corrected total after removing the unpaid cancelled order?",
      options: ["₹1,800", "₹2,000", "₹2,200"],
      answer: 1,
      explanation:
        "The itemized amounts total ₹1,200 + ₹450 + ₹350 = ₹2,000. Removing the unpaid ₹200 line from the reported ₹2,200 also leaves ₹2,000.",
      twist:
        "A bank receipt confirms the cancelled order was never paid. The itemized paid amounts add neatly to ₹2,000.",
      moral: "Accurate records and openness help a team make good decisions together.",
      verdict: "disproved",
      check: "records",
      evidence:
        "Paid amounts: ₹1,200 + ₹450 + ₹350. Cancelled order: ₹200, unpaid. First reported total: ₹2,200.",
      challenge: {
        prompt:
          "The reported budget is ₹2,200 while itemized materials, food and transport add to ₹2,000. What is the discrepancy?",
        options: ["₹200", "₹100", "₹400"],
        answer: 0,
        explanation: "₹2,200 − ₹2,000 = ₹200, the cancelled unpaid order's value.",
      },
      virtue: "Honesty",
      narrative:
        "The big planning table is covered in notes, maps and ideas, and every voice can help improve the result.\n\nThe festival account lists ₹1,200 for materials, ₹450 for food and ₹350 for transport. A cancelled ₹200 order also appears in the reported total, so the treasurer checks which amounts were actually paid.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Asha",
      voice: "Clear accounts help every festival helper understand how the budget was used.",
      opening:
        "The festival treasurer is preparing a clear account so every helper can understand how the shared budget was used.",
    },
    {
      id: 92,
      chapter: 10,
      title: "The River Crossing Plan",
      story:
        "A rescue bus carries 12 people per trip. There are 29 people waiting, and a planner has arranged only two trips.",
      claim: "The planner claims the two trips can carry everyone.",
      prompt: "What is the minimum number of trips needed?",
      options: ["2", "3", "4"],
      answer: 1,
      explanation: "Two trips carry 24 people; a third is needed for the remaining five.",
      twist: "The plan treated spare seats as if capacity could be exceeded.",
      moral:
        "Creative thinking finds a good solution while respecting real limits and people's needs.",
      verdict: "disproved",
      check: "constraints",
      evidence:
        "A rescue bus carries 12 people per trip. There are 29 people waiting, and a planner has arranged only two trips.",
      challenge: {
        prompt:
          "Three bus trips can carry 36 people total. If 29 people cross, how many seats are unused?",
        options: ["7 seats", "5 seats", "12 seats"],
        answer: 0,
        explanation: "36 − 29 = 7 unused seats.",
      },
      virtue: "Creativity",
      narrative:
        "The final council gathers every lesson from the season to make a thoughtful plan for the whole community.\n\nA rescue bus carries 12 people per trip. There are 29 people waiting, and a planner has arranged only two trips.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Dot",
      voice: "Let’s plan enough trips so every person has a safe seat.",
      opening:
        "The river crossing crew is planning enough bus journeys for each person to travel with a seat.",
    },
    {
      id: 93,
      chapter: 10,
      title: "The Water Accord",
      story:
        "Two neighbourhoods have 20 and 40 households and share 90 litres. A proposal gives 45 litres to each neighbourhood.",
      claim: "The proposal claims equal neighbourhood totals mean equal amounts per household.",
      prompt: "Under an equal-per-household rule, how much goes to the first neighbourhood?",
      options: ["30 L", "45 L", "60 L"],
      answer: 0,
      explanation:
        "There are 60 households, so each gets 1.5 L. The first neighbourhood receives 20 × 1.5 = 30 L.",
      twist: "Equal totals per neighbourhood and equal amounts per household are different rules.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "Two neighbourhoods have 20 and 40 households and share 90 litres. A proposal gives 45 litres to each neighbourhood.",
      challenge: {
        prompt:
          "Under equal-per-household allocation, 40 households receive 1.5 L each. What total do they receive?",
        options: ["60 L", "30 L", "45 L"],
        answer: 0,
        explanation: "40 × 1.5 = 60 L. This confirms the stated relationship.",
      },
      virtue: "Fairness",
      narrative:
        "Pip brings the clues together as the town prepares its next chapter with care and optimism.\n\nTwo neighbourhoods have 20 and 40 households and share 90 litres. A proposal gives 45 litres to each neighbourhood.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Judge Mira",
      voice: "An equal-per-household rule gives more water where there are more households.",
      opening:
        "The water accord team compares two neighbourhoods and uses a per-household rule to divide the supply.",
    },
    {
      id: 94,
      chapter: 10,
      title: "The Accessible Town Plan",
      story:
        "A ramp rises 0.6 m over a 6 m horizontal run. A new design keeps the rise but shortens the run to 3 m.",
      claim: "The designer claims the slope is unchanged.",
      prompt: "How does the rise-to-run ratio change?",
      options: ["It stays the same", "It doubles", "It halves"],
      answer: 1,
      explanation: "The ratio changes from 0.6/6 = 0.1 to 0.6/3 = 0.2, twice as steep.",
      twist: "The cheaper layout changes the gradient relevant to accessibility.",
      moral: "Fair comparisons use the same units, starting point and relevant conditions.",
      verdict: "disproved",
      check: "comparison",
      evidence:
        "A ramp rises 0.6 m over a 6 m horizontal run. A new design keeps the rise but shortens the run to 3 m.",
      challenge: {
        prompt:
          "A ramp rises 0.6 m. To keep rise/run at or below 0.1, what minimum horizontal run is needed?",
        options: ["6 m", "3 m", "0.6 m"],
        answer: 0,
        explanation: "0.6 ÷ run ≤ 0.1 requires a run of at least 6 m.",
      },
      virtue: "Fairness",
      narrative:
        "The big planning table is covered in notes, maps and ideas, and every voice can help improve the result.\n\nA ramp rises 0.6 m over a 6 m horizontal run. A new design keeps the rise but shortens the run to 3 m.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Pip",
      voice: "The ramp’s rise-to-run ratio affects steepness. Let’s compare both designs.",
      opening:
        "The accessibility team compares two ramp drawings so the route remains comfortable for people using it.",
    },
    {
      id: 95,
      chapter: 10,
      title: "The Rooftop Energy Model",
      story:
        "Ten panels each produce 200 Wh in test conditions. Three panels are shaded and produce half as much as the others today.",
      claim: "The report claims total output is 2,000 Wh.",
      prompt: "How much energy do they produce under these conditions?",
      options: ["1,600 Wh", "1,700 Wh", "2,000 Wh"],
      answer: 1,
      explanation: "Seven panels produce 1,400 Wh and three produce 300 Wh; total 1,700 Wh.",
      twist: "The original estimate assumed equal sunlight for every panel.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence:
        "Ten panels each produce 200 Wh in test conditions. Three panels are shaded and produce half as much as the others today.",
      challenge: {
        prompt:
          "Ten panels produce 2,000 Wh without shade but 1,700 Wh under shading. How much energy is lost?",
        options: ["300 Wh", "200 Wh", "400 Wh"],
        answer: 0,
        explanation: "2,000 − 1,700 = 300 Wh lost.",
      },
      virtue: "Curiosity",
      narrative:
        "The final council gathers every lesson from the season to make a thoughtful plan for the whole community.\n\nTen panels each produce 200 Wh in test conditions. Three panels are shaded and produce half as much as the others today.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Asha",
      voice: "Shade changes the panels’ output. Let’s add the energy from each group.",
      opening:
        "The rooftop energy club measures panels in sunshine and shade to estimate the energy available for the evening.",
    },
    {
      id: 96,
      chapter: 10,
      title: "The Coordinated Transport Plan",
      story:
        "One bus is scheduled on Route A at 10:00, taking 30 minutes, and Route B at 10:10. The same bus is required for both departures.",
      claim: "The planner claims both trips can start as scheduled.",
      prompt: "What is the conflict?",
      options: [
        "The bus is still on Route A at 10:10",
        "Both trips work because the times differ",
        "The bus can move instantly",
      ],
      answer: 0,
      explanation: "Route A ends at 10:30, so the same bus cannot depart Route B at 10:10.",
      twist: "Each route was checked alone; the shared resource was ignored.",
      moral:
        "Creative thinking finds a good solution while respecting real limits and people's needs.",
      verdict: "disproved",
      check: "constraints",
      evidence:
        "One bus is scheduled on Route A at 10:00, taking 30 minutes, and Route B at 10:10. The same bus is required for both departures.",
      challenge: {
        prompt:
          "Route A ends at 10:30 and the same bus needs ten minutes to turn around. Could it start Route B at 10:40?",
        options: [
          "Yes, exactly after the turnaround",
          "No, it is still on Route A",
          "A bus cannot run two routes",
        ],
        answer: 0,
        explanation: "The bus is ready at 10:40 after its 10:30 arrival and ten-minute turnaround.",
      },
      virtue: "Creativity",
      narrative:
        "Pip brings the clues together as the town prepares its next chapter with care and optimism.\n\nOne bus is scheduled on Route A at 10:00, taking 30 minutes, and Route B at 10:10. The same bus is required for both departures.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Dot",
      voice:
        "A bus needs time to finish one route before starting the next. Let’s draw the timetable.",
      opening:
        "The transport coordinator has one bus and two route bookings, and wants a schedule everyone can rely on.",
    },
    {
      id: 97,
      chapter: 10,
      title: "The Charter's Repeating Clock",
      story:
        "A community bell rings every 9 days and a market flag rises every 12 days. Both happen today. A clerk predicts they next coincide after 21 days.",
      claim: "The clerk claims they next coincide after 21 days.",
      prompt: "After how many days will they coincide again?",
      options: ["18 days", "36 days", "108 days"],
      answer: 1,
      explanation: "The least common multiple of 9 and 12 is 36 days.",
      twist: "The clerk added the intervals instead of finding a common multiple.",
      moral:
        "Working carefully, one step at a time, turns a large puzzle into something we can understand.",
      verdict: "disproved",
      check: "calculation",
      evidence:
        "A community bell rings every 9 days and a market flag rises every 12 days. Both happen today. A clerk predicts they next coincide after 21 days.",
      challenge: {
        prompt:
          "Bell A rings every 9 days and flag B rises every 12 days. In the first 72 days after today, how many future coincidences occur?",
        options: ["2", "3", "1"],
        answer: 0,
        explanation: "They coincide after 36 and 72 days, so there are two future coincidences.",
      },
      virtue: "Perseverance",
      narrative:
        "The big planning table is covered in notes, maps and ideas, and every voice can help improve the result.\n\nA community bell rings every 9 days and a market flag rises every 12 days. Both happen today. A clerk predicts they next coincide after 21 days.\n\nThe result will help the community make its next decision with confidence and care.",
      speaker: "Judge Mira",
      voice: "The bell and market flag repeat on different cycles. Let’s find their common day.",
      opening:
        "The market bell and garden flag follow repeating cycles, and the organisers hope to celebrate their next shared moment.",
    },
    {
      id: 98,
      chapter: 10,
      title: "The Transparent Prize Formula",
      story:
        "A contest score is 70% skill and 30% teamwork. After the event, the proposal changes weights to 40% skill and 60% teamwork, changing the winner.",
      claim: "The organisers claim the new result should replace the old one without review.",
      prompt: "What is the central fairness concern?",
      options: [
        "Only the new winner matters",
        "Changing weights after scoring changes the judging rule",
        "Weights never affect scores",
      ],
      answer: 1,
      explanation:
        "Weighted results depend on their weights; changing them after seeing outcomes undermines consistency and transparency.",
      twist: "The new weights were chosen after judges saw who would win.",
      moral: "Curiosity asks what we know, what we assume and what one more clue might reveal.",
      verdict: "disproved",
      check: "assumptions",
      evidence:
        "A contest score is 70% skill and 30% teamwork. After the event, the proposal changes weights to 40% skill and 60% teamwork, changing the winner.",
      challenge: {
        prompt:
          "When should a contest disclose scoring weights to keep the comparison transparent?",
        options: [
          "Before the contest begins",
          "After the winner is known",
          "Only after someone objects",
        ],
        answer: 0,
        explanation: "Rules should be known before results are available.",
      },
      virtue: "Curiosity",
      narrative:
        "The final council gathers every lesson from the season to make a thoughtful plan for the whole community.\n\nA contest score is 70% skill and 30% teamwork. After the event, the proposal changes weights to 40% skill and 60% teamwork, changing the winner.\n\nThe goal is to understand the idea, strengthen the plan and help everyone learn something useful.",
      speaker: "Pip",
      voice: "Contest weights should be shared before the event so every team knows the rules.",
      opening:
        "The contest committee wants every participant to know the scoring weights before the celebration begins.",
    },
    {
      id: 99,
      chapter: 10,
      title: "The Table That Connected the Town",
      story:
        "A copied table shifts one column's values down a row. Every number remains present, but some values sit beside a different neighbourhood than the source shows.",
      claim: "A clerk says the copied table is ready to use because every value is present.",
      prompt: "What should happen first?",
      options: [
        "Focus on the person rather than checking the source",
        "Compare the copy with the original and correct the mapping",
        "Delete all archived data",
      ],
      answer: 1,
      explanation:
        "The source must be used to restore each value to its correct row before recalculating decisions.",
      twist:
        "The team compares the copy with the source and reconnects each value to its neighbourhood. The numbers were all present; the labels make their meaning clear.",
      moral:
        "Careful labelling and honest checking help every neighbourhood be represented faithfully.",
      verdict: "disproved",
      check: "records",
      evidence:
        "The copied table places some values beside different neighbourhoods from those shown in the original.",
      challenge: {
        prompt:
          "All values remain in a copied table, but one column has shifted down a row. What is the first repair step?",
        options: [
          "Compare with the original and restore each value to its row",
          "Assume the table is sound because every value appears",
          "Delete the whole archive",
        ],
        answer: 0,
        explanation:
          "Values must be re-associated with the correct neighbourhoods before decisions are recalculated.",
      },
      virtue: "Honesty",
      narrative:
        "Pip brings the clues together as the town prepares its next chapter with care and optimism.\n\nA copied table shifts one column's values down a row. Every number remains present, but some values sit beside a different neighbourhood than the source shows.\n\nEvery clue gives the team another chance to think clearly and help one another.",
      speaker: "Asha",
      voice: "A well-labelled table keeps each number connected to its neighbourhood.",
      opening:
        "The data team is reconnecting a copied table to its source so every value sits beside the right neighbourhood.",
    },
    {
      id: 100,
      chapter: 10,
      title: "The Charter of Shared Paths",
      story:
        "The town uses a common numerical rule to guide public decisions. A community review shows that the rule should also consider travel distance and access needs in a remote neighbourhood.",
      claim:
        "The council asks whether applying one rule consistently is enough to make it fair for every neighbourhood.",
      prompt: "What should the final court require before replacing the rule?",
      options: [
        "Choose a rule that sounds fair without testing it",
        "State the objective, use evidence, test outcomes and explain trade-offs",
        "Keep the old rule because it is consistent",
      ],
      answer: 1,
      explanation:
        "A defensible policy states its goals, uses suitable evidence, tests consequences and explains trade-offs. Consistency alone is not enough.",
      twist:
        "The original charter calls for transparent evidence and review. The town can use those principles to improve the rule together.",
      moral: "Fairness, humility and accountability help a community build wiser rules.",
      verdict: "partly",
      check: "constraints",
      evidence:
        "The charter requires every public decision to follow the same numerical rule. A review finds the rule consistently excludes a remote neighbourhood because it ignores travel distance and access needs.",
      challenge: {
        prompt: "Which is the strongest starting point for replacing the old decision rule?",
        options: [
          "State the goal and constraints, test outcomes, and explain trade-offs",
          "Use group size alone in every situation",
          "Keep the old rule because it is consistent",
        ],
        answer: 0,
        explanation:
          "A defensible rule states its goal and constraints, tests consequences, and explains trade-offs.",
      },
      virtue: "Creativity",
      narrative:
        "The big planning table is covered in notes, maps and ideas, and every voice can help improve the result.\n\nThe town uses a common numerical rule to guide public decisions. A community review shows that the rule should also consider travel distance and access needs in a remote neighbourhood.\n\nCareful questions and kind collaboration bring the clearest answers.",
      speaker: "Dot",
      voice:
        "A shared rule can still be reviewed. Let’s include access, distance and community needs.",
      opening:
        "The final council gathering asks learners to use mathematics, listening and imagination to shape a rule that serves every neighbourhood.",
    },
  ];
  const chapters = [
    {
      id: 1,
      name: "The First Dockets",
      from: 1,
      to: 10,
      theme: "Counting, place value and records",
    },
    {
      id: 2,
      name: "The Rules Hidden in Numbers",
      from: 11,
      to: 20,
      theme: "Factors, divisibility and number patterns",
    },
    {
      id: 3,
      name: "Shares, Ratios and Proportion",
      from: 21,
      to: 30,
      theme: "Fractions, rates and percentages",
    },
    {
      id: 4,
      name: "Shapes, Space and Design",
      from: 31,
      to: 40,
      theme: "Measurement and geometry",
    },
    {
      id: 5,
      name: "Clocks, Journeys and Measurements",
      from: 41,
      to: 50,
      theme: "Time, units and rates",
    },
    {
      id: 6,
      name: "The Evidence Room",
      from: 51,
      to: 60,
      theme: "Statistics and trustworthy evidence",
    },
    {
      id: 7,
      name: "The Algebra and Logic Docket",
      from: 61,
      to: 70,
      theme: "Rules, equations and logic",
    },
    {
      id: 8,
      name: "The Fairness Docket",
      from: 71,
      to: 80,
      theme: "Voting, scoring and allocation",
    },
    {
      id: 9,
      name: "The Mathematical Models Docket",
      from: 81,
      to: 90,
      theme: "Networks, optimisation and models",
    },
    {
      id: 10,
      name: "The High Court",
      from: 91,
      to: 100,
      theme: "Combined investigations and the charter",
    },
  ];
  const verdicts = [
    {
      id: "supported",
      label: "Supported",
      description: "The evidence supports the claim as stated.",
    },
    {
      id: "disproved",
      label: "Disproved",
      description: "The evidence contradicts the claim as stated.",
    },
    {
      id: "partly",
      label: "Partly supported",
      description: "Part of the claim is true, but it goes further than the evidence.",
    },
    {
      id: "uncertain",
      label: "Not enough evidence",
      description: "The records conflict or leave too much uncertainty.",
    },
    {
      id: "insufficient",
      label: "Not enough evidence",
      description: "More information is needed for a sound conclusion.",
    },
  ];
  const checks = {
    calculation: {
      prompt: "Which line of cross-examination would help most?",
      choices: [
        "Recalculate from the original values and verify with an inverse operation.",
        "Choose the value closest to an estimate without checking the exact result.",
        "Compare only the last digit of each number.",
      ],
      correct: 0,
    },
    records: {
      prompt: "What is the strongest next check?",
      choices: [
        "Compare original records, timestamps and duplicate entries.",
        "Use the newest note on its own, without checking what it records.",
        "Combine every note before checking whether entries repeat.",
      ],
      correct: 0,
    },
    assumptions: {
      prompt: "What should the court test next?",
      choices: [
        "Check whether the assumption holds under the conditions shown.",
        "Use the assumption that makes the arithmetic easiest.",
        "Keep the earlier model even when the conditions change.",
      ],
      correct: 0,
    },
    definition: {
      prompt: "What should the advocate establish?",
      choices: [
        "The exact meaning of the mathematical term in this case.",
        "Use a familiar meaning without checking the context.",
        "Choose a definition from one example alone.",
      ],
      correct: 0,
    },
    comparison: {
      prompt: "How can this comparison be made fair?",
      choices: [
        "Put quantities on a common basis and compare the relevant measure.",
        "Compare the totals before accounting for group sizes.",
        "Compare rounded numbers without checking the original values.",
      ],
      correct: 0,
    },
    units: {
      prompt: "What is the best cross-examination question?",
      choices: [
        "Are these measurements in compatible units and precision?",
        "Compare the written numerals before matching their units.",
        "Round each value before converting the units.",
      ],
      correct: 0,
    },
    constraints: {
      prompt: "What must be checked before accepting the plan?",
      choices: [
        "Whether every constraint and the resource limit are satisfied.",
        "Check the first condition, then assume the remaining conditions fit.",
        "Choose the plan with the highest single score before reviewing its limits.",
      ],
      correct: 0,
    },
    representation: {
      prompt: "What should be checked about the display?",
      choices: [
        "Whether its scale and labels fairly show the underlying data.",
        "Compare the tallest bars before reading the scale.",
        "Read the title as the main guide to the quantities.",
      ],
      correct: 0,
    },
    sample: {
      prompt: "What would make this evidence stronger?",
      choices: [
        "A suitable sampling method, enough observations and disclosed uncertainty.",
        "Ask the people who are easiest to reach, then generalise to everyone.",
        "Invite more people from the same small group.",
      ],
      correct: 0,
    },
    causation: {
      prompt: "What is needed before claiming cause and effect?",
      choices: [
        "Evidence addressing other explanations and confounding factors.",
        "Treat two changing quantities as proof that one caused the other.",
        "Use the order of events alone to decide what caused what.",
      ],
      correct: 0,
    },
    logic: {
      prompt: "How should the court test the reasoning?",
      choices: [
        "Check every condition and whether the conclusion follows from the premises.",
        "Test one example and use it as the whole rule.",
        "Assume the reverse statement follows automatically.",
      ],
      correct: 0,
    },
  };
  function getCase(id) {
    return cases.find((item) => item.id === Number(id)) || null;
  }
  function isValid() {
    const ids = new Set(cases.map((item) => item.id));
    return (
      cases.length === 100 &&
      ids.size === 100 &&
      cases.every(
        (item) =>
          Number.isInteger(item.id) &&
          item.id >= 1 &&
          item.id <= 100 &&
          item.title &&
          item.story &&
          item.claim &&
          item.prompt &&
          Array.isArray(item.options) &&
          item.options.length >= 3 &&
          new Set(item.options).size === item.options.length &&
          Number.isInteger(item.answer) &&
          item.answer >= 0 &&
          item.answer < item.options.length &&
          item.explanation &&
          item.twist &&
          item.moral &&
          item.challenge &&
          item.challenge.prompt &&
          Array.isArray(item.challenge.options) &&
          item.challenge.options.length >= 3 &&
          new Set(item.challenge.options).size === item.challenge.options.length &&
          Number.isInteger(item.challenge.answer) &&
          item.challenge.answer >= 0 &&
          item.challenge.answer < item.challenge.options.length &&
          item.challenge.explanation &&
          verdicts.some((v) => v.id === item.verdict) &&
          Boolean(checks[item.check]) &&
          item.evidence,
      )
    );
  }
  root.MathCourtData = Object.freeze({
    cases,
    chapters,
    verdicts,
    checks,
    getCase,
    isValid,
    phases: [
      "The case is called",
      "Witness examination",
      "Build the evidence",
      "New evidence",
      "Cross-examination",
      "Verdict",
      "The court's reflection",
    ],
  });
})(typeof window !== "undefined" ? window : globalThis);

;

/* ===== Bundled from js/math-court.js ===== */
/* Math Court — a data-driven, accessible seven-stage courtroom game. */
(function (root) {
  "use strict";
  const STORE_KEY = "mfa_math_court_v1";
  const $ = (id) => document.getElementById(id);
  const esc = (value) =>
    String(value == null ? "" : value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const data = () => root.MathCourtData;
  const PHASE_LABELS = data().phases;
  const VERDICT_CHOICES = [
    { id: "supported", label: "Supported", note: "The evidence supports the claim as stated." },
    { id: "disproved", label: "Disproved", note: "The evidence contradicts the claim as stated." },
    {
      id: "partly",
      label: "Partly supported",
      note: "Part of the claim is right, but it goes too far.",
    },
    {
      id: "uncertain",
      label: "Not enough evidence",
      note: "The records do not justify a firm conclusion.",
    },
  ];
  const state = {
    caseId: 1,
    phase: 0,
    docketChapterId: null,
    seenClaim: false,
    seenEvidence: false,
    investigationSolved: false,
    challengeSolved: false,
    crossSolved: false,
    clueSolved: false,
    clueCells: [],
    clueValue: null,
    clueOrder: null,
    verdictChosen: null,
    visualMode: "model",
    visualFocus: 0,
    lab: null,
    completed: new Set(),
    session: null,
    feedback: "",
    feedbackKind: "",
  };
  function normalVerdict(value) {
    return value === "insufficient" ? "uncertain" : value;
  }
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      if (Array.isArray(saved.completed))
        state.completed = new Set(
          saved.completed.filter((id) => Number.isInteger(id) && id >= 1 && id <= 100),
        );
      if (
        saved.session &&
        data().getCase(saved.session.caseId) &&
        !state.completed.has(saved.session.caseId)
      ) {
        state.session = saved.session;
      }
    } catch {
      /* Ignore damaged local progress and start safely. */
    }
  }
  function persist() {
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          completed: [...state.completed].sort((a, b) => a - b),
          session: state.session,
        }),
      );
    } catch {
      /* Private browsing or full storage must not block a case. */
    }
  }
  function syncSession() {
    state.session = {
      caseId: state.caseId,
      phase: state.phase,
      seenClaim: state.seenClaim,
      seenEvidence: state.seenEvidence,
      investigationSolved: state.investigationSolved,
      challengeSolved: state.challengeSolved,
      crossSolved: state.crossSolved,
      clueSolved: state.clueSolved,
      clueCells: state.clueCells,
      clueValue: state.clueValue,
      clueOrder: state.clueOrder,
      verdictChosen: state.verdictChosen,
      visualMode: state.visualMode,
      visualFocus: state.visualFocus,
      lab: state.lab,
    };
    persist();
  }
  function setFeedback(message, kind = "info") {
    state.feedback = message;
    state.feedbackKind = kind;
    const node = $("mc-feedback");
    if (node) {
      node.textContent = message;
      node.className = "mc-feedback is-visible mc-feedback-" + kind;
    }
  }
  function open() {
    if (!data().isValid()) {
      console.error("Math Court case data did not pass validation.");
      return;
    }
    if (root.Game && typeof root.Game.goHome === "function") root.Game.goHome();
    document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
    const screen = $("screen-math-court");
    if (screen) screen.classList.add("active");
    window.scrollTo(0, 0);
    state.docketChapterId = null;
    load();
    renderDocket();
    if (state.session) {
      const resume = $("mc-resume");
      if (resume) resume.hidden = false;
    }
  }
  function goDocket() {
    if (state.completed.has(state.caseId)) {
      state.session = null;
      persist();
    } else syncSession();
    const item = data().getCase(state.caseId);
    if (item) state.docketChapterId = item.chapter;
    renderDocket();
    window.scrollTo(0, 0);
  }

  const CHAPTER_NOTES = {
    1: "Every number leaves a trail. Start by checking what was counted, and when.",
    2: "Patterns hide in plain sight. Find the rule that links the clues.",
    3: "Fairness often starts with how we share. Make sure the wholes match.",
    4: "A shape can tell a story that a list of numbers cannot. Measure every side.",
    5: "A good plan respects time, distance, and the units we use.",
    6: "A chart can look convincing at first glance. Look closer at its scale.",
    7: "A rule should work beyond one example. Test it, then test it again.",
    8: "A fair decision listens to the people affected and checks the numbers.",
    9: "A useful model has to fit the real world, not just the page.",
    10: "Bring every clue together. Explain your reasoning and leave room to learn.",
  };
  function chapterIcon(id) {
    const art = {
      1: '<rect x="6" y="5" width="20" height="23" rx="2"/><path d="M11 11h10M11 16h10M11 21h6"/>',
      2: '<circle cx="10" cy="10" r="2"/><circle cx="16" cy="10" r="2"/><circle cx="22" cy="10" r="2"/><circle cx="10" cy="17" r="2"/><circle cx="16" cy="17" r="2"/><circle cx="22" cy="17" r="2"/><path d="M9 25h14"/>',
      3: '<circle cx="16" cy="16" r="11"/><path d="M16 5v11h11M16 16l-8 8"/>',
      4: '<path d="M5 26 15 5l12 21Z"/><path d="M10 22h4M13 16h4M16 10h3"/>',
      5: '<circle cx="16" cy="16" r="11"/><path d="M16 9v8l6 3M11 3h10"/>',
      6: '<path d="M5 27V5M5 27h23"/><rect x="9" y="18" width="4" height="9" rx="1"/><rect x="16" y="12" width="4" height="15" rx="1"/><rect x="23" y="7" width="4" height="20" rx="1"/>',
      7: '<path d="M12 7H8v18h4M20 7h4v18h-4M14 12h4M16 10v4M14 21h4"/>',
      8: '<path d="M16 5v21M7 10h18M8 10 4 19h8ZM24 10l-4 9h8ZM10 27h12"/>',
      9: '<circle cx="7" cy="24" r="3"/><circle cx="16" cy="8" r="3"/><circle cx="26" cy="23" r="3"/><path d="M9 21 14 11M19 10l5 10M10 24h13"/>',
      10: '<path d="M4 27h24M6 8h20M4 8l12-5 12 5M8 10v15M14 10v15M20 10v15M26 10v15"/>',
    };
    return (
      '<svg class="mc-chapter-svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
      (art[id] || art[1]) +
      "</svg>"
    );
  }
  function courtSealArt() {
    return (
      '<svg class="mc-court-illustration" viewBox="0 0 340 220" aria-hidden="true" focusable="false">' +
      '<circle cx="170" cy="111" r="96" class="mc-seal-orbit"/>' +
      '<circle cx="170" cy="111" r="78" class="mc-seal-inner"/>' +
      '<path d="M78 91 Q170 21 262 91" class="mc-court-roof"/>' +
      '<path d="M93 91h154M84 174h172M73 188h194" class="mc-court-line"/>' +
      '<path d="M103 98v72M133 98v72M207 98v72M237 98v72" class="mc-court-pillar"/>' +
      '<path d="M170 64v51M135 78h70M145 78l-16 26h32ZM195 78l-16 26h32ZM159 119h22M164 125h12" class="mc-scale-line"/>' +
      '<circle cx="170" cy="78" r="4" class="mc-scale-pin"/>' +
      '<path d="M117 201h106" class="mc-court-line"/>' +
      '<path d="M156 201v-11h28v11" class="mc-door"/>' +
      "</svg>"
    );
  }

  function renderDocket() {
    const docket = $("mc-docket"),
      play = $("mc-play");
    if (!docket || !play) return;
    docket.hidden = false;
    play.hidden = true;

    const chapters = data().chapters;
    const completed = state.completed.size;
    const next = data().cases.find((item) => !state.completed.has(item.id));
    const resume =
      state.session &&
      data().getCase(state.session.caseId) &&
      !state.completed.has(state.session.caseId)
        ? data().getCase(state.session.caseId)
        : null;
    const focusCase = resume || next || data().getCase(1);
    const defaultChapterId = focusCase ? focusCase.chapter : chapters[chapters.length - 1].id;
    if (!chapters.some((ch) => ch.id === Number(state.docketChapterId)))
      state.docketChapterId = defaultChapterId;
    const activeChapter =
      chapters.find((ch) => ch.id === Number(state.docketChapterId)) || chapters[0];
    const entries = data().cases.filter((item) => item.chapter === activeChapter.id);
    const chapterDone = entries.filter((item) => state.completed.has(item.id)).length;
    const progressLabel =
      completed === 100
        ? "The full 100-case journey is complete"
        : completed + " of 100 cases explored";
    const mainAction = resume
      ? '<button class="mc-button mc-button-primary" type="button" id="mc-resume" onclick="MathCourt.resume()">Continue this case <span aria-hidden="true">→</span></button>'
      : next
        ? '<button class="mc-button mc-button-primary" type="button" onclick="MathCourt.openCase(' +
          next.id +
          ')">Enter the case <span aria-hidden="true">→</span></button>'
        : '<button class="mc-button mc-button-primary" type="button" onclick="MathCourt.openCase(1)">Revisit the first case <span aria-hidden="true">↻</span></button>';
    const caseIdLabel = String(focusCase.id).padStart(3, "0");

    docket.innerHTML =
      '<section class="mc-court-welcome" aria-labelledby="mc-docket-title">' +
      '<div class="mc-court-welcome-copy">' +
      '<div class="mc-eyebrow mc-court-kicker"><span class="mc-kicker-dot" aria-hidden="true"></span> THE COMMON GROUND COURT</div>' +
      '<h2 id="mc-docket-title">Every clue has a story.</h2>' +
      "<p>Welcome, junior advocate. Judge Mira has left a hundred case files for you. Read the story, test the maths, and help the court reach a fair conclusion.</p>" +
      '<div class="mc-court-promise"><span>Listen closely</span><i aria-hidden="true">·</i><span>Think carefully</span><i aria-hidden="true">·</i><span>Be fair</span></div>' +
      "</div>" +
      '<div class="mc-court-welcome-scene">' +
      courtSealArt() +
      '<div class="mc-next-file" aria-label="Next recommended case">' +
      '<div class="mc-next-file-top"><span>' +
      (resume
        ? "PICK UP WHERE YOU LEFT OFF"
        : completed === 100
          ? "A CASE TO REVISIT"
          : "YOUR FIRST FILE") +
      "</span><span>NO. " +
      caseIdLabel +
      "</span></div>" +
      "<h3>" +
      esc(focusCase.title) +
      "</h3>" +
      "<p>" +
      esc(focusCase.opening || focusCase.story) +
      "</p>" +
      '<div class="mc-next-file-bottom">' +
      mainAction +
      "</div>" +
      "</div>" +
      "</div>" +
      "</section>" +
      '<div class="mc-court-progress-line">' +
      '<div class="mc-court-progress-copy"><span class="mc-progress-label">YOUR JOURNEY</span><strong>' +
      progressLabel +
      "</strong></div>" +
      '<div class="mc-progress-track" role="progressbar" aria-label="Cases completed" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
      completed +
      '"><span style="width:' +
      completed +
      '%"></span></div>' +
      (completed > 0 || resume
        ? '<button class="mc-reset-link" type="button" onclick="MathCourt.resetProgress()">Start fresh</button>'
        : '<span class="mc-progress-whisper">One thoughtful step at a time.</span>') +
      "</div>" +
      '<section class="mc-case-browser" aria-label="Explore the court archive">' +
      '<aside class="mc-chapter-rail" aria-label="Choose a chapter">' +
      '<div class="mc-chapter-rail-heading"><span class="mc-rail-heading-stamp">✦</span><div><strong>THE COURT TRAIL</strong><small>Follow a line of clues</small></div></div>' +
      '<nav class="mc-chapter-rail-list">' +
      chapters
        .map((ch) => {
          const items = data().cases.filter((item) => item.chapter === ch.id);
          const done = items.filter((item) => state.completed.has(item.id)).length;
          const isCurrent = ch.id === activeChapter.id;
          const isResume = Boolean(resume && resume.chapter === ch.id);
          const isNext = Boolean(!resume && next && next.chapter === ch.id);
          const tag =
            done === items.length
              ? "All explored"
              : isResume
                ? "Your open case"
                : isNext
                  ? "Begin here"
                  : done > 0
                    ? done + "/10 explored"
                    : "10 case files";
          return (
            '<button type="button" class="mc-chapter-choice mc-chapter-choice--' +
            ch.id +
            " " +
            (isCurrent ? "is-current " : "") +
            (done === items.length ? "is-complete " : "") +
            (isResume ? "has-resume " : "") +
            (isNext ? "has-next" : "") +
            '" data-chapter-id="' +
            ch.id +
            '" aria-pressed="' +
            isCurrent +
            '" onclick="MathCourt.chooseChapter(' +
            ch.id +
            ')">' +
            '<span class="mc-chapter-choice-symbol">' +
            chapterIcon(ch.id) +
            "</span>" +
            '<span class="mc-chapter-choice-copy"><strong>' +
            esc(ch.name) +
            "</strong><small>" +
            esc(ch.theme) +
            "</small><span>" +
            tag +
            "</span></span>" +
            '<span class="mc-chapter-choice-status" aria-hidden="true">' +
            (done === items.length ? "✓" : isResume ? "↻" : isNext ? "→" : "") +
            "</span>" +
            "</button>"
          );
        })
        .join("") +
      "</nav>" +
      '<p class="mc-rail-whisper">No rush. Take the clue that catches your eye.</p>' +
      "</aside>" +
      '<div class="mc-chapter-detail mc-chapter-detail--' +
      activeChapter.id +
      '" data-active-chapter="' +
      activeChapter.id +
      '">' +
      '<header class="mc-chapter-detail-heading">' +
      '<div class="mc-chapter-detail-storymark">' +
      chapterIcon(activeChapter.id) +
      "</div>" +
      '<div class="mc-chapter-detail-title"><p class="mc-chapter-detail-kicker">CHAPTER ' +
      String(activeChapter.id).padStart(2, "0") +
      ' <span aria-hidden="true">·</span> CASES ' +
      String(activeChapter.from).padStart(3, "0") +
      "–" +
      String(activeChapter.to).padStart(3, "0") +
      "</p>" +
      "<h3>" +
      esc(activeChapter.name) +
      "</h3><p>" +
      esc(activeChapter.theme) +
      "</p></div>" +
      '<span class="mc-chapter-count">' +
      chapterDone +
      " <small>/ 10 explored</small></span>" +
      "</header>" +
      '<div class="mc-chapter-mission"><span>JUDGE MIRA’S NOTE</span><p>' +
      CHAPTER_NOTES[activeChapter.id] +
      "</p></div>" +
      '<div class="mc-chapter-progress-track" role="progressbar" aria-label="Cases explored in ' +
      esc(activeChapter.name) +
      '" aria-valuemin="0" aria-valuemax="10" aria-valuenow="' +
      chapterDone +
      '"><span style="width:' +
      chapterDone * 10 +
      '%"></span></div>' +
      '<div class="mc-case-grid" aria-label="Case files in ' +
      esc(activeChapter.name) +
      '">' +
      entries
        .map((item) => {
          const isDone = state.completed.has(item.id);
          const isResume = Boolean(resume && resume.id === item.id);
          const isNext = Boolean(!resume && next && next.id === item.id);
          const status = isDone
            ? "Completed"
            : isResume
              ? "Continue this case"
              : isNext
                ? "Your next case"
                : "Read this case";
          const cardClass =
            "mc-case-card" +
            (isDone ? " is-complete" : "") +
            (isResume ? " is-resume" : "") +
            (isNext ? " is-next" : "");
          return (
            '<button type="button" class="' +
            cardClass +
            '" data-case-id="' +
            item.id +
            '" aria-label="Case ' +
            String(item.id).padStart(3, "0") +
            ": " +
            esc(item.title) +
            ". " +
            status +
            '" onclick="MathCourt.openCase(' +
            item.id +
            ')">' +
            '<span class="mc-case-top"><span class="mc-case-number">FILE ' +
            String(item.id).padStart(3, "0") +
            '</span><span class="mc-case-mark" aria-hidden="true">' +
            (isDone ? "✓" : isResume ? "↻" : isNext ? "✦" : "") +
            "</span></span>" +
            "<strong>" +
            esc(item.title) +
            "</strong>" +
            '<p class="mc-case-teaser">' +
            esc(item.opening || item.story) +
            "</p>" +
            "<small>" +
            (isDone
              ? "Read again"
              : isResume
                ? "Pick up here"
                : isNext
                  ? "Start the inquiry →"
                  : "Read the file →") +
            "</small>" +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      '<p class="mc-chapter-detail-foot">' +
      (chapterDone === 10
        ? "Every file in this chapter has been explored. You can revisit any one."
        : chapterDone +
          " of 10 files explored. Follow your curiosity, or continue with the highlighted file.") +
      "</p>" +
      "</div>" +
      "</section>";
  }

  function chooseChapter(id) {
    const chapter = data().chapters.find((ch) => ch.id === Number(id));
    if (!chapter) return;
    state.docketChapterId = chapter.id;
    renderDocket();
  }
  function openCase(id) {
    const item = data().getCase(id);
    if (!item) return;
    const saved =
      state.session && state.session.caseId === item.id && !state.completed.has(item.id)
        ? state.session
        : null;
    state.caseId = item.id;
    state.docketChapterId = item.chapter;
    state.phase = saved ? saved.phase : 0;
    state.seenClaim = saved ? saved.seenClaim : false;
    state.seenEvidence = saved ? saved.seenEvidence : false;
    state.investigationSolved = saved ? saved.investigationSolved : false;
    state.challengeSolved = saved ? Boolean(saved.challengeSolved) : false;
    state.crossSolved = saved ? saved.crossSolved : false;
    state.clueSolved = saved ? Boolean(saved.clueSolved) : false;
    state.clueCells =
      saved && Array.isArray(saved.clueCells)
        ? saved.clueCells.filter((n) => Number.isInteger(n) && n >= 0 && n < 9)
        : [];
    state.clueValue =
      saved && Number.isFinite(Number(saved.clueValue)) ? Number(saved.clueValue) : null;
    state.clueOrder =
      saved && Array.isArray(saved.clueOrder) ? saved.clueOrder.slice(0, 3).map(Number) : null;
    state.visualMode =
      saved && ["model", "compare", "trace"].includes(saved.visualMode)
        ? saved.visualMode
        : "model";
    state.visualFocus =
      saved && Number.isInteger(saved.visualFocus)
        ? Math.max(0, Math.min(4, saved.visualFocus))
        : 0;
    state.verdictChosen = saved ? saved.verdictChosen : null;
    state.lab = saved && saved.lab ? normaliseLab(saved.lab, item) : freshLab(item);
    state.feedback = "";
    state.feedbackKind = "";
    syncSession();
    const docket = $("mc-docket"),
      play = $("mc-play");
    if (docket) docket.hidden = true;
    if (play) play.hidden = false;
    renderCase();
    scrollCaseIntoView();
  }
  function resume() {
    if (state.session) openCase(state.session.caseId);
    else openCase(data().cases.find((item) => !state.completed.has(item.id))?.id || 1);
  }
  function back() {
    goDocket();
  }
  function advance() {
    const item = data().getCase(state.caseId);
    if (state.phase === 2 && !(state.investigationSolved && state.challengeSolved)) {
      setFeedback(
        "Solve both linked mathematical tasks before admitting the exhibits. You can retry without losing progress.",
        "hint",
      );
      return;
    }
    if (state.phase === 3 && !state.clueSolved) {
      setFeedback(
        "Explore the new clue and complete its hands-on move before continuing. You can try again.",
        "hint",
      );
      return;
    }
    if (state.phase === 4 && !state.crossSolved) {
      setFeedback("Choose the strongest line of cross-examination first.", "hint");
      return;
    }
    if (state.phase === 5 && !state.verdictChosen) {
      setFeedback("Select a verdict and support it with what you have learned.", "hint");
      return;
    }
    if (state.phase === 5 && normalVerdict(state.verdictChosen) !== normalVerdict(item.verdict)) {
      setFeedback("Reconsider the claim and the exhibits. You may revise your verdict.", "hint");
      return;
    }
    if (state.phase < 6) {
      state.phase++;
      if (state.phase === 1) {
        state.seenClaim = true;
        state.seenEvidence = true;
      }
      state.feedback = "";
      state.feedbackKind = "";
      syncSession();
      renderCase();
      scrollCaseIntoView();
      return;
    }
    if (!state.completed.has(item.id)) state.completed.add(item.id);
    state.session = null;
    persist();
    if (item.id < 100) {
      openCase(item.id + 1);
    } else {
      goDocket();
    }
  }
  function chooseEvidence(which) {
    if (which === "claim") state.seenClaim = true;
    if (which === "evidence") state.seenEvidence = true;
    syncSession();
    renderCase();
  }
  function rotatedChoices(choices, correct, id) {
    const shift = id % choices.length;
    const sorted = choices.slice(shift).concat(choices.slice(0, shift));
    return { choices: sorted, correct: (correct - shift + choices.length) % choices.length };
  }
  function expectedNumericChoice(choice) {
    const text = String(choice == null ? "" : choice)
      .replace(/,/g, "")
      .trim();
    if (
      /[=+×÷*\/]/.test(text) ||
      /\d\s*(?:to|through|[-–—])\s*\d/i.test(text) ||
      /\b(?:between|range|not enough|unknown|cannot be determined)\b/i.test(text)
    )
      return null;
    const numbers = [...text.matchAll(/-?\d+(?:\.\d+)?/g)];
    return numbers.length === 1 ? Number(numbers[0][0]) : null;
  }
  function submitPatternPrediction() {
    const input = $("mc-pattern-prediction");
    if (!input || input.value.trim() === "") {
      setFeedback("Type the next number you predict, then place it in the garden.", "hint");
      return;
    }
    const next = Number(input.value);
    if (!Number.isFinite(next)) {
      setFeedback("Enter a number to test your pattern idea.", "hint");
      return;
    }
    if (state.lab.patternPrediction !== next) {
      state.lab.patternPrediction = next;
      markLabPlay();
    }
    state.lab.note = "Prediction placed on the path.";
    refreshCaseKeepingScroll();
  }
  function selectDataRecord(index) {
    const item = data().getCase(state.caseId),
      task = state.investigationSolved ? 2 : 1;
    if (!Number.isInteger(index) || index < 0 || index >= dataGoal(item, task).values.length)
      return;
    if (state.lab.dataSelection === index) return;
    state.lab.dataSelection = index;
    markLabPlay();
    refreshCaseKeepingScroll();
  }
  function updateWorkshopCheckAfterPlay() {
    const check = document.querySelector(".mc-workshop-check");
    if (!check) return;
    check.classList.remove("is-solved");
    const icon = check.querySelector(".mc-workshop-check-icon");
    if (icon) icon.textContent = "✦";
    const button = check.querySelector("button");
    if (button) button.textContent = "Check my model";
    check.querySelector(".mc-workshop-complete")?.remove();
    state.lab.goalSolved = false;
    state.feedback = "";
    state.feedbackKind = "";
    const feedback = $("mc-feedback");
    if (feedback) {
      feedback.textContent = "";
      feedback.className = "mc-feedback";
    }
  }
  function checkPlayGoal() {
    const item = data().getCase(state.caseId),
      task = state.investigationSolved ? 2 : 1;
    if (!state.lab) return;
    const baseline = task === 2 ? state.lab.challengeBaseline : 0;
    if (state.lab.playCount <= baseline) {
      state.lab.goalSolved = false;
      setFeedback(
        task === 1
          ? "Try the maths playground first. Build, change or explore the model, then check it."
          : "Make a fresh move for the second challenge before checking the new model.",
        "hint",
      );
      refreshCaseKeepingScroll();
      return;
    }
    if (playGoalMet(item, task)) {
      state.lab.goalSolved = true;
      setFeedback(
        "✨ Workshop goal complete! Your model matches the challenge. Now use that finding in the case.",
        "success",
      );
    } else {
      state.lab.goalSolved = false;
      setFeedback(playGoal(item, task).hint, "hint");
    }
    refreshCaseKeepingScroll();
  }

  function answerInvestigation(index) {
    const item = data().getCase(state.caseId);
    if (!state.lab || !state.lab.goalSolved || !playGoalMet(item, 1)) {
      setFeedback(
        state.lab && state.lab.playCount > 0
          ? playGoal(item, 1).hint
          : "Try the hands-on maths challenge first, then check your model before choosing the court's answer.",
        "hint",
      );
      syncSession();
      renderCase();
      return;
    }
    if (index === item.answer) {
      state.investigationSolved = true;
      state.lab.challengeBaseline = state.lab.playCount;
      state.lab.goalSolved = false;
      setFeedback(
        "✨ Aha! Your model fits the workshop goal. Exhibit verified. " + item.explanation,
        "success",
      );
    } else {
      setFeedback(
        "You have the model ready. Compare its evidence with the story and try another conclusion.",
        "hint",
      );
    }
    syncSession();
    renderCase();
  }
  function answerChallenge(index) {
    const item = data().getCase(state.caseId),
      challenge = item.challenge;
    if (
      !state.lab ||
      state.lab.playCount <= state.lab.challengeBaseline ||
      !state.lab.goalSolved ||
      !playGoalMet(item, 2)
    ) {
      setFeedback(
        state.lab && state.lab.playCount > state.lab.challengeBaseline
          ? playGoal(item, 2).hint
          : "Complete a fresh hands-on challenge for the second exhibit before choosing its result.",
        "hint",
      );
      syncSession();
      renderCase();
      return;
    }
    if (index === challenge.answer) {
      state.challengeSolved = true;
      setFeedback(
        "✨ Second workshop goal complete! Exhibit verified. " + challenge.explanation,
        "success",
      );
    } else {
      setFeedback(
        "Your model is ready. Compare the new clue with the result and try another conclusion.",
        "hint",
      );
    }
    syncSession();
    renderCase();
  }
  function answerCross(index) {
    const item = data().getCase(state.caseId),
      check = data().checks[item.check];
    const rotated = rotatedChoices(check.choices, check.correct, item.id);
    if (index === rotated.correct) {
      state.crossSolved = true;
      setFeedback(
        "✨ Excellent question. You used curiosity and respect to help everyone learn.",
        "success",
      );
    } else {
      setFeedback(
        "Try a question that reveals a detail, tests an assumption or compares the evidence.",
        "hint",
      );
    }
    syncSession();
    renderCase();
  }
  function selectVerdict(id) {
    const item = data().getCase(state.caseId);
    if (normalVerdict(id) === normalVerdict(item.verdict)) {
      state.verdictChosen = id;
      setFeedback("🌟 A thoughtful conclusion. You matched the idea to the evidence.", "success");
    } else {
      state.verdictChosen = null;
      setFeedback(
        "Let’s compare the idea with both exhibits and choose the conclusion that best matches what we learned.",
        "hint",
      );
    }
    syncSession();
    renderCase();
  }
  function hintFor(item) {
    const hints = {
      calculation: "Write the known values first, then check with the inverse operation.",
      records: "Compare dates, original entries and whether a person or item was counted twice.",
      assumptions: "Ask what condition must be true for the claim to hold.",
      definition: "Restate the mathematical term in your own words.",
      comparison: "Use the same unit, denominator, time span or group size for both sides.",
      units: "Convert to compatible units before comparing.",
      constraints: "Check each condition and the overall limit.",
      representation: "Read the axis, labels and scale before trusting the visual size.",
      sample: "Ask who was included, who was left out and how many observations were made.",
      causation: "A relationship alone does not show which event caused the other.",
      logic: "Check if the conclusion follows from every premise; test an alternative.",
    };
    return (
      hints[item.check] || "Return to the source exhibit and check what the claim really says."
    );
  }

  function visualNumbers(item) {
    const textSource = [
      item.evidence,
      item.story,
      item.prompt,
      item.challenge && item.challenge.prompt,
    ].join(" ");
    const matches = [...textSource.matchAll(/-?\d[\d,]*(?:\.\d+)?/g)];
    const values = [];
    for (const match of matches) {
      const number = Number(match[0].replace(/,/g, ""));
      if (Number.isFinite(number) && Math.abs(number) <= 100000 && !values.includes(number))
        values.push(number);
      if (values.length === 5) break;
    }
    return values.length ? values : [3, 5, 8, 13];
  }
  function visualHeading(item) {
    const headings = {
      1: "Number blocks & quantities",
      2: "Number patterns & properties",
      3: "Fractions & fair shares",
      4: "Shapes, space & measurement",
      5: "Time, distance & units",
      6: "Data you can see",
      7: "Rules, equations & logic",
      8: "Fair shares & decisions",
      9: "Routes & constraints",
      10: "The town-planning evidence board",
    };
    return headings[item.chapter] || "Explore the evidence";
  }
  function svgBars(values, focus, labels) {
    const max = Math.max(1, ...values.map((v) => Math.abs(v)));
    return (
      '<svg viewBox="0 0 720 250" role="img" aria-label="Interactive evidence bars" data-visual-mode="compare">' +
      '<line x1="160" y1="32" x2="160" y2="210" stroke="#c9c0d3" stroke-width="2"/>' +
      values
        .map((v, i) => {
          const y = 38 + i * 39,
            w = Math.max(4, (Math.abs(v) / max) * 445);
          return (
            '<g class="mc-svg-pick ' +
            (focus === i ? "is-focused" : "") +
            '" role="button" tabindex="0" aria-label="Focus ' +
            esc(labels[i]) +
            '" onclick="MathCourt.focusVisual(' +
            i +
            ')">' +
            '<text x="12" y="' +
            (y + 17) +
            '" class="mc-svg-label">' +
            esc(labels[i]) +
            "</text>" +
            '<rect x="160" y="' +
            y +
            '" width="' +
            w +
            '" height="24" rx="7" class="mc-svg-bar ' +
            (focus === i ? "is-focused" : "") +
            '"/>' +
            '<text x="' +
            Math.min(665, 174 + w) +
            '" y="' +
            (y + 17) +
            '" class="mc-svg-number">' +
            esc(String(v)) +
            "</text></g>"
          );
        })
        .join("") +
      '<text x="160" y="235" class="mc-svg-note">Each bar uses the recorded value as its scale.</text></svg>'
    );
  }
  function renderModelSvg(item, values, focus) {
    const v = values.slice(0, 4),
      max = Math.max(1, ...v.map((n) => Math.abs(n)));
    const title = item.title.toLowerCase();
    if (item.chapter <= 2) {
      const cards = v
        .map(
          (n, i) =>
            '<g class="mc-svg-pick ' +
            (focus === i ? "is-focused" : "") +
            '" role="button" tabindex="0" onclick="MathCourt.focusVisual(' +
            i +
            ")\" onkeydown=\"if(event.key==='Enter'||event.key===' '){event.preventDefault();MathCourt.focusVisual(" +
            i +
            ')}" aria-label="Inspect value ' +
            esc(String(n)) +
            '"><rect x="' +
            (22 + i * 172) +
            '" y="35" width="150" height="104" rx="16" class="mc-svg-card ' +
            (focus === i ? "is-focused" : "") +
            '"/><text x="' +
            (97 + i * 172) +
            '" y="63" text-anchor="middle" class="mc-svg-note">RECORD ' +
            (i + 1) +
            '</text><text x="' +
            (97 + i * 172) +
            '" y="105" text-anchor="middle" class="mc-svg-big">' +
            esc(String(n)) +
            '</text><rect x="' +
            (34 + i * 172) +
            '" y="151" width="' +
            (126 * Math.abs(n)) / max +
            '" height="12" rx="6" class="mc-svg-bar ' +
            (focus === i ? "is-focused" : "") +
            '"/></g>',
        )
        .join("");
      return (
        '<svg viewBox="0 0 720 205" role="img" aria-label="Number blocks showing quantities from the case" data-visual-mode="model">' +
        cards +
        '<text x="22" y="192" class="mc-svg-note">Select a number block. The matching value is highlighted below.</text></svg>'
      );
    }
    if (item.chapter === 3) {
      const fractions = [
        ...[item.evidence, item.story, item.prompt].join(" ").matchAll(/(\d+)\s*\/\s*(\d+)/g),
      ]
        .slice(0, 2)
        .map((m) => ({ n: Number(m[1]), d: Number(m[2]) }));
      if (fractions.length) {
        return (
          '<svg viewBox="0 0 720 205" role="img" aria-label="Fraction strips split into equal parts" data-visual-mode="model">' +
          fractions
            .map((f, i) => {
              const y = 34 + i * 76,
                segments = Math.min(20, Math.max(1, f.d)),
                width = 520 / segments,
                filled = Math.min(f.n, segments);
              return (
                '<text x="20" y="' +
                (y + 23) +
                '" class="mc-svg-label">SHARE ' +
                (i + 1) +
                " · " +
                f.n +
                "/" +
                f.d +
                "</text>" +
                Array.from(
                  { length: segments },
                  (_, j) =>
                    '<rect x="' +
                    (185 + j * width) +
                    '" y="' +
                    y +
                    '" width="' +
                    (width - 3) +
                    '" height="40" rx="3" class="mc-svg-segment ' +
                    (j < filled ? "is-filled" : "") +
                    " " +
                    (focus === i ? "is-focused" : "") +
                    '"/>',
                ).join("") +
                '<text x="715" y="' +
                (y + 58) +
                '" text-anchor="end" class="mc-svg-note">' +
                f.n +
                " of " +
                f.d +
                " equal parts</text>"
              );
            })
            .join("") +
          "</svg>"
        );
      }
      return svgBars(
        v,
        focus,
        v.map((_, i) => "Share " + (i + 1)),
      ).replace('data-visual-mode="compare"', 'data-visual-mode="model"');
    }
    if (item.chapter === 4) {
      if (/wheel|round|circle|circumference/.test(title)) {
        return (
          '<svg viewBox="0 0 720 220" role="img" aria-label="Circle with diameter and circumference" data-visual-mode="model"><circle cx="260" cy="110" r="76" fill="#e6f2ec" stroke="#267b70" stroke-width="4"/><line x1="184" y1="110" x2="336" y2="110" stroke="#694c83" stroke-width="3" stroke-dasharray="6 5"/><text x="260" y="99" text-anchor="middle" class="mc-svg-big">' +
          esc(String(v[0] || 7)) +
          '</text><text x="390" y="80" class="mc-svg-label">ACROSS THE STAGE</text><text x="390" y="113" class="mc-svg-big">diameter</text><text x="390" y="152" class="mc-svg-note">Around the edge = circumference</text></svg>'
        );
      }
      if (/turn|direction|compass|sign|coordinate|map/.test(title)) {
        return (
          '<svg viewBox="0 0 720 220" role="img" aria-label="Compass and ordered coordinate grid" data-visual-mode="model"><g transform="translate(150 108)"><circle r="76" fill="#f4eef8" stroke="#b8a6c8" stroke-width="2"/><path d="M0 -62 L18 0 L0 15 L-18 0 Z" fill="#694c83"/><path d="M0 62 L-12 5 L0 16 L12 5 Z" fill="#c9bfd3"/><text x="0" y="-91" text-anchor="middle" class="mc-svg-label">N</text><text x="91" y="5" class="mc-svg-label">E</text><text x="0" y="101" text-anchor="middle" class="mc-svg-label">S</text><text x="-103" y="5" text-anchor="middle" class="mc-svg-label">W</text></g><g transform="translate(375 24)">' +
          Array.from(
            { length: 7 },
            (_, i) =>
              '<line x1="' +
              i * 40 +
              '" y1="0" x2="' +
              i * 40 +
              '" y2="170" stroke="#ddd7e4"/><line x1="0" y1="' +
              i * 28 +
              '" x2="240" y2="' +
              i * 28 +
              '" stroke="#ddd7e4"/>',
          ).join("") +
          '<circle cx="' +
          Math.min(5, Math.abs(v[0] || 3) % 6) * 40 +
          '" cy="' +
          Math.min(5, Math.abs(v[1] || 2) % 6) * 28 +
          '" r="8" fill="#267b70"/><text x="0" y="194" class="mc-svg-note">Ordered positions: (x, y)</text></g></svg>'
        );
      }
      if (/ramp|shadow|tower|slope/.test(title)) {
        return (
          '<svg viewBox="0 0 720 220" role="img" aria-label="Rise and run triangle" data-visual-mode="model"><path d="M95 180 L95 54 L470 180 Z" fill="#f3eef8" stroke="#694c83" stroke-width="4"/><path d="M95 180 L470 180" stroke="#267b70" stroke-width="5"/><text x="55" y="110" class="mc-svg-label" transform="rotate(-90 55 110)">RISE</text><text x="260" y="210" text-anchor="middle" class="mc-svg-label">RUN</text><text x="520" y="90" class="mc-svg-big">' +
          esc(String(v[0] || 2)) +
          " : " +
          esc(String(v[1] || 5)) +
          '</text><text x="520" y="124" class="mc-svg-note">rise : run</text></svg>'
        );
      }
      return (
        '<svg viewBox="0 0 720 220" role="img" aria-label="Rectangle grid to explore area and perimeter" data-visual-mode="model"><g transform="translate(35 24)">' +
        Array.from({ length: 8 }, (_, i) =>
          Array.from(
            { length: 12 },
            (_, j) =>
              '<rect x="' +
              j * 25 +
              '" y="' +
              i * 20 +
              '" width="23" height="18" rx="2" fill="' +
              ((i + j) % 2 === 0 ? "#e7f2ec" : "#f3eef8") +
              '" stroke="#c8bcd4" stroke-width=".8"/>',
          ).join(""),
        ).join("") +
        '</g><path d="M35 209 L335 209 M35 205 L35 213 M335 205 L335 213" stroke="#694c83" stroke-width="2"/><text x="390" y="76" class="mc-svg-label">MEASUREMENTS IN RECORD</text><text x="390" y="110" class="mc-svg-big">' +
        esc(String(v[0] || 3)) +
        " × " +
        esc(String(v[1] || 8)) +
        '</text><text x="390" y="145" class="mc-svg-note">Inside squares show area.</text><text x="390" y="170" class="mc-svg-note">Outside edges show perimeter.</text></svg>'
      );
    }
    if (item.chapter === 5) {
      const maxT = Math.max(1, ...v.map((n) => Math.abs(n)));
      return (
        '<svg viewBox="0 0 720 205" role="img" aria-label="Timeline or measuring scale" data-visual-mode="model"><line x1="40" y1="105" x2="680" y2="105" stroke="#694c83" stroke-width="4" stroke-linecap="round"/>' +
        v
          .map((n, i) => {
            const x = 55 + (Math.abs(n) / maxT) * 590;
            return (
              '<g class="mc-svg-pick ' +
              (focus === i ? "is-focused" : "") +
              '" role="button" tabindex="0" onclick="MathCourt.focusVisual(' +
              i +
              ")\" onkeydown=\"if(event.key==='Enter'||event.key===' '){event.preventDefault();MathCourt.focusVisual(" +
              i +
              ')}" aria-label="Inspect marker ' +
              esc(String(n)) +
              '"><line x1="' +
              x +
              '" y1="84" x2="' +
              x +
              '" y2="128" stroke="#267b70" stroke-width="4"/><circle cx="' +
              x +
              '" cy="105" r="' +
              (focus === i ? 12 : 8) +
              '" fill="' +
              (focus === i ? "#694c83" : "#267b70") +
              '"/><text x="' +
              x +
              '" y="64" text-anchor="middle" class="mc-svg-number">' +
              esc(String(n)) +
              '</text><text x="' +
              x +
              '" y="151" text-anchor="middle" class="mc-svg-note">' +
              (i === 0 ? "START" : i === v.length - 1 ? "END" : "MARK " + (i + 1)) +
              "</text></g>"
            );
          })
          .join("") +
        '<text x="40" y="190" class="mc-svg-note">Compare gaps between marks, not only their positions.</text></svg>'
      );
    }
    if (item.chapter === 6)
      return svgBars(
        v,
        focus,
        v.map((_, i) => "Record " + (i + 1)),
      ).replace('data-visual-mode="compare"', 'data-visual-mode="model"');
    if (item.chapter === 7) {
      return (
        '<svg viewBox="0 0 720 220" role="img" aria-label="Rule machine and equation model" data-visual-mode="model"><rect x="25" y="60" width="155" height="92" rx="17" class="mc-svg-card"/><text x="102" y="88" text-anchor="middle" class="mc-svg-note">INPUT</text><text x="102" y="127" text-anchor="middle" class="mc-svg-big">' +
        esc(String(v[0] || 3)) +
        '</text><path d="M186 106 L251 106 M239 95 L251 106 L239 117" fill="none" stroke="#694c83" stroke-width="4"/><rect x="260" y="45" width="195" height="122" rx="18" fill="#f3eef8" stroke="#c9bad8" stroke-width="2"/><text x="357" y="80" text-anchor="middle" class="mc-svg-note">TEST THE RULE</text><text x="357" y="119" text-anchor="middle" class="mc-svg-big">f(x)</text><text x="357" y="143" text-anchor="middle" class="mc-svg-note">same input → same output</text><path d="M461 106 L523 106 M511 95 L523 106 L511 117" fill="none" stroke="#267b70" stroke-width="4"/><rect x="532" y="60" width="160" height="92" rx="17" class="mc-svg-card ' +
        (focus === 1 ? "is-focused" : "") +
        '"/><text x="612" y="88" text-anchor="middle" class="mc-svg-note">OUTPUT</text><text x="612" y="127" text-anchor="middle" class="mc-svg-big">' +
        esc(String(v[1] || 7)) +
        '</text><text x="25" y="195" class="mc-svg-note">Change one condition at a time; test whether the rule still fits.</text></svg>'
      );
    }
    if (item.chapter === 8) {
      return (
        '<svg viewBox="0 0 720 225" role="img" aria-label="Allocation bars for comparing fair shares" data-visual-mode="model">' +
        v
          .slice(0, 3)
          .map((n, i) => {
            const x = 34 + i * 230,
              w = Math.max(5, (Math.abs(n) / max) * 174);
            return (
              '<g class="mc-svg-pick ' +
              (focus === i ? "is-focused" : "") +
              '" role="button" tabindex="0" onclick="MathCourt.focusVisual(' +
              i +
              ')" aria-label="Inspect share ' +
              (i + 1) +
              '"><text x="' +
              x +
              '" y="32" class="mc-svg-label">GROUP ' +
              String.fromCharCode(65 + i) +
              '</text><rect x="' +
              x +
              '" y="52" width="184" height="108" rx="12" fill="#f4f0f8" stroke="#d5c9e0"/><rect x="' +
              (x + 5) +
              '" y="' +
              (155 - w * 0.48) +
              '" width="174" height="' +
              w * 0.48 +
              '" rx="7" class="mc-svg-bar ' +
              (focus === i ? "is-focused" : "") +
              '"/><text x="' +
              (x + 92) +
              '" y="190" text-anchor="middle" class="mc-svg-big">' +
              esc(String(n)) +
              '</text><text x="' +
              (x + 92) +
              '" y="213" text-anchor="middle" class="mc-svg-note">Compare the rule</text></g>'
            );
          })
          .join("") +
        "</svg>"
      );
    }
    if (item.chapter === 9) {
      return (
        '<svg viewBox="0 0 720 225" role="img" aria-label="Route network with weighted paths" data-visual-mode="model"><path d="M105 62 L338 43 L598 83 L511 178 L250 183 Z M105 62 L250 183 M338 43 L511 178" fill="none" stroke="#b8a8c8" stroke-width="5" stroke-linejoin="round"/>' +
        [
          [105, 62],
          [338, 43],
          [598, 83],
          [511, 178],
          [250, 183],
        ]
          .map(
            (p, i) =>
              '<circle cx="' +
              p[0] +
              '" cy="' +
              p[1] +
              '" r="18" fill="' +
              (focus === i ? "#694c83" : "#d9eee5") +
              '" stroke="' +
              (focus === i ? "#4e3565" : "#267b70") +
              '" stroke-width="3"/><text x="' +
              p[0] +
              '" y="' +
              (p[1] + 5) +
              '" text-anchor="middle" class="mc-svg-label">' +
              String.fromCharCode(65 + i) +
              "</text>",
          )
          .join("") +
        '<text x="360" y="216" text-anchor="middle" class="mc-svg-note">Compare the total route cost, not just the number of edges.</text></svg>'
      );
    }
    return (
      '<svg viewBox="0 0 720 225" role="img" aria-label="Connected planning board showing resources, rules and outcomes" data-visual-mode="model">' +
      ["RESOURCE", "RULE", "OUTCOME"]
        .map(
          (label, i) =>
            '<g class="mc-svg-pick ' +
            (focus === i ? "is-focused" : "") +
            '" role="button" tabindex="0" onclick="MathCourt.focusVisual(' +
            i +
            ')" aria-label="Inspect ' +
            label +
            '"><rect x="' +
            (20 + i * 240) +
            '" y="37" width="205" height="124" rx="18" class="mc-svg-card ' +
            (focus === i ? "is-focused" : "") +
            '"/><text x="' +
            (122 + i * 240) +
            '" y="67" text-anchor="middle" class="mc-svg-note">' +
            label +
            '</text><text x="' +
            (122 + i * 240) +
            '" y="115" text-anchor="middle" class="mc-svg-big">' +
            esc(String(v[i] === undefined ? "?" : v[i])) +
            "</text></g>" +
            (i < 2
              ? '<path d="M230 96 L252 96 M244 88 L252 96 L244 104" stroke="#694c83" stroke-width="4" fill="none"/>'
              : ""),
        )
        .join("") +
      '<text x="360" y="199" text-anchor="middle" class="mc-svg-note">A sound plan must satisfy every constraint.</text></svg>'
    );
  }
  function renderVisualBoard(item) {
    const values = visualNumbers(item),
      focus = Math.min(state.visualFocus, values.length - 1);
    const labels = values.map((_, i) => "Value " + (i + 1)),
      mode = state.visualMode;
    const svg =
      mode === "compare"
        ? svgBars(values, focus, labels)
        : mode === "trace"
          ? '<svg viewBox="0 0 720 205" role="img" aria-label="Trace how the evidence becomes a conclusion" data-visual-mode="trace">' +
            ["SOURCE", "MATHEMATICAL MODEL", "CHECK THE CLAIM"]
              .map(
                (label, i) =>
                  '<g class="mc-svg-pick ' +
                  (focus === i ? "is-focused" : "") +
                  '" role="button" tabindex="0" onclick="MathCourt.focusVisual(' +
                  i +
                  ')" aria-label="Inspect ' +
                  label +
                  '"><rect x="' +
                  (18 + i * 240) +
                  '" y="40" width="206" height="112" rx="18" class="mc-svg-card ' +
                  (focus === i ? "is-focused" : "") +
                  '"/><text x="' +
                  (121 + i * 240) +
                  '" y="70" text-anchor="middle" class="mc-svg-note">' +
                  label +
                  '</text><text x="' +
                  (121 + i * 240) +
                  '" y="117" text-anchor="middle" class="mc-svg-big">' +
                  esc(String(values[i] === undefined ? "?" : values[i])) +
                  "</text></g>" +
                  (i < 2
                    ? '<path d="M229 96 L251 96 M243 88 L251 96 L243 104" stroke="#267b70" stroke-width="3" fill="none"/>'
                    : ""),
              )
              .join("") +
            '<text x="360" y="185" text-anchor="middle" class="mc-svg-note">Do the records, model and conclusion agree?</text></svg>'
          : renderModelSvg(item, values, focus);
    const explanation =
      mode === "compare"
        ? "Compare the size and gaps between evidence values. A longer bar means a larger value on this shared scale."
        : mode === "trace"
          ? "Follow the evidence from source to model to check. If one link is weak, the conclusion needs review."
          : "This is a visual model of the quantities or relationships mentioned in the case. Select a value to highlight it before answering.";
    return (
      '<section class="mc-visual-lab" aria-label="Interactive visual maths workbench"><div class="mc-visual-header"><div><span class="mc-kicker">VISUAL EVIDENCE TABLE</span><h3>' +
      esc(visualHeading(item)) +
      '</h3><p>Explore the picture, compare the evidence and work out what it really shows.</p></div><span class="mc-visual-stamp" aria-hidden="true">✦</span></div>' +
      '<div class="mc-visual-tabs" role="group" aria-label="Choose a visual representation">' +
      [
        { id: "model", label: "Build the model" },
        { id: "compare", label: "Compare values" },
        { id: "trace", label: "Trace the evidence" },
      ]
        .map(
          (t) =>
            '<button type="button" class="mc-visual-tab ' +
            (mode === t.id ? "is-active" : "") +
            '" data-mode="' +
            t.id +
            '" aria-pressed="' +
            (mode === t.id ? "true" : "false") +
            '" onclick="MathCourt.setVisualMode(this.dataset.mode)">' +
            t.label +
            "</button>",
        )
        .join("") +
      '</div><div class="mc-visual-stage">' +
      svg +
      '</div><div class="mc-visual-footer"><p>' +
      explanation +
      '</p><div class="mc-visual-picks" role="group" aria-label="Inspect a source value">' +
      values
        .map(
          (v, i) =>
            '<button type="button" class="mc-value-chip ' +
            (focus === i ? "is-active" : "") +
            '" aria-pressed="' +
            (focus === i ? "true" : "false") +
            '" onclick="MathCourt.focusVisual(' +
            i +
            ')"><span>' +
            (i + 1) +
            "</span>" +
            esc(String(v)) +
            "</button>",
        )
        .join("") +
      "</div></div></section>"
    );
  }
  function setVisualMode(mode) {
    if (!["model", "compare", "trace"].includes(mode)) return;
    state.visualMode = mode;
    syncSession();
    renderCase();
  }
  function focusVisual(index) {
    state.visualFocus = Math.max(0, Math.min(4, Number(index) || 0));
    syncSession();
    renderCase();
  }

  function renderAnswerTiles(options, task) {
    const action = task === "investigation" ? "answerInvestigation" : "answerChallenge";
    const symbols = ["◆", "◉", "△"];
    return (
      '<div class="mc-answer-game"><p class="mc-answer-instruction">Choose the result you can prove. Tap a tile to test it, or drag it onto the evidence tray.</p>' +
      '<div class="mc-answer-tiles">' +
      options
        .map(
          (option, i) =>
            '<button type="button" class="mc-answer-tile" draggable="true" data-task="' +
            task +
            '" aria-label="Test result ' +
            esc(String(option)) +
            '" ondragstart="MathCourt.startAnswerDrag(' +
            i +
            ', this.dataset.task, event)" onclick="MathCourt.' +
            action +
            "(" +
            i +
            ')"><span class="mc-answer-symbol" aria-hidden="true">' +
            symbols[i % symbols.length] +
            '</span><span class="mc-answer-letter">RESULT ' +
            String.fromCharCode(65 + i) +
            "</span><strong>" +
            esc(String(option)) +
            "</strong></button>",
        )
        .join("") +
      "</div>" +
      '<div class="mc-answer-dropzone" data-task="' +
      task +
      '" role="group" aria-label="Evidence tray" ondragover="event.preventDefault()" ondrop="MathCourt.dropAnswer(this.dataset.task,event)"><span class="mc-tray-symbol" aria-hidden="true">⚖️</span><span><strong>Evidence tray</strong><small>Drop your chosen result here</small></span><span class="mc-tray-arrow" aria-hidden="true">↓</span></div></div>'
    );
  }
  function startAnswerDrag(index, task, event) {
    if (!event || !event.dataTransfer) return;
    event.dataTransfer.setData("text/plain", String(index));
    event.dataTransfer.setData("application/x-mfa-math-court-task", task);
    event.dataTransfer.effectAllowed = "copy";
  }
  function dropAnswer(task, event) {
    if (!event) return;
    event.preventDefault();
    if (!event.dataTransfer) return;
    const carriedTask = event.dataTransfer.getData("application/x-mfa-math-court-task");
    const index = Number(event.dataTransfer.getData("text/plain"));
    if (carriedTask && carriedTask !== task) {
      setFeedback("Keep the result with its matching mathematical exhibit.", "hint");
      return;
    }
    if (!Number.isInteger(index) || index < 0) {
      setFeedback("Pick up a result tile first.", "hint");
      return;
    }
    if (task === "investigation") answerInvestigation(index);
    else if (task === "challenge") answerChallenge(index);
  }

  const patternRuleIds = ["add1", "add2", "add3", "double"];
  const fractionGoals = [
    [1, 2],
    [1, 3],
    [2, 3],
    [1, 4],
    [3, 4],
    [2, 6],
    [3, 8],
    [5, 10],
  ];
  const machineRuleIds = ["doublePlusOne", "add3", "triple", "square"];
  function patternGoal(item, task) {
    const rule = patternRuleIds[(item.id + task - 1) % patternRuleIds.length];
    const seed = 2 + ((item.id + task * 2) % 7);
    const step = rule === "add1" ? 1 : rule === "add2" ? 2 : rule === "add3" ? 3 : null;
    const sequence =
      step === null ? [seed, seed * 2, seed * 4] : [seed, seed + step, seed + 2 * step];
    const next = step === null ? seed * 8 : seed + 3 * step;
    return { rule, sequence, next };
  }
  function fractionGoal(item, task) {
    const pair = fractionGoals[(item.id * 3 + task - 1) % fractionGoals.length];
    return { numerator: pair[0], denominator: pair[1] };
  }
  function shapeGoal(item, task) {
    const choices = [
      [6, 10],
      [7, 12],
      [8, 12],
    ];
    const pair = choices[(item.id + task - 1) % choices.length];
    return { area: pair[0], perimeter: pair[1] };
  }
  function timelineGoal(item, task) {
    return 20 + ((item.id * 3 + task * 4) % 17) * 5;
  }
  function dataGoal(item, task) {
    const values = visualNumbers(item)
      .slice(0, 4)
      .map((value) => Math.abs(value));
    const target = task === 1 ? Math.max(...values) : Math.min(...values);
    return {
      values,
      targetIndex: values.indexOf(target),
      which: task === 1 ? "largest" : "smallest",
    };
  }
  function ruleGoal(item, task) {
    const rule = machineRuleIds[(item.id + task - 1) % machineRuleIds.length];
    const input = 4 + (item.id % 3);
    const output =
      rule === "doublePlusOne"
        ? 2 * input + 1
        : rule === "add3"
          ? input + 3
          : rule === "triple"
            ? 3 * input
            : input * input;
    return { rule, input, output };
  }
  function shareGoal(item, task) {
    return {
      total: 12,
      minimums: [1 + (item.id % 3), 1 + ((item.id + task) % 3), 1 + ((item.id + 2 * task) % 3)],
    };
  }
  function routeGoal() {
    return { start: 0, end: 2, maxLength: 7 };
  }
  function townGoal(item, task) {
    return {
      total: 12,
      minimums: [2 + (item.id % 2), 1 + ((item.id + task) % 3), 1 + ((item.id + task * 2) % 2)],
    };
  }
  function playGoal(item, task) {
    if (item.chapter === 1) {
      const option =
        task === 1 ? item.options[item.answer] : item.challenge.options[item.challenge.answer];
      return {
        title: task === 1 ? "Forge the first result" : "Forge the linked result",
        instruction:
          "Build a calculation that equals " +
          option +
          ". Use the number tiles and operation buttons, then calculate it.",
        hint:
          "Try different number tiles and operations until the displayed result matches " +
          option +
          ".",
      };
    }
    if (item.chapter === 2) {
      const goal = patternGoal(item, task);
      return {
        title: "Grow the number path",
        instruction:
          "The sequence is " +
          goal.sequence.join(", ") +
          ", … Choose the rule that fits and enter the next number.",
        hint: "Compare the gap between each neighbouring pair. The same rule must fit both gaps.",
      };
    }
    if (item.chapter === 3) {
      const goal = fractionGoal(item, task);
      return {
        title: "Build the target share",
        instruction:
          "Use the fraction strips to make " +
          goal.numerator +
          "/" +
          goal.denominator +
          " of one whole. Change the number of equal parts and the shaded parts.",
        hint: "The denominator counts all equal parts; the numerator counts the shaded parts.",
      };
    }
    if (item.chapter === 4) {
      const goal = shapeGoal(item, task);
      return {
        title: "Build a measured shape",
        instruction:
          "Make one connected shape using exactly " +
          goal.area +
          " squares and " +
          goal.perimeter +
          " outside edge units.",
        hint: "Area counts squares. Perimeter counts the exposed outside edges. Shared edges are not part of the outside.",
      };
    }
    if (item.chapter === 5) {
      const minutes = timelineGoal(item, task);
      return {
        title: "Set the journey time",
        instruction:
          "The journey leaves at 2:35 PM and should arrive at " +
          formatClock(14 * 60 + 35 + minutes) +
          ". Move the timeline to find the duration.",
        hint: "Count the time in hours and minutes. The arrival time should match the goal exactly.",
      };
    }
    if (item.chapter === 6) {
      const goal = dataGoal(item, task);
      return {
        title: "Read the chart carefully",
        instruction:
          "Select the " +
          goal.which +
          " record from the plotted evidence. Read the values as well as the bar lengths.",
        hint: "Compare the numerical labels on every bar. Do not rely on a cropped or zoomed baseline.",
      };
    }
    if (item.chapter === 7) {
      const goal = ruleGoal(item, task);
      return {
        title: "Tune the mystery machine",
        instruction:
          "For input " +
          goal.input +
          ", make the machine display " +
          goal.output +
          ". Choose the rule and set the input.",
        hint: "Test each candidate rule with the exact input. Keep the rule whose output matches the target.",
      };
    }
    if (item.chapter === 8) {
      const goal = shareGoal(item, task);
      return {
        title: "Share the counters with care",
        instruction:
          "Distribute all " +
          goal.total +
          " counters. Groups A, B and C need at least " +
          goal.minimums.join(", ") +
          " counters respectively.",
        hint: "Meet every group's minimum first, then make sure the total is exactly 12.",
      };
    }
    if (item.chapter === 9) {
      return {
        title: "Find the shortest connected journey",
        instruction:
          "Travel from A to C using connected roads with a total journey length of 7 or less. Each road label adds to the total.",
        hint: "Compare A → B → C with routes through D and E. Add every road you travel.",
      };
    }
    const goal = townGoal(item, task);
    return {
      title: "Plan within the shared budget",
      instruction:
        "Allocate exactly " +
        goal.total +
        " tokens. Towns A, B and C need at least " +
        goal.minimums.join(", ") +
        " tokens respectively.",
      hint: "Satisfy each town's minimum, then use the total counter to stay within the 12-token budget.",
    };
  }
  function shapeIsConnected(cells) {
    const set = new Set(cells);
    if (set.size === 0) return false;
    const visited = new Set(),
      queue = [set.values().next().value];
    while (queue.length) {
      const cell = queue.pop();
      if (visited.has(cell)) continue;
      visited.add(cell);
      const row = Math.floor(cell / 8),
        col = cell % 8;
      for (const next of [
        col > 0 ? cell - 1 : -1,
        col < 7 ? cell + 1 : -1,
        row > 0 ? cell - 8 : -1,
        row < 5 ? cell + 8 : -1,
      ]) {
        if (next >= 0 && set.has(next) && !visited.has(next)) queue.push(next);
      }
    }
    return visited.size === set.size;
  }
  function playGoalMet(item, task) {
    const lab = state.lab;
    if (!lab) return false;
    if (item.chapter === 1) {
      const option =
        task === 1 ? item.options[item.answer] : item.challenge.options[item.challenge.answer];
      const expected = expectedNumericChoice(option);
      return (
        expected !== null &&
        lab.calculationResult !== null &&
        Math.abs(lab.calculationResult - expected) <= 0.0001
      );
    }
    if (item.chapter === 2) {
      const goal = patternGoal(item, task);
      return lab.patternRule === goal.rule && lab.patternPrediction === goal.next;
    }
    if (item.chapter === 3) {
      const goal = fractionGoal(item, task);
      return lab.fractionNumerator * goal.denominator === goal.numerator * lab.fractionDenominator;
    }
    if (item.chapter === 4) {
      const goal = shapeGoal(item, task),
        stats = shapeStats();
      return (
        stats.area === goal.area &&
        stats.perimeter === goal.perimeter &&
        shapeIsConnected(lab.cells)
      );
    }
    if (item.chapter === 5) return lab.timelineMinutes === timelineGoal(item, task);
    if (item.chapter === 6) return lab.dataSelection === dataGoal(item, task).targetIndex;
    if (item.chapter === 7) {
      const goal = ruleGoal(item, task);
      return lab.ruleType === goal.rule && lab.ruleInput === goal.input;
    }
    if (item.chapter === 8) {
      const goal = shareGoal(item, task);
      return (
        lab.shares.reduce((sum, n) => sum + n, 0) === goal.total &&
        lab.shares.every((n, i) => n >= goal.minimums[i])
      );
    }
    if (item.chapter === 9) {
      const route = lab.route,
        total = route
          .slice(1)
          .reduce((sum, n, i) => sum + (routeEdge(route[i], n) || [0, 0, 0])[2], 0);
      return (
        route[0] === 0 &&
        route[route.length - 1] === routeGoal().end &&
        total <= routeGoal().maxLength
      );
    }
    const goal = townGoal(item, task),
      total = lab.allocations.reduce((sum, n) => sum + n, 0);
    return total === goal.total && lab.allocations.every((n, i) => n >= goal.minimums[i]);
  }

  function freshLab(item) {
    const nums = visualNumbers(item);
    return {
      slot: "a",
      a: null,
      b: null,
      c: null,
      op: "+",
      op2: "+",
      useThird: false,
      calculationResult: null,
      patternRule: "add3",
      fractionNumerator: 3,
      fractionDenominator: 8,
      cells: [],
      timelineMinutes: 30,
      dataZoom: false,
      dataSelection: null,
      ruleInput: 4,
      ruleType: "doublePlusOne",
      patternPrediction: null,
      goalSolved: false,
      shares: [3, 2, 4],
      route: [0],
      allocations: [3, 3, 2],
      playCount: 0,
      challengeBaseline: 0,
      note: "",
    };
  }
  function normaliseLab(saved, item) {
    const base = freshLab(item);
    const lab = { ...base, ...saved };
    lab.slot = ["a", "b", "c"].includes(lab.slot) ? lab.slot : "a";
    lab.op = ["+", "-", "×", "÷"].includes(lab.op) ? lab.op : "-";
    lab.op2 = ["+", "-", "×", "÷"].includes(lab.op2) ? lab.op2 : "+";
    lab.useThird = Boolean(lab.useThird);
    if (!Number.isInteger(saved.playCount)) {
      lab.a = null;
      lab.b = null;
      lab.c = null;
      lab.op = "+";
      lab.useThird = false;
      lab.calculationResult = null;
    }
    lab.playCount = Math.max(0, Math.floor(Number(lab.playCount) || 0));
    lab.challengeBaseline = Math.max(0, Math.floor(Number(lab.challengeBaseline) || 0));
    lab.patternRule = ["add1", "add2", "add3", "double"].includes(lab.patternRule)
      ? lab.patternRule
      : "add3";
    lab.patternPrediction =
      lab.patternPrediction === null ||
      lab.patternPrediction === undefined ||
      lab.patternPrediction === ""
        ? null
        : Number.isFinite(Number(lab.patternPrediction))
          ? Number(lab.patternPrediction)
          : null;
    lab.dataSelection =
      Number.isInteger(lab.dataSelection) && lab.dataSelection >= 0 && lab.dataSelection < 4
        ? lab.dataSelection
        : null;
    lab.goalSolved = Boolean(lab.goalSolved);
    lab.fractionDenominator = [2, 3, 4, 6, 8, 10, 12].includes(lab.fractionDenominator)
      ? lab.fractionDenominator
      : 8;
    lab.fractionNumerator = Math.max(
      0,
      Math.min(lab.fractionDenominator, Number(lab.fractionNumerator) || 0),
    );
    lab.cells = Array.isArray(lab.cells)
      ? [...new Set(lab.cells.filter((n) => Number.isInteger(n) && n >= 0 && n < 48))]
      : base.cells;
    lab.timelineMinutes = Math.max(0, Math.min(180, Number(lab.timelineMinutes) || 0));
    lab.dataZoom = Boolean(lab.dataZoom);
    lab.ruleInput = Math.max(1, Math.min(12, Number(lab.ruleInput) || 1));
    lab.ruleType = ["doublePlusOne", "add3", "triple", "square"].includes(lab.ruleType)
      ? lab.ruleType
      : "doublePlusOne";
    lab.shares = Array.isArray(lab.shares)
      ? [0, 1, 2].map((i) => Math.max(0, Math.min(15, Number(lab.shares[i]) || 0)))
      : base.shares;
    const validRoute =
      Array.isArray(lab.route) && lab.route.length
        ? lab.route.filter((n) => Number.isInteger(n) && n >= 0 && n < 5)
        : [0];
    lab.route = validRoute.length ? validRoute : [0];
    lab.allocations = Array.isArray(lab.allocations)
      ? [0, 1, 2].map((i) => Math.max(0, Math.min(12, Number(lab.allocations[i]) || 0)))
      : base.allocations;
    return lab;
  }
  function markLabPlay() {
    if (state.lab) {
      state.lab.playCount = Math.max(0, Number(state.lab.playCount) || 0) + 1;
      state.lab.goalSolved = false;
    }
  }
  function refreshCaseKeepingScroll() {
    const active = document.activeElement;
    const canRestore =
      active && active !== document.body && active.closest && active.closest("#mc-stage-content");
    const snapshot = canRestore
      ? {
          tag: active.tagName.toLowerCase(),
          id: active.id || "",
          className: typeof active.className === "string" ? active.className : "",
          dataset: { ...active.dataset },
          label: active.getAttribute("aria-label") || "",
          text: (active.innerText || active.textContent || "").trim(),
          top: active.getBoundingClientRect().top,
        }
      : null;
    const pageY = window.scrollY;
    syncSession();
    renderCase();
    window.scrollTo({ top: pageY, behavior: "auto" });
    if (snapshot) {
      let target = snapshot.id ? document.getElementById(snapshot.id) : null;
      if (!target)
        target =
          Array.from(document.querySelectorAll("#mc-stage-content " + snapshot.tag)).find(
            (node) => {
              if (snapshot.className && node.className !== snapshot.className) return false;
              if (snapshot.label && node.getAttribute("aria-label") !== snapshot.label)
                return false;
              if ((node.innerText || node.textContent || "").trim() !== snapshot.text) return false;
              return Object.entries(snapshot.dataset).every(
                ([key, value]) => node.dataset[key] === value,
              );
            },
          ) || null;
      if (target) {
        target.focus({ preventScroll: true });
        const delta = target.getBoundingClientRect().top - snapshot.top;
        if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: "auto" });
      }
    }
  }
  function scrollCaseIntoView() {
    const target = $("mc-case-header");
    if (!target) return;
    const nav = document.querySelector(".site-header");
    const offset = nav ? nav.getBoundingClientRect().height : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
    window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  }
  function chooseLabSlot(slot) {
    if (!["a", "b", "c"].includes(slot)) return;
    state.lab.slot = slot;
    refreshCaseKeepingScroll();
  }
  function chooseLabNumber(index) {
    const item = data().getCase(state.caseId),
      nums = visualNumbers(item);
    if (!Number.isInteger(index) || index < 0 || index >= nums.length) return;
    if (state.lab[state.lab.slot] === nums[index]) {
      state.lab.note = "Choose a different number tile to change this slot.";
      refreshCaseKeepingScroll();
      return;
    }
    state.lab[state.lab.slot] = nums[index];
    markLabPlay();
    state.lab.calculationResult = null;
    state.lab.note =
      "Number tile placed in Slot " +
      state.lab.slot.toUpperCase() +
      ". Try a second step when your problem needs one.";
    refreshCaseKeepingScroll();
  }
  function chooseLabOperator(op) {
    if (!["+", "-", "×", "÷"].includes(op)) return;
    if (state.lab.op === op) {
      state.lab.note = "Try a different operation to explore a new result.";
      refreshCaseKeepingScroll();
      return;
    }
    state.lab.op = op;
    markLabPlay();
    state.lab.calculationResult = null;
    refreshCaseKeepingScroll();
  }
  function chooseLabOperator2(op) {
    if (!["+", "-", "×", "÷"].includes(op)) return;
    if (state.lab.op2 === op) {
      state.lab.note = "Try another operation for the second step.";
      refreshCaseKeepingScroll();
      return;
    }
    state.lab.op2 = op;
    markLabPlay();
    state.lab.calculationResult = null;
    refreshCaseKeepingScroll();
  }
  function toggleThirdOperand() {
    state.lab.useThird = !state.lab.useThird;
    markLabPlay();
    state.lab.calculationResult = null;
    if (state.lab.useThird) state.lab.slot = "c";
    else if (state.lab.slot === "c") state.lab.slot = "a";
    state.lab.note = state.lab.useThird
      ? "A second step is ready. Choose a third number tile."
      : "Back to a two-number calculation.";
    refreshCaseKeepingScroll();
  }
  function calculateLab() {
    const { a, b, c, op, op2, useThird } = state.lab;
    if (
      a === null ||
      b === null ||
      (op === "÷" && b === 0) ||
      (useThird && (c === null || (op2 === "÷" && c === 0)))
    ) {
      state.lab.note = "Choose number tiles that make a defined calculation.";
      state.lab.calculationResult = null;
      refreshCaseKeepingScroll();
      return;
    }
    markLabPlay();
    const first = op === "+" ? a + b : op === "-" ? a - b : op === "×" ? a * b : a / b;
    const result = useThird
      ? op2 === "+"
        ? first + c
        : op2 === "-"
          ? first - c
          : op2 === "×"
            ? first * c
            : first / c
      : first;
    state.lab.calculationResult = Number.isFinite(result) ? Number(result.toFixed(4)) : null;
    state.lab.note =
      state.lab.calculationResult === null
        ? "Choose a defined calculation."
        : "Aha! " +
          (useThird
            ? "(" + a + " " + op + " " + b + ") " + op2 + " " + c
            : a + " " + op + " " + b) +
          " = " +
          state.lab.calculationResult +
          ". Try matching this model to the case.";
    refreshCaseKeepingScroll();
  }
  function setPatternRule(rule) {
    if (!["add1", "add2", "add3", "double"].includes(rule)) return;
    if (state.lab.patternRule === rule) return;
    state.lab.patternRule = rule;
    markLabPlay();
    refreshCaseKeepingScroll();
  }
  function setFraction(which, delta) {
    if (!["numerator", "denominator"].includes(which)) return;
    const oldNumerator = state.lab.fractionNumerator,
      oldDenominator = state.lab.fractionDenominator;
    if (which === "numerator")
      state.lab.fractionNumerator = Math.max(
        0,
        Math.min(state.lab.fractionDenominator, state.lab.fractionNumerator + delta),
      );
    if (which === "denominator") {
      const choices = [2, 3, 4, 6, 8, 10, 12],
        i = choices.indexOf(state.lab.fractionDenominator);
      const next = Math.max(0, Math.min(choices.length - 1, i + delta));
      state.lab.fractionDenominator = choices[next];
      state.lab.fractionNumerator = Math.min(
        state.lab.fractionNumerator,
        state.lab.fractionDenominator,
      );
    }
    if (
      oldNumerator !== state.lab.fractionNumerator ||
      oldDenominator !== state.lab.fractionDenominator
    )
      markLabPlay();
    refreshCaseKeepingScroll();
  }
  function toggleShapeCell(index) {
    if (!Number.isInteger(index) || index < 0 || index >= 48) return;
    markLabPlay();
    const cells = new Set(state.lab.cells);
    if (cells.has(index)) cells.delete(index);
    else cells.add(index);
    state.lab.cells = [...cells];
    refreshCaseKeepingScroll();
  }
  function shapeStats() {
    const cells = new Set(state.lab.cells);
    let perimeter = 0;
    for (const n of cells) {
      const r = Math.floor(n / 8),
        c = n % 8;
      if (r === 0 || !cells.has(n - 8)) perimeter++;
      if (r === 5 || !cells.has(n + 8)) perimeter++;
      if (c === 0 || !cells.has(n - 1)) perimeter++;
      if (c === 7 || !cells.has(n + 1)) perimeter++;
    }
    return { area: cells.size, perimeter };
  }
  function setLabTimeline(value) {
    const next = Math.max(0, Math.min(180, Number(value) || 0));
    if (next === state.lab.timelineMinutes) return;
    state.lab.timelineMinutes = next;
    markLabPlay();
    const end = 14 * 60 + 35 + next,
      rail = document.querySelector(".mc-time-rail");
    const fill = rail && rail.querySelector("span"),
      marker = rail && rail.querySelector("i");
    if (fill) fill.style.width = Math.min(100, (next / 180) * 100) + "%";
    if (marker) marker.style.left = Math.min(100, (next / 180) * 100) + "%";
    const endNode = document.querySelector(".mc-time-end");
    if (endNode) endNode.textContent = formatClock(end);
    const result = document.querySelector(".mc-time-result");
    if (result) {
      const strong = result.querySelector("strong"),
        small = result.querySelector("span");
      if (strong) strong.textContent = next + " minutes";
      if (small)
        small.textContent =
          Math.floor(next / 60) +
          " hour" +
          (Math.floor(next / 60) === 1 ? "" : "s") +
          " and " +
          (next % 60) +
          " minutes";
    }
    updateWorkshopCheckAfterPlay();
    syncSession();
  }
  function toggleDataZoom() {
    state.lab.dataZoom = !state.lab.dataZoom;
    markLabPlay();
    refreshCaseKeepingScroll();
  }
  function setRuleInput(value) {
    const next = Math.max(1, Math.min(12, Number(value) || 1));
    if (next === state.lab.ruleInput) return;
    state.lab.ruleInput = next;
    markLabPlay();
    const lab = state.lab,
      output =
        lab.ruleType === "doublePlusOne"
          ? 2 * next + 1
          : lab.ruleType === "add3"
            ? next + 3
            : lab.ruleType === "triple"
              ? 3 * next
              : next * next;
    const boxes = document.querySelectorAll(".mc-machine-box strong");
    if (boxes[0]) boxes[0].textContent = String(next);
    if (boxes[2]) boxes[2].textContent = String(output);
    const feedback = document.querySelector(".mc-math-play .mc-play-feedback");
    if (feedback)
      feedback.textContent =
        output +
        " comes from applying " +
        (lab.ruleType === "doublePlusOne"
          ? "2 × " + next + " + 1"
          : lab.ruleType === "add3"
            ? next + " + 3"
            : lab.ruleType === "triple"
              ? "3 × " + next
              : next + " × " + next) +
        ".";
    updateWorkshopCheckAfterPlay();
    syncSession();
  }
  function setRuleType(rule) {
    if (!["doublePlusOne", "add3", "triple", "square"].includes(rule)) return;
    if (state.lab.ruleType === rule) return;
    state.lab.ruleType = rule;
    markLabPlay();
    refreshCaseKeepingScroll();
  }
  function adjustShare(group, delta) {
    if (!Number.isInteger(group) || group < 0 || group > 2) return;
    const next = Math.max(0, Math.min(15, state.lab.shares[group] + delta));
    if (next === state.lab.shares[group]) return;
    state.lab.shares[group] = next;
    markLabPlay();
    refreshCaseKeepingScroll();
  }
  const routeEdges = [
    [0, 1, 4],
    [1, 2, 5],
    [0, 3, 2],
    [3, 4, 3],
    [4, 2, 2],
    [1, 4, 4],
  ];
  function routeEdge(a, b) {
    return routeEdges.find((e) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a));
  }
  function extendRoute(node) {
    const route = state.lab.route;
    if (node === route[route.length - 2]) {
      route.pop();
      markLabPlay();
      refreshCaseKeepingScroll();
      return;
    }
    if (node === route[route.length - 1]) return;
    if (route.includes(node)) {
      state.lab.note = "Try a fresh route without revisiting a stop.";
      setFeedback(state.lab.note, "hint");
      refreshCaseKeepingScroll();
      return;
    }
    if (!routeEdge(route[route.length - 1], node)) {
      state.lab.note = "Choose a connected stop. The roads show where you can travel next.";
      setFeedback(state.lab.note, "hint");
      refreshCaseKeepingScroll();
      return;
    }
    route.push(node);
    markLabPlay();
    state.lab.note = "Route extended. Add up the road lengths to compare journeys.";
    refreshCaseKeepingScroll();
  }
  function resetRoute() {
    if (state.lab.route.length === 1 && state.lab.route[0] === 0) return;
    state.lab.route = [0];
    markLabPlay();
    state.lab.note = "Begin at A and build a connected route.";
    refreshCaseKeepingScroll();
  }
  function adjustAllocation(group, delta) {
    if (!Number.isInteger(group) || group < 0 || group > 2) return;
    const next = state.lab.allocations[group] + delta;
    const total = state.lab.allocations.reduce((sum, n) => sum + n, 0);
    if (next < 0 || next > 12 || (delta > 0 && total >= 12)) return;
    state.lab.allocations[group] = next;
    markLabPlay();
    refreshCaseKeepingScroll();
  }
  function formatClock(minutes) {
    const value = ((minutes % 1440) + 1440) % 1440,
      hour = Math.floor(value / 60),
      minute = value % 60;
    return (
      (hour % 12 || 12) + ":" + String(minute).padStart(2, "0") + " " + (hour < 12 ? "AM" : "PM")
    );
  }
  function renderNumberForge(item) {
    const vals = visualNumbers(item).slice(0, 5),
      lab = state.lab;
    const shown = lab.calculationResult === null ? "?" : String(lab.calculationResult);
    const slot = (name, value) =>
      '<button type="button" class="mc-equation-slot ' +
      (lab.slot === name ? "is-selected" : "") +
      '" data-slot="' +
      name +
      '" aria-pressed="' +
      (lab.slot === name) +
      '" onclick="MathCourt.chooseLabSlot(this.dataset.slot)"><small>SLOT ' +
      name.toUpperCase() +
      "</small><strong>" +
      esc(value === null ? "Place a tile" : String(value)) +
      "</strong></button>";
    const op = (value, second) =>
      '<span class="mc-equation-operation" aria-label="operation">' + esc(value) + "</span>";
    const opPicker = (current, second) =>
      '<div class="mc-operation-picker mc-operation-picker-' +
      (second ? "second" : "first") +
      '">' +
      ["+", "-", "×", "÷"]
        .map(
          (value) =>
            '<button type="button" class="mc-op-tile ' +
            (current === value ? "is-selected" : "") +
            '" data-op="' +
            value +
            '" onclick="MathCourt.' +
            (second ? "chooseLabOperator2" : "chooseLabOperator") +
            '(this.dataset.op)">' +
            esc(value) +
            "</button>",
        )
        .join("") +
      "</div>";
    return (
      '<section class="mc-math-play"><div class="mc-play-heading"><span>🧱 NUMBER FORGE</span><h3>Build the calculation</h3><p>Place number tiles into slots, choose the operation, and watch your result appear. Some cases need one step; others need a chain.</p></div>' +
      '<div class="mc-equation-board mc-equation-chain">' +
      (lab.useThird ? op("(", false) : "") +
      slot("a", lab.a) +
      op(lab.op, false) +
      slot("b", lab.b) +
      (lab.useThird ? op(")", false) + op(lab.op2, true) + slot("c", lab.c) : "") +
      '<div class="mc-equation-equals">=</div><div class="mc-equation-result"><small>YOUR RESULT</small><strong>' +
      shown +
      "</strong></div></div>" +
      '<div class="mc-number-pool" role="group" aria-label="Number tiles">' +
      vals
        .map(
          (n, i) =>
            '<button type="button" class="mc-number-tile" data-number-index="' +
            i +
            '" onclick="MathCourt.chooseLabNumber(' +
            i +
            ')">' +
            esc(String(n)) +
            "</button>",
        )
        .join("") +
      "</div>" +
      '<div class="mc-forge-controls"><div><span class="mc-forge-label">STEP 1 · combine A and B</span>' +
      opPicker(lab.op, false) +
      "</div>" +
      (lab.useThird
        ? '<div><span class="mc-forge-label">STEP 2 · combine the result and C</span>' +
          opPicker(lab.op2, true) +
          "</div>"
        : "") +
      '<button type="button" class="mc-button mc-button-secondary mc-forge-chain-toggle" aria-pressed="' +
      lab.useThird +
      '" onclick="MathCourt.toggleThirdOperand()">' +
      (lab.useThird ? "− Use two numbers" : "＋ Add another step") +
      "</button>" +
      '<button type="button" class="mc-button mc-button-primary mc-build-button" onclick="MathCourt.calculateLab()">Make the calculation ✨</button></div>' +
      '<p class="mc-play-feedback" aria-live="polite">' +
      esc(lab.note || "Try different combinations. Notice how each operation changes the result.") +
      "</p></section>"
    );
  }

  function renderPatternGarden(item, task) {
    const goal = patternGoal(item, task),
      lab = state.lab;
    const step =
      lab.patternRule === "add1"
        ? 1
        : lab.patternRule === "add2"
          ? 2
          : lab.patternRule === "add3"
            ? 3
            : null;
    const preview = step === null ? goal.sequence[2] * 2 : goal.sequence[2] + step;
    return (
      '<section class="mc-math-play"><div class="mc-play-heading"><span>🌱 PATTERN GARDEN</span><h3>Grow the number path</h3><p>Find the rule that explains both jumps. Predict the next stone before checking your idea.</p></div>' +
      '<div class="mc-pattern-path">' +
      goal.sequence
        .map(
          (n, i) =>
            '<div class="mc-pattern-stone"><small>STONE ' +
            (i + 1) +
            "</small><strong>" +
            n +
            "</strong></div>",
        )
        .join("") +
      '<div class="mc-pattern-stone mc-pattern-next"><small>NEXT</small><strong>' +
      (lab.patternPrediction === null ? "?" : esc(String(lab.patternPrediction))) +
      "</strong></div></div>" +
      '<div class="mc-rule-tiles">' +
      [
        { id: "add1", label: "+ 1" },
        { id: "add2", label: "+ 2" },
        { id: "add3", label: "+ 3" },
        { id: "double", label: "× 2" },
      ]
        .map(
          (r) =>
            '<button type="button" class="mc-op-tile ' +
            (lab.patternRule === r.id ? "is-selected" : "") +
            '" data-rule="' +
            r.id +
            '" aria-pressed="' +
            (lab.patternRule === r.id) +
            '" onclick="MathCourt.setPatternRule(this.dataset.rule)">' +
            r.label +
            "</button>",
        )
        .join("") +
      "</div>" +
      '<p class="mc-play-feedback">Preview with this rule: next value = ' +
      preview +
      ".</p>" +
      '<label class="mc-range-label" for="mc-pattern-prediction">Your prediction for the next stone</label><div class="mc-prediction-row"><input id="mc-pattern-prediction" class="mc-play-number-input" type="number" inputmode="numeric" value="' +
      (lab.patternPrediction === null ? "" : esc(String(lab.patternPrediction))) +
      '" placeholder="Enter the next value"/><button class="mc-button mc-button-secondary" type="button" onclick="MathCourt.submitPatternPrediction()">Place prediction</button></div></section>'
    );
  }
  function renderFractionStudio(item, task) {
    const lab = state.lab,
      den = lab.fractionDenominator,
      num = lab.fractionNumerator,
      goal = fractionGoal(item, task);
    return (
      '<section class="mc-math-play"><div class="mc-play-heading"><span>🍰 FRACTION STUDIO</span><h3>Share the whole</h3><p>Build the target share by changing equal parts and shading the right amount.</p></div>' +
      '<div class="mc-workshop-target"><small>TARGET SHARE</small><strong>' +
      goal.numerator +
      "/" +
      goal.denominator +
      "</strong><span>of one whole</span></div>" +
      '<div class="mc-fraction-strip" role="group" aria-label="' +
      num +
      " of " +
      den +
      ' equal parts shaded">' +
      Array.from(
        { length: den },
        (_, i) =>
          '<button type="button" class="mc-fraction-part ' +
          (i < num ? "is-filled" : "") +
          '" aria-label="Part ' +
          (i + 1) +
          " " +
          (i < num ? "shaded" : "empty") +
          '" data-which="numerator" data-delta="' +
          (i < num ? -1 : 1) +
          '" onclick="MathCourt.setFraction(this.dataset.which,Number(this.dataset.delta))"></button>',
      ).join("") +
      "</div>" +
      '<div class="mc-fraction-equation"><strong>' +
      num +
      "/" +
      den +
      "</strong><span>of one whole</span><strong>" +
      Math.round((num / den) * 100) +
      "%</strong></div>" +
      '<div class="mc-play-control-row"><span>Shaded parts</span><button class="mc-stepper" data-which="numerator" data-delta="-1" onclick="MathCourt.setFraction(this.dataset.which,-1)" aria-label="One fewer shaded part">−</button><strong>' +
      num +
      '</strong><button class="mc-stepper" data-which="numerator" data-delta="1" onclick="MathCourt.setFraction(this.dataset.which,1)" aria-label="One more shaded part">+</button></div>' +
      '<div class="mc-play-control-row"><span>Equal slices</span><button class="mc-stepper" data-which="denominator" data-delta="-1" onclick="MathCourt.setFraction(this.dataset.which,-1)" aria-label="Fewer equal parts">−</button><strong>' +
      den +
      '</strong><button class="mc-stepper" data-which="denominator" data-delta="1" onclick="MathCourt.setFraction(this.dataset.which,1)" aria-label="More equal parts">+</button></div></section>'
    );
  }
  function renderShapeWorkshop(item, task) {
    const stats = shapeStats(),
      goal = shapeGoal(item, task);
    return (
      '<section class="mc-math-play"><div class="mc-play-heading"><span>🧩 SHAPE WORKSHOP</span><h3>Build a connected shape</h3><p>Tap grid squares to design a shape. Shared edges are inside edges, not part of the outside boundary.</p></div>' +
      '<div class="mc-workshop-target"><small>SHAPE CHALLENGE</small><strong>' +
      goal.area +
      " squares · " +
      goal.perimeter +
      " outside edges</strong><span>All selected squares must connect.</span></div>" +
      '<div class="mc-shape-builder" role="group" aria-label="48-square shape builder">' +
      Array.from(
        { length: 48 },
        (_, i) =>
          '<button type="button" class="mc-shape-cell ' +
          (state.lab.cells.includes(i) ? "is-filled" : "") +
          '" aria-label="Grid square ' +
          (i + 1) +
          '" aria-pressed="' +
          state.lab.cells.includes(i) +
          '" onclick="MathCourt.toggleShapeCell(' +
          i +
          ')"></button>',
      ).join("") +
      "</div>" +
      '<div class="mc-shape-stats"><div><small>AREA</small><strong>' +
      stats.area +
      "</strong><span>square units</span></div><div><small>PERIMETER</small><strong>" +
      stats.perimeter +
      "</strong><span>edge units</span></div></div>" +
      '<button class="mc-button mc-button-quiet" type="button" onclick="MathCourt.resetShape()">Start a fresh shape ↻</button></section>'
    );
  }
  function renderTimeline(item, task) {
    const mins = state.lab.timelineMinutes,
      start = 14 * 60 + 35,
      end = start + mins,
      goal = timelineGoal(item, task);
    const goalEnd = start + goal;
    return (
      '<section class="mc-math-play"><div class="mc-play-heading"><span>⏱️ TIMELINE STUDIO</span><h3>Move through time</h3><p>Use elapsed time to match a planned arrival. Watch the clock move as the duration changes.</p></div>' +
      '<div class="mc-workshop-target"><small>PLANNED ARRIVAL</small><strong>' +
      formatClock(goalEnd) +
      "</strong><span>Starting at 2:35 PM</span></div>" +
      '<div class="mc-timeline-track"><span class="mc-time-start">' +
      formatClock(start) +
      '</span><div class="mc-time-rail"><span style="width:' +
      Math.min(100, (mins / 180) * 100) +
      '%"></span><i style="left:' +
      Math.min(100, (mins / 180) * 100) +
      '%"></i></div><span class="mc-time-end">' +
      formatClock(end) +
      "</span></div>" +
      '<div class="mc-time-result"><small>YOUR JOURNEY</small><strong>' +
      mins +
      " minutes</strong><span>" +
      Math.floor(mins / 60) +
      " hour" +
      (Math.floor(mins / 60) === 1 ? "" : "s") +
      " and " +
      (mins % 60) +
      " minutes</span></div>" +
      '<label class="mc-range-label" for="mc-timeline-range">Move the journey marker</label><input id="mc-timeline-range" class="mc-range" type="range" min="0" max="180" step="5" value="' +
      mins +
      '" oninput="MathCourt.setLabTimeline(this.value)"/></section>'
    );
  }
  function renderDataGarden(item, task) {
    const goal = dataGoal(item, task),
      vals = goal.values;
    const min = Math.min(...vals),
      max = Math.max(...vals),
      base = state.lab.dataZoom ? Math.max(0, min - 10) : 0,
      range = Math.max(1, max - base);
    return (
      '<section class="mc-math-play"><div class="mc-play-heading"><span>📊 DATA GARDEN</span><h3>Read the evidence bars</h3><p>Tap a record to choose it. Compare both the written values and the visible bar lengths.</p></div>' +
      '<div class="mc-workshop-target"><small>CHART QUEST</small><strong>Select the ' +
      goal.which +
      " record</strong><span>Choose one bar from the records below.</span></div>" +
      '<div class="mc-data-chart" role="group" aria-label="Select one of the evidence values">' +
      vals
        .map(
          (n, i) =>
            '<button type="button" class="mc-data-bar-wrap ' +
            (state.lab.dataSelection === i ? "is-selected" : "") +
            '" aria-pressed="' +
            (state.lab.dataSelection === i) +
            '" aria-label="Record ' +
            (i + 1) +
            ", value " +
            n +
            '" onclick="MathCourt.selectDataRecord(' +
            i +
            ')"><strong>' +
            n +
            '</strong><div class="mc-data-bar-track"><span style="height:' +
            Math.max(4, ((n - base) / range) * 100) +
            '%"></span></div><small>Record ' +
            (i + 1) +
            "</small></button>",
        )
        .join("") +
      "</div>" +
      '<div class="mc-chart-scale-label">Scale starts at <strong>' +
      base +
      '</strong></div><div class="mc-rule-tiles"><button type="button" class="mc-op-tile ' +
      (!state.lab.dataZoom ? "is-selected" : "") +
      '" aria-pressed="' +
      !state.lab.dataZoom +
      '" onclick="MathCourt.setDataZoom(false)">Start at zero</button><button type="button" class="mc-op-tile ' +
      (state.lab.dataZoom ? "is-selected" : "") +
      '" aria-pressed="' +
      state.lab.dataZoom +
      '" onclick="MathCourt.setDataZoom(true)">Zoom in</button></div>' +
      '<p class="mc-play-feedback">' +
      (state.lab.dataZoom
        ? "Zooming in highlights small gaps; show the scale so everyone can judge fairly."
        : "A zero baseline makes the full bar lengths easier to compare.") +
      "</p></section>"
    );
  }
  function renderRuleMachine(item, task) {
    const lab = state.lab,
      x = lab.ruleInput,
      y =
        lab.ruleType === "doublePlusOne"
          ? 2 * x + 1
          : lab.ruleType === "add3"
            ? x + 3
            : lab.ruleType === "triple"
              ? 3 * x
              : x * x,
      goal = ruleGoal(item, task);
    return (
      '<section class="mc-math-play"><div class="mc-play-heading"><span>⚙️ RULE MACHINE</span><h3>Tune the mystery machine</h3><p>Choose a rule and move the input. The output changes immediately.</p></div>' +
      '<div class="mc-workshop-target"><small>MYSTERY MACHINE CARD</small><strong>Input ' +
      goal.input +
      " → Output " +
      goal.output +
      "</strong><span>Find the rule that makes both match.</span></div>" +
      '<div class="mc-machine-flow"><div class="mc-machine-box"><small>INPUT</small><strong>' +
      x +
      '</strong></div><div class="mc-machine-arrow">→</div><div class="mc-machine-box mc-machine-core"><small>RULE</small><strong>' +
      (lab.ruleType === "doublePlusOne"
        ? "2x + 1"
        : lab.ruleType === "add3"
          ? "x + 3"
          : lab.ruleType === "triple"
            ? "3x"
            : "x²") +
      '</strong></div><div class="mc-machine-arrow">→</div><div class="mc-machine-box"><small>OUTPUT</small><strong>' +
      y +
      "</strong></div></div>" +
      '<label class="mc-range-label" for="mc-rule-input">Change input</label><input id="mc-rule-input" class="mc-range" type="range" min="1" max="12" value="' +
      x +
      '" oninput="MathCourt.setRuleInput(this.value)"/>' +
      '<div class="mc-rule-tiles">' +
      [
        { id: "doublePlusOne", label: "2x + 1" },
        { id: "add3", label: "x + 3" },
        { id: "triple", label: "3x" },
        { id: "square", label: "x²" },
      ]
        .map(
          (r) =>
            '<button type="button" class="mc-op-tile ' +
            (lab.ruleType === r.id ? "is-selected" : "") +
            '" data-rule="' +
            r.id +
            '" aria-pressed="' +
            (lab.ruleType === r.id) +
            '" onclick="MathCourt.setRuleType(this.dataset.rule)">' +
            r.label +
            "</button>",
        )
        .join("") +
      "</div>" +
      '<p class="mc-play-feedback">' +
      y +
      " comes from applying " +
      (lab.ruleType === "doublePlusOne"
        ? "2 × " + x + " + 1"
        : lab.ruleType === "add3"
          ? x + " + 3"
          : lab.ruleType === "triple"
            ? "3 × " + x
            : x + " × " + x) +
      ".</p></section>"
    );
  }
  function renderShareMarket(item, task) {
    const shares = state.lab.shares,
      total = shares.reduce((s, n) => s + n, 0),
      gap = Math.max(...shares) - Math.min(...shares),
      goal = shareGoal(item, task);
    return (
      '<section class="mc-math-play"><div class="mc-play-heading"><span>🫶 FAIR-SHARE MARKET</span><h3>Share the counters with care</h3><p>Each counter is one unit of resource. Adjust the shares and watch the total change.</p></div>' +
      '<div class="mc-workshop-target"><small>COMMUNITY NEEDS</small><strong>Total: ' +
      goal.total +
      " counters</strong><span>Minimum needs for A, B and C: " +
      goal.minimums.join(" · ") +
      "</span></div>" +
      '<div class="mc-share-groups">' +
      shares
        .map(
          (n, i) =>
            '<div class="mc-share-group"><strong>Group ' +
            String.fromCharCode(65 + i) +
            '</strong><div class="mc-share-dots">' +
            Array.from({ length: n }, () => '<i aria-hidden="true"></i>').join("") +
            '</div><div class="mc-share-adjust"><button class="mc-stepper" onclick="MathCourt.adjustShare(' +
            i +
            ',-1)" aria-label="Give one fewer counter to group ' +
            String.fromCharCode(65 + i) +
            '">−</button><strong>' +
            n +
            '</strong><button class="mc-stepper" onclick="MathCourt.adjustShare(' +
            i +
            ',1)" aria-label="Give one more counter to group ' +
            String.fromCharCode(65 + i) +
            '">+</button></div></div>',
        )
        .join("") +
      "</div>" +
      '<div class="mc-shares-summary"><span>Total counters <strong>' +
      total +
      "</strong></span><span>Largest gap <strong>" +
      gap +
      "</strong></span></div>" +
      '<p class="mc-play-feedback">' +
      (total === goal.total && shares.every((n, i) => n >= goal.minimums[i])
        ? "Every stated need is met. Check that the total stays exactly 12."
        : total === goal.total
          ? "The total fits. Check each group's stated minimum."
          : "Move counters between groups to meet every minimum and use exactly 12.") +
      "</p></section>"
    );
  }
  function renderRouteGarden(item, task) {
    const route = state.lab.route,
      total = route
        .slice(1)
        .reduce((sum, n, i) => sum + (routeEdge(route[i], n) || [0, 0, 0])[2], 0),
      goal = routeGoal();
    const nodes = [
        [55, 70],
        [182, 40],
        [306, 74],
        [94, 170],
        [242, 166],
      ],
      labels = ["A", "B", "C", "D", "E"];
    return (
      '<section class="mc-math-play"><div class="mc-play-heading"><span>🗺️ ROUTE GARDEN</span><h3>Find a short connected journey</h3><p>Start at A, then choose one connected stop at a time. Every road adds to your journey length.</p></div>' +
      '<div class="mc-workshop-target"><small>ROUTE MISSION</small><strong>Reach C in ' +
      goal.maxLength +
      " road units or fewer</strong><span>Read each road label and compare complete routes.</span></div>" +
      '<svg viewBox="0 0 360 220" class="mc-route-map" role="img" aria-label="Five-stop route network">' +
      routeEdges
        .map(
          (e) =>
            '<line x1="' +
            nodes[e[0]][0] +
            '" y1="' +
            nodes[e[0]][1] +
            '" x2="' +
            nodes[e[1]][0] +
            '" y2="' +
            nodes[e[1]][1] +
            '" class="' +
            (route.some((n, i) => i < route.length - 1 && routeEdge(n, route[i + 1]) === e)
              ? "mc-route-selected"
              : "") +
            '"/><text x="' +
            (nodes[e[0]][0] + nodes[e[1]][0]) / 2 +
            '" y="' +
            ((nodes[e[0]][1] + nodes[e[1]][1]) / 2 - 7) +
            '">' +
            e[2] +
            "</text>",
        )
        .join("") +
      nodes
        .map(
          (n, i) =>
            '<g class="mc-route-node ' +
            (route.includes(i) ? "is-visited" : "") +
            '"><circle cx="' +
            n[0] +
            '" cy="' +
            n[1] +
            '" r="20"/><text x="' +
            n[0] +
            '" y="' +
            (n[1] + 5) +
            '" class="mc-route-label">' +
            labels[i] +
            "</text></g>",
        )
        .join("") +
      "</svg>" +
      '<div class="mc-route-buttons">' +
      labels
        .map(
          (label, i) =>
            '<button type="button" class="mc-route-choice ' +
            (route[route.length - 1] === i ? "is-current" : "") +
            '" aria-pressed="' +
            (route[route.length - 1] === i) +
            '" onclick="MathCourt.extendRoute(' +
            i +
            ')">' +
            label +
            "</button>",
        )
        .join("") +
      "</div>" +
      '<div class="mc-shares-summary"><span>Stops <strong>' +
      route.map((n) => labels[n]).join(" → ") +
      "</strong></span><span>Journey length <strong>" +
      total +
      "</strong></span></div>" +
      '<button class="mc-button mc-button-quiet" type="button" onclick="MathCourt.resetRoute()">New journey ↻</button></section>'
    );
  }
  function renderTownPlanner(item, task) {
    const allocations = state.lab.allocations,
      total = allocations.reduce((s, n) => s + n, 0),
      goal = townGoal(item, task);
    return (
      '<section class="mc-math-play"><div class="mc-play-heading"><span>🏡 TOWN PLANNER</span><h3>Make a plan that fits everyone&#39;s needs</h3><p>Allocate resource tokens, satisfy each stated minimum and keep within the shared budget.</p></div>' +
      '<div class="mc-workshop-target"><small>PLANNING CONSTRAINTS</small><strong>Use exactly ' +
      goal.total +
      " tokens</strong><span>Minimum needs for A, B and C: " +
      goal.minimums.join(" · ") +
      "</span></div>" +
      '<div class="mc-resource-bar"><span style="width:' +
      (total / goal.total) * 100 +
      '%"></span></div><p class="mc-budget-label">' +
      total +
      " of " +
      goal.total +
      " tokens planned · " +
      (goal.total - total) +
      " still available</p>" +
      '<div class="mc-town-bins">' +
      allocations
        .map(
          (n, i) =>
            '<div class="mc-town-bin"><strong>Town ' +
            String.fromCharCode(65 + i) +
            '</strong><div class="mc-town-tokens">' +
            Array.from({ length: n }, () => "<i></i>").join("") +
            '</div><div class="mc-share-adjust"><button class="mc-stepper" onclick="MathCourt.adjustAllocation(' +
            i +
            ',-1)" aria-label="Remove a token from town ' +
            String.fromCharCode(65 + i) +
            '">−</button><strong>' +
            n +
            '</strong><button class="mc-stepper" ' +
            (total >= goal.total ? "disabled" : "") +
            ' onclick="MathCourt.adjustAllocation(' +
            i +
            ',1)" aria-label="Add a token to town ' +
            String.fromCharCode(65 + i) +
            '">+</button></div></div>',
        )
        .join("") +
      "</div>" +
      '<p class="mc-play-feedback">' +
      (total === goal.total && allocations.every((n, i) => n >= goal.minimums[i])
        ? "The plan fits the budget and every town&#39;s stated minimum."
        : total === goal.total
          ? "The budget is fully allocated; check the minimums for each town."
          : "You have " +
            (goal.total - total) +
            " tokens to place. Meet the minimums and use the whole budget.") +
      "</p></section>"
    );
  }
  function renderPlayActivity(item) {
    const task = state.investigationSolved ? 2 : 1;
    const activity =
      item.chapter === 1
        ? renderNumberForge(item, task)
        : item.chapter === 2
          ? renderPatternGarden(item, task)
          : item.chapter === 3
            ? renderFractionStudio(item, task)
            : item.chapter === 4
              ? renderShapeWorkshop(item, task)
              : item.chapter === 5
                ? renderTimeline(item, task)
                : item.chapter === 6
                  ? renderDataGarden(item, task)
                  : item.chapter === 7
                    ? renderRuleMachine(item, task)
                    : item.chapter === 8
                      ? renderShareMarket(item, task)
                      : item.chapter === 9
                        ? renderRouteGarden(item, task)
                        : renderTownPlanner(item, task);
    const goal = playGoal(item, task),
      goalSolved = Boolean(state.lab && state.lab.goalSolved && playGoalMet(item, task));
    return (
      '<div class="mc-play-station"><div class="mc-station-top"><span>✨ PLAY & DISCOVER</span><span>CHAPTER ' +
      String(item.chapter).padStart(2, "0") +
      " · TASK " +
      task +
      " OF 2</span></div>" +
      activity +
      '<section class="mc-workshop-check ' +
      (goalSolved ? "is-solved" : "") +
      '" aria-live="polite"><div class="mc-workshop-check-icon" aria-hidden="true">' +
      (goalSolved ? "✓" : "✦") +
      '</div><div class="mc-workshop-check-copy"><small>YOUR HANDS-ON CHALLENGE</small><strong>' +
      esc(goal.title) +
      "</strong><p>" +
      esc(goal.instruction) +
      '</p></div><button type="button" class="mc-button mc-button-secondary" onclick="MathCourt.checkPlayGoal()">' +
      (goalSolved ? "Model checked ✓" : "Check my model") +
      "</button>" +
      (goalSolved
        ? '<span class="mc-workshop-complete">Goal complete! Ready to use this finding.</span>'
        : "") +
      "</section></div>"
    );
  }

  function renderStoryNarrative(item) {
    const story = item.story || item.opening || "Use the records to test the claim.";
    return '<p class="mc-story-text mc-story-hook">' + esc(story) + "</p>";
  }

  function clueMoveSpec(item) {
    const type = (item.id - 1) % 10,
      n = item.id,
      storyNumbers = [...String(item.twist || "").matchAll(/-?\d[\d,]*(?:\.\d+)?/g)]
        .map((m) => Number(m[0].replace(/,/g, "")))
        .filter(Number.isFinite),
      source = [...new Set([...storyNumbers, ...visualNumbers(item)])];
    while (source.length < 3) {
      const fallback = [3, 5, 8, 13][source.length] + n;
      if (!source.includes(fallback)) source.push(fallback);
      else source.push(fallback + source.length + 1);
    }
    const values = source.slice(0, 3);
    const sorted = [...values].sort((a, b) => a - b);
    const numerator = 1 + (Math.abs(values[0]) % 4),
      denominator = numerator + 1 + (Math.abs(values[1]) % 4);
    const minutes = 15 + (Math.abs(values[0]) % 13) * 5;
    const bars = values.map((v) => Math.abs(v));
    const rule = Math.abs(values[0]) % 3;
    const input = 3 + (Math.abs(values[1]) % 5);
    const outputs = [input + 3, 2 * input + 1, input * input];
    return {
      type,
      values,
      sorted,
      numerator,
      denominator,
      minutes,
      bars,
      rule,
      input,
      outputs,
      target: values[(n + type) % 3],
      area: 3 + (Math.abs(values[2]) % 4),
      share: 2 + (Math.abs(values[0]) % 5),
      route: 1,
      equation: values[0] + values[1],
    };
  }
  function renderClueMove(item) {
    const g = clueMoveSpec(item),
      maxBar = Math.max(1, ...g.bars),
      titles = [
        "Put the number tokens in order",
        "Compare the evidence bars",
        "Build the fraction clue",
        "Shape the footprint",
        "Set the travel timeline",
        "Inspect the data garden",
        "Tune the pattern machine",
        "Allocate the shared resources",
        "Trace a connected route",
        "Balance the equation",
      ];
    const intros = [
      "Move from the smallest record to the largest. The order helps reveal which entry should be checked first.",
      "Compare the displayed records rather than guessing from the story. Select the taller bar.",
      "Build the fraction named in the new clue. Count equal parts and shaded parts separately.",
      "Tap exactly the requested number of squares to model the footprint.",
      "Set the timeline to the target duration shown below.",
      "Read the values and select the record with the largest measurement.",
      "For the shown input, select the machine rule that produces the target output.",
      "Allocate the exact number of tokens requested by the clue.",
      "Compare the two connected routes and choose the shorter journey.",
      "Use the two recorded quantities to balance the equation.",
    ];
    let controls = "";
    if (g.type === 0) {
      controls =
        '<div class="mc-clue-token-pool" role="group" aria-label="Drag number tokens into order">' +
        g.values
          .map(
            (v) =>
              '<button type="button" class="mc-clue-token-drag" draggable="true" ondragstart="MathCourt.startClueDrag(' +
              v +
              ',event)" aria-label="Drag number token ' +
              v +
              '">' +
              v +
              "</button>",
          )
          .join("") +
        '</div><div class="mc-clue-token-slots">' +
        g.values
          .map(
            (v, i) =>
              '<div class="mc-clue-token-slot" ondragover="event.preventDefault()" ondrop="MathCourt.dropClueToken(' +
              i +
              ',event)"><span>Position ' +
              (i + 1) +
              "</span><strong>" +
              (state.clueOrder ? state.clueOrder[i] : v) +
              "</strong></div>",
          )
          .join("") +
        '</div><p class="mc-clue-accessible-note">Drag tokens into place, or use the position selectors below.</p><div class="mc-clue-token-row">' +
        g.values
          .map(
            (v, i) =>
              '<label class="mc-clue-token"><span>Position ' +
              (i + 1) +
              '</span><select id="mc-clue-order-' +
              i +
              '" onchange="MathCourt.markClueChanged()">' +
              g.values
                .map(
                  (x) =>
                    '<option value="' +
                    x +
                    '" ' +
                    ((state.clueOrder ? state.clueOrder[i] : v) === x ? "selected" : "") +
                    ">" +
                    x +
                    "</option>",
                )
                .join("") +
              "</select></label>",
          )
          .join("") +
        "</div>";
    } else if (g.type === 1) {
      controls =
        '<div class="mc-clue-bars">' +
        g.bars
          .map(
            (v, i) =>
              '<button type="button" class="mc-clue-bar-choice ' +
              (state.clueValue === i ? "is-selected" : "") +
              '" aria-pressed="' +
              (state.clueValue === i) +
              '" onclick="MathCourt.chooseClueValue(' +
              i +
              ')"><span class="mc-clue-bar" style="height:' +
              (24 + Math.min(100, (v / maxBar) * 80)) +
              'px"></span><strong>Record ' +
              String.fromCharCode(65 + i) +
              "</strong><small>" +
              v +
              " units</small></button>",
          )
          .join("") +
        "</div>";
    } else if (g.type === 2) {
      controls =
        '<div class="mc-workshop-target"><small>TARGET FRACTION</small><strong>' +
        g.numerator +
        "/" +
        g.denominator +
        '</strong><span>of one whole</span></div><div class="mc-clue-fraction"><label>Shaded parts <input id="mc-clue-numerator" type="number" min="0" max="12" oninput="MathCourt.markClueChanged()" value="' +
        (state.clueValue == null ? 0 : state.clueValue) +
        '"/></label><span>of</span><strong>' +
        g.denominator +
        " equal parts</strong></div>";
    } else if (g.type === 3) {
      controls =
        '<div class="mc-workshop-target"><small>FOOTPRINT AREA</small><strong>' +
        g.area +
        ' squares</strong><span>Use a connected group of squares.</span></div><div class="mc-clue-shape-grid" role="group" aria-label="Nine-square footprint">' +
        Array.from(
          { length: 9 },
          (_, i) =>
            '<button type="button" class="mc-clue-shape-cell ' +
            (state.clueCells.includes(i) ? "is-filled" : "") +
            '" aria-pressed="' +
            state.clueCells.includes(i) +
            '" aria-label="Footprint square ' +
            (i + 1) +
            '" onclick="MathCourt.toggleClueCell(' +
            i +
            ')"></button>',
        ).join("") +
        '</div><p class="mc-clue-count">' +
        state.clueCells.length +
        " of " +
        g.area +
        " squares selected</p>";
    } else if (g.type === 4) {
      controls =
        '<div class="mc-workshop-target"><small>TARGET DURATION</small><strong>' +
        g.minutes +
        ' minutes</strong><span>Match the elapsed time.</span></div><label class="mc-clue-range-label" for="mc-clue-minutes">Elapsed time <strong id="mc-clue-minutes-label">' +
        (state.clueValue == null ? 0 : state.clueValue) +
        ' minutes</strong></label><input id="mc-clue-minutes" type="range" min="0" max="120" step="5" value="' +
        (state.clueValue == null ? 0 : state.clueValue) +
        "\" oninput=\"document.getElementById('mc-clue-minutes-label').textContent=this.value+' minutes';MathCourt.setClueValue(this.value)\"/>";
    } else if (g.type === 5) {
      controls =
        '<div class="mc-clue-bars">' +
        g.bars
          .map(
            (v, i) =>
              '<button type="button" class="mc-clue-bar-choice" onclick="MathCourt.chooseClueValue(' +
              i +
              ')"><span class="mc-clue-bar" style="height:' +
              (24 + v * 9) +
              'px"></span><strong>Sample ' +
              String.fromCharCode(65 + i) +
              "</strong><small>" +
              v +
              "</small></button>",
          )
          .join("") +
        "</div>";
    } else if (g.type === 6) {
      controls =
        '<div class="mc-workshop-target"><small>MACHINE TARGET</small><strong>Input ' +
        g.input +
        " → Output " +
        g.outputs[g.rule] +
        '</strong><span>Test the candidate rules.</span></div><div class="mc-clue-rule-tiles">' +
        g.outputs
          .map(
            (v, i) =>
              '<button type="button" class="mc-op-tile ' +
              (state.clueValue === i ? "is-selected" : "") +
              '" aria-pressed="' +
              (state.clueValue === i) +
              '" onclick="MathCourt.chooseClueValue(' +
              i +
              ')">' +
              ["Add 3", "Double + 1", "Square"][i] +
              "<small>" +
              g.input +
              " → " +
              v +
              "</small></button>",
          )
          .join("") +
        "</div>";
    } else if (g.type === 7) {
      controls =
        '<div class="mc-workshop-target"><small>RESOURCE TARGET</small><strong>' +
        g.share +
        ' tokens</strong><span>Set the allocation to the requested amount.</span></div><label class="mc-clue-range-label" for="mc-clue-share">Resource tokens <strong id="mc-clue-share-label">' +
        (state.clueValue == null ? 0 : state.clueValue) +
        '</strong></label><input id="mc-clue-share" type="range" min="0" max="12" step="1" value="' +
        (state.clueValue == null ? 0 : state.clueValue) +
        '" oninput="document.getElementById(\'mc-clue-share-label\').textContent=this.value;MathCourt.setClueValue(this.value)"/>';
    } else if (g.type === 8) {
      controls =
        '<div class="mc-workshop-target"><small>ROUTE CHALLENGE</small><strong>Choose the shortest connected route</strong><span>Compare 9 units with 7 units.</span></div><div class="mc-clue-route-choices"><button type="button" class="mc-button mc-button-secondary ' +
        (state.clueValue === 0 ? "is-selected" : "") +
        '" aria-pressed="' +
        (state.clueValue === 0) +
        '" onclick="MathCourt.chooseClueValue(0)">A → B → C <small>4 + 5 = 9 units</small></button><button type="button" class="mc-button mc-button-secondary ' +
        (state.clueValue === 1 ? "is-selected" : "") +
        '" aria-pressed="' +
        (state.clueValue === 1) +
        '" onclick="MathCourt.chooseClueValue(1)">A → D → E → C <small>2 + 3 + 2 = 7 units</small></button></div>';
    } else {
      controls =
        '<label class="mc-clue-equation" for="mc-clue-equation-input">' +
        g.values[0] +
        " + " +
        g.values[1] +
        ' = <input id="mc-clue-equation-input" type="number" oninput="MathCourt.markClueChanged()" value="' +
        (state.clueValue == null ? "" : state.clueValue) +
        '" inputmode="numeric"/></label>';
    }
    return (
      '<section class="mc-clue-adventure ' +
      (state.clueSolved ? "is-solved" : "") +
      '"><div class="mc-clue-adventure-head"><span>NEW CLUE · FIELD MOVE ' +
      String(g.type + 1).padStart(2, "0") +
      "</span><h3>" +
      titles[g.type] +
      "</h3><p>" +
      esc(item.twist || item.evidence) +
      '</p><p class="mc-clue-adventure-instruction">' +
      intros[g.type] +
      "</p></div>" +
      controls +
      '<div class="mc-clue-adventure-foot"><button type="button" class="mc-button mc-button-primary" onclick="MathCourt.submitClueMove()">' +
      (state.clueSolved ? "Clue verified ✓" : "Check this clue") +
      '</button><span aria-live="polite">' +
      (state.clueSolved
        ? "The clue is now part of your evidence."
        : "Try, inspect the result, and adjust your model.") +
      "</span></div></section>"
    );
  }
  function startClueDrag(value, event) {
    if (!event || !event.dataTransfer) return;
    event.dataTransfer.setData("text/plain", String(value));
    event.dataTransfer.effectAllowed = "move";
  }
  function dropClueToken(position, event) {
    if (!event || !event.dataTransfer) return;
    event.preventDefault();
    const value = Number(event.dataTransfer.getData("text/plain")),
      item = data().getCase(state.caseId),
      g = clueMoveSpec(item);
    if (!Number.isInteger(position) || position < 0 || position > 2 || !g.values.includes(value))
      return;
    const order = state.clueOrder ? state.clueOrder.slice() : g.values.slice(),
      from = order.indexOf(value);
    if (from < 0) return;
    const displaced = order[position];
    order[position] = value;
    order[from] = displaced;
    state.clueOrder = order;
    state.clueSolved = false;
    refreshCaseKeepingScroll();
  }
  function invalidateClueDisplay() {
    const card = document.querySelector(".mc-clue-adventure");
    if (!card) return;
    card.classList.remove("is-solved");
    const button = card.querySelector(".mc-clue-adventure-foot .mc-button");
    if (button) button.textContent = "Check this clue";
    const note = card.querySelector(".mc-clue-adventure-foot span");
    if (note) note.textContent = "Try, inspect the result, and adjust your model.";
    if (state.clueOrder) {
      card.querySelectorAll(".mc-clue-token-slot strong").forEach((node, i) => {
        if (state.clueOrder[i] !== undefined) node.textContent = String(state.clueOrder[i]);
      });
    }
  }
  function markClueChanged() {
    state.clueSolved = false;
    const selects = [0, 1, 2].map((i) => $("mc-clue-order-" + i));
    if (selects.every(Boolean)) state.clueOrder = selects.map((node) => Number(node.value));
    const numerator = $("mc-clue-numerator"),
      equation = $("mc-clue-equation-input");
    if (numerator) state.clueValue = numerator.value === "" ? null : Number(numerator.value);
    if (equation) state.clueValue = equation.value === "" ? null : Number(equation.value);
    invalidateClueDisplay();
    syncSession();
  }
  function setClueValue(value) {
    state.clueValue = Number(value);
    state.clueSolved = false;
    invalidateClueDisplay();
    syncSession();
  }
  function chooseClueValue(value) {
    state.clueValue = Number(value);
    state.clueSolved = false;
    refreshCaseKeepingScroll();
  }
  function toggleClueCell(index) {
    if (!Number.isInteger(index) || index < 0 || index > 8) return;
    const cells = new Set(state.clueCells);
    if (cells.has(index)) cells.delete(index);
    else cells.add(index);
    state.clueCells = [...cells];
    state.clueSolved = false;
    refreshCaseKeepingScroll();
  }
  function clueShapeIsConnected(cells) {
    if (!cells.length) return false;
    const set = new Set(cells),
      visited = new Set(),
      queue = [cells[0]];
    while (queue.length) {
      const cell = queue.pop();
      if (visited.has(cell)) continue;
      visited.add(cell);
      const row = Math.floor(cell / 3),
        col = cell % 3;
      for (const next of [
        col > 0 ? cell - 1 : -1,
        col < 2 ? cell + 1 : -1,
        row > 0 ? cell - 3 : -1,
        row < 2 ? cell + 3 : -1,
      ]) {
        if (next >= 0 && set.has(next) && !visited.has(next)) queue.push(next);
      }
    }
    return visited.size === set.size;
  }
  function submitClueMove() {
    const item = data().getCase(state.caseId),
      g = clueMoveSpec(item);
    let ok = false;
    if (g.type === 0) {
      const values = [0, 1, 2].map((i) => Number($("mc-clue-order-" + i)?.value));
      state.clueOrder = values;
      ok = values.join(",") === g.sorted.join(",");
    } else if (g.type === 1) {
      ok = Number.isInteger(state.clueValue) && g.bars[state.clueValue] === Math.max(...g.bars);
    } else if (g.type === 2) {
      state.clueValue = Number($("mc-clue-numerator")?.value);
      ok = state.clueValue === g.numerator;
    } else if (g.type === 3) {
      ok = state.clueCells.length === g.area && clueShapeIsConnected(state.clueCells);
    } else if (g.type === 4) {
      ok = Number(state.clueValue) === g.minutes;
    } else if (g.type === 5) {
      ok = Number.isInteger(state.clueValue) && g.bars[state.clueValue] === Math.max(...g.bars);
    } else if (g.type === 6) {
      ok = state.clueValue === g.rule;
    } else if (g.type === 7) {
      ok = Number(state.clueValue) === g.share;
    } else if (g.type === 8) {
      ok = state.clueValue === g.route;
    } else {
      state.clueValue = Number($("mc-clue-equation-input")?.value);
      ok = state.clueValue === g.equation;
    }
    state.clueSolved = ok;
    if (ok) {
      setFeedback(
        "✨ New clue verified. You used a different mathematical move to update the investigation.",
        "success",
      );
    } else {
      setFeedback(
        "Not quite yet. Re-read the clue, inspect the model, and try another move.",
        "hint",
      );
    }
    syncSession();
    renderCase();
  }

  function renderCase() {
    const item = data().getCase(state.caseId),
      host = $("mc-stage-content");
    if (!item || !host) return;
    $("mc-docket").hidden = true;
    $("mc-play").hidden = false;
    $("mc-case-title").textContent =
      "Case " + String(item.id).padStart(3, "0") + " · " + item.title;
    $("mc-case-chapter").textContent = data().chapters.find((ch) => ch.id === item.chapter).name;
    $("mc-stage-name").textContent = PHASE_LABELS[state.phase];
    $("mc-stage-count").textContent = state.phase + 1 + " / 7";
    $("mc-stage-fill").style.width = ((state.phase + 1) / 7) * 100 + "%";
    $("mc-stage-fill").parentElement.setAttribute("aria-valuenow", String(state.phase + 1));
    const panel = (label, title, body, extraClass = "") =>
      '<section class="mc-panel ' +
      extraClass +
      '"><span class="mc-kicker">' +
      esc(label) +
      "</span><h3>" +
      esc(title) +
      "</h3>" +
      body +
      "</section>";
    const shortLabels = [
      "Story",
      "Evidence",
      "Maths",
      "New clue",
      "Question",
      "Verdict",
      "Reflection",
    ];
    const tabs =
      '<nav class="mc-stage-nav" aria-label="Case stage navigation">' +
      PHASE_LABELS.map(
        (label, i) =>
          '<button type="button" class="mc-stage-tab ' +
          (i === state.phase ? "is-current" : i < state.phase ? "is-done" : "is-upcoming") +
          '" data-phase="' +
          i +
          '" aria-label="Stage ' +
          (i + 1) +
          ": " +
          esc(label) +
          '" ' +
          (i === state.phase ? 'aria-current="step"' : "") +
          " " +
          (i > state.phase ? "disabled" : "") +
          ' onclick="MathCourt.reviewStage(' +
          i +
          ')"><span class="mc-stage-tab-number">' +
          (i < state.phase ? "✓" : i + 1) +
          "</span><span>" +
          shortLabels[i] +
          "</span></button>",
      ).join("") +
      "</nav>";
    const claim =
      '<div class="mc-claim"><span>CLAIM TO TEST</span><strong>' +
      esc(item.claim) +
      "</strong></div>";
    const evidencePair =
      '<div class="mc-evidence-pair"><article class="mc-evidence-card mc-evidence-claim"><span>CLAIM</span><strong>' +
      esc(item.claim) +
      '</strong></article><article class="mc-evidence-card mc-evidence-record"><span>RECORD</span><strong>' +
      esc(item.evidence) +
      "</strong></article></div>";
    let content = "",
      action = "";
    if (state.phase === 0) {
      content =
        '<div class="mc-stage-layout mc-stage-layout--story">' +
        panel("CASE STORY", item.title, renderStoryNarrative(item) + claim, "mc-stage-story-card") +
        '<p class="mc-stage-nudge">Start with the story. Then compare its claim with the record.</p></div>';
      action =
        '<button class="mc-button mc-button-primary" onclick="MathCourt.advance()">Compare the evidence →</button>';
    } else if (state.phase === 1) {
      content =
        '<div class="mc-stage-layout mc-stage-layout--evidence">' +
        panel(
          "TWO THINGS TO COMPARE",
          "What does the record actually show?",
          evidencePair +
            '<p class="mc-stage-nudge">Keep the claim and the record separate. The numbers will help you decide whether they agree.</p>',
        ) +
        "</div>";
      action =
        '<button class="mc-button mc-button-primary" onclick="MathCourt.advance()">Open the maths workshop →</button>';
    } else if (state.phase === 2) {
      let taskPanel = "";
      if (!state.investigationSolved) {
        taskPanel = panel(
          "TASK 1 OF 2",
          "Find the first result",
          '<p class="mc-task-prompt">' +
            esc(item.prompt) +
            "</p>" +
            renderAnswerTiles(item.options, "investigation"),
          "mc-investigation-task-card",
        );
      } else if (!state.challengeSolved) {
        taskPanel = panel(
          "TASK 2 OF 2",
          "Use the new clue",
          '<div class="mc-solution"><strong>First finding</strong><p>' +
            esc(item.explanation) +
            '</p></div><p class="mc-task-prompt">' +
            esc(item.challenge.prompt) +
            "</p>" +
            renderAnswerTiles(item.challenge.options, "challenge"),
          "mc-investigation-task-card",
        );
      } else {
        taskPanel = panel(
          "BOTH FINDINGS VERIFIED",
          "You have your evidence",
          '<div class="mc-solution"><strong>Finding A</strong><p>' +
            esc(item.explanation) +
            '</p></div><div class="mc-solution"><strong>Finding B</strong><p>' +
            esc(item.challenge.explanation) +
            '</p></div><p class="mc-stage-nudge">Bring both findings into the next stage.</p>',
          "mc-investigation-task-card",
        );
      }
      content =
        '<div class="mc-stage-layout mc-stage-layout--investigation"><div class="mc-investigation-work">' +
        renderPlayActivity(item) +
        '</div><div class="mc-investigation-task">' +
        taskPanel +
        "</div></div>";
      action =
        '<button class="mc-button mc-button-primary" ' +
        (state.investigationSolved && state.challengeSolved ? "" : "disabled") +
        ' onclick="MathCourt.advance()">Bring both findings to court →</button><button class="mc-button mc-button-quiet" onclick="MathCourt.showHint()">Give me a hint</button>';
    } else if (state.phase === 3) {
      content =
        '<div class="mc-stage-layout mc-stage-layout--reveal">' +
        panel(
          "NEW EVIDENCE",
          "A detail has changed",
          '<p class="mc-story-text">' +
            esc(item.twist) +
            '</p><div class="mc-evidence-pair mc-evidence-pair-compact"><article class="mc-evidence-card"><span>ORIGINAL CLAIM</span><strong>' +
            esc(item.claim) +
            '</strong></article><article class="mc-evidence-card mc-evidence-record"><span>RECORD</span><strong>' +
            esc(item.evidence) +
            "</strong></article></div>",
        ) +
        panel(
          "INVESTIGATE THE CHANGE",
          "A new clue needs a new move",
          '<p class="mc-stage-nudge">This case now has a hands-on field move. Use the new detail, test the mathematical model, and verify the clue before moving on.</p>' +
            renderClueMove(item),
        ) +
        "</div>";
      action =
        '<button class="mc-button mc-button-primary" ' +
        (state.clueSolved ? "" : "disabled") +
        ' onclick="MathCourt.advance()">Ask a careful question →</button>';
    } else if (state.phase === 4) {
      const check = data().checks[item.check],
        rotated = rotatedChoices(check.choices, check.correct, item.id);
      content =
        '<div class="mc-stage-layout mc-stage-layout--question">' +
        panel(
          "CURIOSITY ROUND",
          "Which question helps most?",
          '<p class="mc-task-prompt">' +
            esc(check.prompt) +
            '</p><div class="mc-answer-options">' +
            rotated.choices
              .map(
                (opt, i) =>
                  '<button class="mc-option" onclick="MathCourt.answerCross(' +
                  i +
                  ')"><span>' +
                  String.fromCharCode(65 + i) +
                  "</span>" +
                  esc(opt) +
                  "</button>",
              )
              .join("") +
            '</div><p class="mc-stage-nudge">Choose a question that checks an assumption or clarifies the record respectfully.</p>',
        ) +
        "</div>";
      action =
        '<button class="mc-button mc-button-primary" ' +
        (state.crossSolved ? "" : "disabled") +
        ' onclick="MathCourt.advance()">Prepare the verdict →</button>';
    } else if (state.phase === 5) {
      const verdicts = [
        { id: "supported", label: "Supported", note: "The evidence supports the claim." },
        { id: "disproved", label: "Not supported", note: "The evidence does not fit the claim." },
        { id: "partly", label: "Partly supported", note: "Some parts fit, some need revision." },
        {
          id: "uncertain",
          label: "Need more evidence",
          note: "The record does not settle it yet.",
        },
      ];
      content =
        '<div class="mc-stage-layout mc-stage-layout--verdict">' +
        panel(
          "YOUR CONCLUSION",
          "Which verdict fits the evidence?",
          claim +
            '<div class="mc-verdict-options">' +
            verdicts
              .map(
                (v) =>
                  '<button class="mc-verdict-button ' +
                  (state.verdictChosen === v.id ? "is-selected" : "") +
                  '" data-verdict="' +
                  v.id +
                  '" aria-pressed="' +
                  (state.verdictChosen === v.id) +
                  '" onclick="MathCourt.selectVerdict(this.dataset.verdict)"><strong>' +
                  v.label +
                  "</strong><small>" +
                  v.note +
                  "</small></button>",
              )
              .join("") +
            "</div>",
        ) +
        "</div>";
      action =
        '<button class="mc-button mc-button-primary" ' +
        (state.verdictChosen && normalVerdict(state.verdictChosen) === normalVerdict(item.verdict)
          ? ""
          : "disabled") +
        ' onclick="MathCourt.advance()">Hear the reflection →</button>';
    } else {
      const verdictLabels = {
        supported: "The evidence fits",
        disproved: "Let’s revise the idea",
        partly: "Some parts fit",
        uncertain: "Let’s gather one more clue",
      };
      const v = normalVerdict(item.verdict);
      content =
        '<div class="mc-stage-layout mc-stage-layout--reflection">' +
        panel(
          "MATHS RESULT",
          verdictLabels[v] || "Final result",
          '<div class="mc-solution"><strong>' +
            esc(item.claim) +
            "</strong><p>" +
            esc(item.explanation) +
            '</p></div><p class="mc-story-text">' +
            esc(item.moral || item.twist) +
            "</p>",
          "mc-result-card",
        ) +
        "</div>";
      action =
        '<button class="mc-button mc-button-primary" onclick="MathCourt.advance()">' +
        (item.id < 100
          ? "Open Case " + (item.id + 1) + " →"
          : "Celebrate the 100-case journey 🎉") +
        '</button><button class="mc-button mc-button-quiet" onclick="MathCourt.goDocket()">Return to the case map</button>';
    }
    host.innerHTML =
      tabs +
      '<section class="mc-active-stage mc-stage-phase-' +
      state.phase +
      '">' +
      content +
      '<div class="mc-stage-actions">' +
      action +
      (state.phase > 0 && state.phase < 6
        ? '<button class="mc-button mc-button-quiet" onclick="MathCourt.previous()">← Review previous stage</button>'
        : "") +
      "</div></section>";
    const feedback = $("mc-feedback");
    if (feedback) {
      feedback.textContent = state.feedback;
      feedback.className =
        "mc-feedback" + (state.feedback ? " is-visible mc-feedback-" + state.feedbackKind : "");
    }
  }
  function showHint() {
    const item = data().getCase(state.caseId);
    setFeedback(hintFor(item), "hint");
  }
  function reviewStage(index) {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index > state.phase ||
      index >= PHASE_LABELS.length ||
      index === state.phase
    )
      return;
    state.phase = index;
    state.feedback = "";
    state.feedbackKind = "";
    syncSession();
    renderCase();
    scrollCaseIntoView();
  }
  function previous() {
    if (state.phase > 0) reviewStage(state.phase - 1);
  }
  function resetProgress() {
    if (!window.confirm("Reset Math Court case progress on this device? This cannot be undone."))
      return;
    state.completed.clear();
    state.session = null;
    state.docketChapterId = 1;
    state.feedback = "";
    persist();
    renderDocket();
  }
  root.MathCourt = {
    open,
    openCase,
    resume,
    goDocket,
    back,
    chooseChapter,
    advance,
    chooseEvidence,
    answerInvestigation,
    answerChallenge,
    answerCross,
    selectVerdict,
    showHint,
    previous,
    reviewStage,
    resetProgress,
    submitClueMove,
    chooseClueValue,
    setClueValue,
    markClueChanged,
    startClueDrag,
    dropClueToken,
    toggleClueCell,
    setVisualMode,
    focusVisual,
    startAnswerDrag,
    dropAnswer,
    chooseLabSlot,
    chooseLabNumber,
    chooseLabOperator,
    chooseLabOperator2,
    toggleThirdOperand,
    calculateLab,
    setPatternRule,
    submitPatternPrediction,
    checkPlayGoal,
    selectDataRecord,
    setFraction,
    toggleShapeCell,
    shapeStats,
    setLabTimeline,
    toggleDataZoom,
    setDataZoom: toggleDataZoom,
    setRuleInput,
    setRuleType,
    adjustShare,
    extendRoute,
    resetRoute,
    adjustAllocation,
    resetShape: function () {
      if (!state.lab.cells.length) return;
      state.lab.cells = [];
      markLabPlay();
      refreshCaseKeepingScroll();
    },
  };
})(window);
