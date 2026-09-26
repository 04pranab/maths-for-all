/* =============================================================
   RESEARCH EVENT GATEWAY
   Single consent-aware boundary for all research-style events.
   ============================================================= */
const ResearchEventGateway = (function () {
  const KEY = 'mfa_analytics_v1';
  const MAX_EVENTS = 1500;
  let events = null;

  function consentAllowed() {
    return typeof ResearchConsent !== 'undefined' && ResearchConsent.isAllowed();
  }

  function load() {
    if (events) return events;
    try {
      const raw = localStorage.getItem(KEY);
      events = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(events)) events = [];
    } catch (e) {
      events = [];
    }
    return events;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(events || []));
      return true;
    } catch (e) {
      return false;
    }
  }

  function validString(value, max) {
    return typeof value === 'string' && value.length > 0 && value.length <= max;
  }

  function validDetail(detail) {
    return detail === undefined || (
      detail !== null &&
      typeof detail === 'object' &&
      !Array.isArray(detail)
    );
  }

  function record(category, action, detail = {}) {
    if (!consentAllowed()) return false;
    if (!validString(category, 64) || !validString(action, 64) || !validDetail(detail)) return false;

    const list = load();
    list.push({
      ts: Date.now(),
      category,
      action,
      detail
    });

    if (list.length > MAX_EVENTS) {
      list.splice(0, list.length - MAX_EVENTS);
    }

    save();
    return true;
  }

  function read() {
    if (!consentAllowed()) return [];
    return load().slice();
  }

  function clear() {
    events = [];
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  return { record, read, clear };
})();
