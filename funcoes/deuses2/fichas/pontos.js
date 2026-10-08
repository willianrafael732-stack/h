/* Bolinhas correspondentes aos atributos numéricos dos deuses complementares. */
(()=>{"use strict";
const skip=new Set(["nivel","vitalidade","mana","forca de vontade"]);
const fold=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase();
document.querySelectorAll(".panel table").forEach(table=>{
 const first=table.querySelector("thead th");
 if(!first||fold(first.textContent)!=="caracteristica")return;
 table.querySelectorAll("tbody tr").forEach(row=>{
  const cells=row.querySelectorAll("td");if(cells.length!==2)return;
  const name=cells[0].textContent.trim(),value=cells[1].textContent.trim();
  if(skip.has(fold(name))||!/^[0-9]{1,3}$/.test(value))return;
  const n=Number(value),slots=Math.max(12,Math.min(30,Math.ceil(n/6)*6));
  const points=document.createElement("span");points.className="ficha-dot-track";
  points.setAttribute("role","img");points.setAttribute("aria-label",name+": "+n+" pontos");
  points.textContent="●".repeat(Math.min(n,slots))+"○".repeat(Math.max(0,slots-n))+(n>slots?" +"+(n-slots):"");
  cells[1].append(points);
 });
});
})();
