
(function(){
"use strict";
var KEY='hurrasDarkFantasySheetsV1',CURRENT='hurrasDarkFantasyCurrentV1';
var $=id=>document.getElementById(id);
const D=window.HURRAS_RPG||{};
function readAll(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return []}}
function writeAll(x){localStorage.setItem(KEY,JSON.stringify(x))}
var data={id:(()=>{try{return localStorage.getItem(CURRENT)||''}catch(e){return ''}})(),fields:{},stats:{},resist:{},magic:[],magicLevels:{},gear:[],adv:[],disadv:[],vitality:[],mana:[]};
// A ficha Dark usa as mesmas regras de progressão, sem misturar fichas salvas.
const MAX_LEVEL=10;
const currentLevel=()=>Math.max(1,Math.min(MAX_LEVEL,Math.floor(Number(data.fields?.['Nível'])||1)));
const fullTrack=(n)=>Array.from({length:n},(_,i)=>i);
const countTrack=(arr,max)=>Array.isArray(arr)?new Set(arr.map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<max)).size:0;
function normalizeProgress(){
 const level=currentLevel(),life=level*10,mana=level*5;
 if(!data.fields||typeof data.fields!=='object')data.fields={};
 data.fields['Nível']=String(level);
 if(!data.stats||typeof data.stats!=='object')data.stats={};
 data.stats['Força de Vontade']=level;
 for(const [key,max] of [['vitality',life],['mana',mana]]){
  data[key]=Array.isArray(data[key])?[...new Set(data[key].map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<max))].sort((a,b)=>a-b):[];
 }
 return {level,life,mana};
}
function applyLevelChange(raw){
 const previous=currentLevel(),oldLife=previous*10,oldMana=previous*5;
 const hadLife=countTrack(data.vitality,oldLife),hadMana=countTrack(data.mana,oldMana);
 const next=Math.max(1,Math.min(MAX_LEVEL,Math.floor(Number(raw)||1)));
 data.fields['Nível']=String(next);
 // Mantém dano e mana gasta ao subir de nível; nunca excede o novo máximo.
 data.vitality=fullTrack(Math.max(0,next*10-Math.max(0,oldLife-hadLife)));
 data.mana=fullTrack(Math.max(0,next*5-Math.max(0,oldMana-hadMana)));
 normalizeProgress();render();autoSave();
}
function setupOrigins(){
 const box=$('darkRace');if(!box)return;
 box.replaceChildren();const first=document.createElement('option');first.value='';first.textContent='Selecione uma raça';box.append(first);
 Object.keys(D.races||{}).forEach(k=>{const opt=document.createElement('option');opt.value=k;opt.textContent=k;box.append(opt)});
}
function renderOriginInfo(){}
function safeText(x){return String(x||'').replace(/[<>]/g,'').slice(0,120)}
function status(s){$('status').textContent=s}
function dots(host,key,total,collection){
host.replaceChildren();host.style.setProperty('--accent',(host.closest('[data-color]')||{}).dataset?.color||'#ddb97a');
var number=key==='Força de Vontade'?currentLevel():(Number(data[collection][key])||0);
for(var i=1;i<=total;i++){var b=document.createElement('button');b.type='button';b.className='dot'+(i<=number?' on':'');b.title=key+': '+i+' / '+total;b.style.setProperty('--accent',['#ce7167','#e0ae6c','#6fa4d3','#79bd9a'][Math.floor((i-1)/3)%4]);b.setAttribute('aria-label',key+' '+i);b.setAttribute('aria-pressed',String(i<=number));b.dataset.value=i;if(key==='Força de Vontade'){b.disabled=true;b.title='Força de Vontade automática: nível '+currentLevel();}
// Cliques tratados por delegação para que os pontos continuem editáveis após reorganizar o layout.
host.append(b)}
}
// A delegação funciona após reorganização visual e em botões recriados por render().
$('darkEditor').addEventListener('click',event=>{
 const button=event.target.closest('button.dot');
 if(!button||button.disabled)return;
 const host=button.closest('[data-stat],[data-magic-dots],[data-resist]');
 if(!host||!$('darkEditor').contains(host))return;
 const kind=host.hasAttribute('data-stat')?'stats':host.hasAttribute('data-magic-dots')?'magicLevels':'resist';
 const key=host.getAttribute(kind==='stats'?'data-stat':kind==='magicLevels'?'data-magic-dots':'data-resist');
 if(key==='Força de Vontade')return;
 if(!data[kind]||typeof data[kind]!=='object')data[kind]={};
 const value=Number(button.dataset.value);
 data[kind][key]=Number(data[kind][key]||0)===value?0:value;
 dots(host,key,kind==='magicLevels'?10:12,kind);
 autoSave();
});
function rows(el,col,count,cls){
 el.replaceChildren();const lim=currentLevel()*(col==='mana'?5:10);
 for(var i=0;i<count;i++){
  var b=document.createElement('button');b.type='button';
  const locked=i>=lim,filled=!locked&&(data[col]||[]).includes(i);
  b.className='sq '+cls+(filled?' on':'')+(locked?' locked':'');
  b.disabled=locked;b.setAttribute('aria-label',(cls==='mana'?'Mana':'Vida')+' '+(i+1)+(locked?' bloqueado':''));
  b.title=locked?'Desbloqueia no nível '+Math.ceil((i+1)/(col==='mana'?5:10)):'Clique para marcar ou desmarcar';
  b.dataset.i=i;
  if(!locked)b.addEventListener('click',function(){var n=Number(this.dataset.i);var a=data[col]||[];data[col]=a.includes(n)?a.filter(x=>x!==n):a.concat(n);rows(el,col,count,cls);updateCounters();autoSave()});
  el.append(b);
 }
}
function updateCounters(){
 const level=currentLevel(),hp=level*10,mp=level*5;
 for(const [id,value] of [['darkLifeTotal',countTrack(data.vitality,hp)+' / '+hp],
  ['darkManaTotal',countTrack(data.mana,mp)+' / '+mp],['darkWillTotal',level+' / '+level]])
  if($(id))$(id).textContent=value;
}
function isCommonWeapon(w){return !!w&&!/mágic|magic|rúnic|arcano|encantad|feitiç|instrumental/i.test([w.category,w.name].join(' '))}
function stripMagicGear(){
 const ordinary=Object.values(D.weapons||{}).filter(isCommonWeapon);
 const armors=Object.values(D.armors||{});
 for(let i=0;i<5;i++){
  const name=data.gear?.[i];if(!name)continue;
  const all=[...Object.values(D.weapons||{}),...armors];
  const known=all.find(w=>w.name===name);
  // Remove equipment explicitly identified by the source catalog as magical.
  if(known&&i!==4&&!ordinary.includes(known)){data.gear[i]='';data.adv[i]='';data.disadv[i]=''}
 }
 // Legacy magical weapons and extra slots 5..7 no longer belong to Dark.
 for(const k of ['gear','adv','disadv'])if(Array.isArray(data[k]))data[k]=data[k].slice(0,5);
}
function render(){
normalizeProgress();
stripMagicGear();
document.querySelectorAll('[data-field]').forEach(x=>x.value=data.fields[x.dataset.field]||'');
document.querySelectorAll('[data-stat]').forEach(x=>dots(x,x.dataset.stat,x.dataset.stat==='Força de Vontade'?10:12,'stats'));
document.querySelectorAll('[data-resist]').forEach(x=>dots(x,x.dataset.resist,12,'resist'));
document.querySelectorAll('[data-resist-number]').forEach(x=>{if(document.activeElement!==x)x.value=String(Math.max(0,Math.min(12,Number(data.resist[x.dataset.resistNumber])||0)))});
document.querySelectorAll('[data-magic]').forEach(x=>x.value=data.magic[Number(x.dataset.magic)]||'');
document.querySelectorAll('[data-magic-dots]').forEach(x=>dots(x,x.dataset.magicDots,10,'magicLevels'));
['gear','adv','disadv'].forEach(k=>document.querySelectorAll('[data-'+k+']').forEach(x=>x.value=(data[k]||[])[Number(x.dataset[k])]||''));
rows($('vitality'),'vitality',100,'vit');rows($('mana'),'mana',50,'mana');updateCounters();updateElementalSpells();list();
}
function list(){var sel=$('savedSheets'),cur=data.id;sel.replaceChildren();var def=document.createElement('option');def.value='';def.textContent='Abrir ficha salva...';sel.append(def);
readAll().forEach(x=>{var op=document.createElement('option');op.value=x.id;op.textContent=safeText(x.fields?.Nome||'Sem nome')+' · '+safeText(x.fields?.Player||'Player');sel.append(op)});sel.value=cur}
function save(manual){normalizeProgress();if(!data.id)data.id='df-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
var a=readAll(),idx=a.findIndex(x=>x.id===data.id);var item=JSON.parse(JSON.stringify(data));item.updatedAt=new Date().toISOString();if(idx<0)a.push(item);else a[idx]=item;try{writeAll(a);localStorage.setItem(CURRENT,data.id);list();if(manual){status('Ficha salva no cofre deste navegador. Exporte o PDF editável como cópia de segurança.')}}catch(e){status('Falha ao gravar: armazenamento cheio ou indisponível.')} }
// Não salvar ficha vazia nem a ficha errada depois de trocar de personagem.
var saveTimer=null;
function cancelAutoSave(){if(saveTimer!==null){clearTimeout(saveTimer);saveTimer=null}}
function autoSave(){
 cancelAutoSave();
 saveTimer=setTimeout(function(){saveTimer=null;save(false)},400);
}
document.querySelectorAll('[data-field]').forEach(x=>x.addEventListener('input',()=>{
 const k=x.dataset.field;if(k==='Nível'){applyLevelChange(x.value);return}
 data.fields[k]=x.value;
 autoSave();
}));
document.querySelectorAll('[data-magic]').forEach(x=>x.addEventListener('input',()=>{data.magic[Number(x.dataset.magic)]=x.value;autoSave()}));
['gear','adv','disadv'].forEach(k=>document.querySelectorAll('[data-'+k+']').forEach(x=>x.addEventListener('input',()=>{data[k][Number(x.dataset[k])]=x.value;autoSave()})));
const names=['Aeron','Elaria','Noths','Thalor','Kaelen','Mira','Talia','Ravok','Lyra','Faelorn','Dorian','Ysera','Dran','Borin','Eldric','Nyra'];
const surnames=['da Névoa','dos Espinhos','da Cruz Partida','das Cinzas','do Véu','do Inverno','Sombrio','de Valeron','de Nexalis'];
const races=Object.keys(D.races||{});
const classes=Object.keys(D.classes||{});
const profs=['Ferreiro','Viajante','Caçador','Alquimista','Mercador','Erudito','Escudeiro','Explorador'];
function randint(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function randomChoice(arr){return arr[randint(0,arr.length-1)]}
function generateStats(){
 const level=Math.max(1,Math.min(30,parseInt(data.fields['Nível'],10)||1));
 const statKeys=[...document.querySelectorAll('[data-stat]')].map(e=>e.dataset.stat);
 const boost=level>=16?5:level>=9?3:level>=5?2:0;
 const main=randint(0,Math.max(0,statKeys.length-1));
 statKeys.forEach((stat,i)=>{
 const max=stat==='Força de Vontade'?10:12;
 const roll=randint(0,3)+boost+(i===main?2:0);
 data.stats[stat]=stat==='Força de Vontade'?currentLevel():Math.min(max,roll)
 });
 document.querySelectorAll('[data-resist]').forEach(e=>data.resist[e.dataset.resist]=randint(0,Math.min(12,3+boost)));
 for(let i=0;i<18;i++)data.magicLevels[i]=randint(0,Math.min(10,2+boost));
 data.vitality=fullTrack(currentLevel()*10);data.mana=fullTrack(currentLevel()*5);render();autoSave();status('Pontos sorteados; vida, mana e vontade calculadas pelo nível.')
}
function zeroAllDarkPoints(){
 if(!confirm('Zerar atributos, habilidades, magia, resistências, Vida e Mana atuais? Seus equipamentos e os buffs/debuffs das armas serão preservados.'))return;
 data.stats={};
 data.resist={};
 data.magicLevels={};
 data.vitality=[];
 data.mana=[];
 // Força de Vontade permanece automática conforme o nível.
 normalizeProgress();
 render();
 autoSave();
 status('Pontos zerados. Equipamentos e efeitos das armas preservados.');
}
$('randomStats').onclick=()=>generateStats();
$('darkZeroPoints').onclick=zeroAllDarkPoints;
$('randomSheet').onclick=()=>{
 if(!confirm('Criar uma nova ficha aleatória? A ficha atual será mantida salva.'))return;
 cancelAutoSave();if(data.id)save(false);
 data={id:'',fields:{},stats:{},resist:{},magic:[],magicLevels:{},gear:[],adv:[],disadv:[],vitality:[],mana:[]};
 data.fields={Nome:randomChoice(names)+' '+randomChoice(surnames),Player:'',Crônica:'Nexalis',Nível:String(randint(1,10)),Raça:randomChoice(races),Classe:randomChoice(classes),Profissão:randomChoice(profs),Dinheiro:String(randint(5,200)),Experiência:String(randint(0,450)), 'Nível mágico':String(randint(0,4))};
 data.magic[0]=randomChoice(['Chama viva','Escudo de sombra','Selo de proteção','Toque de cura','Lâmina astral','Rajada de vento','Raiz constritora']);
 data.magic[1]=randomChoice(['Pulso arcano','Véu silencioso','Proteção lunar','Muralha de terra','Marca espectral']);
 const ordinary=Object.values(D.weapons||{}).filter(isCommonWeapon);
 const choice={0:ordinary.filter(x=>!/distância/i.test(x.category||'')),
   2:ordinary.filter(x=>/distância|Médio alcance/i.test(x.category||'')),
   4:Object.values(D.armors||{})};
 for(const [i,list] of Object.entries(choice)){
  if(!list.length)continue;const item=randomChoice(list);
  data.gear[i]=item.name;data.adv[i]='';data.disadv[i]='';
 }
 data.fields.Itens='Cantil; Tocha; Suprimentos; Poção simples';
 localStorage.removeItem(CURRENT);render();generateStats();save(true);status('Personagem aleatório criado e salvo: '+data.fields.Nome+'.');
};
$('saveSheet').onclick=()=>save(true);
function freshSheet(){
 cancelAutoSave();
 // As fichas antigas permanecem no cofre; não cria um personagem fantasma no cofre.
 data=sanitizeState({id:'',fields:{'Nível':'1'},stats:{},resist:{},magic:[],magicLevels:{},gear:[],adv:[],disadv:[],vitality:fullTrack(10),mana:fullTrack(5)});
 localStorage.removeItem(CURRENT);render();
 status('Ficha vazia pronta. Os atributos começam em zero; só o nível 1, a Vida e a Mana iniciais são preenchidos.');
}
$('newSheet').onclick=()=>{if(!confirm('Abrir uma ficha vazia? Os personagens salvos continuarão no cofre.'))return;freshSheet()};
$('savedSheets').onchange=e=>{if(!e.target.value)return;var x=readAll().find(v=>v.id===e.target.value);if(x){cancelAutoSave();data=sanitizeState(x);localStorage.setItem(CURRENT,data.id);render();status('Ficha carregada.')}};
$('deleteSheet').onclick=()=>{if(!data.id||!confirm('Excluir a ficha atual?'))return;writeAll(readAll().filter(x=>x.id!==data.id));localStorage.removeItem(CURRENT);location.reload()};
$('printSheet').onclick=()=>{ if(window.HurrasDarkPDF)window.HurrasDarkPDF.print(); else window.print();};
function sanitizeState(v){
 const defaults={id:'',fields:{},stats:{},resist:{},magic:[],magicLevels:{},gear:[],adv:[],disadv:[],vitality:[],mana:[]};
 const x=v&&typeof v==='object'?v:{};const out={...defaults,...x};
 ['fields','stats','resist','magicLevels'].forEach(k=>{if(!out[k]||typeof out[k]!=='object'||Array.isArray(out[k]))out[k]={}});
 ['magic','gear','adv','disadv','vitality','mana'].forEach(k=>{if(!Array.isArray(out[k]))out[k]=[]});
 return out;
}
window.HurrasDarkSheetAPI={
 get:()=>JSON.parse(JSON.stringify(data)),
 update:obj=>{data=sanitizeState(JSON.parse(JSON.stringify(obj)));normalizeProgress();render();autoSave()},
 effectiveStat:key=>Number(data.stats[key]||0),
 put:(obj,asNew)=>{data=sanitizeState(JSON.parse(JSON.stringify(obj)));if(asNew)data.id='';normalizeProgress();save(true);render();status('Ficha importada e salva no navegador.');return data.id},
 save:()=>save(true),preview:()=>render()
};
function initEquipmentCatalog(){
 const ordinary=Object.values(D.weapons||{}).filter(isCommonWeapon);
 const categories=[['dark-melee',ordinary.filter(x=>!/distância/i.test(x.category||''))],
  ['dark-distance',ordinary.filter(x=>/distância|Médio alcance/i.test(x.category||''))],
  ['dark-armor',Object.values(D.armors||{})]];
 for(const [id,items]of categories){
  const host=$(id);if(!host)continue;host.replaceChildren();
  for(const it of items){const op=document.createElement('option');op.value=it.name;host.append(op)}
 }
 document.querySelectorAll('[data-gear]').forEach(input=>input.addEventListener('change',()=>{
  const i=Number(input.dataset.gear),source=i===4?Object.values(D.armors||{}):ordinary;
  const known=Object.values(D.weapons||{}).find(x=>x.name===input.value);
  if(i!==4&&known&&!isCommonWeapon(known)){input.value=data.gear[i]||'';status('Arma mágica não está disponível nesta ficha.');return}
  const chosen=source.find(x=>x.name===input.value);
  if(!chosen)return;
  data.gear[i]=chosen.name;data.adv[i]=chosen.bonus||'';data.disadv[i]=chosen.penalty||'';render();autoSave();
 }));
}
const ELEMENTS=['Fogo','Água','Vento','Terra','Raio','Veneno'];
function updateElementalSpells(){
 const select=$('darkElement'),sp=$('darkElementSpell'),info=$('darkElementInfo');if(!select||!sp)return;
 const element=data.fields.Elemento||'';select.value=ELEMENTS.includes(element)?element:'';
 sp.replaceChildren();const blank=document.createElement('option');blank.value='';blank.textContent=element?'Escolha a magia':'Escolha o elemento';sp.append(blank);
 const spells=ELEMENTS.includes(element)?(D.spells?.[element]||[]):[];
 for(const s of spells){const op=document.createElement('option');op.value=s.name;op.textContent=s.name+' ('+(s.tier||'Magia')+')';sp.append(op)}
 if(info)info.textContent=element?spells.length+' magias de '+element+' disponíveis.':'Escolha um elemento para selecionar suas magias.';
}
function initElemental(){
 const field=$('darkElement');if(!field)return;field.replaceChildren();
 for(const element of ['',...ELEMENTS]){if(element&&!D.spells?.[element]?.length)continue;const op=document.createElement('option');op.value=element;op.textContent=element||'Nenhum elemento';field.append(op)}
 field.addEventListener('change',()=>{data.fields.Elemento=field.value;updateElementalSpells();autoSave()});
 $('darkAddElementSpell')?.addEventListener('click',()=>{
  const element=data.fields.Elemento||'';
  const spell=ELEMENTS.includes(element)?(D.spells?.[element]||[]).find(s=>s.name===$('darkElementSpell').value):null;
  if(!spell){status('Selecione um elemento e uma magia.');return}
  if(data.magic.includes(spell.name)){status('Magia já adicionada à ficha.');return}
  const free=Array.from({length:18},(_,i)=>i).find(i=>!data.magic[i]);
  if(free===undefined){status('Os 18 espaços de magia estão preenchidos.');return}
  data.magic[free]=spell.name;render();autoSave();status('Magia elemental adicionada: '+spell.name);
  $('darkElementInfo').textContent=[spell.desc,spell.info].filter(Boolean).join(' • ');
 });
 updateElementalSpells();
}
initEquipmentCatalog();setupOrigins();
initElemental();
// No cofre, ?new=1 significa FICHA VAZIA, nunca recuperar personagem aleatório.
const query=new URLSearchParams(window.location.search);
const requestedId=query.get('open');
const explicitOpen=requestedId?readAll().find(x=>x.id===requestedId):null;
const last=query.get('resume')==='1'?readAll().find(x=>x.id===data.id):null;
if(explicitOpen||last){
 data=sanitizeState(explicitOpen||last);localStorage.setItem(CURRENT,data.id);
}else{
 // Entrar no criador sem "open" não deve puxar um personagem já salvo.
 data=sanitizeState({id:'',fields:{'Nível':'1'},stats:{},resist:{},magic:[],magicLevels:{},gear:[],adv:[],disadv:[],vitality:fullTrack(10),mana:fullTrack(5)});
 localStorage.removeItem(CURRENT);
}
render();
if(query.get('random')==='1')$('randomSheet').click();
})();
