/* Diagramação WILLIAM.pdf — reorganiza nós existentes sem copiar nem trocar os campos.
 * Os listeners de atributos, PDF, inventário e cofre permanecem nos mesmos elementos. */
(()=>{'use strict';
const editor=document.querySelector('#darkEditor main');
if(!editor||editor.dataset.williamLayout)return;
const panels=Array.from(editor.querySelectorAll(':scope > .panel'));
const identity=panels.find(p=>p.querySelector('h2')?.textContent.includes('Identidade'));
const raceNote=panels.find(p=>p.querySelector('h2')?.textContent.includes('Raça e classe'));
const traitGrid=editor.querySelector(':scope > .traits');
const duo=editor.querySelector(':scope > .two');
if(!identity||!traitGrid||!duo)return;
const traitPanels=Array.from(traitGrid.querySelectorAll(':scope > .panel'));
if(traitPanels.length<8)return;
const section=(cls,title)=>{
 const s=document.createElement('section');s.className=cls;
 if(title){const h=document.createElement('h2');h.textContent=title;s.append(h)}return s
};
const page=(cls,num)=>{
 const p=section('william-sheet '+cls);
 p.setAttribute('aria-label','Ficha Hurras Dark Fantasy, página '+num+' de 2');
 const head=document.createElement('div');head.className='william-masthead';
 const logo=document.createElement('strong');logo.className='william-wordmark';logo.textContent='HURRAS';
 const sub=document.createElement('span');sub.textContent='Dark FANTASY';
 head.append(logo,sub);p.append(head);
 return p;
};
const page1=page('william-page-one',1);
const page2=page('william-page-two',2);
identity.before(page1);
page1.append(identity);
identity.classList.add('william-identification');
if(raceNote){const note=document.createElement('details');note.className='william-extra-details';
 const summary=document.createElement('summary');summary.textContent='Informações do personagem';
 note.append(summary);while(raceNote.firstChild)note.append(raceNote.firstChild);raceNote.remove();
 identity.after(note);
}
const attrs=section('william-attributes','ATRIBUTOS');
[0,1,2].forEach(i=>attrs.append(traitPanels[i]));
page1.append(attrs);
const skills=section('william-skills','HABILIDADES');
[4,5,6].forEach(i=>skills.append(traitPanels[i]));
page1.append(skills);
const resources=section('william-resources');
const vitality=section('william-resource william-vitality','VITALIDADE');
const will=traitPanels[7];
const mana=section('william-resource william-mana','MANA');
function moveUntil(start,finish,target){
 let node=start;
 while(node&&node!==finish){let next=node.nextElementSibling;target.append(node);node=next}
}
const h3s=Array.from(will.children).filter(x=>x.tagName==='H3');
if(h3s.length>=2){
 moveUntil(h3s[0],h3s[1],vitality);
 moveUntil(h3s[1],null,mana);
}
const virtues=section('william-center');
virtues.append(traitPanels[3],will);
resources.append(vitality,virtues,mana);
page1.append(resources);
traitGrid.remove();
const chapter2=Array.from(editor.children).find(x=>x.tagName==='H2'&&x.textContent.includes('Página 2'));
if(chapter2)chapter2.remove();
const chapter1=Array.from(editor.children).find(x=>x.tagName==='H2'&&x.textContent.includes('Página 1'));
if(chapter1)chapter1.remove();
const source=Array.from(duo.children).filter(x=>x.matches('section.panel'));
const magic=source.find(x=>x.querySelector('h2')?.textContent.includes('Magias e técnicas'));
const resist=source.find(x=>x.querySelector('h2')?.textContent.includes('Resistência'));
const gear=source.find(x=>x.querySelector('h2')?.textContent.includes('Arsenal'));
const notes=source.find(x=>x.querySelector('h2')?.textContent.includes('Passivas'));
duo.before(page2);
const spellSection=section('william-spells','MAGIAS / TÉCNICAS');
if(magic){
 magic.querySelector('h2')?.remove();
 const original=magic.querySelectorAll('.trait');
 const list=section('william-spell-rows');
 original.forEach(x=>list.append(x));
 // Mantém o seletor elemental existente, em destaque antes da lista.
 magic.append(list);
 spellSection.append(magic);
}
page2.append(spellSection);
const lower=section('william-lower');
const wheel=(title,kind)=>{
 const box=section('william-wheel',title);
 const ring=section('william-ring');
 const colors={'Fogo':'#da514c','Água':'#44a9ed','Vento':'#82be48','Terra':'#c87c40',
 'Raio':'#dece24','Veneno':'#745ca1','Mental':'#ed76af','Sagrado':'#f2efed','Sombrio':'#191923'};
 const names=['Fogo','Água','Vento','Terra','Raio','Veneno','Mental','Sagrado','Sombrio'];
 names.forEach((name,i)=>{
  const tag=document.createElement('span');tag.className='william-wheel-stone';
  tag.style.setProperty('--element-color',colors[name]);
  tag.style.setProperty('--ring-index',i);tag.style.setProperty('--ring-angle',(i*40)+'deg');tag.style.setProperty('--ring-reverse',(-i*40)+'deg');
  tag.title=name;tag.dataset.element=name;tag.dataset.wheel=kind;
  tag.textContent=name;ring.append(tag)
 });
 box.append(ring);return box
};
const magical=wheel('NÍVEL MÁGICO','magic');
const elementalControls=section('william-element-controls');
if(magic){
 const picker=magic.querySelector('.dark-elemental-picker');
 if(picker)elementalControls.append(picker);
}
magical.append(elementalControls);
lower.append(magical);
const mid=section('william-bottom-center');
if(gear)mid.append(gear);
if(notes)mid.append(notes);
lower.append(mid);
const right=section('william-bottom-resist');
right.append(wheel('RESISTÊNCIA MÁGICA','resist'));
if(resist)right.append(resist);
lower.append(right);
page2.append(lower);
duo.remove();
const footer=editor.querySelector('footer');if(footer)page2.after(footer);
editor.dataset.williamLayout='1';
const api=()=>window.HurrasDarkSheetAPI?.get();
function updateWheels(){
 const d=api();if(!d)return;
 const lvl=Math.max(0,Math.min(10,Number(d.fields?.['Nível mágico'])||0));
 document.querySelectorAll('.william-wheel-stone').forEach(node=>{
  const type=node.dataset.wheel,elem=node.dataset.element;
  const n=type==='magic'?lvl:(Number(d.resist?.[elem])||0);
  node.classList.toggle('is-active',n>0);
  node.title=elem+': '+n+' ponto(s)';
  node.dataset.points=String(n);
 });
}
editor.addEventListener('input',()=>requestAnimationFrame(updateWheels));
editor.addEventListener('click',()=>requestAnimationFrame(updateWheels));
window.addEventListener('pageshow',updateWheels);
updateWheels();
})();