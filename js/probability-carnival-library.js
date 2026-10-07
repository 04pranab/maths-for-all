window.ProbabilityCarnivalLibrary = (() => {
  function createBag(sunCount = 3, moonCount = 1) {
    return [
      ...Array.from({ length: sunCount }, () => "sun"),
      ...Array.from({ length: moonCount }, () => "moon")
    ];
  }
  function draw(bag) {
    return bag[Math.floor(Math.random() * bag.length)];
  }
  return { createBag, draw };
})();