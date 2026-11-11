import { MISSIONS } from "./missions.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const $ = (selector) => document.querySelector(selector);
const vehicleLayer = $("#vehicle-layer");
const pedestrianLayer = $("#pedestrian-layer");
const phaseButtons = { ns: $("#phase-ns"), ew: $("#phase-ew") };
const signalIds = {
  north: "signal-north",
  south: "signal-south",
  east: "signal-east",
  west: "signal-west"
};
const queueDirections = {
  ns: ["north", "south"],
  ew: ["east", "west"]
};
const vehiclePalette = ["#e5a34d", "#6d9fc0", "#d66f68", "#7caa83", "#a18bc1", "#e2c76b"];
const vehicleKinds = {
  north: ["car", "taxi", "bus", "car"],
  south: ["van", "car", "car", "bus"],
  east: ["bike", "car", "van", "taxi"],
  west: ["bus", "car", "taxi", "car"]
};
const directionLayout = {
  north: { x: 405, y: 164, dx: 0, dy: -58, angle: 180, exit: { x: 405, y: 690 } },
  south: { x: 495, y: 456, dx: 0, dy: 58, angle: 0, exit: { x: 495, y: -75 } },
  east: { x: 602, y: 315, dx: 58, dy: 0, angle: -90, exit: { x: -90, y: 315 } },
  west: { x: 298, y: 285, dx: -58, dy: 0, angle: 90, exit: { x: 990, y: 285 } }
};

let missionIndex = 0;
let runId = 0;
let queues = {};
let activePhase = null;
let busy = false;
let pedestriansRemaining = 0;
let pedestriansCrossed = 0;
let pedestrianGroupSize = 0;
let waveCount = { ns: 0, ew: 0 };
let answerLocked = false;
let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function svgNode(name, attributes = {}) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function vehicleArtwork(kind, color) {
  if (kind === "bike") {
    return '<circle class="bicycle-wheel" cx="0" cy="-22" r="9"/><circle class="bicycle-wheel" cx="0" cy="22" r="9"/><path class="bicycle-frame" d="M0 -22 12 5 0 22 -12 5Z M-12 5H12 M0 -22 8 -28 M12 5 19 -2"/><circle cx="0" cy="-4" r="4" fill="#e7b37b"/><path d="M0 0 7 10" stroke="#526c7b" stroke-width="4" stroke-linecap="round"/>';
  }
  if (kind === "bus") {
    return '<rect class="vehicle-wheel" x="-18" y="-25" width="5" height="14" rx="2"/><rect class="vehicle-wheel" x="13" y="-25" width="5" height="14" rx="2"/><rect class="vehicle-wheel" x="-18" y="14" width="5" height="14" rx="2"/><rect class="vehicle-wheel" x="13" y="14" width="5" height="14" rx="2"/><rect class="vehicle-body" x="-14" y="-35" width="28" height="70" rx="7" fill="' + color + '"/><rect class="vehicle-glass" x="-10" y="-27" width="20" height="16" rx="3"/><rect class="vehicle-glass" x="-10" y="-7" width="20" height="15" rx="2"/><rect class="vehicle-glass" x="-10" y="12" width="20" height="12" rx="2"/><path d="M-10 28H10" stroke="#f6e5b6" stroke-width="2"/><rect x="-3" y="27" width="6" height="4" rx="1" fill="#f7d47a"/><path class="vehicle-highlight" d="M-10 -31h4v56h-4z"/>';
  }
  if (kind === "van") {
    return '<rect class="vehicle-wheel" x="-18" y="-22" width="5" height="13" rx="2"/><rect class="vehicle-wheel" x="13" y="-22" width="5" height="13" rx="2"/><rect class="vehicle-wheel" x="-18" y="12" width="5" height="13" rx="2"/><rect class="vehicle-wheel" x="13" y="12" width="5" height="13" rx="2"/><path class="vehicle-body" d="M-13 -30Q-16 -30 -16 -23V23Q-16 30 -10 30H10Q16 30 16 23V-23Q16 -30 13 -30Z" fill="' + color + '"/><path class="vehicle-glass" d="M-11 -24H11V-9H-11Z"/><rect x="-11" y="-4" width="22" height="24" rx="3" fill="#d7e2d8" opacity=".6"/><path class="vehicle-highlight" d="M-11 -26h3v48h-3z"/>';
  }
  return '<rect class="vehicle-wheel" x="-18" y="-21" width="5" height="13" rx="2"/><rect class="vehicle-wheel" x="13" y="-21" width="5" height="13" rx="2"/><rect class="vehicle-wheel" x="-18" y="11" width="5" height="13" rx="2"/><rect class="vehicle-wheel" x="13" y="11" width="5" height="13" rx="2"/><path class="vehicle-body" d="M-11 -31Q-16 -29 -16 -19L-18 15Q-18 29 -10 31H10Q18 29 18 15L16 -19Q16 -29 11 -31Z" fill="' + color + '"/><path class="vehicle-glass" d="M-11 -22Q0 -26 11 -22L10 -9H-10Z"/><path class="vehicle-glass" d="M-10 12H10L11 22Q0 26 -11 22Z"/><rect x="-10" y="-5" width="20" height="13" rx="4" fill="' + (kind === "taxi" ? "#f5d777" : "#d9e5d8") + '" opacity=".88"/><path class="vehicle-highlight" d="M-12 -26h3v46h-3z"/><rect x="-12" y="-31" width="7" height="3" rx="1" fill="#fff4cf"/><rect x="5" y="-31" width="7" height="3" rx="1" fill="#fff4cf"/><rect x="-12" y="28" width="7" height="3" rx="1" fill="#e76c61"/><rect x="5" y="28" width="7" height="3" rx="1" fill="#e76c61"/>';
}

function vehiclePosition(direction, index) {
  const base = directionLayout[direction];
  return { x: base.x + base.dx * index, y: base.y + base.dy * index, angle: base.angle };
}

function makeVehicle(direction, index, kind) {
  const position = vehiclePosition(direction, index);
  const group = svgNode("g", {
    class: "vehicle",
    transform: "translate(" + position.x + " " + position.y + ") rotate(" + position.angle + ") scale(.78)",
    "aria-hidden": "true"
  });
  const color = vehiclePalette[(index + ["north", "south", "east", "west"].indexOf(direction) * 2) % vehiclePalette.length];
  group.innerHTML = vehicleArtwork(kind, color);
  return group;
}

function animateVehicle(group, direction, start) {
  const destination = directionLayout[direction].exit;
  const duration = reducedMotion ? 40 : 1350;
  const startTime = performance.now();
  const deltaX = destination.x - start.x;
  const deltaY = destination.y - start.y;
  function frame(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const x = start.x + deltaX * eased;
    const y = start.y + deltaY * eased;
    group.setAttribute("transform", "translate(" + x + " " + y + ") rotate(" + start.angle + ")");
    if (progress < 1) requestAnimationFrame(frame);
    else group.remove();
  }
  requestAnimationFrame(frame);
}

function makePedestrian(index, x, y) {
  const group = svgNode("g", {
    class: "pedestrian",
    transform: "translate(" + x + " " + y + ")",
    "aria-hidden": "true"
  });
  const shirts = ["#6d91bd", "#d58a69", "#8aab76", "#a48ac1"];
  group.innerHTML = '<circle class="pedestrian-head" cx="0" cy="-8" r="4.5"/><path class="pedestrian-body" d="M-5 -2Q0 -6 5 -2L4 9H-4Z" fill="' + shirts[index % shirts.length] + '"/><path class="pedestrian-leg" d="M-2 8 -4 16 M2 8 5 16"/><path d="M-4 0 -8 6 M4 0 8 6" stroke="#f0bf8e" stroke-width="2.5" stroke-linecap="round"/>';
  return group;
}

function animatePedestrian(group, index) {
  const startX = 366;
  const endX = 535;
  const startY = 198 + (index % 4) * 4;
  const duration = reducedMotion ? 40 : 1250;
  const startTime = performance.now();
  function frame(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const x = startX + (endX - startX) * progress;
    group.setAttribute("transform", "translate(" + x + " " + startY + ")");
    if (progress < 1) requestAnimationFrame(frame);
    else group.remove();
  }
  requestAnimationFrame(frame);
}

function setSignal(direction, color) {
  const signal = document.getElementById(signalIds[direction]);
  if (!signal) return;
  signal.querySelectorAll(".lamp").forEach((lamp) => lamp.classList.remove("active"));
  const lamp = signal.querySelector(".lamp-" + color);
  if (lamp) lamp.classList.add("active");
}

function updateSignals() {
  ["north", "south", "east", "west"].forEach((direction) => {
    const green = activePhase && queueDirections[activePhase].includes(direction);
    setSignal(direction, green ? "green" : "red");
  });
}

function updateQueueDisplay() {
  ["north", "south", "east", "west"].forEach((direction) => {
    const count = $("#" + "count-" + direction);
    count.textContent = String(queues[direction].length);
  });
}

function renderQueues() {
  vehicleLayer.replaceChildren();
  Object.keys(queues).forEach((direction) => {
    queues[direction].forEach((kind, index) => {
      vehicleLayer.append(makeVehicle(direction, index, kind));
    });
  });
  updateQueueDisplay();
  updateMathBriefing();
}

function queueTotal(phase) {
  return queueDirections[phase].reduce((total, direction) => total + queues[direction].length, 0);
}

function allVehiclesCleared() {
  return Object.values(queues).every((queue) => queue.length === 0);
}

function setStatus(message) {
  $("#traffic-status").textContent = message;
}

function updateControls() {
  const missionFinished = !$("#math-check").hidden;
  ["ns", "ew"].forEach((phase) => {
    const button = phaseButtons[phase];
    button.disabled = busy || missionFinished || queueTotal(phase) === 0;
    button.setAttribute("aria-pressed", String(activePhase === phase));
  });
  $("#send-wave").disabled = busy || missionFinished || !activePhase || queueTotal(activePhase) === 0;
  $("#wave-help").textContent = missionFinished ? "This mission is complete." : activePhase ? "One vehicle from each open approach can move." : "Choose a green phase first.";
  $("#walk-button").disabled = busy || pedestriansRemaining <= 0;
}

function updateProgress() {
  $("#mission-number").textContent = String(missionIndex + 1).padStart(2, "0") + " / " + String(MISSIONS.length).padStart(2, "0");
  $("#mission-progress-fill").style.width = ((missionIndex + 1) / MISSIONS.length * 100) + "%";
}

function startMission(index) {
  runId += 1;
  missionIndex = index;
  const mission = MISSIONS[missionIndex];
  queues = {
    north: Array.from({ length: mission.queues.north }, (_, i) => vehicleKinds.north[i % vehicleKinds.north.length]),
    south: Array.from({ length: mission.queues.south }, (_, i) => vehicleKinds.south[i % vehicleKinds.south.length]),
    east: Array.from({ length: mission.queues.east }, (_, i) => vehicleKinds.east[i % vehicleKinds.east.length]),
    west: Array.from({ length: mission.queues.west }, (_, i) => vehicleKinds.west[i % vehicleKinds.west.length])
  };
  activePhase = null;
  busy = false;
  pedestriansRemaining = mission.pedestrians || 0;
  pedestriansCrossed = 0;
  pedestrianGroupSize = mission.pedestrianGroupSize || 0;
  waveCount = { ns: 0, ew: 0 };
  answerLocked = false;
  $("#mission-tag").textContent = mission.tag;
  $("#mission-title").textContent = mission.title;
  $("#mission-description").textContent = mission.description;
  $("#mission-objective").textContent = mission.objective;
  $("#math-check").hidden = true;
  $("#pedestrian-panel").hidden = true;
  $("#pedestrian-count").textContent = pedestriansRemaining + " waiting";
  $("#pedestrian-help").textContent = "All vehicle signals stay red while a group crosses.";
  $("#walk-button").textContent = "Start pedestrian crossing";
  $("#next-mission").hidden = true;
  $("#math-feedback").textContent = "";
  $("#math-answers").replaceChildren();
  pedestrianLayer.replaceChildren();
  updateProgress();
  renderQueues();
  updateMathBriefing();
  $("#math-hint").textContent = "Calculate each road pressure, then choose the larger score before releasing traffic.";
  updateSignals();
  updateControls();
  setStatus("All signals are red. Choose a direction to begin.");
}

function phasePressure(phase) {
  const waits = MISSIONS[missionIndex].waitMinutes;
  return queueDirections[phase].reduce((sum, direction) => sum + queues[direction].length * waits[direction], 0);
}

function bestPhase() {
  const ns = phasePressure("ns");
  const ew = phasePressure("ew");
  if (ns === ew) return queueTotal("ns") >= queueTotal("ew") ? "ns" : "ew";
  return ns > ew ? "ns" : "ew";
}

function updateMathBriefing() {
  const mission = MISSIONS[missionIndex];
  ["north", "south", "east", "west"].forEach((direction) => {
    const node = $("#math-" + direction);
    if (node) node.textContent = queues[direction].length + " × " + mission.waitMinutes[direction] + " min";
  });
  $("#pressure-ns").textContent = "Work it out";
  $("#pressure-ew").textContent = "Work it out";
  $("#phase-ns .phase-count").textContent = queueTotal("ns") + " vehicles";
  $("#phase-ew .phase-count").textContent = queueTotal("ew") + " vehicles";
}

function choosePhase(phase) {
  if (busy || !$("#math-check").hidden || queueTotal(phase) === 0) return;
  if (phase !== bestPhase()) {
    activePhase = null;
    updateSignals();
    updateControls();
    setStatus("Not the best choice yet. Multiply each queue by its waiting time, then compare the two road totals.");
    $("#math-hint").textContent = "Try again: pressure = vehicles waiting × waiting minutes. Choose the larger total.";
    return;
  }
  activePhase = phase;
  $("#math-hint").textContent = "Correct strategy. This road has the greater waiting-time pressure. Release its green wave.";

  updateSignals();
  updateControls();
  const label = phase === "ns" ? "North and South" : "East and West";
  updateMathBriefing();
  setStatus(label + " has the higher pressure score. Release one safe wave.");
}

function releaseWave() {
  if (!activePhase || busy || !$("#math-check").hidden) return;
  const phase = activePhase;
  const directions = queueDirections[phase];
  const moving = [];
  directions.forEach((direction) => {
    if (queues[direction].length > 0) {
      const kind = queues[direction].shift();
      const start = vehiclePosition(direction, 0);
      const vehicle = makeVehicle(direction, 0, kind);
      moving.push({ vehicle, direction, start });
    }
  });
  if (!moving.length) {
    activePhase = null;
    updateSignals();
    updateControls();
    return;
  }
  waveCount[phase] += 1;
  const currentRun = runId;
  busy = true;
  updateSignals();
  updateControls();
  renderQueues();
  moving.forEach(({ vehicle, direction, start }) => {
    vehicleLayer.append(vehicle);
    animateVehicle(vehicle, direction, start);
  });
  setStatus("A safe wave is moving. Watch the vehicles cross the junction.");
  window.setTimeout(() => {
    if (currentRun !== runId) return;
    busy = false;
    activePhase = null;
    updateSignals();
    updateControls();
    if (allVehiclesCleared()) {
      if (pedestriansRemaining > 0) {
        $("#pedestrian-panel").hidden = false;
        $("#pedestrian-count").textContent = pedestriansRemaining + " waiting";
        setStatus("All vehicles have stopped. It is time to help the pedestrians cross.");
      } else {
        showMathCheck();
      }
    } else {
      setStatus("Wave complete. Choose the next road that should move.");
    }
  }, reducedMotion ? 70 : 1400);
}

function startPedestrianCrossing() {
  if (busy || pedestriansRemaining <= 0 || !allVehiclesCleared()) return;
  busy = true;
  activePhase = null;
  updateSignals();
  updateControls();
  const currentRun = runId;
  const groupSize = Math.min(pedestrianGroupSize, pedestriansRemaining);
  pedestriansRemaining -= groupSize;
  pedestriansCrossed += groupSize;
  for (let index = 0; index < groupSize; index += 1) {
    const person = makePedestrian(index, 366, 198 + (index % 4) * 4);
    pedestrianLayer.append(person);
    animatePedestrian(person, index);
  }
  $("#pedestrian-count").textContent = pedestriansRemaining + " waiting";
  $("#walk-button").textContent = pedestriansRemaining > 0 ? "Start next group" : "Crossing complete";
  setStatus(groupSize + " pedestrians are crossing. All vehicle signals remain red.");
  window.setTimeout(() => {
    if (currentRun !== runId) return;
    busy = false;
    updateControls();
    if (pedestriansRemaining === 0) {
      $("#pedestrian-help").textContent = pedestriansCrossed + " people crossed safely. Nicely organised!";
      showMathCheck();
    } else {
      $("#pedestrian-help").textContent = "The first group is across. " + pedestriansRemaining + " more people are waiting.";
      setStatus("The crossing is clear. Start the next group when you are ready.");
    }
  }, reducedMotion ? 70 : 1320);
}

function showMathCheck() {
  activePhase = null;
  $("#math-check").hidden = false;
  const mission = MISSIONS[missionIndex];
  const totalVehicles = Object.values(mission.queues).reduce((sum, count) => sum + count, 0);
  const totalWaves = waveCount.ns + waveCount.ew;
  $("#math-title").textContent = "Junction cleared — strategy complete!";
  $("#math-question").textContent = "You safely moved all " + totalVehicles + " vehicles in " + totalWaves + " green waves. You used the traffic-pressure rule to decide which road deserved priority at each step.";
  $("#math-feedback").textContent = "Remember: pressure = vehicles waiting × waiting time. Compare the North–South and East–West totals before every signal change.";
  $("#math-answers").replaceChildren();
  $("#next-mission").hidden = false;
  $("#next-mission").textContent = missionIndex === MISSIONS.length - 1 ? "Play the missions again ↻" : "Next mission →";
  answerLocked = true;
  updateSignals();
  updateControls();
  setStatus("Mission complete. Your maths guided every traffic decision.");
  $("#math-check").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
}

function checkAnswer(value, selectedButton) {
  if (answerLocked) return;
  const mission = MISSIONS[missionIndex];
  if (value !== mission.answer) {
    selectedButton.classList.add("incorrect");
    selectedButton.disabled = true;
    $("#math-feedback").textContent = "Not quite. No problem—try another answer. Think about the groups you moved.";
    return;
  }
  answerLocked = true;
  selectedButton.classList.add("correct");
  $("#math-answers").querySelectorAll("button").forEach((button) => { button.disabled = true; });
  $("#math-feedback").textContent = mission.explanation;
  $("#next-mission").hidden = false;
  $("#next-mission").textContent = missionIndex === MISSIONS.length - 1 ? "Play the missions again ↻" : "Next mission →";
  setStatus("Mission complete. You kept the junction safe and used maths to explain your plan.");
}

function advanceMission() {
  if (!answerLocked) return;
  if (missionIndex === MISSIONS.length - 1) startMission(0);
  else startMission(missionIndex + 1);
}

function toggleMotion() {
  reducedMotion = !reducedMotion;
  document.body.classList.toggle("reduce-motion", reducedMotion);
  $("#motion-toggle").setAttribute("aria-pressed", String(reducedMotion));
  $("#motion-toggle .utility-label").textContent = reducedMotion ? "Motion reduced" : "Reduce motion";
  setStatus(reducedMotion ? "Reduced motion is on. Vehicle movement is simplified." : "Standard gentle movement is on.");
}

function toggleTextSize() {
  const enabled = document.body.classList.toggle("large-type");
  $("#text-size-toggle").setAttribute("aria-pressed", String(enabled));
  $("#text-size-toggle").textContent = enabled ? "A−" : "A+";
  $("#text-size-toggle").setAttribute("aria-label", enabled ? "Return to standard text size" : "Make text larger");
}

phaseButtons.ns.addEventListener("click", () => choosePhase("ns"));
phaseButtons.ew.addEventListener("click", () => choosePhase("ew"));
$("#send-wave").addEventListener("click", releaseWave);
$("#walk-button").addEventListener("click", startPedestrianCrossing);
$("#next-mission").addEventListener("click", advanceMission);
$("#motion-toggle").addEventListener("click", toggleMotion);
$("#text-size-toggle").addEventListener("click", toggleTextSize);
$("#restart-mission").addEventListener("click", () => startMission(missionIndex));

if (reducedMotion) {
  document.body.classList.add("reduce-motion");
  $("#motion-toggle").setAttribute("aria-pressed", "true");
  $("#motion-toggle .utility-label").textContent = "Motion reduced";
}
startMission(0);
