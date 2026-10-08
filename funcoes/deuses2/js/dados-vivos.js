/* Hurras Deuses 2 — motor de dados dinâmicos, independente da interface.
   Os valores de origem nunca são modificados; ajustes são locais a cada personagem. */
(function(root){"use strict";
const fold=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
const types=[
 ["físico","Força"],["mágico","Magia"],["raio","Raio"],["elétrico","Raio"],["sagrado","Sagrado"],
 ["fogo","Fogo"],["gelo","Gelo"],["luz","Luz"],["trevas","Trevas"],["morte","Morte"],
 ["veneno","Veneno"],["água","Água"],["natureza","Natureza"],["terra","Terra"],
 ["vento","Vento"],["sombra","Trevas"]
];
const attrFor=type=>types.find(([t])=>fold(t)===fold(type))?.[1]||null;
const integer=(x,max=500)=>Number.isSafeInteger(Number(x))&&x!==null&&String(x).trim()!==""&&Number(x)>=0&&Number(x)<=max?Number(x):null;
const rx=/(\d+)d(6|8|10|12|20)\s*(?:dano\s+(?:de\s+)?)?(f[ií]sico|m[aá]gico|raio|el[eé]trico|sagrado|fogo|gelo|luz|trevas|morte|veneno|[aá]gua|natureza|terra|vento|sombra)\b/giu;
function typed(line){
 const out=[];for(const m of String(line||"").matchAll(rx)){
  const type=types.find(([label])=>fold(label)===fold(m[3]))?.[0]||fold(m[3]),key=attrFor(type);
  if(!key)continue;
  out.push({count:Number(m[1]),sides:Number(m[2]),type,key,raw:m[0],index:m.index});
 }
 return out;
}
function config(saved,id){const v=saved?.skillLinks?.[id];return v&&typeof v==="object"&&!Array.isArray(v)?v:{mode:"auto",sources:{}}}
function currentForm(saved){const t=saved?.transformation;if(!t||!t.active)return null;
 return Array.isArray(t.forms)?t.forms.find(f=>f?.id===t.active)||null:null}
function baseOf(saved,key,official){
 const edited=saved?.attributes||{},keys=Object.keys(edited);
 const picked=keys.find(x=>fold(x)===fold(key));
 if(picked!==undefined){const n=integer(edited[picked]);return n===null?null:{value:n,isEdited:true}}
 const known=typeof official==="function"?integer(official(key)):null;
 return known===null?null:{value:known,isEdited:false};
}
function resolve(line,saved,id,official){
 const parts=typed(line).filter(x=>x.sides===10);
 const opt=config(saved,id),mode=["auto","original","add"].includes(opt.mode)?opt.mode:"auto";
 const form=currentForm(saved);
 const fragments=[];let modified=String(line||""),last=0,changed=false;
 for(const part of parts){
  const key=opt.sources?.[part.type]||part.key;
  const info=baseOf(saved,key,official);
  const bonus=integer(form?.bonuses?.[key]??0,500);
  const total=info&&bonus!==null?info.value+bonus:null;
  let target=part.count,reason="";
  const triggered=!!info?.isEdited||(!!form&&bonus>0);
  if(mode!=="original"&&info&&total!==null&&(mode==="add"||triggered)){
   const calculated=mode==="add"?part.count+total:total;
   if(calculated<=500){target=calculated;reason=mode==="add"?"Somado":"Vinculado"}
  }
  fragments.push({...part,attribute:key,attributeDice:info?.value??null,transformationDice:bonus||0,calculated:target,reason});
 }
 // Rebuild only the D10 expressions tied to a declared damage type.

 const input=String(line||"");let reconstructed="";
 for(const item of fragments){
  reconstructed+=input.slice(last,item.index);
  const output=item.calculated===item.count?item.raw:item.raw.replace(/^\d+/,String(item.calculated));
  reconstructed+=output;last=item.index+item.raw.length;if(output!==item.raw)changed=true;
 }
 reconstructed+=input.slice(last);
 const expression=fragments.map(x=>x.calculated+"d10 "+x.type).join(" + ");
 return {original:input,calculated:reconstructed,formula:expression||null,changed,parts:fragments,mode,form:form?.name||"Normal"};
}
function candidates(lines){const set=new Set();for(const line of lines||[])for(const p of typed(line))if(p.sides===10)set.add(p.type);return [...set]}
function formsFor(saved){return Array.isArray(saved?.transformation?.forms)?saved.transformation.forms:[]}
root.HurrasDadosVivos={typed,attrFor,integer,config,currentForm,baseOf,resolve,candidates,formsFor,fold};
})(window);
