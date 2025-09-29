import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
const nav = useNavigate();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [err, setErr] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

async function signIn(e: React.FormEvent) {
e.preventDefault();
setLoading(true);
setErr(null);
const { error } = await supabase.auth.signInWithPassword({ email, password });
setLoading(false);
if (error) setErr(error.message);
else nav('/admin');
}

return (
<main style={{ padding: 24 }}>
<h1>Admin Login</h1>
<form onSubmit={signIn} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
<input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
<input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
<button disabled={loading} type="submit">{loading ? 'Signing in…' : 'Sign in'}</button>
{err && <p style={{ color: 'crimson' }}>{err}</p>}
</form>
</main>
);
}