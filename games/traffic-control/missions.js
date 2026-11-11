const LEVELS_BASE = {
 easy: {
  label:"EASY · BEGINNER", name:"Two-way Avenue", directions:["north","south"], budget:40, step:5, serviceSeconds:10, variable:false,
  rounds:[
   {title:"First day on traffic duty",description:"Cars are queued on the north and south approaches. Give each direction its own green phase so vehicles travel north-to-south and south-to-north safely.",objective:"Allocate the 40-second cycle between northbound and southbound traffic. Every 10 seconds clears one car in the direction with the green light.",queues:{north:["car","car"],south:["car"]},waitMinutes:{north:1,south:1},budget:40,lesson:"Northbound and southbound traffic take turns. Divide the 40-second budget into two green phases; every 10 seconds clears one car in the selected direction."},
   {title:"The school gate",description:"More families are arriving. Work out how many cars can pass during the next signal cycle.",objective:"Split the 30-second cycle between northbound and southbound traffic. How many cars can each phase clear?",queues:{north:["car","car","car"],south:["car","car"]},waitMinutes:{north:2,south:2},budget:30,lesson:"Each 10-second phase clears one car. Divide the 30-second budget between the two directions, then compare each phase with its queue."},
   {title:"Clear the avenue",description:"The last rush is here. Choose a safe cycle length that clears the waiting traffic.",objective:"Allocate the 40-second cycle across the two directions. Find a split that clears the most cars.",queues:{north:["car","car","car","car"],south:["car","car","car"]},waitMinutes:{north:3,south:2},budget:40,lesson:"The total budget is 40 seconds, not 40 seconds per direction. Each car needs 10 seconds, so compare possible northbound/southbound splits before running the plan."}
  ]
 },
 medium:{
  label:"MEDIUM · CITY TRAFFIC",name:"Four-way Junction",directions:["north","south","east","west"],budget:60,step:5,serviceSeconds:10,variable:false,
  rounds:[
   {title:"Market Street rush",description:"Traffic arrives from all four sides. North–South and East–West must take turns.",objective:"Use the 60-second budget to decide which road needs the longer green phase.",queues:{north:["car","car","car"],south:["car","car"],east:["car","car","car"],west:["car","car"]},waitMinutes:{north:2,south:2,east:3,west:2},budget:60,lesson:"Each 10-second green interval serves one vehicle from each open approach. Compare the two road totals before choosing a split."},
   {title:"Hospital priority",description:"The hospital approach has a growing queue and a longer wait. Your signal plan must account for urgency.",objective:"Multiply vehicles served by their waiting-time weight to maximise priority points.",queues:{north:["car","car","car","car"],south:["car","car","car"],east:["car","car","car","car"],west:["car","car"]},waitMinutes:{north:2,south:3,east:5,west:4},budget:60,lesson:"Priority points = vehicles served × waiting minutes × 10. The longest queue is not automatically the most urgent."},
   {title:"Downtown gridlock",description:"All four approaches are packed. Make the best use of a limited signal cycle.",objective:"Calculate each road's capacity and compare the score from different green-time splits.",queues:{north:["car","car","car","car","car"],south:["car","car","car","car"],east:["car","car","car","car"],west:["car","car","car"]},waitMinutes:{north:4,south:3,east:2,west:5},budget:80,lesson:"Test several allocations. The optimal split is the one that earns the most total priority points without exceeding the cycle budget."}
  ]
 },
 hard:{
  label:"HARD · TRAFFIC ENGINEER",name:"Mixed Fleet Junction",directions:["north","south","east","west"],budget:90,step:5,serviceSeconds:10,variable:true,
  rounds:[
   {title:"The mixed fleet",description:"Bicycles, cars and heavy trucks share the junction. Each needs a different amount of green time to clear safely.",objective:"Add the crossing times in each queue. A cycle needs 5s, a car 10s and a truck 15s. Allocate green time to maximise priority.",queues:{north:["bike","car","truck","bike"],south:["car","bike","truck"],east:["truck","car","bike","car"],west:["bike","truck","car"]},waitMinutes:{north:3,south:2,east:4,west:3},budget:90,lesson:"Capacity is no longer queue size ÷ 10. Add each vehicle's service time in order: bicycle 5s, car 10s, truck 15s. A queue clears only when its cumulative time fits the green phase."},
   {title:"Heavy vehicle corridor",description:"Large delivery trucks are slowing the junction. Bicycles clear quickly, but trucks need longer protected green time.",objective:"Calculate the cumulative service time for each approach, then compare priority points for each possible split.",queues:{north:["truck","truck","car","bike"],south:["bike","car","truck","car"],east:["truck","car","truck"],west:["bike","bike","car","truck"]},waitMinutes:{north:5,south:3,east:4,west:2},budget:100,lesson:"For each approach, add service times in queue order. Do not count a vehicle if its full crossing time would exceed the green phase."},
   {title:"Rush-hour optimisation",description:"The entire city is moving. Your job is to clear the highest-priority traffic with a fixed 120-second signal budget.",objective:"Find the best green split by considering queue order, vehicle type, service time and waiting-time priority.",queues:{north:["truck","car","bike","truck","car"],south:["bike","car","truck","bike"],east:["car","truck","truck","bike"],west:["truck","bike","car","car"]},waitMinutes:{north:5,south:3,east:4,west:5},budget:120,lesson:"Optimise the schedule: cumulative service time determines how many vehicles fit; waiting-time weights determine the score. A good plan balances both."}
  ]
 }
};


// Keep the original first three scenarios, then generate 47 deterministic
// scenarios per difficulty. Each generated round has its own queues, waits,
// cycle budget and vehicle order, so the 50 challenges are not repeats.
const CHALLENGE_THEMES = [
  "Morning commute","School-zone traffic","Market delivery rush","Rainy-day junction",
  "Bus-stop bottleneck","Library crossing","Stadium traffic","Shopping street",
  "Construction detour","Station approach","Weekend visitors","Office-hour flow",
  "Museum avenue","Bridge approach","Park entrance","Community fair",
  "Roadwork diversion","Late-morning traffic","Sports-day arrivals","Festival route",
  "Narrow-lane queue","Delivery corridor","Evening commute","Tourist district",
  "Emergency access","Residential avenue","College crossing","Town-centre rush",
  "One-way diversion","Busy roundabout","Railway crossing","Harbour road",
  "Airport approach","Food-market lane","Concert traffic","Pedestrian zone",
  "Factory shift change","Rain-soaked boulevard","Expressway exit","Old-town junction",
  "Public-holiday traffic","Hospital approach","Shopping-centre exit","Greenway crossing",
  "Night-market route","Coach-terminal queue","Cycling corridor","High-street bottleneck",
  "Festival departure","Final city-wide rush"
];

function makeChallengeRandom(seed) {
  let state = seed >>> 0;
  return max => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state % max;
  };
}

function generatedRounds(levelKey, originalRounds) {
  const rounds = [...originalRounds];
  const levelOffset = levelKey === "easy" ? 1103 : levelKey === "medium" ? 2207 : 3301;
  const directions = LEVELS_BASE[levelKey].directions;
  const themes = CHALLENGE_THEMES;

  for (let i = rounds.length; i < 50; i++) {
    const number = i + 1;
    const random = makeChallengeRandom(levelOffset + number * 7919);
    const base = levelKey === "easy"
      ? 2 + Math.floor(i / 12)
      : levelKey === "medium"
        ? 2 + Math.floor(i / 12)
        : 2 + Math.floor(i / 12);
    const queues = {};
    const waitMinutes = {};
    let easyLayoutCode = i + 3;
    for (const reservedCode of [1, 12, 23]) {
      if (easyLayoutCode >= reservedCode) easyLayoutCode++;
    }

    for (const direction of directions) {
      const variation = random(5) - 2;
      const directionIndex = directions.indexOf(direction);
      const size = levelKey === "easy"
        ? (direction === "north" ? 1 + (easyLayoutCode % 10) : 1 + Math.floor(easyLayoutCode / 10))
        : levelKey === "medium"
          ? 1 + (Math.floor(i / Math.pow(6, directionIndex)) % 6)
          : 2 + (Math.floor(i / Math.pow(6, directionIndex)) % 6);
      queues[direction] = [];
      for (let vehicle = 0; vehicle < size; vehicle++) {
        if (levelKey === "hard") {
          const fleet = ["bike", "car", "truck"];
          queues[direction].push(fleet[random(fleet.length)]);
        } else {
          queues[direction].push("car");
        }
      }
      waitMinutes[direction] = 1 + random(5);
    }

    const budget = levelKey === "easy"
      ? 40 + (i % 7) * 5
      : levelKey === "medium"
        ? 60 + (i % 7) * 5
        : 90 + (i % 7) * 10;
    const theme = themes[i % themes.length];
    const totalVehicles = Object.values(queues).reduce((sum, queue) => sum + queue.length, 0);
    const fleetTimes = { bike: 5, car: 10, truck: 15 };
    const crossingTime = Object.values(queues).reduce(
      (sum, queue) => sum + queue.reduce((subtotal, kind) => subtotal + (fleetTimes[kind] || 10), 0), 0
    );

    let objective, lesson;
    if (levelKey === "easy") {
      objective = `Split the ${budget}-second cycle between northbound and southbound traffic. Work out how many cars each green phase can clear.`;
      lesson = `There are ${totalVehicles} cars waiting. Each car needs 10 seconds, so compare the queue sizes with your two green phases and use the full ${budget}-second budget carefully.`;
    } else if (levelKey === "medium") {
      objective = `Allocate the ${budget}-second cycle between North–South and East–West. Prioritise the approaches with the greatest waiting-time score.`;
      lesson = `Each open approach can clear one car per 10 seconds. Compare the queues and waiting-time weights before choosing how to divide the ${budget} seconds.`;
    } else {
      objective = `Add the crossing times for all four queues. Bikes need 5s, cars 10s and trucks 15s. Use the ${budget}-second budget to maximise priority points.`;
      lesson = `The queues contain ${totalVehicles} vehicles and need ${crossingTime} seconds in total if served one after another. Add service times in queue order, then balance capacity against waiting-time priority.`;
    }

    rounds.push({
      title: `Challenge ${String(number).padStart(2, "0")} · ${theme}`,
      description: levelKey === "easy"
        ? `A new two-way traffic pattern has formed near ${theme.toLowerCase()}. Read both queues and plan a safe northbound/southbound split.`
        : levelKey === "medium"
          ? `Traffic is building around ${theme.toLowerCase()}. Compare all four approaches and choose the best two-phase signal plan.`
          : `A mixed fleet is approaching the ${theme.toLowerCase()}. Account for every bicycle, car and truck before allocating green time.`,
      objective,
      queues,
      waitMinutes,
      budget,
      lesson
    });
  }
  return rounds;
}

export const LEVELS = Object.fromEntries(
  Object.entries(LEVELS_BASE).map(([key, config]) => [
    key,
    { ...config, rounds: generatedRounds(key, config.rounds) }
  ])
);
