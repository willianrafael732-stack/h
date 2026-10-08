/* Navegação compartilhada Hurras Fantasy • arquivo estático, sem dependências */
(()=>{
'use strict';
const script=document.currentScript;
if(!script||window.__hurrasNavigation)return;
window.__hurrasNavigation=true;
const origin=new URL('.',script.src);
const url=(path)=>new URL(path,origin).href;
const path=decodeURIComponent(location.pathname).toLowerCase();
const groups=[
{label:'Começar',icon:'⌂',items:[
['Início','index.html','Portal Player e Mestre'],['Catálogo geral','funcoes/catalogo.html'],['Catálogo especial','funcoes/catalogo/index.html','Adversários e eventos do Ragnarök'],
['Minhas fichas','funcoes/criacao-de-ficha.html','Retomar personagens clássicos'],
['Nova ficha clássica','funcoes/clan.html?new=1','Forja original'],
['Fichário Dark Fantasy','funcoes/ficha-dark-fantasy.html','Segundo sistema de ficha'],['Cofre Dark Fantasy','funcoes/dark-personagens.html','Gerenciar fichas do novo modelo'],
['Biblioteca','funcoes/biblioteca.html','Todas as opções do jogo']]},
{label:'Personagem',icon:'◈',items:[
['Criar ficha clássica','funcoes/clan.html','Editor de personagem'],
['Cofre de personagens','funcoes/criacao-de-ficha.html','Fichas salvas'],['Cofre Dark','funcoes/dark-personagens.html','Fichas Dark salvas'],
['Fichário Dark Fantasy','funcoes/ficha-dark-fantasy.html','Bolinha e evolução'],
['Ficha de animal','animais/ficha-animal.html','Companheiros e mascotes'],
['Raças e classes','funcoes/racaeclasses.html','Escolher raça e estilo'],
['Origens','funcoes/origem.html','Origens do personagem'],
['Novas origens','funcoes/novas-origens.html','Origens extras'],
['Profissões','profissao/profissoes.html','Ocupações e talentos'],
['Clãs','funcoes/clan.html','Forja e características']]},
{label:'Regras & magias',icon:'✧',items:[
['Sistema completo','funcoes/sistema-completo.html','Regras detalhadas da campanha'],
['Habilidades','funcoes/habilidades.html','Habilidades dos personagens'],
['Grimório de magia','funcoes/magia.html','Magias e feitiços'],
['Grimório legado','funcoes/grimorio-elemental-legado.html','Magias do sistema antigo'],
['Alquimia','funcoes/alquimia.html','Preparos de alquimia'],
['Poções','funcoes/porcao.html','Poções e efeitos'],
['Ingredientes','funcoes/INGREDIENTES.HTML','Materiais alquímicos'],
['Minérios','funcoes/minerios.html','Materiais encontrados']]},
{label:'Arsenal',icon:'⚔',items:[
['Armas','armas/armas.html','Visão geral das armas'],
['Armas de curto alcance','armas/curtoalacance.html','Corpo a corpo'],
['Armas de médio alcance','armas/medioalcance.html','Alcance médio'],
['Armas de médio alcance II','armas/medioalcance2M.html','Armas alternativas'],
['Armas de longo alcance','armas/longo.html','Distância maior'],
['Armas mágicas','armas/magicos.html','Equipamentos arcanos'],
['Armaduras','armas/armaduras.html','Proteções e defesa'],
['Escudos','armas/escudo.html','Bloqueio e resistência'],
['Runas','armas/Runas.html','Poderes rúnicos'],
['Encantos','armas/encantos.html','Encantamentos'],
['Armas instrumentais','armas/Instrumentais.html','Ferramentas especiais']]},
{label:'Mundo & seres',icon:'♜',items:[
['Bestiário • fichas completas','funcoes/bestiario/index.html','110 criaturas do arquivo + 19 seres nórdicos'],
['Deuses & mitologias','funcoes/deuses/index.html','Panteões, semideuses e combate nórdico'],
['Deuses 2 • saga completa','funcoes/deuses2/index.html','57 fichas, 228 figuras divinas e crônica em oito partes'],
['Galeria de imagens','funcoes/galeria-i.html','192 imagens originais assets/i'],
['Animais','animais/animais.html','Criaturas e companheiros'],
['NPCs conhecidos','funcoes/npcs.html','Revelados aos jogadores'],
['Arquivo de NPCs • 43','funcoes/arquivo-npcs.html','Todos os NPCs reunidos'],
['Biblioteca','funcoes/biblioteca.html','Coleção de referências']]},
{label:'Mestre',icon:'♛',items:[
['Painel do mestre','funcoes/mestre.html','Preparar sessões'],
['NPCs do mestre','funcoes/mestre-npcs.html','Notas e segredos da campanha'],
['Arquivo de NPCs','funcoes/arquivo-npcs.html','43 NPCs da campanha'],
['☠ Bestiário completo','funcoes/bestiario/index.html','Criaturas e chefes + textos originais'],
['✦ Panteão dos Deuses','funcoes/deuses/index.html','Divindades, Thor e semideuses'],
['Regras completas','funcoes/sistema-completo.html','Livro do mestre'],
['Forja de ficha','funcoes/clan.html','Gerenciar personagens']]},
{label:'Raças',icon:'♟',items:[
['Humano','classes/humano.html','Raça'],['Elfo','classes/elfo.html','Raça'],
['Anão','classes/anao.html','Raça'],['Goblin','classes/goblin.html','Raça'],
['Orc','classes/orc.html','Raça'],['Meio-orc','classes/meio-orc.html','Raça'],
['Meio-elfo','classes/meio-elfo.html','Raça'],['Vampiro','classes/vampiro.html','Raça'],
['Zumbi','classes/zumbi.html','Raça'],['Troll','classes/Troll.html','Raça'],
['Lich','classes/lich.html','Raça'],['Minotauro','classes/minotauro.html','Raça'],
['Anjo','classes/anjo.html','Raça'],['Demônio','classes/demonio.html','Raça'],
['Djinn','classes/djinn.html','Raça'],['Draconiano','classes/draconiano.html','Raça'],
['Fada','classes/fada.html','Raça'],['Fauno','classes/faunos.html','Raça'],
['Gigante','classes/gigante.html','Raça'],['Homem-fera','classes/homem-fera.html','Raça'],
['Lobisomem','classes/lobisomem.html','Raça'],['Metamorfo','classes/metamorfo.html','Raça'],
['Reptiliano','classes/reptiliano.html','Raça'],['Sereiano','classes/sereianos.html','Raça']]},
{label:'Classes',icon:'◆',items:[
['Arqueiro','raca/arqueiro.html','Classe'],['Bardo','raca/bardo.html','Classe'],
['Bruxo','raca/bruxo.html','Classe'],['Clérigo','raca/clerigo.html','Classe'],
['Domador','raca/domador.html','Classe'],['Druida','raca/druida.html','Classe'],
['Guerreiro','raca/guerreiro.html','Classe'],['Ladino','raca/ladino.html','Classe'],
['Lanceiro','raca/lanceiro.html','Classe'],['Mago','raca/mago.html','Classe'],
['Monge','raca/monge.html','Classe'],['Necromante','raca/necromante.html','Classe'],
['Ninja','raca/ninja.html','Classe'],['Tecnomante','raca/tecnomancer.html','Classe'],
['Transmutador','raca/transmutador.html','Classe']]}
];
const mainLinks=[['Início','index.html'],['Fichas','funcoes/criacao-de-ficha.html'],['Dark Fantasy','funcoes/ficha-dark-fantasy.html'],['Regras','funcoes/sistema-completo.html'],['☠ Bestiário','funcoes/bestiario/index.html'],['✦ Panteão','funcoes/deuses/index.html'],['NPCs','funcoes/arquivo-npcs.html'],['Mestre','funcoes/mestre.html']];
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const unique=[...new Map(groups.flatMap(g=>g.items.map(i=>[i[1],{...{group:g.label},name:i[0],path:i[1],detail:i[2]}]))).values()];
function E(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined&&txt!==null)e.textContent=txt;return e}
function A(label,dest,cls){const e=E('a',cls,label);e.href=url(dest);return e}
function build(){
if(document.getElementById('hurras-app-nav'))return;
const css=document.createElement('link');css.rel='stylesheet';css.href=url('hurras-nav.css');document.head.append(css);
const header=E('div','hurras-global-nav');header.id='hurras-app-nav';
header.setAttribute('role','navigation');header.setAttribute('aria-label','Navegação de Hurras Fantasy');
const head=E('div','hnav-top');const brand=A('✦ HURRAS FANTASY','index.html','hnav-brand');brand.setAttribute('aria-label','Hurras Fantasy - início');head.append(brand);
const compact=E('div','hnav-actions');const search=E('button','hnav-search','⌕  Buscar páginas');search.type='button';search.setAttribute('aria-keyshortcuts','Control+K');const menu=E('button','hnav-menu-btn','☰  Todas as opções');menu.type='button';menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-controls','hnav-drawer');compact.append(search,menu);head.append(compact);header.append(head);
const shortcuts=E('div','hnav-shortcuts');
mainLinks.forEach(([label,dest])=>{let a=A(label,dest,'hnav-shortcut');if(dest==='funcoes/bestiario/index.html'||dest==='funcoes/deuses/index.html')a.classList.add('hnav-featured');const target=url(dest).split('?')[0].split('#')[0];if(target===location.href.split('?')[0].split('#')[0]){a.setAttribute('aria-current','page');a.classList.add('active')}shortcuts.append(a)});header.append(shortcuts);
const drawer=E('section','hnav-drawer');drawer.id='hnav-drawer';drawer.hidden=true;
const intro=E('p','hnav-drawer-hint','Escolha uma categoria. Busca rápida: Ctrl + K.');
drawer.append(intro);
const container=E('div','hnav-groups');
groups.forEach(group=>{const block=E('details','hnav-group');const summary=E('summary',null,group.icon+'  '+group.label);const links=E('div','hnav-group-links');group.items.forEach(i=>{const a=A(i[0],i[1]);if(i[1]==='funcoes/bestiario/index.html'||i[1]==='funcoes/deuses/index.html')a.classList.add('hnav-featured-link');links.append(a)});block.append(summary,links);container.append(block)});drawer.append(container);header.append(drawer);
const shade=E('div','hnav-search-shade');shade.id='hnav-search-shade';shade.hidden=true;shade.setAttribute('role','presentation');
const searchBox=E('div','hnav-search-panel');searchBox.setAttribute('role','dialog');searchBox.setAttribute('aria-modal','true');searchBox.setAttribute('aria-label','Buscar páginas do Hurras');const searchHead=E('div','hnav-search-head'),input=E('input','hnav-search-input');
input.type='search';input.id='hnav-global-search';input.placeholder='Digite: poções, armas, bestiário, classes...';input.setAttribute('aria-label','Pesquisar opções');const close=E('button','hnav-close','✕');close.type='button';close.setAttribute('aria-label','Fechar pesquisa');searchHead.append(input,close);const results=E('div','hnav-results');results.id='hnav-results';searchBox.append(searchHead,results);shade.append(searchBox);
const back=E('button','hnav-backtop','↑');back.type='button';back.title='Voltar ao topo';back.setAttribute('aria-label','Voltar ao topo');back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
function hideDrawer(){drawer.hidden=true;menu.setAttribute('aria-expanded','false')}
menu.addEventListener('click',()=>{drawer.hidden=!drawer.hidden;menu.setAttribute('aria-expanded',String(!drawer.hidden))});
function doSearch(){results.replaceChildren();const q=normalize(input.value).trim();const found=unique.filter(it=>!q||normalize(it.name+' '+it.group+' '+it.detail).includes(q)).slice(0,q?32:12);if(!found.length)results.append(E('p','hnav-not-found','Nenhuma opção encontrada. Tente outro nome.'));found.forEach(it=>{let row=A(it.name,it.path,'hnav-result');row.append(E('small',null,it.group+' · '+it.detail));results.append(row)});}
function showSearch(){hideDrawer();shade.hidden=false;input.value='';doSearch();document.body.classList.add('hnav-search-open');input.focus()}
function hideSearch(){shade.hidden=true;document.body.classList.remove('hnav-search-open');search.focus()}
search.addEventListener('click',showSearch);close.addEventListener('click',hideSearch);input.addEventListener('input',doSearch);input.addEventListener('keydown',e=>{if(e.key==='Enter'){let a=results.querySelector('a');if(a)location.href=a.href}});
shade.addEventListener('click',e=>{if(e.target===shade)hideSearch()});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();showSearch()}else if(e.key==='Escape'){if(!shade.hidden)hideSearch();else hideDrawer()}});
document.addEventListener('pointerdown',e=>{if(!header.contains(e.target))hideDrawer()});
const oldnav=document.querySelectorAll('body > header,body > nav,body > .navbar,nav.player-nav,nav.master-nav,nav.navbar,nav.topbar,header.topbar,body > .topbar');
for(const item of oldnav){if(item.id==='hurras-app-nav')continue;if(item.tagName==='NAV'||item.matches('.topbar,.guide-header,.navbar')||item.querySelector('nav')){item.setAttribute('data-hurras-old-nav','true')}}
document.body.prepend(header);document.body.append(shade,back);document.body.classList.add('hurras-has-nav');
const relative=location.href.split('?')[0];if(relative!==url('index.html')&&location.pathname!=='/'){const all=unique.find(x=>url(x.path).split('?')[0]===relative),trail=E('div','hnav-breadcrumb');trail.setAttribute('aria-label','Caminho');trail.append(A('Início','index.html'));if(all){trail.append(E('span',null,'› '+all.group+' › '),E('strong',null,all.name))}else{trail.append(E('span',null,'› '),E('strong',null,document.title||'Página'))}header.append(trail)}
document.addEventListener('scroll',()=>{back.classList.toggle('visible',window.scrollY>500)},{passive:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();
/* Shared responsive styles for every page loading the Hurras menu. */
(function(){if(typeof document==='undefined')return;const root=document.head||document.documentElement;const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('assets/css/hurras-mobile.css',document.currentScript?.src||location.href).href;root.appendChild(css);if(/\/funcoes\/clan\.html/i.test(location.pathname)){const js=document.createElement('script');js.src=new URL('assets/js/hurras-mobile.js',document.currentScript?.src||location.href).href;root.appendChild(js)}})();
