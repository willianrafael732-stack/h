/* Hurras RPG — Leitor de textos integrais.
 * Nunca altera o conteúdo original. Renderiza texto exclusivamente com textContent.
 * Cada versão permanece separada para não misturar dados divergentes de campanha. */
(function(root){
"use strict";
const $=id=>document.getElementById(id);
const ids=["d2-full-search","d2-full-group","d2-full-list","d2-full-count","d2-full-title","d2-full-meta","d2-full-text","d2-full-download","d2-full-all","d2-full-message","d2-full-source","d2-full-source-content","d2-full-source-download"];
const ui=Object.fromEntries(ids.map(id=>[id,$(id)]));
if(Object.values(ui).some(x=>!x))return;
const E=(tag,label,cls)=>{
 const item=document.createElement(tag);
 if(label!==undefined&&label!==null)item.textContent=String(label);
 if(cls)item.className=cls;
 return item;
};
const normalize=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
const safeName=s=>String(s||"arquivo").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9_-]+/g,"_").slice(0,80);
let records=[],selected=null,pendingId=null,allData=null,appendix=null,rawSource=null;
const sources=[
 {id:"compendio",name:"Compêndio nórdico • texto completo",url:"../dados/compendio-nordico.txt",description:"Texto integral original do compêndio, preservando todas as páginas, golpes e descrições.",file:"Hurras_Compendio_Nordico_Original.txt",extension:"txt"},
 {id:"anexos",name:"Bestiário, NPCs e fichas complementares",url:"dados/anexos.json",description:"Todo o conteúdo extraído depois do HTML enviado: bestiário, NPCs, Thor, Magni, Modi e Heimdall.",file:"Hurras_Anexos_Originais_Integrais.txt",extension:"json"},
 {id:"html",name:"Deuses 1 • documento HTML original (código-fonte)",url:"../legado/deuses1-original.html",description:"Arquivo antigo integral. É HTML bruto com texto anexado e não uma ficha nova.",file:"Hurras_Deuses1_Original.html",extension:"html"},
 {id:"rtf",name:"Saga do Ragnarök • arquivo RTF original (bruto)",url:"../deuses2%20.htm",description:"Arquivo original no formato RTF. É uma cópia bruta para preservação, incluindo marcações RTF; use as fichas acima para a leitura organizada.",file:"Hurras_Saga_Original.rtf",extension:"rtf"}
];
function download(name,text,type="text/plain;charset=utf-8"){
 const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=E("a");
 a.href=url;a.download=name;a.click();
 setTimeout(()=>URL.revokeObjectURL(url),12000);
}
function record(c,version,text,origin,kind){
 return {id:c.id+(kind?"::"+kind:""),name:c.name,level:c.level,title:c.title,group:c.group,version,origin,text:String(text),kind:kind||"principal",search:normalize([c.name,c.title,c.group,version,origin,text].join(" "))};
}
function allText(){
 return records.map(r=>
  "============================================================\n"+
  "HURRAS RPG | "+r.name+" | "+r.version+" | nível "+r.level+"\n"+
  "Fonte: "+r.origin+"\n"+
  "============================================================\n\n"+r.text
 ).join("\n\n\n");
}
function select(item){
 selected=item;
 ui["d2-full-title"].textContent=item.name+" — "+item.version;
 ui["d2-full-meta"].textContent="Nível "+item.level+" • "+item.group+" • "+item.origin+" • "+item.text.length.toLocaleString("pt-BR")+" caracteres. Sem resumos, cortes ou recálculo de atributos.";
 ui["d2-full-text"].textContent=item.text;
 ui["d2-full-download"].disabled=false;
 for(const element of ui["d2-full-list"].querySelectorAll("button[data-record-id]")){
  const active=element.dataset.recordId===item.id;
  element.setAttribute("aria-pressed",String(active));
  element.classList.toggle("is-active",active);
 }
}
function render(){
 const group=ui["d2-full-group"].value,term=normalize(ui["d2-full-search"].value.trim());
 const visible=records.filter(r=>(!group||group===r.kind)&&(!term||r.search.includes(term)));
 ui["d2-full-list"].replaceChildren();
 for(const r of visible){
  const button=E("button",null,"d2-full-entry");button.type="button";
  button.dataset.recordId=r.id;
  button.setAttribute("aria-pressed",String(selected?.id===r.id));
  if(selected?.id===r.id)button.classList.add("is-active");
  button.append(E("strong",r.name),E("small",r.version),E("span","Nível "+r.level+" • "+r.text.length.toLocaleString("pt-BR")+" caracteres"));
  button.addEventListener("click",()=>select(r));
  ui["d2-full-list"].append(button);
 }
 ui["d2-full-count"].textContent=visible.length+" textos encontrados • "+records.length+" versões integrais cadastradas.";
 if(!visible.length)ui["d2-full-list"].append(E("p","Nenhuma ficha encontrada. Tente outro termo.","d2-empty"));
}
function begin(data,anexos){
 allData=data;appendix=anexos;
 records=[];
 for(const c of data.dossiers){
  records.push(record(c,"Ficha principal",c.raw,"Saga e registros originais de Deuses 2","principal"));
  const norse=data.previousCompendium?.[c.name];
  if(norse)records.push(record(c,"Compêndio nórdico anterior",norse.text,norse.source,"compendio"));
  const alternate=data.previousVersions?.[c.name];
  if(alternate)records.push(record(c,alternate.title,alternate.text,alternate.source,"complemento"));
 }
 const groups=[
  {id:"",label:"Todas as versões"},
  {id:"principal",label:"Fichas principais • "+data.dossiers.length},
  {id:"compendio",label:"Compêndio anterior • "+Object.keys(data.previousCompendium||{}).length},
  {id:"complemento",label:"Fichas complementares • "+Object.keys(data.previousVersions||{}).length}
 ];
 const picker=ui["d2-full-group"];picker.replaceChildren();
 for(const g of groups){const option=E("option",g.label);option.value=g.id;picker.append(option)}
 render();
 const match=records.find(x=>x.id===pendingId)||records.find(x=>x.name===pendingId)||records[0];
 if(match)select(match);
 ui["d2-full-message"].textContent="Transcrições completas carregadas, preservando todas as versões, inclusive as divergentes.";
}
function openRecord(id){
 pendingId=id;
 if(records.length){
  const match=records.find(r=>r.id===id)||records.find(r=>r.name===id);
  if(match){ui["d2-full-search"].value="";ui["d2-full-group"].value="";render();select(match)}
 }
}
function displaySource(source){
 const panel=ui["d2-full-source-content"];
 panel.textContent="";
 ui["d2-full-source-download"].disabled=true;
 ui["d2-full-message"].textContent="Carregando arquivo original: "+source.name+"…";
 const fetchContent=source.id==="anexos"&&appendix?Promise.resolve(appendix.fullText):
  fetch(source.url).then(res=>{if(!res.ok)throw Error("HTTP "+res.status);return source.extension==="json"?res.json().then(j=>j.fullText):res.text()});
 fetchContent.then(text=>{
  if(ui["d2-full-source"].value!==source.id)return;
  rawSource={id:source.id,text};
  panel.textContent=text;
  panel.scrollTop=0;
  ui["d2-full-source-download"].disabled=false;
  ui["d2-full-message"].textContent="Texto completo disponível: "+text.length.toLocaleString("pt-BR")+" caracteres. "+source.description;
 }).catch(err=>{ui["d2-full-message"].textContent="Erro ao abrir a fonte: "+err.message});
}
ui["d2-full-search"].addEventListener("input",render);
ui["d2-full-group"].addEventListener("change",render);
ui["d2-full-download"].disabled=true;
ui["d2-full-download"].addEventListener("click",()=>{
 if(!selected)return;
 download("Hurras_"+safeName(selected.name)+"_"+safeName(selected.version)+".txt",selected.text);
 ui["d2-full-message"].textContent="Versão completa de "+selected.name+" preparada para download.";
});
ui["d2-full-all"].disabled=true;
ui["d2-full-all"].addEventListener("click",()=>{
 if(!records.length)return;
 download("Hurras_Todas_as_Fichas_Dos_Deuses_Texto_Integral.txt",allText());
 ui["d2-full-message"].textContent="Arquivo com todas as "+records.length+" transcrições preparado, sem cortes.";
});
ui["d2-full-source-download"].disabled=true;
for(const s of sources){const opt=E("option",s.name);opt.value=s.id;ui["d2-full-source"].append(opt)}
ui["d2-full-source"].addEventListener("change",()=>{
 const id=ui["d2-full-source"].value;const src=sources.find(x=>x.id===id);
 if(src)displaySource(src);
});
ui["d2-full-source-download"].addEventListener("click",()=>{
 const src=sources.find(x=>x.id===rawSource?.id);
 if(!src||!rawSource)return;
 download(src.file,rawSource.text,src.id==="html"?"text/html;charset=utf-8":"text/plain;charset=utf-8");
});
root.HurrasTextoIntegral={open:openRecord};
Promise.all([
 fetch("dados/arquivo.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}),
 fetch("dados/anexos.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()})
]).then(([d,anexos])=>{
 if(!Array.isArray(d.dossiers)||!anexos.fullText)throw Error("Os arquivos de origem estão incompletos");
 begin(d,anexos);ui["d2-full-all"].disabled=false;
 displaySource(sources[0]);
}).catch(err=>{
 ui["d2-full-message"].textContent="Não foi possível abrir os textos completos: "+err.message;
 ui["d2-full-count"].textContent="Tente recarregar a página.";
});
})(window);
