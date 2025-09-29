import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
{
path: '/',
element: <App />,
children: [
{ index: true, element: <Home /> },
{ path: 'admin/login', element: <AdminLogin /> },
{ path: 'admin', element: (
<ProtectedRoute>
<AdminDashboard />
</ProtectedRoute>
) }
]
}
]);

createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<RouterProvider router={router} />
</React.StrictMode>
);