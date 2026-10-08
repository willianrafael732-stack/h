/* Guia visual do Ragnarök — conteúdo fiel às páginas 55, 56 e 57. */
(()=>{"use strict";
const section=document.getElementById("guiaRagnarok");
const eventGrid=document.getElementById("eventosRagnarok");
const hierarchy=document.getElementById("hierarquiaRagnarok");
const reference=document.getElementById("referenciaRagnarok");
const state=document.getElementById("guiaRagnarokStatus");
if(!section||!eventGrid||!hierarchy||!reference||!state)return;
const e=(tag,value,cl)=>{const node=document.createElement(tag);if(value!==null)node.textContent=value;if(cl)node.className=cl;return node};
const createList=(arr,cls)=>{const ul=e("ul",null,cls);for(const v of arr)ul.append(e("li",v));return ul};
function printSource(raw){
 const details=e("details",null,"rag-source"),summary=e("summary","Ver trecho original do compêndio"),pre=e("pre",raw,"organ-original");
 details.append(summary,pre);return details;
}
function events(items){
 eventGrid.replaceChildren();
 const fragment=document.createDocumentFragment();
 items.forEach((item,i)=>{
   const article=e("article",null,"rag-event rag-event--"+item.id);
   article.id="evento-"+item.id;
   const top=e("div",null,"rag-event-top");
   top.append(e("span",item.step,"rag-event-step"),e("span","Página 55","rag-page"));
   article.append(top,e("h3",item.title),e("p",item.summary,"rag-event-description"));
   if(item.abilities.length){article.append(e("h4","☠️ Técnica e efeitos"),createList(item.abilities,"rag-attacks"))}
   if(item.consequences.length){article.append(e("h4","Consequências"),createList(item.consequences,"rag-consequences"))}
   article.append(printSource(item.raw));fragment.append(article);
 });
 eventGrid.append(fragment);
}
function bossLevels(bosses,raw){
 hierarchy.replaceChildren();
 const groups=[
  ["Grandes chefes","⚔️"],
  ["Chefes maiores","🐉"],
  ["Chefes primordiais","🌋"]
 ];
 for(const [key,symbol] of groups){
  const article=e("article",null,"rag-hierarchy-card");
  article.append(e("h4",symbol+" "+key),createList(bosses[key]||[],"rag-compact-list"));
  hierarchy.append(article);
 }
 const finale=e("div",null,"rag-last-boss");
 finale.append(e("strong","Chefe final sugerido"),e("p",bosses["Chefe final sugerido"]||""));
 hierarchy.append(finale,printSource(raw));
}
function quickRef(groups,raw){
 reference.replaceChildren();
 const labels={"Nove Reinos":"🌌","Principais grupos":"⚔️","Nornas":"⌛","Valquírias":"🪽","Criaturas centrais":"🐺","Artefatos":"🔨"};
 for(const [name,list] of Object.entries(groups)){
  const card=e("article",null,"rag-reference-card");
  card.append(e("h4",(labels[name]||"✦")+" "+name));
  const ul=e("ul",null,"rag-chip-list");for(const val of list)ul.append(e("li",val));
  card.append(ul);reference.append(card);
 }
 reference.append(printSource(raw));
}
fetch("dados/guia-ragnarok.json").then(async response=>{
 if(!response.ok)throw Error("HTTP "+response.status);
 return response.json();
}).then(data=>{
 if(data.events.length!==3||data.reference["Nove Reinos"].length!==9)throw Error("Dados incompletos");
 events(data.events);bossLevels(data.hierarchy,data.original.hierarchy);quickRef(data.reference,data.original.reference);
 state.textContent="3 etapas narrativas · hierarquia completa · 9 Reinos · 14 Valquírias";
}).catch(error=>{
 state.textContent="Não foi possível carregar a versão organizada: "+error.message;
 section.append(e("p","O compêndio completo também está disponível no final desta página.","rag-error"));
});
})();