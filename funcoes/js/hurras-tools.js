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
const targets=dark?[byId('darkEditor'),document.querySelector('.toolbar')]:[document.querySelector('.builder'),byId('sheets')];
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
function saveConditions(items){
 // Uma nova ficha ainda sem ID recebe o seu próprio registro ao usar condições.
 if(dark&&!get()?.id)api()?.save();
 else if(!dark&&!localStorage.getItem('hurrasCurrentFichaId'))window.HurrasStorage?.saveDraft?.();
 try{localStorage.setItem(conditionKey(),JSON.stringify(items))}
 catch(e){setNotice('Não foi possível salvar a condição.')}
 show()
}
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
 content.append(condition);
 if(dark)battleWidget();
}
const battleRules={
 evaluate(dice,needed=1){
  if(!dice.every(n=>Number.isInteger(n)&&n>=1&&n<=10))throw Error('Dado inválido');
  const successes=dice.filter(n=>n>5).length;
  return {dice,successes,ones:dice.filter(n=>n===1).length,tens:dice.filter(n=>n===10).length,
   needed:Math.max(1,Math.floor(Number(needed)||1)),pass:successes>=Math.max(1,Math.floor(Number(needed)||1))}
 },
 roll(n,needed){const faces=[];
  for(let i=0;i<Math.max(1,Math.min(40,Number(n)||1));i++){
   if(window.crypto?.getRandomValues){const a=new Uint32Array(1);do{window.crypto.getRandomValues(a)}while(a[0]>=4294967290);faces.push(1+a[0]%10)}
   else faces.push(1+Math.floor(Math.random()*10))
  }return this.evaluate(faces,needed)
 }
};
if(dark)window.HurrasDarkBattleRules=battleRules;
const freshBattle=()=>({round:1,name:'Adversário',hp:30,maxHp:30,atkDice:3,defDice:2,needed:1,damage:1,
 playerAttack:null,playerDefense:null,enemyAttack:null,enemyDefense:null,initiative:null,damagedPlayer:false,damagedEnemy:false,history:[]});
let battle=null,battleStorage='';
function battleLoad(){
 const key='hurras-dark-battle:'+(get()?.id||'rascunho');
 if(battle&&battleStorage===key)return battle;
 battleStorage=key;battle=freshBattle();
 try{const v=JSON.parse(sessionStorage.getItem(key)||'null');if(v&&typeof v==='object'){
  for(const k of ['round','name','hp','maxHp','atkDice','defDice','needed','damage','history'])
   if(v[k]!==undefined)battle[k]=v[k]
 }}catch(e){}
 return battle;
}
function battleSave(){
 try{sessionStorage.setItem(battleStorage,JSON.stringify({
 round:battle.round,name:battle.name,hp:battle.hp,maxHp:battle.maxHp,atkDice:battle.atkDice,
 defDice:battle.defDice,needed:battle.needed,damage:battle.damage,history:battle.history.slice(0,30)}))}catch(e){}
}
function battleWidget(){
 const b=battleLoad(),wrap=el('section');wrap.className='ht-battle';
 wrap.append(el('h3','⚔ Batalha de d10 · Dificuldade fixa 5'),
 el('p','Regras personalizadas inspiradas em Vampiro: A Máscara. Cada dado é avaliado: 1 = erro crítico; 2–5 = neutro (nem erro nem acerto); 6–9 = 1 sucesso; 10 = 1 sucesso crítico. Não some os valores; conte os sucessos.'));
 const grid=el('div');grid.className='ht-battle-grid';wrap.append(grid);
 function field(host,label,kind,initial,min,max){
  const wrap=el('label',label),input=el(kind);
  if(kind==='input'){input.type='number';input.value=initial;input.min=min;input.max=max}
  wrap.append(input);host.append(wrap);return input
 }
 const attr=field(grid,'Atributo','select'),skill=field(grid,'Habilidade','select');
 const names=['Força','Destreza','Vigor','Empatia','Manipulação','Persuasão','Percepção','Inteligência','Reação','Consciência','Autocontrole','Coragem'];
 const abilities=['Armas brancas','Armas à distância','Briga','Bloqueio','Esquiva','Crítico','Ocultismo','Furtividade','Intimidação','Investigação','Condução','Adestramento','Selos','Sobrevivência'];
 for(const [s,items]of [[attr,names],[skill,abilities]])for(const n of items){const opt=el('option',n);opt.value=n;s.append(opt)}
 const extra=field(grid,'Dados adicionais (não bônus de arma)','input',0,0,30);
 const poolNode=el('output','1 d10'),poolTitle=el('label','Dados do personagem');poolTitle.append(poolNode);grid.append(poolTitle);
 const preset=field(grid,'Dificuldade da ação','select');
 for(const [val,name]of [['1','Fácil: 1 sucesso'],['2','Média: 2 sucessos'],['3','Difícil: 3 sucessos'],['5','Extrema: 5 sucessos'],['custom','Personalizada']]){
  const op=el('option',name);op.value=val;preset.append(op)
 }
 const needed=field(grid,'Sucessos necessários','input',b.needed,1,40);
 preset.value=[1,2,3,5].includes(Number(b.needed))?String(b.needed):'custom';
 const opponent=el('article');opponent.className='ht-battle-opponent';wrap.append(opponent);
 opponent.append(el('h4','Adversário'));
 const foeNameLabel=el('label','Nome'),foeName=el('input');foeName.type='text';foeName.maxLength=70;foeName.value=b.name;
 foeNameLabel.append(foeName);opponent.append(foeNameLabel);
 const foeGrid=el('div');foeGrid.className='ht-battle-grid';opponent.append(foeGrid);
 const atkDice=field(foeGrid,'Dados de ataque','input',b.atkDice,1,40);
 const defDice=field(foeGrid,'Dados de defesa','input',b.defDice,1,40);
 const maxHp=field(foeGrid,'Vida máxima','input',b.maxHp,1,9999);
 const hp=field(foeGrid,'Vida atual','input',b.hp,0,9999);
 const damage=field(foeGrid,'Dano por golpe (manual)','input',b.damage,1,999);
 const round=el('strong','Rodada '+b.round);opponent.append(round);
 const controls=el('div');controls.className='ht-btns';wrap.append(controls);
 const comparison=el('p');wrap.append(comparison);
 const results=el('div');results.className='ht-battle-results';wrap.append(results);
 const cells={};
 for(const [key,label]of [['playerAttack','Seu ataque'],['playerDefense','Sua defesa'],['enemyAttack','Ataque inimigo'],['enemyDefense','Defesa inimiga'],['initiative','Iniciativa']]){
  const cell=el('div');results.append(el('strong',label),cell);cells[key]=cell
 }
 const log=el('details'),logList=el('ol');log.append(el('summary','Histórico de rolagens'),logList);wrap.append(log);
 const limit=(v,min,max)=>Math.max(min,Math.min(max,Math.floor(Number(v)||0)));
 const pool=()=>{const a=get()?.stats||{};
  return limit(Math.max(1,(Number(a[attr.value])||0)+(Number(a[skill.value])||0)+limit(extra.value,0,30)),1,40)
 };
 const read=()=>{
  b.name=foeName.value.slice(0,70)||'Adversário';b.atkDice=limit(atkDice.value,1,40);b.defDice=limit(defDice.value,1,40);
  b.maxHp=limit(maxHp.value,1,9999);b.hp=limit(hp.value,0,b.maxHp);
  b.needed=limit(needed.value,1,40);b.damage=limit(damage.value,1,999);battleSave()
 };
 const success=(attack,defense)=>!!attack&&attack.pass&&(!defense||attack.successes>defense.successes);
 const drawResult=(cell,r)=>{
  cell.replaceChildren();if(!r)return;
  const diceRow=el('div');diceRow.className='ht-battle-dice';
  for(const n of r.dice){const die=el('span',String(n));die.className='ht-battle-die '+(n===1?'fail':n===10?'crit':n>5?'ok':'neutral');diceRow.append(die)}
  cell.append(diceRow,el('small',r.successes+'/'+r.needed+' sucessos; '+r.ones+' erros críticos; '+r.tens+' críticos'))
 };
 const update=()=>{
  poolNode.textContent=pool()+' d10';round.textContent='Rodada '+b.round;hp.value=b.hp;
  for(const [key,cell]of Object.entries(cells))drawResult(cell,b[key]);
  const playerHit=success(b.playerAttack,b.enemyDefense),enemyHit=success(b.enemyAttack,b.playerDefense);
  hitFoe.disabled=!playerHit||b.damagedEnemy||b.hp<=0;
  hitSelf.disabled=!enemyHit||b.damagedPlayer||(get()?.vitality||[]).length<=0;
  comparison.textContent='Seu ataque: '+(b.playerAttack?(playerHit?'SUCESSO':'sem acerto'):'aguardando')+
   ' · Ataque inimigo: '+(b.enemyAttack?(enemyHit?'SUCESSO':'sem acerto'):'aguardando')+
   ' · Vida inimigo: '+b.hp+'/'+b.maxHp+' · Sua vida: '+(get()?.vitality||[]).length;
  logList.replaceChildren();for(const entry of b.history)logList.append(el('li',entry))
 };
 const record=(message,r)=>{
  b.history.unshift('Rodada '+b.round+' · '+message+(r?': ['+r.dice.join(', ')+'] = '+r.successes+' sucessos, '+r.ones+' erros críticos, '+r.tens+' acertos críticos':''));
  b.history=b.history.slice(0,30);battleSave()
 };
 const roll=(key,message,count)=>{
  read();b[key]=battleRules.roll(count,b.needed);
  if(key==='playerAttack'||key==='enemyDefense')b.damagedEnemy=false;
  if(key==='enemyAttack'||key==='playerDefense')b.damagedPlayer=false;
  record(message,b[key]);update()
 };
 button('Rolar ataque',()=>roll('playerAttack','Seu ataque',pool()),controls);
 button('Rolar defesa',()=>roll('playerDefense','Sua defesa',pool()),controls);
 button('Rolar iniciativa',()=>roll('initiative','Iniciativa',pool()),controls);
 button('Ataque inimigo',()=>roll('enemyAttack','Ataque inimigo',limit(atkDice.value,1,40)),controls);
 button('Defesa inimiga',()=>roll('enemyDefense','Defesa inimiga',limit(defDice.value,1,40)),controls);
 const hitFoe=button('Aplicar dano no inimigo',()=>{
  read();if(b.damagedEnemy||!success(b.playerAttack,b.enemyDefense))return;
  b.hp=Math.max(0,b.hp-b.damage);b.damagedEnemy=true;record('Dano '+b.damage+' no inimigo');update()
 },controls);
 const hitSelf=button('Aplicar dano no jogador',()=>{
  read();if(b.damagedPlayer||!success(b.enemyAttack,b.playerDefense))return;
  const d=get(),life=Math.max(0,(d.vitality||[]).length-b.damage);
  remember();d.vitality=Array.from({length:life},(_,i)=>i);restore(d);
  b.damagedPlayer=true;record('Dano '+b.damage+' no jogador');update()
 },controls);
 button('Próxima rodada',()=>{
  read();b.round++;for(const key of ['playerAttack','playerDefense','enemyAttack','enemyDefense','initiative'])b[key]=null;
  b.damagedEnemy=false;b.damagedPlayer=false;record('Próxima rodada');update()
 },controls);
 button('Reiniciar batalha',()=>{
  if(!confirm('Reiniciar batalha? A ficha será preservada.'))return;
  battle=freshBattle();battleStorage='hurras-dark-battle:'+(get()?.id||'rascunho');
  battleSave();tab='combat';show()
 },controls);
 preset.onchange=()=>{if(preset.value!=='custom')needed.value=preset.value;read();update()};
 needed.onchange=()=>{read();preset.value=[1,2,3,5].includes(b.needed)?String(b.needed):'custom';
  for(const key of ['playerAttack','playerDefense','enemyAttack','enemyDefense'])b[key]=null;update()};
 for(const item of [foeName,atkDice,defDice,maxHp,hp,damage])item.onchange=()=>{read();update()};
 attr.onchange=update;skill.onchange=update;extra.onchange=update;
 content.append(wrap);update()
}
function equipment(){
 const d=get()||{};
 if(dark)return(d.gear||[]).slice(0,5).map((name,i)=>{
  const objects=i===4?D.armors||{}:D.weapons||{};
  return {id:i===4?'Armadura':'Arma '+(i+1),name,item:Object.values(objects).find(x=>x.name===name)}
 });
 return ['weapon1','weapon2','armor','shield'].map(id=>{
  const group=id==='armor'?D.armors:id==='shield'?D.shields:D.weapons;
  const name=d.inputs?.[id];return {id,name,item:group?.[name]}
 });
}
function equip(){
 const intro=el('p',dark?'Selecione armas ou armaduras sem aplicar bônus ou penalidades.':'Catálogo e características de cada item equipado. Os buffs e debuffs originais são mantidos.');
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
  if(dark){const state=get(),i=Number(slot.value);state.gear[i]=w.name;state.adv=[];state.disadv=[];restore(state)}
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
  const details=dark
  ? ['Categoria: '+(item.category||'—'),'Tipo: '+(item.name?'Equipamento selecionado':'Não selecionado')]
  : [
   'Categoria: '+(item.category||'—'),
   'Dano / efeito: '+(item.damage||item.attribute||item.effect||'Conforme catálogo'),
   'Defesa: '+(item.defense||item.mods?.Armadura||'—')+' · Peso: '+(item.weight||item.peso||'Não informado'),
   'Buff: '+(x.bonus||item.bonus||'—'),
   'Debuff: '+(x.penalty||item.penalty||'—')];
  for(const text of details){
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
