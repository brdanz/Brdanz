import { applyTheme } from './theme.js';

const app = document.getElementById('appContent');
const navBtns = document.querySelectorAll('.bottom-nav .nav-btn');
const indicator = document.querySelector('.nav-indicator');

// ===== PAGE TEMPLATES =====
const pages = {
   dashboard: () => `
      <div class="page">
         <div class="card balance-card">
            <span class="chip"><i class="fa-solid fa-circle"></i> ONLINE</span>
            <h3 style="margin-top:8px">Selamat Datang,</h3>
            <h2>Brdanz</h2>
            <p>Saldo Kamu</p>
            <h2 style="color:var(--accent)">Rp 0</h2>
            <button class="glass-btn" style="width:100%;margin-top:12px" onclick="navigateTo('topup')">
               <i class="fa-solid fa-plus"></i> Topup Saldo
            </button>
         </div>

         <div class="card">
            <h3><i class="fa-solid fa-star" style="color:var(--accent)"></i> Layanan Unggulan</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px">
               <div class="service-item" onclick="navigateTo('smm')">
                  <div class="icon"><i class="fa-solid fa-bullhorn"></i></div>
                  <div class="info"><h5>SMM</h5><span>Followers, Likes</span></div>
               </div>
               <div class="service-item" onclick="navigateTo('market')">
                  <div class="icon"><i class="fa-solid fa-store"></i></div>
                  <div class="info"><h5>Market</h5><span>Jual barang</span></div>
               </div>
               <div class="service-item" onclick="navigateTo('chat')">
                  <div class="icon"><i class="fa-solid fa-comments"></i></div>
                  <div class="info"><h5>Chat</h5><span>Global chat</span></div>
               </div>
               <div class="service-item" onclick="navigateTo('cs')">
                  <div class="icon"><i class="fa-solid fa-headset"></i></div>
                  <div class="info"><h5>CS</h5><span>Bantuan 24/7</span></div>
               </div>
            </div>
         </div>

         <div class="card">
            <h3><i class="fa-solid fa-bolt" style="color:var(--accent)"></i> Aktivitas</h3>
            <p>Belum ada aktivitas. Mulai order SMM sekarang.</p>
         </div>
      </div>
   `,

   smm: () => `
      <div class="page">
         <h2 class="page-title">Order SMM</h2>
         <p class="page-sub">Layanan sosial media premium</p>

         <div class="card">
            <div class="form-group">
               <label>Pilih Layanan</label>
               <select id="smmService">
                  <option value="">-- Loading services --</option>
               </select>
            </div>
            <div class="form-group">
               <label>Target (username / link)</label>
               <input type="text" id="smmTarget" placeholder="@username atau link">
            </div>
            <div class="form-group">
               <label>Jumlah</label>
               <input type="number" id="smmQty" placeholder="1000" min="100">
            </div>
            <button class="glass-btn" style="width:100%" id="btnOrderSmm">
               <i class="fa-solid fa-cart-shopping"></i> Pesan Sekarang
            </button>
         </div>

         <div class="card">
            <h3><i class="fa-solid fa-list" style="color:var(--accent)"></i> Riwayat Order</h3>
            <div id="smmHistory"><p>Belum ada order.</p></div>
         </div>
      </div>
   `,

   topup: () => `
      <div class="page">
         <h2 class="page-title">Topup Saldo</h2>
         <p class="page-sub">QRIS H2H - Instant</p>

         <div class="card">
            <div class="form-group">
               <label>Nominal Topup</label>
               <input type="number" id="topupAmount" placeholder="10000" min="1000">
            </div>
            <button class="glass-btn" style="width:100%" id="btnTopup">
               <i class="fa-solid fa-qrcode"></i> Buat QRIS
            </button>
         </div>

         <div class="card">
            <h3><i class="fa-solid fa-history" style="color:var(--accent)"></i> Riwayat Topup</h3>
            <div id="topupHistory"><p>Belum ada topup.</p></div>
         </div>
      </div>
   `,

   market: () => `
      <div class="page">
         <h2 class="page-title">Pasar</h2>
         <p class="page-sub">Jual beli barang - 1 slot gratis</p>

         <div class="card">
            <button class="glass-btn" style="width:100%" id="btnAddProduct">
               <i class="fa-solid fa-plus"></i> Jual Barang (1 slot gratis)
            </button>
            <p style="font-size:11px;color:var(--text-dim);margin-top:8px;text-align:center">
               Slot tambahan: Rp 1.000 / slot
            </p>
         </div>

         <div class="market-grid" id="marketGrid">
            <!-- Items injected -->
         </div>
      </div>
   `,

   chat: () => `
      <div class="page">
         <h2 class="page-title">Chat Global</h2>
         <p class="page-sub">Ngobrol sama semua member</p>

         <div class="chat-list" id="chatList"></div>
      </div>
      <div class="chat-input">
         <input type="text" id="chatMessage" placeholder="Tulis pesan...">
         <button id="btnSendChat"><i class="fa-solid fa-paper-plane"></i></button>
      </div>
   `,

   cs: () => `
      <div class="page">
         <h2 class="page-title">Customer Service</h2>
         <p class="page-sub">Live chat dengan owner</p>

         <div class="card cs-robot">
            <div class="bot-avatar">
               <div class="robot-head" style="position:relative;animation:none">
                  <div class="eye left"></div>
                  <div class="eye right"></div>
                  <div class="mouth"></div>
               </div>
            </div>
            <h3>BXF Assistant</h3>
            <p style="color:var(--text-dim);font-size:12px">
               Halo! Saya asisten AI BXF. Owner akan balas chat kamu secepatnya.
            </p>

            <div id="csMessages" class="chat-list" style="margin-top:20px;text-align:left"></div>

            <div class="chat-input" style="position:relative;left:0;right:0;bottom:0;margin-top:12px">
               <input type="text" id="csMessage" placeholder="Tulis pesan ke owner...">
               <button id="btnSendCs"><i class="fa-solid fa-paper-plane"></i></button>
            </div>

            <a href="https://wa.me/6283148860119" target="_blank" class="wa-btn">
               <i class="fa-brands fa-whatsapp"></i> Chat WhatsApp Owner
            </a>
         </div>
      </div>
   `,

   profile: () => `
      <div class="page">
         <h2 class="page-title">Profil</h2>
         <p class="page-sub">Ubah data profil kamu</p>

         <div class="card" style="text-align:center">
            <div style="width:90px;height:90px;margin:0 auto 12px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-2));display:flex;align-items:center;justify-content:center;font-size:32px">
               <i class="fa-solid fa-user"></i>
            </div>
            <h3>Brdanz</h3>
            <p style="color:var(--accent);font-size:12px"><i class="fa-solid fa-crown"></i> Owner</p>
         </div>

         <div class="card">
            <div class="form-group">
               <label>Username</label>
               <input type="text" id="profUsername" value="Brdanz">
            </div>
            <div class="form-group">
               <label>Bio</label>
               <textarea id="profBio" rows="3" placeholder="Tulis bio..."></textarea>
            </div>
            <button class="glass-btn" style="width:100%" id="btnSaveProfile">
               <i class="fa-solid fa-floppy-disk"></i> Simpan
            </button>
         </div>
      </div>
   `,

   setting: () => `
      <div class="page">
         <h2 class="page-title">Pengaturan</h2>
         <p class="page-sub">Kustomisasi tampilan & preferensi</p>

         <div class="card">
            <h3><i class="fa-solid fa-palette" style="color:var(--accent)"></i> Warna Tema</h3>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
               <button class="theme-btn" data-theme="purple" style="background:#a855f7"></button>
               <button class="theme-btn" data-theme="blue" style="background:#3b82f6"></button>
               <button class="theme-btn" data-theme="green" style="background:#22c55e"></button>
               <button class="theme-btn" data-theme="red" style="background:#ef4444"></button>
               <button class="theme-btn" data-theme="orange" style="background:#f59e0b"></button>
               <button class="theme-btn" data-theme="pink" style="background:#ec4899"></button>
               <button class="theme-btn" data-theme="cyan" style="background:#06b6d4"></button>
            </div>

            <div class="form-group" style="margin-top:16px">
               <label>Warna Custom (Hex)</label>
               <input type="text" id="customColor" placeholder="#a855f7">
            </div>

            <div class="form-group">
               <label>Atau Gradasi (2 warna)</label>
               <div style="display:flex;gap:8px">
                  <input type="color" id="gradFrom" value="#a855f7">
                  <input type="color" id="gradTo" value="#3b82f6">
                  <button class="glass-btn" id="btnApplyGrad">Terapkan</button>
               </div>
            </div>
         </div>

         <div class="card">
            <h3><i class="fa-solid fa-bullhorn" style="color:var(--accent)"></i> Channel Update</h3>
            <p style="font-size:12px;color:var(--text-dim);margin-bottom:12px">Khusus admin yang bisa kirim.</p>
            <div id="channelFeed"></div>
         </div>

         <div class="card">
            <h3><i class="fa-solid fa-right-from-bracket" style="color:#ef4444"></i> Keluar</h3>
            <button class="glass-btn" style="width:100%;margin-top:8px" id="btnLogout">
               <i class="fa-solid fa-power-off"></i> Logout
            </button>
         </div>
      </div>
   `
};

// ===== SPA ROUTER =====
export function navigateTo(page) {
   if (!pages[page]) page = 'dashboard';
   app.innerHTML = pages[page]();

   // Update nav
   navBtns.forEach(b => b.classList.toggle('active', b.dataset.page === page));
   moveIndicator();

   // Init page-specific logic
   initPage(page);
   window.scrollTo({ top: 0, behavior: 'smooth' });
   localStorage.setItem('bxf_page', page);
}

function moveIndicator() {
   const active = document.querySelector('.bottom-nav .nav-btn.active');
   if (active && indicator) {
      const rect = active.getBoundingClientRect();
      const navRect = active.parentElement.getBoundingClientRect();
      indicator.style.left = (rect.left - navRect.left + rect.width/2 - 26) + 'px';
   }
}

// ===== PAGE INITIALIZERS =====
function initPage(page) {
   if (page === 'smm') initSmmPage();
   if (page === 'topup') initTopupPage();
   if (page === 'chat') initChatPage();
   if (page === 'cs') initCsPage();
   if (page === 'market') initMarketPage();
   if (page === 'setting') initSettingPage();
   if (page === 'profile') initProfilePage();
}

// ===== SMM =====
async function initSmmPage() {
   const select = document.getElementById('smmService');
   try {
      const res = await fetch('/api/smm', {
         method: 'POST',
         headers: { 'Content-Type':'application/json' },
         body: JSON.stringify({ action: 'services' })
      });
      const data = await res.json();
      const services = Array.isArray(data) ? data : data.data || data.services || [];
      if (services.length) {
         select.innerHTML = '<option value="">-- Pilih Layanan --</option>' +
            services.slice(0, 50).map(s =>
               `<option value="${s.id || s.service}">${s.name || s.service} - Rp ${s.price || 0}/1k</option>`
            ).join('');
      } else {
         select.innerHTML = '<option>Layanan tidak tersedia</option>';
      }
   } catch (e) {
      select.innerHTML = '<option>Error memuat layanan</option>';
   }

   document.getElementById('btnOrderSmm')?.addEventListener('click', async () => {
      const service = select.value;
      const target = document.getElementById('smmTarget').value.trim();
      const quantity = parseInt(document.getElementById('smmQty').value);
      if (!service || !target || !quantity) return alert('Isi semua field');

      const btn = document.getElementById('btnOrderSmm');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

      try {
         const res = await fetch('/api/smm', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify({ action:'order', service, target, quantity })
         });
         const data = await res.json();
         alert(data.message || JSON.stringify(data));
      } catch (e) {
         alert('Gagal order: ' + e.message);
      } finally {
         btn.disabled = false;
         btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Pesan Sekarang';
      }
   });
}

// ===== TOPUP =====
function initTopupPage() {
   document.getElementById('btnTopup')?.addEventListener('click', async () => {
      const amount = parseInt(document.getElementById('topupAmount').value);
      if (!amount || amount < 1000) return alert('Minimal topup Rp 1.000');

      // Bikin QRIS via Qiospay (endpoint bisa disesuaikan)
      alert(`Buat QRIS Rp ${amount.toLocaleString()}. Fitur ini memerlukan endpoint generate QRIS dari Qiospay.`);
   });
}

// ===== CHAT =====
function initChatPage() {
   const list = document.getElementById('chatList');
   const input = document.getElementById('chatMessage');
   const btn = document.getElementById('btnSendChat');

   // Load dari localStorage (upgrade: realtime DB)
   const messages = JSON.parse(localStorage.getItem('bxf_chat') || '[]');
   messages.forEach(m => addChatBubble(list, m));

   btn?.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) return;
      const msg = { user:'Brdanz', text, time:Date.now(), mine:true };
      messages.push(msg);
      localStorage.setItem('bxf_chat', JSON.stringify(messages));
      addChatBubble(list, msg);
      input.value = '';
      list.scrollTop = list.scrollHeight;
   });
}

function addChatBubble(container, msg) {
   const div = document.createElement('div');
   div.className = 'chat-bubble' + (msg.mine ? ' mine' : '');
   div.innerHTML = `
      <div class="avatar">${msg.user[0].toUpperCase()}</div>
      <div class="msg">${msg.text}</div>
   `;
   container.appendChild(div);
}

// ===== CS =====
function initCsPage() {
   const input = document.getElementById('csMessage');
   const btn = document.getElementById('btnSendCs');
   const list = document.getElementById('csMessages');

   btn?.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) return;
      const div = document.createElement('div');
      div.className = 'chat-bubble mine';
      div.innerHTML = `<div class="avatar"><i class="fa-solid fa-user"></i></div><div class="msg">${text}</div>`;
      list.appendChild(div);
      input.value = '';

      // Auto reply robot
      setTimeout(() => {
         const bot = document.createElement('div');
         bot.className = 'chat-bubble';
         bot.innerHTML = `<div class="avatar"><i class="fa-solid fa-robot"></i></div><div class="msg">Terima kasih! Pesan kamu sudah diteruskan ke owner. Tunggu balasan ya.</div>`;
         list.appendChild(bot);
      }, 800);
   });
}

// ===== MARKET =====
function initMarketPage() {
   document.getElementById('btnAddProduct')?.addEventListener('click', () => {
      alert('Fitur jual barang: isi form (nama, harga, deskripsi, foto). Slot gratis 1, tambahan Rp 1.000/slot.');
   });
}

// ===== SETTING =====
function initSettingPage() {
   document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.style.width = '38px';
      btn.style.height = '38px';
      btn.style.borderRadius = '12px';
      btn.style.border = '2px solid rgba(255,255,255,0.15)';
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
   });

   document.getElementById('btnApplyGrad')?.addEventListener('click', async () => {
      const from = document.getElementById('gradFrom').value;
      const to = document.getElementById('gradTo').value;
      const { applyGradient } = await import('./theme.js');
      applyGradient(from, to);
   });

   document.getElementById('customColor')?.addEventListener('change', async (e) => {
      const { applyCustomColor } = await import('./theme.js');
      applyCustomColor(e.target.value);
   });

   document.getElementById('btnLogout')?.addEventListener('click', () => {
      localStorage.removeItem('bxf_auth');
      location.href = 'index.html';
   });
}

// ===== PROFILE =====
function initProfilePage() {
   document.getElementById('btnSaveProfile')?.addEventListener('click', () => {
      const u = document.getElementById('profUsername').value;
      const b = document.getElementById('profBio').value;
      localStorage.setItem('bxf_profile', JSON.stringify({ username:u, bio:b }));
      alert('Profil disimpan');
   });
}

// ===== NAV BINDING =====
navBtns.forEach(btn => {
   btn.addEventListener('click', () => navigateTo(btn.dataset.page));
});

window.addEventListener('resize', moveIndicator);
window.navigateTo = navigateTo;

// ===== RESTORE LAST PAGE =====
document.addEventListener('DOMContentLoaded', () => {
   const last = localStorage.getItem('bxf_page') || 'dashboard';
   navigateTo(last);
   setTimeout(moveIndicator, 100);
});