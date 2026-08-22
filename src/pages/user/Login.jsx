import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Auth.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    dispatch(loginStart());

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        dispatch(loginSuccess(result));
        navigate(result.user.role === 'admin' ? '/admin' : '/products');
      } else {
        setError(result.message);
        dispatch(loginFailure(result.message));
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      dispatch(loginFailure('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-content">
        <div className="auth-header">
          <h1>Sign In</h1>
          <p>Sign in to access your dashboard and continue shopping with ease.</p>
        </div>

        {error && (
          <motion.div
            className="auth-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <div className="auth-social">
          <button type="button" className="social-icon" onClick={() => setError('Social sign-in is not available in this demo.')} aria-label="Continue with Facebook">f</button>
          <button type="button" className="social-icon" onClick={() => setError('Social sign-in is not available in this demo.')} aria-label="Continue with Google">G+</button>
          <button type="button" className="social-icon" onClick={() => setError('Social sign-in is not available in this demo.')} aria-label="Continue with LinkedIn">in</button>
        </div>
        <p className="auth-divider-text">or use your email account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon="📧"
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon="🔒"
          />

          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>

        <div className="demo-credentials">
          <p>User demo: john@example.com / password123</p>
          <p>Admin demo: admin@example.com / password123</p>
        </div>
        </div>
        <aside className="auth-showcase">
          <Link to="/" className="auth-brand">ShopSphere</Link>
          <div className="showcase-copy">
            <span className="showcase-kicker">NEW HERE?</span>
            <h2>Hello, Friend!</h2>
            <p>Enter your personal details and start your journey with us today.</p>
          </div>
          <div className="showcase-cta">
            <Link to="/register" className="btn btn-outline-primary btn-large">Sign Up</Link>
          </div>
        </aside>
      </motion.div>
    </div>
  );
};

export default Login;
