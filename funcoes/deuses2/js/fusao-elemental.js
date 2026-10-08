/* Hurras RPG — fusão elemental opcional, sem alterar ataques oficiais. */
(function(root){"use strict";
const E=["Magia","Sagrado","Fogo","Água","Gelo","Raio","Vento","Terra","Natureza","Luz","Trevas","Sombra","Morte","Veneno","Elétrico"];
const F=[
 ["Fogo","Água","Vapor escaldante","Cria uma cortina de vapor que pode atrapalhar a visão."],
 ["Fogo","Gelo","Choque térmico","Mudança brusca de temperatura; pode desorientar."],
 ["Fogo","Terra","Magma","Cria rocha derretida e terreno perigoso."],
 ["Fogo","Vento","Tempestade de chamas","Pode espalhar queimaduras numa área."],
 ["Fogo","Raio","Plasma","Calor e descarga elétrica combinados."],
 ["Fogo","Natureza","Fogo selvagem","Pode inflamar a vegetação."],
 ["Água","Raio","Tempestade elétrica","Pode eletrificar água e alvos molhados."],
 ["Água","Gelo","Prisão glacial","Pode congelar o chão e restringir movimento."],
 ["Água","Vento","Ciclone aquático","Pode empurrar e derrubar o alvo."],
 ["Água","Terra","Pântano","Cria lama e terreno difícil."],
 ["Água","Veneno","Maré tóxica","Pode envenenar uma área com água."],
 ["Gelo","Vento","Nevasca","Pode reduzir visão e deslocamento."],
 ["Gelo","Trevas","Geada sombria","Pode ocultar e resfriar uma região."],
 ["Raio","Vento","Tempestade","Combina vendaval e relâmpagos."],
 ["Raio","Terra","Magnetismo","Pode afetar objetos metálicos."],
 ["Terra","Natureza","Floresta viva","Pode criar raízes e bloqueios."],
 ["Luz","Trevas","Eclipse","Pode confundir percepção e visão."],
 ["Luz","Sagrado","Aurora divina","Pode revelar criaturas ocultas."],
 ["Luz","Sombra","Crepúsculo","Pode produzir sombras e ilusões."],
 ["Sagrado","Trevas","Julgamento sombrio","Duas forças opostas em conflito."],
 ["Morte","Trevas","Necrose","Pode acelerar decadência."],
 ["Morte","Veneno","Peste","Pode enfraquecer o alvo."],
 ["Magia","Sagrado","Convergência divina","Concentra poder arcano consagrado."],
 ["Magia","Fogo","Chama arcana","Fogo intensificado por energia mágica."],
 ["Magia","Raio","Raio arcano","Descarga mágica eletrificada."],
 ["Elétrico","Água","Corrente elétrica aquática","Pode conduzir choques."],
 ["Elétrico","Vento","Ar ionizado","Pode eletrificar o ar."],
 ["Natureza","Água","Florescimento","Pode acelerar crescimento de plantas."],
 ["Sombra","Veneno","Névoa venenosa","Pode ocultar vapores tóxicos."],
 ["Terra","Gelo","Cristal glacial","Pode formar cristais protetores."],
];
const fold=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),key=(a,b)=>[fold(a),fold(b)].sort().join("|");
const combo=new Map(F.map(row=>[key(row[0],row[1]),{name:row[2],effect:row[3]}]));
const mk=(tag,txt,cls)=>{const e=document.createElement(tag);if(txt!==null&&txt!==undefined)e.textContent=String(txt);if(cls)e.className=cls;return e};
const sane=x=>Number.isSafeInteger(x)&&x>=0&&x<=200;
function details(a,b){
 if(!E.includes(a)||!E.includes(b)||a===b)return null;
 return combo.get(key(a,b))||{name:"Convergência de "+a+" e "+b,effect:"Efeito especial definido pelo Mestre."};
}
function rollDice(n){
 if(!Number.isSafeInteger(n)||n<1||n>200)return null;
 let total=0,success=0,critical=0,failure=0;const values=[];
 for(let i=0;i<n;i++){const v=1+Math.floor(Math.random()*10);values.push(v);total+=v;if(v===10)critical++;else if(v===1)failure++;else if(v>=6)success++}
 return {total,success,critical,failure,values};
}
function create(o){
 const s=o.settings;if(!s||typeof s!=="object")throw Error("Fusão sem armazenamento de ficha");
 if(!E.includes(s.a))s.a="Magia";if(!E.includes(s.b)||s.b===s.a)s.b="Sagrado";
 if(!s.power||typeof s.power!=="object"||Array.isArray(s.power))s.power={};
 if(!Array.isArray(s.saved))s.saved=[];
 const panel=mk("section",null,"h-fusion");panel.id="d2-fusao-"+o.id;
 panel.append(mk("h3","🜂 Junção de elementos"),mk("p","Regra opcional: soma dos níveis dos dois elementos em dados d10. Elementos sem nível informado começam em 0. Efeitos e custo de Mana são sugestões; golpes originais não são modificados.","h-fusion-help"));
 const controls=mk("div",null,"h-fusion-controls"),selA=mk("select"),selB=mk("select"),powerA=mk("input"),powerB=mk("input");
 for(const t of E){for(const select of [selA,selB]){const option=mk("option",t);option.value=t;select.append(option)}}
 for(const [name,field]of [["Elemento 1",selA],["Elemento 2",selB],["Dados do elemento 1 (d10)",powerA],["Dados do elemento 2 (d10)",powerB]]){
  const label=mk("label");label.append(mk("span",name),field);controls.append(label);
 }
 for(const input of [powerA,powerB]){input.type="number";input.min="0";input.max="200";input.step="1";input.placeholder="Usar atributo";}
 const result=mk("div",null,"h-fusion-result"),title=mk("h4"),effect=mk("p"),formula=mk("strong"),mana=mk("small");
 result.append(title,effect,formula,mana);
 const buttons=mk("div",null,"h-fusion-buttons"),roll=mk("button","🎲 Rolar fusão"),save=mk("button","💾 Salvar fusão"),clear=mk("button","Limpar poderes manuais");
 for(const button of [roll,save,clear])button.type="button";
 buttons.append(roll,save,clear);
 const output=mk("output","","h-fusion-output"),notice=mk("p","","h-fusion-notice");
 output.setAttribute("role","status");notice.setAttribute("role","status");
 const records=mk("div",null,"h-fusion-saved");
 panel.append(controls,result,buttons,output,notice,mk("h4","Combinações salvas"),records);
 function change(){const ok=o.onChange?.();if(ok===false)notice.textContent="Erro ao salvar no navegador."}
 function power(element){
  if(Object.prototype.hasOwnProperty.call(s.power,element)&&sane(Number(s.power[element])))return Number(s.power[element]);
  const v=o.getLevel?.(element);
  return v!==null&&v!==undefined&&v!==""&&sane(Number(v))?Number(v):0;
 }
 function current(){
  const d=details(s.a,s.b);if(!d)return null;
  const a=power(s.a),b=power(s.b),total=a+b;
  return {...d,a:s.a,b:s.b,pa:a,pb:b,total,expression:total+"d10",cost:Math.max(1,Math.ceil(total/2))};
 }
 function fieldValues(){selA.value=s.a;selB.value=s.b;powerA.value=Object.hasOwn(s.power,s.a)?s.power[s.a]:"";powerB.value=Object.hasOwn(s.power,s.b)?s.power[s.b]:""}
 function showSaved(){
  records.replaceChildren();
  if(!s.saved.length)records.append(mk("p","Nenhuma fusão salva.","h-fusion-help"));
  for(const record of s.saved.slice(0,20)){
   const info=details(record.a,record.b);if(!info)continue;
   const card=mk("div",null,"h-fusion-entry"),description=mk("div"),actions=mk("div",null,"h-fusion-buttons");
   description.append(mk("strong",info.name),mk("small",record.a+" + "+record.b+" • "+(Number(record.pa)+Number(record.pb))+"d10"));
   const use=mk("button","Selecionar"),remove=mk("button","Excluir");use.type=remove.type="button";
   use.addEventListener("click",()=>{s.a=record.a;s.b=record.b;s.power[s.a]=record.pa;s.power[s.b]=record.pb;fieldValues();change();refresh()});
   remove.addEventListener("click",()=>{s.saved.splice(s.saved.indexOf(record),1);change();refresh()});
   actions.append(use,remove);card.append(description,actions);records.append(card);
  }
 }
 function refresh(){
  const c=current();if(!c)return;
  title.textContent=c.name;effect.textContent="Efeito sugerido: "+c.effect;
  formula.textContent=c.pa+"d10 "+c.a+" + "+c.pb+"d10 "+c.b+" = "+c.expression;
  mana.textContent="Custo sugerido: "+c.cost+" Mana • não descontado automaticamente";
  roll.disabled=save.disabled=c.total<1||c.total>200;
  if(c.total>200)notice.textContent="Limite de 200 dados por fusão. Ajuste os poderes.";
  showSaved();
 }
 for(const [select,prop]of [[selA,"a"],[selB,"b"]]){
  select.addEventListener("change",()=>{
   if(select.value===s[prop==="a"?"b":"a"]){notice.textContent="Escolha elementos diferentes.";select.value=s[prop];return}
   s[prop]=select.value;fieldValues();notice.textContent="";change();refresh();
  });
 }
 for(const [field,prop]of [[powerA,"a"],[powerB,"b"]]){
  field.addEventListener("change",()=>{
   const raw=field.value.trim();
   if(!raw)delete s.power[s[prop]];
   else if(!sane(Number(raw))){notice.textContent="Informe um valor inteiro entre 0 e 200.";fieldValues();return}
   else s.power[s[prop]]=Number(raw);
   notice.textContent="";change();refresh();
  });
 }
 clear.addEventListener("click",()=>{delete s.power[s.a];delete s.power[s.b];fieldValues();notice.textContent="Valores da ficha restaurados.";change();refresh()});
 save.addEventListener("click",()=>{
  const c=current();if(!c||c.total<1||c.total>200)return;
  const entry={a:c.a,b:c.b,pa:c.pa,pb:c.pb},at=s.saved.findIndex(v=>key(v.a,v.b)===key(c.a,c.b));
  if(at>=0)s.saved[at]=entry;
  else if(s.saved.length<20)s.saved.push(entry);
  else {notice.textContent="Máximo de 20 fusões salvas.";return}
  notice.textContent="Combinação salva.";change();refresh();
 });
 roll.addEventListener("click",()=>{
  const c=current();if(!c)return;const r=rollDice(c.total);if(!r)return;
  const description=c.name+" ("+c.expression+"): dano "+r.total+" | sucessos 6–9: "+r.success+" | 10: "+r.critical+" | 1: "+r.failure;
  output.textContent=description+" | dados: "+r.values.join(", ");
  o.onRoll?.(description+" | dados: "+r.values.join(", "));
 });
 fieldValues();refresh();return {panel,refresh,state:s};
}
root.HurrasFusaoElemental={create,details,rollDice,ELEMENTS:E};
})(window);
