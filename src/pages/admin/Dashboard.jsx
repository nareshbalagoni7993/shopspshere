import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import { mockOrders } from '../../mock/mockOrders';
import { mockProducts } from '../../mock/mockProducts';
import { mockCategories } from '../../mock/mockCategories';
import { formatCurrency } from '../../utils/helpers';
import './AdminDashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const orderStats = await orderService.getOrderStats();
        const userStatsData = await userService.getUserStats();
        setStats(orderStats);
        setUserStats(userStatsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 19000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 18000 },
    { month: 'Jun', revenue: 25000 }
  ];

  const orderStatusData = [
    { name: 'Delivered', value: stats?.completedOrders || 0 },
    { name: 'Pending', value: stats?.pendingOrders || 0 },
    { name: 'Cancelled', value: stats?.cancelledOrders || 0 }
  ];
  const ordersTrendData = revenueData.map((entry, index) => ({ month: entry.month, orders: 18 + index * 7 }));
  const userGrowthData = revenueData.map((entry, index) => ({ month: entry.month, users: 90 + index * 24 }));
  const topProductsData = mockProducts.slice(0, 5).map((product, index) => ({ name: product.name.slice(0, 12), sales: 85 - index * 11 }));
  const categorySalesData = mockCategories.map((category, index) => ({ name: category.name, value: 30 + index * 15 }));

  const COLORS = ['#28a745', '#ffc107', '#f44336'];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-value">{userStats?.totalUsers || 0}</p>
              <small className="stat-sub">{userStats?.activeUsers} active</small>
            </div>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <div className="stat-icon">🏷️</div><div className="stat-content"><h3>Total Products</h3><p className="stat-value">{mockProducts.length}</p><small className="stat-sub">Across all categories</small></div>
          </motion.div>
          <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="stat-icon">✅</div><div className="stat-content"><h3>Completed Orders</h3><p className="stat-value">{stats?.completedOrders || 0}</p><small className="stat-sub">Successfully delivered</small></div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats?.totalOrders || 0}</p>
              <small className="stat-sub">{stats?.completedOrders} completed</small>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-value">{formatCurrency(stats?.totalRevenue || 0)}</p>
              <small className="stat-sub">From completed orders</small>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Orders</h3>
              <p className="stat-value">{stats?.pendingOrders || 0}</p>
              <small className="stat-sub">Awaiting processing</small>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3>Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#667eea"
                  strokeWidth={2}
                  dot={{ fill: '#667eea', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><h3>Orders Trend</h3><ResponsiveContainer width="100%" height={300}><BarChart data={ordersTrendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="orders" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></motion.div>
          <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><h3>User Growth</h3><ResponsiveContainer width="100%" height={300}><LineChart data={userGrowthData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={2} /></LineChart></ResponsiveContainer></motion.div>
          <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><h3>Top Products</h3><ResponsiveContainer width="100%" height={300}><BarChart data={topProductsData} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={100} /><Tooltip /><Bar dataKey="sales" fill="#f97316" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></motion.div>
          <motion.div className="chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><h3>Category Sales</h3><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={categorySalesData} dataKey="value" nameKey="name" outerRadius={100} label>{categorySalesData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></motion.div>

          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3>Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          className="recent-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="section-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="view-all-link">
              View All →
            </Link>
          </div>

          <div className="recent-orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.slice(0, 5).map(order => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>{order.shippingAddress.name}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.orderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/admin/users" className="action-btn">
              👥 Manage Users
            </Link>
            <Link to="/admin/products" className="action-btn">
              📦 Manage Products
            </Link>
            <Link to="/admin/orders" className="action-btn">
              📋 Manage Orders
            </Link>
            <Link to="/admin/reports" className="action-btn">
              📊 View Reports
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
