/* Hurras: ferramentas opcionais, isoladas do PDF e do sistema original. */
(function(){
'use strict';
const dark=!!document.getElementById('darkEditor');
const D=window.HURRAS_RPG||{};
const root=dark?document.querySelector('#darkEditor .hero'):document.querySelector('.builder .character-hub');
if(!root)return;
function el(tag,label){const x=document.createElement(tag);if(label!==undefined)x.textContent=label;return x}
function byId(id){return document.getElementById(id)}
function copy(v){return JSON.parse(JSON.stringify(v))}
const panel=el('section');panel.className='hurras-tools noprint';
panel.setAttribute('aria-label','Ferramentas adicionais do personagem');
root.insertAdjacentElement('afterend',panel);
panel.innerHTML='<h2>Ferramentas do personagem</h2><div class="ht-nav"></div><div class="ht-content"></div><p class="ht-status" role="status"></p>';
const nav=panel.querySelector('.ht-nav'),content=panel.querySelector('.ht-content'),notice=panel.querySelector('.ht-status');
const api=()=>window.HurrasDarkSheetAPI;
const get=()=>dark?api()?.get():window.HurrasStorage?.capture();
const restore=v=>{if(dark)api()?.update(v);else window.HurrasStorage?.restore(v)};
const level=()=>Math.max(1,Math.min(10,Number(dark?get()?.fields?.['Nível']:get()?.inputs?.level)||1));
const ident=()=>dark?(get()?.id||'novo'):(localStorage.getItem('hurrasCurrentFichaId')||'rascunho');
const key=()=> (dark?'dark:':'classic:')+ident();
const setNotice=s=>{notice.textContent=s};
let tab='combat',history=[],recording=false;
function remember(){
 if(recording)return;
 const data=get();if(!data)return;
 const serial=JSON.stringify(data),k=key();
 if(history.length&&history[history.length-1].serial===serial&&history[history.length-1].key===k)return;
 history.push({serial,key:k});if(history.length>40)history.shift();
}
function undo(){
 let last=history.pop();while(last&&last.key!==key())last=history.pop();
 if(!last){setNotice('Nenhuma mudança anterior para desfazer.');return}
 recording=true;
 try{restore(JSON.parse(last.serial));setNotice('Última alteração restaurada.')}finally{recording=false}
 show();
}
// O cabeçalho Dark também contém os botões de zerar e sortear.
const targets=dark?[byId('darkEditor'),document.querySelector('.toolbar')]:[document.querySelector('.builder')];
for(const target of targets.filter(Boolean)){
 target.addEventListener('pointerdown',function(e){
  if(e.target.closest('button,.dot,.sq,.circle,.mana-grid,.vitality,[data-stat],[data-resist]'))remember();
 },true);
 target.addEventListener('focusin',function(e){
  if(e.target.matches('input,select,textarea,[contenteditable="true"]'))remember();
 },true);
 target.addEventListener('keydown',function(e){
  if(['Enter',' '].includes(e.key)&&e.target.closest('button,.dot,.sq'))remember();
 },true);
}
function button(txt,callback,parent=content){
 const b=el('button',txt);b.type='button';b.addEventListener('click',callback);parent.append(b);return b
}
for(const [code,name] of [['combat','Combate rápido'],['equip','Inventário inteligente'],['points','Pontos por nível'],['magic','Magia e efeitos']]){
 const b=button(name,()=>{tab=code;show()},nav);b.dataset.tab=code;
}
button('↶ Desfazer',undo,nav);
const a=el('a','Visão do Mestre');a.href='mestre-fichas.html';nav.append(a);
function resources(){
 const n=level(),d=get();return dark?
 {vida:(d?.vitality||[]).length,mana:(d?.mana||[]).length,maxVida:n*10,maxMana:n*5}:
 {vida:n*10-(d?.state?.wounds||0),mana:d?.state?.mana||0,maxVida:n*10,maxMana:n*5};
}
function adjust(type,n){
 remember();const res=resources(),prop=type==='vida'?'vida':'mana';
 const max=type==='vida'?res.maxVida:res.maxMana;
 const next=Math.min(max,Math.max(0,res[prop]+n));
 if(dark){const d=get(),k=type==='vida'?'vitality':'mana';d[k]=Array.from({length:next},(_,i)=>i);restore(d)}
 else if(type==='vida')window.setVitality(next);else window.setMana(next);
 show();
}
function conditionKey(){return 'hurras:conditions:'+key()}
function conditions(){try{const a=JSON.parse(localStorage.getItem(conditionKey())||'[]');return Array.isArray(a)?a:[]}catch(e){return []}}
function saveConditions(items){try{localStorage.setItem(conditionKey(),JSON.stringify(items))}catch(e){setNotice('Não foi possível salvar a condição.')}show()}
function combat(){
 const r=resources(),grid=el('div');grid.className='ht-combat';content.append(grid);
 for(const [type,val,max] of [['vida',r.vida,r.maxVida],['mana',r.mana,r.maxMana]]){
  const block=el('article'),name=el('b',(type==='vida'?'Vida: ':'Mana: ')+val+' / '+max);
  block.append(name);
  const prog=el('progress');prog.max=max;prog.value=Math.max(0,val);block.append(prog);
  const buttons=el('div');buttons.className='ht-btns';block.append(buttons);
  for(const step of [-5,-1,1,5])button((step>0?'+':'')+step,()=>adjust(type,step),buttons);
  button('Restaurar',()=>adjust(type,max-resources()[type]),buttons);
  grid.append(block)
 }
 const condition=el('article');condition.append(el('b','Condições temporárias'));
 const tags=el('div');tags.id='htConditionList';condition.append(tags);
 for(const item of conditions())button(item+' ×',()=>saveConditions(conditions().filter(x=>x!==item)),tags);
 const select=el('select');
 for(const v of ['', 'Queimando','Sangramento','Atordoado','Envenenado','Caído','Protegido','Abalado']){
  const opt=el('option',v||'Selecione a condição');opt.value=v;select.append(opt)
 }
 condition.append(select);
 button('Adicionar',()=>{if(select.value&&!conditions().includes(select.value))saveConditions([...conditions(),select.value])},condition);
 content.append(condition)
}
function equipment(){
 const d=get()||{};
 if(dark)return(d.gear||[]).slice(0,5).map((name,i)=>{
  const objects=i===4?D.armors||{}:D.weapons||{};
  return {id:i===4?'Armadura':'Arma '+(i+1),name,item:Object.values(objects).find(x=>x.name===name),bonus:d.adv?.[i],penalty:d.disadv?.[i]}
 });
 return ['weapon1','weapon2','armor','shield'].map(id=>{
  const group=id==='armor'?D.armors:id==='shield'?D.shields:D.weapons;
  const name=d.inputs?.[id];return {id,name,item:group?.[name]}
 });
}
function equip(){
 const intro=el('p','Catálogo e características de cada item equipado. Os buffs e debuffs originais são mantidos.');
 content.append(intro);
 const setup=el('article');
 const slot=el('select'),category=el('select'),item=el('select');
 const slots=dark?[['0','Principal'],['1','Secundária'],['2','Distância'],['3','Reserva'],['4','Armadura']]:
 [['weapon1','Principal'],['weapon2','Secundária'],['armor','Armadura'],['shield','Escudo']];
 for(const [value,label] of slots){const op=el('option',label);op.value=value;slot.append(op)}
 for(const label of [...['1 Mão','2 Mãos','Médio alcance','À Distância','Armadura'],...(dark?[]:['Escudo'])]){
  const op=el('option',label);op.value=label;category.append(op)
 }
 const allowed=x=>!dark||!/mágic|magic|rúnic|arcano|encantad|feitiç|instrumental/i.test([x.name,x.category].join(' '));
 function choices(){
  const cat=category.value;if(cat==='Armadura')return Object.values(D.armors||{});
  if(cat==='Escudo')return dark?[]:Object.values(D.shields||{});
  return Object.values(D.weapons||{}).filter(w=>allowed(w)&&
   (cat==='Médio alcance'?/Médio alcance/i.test(w.category||''):
    cat==='À Distância'?/Distância/i.test(w.category||''):
    cat==='1 Mão'?/1 Mão/i.test(w.category||''):/2 Mãos?/i.test(w.category||'')));
 }
 function fill(){item.replaceChildren();for(const w of choices()){const opt=el('option',w.name);opt.value=w.name;item.append(opt)}}
 category.onchange=fill;
 slot.onchange=()=>{if(slot.value==='4'||slot.value==='armor')category.value='Armadura';if(slot.value==='shield')category.value='Escudo';fill()};
 fill();const row=el('div');row.className='ht-btns';
 row.append(slot,category,item);
 button('Equipar',()=>{
  const w=choices().find(x=>x.name===item.value);if(!w)return setNotice('Selecione um equipamento.');
  remember();
  if(dark){const state=get(),i=Number(slot.value);state.gear[i]=w.name;state.adv[i]=w.bonus||'';state.disadv[i]=w.penalty||'';restore(state)}
  else {const select=byId(slot.value);const option=select&&[...select.options].find(x=>x.value===w.name);
   if(!option)return setNotice('Selecione um espaço compatível com o tipo do equipamento.');
   select.value=w.name;select.dispatchEvent(new Event('change',{bubbles:true}));window.HurrasStorage?.saveDraft?.()
  }
  setNotice('Equipamento aplicado.');show()
 },row);
 setup.append(el('b','Armeiro por categoria'),row);content.append(setup);
 const list=el('div');list.className='ht-equipment';content.append(list);
 for(const x of equipment()){
  const card=el('article');card.className='ht-equip';
  const item=x.item||{};
  card.append(el('b',x.id+': '+(item.name||x.name||'Sem equipamento')));
  for(const text of [
   'Categoria: '+(item.category||'—'),
   'Dano / efeito: '+(item.damage||item.attribute||item.effect||'Conforme catálogo'),
   'Defesa: '+(item.defense||item.mods?.Armadura||'—')+' · Peso: '+(item.weight||item.peso||'Não informado'),
   'Buff: '+(x.bonus||item.bonus||'—'),
   'Debuff: '+(x.penalty||item.penalty||'—')]){
    card.append(el('p',text))
  }
  list.append(card);
 }
}
function allowance(){try{return Math.max(0,Math.min(50,Number(localStorage.getItem('hurras:allowance')??5)||0))}catch(e){return 5}}
function pointsUsed(){
 const d=get()||{};
 if(dark)return Object.entries(d.stats||{}).filter(([name])=>name!=='Força de Vontade').reduce((n,[name,value])=>n+Math.max(0,Number(value)||0),0);
 return Object.entries(d.state?.base||{}).reduce((n,[name,value])=>{
  const template=D.races?.[d.inputs?.race]?.template||{};
  const aliases={'Força':'Forca','Manipulação':'Manipulacao','Percepção':'Percepcao','Reação':'Reacao','Inteligência':'Inteligencia','Persuasão':'Persuasao'};
  return n+Math.max(0,(Number(value)||0)-(Number(template[aliases[name]||name])||0));
 },0)
}
function points(){
 const used=pointsUsed(),limit=level()*allowance(),box=el('div');
 box.className='ht-points';content.append(box);
 for(const [value,label] of [[used,'Pontos distribuídos'],[limit,'Referência total'],[limit-used,'Saldo de referência']]){
  const card=el('article'),strong=el('strong',String(value));card.append(strong,el('p',label));box.append(card)
 }
 const label=el('label','Pontos por nível (valor editável pelo Mestre, não é regra obrigatória)');
 const inp=el('input');inp.type='number';inp.min='0';inp.max='50';inp.value=allowance();
 inp.onchange=()=>{try{localStorage.setItem('hurras:allowance',String(Math.max(0,Math.min(50,Number(inp.value)||0))))}catch(e){}show()};
 label.append(inp);content.append(label);
 content.append(el('p','A referência começa em 5 por nível. Não limita os atributos. Na ficha clássica, pontos raciais iniciais não contam como distribuídos.'))
}
function magic(){
 const all=Object.keys(D.spells||{});
 const schools=dark?all.filter(x=>['Fogo','Água','Vento','Terra','Raio','Veneno'].includes(x)):all;
 const chosen=dark?get()?.fields?.Elemento:byId('magicSchool')?.value;
 const picker=el('div');picker.className='ht-magic';content.append(picker);
 const sl=el('label','Escola / elemento'),school=el('select');
 for(const val of schools){const opt=el('option',val);opt.value=val;school.append(opt)}
 if(schools.includes(chosen))school.value=chosen;sl.append(school);picker.append(sl);
 const ml=el('label','Magia'),spell=el('select');ml.append(spell);picker.append(ml);
 const info=el('p');picker.append(info);
 function detail(){const s=(D.spells?.[school.value]||[]).find(x=>x.name===spell.value);info.textContent=s?[s.tier,s.desc,s.info].filter(Boolean).join(' · '):'Não há magias cadastradas.'}
 function update(){spell.replaceChildren();for(const s of D.spells?.[school.value]||[]){const op=el('option',s.name);op.value=s.name;spell.append(op)}detail()}
 school.onchange=update;spell.onchange=detail;update();
 button('Adicionar magia',()=>{
  const name=spell.value;if(!name)return;remember();
  if(dark){const d=get();if(d.magic.includes(name))return setNotice('Magia já presente.');let i=Array.from({length:18},(_,k)=>k).find(k=>!d.magic[k]);if(i===undefined)return setNotice('Sem espaço para outra magia.');d.magic[i]=name;d.fields.Elemento=school.value;restore(d)}
  else {const area=byId('knownSpells'),values=area.value.split(/[\n,]/).map(x=>x.trim()).filter(Boolean);if(!values.includes(name))values.push(name);area.value=values.join(', ');window.renderSheets();window.HurrasStorage?.saveDraft?.()}
  setNotice('Magia adicionada à ficha.');show();
 },picker)
}
function show(){
 content.replaceChildren();
 for(const b of nav.querySelectorAll('[data-tab]'))b.classList.toggle('selected',b.dataset.tab===tab);
 ({combat:combat,equip:equip,points:points,magic:magic}[tab]||combat)();
}
show();window.addEventListener('pageshow',show);
})();
