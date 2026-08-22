import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { loginSuccess } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Auth.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });

      if (result.success) {
        dispatch(loginSuccess(result));
        navigate('/products');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
        <aside className="auth-showcase">
          <Link to="/" className="auth-brand">ShopSphere</Link>
          <div className="showcase-copy">
            <span className="showcase-kicker">WELCOME BACK</span>
            <h2>Welcome Back!</h2>
            <p>To keep connected with us please login with your personal info.</p>
          </div>
          <div className="showcase-cta">
            <Link to="/login" className="btn btn-outline-primary btn-large">Sign In</Link>
          </div>
        </aside>
        <div className="auth-content">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Create your account to save favourites, track orders, and checkout faster.</p>
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
          <button type="button" className="social-icon" onClick={() => setError('Social sign-up is not available in this demo.')} aria-label="Continue with Facebook">f</button>
          <button type="button" className="social-icon" onClick={() => setError('Social sign-up is not available in this demo.')} aria-label="Continue with Google">G+</button>
          <button type="button" className="social-icon" onClick={() => setError('Social sign-up is not available in this demo.')} aria-label="Continue with LinkedIn">in</button>
        </div>
        <p className="auth-divider-text">or use your email for registration</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="text"
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            icon="👤"
          />

          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            icon="📧"
          />

          <Input
            type="tel"
            name="mobile"
            label="Mobile Number"
            placeholder="Enter your mobile number"
            value={formData.mobile}
            onChange={handleChange}
            required
            icon="📱"
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            icon="🔒"
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            icon="🔒"
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
