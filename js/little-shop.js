(function () {
  let active = false;

  function init() {
    active = true;
    const status = document.getElementById('ls-status');
    if (status) status.textContent = 'Little Shop shell is open. The shopping activities will arrive in later steps.';
  }

  function stop() {
    active = false;
  }

  function isActive() {
    return active;
  }

  window.LittleShop = { init, stop, isActive };
})();
