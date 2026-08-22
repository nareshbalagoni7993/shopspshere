import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import ProductCard from '../../components/user/ProductCard';
import Loader from '../../components/common/Loader';
import { SORT_OPTIONS, PRICE_RANGES, RATING_FILTERS } from '../../constants';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        let data;

        if (search) {
          data = await productService.searchProducts(search);
        } else if (category) {
          data = await productService.getProductsByCategory(category);
        } else {
          data = await productService.getAllProducts();
        }

        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Price filter
    if (priceRange) {
      filtered = filtered.filter(
        p => p.price >= priceRange.min && p.price <= priceRange.max
      );
    }

    // Rating filter
    if (ratingFilter) {
      filtered = filtered.filter(p => p.rating >= ratingFilter);
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return b.reviews - a.reviews;
      }
    });

    setFilteredProducts(filtered);
  }, [products, sortBy, priceRange, ratingFilter]);

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button
              className="close-filters"
              onClick={() => setShowFilters(false)}
            >
              ✕
            </button>
          </div>

          {/* Price Filter */}
          <div className="filter-group">
            <h4>Price Range</h4>
            {PRICE_RANGES.map(range => (
              <label key={range.label} className="filter-option">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange?.min === range.min}
                  onChange={() => setPriceRange(range)}
                />
                {range.label}
              </label>
            ))}
            {priceRange && (
              <button
                className="clear-filter"
                onClick={() => setPriceRange(null)}
              >
                Clear
              </button>
            )}
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <h4>Rating</h4>
            {RATING_FILTERS.map(rating => (
              <label key={rating.label} className="filter-option">
                <input
                  type="radio"
                  name="rating"
                  checked={ratingFilter === rating.value}
                  onChange={() => setRatingFilter(rating.value)}
                />
                {rating.label}
              </label>
            ))}
            {ratingFilter && (
              <button
                className="clear-filter"
                onClick={() => setRatingFilter(null)}
              >
                Clear
              </button>
            )}
          </div>
        </aside>

        {/* Main Products Area */}
        <main className="products-main">
          {/* Header with Sorting */}
          <div className="products-header">
            <div className="results-count">
              Showing {filteredProducts.length} products
            </div>

            <div className="sort-controls">
              <button
                className="mobile-filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                ☰ Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <Loader fullPage category={searchParams.get('category')} label="Loading products…" />
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
