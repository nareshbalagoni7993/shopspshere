import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cartPopupBus } from '../../services/cartPopupBus';
import { formatCurrency } from '../../utils/helpers';
import { getCategoryIcon } from '../../constants';
import './CartAddedPopup.css';

const AUTO_DISMISS_MS = 4500;

const CartAddedPopup = () => {
  const [entry, setEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => cartPopupBus.subscribe(setEntry), []);

  useEffect(() => {
    if (!entry) return undefined;
    const timer = window.setTimeout(() => cartPopupBus.hide(), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [entry]);

  const goToCart = () => {
    cartPopupBus.hide();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {entry && (
        <>
          <motion.div
            className="cart-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => cartPopupBus.hide()}
          />
          <motion.div
            className="cart-popup"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <button className="cart-popup-close" onClick={() => cartPopupBus.hide()} aria-label="Close">✕</button>

            <div className="cart-popup-check">✓</div>
            <h3>Added to Cart!</h3>

            <div className="cart-popup-product">
              <div className="cart-popup-thumb">
                <img src={entry.product.image} alt={entry.product.name} />
                <span className="cart-popup-cat" title={entry.product.category}>
                  {getCategoryIcon(entry.product.category)}
                </span>
              </div>
              <div>
                <strong>{entry.product.name}</strong>
                <p>Qty {entry.quantity} · {formatCurrency(entry.product.price * entry.quantity)}</p>
              </div>
            </div>

            <div className="cart-popup-actions">
              <button className="cart-popup-secondary" onClick={() => cartPopupBus.hide()}>
                Continue Shopping
              </button>
              <button className="cart-popup-primary" onClick={goToCart}>
                View Cart
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartAddedPopup;
