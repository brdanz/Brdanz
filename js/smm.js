// Helper SMM — sudah inline di app.js, file ini opsional untuk modularitas
export const SMM_ACTIONS = {
   PROFILE: 'profile',
   SERVICES: 'services',
   ORDER: 'order',
   STATUS: 'status'
};

export async function smmRequest(action, payload = {}) {
   const res = await fetch('/api/smm', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ action, ...payload })
   });
   return res.json();
}