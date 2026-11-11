import { MISSIONS } from "./missions.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const $ = (selector) => document.querySelector(selector);
const vehicleLayer = $("#vehicle-layer");
const signalIds = { north: "signal-north", south: "signal-south", east: "signal-east", west: "signal-west" };
const vehiclePalette = ["#e5a34d", "#6d9fc0", "#d66f68", "#7caa83", "#a18bc1", "#e2c76b"];
const vehicleKinds = { north: ["car", "taxi", "bus", "car"], south: ["van", "car", "car", "bus"], east: ["bike", "car", "van", "taxi"], west: ["bus", "car", "taxi", "car"] };
const layout = {
  north: { x: 405, y: 164, dx: 0, dy: -38, angle: 180, exit: { x: 405, y: 690 } },
  south: { x: 495, y: 456, dx: 0, dy: 38, angle: 0, exit: { x: 495, y: -75 } },
  east: { x: 602, y: 315, dx: 38, dy: 0, angle: -90, exit: { x: -90, y: 315 } },
  west: { x: 298, y: 285, dx: -38, dy: 0, angle: 90, exit: { x: 990, y: 285 } }
};
let missionIndex = 0, runId = 0, queues = {}, busy = false, nsSeconds = 20, cleared = 0, score = 0, cycles = 0;
let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function svgNode(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}
function vehicleArtwork(kind, color) {
  if (kind === "bike") return '<circle class="bicycle-wheel" cx="0" cy="-22" r="9"/><circle class="bicycle-wheel" cx="0" cy="22" r="9"/><path class="bicycle-frame" d="M0 -22 12 5 0 22 -12 5Z M-12 5H12"/>';
  if (kind === "bus") return '<rect class="vehicle-wheel" x="-18" y="-25" width="5" height="14" rx="2"/><rect class="vehicle-wheel" x="13" y="-25" width="5" height="14" rx="2"/><rect class="vehicle-wheel" x="-18" y="14" width="5" height="14" rx="2"/><rect class="vehicle-wheel" x="13" y="14" width="5" height="14" rx="2"/><rect class="vehicle-body" x="-14" y="-35" width="28" height="70" rx="7" fill="' + color + '"/><rect class="vehicle-glass" x="-10" y="-27" width="20" height="16" rx="3"/><rect class="vehicle-glass" x="-10" y="-7" width="20" height="15" rx="2"/><rect class="vehicle-glass" x="-10" y="12" width="20" height="12" rx="2"/>';
  return '<rect class="vehicle-wheel" x="-18" y="-21" width="5" height="13" rx="2"/><rect class="vehicle-wheel" x="13" y="-21" width="5" height="13" rx="2"/><rect class="vehicle-wheel" x="-18" y="11" width="5" height="13" rx="2"/><rect class="vehicle-wheel" x="13" y="11" width="5" height="13" rx="2"/><path class="vehicle-body" d="M-11 -31Q-16 -29 -16 -19L-18 15Q-18 29 -10 31H10Q18 29 18 15L16 -19Q16 -29 11 -31Z" fill="' + color + '"/><path class="vehicle-glass" d="M-11 -22Q0 -26 11 -22L10 -9H-10Z"/><path class="vehicle-glass" d="M-10 12H10L11 22Q0 26 -11 22Z"/>';
}
function vehiclePosition(direction, index) {
  const p = layout[direction];
  return { x: p.x + p.dx * index, y: p.y + p.dy * index, angle: p.angle };
}
function makeVehicle(direction, index, kind) {
  const p = vehiclePosition(direction, index);
  const group = svgNode("g", { class: "vehicle", transform: "translate(" + p.x + " " + p.y + ") rotate(" + p.angle + ") scale(.58)", "aria-hidden": "true" });
  group.innerHTML = vehicleArtwork(kind, vehiclePalette[(index + ["north","south","east","west"].indexOf(direction) * 2) % vehiclePalette.length]);
  return group;
}
function animateVehicle(group, direction, start, delay = 0) {
  const end = layout[direction].exit, duration = reducedMotion ? 40 : 1250, started = performance.now() + delay;
  function frame(now) {
    if (now < started) { requestAnimationFrame(frame); return; }
    const t = Math.min(1, (now - started) / duration), ease = 1 - Math.pow(1 - t, 3);
    group.setAttribute("transform", "translate(" + (start.x + (end.x-start.x)*ease) + " " + (start.y + (end.y-start.y)*ease) + ") rotate(" + start.angle + ") scale(.58)");
    if (t < 1) requestAnimationFrame(frame); else group.remove();
  }
  requestAnimationFrame(frame);
}
function setSignal(direction, green) {
  const node = document.getElementById(signalIds[direction]);
  node?.querySelectorAll(".lamp").forEach(lamp => lamp.classList.remove("active"));
  const lamp = node?.querySelector(green ? ".lamp-green" : ".lamp-red");
  lamp?.classList.add("active");
}
function setStatus(message) { $("#traffic-status").textContent = message; }
function totalVehicles() { return Object.values(queues).reduce((sum, q) => sum + q.length, 0); }
function updateQueueDisplay() {
  for (const d of ["north","south","east","west"]) $("#count-" + d).textContent = queues[d].length;
  $("#cleared-count").textContent = cleared;
  $("#total-score").textContent = score;
  $("#cycles-used").textContent = cycles;
}
function availableBudget() {
  const m = MISSIONS[missionIndex];
  return m.budget - m.pedestrianReserve;
}
function phaseCapacity(seconds) {
  return Math.floor(seconds / MISSIONS[missionIndex].serviceSeconds);
}
function evaluate(nsTime) {
  const m = MISSIONS[missionIndex], ewTime = availableBudget() - nsTime;
  const caps = { north: phaseCapacity(nsTime), south: phaseCapacity(nsTime), east: phaseCapacity(ewTime), west: phaseCapacity(ewTime) };
  let moved = 0, points = 0;
  for (const d of ["north","south","east","west"]) {
    const n = Math.min(queues[d].length, caps[d]);
    moved += n;
    points += n * m.waitMinutes[d] * 10;
  }
  return { nsTime, ewTime, caps, moved, points };
}
function bestPlan() {
  const m = MISSIONS[missionIndex], budget = availableBudget();
  let best = null;
  for (let n = 0; n <= budget; n += m.step) {
    const candidate = evaluate(n);
    if (!best || candidate.points > best.points || (candidate.points === best.points && candidate.moved > best.moved)) best = candidate;
  }
  return best;
}
function updatePlanner() {
  const m = MISSIONS[missionIndex], budget = availableBudget(), ew = budget - nsSeconds, result = evaluate(nsSeconds);
  $("#ns-seconds").max = budget;
  $("#ns-seconds").step = m.step;
  $("#ns-seconds").value = nsSeconds;
  $("#ns-output").textContent = nsSeconds + " s";
  $("#ns-preview").textContent = nsSeconds + " s";
  $("#ew-preview").textContent = ew + " s";
  $("#ns-track").style.width = (budget ? nsSeconds / budget * 100 : 0) + "%";
  $("#ew-track").style.width = (budget ? ew / budget * 100 : 0) + "%";
  $("#predicted-vehicles").textContent = result.moved + " / " + totalVehicles();
  $("#predicted-score").textContent = result.points + " pts";
  $("#run-plan").disabled = busy || totalVehicles() === 0;
}
function updateMathData() {
  const m = MISSIONS[missionIndex];
  for (const d of ["north","south","east","west"]) {
    const node = $("#math-" + d);
    if (node) node.textContent = queues[d].length + " waiting · " + m.waitMinutes[d] + " min";
  }
  $("#cycle-budget").textContent = m.budget + " s";
  $("#pedestrian-reserve").textContent = m.pedestrianReserve + " s";
  $("#vehicle-budget").textContent = availableBudget() + " s";
  $("#service-time").textContent = m.serviceSeconds + " s";
  $("#planner-brief").textContent = "Split " + availableBudget() + " seconds of vehicle green time between the two roads. " + (m.pedestrianReserve ? "A pedestrian crossing has already reserved " + m.pedestrianReserve + " seconds." : "Both roads can receive the time you allocate.");
  $("#math-hint").textContent = m.lesson;
  updatePlanner();
}
function renderQueues() {
  vehicleLayer.replaceChildren();
  for (const d of ["north","south","east","west"]) queues[d].forEach((kind,i) => vehicleLayer.append(makeVehicle(d,i,kind)));
  updateQueueDisplay();
}
function startMission(index) {
  runId++; missionIndex = index; busy = false; cleared = 0; score = 0; cycles = 0;
  const m = MISSIONS[index];
  queues = Object.fromEntries(["north","south","east","west"].map(d => [d, Array.from({length:m.queues[d]},(_,i)=>vehicleKinds[d][i%vehicleKinds[d].length])]));
  nsSeconds = Math.round(availableBudget() / (2*m.step)) * m.step;
  $("#mission-number").textContent = String(index+1).padStart(2,"0") + " / " + String(MISSIONS.length).padStart(2,"0");
  $("#mission-progress-fill").style.width = ((index+1)/MISSIONS.length*100) + "%";
  $("#mission-tag").textContent = m.tag;
  $("#mission-title").textContent = m.title;
  $("#mission-description").textContent = m.description;
  $("#mission-objective").textContent = m.objective;
  $("#math-check").hidden = true;
  $("#next-mission").hidden = true;
  $("#math-feedback").textContent = "";
  for (const d of ["north","south","east","west"]) setSignal(d,false);
  renderQueues(); updateMathData();
  setStatus("Plan the green-time split before changing the signals. Your schedule will control how many vehicles move.");
}
function runPlan() {
  if (busy || totalVehicles() === 0) return;
  const plan = evaluate(nsSeconds), optimal = bestPlan(), m = MISSIONS[missionIndex];
  cycles++; busy = true; $("#run-plan").disabled = true;
  const moving = [];
  for (const d of ["north","south","east","west"]) {
    for (let i=0; i<plan.caps[d] && queues[d].length; i++) {
      const start = vehiclePosition(d,i);
      const kind = queues[d].shift();
      moving.push({d,kind,start});
    }
  }
  const nsGreen = plan.nsTime > 0, ewGreen = plan.ewTime > 0;
  for (const d of ["north","south"]) setSignal(d,nsGreen);
  for (const d of ["east","west"]) setSignal(d,ewGreen);
  renderQueues();
  moving.forEach((v,i) => {
    const node = makeVehicle(v.d,0,v.kind);
    vehicleLayer.append(node);
    animateVehicle(node,v.d,v.start,reducedMotion?0:i*85);
  });
  cleared += plan.moved; score += plan.points;
  const duration = reducedMotion ? 90 : 1550 + Math.max(0,moving.length-1)*85;
  setStatus("Your " + plan.nsTime + "s / " + plan.ewTime + "s schedule is running. Watch the queues change.");
  window.setTimeout(() => {
    busy = false;
    for (const d of ["north","south","east","west"]) setSignal(d,false);
    updateQueueDisplay(); updateMathData();
    const optimalText = optimal.nsTime + "s for North–South and " + optimal.ewTime + "s for East–West";
    if (plan.points === optimal.points) {
      $("#math-hint").textContent = "Excellent allocation! You matched the highest possible score for this cycle (" + optimal.points + " points).";
    } else {
      $("#math-hint").textContent = "Your plan earned " + plan.points + " points. The highest-scoring split this cycle was " + optimalText + " (" + optimal.points + " points). Compare which approaches had the greatest waiting-time weight.";
    }
    if (totalVehicles() === 0) finishMission();
    else {
      setStatus(plan.moved + " vehicles moved. " + totalVehicles() + " remain. Recalculate a new schedule for the next cycle.");
      updatePlanner();
    }
  },duration);
}
function finishMission() {
  const m = MISSIONS[missionIndex];
  $("#math-check").hidden = false;
  $("#math-title").textContent = "Junction cleared — you are the traffic engineer!";
  $("#math-question").textContent = "You moved all " + cleared + " vehicles in " + cycles + " signal cycles and earned " + score + " priority points.";
  $("#math-feedback").textContent = m.lesson + " You can compare your schedule results with the best possible split shown after each cycle.";
  $("#next-mission").hidden = false;
  $("#next-mission").textContent = missionIndex === MISSIONS.length-1 ? "Replay all missions ↻" : "Next engineering mission →";
  setStatus("All queues are clear. Mission complete!");
  $("#math-check").scrollIntoView({behavior:reducedMotion?"auto":"smooth",block:"nearest"});
}
function toggleMotion() {
  reducedMotion = !reducedMotion;
  document.body.classList.toggle("reduce-motion",reducedMotion);
  $("#motion-toggle").setAttribute("aria-pressed",String(reducedMotion));
  $("#motion-toggle .utility-label").textContent = reducedMotion ? "Motion reduced" : "Reduce motion";
}
function toggleTextSize() {
  const on = document.body.classList.toggle("large-type");
  $("#text-size-toggle").setAttribute("aria-pressed",String(on));
  $("#text-size-toggle").textContent = on ? "A−" : "A+";
}
$("#ns-seconds").addEventListener("input", e => { nsSeconds = Number(e.target.value); updatePlanner(); });
$("#run-plan").addEventListener("click",runPlan);
$("#next-mission").addEventListener("click",() => startMission(missionIndex === MISSIONS.length-1 ? 0 : missionIndex+1));
$("#restart-mission").addEventListener("click",() => startMission(missionIndex));
$("#motion-toggle").addEventListener("click",toggleMotion);
$("#text-size-toggle").addEventListener("click",toggleTextSize);
if (reducedMotion) {
  document.body.classList.add("reduce-motion");
  $("#motion-toggle").setAttribute("aria-pressed","true");
  $("#motion-toggle .utility-label").textContent = "Motion reduced";
}
startMission(0);
