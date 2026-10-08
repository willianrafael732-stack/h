/* Fichas nórdicas: dados originais preservados e ajustes opcionais de equilíbrio. */
(()=>{"use strict";
const $=id=>document.getElementById(id);
const grid=$("nordicGrid"),search=$("nordicSearch"),kind=$("nordicKind"),order=$("nordicOrder"),count=$("nordicCount"),more=$("nordicMore"),print=$("nordicPrint"),extras=$("nordicExtras");
if(!grid||!search||!kind||!order||!count||!more)return;
const e=(tag,content,cls)=>{const n=document.createElement(tag);if(content!==null)n.textContent=content;if(cls)n.className=cls;return n};
const fold=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const markers={"Atributo Valor":"atributos","Arma":"arma","Ataques":"ataques","Poderes / Técnicas":"poderes","Suprema":"suprema","♾️ Passiva":"passiva","Drop":"drops"};
const prefix="Hurras RPG • Compêndio Nórdico • Página ";
let all=[],limit=18;
function splitSections(raw){
 const result={atributos:[],arma:[],ataques:[],poderes:[],suprema:[],passiva:[],drops:[]};let current="atributos";
 for(const line of raw.split(/\r?\n/)){
  const t=line.trim();if(!t||/^Nível\s*:\s*\d+/.test(t)||/^Atributo\s+Valor$/i.test(t))continue;
  if(Object.prototype.hasOwnProperty.call(markers,t)){current=markers[t];continue}
  if(/^Drop(?:s)?$/i.test(t)){current="drops";continue}
  result[current].push(t);
 }
 return result;
}
function parse(text){
 const parts=text.split(/Hurras RPG • Compêndio Nórdico • Página (\d+)/);
 const chars=[],other=[];
 for(let i=1;i<parts.length;i+=2){
  const page=Number(parts[i]),raw=parts[i+1].trim(),lines=raw.split("\n").map(s=>s.trim()).filter(Boolean),idx=lines.findIndex(s=>/^Nível:\s*\d+/.test(s));
  if(idx>0 && lines[idx-1].includes(" — ")){
   const title=lines[idx-1],name=title.split(" — ")[0],level=Number(lines[idx].match(/\d+/)[0]);
   const beasts=new Set(["FENRIR","JÖRMUNGANDR","YGGDRASIL","SURTUR","SLEIPNIR","NÍÐHÖGGR","SKÖLL","HATI","GARMR"]);
   let type=page>=45?"Chefes do Ragnarök":beasts.has(name)?"Seres nórdicos":"Deuses nórdicos";
   if(page===12||page===13||page===14||page===15)type="Descendentes divinos";
   chars.push({title,name,level,page,raw,type,created:false});
  }else if((page===5||page===9)&&chars.length){chars[chars.length-1].raw+="\n"+raw}
  else if(page>=55){other.push({page,raw})}
 }
 return {chars,other};
}
function manual(name,subtitle,level,hp,mana,type,attributes,weapon,attacks,powers,supreme,passive,description,drops){
 const title=name+" — "+subtitle;
 const raw=[title,"Nível: "+level,"Atributo Valor","Vitalidade "+hp,"Mana "+mana,...attributes,"Arma",...weapon,"Ataques",...attacks,"Poderes / Técnicas",...powers,"Suprema",supreme,"♾️ Passiva",passive,"Drop",...drops].join("\n");
 return {name,title,level,page:null,raw,type,created:true,description};
}
const created=[
 manual("Arvid","HERDEIRO DA CENTELHA",3,48,26,"Semideuses",["Força 7","Destreza 6","Vigor 6","Raio 5"],["Lança de Cobre: 2d10 físico + 1d10 raio"],["Estocada de Faísca — 2d10 físico + 1d10 raio","Arco de Eletricidade — 2d10 raio; alcance 8m"],["Carga Nervosa — +2 Reação por 2 turnos; 5 Mana","Rastro de Luz — revela pegadas recentes; 3 Mana"],"Explosão Menor — 4d10 raio; área 3m; 12 Mana; uma vez por combate.","Pele de Tempestade — reduz em 2 o primeiro dano de raio recebido por turno.","Descendente distante dos guerreiros do trovão que aprende a dominar a energia antes de enfrentar gigantes.",["Fio Condutor — material raro"]),
 manual("Brynja","SANGUE DE VALQUÍRIA",4,56,24,"Semideuses",["Força 7","Destreza 8","Vigor 7","Sagrado 5"],["Espada Curta das Asas: 3d10 físico"],["Corte Valente — 3d10 físico","Investida Alada — 2d10 físico + 1d10 sagrado"],["Escolta — aliado adjacente recebe +2 Defesa por 1 turno; 5 Mana","Asas Breves — desloca 6m sem ataque de oportunidade; 7 Mana"],"Círculo de Coragem — 5d10 sagrado; área 3m; 12 Mana; uma vez por combate.","Última Escolta — 1 vez por combate intercepta um ataque destinado a um aliado próximo.","Jovem marcada pelas valquírias. Sua força vem de proteger aliados, não de vencer batalhas sozinha.",["Pena de Bronze — talismã"]),
 manual("Solveig","FILHA DA AURORA",5,65,45,"Semideuses",["Força 5","Destreza 8","Inteligência 9","Luz 8"],["Cajado Solar: 2d10 físico + 2d10 luz"],["Raio Aurora — 4d10 luz; alcance 12m","Arco do Amanhecer — 2d10 físico + 2d10 luz"],["Bênção da Manhã — cura 3d10; 8 Mana","Luz Serena — remove medo leve de um aliado; 6 Mana"],"Aurora de Midgard — 7d10 luz em área 5m; 15 Mana; uma vez por combate.","Luz Persistente — ao curar um aliado, concede +1 Defesa até o próximo turno; não acumula.","Semideusa da luz conhecida por guiar viajantes e repelir sombras em vilarejos isolados.",["Pedra da Aurora — catalisador"]),
 manual("Hrod","DESCENDENTE DA ROCHA",6,85,20,"Semideuses",["Força 11","Destreza 5","Vigor 11","Terra 7"],["Marreta de Granito: 4d10 físico"],["Golpe Pétreo — 5d10 físico","Ruptura de Pedra — 4d10 terra; área 3m"],["Postura de Rocha — +3 Defesa por 1 turno; 5 Mana","Passo Pesado — empurra o alvo 2m em acerto; 4 Mana"],"Muralha Viva — 7d10 físico; derruba em teste de Vigor; 12 Mana; uma vez por combate.","Corpo Rochoso — reduz em 2 o primeiro dano físico recebido em cada turno.","Herdeiro de sangue gigante cujo domínio sobre pedra exige paciência e autocontrole.",["Núcleo de Granito — material de armadura"]),
 manual("Yrsa","ECO DO INVERNO",7,91,55,"Semideuses",["Força 7","Destreza 11","Vigor 8","Gelo 10"],["Arco de Cristal: 4d10 físico + 2d10 gelo"],["Flecha de Geada — 4d10 físico + 2d10 gelo","Nevasca Curta — 6d10 gelo; área 4m"],["Pegadas Ocultas — +3 Furtividade na neve por 2 turnos; 7 Mana","Prisão de Gelo — restringe deslocamento por 1 turno em teste de Vigor; 8 Mana"],"Caçada da Geada — 10d10 gelo; 18 Mana; uma vez por combate.","Frieza de Caçadora — resistência +3 a gelo; não concede imunidade.","Uma caçadora de sangue divino que protege trilhas no inverno e enfrenta espíritos de gelo.",["Ponta Glacial — material de arco"]),
 manual("Kári","NASCIDO DOS VENTOS",8,100,58,"Semideuses",["Força 8","Destreza 13","Reação 12","Vento 11"],["Adagas do Vendaval: 4d10 físico + 2d10 vento"],["Dança Aérea — 3d10 físico + 3d10 vento","Lâmina Turbilhão — 8d10 vento; alcance 12m"],["Passo do Vento — avança 10m; 8 Mana","Corrente Protetora — +3 Defesa para 1 aliado por 1 turno; 7 Mana"],"Olho do Furacão — 12d10 vento; área 6m; 20 Mana; uma vez por combate.","Respiração Livre — não recebe penalidade leve de vento; tempestades extremas ainda afetam.","Semideus dos ventos, criado nas montanhas. Prefere vencer com agilidade e manobras.",["Brisa Engarrafada — componente mágico"]),
 manual("Eirik","PORTADOR DAS RUNAS",9,115,85,"Semideuses",["Força 8","Percepção 13","Inteligência 14","Magia 12"],["Machado Rúnico: 5d10 físico + 2d10 mágico"],["Corte Rúnico — 6d10 físico + 2d10 mágico","Marca da Queda — 9d10 mágico; alcance 15m"],["Selo de Proteção — +4 Defesa por 2 turnos; 12 Mana","Ler Destino — +1 sucesso em Percepção por 1 turno; 10 Mana"],"Runa da Tempestade — 14d10 mágico; área 7m; 25 Mana; uma vez por combate.","Memória das Runas — 1 vez por combate pode repetir um teste de conhecimento, aceitando o segundo resultado.","Runista semidivino que carrega inscrições ancestrais; aprende os nomes dos poderes antes de invocá-los.",["Estilhaço Rúnico — item raro"]),
 manual("Astrid","GUARDIÃ DO ARCO CELESTE",10,135,95,"Semideuses",["Força 11","Destreza 13","Percepção 15","Sagrado 12"],["Espada da Travessia: 6d10 físico + 2d10 sagrado"],["Corte Celeste — 7d10 físico + 2d10 sagrado","Raio da Travessia — 10d10 sagrado; alcance 20m"],["Escudo da Ponte — +5 Defesa a um aliado por 2 turnos; 13 Mana","Atenção dos Reinos — +2 Percepção por 2 turnos; 8 Mana"],"Vigília Radiante — 16d10 sagrado; área 7m; 26 Mana; uma vez por combate.","Sentinela — não pode sofrer surpresa do mesmo inimigo duas vezes no combate.","Guardião semidivino dos caminhos entre reinos; conhece sinais da Bifröst, mas não controla a ponte de Heimdall.",["Fragmento da Ponte — catalisador"]),
 manual("Kratos","FANTASMA DE ESPARTA (ADAPTAÇÃO)",18,210,80,"Kratos",["Força 24","Destreza 18","Vigor 23","Percepção 17","Inteligência 15","Reação 19","Força de Vontade 21","Fúria 12"],["Lâminas do Caos: 8d10 físico + 4d10 fogo; alcance 6m","Machado Leviatã: 9d10 físico + 3d10 gelo; pode retornar","Escudo do Guardião: +4 Defesa ao bloquear"],["Corte das Lâminas — 8d10 físico + 4d10 fogo","Giro de Esparta — 7d10 físico + 4d10 fogo; acerta até 2 inimigos adjacentes","Arremesso do Leviatã — 9d10 físico + 3d10 gelo; alcance 18m","Retorno do Machado — 8d10 físico + 3d10 gelo; alvo único","Golpe do Escudo — 7d10 físico; pode empurrar 2m","Punho Espartano — 10d10 físico","Quebra-Guarda — 11d10 físico; reduz Defesa do alvo em 2 por 1 turno","Correntes da Guerra — 6d10 físico + 5d10 fogo; alcance 6m","Golpe do Inverno — 8d10 físico + 4d10 gelo; reduz deslocamento por 1 turno","Lança de Draupnir — 8d10 físico + 3d10 mágico; alcance 16m"],["Fúria Espartana — por 2 turnos +3d10 físico e +2 Defesa; 1 vez por combate; exige 12 Fúria","Postura do Guardião — reduz pela metade um ataque físico; 1 vez por combate; custa 10 Mana","Instinto de Guerra — uma vez por combate repete uma rolagem de Reação e aceita o segundo resultado","Troca de Armas — alterna entre Lâminas, Machado e Lança sem gastar ação uma vez por turno"],"Ruptura do Destino — 13d10 físico + 7d10 sagrado; alcance 5m; 25 Mana e 12 Fúria; uma vez por combate.","Espartano Implacável — uma vez por combate, se cair a 0 Vitalidade por dano direto, permanece com 1 PV; não se aplica a execução ou sacrifício narrativo.","Adaptação não oficial do Kratos de God of War para o universo Hurras. Guerreiro veterano, implacável e estrategista. Atua como chefe especial ou aliado de alto nível, mas suas defesas e fúria têm limites claros.",["Corrente Quebrada — relíquia especial","Fragmento de Runas — material raro"])
];
function suggested(s,lv,supreme){
 const dice=[...s.matchAll(/(\d+)d(10|8|6|12)/gi)];if(!dice.length)return s;
 const sum=dice.reduce((n,m)=>n+Number(m[1]),0);
 const multi=s.match(/\b(\d+)\s+ataques?\b/i),actions=multi?Math.max(1,Number(multi[1])):1;
 const max=Math.max(4,Math.floor((supreme?lv*.8+8:lv*.55+5)/actions));
 if(sum<=max)return s;
 const values=dice.map(m=>Math.max(1,Math.floor(Number(m[1])*max/sum)));
 while(values.reduce((a,b)=>a+b,0)>max){let i=values.findIndex(n=>n>1);if(i<0)break;values[i]--}
 let remaining=max-values.reduce((a,b)=>a+b,0),i=0;
 while(remaining>0){values[i++%values.length]++;remaining--}
 let pos=0;return s.replace(/(\d+)d(10|8|6|12)/gi,(_,n,faces)=>values[pos++]+"d"+faces);
}
function addList(body,title,items,c,adjust,supreme){
 if(!items.length)return;
 const h=e("h4",title);body.append(h);
 const ul=e("ul",null,"codex-attack-list");
 for(const item of items){
  const li=e("li"),isSupport=/\b(?:cura|curar|defesa|resistência|regeneração|vitalidade|reação|percepção|inteligência|sucessos?)\b/i.test(item)&&!supreme;const balanced=adjust&&!c.created&&!isSupport?suggested(item,c.level,supreme):item;
  li.append(e("span",balanced));
  if(balanced!==item)li.append(e("small","Original: "+item));
  ul.append(li);
 }
 body.append(ul);
}
function card(c){
 const sec=splitSections(c.raw),article=e("article",null,"codex-card"),head=e("div",null,"codex-heading");
 head.append(e("h3",c.title),e("span","Nível "+c.level,"codex-tag"));article.append(head);
 article.append(e("div",c.type+(c.created?" • Ficha criada para Hurras":" • Compêndio enviado"),"codex-type"));
 const hp=sec.atributos.join("\n").match(/Vitalidade\s+(\d+)/i),mp=sec.atributos.join("\n").match(/Mana\s+(\d+)/i);
 const hpNum=hp?Number(hp[1]):null,mpNum=mp?Number(mp[1]):null;
 let label="❤ Vitalidade: "+(hpNum??"não informada")+" • ✧ Mana: "+(mpNum??"não informada");
 if(!c.created&&hpNum)label+="\n⚖ PV sugerido: "+Math.min(hpNum,Math.floor(60+c.level*(c.page>=45?12:8)));
 if(!c.created&&mpNum)label+=" • Mana sugerida: "+Math.min(mpNum,18+c.level*4);
 article.append(e("p",label,"codex-stats"));
 if(c.description)article.append(e("p",c.description,"codex-description"));
 const det=e("details",null,"codex-details"),summary=e("summary","⚔ Abrir ficha, ataques, magias e drops"),body=e("div",null,"codex-body");
 const attr=sec.atributos.filter(s=>s!==c.title);
 if(attr.length){body.append(e("h4","🧬 Atributos originais"),e("pre",attr.join("\n"),"codex-pre"))}
 if(sec.arma.length)body.append(e("h4","🗡 Arma e bônus originais"),e("pre",sec.arma.join("\n"),"codex-pre"));
 addList(body,"⚔ Ataques em combate",sec.ataques,c,true,false);
 addList(body,"🔮 Magias e técnicas",sec.poderes,c,true,false);
 addList(body,"🌋 Suprema",sec.suprema,c,true,true);
 addList(body,"♾ Passiva",sec.passiva,c,false,false);
 addList(body,"🎁 Drops",sec.drops,c,false,false);
 if(!c.created){body.append(e("p","Equilíbrio sugerido: dano da suprema 1 vez por combate, custo de 12–20 Mana; controle de ação até 1 turno por alvo; ressurreição ou imunidade absoluta no máximo 1 ativação por encontro. Ajustes de dados mostrados acima não alteram o original.","codex-notice"))}
 else body.append(e("p","Ficha original criada para esta campanha. O Mestre pode ajustar ataques, recursos e recompensas.","codex-notice"));
 const exact=e("details"),sum=e("summary","📜 Mostrar transcrição integral sem mudanças"),pre=e("pre",c.raw,"codex-pre");
 exact.append(sum,pre);body.append(exact);det.append(summary,body);article.append(det);return article;
}
function render(){
 const q=fold(search.value.trim()),type=kind.value;
 let selected=all.filter(x=>(!type||x.type===type)&&(!q||fold(x.title+" "+x.raw+" "+(x.description||"")).includes(q)));
 const ord=order.value;
 selected.sort((a,b)=>ord==="level"?a.level-b.level:ord==="high"?b.level-a.level:a.title.localeCompare(b.title,"pt-BR"));
 grid.replaceChildren();for(const c of selected.slice(0,limit))grid.append(card(c));
 count.textContent=selected.length+" fichas · exibindo "+Math.min(limit,selected.length);
 more.hidden=limit>=selected.length;
 if(!selected.length)grid.append(e("p","Nenhuma ficha encontrada.","codex-empty"));
}
function buildExtras(arr){
 extras.replaceChildren();
 for(const item of arr){const det=e("details");det.append(e("summary",item.raw.split("\n")[0]));det.append(e("pre",item.raw,"codex-text"));extras.append(det)}
}
for(const input of [search,kind,order])input.addEventListener(input===search?"input":"change",()=>{limit=18;render()});
more.addEventListener("click",()=>{limit+=18;render()});
print.addEventListener("click",()=>{limit=Number.MAX_SAFE_INTEGER;render();grid.querySelectorAll("details").forEach(d=>d.open=true);extras.querySelectorAll("details").forEach(d=>d.open=true);window.print()});
fetch((document.querySelector('meta[name="hurras-data-base"]')?.content||"dados/")+"compendio-nordico.txt").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.text()}).then(text=>{
 const parsed=parse(text);const exclusive=document.body.dataset.nordicCollection==="deuses";all=(exclusive?parsed.chars.filter(x=>!["Seres nórdicos","Chefes do Ragnarök"].includes(x.type)):parsed.chars).concat(created);buildExtras(exclusive?[]:parsed.other);render();
 if(typeof window.HurrasRenderFeaturedTrio==="function")window.HurrasRenderFeaturedTrio(parsed.chars,created);
}).catch(err=>{count.textContent="Erro ao abrir compêndio: "+err.message;grid.replaceChildren(e("p","Não foi possível carregar as fichas. Recarregue a página.","codex-empty"));});
})();