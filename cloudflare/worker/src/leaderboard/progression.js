const BADGE_RULES=Object.freeze([
{id:"first-clear",title:"First Steps",icon:"🌱",description:"Complete your first challenge",test:p=>p.attempts>=1},
{id:"flawless",title:"Flawless Finish",icon:"💎",description:"Complete a challenge with no hints or mistakes",test:p=>p.perfect_clears>=1},
{id:"hard-mode",title:"Brave Thinker",icon:"🔥",description:"Complete a hard or champion challenge",test:p=>p.hard_clears>=1},
{id:"streak-5",title:"Five in a Row",icon:"⚡",description:"Complete five challenges in a row",test:p=>p.best_streak>=5},
{id:"deep-dive-25",title:"Deep Diver",icon:"🧭",description:"Reach challenge level 25",test:p=>p.highest_level>=25},
{id:"deep-dive-100",title:"Century Club",icon:"💯",description:"Reach challenge level 100",test:p=>p.highest_level>=100},
{id:"points-1000",title:"Point Collector",icon:"🪙",description:"Earn 1,000 points in this game",test:p=>p.total_points>=1000},
{id:"points-10000",title:"Ten Thousand Club",icon:"🏅",description:"Earn 10,000 points in this game",test:p=>p.total_points>=10000},
{id:"marathon-100",title:"Marathon Mind",icon:"🏃",description:"Complete 100 challenges in this game",test:p=>p.attempts>=100}
]);
export function progressForXp(totalXp){
 const xp=Math.max(0,Math.floor(Number(totalXp)||0)),cum=l=>100*(l-1)+12.5*(l-1)*l;
 let lo=1,hi=1;while(cum(hi)<=xp&&hi<1_000_000_000)hi*=2;
 while(lo+1<hi){const mid=Math.floor((lo+hi)/2);if(cum(mid)<=xp)lo=mid;else hi=mid;}
 const level=lo,xpIntoLevel=xp-cum(level),xpToNext=100+level*25;
 return{level,totalXp:xp,xpIntoLevel,xpToNext,levelProgress:Math.min(100,Math.floor(xpIntoLevel/xpToNext*100))};
}
export function earnedBadges(progress){return BADGE_RULES.filter(r=>r.test(progress)).map(({test,...badge})=>badge);}
export{BADGE_RULES};
