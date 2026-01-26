// ============================================
// PRODUCT DATA MANAGEMENT
// ============================================

// Default products array - stored in localStorage
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Lavender Dreams",
    price: 2500,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
    description: "A luxurious lavender candle with a soothing aroma. Perfect for relaxation and meditation.",
    category: "Floral",
    size: "200g",
    height: "8cm",
    weight: "220g",
    burnTime: "40 hours",
    details: "Hand-poured using 100% soy wax. Features natural lavender essential oil. Perfect for creating a calm atmosphere in any room."
  },
  {
    id: 2,
    name: "Vanilla Bliss",
    price: 2200,
    image: "https://images.unsplash.com/photo-1610880976682-c97b78da9b44?w=400&h=400&fit=crop",
    description: "Warm and comforting vanilla scent with subtle hints of cinnamon. A timeless favorite.",
    category: "Warm",
    size: "200g",
    height: "8cm",
    weight: "220g",
    burnTime: "38 hours",
    details: "Premium vanilla extract blended with cinnamon spice. Eco-friendly packaging. Long-lasting fragrance."
  },
  {
    id: 3,
    name: "Ocean Breeze",
    price: 2800,
    image: "https://images.unsplash.com/photo-1617636975141-0c55a1018301?w=400&h=400&fit=crop",
    description: "Fresh and crisp ocean-inspired scent with hints of sea salt and marine notes.",
    category: "Fresh",
    size: "250g",
    height: "9cm",
    weight: "280g",
    burnTime: "50 hours",
    details: "A refreshing blend of sea salt, driftwood, and aquatic notes. Creates an invigorating atmosphere."
  },
  {
    id: 4,
    name: "Rose Garden",
    price: 3000,
    image: "https://images.unsplash.com/photo-1615528491576-2e2b2d1f4f9b?w=400&h=400&fit=crop",
    description: "Elegant rose fragrance with hints of peony and sandalwood. Perfect for special occasions.",
    category: "Floral",
    size: "250g",
    height: "9cm",
    weight: "280g",
    burnTime: "48 hours",
    details: "Crafted with real rose petals and premium fragrance oils. A luxurious addition to any space."
  },
  {
    id: 5,
    name: "Amber Wood",
    price: 2600,
    image: "https://images.unsplash.com/photo-1547382119-6f6eee1a0c89?w=400&h=400&fit=crop",
    description: "Deep and woody amber scent with warm cedar undertones. Sophisticated and long-lasting.",
    category: "Warm",
    size: "200g",
    height: "8cm",
    weight: "220g",
    burnTime: "42 hours",
    details: "A blend of amber, sandalwood, and cedarwood. Perfect for creating a cozy ambiance."
  },
  {
    id: 6,
    name: "Citrus Zest",
    price: 2400,
    image: "https://images.unsplash.com/photo-1600594295220-08ad4f3e4c24?w=400&h=400&fit=crop",
    description: "Bright and energizing citrus blend with lemon, orange, and grapefruit notes.",
    category: "Fresh",
    size: "200g",
    height: "8cm",
    weight: "220g",
    burnTime: "36 hours",
    details: "A vibrant citrus blend that uplifts and energizes. Great for kitchen or workspace."
  }
];

/**
 * Get all products from localStorage or return defaults
 */
function getProducts() {
  const stored = localStorage.getItem('lumoraProducts');
  return stored ? JSON.parse(stored) : DEFAULT_PRODUCTS;
}

/**
 * Save products to localStorage
 */
function saveProducts(products) {
  localStorage.setItem('lumoraProducts', JSON.stringify(products));
}

/**
 * Get a single product by ID
 */
function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === parseInt(id));
}

/**
 * Add a new product
 */
function addProduct(product) {
  const products = getProducts();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = {
    ...product,
    id: newId
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

/**
 * Update an existing product
 */
function updateProduct(id, updatedData) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData };
    saveProducts(products);
    return products[index];
  }
  return null;
}

/**
 * Delete a product
 */
function deleteProduct(id) {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== parseInt(id));
  saveProducts(filtered);
  return filtered;
}

/**
 * Get related products (same category, different product)
 * Returns up to limit products for horizontal scrolling
 */
function getRelatedProducts(productId, limit = 10) {
  const products = getProducts();
  const current = getProductById(productId);
  if (!current) return [];
  
  // Get products from same category, excluding current product
  const sameCategory = products.filter(p => p.category === current.category && p.id !== parseInt(productId));
  
  // If not enough products in same category, fill with other products
  if (sameCategory.length < limit) {
    const otherProducts = products
      .filter(p => p.category !== current.category && p.id !== parseInt(productId))
      .slice(0, limit - sameCategory.length);
    return [...sameCategory, ...otherProducts].slice(0, limit);
  }
  
  return sameCategory.slice(0, limit);
}

/**
 * Search products by name or description
 */
function searchProducts(query) {
  const products = getProducts();
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
}
