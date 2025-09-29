import { Outlet, Link } from 'react-router-dom';

export default function App() {
return (
<div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
<header style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
<Link to="/" style={{ fontWeight: 700, textDecoration: 'none', color: '#111' }}>
Horsepower Electrical
</Link>
<nav style={{ display: 'flex', gap: 12 }}>
<a href="#services">Services</a>
<a href="#about">About</a>
<a href="#contact">Contact</a>
<Link to="/admin/login" style={{ fontSize: 14, opacity: 0.8 }}>Admin Login</Link>
</nav>
</header>
<Outlet />
<footer style={{ padding: '24px', borderTop: '1px solid #eee', marginTop: 40, fontSize: 14, color: '#666' }}>
© {new Date().getFullYear()} Horsepower Electrical — Brisbane, QLD
</footer>
</div>
);
}