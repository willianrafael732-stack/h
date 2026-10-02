(()=>{'use strict';
function fit(){const available=Math.max(280,Math.min(window.innerWidth-24,document.querySelector('.sheets')?.clientWidth||window.innerWidth-24));document.documentElement.style.setProperty('--hurras-sheet-scale',Math.min(1,available/794).toFixed(4));}
fit();window.addEventListener('resize',fit,{passive:true});window.addEventListener('orientationchange',fit,{passive:true});
})();
