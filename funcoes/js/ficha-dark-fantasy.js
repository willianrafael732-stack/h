
(function(){
"use strict";
var KEY='hurrasDarkFantasySheetsV1',CURRENT='hurrasDarkFantasyCurrentV1';
var $=id=>document.getElementById(id);
function readAll(){try{var x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return []}}
function writeAll(x){localStorage.setItem(KEY,JSON.stringify(x))}
var data={id:localStorage.getItem(CURRENT)||'',fields:{},stats:{},resist:{},magic:[],magicLevels:{},gear:[],adv:[],disadv:[],vitality:[],mana:[]};
function safeText(x){return String(x||'').replace(/[<>]/g,'').slice(0,120)}
function status(s){$('status').textContent=s}
function dots(host,key,total,collection){
host.replaceChildren();host.style.setProperty('--accent',(host.closest('[data-color]')||{}).dataset?.color||'#ddb97a');
var number=Number(data[collection][key])||0;
for(var i=1;i<=total;i++){var b=document.createElement('button');b.type='button';b.className='dot'+(i<=number?' on':'');b.title=key+': '+i+' / '+total;b.setAttribute('aria-label',key+' '+i);b.setAttribute('aria-pressed',String(i<=number));b.dataset.value=i;
b.addEventListener('click',function(){var val=Number(this.dataset.value);data[collection][key]=(data[collection][key]||0)===val?0:val;dots(host,key,total,collection);autoSave()});
host.append(b)}
}
function rows(el,col,count,cls){el.replaceChildren();for(var i=0;i<count;i++){var b=document.createElement('button');b.type='button';b.className='sq '+cls+((data[col]||[]).includes(i)?' on':'');b.setAttribute('aria-label',(cls==='mana'?'Mana':'Vitalidade')+' '+(i+1));b.dataset.i=i;b.addEventListener('click',function(){var n=Number(this.dataset.i);var a=data[col]||[];data[col]=a.includes(n)?a.filter(x=>x!==n):a.concat(n);rows(el,col,count,cls);autoSave()});el.append(b)}}
function render(){
document.querySelectorAll('[data-field]').forEach(x=>x.value=data.fields[x.dataset.field]||'');
document.querySelectorAll('[data-stat]').forEach(x=>dots(x,x.dataset.stat,x.dataset.stat==='Força de Vontade'?10:12,'stats'));
document.querySelectorAll('[data-resist]').forEach(x=>dots(x,x.dataset.resist,12,'resist'));
document.querySelectorAll('[data-magic]').forEach(x=>x.value=data.magic[Number(x.dataset.magic)]||'');
document.querySelectorAll('[data-magic-dots]').forEach(x=>dots(x,x.dataset.magicDots,10,'magicLevels'));
['gear','adv','disadv'].forEach(k=>document.querySelectorAll('[data-'+k+']').forEach(x=>x.value=(data[k]||[])[Number(x.dataset[k])]||''));
rows($('vitality'),'vitality',100,'vit');rows($('mana'),'mana',50,'mana');list();
}
function list(){var sel=$('savedSheets'),cur=data.id;sel.replaceChildren();var def=document.createElement('option');def.value='';def.textContent='Abrir ficha salva...';sel.append(def);
readAll().forEach(x=>{var op=document.createElement('option');op.value=x.id;op.textContent=safeText(x.fields?.Nome||'Sem nome')+' · '+safeText(x.fields?.Player||'Player');sel.append(op)});sel.value=cur}
function save(manual){if(!data.id)data.id='df-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
var a=readAll(),idx=a.findIndex(x=>x.id===data.id);var item=JSON.parse(JSON.stringify(data));item.updatedAt=new Date().toISOString();if(idx<0)a.push(item);else a[idx]=item;try{writeAll(a);localStorage.setItem(CURRENT,data.id);if(manual){list();status('Ficha salva neste navegador. Faça um backup em JSON para não perder.')}}catch(e){status('Falha ao gravar: armazenamento cheio ou indisponível.')} }
var ticking=false;function autoSave(){if(!ticking){ticking=true;setTimeout(function(){ticking=false;save(false)},350)}}
document.querySelectorAll('[data-field]').forEach(x=>x.addEventListener('input',()=>{data.fields[x.dataset.field]=x.value;autoSave()}));
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
 data.stats[stat]=Math.min(max,roll)
 });
 document.querySelectorAll('[data-resist]').forEach(e=>data.resist[e.dataset.resist]=randint(0,Math.min(12,3+boost)));
 for(let i=0;i<18;i++)data.magicLevels[i]=randint(0,Math.min(10,2+boost));
 data.vitality=[];data.mana=[];render();autoSave();status('Pontos e resistências sorteados. Revise os valores antes de jogar.')
}
$('randomStats').onclick=()=>generateStats();
$('randomSheet').onclick=()=>{
 if(!confirm('Criar uma nova ficha aleatória? A ficha atual será mantida salva.'))return;
 save(false);
 data={id:'',fields:{},stats:{},resist:{},magic:[],magicLevels:{},gear:[],adv:[],disadv:[],vitality:[],mana:[]};
 data.fields={Nome:randomChoice(names)+' '+randomChoice(surnames),Player:'',Crônica:'Nexalis',Nível:String(randint(1,10)),Raça:randomChoice(races),Classe:randomChoice(classes),Profissão:randomChoice(profs),Dinheiro:String(randint(5,200)),Experiência:String(randint(0,450)), 'Nível mágico':String(randint(0,4))};
 data.magic[0]=randomChoice(['Chama viva','Escudo de sombra','Selo de proteção','Toque de cura','Lâmina astral','Rajada de vento','Raiz constritora']);
 data.magic[1]=randomChoice(['Pulso arcano','Véu silencioso','Proteção lunar','Muralha de terra','Marca espectral']);
 data.gear[0]=randomChoice(['Espada curta','Machado','Cajado','Adaga','Lança']);data.gear[2]=randomChoice(['Arco','Besta','Dardo']);data.gear[4]=randomChoice(['Couro','Malha leve','Manto rúnico']);
 data.fields.Itens='Cantil; Tocha; Suprimentos; Poção simples';
 localStorage.removeItem(CURRENT);render();generateStats();save(true);status('Personagem aleatório criado e salvo: '+data.fields.Nome+'.');
};
$('saveSheet').onclick=()=>save(true);
$('newSheet').onclick=()=>{if(!confirm('Criar ficha nova? A atual será mantida salva.'))return;save(false);data={id:'',fields:{},stats:{},resist:{},magic:[],magicLevels:{},gear:[],adv:[],disadv:[],vitality:[],mana:[]};localStorage.removeItem(CURRENT);render();status('Ficha nova criada.')};
$('savedSheets').onchange=e=>{if(!e.target.value)return;var x=readAll().find(v=>v.id===e.target.value);if(x){data=x;localStorage.setItem(CURRENT,data.id);render();status('Ficha carregada.')}};
$('deleteSheet').onclick=()=>{if(!data.id||!confirm('Excluir a ficha atual?'))return;writeAll(readAll().filter(x=>x.id!==data.id));localStorage.removeItem(CURRENT);location.reload()};
$('exportSheet').onclick=()=>{save(false);var a=document.createElement('a'),blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob);a.href=u;a.download='hurras-dark-'+(safeText(data.fields.Nome||'ficha').replace(/\s+/g,'-')||'ficha')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);status('Arquivo JSON de backup exportado.')};
$('importSheet').onchange=async e=>{var f=e.target.files?.[0];if(!f)return;try{var obj=JSON.parse(await f.text());if(!obj||!obj.fields||!obj.stats||!Array.isArray(obj.magic))throw Error('Estrutura diferente');data=Object.assign({fields:{},stats:{},resist:{},magic:[],magicLevels:{},gear:[],adv:[],disadv:[],vitality:[],mana:[]},obj,{id:'df-'+Date.now()});save(true);render();status('Ficha importada como nova cópia.')}catch(ex){status('Erro: arquivo JSON não é uma ficha Hurras Dark Fantasy.')}e.target.value=''};
$('printSheet').onclick=()=>window.print();
var first=readAll().find(x=>x.id===data.id);if(first)data=Object.assign(data,first);render();
})();
