/* Research is not collected in this release. Keep this no-op API so games need no changes. */
const ResearchEventGateway = (() => {
  const KEY = "mfa_analytics_v1";
  function record() { return false; }
  function read() { return []; }
  function clear() {
    try { localStorage.removeItem(KEY); } catch {}
  }
  async function flush() { return false; }
  return { record, read, clear, flush };
})();
if (typeof window !== "undefined") window.ResearchEventGateway = ResearchEventGateway;
