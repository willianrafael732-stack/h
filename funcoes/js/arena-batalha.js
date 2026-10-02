/* Área de batalha independente: usa o sistema criado no Dark, sem embuti-lo na ficha. */
(function(){'use strict';
const content=document.getElementById('arena'),select=document.getElementById('arenaCharacter'),notice=document.getElementById('arenaStatus');
if(!content||!select)return;
const DARK_KEY='hurrasDarkFantasySheetsV1';
const active=()=>select.value;
function all(){try{const items=JSON.parse(localStorage.getItem(DARK_KEY)||'[]');return Array.isArray(items)?items:[]}catch(_){return []}}
function get(){
 const item=all().find(x=>x.id===active());
 return item||{id:'',fields:{Nome:'Treino',Nível:'1'},stats:{},vitality:Array.from({length:10},(_,i)=>i),mana:[]}
}
function restore(state){
 if(!active())return;
 const items=all(),idx=items.findIndex(x=>x.id===active());
 if(idx<0){notice.textContent='Ficha não encontrada. Atualize a lista de personagens.';return}
 items[idx]={...items[idx],...state,id:active(),updatedAt:new Date().toISOString()};
 try{localStorage.setItem(DARK_KEY,JSON.stringify(items));notice.textContent='Vida atualizada na ficha Dark Fantasy salva: '+(state.fields?.Nome||'Personagem')+'.'}
 catch(_){notice.textContent='Não foi possível salvar a Vida na ficha. Verifique o armazenamento.'}
}
function remember(){} // Alterações ocorrem apenas pelo botão de dano, sem edição automática da ficha.
function el(tag,txt){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;return e}
function button(label,action,where=content){const b=el('button',label);b.type='button';b.addEventListener('click',action);where.append(b);return b}
function populate(){
 const before=select.value;select.replaceChildren();
 const blank=el('option','Treinar sem ficha salva');blank.value='';select.append(blank);
 for(const item of all()){
  if(!item.id)continue;
  const option=el('option',(item.fields?.Nome||'Sem nome')+' · Nível '+(item.fields?.['Nível']||1));
  option.value=item.id;select.append(option)
 }
 if([...select.options].some(x=>x.value===before))select.value=before;
}
let tab='combat';
function show(){content.replaceChildren();battleWidget()}
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

select.addEventListener('change',()=>{
 battle=null;battleStorage='';
 const item=get();notice.textContent=active()?'Personagem selecionado: '+(item.fields?.Nome||'Sem nome')+'. Dano no jogador altera a Vida salva no cofre.':'Modo de treino: não altera personagens salvos.';
 show();
});
document.getElementById('arenaReload').addEventListener('click',()=>{
 populate();battle=null;battleStorage='';show();notice.textContent='Lista de personagens atualizada.';
});
populate();
const wanted=new URLSearchParams(location.search).get('personagem');
if(wanted&&[...select.options].some(x=>x.value===wanted))select.value=wanted;
show();
})();