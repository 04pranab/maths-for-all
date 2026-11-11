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
  async function openProfile() {
    if (!currentUser) return Auth.open();
    $("account-profile-copy").textContent = "Your public name is " + currentUser.username + ". Your email and account details stay private.";
    $("account-profile-stats").innerHTML = "<p class='profile-loading'>Loading your player card…</p>";
    $("account-profile-modal").classList.remove("hidden");
    try {
      const stats = await request("/players/me/stats");
      const earned = (stats.badges || []).reduce((n, game) => n + game.earned.length, 0);
      const gameCards = (stats.badges || []).map(game => {
        const ratio = game.maximum ? Math.min(100, Math.round(game.points / game.maximum * 100)) : 0;
        const medals = game.earned.length
          ? game.earned.map(b => "<span class='profile-badge' title='" + escapeHtml(b.description) + "'><i>" + b.icon + "</i><span>" + escapeHtml(b.title) + "</span></span>").join("")
          : "<span class='profile-locked'>Complete a challenge to earn your first badge</span>";
        return "<article class='profile-game-card'><div class='profile-game-head'><strong>" + escapeHtml(game.gameName) + "</strong><b>" + game.points + " / " + game.maximum + "</b></div><div class='profile-meter' role='progressbar' aria-label='" + escapeHtml(game.gameName) + " mastery' aria-valuenow='" + ratio + "' aria-valuemin='0' aria-valuemax='100'><span style='width:" + ratio + "%'></span></div><small>" + game.attempts + " recorded attempts · " + ratio + "% mastery</small><div class='profile-badges'>" + medals + "</div></article>";
      }).join("");
      $("account-profile-stats").innerHTML =
        "<section class='profile-hero'><div><span class='profile-kicker'>PLAYER PROFILE</span><h3>" + escapeHtml(currentUser.username) + "</h3><p>Learning is the achievement. Points are the record.</p></div><div class='profile-avatar' aria-hidden='true'>" + escapeHtml(currentUser.username.slice(0,1).toUpperCase()) + "</div></section>" +
        "<section class='profile-summary'><div><strong>" + stats.totalPoints.toLocaleString() + "</strong><span>Total points</span></div><div><strong>" + stats.gamesPlayed + " / 10</strong><span>Games played</span></div><div><strong>" + earned + "</strong><span>Badges earned</span></div></section>" +
        "<div class='profile-section-title'><h3>Game mastery</h3><p>Each game has its own challenge-weighted points.</p></div>" +
        "<div class='profile-game-grid'>" + (gameCards || "<p>Complete a game to start building your profile.</p>") + "</div>" +
        "<p class='profile-privacy-note'>Only your username, best scores and earned badges appear on public leaderboards. Email and research data are not shown on this profile.</p>";
    } catch (e) { $("account-profile-stats").textContent = e.message; }
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
    const level = Math.max(1, Math.min(100, Number(detail.level || detail.round || detail.customerNumber || 1)));
    const map = {
      "race:round_complete": { game:"math-racing", score:() => { const total=Number(detail.correct||0)+Number(detail.wrong||0); return total?(Number(detail.correct||0)/total)*100:0; }, duration:() => Number(detail.timer||3), difficulty:detail.difficulty||"easy" },
      "sudoku:puzzle_solved": { game:"sudoku", score:() => 100, duration:() => Number(detail.seconds||3), difficulty:detail.difficulty||"easy", hintsUsed:Number(detail.hintsUsed||0) },
      "shape:level_complete": { game:"shape-fitting", score:() => 100, duration:() => Number(detail.seconds||3), difficulty:level>=70?"hard":level>=30?"medium":"easy", level },
      "slab:round_complete": { game:"slab-maths", score:() => 100, duration:() => Number(detail.seconds||3), difficulty:level>=20?"hard":level>=8?"medium":"easy", level, hintsUsed:Number(detail.hintsUsed||0) },
      "shape_architect:complete": { game:"shape-architect", score:() => 100, duration:() => Number(detail.time||3), difficulty:level>=70?"hard":level>=30?"medium":"easy", level },
      "fraction_bakery:level_complete": { game:"fraction-bakery", score:() => 100, duration:() => Math.max(3,Math.round(Number(detail.timeMs||3000)/1000)), difficulty:level>=70?"hard":level>=25?"medium":"easy", level },
      "number_maze:complete": { game:"number-maze", score:() => 100, duration:() => Number(detail.seconds||3), difficulty:detail.difficulty||"gentle", level },
      "little_shop:sale_complete": { game:"little-shop", score:() => Math.min(100,Math.max(0,Number(detail.accuracy||100))), duration:() => Number(detail.seconds||3), difficulty:level>=20?"hard":level>=8?"medium":"easy", level },
    };
    const item = map[category + ":" + action];
    if (!item) return;
    const meta = { difficulty:item.difficulty, level:item.level||level, hintsUsed:item.hintsUsed||0, mistakes:Number(detail.mistakes||0) };
    submitAttempt(item.game,item.score(),Math.min(14400,Math.max(3,Math.round(item.duration()))),null,meta)
      .then(() => { if (item.game === "math-racing") openLeaderboard(); })
      .catch(error => console.warn("Could not save Maths For All score:",error.message));
  }
  async function openLeaderboard() {
    $("leaderboard-modal").classList.remove("hidden");
    $("leaderboard-content").textContent = "Loading the leaderboard…";
    try {
      const gameId = $("leaderboard-game-select")?.value || "global";
      const result = await request(gameId === "global" ? "/leaderboards/global?limit=50" : "/leaderboards/games/" + encodeURIComponent(gameId) + "?limit=50");
      if (!result.entries.length) {
        $("leaderboard-content").innerHTML = "<p>No scores here yet. Complete a challenge to start this leaderboard!</p>";
        return;
      }
      $("leaderboard-content").innerHTML = "<ol class='account-ranking'>" + result.entries.map(e => "<li><span>" + e.rank + ". " + escapeHtml(e.username) + "</span><strong>" + e.points + " pts</strong><small>" + (e.gamesPlayed !== undefined ? e.gamesPlayed + " games" : "Best game score") + "</small></li>").join("") + "</ol>" + (result.maximumPoints ? "<p class='account-footnote'>Maximum: " + result.maximumPoints + " points. Only public usernames and scores appear here.</p>" : "");
    } catch (e) { $("leaderboard-content").textContent = e.message; }
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
    openLeaderboard, closeLeaderboard() { $("leaderboard-modal").classList.add("hidden"); }, closeProfile() { $("account-profile-modal").classList.add("hidden"); },
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
      } catch (e) {
        message.textContent = e.message === "Failed to fetch"
          ? "Cannot reach the account service. Check your connection and try again."
          : (e.message || "Something went wrong. Please try again.");
      } finally {
        $("auth-submit").disabled = false;
      }
    });
    refreshSession();
  });
})();
