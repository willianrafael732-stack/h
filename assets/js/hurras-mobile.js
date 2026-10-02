(()=>{'use strict';
function fit(){const available=Math.max(280,Math.min(window.innerWidth-24,document.querySelector('.sheets')?.clientWidth||window.innerWidth-24));const factor=Math.min(1,available/794);document.documentElement.style.setProperty('--hurras-sheet-scale',factor.toFixed(4));document.documentElement.style.setProperty('--hurras-sheet-negative',(-297*(1-factor)).toFixed(2)+'mm');}
fit();window.addEventListener('resize',fit,{passive:true});window.addEventListener('orientationchange',fit,{passive:true});
})();
