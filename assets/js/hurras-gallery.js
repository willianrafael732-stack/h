/* Hurras: zoom acessível para artes e arte de emergência quando um arquivo falhar. */
(()=>{'use strict';
const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function image(name,kind,element){
 const colors={Fogo:['#f47c45','#502025'],'Água':['#65c2ec','#112b56'],Terra:['#95b973','#202d20'],Vento:['#b5d1d0','#31414f'],Veneno:['#c4df67','#34431e'],Sombrio:['#af72d4','#1c1439'],Sagrado:['#f6d68f','#454052'],Mental:['#9ea5f2','#24264a'],Raio:['#dce67e','#283151']};
 const [shine,dark]=colors[element]||colors.Sombrio;
 const animal=/Lobo|Pantera|Fera|Animal|Serpente|Corvo|Morcego|Urso|Javali|Grifo/i.test(name+' '+kind);
 const wing=/Dragão|Fênix|Corvo|Grifo|Celestial|Serafim/i.test(name+' '+kind);
 const roots=/Planta|Raiz|Bosque|Elemental/i.test(name+' '+kind);
 const horns=/Demônio|Dragão|Ogro|Troll|Minotauro|Aberração|Orc/i.test(name+' '+kind);
 const core=animal?'M210 700Q150 500 290 394L400 345 510 394Q650 530 590 700L530 805H270Z':roots?'M220 805Q150 600 290 416L348 284 400 372 466 284 530 416Q660 600 590 805Z':'M220 805L274 468 332 421 330 336Q310 220 401 210Q487 230 470 340L467 422 526 472 580 805Z';
 const decoration=(wing?'<path d="M318 489Q90 399 105 225Q260 302 355 395M483 489Q713 399 695 225Q539 302 450 395"/>':'')+(horns?'<path d="M333 337Q259 259 275 140L362 260M466 337Q537 259 525 140L436 260"/>':'')+(roots?'<path d="M400 350V155M339 480L227 282M469 480L581 282M290 730L182 845M516 730L618 845"/>':'');
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100"><defs><radialGradient id="a"><stop stop-color="'+shine+'" stop-opacity=".5"/><stop offset="1" stop-color="'+dark+'"/></radialGradient></defs><rect width="800" height="1100" fill="#080912"/><rect x="22" y="22" width="756" height="1056" fill="url(#a)" stroke="'+shine+'" stroke-width="4"/><circle cx="400" cy="465" r="280" fill="none" stroke="'+shine+'" opacity=".5" stroke-width="4"/><g fill="'+dark+'" stroke="'+shine+'" stroke-width="10" stroke-linejoin="round">'+decoration+'<path d="'+core+'"/></g><path d="M326 404l42 4M431 408l42-4" stroke="'+shine+'" stroke-width="11"/><rect x="60" y="857" width="680" height="180" fill="#090a11" fill-opacity=".96" stroke="'+shine+'"/><text x="400" y="927" text-anchor="middle" fill="#f8ebdd" font-family="Georgia,serif" font-size="31" font-weight="bold" textLength="620" lengthAdjust="spacingAndGlyphs">'+escape(name).slice(0,80)+'</text><text x="400" y="989" text-anchor="middle" fill="'+shine+'" font-family="Arial" font-size="25">'+escape(kind).slice(0,55)+'</text><text x="400" y="1066" text-anchor="middle" fill="#ccb8a0" font-family="Arial" font-size="17">HURRAS • ARTE ILUSTRATIVA</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)
}
window.HurrasArt={image};
let dialog,img,scroller,scale=1;
function make(){
 dialog=document.createElement('dialog');dialog.className='hurras-image-dialog';
 dialog.innerHTML='<div class="hurras-image-toolbar"><strong id="hurrasZoomTitle">Arte do Hurras</strong><div><button data-act="less" type="button" aria-label="Diminuir">−</button><button data-act="reset" type="button">100%</button><button data-act="more" type="button" aria-label="Ampliar">+</button><a id="hurrasOriginal" target="_blank" rel="noopener">Imagem original</a><button data-act="close" type="button">Fechar ×</button></div></div><div class="hurras-image-scroller"><img id="hurrasZoomImg" alt=""></div>';
 document.body.append(dialog);img=dialog.querySelector('img');scroller=dialog.querySelector('.hurras-image-scroller');
 dialog.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(b){const a=b.dataset.act;if(a==='close')dialog.close();else {scale=a==='more'?Math.min(4,scale*1.25):a==='less'?Math.max(.5,scale/1.25):1;resize()}}else if(e.target===dialog)dialog.close()});
 scroller.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();scale=e.deltaY<0?Math.min(4,scale*1.15):Math.max(.5,scale/1.15);resize()},{passive:false});
}
function resize(){img.style.width=scale*100+'%';dialog.querySelector('[data-act=reset]').textContent=Math.round(scale*100)+'%'}
document.addEventListener('click',e=>{const link=e.target.closest('.monster-image-link,.npc-card > a');if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;const source=link.querySelector('img');if(!source)return;e.preventDefault();if(!dialog)make();scale=1;img.src=source.currentSrc||source.src;img.alt=source.alt;dialog.querySelector('#hurrasZoomTitle').textContent=source.alt;dialog.querySelector('#hurrasOriginal').href=link.href;resize();dialog.showModal()});
})();