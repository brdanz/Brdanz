// ===== AUTH MANAGER =====
const OWNER_EMAIL = 'brdanz@bxfshop.id';
const USERNAME = 'brdanz';
const PASSWORD = '1122';

document.addEventListener('DOMContentLoaded', () => {
   const form = document.getElementById('loginForm');
   const otpStep = document.getElementById('otpStep');
   const otpInputs = document.querySelectorAll('.otp-inputs input');
   const btnVerify = document.getElementById('btnVerifyOtp');
   const btnResend = document.getElementById('btnResend');

   // Auto-focus OTP inputs
   otpInputs.forEach((input, i) => {
      input.addEventListener('input', () => {
         if (input.value && otpInputs[i+1]) otpInputs[i+1].focus();
      });
      input.addEventListener('keydown', (e) => {
         if (e.key === 'Backspace' && !input.value && otpInputs[i-1])
            otpInputs[i-1].focus();
      });
   });

   if (form) {
      form.addEventListener('submit', async (e) => {
         e.preventDefault();
         const u = document.getElementById('username').value.trim();
         const p = document.getElementById('password').value.trim();

         if (u !== USERNAME || p !== PASSWORD) {
            alert('Username atau password salah');
            return;
         }

         // Trigger OTP
         try {
            const res = await fetch('/api/otp', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email: OWNER_EMAIL, action: 'send' })
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            form.classList.add('hidden');
            otpStep.classList.remove('hidden');
            sessionStorage.setItem('otp_token', data.token);
         } catch (err) {
            alert('Gagal kirim OTP: ' + err.message);
         }
      });
   }

   if (btnVerify) {
      btnVerify.addEventListener('click', async () => {
         const code = Array.from(otpInputs).map(i => i.value).join('');
         if (code.length !== 6) return alert('OTP harus 6 digit');

         try {
            const res = await fetch('/api/otp', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  action: 'verify',
                  code,
                  token: sessionStorage.getItem('otp_token')
               })
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            localStorage.setItem('bxf_auth', JSON.stringify({
               user: USERNAME,
               token: data.jwt,
               time: Date.now()
            }));
            window.location.href = 'dashboard.html';
         } catch (err) {
            alert('OTP salah: ' + err.message);
         }
      });
   }

   if (btnResend) {
      btnResend.addEventListener('click', async () => {
         const res = await fetch('/api/otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: OWNER_EMAIL, action: 'send' })
         });
         const data = await res.json();
         if (data.success) sessionStorage.setItem('otp_token', data.token);
         alert(data.success ? 'OTP dikirim ulang' : 'Gagal: ' + data.message);
      });
   }
});

// ===== ROUTE GUARD (dashboard.html) =====
if (window.location.pathname.includes('dashboard')) {
   const auth = localStorage.getItem('bxf_auth');
   if (!auth) window.location.href = 'index.html';
   else {
      const { time } = JSON.parse(auth);
      // Session 24 jam
      if (Date.now() - time > 86400000) {
         localStorage.removeItem('bxf_auth');
         window.location.href = 'index.html';
      }
   }
}