import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, minRating, brand, sort } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }
  if (minRating !== undefined) filter.rating = { $gte: Number(minRating) };

  let query = Product.find(filter);

  const sortMap = {
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
    popular: { reviews: -1 }
  };
  if (sort && sortMap[sort]) query = query.sort(sortMap[sort]);

  const products = await query;
  res.json(products);
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const regex = new RegExp(q, 'i');
  const products = await Product.find({
    $or: [{ name: regex }, { description: regex }, { brand: regex }]
  });
  res.json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json(product);
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id }
  }).limit(5);
  res.json(related);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});
