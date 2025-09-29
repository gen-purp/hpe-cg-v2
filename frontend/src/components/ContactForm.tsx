import { useState } from 'react';

export default function ContactForm() {
const [loading, setLoading] = useState(false);
const [ok, setOk] = useState<null | boolean>(null);
const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

async function submit(e: React.FormEvent) {
e.preventDefault();
setLoading(true);
setOk(null);

try {
const res = await fetch('/api/leads/submit', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ ...form, source: 'website' })
});
setOk(res.ok);
if (res.ok) setForm({ name: '', email: '', phone: '', message: '' });
} catch (err) {
setOk(false);
} finally {
setLoading(false);
}
}

return (
<form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
<input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
<input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
<input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
<textarea required placeholder="How can we help?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
<button disabled={loading} type="submit">{loading ? 'Sending…' : 'Send'}</button>
{ok === true && <p style={{ color: 'green' }}>Thanks! We’ll be in touch.</p>}
{ok === false && <p style={{ color: 'crimson' }}>Something went wrong. Please try again.</p>}
</form>
);
}