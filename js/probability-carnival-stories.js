window.ProbabilityCarnivalStories = (() => {
  const stages = [
    { number: 1, name: "Probability intuition", range: "Levels 1–10", note: "Learn the language of chance by making quick predictions.", objective: "Decide whether an outcome is impossible, certain, likely, unlikely, or equally likely." },
    { number: 2, name: "Compare", range: "Levels 11–20", note: "Put two chances side by side and decide which is greater, smaller, or equal.", objective: "Compare chances before the machine gives you an answer." },
    { number: 3, name: "Build", range: "Levels 21–30", note: "Build machines with simple ratios and make the requested chance.", objective: "Change the token mix to construct a probability machine." },
    { number: 4, name: "Experiment", range: "Levels 31–40", note: "Run trials, collect results, and compare what happened.", objective: "Use experimental results as evidence rather than expecting every run to match perfectly." },
    { number: 5, name: "Randomness", range: "Levels 41–50", note: "Investigate short runs, longer runs, theoretical probability, and sample size.", objective: "Explain why random results can wobble and why more trials often give a clearer picture." },
    { number: 6, name: "Probability Detective", range: "Levels 51–60", note: "Use clues to uncover hidden machines and identify fair or unfair designs.", objective: "Infer a hidden configuration from evidence and explain your reasoning." }
  ];
  const intuitionScenarios = [
    ["A sealed machine has no Moon tokens.", "Moon appears.", "impossible"],
    ["A machine has only Sun tokens.", "Moon appears.", "impossible"],
    ["A bag has 7 blue tokens and 1 red token.", "Red appears.", "unlikely"],
    ["A bag has 1 blue token and 7 red tokens.", "Red appears.", "likely"],
    ["A bag has 4 blue tokens and 4 red tokens.", "Blue appears.", "equally likely"],
    ["A machine has only Moon tokens.", "Moon appears.", "certain"],
    ["A machine has only Sun tokens.", "Sun appears.", "certain"],
    ["A machine has 8 Sun tokens and 1 Moon token.", "Moon appears.", "unlikely"],
    ["A machine has 1 Sun token and 8 Moon tokens.", "Moon appears.", "likely"],
    ["A machine has 5 Sun tokens and 5 Moon tokens.", "Sun appears.", "equally likely"]
  ];
  const comparePairs = [
    [[3,1],[1,3],"sun"], [[1,3],[3,1],"moon"], [[2,2],[2,2],"equal"], [[4,2],[2,4],"sun"], [[2,4],[4,2],"moon"],
    [[3,3],[1,1],"equal"], [[5,1],[3,3],"sun"], [[1,5],[3,3],"moon"], [[2,2],[1,3],"sun"], [[1,3],[2,2],"moon"]
  ];
  const buildTargets = [[1,1,"equal"],[2,1,"sun"],[3,1,"sun"],[1,3,"moon"],[2,2,"equal"],[3,1,"sun"],[1,2,"moon"],[3,3,"equal"],[1,3,"moon"],[3,1,"sun"]];
  const experimentTrials = [5,10,20,5,10,20,5,10,20,20];
  const randomnessSamples = [[5,"short"],[20,"long"],[5,"short"],[20,"long"],[10,"medium"],[20,"long"],[5,"short"],[20,"long"],[10,"medium"],[20,"long"]];
  const mysteryConfigs = [[4,4,"fair"],[6,2,"sun"],[2,6,"moon"],[5,3,"sun"],[3,5,"moon"],[4,4,"fair"],[7,1,"sun"],[1,7,"moon"],[4,4,"fair"],[6,2,"sun"]];
  function buildLevels() {
    const levels = [];
    intuitionScenarios.forEach((item,index) => levels.push({id:index+1,stage:1,type:"intuition",title:"Chance check",prompt:item[0]+" What do you think about: "+item[1],scenario:item[0],outcome:item[1],choices:["impossible","unlikely","equally likely","likely","certain"],answer:item[2]}));
    comparePairs.forEach((item,index) => levels.push({id:11+index,stage:2,type:"compare",title:"Which chance wins?",prompt:"Compare the two machines. Choose which gives Sun the greater chance, Moon the greater chance, or whether they are equal.",machineA:item[0],machineB:item[1],choices:["A","equal","B"],answer:item[2]==="equal"?"equal":item[2]==="sun"?"A":"B"}));
    buildTargets.forEach((item,index) => levels.push({id:21+index,stage:3,type:"build",title:"Build "+item[0]+":"+item[1],prompt:"Build a machine with "+item[0]+" Sun token"+(item[0]===1?"":"s")+" and "+item[1]+" Moon token"+(item[1]===1?"":"s")+".",sun:item[0],moon:item[1],answer:item[2]}));
    experimentTrials.forEach((trials,index) => levels.push({id:31+index,stage:4,type:"experiment",title:"Run "+trials+" trials",prompt:"Predict which result will be more common, then run exactly "+trials+" trials.",trials,bag:["sun","sun","sun","moon"],answer:"sun"}));
    randomnessSamples.forEach((item,index) => levels.push({id:41+index,stage:5,type:"randomness",title:"What does the sample tell us?",prompt:"A 3:1 machine is tested. Choose the best explanation for a "+item[1]+" run of "+item[0]+" trials.",trials:item[0],sampleKind:item[1],choices:["Random results can vary from the exact theoretical ratio.","A short run proves the machine has changed.","Theoretical probability guarantees every run exactly."],answer:"Random results can vary from the exact theoretical ratio."}));
    mysteryConfigs.forEach((config,index) => levels.push({id:51+index,stage:6,type:"detective",title:"Crack the mystery",prompt:"The machine is hidden. Collect clues, then identify the hidden design.",hiddenSun:config[0],hiddenMoon:config[1],hiddenKind:config[2],choices:["Mostly Sun","Fair","Mostly Moon"],answer:config[2]==="sun"?"Mostly Sun":config[2]==="moon"?"Mostly Moon":"Fair"}));
    return levels;
  }
  return { stages, levels: buildLevels() };
})();