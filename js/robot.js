// ===== ROBOT AI CONTROLLER =====
const robot = document.getElementById('robot');
const radialMenu = document.getElementById('radialMenu');

// Robot gerak random smooth di layar (khusus dashboard)
if (robot && document.body.classList.contains('app-mode')) {
   let x = 0, y = 0, tx = 0, ty = 0;
   let speed = 0.02;

   function updateTarget() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      tx = (Math.random() - 0.5) * (w - 200);
      ty = (Math.random() - 0.5) * (h - 400);
      setTimeout(updateTarget, 3000 + Math.random() * 3000);
   }
   updateTarget();

   function animate() {
      x += (tx - x) * speed;
      y += (ty - y) * speed;
      robot.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(animate);
   }
   animate();
}

// Toggle radial menu ketika robot dipencet
if (robot) {
   robot.addEventListener('click', (e) => {
      e.stopPropagation();
      radialMenu.classList.toggle('open');
   });

   // Tutup menu kalau klik di luar
   document.addEventListener('click', (e) => {
      if (!radialMenu.contains(e.target) && e.target !== robot) {
         radialMenu.classList.remove('open');
      }
   });
}

// Radial menu buttons — setup angle biar melingkar
if (radialMenu) {
   const buttons = radialMenu.querySelectorAll('button');
   const total = buttons.length;
   const radius = 360 / total;

   buttons.forEach((btn, i) => {
      btn.style.setProperty('--angle', `${i * radius}deg`);
      btn.addEventListener('click', () => {
         const page = btn.dataset.page;
         if (window.navigateTo) window.navigateTo(page);
         radialMenu.classList.remove('open');
      });
   });
}