/* Hurras RPG — arquivo organizado: preserva integralmente os textos do mestre. */
(()=>{"use strict";
const $=id=>document.getElementById(id);
const mode=document.body.dataset.archiveMode;
const root=$("organizedGrid"),query=$("organizedQuery"),group=$("organizedGroup"),level=$("organizedLevel"),sort=$("organizedSort"),counter=$("organizedCount"),more=$("organizedMore"),print=$("organizedPrint");
if(!mode||!root||!query||!group||!level||!sort||!counter||!more||!print)return;
const SOURCES={
 bestiario:["dados/criaturas.json","dados/ragnarok.json","dados/seres-adicionais.json","dados/essenciais-resgatados.json"],
 deuses:["dados/figuras-bestiario.json"],
 catalogo:["dados/adversarios.json","dados/documentos-nordicos.json"]
};
const pathGroup={"dados/criaturas.json":"Criaturas de Nexalis","dados/ragnarok.json":"Seres do Ragnarök","dados/seres-adicionais.json":"Seres adicionais do Ragnarök","dados/essenciais-resgatados.json":"Fichas essenciais resgatadas","dados/figuras-bestiario.json":"Figuras divinas","dados/adversarios.json":"Adversários especiais","dados/documentos-nordicos.json":"Eventos e referências"};
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

/* O trio principal preserva a nomenclatura e as pontuações realmente presentes no documento. */
const MAIN_RPG_GROUPS=[
 {id:"fisico",title:"💪 Físico",attrs:["Força","Destreza","Vigor"]},
 {id:"social",title:"🗣️ Social",attrs:["Empatia","Manipulação","Persuasão"]},
 {id:"mental",title:"🧠 Mental",attrs:["Percepção","Inteligência","Reação"]}
];
function mainStatsFrom(item){
 const all=extractSections(item.raw||"");
 const described=all.filter(s=>/^(?:atributos|atributo valor)$/i.test(normalize(s.heading)));
 const selected=described.length?described:all.filter(s=>normalize(s.heading)==="dados originais");
 const text=selected.flatMap(s=>s.lines).join("\n");
 const values=Object.create(null);
 for(const name of MAIN_RPG_GROUPS.flatMap(g=>g.attrs)){
  const direct=new RegExp("(?:^|\\n)\\s*(?:[-•]\\s*)?"+name+"\\s*:?\\s+(-?\\d+)\\b","iu");
  const reverse=new RegExp("(?:^|[^\\p{L}\\p{M}])(-?\\d+)[ \\t]+"+name+"(?=[\\s,.;]|$)","iu");
  const match=text.match(direct)||text.match(reverse);
  values[name]=match?Number(match[1]):null;
 }
 return values;
}
function mainAttrCards(item){
 const values=mainStatsFrom(item),grid=elem("div",null,"organ-main-attributes");
 grid.setAttribute("aria-label","Atributos físicos, sociais e mentais da ficha");
 for(const group of MAIN_RPG_GROUPS){
  const block=elem("section",null,"organ-main-group organ-main-"+group.id);
  block.append(elem("h4",group.title));
  for(const name of group.attrs){
   const row=elem("div",null,"organ-main-field");
   row.append(elem("span",name),elem("strong",values[name]===null?"—":String(values[name])));
   block.append(row);
  }
  grid.append(block);
 }
 return grid;
}


/* Organização das habilidades em três painéis, preservando pontuações documentadas. */
const MAIN_SKILL_GROUPS=[
 {id:"esquerda",title:"⚔️ Habilidades • esquerda",attrs:[
 ["Intimidação",["Intimidação"]],["Liderança",["Liderança"]],["Lábia",["Lábia"]],
 ["Bloqueio",["Bloqueio"]],["Esquiva",["Esquiva"]],["Briga",["Briga"]],
 ["Disparada",["Disparada"]],["Crítico",["Crítico"]],["Ocultismo",["Ocultismo"]]]},
 {id:"meio",title:"🏹 Habilidades • meio",attrs:[
 ["Adestramento",["Adestramento"]],["Ofício",["Ofício"]],["Conduta",["Conduta","Condução"]],
 ["Arma de distância",["Arma de distância","Armas à distância","Armas a Distância"]],
 ["Arma branca",["Arma branca","Armas brancas"]],
 ["Segurança",["Segurança"]],["Furtividade",["Furtividade"]],["Armadura",["Armadura"]],
 ["Investigação",["Investigação"]]]},
 {id:"direita",title:"📚 Habilidades • direita",attrs:[
 ["Acadêmico",["Acadêmico","Acadêmicos"]],["Geografia",["Geografia"]],
 ["Encantamento",["Encantamento","Encantamentos"]],["Selos",["Selos"]],
 ["Medicina",["Medicina"]],["Ciência",["Ciência","Ciências"]],
 ["Tecnologia",["Tecnologia"]],["Linguística",["Linguística"]],
 ["Sobrevivência",["Sobrevivência"]]]}
];
function readDocumentedSkills(item){
 const sections=extractSections(item.raw||"");
 const relevant=sections.filter(s=>/^(habilidades|talentos|pericias|conhecimentos)$/i.test(normalize(s.heading)));
 const text=relevant.flatMap(s=>s.lines).join("\n");
 const ascii=normalize(text),values=Object.create(null);
 for(const g of MAIN_SKILL_GROUPS)for(const [name,aliases]of g.attrs){
  let number=null;
  for(const alias of aliases){
   const n=normalize(alias);
   const direct=new RegExp("(?:^|\\n)\\s*(?:[-•]\\s*)?"+n+"\\s*:\\s*(-?\\d+)(?=[^\\d]|$)","iu");
   const reversed=new RegExp("(?:^|[^a-z])(-?\\d+)[ \\t]+"+n+"(?=[\\s,.;]|$)","iu");
   const match=ascii.match(direct)||ascii.match(reversed);
   if(match){number=Number(match[1]);break}
  }
  values[name]=number;
 }
 return values;
}
function documentedSkillsBoard(item){
 const stats=readDocumentedSkills(item),grid=elem("div",null,"organ-skills-columns");
 grid.setAttribute("aria-label","Habilidades organizadas em três colunas");
 for(const group of MAIN_SKILL_GROUPS){
  const column=elem("section",null,"organ-skills-column organ-skills-"+group.id);
  column.append(elem("h4",group.title));
  for(const [name]of group.attrs){
   const row=elem("div",null,"organ-skills-row");
   row.append(elem("span",name),elem("strong",stats[name]===null?"—":String(stats[name])));
   column.append(row);
  }
  grid.append(column);
 }
 return grid;
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
 const symbol=elem("span",item.group==="Figuras divinas"?"✦":item.group.includes("Ragnarök")?"🐉":item.group==="Eventos e referências"?"📜":item.group==="Adversários especiais"?"♜":"⚔","organ-cover-symbol");
 const cap=elem("small","Sem retrato específico cadastrado • "+item.group,"organ-cover-caption");
 div.setAttribute("role","img");div.setAttribute("aria-label","Emblema ilustrativo de "+(item.name||item.title));
 div.append(symbol,cap);return div;
}

/* Ficha de inimigo: leitura por prioridade no combate, sem mexer no texto de origem. */
const ENEMY_GROUPS=[
 ["combat","⚔️ Armas e ataques"],
 ["powers","🔮 Magias e técnicas"],
 ["passives","✨ Passivas, supremas e transformações"],
 ["defenses","🛡️ Resistências, fraquezas e elementos"],
 ["drops","🎁 Drops e recompensas"]
];
function enemyCategory(heading){
 const h=normalize(heading).trim();
 if(/^(ataques?|armas?|arma principal|equipamento de combate)/.test(h))return "combat";
 if(/^(magias|tecnicas|poderes|habilidades especiais|arvores de magia)/.test(h))return "powers";
 if(/^(passivas?|suprema|metamorfose|evolucao)/.test(h))return "passives";
 if(/^(resistencias?|fraquezas|elementos magicos)/.test(h))return "defenses";
 if(/^(drops?|recompensas?|equipamento)$/.test(h))return "drops";
 return null;
}
function enemySections(item,category){
 const original=extractSections(item.raw||"").filter(s=>enemyCategory(s.heading)===category);
 if(category==="combat"&&Array.isArray(item.abilities)&&item.abilities.length){
  return [{heading:"Golpes documentados",lines:item.abilities}];
 }
 if(category==="passives"&&Array.isArray(item.specials)&&item.specials.length){
  return [{heading:"Efeitos especiais",lines:item.specials},...original];
 }
 return original;
}
function enemyIdentity(raw,label){
 const m=String(raw||"").match(new RegExp("(?:^|\\n)\\s*"+label+"\\s*:\\s*([^\\n\\r]+)","iu"));
 return m?m[1].trim():"";
}
function enemyGroupCard(title,sections,id){
 const panel=elem("section",null,"organ-enemy-section organ-enemy-"+id);
 panel.append(elem("h4",title));
 if(!sections.length){panel.append(elem("p","Não informado na ficha original.","organ-enemy-unreported"));return panel}
 const list=elem("div",null,"organ-enemy-list");
 for(const section of sections){
  const entry=elem("article",null,"organ-enemy-entry");
  if(section.heading)entry.append(elem("strong",section.heading,"organ-enemy-entry-title"));
  const lines=elem("div",null,"organ-enemy-lines");
  for(const raw of section.lines){const line=String(raw).trim();if(line)lines.append(elem("p",line))}
  if(lines.children.length)entry.append(lines);
  list.append(entry);
 }
 panel.append(list);return panel;
}
function enemyCard(item){
 const card=elem("article",null,"organ-card organ-enemy-card");
 const header=elem("div",null,"organ-enemy-header");
 const figure=elem("div",null,"organ-enemy-figure");figure.append(portrait(item));
 const info=elem("div",null,"organ-enemy-info");
 info.append(elem("small",item.group+" • "+(Number.isInteger(item.level)?"Nível "+item.level:"Nível não informado"),"organ-tag"),elem("h3",item.name||item.title));
 const identity=elem("div",null,"organ-enemy-identity");
 for(const key of ["Raça","Classe","Função"]){
  const value=enemyIdentity(item.raw,key);
  if(value)identity.append(elem("span",key+": "+value));
 }
 if(identity.children.length)info.append(identity);
 const resources=elem("div",null,"organ-enemy-resources");
 for(const [label,value] of [["❤️ Vitalidade",item.life],["🔵 Mana",item.mana],["🔥 Força de Vontade",enemyIdentity(item.raw,"Força de Vontade")]]){
  if(value!==null&&value!==undefined&&value!=="")resources.append(elem("span",label+": "+value));
 }
 if(item.element)resources.append(elem("span","Elemento: "+item.element));
 if(resources.children.length)info.append(resources);
 header.append(figure,info);card.append(header);
 const sheet=elem("div",null,"organ-enemy-body");
 const attrs=elem("section",null,"organ-enemy-section");
 attrs.append(elem("h4","🧬 Atributos físicos, sociais e mentais"),mainAttrCards(item));
 sheet.append(attrs);
 const skills=elem("section",null,"organ-enemy-section");
 skills.append(elem("h4","🎯 Habilidades"),documentedSkillsBoard(item));
 sheet.append(skills);
 for(const [id,title] of ENEMY_GROUPS)sheet.append(enemyGroupCard(title,enemySections(item,id),id));
 const history=elem("section",null,"organ-enemy-section organ-enemy-history");
 history.append(elem("h4","📖 Descrição e habitat"));
 if(item.description)history.append(elem("p",escapeText(item.description),"organ-description"));
 if(item.habitat)history.append(elem("p","🌿 Habitat: "+escapeText(item.habitat),"organ-habitat"));
 const story=extractSections(item.raw||"").filter(x=>/^(descricao|habitat|historia)$/.test(normalize(x.heading)));
 if(!item.description&&!item.habitat&&story.length){
  for(const x of story)history.append(elem("pre",x.lines.join("\n").trim(),"organ-original"));
 }
 if(!item.description&&!item.habitat&&!story.length)history.append(elem("p","Não informados na ficha original.","organ-enemy-unreported"));
 sheet.append(history);card.append(sheet);
 const details=elem("details",null,"organ-full organ-enemy-full");
 details.append(elem("summary","📜 Todas as seções e transcrição original, sem cortes"));
 const contents=elem("div",null,"organ-full-sections");
 for(const section of extractSections(item.raw||"")){
  const segment=elem("section",null,"organ-full-section");
  segment.append(elem("h4",section.heading),elem("pre",section.lines.join("\n").trim(),"organ-original"));
  contents.append(segment);
 }
 const verbatim=elem("details",null,"organ-verbatim");
 verbatim.append(elem("summary","Ver texto original sem cortes"),elem("pre",item.raw||"","organ-original"));
 contents.append(verbatim);details.append(contents);card.append(details);
 return card;
}

function card(item){
 if(mode==="bestiario")return enemyCard(item);
 const art=elem("article",null,"organ-card");
 const top=elem("div",null,"organ-card-top");
 top.append(portrait(item));
 const side=elem("div",null,"organ-card-details");
 const tag=elem("span",item.group+" • "+(Number.isInteger(item.level)?"Nível "+item.level:"Documento"),"organ-tag");
 const title=elem("h3",item.name||item.title),meta=elem("p",null,"organ-stats");
 meta.textContent=[item.life?"❤ Vitalidade "+item.life:"",item.mana?"✦ Mana "+item.mana:""].filter(Boolean).join("   •   ");
 side.append(tag,title);
 if(meta.textContent)side.append(meta);
 if(mode==="bestiario"){
  side.append(mainAttrCards(item));
  side.append(elem("h4","🎯 Habilidades"));
  side.append(documentedSkillsBoard(item));
 }
 const description=escapeText(item.description||"");
 if(description){side.append(elem("h4","Descrição"),elem("p",description,"organ-description"))}
 else if(!Number.isInteger(item.level))side.append(elem("p","Documento complementar do compêndio nórdico; texto completo na ficha abaixo.","organ-description"));
 else side.append(elem("p","Descrição específica não identificada no documento original. Consulte a ficha integral abaixo.","organ-description"));
 if(item.habitat)side.append(elem("p","🌿 Habitat: "+escapeText(item.habitat),"organ-habitat"));
 if(item.element)side.append(elem("p","🔥 Elemento: "+item.element,"organ-habitat"));
 if(Array.isArray(item.abilities)&&item.abilities.length){
  side.append(elem("h4","⚔️ Ataques e técnicas"));
  const ul=elem("ul",null,"organ-power-list");
  for(const attack of item.abilities)ul.append(elem("li",attack));
  side.append(ul);
 }
 if(Array.isArray(item.specials)&&item.specials.length){
  side.append(elem("h4","✨ Poderes e passivas"));
  const ul=elem("ul",null,"organ-power-list organ-special-list");
  for(const special of item.specials)ul.append(elem("li",special));
  side.append(ul);
 }
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

/* Destaques selecionados do acervo enviado. Nenhuma ficha original é alterada. */
const HIGHLIGHTS=[
 ["norse-46","chefes","Chefe final do Ragnarök"],
 ["norse-45","chefes","Gigante primordial"],
 ["norse-49","chefes","Destruidor de deuses"],
 ["norse-50","chefes","Ameaça marítima de Midgard"],
 ["norse-47","chefes","Corrupção de Yggdrasil"],
 ["norse-48","chefes","Guardião de tesouro"],
 ["norse-54","chefes","Guardião de Helheim"],
 ["arquivo-essencial-cronos","lendas","Titã do tempo"],
 ["arquivo-essencial-gaia","lendas","Força primordial da natureza"],
 ["best-038","lendas","Dragão do silêncio"],
 ["best-033","lendas","Dragão do poder"],
 ["best-036","lendas","Fênix imortal"],
 ["best-027","lendas","Dragão do raio"],
 ["best-022","lendas","Dragão do fogo"],
 ["best-017","raros","Fênix com renascimento"],
 ["best-021","raros","Wyvern da tempestade"],
 ["best-049","raros","Guardião das florestas"],
 ["best-075","raros","Colosso das regiões geladas"],
 ["best-014","raros","Líder de slimes"],
 ["best-051","raros","Hidra da floresta"],
 ["ragnarok-ser-03","tropas","Valquíria caída"],
 ["ragnarok-ser-04","tropas","Guerreiro de Muspelheim"],
 ["ragnarok-ser-01","tropas","Morto de Helheim"]
];
const HIGHLIGHT_CATEGORY={
 chefes:"🔥 Chefes do Ragnarök",lendas:"🐉 Dragões e lendários",raros:"✨ Criaturas especiais",tropas:"⚔️ Tropas do fim"
};
const featuredRoot=$("organHighlightsGrid"),featuredCount=$("organHighlightsCount"),featuredTabs=$("organHighlightsTabs");
let featuredKind="chefes";
function strongestLine(item,kind){
 if(Array.isArray(item.abilities)&&item.abilities.length)return item.abilities[0];
 const segments=extractSections(item.raw||"");
 const pick=head=>segments.find(x=>head.test(normalize(x.heading)))?.lines.map(x=>x.trim()).filter(x=>x&&!/^(?:niv[eí]l|pagina)\s+\d+$/i.test(x));
 const candidates=[/suprema/,/magias|tecnicas|poderes/,/ataques/,/passivas?/];
 for(const pattern of candidates){
   const lines=pick(pattern);if(lines?.length)return lines[0].replace(/^[\s•-]+/,"");
 }
 return "";
}
function importantDrop(item){
 const sections=extractSections(item.raw||"");
 const drop=sections.find(x=>/^drops?$/.test(normalize(x.heading)));
 const first=drop?.lines.find(x=>x.trim().length>3);
 return first?.trim().replace(/^[\s•-]+/,"")||"";
}
function makeHighlighted(item,category,note){
 const shell=elem("article",null,"organ-highlight-card");
 const header=elem("div",null,"organ-highlight-head");
 const title=elem("h3",item.name||item.title),subtitle=elem("span",note,"organ-highlight-note");
 header.append(elem("small",HIGHLIGHT_CATEGORY[category],"organ-highlight-kind"),title,subtitle);
 const badges=elem("div",null,"organ-highlight-status");
 if(Number.isInteger(item.level))badges.append(elem("span","Nível "+item.level));
 if(item.life!==null&&item.life!==""&&item.life!==undefined)badges.append(elem("span","❤ "+item.life+" PV"));
 if(item.mana!==null&&item.mana!==""&&item.mana!==undefined)badges.append(elem("span","✦ "+item.mana+" Mana"));
 shell.append(header,badges);
 shell.append(mainAttrCards(item));
 shell.append(elem("h4","🎯 Habilidades","organ-highlight-skills-title"),documentedSkillsBoard(item));
 const impact=strongestLine(item,category);
 if(impact){
  const paragraph=elem("div",null,"organ-highlight-info");
  paragraph.append(elem("strong","⚔️ Poder ou ataque"),elem("p",impact));shell.append(paragraph);
 }
 const drop=importantDrop(item);
 if(drop){
  const paragraph=elem("div",null,"organ-highlight-info organ-highlight-drop");
  paragraph.append(elem("strong","🎁 Drop"),elem("p",drop));shell.append(paragraph);
 }
 const full=elem("details",null,"organ-highlight-original");
 full.append(elem("summary","📜 Abrir ficha integral sem cortes"));
 const content=elem("div",null,"organ-highlight-content");
 content.append(elem("pre",item.raw||"","organ-original"));
 const link=elem("button","🔎 Localizar na lista completa");
 link.type="button";
 link.addEventListener("click",()=>{
   query.value=item.name;
   group.value=item.group;
   level.value="";
   sort.value="original";
   perPage=18;update();
   root.scrollIntoView?.({behavior:"smooth",block:"start"});
 });
 content.append(link);full.append(content);
 shell.append(full);
 return shell;
}
function showHighlights(){
 if(!featuredRoot||!featuredCount||!featuredTabs)return;
 const selected=HIGHLIGHTS.filter(([id,kind])=>featuredKind==="todos"||kind===featuredKind);
 const collection=selected.map(([id,kind,note])=>{
  const item=entries.find(x=>x.id===id);
  return item?makeHighlighted(item,kind,note):null;
 }).filter(Boolean);
 featuredRoot.replaceChildren(...collection);
 featuredCount.textContent=collection.length+" destaques exibidos • "+HIGHLIGHTS.length+" selecionados do bestiário e do arquivo enviado.";
 featuredTabs.querySelectorAll("button[data-kind]").forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.kind===featuredKind)));
}
if(featuredTabs){
 featuredTabs.addEventListener("click",event=>{
  const button=event.target.closest("button[data-kind]");
  if(!button)return;
  featuredKind=button.dataset.kind;showHighlights();
 });
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
 if(mode==="catalogo")entries=entries.filter(it=>![55,56,57].includes(it.page));
 if(entries.length!==({bestiario:144,deuses:2,catalogo:13}[mode]))throw Error("Quantidade inesperada de registros: "+entries.length);
 buildOptions();update();showHighlights();
}).catch(err=>{
 counter.textContent="Falha ao carregar o arquivo completo: "+err.message;
 root.replaceChildren(elem("p","Confira sua conexão e atualize a página. As fontes originais continuam disponíveis no repositório.","organ-empty"));
});
})();