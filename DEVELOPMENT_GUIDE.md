# ShopSphere Development Guide

## 🎯 Getting Started as a Developer

### Prerequisites
- Node.js 16+ (Recommended: 18+)
- npm or yarn
- VS Code or similar IDE
- Git
- Basic React knowledge

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd Feature-updates

# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5173/
```

---

## 📁 Folder Structure Guide

### src/components/
**Purpose:** Reusable UI components

#### common/
- **Header.jsx** - Main navigation
- **Footer.jsx** - Footer section
- **Button.jsx** - Reusable button (use this instead of `<button>`)
- **Input.jsx** - Form input field (use this instead of `<input>`)
- **Card.jsx** - Card wrapper
- **Modal.jsx** - Modal dialog
- **Loader.jsx** - Loading spinner
- **EmptyState.jsx** - Empty state display
- **NotFound.jsx** - 404 page

**Usage Example:**
```jsx
import Button from '../components/common/Button';
import Input from '../components/common/Input';

<Button variant="primary" size="large" onClick={handleClick}>
  Click Me
</Button>

<Input 
  type="text" 
  label="Email" 
  placeholder="Enter email"
  value={value}
  onChange={handleChange}
/>
```

#### user/
- **ProductCard.jsx** - Product grid/list card

#### admin/
- Ready for admin-specific components

### src/pages/
**Purpose:** Page-level components (one per route)

#### user/
- **Home.jsx** - Homepage (`/`)
- **Products.jsx** - Products listing (`/products`)
- **ProductDetails.jsx** - Product details (`/products/:id`)
- **Cart.jsx** - Shopping cart (`/cart`)
- **Login.jsx** - Login page (`/login`)
- **Register.jsx** - Registration page (`/register`)

#### admin/
- **Dashboard.jsx** - Admin dashboard (`/admin`)

### src/services/
**Purpose:** Data layer (API or mock calls)

```javascript
// Example: services/productService.js
const productService = {
  getAll: async () => { ... },
  getById: async (id) => { ... },
  search: async (query) => { ... },
  getByCategory: async (category) => { ... }
};
```

**Key Feature:** Services are abstracted, allowing easy backend integration:

```javascript
// BEFORE: Mock data
export const productService = {
  getAll: async () => {
    // Return mock data
    return mockProducts;
  }
};

// AFTER: Real API
export const productService = {
  getAll: async () => {
    // Call real API
    const response = await axios.get('/api/products');
    return response.data;
  }
};
```

### src/store/
**Purpose:** Redux state management

```
store/
├── index.js          // Store configuration
└── slices/
    ├── authSlice.js
    ├── cartSlice.js
    ├── wishlistSlice.js
    └── notificationsSlice.js
```

**Usage in Components:**
```jsx
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  
  const handleAddCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };
}
```

### src/utils/
**Purpose:** Utility functions

```javascript
// helpers.js
export const formatCurrency = (value) => {...}
export const formatDate = (date) => {...}
export const validateEmail = (email) => {...}
// etc.
```

### src/mock/
**Purpose:** Mock data for development

```javascript
// mockProducts.js - 12 sample products
// mockCategories.js - 6 categories
// mockUsers.js - User data
// mockOrders.js - Order samples
// mockNotifications.js - Notifications
```

---

## 🚀 How to Add New Features

### 1. Add a New Page

```javascript
// src/pages/user/MyNewPage.jsx
import React from 'react';
import './MyNewPage.css';

const MyNewPage = () => {
  return (
    <div className="my-new-page">
      <h1>My New Page</h1>
    </div>
  );
};

export default MyNewPage;
```

```css
/* src/pages/user/MyNewPage.css */
.my-new-page {
  min-height: 100vh;
  padding: 2rem;
}
```

Add route in `App.jsx`:
```jsx
import MyNewPage from './pages/user/MyNewPage';

// In Routes:
<Route path="/my-new-page" element={<MyNewPage />} />
```

### 2. Add a New Component

```javascript
// src/components/common/MyComponent.jsx
import React from 'react';
import './MyComponent.css';

const MyComponent = ({ prop1, prop2, onClick }) => {
  return (
    <div className="my-component">
      {prop1}
    </div>
  );
};

export default MyComponent;
```

### 3. Add Redux State

Edit `src/store/slices/mySlice.js`:
```javascript
import { createSlice } from '@reduxjs/toolkit';

const mySlice = createSlice({
  name: 'myState',
  initialState: {
    items: [],
    loading: false
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    }
  }
});

export const { addItem } = mySlice.actions;
export default mySlice.reducer;
```

Register in `src/store/index.js`:
```javascript
import myReducer from './slices/mySlice';

const store = configureStore({
  reducer: {
    // ... existing slices
    myState: myReducer
  }
});
```

### 4. Add a Service

```javascript
// src/services/myService.js
import { mockData } from '../mock/mockData';

export const myService = {
  getAll: async () => {
    // Mock: return mockData.items
    // Real: return axios.get('/api/items')
    return mockData.items;
  },
  
  getById: async (id) => {
    return mockData.items.find(item => item.id === id);
  },
  
  create: async (data) => {
    // Mock: push to array
    // Real: axios.post('/api/items', data)
    mockData.items.push(data);
    return data;
  }
};
```

---

## 🎨 Styling Best Practices

### Use CSS Variables
```css
/* In global.css */
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --text: #333;
  --spacing: 1rem;
}

/* In component.css */
.component {
  background: var(--primary);
  color: var(--text);
  padding: var(--spacing);
}
```

### Mobile-First Approach
```css
.component {
  /* Mobile styles first */
  font-size: 1rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  /* Tablet and up */
  .component {
    font-size: 1.2rem;
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  /* Desktop and up */
  .component {
    font-size: 1.5rem;
  }
}
```

### Responsive Breakpoints
- 320px - Mobile
- 375px - Mobile
- 425px - Mobile
- 768px - Tablet
- 1024px - Desktop
- 1280px - Large Desktop
- 1920px - Full HD

---

## 🔗 Backend Integration Guide

### Step 1: Set Up Environment Variables
```env
# .env
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your_api_key
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

### Step 2: Update Services
Before:
```javascript
// Mock data
export const productService = {
  getAll: () => mockProducts
};
```

After:
```javascript
// Real API
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productService = {
  getAll: async () => {
    const { data } = await API.get('/products');
    return data;
  },
  
  getById: async (id) => {
    const { data } = await API.get(`/products/${id}`);
    return data;
  }
};
```

### Step 3: Handle Loading & Errors
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../store/slices/authSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  
  const handleLogin = async (email, password) => {
    try {
      dispatch(startLoading());
      const response = await authService.login(email, password);
      // Success
    } catch (err) {
      // Error handling
    } finally {
      dispatch(stopLoading());
    }
  };
}
```

---

## 🧪 Testing Guidelines

### Component Testing
```javascript
// src/components/__tests__/Button.test.jsx
import { render, screen } from '@testing-library/react';
import Button from '../Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Service Testing
```javascript
// Mock API calls in tests
jest.mock('axios');
```

---

## 📊 Common Patterns

### Data Fetching Pattern
```javascript
function MyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await myService.getAll();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  
  return <div>{/* render data */}</div>;
}
```

### Form Handling Pattern
```javascript
import { useState } from 'react';

function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate
    // Submit
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
    </form>
  );
}
```

---

## 🐛 Debugging Tips

### Redux DevTools
```bash
npm install @redux-devtools/extension
```

In `store/index.js`:
```javascript
import { composeWithDevTools } from '@redux-devtools/extension';

const store = configureStore({
  reducer: { ... },
  enhancers: [composeWithDevTools()]
});
```

### React DevTools
Install React Developer Tools browser extension for component inspection.

### Console Logging
```javascript
// Log Redux state
const state = useSelector(state => state);
console.log('State:', state);

// Log component props
console.log('Props:', props);
```

---

## 📚 Useful Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview build

# Linting (if configured)
npm run lint         # Run linter

# Testing (if configured)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

---

## 🤝 Code Style Guide

### Naming Conventions
- Components: PascalCase (MyComponent.jsx)
- Functions: camelCase (myFunction)
- Constants: UPPER_SNAKE_CASE (MAX_ITEMS)
- CSS Classes: kebab-case (.my-component)
- Files: Match component names

### Component Structure
```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import './MyComponent.css';

// Imports at top
// Styles below imports

const MyComponent = ({ prop1, prop2 }) => {
  // Hooks
  const dispatch = useDispatch();
  const data = useSelector(state => state.data);
  
  // State
  const [local, setLocal] = useState(null);
  
  // Effects
  useEffect(() => {
    // Setup
  }, []);
  
  // Handlers
  const handleClick = () => {
    // Handle
  };
  
  // Render
  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

---

## 💡 Performance Tips

1. **Use Lazy Loading for Routes**
```javascript
import { lazy, Suspense } from 'react';

const MyComponent = lazy(() => import('./MyComponent'));

<Suspense fallback={<Loader />}>
  <MyComponent />
</Suspense>
```

2. **Memoize Components**
```javascript
export default React.memo(MyComponent);
```

3. **Use useCallback for event handlers**
```javascript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

4. **Optimize Re-renders**
```javascript
// Use selectors to select only needed state
const specificData = useSelector(state => state.specific);
```

---

## 📞 Support & Resources

- React Docs: https://react.dev
- Redux Docs: https://redux.js.org
- React Router: https://reactrouter.com
- Framer Motion: https://www.framer.com/motion
- Recharts: https://recharts.org

---

**Happy Coding! 🚀**
