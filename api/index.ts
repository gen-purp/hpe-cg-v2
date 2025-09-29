// api/index.ts
import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverlessHttp from 'serverless-http';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// Server-side Supabase client with SERVICE ROLE key (never expose in frontend)
const supabase = createClient(
process.env.SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE!,
{ auth: { persistSession: false } }
);

app.get('/api/health', (_req, res) => {
res.json({ ok: true, time: new Date().toISOString() });
});

// Contact form submission endpoint
app.post('/api/leads/submit', async (req, res) => {
try {
const { name, email, phone, message, source } = req.body || {};

if (!name || !email || !message) {
return res.status(400).json({ error: 'Missing required fields' });
}

const { error } = await supabase.from('leads').insert([
{ name, email, phone: phone ?? null, message, source: source ?? 'website' }
]);

if (error) {
console.error('Insert error:', error);
return res.status(500).json({ error: 'Failed to save lead' });
}

return res.status(200).json({ ok: true });
} catch (e) {
console.error(e);
return res.status(500).json({ error: 'Unexpected server error' });
}
});

// Export Vercel-compatible handler
export default function handler(req: VercelRequest, res: VercelResponse) {
const expressHandler = serverlessHttp(app);
return expressHandler(req as any, res as any);
}