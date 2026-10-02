/* Catálogo compartilhado de Nexalis: dados únicos, fichas salvas separadamente. */
(function(){
 'use strict';
 const D=window.HURRAS_RPG;if(!D||!D.weapons||!D.armors||!D.shields)return;
 const list=(type)=>{
   const raw=type==='armors'?D.armors:type==='shields'?D.shields:D.weapons;
   return Object.entries(raw).map(([id,item])=>({id,name:item.name||id,category:item.category||(type==='armors'?'Armadura':type==='shields'?'Escudo':'Arma'),bonus:item.bonus||'',penalty:item.penalty||'',allowedClasses:item.allowedClasses||[]}))
 };
 const slotGroup=i=>i===4?'armors':i===6?'shields':'weapons';
 const group=(slot)=>{
   const n=Number(slot);
   if(n===4)return list('armors');
   if(n===6)return list('shields');
   const all=list('weapons');
   if(n===5)return all.filter(x=>/mágic|magic|runa|arcano/i.test(x.category+' '+x.name));
   if(n===0||n===1)return all.filter(x=>!/distância/i.test(x.category)&&!/mágic|magic/i.test(x.category));
   if(n===2||n===3)return all.filter(x=>/distância|médio alcance/i.test(x.category));
   return all;
 };
 const find=(name,slot)=>{
   const norm=s=>String(s||'').trim().toLocaleLowerCase('pt-BR');
   const rows=list(slotGroup(slot));return rows.find(x=>norm(x.name)===norm(name)||norm(x.id)===norm(name));
 };
 window.HurrasEquipment={list,group,find};
})();