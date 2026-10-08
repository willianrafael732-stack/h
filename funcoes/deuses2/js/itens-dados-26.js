/* Inventario de itens e dados da coleção de 26 fichas. */
(function(root){"use strict";
const KEY="hurras_nordicos_26_inventory_v1";
const el=(tag,content,cls)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(content!==null&&content!==undefined)n.textContent=String(content);return n};
let state={};
try{const prior=JSON.parse(localStorage.getItem(KEY)||"{}");if(prior&&typeof prior==="object"&&!Array.isArray(prior))state=prior}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){return false}}
function userState(c){if(!state[c.id]||typeof state[c.id]!=="object")state[c.id]={};if(!Array.isArray(state[c.id].inventory))state[c.id].inventory=[];return state[c.id]}
function log(c,text,kind){const item=userState(c);if(!Array.isArray(item.log))item.log=[];item.log.unshift({time:new Date().toISOString(),text:String(text),type:kind||"rolagem"});item.log=item.log.slice(0,80);save()}
function d2ThreeAttackVariants(w){return [{id:"base",parts:w.parts||[]}]}
function d2Formula(parts){return (parts||[]).map(p=>p.count+"d"+p.sides+" "+p.type).join(" + ")}
/* Itens e rolagem personalizada, independentes das armas e dos drops originais. */
function d2ItemDiceParts(expr){
 const parts=[...String(expr||"").matchAll(/\b(\d{1,3})d(4|6|8|10|12|20)\b/gi)].map(x=>({n:Number(x[1]),faces:Number(x[2])}));
 return parts.length&&parts.reduce((a,p)=>a+p.n,0)<=200&&parts.every(p=>p.n>=1)?parts:null;
}
function d2ItemDiceRoll(c,expr,output,onEdit){
 const parts=d2ItemDiceParts(expr);if(!parts){output.textContent="Dados inválidos (máximo: 200).";return}
 let total=0,successes=0,criticals=0,criticalFailures=0,hasD10=false;const detail=[];
 for(const part of parts){
  const values=[];for(let i=0;i<part.n;i++){
   const v=1+Math.floor(Math.random()*part.faces);values.push(v);total+=v;
   if(part.faces===10){hasD10=true;if(v>=6)successes++;if(v===10)criticals++;if(v===1)criticalFailures++}
  }
  detail.push(part.n+"d"+part.faces+" ["+values.join(", ")+"]");
 }
 const result=expr+" = "+total+(hasD10?" | Sucessos (6–10): "+successes+" | 10: "+criticals+" | 1: "+criticalFailures:"")+" | "+detail.join(" + ");
 output.textContent=result;log(c,result,"rolagem");onEdit();
}
function d2ItemDiceWidget(c,parsed,onEdit){
 const stateOf=userState(c),inv=stateOf.inventory,panel=el("section",null,"d2-items-panel");
 panel.id="d2-itens-"+c.id;
 panel.append(el("h3","🎒 Itens da ficha e rolagem de dados"),el("p","Gerencie os itens de "+c.name+". Itens adicionados são salvos no navegador e no PDF da ficha. Drops não entram automaticamente no inventário.","d2-items-help"));
 const layout=el("div",null,"d2-items-layout"),itemsCol=el("div",null,"d2-items-column"),diceCol=el("div",null,"d2-items-column");
 const rows=el("div",null,"d2-inventory-list"),info=el("output","","d2-items-notice");
 itemsCol.append(el("h4","Itens do personagem"),rows);
 const form=el("form",null,"d2-item-form"),name=el("input"),qty=el("input"),formula=el("input"),notes=el("textarea");
 name.required=true;name.maxLength=110;name.placeholder="Nome do item";name.setAttribute("aria-label","Nome do item");
 qty.required=true;qty.type="number";qty.min="1";qty.max="9999";qty.step="1";qty.value="1";qty.setAttribute("aria-label","Quantidade");
 formula.placeholder="Dados, ex.: 2d10 + 1d6";formula.maxLength=120;formula.setAttribute("aria-label","Dados do item");
 notes.placeholder="Descrição, efeito ou cargas";notes.maxLength=350;notes.rows=2;notes.setAttribute("aria-label","Descrição do item");
 const add=el("button","Adicionar"),cancel=el("button","Cancelar");add.type="submit";cancel.type="button";cancel.hidden=true;
 form.append(name,qty,formula,notes,add,cancel);itemsCol.append(form,info);
 let editing=null;
 const reset=()=>{editing=null;form.reset();qty.value="1";add.textContent="Adicionar";cancel.hidden=true};
 cancel.addEventListener("click",reset);
 function modified(message){const saved=save();draw();info.textContent=(saved?"":"Falha ao salvar no navegador. ")+message;onEdit()}
 const diceResult=el("output","","d2-items-roll-result");diceResult.setAttribute("role","status");
 function rollItem(expr){d2ItemDiceRoll(c,expr,diceResult,onEdit)}
 function draw(){
  rows.replaceChildren();
  if(!inv.length)rows.append(el("p","Inventário vazio. Adicione um item ou copie uma arma da ficha.","d2-items-help"));
  for(const it of inv.filter(x=>x&&typeof x==="object")){
   const row=el("article",null,"d2-item-record"),body=el("div",null,"d2-item-info"),buttons=el("div",null,"d2-item-buttons");
   body.append(el("strong",it.name||"Item"),el("small","Qtd.: "+(Number(it.qty)||0)));
   if(it.dice)body.append(el("code",it.dice));if(it.note)body.append(el("p",it.note));
   for(const [label,difference] of [["+1",1],["−1",-1]]){
    const btn=el("button",label);btn.type="button";btn.disabled=difference<0?it.qty<=0:it.qty>=9999;
    btn.addEventListener("click",()=>{it.qty=Math.max(0,Math.min(9999,(Number(it.qty)||0)+difference));modified("Quantidade atualizada.")});
    buttons.append(btn);
   }
   const edit=el("button","Editar"),remove=el("button","Remover");edit.type=remove.type="button";
   edit.addEventListener("click",()=>{editing=it.id;name.value=it.name;qty.value=String(Math.max(1,it.qty||1));formula.value=it.dice||"";notes.value=it.note||"";add.textContent="Salvar alterações";cancel.hidden=false;name.focus()});
   remove.addEventListener("click",()=>{if(!confirm("Remover "+it.name+" do inventário?"))return;inv.splice(inv.indexOf(it),1);modified("Item removido.")});
   buttons.append(edit,remove);
   if(it.dice){const roll=el("button","🎲 Rolar item");roll.type="button";roll.disabled=!d2ItemDiceParts(it.dice);roll.addEventListener("click",()=>rollItem(it.dice));buttons.append(roll)}
   row.append(body,buttons);rows.append(row);
  }
 }
 form.addEventListener("submit",event=>{
  event.preventDefault();const q=Number(qty.value),itemName=name.value.trim(),dice=formula.value.trim();
  if(!itemName||!Number.isSafeInteger(q)||q<1||q>9999){info.textContent="Informe nome e quantidade entre 1 e 9999.";return}
  if(dice&&!d2ItemDiceParts(dice)){info.textContent="Dados inválidos. Use, por exemplo, 2d10 ou 1d20 (máx. 200).";return}
  const record={id:editing||String(Date.now())+Math.random().toString(36).slice(2,7),name:itemName,qty:q,dice,note:notes.value.trim()};
  const index=inv.findIndex(x=>x?.id===editing);
  if(index>=0)inv[index]=record;else inv.push(record);
  reset();modified(index>=0?"Item atualizado.":"Item cadastrado.");
 });
 const source=el("details",null,"d2-items-source");source.append(el("summary","🗡️ Equipamentos originais da ficha"));
 for(const w of parsed.weapons){
  const weapon=el("div",null,"d2-source-weapon"),button=el("button","Adicionar ao inventário");button.type="button";
  const normal=d2ThreeAttackVariants(w,userState(c)).find(t=>t.id==="base");
  const dice=normal?d2Formula(normal.parts):"";
  weapon.append(el("strong",w.name),el("small",dice||"Sem dados básicos na origem"));
  button.addEventListener("click",()=>{inv.push({id:String(Date.now())+Math.random().toString(36).slice(2,7),name:w.name,qty:1,dice,note:"Arma da ficha original."});modified("Arma adicionada.")});
  weapon.append(button);source.append(weapon);
 }
 if(!parsed.weapons.length)source.append(el("p","Nenhuma arma identificada no texto original."));
 itemsCol.append(source);
 if(parsed.abilities.drops?.length){
  const drops=el("details",null,"d2-items-source");drops.append(el("summary","🎁 Drops e recompensas (não possuídos)"));
  const ul=el("ul");parsed.abilities.drops.forEach(x=>ul.append(el("li",x)));drops.append(ul);itemsCol.append(drops);
 }
 diceCol.id="d2-dados-"+c.id;diceCol.append(el("h4","🎲 Rolador de dados"),el("p","No d10: resultados 6–9 são sucessos; 10 é sucesso crítico e 1 é falha crítica.","d2-items-help"));
 const quick=el("div",null,"d2-dice-shortcuts");
 for(const code of ["1d10","5d10","1d20"]){const btn=el("button","🎲 "+code);btn.type="button";btn.addEventListener("click",()=>rollItem(code));quick.append(btn)}
 const custom=el("form",null,"d2-dice-custom"),count=el("input"),faces=el("select"),submit=el("button","Rolar");
 count.type="number";count.min="1";count.max="200";count.value="5";count.setAttribute("aria-label","Quantidade de dados");
 for(const n of [4,6,8,10,12,20]){const option=el("option","d"+n);option.value=String(n);faces.append(option)}faces.value="10";
 faces.setAttribute("aria-label","Faces do dado");submit.type="submit";custom.append(count,faces,submit);
 custom.addEventListener("submit",e=>{e.preventDefault();const n=Number(count.value);if(!Number.isSafeInteger(n)||n<1||n>200){diceResult.textContent="Quantidade inválida.";return}rollItem(n+"d"+faces.value)});
 diceCol.append(quick,custom,diceResult);layout.append(itemsCol,diceCol);panel.append(layout);draw();return panel;
}

function create(c){
 const base=Array.isArray(c.attacks?.base)?c.attacks.base:[];
 const parts=base.map(p=>({count:Number(p.count),sides:10,type:String(p.type||"dano")}));
 return d2ItemDiceWidget(c,{weapons:[{name:c.weapon||"Arma não informada",parts}],abilities:{drops:c.rewards?[c.rewards]:[]}},save);
}
root.HurrasInventarioNordico={create};
})(window);
