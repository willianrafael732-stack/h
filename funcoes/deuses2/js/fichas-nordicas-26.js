(()=>{
"use strict";
const $=id=>document.getElementById(id),fold=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined&&text!==null)n.textContent=String(text);if(cls)n.className=cls;return n};
const diceStr=parts=>parts?.length?parts.map(p=>p.count+"d10 "+p.type).join(" + "):"Não especificado";
function values(title,arr,type){
 const card=make("section",null,"f-box f-"+type);
 card.append(make("h3",title));
 const rows=make("div",null,"f-field-list");
 for(const entry of arr){const field=make("div",null,"f-field");field.append(make("span",entry.name),make("strong",entry.points));rows.append(field)}
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
function addDice(a,b){const result=new Map();for(const p of [...a,...b])result.set(p.type,(result.get(p.type)||0)+p.count);return [...result].map(([type,count])=>({type,count}))}
const count=$("f-count"),grid=$("f-results"),q=$("f-query"),category=$("f-category");let profiles=[];
function render(){
 const term=fold(q.value.trim()),cat=category.value;
 const results=profiles.filter(c=>(!term||fold([c.title,c.name,c.weapon,c.passive,c.rewards].join(" ")).includes(term))&&(!cat||(cat==="chefes"?c.order>=21:c.order<=20)));
 const fragment=document.createDocumentFragment();for(const c of results)fragment.append(item(c));
 grid.replaceChildren(fragment);count.textContent=results.length+" de 26 fichas exibidas";
 if(!results.length)grid.append(make("p","Nenhuma ficha encontrada.","f-empty"));
}
q.addEventListener("input",render);category.addEventListener("change",render);
$("f-print").addEventListener("click",()=>window.print());
fetch("dados/fichas-nordicas-26.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()})
 .then(d=>{if(d.count!==26||d.characters.length!==26)throw Error("Coleção incompleta");profiles=d.characters;render()})
 .catch(e=>{count.textContent="Erro ao carregar fichas: "+e.message});
})();