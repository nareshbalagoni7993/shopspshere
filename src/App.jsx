import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import store from './store';

// Styles
import './styles/global.css';

// Layouts
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import GlobalLoader from './components/common/GlobalLoader';
import ToastContainer from './components/common/ToastContainer';
import CartAddedPopup from './components/common/CartAddedPopup';

// User Pages
import Home from './pages/user/Home';
import Products from './pages/user/Products';
import ProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import UserDashboard from './pages/user/UserDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminManagementPage from './pages/admin/ManagementPage';

// Common
import NotFound from './components/common/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

// Main App Component
function AppContent() {
  const { cart, wishlist } = useSelector(state => ({
    cart: state.cart,
    wishlist: state.wishlist
  }));

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    // The persistence is already handled by the store subscription
  }, []);

  const isAdminArea = useLocation().pathname.startsWith('/admin');

  return (
      <div className="app">
        <GlobalLoader />
        <ToastContainer />
        <CartAddedPopup />
        {!isAdminArea && <Header />}
        <main className="app-main">
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<Navigate to="/dashboard?tab=Profile" replace />} />
            <Route path="/my-orders" element={<Navigate to="/dashboard?tab=Orders" replace />} />
            <Route path="/wishlist" element={<Navigate to="/dashboard?tab=Wishlist" replace />} />
            <Route path="/addresses" element={<Navigate to="/dashboard?tab=Addresses" replace />} />
            <Route path="/notifications" element={<Navigate to="/dashboard?tab=Notifications" replace />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminManagementPage type="users" />} />
              <Route path="products" element={<AdminManagementPage type="products" />} />
              <Route path="categories" element={<AdminManagementPage type="categories" />} />
              <Route path="orders" element={<AdminManagementPage type="orders" />} />
              <Route path="payments" element={<AdminManagementPage type="payments" />} />
              <Route path="reports" element={<AdminManagementPage type="reports" />} />
              <Route path="settings" element={<AdminManagementPage type="settings" />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAdminArea && <Footer />}
      </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router><AppContent /></Router>
    </Provider>
  );
}

export default App;
