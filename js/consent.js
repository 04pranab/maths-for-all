/* =============================================================
   RESEARCH CONSENT
   Strict opt-in gate for all research-style analytics.
   ============================================================= */
const ResearchConsent = (function () {
  const KEY = 'mfa_research_consent_v1';
  const ANALYTICS_KEY = 'mfa_analytics_v1';

  function get() {
    const value = localStorage.getItem(KEY);
    return value === 'yes' || value === 'no' ? value : null;
  }

  function isAllowed() {
    return get() === 'yes';
  }

  function purgeResearchData() {
    try { localStorage.removeItem(ANALYTICS_KEY); } catch (e) {}
  }

  function set(value) {
    if (value !== 'yes' && value !== 'no') return;
    localStorage.setItem(KEY, value);
    if (value === 'no') purgeResearchData();
    renderStatus();
  }

  function open() {
    render();
    document.getElementById('research-consent-modal').classList.remove('hidden');
  }

  function close() {
    document.getElementById('research-consent-modal').classList.add('hidden');
  }

  function renderStatus() {
    const el = document.getElementById('research-consent-status');
    if (!el) return;
    const value = get();
    el.textContent = value === 'yes'
      ? 'Research collection: allowed'
      : value === 'no'
        ? 'Research collection: off'
        : 'Research collection: not chosen';
  }

  function render() {
    const value = get();
    const modal = document.getElementById('research-consent-modal');
    if (!modal) return;
    modal.innerHTML = `
      <div class="consent-card" role="dialog" aria-modal="true" aria-labelledby="research-consent-title">
        <button class="consent-close" onclick="ResearchConsent.close()" aria-label="Close">×</button>
        <div class="consent-icon">🔐</div>
        <h2 id="research-consent-title">${value ? 'Research data preference' : 'Your research data choice'}</h2>
        <p class="consent-lead">Your account and your research choice are separate. We will never treat logging in as permission to collect research data.</p>

        <div class="consent-columns">
          <section>
            <h3>What we collect if you choose Yes</h3>
            <ul>
              <li>Game/module and event type</li>
              <li>Difficulty and learning state</li>
              <li>Correct/incorrect result and attempt count</li>
              <li>Response/event timing</li>
              <li>Game progress and completion events</li>
              <li>Technical event timestamp</li>
            </ul>
          </section>
          <section>
            <h3>What we do not collect as research data</h3>
            <ul>
              <li>Passwords or authentication secrets</li>
              <li>Phone numbers or precise location</li>
              <li>Contacts or private messages</li>
              <li>Camera, microphone, or files</li>
              <li>Advertising identifiers or browser fingerprinting</li>
              <li>Research events when you choose No</li>
            </ul>
          </section>
        </div>

        <p class="consent-note"><strong>No means no.</strong> If you choose No, research events are rejected and locally stored research events are removed. The games continue to work normally.</p>
        <p class="consent-note">You can change this preference at any time from <strong>Privacy &amp; research</strong>.</p>
        <div class="consent-actions">
          <button class="consent-btn primary" onclick="ResearchConsent.choose('yes')">✓ Allow research data collection</button>
          <button class="consent-btn secondary" onclick="ResearchConsent.choose('no')">✕ Do not allow research data collection</button>
        </div>
        <button class="consent-policy" onclick="ResearchConsent.showPolicy()">Read the full research data policy</button>
      </div>`;
  }

  function choose(value) {
    set(value);
    close();
    if (window.Progress && typeof Progress.render === 'function') Progress.render();
  }

  function showPolicy() {
    window.open('docs/v3/research-data-policy.html', '_blank', 'noopener');
  }

  function init() {
    // Legacy v2 analytics were created before explicit research consent.
    // They are removed unless the user has explicitly opted in.
    if (get() !== 'yes') purgeResearchData();
    renderStatus();
    if (window.Auth && Auth.isLoggedIn() && get() === null) open();
  }

  return { get, isAllowed, set, choose, open, close, showPolicy, init };
})();

/* =============================================================
   LOCAL ACCOUNT ACCESS
   Development-stage account shell for the static application.
   This is not a production authentication backend.
   ============================================================= */
const Auth = (function () {
  const ACCOUNT_KEY = 'mfa_local_account_v1';
  const SESSION_KEY = 'mfa_local_session_v1';

  function account() {
    try { return JSON.parse(localStorage.getItem(ACCOUNT_KEY)); }
    catch (e) { return null; }
  }

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === 'active' && !!account();
  }

  function hashPassword(password, salt) {
    if (!window.crypto || !window.crypto.subtle) {
      return Promise.reject(new Error('Secure browser cryptography is unavailable.'));
    }
    const data = new TextEncoder().encode(password + salt);
    return crypto.subtle.digest('SHA-256', data).then(buffer =>
      Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
    );
  }

  function open(mode) {
    render(mode || (account() ? 'login' : 'signup'));
    document.getElementById('auth-modal').classList.remove('hidden');
  }

  function close() {
    document.getElementById('auth-modal').classList.add('hidden');
  }

  function render(mode) {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    const login = mode !== 'signup';
    modal.innerHTML = `
      <div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button class="consent-close" onclick="Auth.close()" aria-label="Close">×</button>
        <div class="consent-icon">👤</div>
        <div class="auth-tabs" role="tablist" aria-label="Account access">
          <button class="auth-tab ${login ? 'active' : ''}" onclick="Auth.open('login')" role="tab" aria-selected="${login}">Log in</button>
          <button class="auth-tab ${!login ? 'active' : ''}" onclick="Auth.open('signup')" role="tab" aria-selected="${!login}">Sign up</button>
        </div>
        <h2 id="auth-title">${login ? 'Log in to Maths for All' : 'Create your Maths for All account'}</h2>
        <p class="consent-lead">${login ? 'Use your username and password to continue.' : 'Create your learner account with a username, email, and password.'}</p>

        <form onsubmit="return Auth.submit(event, '${login ? 'login' : 'signup'}')">
          ${!login ? `
            <label>Username<input id="auth-username" type="text" autocomplete="username" minlength="3" maxlength="30" required placeholder="Choose a username"></label>
            <label>Email<input id="auth-email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
            <label>Password<input id="auth-password" type="password" autocomplete="new-password" minlength="8" required placeholder="At least 8 characters"></label>
            <label>Confirm password<input id="auth-confirm-password" type="password" autocomplete="new-password" minlength="8" required placeholder="Enter the password again"></label>
          ` : `
            <label>Username<input id="auth-username" type="text" autocomplete="username" required placeholder="Your username"></label>
            <label>Password<input id="auth-password" type="password" autocomplete="current-password" minlength="8" required placeholder="Your password"></label>
          `}
          <p id="auth-error" class="auth-error" role="alert"></p>
          <button class="consent-btn primary" type="submit">${login ? 'Log in' : 'Create account'}</button>
        </form>

        <div class="auth-divider"><span>or</span></div>
        <button class="google-auth-btn" type="button" onclick="Auth.googleSignIn()">
          <span class="google-mark" aria-hidden="true">G</span>
          Continue with Google
        </button>
        <p class="auth-google-note">Google sign-in will connect to the production authentication service when the database-backed auth system is introduced.</p>
        ${!login ? '<p class="consent-note"><strong>Email verification:</strong> the account flow is designed for email verification, which will be enforced by the production database-backed authentication service. This local development flow does not send verification emails.</p>' : ''}
        <p class="consent-note"><strong>Privacy:</strong> account information is separate from research data. Signing in does not grant research consent.</p>
      </div>`;
  }

  async function submit(event, mode) {
    event.preventDefault();
    const username = document.getElementById('auth-username').value.trim();
    const error = document.getElementById('auth-error');
    error.textContent = '';

    try {
      if (!/^[A-Za-z0-9_]{3,30}$/.test(username)) {
        throw new Error('Username must be 3–30 characters using letters, numbers, or _.');
      }

      const existing = account();

      if (mode === 'signup') {
        const email = document.getElementById('auth-email').value.trim().toLowerCase();
        const password = document.getElementById('auth-password').value;
        const confirmPassword = document.getElementById('auth-confirm-password').value;

        if (password !== confirmPassword) throw new Error('The passwords do not match.');
        if (existing) throw new Error('A local account already exists on this device. Use Log in instead.');

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltText = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
        const hash = await hashPassword(password, saltText);

        localStorage.setItem(ACCOUNT_KEY, JSON.stringify({
          username,
          email,
          salt: saltText,
          passwordHash: hash,
          createdAt: new Date().toISOString()
        }));
      } else {
        const password = document.getElementById('auth-password').value;
        if (!existing || existing.username !== username) {
          throw new Error('No matching local account was found.');
        }
        const hash = await hashPassword(password, existing.salt);
        if (hash !== existing.passwordHash) throw new Error('The username or password is incorrect.');
      }

      sessionStorage.setItem(SESSION_KEY, 'active');
      close();
      renderAccountButton();
      if (ResearchConsent.get() === null) ResearchConsent.open();
    } catch (e) {
      error.textContent = e.message || 'Unable to continue.';
    }
    return false;
  }

  function googleSignIn() {
    const error = document.getElementById('auth-error');
    if (error) {
      error.textContent = 'Google sign-in will be enabled with the production authentication backend. No Google credentials are collected by this local development flow.';
    }
  }

  function renderAccountButton() {
    const el = document.getElementById('auth-actions');
    if (!el) return;

    if (!isLoggedIn()) {
      el.innerHTML = '<button class="nav-login" onclick="Auth.open(\'login\')">Log in</button>';
      return;
    }

    const current = account();
    const username = current && current.username ? current.username : 'Learner';
    const initial = username.charAt(0).toUpperCase();

    el.innerHTML = `
      <button class="nav-account-trigger" onclick="Auth.toggleAccountMenu()" aria-expanded="false" aria-controls="account-menu">
        <span class="nav-avatar">${initial}</span>
        <span class="nav-account-email">@${Utils.escapeHtml(username)}</span>
        <span aria-hidden="true">▾</span>
      </button>
      <div class="nav-account-menu hidden" id="account-menu">
        <div class="account-summary">
          <div class="account-summary-name">@${Utils.escapeHtml(username)}</div>
          <div class="account-summary-email">${Utils.escapeHtml(current && current.email ? current.email : 'Local account')}</div>
        </div>
        <button class="account-menu-item" onclick="Auth.openProfile(); Auth.closeAccountMenu()">👤 Account information</button>
        <button class="account-menu-item" onclick="Progress.open(); Auth.closeAccountMenu()">📊 My Progress</button>
        <button class="account-menu-item" onclick="ResearchConsent.open(); Auth.closeAccountMenu()">🔐 Privacy &amp; research</button>
        <button class="account-menu-item" onclick="Accessibility.changeFont(1); Auth.closeAccountMenu()">A+ Increase text size</button>
        <div class="account-menu-divider"></div>
        <button class="account-menu-item logout" onclick="Auth.logout()">Log out</button>
      </div>`;
  }

  function toggleAccountMenu() {
    const menu = document.getElementById('account-menu');
    const trigger = document.querySelector('.nav-account-trigger');
    if (!menu) return;
    const opening = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !opening);
    if (trigger) trigger.setAttribute('aria-expanded', String(opening));
  }

  function closeAccountMenu() {
    const menu = document.getElementById('account-menu');
    const trigger = document.querySelector('.nav-account-trigger');
    if (menu) menu.classList.add('hidden');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    closeAccountMenu();
    renderAccountButton();
  }

  function init() {
    renderAccountButton();
    if (isLoggedIn() && ResearchConsent.get() === null) ResearchConsent.open();
  }

  return { open, close, submit, googleSignIn, logout, isLoggedIn, init, toggleAccountMenu, closeAccountMenu, renderAccountButton };
})();

/* =============================================================
   PRIMARY NAVIGATION
   ============================================================= */
const Navigation = (function () {
  function closeMenu() {
    const menu = document.getElementById('nav-links');
    const toggle = document.getElementById('nav-menu-toggle');
    if (menu) menu.classList.remove('open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    }
  }

  function toggleMenu() {
    const menu = document.getElementById('nav-links');
    const toggle = document.getElementById('nav-menu-toggle');
    if (!menu) return;
    const opening = !menu.classList.contains('open');
    menu.classList.toggle('open', opening);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(opening));
      toggle.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
    }
  }

  function home() {
    Game.goHome();
    closeMenu();
  }

  function progress() {
    Progress.open();
    closeMenu();
  }

  function howToPlay() {
    closeMenu();
    if (typeof ControlsOverlay !== 'undefined') {
      ControlsOverlay.forceShow('quiz');
    }
  }

  return { closeMenu, toggleMenu, home, progress, howToPlay };
})();

document.addEventListener('click', (event) => {
  const account = document.getElementById('auth-actions');
  if (account && !account.contains(event.target) && typeof Auth !== 'undefined') {
    Auth.closeAccountMenu();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  ResearchConsent.init();
  Auth.init();
});
