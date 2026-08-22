import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';

const categories = [
  { name: 'Electronics', icon: '📱', image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=400&h=400&fit=crop', productCount: 245 },
  { name: 'Fashion', icon: '👗', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=400&fit=crop', productCount: 567 },
  { name: 'Home', icon: '🏠', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', productCount: 342 },
  { name: 'Sports', icon: '⚽', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop', productCount: 189 },
  { name: 'Wearables', icon: '⌚', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', productCount: 156 },
  { name: 'Books', icon: '📚', image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=400&fit=crop', productCount: 421 }
];

const products = [
  { name: 'Premium Wireless Headphones', price: 299.99, originalPrice: 399.99, discount: 25, rating: 4.8, reviews: 342, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', category: 'Electronics', brand: 'AudioPro', stock: 45, description: 'High-quality wireless headphones with noise cancellation technology', specifications: { batteryLife: '40 hours', connectivity: 'Bluetooth 5.0', weight: '250g', warranty: '2 years' } },
  { name: 'Smart Watch Pro', price: 199.99, originalPrice: 299.99, discount: 33, rating: 4.6, reviews: 256, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', category: 'Wearables', brand: 'TechGear', stock: 30, description: 'Advanced smartwatch with health tracking and notifications', specifications: { display: 'AMOLED', batteryLife: '14 days', waterResistant: '5ATM', warranty: '1 year' } },
  { name: 'Premium Backpack', price: 79.99, originalPrice: 129.99, discount: 38, rating: 4.7, reviews: 512, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', category: 'Fashion', brand: 'TravelMax', stock: 120, description: 'Durable and stylish backpack for travel and daily use', specifications: { capacity: '35L', material: 'Waterproof nylon', warranty: 'Lifetime', compartments: 'Multiple' } },
  { name: 'Running Shoes Ultra', price: 129.99, originalPrice: 179.99, discount: 28, rating: 4.9, reviews: 634, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', category: 'Fashion', brand: 'SportStyle', stock: 85, description: 'Lightweight running shoes with superior comfort technology', specifications: { material: 'Mesh and foam', weight: '180g', sizes: '6-14', warranty: '1 year' } },
  { name: 'USB-C Charging Hub', price: 49.99, originalPrice: 79.99, discount: 37, rating: 4.5, reviews: 178, image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop', category: 'Electronics', brand: 'ConnectTech', stock: 200, description: 'Multi-port charging hub with fast charging support', specifications: { ports: '7 ports', output: '100W', compatibility: 'Universal', warranty: '2 years' } },
  { name: 'Laptop Stand Adjustable', price: 39.99, originalPrice: 69.99, discount: 43, rating: 4.6, reviews: 289, image: 'https://images.unsplash.com/photo-1591290621749-8e20f8e90b48?w=400&h=400&fit=crop', category: 'Electronics', brand: 'ErgoWorx', stock: 95, description: 'Ergonomic laptop stand for comfortable working', specifications: { material: 'Aluminum', maxWeight: '15kg', adjustable: 'Yes', warranty: '1 year' } },
  { name: 'Premium T-Shirt', price: 29.99, originalPrice: 49.99, discount: 40, rating: 4.4, reviews: 421, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', category: 'Fashion', brand: 'StyleLabel', stock: 300, description: 'Comfortable premium cotton t-shirt', specifications: { material: '100% Cotton', sizes: 'XS-XXL', care: 'Machine wash', warranty: 'N/A' } },
  { name: 'Wireless Mouse', price: 34.99, originalPrice: 59.99, discount: 42, rating: 4.5, reviews: 367, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', category: 'Electronics', brand: 'ClickTech', stock: 150, description: 'Precision wireless mouse with ergonomic design', specifications: { dpi: '3200', batteryLife: '18 months', connectivity: '2.4GHz', warranty: '1 year' } },
  { name: 'Designer Sunglasses', price: 89.99, originalPrice: 159.99, discount: 44, rating: 4.7, reviews: 298, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', category: 'Fashion', brand: 'StylePro', stock: 60, description: 'Stylish UV protection sunglasses', specifications: { material: 'Polycarbonate', uv: '100% UV protection', styles: 'Multiple', warranty: '2 years' } },
  { name: 'Portable Speaker', price: 59.99, originalPrice: 99.99, discount: 40, rating: 4.6, reviews: 445, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', category: 'Electronics', brand: 'SoundMax', stock: 75, description: 'Powerful portable Bluetooth speaker', specifications: { power: '20W', batteryLife: '12 hours', connectivity: 'Bluetooth 5.0', warranty: '1 year' } },
  { name: 'Yoga Mat Premium', price: 44.99, originalPrice: 79.99, discount: 44, rating: 4.8, reviews: 523, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop', category: 'Sports', brand: 'ZenFlow', stock: 110, description: 'Non-slip yoga mat with carrying strap', specifications: { material: 'TPE', thickness: '6mm', size: '183x61cm', warranty: '1 year' } },
  { name: 'Coffee Maker Smart', price: 139.99, originalPrice: 199.99, discount: 30, rating: 4.5, reviews: 389, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=400&fit=crop', category: 'Home', brand: 'BrewMaster', stock: 40, description: 'Smart coffee maker with app control', specifications: { capacity: '1.5L', power: '1000W', smart: 'WiFi enabled', warranty: '2 years' } }
];

// Demo password for every seeded account: password123
const users = [
  { name: 'John Doe', email: 'john@example.com', mobile: '+1 234-567-8900', password: 'password123', role: 'user', addresses: [{ type: 'home', street: '123 Main Street', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA', default: true }] },
  { name: 'Jane Smith', email: 'jane@example.com', mobile: '+1 234-567-8901', password: 'password123', role: 'user' },
  { name: 'Admin User', email: 'admin@example.com', mobile: '+1 234-567-8902', password: 'password123', role: 'admin' },
  { name: 'Michael Johnson', email: 'michael@example.com', mobile: '+1 234-567-8903', password: 'password123', role: 'user', status: 'inactive' },
  { name: 'Sarah Williams', email: 'sarah@example.com', mobile: '+1 234-567-8904', password: 'password123', role: 'user' }
];

const run = async () => {
  await connectDB();

  if (process.argv.includes('--destroy')) {
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Category.deleteMany(),
      Order.deleteMany(),
      Notification.deleteMany()
    ]);
    console.log('All collections cleared.');
    await mongoose.disconnect();
    process.exit(0);
  }

  await Promise.all([
    User.deleteMany(),
    Product.deleteMany(),
    Category.deleteMany(),
    Order.deleteMany(),
    Notification.deleteMany()
  ]);

  await Category.insertMany(categories);
  const createdProducts = await Product.insertMany(products);

  const createdUsers = [];
  for (const userData of users) {
    createdUsers.push(
      await User.create({ ...userData, avatar: `https://i.pravatar.cc/150?u=${userData.email}` })
    );
  }
  const john = createdUsers[0];

  const findProduct = (name) => createdProducts.find((p) => p.name === name);

  await Order.insertMany([
    {
      orderNumber: 'ORD-000001',
      user: john._id,
      orderDate: new Date('2024-08-15'),
      status: 'delivered',
      items: [
        { product: findProduct('Premium Wireless Headphones')._id, name: 'Premium Wireless Headphones', quantity: 1, price: 299.99, image: findProduct('Premium Wireless Headphones').image },
        { product: findProduct('Premium Backpack')._id, name: 'Premium Backpack', quantity: 2, price: 79.99, image: findProduct('Premium Backpack').image }
      ],
      subtotal: 459.97,
      tax: 45.0,
      shipping: 10.0,
      total: 514.97,
      paymentMethod: 'credit_card',
      paymentStatus: 'completed',
      shippingAddress: { name: 'John Doe', street: '123 Main Street', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
      trackingNumber: 'TRACK123456',
      deliveredDate: new Date('2024-08-20')
    },
    {
      orderNumber: 'ORD-000002',
      user: john._id,
      orderDate: new Date('2024-08-18'),
      status: 'processing',
      items: [{ product: findProduct('Running Shoes Ultra')._id, name: 'Running Shoes Ultra', quantity: 1, price: 129.99, image: findProduct('Running Shoes Ultra').image }],
      subtotal: 129.99,
      tax: 12.0,
      shipping: 0.0,
      total: 141.99,
      paymentMethod: 'debit_card',
      paymentStatus: 'completed',
      shippingAddress: { name: 'John Doe', street: '123 Main Street', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
      trackingNumber: 'TRACK789012'
    },
    {
      orderNumber: 'ORD-000003',
      user: john._id,
      orderDate: new Date('2024-08-20'),
      status: 'pending',
      items: [{ product: findProduct('Smart Watch Pro')._id, name: 'Smart Watch Pro', quantity: 1, price: 199.99, image: findProduct('Smart Watch Pro').image }],
      subtotal: 199.99,
      tax: 19.0,
      shipping: 5.0,
      total: 223.99,
      paymentMethod: 'wallet',
      paymentStatus: 'pending',
      shippingAddress: { name: 'John Doe', street: '123 Main Street', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' }
    }
  ]);

  await Notification.insertMany([
    { user: john._id, type: 'order_confirmed', title: 'Order Confirmed', message: 'Your order #ORD-000001 has been confirmed', icon: '✓', read: false, actionUrl: '/orders/ORD-000001' },
    { user: john._id, type: 'order_shipped', title: 'Order Shipped', message: 'Your order #ORD-000001 has been shipped', icon: '📦', read: false, actionUrl: '/orders/ORD-000001' },
    { user: john._id, type: 'order_delivered', title: 'Order Delivered', message: 'Your order #ORD-000001 has been delivered successfully', icon: '🎉', read: true, actionUrl: '/orders/ORD-000001' },
    { user: john._id, type: 'promotion', title: 'Special Offer', message: 'Get 40% off on all electronics this weekend', icon: '🎁', read: true, actionUrl: '/products?category=electronics' }
  ]);

  console.log('Database seeded successfully.');
  console.log('Demo login: john@example.com / password123 (user), admin@example.com / password123 (admin)');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
