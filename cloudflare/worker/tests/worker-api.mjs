import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import {calculateAttemptPoints} from "../src/leaderboard/scoring.js";
import {progressForXp} from "../src/leaderboard/progression.js";
import {validateAttempt} from "../src/leaderboard/validation.js";

test("endless scoring and level progression have no lifetime ceiling",()=>{
 const p=calculateAttemptPoints({gameId:"number-maze",scorePercent:100,difficulty:"stretch",level:100000});
 assert.ok(p>0);
 assert.ok(progressForXp(100000000).level>100);
 assert.equal(validateAttempt({gameId:"number-maze",scorePercent:100,durationSeconds:60,attemptId:"attempt_123456",level:100000}).ok,true);
});
test("research endpoint fails closed while guardian verification is unavailable",async()=>{
 let touched=0;
 const DB={prepare(){touched++;return{run:async()=>({meta:{changes:1}})}}};
 const response=await worker.fetch(new Request("https://api.example.test/api/research/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({consent:true,events:[{category:"sudoku",action:"puzzle_solved"}]})}),{DB,RESEARCH_COLLECTION_ENABLED:"false"});
 assert.equal(response.status,503);assert.equal(touched,0);
});
test("research endpoint rejects No or missing consent before database access",async()=>{
 let touched=0;const DB={prepare(){touched++;return{run:async()=>({meta:{changes:1}})}}};
 const response=await worker.fetch(new Request("https://api.example.test/api/research/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({consent:false,events:[{category:"sudoku",action:"puzzle_solved"}]})}),{DB,RESEARCH_COLLECTION_ENABLED:"true"});
 assert.equal(response.status,403);assert.equal(touched,0);
});

class MemoryD1{
 constructor(){this.users=new Map();this.sessions=new Map();this.rates=new Map();this.playerAttempts=new Map();this.gameProgress=new Map();this.playerProgress=new Map();this.badges=new Map();this.legacyAttempts=new Map();this.legacyBest=new Map();}
 prepare(sql){
  const db=this,q=sql.replace(/\s+/g," ").trim();let args=[];
  const st={bind(...v){args=v;return st;},
   async first(){
    if(q.startsWith("SELECT COUNT(*) AS count FROM users"))return{count:db.users.size};
    if(q.startsWith("SELECT hits, window_started FROM auth_rate_limits"))return db.rates.get(args[0])||null;
    if(q.startsWith("SELECT id,username,email,password_hash,created_at FROM users"))return[...db.users.values()].find(u=>u.username===args[0]||u.email===args[1])||null;
    if(q.startsWith("SELECT u.id,u.username,u.created_at FROM sessions")){const s=db.sessions.get(args[0]);if(!s||s.expires_at<=args[1])return null;const u=db.users.get(s.user_id);return u?{id:u.id,username:u.username,created_at:u.created_at}:null;}
    if(q.startsWith("SELECT total_xp FROM player_progress")){const p=db.playerProgress.get(args[0]);return p?{total_xp:p.total_xp}:null;}
    if(q.startsWith("SELECT * FROM player_game_progress"))return db.gameProgress.get(args[0]+"|"+args[1])||null;
    if(q.startsWith("WITH ranked AS")&&q.includes("FROM player_progress")){const rows=[...db.playerProgress].map(([id,p])=>({id,username:db.users.get(id)?.username,points:p.total_points})).filter(x=>x.points>0).sort((a,b)=>b.points-a.points);const i=rows.findIndex(x=>x.id===args[0]);return i<0?null:{rank:i+1,points:rows[i].points,total_players:rows.length};}
    if(q.startsWith("WITH ranked AS")&&q.includes("FROM player_game_progress")){const [gid,uid]=args;const rows=[...db.gameProgress].filter(([k])=>k.endsWith("|"+gid)).map(([k,p])=>({id:k.split("|")[0],username:db.users.get(k.split("|")[0])?.username,points:p.total_points})).filter(x=>x.points>0).sort((a,b)=>b.points-a.points);const i=rows.findIndex(x=>x.id===uid);return i<0?null:{rank:i+1,points:rows[i].points,total_players:rows.length};}
    return null;
   },
   async run(){
    if(q.startsWith("INSERT INTO auth_rate_limits")){db.rates.set(args[0],{hits:1,window_started:args[1]});return{meta:{changes:1}};}
    if(q.startsWith("UPDATE auth_rate_limits SET hits=hits+1")){const r=db.rates.get(args[0]);if(r)r.hits++;return{meta:{changes:r?1:0}};}
    if(q.startsWith("INSERT INTO users")){if([...db.users.values()].some(u=>u.username===args[1]||u.email===args[2]))throw new Error("UNIQUE constraint failed");db.users.set(args[0],{id:args[0],username:args[1],email:args[2],password_hash:args[3],created_at:args[4]});return{meta:{changes:1}};}
    if(q.startsWith("INSERT OR IGNORE INTO player_progress")){if(!db.playerProgress.has(args[0]))db.playerProgress.set(args[0],{total_points:0,total_xp:0,level:1,xp_into_level:0,xp_to_next:125,total_attempts:0});return{meta:{changes:1}};}
    if(q.startsWith("DELETE FROM sessions WHERE expires_at")){for(const[k,s]of db.sessions)if(s.expires_at<=args[0])db.sessions.delete(k);return{meta:{changes:1}};}
    if(q.startsWith("INSERT INTO sessions")){db.sessions.set(args[0],{token_hash:args[0],user_id:args[1],expires_at:args[2],created_at:args[3],last_used_at:args[4]});return{meta:{changes:1}};}
    if(q.startsWith("UPDATE sessions SET last_used_at"))return{meta:{changes:1}};
    if(q.startsWith("INSERT OR IGNORE INTO player_game_attempts")){if(db.playerAttempts.has(args[0]))return{meta:{changes:0}};db.playerAttempts.set(args[0],{attempt_id:args[0],user_id:args[1],game_id:args[2],score_percent:args[3],points:args[4],duration_seconds:args[5],difficulty:args[6],level:args[7],hints_used:args[8],mistakes:args[9],perfect:args[10],created_at:args[11]});return{meta:{changes:1}};}
    if(q.startsWith("INSERT OR IGNORE INTO game_attempts")||q.startsWith("INSERT OR IGNORE INTO traffic_control_attempts")){if(db.legacyAttempts.has(args[0]))return{meta:{changes:0}};db.legacyAttempts.set(args[0],{user_id:args[1],game_id:q.includes("traffic_control")?"traffic-control":args[2],points:q.includes("traffic_control")?args[3]:args[4]});return{meta:{changes:1}};}
    if(q.startsWith("INSERT INTO best_game_scores")||q.startsWith("INSERT INTO traffic_control_best_scores")){return{meta:{changes:1}};}
    if(q.startsWith("INSERT INTO player_game_progress")){const k=args[0]+"|"+args[1],old=db.gameProgress.get(k)||{total_points:0,total_xp:0,attempts:0,perfect_clears:0,hard_clears:0,current_streak:0,best_streak:0,highest_level:1};const next={game_id:args[1],total_points:old.total_points+args[2],total_xp:old.total_xp+args[3],attempts:old.attempts+1,perfect_clears:old.perfect_clears+args[4],hard_clears:old.hard_clears+args[5],current_streak:old.current_streak+1,best_streak:Math.max(old.best_streak,old.current_streak+1),highest_level:Math.max(old.highest_level,args[6]),last_played_at:args[7]};db.gameProgress.set(k,next);return{meta:{changes:1}};}
    if(q.startsWith("INSERT INTO player_progress")){const p=db.playerProgress.get(args[0])||{total_points:0,total_xp:0,level:1,xp_into_level:0,xp_to_next:125,total_attempts:0};p.total_points+=args[1];p.total_xp+=args[2];p.total_attempts++;db.playerProgress.set(args[0],p);return{meta:{changes:1}};}
    if(q.startsWith("UPDATE player_progress SET level")){const p=db.playerProgress.get(args[3]);if(p){p.level=args[0];p.xp_into_level=args[1];p.xp_to_next=args[2];}return{meta:{changes:1}};}
    if(q.startsWith("INSERT OR IGNORE INTO player_badges")){const k=args[0]+"|"+args[1]+"|"+args[2];db.badges.set(k,{game_id:args[1],badge_id:args[2],earned_at:args[3]});return{meta:{changes:1}};}
    if(q.startsWith("DELETE FROM users WHERE id")){const id=args[0];db.users.delete(id);db.playerProgress.delete(id);for(const k of [...db.sessions.keys()])if(db.sessions.get(k).user_id===id)db.sessions.delete(k);for(const k of [...db.gameProgress.keys()])if(k.startsWith(id+"|"))db.gameProgress.delete(k);for(const k of [...db.playerAttempts.keys()])if(db.playerAttempts.get(k).user_id===id)db.playerAttempts.delete(k);for(const k of [...db.badges.keys()])if(k.startsWith(id+"|"))db.badges.delete(k);return{meta:{changes:1}};}
    return{meta:{changes:0}};
   },
   async all(){
    if(q.includes("FROM player_progress p JOIN users u")){return{results:[...db.playerProgress].map(([id,p])=>({id,username:db.users.get(id)?.username,points:p.total_points,games_played:p.total_attempts})).filter(x=>x.username&&x.points>0).sort((a,b)=>b.points-a.points).slice(0,args[0])};}
    if(q.includes("FROM player_game_progress g JOIN users u")){return{results:[...db.gameProgress].filter(([k])=>k.endsWith("|"+args[0])).map(([k,p])=>({username:db.users.get(k.split("|")[0])?.username,points:p.total_points,attempts:p.attempts})).filter(x=>x.username&&x.points>0).sort((a,b)=>b.points-a.points).slice(0,args[1])};}
    if(q.startsWith("SELECT rank,username,points,id FROM ranked")){return{results:[]};}
    if(q.startsWith("SELECT game_id,total_points,total_xp,attempts,perfect_clears,hard_clears,current_streak,best_streak,highest_level,last_played_at FROM player_game_progress")){return{results:[...db.gameProgress].filter(([k])=>k.startsWith(args[0]+"|")).map(([k,p])=>({...p,game_id:k.split("|")[1]}))};}
    if(q.startsWith("SELECT game_id,badge_id,earned_at FROM player_badges")){return{results:[...db.badges].filter(([k])=>k.startsWith(args[0]+"|")).map(([,v])=>v)};}
    return{results:[]};
   }
  };return st;
 }
}
test("D1 account, cumulative XP, endless scores and personal leaderboard position",async()=>{
 const DB=new MemoryD1(),env={DB,ALLOWED_ORIGIN:"https://04pranab.github.io"};
 const send=(path,method="GET",payload=null,token="")=>{const headers={Origin:env.ALLOWED_ORIGIN};if(payload!==null)headers["Content-Type"]="application/json";if(token)headers.Authorization="Bearer "+token;return worker.fetch(new Request("https://api.example.test"+path,{method,headers,body:payload===null?undefined:JSON.stringify(payload)}),env);};
 const pre=await worker.fetch(new Request("https://api.example.test/api/auth/login",{method:"OPTIONS",headers:{Origin:env.ALLOWED_ORIGIN,"Access-Control-Request-Method":"POST","Access-Control-Request-Headers":"authorization,content-type"}}),env);assert.equal(pre.status,204);
 const registered=await send("/api/auth/register","POST",{username:"learner_01",email:"learner@example.com",password:"LearningPass123"});assert.equal(registered.status,201);const reg=await registered.json();assert.ok(reg.sessionToken);
 const attempt=await send("/api/games/number-maze/attempts","POST",{attemptId:"maze_attempt_0001",scorePercent:100,durationSeconds:240,difficulty:"stretch",level:100000},reg.sessionToken);assert.equal(attempt.status,200);const a=await attempt.json();assert.ok(a.points>24);
 const again=await send("/api/games/number-maze/attempts","POST",{attemptId:"maze_attempt_0001",scorePercent:100,durationSeconds:240,difficulty:"stretch",level:100000},reg.sessionToken);assert.equal((await again.json()).duplicate,true);
 const traffic=await send("/api/games/traffic-control/attempts","POST",{attemptId:"traffic_attempt_0001",scorePercent:100,durationSeconds:360,difficulty:"hard",level:25},reg.sessionToken);assert.equal(traffic.status,200);
 const global=await send("/api/leaderboards/global");const g=await global.json();assert.equal(g.entries.length,1);assert.equal(g.entries[0].username,"learner_01");assert.equal(g.entries[0].points,a.points+(await traffic.json()).points);assert.equal(g.unlimited,true);assert.equal(g.maximumPoints,null);
 const game=await send("/api/leaderboards/games/number-maze");assert.equal((await game.json()).entries[0].points,a.points);
 const stats=await send("/api/players/me/stats","GET",null,reg.sessionToken);const p=await stats.json();assert.equal(p.totalPoints,g.entries[0].points);assert.ok(p.level>=1);assert.equal(p.badges.length,10);
 const position=await send("/api/leaderboards/me?gameId=global","GET",null,reg.sessionToken);assert.equal((await position.json()).rank,1);
 const deleted=await send("/api/players/me","DELETE",null,reg.sessionToken);assert.equal(deleted.status,200);assert.equal(DB.users.size,0);assert.equal(DB.playerProgress.size,0);
});
