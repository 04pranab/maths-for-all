/* =============================================================
   RESEARCH CONSENT
   Strict opt-in gate for all research-style analytics.
   ============================================================= */
const ResearchConsent = (function () {
  const KEY = 'mfa_research_consent_v1';
  const ANALYTICS_KEY = 'mfa_analytics_v1';
  let returnFocus = null;

  function focusFirst(selector) {
    const modal = document.querySelector(selector);
    if (!modal) return;
    const target = modal.querySelector('input, button, a, [tabindex]:not([tabindex="-1"])');
    if (target) setTimeout(() => target.focus(), 0);
  }

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
    returnFocus = document.activeElement;
    render();
    document.getElementById('research-consent-modal').classList.remove('hidden');
    focusFirst('#research-consent-modal');
  }

  function close() {
    const modal = document.getElementById('research-consent-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
    returnFocus = null;
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
        ${value ? '<button class="consent-close" onclick="ResearchConsent.close()" aria-label="Close research privacy dialog">×</button>' : ''}
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
        <a class="consent-policy" href="docs/v3/research-data-policy.html" target="_blank" rel="noopener">Read the full research data and collection policy</a>
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
  const API = '/api/auth';
  let currentUser = null;
  let authReturnFocus = null;
  let profileReturnFocus = null;
  let pendingMessage = '';

  async function request(path, options = {}) {
    const response = await fetch(API + path, {
      credentials: 'same-origin',
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Unable to complete the request.');
    return payload;
  }

  function account() { return currentUser; }
  function isLoggedIn() { return !!currentUser; }

  function clearAuthQuery() {
    const url = new URL(window.location.href);
    url.searchParams.delete('verify');
    url.searchParams.delete('reset');
    window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
  }

  function open(mode) {
    authReturnFocus = document.activeElement;
    render(mode || 'login');
    document.getElementById('auth-modal').classList.remove('hidden');
    setTimeout(() => (document.querySelector('#auth-modal input') || document.querySelector('#auth-modal button:not(.consent-close)'))?.focus(), 0);
  }

  function close() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    if (authReturnFocus && typeof authReturnFocus.focus === 'function') authReturnFocus.focus();
    authReturnFocus = null;
  }

  function render(mode, message = '') {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    if (mode === 'reset') {
      modal.innerHTML = `
        <div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">
          <button class="consent-close" onclick="Auth.close()" aria-label="Close">×</button>
          <div class="consent-icon">🔑</div>
          <h2 id="auth-title">Reset your password</h2>
          <p class="consent-lead">Enter your account email. If it is registered, we will send a reset link.</p>
          <form onsubmit="return Auth.requestReset(event)">
            <label>Email<input id="auth-reset-email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
            <p id="auth-error" class="auth-error" role="alert">${Utils.escapeHtml(message)}</p>
            <button class="consent-btn primary" type="submit">Send reset link</button>
          </form>
          <button class="btn-progress close" type="button" onclick="Auth.open('login')">Back to login</button>
        </div>`;
      return;
    }

    if (mode === 'reset-confirm') {
      modal.innerHTML = `
        <div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">
          <button class="consent-close" onclick="Auth.close()" aria-label="Close">×</button>
          <div class="consent-icon">🔐</div>
          <h2 id="auth-title">Choose a new password</h2>
          <p class="consent-lead">Use at least 8 characters. The reset link can only be used once.</p>
          <form onsubmit="return Auth.confirmReset(event)">
            <label>New password<input id="auth-new-password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required></label>
            <label>Confirm password<input id="auth-new-password-confirm" type="password" autocomplete="new-password" minlength="8" maxlength="128" required></label>
            <p id="auth-error" class="auth-error" role="alert">${Utils.escapeHtml(message)}</p>
            <button class="consent-btn primary" type="submit">Change password</button>
          </form>
        </div>`;
      return;
    }

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
        ${message ? '<p class="consent-note"><strong>' + Utils.escapeHtml(message) + '</strong></p>' : ''}

        <form onsubmit="return Auth.submit(event, '${login ? 'login' : 'signup'}')">
          ${!login ? `
            <label>Username<input id="auth-username" type="text" autocomplete="username" minlength="3" maxlength="30" required placeholder="Choose a username"></label>
            <label>Email<input id="auth-email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
            <label>Password<input id="auth-password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required placeholder="At least 8 characters"></label>
            <label>Confirm password<input id="auth-confirm-password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required placeholder="Enter the password again"></label>
          ` : `
            <label>Username or email<input id="auth-username" type="text" autocomplete="username" required placeholder="Username or email"></label>
            <label>Password<input id="auth-password" type="password" autocomplete="current-password" minlength="8" maxlength="128" required placeholder="Your password"></label>
          `}
          <p id="auth-error" class="auth-error" role="alert"></p>
          <button class="consent-btn primary" type="submit">${login ? 'Log in' : 'Create account'}</button>
        </form>

        ${login ? `
          <button class="auth-link" type="button" onclick="Auth.open('reset')">Forgot password?</button>
          <button class="auth-link" type="button" onclick="Auth.resendVerification()">Resend verification email</button>
        ` : ''}

        <div class="auth-divider"><span>or</span></div>
        <button class="google-auth-btn" type="button" onclick="Auth.googleSignIn()">
          <span class="google-mark" aria-hidden="true">G</span>
          Continue with Google
        </button>
        <p class="auth-google-note">Google sign-in is reserved for the production identity-provider integration.</p>
        <p class="consent-note"><strong>Privacy:</strong> account information is separate from research data. Signing in does not grant research consent.</p>
      </div>`;
  }

  async function submit(event, mode) {
    event.preventDefault();
    const error = document.getElementById('auth-error');
    error.textContent = '';
    try {
      const identifier = document.getElementById('auth-username').value.trim();
      if (!identifier) throw new Error('Enter your username or email.');

      if (mode === 'signup') {
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        const confirmPassword = document.getElementById('auth-confirm-password').value;
        if (password !== confirmPassword) throw new Error('The passwords do not match.');
        await request('/register', {
          method: 'POST',
          body: JSON.stringify({ username: identifier, email, password })
        });
        close();
        pendingMessage = 'Account created. Check your email and verify your address before logging in.';
        render('login', pendingMessage);
        pendingMessage = '';
        document.getElementById('auth-modal').classList.remove('hidden');
        setTimeout(() => document.querySelector('#auth-modal input')?.focus(), 0);
        return false;
      }

      const password = document.getElementById('auth-password').value;
      const result = await request('/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });
      currentUser = result.user;
      close();
      renderAccountButton();
      if (ResearchConsent.get() === null) ResearchConsent.open();
    } catch (e) {
      error.textContent = e.message || 'Unable to continue.';
    }
    return false;
  }

  async function resendVerification() {
    const input = document.getElementById('auth-username');
    const error = document.getElementById('auth-error');
    if (!input || !error) return;
    const identifier = input.value.trim();
    if (!identifier) {
      error.textContent = 'Enter your username or email first.';
      return;
    }
    try {
      const result = await request('/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ identifier })
      });
      error.textContent = result.message;
    } catch (e) {
      error.textContent = e.message || 'Unable to resend the verification email.';
    }
  }

  async function requestReset(event) {
    event.preventDefault();
    const error = document.getElementById('auth-error');
    try {
      const result = await request('/password-reset/request', {
        method: 'POST',
        body: JSON.stringify({ email: document.getElementById('auth-reset-email').value.trim() })
      });
      error.textContent = result.message;
    } catch (e) {
      error.textContent = e.message || 'Unable to request a password reset.';
    }
    return false;
  }

  async function confirmReset(event) {
    event.preventDefault();
    const error = document.getElementById('auth-error');
    const password = document.getElementById('auth-new-password').value;
    const confirmPassword = document.getElementById('auth-new-password-confirm').value;
    if (password !== confirmPassword) {
      error.textContent = 'The passwords do not match.';
      return false;
    }

    const token = new URL(window.location.href).searchParams.get('reset');
    try {
      await request('/password-reset/confirm', {
        method: 'POST',
        body: JSON.stringify({ token, password })
      });
      clearAuthQuery();
      pendingMessage = 'Your password was changed. You can now log in.';
      open('login');
    } catch (e) {
      error.textContent = e.message || 'Unable to reset the password.';
    }
    return false;
  }

  async function handleAuthLink() {
    const url = new URL(window.location.href);
    const googleResult = url.searchParams.get('google');
    if (googleResult === 'success') {
      clearAuthQuery();
      pendingMessage = 'Google sign-in completed. Your account is ready.';
      open('login');
      return;
    }
    if (googleResult === 'error') {
      clearAuthQuery();
      pendingMessage = 'Google sign-in could not be completed. Please try again.';
      open('login');
      return;
    }

    const verifyToken = url.searchParams.get('verify');
    const resetToken = url.searchParams.get('reset');

    if (verifyToken) {
      try {
        await request('/verify-email', { method: 'POST', body: JSON.stringify({ token: verifyToken }) });
        clearAuthQuery();
        pendingMessage = 'Your email is verified. You can now log in.';
      } catch (e) {
        clearAuthQuery();
        pendingMessage = e.message || 'This verification link is invalid or expired.';
      }
      open('login');
      return;
    }

    if (resetToken) {
      open('reset-confirm');
    }
  }

  function googleSignIn() {
    window.location.assign('/api/auth/google/start');
  }

  function renderAccountButton() {
    const el = document.getElementById('auth-actions');
    if (!el) return;

    if (!isLoggedIn()) {
      el.innerHTML = `
        <button class="nav-policy" onclick="ResearchConsent.showPolicy()" aria-label="Privacy and research data policy">Privacy &amp; data</button>
        <button class="nav-login" onclick="Auth.open('login')">Log in</button>`;
      return;
    }

    const username = currentUser.username || 'Learner';
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
          <div class="account-summary-email">${Utils.escapeHtml(currentUser.email || '')}</div>
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

  async function logout() {
    try { await request('/logout', { method: 'POST', body: '{}' }); } catch {}
    currentUser = null;
    closeAccountMenu();
    renderAccountButton();
  }

  function openProfile() {
    if (!currentUser) return;
    profileReturnFocus = document.activeElement;
    const modal = document.getElementById('account-profile-modal');
    if (!modal) return;
    const memberDate = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Not available';
    modal.innerHTML = `
      <div class="progress-box" role="dialog" aria-modal="true" aria-labelledby="account-profile-title">
        <button class="consent-close" onclick="Auth.closeProfile()" aria-label="Close account information">×</button>
        <div class="consent-icon">👤</div>
        <h2 id="account-profile-title" class="modal-title">Account information</h2>
        <div class="progress-grid">
          <div class="progress-stat"><span class="stat-num">${Utils.escapeHtml(currentUser.username)}</span><span class="stat-label">Username</span></div>
          <div class="progress-stat"><span class="stat-num">${Utils.escapeHtml(currentUser.email)}</span><span class="stat-label">Email</span></div>
          <div class="progress-stat"><span class="stat-num">${currentUser.emailVerified ? 'Verified' : 'Unverified'}</span><span class="stat-label">Email status</span></div>
          <div class="progress-stat"><span class="stat-num">${memberDate}</span><span class="stat-label">Member since</span></div>
        </div>
        <p class="progress-intro">Research participation is controlled separately under Privacy &amp; research.</p>
        <div class="progress-actions">
          <button class="btn-progress close" onclick="Auth.closeProfile()">Close</button>
        </div>
      </div>`;
    modal.classList.remove('hidden');
    setTimeout(() => modal.querySelector('button')?.focus(), 0);
  }

  function closeProfile() {
    const modal = document.getElementById('account-profile-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    if (profileReturnFocus && typeof profileReturnFocus.focus === 'function') profileReturnFocus.focus();
    profileReturnFocus = null;
  }

  async function init() {
    renderAccountButton();
    try {
      const result = await request('/me');
      currentUser = result.user || null;
    } catch {
      currentUser = null;
    }
    renderAccountButton();
    if (currentUser && ResearchConsent.get() === null) ResearchConsent.open();
    if (!currentUser) {
      if (pendingMessage) {
        const message = pendingMessage;
        pendingMessage = '';
        open('login');
        render('login', message);
        document.getElementById('auth-modal').classList.remove('hidden');
        setTimeout(() => document.querySelector('#auth-modal input')?.focus(), 0);
      } else {
        await handleAuthLink();
      }
    }
  }

  return {
    open, close, submit, googleSignIn, logout, isLoggedIn, init,
    toggleAccountMenu, closeAccountMenu, renderAccountButton,
    openProfile, closeProfile, account, resendVerification, requestReset, confirmReset
  };
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


/* =============================================================
   KEYBOARD ACCESSIBILITY
   Escape closes dismissible overlays. Initial research consent
   remains mandatory until an explicit Yes or No choice exists.
   Tab and Shift+Tab stay inside the active modal.
   ============================================================= */
document.addEventListener('keydown', (event) => {
  const visible = [...document.querySelectorAll('.modal-overlay:not(.hidden)')];
  const modal = visible[visible.length - 1];

  if (modal && event.key === 'Escape') {
    if (modal.id === 'research-consent-modal' && ResearchConsent.get() === null) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    if (modal.id === 'auth-modal' && typeof Auth !== 'undefined') Auth.close();
    else if (modal.id === 'research-consent-modal') ResearchConsent.close();
    else if (modal.id === 'account-profile-modal' && typeof Auth !== 'undefined' && typeof Auth.closeProfile === 'function') Auth.closeProfile();
    else if (typeof Progress !== 'undefined' && typeof Progress.close === 'function') Progress.close();
    return;
  }

  if (!modal || event.key !== 'Tab') return;

  const focusable = [...modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.offsetParent !== null);

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !document.querySelector('.modal-overlay:not(.hidden)') && typeof Auth !== 'undefined') {
    Auth.closeAccountMenu();
    if (typeof Navigation !== 'undefined') Navigation.closeMenu();
  }
});
