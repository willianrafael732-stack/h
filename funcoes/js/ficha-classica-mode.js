/* Alterna edição e prévia de impressão sem recriar inputs ou mudar o cofre. */
(()=>{'use strict';
const edit=document.getElementById('classicModeEdit'),preview=document.getElementById('classicModePDF'),print=document.getElementById('classicPrintView');
if(!edit||!preview||!print)return;
function mode(pdf){
 document.body.classList.toggle('classic-pdf-preview',pdf);
 edit.setAttribute('aria-pressed',String(!pdf));preview.setAttribute('aria-pressed',String(pdf));
 document.getElementById('sheets')?.setAttribute('aria-label',pdf?'Prévia das duas páginas A4 da ficha clássica':'Ficha clássica preenchível');
}
edit.addEventListener('click',()=>mode(false));
preview.addEventListener('click',()=>mode(true));
print.addEventListener('click',()=>document.getElementById('printBtn')?.click());
mode(false);
})();
