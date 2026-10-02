/* Alternância entre edição e prévia A4 sem recriar os personagens nem alterar o cofre. */
(()=>{'use strict';
const edit=document.getElementById('classicModeEdit');
const preview=document.getElementById('classicModePDF');
const print=document.getElementById('classicPrintView');
const heading=document.getElementById('classicPreviewHeading');
const pages=document.getElementById('sheets');
if(!edit||!preview||!print||!heading||!pages)return;
function switchMode(pdf){
 if(pdf&&typeof renderSheets==='function')renderSheets();
 document.body.classList.toggle('classic-pdf-preview',pdf);
 heading.hidden=!pdf;
 edit.setAttribute('aria-pressed',String(!pdf));
 preview.setAttribute('aria-pressed',String(pdf));
 edit.classList.toggle('classic-mode-selected',!pdf);
 preview.classList.toggle('classic-mode-selected',pdf);
 pages.setAttribute('aria-label',pdf?'Pré-visualização para PDF: duas páginas A4 da ficha Hurras Fantasy':'Ficha Hurras Fantasy editável com duas páginas A4');
 if(pdf)window.HurrasStorage?.saveDraft?.();
}
edit.addEventListener('click',()=>switchMode(false));
preview.addEventListener('click',()=>switchMode(true));
print.addEventListener('click',()=>{
 if(typeof renderSheets==='function')renderSheets();
 document.getElementById('printBtn')?.click();
});
switchMode(false);
})();