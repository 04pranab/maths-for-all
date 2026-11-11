export const MISSIONS = [
  {
    id: 1,
    tag: "SIGNAL BASICS",
    title: "Your first green light",
    description: "A small, calm junction. Learn how one green phase lets two opposite roads move safely.",
    objective: "Clear the North and South queues. One green wave moves one vehicle from each open approach.",
    queues: { north: 2, south: 2, east: 0, west: 0 },
    waitMinutes: { north: 3, south: 2, east: 1, west: 1 },
    question: "A North–South green wave lets one car from North and one from South pass. How many waves clear all 4 cars?",
    answers: [1, 2, 4],
    answer: 2,
    explanation: "Two waves move 2 cars each: 2 + 2 = 4 cars."
  },
  {
    id: 2,
    tag: "COUNT & ADD",
    title: "Count the whole junction",
    description: "Traffic is arriving from every side. Look at the four queues and clear them one safe phase at a time.",
    objective: "Count the vehicles waiting on all four approaches. You can check the live queue numbers below the controls.",
    queues: { north: 3, south: 3, east: 2, west: 2 },
    waitMinutes: { north: 2, south: 2, east: 4, west: 3 },
    question: "How many vehicles were waiting altogether? Add 3 + 3 + 2 + 2.",
    answers: [8, 10, 12],
    answer: 10,
    explanation: "3 + 3 + 2 + 2 = 10 vehicles."
  },
  {
    id: 3,
    tag: "REPEATED ADDITION",
    title: "Make a green wave",
    description: "The North–South road has a longer queue. Each wave moves two vehicles, one from each side.",
    objective: "Clear the North–South queues. Watch how repeated groups of 2 move the total along.",
    queues: { north: 4, south: 4, east: 0, west: 0 },
    waitMinutes: { north: 4, south: 3, east: 2, west: 2 },
    question: "There are 8 cars. Two pass in each green wave. How many waves are needed? Think: 2 + 2 + 2 + 2.",
    answers: [3, 4, 8],
    answer: 4,
    explanation: "Four groups of 2 make 8. So 8 ÷ 2 = 4 waves."
  },
  {
    id: 4,
    tag: "DIVISION & PLANNING",
    title: "Rush-hour organiser",
    description: "All four approaches are busy. Choose a safe phase, release a wave, then switch when the other road needs to move.",
    objective: "Clear all 12 vehicles. Each wave moves up to 2 vehicles from the selected pair of opposite roads.",
    queues: { north: 3, south: 3, east: 3, west: 3 },
    waitMinutes: { north: 5, south: 4, east: 3, west: 3 },
    question: "There are 12 vehicles. A full green wave moves 2. How many waves would clear 12 vehicles? 12 ÷ 2 = ?",
    answers: [5, 6, 8],
    answer: 6,
    explanation: "12 divided into groups of 2 makes 6 waves."
  },
  {
    id: 5,
    tag: "PEDESTRIANS & TIME",
    title: "People cross first",
    description: "The vehicles have cleared. Now help the people waiting at the zebra crossing get across safely.",
    objective: "Give pedestrians a walk signal. Four people cross in each group. Complete both groups before the final maths question.",
    queues: { north: 2, south: 2, east: 2, west: 2 },
    waitMinutes: { north: 2, south: 2, east: 5, west: 4 },
    pedestrians: 8,
    pedestrianGroupSize: 4,
    question: "One group takes 5 seconds to cross. Two groups cross. How much time is that altogether?",
    answers: [5, 10, 15],
    answer: 10,
    explanation: "5 seconds + 5 seconds = 10 seconds. That is 2 × 5."
  }
];
