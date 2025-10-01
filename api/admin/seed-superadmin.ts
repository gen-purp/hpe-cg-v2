// api/admin/seed-superadmin.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
  { auth: { persistSession: false } }
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple lock so randoms can't hit this
  const headerKey = req.headers['x-admin-seed-key'];
  if (!process.env.ADMIN_SEED_KEY || headerKey !== process.env.ADMIN_SEED_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const email = 'jack@wellthought.me';
    const password = "zz(.kyR%Ev2H174='?"; // you said to use this (change later!)

    // 1) Create auth user (mark as confirmed so you can log in immediately)
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (createErr) {
      // If user already exists, we’ll fetch the ID below; otherwise fail
      if (createErr.message && !/exists/i.test(createErr.message)) {
        return res.status(500).json({ error: 'Failed to create auth user', details: createErr.message });
      }
    }

    // Get the user ID (from creation or by lookup)
    const userId =
      created?.user?.id ??
      (await supabase.auth.admin.listUsers({ page: 1, perPage: 1, email }))
        .data?.users?.[0]?.id;

    if (!userId) {
      return res.status(500).json({ error: 'Could not resolve user id' });
    }

    // 2) Upsert profile with superadmin role
    const { error: upsertErr } = await supabase
      .from('profiles')
      .upsert({ id: userId, email, role: 'superadmin' }, { onConflict: 'id' });

    if (upsertErr) {
      return res.status(500).json({ error: 'Failed to upsert profile', details: upsertErr.message });
    }

    return res.status(200).json({ ok: true, userId, email, role: 'superadmin' });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
