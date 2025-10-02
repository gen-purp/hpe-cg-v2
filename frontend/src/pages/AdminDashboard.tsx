import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const nav = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (s.session?.user) {
        setUserEmail(s.session.user.email ?? null);
        // fetch role from profiles
        const { data: prof } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', s.session.user.id)
          .single();
        setRole(prof?.role ?? null);
      }
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    nav('/admin/login');
  }

  return (
    <main style={{ padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Horsepower Admin Centre</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {role === 'superadmin' && (
            <button onClick={() => nav('/admin/invite')}>Invite user</button>
          )}
          <button onClick={signOut}>Sign out</button>
        </div>
      </header>

      <section style={{ marginBottom: 20 }}>
        <p>
          Logged in as <strong>{userEmail}</strong>{' '}
          {role && (
            <>
              (<em>{role}</em>)
            </>
          )}
        </p>
      </section>

      <section>
        <h2>Dashboard</h2>
        <p>This is where you can view leads, manage users, and other admin tasks.</p>
      </section>
    </main>
  );
}



// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabaseClient';
// import { useNavigate } from 'react-router-dom';

// type Lead = {
// id: string;
// created_at: string;
// name: string;
// email: string;
// phone: string | null;
// message: string;
// source: string | null;
// status: string | null;
// };

// export default function AdminDashboard() {
// const nav = useNavigate();
// const [leads, setLeads] = useState<Lead[]>([]);

// useEffect(() => {
// (async () => {
// const { data, error } = await supabase
// .from('leads')
// .select('*')
// .order('created_at', { ascending: false })
// .limit(200);
// if (!error && data) setLeads(data as Lead[]);
// })();
// }, []);

// async function signOut() {
// await supabase.auth.signOut();
// nav('/admin/login');
// }

// return (
// <main style={{ padding: 24 }}>
// <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// <h1>Admin Centre</h1>
// <div style={{ display: 'flex', gap: 8 }}>
//   <button onClick={() => nav('/admin/invite')}>Invite user</button>
//   <button onClick={signOut}>Sign out</button>
// </div>
// <button onClick={signOut}>Sign out</button>
// </div>
// <h2>Leads</h2>
// <div style={{ overflowX: 'auto' }}>
// <table cellPadding={8} style={{ borderCollapse: 'collapse', minWidth: 800 }}>
// <thead>
// <tr>
// <th align="left">Created</th>
// <th align="left">Name</th>
// <th align="left">Email</th>
// <th align="left">Phone</th>
// <th align="left">Message</th>
// <th align="left">Status</th>
// </tr>
// </thead>
// <tbody>
// {leads.map(l => (
// <tr key={l.id} style={{ borderTop: '1px solid #eee' }}>
// <td>{new Date(l.created_at).toLocaleString()}</td>
// <td>{l.name}</td>
// <td>{l.email}</td>
// <td>{l.phone ?? ''}</td>
// <td>{l.message}</td>
// <td>{l.status ?? ''}</td>
// </tr>
// ))}
// </tbody>
// </table>
// </div>
// </main>
// );
// }