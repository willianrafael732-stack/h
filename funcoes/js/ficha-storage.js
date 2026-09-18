(() => {
'use strict';
const DB_NAME='hurras_fantasy';
const DB_VERSION=2;
const STORE='characters';
const DRAFT_KEY='hurrasFichaDraftV6';
const CURRENT_ID_KEY='hurrasCurrentFichaId';
const OWNER_KEY='hurrasOwnerId';
const FALLBACK_KEY='hurrasVaultFallbackV2';
const $=id=>document.getElementById(id);
let currentId=localStorage.getItem(CURRENT_ID_KEY)||'';
let autosaveTimer=null;

function uid(){return (crypto.randomUUID?crypto.randomUUID():'ficha-'+Date.now()+'-'+Math.random().toString(16).slice(2));}
function ownerId(){let id=localStorage.getItem(OWNER_KEY);if(!id){id=uid();localStorage.setItem(OWNER_KEY,id)}return id}
function cloneState(){try{return JSON.parse(JSON.stringify(state))}catch{return {}}}
function capture(){const inputs={};document.querySelectorAll('.controls input,.controls select,.controls textarea').forEach(el=>{if(el.id&&el.type!=='file')inputs[el.id]=el.value});return {version:6,inputs,state:cloneState()}}
function meta(data,id=currentId||uid()){return {id,name:(data.inputs?.name||'Sem nome').trim()||'Sem nome',player:(data.inputs?.player||'').trim(),race:data.inputs?.race||'',className:data.inputs?.class||'',updatedAt:new Date().toISOString(),data}}
function setStatus(msg,kind=''){const el=$('storageStatus');if(!el)return;el.textContent=msg;el.className='storage-status '+kind}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function fallbackAll(){try{return JSON.parse(localStorage.getItem(FALLBACK_KEY)||'[]').sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)))}catch{return []}}
function fallbackWrite(rows){localStorage.setItem(FALLBACK_KEY,JSON.stringify(rows.slice(0,150)))}
function fallbackPut(rec){const rows=fallbackAll().filter(x=>x.id!==rec.id);rows.unshift(rec);fallbackWrite(rows);return rec}
function fallbackGet(id){return fallbackAll().find(x=>x.id===id)}
function fallbackDelete(id){fallbackWrite(fallbackAll().filter(x=>x.id!==id))}
function openDB(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window))return reject(new Error('IndexedDB indisponível'));const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE)){const st=db.createObjectStore(STORE,{keyPath:'id'});st.createIndex('updatedAt','updatedAt')}};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function idbPut(rec){try{const db=await openDB();return await new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(rec);tx.oncomplete=()=>res(rec);tx.onerror=()=>rej(tx.error)})}catch(e){return fallbackPut(rec)}}
async function idbGet(id){try{const db=await openDB();return await new Promise((res,rej)=>{const r=db.transaction(STORE).objectStore(STORE).get(id);r.onsuccess=()=>res(r.result||fallbackGet(id));r.onerror=()=>rej(r.error)})}catch(e){return fallbackGet(id)}}
async function idbAll(){try{const db=await openDB();return await new Promise((res,rej)=>{const r=db.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>{const rows=r.result||[];const local=fallbackAll();const seen=new Set(rows.map(x=>x.id));res([...rows,...local.filter(x=>!seen.has(x.id))].sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt))))};r.onerror=()=>rej(r.error)})}catch(e){return fallbackAll()}}
async function idbDelete(id){fallbackDelete(id);try{const db=await openDB();return await new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)})}catch(e){return}}

function applyData(data){if(!data)return;Object.entries(data.inputs||{}).forEach(([id,v])=>{const el=$(id);if(el&&el.type!=='file')el.value=v});if(data.state){Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,JSON.parse(JSON.stringify(data.state)));if(Number(data.version||0)<6)state.wounds=0}updateSubclass();updateMagicSchools?.();if(data.inputs?.subclass)$('subclass').value=data.inputs.subclass;equipOptions();['weapon1','weapon2','armor','shield'].forEach(id=>{const v=data.inputs?.[id];if(v&&$(id)&&[...$(id).options].some(o=>o.value===v))$(id).value=v});renderSheets()}
function saveDraft(){try{const data=capture();localStorage.setItem(DRAFT_KEY,JSON.stringify(data));localStorage.setItem('hurrasFichaV3',JSON.stringify(data));return data}catch(e){console.warn('Rascunho não salvo',e)}}
function scheduleDraft(){clearTimeout(autosaveTimer);autosaveTimer=setTimeout(()=>{saveDraft();setStatus('Rascunho salvo automaticamente no navegador.','good')},450)}
async function saveVault(silent=false){try{const data=capture();const rec=meta(data,currentId||uid());currentId=rec.id;localStorage.setItem(CURRENT_ID_KEY,currentId);await idbPut(rec);saveDraft();await renderList();if(!silent)setStatus(`Ficha “${rec.name}” salva no cofre do navegador.`, 'good');return rec}catch(e){console.error(e);setStatus('Falha ao salvar no banco do navegador.','bad');throw e}}
async function loadRecord(id){const rec=await idbGet(id);if(!rec)return;currentId=id;localStorage.setItem(CURRENT_ID_KEY,id);applyData(rec.data);saveDraft();setStatus(`Ficha “${rec.name}” carregada.`, 'good')}
async function removeRecord(id){if(!confirm('Excluir esta ficha do navegador?'))return;await idbDelete(id);if(currentId===id){currentId='';localStorage.removeItem(CURRENT_ID_KEY)}await renderList();setStatus('Ficha excluída do cofre local.')}
async function renderList(){const host=$('storageList');if(!host)return;let rows=[];try{rows=await idbAll()}catch(e){host.innerHTML='<div class="empty-save">IndexedDB indisponível neste navegador.</div>';return}if(!rows.length){host.innerHTML='<div class="empty-save">Nenhuma ficha no cofre ainda. Clique em “Salvar no cofre”.</div>';return}host.innerHTML=rows.map(r=>`<article class="save-card"><strong>${esc(r.name)}</strong><small>${esc(r.race)} · ${esc(r.className)}${r.player?' · '+esc(r.player):''}<br>${new Date(r.updatedAt).toLocaleString('pt-BR')}</small><div class="card-actions"><button data-load="${r.id}">Abrir</button><button data-java="${r.id}">JAVA</button><button data-delete="${r.id}">Excluir</button></div></article>`).join('');host.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>loadRecord(b.dataset.load));host.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>removeRecord(b.dataset.delete));host.querySelectorAll('[data-sync]').forEach(b=>b.onclick=async()=>{const rec=await idbGet(b.dataset.sync);if(rec)await pushServer(rec)});host.querySelectorAll('[data-java]').forEach(b=>b.onclick=async()=>{const rec=await idbGet(b.dataset.java);if(rec)exportJavaRecord(rec)})}

function serverAvailableProtocol(){return location.protocol==='http:'||location.protocol==='https:'}
async function api(path,opts={}){if(!serverAvailableProtocol())throw new Error('Abra pelo servidor para sincronizar.');const headers=Object.assign({'Content-Type':'application/json','X-Hurras-Player':ownerId()},opts.headers||{});const res=await fetch('/api'+path,{...opts,headers});if(!res.ok)throw new Error(await res.text()||('HTTP '+res.status));return res.status===204?null:res.json()}
async function checkServer(){const badge=$('serverBadge');if(!serverAvailableProtocol()){if(badge){badge.textContent='Site: modo arquivo';badge.className='storage-badge warn'}return false}try{await api('/health');if(badge){badge.textContent='Site: SQLite online';badge.className='storage-badge ok'}return true}catch{if(badge){badge.textContent='Site: sem servidor';badge.className='storage-badge warn'}return false}}
async function pushServer(rec){try{await api('/characters',{method:'POST',body:JSON.stringify(rec)});setStatus(`Ficha “${rec.name}” sincronizada com o banco SQLite do site.`, 'good');await checkServer()}catch(e){setStatus(e.message||'Não foi possível sincronizar com o site.','bad')}}
async function syncCurrent(){const rec=await saveVault(true);await pushServer(rec)}
async function pullServer(){try{const remote=await api('/characters');if(!remote.length){setStatus('Nenhuma ficha encontrada no banco do site.');return}for(const rec of remote)await idbPut(rec);await renderList();setStatus(`${remote.length} ficha(s) do site copiadas para o navegador.`, 'good')}catch(e){setStatus(e.message||'Falha ao buscar fichas do site.','bad')}}

function utf8ToBase64(text){const bytes=new TextEncoder().encode(text);let bin='';for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(bin)}
function base64ToUtf8(b64){const bin=atob(b64);const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new TextDecoder().decode(bytes)}
function javaString(v){return String(v??'').replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\r?\n/g,'\\n')}
function javaIdentifier(v){let n=String(v||'Personagem').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9_]/g,'_').replace(/^([^A-Za-z_])/,'_$1');return n||'Personagem'}
function buildJava(rec){
  const payload=utf8ToBase64(JSON.stringify(rec));
  const cls=javaIdentifier((rec.name||'Personagem')+'_HurrasFicha');
  const data=rec.data?.inputs||{};
  return `/*\n * HURRAS FANTASY - FICHA PORTAVEL V1\n * Arquivo gerado pelo site Hurras Fantasy.\n * Para importar de volta, nao apague HURRAS_DATA_BASE64.\n */\npublic final class ${cls} {\n    public static final String NOME = "${javaString(rec.name)}";\n    public static final String PLAYER = "${javaString(rec.player)}";\n    public static final String RACA = "${javaString(rec.race)}";\n    public static final String CLASSE = "${javaString(rec.className)}";\n    public static final String NIVEL = "${javaString(data.level||'1')}";\n    public static final String ARMA_PRIMARIA = "${javaString(data.weapon1||'')}";\n    public static final String ESCOLA_MAGICA = "${javaString(data.magicSchool||'Nenhuma')}";\n\n    // Conteudo completo da ficha, codificado para preservar todos os campos.\n    public static final String HURRAS_DATA_BASE64 =\n        "${payload}";\n\n    private ${cls}() {}\n}\n`;
}
function downloadText(text,filename,type='text/x-java-source'){const blob=new Blob([text],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1800)}
function exportJavaRecord(rec){const base=((rec.name||'personagem').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]+/gi,'-').replace(/^-+|-+$/g,''))||'personagem';downloadText(buildJava(rec),base+'-hurras.java');setStatus(`Ficha “${rec.name}” exportada em JAVA.`, 'good')}
async function exportCurrentJava(){const rec=meta(capture(),currentId||uid());exportJavaRecord(rec)}
async function importJavaFile(file){try{
  if(!/\.java$/i.test(file.name))throw new Error('Escolha um arquivo .java gerado pelo Hurras.');
  const text=await file.text();
  const match=text.match(/HURRAS_DATA_BASE64\s*=\s*(?:\n\s*)?"([A-Za-z0-9+/=]+)"\s*;/m);
  if(!match)throw new Error('Este JAVA não contém uma ficha Hurras válida.');
  const parsed=JSON.parse(base64ToUtf8(match[1]));
  const rec=parsed.data?parsed:{id:parsed.id||uid(),...meta(parsed,parsed.id||uid())};
  currentId=rec.id||uid();localStorage.setItem(CURRENT_ID_KEY,currentId);
  const stored={...rec,id:currentId,updatedAt:new Date().toISOString()};await idbPut(stored);applyData(stored.data||stored);saveDraft();await renderList();setStatus('Ficha JAVA importada e salva no navegador.','good')
}catch(e){console.error(e);setStatus(e.message||'Arquivo JAVA de ficha inválido.','bad')}}

function newSheet(){if(!confirm('Criar uma ficha nova? O rascunho atual continuará no cofre se você já o salvou.'))return;currentId='';localStorage.removeItem(CURRENT_ID_KEY);document.querySelectorAll('.controls input,.controls textarea').forEach(el=>{if(el.type!=='file')el.value=el.id==='xp'?'0':''});$('level').value='1';state.base={};state.wounds=0;state.mana=10;elements.forEach(x=>{state.magic[x]=0;state.resist[x]=0});fillOptions();updateSubclass();updateMagicSchools?.();equipOptions();applyRaceTemplate();renderSheets();saveDraft();setStatus('Nova ficha criada.')}
function clearDraft(){if(!confirm('Limpar apenas o rascunho automático deste navegador? As fichas do cofre não serão apagadas.'))return;localStorage.removeItem(DRAFT_KEY);localStorage.removeItem('hurrasFichaV3');setStatus('Rascunho automático removido. As fichas do cofre foram mantidas.')}
async function migrateOld(){try{const rows=await idbAll();if(rows.length)return;const raw=localStorage.getItem('hurrasFichaV3')||localStorage.getItem('hurrasFichaV2');if(!raw)return;const data=JSON.parse(raw);if(!data?.inputs)return;const rec=meta(data);currentId=rec.id;localStorage.setItem(CURRENT_ID_KEY,currentId);await idbPut(rec)}catch(e){console.warn('Migração ignorada',e)}}
function loadDraft(){try{const raw=localStorage.getItem(DRAFT_KEY)||localStorage.getItem('hurrasFichaDraftV5')||localStorage.getItem('hurrasFichaDraftV4');if(raw)applyData(JSON.parse(raw))}catch(e){console.warn(e)}}
function freshStartup(){currentId='';localStorage.removeItem(CURRENT_ID_KEY);localStorage.removeItem(DRAFT_KEY);localStorage.removeItem('hurrasFichaV3');document.querySelectorAll('.controls input,.controls textarea').forEach(el=>{if(el.type!=='file')el.value=el.id==='xp'?'0':''});$('level').value='1';state.base={};state.wounds=0;state.mana=10;elements.forEach(x=>{state.magic[x]=0;state.resist[x]=0});fillOptions();updateSubclass();updateMagicSchools?.();equipOptions();applyRaceTemplate();renderSheets();saveDraft();setStatus('Nova ficha pronta para criação.','good')}
function wire(){const oldSave=$('save'),oldLoad=$('load');if(oldSave)oldSave.onclick=()=>saveVault();if(oldLoad)oldLoad.onclick=()=>{location.href='criacao-de-ficha.html'};$('saveVault').onclick=()=>saveVault();$('newSheet').onclick=newSheet;$('exportSheet').onclick=exportCurrentJava;$('clearDraft').onclick=clearDraft;$('importSheet').onchange=e=>{const f=e.target.files?.[0];if(f)importJavaFile(f);e.target.value=''};document.querySelectorAll('.controls input,.controls select,.controls textarea').forEach(el=>{if(el.type!=='file'){el.addEventListener('input',scheduleDraft);el.addEventListener('change',scheduleDraft)}});window.addEventListener('beforeunload',saveDraft)}
window.HurrasStorage={saveDraft,saveVault,exportCurrentJava,importJavaFile};
(async()=>{wire();const params=new URLSearchParams(location.search);const wantsNew=params.get('new')==='1';const openId=params.get('open');if(wantsNew){freshStartup()}else{loadDraft()}await migrateOld();if(openId)await loadRecord(openId);await renderList();saveDraft()})()
})();
