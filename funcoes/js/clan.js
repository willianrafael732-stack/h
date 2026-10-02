
const D=window.HURRAS_RPG, E=id=>document.getElementById(id);
const statGroups={
 physical:['Força','Destreza','Vigor'], social:['Carisma','Manipulação','Persuasão'], mental:['Percepção','Inteligência','Reação'],
 talents:['Intimidação','Liderança','Manha','Lábia','Esquiva','Briga','Investida','Crítico','Bloqueio','Avaliação'],
 skills:['Adestramento','Ofício','Cavalgada','Arma Mágica','Arma Distância','Arma 1 Mão','Arma 2 Mãos','Segurança','Furtividade','Armadura'],
 knowledge:['Acadêmicos','Finanças','Encantamento','Runas','Medicina','Ciências','Tecnologia','Linguística','Investigação','Ocultação'],
 virtues:['Consciência','Autocontrole','Coragem']
};
const aliases={'Força':['Forca'],'Destreza':['Destreza'],'Vigor':['Vigor'],'Carisma':['Carisma'],'Manipulação':['Manipulacao'],'Persuasão':['Persuasao'],'Percepção':['Percepcao'],'Inteligência':['Inteligencia'],'Reação':['Reacao'],'Intimidação':['Intimidacao'],'Liderança':['Lideranca'],'Manha':['Manha'],'Lábia':['Labia'],'Esquiva':['Esquiva'],'Briga':['Briga'],'Investida':['Investida'],'Crítico':['Critico'],'Bloqueio':['Bloqueio'],'Avaliação':['Avaliacao'],'Adestramento':['Adestramento'],'Ofício':['Oficio','Oficios'],'Cavalgada':['Cavalgada'],'Arma Mágica':['ArmaMagica','ArmasMagicas'],'Arma Distância':['ArmasDistancia','ArmaDistancia'],'Arma 1 Mão':['Armas1H','Arma1H'],'Arma 2 Mãos':['Armas2H','Arma2H'],'Segurança':['Seguranca'],'Furtividade':['Furtividade'],'Armadura':['Armadura'],'Acadêmicos':['Academicos'],'Finanças':['Financas'],'Encantamento':['Encantamento'],'Runas':['Runas'],'Medicina':['Medicina'],'Ciências':['Ciencia','Ciencias'],'Tecnologia':['Tecnologia'],'Linguística':['Linguistica'],'Investigação':['Investigacao'],'Ocultação':['Ocultacao'],'Consciência':['Consciencia'],'Autocontrole':['Autocontrole'],'Coragem':['Coragem'],'Vitalidade':['Vitalidade','Vida','HP']};
const elements=['Fogo','Água','Vento','Terra','Raio','Veneno','Mental','Sagrado','Sombrio'];
const state={base:{},wounds:0,mana:5,magic:Object.fromEntries(elements.map(x=>[x,0])),resist:Object.fromEntries(elements.map(x=>[x,0]))};
function num(v){if(typeof v==='number')return v;const m=String(v??'').match(/[+-]?\d+/);return m?Number(m[0]):0}
function objectMod(obj,stat){const ks=aliases[stat]||[stat];for(const k of ks){if(obj&&obj[k]!=null)return num(obj[k])}return 0}
function currentClass(){return D.classes[E('class').value]||{}}
function currentRace(){return D.races[E('race').value]||{}}
function currentSub(){const c=currentClass();return c.variacoes?.[E('subclass').value]||{}}
function equipmentObjects(){return [D.weapons[E('weapon1').value],D.weapons[E('weapon2').value],D.armors[E('armor').value],D.shields[E('shield').value]].filter(Boolean)}
function modifier(stat){let p=0,n=0;const r=currentRace(),c=currentClass(),s=currentSub();const sources=[r.bonus,c.statusInicial?.bonus,s.bonus,...equipmentObjects().map(x=>x.mods)];const negatives=[r.fraqueza,c.statusInicial?.fraqueza,s.fraqueza];for(const o of sources){const v=objectMod(o,stat);if(v>=0)p+=v;else n+=-v}for(const o of negatives){const v=objectMod(o,stat);if(v<0)n+=-v;else if(v>0)n+=v}return {p,n,total:p-n}}
function specialModifier(stat){let total=0;const r=currentRace(),c=currentClass(),sub=currentSub();const sources=[r.bonus,r.evolucao,c.statusInicial?.bonus,c.pontosClasse,sub.bonus,...equipmentObjects().map(x=>x.mods)];const negatives=[r.fraqueza,c.statusInicial?.fraqueza,c.penalidadesClasse,sub.fraqueza];for(const o of sources)total+=objectMod(o,stat);for(const o of negatives){const v=objectMod(o,stat);total-=Math.abs(v)}return total}
function maxVitality(){const level=Math.max(1,Math.min(10,Number(E('level').value)||1));return level*10}
function maxMana(){const level=Math.max(1,Math.min(10,Number(E('level').value)||1));return level*5}
function vitalityCurrent(){const max=maxVitality();state.wounds=Math.max(0,Math.min(max,Number(state.wounds)||0));return max-state.wounds}
function setWounds(v){state.wounds=Math.max(0,Math.min(maxVitality(),Number(v)||0));renderSheets();window.HurrasStorage?.saveDraft?.()}
function setVitality(v){const max=maxVitality();const current=Math.max(0,Math.min(max,Number(v)||0));state.wounds=max-current;renderSheets();window.HurrasStorage?.saveDraft?.()}
function damageVitality(n=1){setWounds((Number(state.wounds)||0)+n)}
function healVitality(n=1){setWounds((Number(state.wounds)||0)-n)}
function setMana(v){state.mana=Math.max(0,Math.min(maxMana(),Number(v)||0));renderSheets();window.HurrasStorage?.saveDraft?.()}
function baseDefault(stat){const r=currentRace();const key=(aliases[stat]||[])[0];if(r.template&&r.template[key]!=null)return Number(r.template[key]);return ['Força','Destreza','Vigor','Carisma','Manipulação','Persuasão','Percepção','Inteligência','Reação'].includes(stat)?1:0}
function base(stat){if(state.base[stat]==null)state.base[stat]=baseDefault(stat);return state.base[stat]}
function final(stat){return Math.max(0,Math.min(10,base(stat)+modifier(stat).total))}
function setFinal(stat,target){state.base[stat]=Math.max(0,Math.min(10,target-modifier(stat).total));renderSheets()}
function dots(stat){const v=final(stat),safe=stat.replaceAll("'","\\'");return `<div class="dots">${Array.from({length:10},(_,i)=>`<i class="dot ${i<v?'on':''}" onclick="setFinal('${safe}',${i+1})" title="${i+1}"></i>`).join('')}</div>`}
function statRow(stat){const m=modifier(stat);return `<div class="stat-row"><span class="stat-name">${stat}:</span>${dots(stat)}<span class="mod ${m.p?'plus':'empty'}">${m.p||''}</span><span class="mod ${m.n?'minus':'empty'}">${m.n||''}</span></div>`}
function fillOptions(){
 E('level').innerHTML=Array.from({length:10},(_,i)=>`<option value="${i+1}">Nível ${i+1} · ${10*(i+1)} Vida · ${5*(i+1)} Mana</option>`).join('');
 E('race').innerHTML=Object.keys(D.races).map(n=>`<option>${n}</option>`).join('');
 E('class').innerHTML=Object.keys(D.classes).map(n=>`<option>${n}</option>`).join('');
 updateMagicSchools();
}
function updateMagicSchools(){
 const old=E('magicSchool').value;
 const c=currentClass(),r=currentRace();
 const allowed=[...new Set([...(c.magicSchools||[]),...(r.magicSchools||[])])];
 const list=allowed.length?allowed:['Nenhuma'];
 E('magicSchool').innerHTML=list.map(n=>`<option>${n}</option>`).join('');
 if(list.includes(old))E('magicSchool').value=old;
}
function updateSubclass(){const c=currentClass(),keys=Object.keys(c.variacoes||{});E('subclass').innerHTML='<option value="">—</option>'+keys.map(k=>`<option value="${k}">${k.replace(/([a-z])([A-Z])/g,'$1 $2')}</option>`).join('')}
function equipOptions(){
 // Catálogo único de Nexalis, utilizado também pela ficha Dark, sem compartilhar salvamentos.
 const c=currentClass(),preferred=new Set(c.weapons||[]);
 const optItems=(items,allowed)=>Object.entries(items||{}).map(([id,info])=>({id,...info,compatible:allowed.includes(id)}));
 const weapons=optItems(D.weapons,c.weapons||[]),armors=optItems(D.armors,c.armor||[]),shields=optItems(D.shields,c.shields||[]);
 const keep=Object.fromEntries(['weapon1','weapon2','armor','shield'].map(id=>[id,E(id).value]));
 const group=(name,items)=>items.length?'<optgroup label="'+safe(name)+'">'+items.map(x=>'<option value="'+safe(x.id)+'">'+safe(x.name||x.id)+(x.compatible?' ★':'')+'</option>').join('')+'</optgroup>':'';
 const cats=[...new Set(weapons.map(x=>x.category||'Outras armas'))];
 const w='<option value="">— Sem arma —</option>'+cats.map(cat=>group(cat,weapons.filter(x=>(x.category||'Outras armas')===cat))).join('');
 E('weapon1').innerHTML=w;E('weapon2').innerHTML=w;
 E('armor').innerHTML='<option value="">— Sem armadura —</option>'+group('Armaduras de Nexalis',armors);
 E('shield').innerHTML='<option value="">— Sem escudo —</option>'+group('Escudos de Nexalis',shields);
 for(const id of ['weapon1','weapon2','armor','shield']){
  if([...E(id).options].some(o=>o.value===keep[id]))E(id).value=keep[id];
 }
}
function fmtObj(o,sign=''){const e=Object.entries(o||{});return e.length?e.map(([k,v])=>`${k.replace(/([a-z])([A-Z])/g,'$1 $2')} ${sign}${String(v).replace(/^[-+]/,'')}`).join(' · '):'Nenhum'}
function updateSummaries(){
 const r=currentRace(),c=currentClass(),w1=D.weapons[E('weapon1').value],w2=D.weapons[E('weapon2').value];
 E('raceSummary').innerHTML=`<strong>Raça: ${E('race').value}</strong><br>Pontos: ${fmtObj(r.template)}<br><span class="good">Bônus: ${fmtObj(r.bonus,'+')}</span><br><span class="bad">Fraquezas: ${fmtObj(r.fraqueza,'-')}</span>`;
 E('classSummary').innerHTML=`<strong>Classe: ${E('class').value}</strong><br><span class="good">Treino: ${fmtObj(c.pontosClasse||c.statusInicial?.bonus,'+')}</span><br><span class="bad">Custos: ${fmtObj(c.penalidadesClasse||c.statusInicial?.fraqueza,'-')}</span><br>${(c.weapons||[]).length} armas compatíveis`;
 E('weaponSummary').innerHTML=`<strong>Equipamento</strong><br>${w1?`${w1.name} [${w1.rarity||'Comum'}] - <span class="good">${w1.bonus}</span> / <span class="bad">${w1.penalty}</span>`:'Primária: —'}<br>${w2?`${w2.name} [${w2.rarity||'Comum'}] - <span class="good">${w2.bonus}</span> / <span class="bad">${w2.penalty}</span>`:'Secundária: —'}`;
 const a=r.habilidadeRacial||{},t=r.tracoRacial||{},abilities=c.habilidadesClasse||[];
 E('raceAbilityName').textContent=a.name||'Habilidade racial';
 E('raceAbilityText').innerHTML=`${safe(a.effect||'Sem habilidade ativa catalogada.')}<span class="meta">${safe([a.cost,a.cooldown].filter(Boolean).join(' · '))}</span>`;
 E('raceTraitName').textContent=t.name||'Traço racial';
 E('raceTraitText').textContent=t.effect||r.passiva||'Sem traço catalogado.';
 E('classAbilityName').textContent=abilities.length?`${abilities.length} técnicas de ${E('class').value}`:'Habilidades da classe';
 E('classAbilityText').innerHTML=abilities.length?abilities.map(x=>`<b>${safe(x.name)}</b>: ${safe(x.effect)}`).join('<br>'):'Sem técnicas especiais catalogadas.';
}
function safe(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function field(label,value){return `<div class="line-field"><b>${label}:</b><span class="editable" contenteditable="true">${value||'—'}</span></div>`}
function trackSquares(n,on,cls){return `<div class="track">${Array.from({length:n},(_,i)=>`<i class="sq ${i<on?'on '+cls:''}"></i>`).join('')}</div>`}
function willTrack(){const n=Math.min(10,Number(E('level').value)||1);return `<div class="vitality-level-rule">NÍVEL × 1 · ${n} / ${n}</div><div class="track">${Array.from({length:10},(_,i)=>`<i class="circle ${i<n?'on':''}"></i>`).join('')}</div><div style="height:4px"></div>${trackSquares(10,0,'yellow')}`}
function weaponSection(title,filter){const picks=[D.weapons[E('weapon1').value],D.weapons[E('weapon2').value]].filter(w=>w&&filter(w));return `<div class="equip-section"><h3>${title}</h3>${[0,1].map(i=>{const w=picks[i];return `<div class="equip-slot"><b>${i?'SECUNDÁRIA':'PRIMÁRIA'}</b><div class="equip-line weapon-name">${w?.name||'—'}</div><div class="equip-line weapon-good">Bônus: ${w?.bonus||'—'}</div><div class="equip-line weapon-bad">Custo: ${w?.penalty||'—'}</div></div>`}).join('')}</div>`}
function spellNames(){
 const custom=E('knownSpells').value.split(/,|\n/).map(x=>x.trim()).filter(Boolean);if(custom.length)return custom.slice(0,16);
 const school=E('magicSchool').value;if(!school||school==='Nenhuma')return [];
 const level=Number(E('level').value)||1;
 const max=Math.min(16,Math.max(3,2+Math.ceil(level/2)));
 return (D.spells?.[school]||[]).map(x=>x.name).slice(0,max)
}
function compact(v,n=95){const t=String(v||'—').replace(/\s+/g,' ').trim();return t.length>n?t.slice(0,n-1)+'…':t}
function racialProfileHTML(r){
 const a=r.habilidadeRacial||{},t=r.tracoRacial||{};
 return `<b>Passiva:</b> ${safe(compact(r.passiva,105))}<br><b>${safe(a.name||'Habilidade racial')}:</b> ${safe(compact(a.effect,100))}${a.cost||a.cooldown?` <i>(${safe([a.cost,a.cooldown].filter(Boolean).join(' · '))})</i>`:''}<br><b>${safe(t.name||'Traço')}:</b> ${safe(compact(t.effect,95))}`
}
function classTechniquesHTML(c,extra){
 const arr=(c.habilidadesClasse||[]).map(x=>`<b>${safe(x.name)}</b> - ${safe(compact(x.effect,90))}`);
 if(extra)arr.push(`<b>Outras:</b> ${safe(extra).replace(/\n/g,'<br>')}`);
 return arr.join('<br>')||'—'
}
function fullRacialLedger(r){const a=r.habilidadeRacial||{},t=r.tracoRacial||{};return `<div class="ledger-entry"><b>Passiva:</b> ${safe(r.passiva||'—')}</div><div class="ledger-entry"><b>${safe(a.name||'Habilidade racial')}:</b> ${safe(a.effect||'—')}<br><small>${safe([a.cost,a.cooldown].filter(Boolean).join(' · '))}</small></div><div class="ledger-entry"><b>${safe(t.name||'Traço')}:</b> ${safe(t.effect||'—')}</div>`}
function fullClassLedger(c){return (c.habilidadesClasse||[]).map(x=>`<div class="ledger-entry"><b>${safe(x.name)}</b> <small>· ${safe(x.type||'Técnica')}</small><br>${safe(x.effect)}</div>`).join('')||'—'}
function spellLedger(){const school=E('magicSchool').value;if(!school||school==='Nenhuma')return '<div class="ledger-entry">Este personagem não possui escola mágica ativa.</div>';const bank=D.spells?.[school]||[];const names=spellNames().slice(0,6);return names.map(n=>{const sp=bank.find(x=>x.name===n);return `<div class="ledger-entry"><b>${safe(n)}</b>${sp?` <small>· ${safe(sp.tier||'')}</small><br>${safe(sp.info||sp.desc||'')}`:''}</div>`}).join('')||'—'}
function magicList(count=16){const names=spellNames();return `<div class="list-lines">${Array.from({length:count},(_,i)=>`<div class="entry"><span contenteditable="true" class="editable">${names[i]||''}</span><span class="mini-dots">${Array.from({length:10},()=>'<i></i>').join('')}</span></div>`).join('')}</div>`}
function textEntries(id){return (E(id)?.value||'').split(/\n|,/).map(x=>x.trim()).filter(Boolean)}
function achievements(count=16){const names=textEntries('achievementsText');return `<div class="list-lines">${Array.from({length:count},(_,i)=>`<div class="entry"><span class="editable">${names[i]||''}</span><span class="mini-dots">${Array.from({length:10},()=>'<i></i>').join('')}</span></div>`).join('')}</div>`}
function vitality(){const max=maxVitality(),current=vitalityCurrent(),level=Number(E('level').value)||1;let idx=0;return `<div class="vitality"><div class="vitality-level-rule">NÍVEL ${level} · LIMITE ${max}</div><div class="vitality-tools"><button type="button" onclick="healVitality(10)">+10</button><button type="button" onclick="healVitality(1)">+1</button><strong>${current} / ${max}</strong><button type="button" onclick="damageVitality(1)">-1</button><button type="button" onclick="damageVitality(10)">-10</button></div><div class="headnums"><span></span>${Array.from({length:10},(_,i)=>`<span>${i+1}</span>`).join('')}</div>${Array.from({length:10},(_,row)=>`<div class="wound"><b>${(row+1)*10}</b>${Array.from({length:10},()=>{const n=++idx;const locked=n>max;const alive=n<=current&&!locked;const currentMark=n===current&&!locked;return `<i class="${alive?'alive ':''}${locked?'locked ':''}${currentMark?'current':''}" ${locked?'':'onclick="setVitality('+n+')"'} title="${locked?'Bloqueado: exige nível '+Math.ceil(n/10):('Definir Vitalidade atual em '+n)}"></i>`}).join('')}</div>`).join('')}<div class="vitality-caption">0 = caído · cada nível libera +10 · máximo geral 100</div></div>`}
function mana(){const max=maxMana();state.mana=Math.max(0,Math.min(max,Number(state.mana)||0));let idx=0;return `<div class="mana-level-rule">NÍVEL ${Math.max(1,Number(E('level').value)||1)} · LIMITE ${max}</div><div class="mana-grid">${Array.from({length:50},()=>{const n=++idx,locked=n>max;return `<i class="${n<=state.mana?'on ':''}${locked?'locked':''}" ${locked?'':'onclick="setMana('+n+')"'} title="${locked?'Bloqueado: requer nível '+Math.ceil(n/5):'Mana '+n}"></i>`}).join('')}</div><div class="mana-tools"><button type="button" onclick="setMana(state.mana-5)">-5</button><button type="button" onclick="setMana(state.mana-1)">-1</button><strong>${state.mana} / ${max}</strong><button type="button" onclick="setMana(state.mana+1)">+1</button><button type="button" onclick="setMana(state.mana+5)">+5</button></div>`}
function elementGrid(kind){const obj=state[kind],cls={Fogo:'fire','Água':'water',Vento:'wind',Terra:'earth',Raio:'lightning',Veneno:'poison',Mental:'mental',Sagrado:'sacred',Sombrio:'shadow'};return `<div class="element-grid">${Object.keys(obj).map(n=>`<div class="element ${cls[n]}" onclick="cycleMagic('${kind}','${n}')"><span>${n}<b>${obj[n]}</b></span></div>`).join('')}</div>`}
function cycleMagic(kind,key){state[kind][key]=(state[kind][key]+1)%11;renderSheets()}
function lineBox(title,text,cls=''){return `<div class="${cls}"><div class="box-title">${title}</div><div class="panel-line bigbox editable" contenteditable="true">${text||''}</div></div>`}
function renderSheets(){
 updateSummaries();
 const r=currentRace(),c=currentClass(),armor=D.armors[E('armor').value],shield=D.shields[E('shield').value],prof=Math.min(6,Math.max(1,Math.ceil((Number(E('level').value)||1)/2))),coins=(E('coins').value||'0 / 0 / 0').split('/').map(x=>x.trim()),extra=E('extraPassives').value||'',items=(E('itemsText')?.value||'').replace(/\n/g,'<br>');
 const w1=D.weapons[E('weapon1').value],w2=D.weapons[E('weapon2').value];
 E('sheets').innerHTML=`
<section class="sheet-page page1"><span class="corner-rune r1">◆</span><span class="corner-rune r2">◆</span><div class="sheet-logo">Hurras<span>FANTASY</span></div><div class="sheet-sub">registro do peregrino</div><div class="sheet-top">${field('Nome',E('name').value)}${field('Natureza',E('nature').value)}${field('Crença',E('belief').value)}${field('Player',E('player').value)}${field('Comportamento',E('behavior').value)}${field('Raça',E('race').value)}${field('Crônica',E('chronicle').value)}${field('Profissão',E('profession').value)}${field('Classe',E('class').value+(E('subclass').value?' / '+E('subclass').value:''))}${field('Nível',E('level').value)}${field('Bronze',coins[0]||0)}${field('Prata / Ouro',(coins[1]||0)+' / '+(coins[2]||0))}</div><div class="sheet-title">Atributos</div><div class="three-cols"><div class="col"><h3>FÍSICOS</h3>${statGroups.physical.map(statRow).join('')}</div><div class="col"><h3>SOCIAL</h3>${statGroups.social.map(statRow).join('')}</div><div class="col"><h3>MENTAL</h3>${statGroups.mental.map(statRow).join('')}</div></div><div class="sheet-title">Habilidades</div><div class="three-cols"><div class="col"><h3>TALENTOS</h3>${statGroups.talents.map(statRow).join('')}</div><div class="col"><h3>PERÍCIAS</h3>${statGroups.skills.map(statRow).join('')}</div><div class="col"><h3>CONHECIMENTOS</h3>${statGroups.knowledge.map(statRow).join('')}</div></div><div class="sheet-title">Vantagens</div><div class="adv-grid"><div><h3>VIRTUDES</h3>${statGroups.virtues.map(statRow).join('')}</div><div><h3>PROEFICIÊNCIA</h3>${trackSquares(6,prof,'yellow')}<div style="height:5px"></div>${trackSquares(6,Math.min(6,Number(E('level').value)||1),'blue')}</div><div><h3>FORÇA DE VONTADE</h3>${willTrack()}</div></div><div class="race-passive">${lineBox('HERANÇA RACIAL',racialProfileHTML(r),'racial-box')}<div><div class="box-title">BENÇÃO / MALDIÇÃO</div>${trackSquares(5,1,'purple')}<div style="height:6px"></div>${trackSquares(5,0,'red')}</div><div><div class="box-title">EXPERIÊNCIA</div><div class="panel-line xpbox">${E('xp').value||0}</div></div></div><div class="combat-recap"><div class="recap"><b>ARMA PRINCIPAL</b><span>${w1?.name||'—'}</span></div><div class="recap"><b>ARMA SECUNDÁRIA</b><span>${w2?.name||'—'}</span></div><div class="recap"><b>ARMADURA</b><span>${armor?.name||'—'}</span></div><div class="recap"><b>ESCOLA MÁGICA</b><span>${E('magicSchool').value||'—'}</span></div></div></section>
<section class="sheet-page page2"><span class="corner-rune r1">◆</span><span class="corner-rune r2">◆</span><div class="page2-grid-top"><div><div class="sheet-title" style="margin-top:0">MAGIAS / TÉCNICAS</div><div style="text-align:center;font:6px Arial;color:#928774;margin-bottom:2px">ESCOLA: ${E('magicSchool').value}</div>${magicList(16)}</div><div><div class="sheet-title" style="margin-top:0">VITALIDADE</div>${vitality()}<div class="mana-title">MANA</div>${mana()}</div><div><div class="sheet-title" style="margin-top:0">CONQUISTAS</div>${achievements(16)}</div></div><div class="magic-duo"><div class="magic-wheel"><h3>NÍVEL MÁGICO</h3>${elementGrid('magic')}</div><div class="magic-wheel"><h3>RESISTÊNCIA MÁGICA</h3>${elementGrid('resist')}</div></div><div class="compact-board"><div class="gear-column">${weaponSection('ARMAS DE UMA MÃO',w=>w.category.includes('1 Mão')&&!w.category.includes('Distância'))}${weaponSection('ARMAS DE DUAS MÃOS',w=>w.category.includes('2 Mãos')&&!w.category.includes('Mágica'))}</div><div class="gear-column middle-stack"><div><div class="box-title">ARMADURA</div><div class="equip-line">${armor?.name||'—'}</div><div class="equip-line weapon-good">${armor?.bonus||'—'}</div><div class="equip-line weapon-bad">${armor?.penalty||'—'}</div></div><div><div class="box-title">ESCUDO</div><div class="equip-line">${shield?.name||'—'}</div><div class="equip-line weapon-good">${shield?.bonus||'—'}</div><div class="equip-line weapon-bad">${shield?.penalty||'—'}</div></div>${lineBox('PASSIVAS & TÉCNICAS',classTechniquesHTML(c,extra),'class-techniques')}${lineBox('ITENS',items,'items-box')}</div><div class="gear-column">${weaponSection('ARMAS A DISTÂNCIA',w=>w.category.includes('Distância'))}${weaponSection('ARMAS MÁGICAS',w=>w.category.includes('Mágica'))}</div></div><div class="sheet-title">Dons e Técnicas</div><div class="ability-ledger"><div class="ledger-card"><h3>Herança racial</h3>${fullRacialLedger(r)}</div><div class="ledger-card"><h3>Técnicas de classe</h3>${fullClassLedger(c)}</div><div class="ledger-card"><h3>Grimório / Técnicas</h3>${spellLedger()}</div></div><div class="journey-notes">${lineBox('NOTAS DA JORNADA',safe(E('notesText')?.value||''))}</div></section>`
}
function applyRaceTemplate(){const r=currentRace();if(r.template)for(const [key,v] of Object.entries(r.template)){const stat=Object.keys(aliases).find(s=>(aliases[s]||[]).includes(key));if(stat)state.base[stat]=v}}
function onClassChanged(){updateSubclass();updateMagicSchools();equipOptions();renderSheets()}
function zeroAllPoints(){
 if(!confirm('Zerar todos os pontos distribuídos, Vida e Mana atuais e resistências? Seus dados, armas e seus buffs/debuffs serão mantidos.'))return;
 for(const group of Object.values(statGroups))for(const name of group)state.base[name]=0;
 state.wounds=maxVitality();
 state.mana=0;
 for(const key of elements){state.magic[key]=0;state.resist[key]=0}
 renderSheets();
 window.HurrasStorage?.saveDraft?.();
}
function resetStats(){state.base={};applyRaceTemplate();renderSheets()}
function pick(arr){return arr?.length?arr[Math.floor(Math.random()*arr.length)]:''}
function shuffled(arr){return [...(arr||[])].sort(()=>Math.random()-.5)}
function randomize(){
 const races=Object.keys(D.races),classes=Object.keys(D.classes),cfg=D.creation||{};
 const race=pick(races),className=pick(classes);E('race').value=race;E('class').value=className;
 const names=cfg.names?.[race]||cfg.names?.default||['Peregrino'];E('name').value=pick(names);
 E('nature').value=pick(cfg.natures||['Errante']);E('behavior').value=pick(cfg.behaviors||['Reservado']);E('profession').value=pick(cfg.professions||['Mercenário']);E('belief').value=pick(cfg.beliefs||['Nenhuma']);E('chronicle').value=pick(cfg.chronicles||['Crônica das Cinzas']);
 const level=1+Math.floor(Math.random()*10);E('level').value=String(level);E('xp').value=String(Math.max(0,(level-1)*100+Math.floor(Math.random()*90)));E('coins').value=`${20+Math.floor(Math.random()*180)} / ${Math.floor(Math.random()*40)} / ${Math.floor(Math.random()*6)}`;
 updateSubclass();const subs=[...E('subclass').options].map(o=>o.value).filter(Boolean);if(subs.length&&Math.random()>.35)E('subclass').value=pick(subs);
 updateMagicSchools();const schools=[...E('magicSchool').options].map(o=>o.value);E('magicSchool').value=pick(schools)||'Nenhuma';
 equipOptions();const c=currentClass(),weapons=shuffled((c.weapons||[]).filter(x=>D.weapons[x]));E('weapon1').value=weapons[0]||'';E('weapon2').value=(weapons[1]&&Math.random()>.35)?weapons[1]:'';const armors=(c.armor||[]).filter(x=>D.armors[x]);const shields=(c.shields||[]).filter(x=>D.shields[x]);E('armor').value=pick(armors)||'';E('shield').value=Math.random()>.45?(pick(shields)||''):'';
 state.base={};applyRaceTemplate();const allStats=[...statGroups.physical,...statGroups.social,...statGroups.mental,...statGroups.talents,...statGroups.skills,...statGroups.knowledge];for(let i=0;i<3+Math.floor(level/2);i++){const st=pick(allStats);state.base[st]=Math.min(8,base(st)+1)}
 state.wounds=0;state.mana=maxMana();elements.forEach(x=>{state.magic[x]=0;state.resist[x]=0});if(E('magicSchool').value!=='Nenhuma')state.magic[E('magicSchool').value]=Math.min(10,1+Math.floor(level/2));(currentRace().magicSchools||[]).forEach(x=>state.resist[x]=Math.max(state.resist[x],1));
 const school=E('magicSchool').value,spells=school==='Nenhuma'?[]:shuffled(D.spells?.[school]||[]).slice(0,Math.min(8,2+Math.floor(level/2)));E('knownSpells').value=spells.map(x=>x.name).join(', ');
 E('extraPassives').value='';E('notesText').value=`${E('name').value} carrega as marcas de ${E('chronicle').value} e busca sobreviver sem quebrar seu juramento.`;E('itemsText').value=['Frasco de cura','Pedra de retorno',D.weapons[E('weapon1').value]?.name,E('armor').value].filter(Boolean).join('\n');E('achievementsText').value=level>=7?'Sobreviveu a uma grande caçada\nCarrega uma relíquia marcada':level>=4?'Venceu um inimigo de elite':'Primeiro juramento';
 renderSheets();if(window.HurrasStorage?.saveDraft)window.HurrasStorage.saveDraft();
}
function save(){const obj={inputs:{},state};document.querySelectorAll('.controls input,.controls select,.controls textarea').forEach(el=>obj.inputs[el.id]=el.value);localStorage.setItem('hurrasFichaV3',JSON.stringify(obj));alert('Ficha salva neste navegador.')}
function load(){try{const raw=localStorage.getItem('hurrasFichaV3')||localStorage.getItem('hurrasFichaV2');const obj=JSON.parse(raw);if(!obj)return alert('Nenhuma ficha salva.');Object.entries(obj.inputs||{}).forEach(([id,v])=>{if(E(id))E(id).value=v});Object.assign(state,obj.state||{});updateSubclass();E('subclass').value=obj.inputs?.subclass||'';equipOptions();['weapon1','weapon2','armor','shield'].forEach(id=>{if(obj.inputs?.[id]&&[...E(id).options].some(o=>o.value===obj.inputs[id]))E(id).value=obj.inputs[id]});renderSheets()}catch(e){alert('Não foi possível carregar a ficha salva.')}}
fillOptions();const params=new URLSearchParams(location.search);if(params.get('race')&&D.races[params.get('race')])E('race').value=params.get('race');if(params.get('class')&&D.classes[params.get('class')])E('class').value=params.get('class');updateSubclass();updateMagicSchools();equipOptions();if(params.get('weapon')&&[...E('weapon1').options].some(o=>o.value===params.get('weapon')))E('weapon1').value=params.get('weapon');applyRaceTemplate();renderSheets();
E('class').onchange=onClassChanged;E('race').onchange=()=>{state.base={};applyRaceTemplate();state.wounds=Math.min(state.wounds,maxVitality());updateMagicSchools();renderSheets()};E('subclass').onchange=renderSheets;['weapon1','weapon2','armor','shield','magicSchool'].forEach(id=>E(id).onchange=renderSheets);E('level').onchange=()=>{state.wounds=Math.min(state.wounds,maxVitality());state.mana=maxMana();renderSheets();window.HurrasStorage?.saveDraft?.()};['name','player','chronicle','nature','behavior','profession','belief','xp','coins','knownSpells','extraPassives','itemsText','achievementsText','notesText'].forEach(id=>E(id).oninput=renderSheets);E('apply').onclick=renderSheets;E('resetStats').onclick=resetStats;E('zeroAllPoints').onclick=zeroAllPoints;E('random').onclick=randomize;E('save').onclick=save;E('load').onclick=load;E('printBtn').onclick=()=>{renderSheets();const old=document.title;document.title=((E('name').value||'Ficha Hurras Fantasy')+' - Hurras Fantasy');setTimeout(()=>{window.print();setTimeout(()=>document.title=old,500)},120)};
