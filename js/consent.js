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
    window.open('docs/v3/RESEARCH_DATA_POLICY.md', '_blank', 'noopener');
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

  function open() {
    render();
    document.getElementById('auth-modal').classList.remove('hidden');
  }

  function close() {
    document.getElementById('auth-modal').classList.add('hidden');
  }

  function render() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.innerHTML = `
      <div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button class="consent-close" onclick="Auth.close()" aria-label="Close">×</button>
        <div class="consent-icon">👤</div>
        <h2 id="auth-title">${account() ? 'Log in to Maths for All' : 'Create your Maths for All account'}</h2>
        <p class="consent-lead">This PR provides the local account flow for the v2.5.0 milestone. It stores account credentials only on this device. A production server-side authentication service is a later PR.</p>
        <form onsubmit="return Auth.submit(event)">
          <label>Email<input id="auth-email" type="email" autocomplete="username" required placeholder="you@example.com"></label>
          <label>Password<input id="auth-password" type="password" autocomplete="current-password" minlength="8" required placeholder="At least 8 characters"></label>
          <label class="auth-new-row"><input id="auth-create" type="checkbox" ${account() ? '' : 'checked'}> Create a new local account</label>
          <p id="auth-error" class="auth-error" role="alert"></p>
          <button class="consent-btn primary" type="submit">Continue</button>
        </form>
        <p class="consent-note"><strong>Privacy:</strong> your email is account data, not research data. It is not written to the research event log.</p>
      </div>`;
  }

  async function submit(event) {
    event.preventDefault();
    const email = document.getElementById('auth-email').value.trim().toLowerCase();
    const password = document.getElementById('auth-password').value;
    const create = document.getElementById('auth-create').checked;
    const error = document.getElementById('auth-error');
    error.textContent = '';

    try {
      const existing = account();
      if (create) {
        if (existing) throw new Error('A local account already exists on this device. Uncheck Create a new local account to log in.');
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltText = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
        const hash = await hashPassword(password, saltText);
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ email, salt: saltText, passwordHash: hash }));
      } else {
        if (!existing || existing.email !== email) throw new Error('No matching local account was found.');
        const hash = await hashPassword(password, existing.salt);
        if (hash !== existing.passwordHash) throw new Error('The email or password is incorrect.');
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

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    renderAccountButton();
  }

  function renderAccountButton() {
    const el = document.getElementById('auth-actions');
    if (!el) return;
    el.innerHTML = isLoggedIn()
      ? '<button class="a11y-account-btn" onclick="ResearchConsent.open()">🔐 Privacy &amp; research</button><button class="a11y-account-btn" onclick="Auth.logout()">Log out</button>'
      : '<button class="a11y-account-btn" onclick="Auth.open()">🔐 Log in</button>';
  }

  function init() {
    renderAccountButton();
    if (isLoggedIn() && ResearchConsent.get() === null) ResearchConsent.open();
  }

  return { open, close, submit, logout, isLoggedIn, init };
})();

document.addEventListener('DOMContentLoaded', () => {
  ResearchConsent.init();
  Auth.init();
});
