window.ProbabilityCarnivalLibrary = (() => {
  function createBag(sunCount = 3, moonCount = 1) {
    return [
      ...Array.from({ length: sunCount }, () => "sun"),
      ...Array.from({ length: moonCount }, () => "moon")
    ];
  }

  function draw(bag) {
    if (!Array.isArray(bag) || bag.length === 0) {
      throw new Error("A probability machine needs at least one token.");
    }

    return bag[Math.floor(Math.random() * bag.length)];
  }

  function drawMany(bag, count) {
    const results = [];

    for (let i = 0; i < count; i += 1) {
      results.push(draw(bag));
    }

    return results;
  }

  function counts(results) {
    return results.reduce(
      (total, result) => {
        total[result] = (total[result] || 0) + 1;
        return total;
      },
      { sun: 0, moon: 0 }
    );
  }

  function dominant(count) {
    if (count.sun === count.moon) {
      return "equal";
    }

    return count.sun > count.moon ? "sun" : "moon";
  }

  function probability(tokens, result) {
    if (!tokens.length) {
      return 0;
    }

    return tokens.filter(token => token === result).length / tokens.length;
  }

  return {
    createBag,
    draw,
    drawMany,
    counts,
    dominant,
    probability
  };
})();
