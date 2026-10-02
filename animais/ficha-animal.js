/* Hurras: ficha animal editável e prévia de impressão independente, preserva chave local antiga. */
(()=>{'use strict';
const form=document.getElementById('animalForm');if(!form)return;
const $=id=>document.getElementById(id),KEY='nexalis:ficha-animal:v1';
let lastLevel=1,timer=null;
const level=()=>Math.max(1,Math.min(20,parseInt($('nivel').value,10)||1));
const maxPV=()=>level()*10,maxMana=()=>level()*5;
const value=(id)=>form.elements.namedItem(id)?.value??'';
const number=(id)=>Math.max(0,Number(value(id))||0);
const clamp=(n,max)=>Math.max(0,Math.min(max,Number(n)||0));
const status=(message)=>{$('animalStatus').textContent=message};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function capture(){return Object.fromEntries(new FormData(form).entries())}
function renderResources(){
 $('nivel').value=level();
 $('pv').max=maxPV();$('mana').max=maxMana();
 $('pv').value=clamp($('pv').value,maxPV());$('mana').value=clamp($('mana').value,maxMana());
 $('maxPV').textContent='/ '+maxPV();$('maxMana').textContent='/ '+maxMana();
 $('healthFill').style.width=(100*number('pv')/maxPV())+'%';
 $('manaFill').style.width=(100*number('mana')/maxMana())+'%';
}
function setLevel(){const oldPV=lastLevel*10,oldMana=lastLevel*5,newLevel=level();
 if(number('pv')>=oldPV)$('pv').value=newLevel*10;
 if(number('mana')>=oldMana)$('mana').value=newLevel*5;
 lastLevel=newLevel;renderResources();preview();
}
function field(label,v){return '<div class="animal-pdf-field"><b>'+esc(label)+'</b><span>'+esc(v||'—')+'</span></div>'}
function textblock(title,txt){return '<section class="animal-pdf-block wide"><h3>'+esc(title)+'</h3><p class="animal-pdf-description">'+esc(txt||'—')+'</p></section>'}
function dots(kind,current,perLevel){let html='<div class="animal-pdf-dots" aria-label="'+esc(kind)+'">';
 const n=Math.min(20,level()),total=clamp(current,n*perLevel);
 for(let i=0;i<n;i++){const remaining=total-i*perLevel;html+='<i class="'+(remaining>=perLevel?'on ':remaining>0?'on partial ':'')+(kind==='Vida'?'life':'energy')+'"></i>'}return html+'</div>';
}
function preview(){
 const pv=clamp(value('pv'),maxPV()),mana=clamp(value('mana'),maxMana());
 $('animalPreview').innerHTML='<div class="animal-pdf-top"><div><small>HURRAS FANTASY · NEXALIS</small><h2>Ficha de Animal</h2><small>COMPANHEIRO • CRIATURA • MONTARIA</small></div><div class="animal-pdf-mark">❧</div></div>'
 +'<div class="animal-pdf-grid"><section class="animal-pdf-block wide"><h3>IDENTIDADE</h3><div class="animal-pdf-fields">'+field('Nome',value('nome'))+field('Espécie',value('especie'))+field('Tipo',value('tipo'))+field('Nível',level())+'</div></section>'
 +'<section class="animal-pdf-block wide"><h3>ESTADO VITAL</h3><div class="animal-pdf-resource"><span>Vida</span><strong>'+pv+' / '+maxPV()+'</strong></div>'+dots('Vida',pv,10)
 +'<div class="animal-pdf-resource"><span>Mana</span><strong>'+mana+' / '+maxMana()+'</strong></div>'+dots('Mana',mana,5)
 +'<small>Cada bolinha corresponde a 10 de vida ou 5 de mana; preenchimento parcial indica pontos restantes.</small></section>'
 +'<section class="animal-pdf-block"><h3>COMBATE</h3><div class="animal-pdf-fields">'+field('Defesa',value('defesa'))+field('Movimento',value('movimento'))+field('Iniciativa',value('iniciativa'))+'</div></section>'
 +'<section class="animal-pdf-block"><h3>ATRIBUTOS</h3><div class="animal-pdf-fields">'+field('Força',value('forca'))+field('Agilidade',value('agilidade'))+field('Vigor',value('vigor'))+field('Percepção',value('percepcao'))+'</div></section>'
 +textblock('ATAQUES',value('ataques'))+textblock('HABILIDADES / INSTINTOS',value('habilidades'))+textblock('FRAQUEZAS / RESISTÊNCIAS',value('fraquezas'))
 +textblock('DESCRIÇÃO',value('descricao'))+'</div><p class="animal-pdf-foot">Hurras Fantasy • Ficha de Animal • Vida = Nível × 10 • Mana = Nível × 5</p>';
}
function persist(show=false){
 try{localStorage.setItem(KEY,JSON.stringify(capture()));if(show)status('Ficha salva neste navegador. Faça backup em JSON para outros dispositivos.');else status('Salvamento automático concluído.');return true}
 catch(e){status('Não foi possível salvar. Verifique espaço ou permissões do navegador.');return false}
}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>persist(false),450)}
function load(){
 let data={};try{data=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){status('O rascunho anterior não pôde ser carregado.')}
 if(typeof data!=='object'||Array.isArray(data))data={};
 for(const [k,v] of Object.entries(data)){const field=form.elements.namedItem(k);if(field&&typeof v!=='object')field.value=String(v)}
 $('nivel').value=level();lastLevel=level();
 if(!Object.prototype.hasOwnProperty.call(data,'pv'))$('pv').value=maxPV();
 if(!Object.prototype.hasOwnProperty.call(data,'mana'))$('mana').value=maxMana();
 renderResources();preview();
}
function mode(pdf){document.body.classList.toggle('animal-mode-pdf',pdf);$('animalModeEdit').setAttribute('aria-pressed',String(!pdf));$('animalModePDF').setAttribute('aria-pressed',String(pdf));preview()}
$('animalModeEdit').addEventListener('click',()=>mode(false));
$('animalModePDF').addEventListener('click',()=>mode(true));
$('animalPrint').addEventListener('click',()=>{renderResources();preview();window.print()});
window.addEventListener('beforeprint',preview);
form.addEventListener('submit',e=>e.preventDefault());
form.addEventListener('input',e=>{if(e.target.id==='nivel')setLevel();else{renderResources();preview()}schedule()});
form.addEventListener('change',e=>{if(e.target.id==='nivel')setLevel();else{renderResources();preview()}schedule()});
$('salvar').addEventListener('click',()=>{clearTimeout(timer);renderResources();persist(true)});
$('limpar').addEventListener('click',()=>{if(!confirm('Limpar a ficha de animal salva neste navegador?'))return;clearTimeout(timer);try{localStorage.removeItem(KEY)}catch(e){status('Não foi possível apagar o rascunho.');return}form.reset();lastLevel=level();$('pv').value=maxPV();$('mana').value=maxMana();renderResources();preview();status('Rascunho limpo. Preencha a ficha para criar outra.')});
$('randomAnimal').addEventListener('click',()=>{
 const species=[['Lobo','Selvagem','Mordida: 1d6','Farejo apurado e caça em bando.'],['Pantera','Companheiro','Garras: 1d6','Furtividade e salto.'],['Urso','Selvagem','Patada: 2d6','Força e resistência.'],['Corvo','Ave','Bicada: 1d4','Visão aguçada.'],['Javali','Selvagem','Investida: 1d6','Ímpeto e resistência.'],['Grifo','Montaria','Garras: 2d6','Voo e visão de longa distância.']];
 const choice=species[Math.floor(Math.random()*species.length)],names=['Sombra','Brasa','Luar','Folha','Trovão','Mistral'];
 $('nome').value=names[Math.floor(Math.random()*names.length)];$('especie').value=choice[0];$('tipo').value=choice[1];$('nivel').value=String(1+Math.floor(Math.random()*10));lastLevel=level();
 $('pv').value=maxPV();$('mana').value=maxMana();$('defesa').value=String(8+level());$('movimento').value=choice[1]==='Ave'?'12m':'9m';$('iniciativa').value=String(1+Math.floor(level()/3));
 for(const id of ['forca','agilidade','vigor','percepcao'])$(id).value=String(1+Math.floor(Math.random()*5));
 $('ataques').value=choice[2];$('habilidades').value=choice[3];$('fraquezas').value='A definir pelo mestre.';$('descricao').value='Criatura de Nexalis, nível '+level()+'.';
 renderResources();preview();persist(true);
});
$('exportAnimal').addEventListener('click',()=>{
 const blob=new Blob([JSON.stringify({_format:'hurras-animal-v1',animal:capture()},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='hurras-animal-'+(value('nome')||'personagem').replace(/[^\p{L}\p{N}-]/gu,'-')+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
});
$('importAnimal').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;try{
 const data=JSON.parse(await file.text());if(data?._format!=='hurras-animal-v1'||!data.animal||typeof data.animal!=='object')throw Error('Formato inválido');
 for(const [k,v] of Object.entries(data.animal)){const f=form.elements.namedItem(k);if(f&&typeof v!=='object')f.value=String(v)}
 lastLevel=level();renderResources();preview();persist(true);status('Animal importado e salvo.')}catch(err){status('Falha na importação: '+err.message)}finally{e.target.value=''}
});
load();mode(false);
})();
