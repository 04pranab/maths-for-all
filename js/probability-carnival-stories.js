window.ProbabilityCarnivalStories = (() => {
  const stages = [
    { number: 1, name: "Probability intuition", range: "Levels 1–12", note: "Learn the language of chance by making quick predictions.", objective: "Decide whether an outcome is impossible, certain, likely, unlikely, or equally likely." },
    { number: 2, name: "Compare", range: "Levels 13–24", note: "Put two chances side by side and decide which is greater, smaller, or equal.", objective: "Compare chances before the machine gives you an answer." },
    { number: 3, name: "Build", range: "Levels 25–36", note: "Build machines with simple ratios and make the requested chance.", objective: "Change the token mix to construct a probability machine." },
    { number: 4, name: "Experiment", range: "Levels 37–48", note: "Run trials, collect results, and compare what happened.", objective: "Use experimental results as evidence rather than expecting every run to match perfectly." },
    { number: 5, name: "Randomness", range: "Levels 49–60", note: "Investigate short runs, longer runs, theoretical probability, and sample size.", objective: "Explain why random results can wobble and why more trials often give a clearer picture." },
    { number: 6, name: "Probability Detective", range: "Levels 61–72", note: "Use clues to uncover hidden machines and identify fair or unfair designs.", objective: "Infer a hidden configuration from evidence and explain your reasoning." },
    { number: 7, name: "Dice Lab", range: "Levels 73–84", note: "Explore fair dice, two-dice sums, repeated rolls, and independent events with no betting or prizes.", objective: "Use sample spaces, equally likely outcomes, and repeated experiments to reason about chance." }
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
    [[3,3],[1,1],"equal"], [[5,1],[3,3],"sun"], [[1,5],[3,3],"moon"], [[2,2],[1,3],"sun"], [[1,3],[2,2],"moon"],
    [[6,2],[3,3],"sun"], [[3,3],[2,6],"moon"]
  ];
  const buildTargets = [[1,1,"equal"],[2,1,"sun"],[3,1,"sun"],[1,3,"moon"],[2,2,"equal"],[3,1,"sun"],[1,2,"moon"],[3,3,"equal"],[1,3,"moon"],[3,1,"sun"],[2,1,"sun"],[1,2,"moon"]];
  const experimentTrials = [5,10,20,5,10,20,5,10,20,20];
  const randomnessSamples = [[5,"short"],[20,"long"],[5,"short"],[20,"long"],[10,"medium"],[20,"long"],[5,"short"],[20,"long"],[10,"medium"],[20,"long"],[10,"medium"],[5,"short"]];
  const mysteryConfigs = [[4,4,"fair"],[6,2,"sun"],[2,6,"moon"],[5,3,"sun"],[3,5,"moon"],[4,4,"fair"],[7,1,"sun"],[1,7,"moon"],[4,4,"fair"],[6,2,"sun"],[5,3,"sun"],[3,5,"moon"]];
  const diceLevels = [
    { title:"Fair die: one face", prompt:"A fair six-sided die is rolled once. Is rolling a 1 more likely, rolling a 6 more likely, or are they equally likely?", choices:["Rolling a 1","Rolling a 6","They are equally likely"], answer:"They are equally likely", dice:1, lesson:"Every face on a fair die has the same chance." },
    { title:"Even or odd?", prompt:"A fair six-sided die is rolled once. Is an even result more likely, an odd result more likely, or are they equally likely?", choices:["Even","Odd","They are equally likely"], answer:"They are equally likely", dice:1, lesson:"Three faces are even and three are odd." },
    { title:"Four faces or two?", prompt:"On a fair die, which is more likely: rolling 1, 2, 3, or 4, or rolling 5 or 6?", choices:["1–4","5–6","They are equally likely"], answer:"1–4", dice:1, lesson:"Four equally likely faces beat two equally likely faces." },
    { title:"Two dice: find 7", prompt:"Two fair dice are rolled. Which total is more likely: a sum of 7 or a sum of 2?", choices:["Sum 7","Sum 2","They are equally likely"], answer:"Sum 7", dice:2, lesson:"There are six ways to make 7, but only one way to make 2." },
    { title:"Two dice: 8 or 12?", prompt:"Two fair dice are rolled. Which total is more likely: a sum of 8 or a sum of 12?", choices:["Sum 8","Sum 12","They are equally likely"], answer:"Sum 8", dice:2, lesson:"Several pairs make 8; only 6+6 makes 12." },
    { title:"Even totals", prompt:"Two fair dice are rolled. Is an even total more likely, an odd total more likely, or are they equally likely?", choices:["Even total","Odd total","They are equally likely"], answer:"They are equally likely", dice:2, lesson:"The 36 equally likely ordered pairs split evenly by total parity." },
    { title:"Big totals", prompt:"Two fair dice are rolled. Which is more likely: a total of 10 or more, or a total below 10?", choices:["10 or more","Below 10","They are equally likely"], answer:"Below 10", dice:2, lesson:"The sample space contains many more totals below 10." },
    { title:"One six or two sixes?", prompt:"Two fair dice are rolled. Which event is more likely: at least one die shows 6, or both dice show 6?", choices:["At least one 6","Two sixes","They are equally likely"], answer:"At least one 6", dice:2, lesson:"An event can have many successful outcomes even when each roll is fair." },
    { title:"Twelve rolls", prompt:"A fair die is rolled 12 times. Must every face appear exactly twice?", choices:["Yes, exactly twice","No, not guaranteed","Only if the first roll is a 6"], answer:"No, not guaranteed", dice:1, lesson:"Probability describes chance, not a promise about a short run." },
    { title:"The next roll", prompt:"A fair die has not shown 6 for several rolls. On the next roll, is 6 now more likely than the other faces?", choices:["Yes, 6 is due","No, all faces are still equally likely","Only if we roll twice"], answer:"No, all faces are still equally likely", dice:1, lesson:"Past independent rolls do not change the probability of the next fair roll." },
    { title:"Three dice: 3 or 4?", prompt:"Three fair dice are rolled. Which total is more likely: 3 or 4?", choices:["Sum 3","Sum 4","They are equally likely"], answer:"Sum 4", dice:3, lesson:"Three dice can make 4 in three ordered ways, but only one way makes 3." },
    { title:"Same or different?", prompt:"Two fair dice are rolled. Which event is more likely: both dice match, or the dice show different numbers?", choices:["Same number","Different numbers","They are equally likely"], answer:"Different numbers", dice:2, lesson:"There are 6 matching pairs and 30 different-number pairs." }
  ];
  function buildLevels() {
    const levels = [];
    intuitionScenarios.forEach((item,index) => levels.push({id:index+1,stage:1,type:"intuition",title:"Chance check",prompt:item[0]+" What do you think about: "+item[1],scenario:item[0],outcome:item[1],choices:["impossible","unlikely","equally likely","likely","certain"],answer:item[2]}));
    comparePairs.forEach((item,index) => levels.push({id:11+index,stage:2,type:"compare",title:"Which chance wins?",prompt:"Compare the two machines. Choose which gives Sun the greater chance, Moon the greater chance, or whether they are equal.",machineA:item[0],machineB:item[1],choices:["A","equal","B"],answer:item[2]==="equal"?"equal":item[2]==="sun"?"A":"B"}));
    buildTargets.forEach((item,index) => levels.push({id:21+index,stage:3,type:"build",title:"Build "+item[0]+":"+item[1],prompt:"Build a machine with "+item[0]+" Sun token"+(item[0]===1?"":"s")+" and "+item[1]+" Moon token"+(item[1]===1?"":"s")+".",sun:item[0],moon:item[1],answer:item[2]}));
    experimentTrials.forEach((trials,index) => levels.push({id:31+index,stage:4,type:"experiment",title:"Run "+trials+" trials",prompt:"Predict which result will be more common, then run exactly "+trials+" trials.",trials,bag:["sun","sun","sun","moon"],answer:"sun"}));
    randomnessSamples.forEach((item,index) => levels.push({id:41+index,stage:5,type:"randomness",title:"What does the sample tell us?",prompt:"A 3:1 machine is tested. Choose the best explanation for a "+item[1]+" run of "+item[0]+" trials.",trials:item[0],sampleKind:item[1],choices:["Random results can vary from the exact theoretical ratio.","A short run proves the machine has changed.","Theoretical probability guarantees every run exactly."],answer:"Random results can vary from the exact theoretical ratio."}));
    mysteryConfigs.forEach((config,index) => levels.push({id:51+index,stage:6,type:"detective",title:"Crack the mystery",prompt:"The machine is hidden. Collect clues, then identify the hidden design.",hiddenSun:config[0],hiddenMoon:config[1],hiddenKind:config[2],choices:["Mostly Sun","Fair","Mostly Moon"],answer:config[2]==="sun"?"Mostly Sun":config[2]==="moon"?"Mostly Moon":"Fair"}));
    diceLevels.forEach((item,index) => levels.push({id:61+index,stage:7,type:"dice",title:item.title,prompt:item.prompt,choices:item.choices,answer:item.answer,dice:item.dice,lesson:item.lesson}));
    return levels;
  }
  return { stages, levels: buildLevels() };
})();