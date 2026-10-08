/* Hurras Fantasy — PDF offline. A ficha editada fica atualizada em memória.
 * O download exige clique para respeitar as configurações do navegador. */
(function(root){"use strict";
const types=[["fisico","físico"],["magico","mágico"],["raio","raio"],["eletrico","elétrico"],["sagrado","sagrado"],["fogo","fogo"],["gelo","gelo"],["luz","luz"],["trevas","trevas"],["morte","morte"],["veneno","veneno"],["agua","água"],["natureza","natureza"],["terra","terra"],["vento","vento"]];
const fold=t=>String(t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
function fieldText(row){const m=String(row).replace(/^[^\p{L}\d]+/u,"").match(/^([\p{L}\p{M}\s]+?)\s*(?::\s*|\s+)(\d+)$/u);return m?{key:m[1].trim(),value:Number(m[2])}:null}
function sourceValue(c,key){for(const line of c.stats||[]){const f=fieldText(line);if(f&&fold(f.key)===fold(key))return f.value}return null}
function currentValue(c,stored,key){if(stored.attributes&&Object.prototype.hasOwnProperty.call(stored.attributes,key))return stored.attributes[key];if(stored.points&&Object.prototype.hasOwnProperty.call(stored.points,key))return stored.points[key];return sourceValue(c,key)}
function printable(t){
 return String(t??"").replace(/[\u{1F000}-\u{1FFFF}]/gu,"").replace(/[^\u0000-\u00FF\u0152\u0153\u0160\u0161\u0178\u2013\u2014\u2018-\u201d\u2022]/g," ")
 .replace(/[Œ]/g,"OE").replace(/[œ]/g,"oe").replace(/[Š]/g,"S").replace(/[š]/g,"s").replace(/[Ÿ]/g,"Y")
 .replace(/[–—]/g,"-").replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/•/g,"-").replace(/[^\u0020-\u00FF]/g," ");
}
function hex(t){let out="";for(const ch of printable(t)){const c=ch.charCodeAt(0);out+=(c<=255?c:63).toString(16).padStart(2,"0")}return out}
function linesOf(t,limit){
 const tokens=printable(t).replace(/\s+/g," ").trim().split(" ");const lines=[];let line="";
 for(let word of tokens){if(!word)continue;while(word.length>limit){if(line){lines.push(line);line=""}lines.push(word.slice(0,limit));word=word.slice(limit)}
 if((line?line.length+1:0)+word.length>limit){lines.push(line);line=word}else line+=(line?" ":"")+word}
 if(line)lines.push(line);return lines.length?lines:[" "];
}
function document(c,fields,stored,groups,parse){
 const commands=[];let y=0,pageNumber=0;
 const cream="0.94 0.87 0.68",dark="0.10 0.16 0.17",ink="0.12 0.17 0.19",soft="0.35 0.40 0.42";
 function page(){pageNumber++;y=764;commands.push([]);
   const p=commands.at(-1);
   p.push(dark+" rg 0 782 595 60 re f");
   p.push(cream+" rg BT /F2 15 Tf 1 0 0 1 38 809 Tm <"+hex("HURRAS FANTASY - FICHA DE PERSONAGEM")+"> Tj ET");
   p.push("0.62 0.70 0.72 rg BT /F1 8 Tf 1 0 0 1 39 793 Tm <"+hex("Registro atualizado - "+c.name+" - pagina "+pageNumber)+"> Tj ET");
 }
 function need(h){if(!commands.length)page();if(y-h<53)page()}
 function line(s,opts={}){const size=opts.size||9.2,bold=!!opts.bold,indent=opts.indent??37;
   const limit=Math.max(10,Math.floor((558-indent)/(size*0.57)));
   const rows=linesOf(s,limit);
   for(const text of rows){need(size*1.42);commands.at(-1).push((opts.color||ink)+" rg BT /"+(bold?"F2":"F1")+" "+size+" Tf 1 0 0 1 "+indent+" "+Math.round(y)+" Tm <"+hex(text)+"> Tj ET");y-=size*1.43}
 }
 function section(s){need(34);y-=8;commands.at(-1).push("0.83 0.78 0.65 rg 37 "+Math.round(y+2)+" 520 1 re f");y-=15;line(s.toUpperCase(),{size:10.8,bold:true,color:dark});y-=4}
 page();
 line(c.title,{size:17,bold:true});line(c.group+" | Nivel "+c.level+" | PDF gerado a partir da ficha editada",{size:8.6,color:soft});y-=8;
 section("Recursos");
 const resources=stored.resources||{};
 for(const [key,label,original]of [["life","Vitalidade",c.vitality],["mana","Mana",c.mana]]){const actual=Object.prototype.hasOwnProperty.call(resources,key)?resources[key]:original;line(label+": "+(actual??"Nao informado")+(String(actual)!==String(original)?" | Original: "+original:""),{bold:true})}
 section("Atributos, talentos, pericias e conhecimentos");
 for(const g of fields){line(g.label,{bold:true,color:"0.36 0.27 0.13",size:10});let written=0;
   for(const key of g.keys){const v=currentValue(c,stored,key),original=sourceValue(c,key);if(v===null||v===undefined||v==="")continue;
     line(key+": "+v+(original!==null&&Number(v)!==Number(original)?" (original "+original+")":""),{indent:49});written++}
   if(!written)line("Sem valor informado.",{indent:49,color:soft,size:8});
 }
 // Extra original attributes outside the 70 registered labels.
 const registered=new Set(fields.flatMap(g=>g.keys).map(fold));
 const additional=[];
 for(const raw of c.stats||[]){const f=fieldText(raw);if(f&&!registered.has(fold(f.key))&&!["mana","vitalidade"].includes(fold(f.key))&&!additional.some(x=>fold(x.key)===fold(f.key)))additional.push(f)}
 if(additional.length){section("Outros status originais");additional.forEach(f=>line(f.key+": "+f.value))}
 section("Armas e ataque normal");
 const parsed=parse(c);
 if(!parsed.weapons.length)line("Sem arma declarada nesta ficha; confira os ataques.");
 for(const w of parsed.weapons){
   line(w.name,{bold:true,size:11});for(const item of w.lines)line(item,{indent:48});
 }
 const manual=stored.modifiers||{};
 if(manual.physical||manual.elemental){section("Modificadores de dano inseridos manualmente");
   line("Fisico adicional: "+(manual.physical||0)+"d10; Elemental ou magico adicional: "+(manual.elemental||0)+"d10");
   line("Aplicacao manual: nao converter atributos em dano sem uma regra definida.");}
 section("Ataques, habilidades, magias, passivas e recompensas");
 for(const group of groups){const actions=parsed.abilities[group.id]||[];if(!actions.length)continue;
   line(group.title,{bold:true,color:"0.36 0.27 0.13",size:10});for(const action of actions)line(action,{indent:48});y-=4}
 if(parsed.misc?.length){section("Observacoes e informacoes complementares");parsed.misc.forEach(t=>line(t,{indent:48}))}
 section("Informacoes de salvamento");
 line("Atributos preenchidos e recursos atuais foram exportados da memoria deste navegador.");
 line("O documento original e as versoes historicas permanecem intactos. Os campos sem valores nao recebem numeros inventados.");
 // PDF structure. Use ASCII sources and CP1252 hex characters via WinAnsi.
 const objects=[null,"<< /Type /Catalog /Pages 2 0 R >>",null,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"];
 const children=[];
 commands.forEach((cmd,i)=>{
   const pageRef=5+2*i,contentRef=pageRef+1;children.push(pageRef+" 0 R");
   objects[pageRef]="<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents "+contentRef+" 0 R >>";
   const stream=cmd.join("\n")+"\n";
   objects[contentRef]="<< /Length "+stream.length+" >>\nstream\n"+stream+"endstream";
 });
 objects[2]="<< /Type /Pages /Kids ["+children.join(" ")+"] /Count "+commands.length+" >>";
 let output="%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";const offsets=[0];
 for(let i=1;i<objects.length;i++){offsets[i]=output.length;output+=i+" 0 obj\n"+objects[i]+"\nendobj\n"}
 const xref=output.length;output+="xref\n0 "+objects.length+"\n0000000000 65535 f \n";
 for(let i=1;i<objects.length;i++)output+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
 output+="trailer\n<< /Size "+objects.length+" /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF";
 const bytes=new Uint8Array(output.length);for(let i=0;i<output.length;i++)bytes[i]=output.charCodeAt(i)&255;
 return {bytes,pages:commands.length};
}
const API={create:document,filename(c){return "HURRAS_Ficha_"+String(c.name).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-Za-z0-9_-]+/g,"_")+".pdf"}};
root.HurrasFichaPDF=API;
})(window);
