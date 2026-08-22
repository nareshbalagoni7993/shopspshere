import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUser } from '../../store/slices/authSlice';
import { removeFromWishlist } from '../../store/slices/wishlistSlice';
import { markAllAsRead } from '../../store/slices/notificationsSlice';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { getUserNotifications } from '../../mock/mockNotifications';
import './UserDashboard.css';

const tabs = ['Profile', 'Orders', 'Wishlist', 'Addresses', 'Notifications', 'Settings'];
const statusLabel = (status) => status.replaceAll('_', ' ');

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist.items);
  const notifications = useSelector((state) => state.notifications.items);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'Profile');
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', mobile: user?.mobile || '' });
  const [address, setAddress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`saved-address-${user?.id}`)) || user?.addresses?.[0] || {}; } catch { return {}; }
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadOrders = async () => setOrders(await orderService.getUserOrders(user?.id));
    loadOrders();
    const timer = window.setInterval(async () => setOrders(await orderService.progressUserOrders(user?.id)), 5 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [user?.id]);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (requestedTab && tabs.includes(requestedTab)) setActiveTab(requestedTab);
  }, [searchParams]);

  const saveProfile = (event) => { event.preventDefault(); dispatch(updateUser({ ...user, ...profile })); setMessage('Profile saved.'); };
  const saveAddress = (event) => { event.preventDefault(); localStorage.setItem(`saved-address-${user?.id}`, JSON.stringify(address)); setMessage('Address saved for future checkouts.'); };
  const handleLogout = () => { dispatch(logout()); navigate('/'); };
  const displayNotifications = notifications.length ? notifications : getUserNotifications(user?.id);

  return <section className="user-dashboard"><div className="container"><div className="dashboard-heading"><div><h1>My Account</h1><p>Manage your profile, orders, and preferences.</p></div><button className="dashboard-logout" onClick={handleLogout}>Log out</button></div><div className="user-dashboard-layout">
    <aside className="dashboard-nav">{tabs.map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => { setActiveTab(tab); setSearchParams({ tab }); setMessage(''); }}>{tab}</button>)}<button onClick={handleLogout}>Log out</button></aside>
    <main className="dashboard-panel">{message && <p className="dashboard-message">{message}</p>}
      {activeTab === 'Profile' && <form onSubmit={saveProfile}><h2>Profile</h2><div className="dashboard-fields"><label>Full name<input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} required /></label><label>Email<input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required /></label><label>Mobile<input value={profile.mobile} onChange={(event) => setProfile({ ...profile, mobile: event.target.value })} /></label></div><button className="dashboard-primary">Save profile</button></form>}
      {activeTab === 'Orders' && <><div className="panel-title"><div><h2>Orders</h2><p>Order tracking refreshes every five minutes in this demo.</p></div><Link to="/products">Shop more</Link></div>{orders.length ? <div className="orders-list">{orders.map((order) => <article className="user-order" key={order.id}><div><strong>{order.id}</strong><span>{formatDate(order.orderDate)}</span></div><div><span className={`order-status status-${order.status}`}>{statusLabel(order.status)}</span><strong>{formatCurrency(order.total)}</strong></div><p>Tracking: {order.trackingNumber || 'Will be assigned after dispatch'}</p>{order.estimatedDeliveryDate && <p>Estimated delivery: {formatDate(order.estimatedDeliveryDate)}</p>}</article>)}</div> : <p>No orders yet.</p>}</>}
      {activeTab === 'Wishlist' && <><h2>Wishlist</h2>{wishlist.length ? <div className="wishlist-grid">{wishlist.map((item) => <article key={item.id}><img src={item.image} alt="" /><h3>{item.name}</h3><p>{formatCurrency(item.price)}</p><button onClick={() => dispatch(removeFromWishlist(item.id))}>Remove</button></article>)}</div> : <p>Your wishlist is empty.</p>}</>}
      {activeTab === 'Addresses' && <form onSubmit={saveAddress}><h2>Saved address</h2><div className="dashboard-fields"><label>Full name<input value={address.fullName || address.name || ''} onChange={(event) => setAddress({ ...address, fullName: event.target.value })} required /></label><label>Street<input value={address.street || ''} onChange={(event) => setAddress({ ...address, street: event.target.value })} required /></label><label>City<input value={address.city || ''} onChange={(event) => setAddress({ ...address, city: event.target.value })} required /></label><label>State<input value={address.state || ''} onChange={(event) => setAddress({ ...address, state: event.target.value })} required /></label><label>ZIP code<input value={address.zipCode || ''} onChange={(event) => setAddress({ ...address, zipCode: event.target.value })} required /></label><label>Country<input value={address.country || ''} onChange={(event) => setAddress({ ...address, country: event.target.value })} required /></label></div><button className="dashboard-primary">Save address</button></form>}
      {activeTab === 'Notifications' && <><div className="panel-title"><h2>Notifications</h2><button onClick={() => dispatch(markAllAsRead())}>Mark all as read</button></div>{displayNotifications.map((note) => <article className="notification-item" key={note.id}><span>{note.icon || '•'}</span><div><strong>{note.title}</strong><p>{note.message}</p></div></article>)}</>}
      {activeTab === 'Settings' && <><h2>Account settings</h2><label className="setting-row"><span>Order updates</span><input type="checkbox" defaultChecked /></label><label className="setting-row"><span>Promotional emails</span><input type="checkbox" defaultChecked /></label><button className="dashboard-danger" onClick={handleLogout}>Log out of this account</button></>}
    </main>
  </div></div></section>;
};

export default UserDashboard;
