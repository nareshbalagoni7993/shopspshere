import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  removeFromCart,
  updateQuantity,
  clearCart
} from '../../store/slices/cartSlice';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/helpers';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  const TAX_RATE = 0.10;
  const SHIPPING_COST = 10;

  const tax = totalPrice * TAX_RATE;
  const total = totalPrice + tax + SHIPPING_COST;

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            message="Add some products to get started!"
            action={{
              label: 'Continue Shopping',
              onClick: () => navigate('/products')
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className="cart-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <img src={item.image} alt={item.name} />

                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                  <p className="item-price">{formatCurrency(item.price)}</p>
                </div>

                <div className="quantity-control">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    min="1"
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  {formatCurrency(item.price * item.quantity)}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.id)}
                >
                  🗑️
                </button>
              </motion.div>
            ))}

            <motion.button
              className="clear-cart-btn"
              onClick={() => dispatch(clearCart())}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Cart
            </motion.button>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>

            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{formatCurrency(SHIPPING_COST)}</span>
            </div>

            <div className="summary-row discount">
              <span>Discount</span>
              <span>-{formatCurrency(0)}</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleCheckout}
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Button>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
