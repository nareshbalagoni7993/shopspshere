export const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=400&h=400&fit=crop",
    productCount: 245
  },
  {
    id: 2,
    name: "Fashion",
    icon: "👗",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=400&fit=crop",
    productCount: 567
  },
  {
    id: 3,
    name: "Home",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    productCount: 342
  },
  {
    id: 4,
    name: "Sports",
    icon: "⚽",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop",
    productCount: 189
  },
  {
    id: 5,
    name: "Wearables",
    icon: "⌚",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    productCount: 156
  },
  {
    id: 6,
    name: "Books",
    icon: "📚",
    image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=400&fit=crop",
    productCount: 421
  }
];

export const getCategoryById = (id) => {
  return mockCategories.find(c => c.id === id);
};
