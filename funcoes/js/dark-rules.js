/* Regras compartilhadas da ficha normal do Hurras. Estado independente da ficha Dark. */
(function(){'use strict';
 const D=window.HURRAS_RPG||{}, C=window.HurrasEquipment;
 const map={
  'Força':['Forca'],'Destreza':['Destreza'],'Vigor':['Vigor'],
  'Empatia':['Carisma'],'Manipulação':['Manipulacao'],'Persuasão':['Persuasao'],
  'Percepção':['Percepcao'],'Inteligência':['Inteligencia'],'Reação':['Reacao'],
  'Intimidação':['Intimidacao'],'Liderança':['Lideranca'],'Lábia':['Labia'],
  'Bloqueio':['Bloqueio'],'Esquiva':['Esquiva'],'Briga':['Briga'],
  'Disparada':['ArmasDistancia','ArmaDistancia','Investida'],
  'Crítico':['Critico'],'Ocultismo':['Ocultismo','Ocultacao'],
  'Adestramento':['Adestramento'],'Ofício':['Oficio','Oficios'],
  'Condução':['Cavalgada','Conducao'],'Armas à distância':['ArmasDistancia','ArmaDistancia'],
  'Armas brancas':['Armas1H','Arma1H','Armas2H','Arma2H'],
  'Segurança':['Seguranca'],'Furtividade':['Furtividade'],'Armadura':['Armadura'],
  'Investigação':['Investigacao'],'Acadêmicos':['Academicos'],
  'Geografia':['Geografia'],'Encantamento':['Encantamento'],'Selos':['Selos','Runas'],
  'Medicina':['Medicina'],'Ciências':['Ciencia','Ciencias'],
  'Tecnologia':['Tecnologia'],'Linguística':['Linguistica'],
  'Sobrevivência':['Sobrevivencia'],
  'Consciência':['Consciencia'],'Autocontrole':['Autocontrole'],'Coragem':['Coragem']
 };
 const number=v=>{if(typeof v==='number')return v;const match=String(v??'').match(/[+-]?\d+/);return match?Number(match[0]):0};
 const modifier=(obj,stat)=>{for(const k of [stat,...(map[stat]||[])])if(obj&&obj[k]!=null)return number(obj[k]);return 0};
 const race=s=>D.races?.[s?.fields?.Raça]||null;
 const cls=s=>D.classes?.[s?.fields?.Classe]||null;
 const branch=s=>cls(s)?.variacoes?.[s?.fields?.Subclasse]||null;
 const equipment=s=>{
  const items=[];for(let i=0;i<8;i++){
   const name=s.gear?.[i],found=C?.find(name,i);
   const group=i===4?'armors':i===6?'shields':'weapons';
   const raw=group==='armors'?D.armors:group==='shields'?D.shields:D.weapons;
   const obj=found&&raw?.[found.id];if(obj)items.push({...obj,slot:i});
  }return items;
 };
 const effects=(s,stat)=>{
  const r=race(s),c=cls(s),sub=branch(s);
  const positive=[r?.bonus,c?.statusInicial?.bonus,sub?.bonus,...equipment(s).map(v=>v.mods)];
  const negative=[r?.fraqueza,c?.statusInicial?.fraqueza,sub?.fraqueza];
  let val=0;for(const obj of [...positive,...negative])val+=modifier(obj,stat);
  return val;
 };
 const starting=s=>Object.fromEntries(Object.keys(map).map(stat=>{
  const r=race(s);let val=null;for(const key of map[stat])if(r?.template?.[key]!=null){val=Number(r.template[key]);break}
  return [stat,Math.max(0,Math.min(12,val==null?0:val))];
 }));
 const effective=(s,k)=>{
  if(k==='Força de Vontade')return Math.max(1,Math.min(10,Number(s.fields?.['Nível'])||1));
  return Math.max(0,Math.min(12,number(s.stats?.[k])+effects(s,k)));
 };
 const compatible=(s,item)=>{
  if(!item)return true;const cn=s.fields?.Classe,allow=item.allowedClasses;
  return !cn||!Array.isArray(allow)||!allow.length||allow.includes(cn);
 };
 window.HurrasDarkRules={data:D,race,cls,branch,equipment,effects,starting,effective,compatible};
})();