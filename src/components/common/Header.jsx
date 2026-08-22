import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { totalItems } = useSelector(state => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-badge">🛍️</span>
          <span className="logo-text">ShopSphere</span>
        </Link>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">🔍</button>
        </form>

        {/* Right menu */}
        <nav className="header-nav">
          <Link to="/categories" className="nav-link">
            Categories
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/wishlist" className="nav-link">
                <span className="nav-icon">❤️</span> Wishlist
              </Link>

              <Link to="/cart" className="nav-link cart-link">
                <span className="nav-icon">🛒</span> Cart
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>

              <div className="user-menu">
                <button className="user-btn">
                  <span className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || '?'}</span>
                  {user?.name?.split(' ')[0]}
                  <span className="user-chevron">▾</span>
                </button>
                <div className="dropdown">
                  <Link to="/profile">🧑 My Profile</Link>
                  <Link to="/my-orders">📦 My Orders</Link>
                  <Link to="/addresses">📍 Addresses</Link>
                  <Link to="/notifications">🔔 Notifications</Link>
                  <hr />
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link btn-login">
                Login
              </Link>
              <Link to="/register" className="nav-link btn-register">
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/categories" onClick={() => setMobileMenuOpen(false)}>
            Categories
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                Wishlist
              </Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                Cart ({totalItems})
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)}>
                Orders
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </motion.div>
      )}
    </header>
  );
};

export default Header;
