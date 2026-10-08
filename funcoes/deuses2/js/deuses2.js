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
function pointsWidget(c,notify){const s=userState(c),panel=el("section",null,"d2-battle");panel.append(el("h3","⚔ Pontos e histórico de batalha"),el("p","Valores de 0 a 12 separados da ficha original. Não alteram os números do arquivo da saga.","d2-battle-intro"));
 const wrap=el("div",null,"d2-battle-grid"),left=el("div",null,"d2-battle-column"),right=el("div",null,"d2-battle-column");
 left.append(el("h4","36 atributos e habilidades"));
 data.fields.forEach((g,ix)=>{const block=el("details",null,"d2-attr-group");block.open=ix===0;block.append(el("summary",g.label));const grid=el("div",null,"d2-attr-grid");
  g.keys.forEach(key=>{const row=el("label",null,"d2-attr-row"),field=el("input");field.type="number";field.inputMode="numeric";field.step="1";field.min="0";field.max="12";field.placeholder="—";field.setAttribute("aria-label",key+" de "+c.name);if(Object.prototype.hasOwnProperty.call(s.points,key))field.value=String(s.points[key]);field.addEventListener("change",()=>{const old=Object.prototype.hasOwnProperty.call(s.points,key)?s.points[key]:null;
   const str=field.value.trim(),n=str===""?null:Number(str);if(n!==null&&(!Number.isInteger(n)||n<0||n>12)){field.value=old===null?"":String(old);status.textContent="Use um número de 0 a 12.";return}
   if(n===null)delete s.points[key];else s.points[key]=n;if(n!==old)log(c,key+": "+(old??"—")+" → "+(n??"—"),"atributo",refresh);status.textContent="Pontos guardados neste navegador.";
  });row.append(el("span",key),field);grid.append(row)});block.append(grid);left.append(block)});
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
function sheetCard(c){const det=el("details",null,"d2-sheet");det.id=c.id;const sum=el("summary"),intro=el("div");intro.append(el("div",c.title,"d2-sheet-name"),el("div",c.group+" · Saga do Ragnarök","d2-sheet-meta"));sum.append(intro,el("span","Nível "+c.level,"d2-level"));det.append(sum);
 let built=false;function build(){if(built)return;built=true;const columns=el("div",null,"d2-sheet-columns"),left=titlePane("Atributos • recursos • armas"),right=titlePane("Golpes • magias • passivas"),tracker=pointsWidget(c);const update=tracker.refresh;
 c.stats.forEach(v=>left.append(el("div",v,"d2-source-line")));if(!c.stats.length)left.append(el("p","Sem dados nesta seção.","d2-empty"));
 let previous="";
 c.actions.forEach(line=>{const row=el("div",null,"d2-combat-line"),text=el("span",line),actions=el("div",null,"d2-attack-buttons");const formula=dice(line);if(formula){const button=el("button","🎲 Rolar");button.type="button";const name=previous||c.name;button.addEventListener("click",()=>{const val=roll(c,line,name,update);result.textContent="Rolagem: "+val});actions.append(button)}
 const saveBtn=el("button","Registrar");saveBtn.type="button";saveBtn.addEventListener("click",()=>log(c,"Habilidade/ação: "+line,"uso",update));actions.append(saveBtn);row.append(text,actions);right.append(row);
 if(!formula&&!/^(?:[^\p{L}]*)(?:SUPREMA|PASSIVA|Ataques|Magias|Técnicas|Suprema|Passiva)\b/iu.test(line)&&line.length<80)previous=line;
 });
 if(!c.actions.length)right.append(el("p","Não há golpes separados nesta ficha; consulte a transcrição.","d2-empty"));
 const result=el("output","", "d2-roll-output");right.append(result);columns.append(left,right);det.append(columns,tracker.panel);
 const exact=el("details",null,"d2-details-note");exact.append(el("summary","📜 Ver texto original completo"),el("pre",c.raw));det.append(exact);
 }det.addEventListener("toggle",()=>{if(det.open)build()});return det}
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