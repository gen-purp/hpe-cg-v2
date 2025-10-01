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


// // api/index.ts
// import express from 'express';
// import type { VercelRequest, VercelResponse } from '@vercel/node';
// import serverlessHttp from 'serverless-http';
// import cors from 'cors';
// import { createClient } from '@supabase/supabase-js';

// const app = express();
// app.use(cors());
// app.use(express.json());

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE!,
//   { auth: { persistSession: false } }
// );

// // helper to register the same route with and without '/api' prefix
// function dualRoute(method: 'get' | 'post' | 'put' | 'patch' | 'delete', path: string, handler: any) {
//   (app as any)[method](path, handler);              // e.g. '/leads/submit'
//   (app as any)[method](`/api${path}`, handler);     // e.g. '/api/leads/submit'
// }

// dualRoute('get', '/health', (_req: any, res: any) => {
//   res.json({ ok: true, time: new Date().toISOString() });
// });

// dualRoute('post', '/leads/submit', async (req: any, res: any) => {
//   try {
//     const { name, email, phone, message, source } = req.body || {};
//     if (!name || !email || !message) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }
//     const { error } = await supabase.from('leads').insert([
//       { name, email, phone: phone ?? null, message, source: source ?? 'website' }
//     ]);
//     if (error) {
//       console.error('Insert error:', error);
//       return res.status(500).json({ error: 'Failed to save lead' });
//     }
//     return res.status(200).json({ ok: true });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Unexpected server error' });
//   }
// });

// // Always respond (no hangs) if nothing matched
// app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// export default function handler(req: VercelRequest, res: VercelResponse) {
//   const expressHandler = serverlessHttp(app);
//   return expressHandler(req as any, res as any);
// }


// // // api/index.ts
// // import express from 'express';
// // import type { VercelRequest, VercelResponse } from '@vercel/node';
// // import serverlessHttp from 'serverless-http';
// // import cors from 'cors';
// // import { createClient } from '@supabase/supabase-js';

// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // // Server-side Supabase client with SERVICE ROLE key (never expose in frontend)
// // const supabase = createClient(
// // process.env.SUPABASE_URL!,
// // process.env.SUPABASE_SERVICE_ROLE!,
// // { auth: { persistSession: false } }
// // );

// // app.get('/health', (_req, res) => {
// // res.json({ ok: true, time: new Date().toISOString() });
// // });

// // // Contact form submission endpoint
// // app.post('/leads/submit', async (req, res) => {
// // try {
// // const { name, email, phone, message, source } = req.body || {};

// // if (!name || !email || !message) {
// // return res.status(400).json({ error: 'Missing required fields' });
// // }

// // const { error } = await supabase.from('leads').insert([
// // { name, email, phone: phone ?? null, message, source: source ?? 'website' }
// // ]);

// // if (error) {
// // console.error('Insert error:', error);
// // return res.status(500).json({ error: 'Failed to save lead' });
// // }

// // return res.status(200).json({ ok: true });
// // } catch (e) {
// // console.error(e);
// // return res.status(500).json({ error: 'Unexpected server error' });
// // }
// // });

// // // Export Vercel-compatible handler
// // export default function handler(req: VercelRequest, res: VercelResponse) {
// // const expressHandler = serverlessHttp(app);
// // return expressHandler(req as any, res as any);
// // }