import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const links = [['/admin', 'Dashboard'], ['/admin/users', 'Users'], ['/admin/products', 'Products'], ['/admin/categories', 'Categories'], ['/admin/orders', 'Orders'], ['/admin/payments', 'Payments'], ['/admin/reports', 'Reports'], ['/admin/settings', 'Settings']];

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  return <div className="admin-shell"><aside className={open ? 'admin-sidebar open' : 'admin-sidebar'}><NavLink to="/admin" className="admin-brand">ShopSphere <span>Admin</span></NavLink><nav>{links.map(([path, label]) => <NavLink key={path} end={path === '/admin'} to={path} onClick={() => setOpen(false)}>{label}</NavLink>)}</nav></aside><div className="admin-content"><header className="admin-topbar"><button onClick={() => setOpen(!open)} aria-label="Toggle admin menu">☰</button><span>Administration Portal</span></header><Outlet /></div></div>;
};
export default AdminLayout;
