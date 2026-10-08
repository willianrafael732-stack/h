/* Bestiário oficial: o texto original é carregado sem alterar as descrições. */
(()=>{"use strict";
const $=id=>document.getElementById(id);
const root=$("archiveGrid"),search=$("archiveSearch"),level=$("archiveLevel"),count=$("archiveCount"),more=$("archiveMore"),print=$("archivePrint");
if(!root||!search||!level||!count||!more)return;
const fold=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
const elem=(tag,content,cls)=>{const node=document.createElement(tag);if(content!==null)node.textContent=content;if(cls)node.className=cls;return node};
const headings=/^(?:Atributos|Habilidades|Magias\s*\/\s*Técnicas|Magias\/Técnicas|Elementos Mágicos|Resistências(?:\s+Magica|\s+Mágicas)?|Descrição|Habitat|Drops?|Armas?|Arma Principal|Talentos|Perícias|Conhecimentos|Passivas?|Fraquezas|História|Equipamento|Árvores de Magia|Técnicas|Poderes)\s*:?\s*$/i;
let all=[],limit=20;
function parse(text){
 const lines=text.replace(/\f/g,"\n").split(/\r?\n/),starts=[];let currentLevel=1;
 for(let i=0;i<lines.length;i++){
  const lev=lines[i].trim().match(/^Nível\s*:?\s*(\d+)\s*$/i);
  if(lev)currentLevel=Number(lev[1]);
  if(!/^\s*Vitalidade\s*:/i.test(lines[i]))continue;
  let j=i-1;while(j>=0&&!lines[j].trim())j--;
  while(j>=0&&/^(Raça|Classe|Tipo|Categoria)\s*:/i.test(lines[j].trim())){j--;while(j>=0&&!lines[j].trim())j--}
  const name=(lines[j]||"").trim();
  if(!name||headings.test(name)||/^[-•\d]|^Nível\b|^Vitalidade\b/i.test(name))continue;
  starts.push({start:j,name,level:currentLevel});
 }
 return starts.map((entry,i)=>{
  const raw=lines.slice(entry.start,i+1<starts.length?starts[i+1].start:lines.length).join("\n").trim();
  const sections=[];let current={heading:"Ficha e atributos",text:[]};sections.push(current);
  for(const line of raw.split("\n")){
   const cleaned=line.trim();
   if(headings.test(cleaned)){current={heading:cleaned.replace(/:$/,""),text:[]};sections.push(current)}
   else current.text.push(line);
  }
  const part=(name)=>{const found=sections.find(x=>fold(x.heading).startsWith(fold(name)));return found?found.text.join("\n").trim():""};
  const life=raw.match(/^\s*Vitalidade\s*:\s*([^\n]+)/mi),mana=raw.match(/^\s*Mana\s*:\s*([^\n]+)/mi);
  return {...entry,raw,sections,description:part("Descrição"),habitat:part("Habitat"),life:life&&life[1].trim(),mana:mana&&mana[1].trim()};
 });
}
function render(){
 const query=fold(search.value.trim()),lvl=level.value;
 const filtered=all.filter(x=>(!query||fold(x.name+" "+x.raw).includes(query))&&(!lvl||String(x.level)===lvl));
 root.replaceChildren();
 for(const c of filtered.slice(0,limit)){
  const card=elem("article",null,"archive-card"),header=elem("div",null,"archive-heading");
  const title=elem("h3",c.name),badge=elem("span","Nível "+c.level,"archive-tag");header.append(title,badge);card.append(header);
  const stats=elem("p",null,"archive-stats");stats.textContent="❤ Vitalidade: "+(c.life||"não informada")+"  •  ✦ Mana: "+(c.mana||"não informada");card.append(stats);
  if(c.description){const p=elem("p",c.description,"archive-description");card.append(p)}
  if(c.habitat){const p=elem("p","Habitat: "+c.habitat,"archive-habitat");card.append(p)}
  const details=elem("details",null,"archive-details"),summary=elem("summary","📖 Abrir ficha completa");
  const body=elem("div",null,"archive-body");
  for(const section of c.sections){
   const clean=section.text.join("\n").trim();if(!clean)continue;
   const h=elem("h4",section.heading);const content=elem("pre",clean,"archive-pre");
   body.append(h,content);
  }
  const original=elem("details"),originalSum=elem("summary","Ver texto integral sem alterações"),pre=elem("pre",c.raw,"archive-pre");
  original.append(originalSum,pre);body.append(original);details.append(summary,body);card.append(details);root.append(card);
 }
 count.textContent=filtered.length+" fichas encontradas no arquivo original · mostrando "+Math.min(filtered.length,limit);
 more.hidden=filtered.length<=limit;
 if(!filtered.length)root.append(elem("p","Nenhuma ficha encontrada. Tente outro nome ou nível.","archive-empty"));
}
function addSelect(){
 const nums=[...new Set(all.map(c=>c.level))].sort((a,b)=>a-b);for(const n of nums){const op=elem("option","Nível "+n);op.value=String(n);level.append(op)}
}
search.addEventListener("input",()=>{limit=20;render()});level.addEventListener("change",()=>{limit=20;render()});
more.addEventListener("click",()=>{limit+=20;render()});
print.addEventListener("click",()=>{limit=Number.MAX_SAFE_INTEGER;render();window.print()});
fetch("dados/bestiario-original.txt").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.text()}).then(text=>{all=parse(text);addSelect();render();}).catch(err=>{count.textContent="Falha ao carregar arquivo: "+err.message;root.replaceChildren(elem("p","Não foi possível abrir as fichas. Recarregue a página.","archive-empty"))});
})();