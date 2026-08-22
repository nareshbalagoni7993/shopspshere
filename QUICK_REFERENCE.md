# ShopSphere - Quick Reference Guide

## 🚀 Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
```

Access at: `http://localhost:5173/`

---

## 📍 Key Routes

### User Routes
- `/` - Home page
- `/products` - Products listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/login` - Login page
- `/register` - Register page
- `/wishlist` - Wishlist (ready)

### Admin Routes
- `/admin` - Admin dashboard

---

## 🔐 Demo Credentials
- **Email:** john@example.com
- **Password:** password123

---

## 📦 Redux State Structure

```javascript
// Access in any component
const cart = useSelector(state => state.cart);
const wishlist = useSelector(state => state.wishlist);
const auth = useSelector(state => state.auth);
const notifications = useSelector(state => state.notifications);
```

---

## 🎯 Common Actions

### Add to Cart
```javascript
import { addToCart } from '../store/slices/cartSlice';

dispatch(addToCart({ product, quantity: 1 }));
```

### Toggle Wishlist
```javascript
import { toggleWishlist } from '../store/slices/wishlistSlice';

dispatch(toggleWishlist(product));
```

### Login
```javascript
import { loginSuccess } from '../store/slices/authSlice';

dispatch(loginSuccess({ user, token }));
```

### Add Notification
```javascript
import { addNotification } from '../store/slices/notificationsSlice';

dispatch(addNotification({ 
  type: 'success', 
  message: 'Added to cart!' 
}));
```

---

## 🛠️ Common Components

### Button
```jsx
<Button 
  variant="primary"    // primary, secondary, outline, outline-primary
  size="large"         // small, medium, large
  fullWidth            // true/false
  loading              // true/false
  disabled             // true/false
  onClick={handler}
>
  Click Me
</Button>
```

### Input
```jsx
<Input
  type="text"          // text, email, password, tel, number
  name="fieldName"
  label="Field Label"
  placeholder="Enter value"
  value={value}
  onChange={handler}
  icon="📧"            // Any emoji
  required             // true/false
  disabled             // true/false
  error="Error msg"    // Show error
/>
```

### Card
```jsx
<Card>
  Content here
</Card>
```

### Modal
```jsx
<Modal
  isOpen={isOpen}
  title="Modal Title"
  onClose={handleClose}
>
  Content here
</Modal>
```

---

## 🎨 Colors & Styling

### CSS Variables
```css
--primary: #667eea
--secondary: #764ba2
--text: #333
--text-light: #999
--border: #ddd
--background: #f9f9f9
```

Use in CSS:
```css
.component {
  background: var(--primary);
  color: var(--text);
}
```

---

## 📊 Adding Data

### Add Mock Product
```javascript
// src/mock/mockProducts.js
{
  id: 13,
  name: "Product Name",
  price: 99.99,
  discount: 20,
  image: "/images/product.jpg",
  category: "Electronics",
  rating: 4.5,
  reviews: 120,
  stock: 50,
  description: "Product description",
  specifications: {
    brand: "Brand Name",
    model: "Model X",
    color: "Black"
  }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 425px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1280px) { }
```

---

## 🔄 Data Flow

```
Component 
  ↓
useDispatch() / useSelector()
  ↓
Redux Store (slices)
  ↓
Actions/Reducers
  ↓
localStorage (persistence)
```

---

## 🧪 Testing

```javascript
// Check component renders
render(<MyComponent />);
expect(screen.getByText('text')).toBeInTheDocument();

// Simulate clicks
fireEvent.click(screen.getByRole('button'));

// Check Redux state
const state = store.getState();
expect(state.cart.items).toHaveLength(1);
```

---

## 🚫 Common Mistakes to Avoid

❌ Don't mutate state directly in Redux
✅ Use immer (included in Redux Toolkit)

❌ Don't forget to add dependencies to useEffect
✅ Always include them

❌ Don't use inline styles
✅ Use CSS classes instead

❌ Don't repeat component code
✅ Extract to separate components

❌ Don't forget to handle loading states
✅ Show loading spinners/skeletons

---

## 📚 File Locations

```
Common Components     → src/components/common/
User Components      → src/components/user/
Admin Components     → src/components/admin/

User Pages          → src/pages/user/
Admin Pages         → src/pages/admin/

Redux Slices        → src/store/slices/
Mock Data           → src/mock/
Services            → src/services/
Styles              → src/styles/ or [component].css
```

---

## 🔗 Important Functions

### Format Currency
```javascript
import { formatCurrency } from '../utils/helpers';
formatCurrency(99.99)  // Returns: $99.99
```

### Format Date
```javascript
import { formatDate } from '../utils/helpers';
formatDate(new Date())  // Returns: January 15, 2024
```

### Format Relative Time
```javascript
import { formatRelativeTime } from '../utils/helpers';
formatRelativeTime(pastDate)  // Returns: 2 hours ago
```

---

## 💾 Persistence

Data automatically saved to localStorage:
- Cart items
- Wishlist items
- Auth token (during session)

Clear with:
```javascript
localStorage.clear();
// or specific:
localStorage.removeItem('cart');
```

---

## 🆘 Getting Help

1. Check README.md for overview
2. Check DEVELOPMENT_GUIDE.md for detailed help
3. Check PROJECT_CHECKLIST.md for features
4. Inspect Redux state with Redux DevTools
5. Check browser console for errors
6. Check network tab for API issues

---

## 📞 Useful Resources

- React Docs: https://react.dev
- Redux Toolkit: https://redux-toolkit.js.org
- React Router: https://reactrouter.com
- Framer Motion: https://www.framer.com/motion
- Recharts: https://recharts.org

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
