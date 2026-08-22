import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About ShopSphere</h4>
          <ul>
            <li><Link to="/">About Us</Link></li>
            <li><Link to="/">Careers</Link></li>
            <li><Link to="/">Blog</Link></li>
            <li><Link to="/">Press</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><Link to="/">Contact Us</Link></li>
            <li><Link to="/">Help Center</Link></li>
            <li><Link to="/">Track Order</Link></li>
            <li><Link to="/">Returns</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Policies</h4>
          <ul>
            <li><Link to="/">Privacy Policy</Link></li>
            <li><Link to="/">Terms of Service</Link></li>
            <li><Link to="/">Shipping Policy</Link></li>
            <li><Link to="/">Refund Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
          <div className="newsletter">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 ShopSphere. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
