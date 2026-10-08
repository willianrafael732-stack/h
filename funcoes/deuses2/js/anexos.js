(function(){
"use strict";
const $=id=>document.getElementById(id);
const root=$("d2-archive-results"),counter=$("d2-archive-count"),query=$("d2-archive-query"),group=$("d2-archive-section"),more=$("d2-archive-more"),status=$("d2-archive-status");
if(!root||!counter||!query||!group||!more)return;
const norm=t=>String(t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
function E(tag,txt,cls){const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==null&&txt!==undefined)el.textContent=String(txt);return el}
let source=null,blocks=[],visible=[],limit=10;
function breakUp(text,name){
 const lines=text.replace(/\r\n/g,"\n").split("\n"),result=[];let combined="";
 for(const line of lines){
  if(combined.length+line.length+1>3600&&combined){result.push(combined);combined=""}
  combined+=(combined?"\n":"")+line;
 }
 if(combined.trim())result.push(combined);
 return result.map((chunk,index)=>{const level=chunk.match(/N[íi]vel\s*:?\s*(\d+)/i);const suffix=level?" • nível "+level[1]:"";return {section:name,title:name+suffix+" · trecho "+(index+1)+"/"+result.length,body:chunk}});
}
function build(data){
 if(!data||typeof data.fullText!=="string"||!Array.isArray(data.sections))throw Error("O índice do arquivo está incompleto");
 source=data;
 data.sections.forEach(s=>{if(s.start<0||s.end>s.fullText?.length||s.start>=s.end){};const span=data.fullText.slice(s.start,s.end);blocks.push(...breakUp(span,s.title));const opt=E("option",s.title);opt.value=s.title;group.append(opt)});
 render();
}
function preview(phrase){const chunk=phrase.replace(/\s+/g," ").trim();const q=query.value.trim();if(!q)return chunk.slice(0,225);
 const hay=norm(chunk),needle=norm(q),ix=hay.indexOf(needle);
 if(ix<0)return chunk.slice(0,225);
 return (ix>65?"…":"")+chunk.slice(Math.max(0,ix-65),Math.max(0,ix-65)+240)+(chunk.length>ix+240?"…":"");
}
function card(c){
 const block=E("details",null,"d2-archive-card"),header=E("summary");
 header.append(E("strong",c.title),E("span",preview(c.body),"d2-archive-sample"));block.append(header);
 block.addEventListener("toggle",()=>{if(!block.open||block.querySelector("pre"))return;const p=E("pre",c.body);block.append(p)});
 return block;
}
function render(){
 const term=norm(query.value.trim()),category=group.value;
 visible=blocks.filter(b=>(!category||b.section===category)&&(!term||norm(b.body).includes(term)||norm(b.title).includes(term)));
 root.replaceChildren();
 visible.slice(0,limit).forEach(c=>root.append(card(c)));
 counter.textContent=visible.length+" trechos encontrados • "+blocks.length+" trechos indexados, preservando o arquivo completo.";
 if(!visible.length)root.append(E("p","Não há resultados para essa busca.","d2-empty"));
 more.hidden=visible.length<=limit;
}
query.addEventListener("input",()=>{limit=10;render()});group.addEventListener("change",()=>{limit=10;render()});
more.addEventListener("click",()=>{limit+=10;render()});
$("d2-download-archive").addEventListener("click",()=>{if(!source){status.textContent="Arquivo ainda carregando.";return;}const blob=new Blob([source.fullText],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="Hurras_Bestiario_NPCs_Anexos_Completo.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),2500);status.textContent="Texto original completo preparado para download."});
fetch("dados/anexos.json").then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(build).catch(e=>{counter.textContent="Erro ao abrir os anexos: "+e.message});
})();