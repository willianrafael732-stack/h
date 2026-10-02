/* Hurras Dark Fantasy: prévia em duas páginas, PDF editável, importação e exportação.
   A ficha do navegador é a fonte dos dados. Cada PDF deste editor inclui
   dados estruturados numa pequena caixa de formulário para importação fiel. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const api=window.HurrasDarkSheetAPI;
if(!api)return;
const groups=[
 ['Físicos',['Força','Destreza','Vigor'],'#c85e52'],
 ['Sociais',['Empatia','Manipulação','Persuasão'],'#c99c62'],
 ['Mentais',['Percepção','Inteligência','Reação'],'#658fc1'],
 ['Virtudes',['Consciência','Autocontrole','Coragem'],'#6bb086'],
 ['Combate',['Intimidação','Liderança','Lábia','Bloqueio','Esquiva','Briga','Disparada','Crítico','Ocultismo'],'#bb749f'],
 ['Habilidades',['Adestramento','Ofício','Condução','Armas à distância','Armas brancas','Segurança','Furtividade','Armadura','Investigação'],'#bda270'],
 ['Conhecimentos',['Acadêmicos','Geografia','Encantamento','Selos','Medicina','Ciências','Tecnologia','Linguística','Sobrevivência'],'#7c9dce']
];
const resist=['Fogo','Água','Vento','Terra','Veneno','Raio','Mental','Sagrado','Sombrio'];
const gear=['Arma branca primária','Arma branca secundária','Distância primária','Distância secundária','Armadura'];
const COLORS={Físicos:'#ca5f55',Sociais:'#e6b875',Mentais:'#6e9acf',Virtudes:'#73c19c',Combate:'#bd82b2',Habilidades:'#cdb180',Conhecimentos:'#8ca9d9'};
const STORAGE_BG='hurras_dark_sheet_background_v1';
const status=message=>{if($('status'))$('status').textContent=message};
const hex=(str)=>String(str||'').replace(/[^a-zA-Z0-9#]/g,'');
let background='';
function bgRestore(){try{background=localStorage.getItem(STORAGE_BG)||''}catch(e){background=''}if(background)document.documentElement.style.setProperty('--dark-bg-image','url("'+background+'")');else document.documentElement.style.removeProperty('--dark-bg-image')}
bgRestore();
function el(tag,cls,txt){let x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined&&txt!==null)x.textContent=String(txt);return x}
const dotPalette=['#ce7167','#e0ae6c','#6fa4d3','#79bd9a'];
const dotHex=i=>dotPalette[Math.floor(i/3)%4];
function setDots(box,num,total,c){box.className='dark-pdf-dotrow';for(let i=1;i<=total;i++){const item=el('i','dark-pdf-dot'+(i<=num?' on':''));item.style.setProperty('--print-dot',dotHex(i-1));box.append(item)}}
function dots(num,total,color){const wrap=el('div');setDots(wrap,Number(num)||0,total,color);return wrap}
function box(title){let b=el('section','dark-pdf-box'),h=el('h3',null,title);b.append(h);return b}
function line(label,n,total,color){let row=el('div','dark-pdf-line');row.append(el('span',null,label),dots(n,total,color));return row}
function detail(label,v){let col=el('div');col.append(el('b',null,label),el('span',null,String(v??'')));return col}
function textBox(label,v){let b=box(label);b.append(el('div','dark-pdf-text',String(v??'')));return b}
function page(num){let p=el('article','dark-pdf-page');p.setAttribute('aria-label','Página '+num+' da ficha');let h=el('div','dark-pdf-head');h.append(el('strong',null,'HURRAS DARK FANTASY'),el('p',null,'NEXALIS · FICHA DE PERSONAGEM · '+num+'/2'));p.append(h);return p}
function track(title,a,total,cls){let b=box(title),g=el('div','dark-pdf-track');g.style.setProperty('--print-dot',cls);const active=new Set(a||[]);for(let i=0;i<total;i++){{let circle=el('i','dark-pdf-dot'+(active.has(i)?' on':''));circle.style.setProperty('--print-dot',dotHex(i));g.append(circle)}}b.append(g);return b}
function preview(){
 const d=api.get(),pages=$('pdfPages');if(!pages)return;pages.replaceChildren();
 const one=page(1),ident=el('div','dark-pdf-id');
 ['Nome','Player','Crônica','Raça','Classe','Nível','Profissão','Dinheiro','Experiência','Nível mágico'].forEach(k=>ident.append(detail(k,d.fields[k]||'—')));one.append(ident);
 const cols=el('div','dark-pdf-columns');
 const blocks=[[],[],[]];
 groups.forEach(([title,items,c],i)=>{let b=box(title);items.forEach(k=>b.append(line(k,d.stats[k],12,c)));blocks[i%3].push(b)});
 const level=Math.max(1,Math.min(10,Number(d.fields['Nível'])||1));
 let virtue=box('Força de Vontade · '+level+'/'+level);virtue.append(line('Vontade',level,10,'#e9c88e'));blocks[1].push(virtue);
 blocks[2].push(track('Vida · '+(d.vitality||[]).length+'/'+(level*10),(d.vitality||[]),level*10,'#cb6865'),track('Mana · '+(d.mana||[]).length+'/'+(level*5),(d.mana||[]),level*5,'#6096c2'));
 for(let k=0;k<3;k++){let wrap=el('div');blocks[k].forEach(b=>wrap.append(b));cols.append(wrap)}one.append(cols);
 const two=page(2),top=el('div','dark-pdf-fields');
 const magic=box('Magias e técnicas');for(let i=0;i<18;i++){let row=el('div','dark-pdf-magic-row');row.append(el('span',null,(i+1)+'. '+(d.magic[i]||'_________________________')),dots(d.magicLevels[i],10,'#9675ad'));magic.append(row)}
 const right=el('div'),res=box('Resistência mágica');resist.forEach(k=>res.append(line(k,d.resist[k],12,'#7199ad')));right.append(res);
 gear.forEach((k,i)=>{const b=box(k);const text=[d.gear[i],d.adv[i]?'Vantagem: '+d.adv[i]:'',d.disadv[i]?'Desvantagem: '+d.disadv[i]:''].filter(Boolean).join('\n');b.append(el('div','dark-pdf-text',text||'—'));right.append(b)});
 top.append(magic,right);two.append(top);
 const bottom=el('div','dark-pdf-fields');['Passivas','Itens','Notas'].forEach(k=>bottom.append(textBox(k==='Itens'?'Inventário':k,d.fields[k]||'')));two.append(bottom);
 pages.append(one,two);
 return d;
}
function selectMode(isPdf){$('darkPdfView').hidden=!isPdf;$('darkEditor').hidden=isPdf;document.body.classList.toggle('dark-pdf-mode',isPdf);$('modeEdit').classList.toggle('dark-mode-selected',!isPdf);$('modePDF').classList.toggle('dark-mode-selected',isPdf);$('modeEdit').setAttribute('aria-pressed',String(!isPdf));$('modePDF').setAttribute('aria-pressed',String(isPdf));if(isPdf)preview()}
$('modeEdit').onclick=()=>selectMode(false);
$('modePDF').onclick=()=>selectMode(true);
$('bgUpload').onchange=async e=>{let file=e.target.files&&e.target.files[0];if(!file)return;if(!file.type.startsWith('image/'))return status('Selecione uma imagem.');
try{let canvas=document.createElement('canvas'),img=new Image(),url=URL.createObjectURL(file);await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=url});const ratio=Math.min(1,850/img.naturalWidth);canvas.width=Math.round(img.naturalWidth*ratio);canvas.height=Math.round(img.naturalHeight*ratio);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);background=canvas.toDataURL('image/jpeg',.72);localStorage.setItem(STORAGE_BG,background);bgRestore();preview();status('Fundo atualizado no navegador e na prévia PDF.')}catch(err){status('Não foi possível salvar a imagem no navegador. Use um arquivo menor.')}e.target.value=''};
$('resetBackground').onclick=()=>{localStorage.removeItem(STORAGE_BG);background='';bgRestore();preview();status('Fundo restaurado.')};
function getPDFLib(){if(!window.PDFLib){status('Biblioteca PDF indisponível. Verifique sua conexão à internet e tente de novo.');return null}return window.PDFLib}
function clean(text){return String(text??'').replace(/[\u200b-\u200f]/g,'').replace(/[^\x20-\x7e\u00a0-\u00ff]/g,'-')}
function color(hex){const x=(hex||'#b9a279').replace('#','');return window.PDFLib.rgb(parseInt(x.slice(0,2),16)/255,parseInt(x.slice(2,4),16)/255,parseInt(x.slice(4,6),16)/255)}
function bytesFromDataUrl(str){const raw=atob(str.split(',')[1]);const bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return bytes}
async function generatePdf(){
 const pdf=getPDFLib();if(!pdf)throw Error('Biblioteca pdf-lib não carregada');
 const state=api.get(),doc=await pdf.PDFDocument.create(),font=await doc.embedFont(pdf.StandardFonts.Helvetica),bold=await doc.embedFont(pdf.StandardFonts.HelveticaBold);
 const gold=pdf.rgb(.95,.80,.59),white=pdf.rgb(.94,.91,.89),black=pdf.rgb(.055,.045,.065),panel=pdf.rgb(.10,.08,.12);
 let bgImage=null;if(background){try{bgImage=await doc.embedJpg(bytesFromDataUrl(background))}catch(e){}}if(!bgImage){try{
  const im=new Image();im.src='../assets/dark-hurras/fundo-brasas.svg';
  await new Promise(done=>{if(im.complete){done();return}im.onload=done;im.onerror=done;setTimeout(done,1500)});
  if(im.naturalWidth){let cv=document.createElement('canvas');cv.width=415;cv.height=740;cv.getContext('2d').drawImage(im,0,0,415,740);bgImage=await doc.embedJpg(bytesFromDataUrl(cv.toDataURL('image/jpeg',.8)))}
}catch(e){}}
 const a4=[595.28,841.89],pages=[doc.addPage(a4),doc.addPage(a4)];
 function pText(page,value,x,y,size=8,chosen=font,ink=white){page.drawText(clean(value).slice(0,130),{x,y,size,font:chosen,color:ink,maxWidth:560})}
 function rect(page,x,y,w,h,bg=panel){page.drawRectangle({x,y,width:w,height:h,color:bg,borderWidth:.5,borderColor:gold,opacity:.95})}
 function header(page,num){page.drawRectangle({x:0,y:0,width:a4[0],height:a4[1],color:black});
 if(bgImage)page.drawImage(bgImage,{x:0,y:0,width:a4[0],height:a4[1],opacity:.18});
 page.drawRectangle({x:20,y:776,width:555,height:47,color:panel,borderColor:gold,borderWidth:1,opacity:.88});pText(page,'HURRAS DARK FANTASY',138,797,20,bold,gold);pText(page,'NEXALIS - FICHA EDITAVEL   '+num+'/2',212,785,8,font,white)}
 pages.forEach((p,i)=>header(p,i+1));
 const textField=(page,name,value,x,y,w,h=16)=>{const f=form.createTextField(name);f.setText(clean(value).slice(0,200));f.addToPage(page,{x,y,width:w,height:h,borderColor:gold,backgroundColor:panel,textColor:white,borderWidth:.5,fontSize:8});return f};
 const form=doc.getForm();
 let top=756;const identity=['Nome','Player','Crônica','Raça','Classe','Nível','Profissão','Dinheiro','Experiência','Nível mágico'];
 identity.forEach((k,i)=>{const col=i%2,idx=Math.floor(i/2),x=24+col*284,y=top-idx*29;pText(pages[0],k,x,y+16,8,bold,gold);textField(pages[0],'field_'+k,state.fields[k]||'',x,y-4,266,17)});
 const blocks=[
 {x:24,y:570,items:groups.slice(0,3)},
 {x:212,y:570,items:[groups[3],groups[4]]},
 {x:400,y:570,items:groups.slice(5)}
 ];
 // Three columns, attribute values are editable text fields;
 // colored circles print in the selected count, including unselected outlines.
 blocks.forEach(b=>{let y=b.y;for(const [group,items,col] of b.items){const height=23+items.length*18;rect(pages[0],b.x,y-height,174,height);pText(pages[0],group.toUpperCase(),b.x+7,y-14,9,bold,gold);y-=24;
 for(const k of items){pText(pages[0],k,b.x+5,y-6,6,font,white);const n=Math.min(12,Number(state.stats[k])||0);const step=6.6;
 for(let i=0;i<12;i++)pages[0].drawCircle({x:b.x+78+i*step,y:y-3,size:3,borderColor:color(dotHex(i)),borderWidth:.65,color:i<n?color(dotHex(i)):panel});
 textField(pages[0],'stat_'+k,n,b.x+157,y-10,14,12);y-=18}y-=9}});
 // Willpower + health/mana as editable counters (dots visibly colored on the PDF)
 let y=151;rect(pages[0],24,40,550,112);pText(pages[0],'FORCA DE VONTADE',33,131,10,bold,gold);
 const maxLevel=Math.max(1,Math.min(10,Number(state.fields['Nível'])||1));
 let n=maxLevel;for(let i=0;i<10;i++)pages[0].drawCircle({x:43+i*14,y:111,size:5,borderColor:color(dotHex(i)),color:i<n?color(dotHex(i)):panel});
 textField(pages[0],'stat_Força de Vontade',n,192,102,30);
 pText(pages[0],'VITALIDADE',256,132,10,bold,gold);
 const hval=(state.vitality||[]).length;pText(pages[0],hval+' / '+maxLevel*10,258,110,9,bold,pdf.rgb(.9,.42,.36));
 textField(pages[0],'vitality_count',hval,317,100,35);
 pText(pages[0],'MANA',397,132,10,bold,gold);
 const mval=(state.mana||[]).length;pText(pages[0],mval+' / '+maxLevel*5,400,110,9,bold,pdf.rgb(.40,.67,.95));textField(pages[0],'mana_count',mval,450,100,35);
 // Additional file fields page two
 let y2=751;pText(pages[1],'MAGIAS E TECNICAS',29,y2,12,bold,gold);
 for(let i=0;i<18;i++){const y=724-i*28;const x=26;pText(pages[1],String(i+1).padStart(2,'0'),x,y+4,8,bold,gold);
 textField(pages[1],'magic_'+i,(state.magic||[])[i]||'',x+21,y-1,345);
 const v=Number(state.magicLevels?.[i]||0);textField(pages[1],'magicLevel_'+i,v,402,y-1,26);
 for(let j=0;j<10;j++){pages[1].drawCircle({x:440+j*13,y:y+8,size:3.8,borderColor:color(dotHex(j)),color:j<v?color(dotHex(j)):panel})}
 }
 let yR=194;const elemWidth=59;pText(pages[1],'RESISTENCIAS',29,yR,12,bold,gold);yR-=19;
 resist.forEach((k,i)=>{const x=29+(i%3)*188,y=yR-Math.floor(i/3)*25;pText(pages[1],k,x,y,8,bold,gold);textField(pages[1],'resist_'+k,Number(state.resist[k]||0),x+90,y-5,32)});
 let lower=91;
 gear.forEach((k,i)=>{const x=29+(i%3)*187,y=lower-Math.floor(i/3)*21;pText(pages[1],k,x,y+10,7,bold,gold);textField(pages[1],'gear_'+i,state.gear[i]||'',x,y-6,164)});
 // Existing data, including notes/adv/disadv, is preserved in a small machine-readable
 // AcroForm field. Import from THIS downloadable PDF reconstructs the whole sheet.
 const blob=form.createTextField('hurras_dark_data_v2');blob.enableMultiline();blob.setText(encodeURIComponent(JSON.stringify({...state,_format:'hurras_dark_pdf_v2'})));
 blob.addToPage(pages[1],{x:2,y:2,width:1,height:1,borderWidth:0,textColor:black,backgroundColor:black,fontSize:1});
 // store other text details in editable form fields on page 2 for direct editing
 for(const [i,k] of ['Passivas','Itens','Notas'].entries()){
   const x=28+i*183;pText(pages[1],k,x,31,7,bold,gold);
   textField(pages[1],'field_'+k,state.fields[k]||'',x,10,166,16)
 }
 try{form.updateFieldAppearances(font)}catch(e){console.warn('Aparência de campo não disponível',e)}
 doc.setTitle('Ficha Hurras Dark Fantasy - '+clean(state.fields.Nome||'Personagem'));doc.setAuthor('Hurras Fantasy');doc.setSubject('Ficha exportada; pode ser reimportada no fichario Dark Fantasy');
 return await doc.save({updateFieldAppearances:false});
}
function download(bytes,name){let u=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),3000)}
$('downloadPDF').onclick=async()=>{try{status('Preparando PDF editável...');api.save();const d=api.get(),bytes=await generatePdf();download(bytes,'hurras-dark-'+String(d.fields.Nome||'personagem').replace(/[^\p{L}\p{N}-]/gu,'-').slice(0,60)+'.pdf');status('PDF editável gerado. Você pode importar este arquivo novamente no site.')}catch(e){status('Erro ao criar PDF: '+e.message)}};
$('pdfUpload').onchange=async e=>{
 const f=e.target.files?.[0];if(!f)return;
 try{const pdf=getPDFLib();if(!pdf)throw Error('Biblioteca PDF indisponível');status('Lendo campos do PDF...');const doc=await pdf.PDFDocument.load(await f.arrayBuffer());const form=doc.getForm(),get=n=>{try{return form.getTextField(n).getText()||''}catch(e){return ''}};
 const blob=get('hurras_dark_data_v2');let state;
 if(blob){state=JSON.parse(decodeURIComponent(blob));if(state._format!=='hurras_dark_pdf_v2')throw Error('Arquivo sem assinatura Hurras');}
 else{ // PDF preenchível externo ou PDF antigo: tenta ler os campos conhecidos
   state={fields:{},stats:{},magic:[],magicLevels:{},resist:{},gear:[],adv:[],disadv:[],vitality:[],mana:[]};let count=0;
   ['Nome','Player','Crônica','Raça','Classe','Nível','Profissão','Dinheiro','Experiência','Nível mágico'].forEach(k=>{let v=get('field_'+k);if(v){state.fields[k]=v;count++}});
   for(const [group,items] of groups){for(const k of items){const n=get('stat_'+k);if(n){state.stats[k]=Math.min(12,Math.max(0,Number(n)||0));count++}}}
   const w=get('stat_Força de Vontade');if(w){state.stats['Força de Vontade']=Math.min(10,Number(w)||0);count++}
   for(let i=0;i<18;i++){let a=get('magic_'+i),b=get('magicLevel_'+i);state.magic[i]=a;state.magicLevels[i]=Math.min(10,Number(b)||0);if(a||b)count++}
   resist.forEach(k=>{let a=get('resist_'+k);state.resist[k]=Number(a)||0;if(a)count++});
   gear.forEach((k,i)=>{let a=get('gear_'+i);state.gear[i]=a;if(a)count++});
   const v=Number(get('vitality_count')||0),m=Number(get('mana_count')||0);state.vitality=Array.from({length:Math.max(0,Math.min(100,v))},(_,i)=>i);state.mana=Array.from({length:Math.max(0,Math.min(50,m))},(_,i)=>i);
   // Fichas antigas do Hurras eram AcroForm com bolinhas em caixas de seleção.
   // Importamos a marcação dos campos preservando o que o PDF realmente contém.
   if(count===0){const legacyNames=form.getFields().map(x=>x.getName());const legacy=legacyNames.includes('FOR1')||legacyNames.includes('DES1');
     if(legacy){
       const checked=key=>{try{return form.getCheckBox(key).isChecked()}catch(e){return false}};
       const map=[['Força','FOR',12],['Destreza','DES',12],['Vigor','VIG',12],['Empatia','CAR',12],['Manipulação','MAN',12],['Persuasão','APA',12],['Percepção','PER',12],['Inteligência','INT',12],['Reação','REA',12],['Consciência','CONS',12],['Autocontrole','AUTCON',12],['Coragem','COR',12],['Força de Vontade','FDV',10]];
       map.forEach(([name,prefix,max])=>{let count=0;for(let k=1;k<=max;k++)if(checked(prefix+k))count++;state.stats[name]=count});
       // Grupos sequenciais no formulário legado; preserva até dez pontos de cada.
       [['T',['Intimidação','Liderança','Lábia','Bloqueio','Esquiva','Briga','Disparada','Crítico','Ocultismo']],['P',['Adestramento','Ofício','Condução','Armas à distância','Armas brancas','Segurança','Furtividade','Armadura','Investigação']],['C',['Acadêmicos','Geografia','Encantamento','Selos','Medicina','Ciências','Tecnologia','Linguística','Sobrevivência']]].forEach(([prefix,keys])=>keys.forEach((name,idx)=>{const width=legacyNames.includes(prefix+(keys.length*12))?12:10;let total=0;for(let j=1;j<=width;j++)if(checked(prefix+(idx*width+j)))total++;state.stats[name]=total}));
       state.mana=Array.from({length:50},(_,i)=>i).filter(i=>checked('MANA'+(i+1)));
       state.vitality=Array.from({length:10},(_,i)=>i).filter(i=>checked('VIT'+(i+1)));
       for(let i=0;i<18;i++){let total=0;for(let k=1;k<=10;k++)if(checked('MT'+(i+1)+'-'+k))total++;state.magicLevels[i]=total}
       count=1;
       status('Ficha antiga identificada. Atributos e bolinhas recuperados; nomes e anotações sem campos editáveis no PDF não podem ser reconstruídos.');
     }
   }
   if(count===0)throw Error('PDF sem campos reconhecidos. Use um PDF editável exportado pelo Hurras. PDFs de imagem não contêm dados editáveis.');
 }
 // If a PDF reader modified the visible AcroForm fields, sync those changes.
 for(const k of ['Nome','Player','Crônica','Raça','Classe','Nível','Profissão','Dinheiro','Experiência','Nível mágico','Passivas','Itens','Notas']){const v=get('field_'+k);if(v!=='')state.fields[k]=v}
 for(const [group,items] of groups)for(const k of items){const v=get('stat_'+k);if(v!=='')state.stats[k]=Math.max(0,Math.min(12,Number(v)||0))}
 const will=get('stat_Força de Vontade');if(will!=='')state.stats['Força de Vontade']=Math.max(0,Math.min(10,Number(will)||0));
 for(let i=0;i<18;i++){const a=get('magic_'+i),b=get('magicLevel_'+i);if(a!=='')state.magic[i]=a;if(b!=='')state.magicLevels[i]=Math.max(0,Math.min(10,Number(b)||0))}
 resist.forEach(k=>{let v=get('resist_'+k);if(v!=='')state.resist[k]=Math.max(0,Math.min(12,Number(v)||0))});
 gear.forEach((k,i)=>{const v=get('gear_'+i);if(v!=='')state.gear[i]=v});
 for(const [k,key,total] of [['vitality_count','vitality',100],['mana_count','mana',50]]){const val=get(k);if(val!=='')state[key]=Array.from({length:Math.max(0,Math.min(total,Number(val)||0))},(_,i)=>i)}
 api.put(state,true);preview();status('PDF importado como NOVA ficha no cofre. Os outros personagens não foram substituídos.');
 }catch(err){status('Não foi possível importar: '+err.message)}finally{e.target.value=''}
};
window.HurrasDarkPDF={preview,print:()=>{preview();const after=()=>{window.removeEventListener('afterprint',after)};window.addEventListener('afterprint',after);window.print()},export:generatePdf};
preview();
})();
