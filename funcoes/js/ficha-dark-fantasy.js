
(function(){
"use strict";
var KEY='hurrasDarkFantasySheetsV1',CURRENT='hurrasDarkFantasyCurrentV1';
var $=id=>document.getElementById(id);
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
function safeText(x){return String(x||'').replace(/[<>]/g,'').slice(0,120)}
function status(s){$('status').textContent=s}
function dots(host,key,total,collection){
host.replaceChildren();host.style.setProperty('--accent',(host.closest('[data-color]')||{}).dataset?.color||'#ddb97a');
var number=key==='Força de Vontade'?currentLevel():(Number(data[collection][key])||0);
for(var i=1;i<=total;i++){var b=document.createElement('button');b.type='button';b.className='dot'+(i<=number?' on':'');b.title=key+': '+i+' / '+total;b.style.setProperty('--accent',['#ce7167','#e0ae6c','#6fa4d3','#79bd9a'][Math.floor((i-1)/3)%4]);b.setAttribute('aria-label',key+' '+i);b.setAttribute('aria-pressed',String(i<=number));b.dataset.value=i;if(key==='Força de Vontade'){b.disabled=true;b.title='Força de Vontade automática: nível '+currentLevel();}
b.addEventListener('click',function(){var val=Number(this.dataset.value);if(key==='Força de Vontade')return;data[collection][key]=(data[collection][key]||0)===val?0:val;dots(host,key,total,collection);autoSave()});
host.append(b)}
}
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
function render(){
normalizeProgress();
document.querySelectorAll('[data-field]').forEach(x=>x.value=data.fields[x.dataset.field]||'');
document.querySelectorAll('[data-stat]').forEach(x=>dots(x,x.dataset.stat,x.dataset.stat==='Força de Vontade'?10:12,'stats'));
document.querySelectorAll('[data-resist]').forEach(x=>dots(x,x.dataset.resist,12,'resist'));
document.querySelectorAll('[data-magic]').forEach(x=>x.value=data.magic[Number(x.dataset.magic)]||'');
document.querySelectorAll('[data-magic-dots]').forEach(x=>dots(x,x.dataset.magicDots,10,'magicLevels'));
['gear','adv','disadv'].forEach(k=>document.querySelectorAll('[data-'+k+']').forEach(x=>x.value=(data[k]||[])[Number(x.dataset[k])]||''));
rows($('vitality'),'vitality',100,'vit');rows($('mana'),'mana',50,'mana');updateCounters();list();
}
function list(){var sel=$('savedSheets'),cur=data.id;sel.replaceChildren();var def=document.createElement('option');def.value='';def.textContent='Abrir ficha salva...';sel.append(def);
readAll().forEach(x=>{var op=document.createElement('option');op.value=x.id;op.textContent=safeText(x.fields?.Nome||'Sem nome')+' · '+safeText(x.fields?.Player||'Player');sel.append(op)});sel.value=cur}
function save(manual){normalizeProgress();if(!data.id)data.id='df-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
var a=readAll(),idx=a.findIndex(x=>x.id===data.id);var item=JSON.parse(JSON.stringify(data));item.updatedAt=new Date().toISOString();if(idx<0)a.push(item);else a[idx]=item;try{writeAll(a);localStorage.setItem(CURRENT,data.id);list();if(manual){status('Ficha salva no cofre deste navegador. Exporte o PDF editável como cópia de segurança.')}}catch(e){status('Falha ao gravar: armazenamento cheio ou indisponível.')} }
var ticking=false;function autoSave(){if(!ticking){ticking=true;setTimeout(function(){ticking=false;save(false)},350)}}
document.querySelectorAll('[data-field]').forEach(x=>x.addEventListener('input',()=>{if(x.dataset.field==='Nível'){applyLevelChange(x.value);return}data.fields[x.dataset.field]=x.value;autoSave()}));
document.querySelectorAll('[data-magic]').forEach(x=>x.addEventListener('input',()=>{data.magic[Number(x.dataset.magic)]=x.value;autoSave()}));
['gear','adv','disadv'].forEach(k=>document.querySelectorAll('[data-'+k+']').forEach(x=>x.addEventListener('input',()=>{data[k][Number(x.dataset[k])]=x.value;autoSave()})));
const names=['Aeron','Elaria','Noths','Thalor','Kaelen','Mira','Talia','Ravok','Lyra','Faelorn','Dorian','Ysera','Dran','Borin','Eldric','Nyra'];
const surnames=['da Névoa','dos Espinhos','da Cruz Partida','das Cinzas','do Véu','do Inverno','Sombrio','de Valeron','de Nexalis'];
const races=['Humano','Elfo','Anão','Orc','Goblin','Draconiano','Meio-elfo','Vampiro','Lobisomem','Fada','Metamorfo','Troll','Djinn'];
const classes=['Guerreiro','Ladino','Mago','Druida','Arqueiro','Ninja','Alquimista','Bardo','Bruxo','Domador','Necromante','Clérigo','Monge'];
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
$('randomStats').onclick=()=>generateStats();
$('randomSheet').onclick=()=>{
 if(!confirm('Criar uma nova ficha aleatória? A ficha atual será mantida salva.'))return;
 save(false);
 data={id:'',fields:{},stats:{},resist:{},magic:[],magicLevels:{},gear:[],adv:[],disadv:[],vitality:[],mana:[]};
 data.fields={Nome:randomChoice(names)+' '+randomChoice(surnames),Player:'',Crônica:'Nexalis',Nível:String(randint(1,10)),Raça:randomChoice(races),Classe:randomChoice(classes),Profissão:randomChoice(profs),Dinheiro:String(randint(5,200)),Experiência:String(randint(0,450)), 'Nível mágico':String(randint(0,4))};
 data.magic[0]=randomChoice(['Chama viva','Escudo de sombra','Selo de proteção','Toque de cura','Lâmina astral','Rajada de vento','Raiz constritora']);
 data.magic[1]=randomChoice(['Pulso arcano','Véu silencioso','Proteção lunar','Muralha de terra','Marca espectral']);
 if(window.HurrasEquipment){
 for(const slot of [0,1,2,3,4,5,6,7]){
  const list=window.HurrasEquipment.group(slot);if(!list.length)continue;
  if([1,3,7].includes(slot)&&Math.random()<.4)continue;
  const item=randomChoice(list);data.gear[slot]=item.name;
  data.adv[slot]=item.bonus;data.disadv[slot]=item.penalty;
 }
}
 data.fields.Itens='Cantil; Tocha; Suprimentos; Poção simples';
 localStorage.removeItem(CURRENT);render();generateStats();save(true);status('Personagem aleatório criado e salvo: '+data.fields.Nome+'.');
};
$('saveSheet').onclick=()=>save(true);
$('newSheet').onclick=()=>{if(!confirm('Criar ficha nova? A atual será mantida salva.'))return;save(false);data={id:'',fields:{'Nível':'1'},stats:{},resist:{},magic:[],magicLevels:{},gear:[],adv:[],disadv:[],vitality:fullTrack(10),mana:fullTrack(5)};localStorage.removeItem(CURRENT);render();status('Ficha nova criada com 10 de vida, 5 de mana e 1 de vontade.')};
$('savedSheets').onchange=e=>{if(!e.target.value)return;var x=readAll().find(v=>v.id===e.target.value);if(x){data=x;localStorage.setItem(CURRENT,data.id);render();status('Ficha carregada.')}};
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
 put:(obj,asNew)=>{data=sanitizeState(JSON.parse(JSON.stringify(obj)));if(asNew)data.id='';normalizeProgress();save(true);render();status('Ficha importada e salva no navegador.');return data.id},
 save:()=>save(true),preview:()=>render()
};
function initEquipmentCatalog(){
 const C=window.HurrasEquipment;if(!C)return;
 const targets=[['hurras-melee',0],['hurras-ranged',2],['hurras-armors',4],['hurras-magic',5],['hurras-shields',6],['hurras-all-weapons',7]];
 for(const [id,slot] of targets){
  const datalist=$(id);if(!datalist)continue;
  datalist.replaceChildren();
  for(const info of C.group(slot)){
   const option=document.createElement('option');option.value=info.name;option.label=(info.category||'Arma')+' — '+(info.bonus||'Sem bônus');datalist.append(option);
  }
 }
 document.querySelectorAll('[data-gear]').forEach(input=>input.addEventListener('change',()=>{
  const slot=Number(input.dataset.gear),item=C.find(input.value,slot);
  if(!item)return;
  data.gear[slot]=item.name;
  data.adv[slot]=item.bonus;
  data.disadv[slot]=item.penalty;
  render();autoSave();
 }));
}
initEquipmentCatalog();
var first=readAll().find(x=>x.id===data.id);if(first)data=sanitizeState(Object.assign(data,first));else{data.fields['Nível']='1';data.vitality=fullTrack(10);data.mana=fullTrack(5)}render();
})();
