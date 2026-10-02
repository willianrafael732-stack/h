(()=>{'use strict';
const $=id=>document.getElementById(id),rows=[];
function parse(key,def=[]){try{const v=JSON.parse(localStorage.getItem(key)||'null');return Array.isArray(v)?v:def}catch{return def}}
function gatherDark(){return parse('hurrasDarkFantasySheetsV1').map(x=>({id:x.id,kind:'dark',name:x.fields?.Nome||'Sem nome',race:x.fields?.Raça||'',cls:x.fields?.Classe||'',player:x.fields?.Player||'',level:Number(x.fields?.Nível)||1,raw:x,updated:x.updatedAt}))}
async function gatherClassic(){
 let list=parse('hurrasVaultFallbackV2');
 try{const db=await new Promise((ok,bad)=>{const req=indexedDB.open('hurras_fantasy',2);req.onsuccess=()=>ok(req.result);req.onerror=()=>bad(req.error)});
 const data=await new Promise((ok,bad)=>{const tx=db.transaction('characters','readonly');const req=tx.objectStore('characters').getAll();req.onsuccess=()=>ok(req.result||[]);req.onerror=()=>bad(req.error)});db.close();
 const found=new Set(data.map(x=>x.id));list=[...data,...list.filter(x=>!found.has(x.id))];
 }catch(e){}
 return list.map(x=>({id:x.id,kind:'classic',name:x.name||x.data?.inputs?.name||'Sem nome',race:x.race||x.data?.inputs?.race||'',cls:x.className||x.data?.inputs?.class||'',player:x.player||x.data?.inputs?.player||'',level:Number(x.data?.inputs?.level)||1,raw:x,updated:x.updatedAt}));
}
const el=(t,text)=>{const n=document.createElement(t);if(text!==undefined)n.textContent=text;return n};
const conditions=x=>{try{const data=JSON.parse(localStorage.getItem('hurras:conditions:'+x.kind+':'+x.id)||'[]');return Array.isArray(data)?data:[]}catch{return []}};
function details(item){
 const classic=item.kind==='classic',d=item.raw,s=classic?d.data?.state||{}:d,level=item.level;
 const health=classic?level*10-(Number(s.wounds)||0):(s.vitality||[]).length;
 const mana=classic?Number(s.mana)||0:(s.mana||[]).length;
 const weapon=classic?['weapon1','weapon2','armor','shield'].map(k=>d.data?.inputs?.[k]).filter(Boolean):[...(s.gear||[]).filter(Boolean)];
 const stats=classic?s.base:s.stats;
 const box=$('masterDetail');box.hidden=false;box.replaceChildren();
 const h=el('h2',item.name+' — '+(classic?'Clássica':'Dark Fantasy'));
 const values=[
 'Raça: '+(item.race||'—')+' • Classe: '+(item.cls||'—')+' • Nível: '+level,
 'Jogador: '+(item.player||'—'),
 'Vida: '+health+'/'+(level*10)+' • Mana: '+mana+'/'+(level*5)+' • Vontade: '+level,
 'Equipamentos: '+(weapon.join(', ')||'Nenhum'),
 'Condições: '+(conditions(item).join(', ')||'Nenhuma'),
 'Atributos: '+Object.entries(stats||{}).filter(([k])=>k!=='Força de Vontade').map(([k,v])=>k+': '+v).join(' · '),
 'Anotações: '+(classic?d.data?.inputs?.notesText||'':d.fields?.Notas||'')
 ];
 box.append(h,...values.map(s=>el('p',s)));
 box.scrollIntoView({behavior:'smooth',block:'nearest'})
}
function render(){
 const q=$('masterSearch').value.toLocaleLowerCase('pt-BR').trim(),type=$('masterType').value;
 const visible=rows.filter(x=>(type==='all'||x.kind===type)&&[x.name,x.race,x.cls,x.player].join(' ').toLocaleLowerCase('pt-BR').includes(q));
 $('masterCards').replaceChildren();
 for(const item of visible){
  const card=el('article');card.className='master-card';
  card.append(el('h3',item.name),el('p',(item.kind==='dark'?'Dark Fantasy':'Clássica')+' · nível '+item.level),el('p',(item.race||'—')+' · '+(item.cls||'—')));
  const btn=el('button','Consultar cópia');btn.onclick=()=>details(item);card.append(btn);$('masterCards').append(card);
 }
 $('masterCount').textContent=visible.length+' personagens encontrados neste navegador.';
}
async function load(){rows.length=0;rows.push(...await gatherClassic(),...gatherDark());render()}
$('masterSearch').oninput=render;$('masterType').onchange=render;$('masterRefresh').onclick=load;
load();
})();