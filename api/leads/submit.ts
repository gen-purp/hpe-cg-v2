// api/leads/submit.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,          // server-side only
  process.env.SUPABASE_SERVICE_ROLE!, // server-side only
  { auth: { persistSession: false } }
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, message, source } = req.body ?? {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await supabase.from('leads').insert([{
      name,
      email,
      phone: phone ?? null,
      message,
      source: source ?? 'website'
    }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save lead' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}