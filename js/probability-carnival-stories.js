window.ProbabilityCarnivalStories = (() => {
  const stories = [
    {
      id: "curious-machine",
      title: "The Curious Machine",
      symbol: "🔭",
      kicker: "🔭 The Telescope Tent",
      type: "machine",
      description: "Step up to the glowing machine, make your call, and see whether your idea survives a burst of trials.",
      objective: "Notice how repeated trials can reveal a pattern without making every single result predictable.",
      learning: "A probability describes a chance. A short run can wobble, while a longer run often gives a clearer picture."
    },
    {
      id: "machine-builder",
      title: "The Machine Builder",
      symbol: "🧩",
      kicker: "🧩 The Builder Tent",
      type: "builder",
      description: "Design the machine yourself. Arrange the tokens, choose your prediction, then set it loose.",
      objective: "Connect the number of tokens to the chance of an outcome.",
      learning: "More tokens of one kind give that outcome a larger share of the machine, so its chance becomes greater."
    },
    {
      id: "mystery-tent",
      title: "The Mystery Tent",
      symbol: "🔎",
      kicker: "🔎 The Detective Tent",
      type: "mystery",
      description: "The machine is hiding backstage. Collect clues, crack the pattern, and open the mystery box.",
      objective: "Use evidence to make a reasoned inference, while remembering that evidence is not certainty.",
      learning: "Probability helps us reason about what is plausible. Evidence can support an idea without proving it from a small sample."
    },
    {
      id: "fairness-workshop",
      title: "The Fairness Workshop",
      symbol: "⚖️",
      kicker: "⚖️ The Repair Tent",
      type: "fairness",
      description: "Two carnival machines need checking. Find the balanced one and help make the fair choice.",
      objective: "Compare repeated evidence instead of trusting a single surprising result.",
      learning: "Fairness in a chance experiment means the possible outcomes have the same chance. A few trials can look uneven even when a machine is fair."
    }
  ];

  return { stories };
})();
