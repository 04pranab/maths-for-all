/* Optional account and leaderboard client. Guest play is never gated. */
(() => {
  const API = "https://maths-for-all-api.ompranabmohanty.workers.dev/api";
  let mode = "login";
  let currentUser = null;
  let quizCorrect = 0, quizTotal = 0, quizStartedAt = 0;
  const $ = id => document.getElementById(id);
  const request = async (path, options = {}) => {
    const response = await fetch(API + path, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "The account service is unavailable.");
    return data;
  };
  function setMode(next) {
    mode = next;
    $("auth-modal-title").textContent = mode === "login" ? "Sign in" : "Create your account";
    $("auth-email-label").hidden = mode !== "register";
    $("auth-email").hidden = mode !== "register";
    $("auth-email").required = mode === "register";
    $("auth-submit").textContent = mode === "login" ? "Sign in" : "Create account";
    $("auth-mode-toggle").textContent = mode === "login" ? "New here? Create an account" : "Already have an account? Sign in";
    $("auth-password").autocomplete = mode === "login" ? "current-password" : "new-password";
    $("auth-message").textContent = "";
  }
  function renderNav() {
    const button = $("account-nav-button");
    if (button) button.textContent = currentUser ? "👤 " + currentUser.username : "Sign in";
    if (button) button.onclick = () => currentUser ? openProfile() : Auth.open();
  }
  async function refreshSession() {
    if (window.location.origin !== "https://04pranab.github.io") { currentUser = null; renderNav(); return; }
    try {
      const result = await request("/auth/me");
      currentUser = result.authenticated ? result.user : null;
    } catch { currentUser = null; }
    renderNav();
  }
  async function openProfile() {
    if (!currentUser) return Auth.open();
    $("account-profile-copy").textContent = "Signed in as " + currentUser.username + ". Your email address is private.";
    $("account-profile-stats").textContent = "Loading your saved scores…";
    $("account-profile-modal").classList.remove("hidden");
    try {
      const stats = await request("/players/me/stats");
      const rows = stats.scores.map(s => "<li>" + escapeHtml(s.game_id) + ": <strong>" + s.points + "/1000</strong></li>").join("");
      $("account-profile-stats").innerHTML = "<p><strong>" + stats.totalPoints + " / " + stats.maximumPoints + "</strong> total points</p><ul>" + (rows || "<li>No saved scores yet. Complete a game to begin.</li>") + "</ul>";
    } catch (e) { $("account-profile-stats").textContent = e.message; }
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
  async function submitAttempt(gameId, scorePercent, durationSeconds, attemptId) {
    if (!currentUser) return { saved: false, reason: "guest" };
    const id = attemptId || (crypto.randomUUID ? crypto.randomUUID() : "attempt_" + Date.now() + "_" + Math.random().toString(36).slice(2));
    return request("/games/" + encodeURIComponent(gameId) + "/attempts", {
      method: "POST",
      body: JSON.stringify({ attemptId: id, scorePercent, durationSeconds }),
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
        submitAttempt("arithmetic-quiz", accuracy, Math.max(1, Math.round((Date.now() - quizStartedAt) / 1000)))
          .catch(error => console.warn("Could not save quiz score:", error.message));
      }
      return;
    }
    const map = {
      "race:round_complete": { game: "math-racing", score: () => {
        const total = Number(detail.correct || 0) + Number(detail.wrong || 0);
        return total ? (Number(detail.correct || 0) / total) * 100 : 0;
      }, duration: () => Number(detail.timer || 1) },
      "sudoku:puzzle_solved": { game: "sudoku", score: () => 100, duration: () => 1 },
      "shape:level_complete": { game: "shape-fitting", score: () => 100, duration: () => Number(detail.seconds || 1) },
      "slab:round_complete": { game: "slab-maths", score: () => 100, duration: () => 1 },
      "shape_architect:complete": { game: "shape-architect", score: () => 100, duration: () => Number(detail.time || 1) },
      "fraction_bakery:level_complete": { game: "fraction-bakery", score: () => 100, duration: () => Math.max(1, Math.round(Number(detail.timeMs || 1000) / 1000)) },
      "number_maze:complete": { game: "number-maze", score: () => 100, duration: () => 1 },
      "little_shop:sale_complete": { game: "little-shop", score: () => Math.min(100, Math.max(0, Number(detail.customerNumber || 1))), duration: () => 1 },
    };
    const item = map[category + ":" + action];
    if (!item) return;
    submitAttempt(item.game, item.score(), Math.min(14400, Math.max(1, Math.round(item.duration()))))
      .then(() => { if (item.game === "math-racing") openLeaderboard(); })
      .catch(error => console.warn("Could not save Maths For All score:", error.message));
  }
  async function openLeaderboard() {
    $("leaderboard-modal").classList.remove("hidden");
    $("leaderboard-content").textContent = "Loading the leaderboard…";
    try {
      const result = await request("/leaderboards/global?limit=50");
      if (!result.entries.length) {
        $("leaderboard-content").innerHTML = "<p>No scores yet. Be the first to complete a challenge!</p>";
        return;
      }
      $("leaderboard-content").innerHTML = "<ol class='account-ranking'>" + result.entries.map(e => "<li><span>" + e.rank + ". " + escapeHtml(e.username) + "</span><strong>" + e.points + " pts</strong><small>" + e.gamesPlayed + " games</small></li>").join("") + "</ol><p class='account-footnote'>Maximum: " + result.maximumPoints + " points. Only public usernames and scores appear here.</p>";
    } catch (e) { $("leaderboard-content").textContent = e.message; }
  }
  async function logout() {
    try { await request("/auth/logout", { method: "POST", body: "{}" }); } finally {
      currentUser = null; renderNav(); $("account-profile-modal").classList.add("hidden");
    }
  }
  async function deleteAccount() {
    if (!confirm("Permanently delete your account and all saved leaderboard scores? Device-local guest progress is not affected.")) return;
    await request("/players/me", { method: "DELETE" });
    currentUser = null; renderNav(); $("account-profile-modal").classList.add("hidden");
  }
  window.Auth = {
    open() { setMode("login"); $("auth-modal").classList.remove("hidden"); $("auth-username").focus(); },
    close() { $("auth-modal").classList.add("hidden"); },
  };
  window.MfaAccounts = {
    openLeaderboard, closeLeaderboard() { $("leaderboard-modal").classList.add("hidden"); },
    logout, deleteAccount, submitAttempt, onGameEvent, refreshSession,
  };
  document.addEventListener("DOMContentLoaded", () => {
    $("auth-mode-toggle")?.addEventListener("click", () => setMode(mode === "login" ? "register" : "login"));
    $("auth-form")?.addEventListener("submit", async event => {
      event.preventDefault();
      const message = $("auth-message");
      message.textContent = "Please wait…";
      const username = $("auth-username").value.trim();
      const password = $("auth-password").value;
      try {
        const result = mode === "register"
          ? await request("/auth/register", { method: "POST", body: JSON.stringify({ username, email: $("auth-email").value, password }) })
          : await request("/auth/login", { method: "POST", body: JSON.stringify({ identifier: username, password }) });
        currentUser = result.user; renderNav(); Auth.close(); $("auth-form").reset();
        if (mode === "register") setMode("login");
      } catch (e) { message.textContent = e.message; }
    });
    refreshSession();
  });
})();
