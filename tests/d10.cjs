const assert=require('node:assert/strict'),D=require('../hurras-d10.js');
for(const [v,expected] of [[[10],2],[[1],-2],[[5],0],[[6,7,8,9],4],[[2,3,4],-3],[[10,1],0],[[10,10,1],2],[[1,1,10],-2],[[10,1,8,5,3],0]])assert.equal(D.score(v).score,expected);
assert.equal(D.score([1,10,1,10,10]).cancelled,2);
assert.throws(()=>D.score([0]));assert.throws(()=>D.score([11]));
for(let i=0;i<1000;i++){const face=D.face(10);assert.ok(face>=1&&face<=10)}
console.log('D10: pontuação, cancelamento, limites e aleatoriedade passaram.');
