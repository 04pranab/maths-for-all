export const MISSIONS = [
  {
    id: 1, tag: "ADDITION & SUBTRACTION", title: "The school-run rush",
    description: "Four approaches are filling up as school begins. You have one 40-second signal cycle to move as many vehicles as possible.",
    objective: "Add the queues, work out how many vehicles each road can serve, and split the green time.",
    queues: { north: 3, south: 2, east: 2, west: 1 },
    waitMinutes: { north: 2, south: 2, east: 2, west: 2 },
    budget: 40, serviceSeconds: 10, step: 5, pedestrianReserve: 0,
    lesson: "Each 10 seconds lets one vehicle from each approach on that road move. The two opposite approaches move together."
  },
  {
    id: 2, tag: "MULTIPLICATION", title: "The growing rush hour",
    description: "The library road has been waiting longer. A longer queue is not always the most urgent: waiting time matters too.",
    objective: "Multiply each approach's queue by its waiting-time weight, then choose a time split that serves the greatest pressure.",
    queues: { north: 4, south: 3, east: 3, west: 2 },
    waitMinutes: { north: 2, south: 3, east: 5, west: 4 },
    budget: 60, serviceSeconds: 10, step: 5, pedestrianReserve: 0,
    lesson: "Pressure points = vehicles served × waiting-time weight. A vehicle waiting longer earns more priority points."
  },
  {
    id: 3, tag: "DIVISION & RATIOS", title: "Share the green time",
    description: "A delivery rush hits the junction. Divide a 60-second cycle fairly, but remember that the best split is not always 30–30.",
    objective: "Use division to estimate how many vehicles fit into each green phase. Then test your time allocation.",
    queues: { north: 5, south: 4, east: 2, west: 2 },
    waitMinutes: { north: 3, south: 3, east: 2, west: 2 },
    budget: 60, serviceSeconds: 10, step: 5, pedestrianReserve: 0,
    lesson: "Divide green seconds by 10 to find the number of vehicles each approach can release. The remainder is time for the other road."
  },
  {
    id: 4, tag: "FRACTIONS & PERCENTAGES", title: "Make room for people",
    description: "Pedestrians need a safe crossing. One quarter of the 60-second cycle is reserved for them before traffic gets any green time.",
    objective: "Find one quarter of 60 seconds, reserve it, and divide the remaining time between the two roads.",
    queues: { north: 4, south: 3, east: 4, west: 3 },
    waitMinutes: { north: 4, south: 3, east: 3, west: 2 },
    budget: 60, serviceSeconds: 10, step: 5, pedestrianReserve: 15,
    lesson: "One quarter of 60 is 60 ÷ 4 = 15 seconds. Only 45 seconds remain for vehicle signals."
  },
  {
    id: 5, tag: "OPTIMISATION", title: "The city-wide gridlock",
    description: "Every road is busy, waiting times differ, and a clinic route is becoming urgent. Design the best signal schedule you can.",
    objective: "Compare the points gained by serving each approach. Choose a green-time split that maximises total pressure relieved.",
    queues: { north: 5, south: 4, east: 5, west: 3 },
    waitMinutes: { north: 5, south: 4, east: 3, west: 2 },
    budget: 60, serviceSeconds: 10, step: 5, pedestrianReserve: 0,
    lesson: "There may be several reasonable schedules, but the best one maximises the total priority points relieved within the fixed time budget."
  }
];
