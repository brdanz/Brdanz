import axios from 'axios';

const QRIS_API_KEY = '44867c413826a00339f517264094866dc97fa19a8a17b270fcd0e04bcaeb9119';
const MERCHANT_CODE = 'QP042660';
const BASE_URL = 'https://qiospay.id/api/mutasi/qris';

export default async function handler(req, res) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
   if (req.method === 'OPTIONS') return res.status(200).end();

   const url = `${BASE_URL}/${MERCHANT_CODE}/${QRIS_API_KEY}`;

   // GET = cek mutasi
   if (req.method === 'GET') {
      try {
         const { data } = await axios.get(url, { timeout: 30000 });
         return res.json(data);
      } catch (err) {
         return res.status(500).json({ success:false, message: err.message });
      }
   }

   // POST = callback handler dari Qiospay
   if (req.method === 'POST') {
      const payload = req.body;
      console.log('QRIS Callback:', JSON.stringify(payload));

      // TODO: validasi signature, update saldo user, kirim notif
      // Contoh: kalau amount >= nominal topup, tambah saldo user

      // Return 200 supaya Qiospay stop retry
      return res.status(200).json({ success: true });
   }
}