window.ProbabilityCarnivalStories = (() => {
  const stories = [
    {
      id: "curious-machine",
      title: "The Curious Machine",
      symbol: "🔭",
      kicker: "The observation tent",
      type: "machine",
      description: "Watch a machine with three suns and one moon. Predict first, then collect evidence.",
      objective: "Notice how repeated trials can reveal a pattern without making every single result predictable.",
      learning: "A probability describes a chance. A short run can wobble, while a longer run often gives a clearer picture."
    },
    {
      id: "machine-builder",
      title: "The Machine Builder",
      symbol: "🧩",
      kicker: "The building tent",
      type: "builder",
      description: "Build your own machine with eight tokens. Change the ingredients and see the chances change.",
      objective: "Connect the number of tokens to the chance of an outcome.",
      learning: "More tokens of one kind give that outcome a larger share of the machine, so its chance becomes greater."
    },
    {
      id: "mystery-tent",
      title: "The Mystery Tent",
      symbol: "🔎",
      kicker: "The evidence tent",
      type: "mystery",
      description: "A machine is hidden. Use its results as clues and decide what might be inside.",
      objective: "Use evidence to make a reasoned inference, while remembering that evidence is not certainty.",
      learning: "Probability helps us reason about what is plausible. Evidence can support an idea without proving it from a small sample."
    },
    {
      id: "fairness-workshop",
      title: "The Fairness Workshop",
      symbol: "⚖️",
      kicker: "The fairness tent",
      type: "fairness",
      description: "Compare two machines and investigate whether they really give equal chances.",
      objective: "Compare repeated evidence instead of trusting a single surprising result.",
      learning: "Fairness in a chance experiment means the possible outcomes have the same chance. A few trials can look uneven even when a machine is fair."
    }
  ];

  return { stories };
})();
