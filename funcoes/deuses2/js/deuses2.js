(function(){
"use strict";
const $=id=>document.getElementById(id),ui={sheetSearch:$("d2-sheet-search"),sheetCategory:$("d2-sheet-category"),sheetOrder:$("d2-sheet-order"),sheets:$("d2-sheets"),sheetCount:$("d2-sheet-count"),sheetMore:$("d2-sheet-more"),cultureSearch:$("d2-culture-search"),cultureSelect:$("d2-culture-select"),cultures:$("d2-cultures"),cultureCount:$("d2-culture-count"),cultureMore:$("d2-culture-more"),chapters:$("d2-chapters"),chronology:$("d2-chronology-list"),backupStatus:$("d2-backup-status")};
const KEY="hurras_deuses2_batalhas_v1";
let data=null,sheetLimit=14,cultureLimit=24,state={};
try{const existing=JSON.parse(localStorage.getItem(KEY)||"{}");if(existing&&typeof existing==="object"&&!Array.isArray(existing))state=existing}catch(e){}
const el=(tag,content,cls)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(content!==null&&content!==undefined)node.textContent=String(content);return node};
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){return false}}
function userState(c){if(!state[c.id]||typeof state[c.id]!=="object")state[c.id]={};const v=state[c.id];if(!v.points||typeof v.points!=="object")v.points={};if(!v.attributes||typeof v.attributes!=="object"||Array.isArray(v.attributes))v.attributes={...v.points};if(!v.modifiers||typeof v.modifiers!=="object")v.modifiers={physical:0,elemental:0};if(!v.resources||typeof v.resources!=="object")v.resources={};if(!Array.isArray(v.log))v.log=[];
 if(!v.skillLinks||typeof v.skillLinks!=="object"||Array.isArray(v.skillLinks))v.skillLinks={};
 if(!v.transformation||typeof v.transformation!=="object"||Array.isArray(v.transformation))v.transformation={active:null,forms:[]};
 if(!Array.isArray(v.transformation.forms))v.transformation.forms=[];
 return v}
function titlePane(name){const pane=el("div",null,"d2-pane");pane.append(el("h3",name));return pane}
function log(c,label,type,notify){const s=userState(c);s.log.unshift({time:new Date().toISOString(),text:String(label).slice(0,750),type:type||"ação"});s.log=s.log.slice(0,250);save();if(notify)notify()}
function dice(expr){const all=[...String(expr).matchAll(/\b(\d+)d(6|8|10|12|20)\b/gi)];if(!all.length)return null;return all.map(m=>({count:Number(m[1]),sides:Number(m[2])}))}
function roll(c,line,label,notify){const ds=dice(line);if(!ds)return;
 const rolls=[];let total=0;
 for(const set of ds){const values=[];for(let i=0;i<Math.min(500,set.count);i++){const n=1+Math.floor(Math.random()*set.sides);values.push(n);total+=n;}rolls.push(set.count+"d"+set.sides+": "+values.join(", "));}
 const message=label+" — "+line+" | Total: "+total+" | "+rolls.join(" / ");
 log(c,message,"rolagem",notify);return total;
}
function pointsWidget(c,onEdit){
 const s=userState(c),panel=el("section",null,"d2-battle");
 panel.append(el("h3","✍️ Editar atributos, habilidades e status"),
  el("p","Os valores originais aparecem como ponto de partida. Edite qualquer campo: as alterações são aplicadas ao personagem, salvas imediatamente neste navegador e incluídas no PDF. Campos vazios continuam sem valor informado.","d2-battle-intro"));
 const wrap=el("div",null,"d2-battle-grid"),left=el("div",null,"d2-battle-column"),right=el("div",null,"d2-battle-column");
 const status=el("p","", "d2-log-status"),list=el("ol",null,"d2-log-list");
 function changed(){const saved=save();status.textContent=saved?"✓ Ficha salva automaticamente; status e PDF atualizados.":"Não foi possível salvar no navegador. Exporte o PDF para guardar a ficha.";onEdit?.()}
 function beginVal(key){
  if(Object.prototype.hasOwnProperty.call(s.attributes,key))return s.attributes[key];
  return d2OfficialValue(c,key);
 }
 left.append(el("h4","Atributos, talentos, perícias e conhecimentos"));
 data.fields.forEach((g,ix)=>{
  const block=el("details",null,"d2-attr-group");block.open=ix<3;
  block.append(el("summary",g.label+" • "+g.keys.length+" campos"));
  const grid=el("div",null,"d2-attr-grid");
  g.keys.forEach(key=>{
   const row=el("label",null,"d2-attr-row"),field=el("input"),initial=beginVal(key);
   field.type="number";field.inputMode="numeric";field.step="1";field.min="0";field.max="9999";
   field.placeholder="—";field.setAttribute("aria-label",key+" de "+c.name);
   if(initial!==null&&initial!==undefined)field.value=String(initial);
   let prior=initial;
   field.addEventListener("input",()=>{
     const raw=field.value.trim(),number=raw===""?null:Number(raw);
     if(number!==null&&(!Number.isSafeInteger(number)||number<0||number>9999)){status.textContent="Use um valor inteiro de 0 a 9999.";return}
     if(number===null)delete s.attributes[key];else s.attributes[key]=number;
     changed();
   });
   field.addEventListener("change",()=>{
     const current=beginVal(key);
     if(current!==prior){log(c,key+": "+(prior??"—")+" → "+(current??"—"),"atributo",refresh);prior=current}
   });
   const title=el("span",key,"d2-point-name"),official=d2OfficialValue(c,key);
   if(official!==null)title.append(el("small","Original: "+official,"d2-point-original"));
   row.append(title,field);grid.append(row);
  });
  block.append(grid);left.append(block);
 });
 right.append(el("h4","Vitalidade, Mana e bônus de dano"));
 const resources=el("div",null,"d2-resource-grid");
 for(const [key,label,base]of [["life","Vitalidade atual",c.vitality],["mana","Mana atual",c.mana]]){
  const box=el("label"),input=el("input");
  input.type="number";input.min="0";input.max="100000000";input.step="1";input.inputMode="numeric";input.placeholder="Não informado";
  const initial=Object.prototype.hasOwnProperty.call(s.resources,key)?s.resources[key]:base;
  input.value=initial??"";let prior=initial;
  input.addEventListener("input",()=>{
   const raw=input.value.trim(),number=raw===""?null:Number(raw);
   if(number!==null&&(!Number.isSafeInteger(number)||number<0||number>100000000)){status.textContent="Valor de recurso inválido.";return}
   if(number===null)delete s.resources[key];else s.resources[key]=number;
   changed();
  });
  input.addEventListener("change",()=>{const v=Object.prototype.hasOwnProperty.call(s.resources,key)?s.resources[key]:base;if(v!==prior){log(c,label+": "+(prior??"—")+" → "+(v??"—"),"recurso",refresh);prior=v}});
  box.append(el("span",label),input);resources.append(box);
 }
 right.append(resources);
 const bonusInfo=el("p","Bônus opcionais em d10. Informe apenas os dados extras que você quer aplicar; Força e outros atributos não mudam o dano automaticamente sem uma regra definida.","d2-battle-intro");
 right.append(bonusInfo);
 const bonusGrid=el("div",null,"d2-resource-grid");
 for(const [key,label]of [["physical","Dano físico extra (+d10)"],["elemental","Dano mágico/elemental extra (+d10)"]]){
  const box=el("label"),input=el("input");input.type="number";input.min="0";input.max="1000";input.step="1";input.inputMode="numeric";
  input.value=String(s.modifiers[key]||0);let prior=Number(s.modifiers[key]||0);
  input.addEventListener("input",()=>{
   const n=Number(input.value.trim());
   if(input.value.trim()===""||!Number.isSafeInteger(n)||n<0||n>1000){status.textContent="Informe um bônus inteiro de 0 a 1000 d10.";return}
   s.modifiers[key]=n;changed();
  });
  input.addEventListener("change",()=>{const now=Number(s.modifiers[key]||0);if(now!==prior){log(c,label+": "+prior+" → "+now,"bônus de dano",refresh);prior=now}});
  box.append(el("span",label),input);bonusGrid.append(box);
 }
 right.append(bonusGrid);
 const note=el("textarea",null,"d2-log-note");note.rows=2;note.maxLength=750;note.placeholder="Ex.: usou a suprema, sofreu dano, protegeu aliado...";
 const add=el("button","Registrar evento"),clear=el("button","Limpar histórico","secondary"),reset=el("button","Restaurar valores originais","secondary"),actions=el("div",null,"d2-log-actions");
 function refresh(){
  list.replaceChildren();
  if(!s.log.length){list.append(el("li","Nenhum evento registrado."));return}
  s.log.forEach(e=>{const li=el("li"),time=new Date(e.time);
   li.append(el("small",(Number.isNaN(+time)?"":time.toLocaleString("pt-BR"))+" • "+e.type),el("div",e.text));list.append(li)})
 }
 add.type="button";add.addEventListener("click",()=>{if(!note.value.trim()){status.textContent="Digite o acontecimento.";return}log(c,note.value.trim(),"ação do Mestre",refresh);note.value="";status.textContent="Evento registrado."});
 clear.type="button";clear.addEventListener("click",()=>{if(!s.log.length)return;if(confirm("Apagar somente o histórico de "+c.name+"?")){s.log=[];save();refresh();status.textContent="Histórico apagado. Atributos mantidos."}});
 reset.type="button";reset.addEventListener("click",()=>{if(!confirm("Restaurar os atributos, recursos e bônus originais de "+c.name+"? O histórico de batalha será mantido."))return;
  s.attributes={};s.points={};s.resources={};s.modifiers={physical:0,elemental:0};s.skillLinks={};s.transformation={active:null,forms:[]};log(c,"Atributos e recursos restaurados aos valores originais.","restauração",refresh);
  renderSheets();const updated=document.getElementById(c.id);if(updated)updated.open=true;
 });
 actions.append(add,clear,reset);
 right.append(el("h4","Histórico de ações"),el("label","Registrar evento de combate","d2-log-label"),note,actions,status,list);
 refresh();wrap.append(left,right);panel.append(wrap);
 return {panel,refresh,status};
}

/* Organização visual sem alterações nos valores das fichas originais. */
const D2_ATTR=[
 {id:"fisico",title:"💪 Atributos físicos",names:["Força","Destreza","Vigor"]},
 {id:"mental",title:"🧠 Atributos mentais",names:["Percepção","Inteligência","Reação","Força de Vontade"]},
 {id:"social",title:"🗣️ Atributos sociais",names:["Empatia","Manipulação","Persuasão","Carisma","Aparência","Lábia"]},
 {id:"magico",title:"✨ Níveis mágicos e especialidades",names:["Magia","Sagrado","Raio","Luz","Água","Vento","Natureza","Morte","Gelo","Trevas","Fogo","Terra","Veneno","Fúria"]},
 {id:"talentos",title:"⚔️ Talentos de combate",names:["Intimidação","Liderança","Manha","Esquiva","Briga","Investida","Crítico","Bloqueio","Avaliação","Disparada"]},
 {id:"pericias",title:"🏹 Perícias e habilidades práticas",names:["Animais","Adestramento","Ofício","Condução","Armas 1H","Armas brancas","Armas à distância","Segurança","Furtividade","Armadura","Investigação","Sobrevivência"]},
 {id:"conhecimentos",title:"📖 Conhecimentos",names:["Ocultação","Ocultismo","Acadêmicos","Geografia","Encantamento","Selos","Medicina","Ciências","Tecnologia","Linguística"]},
 {id:"resistencias",title:"🛡️ Resistências",names:["Resistência Física","Resistência Mágica","Resistência Fogo","Resistência Água/Gelo","Resistência Vento","Resistência Terra/Natureza","Resistência Raio","Resistência Veneno","Resistência Mental","Resistência Sagrado","Resistência Sombra"]},
 {id:"outros",title:"📋 Outros atributos documentados",names:[]}
];
const D2_ABILITIES=[
 {id:"ataques",title:"⚔️ Ataques e golpes",hint:"Golpes e danos conforme a fonte"},
 {id:"tecnicas",title:"🎯 Técnicas e habilidades de combate",hint:"Manobras, defesas e recursos especiais"},
 {id:"magias",title:"🔮 Magias, habilidades mentais e poderes",hint:"Efeitos mágicos, suporte e habilidades especiais"},
 {id:"supremas",title:"👑 Habilidades supremas",hint:"Golpes e efeitos de maior impacto"},
 {id:"passivas",title:"♾️ Habilidades passivas",hint:"Efeitos permanentes e condições especiais"},
 {id:"drops",title:"🎁 Drops e recompensas",hint:"Itens informados pelo autor"},
 {id:"outros",title:"📌 Outras ações da ficha",hint:"Detalhes adicionais do documento"}
];
function d2Clean(line){return String(line||"").replace(/^[^\p{L}\d]+/u,"").trim()}
function d2Heading(line){
 const s=d2Clean(line),t=norm(s);
 if(/^(?:atributos|niveis magicos):?$/.test(t))return "dados";
 if(/^bonus:?$/.test(t))return "bonus";
 if(/^(?:poderes|magias|habilidades(?: especiais)?)(?:\s*\/.*)?$/.test(t))return "magias";
 if(/^(?:magias e tecnicas|magias ?\/ ?tecnicas|magias & tecnicas)$/.test(t))return "tecnicas";
 if(/^(?:tecnicas)(?:\s*\/.*)?$/.test(t))return "tecnicas";
 if(/^(?:ataques)(?:\s*\/.*)?$/.test(t))return "ataques";
 if(/^suprema(?:\s|$)/.test(t))return "supremas";
 if(/^passiva(?:\s|$)/.test(t))return "passivas";
 if(/^(?:drop|drops|recompensas)(?:\s|$)/.test(t))return "drops";
 return null;
}
function d2WeaponName(line){
 const plain=d2Clean(line),fold=norm(plain);
 if(!/^(?:espadas?|laminas?|lancas?|arcos?|cajados?|escudos?|machados?|martelos?|marretas?|adagas?|tridentes?|garras?|botas?|hrafnr|hofund|gungnir|mjolnir)(?:\s|:|$)/i.test(fold))return null;
 const m=plain.match(/^(.+?):\s*(.+)$/u);
 if(m){
   if(!/^\d+d(?:6|8|10|12|20)\b|^\+\d|defesa|bloqueio/i.test(m[2]))return null;
   return {name:m[1],first:m[2]};
 }
 if(/\b\d+d(?:6|8|10|12|20)\b/i.test(plain))return null;
 return {name:plain,first:null};
}
function d2Stat(line){
 const plain=d2Clean(line);
 const m=plain.match(/^([\p{L}\p{M}\s]+?)\s*(?::\s*|\s+)(\d+)$/u);
 if(!m)return null;
 const title=m[1].trim(),standard=norm(title);
 const bucket=D2_ATTR.find(g=>g.id!=="outros"&&g.names.some(n=>norm(n)===standard));
 if(!bucket && /^(?:vitalidade|mana)$/.test(standard))return {id:"recurso",label:title,value:m[2],original:line};
 if(!bucket && !/^[\p{L}\p{M}\s]{2,50}$/u.test(title))return null;
 return {id:bucket?.id||"outros",label:title,value:m[2],original:line};
}
function d2Split(c){
 const sections=Object.fromEntries(D2_ATTR.map(g=>[g.id,[]]));
 const abilities=Object.fromEntries(D2_ABILITIES.map(g=>[g.id,[]]));
 const weapons=[],misc=[],resources=[];let mode="dados",weapon=null,subrecord=false;
 for(const line of c.stats){
   const clean=d2Clean(line),heading=d2Heading(line);
   if(heading){
     if(heading==="bonus"){
       if(mode==="arma"&&weapon)weapon.lines.push(line);
       else misc.push(line);
     }else if(heading==="dados"){mode="dados";weapon=null;subrecord=false;}
     else{mode=heading;weapon=null;}
     continue;
   }
   const w=d2WeaponName(line);
   if(w){weapon={name:w.name,lines:w.first?[w.first]:[]};weapons.push(weapon);mode="arma";subrecord=false;continue}
   if(mode==="arma"&&weapon){weapon.lines.push(line);continue}
   if(mode==="magias"||mode==="tecnicas"||mode==="ataques"||mode==="supremas"||mode==="passivas"||mode==="drops"){abilities[mode].push(line);continue}
   if(/^[^\p{L}]*JÖRMUNGANDR$/u.test(line)||/^[^\p{L}]*JORMUNGANDR$/u.test(line)){subrecord=true;misc.push(line);continue}
   const stat=d2Stat(line);
   if(stat){
     if(subrecord){misc.push(line);continue}
     if(stat.id==="recurso"){resources.push(stat.original);continue}
     if(!sections[stat.id].includes(stat.original))sections[stat.id].push(stat.original);
     continue;
   }
   if(clean!=="Bônus:"&&clean!=="Bônus")misc.push(line);
 }
 let actionMode="outros";
 for(const line of c.actions){
   const head=d2Heading(line);
   if(head){actionMode=head;if((head==="supremas"||head==="passivas")&&/[-—–:]\s*\S/.test(d2Clean(line))){abilities[actionMode].push(line);}continue}
   abilities[actionMode].push(line);
 }
 return {sections,weapons,abilities,misc,resources};
}
function d2OfficialValue(c,key){
  for(const line of c.stats||[]){
    const parsed=d2Stat(line);
    if(parsed&&norm(parsed.label)===norm(key))return Number(parsed.value);
  }
  return null;
}
function d2FormBonus(c,key){
 const selected=d2Live().currentForm(userState(c));
 const raw=selected?.bonuses?.[key];
 const n=d2Live().integer(raw);
 return n??0;
}
function d2EffectiveValue(c,key){
 const s=userState(c),base=Object.prototype.hasOwnProperty.call(s.attributes,key)?s.attributes[key]:d2OfficialValue(c,key);
 if(base===null||base===undefined)return null;
 return Number(base)+d2FormBonus(c,key);
}
function d2ResourceValue(c,key){
 const s=userState(c);return Object.prototype.hasOwnProperty.call(s.resources,key)?s.resources[key]:(key==="life"?c.vitality:c.mana);
}
function d2SourceSection(parent,title,lines,c){
 if(!lines?.length)return;
 const section=el("section",null,"d2-trait-block");
 section.append(el("h4",title));
 const rows=el("div",null,"d2-trait-rows");
 for(const line of lines){
  const item=d2Stat(line),row=el("div",null,"d2-trait-row");
  if(item&&item.id!=="recurso"){
    const actual=d2EffectiveValue(c,item.label);
    const label=el("span",item.label),number=el("strong",actual??item.value);
    row.append(label,number);
    const bonus=d2FormBonus(c,item.label),base=d2OfficialValue(c,item.label);
    const edited=Object.prototype.hasOwnProperty.call(userState(c).attributes,item.label);
    if(actual!==null&&(Number(actual)!==Number(item.value)||edited)){
      row.classList.add("d2-overridden");
      row.append(el("small","Original: "+item.value,"d2-trait-original"));
    }
    if(bonus>0)row.append(el("small","🜂 Forma: +"+bonus+"d10 sobre "+(edited?userState(c).attributes[item.label]:base),"d2-trait-transform"));
  }else row.append(el("span",line,"d2-trait-text"));
  rows.append(row);
 }
 section.append(rows);parent.append(section);
}
function d2ExtraAttributes(c,parsed){
 const more=el("section",null,"d2-extra-traits");
 more.append(el("h4","✏️ Atributos adicionais preenchidos"));
 const known=new Set(Object.values(parsed.sections).flatMap(lines=>lines.map(line=>d2Stat(line)?.label).filter(Boolean)).map(norm));
 let any=false;
 for(const g of data.fields){
  const subset=g.keys.filter(key=>!known.has(norm(key))&&Object.prototype.hasOwnProperty.call(userState(c).attributes,key));
  if(!subset.length)continue;
  any=true;const block=el("div",null,"d2-extra-attr-group");
  block.append(el("h5",g.label));
  const list=el("div",null,"d2-trait-rows");
  for(const key of subset){
    const row=el("div",null,"d2-trait-row d2-overridden");
    row.append(el("span",key),el("strong",d2EffectiveValue(c,key)));
    const bonus=d2FormBonus(c,key);
    if(bonus>0)row.append(el("small","🜂 Forma: +"+bonus+"d10","d2-trait-transform"));
    list.append(row);
  }
  block.append(list);more.append(block);
 }
 if(!any)more.append(el("p","Preencha os campos sem valor na seção de edição; eles aparecerão aqui automaticamente.","d2-empty"));
 return more;
}

const D2_DAMAGE_TYPES=[
 ["fisico","físico"],["magico","mágico"],["raio","raio"],["eletrico","elétrico"],["sagrado","sagrado"],["fogo","fogo"],
 ["gelo","gelo"],["luz","luz"],["trevas","trevas"],["morte","morte"],["veneno","veneno"],["agua","água"],
 ["natureza","natureza"],["terra","terra"],["vento","vento"],["sombra","sombra"]
];
function d2DamageType(text){
 const t=norm(text);for(const [key,label] of D2_DAMAGE_TYPES){if(new RegExp("\\b"+key+"\\b","i").test(t))return label;}
 return "dano não classificado";
}
function d2DamageDice(text){
 const rx=/(\d+)d(6|8|10|12|20)\s*(?:dano\s+(?:de\s+)?)?(f[ií]sico|m[aá]gico|raio|el[eé]trico|sagrado|fogo|gelo|luz|trevas|morte|veneno|[aá]gua|natureza|terra|vento|sombra)/giu;
 return [...String(text).matchAll(rx)].map(m=>({count:Number(m[1]),sides:Number(m[2]),type:d2DamageType(m[3])}));
}
function d2IsDamageBonus(line){
 const t=norm(d2Clean(line));return /\b(?:dano|danos)\b/i.test(t)&&/\+\s*\d+d(?:6|8|10|12|20)\b/i.test(t);
}
function d2DamageBonuses(lines){
 const found=[];
 for(const original of lines){
   if(!d2IsDamageBonus(original))continue;
   const rx=/\+\s*(\d+)d(6|8|10|12|20)\b/gi;
   for(const m of String(original).matchAll(rx)){
     const name=d2DamageType(original);
     found.push({count:Number(m[1]),sides:Number(m[2]),type:name,original});
   }
 }
 return found;
}
function d2WeaponDamage(w){
 const basics=[];
 for(const line of w.lines){
   if(d2IsDamageBonus(line)||/^\s*\+/.test(d2Clean(line)))continue;
   basics.push(...d2DamageDice(line));
 }
 return {basics,bonuses:d2DamageBonuses(w.lines)};
}
function d2Sums(parts){
 const arr=[];const map=new Map();
 for(const p of parts){
  const key=p.sides+"_"+p.type;
  if(!map.has(key)){const it={count:0,sides:p.sides,type:p.type};map.set(key,it);arr.push(it)}
  map.get(key).count+=p.count;
 }
 return arr;
}
function d2Formula(parts){
 return d2Sums(parts).map(x=>x.count+"d"+x.sides+" "+x.type).join(" + ");
}
function d2Range(parts){
 let min=0,max=0,mean=0;
 for(const x of parts){min+=x.count;max+=x.count*x.sides;mean+=x.count*(x.sides+1)/2}
 const format=v=>Number.isInteger(v)?String(v):v.toLocaleString("pt-BR",{maximumFractionDigits:1});
 return "Mín. "+format(min)+" • Média "+format(mean)+" • Máx. "+format(max);
}
function d2Variants(basics,bonuses){
 if(!basics.length)return [];
 const res=[{name:"Ataque normal • sem bônus",parts:basics.slice(),explanation:"Dano base declarado para a arma."}];
 const grouped=[
  {name:"Com bônus físico",test:x=>x.type==="físico",explanation:"Somente bônus explicitamente descritos como dano físico."},
  {name:"Com bônus elemental/mágico",test:x=>x.type!=="físico"&&x.type!=="dano não classificado",explanation:"Somente bônus de dano com tipo elemental ou mágico."}
 ];
 for(const item of grouped){
  const selected=bonuses.filter(item.test);if(selected.length)res.push({name:item.name,parts:[...basics,...selected],explanation:item.explanation});
 }
 if(bonuses.length)res.push({name:"Com todos os bônus diretos da arma",parts:[...basics,...bonuses],explanation:bonuses.some(x=>x.type==="dano não classificado")?"Inclui bônus genérico sem atribuir tipo de dano; sua aplicação depende do Mestre.":"Combinação teórica dos bônus de dano diretos da arma; não acrescentar novamente a golpes que já contenham esses bônus."});
 return res;
}
function d2WeaponSection(c,weapons,notify){
 const display=el("section",null,"d2-weapon-section");display.id="d2-arsenal-"+c.id;
 display.append(el("div","⚔ ARSENAL DO PERSONAGEM","d2-weapon-kicker"),el("h3","🗡️ Armas, ataque normal e variações de dano"));
 const collection=el("div",null,"d2-weapons");
 if(!weapons.length){
   const empty=el("div",null,"d2-weapon-card");
   empty.append(el("h4","Ataque normal sem arma declarada"),el("p","Esta ficha não informa o dano base de uma arma. Consulte os golpes originais na seção de ataques — eles não foram renomeados como golpes normais.","d2-weapon-empty"));
   const actions=c.actions||[];
   const first=actions.find(x=>d2DamageDice(x).length>0);
   if(first)empty.append(el("p","Primeiro dano registrado entre as técnicas: "+first,"d2-weapon-note"));
   collection.append(empty);
 }else{
   for(const [i,w] of weapons.entries()){
     const card=el("article",null,"d2-weapon-card");
     const top=el("small",i===0?"EQUIPAMENTO PRINCIPAL":"EQUIPAMENTO "+(i+1));
     card.append(top,el("h4",w.name));
     const damage=[],other=[];
     for(const line of w.lines){
       if(d2DamageDice(line).length&&!d2IsDamageBonus(line))damage.push(line);else other.push(line);
     }
     const damageGrid=el("div",null,"d2-weapon-damage");
     for(const line of damage)damageGrid.append(el("span",line,"d2-damage-pill"));
     if(damage.length)card.append(damageGrid);
     if(other.length){
       card.append(el("div","Bônus • alcance • efeitos","d2-weapon-subhead"));
       const list=el("div",null,"d2-weapon-effects");
       other.forEach(t=>list.append(el("div",t,"d2-weapon-effect")));
       card.append(list);
     }
     const summary=d2WeaponDamage(w),variants=d2Variants(summary.basics,summary.bonuses);
     const manual=userState(c).modifiers||{};
     if(summary.basics.length&&(Number(manual.physical||0)>0||Number(manual.elemental||0)>0)){
       const extras=[];
       if(Number(manual.physical||0)>0)extras.push({count:Number(manual.physical),sides:10,type:"físico"});
       const element=summary.basics.find(x=>x.type!=="físico");
       if(Number(manual.elemental||0)>0&&element)extras.push({count:Number(manual.elemental),sides:10,type:element.type});
       if(extras.length)variants.push({name:"Com bônus manuais da ficha",parts:[...summary.basics,...summary.bonuses,...extras],explanation:"Variação manual; os bônus selecionados foram adicionados à arma. Não aplique duas vezes a golpes cujo dano já inclua bônus."});
     }
     const compare=el("div",null,"d2-damage-variants");
     compare.append(el("h5","🎲 Comparação do ataque normal"));
     if(!variants.length){
       compare.append(el("p","Dano base não informado para este equipamento. Os bônus permanecem listados acima, mas não foi inventado um ataque normal.","d2-weapon-empty"));
     }else{
       for(const v of variants){
         const item=el("div",null,"d2-variation");
         const header=el("div",null,"d2-variation-header");
         header.append(el("strong",v.name));
         const formula=d2Formula(v.parts);
         const button=el("button","🎲 Rolar");button.type="button";
         const output=el("output","","d2-variation-roll");
         button.addEventListener("click",()=>{
           const val=roll(c,formula,w.name+" — "+v.name,notify);
           output.textContent=val===undefined?"Sem dados para rolar":"Rolagem: "+val;
         });
         header.append(button);
         item.append(header,el("p",formula,"d2-variation-formula"),el("small",d2Range(v.parts),"d2-variation-range"),el("p",v.explanation,"d2-variation-hint"),output);
         compare.append(item);
       }
     }
     card.append(compare);collection.append(card);
   }
 }
 display.append(collection);
 if(weapons.length)display.append(el("p","Os cálculos distinguem dano base e bônus diretos da arma. Bônus de atributo (Força, Reação etc.) não são convertidos em dano. Golpes já calculados na fonte não recebem bônus adicionais automaticamente.","d2-weapon-note"));
 return display;
}
function d2PdfVariants(w,stored){
 const summary=d2WeaponDamage(w),variants=d2Variants(summary.basics,summary.bonuses),manual=stored.modifiers||{};
 if(summary.basics.length&&(Number(manual.physical||0)>0||Number(manual.elemental||0)>0)){
  const extra=[];
  if(Number(manual.physical||0)>0)extra.push({count:Number(manual.physical),sides:10,type:"físico"});
  const element=summary.basics.find(x=>x.type!=="físico");
  if(Number(manual.elemental||0)>0&&element)extra.push({count:Number(manual.elemental),sides:10,type:element.type});
  if(extra.length)variants.push({name:"Com bônus manuais da ficha",parts:[...summary.basics,...summary.bonuses,...extra]});
 }
 return variants.map(v=>({name:v.name,formula:d2Formula(v.parts),range:d2Range(v.parts)}));
}
function d2ConditionalBuffs(c){
 const lines=[...(c.stats||[]),...(c.actions||[])],found=[];
 let current="";
 for(const line of lines){
  if(d2IsDamageBonus(line)){
    if(!found.some(x=>x.text===line))found.push({label:current||"Bônus declarado",text:line});
  }else if(!/\b\d+d(?:6|8|10|12|20)\b/i.test(line)&&d2Clean(line).length>=4&&line.length<90&&!d2Heading(line)){
    current=line;
  }
 }
 return found;
}
function d2BuffsSection(c){
 const found=d2ConditionalBuffs(c);
 if(!found.length)return null;
 const section=el("details",null,"d2-buffs-section");
 section.append(el("summary","⚡ Bônus de dano e condições ("+found.length+")"));
 section.append(el("p","Valores transcritos do material do personagem. Buffs, fúria e efeitos condicionais não foram somados automaticamente: confira a duração, o custo e se o bônus já está incluído no golpe.","d2-buffs-note"));
 const list=el("div",null,"d2-buff-list");
 for(const x of found){const card=el("div",null,"d2-buff-item");card.append(el("strong",x.label),el("p",x.text));list.append(card)}
 section.append(list);return section;
}
function d2Historical(c){
 const versions=[];
 if(data.previousVersions?.[c.name])versions.push(data.previousVersions[c.name]);
 if(data.previousCompendium?.[c.name])versions.push(data.previousCompendium[c.name]);
 if(!versions.length)return null;
 const group=el("section",null,"d2-history-collection");
 const heading=el("div",null,"d2-history-title");
 heading.append(el("h3","📚 Arquivo histórico e versões anteriores"),el("p","Material integral enviado anteriormente. Cada edição é independente da ficha principal, para preservar habilidades, atributos, golpes e recompensas sem criar combinações contraditórias."));
 group.append(heading);
 for(const h of versions){
  const wrap=el("details",null,"d2-historical");
  wrap.append(el("summary","📚 "+h.title));
  wrap.append(el("p","Fonte: "+h.source,"d2-historical-source"),el("p",h.note,"d2-historical-warning"));
  const blocks=el("div",null,"d2-historical-blocks");
  const paragraphs=h.text.split(/\n\s*\n/g).map(x=>x.trim()).filter(Boolean);
  for(const part of paragraphs){
    const block=el("article",null,"d2-historical-block");
    const lines=part.split("\n").map(x=>x.trim()).filter(Boolean);
    const first=lines[0]||"";
    const heading=lines.length>1&&first.length<=65;
    if(heading)block.append(el("h5",first));
    block.append(el("pre",heading?lines.slice(1).join("\n"):part));
    blocks.append(block);
  }
  wrap.append(blocks);group.append(wrap);
 }
 return group;
}
/* Apresentação em cartões: cada poder conserva seu nome, efeitos e dados de origem. */
function d2AbilityEntries(lines,group){
 const cards=[];let current=null;
 const begin=(title,raw)=>{current={title,lines:[],raw:[raw]};cards.push(current)};
 for(const original of lines){
  const line=String(original),plain=d2Clean(line);
  const namedSpecial=(group.id==="supremas"||group.id==="passivas")?
   plain.match(/^(?:SUPREMA|PASSIVA)\s*[-–—:]\s*(.+)$/iu):null;
  if(namedSpecial){begin(namedSpecial[1].trim(),line);continue}
  const inline=plain.match(/^([^—–]{3,75}?)\s+[—–]\s+(.+)$/u);
  if(inline&&!/^\d/.test(inline[1])){
   begin(inline[1].trim(),line);current.lines.push(inline[2].trim());continue;
  }
  const hasDice=Boolean(dice(line)),emoji=/^[^\p{L}\d]/u.test(line.trim()),
   punctuation=/[.,;:!?]$/.test(plain);
  const verb=/\b(?:recebe|podem?|possui|escolhe|ataca|impede|reduz|causa|cura|recupera|ganha|passa|perde|sofre|tem|atinge|aplica|ignora|revela|cria|move|retorna|teleporta|durante|quando|sempre|permite|controla|avança|aumenta|diminui|mantém|protege|inimigos|aliados|alvo|abaixo)\b/iu.test(plain);
  const heading=!hasDice&&!emoji&&!punctuation&&!verb&&plain.length>=3&&plain.length<=65&&/^\p{Lu}/u.test(plain);
  if(heading){begin(plain,line);continue}
  if(!current)begin(group.title,line);
  current.lines.push(line);
  if(current.raw.at(-1)!==line)current.raw.push(line);
 }
 return cards;
}

/* Transformações configuráveis e vínculo entre atributos e dados dos golpes. */
function d2Live(){return window.HurrasDadosVivos}
function d2AbilityKey(c,group,entryIndex,lineIndex){return c.id+"|"+group.id+"|"+entryIndex+"|"+lineIndex}
function d2ResolveSkill(c,line,key){
 const engine=d2Live();return engine.resolve(line,userState(c),key,attr=>d2OfficialValue(c,attr));
}
function d2TransformationHints(c){
 const lines=[...(c.actions||[]),...(c.stats||[])],found=[];
 for(const line of lines){
  const title=d2Clean(line).split(/[—–:]/)[0].trim();
  if(title.length>=6&&title.length<60&&/\b(furia|forma|despertar|transformacao|ascensao|sangue de|modo divino|ira de)\b/iu.test(norm(title))&&!found.includes(title))found.push(title);
 }
 return found.slice(0,8);
}
function d2TransformationPanel(c,onUpdate){
 const saved=userState(c),model=saved.transformation,engine=d2Live();
 const wrap=el("details",null,"d2-transform-panel"),summary=el("summary"),body=el("div",null,"d2-transform-body");
 const heading=el("strong","🜂 Transformações e bônus d10"),activeLabel=el("span","","d2-transform-active");
 summary.append(heading,activeLabel);wrap.append(summary,body);
 const help=el("p","Crie as formas do seu deus e informe os bônus em dados d10. A forma Normal não acrescenta nada. Formas sugeridas pelo documento servem apenas como nomes: os bônus não são inventados.","d2-transform-help");body.append(help);
 const controls=el("div",null,"d2-transform-toolbar"),picker=el("select"),nameInput=el("input"),addBtn=el("button","＋ Criar transformação"),removeBtn=el("button","Excluir forma","secondary");
 nameInput.placeholder="Nome da forma, ex.: Fúria Divina";nameInput.maxLength=60;
 addBtn.type="button";removeBtn.type="button";picker.setAttribute("aria-label","Transformação ativa");
 controls.append(el("label","Forma ativa"),picker,nameInput,addBtn,removeBtn);body.append(controls);
 const bonuses=el("div",null,"d2-transform-bonuses"),suggestions=el("div",null,"d2-transform-suggestions");body.append(bonuses,suggestions);
 function notify(){save();onUpdate()}
 function refresh(){
  const selected=engine.currentForm(saved);
  activeLabel.textContent=selected?"Ativa: "+selected.name:"Forma normal";
  picker.replaceChildren();
  const n=el("option","Normal • sem bônus");n.value="";picker.append(n);
  for(const f of model.forms){const o=el("option",f.name);o.value=f.id;picker.append(o)}
  picker.value=selected?.id||"";removeBtn.disabled=!selected;
  bonuses.replaceChildren();
  if(!selected){bonuses.append(el("p","Escolha ou crie uma transformação para editar os dados extras de Força, Raio, Sagrado e outros atributos.","d2-transform-help"))}
  else{
   const entries=Object.entries(selected.bonuses||{}).filter(([k,v])=>Number.isInteger(Number(v))&&Number(v)>=0);
   bonuses.append(el("h5","Bônus da transformação ativa"));
   const grid=el("div",null,"d2-transform-bonus-grid");
   for(const [attr,amount] of entries){
    const line=el("label",null,"d2-transform-bonus");
    line.append(el("span",attr+" (+d10)"));
    const input=el("input");input.type="number";input.min="0";input.max="500";input.step="1";input.value=amount;
    input.setAttribute("aria-label","Bônus da transformação "+attr);
    input.addEventListener("input",()=>{
     const v=engine.integer(input.value,500);if(v===null)return;
     selected.bonuses[attr]=v;notify();
    });
    const drop=el("button","×");drop.type="button";
    drop.setAttribute("aria-label","Remover bônus "+attr);
    drop.addEventListener("click",()=>{delete selected.bonuses[attr];notify();refresh()});
    line.append(input,drop);grid.append(line);
   }
   bonuses.append(grid);
   const addRow=el("div",null,"d2-transform-add"),select=el("select"),value=el("input"),btn=el("button","＋ Incluir bônus");
   select.setAttribute("aria-label","Atributo da transformação");
   for(const group of data.fields){
    const groupNode=el("optgroup");groupNode.label=group.label;
    for(const attr of group.keys){
     const opt=el("option",attr);opt.value=attr;groupNode.append(opt);
    }select.append(groupNode);
   }
   value.type="number";value.step="1";value.min="0";value.max="500";value.value="0";value.setAttribute("aria-label","Dados d10 extras da transformação");
   btn.type="button";btn.addEventListener("click",()=>{
    const n=engine.integer(value.value,500);if(n===null)return;
    selected.bonuses[select.value]=n;notify();refresh();
   });
   addRow.append(select,value,btn);bonuses.append(addRow);
  }
  suggestions.replaceChildren();
  const hints=d2TransformationHints(c);
  if(hints.length){
   suggestions.append(el("p","Nomes encontrados nos poderes do personagem (sem aplicar bônus automaticamente):","d2-transform-help"));
   const line=el("div",null,"d2-transform-hints");
   for(const hint of hints){
    const btn=el("button",hint);btn.type="button";
    btn.addEventListener("click",()=>{nameInput.value=hint;addBtn.click()});
    line.append(btn);
   }suggestions.append(line);
  }
 }
 picker.addEventListener("change",()=>{model.active=picker.value||null;notify();refresh()});
 addBtn.addEventListener("click",()=>{
  const name=nameInput.value.trim();if(!name||name.length>60||model.forms.length>=12)return;
  const id="forma-"+Date.now()+"-"+(model.forms.length+1);
  model.forms.push({id,name,bonuses:{}});model.active=id;nameInput.value="";
  notify();refresh();wrap.open=true;
 });
 removeBtn.addEventListener("click",()=>{
  const current=engine.currentForm(saved);if(!current)return;
  if(!confirm('Excluir a transformação "'+current.name+'"?'))return;
  model.forms=model.forms.filter(f=>f.id!==current.id);model.active=null;notify();refresh();
 });
 refresh();return wrap;
}
function d2PdfDetails(c,group,lines){
 const entries=d2AbilityEntries(lines,group),out=[];
 entries.forEach((entry,i)=>{
  const formulas=[];
  entry.lines.forEach((line,j)=>{
   if(!d2Live().candidates([line]).length)return;
   const r=d2ResolveSkill(c,line,d2AbilityKey(c,group,i,j));
   if(r.formula)formulas.push({original:line,calculated:r.formula,mode:r.mode,changed:r.changed});
  });
  if(formulas.length)out.push({name:entry.title,formulas});
 });
 return out;
}

function d2ActionSection(c,group,lines,update,result,refreshers,onEdit){
 if(!lines.length)return null;
 const cards=d2AbilityEntries(lines,group),engine=d2Live();
 const section=el("section",null,"d2-ability-block "+group.id),
 heading=el("div",null,"d2-ability-heading");
 heading.append(el("h4",group.title),el("span",cards.length+" carta"+(cards.length===1?"":"s"),"d2-ability-count"));
 section.append(heading,el("p",group.hint,"d2-ability-hint"));
 const grid=el("div",null,"d2-ability-list");
 cards.forEach((skill,i)=>{
  const tile=el("article",null,"d2-skill-card");tile.append(el("h5",skill.title));
  const details=el("div",null,"d2-skill-details");
  for(const line of skill.lines)details.append(el("p",line,"d2-skill-effect"));
  if(skill.lines.length)tile.append(details);
  const formulas=skill.lines.map((line,j)=>({line,j,key:d2AbilityKey(c,group,i,j)}))
    .filter(x=>engine.candidates([x.line]).length);
  if(formulas.length){
   const live=el("div",null,"d2-skill-live"),custom=el("details",null,"d2-skill-config");
   custom.append(el("summary","⚙️ Configurar vínculo de dados"));
   const form=el("div",null,"d2-skill-form");
   for(const item of formulas){
    const setting=engine.config(userState(c),item.key),typed=engine.candidates([item.line]);
    const line=el("div",null,"d2-skill-config-line");
    const modeLabel=el("label","Regra da habilidade"),modeSelect=el("select");
    for(const [id,label] of [["auto","Seguir atributos editados"],["original","Manter dados originais"],["add","Somar dados do atributo"]]){
     const opt=el("option",label);opt.value=id;modeSelect.append(opt);
    }
    modeSelect.value=setting.mode||"auto";
    modeSelect.addEventListener("change",()=>{
     const saved=userState(c);saved.skillLinks[item.key]??={mode:"auto",sources:{}};
     saved.skillLinks[item.key].mode=modeSelect.value;save();onEdit();
    });
    modeLabel.append(modeSelect);line.append(modeLabel);
    typed.forEach(type=>{
     const label=el("label",type+" depende de"),select=el("select");
     for(const group of data.fields){
      const optgroup=el("optgroup");optgroup.label=group.label;
      for(const name of group.keys){const opt=el("option",name);opt.value=name;optgroup.append(opt)}
      select.append(optgroup);
     }
     select.value=setting.sources?.[type]||engine.attrFor(type);
     select.addEventListener("change",()=>{
      const saved=userState(c);saved.skillLinks[item.key]??={mode:"auto",sources:{}};
      saved.skillLinks[item.key].sources??={};
      saved.skillLinks[item.key].sources[type]=select.value;save();onEdit();
     });
     label.append(select);line.append(label);
    });
    form.append(line);
   }
   custom.append(form);
   tile.append(live,custom);
   refreshers.push(()=>{
    live.replaceChildren();
    for(const item of formulas){
     const r=d2ResolveSkill(c,item.line,item.key);
     const info=el("div",null,"d2-skill-live-row");
     info.append(el("small",r.changed?"🎲 Dados ajustados":"🎲 Dados da fonte"),el("strong",r.formula||item.line));
     const descriptions=r.parts.map(x=>{
      const reason=x.reason?"":"(original)";
      return x.type+" → "+x.attribute+(x.attributeDice===null?" (não preenchido)":" "+x.attributeDice+"d10")+
       (x.transformationDice>0?" + "+x.transformationDice+"d10 transformação":"")+" "+reason;
     }).join(" • ");
     info.append(el("p",descriptions,"d2-skill-live-info"));
     if(r.form!=="Normal")info.append(el("small","Forma ativa: "+r.form,"d2-skill-form-active"));
     live.append(info);
    }
   });
  }
  const controls=el("div",null,"d2-attack-buttons d2-skill-actions");
  const rollable=skill.lines.map((line,j)=>({line,j})).filter(x=>dice(x.line));
  rollable.forEach(({line,j},n)=>{
   const btn=el("button",n===0?"🎲 Rolar":"🎲 Rolar "+(n+1));btn.type="button";
   btn.setAttribute("aria-label","Rolar "+skill.title+" ("+(n+1)+") de "+c.name);
   btn.addEventListener("click",()=>{
    const key=d2AbilityKey(c,group,i,j),resolved=d2ResolveSkill(c,line,key);
    const actual=resolved.changed?resolved.calculated:line;
    const total=roll(c,actual,skill.title,update);
    result.textContent=skill.title+" — "+actual+" | Resultado: "+total;
   });controls.append(btn);
  });
  const register=el("button","Registrar");register.type="button";
  register.setAttribute("aria-label","Registrar "+skill.title+" de "+c.name);
  register.addEventListener("click",()=>log(c,"Habilidade/ação: "+skill.title+" — "+skill.lines.join(" | "),"uso",update));
  controls.append(register);
  tile.append(controls);grid.append(tile);
 });
 section.append(grid);return section;
}

function sheetCard(c){
 const det=el("details",null,"d2-sheet");det.id=c.id;
 const sum=el("summary"),intro=el("div");
 intro.append(el("div",c.title,"d2-sheet-name"),el("div",c.group+(c.created?" · Criação/adaptação Hurras":" · Saga do Ragnarök"),"d2-sheet-meta"));
 sum.append(intro,el("span","Nível "+c.level,"d2-level"));det.append(sum);
 let built=false;
 function build(){
  if(built)return;built=true;
  const parsed=d2Split(c),columns=el("div",null,"d2-sheet-columns"),
   left=titlePane("🧬 Atributos e características"),right=titlePane("⚔ Ataques, magias e habilidades");
  left.classList.add("d2-attributes-pane");right.classList.add("d2-abilities-pane");
  let arsenal,stats,extra,currentPdf=null;const liveRefreshers=[];
  const update=()=>tracker.refresh();
  function refreshSheet(){
   if(!built)return;
   stats.replaceChildren(
     el("span","❤️ Vitalidade atual: "+(d2ResourceValue(c,"life")??"não informada")),
     el("span","🔵 Mana atual: "+(d2ResourceValue(c,"mana")??"não informada"))
   );
   for(const [group,block] of visibleTraitBlocks){
     const temp=el("div");d2SourceSection(temp,group.title,parsed.sections[group.id],c);
     block.replaceChildren(...Array.from(temp.childNodes));
   }
   const nextExtra=d2ExtraAttributes(c,parsed);extra.replaceWith(nextExtra);extra=nextExtra;
   if(arsenal){const next=d2WeaponSection(c,parsed.weapons,update);arsenal.replaceWith(next);arsenal=next}
   for(const refresh of liveRefreshers)refresh();
   try{
    if(!window.HurrasFichaPDF)throw Error("Gerador de PDF não carregado");
    currentPdf=window.HurrasFichaPDF.create(c,data.fields,userState(c),D2_ABILITIES,d2Split,d2PdfVariants,(g,lines)=>d2PdfDetails(c,g,lines));
    pdfStatus.textContent="✓ PDF atualizado automaticamente • "+currentPdf.pages+" página(s) • pronto para baixar";
   }catch(err){pdfStatus.textContent="Erro ao preparar PDF: "+err.message}
  }
  const tracker=pointsWidget(c,refreshSheet);
  stats=el("div",null,"d2-stat-summary");det.append(stats);
  const transformation=d2TransformationPanel(c,refreshSheet);
  det.append(transformation);
  const toolbar=el("div",null,"d2-autosave-toolbar"),pdfDownload=el("button","⬇ Baixar PDF atualizado"),pdfStatus=el("span","Preparando PDF...");
  pdfDownload.type="button";pdfDownload.className="d2-pdf-download";pdfStatus.className="d2-pdf-status";
  pdfDownload.addEventListener("click",()=>{
   if(!currentPdf){pdfStatus.textContent="Ainda não foi possível preparar o PDF.";return}
   const blob=new Blob([currentPdf.bytes],{type:"application/pdf"});
   const url=URL.createObjectURL(blob),anchor=el("a");
   anchor.href=url;anchor.download=window.HurrasFichaPDF.filename(c);anchor.click();
   setTimeout(()=>URL.revokeObjectURL(url),15000);
   pdfStatus.textContent="✓ PDF atualizado baixado. Alterações futuras gerarão nova versão.";
  });
  toolbar.append(pdfDownload,pdfStatus);det.append(toolbar);
  arsenal=d2WeaponSection(c,parsed.weapons,update);det.append(arsenal);
  const buffs=d2BuffsSection(c);if(buffs)det.append(buffs);
  const visibleTraitBlocks=[];
  for(const group of D2_ATTR){
   if(!parsed.sections[group.id]?.length)continue;
   const wrapper=el("div",null,"d2-live-trait-group");d2SourceSection(wrapper,group.title,parsed.sections[group.id],c);
   left.append(wrapper);visibleTraitBlocks.push([group,wrapper]);
  }
  extra=d2ExtraAttributes(c,parsed);left.append(extra);
  if(parsed.misc.length)d2SourceSection(left,"📋 Observações do documento",parsed.misc,c);
  const result=el("output","", "d2-roll-output");
  for(const group of D2_ABILITIES){const section=d2ActionSection(c,group,parsed.abilities[group.id],update,result,liveRefreshers,refreshSheet);if(section)right.append(section)}
  if(!D2_ABILITIES.some(g=>parsed.abilities[g.id].length))right.append(el("p","Sem poderes ou ataques descritos nesta ficha.","d2-empty"));
  right.append(result);
  left.id="d2-atributos-"+c.id;right.id="d2-habilidades-"+c.id;
  const links=el("nav",null,"d2-sheet-jumps");links.setAttribute("aria-label","Atalhos para esta ficha");
  for(const [title,target] of [["🗡️ Armas","#d2-arsenal-"+c.id],["💪 Atributos","#d2-atributos-"+c.id],["🔮 Habilidades","#d2-habilidades-"+c.id],["✍️ Editar atributos","#d2-registro-"+c.id]]){
   const a=el("a",title);a.href=target;links.append(a)}
  tracker.panel.id="d2-registro-"+c.id;
  det.insertBefore(links,arsenal);
  columns.append(left,right);det.append(columns);
  const editor=el("details",null,"d2-editor-wrap");
  editor.append(el("summary","✍️ Editar atributos e habilidades • atualização e PDF automáticos"),tracker.panel);
  det.append(editor);
  links.querySelectorAll?.("a").forEach(a=>{if(a.href?.includes("#d2-registro-"))a.addEventListener("click",()=>{editor.open=true})});
  const historic=d2Historical(c);if(historic)det.append(historic);
  const exact=el("details",null,"d2-details-note");
  exact.append(el("summary","📜 Ver transcrição integral sem alterações"),el("pre",c.raw));det.append(exact);
  refreshSheet();
 }
 det.addEventListener("toggle",()=>{if(det.open)build()});
 return det;
}

let visibleSheets=[];
function renderSheets(){const q=norm(ui.sheetSearch.value.trim()),type=ui.sheetCategory.value;visibleSheets=data.dossiers.filter(c=>(!type||c.group===type)&&(!q||norm(c.raw).includes(q)||norm(c.name).includes(q)));
 if(ui.sheetOrder.value==="name")visibleSheets.sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));if(ui.sheetOrder.value==="level")visibleSheets.sort((a,b)=>b.level-a.level||a.name.localeCompare(b.name,"pt-BR"));
 ui.sheets.replaceChildren();visibleSheets.slice(0,sheetLimit).forEach(c=>ui.sheets.append(sheetCard(c)));ui.sheetCount.textContent=visibleSheets.length+" fichas encontradas • mostrando "+Math.min(sheetLimit,visibleSheets.length);
 ui.sheetMore.hidden=visibleSheets.length<=sheetLimit;if(!visibleSheets.length)ui.sheets.append(el("p","Nenhuma ficha encontrada.","d2-empty"));
}
function cultureCard(c){const card=el("article",null,"d2-culture");if(c.image){const im=el("img");im.src="../../assets/i/"+c.image.split("/").map(encodeURIComponent).join("/");im.alt="Arte de "+c.name;im.loading="lazy";im.onerror=()=>{im.replaceWith(el("p","Retrato não disponível.","d2-empty"))};card.append(im)}
 card.append(el("div",c.culture+" • "+c.affinity,"d2-badge"),el("h3",c.name),el("p",c.domain));
 const details=el("details");details.append(el("summary","Descrição original"),el("p",c.description),el("small","Nível no RPG: não definido"));card.append(details);return card
}
let visibleCultures=[];
function renderCultures(){const q=norm(ui.cultureSearch.value.trim()),kind=ui.cultureSelect.value;visibleCultures=data.pantheons.filter(c=>(!kind||c.culture===kind)&&(!q||norm([c.name,c.domain,c.affinity,c.description,c.culture].join(" ")).includes(q))).sort((a,b)=>a.culture.localeCompare(b.culture,"pt-BR")||a.name.localeCompare(b.name,"pt-BR"));
 ui.cultures.replaceChildren();visibleCultures.slice(0,cultureLimit).forEach(c=>ui.cultures.append(cultureCard(c)));ui.cultureCount.textContent=visibleCultures.length+" divindades e figuras • mostrando "+Math.min(cultureLimit,visibleCultures.length);
 ui.cultureMore.hidden=visibleCultures.length<=cultureLimit;if(!visibleCultures.length)ui.cultures.append(el("p","Nenhum resultado.","d2-empty"));
}
function narrative(){data.chapters.forEach((c,i)=>{const chapter=el("details",null,"d2-chapter");chapter.open=i===0;chapter.append(el("summary",c.title));const body=el("div",null,"d2-chapter-content");c.paragraphs.forEach(p=>body.append(el("p",p,/^\d+\./.test(p)?"d2-chapter-event":null)));chapter.append(body);ui.chapters.append(chapter)});
 data.chronology.forEach(p=>ui.chronology.append(el("p",p)))}
function featured(){
 const stage=$("d2-spotlight");if(!stage)return;stage.replaceChildren();
 for(const [name,icon,note] of [["THOR","⚡","Deus do Trovão • Nível 20"],["Brynja","🛡","Semideusa valquíria • Nível 4"],["Solveig","☀","Semideusa da luz • Nível 5"]]){
   const c=data.dossiers.find(x=>x.name===name);if(!c)continue;
   const button=el("button",null,"d2-featured-card");button.type="button";button.append(el("span",icon,"d2-featured-icon"),el("strong",c.title),el("small",note));
   button.addEventListener("click",()=>{ui.sheetSearch.value=c.name;ui.sheetCategory.value="";ui.sheetOrder.value="original";sheetLimit=14;renderSheets();const element=document.getElementById(c.id);if(element){element.open=true;element.scrollIntoView({behavior:"smooth",block:"start"});}});
   stage.append(button);
 }
}
function begin(d){if(d.dossiers.length!==66||d.pantheons.length!==228||d.chapters.length!==8)throw Error("Contagem da fonte inválida");data=d;
 const cats=[...new Set(d.dossiers.map(x=>x.group))],cultures=[...new Set(d.pantheons.map(x=>x.culture))].sort((a,b)=>a.localeCompare(b,"pt-BR"));cats.forEach(x=>{let opt=el("option",x);opt.value=x;ui.sheetCategory.append(opt)});cultures.forEach(x=>{let opt=el("option",x==="Nexalis"?"Nexalis (RPG)":x);opt.value=x;ui.cultureSelect.append(opt)});
 ui.sheetSearch.addEventListener("input",()=>{sheetLimit=14;renderSheets()});ui.sheetCategory.addEventListener("change",()=>{sheetLimit=14;renderSheets()});ui.sheetOrder.addEventListener("change",renderSheets);
 ui.sheetMore.addEventListener("click",()=>{sheetLimit+=14;renderSheets()});ui.cultureSearch.addEventListener("input",()=>{cultureLimit=24;renderCultures()});ui.cultureSelect.addEventListener("change",()=>{cultureLimit=24;renderCultures()});ui.cultureMore.addEventListener("click",()=>{cultureLimit+=24;renderCultures()});
 $("d2-export").addEventListener("click",()=>{const txt=JSON.stringify({format:"hurras_deuses2_batalhas_v1",saved:new Date().toISOString(),history:state},null,2),blob=new Blob([txt],{type:"application/json"}),url=URL.createObjectURL(blob),a=el("a");a.href=url;a.download="deuses2-historicos.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);ui.backupStatus.textContent="Backup gerado."});
 $("d2-import").addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>4e6)throw Error("Arquivo muito grande");const obj=JSON.parse(await file.text());if(obj.format!=="hurras_deuses2_batalhas_v1"||!obj.history||typeof obj.history!=="object"||Array.isArray(obj.history))throw Error("Backup incompatível");if(!confirm("Substituir os históricos locais pelo backup?"))return;state=obj.history;save();renderSheets();ui.backupStatus.textContent="Históricos importados."}catch(err){ui.backupStatus.textContent="Erro: "+err.message}finally{e.target.value=""}});
 renderSheets();renderCultures();narrative();featured();
}
fetch("dados/arquivo.json").then(res=>{if(!res.ok)throw Error("HTTP "+res.status);return res.json()}).then(begin).catch(e=>{ui.sheetCount.textContent="Não foi possível abrir as fichas: "+e.message;ui.cultureCount.textContent="Não foi possível abrir o catálogo."});
})();