import React, { useEffect, useMemo, useState } from 'react';
import { productService } from '../../services/productService';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';
import { categoryService } from '../../services/categoryService';
import { uploadService } from '../../services/uploadService';
import { resolveAssetUrl } from '../../services/api';
import { toast } from '../../services/toastBus';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';
import './ManagementPage.css';

const titles = {
  users: 'User Management',
  products: 'Product Management',
  categories: 'Categories',
  orders: 'Order Management',
  payments: 'Payments',
  reports: 'Reports',
  settings: 'Settings'
};

const emptyProduct = {
  name: '',
  brand: '',
  category: '',
  price: '',
  originalPrice: '',
  discount: '',
  stock: '',
  description: '',
  image: ''
};

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

const singularLabel = {
  users: 'user',
  products: 'product',
  categories: 'category',
  orders: 'order',
  payments: 'payment',
  reports: 'report'
};

const ProductEditor = ({ product, categories, onClose, onSave, saving }) => {
  const [form, setForm] = useState(product || emptyProduct);
  const [imageMode, setImageMode] = useState('url');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    const result = await uploadService.uploadImage(file);
    setUploading(false);
    if (result.success) {
      setForm((current) => ({ ...current, image: result.url }));
    } else {
      setUploadError(result.message || 'Upload failed');
    }
  };

  const save = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      discount: Number(form.discount || 0),
      stock: Number(form.stock)
    });
  };

  const previewSrc = resolveAssetUrl(form.image);

  return (
    <div className="editor-backdrop" role="dialog" aria-modal="true">
      <form className="product-editor" onSubmit={save}>
        <div className="editor-title">
          <h2>{product ? 'Edit product' : 'Add product'}</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <div className="product-form-grid">
          <label>
            Product name
            <input name="name" value={form.name} onChange={update} required />
          </label>
          <label>
            Brand
            <input name="brand" value={form.brand || ''} onChange={update} />
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={update} required>
              <option value="" disabled>Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </label>
          <label>
            Price
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={update} required />
          </label>
          <label>
            Original price
            <input name="originalPrice" type="number" min="0" step="0.01" value={form.originalPrice || ''} onChange={update} />
          </label>
          <label>
            Discount %
            <input name="discount" type="number" min="0" max="100" value={form.discount} onChange={update} />
          </label>
          <label>
            Stock
            <input name="stock" type="number" min="0" value={form.stock} onChange={update} required />
          </label>
          <label className="form-full">
            Description
            <textarea name="description" value={form.description || ''} onChange={update} rows="3" />
          </label>
        </div>

        <div className="image-mode-toggle">
          <button type="button" className={imageMode === 'url' ? 'active' : ''} onClick={() => setImageMode('url')}>
            Image URL
          </button>
          <button type="button" className={imageMode === 'upload' ? 'active' : ''} onClick={() => setImageMode('upload')}>
            Upload from device
          </button>
        </div>

        <div className="image-upload">
          <div>
            {previewSrc ? <img src={previewSrc} alt="Product preview" /> : <span>No image selected</span>}
          </div>
          {imageMode === 'url' ? (
            <label>
              Paste an image URL
              <input
                name="image"
                type="url"
                placeholder="https://example.com/product.jpg"
                value={form.image || ''}
                onChange={update}
              />
            </label>
          ) : (
            <label>
              {uploading ? 'Uploading…' : 'Choose an image from this device'}
              <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
              {uploadError && <span className="upload-error">{uploadError}</span>}
            </label>
          )}
          {form.image && (
            <button type="button" className="remove-image" onClick={() => setForm({ ...form, image: '' })}>
              Remove image
            </button>
          )}
        </div>

        <div className="editor-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button className="add-button" type="submit" disabled={saving || uploading}>
            {saving ? 'Saving…' : 'Save product'}
          </button>
        </div>
      </form>
    </div>
  );
};

const AdminManagementPage = ({ type }) => {
  const [rowsData, setRowsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (type === 'users') setRowsData(await userService.getAllUsers());
      else if (type === 'products') setRowsData(await productService.getAllProducts());
      else if (type === 'categories') setRowsData(await categoryService.getAllCategories());
      else if (['orders', 'payments', 'reports'].includes(type)) setRowsData(await orderService.getAllOrders());
      else setRowsData([]);
    } catch (err) {
      setMessage(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setQuery('');
    setFilter('all');
    setMessage('');
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    categoryService.getAllCategories().then((data) => Array.isArray(data) && setCategories(data));
  }, []);

  const rows = useMemo(
    () =>
      rowsData.filter(
        (item) =>
          JSON.stringify(item).toLowerCase().includes(query.toLowerCase()) &&
          (filter === 'all' || item.status === filter || item.category === filter || item.paymentStatus === filter)
      ),
    [rowsData, query, filter]
  );
  const visible = rows.slice((page - 1) * 5, page * 5);

  const saveProduct = async (product) => {
    setSaving(true);
    const result = product.id
      ? await productService.updateProduct(product.id, product)
      : await productService.createProduct(product);
    setSaving(false);

    if (result.success === false) {
      setMessage(result.message || 'Failed to save product');
      toast.error(result.message || 'Failed to save product');
      return;
    }
    setShowEditor(false);
    setEditing(null);
    const savedMessage = `Product "${product.name}" saved — now visible to shoppers.`;
    setMessage(savedMessage);
    toast.success(savedMessage);
    loadData();
  };

  const deleteProductRow = async (id, name) => {
    const result = await productService.deleteProduct(id);
    if (result.success === false) {
      setMessage(result.message || 'Failed to delete product');
      toast.error(result.message || 'Failed to delete product');
      return;
    }
    setMessage(`Product "${name}" deleted.`);
    toast.success(`Product "${name}" deleted.`);
    setRowsData((current) => current.filter((item) => item.id !== id));
  };

  const toggleUser = async (id) => {
    const result = await userService.toggleUserStatus(id);
    if (result.success === false) {
      setMessage(result.message || 'Failed to update user');
      toast.error(result.message || 'Failed to update user');
      return;
    }
    setMessage('User status updated.');
    toast.success(`${result.user.name} is now ${result.user.status}.`);
    setRowsData((current) => current.map((item) => (item.id === id ? result.user : item)));
  };

  const deleteUserRow = async (id, name) => {
    const result = await userService.deleteUser(id);
    if (result.success === false) {
      setMessage(result.message || 'Failed to delete user');
      toast.error(result.message || 'Failed to delete user');
      return;
    }
    setMessage(`User "${name}" deleted.`);
    toast.success(`User "${name}" deleted.`);
    setRowsData((current) => current.filter((item) => item.id !== id));
  };

  const changeOrderStatus = async (order, status) => {
    const result = await orderService.updateOrderStatus(order.id, status);
    if (result.success === false) {
      setMessage(result.message || 'Failed to update order');
      toast.error(result.message || 'Failed to update order');
      return;
    }
    const statusMessage = `${order.id} updated to ${status.replaceAll('_', ' ')}.`;
    setMessage(statusMessage);
    toast.success(statusMessage);
    setRowsData((current) => current.map((item) => (item.id === order.id ? { ...item, status } : item)));
  };

  if (type === 'settings') {
    return (
      <section className="management-page">
        <h1>Admin Settings</h1>
        <div className="settings-card">
          <h2>Store settings</h2>
          <label>Store name<input defaultValue="ShopSphere" /></label>
          <label>Support email<input defaultValue="support@shopsphere.demo" /></label>
          <button onClick={() => setMessage('Settings saved (demo).')}>Save settings</button>
          {message && <p>{message}</p>}
        </div>
      </section>
    );
  }

  const headers =
    type === 'users' ? ['Profile', 'Name', 'Email', 'Mobile', 'Role', 'Status', 'Created', 'Actions']
    : type === 'products' ? ['Image', 'Product', 'Brand', 'Category', 'Price', 'Discount', 'Stock', 'Actions']
    : type === 'orders' ? ['Order', 'Customer', 'Total', 'Status', 'Payment', 'Date', 'Actions']
    : type === 'payments' ? ['Order', 'Method', 'Amount', 'Status', 'Date', 'Actions']
    : type === 'categories' ? ['Icon', 'Category', 'Products', 'Actions']
    : ['Order', 'Revenue', 'Status', 'Date', 'Actions'];

  const categoryIcon = (categoryName) => categories.find((cat) => cat.name === categoryName)?.icon || '🏷️';

  const cells = (item) => {
    if (type === 'users') {
      return (
        <>
          <td><img className="table-avatar" src={item.avatar} alt="" /></td>
          <td>{item.name}</td>
          <td>{item.email}</td>
          <td>{item.mobile}</td>
          <td>{item.role}</td>
          <td><span className={`table-status ${item.status}`}>{item.status}</span></td>
          <td>{item.createdDate?.slice(0, 10)}</td>
        </>
      );
    }
    if (type === 'products') {
      return (
        <>
          <td><img className="table-product" src={resolveAssetUrl(item.image)} alt="" /></td>
          <td>{item.name}</td>
          <td>{item.brand}</td>
          <td><span className="category-pill"><span aria-hidden="true">{categoryIcon(item.category)}</span> {item.category}</span></td>
          <td>{formatCurrency(item.price)}</td>
          <td>{item.discount || 0}%</td>
          <td>{item.stock ?? 0}</td>
        </>
      );
    }
    if (type === 'orders') {
      return (
        <>
          <td>{item.id}</td>
          <td>{item.shippingAddress?.name}</td>
          <td>{formatCurrency(item.total)}</td>
          <td>
            <select
              className="status-select"
              value={item.status}
              onChange={(event) => changeOrderStatus(item, event.target.value)}
            >
              {ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
          </td>
          <td>{item.paymentStatus}</td>
          <td>{item.orderDate?.slice(0, 10)}</td>
        </>
      );
    }
    if (type === 'payments') {
      return (
        <>
          <td>{item.id}</td>
          <td>{item.paymentMethod}</td>
          <td>{formatCurrency(item.total)}</td>
          <td><span className={`table-status ${item.paymentStatus}`}>{item.paymentStatus}</span></td>
          <td>{item.orderDate?.slice(0, 10)}</td>
        </>
      );
    }
    if (type === 'categories') {
      return (
        <>
          <td className="table-icon">{item.icon}</td>
          <td>{item.name}</td>
          <td>{item.productCount || 0}</td>
        </>
      );
    }
    return (
      <>
        <td>{item.id}</td>
        <td>{formatCurrency(item.total)}</td>
        <td>{item.status}</td>
        <td>{item.orderDate?.slice(0, 10)}</td>
      </>
    );
  };

  const rowActions = (item) => {
    if (type === 'products') {
      return (
        <>
          <button onClick={() => setMessage(`Viewing ${item.name} details (demo).`)}>View</button>
          <button onClick={() => { setEditing(item); setShowEditor(true); }}>Edit</button>
          <button onClick={() => deleteProductRow(item.id, item.name)}>Delete</button>
        </>
      );
    }
    if (type === 'users') {
      return (
        <>
          <button onClick={() => setMessage(`Viewing ${item.name} details (demo).`)}>View</button>
          <button onClick={() => toggleUser(item.id)}>Toggle</button>
          <button onClick={() => deleteUserRow(item.id, item.name)}>Delete</button>
        </>
      );
    }
    return <button onClick={() => setMessage(`Viewing ${item.name || item.id} details (demo).`)}>View</button>;
  };

  return (
    <section className="management-page">
      <div className="management-heading">
        <div>
          <h1>{titles[type]}</h1>
          <p>{type === 'products' ? 'Products you add or remove here update the live storefront immediately.' : 'Manage storefront data.'}</p>
        </div>
        <div>
          <button onClick={() => setMessage('Excel export prepared (demo).')}>Export Excel</button>
          <button onClick={() => setMessage('PDF download prepared (demo).')}>Download PDF</button>
          <button
            className="add-button"
            onClick={() => {
              if (type === 'products') {
                setEditing(null);
                setShowEditor(true);
              } else {
                const demoMessage = `Add ${singularLabel[type]} form opened (demo).`;
                setMessage(demoMessage);
                toast.info(demoMessage);
              }
            }}
          >
            Add {singularLabel[type]}
          </button>
        </div>
      </div>

      {message && <p className="management-message">{message}</p>}

      <div className="table-tools">
        <input
          placeholder="Search..."
          value={query}
          onChange={(event) => { setQuery(event.target.value); setPage(1); }}
        />
        <select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="management-table">
        {loading ? (
          <div className="table-loading"><Loader /></div>
        ) : (
          <table>
            <thead>
              <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id}>
                  {cells(item)}
                  <td className="table-actions">{rowActions(item)}</td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={headers.length} className="table-empty">No records found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {Math.max(1, Math.ceil(rows.length / 5))}</span>
        <button disabled={page * 5 >= rows.length} onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {showEditor && (
        <ProductEditor
          product={editing}
          categories={categories}
          saving={saving}
          onClose={() => { setShowEditor(false); setEditing(null); }}
          onSave={saveProduct}
        />
      )}
    </section>
  );
};

export default AdminManagementPage;
