import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';
import { orderService } from '../../services/orderService';
import Button from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './Checkout.css';

const TAX_RATE = 0.10;
const SHIPPING_COST = 10;
const PAYMENT_WINDOW_SECONDS = 20 * 60;

const getSavedAddress = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(`saved-address-${userId}`)) || {};
  } catch {
    return {};
  }
};

const formatCountdown = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

const DemoQrCode = () => (
  <div className="demo-qr" role="img" aria-label="Demo UPI QR code">
    {Array.from({ length: 121 }, (_, index) => <i key={index} className={(index % 11 < 3 && Math.floor(index / 11) < 3) || (index % 11 > 7 && Math.floor(index / 11) < 3) || (index % 11 < 3 && Math.floor(index / 11) > 7) || (index * 7 + Math.floor(index / 11) * 3) % 5 === 0 ? 'dark' : ''} />)}
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const defaultAddress = user?.addresses?.find((address) => address.default) || {};
  const savedAddress = getSavedAddress(user?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const [paymentTimeLeft, setPaymentTimeLeft] = useState(PAYMENT_WINDOW_SECONDS);
  const [upiExpired, setUpiExpired] = useState(false);
  const [formData, setFormData] = useState({
    fullName: savedAddress.fullName || user?.name || '', street: savedAddress.street || defaultAddress.street || '', city: savedAddress.city || defaultAddress.city || '', state: savedAddress.state || defaultAddress.state || '', zipCode: savedAddress.zipCode || defaultAddress.zipCode || '', country: savedAddress.country || defaultAddress.country || '', paymentMethod: 'cash_on_delivery', cardName: '', cardNumber: '', expiry: '', cvv: '', upiId: ''
  });
  const tax = useMemo(() => totalPrice * TAX_RATE, [totalPrice]);
  const total = totalPrice + tax + SHIPPING_COST;

  useEffect(() => {
    if (formData.paymentMethod !== 'upi' || upiExpired) return undefined;
    const timer = window.setInterval(() => setPaymentTimeLeft((time) => {
      if (time <= 1) { window.clearInterval(timer); setUpiExpired(true); return 0; }
      return time - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [formData.paymentMethod, upiExpired]);

  const updateField = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  const choosePayment = (event) => {
    updateField(event);
    if (event.target.value === 'upi') { setPaymentTimeLeft(PAYMENT_WINDOW_SECONDS); setUpiExpired(false); }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!items.length) return navigate('/cart');
    if (formData.paymentMethod === 'upi' && upiExpired) { setError('The UPI QR code has expired. Select UPI again to generate a new code.'); return; }
    setError(''); setLoading(true);
    try {
      const { fullName, street, city, state, zipCode, country } = formData;
      const shippingAddress = { fullName, street, city, state, zipCode, country };
      if (saveAddress) localStorage.setItem(`saved-address-${user?.id}`, JSON.stringify(shippingAddress));
      const result = await orderService.createOrder({ userId: user?.id, items, subtotal: totalPrice, tax, shipping: SHIPPING_COST, total, paymentMethod: formData.paymentMethod, shippingAddress });
      if (!result.success) throw new Error(result.message || 'Unable to place your order.');
      dispatch(clearCart()); setOrder(result.order);
    } catch (submissionError) { setError(submissionError.message || 'Unable to place your order. Please try again.'); } finally { setLoading(false); }
  };

  if (order) {
    const delivery = order.estimatedDeliveryDate ? formatDate(order.estimatedDeliveryDate) : 'within 3–5 business days';
    return <section className="checkout-page"><div className="container checkout-confirmation"><div className="confirmation-icon" aria-hidden="true">✓</div><h1>Order placed successfully</h1><p>Order <strong>{order.id}</strong> is confirmed. Estimated delivery: <strong>{delivery}</strong>.</p><div className="tracking-card"><h2>Track your delivery</h2><p><strong>Tracking ID:</strong> {order.trackingNumber}</p><ol className="tracking-timeline"><li className="complete"><strong>Order confirmed</strong><span>We received your order.</span></li><li className="active"><strong>Preparing your order</strong><span>Your items will be packed shortly.</span></li><li><strong>Out for delivery</strong><span>The courier will notify you when the parcel is on its way.</span></li><li><strong>Delivered</strong><span>Expected by {delivery}.</span></li></ol></div><Button size="large" onClick={() => navigate('/products')}>Continue Shopping</Button></div></section>;
  }
  if (!items.length) return <section className="checkout-page"><div className="container checkout-empty"><h1>Your cart is empty</h1><p>Add products before continuing to checkout.</p><Link to="/products">Browse Products</Link></div></section>;

  return <section className="checkout-page"><div className="container"><h1>Checkout</h1><div className="checkout-layout"><form className="checkout-form" onSubmit={handleSubmit}>
    <section><h2>Delivery Address</h2><div className="checkout-fields"><label>Full name<input name="fullName" value={formData.fullName} onChange={updateField} required /></label><label>Street address<input name="street" value={formData.street} onChange={updateField} required /></label><label>City<input name="city" value={formData.city} onChange={updateField} required /></label><label>State / Province<input name="state" value={formData.state} onChange={updateField} required /></label><label>ZIP / Postal code<input name="zipCode" value={formData.zipCode} onChange={updateField} required /></label><label>Country<input name="country" value={formData.country} onChange={updateField} required /></label></div><label className="save-address"><input type="checkbox" checked={saveAddress} onChange={(event) => setSaveAddress(event.target.checked)} /> Save this address for my next order</label></section>
    <section><h2>Payment Method</h2><label className="payment-option"><input type="radio" name="paymentMethod" value="cash_on_delivery" checked={formData.paymentMethod === 'cash_on_delivery'} onChange={choosePayment} /> Cash on delivery</label><label className="payment-option"><input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={choosePayment} /> Credit / Debit Card (demo)</label><label className="payment-option"><input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={choosePayment} /> UPI (demo)</label>
      {formData.paymentMethod === 'card' && <div className="payment-details"><p>Demo only — never enter a real card number.</p><div className="checkout-fields"><label>Name on card<input name="cardName" value={formData.cardName} onChange={updateField} required /></label><label>Card number<input name="cardNumber" inputMode="numeric" maxLength="19" placeholder="4242 4242 4242 4242" value={formData.cardNumber} onChange={updateField} required /></label><label>Expiry<input name="expiry" placeholder="MM/YY" maxLength="5" value={formData.expiry} onChange={updateField} required /></label><label>CVV<input name="cvv" inputMode="numeric" maxLength="4" type="password" value={formData.cvv} onChange={updateField} required /></label></div></div>}
      {formData.paymentMethod === 'upi' && <div className="upi-panel">{upiExpired ? <p className="checkout-error">QR code expired. Select UPI again to refresh it.</p> : <><DemoQrCode /><div><strong>Scan with any UPI app</strong><p>Pay {formatCurrency(total)} to ShopSphere Demo</p><p className="payment-timer">Code expires in {formatCountdown(paymentTimeLeft)}</p></div><label className="upi-id">UPI ID (demo)<input name="upiId" placeholder="name@upi" value={formData.upiId} onChange={updateField} required /></label></>}</div>}
    </section>{error && <p className="checkout-error" role="alert">{error}</p>}<Button type="submit" size="large" fullWidth loading={loading}>Place Order — {formatCurrency(total)}</Button></form>
    <aside className="checkout-summary"><h2>Order Summary</h2>{items.map((item) => <div className="checkout-item" key={item.id}><span>{item.name} × {item.quantity}</span><strong>{formatCurrency(item.price * item.quantity)}</strong></div>)}<div className="checkout-total"><span>Subtotal</span><span>{formatCurrency(totalPrice)}</span></div><div className="checkout-total"><span>Tax (10%)</span><span>{formatCurrency(tax)}</span></div><div className="checkout-total"><span>Shipping</span><span>{formatCurrency(SHIPPING_COST)}</span></div><div className="checkout-total checkout-grand-total"><strong>Total</strong><strong>{formatCurrency(total)}</strong></div></aside>
  </div></div></section>;
};

export default Checkout;
