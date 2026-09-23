/* =============================================================
   MATH FOR ALL – slabmath.js
   SLAB MATHS
   The basket shows a number. Drag (or tap) number slabs into the
   basket to bring it down to exactly zero. Every round is built
   with at least two different valid combinations of slabs, plus
   a few extra "distractor" slabs that are never needed — so a
   learner has to think ahead about which ones to use, which is
   the whole point (backward reasoning / complements to a number).

   Design choices made for accessibility:
   - Dragging a slab that's too big is REJECTED gently (bounces
     back, no penalty) rather than allowed to go negative.
   - After every move we check whether the basket can STILL reach
     zero with what's left. If not, we say so plainly and offer a
     one-tap restart — nobody gets silently stuck.
   - Every drag action has a tap-to-select-then-tap-basket
     equivalent, for anyone who finds dragging hard.
   ============================================================= */

const SlabMath = (function () {

  /* Every tier's basket target stays above 40, so the game never
     feels too easy — slab values and slab count still grow with
     the tier to keep the later rounds meaningfully harder. */
  const TIERS = [
    { targetMin: 41, targetMax: 55,  slabMin: 1, slabMax: 9,  partsMin: 2, partsMax: 4, distractors: 2 },
    { targetMin: 45, targetMax: 65,  slabMin: 2, slabMax: 12, partsMin: 3, partsMax: 4, distractors: 2 },
    { targetMin: 50, targetMax: 75,  slabMin: 2, slabMax: 15, partsMin: 3, partsMax: 5, distractors: 3 },
    { targetMin: 55, targetMax: 90,  slabMin: 3, slabMax: 18, partsMin: 3, partsMax: 5, distractors: 3 },
    { targetMin: 60, targetMax: 110, slabMin: 5, slabMax: 20, partsMin: 4, partsMax: 6, distractors: 4 },
    { targetMin: 70, targetMax: 130, slabMin: 5, slabMax: 25, partsMin: 4, partsMax: 6, distractors: 4 },
  ];
  function tierFor(round) { return TIERS[Math.min(TIERS.length - 1, Math.floor((round - 1) / 5))]; }

  const PROGRESS_KEY = 'mfa_slab_progress_v1';

  let roundNum = null;         // null = not yet initialised this session
  let roundsCompleted = 0;
  let target = 0;
  let slabs = [];              // [{id, value, used}]
  let initialRound = null;     // snapshot for "Restart Round"
  let hintsLeft = 5;
  let selectedSlabId = null;
  let roundLocked = false;     // true once won or stuck, until restart/new round

  /* ---------------- persistence (just the round counter) ---------------- */
  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY));
      if (raw) { roundNum = raw.roundNum || 1; roundsCompleted = raw.roundsCompleted || 0; return; }
    } catch (e) {}
    roundNum = 1; roundsCompleted = 0;
  }
  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify({ roundNum, roundsCompleted })); } catch (e) {}
  }

  /* ---------------- round generation ---------------- */
  function randomPartition(sum, minParts, maxParts, minVal, maxVal) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const parts = Utils.randInt(minParts, maxParts);
      let remaining = sum - minVal * parts;
      if (remaining < 0) continue;
      const vals = new Array(parts).fill(minVal);
      let guard = 0;
      while (remaining > 0 && guard < 2000) {
        guard++;
        const i = Utils.randInt(0, parts - 1);
        if (vals[i] < maxVal) { vals[i]++; remaining--; }
      }
      if (remaining === 0) return vals;
    }
    // Guaranteed fallback: chop `sum` into maxVal-sized chunks.
    const vals = [];
    let left = sum;
    while (left > 0) { const chunk = Math.min(maxVal, left); vals.push(Math.max(1, chunk)); left -= chunk; }
    return vals;
  }
  function sameMultiset(a, b) {
    const sa = [...a].sort((x,y)=>x-y), sb = [...b].sort((x,y)=>x-y);
    return sa.length === sb.length && sa.every((v,i) => v === sb[i]);
  }

  function buildRound(n) {
    const tier = tierFor(n);
    const t = Utils.randInt(tier.targetMin, tier.targetMax);
    const A = randomPartition(t, tier.partsMin, tier.partsMax, tier.slabMin, tier.slabMax);
    let B = randomPartition(t, tier.partsMin, tier.partsMax, tier.slabMin, tier.slabMax);
    for (let i = 0; i < 8 && sameMultiset(A, B); i++) B = randomPartition(t, tier.partsMin, tier.partsMax, tier.slabMin, tier.slabMax);

    const distractors = [];
    for (let i = 0; i < tier.distractors; i++) distractors.push(Utils.randInt(tier.slabMin, tier.slabMax));

    const values = shuffle([...A, ...B, ...distractors]);
    const newSlabs = values.map((v, i) => ({ id: `r${n}_${i}_${Date.now()}_${Math.floor(Math.random()*9999)}`, value: v, used: false }));
    return { target: t, slabs: newSlabs };
  }

  /* ---------------- subset-sum feasibility + hint ---------------- */
  function findAchievableSubset(need, availableSlabs) {
    const vals = availableSlabs.map(s => s.value);
    const n = vals.length;
    let result = null;
    function rec(i, remaining, chosen) {
      if (result || remaining < 0 || i > n) return;
      if (remaining === 0) { result = chosen.slice(); return; }
      if (i === n) return;
      chosen.push(i); rec(i + 1, remaining - vals[i], chosen); chosen.pop();
      if (result) return;
      rec(i + 1, remaining, chosen);
    }
    rec(0, need, []);
    if (!result) return null;
    return result.map(i => availableSlabs[i]);
  }

  /* ---------------- lifecycle ---------------- */
  function init() {
    if (roundNum === null) {
      loadProgress();
      startRoundData(buildRound(roundNum));
    }
    render();
  }

  function startRoundData(data) {
    target = data.target;
    slabs = data.slabs;
    initialRound = { target: data.target, slabs: data.slabs.map(s => ({ ...s })) };
    hintsLeft = 5;
    selectedSlabId = null;
    roundLocked = false;
  }

  function newRound() {
    Analytics.log('slab', 'new_numbers', { round: roundNum });
    startRoundData(buildRound(roundNum));
    render();
  }

  function restartRound() {
    Analytics.log('slab', 'restart_round', { round: roundNum });
    target = initialRound.target;
    slabs = initialRound.slabs.map(s => ({ ...s }));
    hintsLeft = 5;
    selectedSlabId = null;
    roundLocked = false;
    hide('slab-complete');
    showMessage('Round restarted — you\'ve got this!', 'info');
    render();
  }

  function nextRound() {
    roundNum++;
    saveProgress();
    hide('slab-complete');
    startRoundData(buildRound(roundNum));
    render();
  }

  /* ---------------- render ---------------- */
  function render() {
    document.getElementById('slab-round-num').textContent = roundNum;
    document.getElementById('slab-rounds-done').textContent = roundsCompleted;
    document.getElementById('slab-hints-left').textContent = hintsLeft;
    document.getElementById('slab-basket-number').textContent = target;
    const unused = slabs.filter(s => !s.used);
    document.getElementById('slab-slabs-left').textContent = unused.length;

    const basket = document.getElementById('slab-basket');
    basket.classList.toggle('selectable', !!selectedSlabId && !roundLocked);

    const tray = document.getElementById('slab-tray');
    tray.innerHTML = '';
    slabs.forEach(s => {
      if (s.used) return;
      const el = document.createElement('div');
      el.className = 'slab-tile' + (s.id === selectedSlabId ? ' selected' : '');
      el.textContent = s.value;
      el.dataset.id = s.id;
      el.setAttribute('draggable', 'true');
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `Slab ${s.value}`);

      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', s.id);
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));

      el.addEventListener('click', () => {
        if (roundLocked) return;
        selectedSlabId = (selectedSlabId === s.id) ? null : s.id;
        render();
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });

      tray.appendChild(el);
    });
  }

  /* ---------------- interaction: drop / tap-use ---------------- */
  function attemptUse(slabId) {
    if (roundLocked) return;
    const slab = slabs.find(s => s.id === slabId && !s.used);
    if (!slab) return;

    if (slab.value > target) {
      rejectAnimation();
      showMessage(`That slab (${slab.value}) is a bit too big right now — try a smaller one!`, 'warn');
      Analytics.log('slab', 'answer', { round: roundNum, correct: false, value: slab.value, remainingBefore: target });
      return;
    }

    slab.used = true;
    target -= slab.value;
    selectedSlabId = null;
    Analytics.log('slab', 'answer', { round: roundNum, correct: true, value: slab.value, remainingAfter: target });
    render();

    if (target === 0) { handleWin(); return; }

    const unused = slabs.filter(s => !s.used);
    const feasible = findAchievableSubset(target, unused);
    if (!feasible) handleStuck();
    else hide('slab-message');
  }

  function rejectAnimation() {
    const basket = document.getElementById('slab-basket');
    basket.classList.remove('reject'); void basket.offsetWidth; basket.classList.add('reject');
    setTimeout(() => basket.classList.remove('reject'), 400);
  }

  function handleWin() {
    roundLocked = true;
    roundsCompleted++;
    saveProgress();
    const basket = document.getElementById('slab-basket');
    basket.classList.add('won');
    Analytics.log('slab', 'round_complete', { round: roundNum, hintsUsed: 5 - hintsLeft });
    document.getElementById('slab-complete-text').textContent = `Round ${roundNum} complete`;
    show('slab-complete');
  }

  function handleStuck() {
    roundLocked = true;
    const basket = document.getElementById('slab-basket');
    basket.classList.add('stuck');
    showMessage('Hmm, these slabs won\'t quite reach zero from here — no worries! Tap Restart Round to try again.', 'warn');
    Analytics.log('slab', 'stuck', { round: roundNum });
  }

  function showMessage(text, type) {
    const el = document.getElementById('slab-message');
    el.textContent = text;
    el.className = `slab-message ${type}`;
    show('slab-message');
  }

  /* ---------------- hint ---------------- */
  function hint() {
    if (roundLocked) return;
    if (hintsLeft <= 0) { showMessage('No hints left this round — Restart Round to get more!', 'warn'); return; }
    const unused = slabs.filter(s => !s.used);
    const subset = findAchievableSubset(target, unused);
    if (!subset) { handleStuck(); return; }
    const best = subset.reduce((a,b) => a.value < b.value ? a : b);
    hintsLeft--;
    Analytics.log('slab', 'hint_used', { round: roundNum });
    render();
    const el = document.querySelector(`.slab-tile[data-id="${best.id}"]`);
    if (el) { el.classList.add('hinted'); setTimeout(() => el.classList.remove('hinted'), 2500); }
    showMessage(`💡 Try the slab showing ${best.value}.`, 'info');
  }

  /* ---------------- basket drag targets (wired once) ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    const basket = document.getElementById('slab-basket');
    if (!basket) return;
    basket.addEventListener('dragover', (e) => { e.preventDefault(); basket.classList.add('drag-over'); });
    basket.addEventListener('dragleave', () => basket.classList.remove('drag-over'));
    basket.addEventListener('drop', (e) => {
      e.preventDefault();
      basket.classList.remove('drag-over');
      const id = e.dataTransfer.getData('text/plain');
      if (id) attemptUse(id);
    });
    basket.addEventListener('click', () => {
      if (selectedSlabId) attemptUse(selectedSlabId);
    });
  });

  return { init, newRound, restartRound, nextRound, hint };
})();
