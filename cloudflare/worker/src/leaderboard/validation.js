import {ACTIVE_GAME_IDS,calculateAttemptPoints} from "./scoring.js";
const MAX_DURATION_SECONDS=4*60*60;
export function validateAttempt(input){
 if(!input||typeof input!=="object"||Array.isArray(input))return{ok:false,error:"Request body must be a JSON object."};
 const{gameId,scorePercent,durationSeconds,attemptId}=input;
 if(!ACTIVE_GAME_IDS.includes(gameId))return{ok:false,error:"Unknown or inactive game."};
 if(typeof attemptId!=="string"||!/^[a-zA-Z0-9_-]{12,80}$/.test(attemptId))return{ok:false,error:"A valid unique attemptId is required."};
 if(typeof durationSeconds!=="number"||!Number.isInteger(durationSeconds)||durationSeconds<3||durationSeconds>MAX_DURATION_SECONDS)return{ok:false,error:"durationSeconds must be an integer from 3 to 14400."};
 const difficulty=typeof input.difficulty==="string"?input.difficulty.toLowerCase():"easy";
 const level=Number.isSafeInteger(input.level)?Math.max(1,input.level):1;
 const hintsUsed=Number.isInteger(input.hintsUsed)?Math.min(20,Math.max(0,input.hintsUsed)):0;
 const mistakes=Number.isInteger(input.mistakes)?Math.min(40,Math.max(0,input.mistakes)):0;
 try{const points=calculateAttemptPoints({gameId,scorePercent,difficulty,level,hintsUsed,mistakes});return{ok:true,value:{gameId,attemptId,scorePercent,points,durationSeconds,difficulty,level,hintsUsed,mistakes}};}
 catch(error){return{ok:false,error:error.message};}
}
