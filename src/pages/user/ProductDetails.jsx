import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { productService } from '../../services/productService';
import { cartPopupBus } from '../../services/cartPopupBus';
import ProductCard from '../../components/user/ProductCard';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await productService.getProduct(id);
        if (productData) {
          setProduct(productData);
          const related = await productService.getRelatedProducts(
            productData.id,
            productData.category
          );
          setRelatedProducts(related);
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    cartPopupBus.show(product, quantity);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    navigate('/cart');
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  if (loading || !product) {
    return <Loader fullPage category={product?.category} label="Loading product…" />;
  }

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Product Section */}
        <motion.div
          className="product-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
              {product.discount && (
                <div className="discount-badge">{product.discount}% OFF</div>
              )}
            </div>
            <div className="thumbnail-images">
              <img
                src={product.image}
                alt="thumbnail"
                className="thumbnail active"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="brand">{product.brand}</p>

            {/* Rating */}
            <div className="rating-section">
              <div className="stars">
                ⭐ {product.rating}
                <span className="reviews">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="price-section">
              <span className="current-price">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="original-price">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="savings">
                    Save {formatCurrency(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="stock-info">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* Quantity */}
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                />
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="action-buttons">
              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Add to Cart
              </Button>
              <Button
                variant="outline-primary"
                size="large"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
              <motion.button
                className="wishlist-large"
                onClick={handleWishlist}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ❤️ Wishlist
              </motion.button>
            </div>

            {/* Features */}
            <div className="features">
              <div className="feature">
                <span>🚚</span>
                <div>
                  <strong>Free Shipping</strong>
                  <p>On orders over $100</p>
                </div>
              </div>
              <div className="feature">
                <span>🔄</span>
                <div>
                  <strong>30-Day Returns</strong>
                  <p>No questions asked</p>
                </div>
              </div>
              <div className="feature">
                <span>🛡️</span>
                <div>
                  <strong>Secure Checkout</strong>
                  <p>SSL encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Specifications */}
        <motion.div
          className="specifications-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Specifications</h2>
          <div className="specs-grid">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="spec-item">
                <span className="spec-label">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="spec-value">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          className="description-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>Description</h2>
          <p>{product.description}</p>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            className="related-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2>Related Products</h2>
            <div className="related-grid">
              {relatedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
