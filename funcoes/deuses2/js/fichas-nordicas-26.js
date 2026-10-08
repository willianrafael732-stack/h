(()=>{
"use strict";
const $=id=>document.getElementById(id),fold=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined&&text!==null)n.textContent=String(text);if(cls)n.className=cls;return n};
const diceStr=parts=>parts?.length?parts.map(p=>p.count+"d10 "+p.type).join(" + "):"Não especificado";
function fDots(points,name){
 const value=Number(points),bar=make("span",null,"f-field-points");
 if(!Number.isFinite(value)||value<0){bar.textContent="—";return bar}
 const n=Math.floor(value),slots=Math.max(12,Math.min(30,Math.ceil(n/6)*6));
 bar.textContent="●".repeat(Math.min(n,slots))+"○".repeat(Math.max(0,slots-n))+(n>slots?" +"+(n-slots):"");
 bar.setAttribute("role","img");bar.setAttribute("aria-label",name+": "+n+" pontos");return bar;
}
function values(title,arr,type){
 const card=make("section",null,"f-box f-"+type);
 card.append(make("h3",title));
 const rows=make("div",null,"f-field-list");
 for(const entry of arr){const field=make("div",null,"f-field");field.append(make("span",entry.name),make("strong",entry.points),fDots(entry.points,entry.name));rows.append(field)}
 card.append(rows);return card;
}
function item(c){
 const card=make("article",null,"f-card");card.id=c.id;
 const head=make("div",null,"f-card-head");
 const identity=make("div");identity.append(make("small","Ficha "+c.order+" de 26 • Página original "+c.sourcePage),make("h2",c.title));
 const badges=make("div",null,"f-stats");
 for(const [k,v] of [["NÍVEL",c.level],["❤️ VIDA",c.life],["🔵 MANA",c.mana]]){const badge=make("span",k+" "+v);badges.append(badge)}
 head.append(identity,badges);card.append(head);
 const attrs=make("section",null,"f-section");attrs.append(make("h3","🧬 Atributos"));
 const attrGrid=make("div",null,"f-four");for(const [title,key] of [["💪 Físico","physical"],["🗣️ Social","social"],["🧠 Mental","mental"],["✨ Místico","mystical"]])attrGrid.append(values(title,c.attributes[key],key));
 attrs.append(attrGrid);card.append(attrs);
 const skills=make("section",null,"f-section");skills.append(make("h3","🎯 Habilidades"));
 const skillGrid=make("div",null,"f-three");
 for(const [title,key] of [["⚔️ Esquerda","left"],["🏹 Meio","middle"],["📚 Direita","right"]])skillGrid.append(values(title,c.skills[key],key));
 skills.append(skillGrid);card.append(skills);
 const attacks=make("section",null,"f-section");
 attacks.append(make("h3","🗡️ Arma principal: "+c.weapon));
 const damage=make("div",null,"f-three");
 const cases=[
  ["1. Ataque sem bônus",diceStr(c.attacks.base),"Valor básico do PDF.","base"],
  ["2. Ataque equipado",diceStr(c.attacks.equipped),"Bônus documentados: "+diceStr(c.attacks.bonus),"equipped"],
  ["3. Ataque com passiva",c.attacks.conditional.length?diceStr(addDice(c.attacks.equipped,c.attacks.conditional)):"Condicional","Condição: "+c.passive,"passive"]
 ];
 for(const [title,formula,note,id] of cases){
  const tile=make("div",null,"f-damage f-damage-"+id);
  tile.append(make("h4",title),make("strong",formula),make("p",note));damage.append(tile);
 }
 attacks.append(damage);card.append(attacks);
 card.append(movesSection(c));
 const specials=make("section",null,"f-section f-lore");
 for(const [title,value] of [["♾️ Passiva",c.passive],["⚡ Golpe especial",c.special],["👑 Golpe supremo",c.ultimate],["🎁 Recompensas",c.rewards]]){
  const box=make("div",null,"f-power");box.append(make("h4",title),make("p",value||"Não informado"));specials.append(box);
 }
 card.append(specials);
 const source=make("details",null,"f-source");source.append(make("summary","📜 Conferir os dados originais da ficha (PDF)"));
 const original=make("div",null,"f-source-content");
 for(const [label,value] of Object.entries(c.sourceSections)){const row=make("p");row.append(make("strong",label+": "),make("span",value));original.append(row)}
 source.append(original);card.append(source);return card;
}

/* Golpes autorais de campanha: os seis adicionais não substituem o especial/suprema do PDF. */
function d10Result(parts,hits){
 if(!Array.isArray(parts)||!parts.length||hits<1||hits>3)return null;
 const rolls=[];let total=0,successes=0,critical=0,failures=0;
 for(let k=0;k<hits;k++){
  let sum=0;
  for(const p of parts){
   if(!Number.isInteger(p.count)||p.count<1||p.count>200)return null;
   for(let j=0;j<p.count;j++){
    const die=1+Math.floor(Math.random()*10);sum+=die;
    if(die===10)critical++;else if(die===1)failures++;else if(die>=6)successes++;
   }
  }
  rolls.push(sum);total+=sum;
 }
 return {rolls,total,successes,critical,failures};
}
function moveCard(m,c){
 const card=make("article",null,"f-move-card");
 const top=make("div",null,"f-move-top");
 const title=make("div");title.append(make("small","Criação adicional • "+m.kind),make("h4",m.name));
 const tag=make("span",(m.cost.mana?m.cost.mana+" Mana":"0 Mana")+" • "+m.hits+" "+(m.hits===1?"acerto":"acertos"),"f-move-tag");
 top.append(title,tag);card.append(top);
 card.append(make("p",m.effect,"f-move-effect"));
 const details=make("p",null,"f-move-details");
 details.append(make("strong","Alcance: "),make("span",m.reach),
   make("strong"," • Recarga: "),make("span",m.cost.cooldown));
 card.append(details);
 if(m.resistance)card.append(make("p",m.resistance,"f-move-rule"));
 const variations=make("div",null,"f-move-variations");
 const entries=[
  {title:"Sem bônus",variant:"normal",note:"Dados básicos do golpe."},
  {title:"Com bônus da arma",variant:"weapon",note:"Inclui bônus de arma da ficha."},
  {title:"Com passiva ativa",variant:"passive",note:m.passiveCondition||"O PDF não informa bônus de dano de passiva aplicável."}
 ];
 for(const entry of entries){
  const panel=make("div",null,"f-move-variation f-move-"+entry.variant);
  panel.append(make("span",entry.title,"f-move-variation-label"));
  const parts=m.damage[entry.variant]||[],formula=m.formula[entry.variant]||"—";
  panel.append(make("strong",formula,"f-move-formula"));
  const buttons=make("div",null,"f-move-roll-line");
  if(parts.length){
   const roll=make("button","🎲 Rolar","f-roll");roll.type="button";
   const output=make("output","","f-roll-result");
   roll.setAttribute("aria-label","Rolar "+m.name+" - "+entry.title+" de "+c.name);
   roll.addEventListener("click",()=>{
    const result=d10Result(parts,m.hits);
    if(!result){output.textContent="Dados inválidos.";return}
    output.textContent="Dano: "+result.total+(result.rolls.length>1?" ("+result.rolls.join(" + ")+")":"")+
      " • Sucessos 6–9: "+result.successes+" • 10: "+result.critical+" • 1: "+result.failures;
   });
   buttons.append(roll,output);
  }else buttons.append(make("small","Sem bônus de dano documentado para esta passiva."));
  panel.append(buttons);
  if(entry.variant==="passive"&&m.passiveCondition)panel.append(make("small","Condição: "+m.passiveCondition,"f-move-condition"));
  variations.append(panel);
 }
 card.append(variations);return card;
}
function movesSection(c){
 const section=make("section",null,"f-section f-moves");
 const header=make("div",null,"f-moves-header");
 header.append(make("h3","⚔️ Golpes de combate — "+(c.attacks.moves?.length||0)+" adicionais + 2 originais"));
 const intro=make("p","Os seis golpes abaixo foram criados para a campanha com base nas armas e elementos da ficha. Dano, alcance, custo, recarga e efeitos são sugestões; os golpes original e supremo do PDF continuam preservados.","f-moves-intro");
 section.append(header,intro);
 const grid=make("div",null,"f-moves-grid");
 for(const move of c.attacks.moves||[])grid.append(moveCard(move,c));
 section.append(grid);
 const originals=make("div",null,"f-original-moves");
 originals.append(make("h4","📜 Golpes já existentes no PDF (não alterados)"));
 for(const [label,description]of [["Golpe especial original",c.special],["Suprema original",c.ultimate]]){
  const box=make("div",null,"f-original-move");
  box.append(make("strong",label),make("p",description));
  originals.append(box);
 }
 section.append(originals);return section;
}

function addDice(a,b){const result=new Map();for(const p of [...a,...b])result.set(p.type,(result.get(p.type)||0)+p.count);return [...result].map(([type,count])=>({type,count}))}
const count=$("f-count"),grid=$("f-results"),q=$("f-query"),category=$("f-category");let profiles=[];
function render(){
 const term=fold(q.value.trim()),cat=category.value;
 const results=profiles.filter(c=>(!term||fold([c.title,c.name,c.weapon,c.passive,c.rewards,...(c.attacks.moves||[]).map(m=>m.name+" "+m.effect)].join(" ")).includes(term))&&(!cat||(cat==="chefes"?c.order>=21:c.order<=20)));
 const fragment=document.createDocumentFragment();for(const c of results)fragment.append(item(c));
 grid.replaceChildren(fragment);count.textContent=results.length+" de 26 fichas exibidas • 8 golpes por personagem";
 if(!results.length)grid.append(make("p","Nenhuma ficha encontrada.","f-empty"));
}
q.addEventListener("input",render);category.addEventListener("change",render);
$("f-print").addEventListener("click",()=>window.print());
fetch("dados/fichas-nordicas-26.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()})
 .then(d=>{if(d.count!==26||d.characters.length!==26||d.characters.some(c=>c.attacks.moves?.length!==6))throw Error("Coleção de ataques incompleta");profiles=d.characters;render()})
 .catch(e=>{count.textContent="Erro ao carregar fichas: "+e.message});
})();