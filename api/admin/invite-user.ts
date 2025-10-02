// api/admin/invite-user.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!, // service role needed for admin API
  { auth: { persistSession: false } }
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { full_name, email, phone, role } = req.body ?? {};
    if (!email || !full_name) {
      return res.status(400).json({ error: 'Email and full_name are required' });
    }

    // Generate a random temp password (the user will reset it later)
    const tempPassword = Math.random().toString(36).slice(-10) + "!A1";

    // 1) Create the auth user
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true
    });
    if (createErr) {
      return res.status(500).json({ error: 'Failed to create user', details: createErr.message });
    }

    const userId = created.user?.id;
    if (!userId) {
      return res.status(500).json({ error: 'Could not resolve user id' });
    }

    // 2) Insert into profiles
    const { error: upsertErr } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        full_name,
        phone,
        role: role ?? 'employee'
      }, { onConflict: 'id' });

    if (upsertErr) {
      return res.status(500).json({ error: 'Failed to upsert profile', details: upsertErr.message });
    }

    // Return an invitation link the admin can copy
    const inviteLink = `https://horsepowerelectrical.company/admin/login?email=${encodeURIComponent(email)}&temp=${encodeURIComponent(tempPassword)}`;

    return res.status(200).json({ ok: true, email, tempPassword, inviteLink });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
