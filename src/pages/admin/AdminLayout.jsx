import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './AdminLayout.css';

const links = [
  ['/admin', 'Dashboard', '📊'],
  ['/admin/users', 'Users', '👥'],
  ['/admin/products', 'Products', '📦'],
  ['/admin/categories', 'Categories', '🗂️'],
  ['/admin/orders', 'Orders', '🧾'],
  ['/admin/payments', 'Payments', '💳'],
  ['/admin/reports', 'Reports', '📈'],
  ['/admin/settings', 'Settings', '⚙️']
];

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      <aside className={open ? 'admin-sidebar open' : 'admin-sidebar'}>
        <NavLink to="/admin" className="admin-brand">
          ShopSphere <span>Admin</span>
        </NavLink>

        <nav>
          {links.map(([path, label, icon]) => (
            <NavLink key={path} end={path === '/admin'} to={path} onClick={() => setOpen(false)}>
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-identity">
            <span className="admin-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
            <div>
              <strong>{user?.name || 'Admin'}</strong>
              <small>{user?.email}</small>
            </div>
          </div>
          <button className="admin-logout" onClick={handleLogout}>
            <span aria-hidden="true">🚪</span> Logout
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <button onClick={() => setOpen(!open)} aria-label="Toggle admin menu">☰</button>
          <span>Administration Portal</span>
          <button className="admin-topbar-logout" onClick={handleLogout} title="Logout">
            🚪
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
