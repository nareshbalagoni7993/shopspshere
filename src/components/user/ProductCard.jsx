import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { formatCurrency } from '../../utils/helpers';
import { getCategoryIcon } from '../../constants';
import { toast } from '../../services/toastBus';
import { cartPopupBus } from '../../services/cartPopupBus';
import Card from '../common/Card';
import './ProductCard.css';

const ProductCard = ({ product, variant = 'grid' }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
    cartPopupBus.show(product, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    toast.info(isInWishlist ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`);
  };

  if (variant === 'list') {
    return (
      <Link to={`/products/${product.id}`} className="product-card-list">
        <img src={product.image} alt={product.name} />
        <div className="product-info-list">
          <h4>{product.name}</h4>
          <p className="brand">
            <span aria-hidden="true">{getCategoryIcon(product.category)}</span> {product.brand}
          </p>
          <div className="rating">
            ⭐ {product.rating} ({product.reviews} reviews)
          </div>
          <div className="price-section">
            <span className="price">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="original-price">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="discount">{product.discount}% OFF</span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <Card className="product-card-inner">
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <span className="category-badge" title={product.category} aria-hidden="true">
            {getCategoryIcon(product.category)}
          </span>
          {product.discount && (
            <div className="discount-badge">{product.discount}% OFF</div>
          )}
          <motion.button
            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
            onClick={handleWishlist}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {isInWishlist ? '❤️' : '🤍'}
          </motion.button>
        </div>

        <div className="product-details">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-brand">{product.brand}</p>

          <div className="product-rating">
            <span className="stars">⭐ {product.rating}</span>
            <span className="reviews">({product.reviews})</span>
          </div>

          <div className="product-price">
            <span className="current-price">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="original-price">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="product-actions">
            <motion.button
              className="add-to-cart"
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>
            <Link to={`/products/${product.id}`} className="quick-view">
              Quick View
            </Link>
          </div>

          {product.stock < 10 && product.stock > 0 && (
            <p className="low-stock">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="out-of-stock">Out of Stock</p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
