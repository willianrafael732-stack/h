/* Panteão de Hurras: arquivo ilustrado por mitologia; sem níveis presumidos. */
(()=>{'use strict';
const GODS=[["Nexalis","Aureon","Luz e juramentos","Divindade de Nexalis associada à luz e aos juramentos.","Sagrado","aureon_deus_da_luz_e_dos_juramentos.png"],["Nexalis","Elyndra","Ciclos da vida","Divindade de Nexalis associada ao ciclo da vida.","Vida","elyndra_deusa_dos_ciclos_da_vida.png"],["Nexalis","Miralith","Caminhos celestes","Divindade de Nexalis relacionada aos caminhos celestes.","Celestial","miralith_deusa_dos_caminhos_celestes.png"],["Nexalis","Noxir","Sombras","Divindade de Nexalis relacionada às sombras.","Sombrio","noxir_deus_das_sombras.png"],["Nexalis","Tharun","Forja e pedra","Divindade de Nexalis vinculada à forja e à pedra.","Terra","tharun_o_deus_da_forja_e_da_pedra.png"],["Nexalis","Vorath","Guerra e sangue","Divindade de Nexalis associada à guerra e ao sangue.","Guerra","vorath_deus_da_guerra_e_do_sangue.png"],["Grega","Afrodite","Amor e beleza","Deusa grega associada ao amor e à beleza.","Amor","afrodite_deusa_do_amor_e_beleza.png"],["Grega","Apolo","Sol e profecia","Deus grego associado à profecia, à música e à luz solar.","Luz","apolo_deus_do_sol_e_da_profecia.png"],["Grega","Ares","Guerra","Deus grego associado à guerra.","Guerra","ares_o_deus_da_guerra.png"],["Grega","Atena","Sabedoria","Deusa grega associada à sabedoria, à estratégia e às artes.","Sabedoria","atena_deusa_da_sabedoria.png"],["Grega","Ártemis","Caça","Deusa grega associada à caça e à natureza selvagem.","Natureza","dossiê_de_ártemis_deusa_da_caça.png"],["Grega","Hermes","Mensagens e caminhos","Mensageiro dos deuses na tradição grega, associado a viagens e comércio.","Viagem","hermes_mensageiro_dos_deuses.png"],["Nórdica","Balder","Luz e pureza","Divindade da tradição nórdica associada à luminosidade e à pureza.","Luz","balder_deus_da_luz_e_da_pureza.png"],["Nórdica","Thor","Trovão","Divindade da tradição nórdica associada ao trovão e à proteção.","Raio","thor_o_deus_do_trovão_em_asgard.png"],["Nórdica","Tyr","Justiça","Divindade nórdica associada ao direito, aos juramentos e à guerra.","Justiça","pôster_de_tyr_deus_da_justiça.png"]];
const sections=[['Nexalis','✧','Divindades próprias do cenário Hurras Fantasy / Nexalis.'],['Grega','🏛','Deuses da tradição mitológica grega.'],['Nórdica','ᚦ','Deuses da tradição mitológica nórdica.']];
const $=id=>document.getElementById(id),target=$('godGroups'),find=$('godSearch'),myth=$('mythology'),sort=$('godSort');
const make=(name,txt,cls)=>{const x=document.createElement(name);if(txt!=null)x.textContent=txt;if(cls)x.className=cls;return x};
const normalize=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function card(g){
 const [tradition,name,domain,note,affinity,art]=g,article=make('article',null,'god-card');
 const imageLink=make('a');imageLink.href='../assets/i/'+encodeURIComponent(art);imageLink.target='_blank';imageLink.rel='noopener';imageLink.title='Ampliar retrato de '+name;
 const image=make('img');image.src=imageLink.href;image.loading='lazy';image.decoding='async';image.alt='Arte de '+name;
 image.onerror=()=>{image.onerror=null;image.replaceWith(make('div','Imagem indisponível','god-fallback'))};
 imageLink.append(image);
 const body=make('div',null,'god-details');
 body.append(make('small',tradition==='Nexalis'?'NEXALIS · RPG':tradition.toUpperCase()+' · MITOLOGIA','god-label'));
 body.append(make('h3',name));
 const dl=make('dl');for(const [k,v]of [['Domínio',domain],['Afinidade temática',affinity]]){
  dl.append(make('dt',k),make('dd',v))
 }
 body.append(dl,make('p',note),make('span','Nível no RPG: não definido','god-level'));
 article.append(imageLink,body);return article
}
function render(){
 const term=normalize(find.value),chosen=myth.value;
 let count=0;target.replaceChildren();
 const sets=sort.value==='name'?[['Todos','','Divindades encontradas']]:sections;
 for(const [kind,icon,description]of sets){
  let rows=GODS.filter(g=>(!chosen||g[0]===chosen)&&(sort.value==='name'||g[0]===kind)&&
    (!term||normalize(g.slice(0,5).join(' ')).includes(term))).sort((a,b)=>a[1].localeCompare(b[1],'pt-BR'));
  if(!rows.length)continue;
  count+=rows.length;
  const group=make('section',null,'god-section');
  const heading=make('h2',(icon?icon+' ':'')+(kind==='Todos'?'Deuses encontrados':'Mitologia '+kind));
  group.append(heading,make('p',description,'god-description'));
  const grid=make('div',null,'god-grid');rows.forEach(g=>grid.append(card(g)));group.append(grid);target.append(group);
 }
 if(!count){const empty=make('p','Nenhum deus encontrado para esta busca.','god-empty');target.append(empty)}
 $('godCount').textContent=count+' de '+GODS.length+' divindades ilustradas · '+(chosen||'todas as mitologias');
 document.querySelectorAll('[data-god-myth]').forEach(b=>{const selected=b.dataset.godMyth===chosen;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))})
}
find.addEventListener('input',render);myth.addEventListener('change',render);sort.addEventListener('change',render);
document.querySelectorAll('[data-god-myth]').forEach(b=>b.addEventListener('click',()=>{myth.value=b.dataset.godMyth;render();document.getElementById('godGroups').scrollIntoView({behavior:'smooth',block:'start'})}));
$('godPrint').addEventListener('click',()=>window.print());render();
})();