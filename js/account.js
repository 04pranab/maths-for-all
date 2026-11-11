/* Optional account and leaderboard client. Guest play is never gated. */
(() => {
  const API = "https://maths-for-all-api.ompranabmohanty.workers.dev/api";
  let mode = "login";
  let currentUser = null;
  let sessionToken = "";
  let quizCorrect = 0, quizTotal = 0, quizStartedAt = 0;
  const $ = id => document.getElementById(id);
  const request = async (path, options = {}) => {
    const response = await fetch(API + path, {
      ...options,
      credentials: "omit",
      headers: { "Content-Type": "application/json", ...(sessionToken ? { Authorization: "Bearer " + sessionToken } : {}), ...(options.headers || {}) },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "The account service is unavailable.");
    return data;
  };
  function setMode(next) {
    mode = next;
    $("auth-modal-title").textContent = mode === "login" ? "Sign in" : "Create your account";
    const usernameLabel = document.querySelector('label[for="auth-username"]');
    if (usernameLabel) usernameLabel.textContent = mode === "login" ? "Username or email" : "Choose a username";
    $("auth-email-label").hidden = mode !== "register";
    $("auth-email").hidden = mode !== "register";
    $("auth-email").required = mode === "register";
    $("auth-submit").textContent = mode === "login" ? "Sign in" : "Create account";
    $("auth-mode-toggle").textContent = mode === "login" ? "New here? Create an account" : "Already have an account? Sign in";
    $("auth-password").autocomplete = mode === "login" ? "current-password" : "new-password";
    $("auth-username").maxLength = mode === "login" ? 254 : 30;
    $("auth-username").minLength = mode === "login" ? 1 : 3;
    $("auth-message").textContent = "";
  }
  function renderNav() {
    const button = $("account-nav-button");
    if (button) button.textContent = currentUser ? "👤 " + currentUser.username : "Sign in";
    if (button) button.onclick = () => currentUser ? openProfile() : Auth.open();
  }
  async function refreshSession() {
    if (window.location.origin !== "https://04pranab.github.io") { currentUser = null; sessionToken = ""; renderNav(); return; }
    sessionToken = sessionStorage.getItem("mfa_session_token") || "";
    try {
      const result = await request("/auth/me");
      currentUser = result.authenticated ? result.user : null;
      if (!currentUser) { sessionToken = ""; sessionStorage.removeItem("mfa_session_token"); }
    } catch { currentUser = null; sessionToken = ""; sessionStorage.removeItem("mfa_session_token"); }
    renderNav();
  }
  const GAME_NAMES = {
    "arithmetic-quiz":"Arithmetic Quiz","math-racing":"Math Racing","sudoku":"Sudoku",
    "shape-fitting":"Shape Fitting","slab-maths":"Slab Maths","shape-architect":"Shape Architect",
    "fraction-bakery":"Fraction Bakery","little-shop":"Little Shop","number-maze":"Number Maze",
    "traffic-control":"Traffic Control Centre"
  };
  function renderTileBadges(stats) {
    const selectors = {
      "arithmetic-quiz":".card-quiz","math-racing":".card-race","sudoku":".card-sudoku",
      "shape-fitting":".card-shape","slab-maths":".card-slab","shape-architect":".card-architect",
      "fraction-bakery":".card-fraction","little-shop":".card-little-shop","number-maze":".card-number-maze",
      "traffic-control":".card-traffic-control"
    };
    for (const game of stats.badges || []) {
      const tile = document.querySelector(selectors[game.gameId]);
      if (!tile) continue;
      tile.querySelector(".tile-achievements")?.remove();
      if (!game.earned?.length) continue;
      const top = game.earned[game.earned.length - 1];
      const strip = document.createElement("span");
      strip.className = "tile-achievements";
      strip.setAttribute("aria-label", game.earned.length + " achievements earned");
      strip.title = game.earned.map(b=>b.title).join(" · ");
      strip.innerHTML = "<span class='tile-achievement-crown'>" + escapeHtml(top.icon) + "</span><span>" + game.earned.length + " badge" + (game.earned.length===1?"":"s") + "</span>";
      tile.appendChild(strip);
    }
  }
  async function loadPlayerStats() {
    if (!currentUser) return null;
    const stats = await request("/players/me/stats");
    renderTileBadges(stats);
    return stats;
  }
  async function openProfile() {
    if (!currentUser) return Auth.open();
    $("account-profile-copy").textContent = "Your public name is " + currentUser.username + ". Email and private account details are never shown here.";
    $("account-profile-stats").innerHTML = "<p class='profile-loading'>Loading your player card…</p>";
    $("account-profile-modal").classList.remove("hidden");
    try {
      const stats = await loadPlayerStats();
      const badgeCount = (stats.badges||[]).reduce((n,g)=>n+(g.earned||[]).length,0)+(stats.globalBadges||[]).length;
      const xpPercent = stats.xpToNext ? Math.min(100,Math.round(stats.xpIntoLevel/stats.xpToNext*100)) : 0;
      const gameCards = (stats.badges||[]).map(game => {
        const earned = game.earned||[];
        const badges = earned.length ? earned.map(b=>"<span class='profile-badge tier-"+escapeHtml(b.tier||"earned")+"' title='"+escapeHtml(b.description||b.title)+"'><i>"+escapeHtml(b.icon)+"</i><span>"+escapeHtml(b.title)+"</span></span>").join("") : "<span class='profile-locked'>Your first achievement is waiting</span>";
        return "<article class='profile-game-card'><div class='profile-game-head'><strong>"+escapeHtml(game.gameName)+"</strong><b>"+Number(game.total_points||0).toLocaleString()+" pts</b></div><p class='profile-game-sub'>"+Number(game.attempts||0).toLocaleString()+" challenges · personal best level "+Number(game.highest_level||1)+"</p><div class='profile-badges'>"+badges+"</div><p class='profile-game-foot'>"+Number(earned.length)+" / "+Number((game.earned||[]).length+(game.locked||[]).length)+" achievements unlocked</p></article>";
      }).join("");
      const globalBadges = (stats.globalBadges||[]).map(b=>"<span class='profile-badge tier-global' title='Player milestone'><i>"+escapeHtml(b.icon)+"</i><span>"+escapeHtml(b.title)+"</span></span>").join("");
      $("account-profile-stats").innerHTML =
        "<section class='profile-hero'><div><span class='profile-kicker'>YOUR PLAYER JOURNEY</span><h3>"+escapeHtml(currentUser.username)+"</h3><p>Every challenge adds to your journey. There is no final level.</p><div class='profile-level-line'><strong>LEVEL "+Number(stats.level||1).toLocaleString()+"</strong><span>"+Number(stats.xpIntoLevel||0).toLocaleString()+" / "+Number(stats.xpToNext||125).toLocaleString()+" XP to next level</span></div><div class='profile-xp-track' role='progressbar' aria-label='Experience to next level' aria-valuenow='"+xpPercent+"' aria-valuemin='0' aria-valuemax='100'><span style='width:"+xpPercent+"%'></span></div></div><div class='profile-avatar' aria-hidden='true'>"+escapeHtml(currentUser.username.slice(0,1).toUpperCase())+"</div></section>"+
        "<section class='profile-summary'><div><strong>"+Number(stats.totalPoints||0).toLocaleString()+"</strong><span>Lifetime points</span></div><div><strong>"+Number(stats.totalAttempts||0).toLocaleString()+"</strong><span>Challenges completed</span></div><div><strong>"+badgeCount.toLocaleString()+"</strong><span>Badges earned</span></div></section>"+
        "<section class='profile-global-badges'><div class='profile-section-title'><h3>Player milestones</h3><p>Achievements across every game</p></div>"+(globalBadges||"<span class='profile-locked'>Your next player milestone awaits.</span>")+"</section>"+
        "<div class='profile-section-title'><h3>Your game collection</h3><p>Each game has its own endless achievement path.</p></div>"+
        "<div class='profile-game-grid'>"+(gameCards||"<p>Complete a challenge to start building your profile.</p>")+"</div>"+
        "<p class='profile-privacy-note'>Only your username, lifetime points and public achievement titles appear on leaderboards. School, family, email and research preferences are never public.</p>";
    } catch(e) { $("account-profile-stats").textContent=e.message; }
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
  async function submitAttempt(gameId, scorePercent, durationSeconds, attemptId, meta = {}) {
    if (!currentUser) return { saved: false, reason: "guest" };
    const id = attemptId || (crypto.randomUUID ? crypto.randomUUID() : "attempt_" + Date.now() + "_" + Math.random().toString(36).slice(2));
    return request("/games/" + encodeURIComponent(gameId) + "/attempts", {
      method: "POST",
      body: JSON.stringify({ attemptId: id, scorePercent, durationSeconds: Math.max(3, Math.round(durationSeconds || 3)), ...meta }),
    });
  }
  function onGameEvent(category, action, detail = {}) {
    if (!currentUser) return;
    if (category === "quiz" && action === "answer") {
      if (!quizStartedAt) quizStartedAt = Date.now();
      quizTotal += 1;
      if (detail.correct) quizCorrect += 1;
      if (quizTotal >= 10) {
        const accuracy = (quizCorrect / quizTotal) * 100;
        const elapsed = Math.max(3, Math.round((Date.now() - quizStartedAt) / 1000));
        quizCorrect = 0; quizTotal = 0; quizStartedAt = 0;
        submitAttempt("arithmetic-quiz", accuracy, elapsed, null, { difficulty: detail.difficulty || "easy" })
          .then(openProfile).catch(error => console.warn("Could not save quiz score:", error.message));
      }
      return;
    }
    const level = Math.max(1, Math.min(1000000000, Number(detail.level || detail.round || detail.customerNumber || 1)));
    const map = {
      "race:round_complete": { game:"math-racing", score:() => { const total=Number(detail.correct||0)+Number(detail.wrong||0); return total?(Number(detail.correct||0)/total)*100:0; }, duration:() => Number(detail.timer||3), difficulty:detail.difficulty||"easy" },
      "sudoku:puzzle_solved": { game:"sudoku", score:() => 100, duration:() => Number(detail.seconds||3), difficulty:detail.difficulty||"easy", hintsUsed:Number(detail.hintsUsed||0) },
      "shape:level_complete": { game:"shape-fitting", score:() => 100, duration:() => Number(detail.seconds||3), difficulty:level>=70?"hard":level>=30?"medium":"easy", level },
      "slab:round_complete": { game:"slab-maths", score:() => 100, duration:() => Number(detail.seconds||3), difficulty:level>=20?"hard":level>=8?"medium":"easy", level, hintsUsed:Number(detail.hintsUsed||0) },
      "shape_architect:complete": { game:"shape-architect", score:() => 100, duration:() => Number(detail.time||3), difficulty:level>=70?"hard":level>=30?"medium":"easy", level, hintsUsed:Number(detail.hints||0) },
      "fraction_bakery:level_complete": { game:"fraction-bakery", score:() => 100, duration:() => Math.max(3,Math.round(Number(detail.timeMs||3000)/1000)), difficulty:level>=70?"hard":level>=25?"medium":"easy", level },
      "number_maze:complete": { game:"number-maze", score:() => 100, duration:() => Number(detail.seconds||3), difficulty:detail.difficulty||"gentle", level, hintsUsed:Number(detail.hints||0) },
      "little_shop:sale_complete": { game:"little-shop", score:() => Math.min(100,Math.max(0,Number(detail.accuracy||100))), duration:() => Number(detail.seconds||3), difficulty:level>=20?"hard":level>=8?"medium":"easy", level },
    };
    const item = map[category + ":" + action];
    if (!item) return;
    const meta = { difficulty:item.difficulty, level:item.level||level, hintsUsed:item.hintsUsed||0, mistakes:Number(detail.mistakes||0) };
    submitAttempt(item.game,item.score(),Math.min(14400,Math.max(3,Math.round(item.duration()))),null,meta)
      .then(() => loadPlayerStats().catch(()=>null))
      .catch(error => console.warn("Could not save Maths For All score:",error.message));
  }
  async function openLeaderboard() {
    $("leaderboard-modal").classList.remove("hidden");
    $("leaderboard-content").innerHTML = "<p class='profile-loading'>Loading the standings…</p>";
    try {
      const gameId = $("leaderboard-game-select")?.value || "global";
      const [result,position] = await Promise.all([
        request(gameId==="global"?"/leaderboards/global?limit=50":"/leaderboards/games/"+encodeURIComponent(gameId)+"?limit=50"),
        currentUser ? request("/leaderboards/me?gameId="+encodeURIComponent(gameId)).catch(()=>null) : Promise.resolve(null)
      ]);
      const entries=result.entries||[];
      const positionCard = !currentUser
        ? "<section class='leaderboard-position guest'><strong>Playing as a guest?</strong><p>Sign in to save your points and see your personal place in the standings. Guest play stays open.</p></section>"
        : !position || position.rank===null
          ? "<section class='leaderboard-position'><span class='leaderboard-position-kicker'>YOUR PLACE</span><strong>Not ranked yet</strong><p>Complete a challenge in this category to enter the standings.</p></section>"
          : "<section class='leaderboard-position'><div><span class='leaderboard-position-kicker'>YOUR PLACE</span><strong>#"+Number(position.rank).toLocaleString()+" <small>of "+Number(position.totalPlayers).toLocaleString()+"</small></strong><p>"+Number(position.points).toLocaleString()+" lifetime points</p></div><button type='button' class='leaderboard-jump' onclick='MfaAccounts.showMyPlace()'>Show my neighbourhood ↓</button></section>";
      const rows=entries.length?entries.map(e=>"<li class='leaderboard-row "+(currentUser&&e.username===currentUser.username?"is-you":"")+"' data-rank='"+e.rank+"'><span class='leaderboard-rank'>"+(e.rank<=3?["🥇","🥈","🥉"][e.rank-1]:("#"+e.rank))+"</span><span class='leaderboard-player'>"+escapeHtml(e.username)+(currentUser&&e.username===currentUser.username?" <b class='leaderboard-you'>YOU</b>":"")+"</span><strong>"+Number(e.points).toLocaleString()+" <small>pts</small></strong><span class='leaderboard-row-sub'>"+(e.gamesPlayed!==undefined?e.gamesPlayed+" games":(e.attempts||0)+" challenges")+"</span></li>").join(""):"<li class='leaderboard-empty'>No scores yet. Be the first to make your mark!</li>";
      const nearby=position?.nearby?.length? "<section class='leaderboard-nearby' id='leaderboard-nearby'><h3>Your neighbourhood</h3><p>The players just above and below you.</p><ol>"+position.nearby.map(e=>"<li class='"+(currentUser&&e.id===currentUser.id?"is-you":"")+"'><span>#"+e.rank+" · "+escapeHtml(e.username)+(currentUser&&e.id===currentUser.id?" (You)":"")+"</span><strong>"+Number(e.points).toLocaleString()+" pts</strong></li>").join("")+"</ol></section>":"";
      $("leaderboard-content").innerHTML=positionCard+"<div class='leaderboard-board-head'><div><h3>"+(gameId==="global"?"The Hall of Learners":escapeHtml($("leaderboard-game-select").selectedOptions[0]?.textContent||"Game standings"))+"</h3><p>Lifetime points. Endless progress. Every learner counts.</p></div><span class='leaderboard-live-dot'>LIVE STANDINGS</span></div><ol class='leaderboard-list'>"+rows+"</ol>"+nearby+"<p class='account-footnote'>Rankings use cumulative points earned from completed challenges. There is no maximum score or final level.</p>";
    } catch(e) { $("leaderboard-content").textContent=e.message; }
  }
  function showMyPlace() {
    const el=$("leaderboard-nearby");
    if(el)el.scrollIntoView({behavior:"smooth",block:"center"});
  }
  async function logout() {
    try { await request("/auth/logout", { method: "POST", body: "{}" }); } finally {
      currentUser = null; sessionToken = ""; sessionStorage.removeItem("mfa_session_token"); renderNav(); $("account-profile-modal").classList.add("hidden");
    }
  }
  async function deleteAccount() {
    if (!confirm("Permanently delete your account and all saved leaderboard scores? Device-local guest progress is not affected.")) return;
    await request("/players/me", { method: "DELETE" });
    currentUser = null; sessionToken = ""; sessionStorage.removeItem("mfa_session_token"); renderNav(); $("account-profile-modal").classList.add("hidden");
  }
  window.Auth = {
    open() { setMode("login"); $("auth-modal").classList.remove("hidden"); $("auth-username").focus(); },
    close() { $("auth-modal").classList.add("hidden"); },
  };
  window.MfaAccounts = {
    openLeaderboard, showMyPlace, closeLeaderboard() { $("leaderboard-modal").classList.add("hidden"); }, closeProfile() { $("account-profile-modal").classList.add("hidden"); },
    logout, deleteAccount, submitAttempt, onGameEvent, refreshSession,
  };
  document.addEventListener("DOMContentLoaded", () => {
    $("auth-mode-toggle")?.addEventListener("click", () => setMode(mode === "login" ? "register" : "login"));
    $("leaderboard-game-select")?.addEventListener("change", openLeaderboard);
    $("auth-form")?.addEventListener("submit", async event => {
      event.preventDefault();
      const message = $("auth-message");
      message.textContent = "Please wait…";
      $("auth-submit").disabled = true;
      const username = $("auth-username").value.trim();
      const password = $("auth-password").value;
      try {
        const result = mode === "register"
          ? await request("/auth/register", { method: "POST", body: JSON.stringify({ username, email: $("auth-email").value, password }) })
          : await request("/auth/login", { method: "POST", body: JSON.stringify({ identifier: username, password }) });
        if (!result.sessionToken) throw new Error("The server did not return a session. Please try again.");
        sessionToken = result.sessionToken;
        sessionStorage.setItem("mfa_session_token", sessionToken);
        currentUser = result.user; renderNav(); Auth.close(); $("auth-form").reset();
        if (mode === "register") setMode("login");
        if (typeof ResearchConsent !== "undefined" && ResearchConsent.get() === null) ResearchConsent.open();
        loadPlayerStats().catch(()=>null);
      } catch (e) {
        message.textContent = e.message === "Failed to fetch"
          ? "Cannot reach the account service. Check your connection and try again."
          : (e.message || "Something went wrong. Please try again.");
      } finally {
        $("auth-submit").disabled = false;
      }
    });
    refreshSession().then(()=>loadPlayerStats().catch(()=>null));
  });
})();
