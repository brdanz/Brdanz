import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bxf-super-secret-2026';
const otpStore = new Map(); // In-memory (upgrade: Redis/DB)

export default async function handler(req, res) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
   if (req.method === 'OPTIONS') return res.status(200).end();
   if (req.method !== 'POST') return res.status(405).json({ success:false, message:'Method not allowed' });

   const { action, email, code, token } = req.body;

   if (action === 'send') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 5 * 60 * 1000;

      otpStore.set(email, { otp, expires });

      const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASS
         }
      });

      try {
         await transporter.sendMail({
            from: `"BXF TOLS SHOP" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: '🔐 Kode OTP Login BXF TOLS SHOP',
            html: `
               <div style="font-family:Arial;background:#07050f;padding:30px;color:#fff;border-radius:16px;max-width:500px;margin:auto">
                  <h2 style="color:#a855f7">BXF TOLS SHOP</h2>
                  <p>Kode OTP kamu:</p>
                  <h1 style="font-size:42px;letter-spacing:8px;color:#a855f7;background:#1a1030;padding:20px;border-radius:12px;text-align:center">${otp}</h1>
                  <p style="color:#b6a8d8;font-size:13px">Berlaku 5 menit. Jangan bagikan kode ini ke siapapun.</p>
               </div>
            `
         });

         const jwToken = jwt.sign({ email, type:'otp' }, JWT_SECRET, { expiresIn:'10m' });
         return res.json({ success:true, token:jwToken, message:'OTP terkirim' });
      } catch (err) {
         return res.status(500).json({ success:false, message:err.message });
      }
   }

   if (action === 'verify') {
      try {
         const payload = jwt.verify(token, JWT_SECRET);
         const entry = otpStore.get(payload.email);
         if (!entry) return res.json({ success:false, message:'OTP tidak ditemukan' });
         if (Date.now() > entry.expires) return res.json({ success:false, message:'OTP kadaluarsa' });
         if (entry.otp !== code) return res.json({ success:false, message:'OTP salah' });

         otpStore.delete(payload.email);
         const jwtAuth = jwt.sign({ user:'brdanz', role:'owner' }, JWT_SECRET, { expiresIn:'24h' });
         return res.json({ success:true, jwt:jwtAuth });
      } catch (err) {
         return res.json({ success:false, message:'Token invalid: ' + err.message });
      }
   }

   return res.status(400).json({ success:false, message:'Action invalid' });
}