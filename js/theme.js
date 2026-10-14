// ===== THEME MANAGER =====
const themes = {
   purple: { accent:'#a855f7', accent2:'#7c3aed' },
   blue:   { accent:'#3b82f6', accent2:'#1d4ed8' },
   green:  { accent:'#22c55e', accent2:'#15803d' },
   red:    { accent:'#ef4444', accent2:'#b91c1c' },
   orange: { accent:'#f59e0b', accent2:'#d97706' },
   pink:   { accent:'#ec4899', accent2:'#be185d' },
   cyan:   { accent:'#06b6d4', accent2:'#0e7490' }
};

export function applyTheme(name) {
   const t = themes[name] || themes.purple;
   document.documentElement.style.setProperty('--accent', t.accent);
   document.documentElement.style.setProperty('--accent-2', t.accent2);
   localStorage.setItem('bxf_theme', name);
}

export function applyCustomColor(hex) {
   document.documentElement.style.setProperty('--accent', hex);
   document.documentElement.style.setProperty('--accent-2', shadeColor(hex, -25));
   localStorage.setItem('bxf_theme_custom', hex);
}

function shadeColor(color, percent) {
   const num = parseInt(color.replace('#',''), 16);
   const amt = Math.round(2.55 * percent);
   const R = (num >> 16) + amt;
   const G = (num >> 8 & 0x00FF) + amt;
   const B = (num & 0x0000FF) + amt;
   return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
      (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

export function applyGradient(from, to) {
   document.documentElement.style.setProperty('--accent', from);
   document.documentElement.style.setProperty('--accent-2', to);
   localStorage.setItem('bxf_theme_grad', JSON.stringify({ from, to }));
}

// Restore on load
window.addEventListener('DOMContentLoaded', () => {
   const saved = localStorage.getItem('bxf_theme');
   if (saved) applyTheme(saved);
   const grad = localStorage.getItem('bxf_theme_grad');
   if (grad) {
      const { from, to } = JSON.parse(grad);
      applyGradient(from, to);
   }
});