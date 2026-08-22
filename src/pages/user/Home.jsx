import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import { mockCategories } from '../../mock/mockCategories';
import ProductCard from '../../components/user/ProductCard';
import Loader from '../../components/common/Loader';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await productService.getAllProducts();
        setProducts(allProducts.slice(0, 12));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to ShopSphere
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover amazing products at unbeatable prices
          </motion.p>
          <motion.Link
            to="/products"
            className="hero-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Now
          </motion.Link>
        </div>
        <div className="hero-image">
          <div className="hero-shape">📦 🛍️ 🎁</div>
        </div>
      </section>

      {/* Announcement */}
      <section className="announcement">
        <p>🎉 Special offer: Get up to 50% off on selected items!</p>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {mockCategories.map((category, index) => (
              <motion.Link
                key={category.id}
                to={`/products?category=${category.name}`}
                className="category-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.productCount} Products</p>
                </div>
              </motion.Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <h2>Featured Products</h2>
          {loading ? (
            <Loader />
          ) : (
            <div className="products-grid">
              {products.slice(0, 6).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="banner-grid">
            <motion.div
              className="banner-card banner-primary"
              whileHover={{ y: -10 }}
            >
              <h3>Summer Sale</h3>
              <p>Up to 60% OFF</p>
              <Link to="/products">Shop Now →</Link>
            </motion.div>
            <motion.div
              className="banner-card banner-secondary"
              whileHover={{ y: -10 }}
            >
              <h3>Free Shipping</h3>
              <p>On orders over $100</p>
              <Link to="/products">View Deals →</Link>
            </motion.div>
            <motion.div
              className="banner-card banner-tertiary"
              whileHover={{ y: -10 }}
            >
              <h3>Member Benefits</h3>
              <p>Exclusive Rewards</p>
              <Link to="/register">Join Now →</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="trending-section">
        <div className="container">
          <h2>Trending Now</h2>
          {loading ? (
            <Loader />
          ) : (
            <div className="products-grid">
              {products.slice(6, 12).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get exclusive offers and updates delivered to your inbox</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
