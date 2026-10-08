(function(){
"use strict";
const $=id=>document.getElementById(id),ui={sheetSearch:$("d2-sheet-search"),sheetCategory:$("d2-sheet-category"),sheetOrder:$("d2-sheet-order"),sheets:$("d2-sheets"),sheetCount:$("d2-sheet-count"),sheetMore:$("d2-sheet-more"),cultureSearch:$("d2-culture-search"),cultureSelect:$("d2-culture-select"),cultures:$("d2-cultures"),cultureCount:$("d2-culture-count"),cultureMore:$("d2-culture-more"),chapters:$("d2-chapters"),chronology:$("d2-chronology-list"),backupStatus:$("d2-backup-status")};
const KEY="hurras_deuses2_batalhas_v1";
let data=null,sheetLimit=14,cultureLimit=24,state={};
try{const existing=JSON.parse(localStorage.getItem(KEY)||"{}");if(existing&&typeof existing==="object"&&!Array.isArray(existing))state=existing}catch(e){}
const el=(tag,content,cls)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(content!==null&&content!==undefined)node.textContent=String(content);return node};
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){return false}}
function userState(c){if(!state[c.id]||typeof state[c.id]!=="object")state[c.id]={};const v=state[c.id];if(!v.points||typeof v.points!=="object")v.points={};if(!v.resources||typeof v.resources!=="object")v.resources={};if(!Array.isArray(v.log))v.log=[];return v}
function titlePane(name){const pane=el("div",null,"d2-pane");pane.append(el("h3",name));return pane}
function log(c,label,type,notify){const s=userState(c);s.log.unshift({time:new Date().toISOString(),text:String(label).slice(0,750),type:type||"ação"});s.log=s.log.slice(0,250);save();if(notify)notify()}
function dice(expr){const all=[...String(expr).matchAll(/\b(\d+)d(6|8|10|12|20)\b/gi)];if(!all.length)return null;return all.map(m=>({count:Number(m[1]),sides:Number(m[2])}))}
function roll(c,line,label,notify){const ds=dice(line);if(!ds)return;
 const rolls=[];let total=0;
 for(const set of ds){const values=[];for(let i=0;i<Math.min(500,set.count);i++){const n=1+Math.floor(Math.random()*set.sides);values.push(n);total+=n;}rolls.push(set.count+"d"+set.sides+": "+values.join(", "));}
 const message=label+" — "+line+" | Total: "+total+" | "+rolls.join(" / ");
 log(c,message,"rolagem",notify);return total;
}
function pointsWidget(c,notify){const s=userState(c),panel=el("section",null,"d2-battle");panel.append(el("h3","⚔ Pontos e histórico de batalha"),el("p",data.fields.reduce((n,g)=>n+g.keys.length,0)+" campos opcionais (0–12), organizados por área. Não substituem os atributos da ficha oficial — valores maiores que 12 permanecem visíveis no quadro acima.","d2-battle-intro"));
 const wrap=el("div",null,"d2-battle-grid"),left=el("div",null,"d2-battle-column"),right=el("div",null,"d2-battle-column");
 left.append(el("h4","Atributos, talentos, perícias e conhecimentos"));
 data.fields.forEach((g,ix)=>{const block=el("details",null,"d2-attr-group");block.open=ix<3;block.append(el("summary",g.label+" • "+g.keys.length+" campos"));const grid=el("div",null,"d2-attr-grid");
  g.keys.forEach(key=>{const row=el("label",null,"d2-attr-row"),field=el("input");field.type="number";field.inputMode="numeric";field.step="1";field.min="0";field.max="12";field.placeholder="—";field.setAttribute("aria-label",key+" de "+c.name);if(Object.prototype.hasOwnProperty.call(s.points,key))field.value=String(s.points[key]);field.addEventListener("change",()=>{const old=Object.prototype.hasOwnProperty.call(s.points,key)?s.points[key]:null;
   const str=field.value.trim(),n=str===""?null:Number(str);if(n!==null&&(!Number.isInteger(n)||n<0||n>12)){field.value=old===null?"":String(old);status.textContent="Use um número de 0 a 12.";return}
   if(n===null)delete s.points[key];else s.points[key]=n;if(n!==old)log(c,key+": "+(old??"—")+" → "+(n??"—"),"atributo",refresh);status.textContent="Pontos guardados neste navegador.";
  });const rowLabel=el("span",key,"d2-point-name");
   const fromSource=(c.stats||[]).map(v=>d2Stat(v)).find(v=>v&&norm(v.label)===norm(key));
   if(fromSource)rowLabel.append(el("small","Ficha: "+fromSource.value,"d2-point-original"));
   row.append(rowLabel,field);grid.append(row)});block.append(grid);left.append(block)});
 right.append(el("h4","Vitalidade, Mana e acontecimentos"));const resources=el("div",null,"d2-resource-grid");
 for(const [key,label,base]of [["life","Vitalidade atual",c.vitality],["mana","Mana atual",c.mana]]){const box=el("label"),input=el("input");input.type="number";input.min="0";input.step="1";input.inputMode="numeric";input.placeholder="Não informado";const v=Object.prototype.hasOwnProperty.call(s.resources,key)?s.resources[key]:base;input.value=v??"";input.addEventListener("change",()=>{const old=Object.prototype.hasOwnProperty.call(s.resources,key)?s.resources[key]:base,v=input.value.trim(),n=v===""?null:Number(v);
  if(n!==null&&(!Number.isSafeInteger(n)||n<0||n>100000000)){input.value=old??"";status.textContent="Valor inválido.";return}
  if(n!==old){if(n===null)delete s.resources[key];else s.resources[key]=n;log(c,label+": "+(old??"—")+" → "+(n??"—"),"recurso",refresh);}
 });box.append(el("span",label),input);resources.append(box)}right.append(resources);
 const note=el("textarea",null,"d2-log-note");note.rows=2;note.maxLength=750;note.placeholder="Ex.: usou a suprema, sofreu dano, protegeu aliado…";
 const add=el("button","Registrar evento"),clear=el("button","Limpar histórico","secondary"),actions=el("div",null,"d2-log-actions"),status=el("p","", "d2-log-status"),list=el("ol",null,"d2-log-list");
 function refresh(){list.replaceChildren();if(!s.log.length){list.append(el("li","Nenhum evento registrado."));return}s.log.forEach(e=>{const li=el("li"),time=new Date(e.time);li.append(el("small",(Number.isNaN(+time)?"":time.toLocaleString("pt-BR"))+" • "+e.type),el("div",e.text));list.append(li)})}
 add.type="button";add.addEventListener("click",()=>{if(!note.value.trim()){status.textContent="Digite o acontecimento.";return}log(c,note.value.trim(),"ação do Mestre",refresh);note.value="";status.textContent="Evento registrado."});
 clear.type="button";clear.addEventListener("click",()=>{if(!s.log.length)return;if(confirm("Apagar somente o histórico de "+c.name+"?")){s.log=[];save();refresh();status.textContent="Histórico apagado. Pontos preservados."}});
 actions.append(add,clear);right.append(el("label","Registrar ação do combate","d2-log-label"),note,actions,status,list);refresh();wrap.append(left,right);panel.append(wrap);
 return {panel,refresh};
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
   if(head){actionMode=head;if(head==="supremas"||head==="passivas"){abilities[actionMode].push(line);}continue}
   abilities[actionMode].push(line);
 }
 return {sections,weapons,abilities,misc,resources};
}
function d2SourceSection(parent,title,lines){
 if(!lines?.length)return;
 const section=el("section",null,"d2-trait-block");
 section.append(el("h4",title));
 const rows=el("div",null,"d2-trait-rows");
 for(const line of lines){
   const item=d2Stat(line),row=el("div",null,"d2-trait-row");
   if(item&&item.id!=="recurso"){row.append(el("span",item.label),el("strong",item.value))}
   else row.append(el("span",line,"d2-trait-text"));
   rows.append(row);
 }
 section.append(rows);parent.append(section);
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
 const rx=/(\d+)d(6|8|10|12|20)\s*(f[ií]sico|m[aá]gico|raio|el[eé]trico|sagrado|fogo|gelo|luz|trevas|morte|veneno|[aá]gua|natureza|terra|vento|sombra)/giu;
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
 const h=data.previousVersions?.[c.name];if(!h)return null;
 const wrap=el("details",null,"d2-historical");
 wrap.append(el("summary","📚 Ficha anterior completa — "+h.title));
 wrap.append(el("p","Fonte: "+h.source,"d2-historical-source"),el("p",h.note,"d2-historical-warning"));
 const blocks=el("div",null,"d2-historical-blocks");
 const paragraphs=h.text.split(/\n\s*\n/g).map(x=>x.trim()).filter(Boolean);
 for(const [i,part] of paragraphs.entries()){
  const block=el("article",null,"d2-historical-block");
  const lines=part.split("\n").map(x=>x.trim()).filter(Boolean);
  const first=lines[0]||"";
  const heading=lines.length>1&&first.length<=65;
  if(heading)block.append(el("h5",first));
  block.append(el("pre",heading?lines.slice(1).join("\n"):part));
  blocks.append(block);
 }
 wrap.append(blocks);return wrap;
}
function d2ActionSection(c,group,lines,update,result){
 if(!lines.length)return null;
 const block=el("section",null,"d2-ability-block "+group.id);
 block.append(el("h4",group.title),el("p",group.hint,"d2-ability-hint"));
 let action="";
 const list=el("div",null,"d2-ability-list");
 for(const line of lines){
   const row=el("div",null,"d2-combat-line"),text=el("span",line),actions=el("div",null,"d2-attack-buttons"),formula=dice(line);
   if(formula){
     const button=el("button","🎲 Rolar");button.type="button";
     const title=action||c.name;
     button.addEventListener("click",()=>{const val=roll(c,line,title,update);result.textContent="Rolagem: "+val});
     actions.append(button);
   }
   const register=el("button","Registrar");register.type="button";register.addEventListener("click",()=>log(c,"Habilidade/ação: "+line,"uso",update));
   actions.append(register);
   row.append(text,actions);list.append(row);
   if(!formula&&!/^(?:[^\p{L}]*)(?:SUPREMA|PASSIVA|Ataques|Magias|Técnicas)\b/iu.test(line)&&line.length<90)action=line;
 }
 block.append(list);return block;
}

function sheetCard(c){
 const det=el("details",null,"d2-sheet");det.id=c.id;
 const sum=el("summary"),intro=el("div");
 intro.append(el("div",c.title,"d2-sheet-name"),el("div",c.group+(c.created?" · Criação/adaptação Hurras":" · Saga do Ragnarök"),"d2-sheet-meta"));
 sum.append(intro,el("span","Nível "+c.level,"d2-level"));det.append(sum);
 let built=false;
 function build(){
   if(built)return;built=true;
   const parsed=d2Split(c),columns=el("div",null,"d2-sheet-columns"),left=titlePane("🧬 Atributos e características"),right=titlePane("⚔ Ataques, magias e habilidades"),tracker=pointsWidget(c);
   const update=tracker.refresh, result=el("output","", "d2-roll-output");
   const stats=el("div",null,"d2-stat-summary");
   stats.append(el("span","❤️ Vitalidade: "+(c.vitality??"não informada")),el("span","🔵 Mana: "+(c.mana??"não informada")));
   det.append(stats,d2WeaponSection(c,parsed.weapons,update));
   const buffs=d2BuffsSection(c);if(buffs)det.append(buffs);
   for(const group of D2_ATTR){d2SourceSection(left,group.title,parsed.sections[group.id])}
   if(parsed.misc.length)d2SourceSection(left,"📋 Observações do documento",parsed.misc);
   if(!D2_ATTR.some(g=>parsed.sections[g.id].length)&&!parsed.misc.length){
     left.append(el("p","Sem atributos numéricos informados nesta ficha. Os campos de registro ficam logo abaixo.","d2-empty"));
   }
   for(const group of D2_ABILITIES){const section=d2ActionSection(c,group,parsed.abilities[group.id],update,result);if(section)right.append(section)}
   if(!D2_ABILITIES.some(g=>parsed.abilities[g.id].length))right.append(el("p","Sem poderes ou ataques descritos nesta ficha.","d2-empty"));
   right.append(result);
   left.id="d2-atributos-"+c.id;right.id="d2-habilidades-"+c.id;
   const links=el("nav",null,"d2-sheet-jumps");links.setAttribute("aria-label","Atalhos para esta ficha");
   for(const [title,target] of [["🗡️ Armas","#d2-arsenal-"+c.id],["💪 Atributos","#d2-atributos-"+c.id],["🔮 Habilidades","#d2-habilidades-"+c.id],["🎲 Registro","#d2-registro-"+c.id]]){
     const a=el("a",title);a.href=target;links.append(a)}
   tracker.panel.id="d2-registro-"+c.id;
   det.insertBefore(links,det.querySelector(".d2-weapon-section"));
   columns.append(left,right);det.append(columns,tracker.panel);
   const historic=d2Historical(c);if(historic)det.append(historic);
   const exact=el("details",null,"d2-details-note");
   exact.append(el("summary","📜 Ver transcrição integral sem alterações"),el("pre",c.raw));det.append(exact);
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