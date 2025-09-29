import { ReactNode, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
const [ready, setReady] = useState(false);
const [authed, setAuthed] = useState(false);

useEffect(() => {
supabase.auth.getSession().then(({ data }) => {
setAuthed(!!data.session);
setReady(true);
});
const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
setAuthed(!!session);
});
return () => { sub.subscription.unsubscribe(); };
}, []);

if (!ready) return null;
return authed ? <>{children}</> : <Navigate to="/admin/login" replace />;
}