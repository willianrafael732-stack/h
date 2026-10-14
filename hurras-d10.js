(function(root){'use strict';
function score(values){let successes=0,failures=0,tens=0,ones=0,neutral=0;for(const v of values){if(!Number.isInteger(v)||v<1||v>10)throw Error('D10 inválido');if(v===10)tens++;else if(v===1)ones++;else if(v>5)successes++;else if(v<5)failures++;else neutral++;}const cancelled=Math.min(tens,ones);return {values,successes,failures,tens,ones,neutral,cancelled,score:successes-failures+2*(tens-cancelled)-2*(ones-cancelled)}}
function face(sides){const a=new Uint32Array(1),limit=Math.floor(4294967296/sides)*sides;do{crypto.getRandomValues(a)}while(a[0]>=limit);return a[0]%sides+1}
function describe(r){return 'Pontos: '+r.score+' | Sucessos: '+r.successes+' | Erros: '+r.failures+' | 10: '+r.tens+' | 1: '+r.ones+' | Pares 1/10 anulados: '+r.cancelled+' | Neutros (5): '+r.neutral}
root.HurrasD10={score,face,describe};if(typeof module!=='undefined')module.exports=root.HurrasD10;
})(typeof window!=='undefined'?window:globalThis);
