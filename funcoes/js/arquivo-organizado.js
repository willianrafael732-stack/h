/* Hurras RPG — arquivo organizado: preserva integralmente os textos do mestre. */
(()=>{"use strict";
const $=id=>document.getElementById(id);
const mode=document.body.dataset.archiveMode;
const root=$("organizedGrid"),query=$("organizedQuery"),group=$("organizedGroup"),level=$("organizedLevel"),sort=$("organizedSort"),counter=$("organizedCount"),more=$("organizedMore"),print=$("organizedPrint");
if(!mode||!root||!query||!group||!level||!sort||!counter||!more||!print)return;
const SOURCES={
 bestiario:["dados/criaturas.json","dados/ragnarok.json"],
 deuses:["dados/figuras-bestiario.json"],
 catalogo:["dados/adversarios.json","dados/documentos-nordicos.json"]
};
const pathGroup={"dados/criaturas.json":"Criaturas de Nexalis","dados/ragnarok.json":"Seres do Ragnarök","dados/figuras-bestiario.json":"Figuras divinas","dados/adversarios.json":"Adversários especiais","dados/documentos-nordicos.json":"Eventos e referências"};
const normalize=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
const elem=(tag,content,cls)=>{const el=document.createElement(tag);if(content!==null)el.textContent=content;if(cls)el.className=cls;return el};
const escapeText=s=>String(s||"").trim();
const RES=/^(Atributos|Habilidades|Habilidades Especiais|Magias\s*\/\s*Técnicas|Magias\/Técnicas|Elementos Mágicos|Resistências\s*(?:M[aá]gica[s]?)?|Descrição|Habitat|Drops?|Armas?|Arma Principal|Talentos|Perícias|Conhecimentos|Passivas?|Fraquezas|História|Equipamento|Árvores de Magia|Técnicas|Poderes|Metamorfose|Evolução|Suprema|Ataques|Atributo Valor|Poderes\s*\/\s*Técnicas|♾️ Passiva)\s*:?\s*$/i;
let entries=[],perPage=18;
function extractSections(text){
 const out=[],lines=String(text||"").replace(/\f/g,"\n").split(/\r?\n/);
 let current={heading:"Dados originais",lines:[]};out.push(current);
 for(const line of lines){
  if(RES.test(line.trim())){current={heading:line.trim().replace(/:\s*$/,""),lines:[]};out.push(current)}
  else current.lines.push(line);
 }
 return out.filter(x=>x.lines.some(v=>v.trim()));
}
function portrait(item){
 const figure=elem("figure",null,"organ-cover");
 const image=item.picture;
 if(image){
  const a=elem("a");a.href=image;a.target="_blank";a.rel="noopener";a.title="Ampliar ilustração de "+(item.name||item.title);
  const im=elem("img");im.src=image;im.loading="lazy";im.decoding="async";im.alt="Arte associada a "+(item.name||item.title);
  im.onerror=()=>{a.replaceChildren(placeholder(item));a.removeAttribute("href")};
  a.append(im);figure.append(a);
 }else figure.append(placeholder(item));
 return figure;
}
function placeholder(item){
 const div=elem("div",null,"organ-cover-placeholder");
 const symbol=elem("span",item.group==="Figuras divinas"?"✦":item.group==="Seres do Ragnarök"?"🐉":item.group==="Eventos e referências"?"📜":item.group==="Adversários especiais"?"♜":"⚔","organ-cover-symbol");
 const cap=elem("small","Sem retrato específico cadastrado • "+item.group,"organ-cover-caption");
 div.setAttribute("role","img");div.setAttribute("aria-label","Emblema ilustrativo de "+(item.name||item.title));
 div.append(symbol,cap);return div;
}
function card(item){
 const art=elem("article",null,"organ-card");
 const top=elem("div",null,"organ-card-top");
 top.append(portrait(item));
 const side=elem("div",null,"organ-card-details");
 const tag=elem("span",item.group+" • "+(Number.isInteger(item.level)?"Nível "+item.level:"Documento"),"organ-tag");
 const title=elem("h3",item.name||item.title),meta=elem("p",null,"organ-stats");
 meta.textContent=[item.life?"❤ Vitalidade "+item.life:"",item.mana?"✦ Mana "+item.mana:""].filter(Boolean).join("   •   ");
 side.append(tag,title);
 if(meta.textContent)side.append(meta);
 const description=escapeText(item.description||"");
 if(description){side.append(elem("h4","Descrição"),elem("p",description,"organ-description"))}
 else if(!Number.isInteger(item.level))side.append(elem("p","Documento complementar do compêndio nórdico; texto completo na ficha abaixo.","organ-description"));
 else side.append(elem("p","Descrição específica não identificada no documento original. Consulte a ficha integral abaixo.","organ-description"));
 if(item.habitat)side.append(elem("p","🌿 Habitat: "+escapeText(item.habitat),"organ-habitat"));
 top.append(side);art.append(top);
 const details=elem("details",null,"organ-full");
 details.append(elem("summary","📜 Abrir ficha integral, atributos, técnicas e drops"));
 const wrapper=elem("div",null,"organ-full-sections");
 for(const section of extractSections(item.raw)){
  const detail=elem("section",null,"organ-full-section");
  detail.append(elem("h4",section.heading),elem("pre",section.lines.join("\n").trim(),"organ-original"));
  wrapper.append(detail);
 }
 const original=elem("details",null,"organ-verbatim");
 original.append(elem("summary","Ver texto original sem cortes"),elem("pre",item.raw||"","organ-original"));
 wrapper.append(original);details.append(wrapper);art.append(details);
 return art;
}
function update(){
 const q=normalize(query.value),g=group.value,lev=level.value,order=sort.value;
 const filtered=entries.filter(it=>(!q||normalize([it.name,it.title,it.description,it.habitat,it.raw,it.group].join(" ")).includes(q))
 &&(!g||it.group===g)&&(!lev|| (lev==="sem"?it.level==null:String(it.level)===lev)));
 if(order==="name")filtered.sort((a,b)=>(a.name||a.title).localeCompare(b.name||b.title,"pt-BR"));
 if(order==="level")filtered.sort((a,b)=>(a.level??999)-(b.level??999));
 if(order==="high")filtered.sort((a,b)=>(b.level??-1)-(a.level??-1));
 root.replaceChildren(...filtered.slice(0,perPage).map(card));
 if(!filtered.length)root.append(elem("p","Nenhuma ficha encontrada. Ajuste a busca ou o filtro.","organ-empty"));
 counter.textContent=filtered.length+" registros encontrados • "+Math.min(perPage,filtered.length)+" exibidos";
 more.hidden=filtered.length<=perPage;
}
function buildOptions(){
 const groups=[...new Set(entries.map(x=>x.group))].sort((a,b)=>a.localeCompare(b,"pt-BR"));
 for(const v of groups){const opt=elem("option",v);opt.value=v;group.append(opt)}
 const levels=[...new Set(entries.map(x=>x.level).filter(Number.isInteger))].sort((a,b)=>a-b);
 for(const v of levels){const opt=elem("option","Nível "+v);opt.value=String(v);level.append(opt)}
 if(entries.some(x=>x.level==null)){const opt=elem("option","Documentos sem nível");opt.value="sem";level.append(opt)}
}
query.addEventListener("input",()=>{perPage=18;update()});
[group,level,sort].forEach(el=>el.addEventListener("change",()=>{perPage=18;update()}));
more.addEventListener("click",()=>{perPage+=18;update()});
print.addEventListener("click",()=>{perPage=Number.MAX_SAFE_INTEGER;update();root.querySelectorAll("details").forEach(d=>d.open=true);window.print()});
Promise.all((SOURCES[mode]||[]).map(async url=>{
 const response=await fetch(url);
 if(!response.ok)throw Error("HTTP "+response.status+" • "+url);
 const json=await response.json();
 if(!Array.isArray(json.items))throw Error("Fonte sem fichas: "+url);
 return json.items.map(entry=>({...entry,group:pathGroup[url]||"Arquivo"}));
})).then(all=>{
 entries=all.flat();
 if(entries.length!==({bestiario:129,deuses:2,catalogo:16}[mode]))throw Error("Quantidade inesperada de registros: "+entries.length);
 buildOptions();update();
}).catch(err=>{
 counter.textContent="Falha ao carregar o arquivo completo: "+err.message;
 root.replaceChildren(elem("p","Confira sua conexão e atualize a página. As fontes originais continuam disponíveis no repositório.","organ-empty"));
});
})();