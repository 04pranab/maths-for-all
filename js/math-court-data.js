/* Math Court's 100-case season. Data-only module, safe to load in browser or Node. */
(function (root) {
  "use strict";
  const cases = [
  {
    "id": 1,
    "chapter": 1,
    "title": "The Missing Festival Crates",
    "story": "A festival delivery ledger lists 37 crates already unloaded from an order of 52.",
    "claim": "The organiser claims 15 crates are still unaccounted for.",
    "prompt": "How many crates had not yet been recorded as unloaded?",
    "options": [
      "15",
      "25",
      "89"
    ],
    "answer": 0,
    "explanation": "52 − 37 = 15 crates had not yet been recorded. This is a difference in records, not proof that the crates were stolen.",
    "twist": "The second cart's manifest lists the remaining 15 crates, all logged ten minutes later. The first tally was taken too early.",
    "moral": "Check the whole record before blaming someone.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "Order: 52 crates. First unloading tally: 37. Second cart manifest: 15 crates logged later.",
    "challenge": {
      "prompt": "Use the two records to check the total shipment: 37 crates were unloaded first and 15 were on the later cart. How many crates were delivered altogether?",
      "options": [
        "52 crates",
        "42 crates",
        "62 crates"
      ],
      "answer": 0,
      "explanation": "37 + 15 = 52. The later manifest reconciles the shipment."
    }
  },
  {
    "id": 2,
    "chapter": 1,
    "title": "The Banner of 407 or 470",
    "story": "A banner maker received two handwritten totals. One says 407; the other says 470.",
    "claim": "The clerk claims the quantities differ by 73.",
    "prompt": "What is the difference between 470 and 407?",
    "options": [
      "53",
      "63",
      "73"
    ],
    "answer": 1,
    "explanation": "470 − 407 = 63. Check the difference by adding it back: 407 + 63 = 470.",
    "twist": "The original page shows the last digit of 407 was smudged, so arithmetic alone cannot tell which total was intended.",
    "moral": "Verify the source as well as the calculation.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "Two copies read 407 and 470; the original is smudged.",
    "challenge": {
      "prompt": "Add the correct difference back to the smaller quantity. What should you get?",
      "options": [
        "470",
        "460",
        "480"
      ],
      "answer": 0,
      "explanation": "407 + 63 = 470, returning to the larger recorded quantity."
    }
  },
  {
    "id": 3,
    "chapter": 1,
    "title": "The Two Receipts",
    "story": "A receipt lists items costing ₹18, ₹12 and ₹12. The customer says the final ₹12 line was copied twice for the same item.",
    "claim": "The customer claims the corrected bill is ₹42.",
    "prompt": "What is the bill after removing the duplicated ₹12 line?",
    "options": [
      "₹30",
      "₹42",
      "₹24"
    ],
    "answer": 0,
    "explanation": "₹18 + ₹12 = ₹30. Removing the duplicate line avoids charging twice for the same item.",
    "twist": "The second ₹12 entry turns out to be a copying error, not an extra purchase.",
    "moral": "Correct the record without assuming bad intentions.",
    "verdict": "disproved",
    "check": "records",
    "evidence": "The second ₹12 entry refers to the same item as the first.",
    "challenge": {
      "prompt": "The corrected bill is ₹30 and the customer pays ₹50. How much change should be returned?",
      "options": [
        "₹20",
        "₹18",
        "₹30"
      ],
      "answer": 0,
      "explanation": "₹50 − ₹30 = ₹20 change."
    }
  },
  {
    "id": 4,
    "chapter": 1,
    "title": "The Endless Queue",
    "story": "Six rows of seats hold eight people each. A photograph shows every seat occupied, but a marshal counted people also standing near the entrance.",
    "claim": "The marshal estimates 56 people were seated.",
    "prompt": "How many people fit in six full rows of eight?",
    "options": [
      "42",
      "48",
      "56"
    ],
    "answer": 1,
    "explanation": "Six complete rows of eight seats give 6 × 8 = 48 seats. The nearby crowd is not part of the seating capacity.",
    "twist": "The marshal included people outside the seating rows in the estimate.",
    "moral": "State whether a number is a count, estimate, or capacity.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "There are six rows and eight seats in every row.",
    "challenge": {
      "prompt": "If two more rows with eight seats each are added, how many seats will there be?",
      "options": [
        "64 seats",
        "56 seats",
        "72 seats"
      ],
      "answer": 0,
      "explanation": "Eight rows × eight seats = 64 seats."
    }
  },
  {
    "id": 5,
    "chapter": 1,
    "title": "The Water-Jar Delivery",
    "story": "Six carts carry 12 full jars each. A seventh cart arrives with only six jars because it was loaded halfway.",
    "claim": "The storekeeper claims the delivery contains 84 jars.",
    "prompt": "How many jars arrived altogether?",
    "options": [
      "72",
      "78",
      "84"
    ],
    "answer": 1,
    "explanation": "6 × 12 + 6 = 78 jars.",
    "twist": "The final cart was half full, so counting seven full carts overstates the delivery.",
    "moral": "Account for partial groups rather than treating them as complete.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "Six carts have 12 jars each; the last cart has 6 jars.",
    "challenge": {
      "prompt": "How many jars are carried by the six full carts, not including the half-full final cart?",
      "options": [
        "72 jars",
        "78 jars",
        "66 jars"
      ],
      "answer": 0,
      "explanation": "Six full carts × 12 jars = 72 jars."
    }
  },
  {
    "id": 6,
    "chapter": 1,
    "title": "The Empty Drawer",
    "story": "Two ledgers report 304 coins and 34 coins. The clerk says one must be wrong and asks the court to quantify the discrepancy.",
    "claim": "The clerk claims the difference is 280 coins.",
    "prompt": "What is 304 − 34?",
    "options": [
      "270",
      "280",
      "370"
    ],
    "answer": 0,
    "explanation": "304 − 34 = 270 coins. The difference can be checked by adding 270 back to 34 to get 304.",
    "twist": "The smaller total was written before the day's final deposit, so the records refer to different times.",
    "moral": "Check dates and context before treating records as contradictory.",
    "verdict": "disproved",
    "check": "records",
    "evidence": "The two ledgers were written at different times.",
    "challenge": {
      "prompt": "Check the subtraction using addition. What is 34 + 270?",
      "options": [
        "304",
        "338",
        "270"
      ],
      "answer": 0,
      "explanation": "34 + 270 = 304, confirming the subtraction."
    }
  },
  {
    "id": 7,
    "chapter": 1,
    "title": "The Marshals' Recount",
    "story": "There are 28 visitors at the north gate and 17 at the south. Five people appear on both lists because they passed through both gates.",
    "claim": "The report states that 45 distinct visitors attended.",
    "prompt": "How many distinct visitors are represented?",
    "options": [
      "40",
      "45",
      "50"
    ],
    "answer": 0,
    "explanation": "28 + 17 − 5 = 40 distinct visitors.",
    "twist": "The same five visitors were counted at both gates. Both gate counts were accurate, but their sum was not a unique-person count.",
    "moral": "Define what is being counted and remove duplicates.",
    "verdict": "disproved",
    "check": "records",
    "evidence": "North gate: 28. South gate: 17. Duplicates: 5.",
    "challenge": {
      "prompt": "If only three people appeared on both gate lists rather than five, how many distinct visitors would the lists represent?",
      "options": [
        "42",
        "40",
        "45"
      ],
      "answer": 0,
      "explanation": "28 + 17 − 3 = 42 distinct visitors."
    }
  },
  {
    "id": 8,
    "chapter": 1,
    "title": "The Borrowed Numbers",
    "story": "A helper subtracts 47 from 83 and writes 46. A second helper suspects a regrouping error.",
    "claim": "The first helper says 83 − 47 = 46.",
    "prompt": "What is the correct difference?",
    "options": [
      "36",
      "46",
      "56"
    ],
    "answer": 0,
    "explanation": "83 − 47 = 36. Check by addition: 36 + 47 = 83.",
    "twist": "The inverse-operation check exposes the slip.",
    "moral": "Use an inverse operation to check an answer.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "The result should add back to 83 when 47 is added.",
    "challenge": {
      "prompt": "Which sum checks the corrected answer to 83 − 47?",
      "options": [
        "36 + 47 = 83",
        "46 + 47 = 83",
        "36 + 57 = 83"
      ],
      "answer": 0,
      "explanation": "Adding the subtracted quantity back must recover the starting number."
    }
  },
  {
    "id": 9,
    "chapter": 1,
    "title": "The Mayor's Estimate",
    "story": "A report rounds a visitor count to the nearest ten and records 80. The mayor treats 80 as an exact count.",
    "claim": "The mayor claims exactly 80 people attended.",
    "prompt": "Which exact counts round to 80 to the nearest ten?",
    "options": [
      "70 to 79",
      "75 to 84",
      "85 to 94"
    ],
    "answer": 1,
    "explanation": "Whole-number counts 75 through 84 round to 80 under standard nearest-ten rounding.",
    "twist": "The original tally was recycled, so the exact count cannot be recovered from the rounded total alone.",
    "moral": "Be honest about the precision of evidence.",
    "verdict": "uncertain",
    "check": "assumptions",
    "evidence": "The only surviving record is rounded to the nearest ten.",
    "challenge": {
      "prompt": "Which count cannot round to 80 to the nearest ten?",
      "options": [
        "74",
        "77",
        "82"
      ],
      "answer": 0,
      "explanation": "74 rounds to 70; 77 and 82 round to 80."
    }
  },
  {
    "id": 10,
    "chapter": 1,
    "title": "The Bell-Tower Ledger",
    "story": "The tower began with 120 candles, received 65 more and used 143 during the ceremony.",
    "claim": "The keeper reports 52 candles remain.",
    "prompt": "How many candles should remain?",
    "options": [
      "32",
      "42",
      "52"
    ],
    "answer": 1,
    "explanation": "120 + 65 − 143 = 42 candles.",
    "twist": "The keeper accidentally used the opening stock twice when writing the note.",
    "moral": "Show each step so mistakes can be traced.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "Opening stock 120; delivery 65; used 143.",
    "challenge": {
      "prompt": "How many candles were available immediately before the ceremony?",
      "options": [
        "185",
        "143",
        "42"
      ],
      "answer": 0,
      "explanation": "120 opening candles + 65 delivered candles = 185 available."
    }
  },
  {
    "id": 11,
    "chapter": 2,
    "title": "The Locker That Would Not Open",
    "story": "The archive practice lock accepts a three-digit code divisible by three. The clerk suggests 425 because every digit is odd.",
    "claim": "The clerk claims 425 fits the lock's rule.",
    "prompt": "Which candidate is divisible by three?",
    "options": [
      "425",
      "426",
      "427"
    ],
    "answer": 1,
    "explanation": "4 + 2 + 6 = 12, which is divisible by three; therefore 426 is divisible by three.",
    "twist": "The lock's rule concerns divisibility, not whether the digits are odd.",
    "moral": "Use the stated rule rather than a superficial pattern.",
    "verdict": "disproved",
    "check": "definition",
    "evidence": "The code must be divisible by 3.",
    "challenge": {
      "prompt": "What is the digit sum of 425, the candidate that fails the divisibility-by-three test?",
      "options": [
        "11",
        "12",
        "14"
      ],
      "answer": 0,
      "explanation": "4 + 2 + 5 = 11, which is not divisible by three."
    }
  },
  {
    "id": 12,
    "chapter": 2,
    "title": "The Prime Orchard",
    "story": "A gardener labels 21 a prime number because it is odd. The court checks whether it has factors besides 1 and itself.",
    "claim": "The gardener claims 21 is prime.",
    "prompt": "Which number below is prime?",
    "options": [
      "21",
      "23",
      "27"
    ],
    "answer": 1,
    "explanation": "23 has no positive factors other than 1 and 23; 21 and 27 are composite.",
    "twist": "The gardener checked only whether the number was even.",
    "moral": "Check definitions, not appearances.",
    "verdict": "disproved",
    "check": "definition",
    "evidence": "21 = 3 × 7 and 27 = 3 × 9.",
    "challenge": {
      "prompt": "Which factorisation explains why 21 is not prime?",
      "options": [
        "3 × 7",
        "3 × 8",
        "2 × 11"
      ],
      "answer": 0,
      "explanation": "21 = 3 × 7, so it has factors besides 1 and itself."
    }
  },
  {
    "id": 13,
    "chapter": 2,
    "title": "The Lanterns Left Over",
    "story": "Twenty-nine lanterns must be split among four equal teams. The organiser says no lantern will remain.",
    "claim": "The organiser claims the split has no remainder.",
    "prompt": "How many lanterns remain after giving each team seven?",
    "options": [
      "0",
      "1",
      "3"
    ],
    "answer": 1,
    "explanation": "4 × 7 = 28, leaving one lantern.",
    "twist": "The rule requires whole lanterns and equal team sizes; the remainder cannot disappear.",
    "moral": "Explain the remainder instead of hiding it.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "29 lanterns are split into four equal whole-number groups.",
    "challenge": {
      "prompt": "One more lantern arrives, making 30. If four teams receive equal whole-number shares, what is the result?",
      "options": [
        "7 each, with 2 left",
        "8 each, with none left",
        "6 each, with 6 left"
      ],
      "answer": 0,
      "explanation": "4 × 7 = 28, leaving two lanterns."
    }
  },
  {
    "id": 14,
    "chapter": 2,
    "title": "The Equal-Team Contract",
    "story": "Groups of 24 and 36 volunteers must be divided into same-sized teams with no one left out.",
    "claim": "A planner claims teams of 18 work for both groups.",
    "prompt": "What is the largest possible team size that works for both groups?",
    "options": [
      "6",
      "12",
      "18"
    ],
    "answer": 1,
    "explanation": "The greatest common divisor of 24 and 36 is 12.",
    "twist": "A size of 18 works only for the second group if the first group is ignored.",
    "moral": "A fair rule must satisfy every group in the agreement.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "Both 24 and 36 must be divisible by the team size.",
    "challenge": {
      "prompt": "If every team has 12 volunteers, how many teams can be formed from each group?",
      "options": [
        "2 teams from 24 and 3 from 36",
        "3 teams from 24 and 2 from 36",
        "4 teams from 24 and 6 from 36"
      ],
      "answer": 0,
      "explanation": "24 ÷ 12 = 2 teams and 36 ÷ 12 = 3 teams."
    }
  },
  {
    "id": 15,
    "chapter": 2,
    "title": "The Bell With a Secret Rhythm",
    "story": "A bell keeper records 4, 7, 10, 13. A witness predicts 17 because the values increase.",
    "claim": "The witness claims the next value is 17.",
    "prompt": "If the rule is to add three, what comes next?",
    "options": [
      "15",
      "16",
      "17"
    ],
    "answer": 1,
    "explanation": "The differences are 3, 3 and 3, so the next value under the stated pattern is 13 + 3 = 16, not 17.",
    "twist": "The witness noticed direction but not the size of each change.",
    "moral": "Identify a rule precisely and test it.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "The first four terms increase by three each time.",
    "challenge": {
      "prompt": "Following the same add-three rule, what is the tenth term of 4, 7, 10, 13, …?",
      "options": [
        "31",
        "28",
        "34"
      ],
      "answer": 0,
      "explanation": "The tenth term is 4 + 9 × 3 = 31."
    }
  },
  {
    "id": 16,
    "chapter": 2,
    "title": "The Square-Stone Claim",
    "story": "A path has a 4 by 4 grid of stones. A builder doubles both side lengths and claims the number of stones merely doubles.",
    "claim": "The builder claims the new path needs 32 stones.",
    "prompt": "How many stones are in the new 8 by 8 grid?",
    "options": [
      "32",
      "48",
      "64"
    ],
    "answer": 2,
    "explanation": "8 × 8 = 64, four times the original 16.",
    "twist": "The new grid reveals how doubling both dimensions quadruples area.",
    "moral": "Test how a change in dimensions affects area.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "Original grid: 4 by 4. New grid: 8 by 8.",
    "challenge": {
      "prompt": "The original grid had 16 stones. How many additional stones does the 8 by 8 grid use?",
      "options": [
        "48 more",
        "32 more",
        "64 more"
      ],
      "answer": 0,
      "explanation": "64 − 16 = 48 additional stones."
    }
  },
  {
    "id": 17,
    "chapter": 2,
    "title": "The Digit-Sum Seal",
    "story": "An archive code must be divisible by three. Three candidates differ by only one digit.",
    "claim": "The clerk claims 574 passes the divisibility test.",
    "prompt": "Which candidate passes?",
    "options": [
      "573",
      "574",
      "575"
    ],
    "answer": 0,
    "explanation": "5 + 7 + 3 = 15, divisible by three. The other digit sums are 16 and 17.",
    "twist": "A faded stamp made the last digit hard to read, but divisibility helps verify the candidate.",
    "moral": "Use a quick check, then verify the original record.",
    "verdict": "disproved",
    "check": "definition",
    "evidence": "A number is divisible by 3 when its digit sum is divisible by 3.",
    "challenge": {
      "prompt": "Why does 574 fail the divisibility-by-three test?",
      "options": [
        "Its digit sum is 16",
        "Its digit sum is 15",
        "Its digit sum is 17"
      ],
      "answer": 0,
      "explanation": "5 + 7 + 4 = 16, not divisible by three."
    }
  },
  {
    "id": 18,
    "chapter": 2,
    "title": "The Rounded Parade Count",
    "story": "A parade report records 340 visitors rounded to the nearest ten. A speaker announces that exactly 340 people attended.",
    "claim": "The speaker claims 340 is exact.",
    "prompt": "Which whole-number counts could round to 340?",
    "options": [
      "330 to 339",
      "335 to 344",
      "345 to 354"
    ],
    "answer": 1,
    "explanation": "Counts from 335 through 344 round to 340.",
    "twist": "The counter recorded rounded estimates, not an exact total.",
    "moral": "Do not turn a rounded value into a false exact count.",
    "verdict": "partly",
    "check": "assumptions",
    "evidence": "The report was rounded to the nearest ten.",
    "challenge": {
      "prompt": "Which count would not round to 340 to the nearest ten?",
      "options": [
        "334",
        "338",
        "344"
      ],
      "answer": 0,
      "explanation": "334 rounds to 330; 338 and 344 round to 340."
    }
  },
  {
    "id": 19,
    "chapter": 2,
    "title": "The Odd Boat Problem",
    "story": "Fifteen people need boats holding two people each. The organiser claims every boat can be full and everyone can travel.",
    "claim": "The organiser claims seven boats are enough.",
    "prompt": "What is the minimum number of boats needed?",
    "options": [
      "7",
      "8",
      "9"
    ],
    "answer": 1,
    "explanation": "Seven boats carry 14 people, so an eighth boat is needed.",
    "twist": "The organiser omitted the possibility of one partly occupied boat.",
    "moral": "State whether spare capacity is permitted.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "Each boat carries at most two people; a boat may carry one.",
    "challenge": {
      "prompt": "Eight two-person boats have how many seats total, and how many are unused if all 15 people board?",
      "options": [
        "16 seats, 1 unused",
        "15 seats, none unused",
        "18 seats, 3 unused"
      ],
      "answer": 0,
      "explanation": "Eight boats hold 16 people, leaving one seat empty."
    }
  },
  {
    "id": 20,
    "chapter": 2,
    "title": "The Frozen Fountain",
    "story": "A thermometer reads −2°C before sunrise. By noon, the temperature rises by 5 degrees. A witness treats the rise as a negative change.",
    "claim": "The witness claims the noon reading is −7°C.",
    "prompt": "What is the noon temperature?",
    "options": [
      "−7°C",
      "3°C",
      "7°C"
    ],
    "answer": 1,
    "explanation": "The temperature starts at −2°C and rises by five degrees: −2 + 5 = 3°C. Moving right on the number line reaches 3.",
    "twist": "The witness confused a negative starting value with a negative change.",
    "moral": "Represent signed quantities before calculating.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "A thermometer reads −2°C before sunrise. By noon, the temperature rises by 5 degrees. A witness treats the rise as a negative change.",
    "challenge": {
      "prompt": "After noon, the temperature falls by another 4 degrees from 3°C. What is the new temperature?",
      "options": [
        "−1°C",
        "1°C",
        "7°C"
      ],
      "answer": 0,
      "explanation": "3 − 4 = −1°C. This confirms the stated relationship."
    }
  },
  {
    "id": 21,
    "chapter": 3,
    "title": "The Bigger-Slice Testimony",
    "story": "Two identical pies are compared. One slice is 1/4 of a pie and another is 1/6. A witness says the sixth must be larger because six is larger than four.",
    "claim": "The witness claims 1/6 is larger than 1/4.",
    "prompt": "Which fraction is larger?",
    "options": [
      "1/4",
      "1/6",
      "They are equal"
    ],
    "answer": 0,
    "explanation": "A quarter is larger than a sixth when the wholes are equal.",
    "twist": "Both pies are the same size, so comparing the denominators is meaningful here.",
    "moral": "Explain what the denominator counts.",
    "verdict": "disproved",
    "check": "definition",
    "evidence": "Two identical pies are compared. One slice is 1/4 of a pie and another is 1/6. A witness says the sixth must be larger because six is larger than four.",
    "challenge": {
      "prompt": "Which fraction with denominator 12 is equivalent to one quarter?",
      "options": [
        "3/12",
        "2/12",
        "4/12"
      ],
      "answer": 0,
      "explanation": "Multiplying numerator and denominator of 1/4 by 3 gives 3/12."
    }
  },
  {
    "id": 22,
    "chapter": 3,
    "title": "The Festival Punch Dispute",
    "story": "One jug mixes 2 cups concentrate with 3 cups water. Another mixes 3 cups concentrate with 6 cups water. The second contains more liquid overall.",
    "claim": "The organiser claims the second mixture is stronger.",
    "prompt": "Which mixture has the stronger concentrate-to-water ratio?",
    "options": [
      "First jug",
      "Second jug",
      "Same strength"
    ],
    "answer": 0,
    "explanation": "The first ratio is 2:3; the second is 3:6 = 1:2. The first mixture has more concentrate per unit of water.",
    "twist": "The larger jug is more diluted despite containing more liquid.",
    "moral": "Compare ratios, not just totals.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "One jug mixes 2 cups concentrate with 3 cups water. Another mixes 3 cups concentrate with 6 cups water. The second contains more liquid overall.",
    "challenge": {
      "prompt": "To keep the first jug's 2:3 concentrate-to-water ratio, how much concentrate is needed with 6 cups of water?",
      "options": [
        "4 cups",
        "3 cups",
        "2 cups"
      ],
      "answer": 0,
      "explanation": "Doubling the water from 3 to 6 cups doubles concentrate from 2 to 4 cups."
    }
  },
  {
    "id": 23,
    "chapter": 3,
    "title": "The Meter That Lied",
    "story": "Two devices show 2.4 m and 2.40 m. A clerk declares one must be longer because it has more digits.",
    "claim": "The clerk claims 2.40 m is longer.",
    "prompt": "Which statement is correct?",
    "options": [
      "2.40 m is longer",
      "They represent the same length",
      "2.4 m is twice as long"
    ],
    "answer": 1,
    "explanation": "2.4 and 2.40 have the same numerical value, though they may communicate different precision.",
    "twist": "The devices record to different precision, so displayed digits alone do not prove reliability.",
    "moral": "Distinguish value from measurement precision.",
    "verdict": "disproved",
    "check": "units",
    "evidence": "Two devices show 2.4 m and 2.40 m. A clerk declares one must be longer because it has more digits.",
    "challenge": {
      "prompt": "How many centimetres are in 2.4 metres?",
      "options": [
        "240 cm",
        "24 cm",
        "204 cm"
      ],
      "answer": 0,
      "explanation": "2.4 × 100 = 240 cm. This confirms the stated relationship."
    }
  },
  {
    "id": 24,
    "chapter": 3,
    "title": "The Twenty-Percent Poster",
    "story": "A jacket costs ₹500. A sign says 20% off. The cashier reduces the price by ₹20 and says that is the promised saving.",
    "claim": "The cashier claims the discounted price is ₹480.",
    "prompt": "What is the discounted price?",
    "options": [
      "₹400",
      "₹480",
      "₹420"
    ],
    "answer": 0,
    "explanation": "20% of ₹500 is ₹100, so the discounted price is ₹400.",
    "twist": "The cashier treated 20 percent as 20 rupees.",
    "moral": "Identify the whole to which a percentage applies.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "A jacket costs ₹500. A sign says 20% off. The cashier reduces the price by ₹20 and says that is the promised saving.",
    "challenge": {
      "prompt": "Which fraction of the original ₹500 price is a 20% discount?",
      "options": [
        "1/5",
        "1/4",
        "1/10"
      ],
      "answer": 0,
      "explanation": "20% = 20/100 = 1/5. This confirms the stated relationship."
    }
  },
  {
    "id": 25,
    "chapter": 3,
    "title": "The Two Different Wholes",
    "story": "A quarter of a small cake is compared with a quarter of a large cake. The larger cake is twice the area of the smaller one.",
    "claim": "A witness claims the two pieces are equal because both are quarters.",
    "prompt": "Which statement is correct?",
    "options": [
      "The pieces are equal",
      "The piece from the large cake is larger",
      "The piece from the small cake is larger"
    ],
    "answer": 1,
    "explanation": "The same fraction of a larger whole is larger; the large cake's quarter has twice the area.",
    "twist": "Both witnesses used the word quarter but imagined different wholes.",
    "moral": "Name the whole before comparing fractions.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "A quarter of a small cake is compared with a quarter of a large cake. The larger cake is twice the area of the smaller one.",
    "challenge": {
      "prompt": "If the small cake has area 80 cm² and the large cake has twice that area, how large is a quarter of the large cake?",
      "options": [
        "40 cm²",
        "20 cm²",
        "80 cm²"
      ],
      "answer": 0,
      "explanation": "The large cake has area 160 cm²; one quarter is 40 cm²."
    }
  },
  {
    "id": 26,
    "chapter": 3,
    "title": "The Recipe That Would Not Scale",
    "story": "A recipe for four people needs 200 g of rice. A cook prepares ten servings using 300 g.",
    "claim": "The cook claims 300 g is enough to preserve the recipe.",
    "prompt": "How much rice is needed for ten people at the same rate?",
    "options": [
      "400 g",
      "500 g",
      "600 g"
    ],
    "answer": 1,
    "explanation": "200 ÷ 4 = 50 g per person; 50 × 10 = 500 g.",
    "twist": "The cook increased the batch without preserving its ratio.",
    "moral": "Preserve ratios when scaling a recipe.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "A recipe for four people needs 200 g of rice. A cook prepares ten servings using 300 g.",
    "challenge": {
      "prompt": "At the same rate of 50 g per person, how much rice is needed for 12 people?",
      "options": [
        "600 g",
        "550 g",
        "650 g"
      ],
      "answer": 0,
      "explanation": "50 × 12 = 600 g. This confirms the stated relationship."
    }
  },
  {
    "id": 27,
    "chapter": 3,
    "title": "The Double-Batch Testimony",
    "story": "A batch costs ₹240 in ingredients plus a fixed ₹60 equipment fee per cooking session. Two batches are cooked in one session.",
    "claim": "The clerk claims the total is ₹600.",
    "prompt": "What is the cost for two batches and one fixed fee?",
    "options": [
      "₹540",
      "₹600",
      "₹660"
    ],
    "answer": 0,
    "explanation": "2 × ₹240 + ₹60 = ₹540.",
    "twist": "The second batch does not require a second equipment fee in this arrangement.",
    "moral": "Separate fixed costs from per-batch costs.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "A batch costs ₹240 in ingredients plus a fixed ₹60 equipment fee per cooking session. Two batches are cooked in one session.",
    "challenge": {
      "prompt": "What would three batches cost if the same ₹60 equipment fee is charged once?",
      "options": [
        "₹780",
        "₹900",
        "₹720"
      ],
      "answer": 0,
      "explanation": "Three ingredient batches cost ₹720; adding one ₹60 fee gives ₹780."
    }
  },
  {
    "id": 28,
    "chapter": 3,
    "title": "The Two-Discount Trick",
    "story": "A ₹1,000 item receives a 10% discount followed by another 10% off the reduced price. A seller says this equals 20% off the original price.",
    "claim": "The seller claims the final price is ₹800.",
    "prompt": "What is the final price after both discounts?",
    "options": [
      "₹800",
      "₹810",
      "₹900"
    ],
    "answer": 1,
    "explanation": "First ₹1,000 becomes ₹900; 10% of ₹900 is ₹90, leaving ₹810.",
    "twist": "The second discount applies to ₹900, not the original ₹1,000.",
    "moral": "Check the base amount each time a percentage is applied.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "A ₹1,000 item receives a 10% discount followed by another 10% off the reduced price. A seller says this equals 20% off the original price.",
    "challenge": {
      "prompt": "How much more expensive is the successive-discount price than the price after one 20% discount?",
      "options": [
        "₹10",
        "₹20",
        "₹90"
      ],
      "answer": 0,
      "explanation": "Successive discounts leave ₹810; a single 20% discount leaves ₹800."
    }
  },
  {
    "id": 29,
    "chapter": 3,
    "title": "The T-Shirt Ratio",
    "story": "Team A has 12 shirts for 8 players. Team B has 15 shirts for 12 players. A manager says B is better supplied because it has more shirts.",
    "claim": "The manager claims Team B has more shirts per player.",
    "prompt": "Which team has more shirts per player?",
    "options": [
      "Team A",
      "Team B",
      "Same amount"
    ],
    "answer": 0,
    "explanation": "A has 12 ÷ 8 = 1.5 per player; B has 15 ÷ 12 = 1.25.",
    "twist": "The larger total belongs to a larger team.",
    "moral": "Use a unit rate for a fair comparison.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "Team A has 12 shirts for 8 players. Team B has 15 shirts for 12 players. A manager says B is better supplied because it has more shirts.",
    "challenge": {
      "prompt": "How many shirts would a 12-player team need to match Team A's rate of 1.5 shirts per player?",
      "options": [
        "18 shirts",
        "15 shirts",
        "20 shirts"
      ],
      "answer": 0,
      "explanation": "12 × 1.5 = 18 shirts."
    }
  },
  {
    "id": 30,
    "chapter": 3,
    "title": "The Reservoir Agreement",
    "story": "A supply of 120 litres is divided in ratio 2:3 between two neighbourhood tanks. A proposal assigns 60 L and 90 L.",
    "claim": "The proposal claims to fit within the available 120-litre supply.",
    "prompt": "How much should the first tank receive?",
    "options": [
      "40 L",
      "48 L",
      "60 L"
    ],
    "answer": 1,
    "explanation": "There are five parts: 120 ÷ 5 = 24 L per part; the first gets 48 L.",
    "twist": "The proposal totals 150 L, more than the available supply.",
    "moral": "Check both the ratio and the resource limit.",
    "verdict": "disproved",
    "check": "constraints",
    "evidence": "A supply of 120 litres is divided in ratio 2:3 between two neighbourhood tanks. A proposal assigns 60 L and 90 L.",
    "challenge": {
      "prompt": "If 120 litres are split in ratio 2:3, how much should the second tank receive?",
      "options": [
        "72 L",
        "48 L",
        "60 L"
      ],
      "answer": 0,
      "explanation": "The second tank receives 3/5 × 120 = 72 L."
    }
  },
  {
    "id": 31,
    "chapter": 4,
    "title": "The Fence Around the Garden",
    "story": "A 3 m by 8 m plot and a 4 m by 6 m plot both have area 24 m². A builder says they need equal lengths of fence.",
    "claim": "The builder claims the 3 m by 8 m perimeter is 20 m.",
    "prompt": "What is the perimeter of the 3 m by 8 m plot?",
    "options": [
      "11 m",
      "22 m",
      "24 m"
    ],
    "answer": 1,
    "explanation": "Perimeter is 2(3 + 8) = 22 m; the other plot has perimeter 20 m.",
    "twist": "Equal area does not imply equal boundary length.",
    "moral": "Match the measurement to what is being built.",
    "verdict": "disproved",
    "check": "definition",
    "evidence": "A 3 m by 8 m plot and a 4 m by 6 m plot both have area 24 m². A builder says they need equal lengths of fence.",
    "challenge": {
      "prompt": "If the 3 m by 8 m plot needs 22 m of fencing and the 4 m by 6 m plot needs 20 m, how much more does the first need?",
      "options": [
        "2 m",
        "4 m",
        "6 m"
      ],
      "answer": 0,
      "explanation": "22 − 20 = 2 m. This confirms the stated relationship."
    }
  },
  {
    "id": 32,
    "chapter": 4,
    "title": "The Sign That Pointed Backwards",
    "story": "A sign faces east. A worker turns it clockwise a quarter-turn, then claims it faces north.",
    "claim": "The worker claims the sign faces north.",
    "prompt": "Where does it face?",
    "options": [
      "North",
      "South",
      "West"
    ],
    "answer": 1,
    "explanation": "A clockwise quarter-turn from east points south.",
    "twist": "The worker imagined a counterclockwise turn while saying clockwise.",
    "moral": "Use a shared reference frame for directions.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "A sign faces east. A worker turns it clockwise a quarter-turn, then claims it faces north.",
    "challenge": {
      "prompt": "After facing south, a sign is turned clockwise by another quarter-turn. Which way does it face?",
      "options": [
        "West",
        "East",
        "North"
      ],
      "answer": 0,
      "explanation": "A clockwise quarter-turn from south points west."
    }
  },
  {
    "id": 33,
    "chapter": 4,
    "title": "The Tower and Its Shadow",
    "story": "A 2 m pole casts a 3 m shadow. At the same moment, a tower casts a 24 m shadow on level ground.",
    "claim": "A witness estimates the tower is 18 m tall.",
    "prompt": "What height follows from the similar-triangle model?",
    "options": [
      "12 m",
      "16 m",
      "18 m"
    ],
    "answer": 1,
    "explanation": "The height-to-shadow ratio is 2:3. Tower height is 24 × 2 ÷ 3 = 16 m.",
    "twist": "A second shadow was measured later after the sun angle changed, so only the simultaneous measurement fits the model.",
    "moral": "State the conditions required for proportional measurements.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "Pole: 2 m tall, 3 m shadow. Tower shadow: 24 m at the same time.",
    "challenge": {
      "prompt": "The pole-to-shadow ratio is 2:3. If the tower shadow is 30 m at the same time, how tall is the tower?",
      "options": [
        "20 m",
        "18 m",
        "22 m"
      ],
      "answer": 0,
      "explanation": "Tower height = 30 × 2/3 = 20 m."
    }
  },
  {
    "id": 34,
    "chapter": 4,
    "title": "The Mosaic With One Side Missing",
    "story": "A mosaic outline is symmetrical, but its left half contains three blue tiles while the reflected right half has two.",
    "claim": "The artist claims the full design has reflection symmetry.",
    "prompt": "What must be true for reflection symmetry?",
    "options": [
      "Only the outside border must match",
      "Every part must match its reflected position",
      "Both sides only need equal area"
    ],
    "answer": 1,
    "explanation": "Reflection symmetry requires corresponding parts on both sides to match.",
    "twist": "The outline was mirrored, but an inner tile was changed later.",
    "moral": "Examine the whole object, not only its outline.",
    "verdict": "disproved",
    "check": "definition",
    "evidence": "A mosaic outline is symmetrical, but its left half contains three blue tiles while the reflected right half has two.",
    "challenge": {
      "prompt": "The outline is symmetrical but one inside tile differs. What would make the whole mosaic symmetrical?",
      "options": [
        "Every tile must match its reflected position",
        "Only the outer border must match",
        "Both sides only need equal area"
      ],
      "answer": 0,
      "explanation": "Reflection symmetry applies to all corresponding parts."
    }
  },
  {
    "id": 35,
    "chapter": 4,
    "title": "The Wheel's Testimony",
    "story": "A wheel mark starts at the top, turns half a turn and then another quarter-turn clockwise. The witness reports only the first turn.",
    "claim": "The witness claims the mark ends at the bottom.",
    "prompt": "Where does the mark end?",
    "options": [
      "Top",
      "Right",
      "Left"
    ],
    "answer": 2,
    "explanation": "Half-turn moves top to bottom; the next clockwise quarter-turn moves bottom to the left.",
    "twist": "The report omitted the extra quarter-turn.",
    "moral": "Track every step, not just the first part.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "A wheel mark starts at the top, turns half a turn and then another quarter-turn clockwise. The witness reports only the first turn.",
    "challenge": {
      "prompt": "A wheel mark reaches the left side after its turns. One more clockwise quarter-turn takes it where?",
      "options": [
        "Bottom",
        "Top",
        "Right"
      ],
      "answer": 0,
      "explanation": "From the left side, a clockwise quarter-turn moves the mark to the bottom."
    }
  },
  {
    "id": 36,
    "chapter": 4,
    "title": "The Map With the Wrong Address",
    "story": "The library is at coordinate (3, 7). A courier swaps the coordinates and goes to (7, 3).",
    "claim": "The courier claims the two coordinate pairs name the same location.",
    "prompt": "How many coordinates remain in the same ordered position?",
    "options": [
      "Neither",
      "One",
      "Both"
    ],
    "answer": 0,
    "explanation": "Neither coordinate stays in the same position: the first changes from 3 to 7 and the second from 7 to 3.",
    "twist": "The courier assumed an ordered pair can be rearranged without changing location.",
    "moral": "Coordinates are ordered pairs.",
    "verdict": "disproved",
    "check": "definition",
    "evidence": "Library: (3, 7); courier went to (7, 3).",
    "challenge": {
      "prompt": "To move from coordinate (3, 7) to (7, 3), which movement is needed?",
      "options": [
        "4 units east and 4 south",
        "4 units west and 4 north",
        "3 units east and 7 south"
      ],
      "answer": 0,
      "explanation": "The x-coordinate increases by 4 and the y-coordinate decreases by 4."
    }
  },
  {
    "id": 37,
    "chapter": 4,
    "title": "The Split Parcel",
    "story": "A 10 m by 6 m parcel is divided into two equal 5 m by 6 m rectangles. A gardener claims each half has area 25 m².",
    "claim": "The gardener claims each half is 25 m².",
    "prompt": "What is the area of each half?",
    "options": [
      "15 m²",
      "30 m²",
      "60 m²"
    ],
    "answer": 1,
    "explanation": "Each half is 5 × 6 = 30 m².",
    "twist": "The gardener used one dimension twice and omitted the other.",
    "moral": "Label dimensions and units before calculating area.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "A 10 m by 6 m parcel is divided into two equal 5 m by 6 m rectangles. A gardener claims each half has area 25 m².",
    "challenge": {
      "prompt": "The two equal halves are each 30 m². What is the original 10 m by 6 m parcel's area?",
      "options": [
        "60 m²",
        "30 m²",
        "120 m²"
      ],
      "answer": 0,
      "explanation": "The two 30 m² halves total 60 m², matching 10 × 6."
    }
  },
  {
    "id": 38,
    "chapter": 4,
    "title": "The Impossible Package",
    "story": "A box's internal dimensions are 4 cm by 5 cm by 6 cm. A seller multiplies the dimensions correctly but calls the result square centimetres.",
    "claim": "The seller claims the box volume is 120 cm².",
    "prompt": "What is its correct volume and unit?",
    "options": [
      "120 cm³",
      "120 cm²",
      "30 cm³"
    ],
    "answer": 0,
    "explanation": "4 × 5 × 6 = 120 cubic centimetres. Volume is three-dimensional.",
    "twist": "The number was correct but the unit was not.",
    "moral": "A correct number with the wrong unit can still be wrong.",
    "verdict": "partly",
    "check": "units",
    "evidence": "A box's internal dimensions are 4 cm by 5 cm by 6 cm. A seller multiplies the dimensions correctly but calls the result square centimetres.",
    "challenge": {
      "prompt": "If the box height doubles while its base stays 4 cm by 5 cm, what happens to its volume?",
      "options": [
        "It doubles to 240 cm³",
        "It stays 120 cm³",
        "It halves to 60 cm³"
      ],
      "answer": 0,
      "explanation": "Doubling height doubles the volume: 4 × 5 × 12 = 240 cm³."
    }
  },
  {
    "id": 39,
    "chapter": 4,
    "title": "The Ramp Hearing",
    "story": "A ramp rises 1 m over 5 m horizontal run. A new design rises 2 m over the same 5 m run.",
    "claim": "The designer claims the slope is unchanged.",
    "prompt": "What run preserves the original rise-to-run ratio for a 2 m rise?",
    "options": [
      "5 m",
      "8 m",
      "10 m"
    ],
    "answer": 2,
    "explanation": "The original ratio is 1:5. Doubling the rise requires a 10 m run.",
    "twist": "The proposed layout halves neither rise nor ratio; it doubles steepness.",
    "moral": "Preserve the stated constraint and consider accessibility.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "A ramp rises 1 m over 5 m horizontal run. A new design rises 2 m over the same 5 m run.",
    "challenge": {
      "prompt": "If a ramp rises 1.5 m and keeps the original 1:5 rise-to-run ratio, what run is required?",
      "options": [
        "7.5 m",
        "5 m",
        "10 m"
      ],
      "answer": 0,
      "explanation": "The run is five times the rise: 1.5 × 5 = 7.5 m."
    }
  },
  {
    "id": 40,
    "chapter": 4,
    "title": "The Round Stage Dispute",
    "story": "A circular stage has diameter 14 m. Using π ≈ 22/7, a builder says the distance around it is 14 m.",
    "claim": "The builder claims the circumference is 14 m.",
    "prompt": "What is the approximate circumference?",
    "options": [
      "22 m",
      "44 m",
      "88 m"
    ],
    "answer": 1,
    "explanation": "Circumference is πd ≈ (22/7) × 14 = 44 m.",
    "twist": "The builder confused the diameter across the stage with the distance around it.",
    "moral": "Choose the formula for the quantity being measured.",
    "verdict": "disproved",
    "check": "definition",
    "evidence": "A circular stage has diameter 14 m. Using π ≈ 22/7, a builder says the distance around it is 14 m.",
    "challenge": {
      "prompt": "Using π ≈ 22/7, what is the circumference of a circle with diameter 7 m?",
      "options": [
        "22 m",
        "44 m",
        "14 m"
      ],
      "answer": 0,
      "explanation": "Circumference ≈ πd = (22/7) × 7 = 22 m."
    }
  },
  {
    "id": 41,
    "chapter": 5,
    "title": "The Missing Twenty Minutes",
    "story": "A meeting begins at 10:45 and finishes at 12:15. A witness reports 70 minutes.",
    "claim": "The witness claims the meeting lasted 70 minutes.",
    "prompt": "How long did it last?",
    "options": [
      "70 minutes",
      "90 minutes",
      "110 minutes"
    ],
    "answer": 1,
    "explanation": "From 10:45 to 11:45 is 60 minutes, then 30 more minutes: 90 minutes.",
    "twist": "The witness subtracted the minute digits without accounting for the hour boundary.",
    "moral": "Use a timeline for elapsed time.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "A meeting begins at 10:45 and finishes at 12:15. A witness reports 70 minutes.",
    "challenge": {
      "prompt": "A meeting starts at 2:35 pm and lasts 90 minutes. When does it finish?",
      "options": [
        "4:05 pm",
        "3:65 pm",
        "4:15 pm"
      ],
      "answer": 0,
      "explanation": "Add 1 hour and then 30 minutes to get 4:05 pm."
    }
  },
  {
    "id": 42,
    "chapter": 5,
    "title": "The Bus That Was Called Late",
    "story": "A bus was scheduled for 9:20 and arrived at 9:32. The report says it was 20 minutes late.",
    "claim": "The report claims a 20-minute delay.",
    "prompt": "How many minutes late was the bus?",
    "options": [
      "8 minutes",
      "12 minutes",
      "20 minutes"
    ],
    "answer": 1,
    "explanation": "9:32 − 9:20 = 12 minutes.",
    "twist": "The report compared the arrival with a time not listed on the schedule.",
    "moral": "Compare the observation with the stated reference time.",
    "verdict": "disproved",
    "check": "records",
    "evidence": "A bus was scheduled for 9:20 and arrived at 9:32. The report says it was 20 minutes late.",
    "challenge": {
      "prompt": "If the bus were scheduled for 9:20 and arrived at 9:40, how late would it be?",
      "options": [
        "20 minutes",
        "12 minutes",
        "10 minutes"
      ],
      "answer": 0,
      "explanation": "9:40 − 9:20 = 20 minutes."
    }
  },
  {
    "id": 43,
    "chapter": 5,
    "title": "The Hundred-Metre Mistake",
    "story": "A path is recorded as 250 cm on one map and 2.5 m on another. A clerk declares the records disagree.",
    "claim": "The clerk claims the lengths differ.",
    "prompt": "Which statement is correct?",
    "options": [
      "250 cm = 25 m",
      "250 cm = 2.5 m",
      "250 cm = 0.25 m"
    ],
    "answer": 1,
    "explanation": "100 cm = 1 m, so 250 cm = 2.5 m.",
    "twist": "The reports used different units but describe the same length.",
    "moral": "Convert to a common unit before comparing.",
    "verdict": "disproved",
    "check": "units",
    "evidence": "A path is recorded as 250 cm on one map and 2.5 m on another. A clerk declares the records disagree.",
    "challenge": {
      "prompt": "Convert a length of 3.2 metres to centimetres?",
      "options": [
        "320 cm",
        "32 cm",
        "302 cm"
      ],
      "answer": 0,
      "explanation": "3.2 × 100 = 320 cm. This confirms the stated relationship."
    }
  },
  {
    "id": 44,
    "chapter": 5,
    "title": "The Market-Scale Hearing",
    "story": "A basket with fruit weighs 3.2 kg; the empty basket weighs 0.4 kg. The seller charges for 3.2 kg of fruit.",
    "claim": "The seller claims the fruit alone weighs 3.2 kg.",
    "prompt": "What is the fruit's mass?",
    "options": [
      "2.8 kg",
      "3.2 kg",
      "3.6 kg"
    ],
    "answer": 0,
    "explanation": "The fruit alone weighs 3.2 − 0.4 = 2.8 kg. Remove the empty basket's mass before charging for the fruit.",
    "twist": "The scale reading included the basket.",
    "moral": "Separate the measured object from its container.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "A basket with fruit weighs 3.2 kg; the empty basket weighs 0.4 kg. The seller charges for 3.2 kg of fruit.",
    "challenge": {
      "prompt": "Five baskets each have 3.2 kg gross mass and 0.4 kg basket mass. What is the total fruit mass?",
      "options": [
        "14 kg",
        "16 kg",
        "18 kg"
      ],
      "answer": 0,
      "explanation": "Each basket contains 2.8 kg of fruit; 5 × 2.8 = 14 kg."
    }
  },
  {
    "id": 45,
    "chapter": 5,
    "title": "The Leaking Canal",
    "story": "Water flows at 12 L/min for five minutes, then slows to 6 L/min for five more minutes.",
    "claim": "The keeper estimates 120 L entered during ten minutes.",
    "prompt": "How much water entered?",
    "options": [
      "60 L",
      "90 L",
      "120 L"
    ],
    "answer": 1,
    "explanation": "First phase: 60 L. Second phase: 30 L. Total 90 L.",
    "twist": "The report assumed the original rate stayed constant.",
    "moral": "Model changing rates in separate intervals.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "Water flows at 12 L/min for five minutes, then slows to 6 L/min for five more minutes.",
    "challenge": {
      "prompt": "A constant-rate estimate predicts 120 L, but the measured total is 90 L. By how much did the estimate overstate the flow?",
      "options": [
        "30 L",
        "20 L",
        "12 L"
      ],
      "answer": 0,
      "explanation": "120 − 90 = 30 L. This confirms the stated relationship."
    }
  },
  {
    "id": 46,
    "chapter": 5,
    "title": "The Cyclists' Dispute",
    "story": "Cyclist A travels 18 km in one hour. Cyclist B travels 24 km in two hours. A witness says B is faster because 24 is greater than 18.",
    "claim": "The witness claims B has the higher average speed.",
    "prompt": "Who has the greater average speed?",
    "options": [
      "Cyclist A",
      "Cyclist B",
      "Equal speed"
    ],
    "answer": 0,
    "explanation": "A travels at 18 km/h; B at 12 km/h.",
    "twist": "The witness compared distance without considering time.",
    "moral": "Use a unit rate when comparing speeds.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "Cyclist A travels 18 km in one hour. Cyclist B travels 24 km in two hours. A witness says B is faster because 24 is greater than 18.",
    "challenge": {
      "prompt": "If Cyclist A keeps 18 km/h for three hours, how far will A travel?",
      "options": [
        "54 km",
        "36 km",
        "72 km"
      ],
      "answer": 0,
      "explanation": "Distance = speed × time = 18 × 3 = 54 km."
    }
  },
  {
    "id": 47,
    "chapter": 5,
    "title": "The Fuel-Budget Route",
    "story": "Route A is 60 km at ₹8 per km. Route B is 75 km at ₹6 per km. The planner chooses A because it is shorter.",
    "claim": "The planner claims Route A costs less.",
    "prompt": "Which route has the lower operating cost?",
    "options": [
      "Route A at ₹480",
      "Route B at ₹450",
      "Both cost ₹500"
    ],
    "answer": 1,
    "explanation": "A costs ₹480; B costs ₹450.",
    "twist": "The longer route costs less because its rate per kilometre is lower.",
    "moral": "Optimise the total cost, not just distance.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "Route A is 60 km at ₹8 per km. Route B is 75 km at ₹6 per km. The planner chooses A because it is shorter.",
    "challenge": {
      "prompt": "If Route B costs ₹6 per kilometre, what will 80 km cost?",
      "options": [
        "₹480",
        "₹450",
        "₹500"
      ],
      "answer": 0,
      "explanation": "80 × ₹6 = ₹480. This confirms the stated relationship."
    }
  },
  {
    "id": 48,
    "chapter": 5,
    "title": "The Missing Day",
    "story": "A task begins on 27 February in a leap year and lasts three days, counting the start as day one. The clerk records 1 March.",
    "claim": "The clerk claims day three is 1 March.",
    "prompt": "What is day three?",
    "options": [
      "28 February",
      "29 February",
      "1 March"
    ],
    "answer": 1,
    "explanation": "27 February is day one; 28 February is day two; 29 February is day three.",
    "twist": "The clerk used a non-leap-year calendar.",
    "moral": "Check the calendar year and counting convention.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "A task begins on 27 February in a leap year and lasts three days, counting the start as day one. The clerk records 1 March.",
    "challenge": {
      "prompt": "If 27 February in a leap year is day one, what is day four?",
      "options": [
        "1 March",
        "2 March",
        "28 February"
      ],
      "answer": 0,
      "explanation": "27, 28, 29 February are the first three days; 1 March is day four."
    }
  },
  {
    "id": 49,
    "chapter": 5,
    "title": "The Thermometer Disagreement",
    "story": "One thermometer reads 21.4°C and another 21.6°C. Each has stated uncertainty of ±0.5°C.",
    "claim": "A witness claims the first reading proves the room is colder.",
    "prompt": "What is the strongest conclusion?",
    "options": [
      "The first proves it is colder",
      "The second proves it is warmer",
      "The readings alone do not establish a reliable difference"
    ],
    "answer": 2,
    "explanation": "The uncertainty ranges overlap, so the small difference cannot establish a reliable temperature difference.",
    "twist": "Repeated measurements under controlled conditions would provide better evidence.",
    "moral": "Match confidence to measurement uncertainty.",
    "verdict": "uncertain",
    "check": "assumptions",
    "evidence": "One thermometer reads 21.4°C and another 21.6°C. Each has stated uncertainty of ±0.5°C.",
    "challenge": {
      "prompt": "The uncertainty intervals are 20.9–21.9°C and 21.1–22.1°C. Do they overlap?",
      "options": [
        "Yes, from 21.1°C to 21.9°C",
        "No, there is a gap",
        "Only at exactly 21.4°C"
      ],
      "answer": 0,
      "explanation": "The intervals share values from 21.1°C through 21.9°C."
    }
  },
  {
    "id": 50,
    "chapter": 5,
    "title": "When Will the Bells Ring Together?",
    "story": "One bell rings every six minutes and another every eight minutes. Both ring at noon. The keeper predicts they next coincide after 14 minutes.",
    "claim": "The keeper claims they next coincide after 14 minutes.",
    "prompt": "How long until the bells next coincide?",
    "options": [
      "12 minutes",
      "24 minutes",
      "48 minutes"
    ],
    "answer": 1,
    "explanation": "The least common multiple of 6 and 8 is 24 minutes.",
    "twist": "The keeper added the intervals rather than finding a common multiple.",
    "moral": "Reason about repeating cycles, not sums of periods.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "One bell rings every six minutes and another every eight minutes. Both ring at noon. The keeper predicts they next coincide after 14 minutes.",
    "challenge": {
      "prompt": "If one bell rings every 6 minutes and another every 9 minutes, when do they first ring together again?",
      "options": [
        "18 minutes",
        "24 minutes",
        "54 minutes"
      ],
      "answer": 0,
      "explanation": "The least common multiple of 6 and 9 is 18."
    }
  },
  {
    "id": 51,
    "chapter": 6,
    "title": "The Graph That Shouted",
    "story": "A garden chart records 100 visitors in May, 110 in June and 120 in July. Its vertical axis starts at 90 and makes the final bar look three times as tall.",
    "claim": "The headline says visits tripled from May to July.",
    "prompt": "What was the percentage increase from May to July?",
    "options": [
      "20%",
      "50%",
      "200%"
    ],
    "answer": 0,
    "explanation": "The increase is 20 visitors; relative to 100, this is 20%.",
    "twist": "The data are real, but the truncated axis exaggerates the visible difference.",
    "moral": "Report data honestly and avoid blame without evidence.",
    "verdict": "disproved",
    "check": "representation",
    "evidence": "May 100 visitors; June 110; July 120. Axis begins at 90.",
    "challenge": {
      "prompt": "A change from 100 visitors to 120 visitors is what fraction of the starting count?",
      "options": [
        "1/5",
        "1/2",
        "2/1"
      ],
      "answer": 0,
      "explanation": "The increase is 20 out of 100, which simplifies to 1/5."
    }
  },
  {
    "id": 52,
    "chapter": 6,
    "title": "The Average That Nobody Reached",
    "story": "Four teams score 6, 8, 10 and 12 points. The organiser says the mean proves each team scored 9.",
    "claim": "The organiser claims each team scored 9.",
    "prompt": "What is the mean score?",
    "options": [
      "8",
      "9",
      "10"
    ],
    "answer": 1,
    "explanation": "(6 + 8 + 10 + 12) ÷ 4 = 9; the mean does not say each team scored 9.",
    "twist": "No team received 9 points, even though the mean is 9.",
    "moral": "A summary value does not describe every individual.",
    "verdict": "partly",
    "check": "definition",
    "evidence": "Four teams score 6, 8, 10 and 12 points. The organiser says the mean proves each team scored 9.",
    "challenge": {
      "prompt": "What is the median of the scores 6, 8, 10 and 12?",
      "options": [
        "9",
        "8",
        "10"
      ],
      "answer": 0,
      "explanation": "For four ordered values, median = (8 + 10)/2 = 9."
    }
  },
  {
    "id": 53,
    "chapter": 6,
    "title": "The Median Witness",
    "story": "Waiting times are 2, 3, 3, 4 and 18 minutes. A witness says a typical wait must be six minutes because that is the mean.",
    "claim": "The witness claims the median is six minutes.",
    "prompt": "What is the median?",
    "options": [
      "3 minutes",
      "4 minutes",
      "6 minutes"
    ],
    "answer": 0,
    "explanation": "The middle ordered value is 3 minutes; the long wait pulls the mean upward.",
    "twist": "One unusually long wait belongs to an exceptional incident.",
    "moral": "Choose the statistic that fits the question.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "Waiting times are 2, 3, 3, 4 and 18 minutes. A witness says a typical wait must be six minutes because that is the mean.",
    "challenge": {
      "prompt": "What is the mean of the waiting times 2, 3, 3, 4 and 18 minutes?",
      "options": [
        "6 minutes",
        "3 minutes",
        "18 minutes"
      ],
      "answer": 0,
      "explanation": "The sum is 30 minutes and 30 ÷ 5 = 6 minutes."
    }
  },
  {
    "id": 54,
    "chapter": 6,
    "title": "The Survey of Three Friends",
    "story": "A survey asks three friends from one club whether the whole school prefers football. All three say yes, and the organiser generalises to the whole school.",
    "claim": "The organiser claims the school prefers football.",
    "prompt": "What is the main weakness in the evidence?",
    "options": [
      "The sample is small and not representative",
      "The answers cannot be used because they are numbers",
      "Three answers always prove a majority"
    ],
    "answer": 0,
    "explanation": "Three friends from one club cannot reliably represent the whole school.",
    "twist": "The answers may be sincere, but the sample was selected from one group.",
    "moral": "Collect representative evidence before generalising.",
    "verdict": "insufficient",
    "check": "sample",
    "evidence": "A survey asks three friends from one club whether the whole school prefers football. All three say yes, and the organiser generalises to the whole school.",
    "challenge": {
      "prompt": "Which change would most improve the school-preference survey?",
      "options": [
        "Randomly invite students from across the school",
        "Ask more friends from the same club",
        "Ask only the club leader"
      ],
      "answer": 0,
      "explanation": "A broader suitable sample is more likely to represent the school."
    }
  },
  {
    "id": 55,
    "chapter": 6,
    "title": "The Ice-Cream Mystery",
    "story": "Ice-cream sales and swimming accidents both increase on hot days. A report claims ice cream causes the accidents.",
    "claim": "The report claims ice cream causes accidents.",
    "prompt": "What can the records alone establish?",
    "options": [
      "Ice cream caused every accident",
      "The measures rose together, but causation is not established",
      "There is no relationship of any kind"
    ],
    "answer": 1,
    "explanation": "Both measures may be related to hot weather; co-movement alone does not prove cause.",
    "twist": "Weather was not included in the comparison.",
    "moral": "Distinguish association from causation.",
    "verdict": "insufficient",
    "check": "causation",
    "evidence": "Ice-cream sales and swimming accidents both increase on hot days. A report claims ice cream causes the accidents.",
    "challenge": {
      "prompt": "Which factor could help explain both higher ice-cream sales and more swimming accidents?",
      "options": [
        "Hot weather",
        "The wrapper colour",
        "The pool's name"
      ],
      "answer": 0,
      "explanation": "Hot weather could influence both; association alone does not establish direct causation."
    }
  },
  {
    "id": 56,
    "chapter": 6,
    "title": "The Missing Column",
    "story": "A table has entries 14, 18 and an unknown value; its row total is 50. A clerk says the missing entry is 20.",
    "claim": "The clerk claims the missing entry is 20.",
    "prompt": "What is the missing value?",
    "options": [
      "18",
      "20",
      "22"
    ],
    "answer": 0,
    "explanation": "50 − 14 − 18 = 18; using 20 would make the total 52.",
    "twist": "An independent copy of the table confirms the row total.",
    "moral": "Use independent constraints to reconstruct missing data.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "A table has entries 14, 18 and an unknown value; its row total is 50. A clerk says the missing entry is 20.",
    "challenge": {
      "prompt": "If the row total changes from 50 to 52 while the other entries remain 14 and 18, what is the missing entry?",
      "options": [
        "20",
        "22",
        "18"
      ],
      "answer": 0,
      "explanation": "52 − 14 − 18 = 20. This confirms the stated relationship."
    }
  },
  {
    "id": 57,
    "chapter": 6,
    "title": "The One Extraordinary Result",
    "story": "Five measurements are 4, 5, 5, 6 and 30. A researcher wants to delete 30 because it looks unusual.",
    "claim": "The researcher claims 30 should be removed automatically.",
    "prompt": "What should happen first?",
    "options": [
      "Delete 30 automatically",
      "Keep it and investigate whether it is valid",
      "Replace it with 6"
    ],
    "answer": 1,
    "explanation": "An unusual value should be checked for measurement or recording errors, not removed merely because it is inconvenient.",
    "twist": "The value came from a second instrument and needs verification.",
    "moral": "Investigate surprising evidence transparently.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "Five measurements are 4, 5, 5, 6 and 30. A researcher wants to delete 30 because it looks unusual.",
    "challenge": {
      "prompt": "What is the mean of measurements 4, 5, 5, 6 and 30, including the unusual value?",
      "options": [
        "10",
        "5",
        "30"
      ],
      "answer": 0,
      "explanation": "The total is 50 and 50 ÷ 5 = 10. Investigate the outlier before excluding it."
    }
  },
  {
    "id": 58,
    "chapter": 6,
    "title": "The Trophy for the Best Team",
    "story": "Team A has 10 people averaging 8 points each. Team B has 30 people averaging 6 points. The organiser averages 8 and 6 equally.",
    "claim": "The organiser claims the combined mean is 7.",
    "prompt": "What is the combined mean across all 40 people?",
    "options": [
      "6.5",
      "7",
      "7.5"
    ],
    "answer": 0,
    "explanation": "Total points are 10×8 + 30×6 = 260; divide by 40 to get 6.5.",
    "twist": "The groups differ in size, so their means cannot be weighted equally.",
    "moral": "Account for group sizes when combining averages.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "Team A has 10 people averaging 8 points each. Team B has 30 people averaging 6 points. The organiser averages 8 and 6 equally.",
    "challenge": {
      "prompt": "If Team A and Team B had equal numbers of people, what would the simple average of means 8 and 6 be?",
      "options": [
        "7",
        "6.5",
        "14"
      ],
      "answer": 0,
      "explanation": "With equal group sizes, the combined mean is (8 + 6)/2 = 7."
    }
  },
  {
    "id": 59,
    "chapter": 6,
    "title": "The Busy Shop That Wasn't",
    "story": "Shop A serves 40 customers in two hours. Shop B serves 54 in three hours. A poster says B is faster because it served more people.",
    "claim": "The poster claims Shop B serves customers faster.",
    "prompt": "Which shop serves more customers per hour?",
    "options": [
      "Shop A at 20 per hour",
      "Shop B at 18 per hour",
      "Both at 22 per hour"
    ],
    "answer": 0,
    "explanation": "A serves 20 per hour; B serves 18 per hour.",
    "twist": "Shop B was open longer, explaining its greater total.",
    "moral": "Compare rates when durations differ.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "Shop A serves 40 customers in two hours. Shop B serves 54 in three hours. A poster says B is faster because it served more people.",
    "challenge": {
      "prompt": "If Shop A serves 20 customers per hour for three hours, how many customers does it serve?",
      "options": [
        "60",
        "54",
        "40"
      ],
      "answer": 0,
      "explanation": "20 customers per hour × 3 hours = 60 customers."
    }
  },
  {
    "id": 60,
    "chapter": 6,
    "title": "The Question That Changed the Answer",
    "story": "One survey asks whether people support a new park. Another asks whether they support an expensive park that raises fees. The results differ.",
    "claim": "The organiser claims the two survey percentages can be compared directly.",
    "prompt": "Can they be compared as if the question were identical?",
    "options": [
      "Yes, wording never matters",
      "No, wording changes what respondents are answering",
      "Only the larger result is valid"
    ],
    "answer": 1,
    "explanation": "The wording frames the issue differently, so the surveys do not measure exactly the same prompt.",
    "twist": "Both records are authentic, but the question wording differs.",
    "moral": "Ask neutral questions and explain how data were collected.",
    "verdict": "partly",
    "check": "sample",
    "evidence": "One survey asks whether people support a new park. Another asks whether they support an expensive park that raises fees. The results differ.",
    "challenge": {
      "prompt": "Which survey question is the most neutral?",
      "options": [
        "Do you support building a park?",
        "Don't you agree the town deserves a park?",
        "Do you support an expensive park that raises fees?"
      ],
      "answer": 0,
      "explanation": "The first asks about support without embedding positive or negative framing."
    }
  },
  {
    "id": 61,
    "chapter": 7,
    "title": "The Mystery Machine",
    "story": "A machine maps 2 to 5, 3 to 7 and 4 to 9. A visitor claims the rule is add three because it fits the first input.",
    "claim": "The visitor claims the rule is n + 3.",
    "prompt": "Which rule fits all three observations?",
    "options": [
      "2n + 1",
      "n + 3",
      "3n − 1"
    ],
    "answer": 0,
    "explanation": "For n = 2, 3, 4, the rule 2n + 1 gives 5, 7, 9.",
    "twist": "A fourth test input can distinguish this rule from other rules fitting fewer observations.",
    "moral": "Choose tests that separate possible explanations.",
    "verdict": "disproved",
    "check": "logic",
    "evidence": "A machine maps 2 to 5, 3 to 7 and 4 to 9. A visitor claims the rule is add three because it fits the first input.",
    "challenge": {
      "prompt": "The machine follows n ↦ 2n + 1. What output should it produce for input 10?",
      "options": [
        "21",
        "19",
        "20"
      ],
      "answer": 0,
      "explanation": "2 × 10 + 1 = 21. This confirms the stated relationship."
    }
  },
  {
    "id": 62,
    "chapter": 7,
    "title": "The Ledger With a Hidden Variable",
    "story": "A venue charges a fixed ₹50 booking fee plus ₹20 per ticket. Three tickets total ₹110. A witness divides the total evenly and says each ticket costs ₹30.",
    "claim": "The witness claims each ticket costs ₹30.",
    "prompt": "What is the price per ticket?",
    "options": [
      "₹20",
      "₹30",
      "₹50"
    ],
    "answer": 0,
    "explanation": "₹110 − ₹50 = ₹60 for three tickets, so each costs ₹20.",
    "twist": "The witness divided the whole total by the ticket count without removing the fixed fee.",
    "moral": "Separate fixed and variable quantities.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "A venue charges a fixed ₹50 booking fee plus ₹20 per ticket. Three tickets total ₹110. A witness divides the total evenly and says each ticket costs ₹30.",
    "challenge": {
      "prompt": "The venue charges ₹50 fixed plus ₹20 per ticket. What is the cost for five tickets?",
      "options": [
        "₹150",
        "₹100",
        "₹120"
      ],
      "answer": 0,
      "explanation": "₹50 + 5 × ₹20 = ₹150."
    }
  },
  {
    "id": 63,
    "chapter": 7,
    "title": "The Budget That Almost Fits",
    "story": "A club has ₹500. Each kit costs ₹70 and delivery has a one-time ₹80 fee. The organiser says seven kits fit.",
    "claim": "The organiser claims seven kits fit the budget.",
    "prompt": "What is the maximum number of kits?",
    "options": [
      "5",
      "6",
      "7"
    ],
    "answer": 1,
    "explanation": "After delivery, ₹420 remains. Six kits cost ₹420; seven plus delivery exceed ₹500.",
    "twist": "The organiser forgot the fixed delivery fee.",
    "moral": "Check every constraint, including fixed costs.",
    "verdict": "disproved",
    "check": "constraints",
    "evidence": "A club has ₹500. Each kit costs ₹70 and delivery has a one-time ₹80 fee. The organiser says seven kits fit.",
    "challenge": {
      "prompt": "The club spends ₹80 delivery plus six kits at ₹70 each from a ₹500 budget. How much budget remains?",
      "options": [
        "₹0",
        "₹70",
        "₹80"
      ],
      "answer": 0,
      "explanation": "₹80 + 6 × ₹70 = ₹500, so nothing remains."
    }
  },
  {
    "id": 64,
    "chapter": 7,
    "title": "The Two Contracts",
    "story": "Contract A costs 10 + 4n; Contract B costs 2n + 18. They both cost 26 when n = 4. A clerk says they are equivalent.",
    "claim": "The clerk claims the expressions are identical for every n.",
    "prompt": "What is the best test?",
    "options": [
      "One matching example proves equivalence",
      "Test another input, such as n = 1",
      "The letters make them equivalent"
    ],
    "answer": 1,
    "explanation": "At n = 1, A costs 14 and B costs 20, so they are not equivalent. The matching total at n = 4 is only one shared example.",
    "twist": "The matching total at n = 3 was accidental.",
    "moral": "One matching example does not prove two rules identical.",
    "verdict": "disproved",
    "check": "logic",
    "evidence": "Contract A costs 10 + 4n; Contract B costs 2n + 18. They both cost 22 when n = 3. A clerk says they are equivalent.",
    "challenge": {
      "prompt": "At n = 5, Contract A costs 10 + 4n and B costs 2n + 18. How much more does A cost?",
      "options": [
        "₹2",
        "₹0",
        "₹4"
      ],
      "answer": 0,
      "explanation": "A costs 30 and B costs 28, a difference of 2."
    }
  },
  {
    "id": 65,
    "chapter": 7,
    "title": "The Infinite Staircase",
    "story": "A sequence is 5, 9, 13, 17. The planner claims the 20th term is 80.",
    "claim": "The planner claims the 20th term is 80.",
    "prompt": "What is the 20th term if four is added each time?",
    "options": [
      "77",
      "81",
      "85"
    ],
    "answer": 1,
    "explanation": "The nth term is 5 + 4(n − 1); for n = 20 it is 81.",
    "twist": "The planner used 20 additions after the first term instead of 19.",
    "moral": "Translate a pattern into a precise general rule.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "A sequence is 5, 9, 13, 17. The planner claims the 20th term is 80.",
    "challenge": {
      "prompt": "What is the tenth term of 5, 9, 13, 17, …?",
      "options": [
        "41",
        "40",
        "45"
      ],
      "answer": 0,
      "explanation": "The tenth term is 5 + 9 × 4 = 41."
    }
  },
  {
    "id": 66,
    "chapter": 7,
    "title": "The Two-Code Lock",
    "story": "A two-digit code has digits summing to 9. Its tens digit is one more than its units digit.",
    "claim": "A clerk claims the code is 45.",
    "prompt": "What code satisfies both clues?",
    "options": [
      "45",
      "54",
      "63"
    ],
    "answer": 1,
    "explanation": "The digits are 5 and 4, giving 54. They sum to 9 and the tens digit is one greater.",
    "twist": "A third note saying the code is even contradicts the other clues, showing it belongs to another lock.",
    "moral": "Check every clue against the proposed answer.",
    "verdict": "disproved",
    "check": "logic",
    "evidence": "A two-digit code has digits summing to 9. Its tens digit is one more than its units digit.",
    "challenge": {
      "prompt": "For code 54, what is the product of its two digits?",
      "options": [
        "20",
        "9",
        "1"
      ],
      "answer": 0,
      "explanation": "5 × 4 = 20; the digit sum is 9."
    }
  },
  {
    "id": 67,
    "chapter": 7,
    "title": "The Rule That Was Reversed",
    "story": "A rule says: if a person is captain, they must have completed safety training. A witness says anyone who completed training must be a captain.",
    "claim": "The witness claims completing training proves captaincy.",
    "prompt": "What is the logical error?",
    "options": [
      "Confusing a statement with its converse",
      "Subtracting in the wrong order",
      "Rounding too early"
    ],
    "answer": 0,
    "explanation": "Captain implies training; training does not imply captain.",
    "twist": "Many trained members are not captains.",
    "moral": "Do not reverse an implication without evidence.",
    "verdict": "disproved",
    "check": "logic",
    "evidence": "A rule says: if a person is captain, they must have completed safety training. A witness says anyone who completed training must be a captain.",
    "challenge": {
      "prompt": "The rule says a captain must have completed training. Which implication is guaranteed?",
      "options": [
        "Captain means trained",
        "Trained means captain",
        "No captain completed training"
      ],
      "answer": 0,
      "explanation": "The rule only guarantees that every captain has completed training."
    }
  },
  {
    "id": 68,
    "chapter": 7,
    "title": "The Witness Who Could Not Be Right",
    "story": "Witness A says the ledger is correct. B says its total is 20 higher than recorded. C says A and B are both correct. The arithmetic confirms the ledger.",
    "claim": "The witnesses claim all three statements can be true.",
    "prompt": "Which conclusion follows?",
    "options": [
      "A is consistent; B and C are not",
      "All three are consistent",
      "The ledger must be wrong"
    ],
    "answer": 0,
    "explanation": "If the ledger is correct, B's claim is false, so C cannot have both A and B true.",
    "twist": "The contradiction does not prove that any witness intended to mislead the court.",
    "moral": "Test claims without attacking a person's character.",
    "verdict": "disproved",
    "check": "logic",
    "evidence": "Witness A says the ledger is correct. B says its total is 20 higher than recorded. C says A and B are both correct. The arithmetic confirms the ledger.",
    "challenge": {
      "prompt": "With a correct ledger, A says it is correct, B says its total is 20 higher than recorded, and C says both are true. How many statements are true?",
      "options": [
        "One",
        "Two",
        "Three"
      ],
      "answer": 0,
      "explanation": "A is true; B and C are false because A and B cannot both be true."
    }
  },
  {
    "id": 69,
    "chapter": 7,
    "title": "The Logic of the Three Keys",
    "story": "Keys A, B and C open rooms 1, 2 and 3, one each. A does not open room 1; B opens room 3. A witness says A opens room 3.",
    "claim": "The witness claims A opens room 3.",
    "prompt": "Which key opens room 1?",
    "options": [
      "A",
      "B",
      "C"
    ],
    "answer": 2,
    "explanation": "B opens room 3, so A must open room 2 and C room 1.",
    "twist": "A confident witness ignored the one-key-per-room constraint.",
    "moral": "Use every constraint before deciding.",
    "verdict": "disproved",
    "check": "logic",
    "evidence": "Keys A, B and C open rooms 1, 2 and 3, one each. A does not open room 1; B opens room 3. A witness says A opens room 3.",
    "challenge": {
      "prompt": "B opens room 3 and A cannot open room 1. Does A open room 2?",
      "options": [
        "Yes",
        "No",
        "The clues do not determine it"
      ],
      "answer": 0,
      "explanation": "With one key per room, A must open room 2 and C room 1."
    }
  },
  {
    "id": 70,
    "chapter": 7,
    "title": "The Partnership Equation",
    "story": "Two notebooks and three pens cost ₹39. One notebook and one pen cost ₹15. Prices are fixed whole-rupee values.",
    "claim": "A receipt copy labels the pen price as the notebook price.",
    "prompt": "What is the price of one notebook?",
    "options": [
      "₹6",
      "₹9",
      "₹12"
    ],
    "answer": 0,
    "explanation": "n + p = 15 and 2n + 3p = 39. Subtracting 2(n + p) gives p = 9, so n = 6.",
    "twist": "A copy swapped the item labels; solving both equations exposes the error.",
    "moral": "Use independent equations to distinguish unknowns.",
    "verdict": "supported",
    "check": "calculation",
    "evidence": "Two notebooks and three pens cost ₹39. One notebook and one pen cost ₹15. Prices are fixed whole-rupee values.",
    "challenge": {
      "prompt": "If one notebook costs ₹6 and one pen costs ₹9, what do three notebooks and two pens cost?",
      "options": [
        "₹36",
        "₹39",
        "₹42"
      ],
      "answer": 0,
      "explanation": "3 × ₹6 + 2 × ₹9 = ₹36."
    }
  },
  {
    "id": 71,
    "chapter": 8,
    "title": "The Election With No Majority",
    "story": "Candidates receive 42, 35 and 23 votes. The candidate with 42 wins under the most-votes rule. A speaker says the winner has support from most voters.",
    "claim": "The speaker claims the winner received more than half the votes.",
    "prompt": "What share of all 100 votes did the winner receive?",
    "options": [
      "42%",
      "50%",
      "58%"
    ],
    "answer": 0,
    "explanation": "The winner received 42 out of 100 votes, or 42%, which is less than half. Most-votes wins is not the same as receiving a majority.",
    "twist": "The winner has more votes than either rival, but 58 voters chose someone else.",
    "moral": "Describe exactly what a voting rule establishes.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "Candidates receive 42, 35 and 23 votes. The candidate with 42 wins under the most-votes rule. A speaker says the winner has support from most voters.",
    "challenge": {
      "prompt": "The two losing candidates received 35 and 23 votes. What share of all 100 votes did they receive together?",
      "options": [
        "58%",
        "42%",
        "77%"
      ],
      "answer": 0,
      "explanation": "35 + 23 = 58 votes, or 58%."
    }
  },
  {
    "id": 72,
    "chapter": 8,
    "title": "The Seats in the Assembly",
    "story": "Two districts have populations 60,000 and 90,000 and share 10 seats proportionally. A clerk proposes 4 and 6 seats.",
    "claim": "The clerk claims a 4-to-6 split matches the population ratio.",
    "prompt": "How should the 10 seats be split in the exact 2:3 ratio?",
    "options": [
      "4 and 6",
      "5 and 5",
      "3 and 7"
    ],
    "answer": 0,
    "explanation": "There are five total parts; 10 seats split into 4 and 6.",
    "twist": "Other population ratios can require a stated rounding method.",
    "moral": "Publish the allocation rule and check the total.",
    "verdict": "supported",
    "check": "constraints",
    "evidence": "Two districts have populations 60,000 and 90,000 and share 10 seats proportionally. A clerk proposes 4 and 6 seats.",
    "challenge": {
      "prompt": "If the same 2:3 population ratio shares 15 seats, how many seats does each district receive?",
      "options": [
        "6 and 9",
        "5 and 10",
        "4 and 11"
      ],
      "answer": 0,
      "explanation": "There are five parts and each part is three seats, giving 6 and 9."
    }
  },
  {
    "id": 73,
    "chapter": 8,
    "title": "The Festival Scorecard",
    "story": "A score is 60% skill and 40% teamwork. Team A scores 90 and 50; Team B scores 70 and 90 respectively.",
    "claim": "The posted scorecard claims Team A wins.",
    "prompt": "Which weighted score is higher?",
    "options": [
      "Team A: 74",
      "Team B: 78",
      "They tie"
    ],
    "answer": 1,
    "explanation": "A = 0.6×90 + 0.4×50 = 74; B = 0.6×70 + 0.4×90 = 78.",
    "twist": "The posted card had accidentally changed teamwork to 20% without updating other weights.",
    "moral": "Publish weights before judging and apply them consistently.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "A score is 60% skill and 40% teamwork. Team A scores 90 and 50; Team B scores 70 and 90 respectively.",
    "challenge": {
      "prompt": "With weights changed to 40% skill and 60% teamwork, what score does Team B get from skill 70 and teamwork 90?",
      "options": [
        "82",
        "78",
        "72"
      ],
      "answer": 0,
      "explanation": "0.4 × 70 + 0.6 × 90 = 82."
    }
  },
  {
    "id": 74,
    "chapter": 8,
    "title": "The Unequal Duty Roster",
    "story": "Four people each work three shifts. One roster gives all three late shifts to the same person. The coordinator says the totals are equal, so the roster is fair.",
    "claim": "The coordinator claims equal shift totals prove fairness.",
    "prompt": "What else should the court examine?",
    "options": [
      "Only the total number of shifts",
      "How difficult and when shifts are distributed",
      "Who volunteered first"
    ],
    "answer": 1,
    "explanation": "Equal totals can hide unequal burdens; timing and difficulty matter to this roster.",
    "twist": "A second week shows the same person repeatedly receives late shifts.",
    "moral": "Fairness may require comparing burdens over time.",
    "verdict": "partly",
    "check": "comparison",
    "evidence": "Four people each work three shifts. One roster gives all three late shifts to the same person. The coordinator says the totals are equal, so the roster is fair.",
    "challenge": {
      "prompt": "Two rosters give each person three shifts, but one person gets all the late shifts. What should be compared next?",
      "options": [
        "The distribution of late shifts over time",
        "Only total shift count",
        "Alphabetic order of names"
      ],
      "answer": 0,
      "explanation": "Equal totals can hide an uneven distribution of difficult shifts."
    }
  },
  {
    "id": 75,
    "chapter": 8,
    "title": "The Tournament That Never Ends",
    "story": "Eight teams play a round-robin tournament where every pair meets once. The organiser schedules only eight matches.",
    "claim": "The organiser claims eight teams need eight matches.",
    "prompt": "How many matches are needed?",
    "options": [
      "16",
      "28",
      "56"
    ],
    "answer": 1,
    "explanation": "There are 8×7/2 = 28 unique pairs.",
    "twist": "The organiser counted teams rather than pairings.",
    "moral": "Count the structure of the task, not just participants.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "Eight teams play a round-robin tournament where every pair meets once. The organiser schedules only eight matches.",
    "challenge": {
      "prompt": "How many head-to-head matches are in a round-robin tournament with six teams?",
      "options": [
        "15",
        "12",
        "30"
      ],
      "answer": 0,
      "explanation": "Six teams make 6 × 5 ÷ 2 = 15 unique pairs."
    }
  },
  {
    "id": 76,
    "chapter": 8,
    "title": "The Emergency Supply Hearing",
    "story": "Three shelters need 11, 17 and 22 supply kits. A delivery contains 50 kits. The clerk proposes 15 for each shelter.",
    "claim": "The clerk claims the equal split meets every stated need.",
    "prompt": "How many kits remain after meeting stated needs exactly?",
    "options": [
      "0",
      "2",
      "5"
    ],
    "answer": 0,
    "explanation": "11 + 17 + 22 = 50, so no kits remain if those stated needs govern allocation.",
    "twist": "An equal split leaves one shelter with extra kits and two short.",
    "moral": "Use the stated objective and explain trade-offs.",
    "verdict": "disproved",
    "check": "constraints",
    "evidence": "Three shelters need 11, 17 and 22 supply kits. A delivery contains 50 kits. The clerk proposes 15 for each shelter.",
    "challenge": {
      "prompt": "If three shelters each receive 15 kits from a delivery of 50, how many kits remain?",
      "options": [
        "5 kits",
        "2 kits",
        "0 kits"
      ],
      "answer": 0,
      "explanation": "3 × 15 = 45, leaving 5 kits."
    }
  },
  {
    "id": 77,
    "chapter": 8,
    "title": "The Queue With Two Doors",
    "story": "Policy A produces waits of 2, 2, 2 and 18 minutes. Policy B produces 6, 6, 6 and 6 minutes.",
    "claim": "The manager claims both policies are equally fair because their means match.",
    "prompt": "Which policy has the lower longest wait?",
    "options": [
      "Policy A",
      "Policy B",
      "They are equal"
    ],
    "answer": 1,
    "explanation": "A's longest wait is 18 minutes; B's is six. Both means are six minutes.",
    "twist": "The average hid the long wait experienced by one person.",
    "moral": "Choose measures that reveal individual outcomes.",
    "verdict": "partly",
    "check": "comparison",
    "evidence": "Policy A produces waits of 2, 2, 2 and 18 minutes. Policy B produces 6, 6, 6 and 6 minutes.",
    "challenge": {
      "prompt": "Policy A's longest wait is 18 minutes; Policy B's is 6 minutes. By how much does B reduce the worst wait?",
      "options": [
        "12 minutes",
        "6 minutes",
        "18 minutes"
      ],
      "answer": 0,
      "explanation": "18 − 6 = 12 minutes."
    }
  },
  {
    "id": 78,
    "chapter": 8,
    "title": "The Bigger Pack Bargain",
    "story": "A small pack has 6 items for ₹90; a large pack has 10 items for ₹130. A poster says the small pack is better because its total price is lower.",
    "claim": "The poster claims the small pack is better value.",
    "prompt": "Which pack costs less per item?",
    "options": [
      "Small at ₹15 each",
      "Large at ₹13 each",
      "Same cost"
    ],
    "answer": 1,
    "explanation": "₹90 ÷ 6 = ₹15; ₹130 ÷ 10 = ₹13 per item.",
    "twist": "A lower total price can still be worse value per item.",
    "moral": "Compare unit prices and consider actual need.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "A small pack has 6 items for ₹90; a large pack has 10 items for ₹130. A poster says the small pack is better because its total price is lower.",
    "challenge": {
      "prompt": "For ten items, what is the cost difference buying at ₹15 each and ₹13 each?",
      "options": [
        "₹20",
        "₹15",
        "₹10"
      ],
      "answer": 0,
      "explanation": "The per-item difference is ₹2, so ten items differ by ₹20."
    }
  },
  {
    "id": 79,
    "chapter": 8,
    "title": "The Contest With Different Starting Lines",
    "story": "A contest adds a 10-point allowance to one participant. Raw scores are 85 and 90; the first participant receives the allowance.",
    "claim": "The second participant should win because their raw score is higher.",
    "prompt": "Who has the higher adjusted score?",
    "options": [
      "First participant: 95",
      "Second participant: 90",
      "They tie"
    ],
    "answer": 0,
    "explanation": "The first participant's adjusted score is 85 + 10 = 95, greater than the second participant's 90. The published allowance must be included.",
    "twist": "The announcer compared raw scores despite the published allowance.",
    "moral": "Understand and apply the rules consistently.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "A contest adds a 10-point allowance to one participant. Raw scores are 85 and 90; the first participant receives the allowance.",
    "challenge": {
      "prompt": "How many allowance points would a raw score of 85 need to tie a score of 90?",
      "options": [
        "5 points",
        "10 points",
        "15 points"
      ],
      "answer": 0,
      "explanation": "90 − 85 = 5 points. This confirms the stated relationship."
    }
  },
  {
    "id": 80,
    "chapter": 8,
    "title": "The Rule That Excluded a Neighbour",
    "story": "A recreation grant automatically goes to groups with at least 20 members. A group of 19 serves a remote area with few services and receives nothing.",
    "claim": "The panel claims the size threshold proves the group is not valuable.",
    "prompt": "What does the threshold establish by itself?",
    "options": [
      "The group cannot be valuable",
      "It misses the size rule, but broader fairness needs more criteria",
      "The group must receive double funding"
    ],
    "answer": 1,
    "explanation": "The group has 19 members and misses the stated threshold. The rule alone does not measure need or impact.",
    "twist": "The policy never accounted for isolated neighbourhoods.",
    "moral": "Consistent rules can still omit relevant circumstances.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "A recreation grant automatically goes to groups with at least 20 members. A group of 19 serves a remote area with few services and receives nothing.",
    "challenge": {
      "prompt": "If the grant threshold changed from 20 members to 18, would a group of 19 meet it?",
      "options": [
        "Yes",
        "No",
        "The member count is irrelevant"
      ],
      "answer": 0,
      "explanation": "19 is at least 18, so the group meets the changed threshold."
    }
  },
  {
    "id": 81,
    "chapter": 9,
    "title": "The Shortest Route to Safety",
    "story": "Route A has segments of 4, 4 and 4 minutes. Route B has segments of 5 and 3 minutes. A planner chooses A because it has fewer turns.",
    "claim": "The planner claims Route A is faster.",
    "prompt": "Which route takes less time?",
    "options": [
      "Route A at 12 minutes",
      "Route B at 8 minutes",
      "They are equal"
    ],
    "answer": 1,
    "explanation": "A takes 12 minutes; B takes 8. Compare total weights, not segment count.",
    "twist": "Fewer turns did not mean less travel time.",
    "moral": "Define and optimise the real cost.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "Route A has segments of 4, 4 and 4 minutes. Route B has segments of 5 and 3 minutes. A planner chooses A because it has fewer turns.",
    "challenge": {
      "prompt": "Route C takes 6 + 4 minutes. Which of Routes A (12), B (8) and C (10) is fastest?",
      "options": [
        "Route B",
        "Route C",
        "Route A"
      ],
      "answer": 0,
      "explanation": "Route B takes eight minutes, less than ten and twelve."
    }
  },
  {
    "id": 82,
    "chapter": 9,
    "title": "The Seven-Bridge Challenge",
    "story": "A network has four land areas; three areas have an odd number of bridges. The planner wants a closed walk crossing every bridge exactly once.",
    "claim": "The planner claims connectivity alone makes the walk possible.",
    "prompt": "Can every bridge be crossed exactly once and return to the start?",
    "options": [
      "Yes, any connected network works",
      "No, odd-degree areas prevent such a closed route",
      "Only if the shortest bridge is first"
    ],
    "answer": 1,
    "explanation": "A closed route using each edge exactly once requires every vertex to have even degree.",
    "twist": "The map is connected, but connectivity alone is insufficient.",
    "moral": "Check global structure, not just local reachability.",
    "verdict": "disproved",
    "check": "logic",
    "evidence": "A network has four land areas; three areas have an odd number of bridges. The planner wants a closed walk crossing every bridge exactly once.",
    "challenge": {
      "prompt": "A connected network has three odd-degree land areas. Can a single walk cross each bridge exactly once without returning to the start?",
      "options": [
        "No, an open Euler trail allows at most two odd-degree vertices",
        "Yes, any connected network works",
        "Yes, if starting at the busiest area"
      ],
      "answer": 0,
      "explanation": "An Euler trail can have zero or two odd-degree vertices, but not three."
    }
  },
  {
    "id": 83,
    "chapter": 9,
    "title": "The Clockwork Cipher",
    "story": "A dial cycles from 0 to 11 and returns to 0. It starts at 8 and advances 7 positions. A clerk writes 15 as the displayed value.",
    "claim": "The clerk claims the dial displays 15.",
    "prompt": "What value appears?",
    "options": [
      "3",
      "5",
      "11"
    ],
    "answer": 0,
    "explanation": "8 + 7 = 15; after one 12-step cycle, the dial displays 3.",
    "twist": "The dial wraps around after 12 positions.",
    "moral": "Account for repeating cycles and the answer domain.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "A dial cycles from 0 to 11 and returns to 0. It starts at 8 and advances 7 positions. A clerk writes 15 as the displayed value.",
    "challenge": {
      "prompt": "A 12-position dial starts at 5 and advances 10 positions. What value appears?",
      "options": [
        "3",
        "5",
        "11"
      ],
      "answer": 0,
      "explanation": "5 + 10 = 15; after wrapping around 12 positions the dial displays 3."
    }
  },
  {
    "id": 84,
    "chapter": 9,
    "title": "The Cargo That Would Not Fit",
    "story": "A cargo hold has capacity 10 units. Crates of size 6, 5 and 4 are available, one of each. The loader takes the 6-unit crate and says no better load is possible.",
    "claim": "The loader claims 6 units is the best achievable total.",
    "prompt": "What is the greatest total size that fits?",
    "options": [
      "6 units",
      "9 units",
      "10 units"
    ],
    "answer": 2,
    "explanation": "The 6-unit and 4-unit crates fit exactly into the 10-unit hold. The best total is 10 units.",
    "twist": "A careful measurement shows the 4-unit crate fits alongside the 6-unit crate. The first plan stopped too early.",
    "moral": "Compare combinations before committing to a greedy choice.",
    "verdict": "disproved",
    "check": "constraints",
    "evidence": "Hold capacity: 10 units. Crates available: 6, 5 and 4 units.",
    "challenge": {
      "prompt": "If the 4-unit crate is unavailable, what is the largest load possible with the remaining 6- and 5-unit crates in a capacity-10 hold?",
      "options": [
        "6 units",
        "5 units",
        "10 units"
      ],
      "answer": 0,
      "explanation": "The 6- and 5-unit crates cannot fit together, so the best single crate is 6 units."
    }
  },
  {
    "id": 85,
    "chapter": 9,
    "title": "The Cheapest Supply Mix",
    "story": "A team needs at least 20 L. Small containers hold 3 L for ₹12; large containers hold 7 L for ₹25. Both types are available.",
    "claim": "The organiser claims three large containers are the cheapest feasible plan.",
    "prompt": "What is the lowest-cost option listed that reaches at least 20 L?",
    "options": [
      "Six small containers for ₹72",
      "Three large containers for ₹75",
      "Two large and two small for ₹74"
    ],
    "answer": 2,
    "explanation": "Six small containers provide only 18 L. Two large and two small provide 20 L for ₹74, less than three large containers at ₹75.",
    "twist": "The apparently cheapest total does not meet the required volume.",
    "moral": "Check feasible combinations before declaring an optimum.",
    "verdict": "disproved",
    "check": "constraints",
    "evidence": "A team needs at least 20 L. Small containers hold 3 L for ₹12; large containers hold 7 L for ₹25. Both types are available.",
    "challenge": {
      "prompt": "To obtain at least 21 litres using 7 L containers for ₹25 and 3 L containers for ₹12, which option is cheapest?",
      "options": [
        "Three large containers for ₹75",
        "Seven small containers for ₹84",
        "One large and five small for ₹85"
      ],
      "answer": 0,
      "explanation": "Three large containers provide 21 L for ₹75, below the other listed costs."
    }
  },
  {
    "id": 86,
    "chapter": 9,
    "title": "The Growth Contract",
    "story": "A fund starts at ₹100. Plan A adds ₹20 each year; Plan B increases the current amount by 10% each year. The first comparison is after one year.",
    "claim": "A witness claims Plan B has more money after one year.",
    "prompt": "Which plan has more after one year?",
    "options": [
      "Plan A: ₹120",
      "Plan B: ₹110",
      "They tie"
    ],
    "answer": 0,
    "explanation": "Plan A has ₹120; Plan B has ₹110.",
    "twist": "Their long-term paths differ even though the first-year comparison is simple.",
    "moral": "Know whether a rule adds a fixed amount or applies a rate.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "A fund starts at ₹100. Plan A adds ₹20 each year; Plan B increases the current amount by 10% each year. The first comparison is after one year.",
    "challenge": {
      "prompt": "After two years, Plan A adds ₹20 per year from ₹100; Plan B grows 10% each year. Which balance is higher?",
      "options": [
        "Plan A: ₹140",
        "Plan B: ₹121",
        "They are equal at ₹120"
      ],
      "answer": 0,
      "explanation": "Plan A reaches ₹140; Plan B goes from ₹100 to ₹110 to ₹121."
    }
  },
  {
    "id": 87,
    "chapter": 9,
    "title": "The Map That Changed Its Scale",
    "story": "A square map tile has side length 3 cm. A revised map doubles the side length to 6 cm. The cartographer says area doubles.",
    "claim": "The cartographer claims the new area is twice the old area.",
    "prompt": "By what factor does the area change?",
    "options": [
      "2 times",
      "3 times",
      "4 times"
    ],
    "answer": 2,
    "explanation": "Area changes from 9 cm² to 36 cm², four times as large.",
    "twist": "The cartographer applied a linear scale factor directly to area.",
    "moral": "Understand how scaling affects dimensions and area.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "A square map tile has side length 3 cm. A revised map doubles the side length to 6 cm. The cartographer says area doubles.",
    "challenge": {
      "prompt": "A square's area changes from 9 cm² to 36 cm². How much greater is the new area?",
      "options": [
        "27 cm²",
        "18 cm²",
        "36 cm²"
      ],
      "answer": 0,
      "explanation": "36 − 9 = 27 cm². This confirms the stated relationship."
    }
  },
  {
    "id": 88,
    "chapter": 9,
    "title": "The Poll With a Small Margin",
    "story": "A poll shows 51% support and 49% oppose, based on a small sample with large uncertainty. A speaker declares overwhelming support.",
    "claim": "The speaker claims the poll proves overwhelming support.",
    "prompt": "What conclusion is justified?",
    "options": [
      "Overwhelming support is proven",
      "A narrow lead is reported, but uncertainty limits the conclusion",
      "The poll proves nobody supports it"
    ],
    "answer": 1,
    "explanation": "A two-point difference with substantial uncertainty cannot establish overwhelming support.",
    "twist": "The sample uncertainty was omitted from the chart.",
    "moral": "Do not express more confidence than data allow.",
    "verdict": "insufficient",
    "check": "sample",
    "evidence": "A poll shows 51% support and 49% oppose, based on a small sample with large uncertainty. A speaker declares overwhelming support.",
    "challenge": {
      "prompt": "A poll is 51% versus 49% with a small sample and large uncertainty. What would improve confidence?",
      "options": [
        "A larger representative sample and a disclosed uncertainty estimate",
        "A dramatic graph title",
        "Removing responses that disagree"
      ],
      "answer": 0,
      "explanation": "Better sampling and explicit uncertainty help judge whether a narrow lead is meaningful."
    }
  },
  {
    "id": 89,
    "chapter": 9,
    "title": "The Promise That Proved Nothing",
    "story": "A rule says an approved package has passed safety checks. A witness says passing checks proves approval.",
    "claim": "The witness claims safety checks guarantee approval.",
    "prompt": "Is that logically guaranteed?",
    "options": [
      "Yes, the statements are identical",
      "No, passing checks does not prove approval",
      "Yes, safety checks always approve packages"
    ],
    "answer": 1,
    "explanation": "Approval implies safety checks under the rule, but checks may be necessary without being sufficient for approval.",
    "twist": "The package still lacks budget sign-off.",
    "moral": "Distinguish necessary conditions from sufficient conditions.",
    "verdict": "disproved",
    "check": "logic",
    "evidence": "A rule says an approved package has passed safety checks. A witness says passing checks proves approval.",
    "challenge": {
      "prompt": "A package passed safety checks and has budget approval. Is final approval guaranteed by those facts alone?",
      "options": [
        "Not necessarily; other requirements may apply",
        "Yes, those are identical to approval",
        "No package can ever be approved"
      ],
      "answer": 0,
      "explanation": "Passing necessary checks does not establish every approval condition."
    }
  },
  {
    "id": 90,
    "chapter": 9,
    "title": "The Model That Failed in the Rain",
    "story": "A walkway model assumes dry ground. Heavy rain changes the surface and makes its old travel-time estimate unreliable.",
    "claim": "The planner claims the old estimate is still reliable because the arithmetic was correct.",
    "prompt": "What should the court do?",
    "options": [
      "Keep it because the arithmetic was correct",
      "Update assumptions and retest the model",
      "Discard all measurements forever"
    ],
    "answer": 1,
    "explanation": "A model is useful only while its assumptions describe the situation; changed conditions require new evidence.",
    "twist": "The calculation was consistent but the conditions changed.",
    "moral": "Revise a model when reality changes.",
    "verdict": "partly",
    "check": "assumptions",
    "evidence": "A walkway model assumes dry ground. Heavy rain changes the surface and makes its old travel-time estimate unreliable.",
    "challenge": {
      "prompt": "The walkway was modelled for dry ground but must now be assessed after heavy rain. What is the best next step?",
      "options": [
        "Collect wet-weather measurements and update the assumptions",
        "Keep the old estimate because its arithmetic is correct",
        "Discard all prior evidence"
      ],
      "answer": 0,
      "explanation": "Changed conditions require new observations and a revised model."
    }
  },
  {
    "id": 91,
    "chapter": 10,
    "title": "The Festival Budget on Trial",
    "story": "A budget includes ₹1,200 for materials, ₹450 for food and ₹350 for transport. It also includes a cancelled ₹200 order in a reported spend of ₹2,200.",
    "claim": "The treasurer claims ₹2,200 was actually spent, including a cancelled order.",
    "prompt": "What is the corrected total after removing the unpaid cancelled order?",
    "options": [
      "₹1,800",
      "₹2,000",
      "₹2,200"
    ],
    "answer": 1,
    "explanation": "The itemized amounts total ₹1,200 + ₹450 + ₹350 = ₹2,000. Removing the unpaid ₹200 line from the reported ₹2,200 also leaves ₹2,000.",
    "twist": "A bank receipt confirms no payment was made for the cancelled ₹200 order, and the itemized paid amounts add to ₹2,000.",
    "moral": "Correct the record before assigning responsibility.",
    "verdict": "disproved",
    "check": "records",
    "evidence": "Itemized amounts: ₹1,200 + ₹450 + ₹350. Cancelled order: ₹200, unpaid. Reported total: ₹2,200.",
    "challenge": {
      "prompt": "The reported budget is ₹2,200 while itemized materials, food and transport add to ₹2,000. What is the discrepancy?",
      "options": [
        "₹200",
        "₹100",
        "₹400"
      ],
      "answer": 0,
      "explanation": "₹2,200 − ₹2,000 = ₹200, the cancelled unpaid order's value."
    }
  },
  {
    "id": 92,
    "chapter": 10,
    "title": "The River Crossing Decision",
    "story": "A rescue bus carries 12 people per trip. There are 29 people waiting, and a planner has arranged only two trips.",
    "claim": "The planner claims the two trips can carry everyone.",
    "prompt": "What is the minimum number of trips needed?",
    "options": [
      "2",
      "3",
      "4"
    ],
    "answer": 1,
    "explanation": "Two trips carry 24 people; a third is needed for the remaining five.",
    "twist": "The plan treated spare seats as if capacity could be exceeded.",
    "moral": "Optimise under the real capacity constraint.",
    "verdict": "disproved",
    "check": "constraints",
    "evidence": "A rescue bus carries 12 people per trip. There are 29 people waiting, and a planner has arranged only two trips.",
    "challenge": {
      "prompt": "Three bus trips can carry 36 people total. If 29 people cross, how many seats are unused?",
      "options": [
        "7 seats",
        "5 seats",
        "12 seats"
      ],
      "answer": 0,
      "explanation": "36 − 29 = 7 unused seats."
    }
  },
  {
    "id": 93,
    "chapter": 10,
    "title": "The Water Accord",
    "story": "Two neighbourhoods have 20 and 40 households and share 90 litres. A proposal gives 45 litres to each neighbourhood.",
    "claim": "The proposal claims equal neighbourhood totals mean equal amounts per household.",
    "prompt": "Under an equal-per-household rule, how much goes to the first neighbourhood?",
    "options": [
      "30 L",
      "45 L",
      "60 L"
    ],
    "answer": 0,
    "explanation": "There are 60 households, so each gets 1.5 L. The first neighbourhood receives 20 × 1.5 = 30 L.",
    "twist": "Equal totals per neighbourhood and equal amounts per household are different rules.",
    "moral": "Clarify whether fairness means equal shares or needs-based shares.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "Two neighbourhoods have 20 and 40 households and share 90 litres. A proposal gives 45 litres to each neighbourhood.",
    "challenge": {
      "prompt": "Under equal-per-household allocation, 40 households receive 1.5 L each. What total do they receive?",
      "options": [
        "60 L",
        "30 L",
        "45 L"
      ],
      "answer": 0,
      "explanation": "40 × 1.5 = 60 L. This confirms the stated relationship."
    }
  },
  {
    "id": 94,
    "chapter": 10,
    "title": "The Accessible Town Plan",
    "story": "A ramp rises 0.6 m over a 6 m horizontal run. A new design keeps the rise but shortens the run to 3 m.",
    "claim": "The designer claims the slope is unchanged.",
    "prompt": "How does the rise-to-run ratio change?",
    "options": [
      "It stays the same",
      "It doubles",
      "It halves"
    ],
    "answer": 1,
    "explanation": "The ratio changes from 0.6/6 = 0.1 to 0.6/3 = 0.2, twice as steep.",
    "twist": "The cheaper layout changes the gradient relevant to accessibility.",
    "moral": "A design must satisfy human needs as well as the drawing.",
    "verdict": "disproved",
    "check": "comparison",
    "evidence": "A ramp rises 0.6 m over a 6 m horizontal run. A new design keeps the rise but shortens the run to 3 m.",
    "challenge": {
      "prompt": "A ramp rises 0.6 m. To keep rise/run at or below 0.1, what minimum horizontal run is needed?",
      "options": [
        "6 m",
        "3 m",
        "0.6 m"
      ],
      "answer": 0,
      "explanation": "0.6 ÷ run ≤ 0.1 requires a run of at least 6 m."
    }
  },
  {
    "id": 95,
    "chapter": 10,
    "title": "The Rooftop Energy Claim",
    "story": "Ten panels each produce 200 Wh in test conditions. Three panels are shaded and produce half as much as the others today.",
    "claim": "The report claims total output is 2,000 Wh.",
    "prompt": "How much energy do they produce under these conditions?",
    "options": [
      "1,600 Wh",
      "1,700 Wh",
      "2,000 Wh"
    ],
    "answer": 1,
    "explanation": "Seven panels produce 1,400 Wh and three produce 300 Wh; total 1,700 Wh.",
    "twist": "The original estimate assumed equal sunlight for every panel.",
    "moral": "State assumptions and account for operating conditions.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "Ten panels each produce 200 Wh in test conditions. Three panels are shaded and produce half as much as the others today.",
    "challenge": {
      "prompt": "Ten panels produce 2,000 Wh without shade but 1,700 Wh under shading. How much energy is lost?",
      "options": [
        "300 Wh",
        "200 Wh",
        "400 Wh"
      ],
      "answer": 0,
      "explanation": "2,000 − 1,700 = 300 Wh lost."
    }
  },
  {
    "id": 96,
    "chapter": 10,
    "title": "The Transport Plan That Added Up",
    "story": "One bus is scheduled on Route A at 10:00, taking 30 minutes, and Route B at 10:10. The same bus is required for both departures.",
    "claim": "The planner claims both trips can start as scheduled.",
    "prompt": "What is the conflict?",
    "options": [
      "The bus is still on Route A at 10:10",
      "Both trips work because the times differ",
      "The bus can move instantly"
    ],
    "answer": 0,
    "explanation": "Route A ends at 10:30, so the same bus cannot depart Route B at 10:10.",
    "twist": "Each route was checked alone; the shared resource was ignored.",
    "moral": "A system's parts must fit together in time.",
    "verdict": "disproved",
    "check": "constraints",
    "evidence": "One bus is scheduled on Route A at 10:00, taking 30 minutes, and Route B at 10:10. The same bus is required for both departures.",
    "challenge": {
      "prompt": "Route A ends at 10:30 and the same bus needs ten minutes to turn around. Could it start Route B at 10:40?",
      "options": [
        "Yes, exactly after the turnaround",
        "No, it is still on Route A",
        "A bus cannot run two routes"
      ],
      "answer": 0,
      "explanation": "The bus is ready at 10:40 after its 10:30 arrival and ten-minute turnaround."
    }
  },
  {
    "id": 97,
    "chapter": 10,
    "title": "The Charter's Repeating Clock",
    "story": "A community bell rings every 9 days and a market flag rises every 12 days. Both happen today. A clerk predicts they next coincide after 21 days.",
    "claim": "The clerk claims they next coincide after 21 days.",
    "prompt": "After how many days will they coincide again?",
    "options": [
      "18 days",
      "36 days",
      "108 days"
    ],
    "answer": 1,
    "explanation": "The least common multiple of 9 and 12 is 36 days.",
    "twist": "The clerk added the intervals instead of finding a common multiple.",
    "moral": "Use precise definitions for repeating events.",
    "verdict": "disproved",
    "check": "calculation",
    "evidence": "A community bell rings every 9 days and a market flag rises every 12 days. Both happen today. A clerk predicts they next coincide after 21 days.",
    "challenge": {
      "prompt": "Bell A rings every 9 days and flag B rises every 12 days. In the first 72 days after today, how many future coincidences occur?",
      "options": [
        "2",
        "3",
        "1"
      ],
      "answer": 0,
      "explanation": "They coincide after 36 and 72 days, so there are two future coincidences."
    }
  },
  {
    "id": 98,
    "chapter": 10,
    "title": "The Prize Formula",
    "story": "A contest score is 70% skill and 30% teamwork. After the event, the proposal changes weights to 40% skill and 60% teamwork, changing the winner.",
    "claim": "The organisers claim the new result should replace the old one without review.",
    "prompt": "What is the central fairness concern?",
    "options": [
      "Only the new winner matters",
      "Changing weights after scoring changes the judging rule",
      "Weights never affect scores"
    ],
    "answer": 1,
    "explanation": "Weighted results depend on their weights; changing them after seeing outcomes undermines consistency and transparency.",
    "twist": "The new weights were chosen after judges saw who would win.",
    "moral": "Make scoring rules transparent before judging.",
    "verdict": "disproved",
    "check": "assumptions",
    "evidence": "A contest score is 70% skill and 30% teamwork. After the event, the proposal changes weights to 40% skill and 60% teamwork, changing the winner.",
    "challenge": {
      "prompt": "When should a contest disclose scoring weights to keep the comparison transparent?",
      "options": [
        "Before the contest begins",
        "After the winner is known",
        "Only after someone objects"
      ],
      "answer": 0,
      "explanation": "Rules should be known before results are available."
    }
  },
  {
    "id": 99,
    "chapter": 10,
    "title": "The Page That Changed the Town",
    "story": "A copied table shifts one column's values down a row. All numbers remain present but are matched to the wrong neighbourhoods.",
    "claim": "A clerk claims the copied table is reliable because no values are missing.",
    "prompt": "What should happen first?",
    "options": [
      "Blame the person who copied it",
      "Compare the copy with the original and correct the mapping",
      "Delete all archived data"
    ],
    "answer": 1,
    "explanation": "The source must be used to restore each value to its correct row before recalculating decisions.",
    "twist": "The original notes were accurate; copying changed the associations.",
    "moral": "Repair mistakes openly and preserve reliable evidence.",
    "verdict": "disproved",
    "check": "records",
    "evidence": "A copied table shifts one column's values down a row. All numbers remain present but are matched to the wrong neighbourhoods.",
    "challenge": {
      "prompt": "All values remain in a copied table, but one column has shifted down a row. What is the first repair step?",
      "options": [
        "Compare with the original and restore each value to its row",
        "Assume the table is sound because no value is missing",
        "Delete the whole archive"
      ],
      "answer": 0,
      "explanation": "Values must be re-associated with the correct neighbourhoods before decisions are recalculated."
    }
  },
  {
    "id": 100,
    "chapter": 10,
    "title": "The People v. The Old Rule",
    "story": "The charter requires every public decision to follow the same numerical rule. A review finds the rule consistently excludes a remote neighbourhood because it ignores travel distance and access needs.",
    "claim": "The old court claims consistency alone proves the rule is fair.",
    "prompt": "What should the final court require before replacing the rule?",
    "options": [
      "Choose a rule that sounds fair without testing it",
      "State the objective, use evidence, test outcomes and explain trade-offs",
      "Keep the old rule because it is consistent"
    ],
    "answer": 1,
    "explanation": "A defensible policy states its goals, uses suitable evidence, tests consequences and explains trade-offs. Consistency alone is not enough.",
    "twist": "The archive reveals the charter demanded transparent evidence and review, not blind obedience to a formula.",
    "moral": "Truth, fairness, humility and accountability must work together.",
    "verdict": "partly",
    "check": "constraints",
    "evidence": "The charter requires every public decision to follow the same numerical rule. A review finds the rule consistently excludes a remote neighbourhood because it ignores travel distance and access needs.",
    "challenge": {
      "prompt": "Which is the strongest starting point for replacing the old decision rule?",
      "options": [
        "State the goal and constraints, test outcomes, and explain trade-offs",
        "Use group size alone in every situation",
        "Keep the old rule because it is consistent"
      ],
      "answer": 0,
      "explanation": "A defensible rule states its goal and constraints, tests consequences, and explains trade-offs."
    }
  }
];
  const chapters = [
    {id:1,name:"The First Dockets",from:1,to:10,theme:"Counting, place value and records"},
    {id:2,name:"The Rules Hidden in Numbers",from:11,to:20,theme:"Factors, divisibility and number patterns"},
    {id:3,name:"Shares, Ratios and Proportion",from:21,to:30,theme:"Fractions, rates and percentages"},
    {id:4,name:"Shapes, Space and Design",from:31,to:40,theme:"Measurement and geometry"},
    {id:5,name:"Clocks, Journeys and Measurements",from:41,to:50,theme:"Time, units and rates"},
    {id:6,name:"The Evidence Room",from:51,to:60,theme:"Statistics and trustworthy evidence"},
    {id:7,name:"The Algebra and Logic Docket",from:61,to:70,theme:"Rules, equations and logic"},
    {id:8,name:"The Fairness Docket",from:71,to:80,theme:"Voting, scoring and allocation"},
    {id:9,name:"The Mathematical Models Docket",from:81,to:90,theme:"Networks, optimisation and models"},
    {id:10,name:"The High Court",from:91,to:100,theme:"Combined investigations and the charter"}
  ];
  const verdicts = [
    {id:"supported",label:"Supported",description:"The evidence supports the claim as stated."},
    {id:"disproved",label:"Disproved",description:"The evidence contradicts the claim as stated."},
    {id:"partly",label:"Partly supported",description:"Part of the claim is true, but it goes further than the evidence."},
    {id:"uncertain",label:"Not enough evidence",description:"The records conflict or leave too much uncertainty."},
    {id:"insufficient",label:"Not enough evidence",description:"More information is needed for a sound conclusion."}
  ];
  const checks = {
    calculation:{prompt:"Which line of cross-examination would help most?",choices:["Recalculate from the original values and verify with an inverse operation.","Choose the answer that sounds most confident.","Ignore the totals and judge the witness's personality."],correct:0},
    records:{prompt:"What is the strongest next check?",choices:["Compare original records, timestamps and duplicate entries.","Assume disagreeing records mean someone lied.","Keep only the record that supports the first claim."],correct:0},
    assumptions:{prompt:"What should the court test next?",choices:["Check whether the hidden assumption actually holds in this case.","Treat the assumption as true because it makes the arithmetic easier.","Ignore new conditions after calculating."],correct:0},
    definition:{prompt:"What should the advocate establish?",choices:["The exact meaning of the mathematical term in the claim.","Whether the claim was said loudly.","Whether the numbers look familiar."],correct:0},
    comparison:{prompt:"How can this comparison be made fair?",choices:["Put quantities on a common basis and compare the relevant measure.","Compare totals even when group sizes differ.","Pick the larger-looking number."],correct:0},
    units:{prompt:"What is the best cross-examination question?",choices:["Are these measurements in compatible units and precision?","Can we remove the units to simplify the figures?","Must the longer written number be the larger measurement?"],correct:0},
    constraints:{prompt:"What must be checked before accepting the plan?",choices:["Whether every constraint and the resource limit are satisfied.","Whether the first step works by itself.","Whether the plan looks simple."],correct:0},
    representation:{prompt:"What should be checked about the display?",choices:["Whether its scale and labels fairly show the underlying data.","Whether the tallest bar looks impressive.","Whether the title is dramatic."],correct:0},
    sample:{prompt:"What would make this evidence stronger?",choices:["A suitable sampling method, enough observations and disclosed uncertainty.","Only asking people who already agree.","Removing responses that complicate the result."],correct:0},
    causation:{prompt:"What is needed before claiming cause and effect?",choices:["Evidence addressing other explanations and confounding factors.","A graph showing both quantities changed.","A witness who feels certain."],correct:0},
    logic:{prompt:"How should the court test the reasoning?",choices:["Check every condition and whether the conclusion follows from the premises.","Assume the converse is always true.","Stop once one example seems to fit."],correct:0}
  };
  function getCase(id){return cases.find(item=>item.id===Number(id))||null;}
  function isValid(){
    const ids=new Set(cases.map(item=>item.id));
    return cases.length===100&&ids.size===100&&cases.every(item=>
      Number.isInteger(item.id)&&item.id>=1&&item.id<=100&&item.title&&item.story&&item.claim&&item.prompt&&
      Array.isArray(item.options)&&item.options.length>=3&&new Set(item.options).size===item.options.length&&
      Number.isInteger(item.answer)&&item.answer>=0&&item.answer<item.options.length&&item.explanation&&item.twist&&item.moral&&
      item.challenge&&item.challenge.prompt&&Array.isArray(item.challenge.options)&&item.challenge.options.length>=3&&
      new Set(item.challenge.options).size===item.challenge.options.length&&Number.isInteger(item.challenge.answer)&&
      item.challenge.answer>=0&&item.challenge.answer<item.challenge.options.length&&item.challenge.explanation&&
      verdicts.some(v=>v.id===item.verdict)&&Boolean(checks[item.check])&&item.evidence);
  }
  root.MathCourtData=Object.freeze({cases,chapters,verdicts,checks,getCase,isValid,phases:["The case is called","Witness examination","Build the evidence","New evidence","Cross-examination","Verdict","The court's reflection"]});
})(typeof window!=="undefined"?window:globalThis);
