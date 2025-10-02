import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

type InviteResponse =
  | { ok: true; email: string; tempPassword: string; inviteLink: string }
  | { ok?: false; error: string; details?: string };

export default function InviteUser() {
  const nav = useNavigate();

  // simple auth gate (super lightweight)
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) {
        setAuthed(false);
        return;
      }
      setAuthed(true);
      // fetch profile role
      const { data: prof } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', s.session.user.id)
        .single();
      setRole(prof?.role ?? null);
    })();
  }, []);

  useEffect(() => {
    if (authed === false) nav('/admin/login');
  }, [authed, nav]);

  // form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'employee' | 'admin'>('employee');

  // results
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const canInvite = useMemo(() => role === 'superadmin', [role]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setServerErr(null);
    setInviteLink(null);
    setTempPassword(null);

    try {
      const res = await fetch('/api/admin/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          role: newUserRole,
        }),
      });

      const data = (await res.json()) as InviteResponse;

      if (!res.ok || !('ok' in data) || !data.ok) {
        const msg = (data as any)?.error || `Request failed (${res.status})`;
        setServerErr(msg);
      } else {
        setInviteLink(data.inviteLink);
        setTempPassword(data.tempPassword);
        // clear form
        setFullName('');
        setEmail('');
        setPhone('');
        setNewUserRole('employee');
      }
    } catch (err: any) {
      setServerErr(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  async function copyAll() {
    if (!inviteLink && !tempPassword) return;
    const text = `Invite link: ${inviteLink ?? ''}\nTemp password: ${tempPassword ?? ''}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Copied to clipboard');
    }
  }

  if (authed === null) return null;
  if (!canInvite) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Invite Users</h1>
        <p style={{ color: '#b00' }}>
          You must be a <strong>superadmin</strong> to invite users.
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Invite a User</h1>
        <button onClick={() => nav('/admin')}>Back to Admin</button>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
        <label>
          <div>Full name</div>
          <input
            required
            placeholder="Jane Doe"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </label>

        <label>
          <div>Email</div>
          <input
            required
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>

        <label>
          <div>Phone (optional)</div>
          <input
            placeholder="0400 000 000"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </label>

        <label>
          <div>Role</div>
          <select
            value={newUserRole}
            onChange={e => setNewUserRole(e.target.value as 'employee' | 'admin')}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button disabled={loading} type="submit">
          {loading ? 'Creating…' : 'Create user'}
        </button>

        {serverErr && <p style={{ color: 'crimson' }}>{serverErr}</p>}
      </form>

      {inviteLink && (
        <section style={{ border: '1px solid #eee', padding: 12, borderRadius: 8, maxWidth: 640 }}>
          <h2 style={{ marginTop: 0 }}>Invitation</h2>
          <p>
            <strong>Invite link:</strong><br />
            <code style={{ wordBreak: 'break-all' }}>{inviteLink}</code>
          </p>
          <p>
            <strong>Temporary password:</strong><br />
            <code>{tempPassword}</code>
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={copyAll}>Copy invite + temp password</button>
          </div>
          <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
            Share this with the new user. They should log in and change their password immediately.
          </p>
        </section>
      )}
    </main>
  );
}
