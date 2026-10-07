const fichas=window.HURRAS_FICHAS||[];
const grid=document.querySelector('#grid'), search=document.querySelector('#search'), modal=document.querySelector('#modal'), sheet=document.querySelector('#sheet');
let filter='all';

function norm(s){return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function category(f){
 const i=f.index;
 if(i<=7)return 'deuses';
 if(i<=31)return 'descendentes';
 if(i<=42)return 'deuses';
 return 'criaturas';
}
function ragnarok(f){return norm(f.name+' '+f.raw).includes('ragnarok')||f.index>=43}
function tokens(raw){
 return raw.replace(/\r/g,'').split(/\s{2,}|\n+/).map(x=>x.trim()).filter(Boolean)
}
function status(raw){
 const n=raw.match(/Nível:\s*(\d+)/i)?.[1]||'—';
 const v=raw.match(/❤️\s*Vitalidade:\s*([0-9]+)/i)?.[1]||'—';
 const m=raw.match(/🔵\s*Mana:\s*([0-9]+)/i)?.[1]||'—';
 return {n,v,m}
}
function titleFor(f){
 const parts=f.name.split(' — ');
 return {main:parts[0]||f.name, sub:parts.slice(1).join(' — ')};
}
function renderCards(list=fichas){
 grid.innerHTML='';
 list.forEach((f,idx)=>{
  const s=status(f.raw), t=titleFor(f);
  const el=document.createElement('article'); el.className='card';
  el.innerHTML=`<div class="sub">FICHA #${f.index} • ${category(f)}</div><h3>${t.main} <span>— ${t.sub}</span></h3>
  <div class="badges"><span class="badge">Nível <strong>${s.n}</strong></span><span class="badge">❤️ <strong>${s.v}</strong></span><span class="badge">🔵 <strong>${s.m}</strong></span></div>`;
  el.onclick=()=>openSheet(f); grid.appendChild(el);
 });
 document.querySelector('#count').textContent=list.length;
}
function makeSections(raw){
 const ts=tokens(raw), sections=[]; let cur={title:'Dados',items:[]};
 const sectionRx=/^(🧬|🗡️|⚔️|🔮|👑|♾️|🧭|🐍|🔥|🌊|🌙|🌞|🌾|🪽|🌈|🐺|🌲|🛡️|🩺|🌸|🧠|🐴|☀️|💀|👻|🩸|🌑|🌳|👹|🌋)/;
 ts.forEach(x=>{
   const upper=norm(x);
   const isSection=sectionRx.test(x) && (
     upper.includes('atribut')||upper.includes('ataques')||upper.includes('magias')||upper.includes('tecnicas')||
     upper.includes('poderes')||upper.includes('suprema')||upper.includes('passiva')||upper.includes('hrafnr')||
     upper.includes('mjolnir')||upper.includes('gungnir')||upper.includes('espada')||upper.includes('arco')||
     upper.includes('tridente')||upper.includes('lamina')||upper.includes('garra')||upper.includes('machado')||
     upper.includes('hofund')||upper.includes('botas')||upper.includes('escudo')||upper.includes('lança')||
     upper.includes('corpo')||upper.includes('poder primordial')||upper.includes('resumo')
   );
   if(isSection && cur.items.length){sections.push(cur);cur={title:x,items:[]}}
   else if(isSection){cur.title=x}
   else cur.items.push(x);
 });
 if(cur.items.length)sections.push(cur);
 return sections;
}
function renderSection(sec){
 const low=norm(sec.title);
 const isAttr=low.includes('atribut');
 const isSup=low.includes('suprema');
 const isPass=low.includes('passiva');
 let cls='section '+(isSup?'supreme ':'')+(isPass?'passive':'');
 if(isAttr){
   const attrs=sec.items.join(' | ').split('|').map(x=>x.trim()).filter(Boolean);
   return `<section class="${cls}"><h3>${sec.title}</h3><div class="attrs">${attrs.map(x=>{
     const q=x.match(/(.+?):\s*(\d+(?:\.\d+)?)/); return q?`<div class="attr"><span>${q[1]}</span><strong>${q[2]}</strong></div>`:`<div class="attr"><span>Info</span><strong>${x}</strong></div>`
   }).join('')}</div></section>`;
 }
 return `<section class="${cls}"><h3>${sec.title}</h3><div class="items">${sec.items.map(x=>{
   const q=x.match(/^([^💥⚔️🔮🌊🔥⚡✨☠️💀🛡️🏃👁️🧠📏🎲⛓️💨❤️🌑🌳🌿❄️🌪️☀️🌙🪨👻🪽🎯🔄🤖❌⬇️]+?)\s+(?=[💥⚔️🔮🌊🔥⚡✨☠️🛡️🏃👁️🧠📏🎲⛓️💨❤️🌑🌳🌿❄️🌪️☀️🌙🪨👻🪽🎯🔄🤖❌⬇️])/);
   return `<div class="item">${q?`<b>${q[1].trim()}</b>`:''}${q?x.slice(q[0].length):x}</div>`
 }).join('')}</div></section>`;
}
function openSheet(f){
 const s=status(f.raw), t=titleFor(f), sections=makeSections(f.raw);
 sheet.innerHTML=`<div class="sheet-inner"><div class="sheet-hero"><div class="eyebrow">⚔️ HURRAS RPG • FICHA #${f.index}</div><h2>${t.main}</h2><div class="subtitle">${t.sub}</div><div class="status"><b>⭐ Nível ${s.n}</b><b>❤️ ${s.v} Vitalidade</b><b>🔵 ${s.m} Mana</b></div></div>${sections.map(renderSection).join('')}<details><summary>📜 Ver conteúdo original da ficha</summary><div class="raw">${f.raw}</div></details></div>`;
 modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}
function close(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelectorAll('[data-close]').forEach(x=>x.onclick=close);
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
function apply(){
 const q=norm(search.value);
 const list=fichas.filter(f=>{
   const okF=filter==='all'||category(f)===filter||(filter==='ragnarok'&&ragnarok(f));
   const okQ=!q||norm(f.name+' '+f.raw).includes(q);
   return okF&&okQ;
 });
 renderCards(list);
}
search.oninput=apply;
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.filter;apply()});
document.querySelector('#randomBtn').onclick=()=>openSheet(fichas[Math.floor(Math.random()*fichas.length)]);
renderCards();
