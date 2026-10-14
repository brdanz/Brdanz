import axios from 'axios';

const SMM_API_ID = 'SMM426601791964758';
const SMM_API_KEY = '0b63bac0c99c0217e50fd21e45798c6ffc4a5d4b35f0c0bd5a93dc75585d7c4e';
const SMM_ENDPOINT = 'https://qiospay.id/api/smm';

export default async function handler(req, res) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
   if (req.method === 'OPTIONS') return res.status(200).end();
   if (req.method !== 'POST') return res.status(405).json({ success:false });

   const { action, service, target, quantity, custom_comments, trx_id } = req.body;

   const payload = {
      api_id: SMM_API_ID,
      api_key: SMM_API_KEY,
      action
   };

   if (action === 'order') {
      payload.service = service;
      payload.target = target;
      payload.quantity = quantity;
      if (custom_comments) payload.custom_comments = custom_comments;
   }

   if (action === 'status') payload.trx_id = trx_id;

   try {
      const { data } = await axios.post(SMM_ENDPOINT, payload, {
         headers: { 'Content-Type':'application/json' },
         timeout: 30000
      });
      return res.json(data);
   } catch (err) {
      return res.status(500).json({
         success:false,
         message: err.response?.data?.message || err.message
      });
   }
}