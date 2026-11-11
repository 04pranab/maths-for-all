import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { calculateGlobalPoints, normalizeScore, MAX_GLOBAL_POINTS } from "../src/leaderboard/scoring.js";
import { validateAttempt } from "../src/leaderboard/validation.js";

test("health endpoint reports the D1-backed service", async () => {
  const DB = { prepare(sql) { return { first: async () => ({count:0}) }; } };
  const response = await worker.fetch(new Request("https://api.example.test/health"), { DB });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.database, "connected");
  assert.equal(body.features.accounts, true);
  assert.equal(body.features.leaderboards, true);
});

test("unauthenticated session lookup does not require a database query", async () => {
  const response = await worker.fetch(new Request("https://api.example.test/api/auth/me"), {});
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.authenticated, false);
  assert.equal(body.user, null);
});

test("CORS allows only the configured exact origin and credentials", async () => {
  const env = { ALLOWED_ORIGIN: "https://04pranab.github.io", DB: {prepare(){return {first:async()=>({count:0})}}} };
  const allowed = await worker.fetch(new Request("https://api.example.test/health", {headers:{Origin:env.ALLOWED_ORIGIN}}), env);
  assert.equal(allowed.headers.get("Access-Control-Allow-Origin"), env.ALLOWED_ORIGIN);
  assert.equal(allowed.headers.get("Access-Control-Allow-Credentials"), "true");
  const denied = await worker.fetch(new Request("https://api.example.test/health", {headers:{Origin:"https://attacker.example"}}), env);
  assert.equal(denied.headers.get("Access-Control-Allow-Origin"), null);
});

test("score normalization and global cap", () => {
  assert.equal(normalizeScore(0), 0);
  assert.equal(normalizeScore(84.4), 844);
  assert.equal(normalizeScore(100), 1000);
  assert.throws(() => normalizeScore(101), RangeError);
  assert.equal(calculateGlobalPoints({"arithmetic-quiz":800,"number-maze":900}),1700);
  assert.equal(MAX_GLOBAL_POINTS,10000);
});

test("attempt validation accepts only active games and valid unique IDs", () => {
  assert.equal(validateAttempt({gameId:"math-court",scorePercent:90,durationSeconds:60,attemptId:"attempt_123456"}).ok,false);
  assert.equal(validateAttempt({gameId:"number-maze",scorePercent:90,durationSeconds:60,attemptId:"x"}).ok,false);
  assert.equal(validateAttempt({gameId:"number-maze",scorePercent:92.5,durationSeconds:240,attemptId:"maze_attempt_12345"}).value.points,925);
});


class MemoryD1 {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.rates = new Map();
    this.attempts = new Map();
    this.best = new Map();
    this.trafficAttempts = new Map();
    this.trafficBest = new Map();
  }
  prepare(sql) {
    const db=this, query=sql.replace(/\s+/g," ").trim();
    let args=[];
    const statement={
      bind(...values){args=values;return statement;},
      async first(){
        if(query.startsWith("SELECT COUNT(*) AS count FROM users")) return {count:db.users.size};
        if(query.startsWith("SELECT hits, window_started FROM auth_rate_limits")) return db.rates.get(args[0])||null;
        if(query.startsWith("SELECT id,username,email,password_hash,created_at FROM users")) {
          return [...db.users.values()].find(u=>u.username===args[0]||u.email===args[1])||null;
        }
        if(query.startsWith("SELECT u.id,u.username,u.created_at FROM sessions")) {
          const s=db.sessions.get(args[0]); if(!s||s.expires_at<=args[1]) return null;
          const u=db.users.get(s.user_id); return u?{id:u.id,username:u.username,created_at:u.created_at}:null;
        }
        if(query.startsWith("SELECT user_id,game_id FROM game_attempts")) {
          const a=db.attempts.get(args[0]); return a?{user_id:a.user_id,game_id:a.game_id}:null;
        }
        if(query.startsWith("SELECT points,duration_seconds,achieved_at FROM best_game_scores")) {
          return db.best.get(args[0]+"|"+args[1])||null;
        }
        if(query.startsWith("SELECT user_id FROM traffic_control_attempts")) {
          const a=db.trafficAttempts.get(args[0]); return a?{user_id:a.user_id}:null;
        }
        if(query.startsWith("SELECT points,duration_seconds,achieved_at FROM traffic_control_best_scores")) {
          return db.trafficBest.get(args[0])||null;
        }
        return null;
      },
      async run(){
        if(query.startsWith("INSERT INTO auth_rate_limits")) {
          db.rates.set(args[0],{hits:1,window_started:args[1]}); return {meta:{changes:1}};
        }
        if(query.startsWith("UPDATE auth_rate_limits SET hits=hits+1")) {
          const r=db.rates.get(args[0]); if(r)r.hits++; return {meta:{changes:r?1:0}};
        }
        if(query.startsWith("INSERT INTO users")) {
          if([...db.users.values()].some(u=>u.username===args[1]||u.email===args[2])) throw new Error("UNIQUE constraint failed");
          db.users.set(args[0],{id:args[0],username:args[1],email:args[2],password_hash:args[3],created_at:args[4]});
          return {meta:{changes:1}};
        }
        if(query.startsWith("DELETE FROM sessions WHERE expires_at")) {
          let n=0;for(const [k,s] of db.sessions)if(s.expires_at<=args[0]){db.sessions.delete(k);n++;}return {meta:{changes:n}};
        }
        if(query.startsWith("INSERT INTO sessions")) {
          db.sessions.set(args[0],{token_hash:args[0],user_id:args[1],expires_at:args[2],created_at:args[3],last_used_at:args[4]});return {meta:{changes:1}};
        }
        if(query.startsWith("UPDATE sessions SET last_used_at")) return {meta:{changes:1}};
        if(query.startsWith("DELETE FROM sessions WHERE token_hash")) {
          const ok=db.sessions.delete(args[0]);return {meta:{changes:ok?1:0}};
        }
        if(query.startsWith("INSERT OR IGNORE INTO traffic_control_attempts")) {
          if(db.trafficAttempts.has(args[0]))return {meta:{changes:0}};
          db.trafficAttempts.set(args[0],{attempt_id:args[0],user_id:args[1],score_percent:args[2],points:args[3],duration_seconds:args[4],created_at:args[5]});
          return {meta:{changes:1}};
        }
        if(query.startsWith("INSERT INTO traffic_control_best_scores")) {
          const old=db.trafficBest.get(args[0]); if(!old||args[1]>old.points)db.trafficBest.set(args[0],{points:args[1],duration_seconds:args[2],achieved_at:args[3]});
          return {meta:{changes:1}};
        }
        if(query.startsWith("INSERT OR IGNORE INTO game_attempts")) {
          if(db.attempts.has(args[0]))return {meta:{changes:0}};
          db.attempts.set(args[0],{attempt_id:args[0],user_id:args[1],game_id:args[2],score_percent:args[3],points:args[4],duration_seconds:args[5],created_at:args[6]});
          return {meta:{changes:1}};
        }
        if(query.startsWith("INSERT INTO best_game_scores")) {
          const key=args[0]+"|"+args[1],old=db.best.get(key);
          if(!old||args[2]>old.points)db.best.set(key,{points:args[2],duration_seconds:args[3],achieved_at:args[4]});
          return {meta:{changes:1}};
        }
        if(query.startsWith("DELETE FROM users WHERE id")) {
          db.users.delete(args[0]);
          for(const [k,v] of db.sessions)if(v.user_id===args[0])db.sessions.delete(k);
          for(const [k,v] of db.attempts)if(v.user_id===args[0])db.attempts.delete(k);
          for(const k of [...db.best.keys()])if(k.startsWith(args[0]+"|"))db.best.delete(k);
          db.trafficBest.delete(args[0]);
          for(const [k,v] of db.trafficAttempts)if(v.user_id===args[0])db.trafficAttempts.delete(k);
          return {meta:{changes:1}};
        }
        return {meta:{changes:0}};
      },
      async all(){
        if(query.includes("FROM users u JOIN scores s")) {
          const grouped=new Map();
          for(const [key,b] of db.best){const user=db.users.get(key.split("|")[0]);if(!user)continue;const g=grouped.get(user.id)||{username:user.username,points:0,games_played:0};g.points+=b.points;g.games_played++;grouped.set(user.id,g);}
          for(const [uid,b] of db.trafficBest){const user=db.users.get(uid);if(!user)continue;const g=grouped.get(uid)||{username:user.username,points:0,games_played:0};g.points+=b.points;g.games_played++;grouped.set(uid,g);}
          return {results:[...grouped.values()].sort((a,b)=>b.points-a.points||a.username.localeCompare(b.username)).slice(0,args[0])};
        }
        if(query.includes("FROM traffic_control_best_scores b JOIN users u")) {
          const rows=[];for(const [uid,b] of db.trafficBest){const u=db.users.get(uid);if(u)rows.push({username:u.username,points:b.points,duration_seconds:b.duration_seconds,achieved_at:b.achieved_at});}
          return {results:rows.sort((a,b)=>b.points-a.points).slice(0,args[0])};
        }
        if(query.includes("FROM best_game_scores b JOIN users u")) {
          const rows=[];for(const [key,b] of db.best){const [uid,gid]=key.split("|");if(gid!==args[0])continue;const u=db.users.get(uid);if(u)rows.push({username:u.username,points:b.points,duration_seconds:b.duration_seconds,achieved_at:b.achieved_at});}
          return {results:rows.sort((a,b)=>b.points-a.points).slice(0,args[1])};
        }
        if(query.startsWith("SELECT game_id,points,duration_seconds,achieved_at FROM best_game_scores")) {
          const rows=[...db.best].filter(([key])=>key.startsWith(args[0]+"|")).map(([key,b])=>({game_id:key.split("|")[1],...b}));
          if(db.trafficBest.has(args[0]))rows.push({game_id:"traffic-control",...db.trafficBest.get(args[0])});
          return {results:rows};
        }
        return {results:[]};
      }
    };
    return statement;
  }
}

test("end-to-end D1 account, bearer session, score and leaderboard flow", async () => {
  const DB=new MemoryD1();
  const env={DB,ALLOWED_ORIGIN:"https://04pranab.github.io"};
  const origin={Origin:env.ALLOWED_ORIGIN};
  const send=async(path,method="GET",payload=null,token="")=>{
    const headers={...origin};
    if(payload!==null)headers["Content-Type"]="application/json";
    if(token)headers.Authorization="Bearer "+token;
    return worker.fetch(new Request("https://api.example.test"+path,{method,headers,body:payload===null?undefined:JSON.stringify(payload)}),env);
  };
  const preflight=await worker.fetch(new Request("https://api.example.test/api/auth/login",{method:"OPTIONS",headers:{Origin:env.ALLOWED_ORIGIN,"Access-Control-Request-Method":"POST","Access-Control-Request-Headers":"authorization,content-type"}}),env);
  assert.equal(preflight.status,204);
  assert.match(preflight.headers.get("Access-Control-Allow-Headers"),/Authorization/i);

  const registered=await send("/api/auth/register","POST",{username:"learner_01",email:"learner@example.com",password:"LearningPass123"});
  assert.equal(registered.status,201);
  const reg=await registered.json();
  assert.equal(reg.authenticated,true);
  assert.ok(reg.sessionToken);
  assert.equal(reg.user.username,"learner_01");

  const me=await send("/api/auth/me","GET",null,reg.sessionToken);
  assert.equal(me.status,200);
  assert.equal((await me.json()).user.username,"learner_01");

  const byUsername=await send("/api/auth/login","POST",{identifier:"learner_01",password:"LearningPass123"});
  assert.equal(byUsername.status,200);
  const login=await byUsername.json();
  assert.ok(login.sessionToken);

  const byEmail=await send("/api/auth/login","POST",{identifier:"learner@example.com",password:"LearningPass123"});
  assert.equal(byEmail.status,200);
  const emailLogin=await byEmail.json();
  assert.ok(emailLogin.sessionToken);

  const wrong=await send("/api/auth/login","POST",{identifier:"learner_01",password:"incorrect-password"});
  assert.equal(wrong.status,401);

  const attempt=await send("/api/games/number-maze/attempts","POST",{attemptId:"maze_attempt_0001",scorePercent:92.5,durationSeconds:240},reg.sessionToken);
  assert.equal(attempt.status,200);
  assert.equal((await attempt.json()).points,925);

  const traffic=await send("/api/games/traffic-control/attempts","POST",{attemptId:"traffic_attempt_0001",scorePercent:80,durationSeconds:360},reg.sessionToken);
  assert.equal(traffic.status,200);
  assert.equal((await traffic.json()).points,800);

  const global=await send("/api/leaderboards/global");
  const globalBody=await global.json();
  assert.equal(globalBody.entries.length,1);
  assert.equal(globalBody.entries[0].username,"learner_01");
  assert.equal(globalBody.entries[0].points,1725);
  assert.equal(globalBody.maximumPoints,10000);
  assert.equal(globalBody.entries[0].gamesPlayed,2);

  const game=await send("/api/leaderboards/games/number-maze");
  assert.equal((await game.json()).entries[0].points,925);
  const trafficBoard=await send("/api/leaderboards/games/traffic-control");
  assert.equal((await trafficBoard.json()).entries[0].points,800);

  const stats=await send("/api/players/me/stats","GET",null,reg.sessionToken);
  assert.equal((await stats.json()).totalPoints,1725);

  const deleted=await send("/api/players/me","DELETE",null,reg.sessionToken);
  assert.equal(deleted.status,200);
  assert.equal(DB.users.size,0);
  assert.equal(DB.sessions.size,0);
  assert.equal(DB.attempts.size,0);
  assert.equal(DB.best.size,0);
  assert.equal(DB.trafficBest.size,0);
  assert.equal(DB.trafficAttempts.size,0);
});
