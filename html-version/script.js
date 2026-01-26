// ============================================
// MAIN APPLICATION SCRIPT
// ============================================

// ============================================
// CART MANAGEMENT
// ============================================

/**
 * Get cart from localStorage
 */
function getCart() {
  const stored = localStorage.getItem('lumoraCart');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
  localStorage.setItem('lumoraCart', JSON.stringify(cart));
}

/**
 * Add item to cart
 */
function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity
    });
  }
  
  saveCart(cart);
  showNotification(`${product.name} added to cart!`, 'success');
  updateCartBadge();
}

/**
 * Remove item from cart
 */
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

/**
 * Update cart item quantity
 */
function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
    updateCartBadge();
  }
}

/**
 * Get cart total
 */
function getCartTotal() {
  return getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Update cart badge count in header
 */
function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector('.nav-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

// ============================================
// UI UTILITIES
// ============================================

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * Format price in LKR
 */
function formatPrice(price) {
  return 'LKR ' + price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

/**
 * Open modal
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

/**
 * Close modal
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

/**
 * Close modal on background click
 */
function setupModalClose(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal(modalId);
    }
  });
  
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modalId));
  }
}

// ============================================
// PRODUCT DISPLAY
// ============================================

/**
 * Render product grid
 */
function renderProductsGrid(products, containerId = 'products-container') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h2>No products found</h2>
        <p>Try searching with different keywords</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = products.map(product => `
    <div class="product-card" onclick="navigateToProduct(${product.id})">
      <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/200x200?text=${encodeURIComponent(product.name)}'">
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-price-label">Price</div>
        <div class="product-price">${formatPrice(product.price)}</div>
        <div class="product-card-actions" onclick="event.stopPropagation();">
          <button class="btn-view" onclick="navigateToProduct(${product.id})">View</button>
          <button class="btn-cart" onclick="addToCart(getProductById(${product.id}), 1)">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Navigate to product detail page
 */
function navigateToProduct(productId) {
  window.location.href = `product.html?id=${productId}`;
}

/**
 * Render related products as horizontal scrollable cards (AliExpress style)
 * - Desktop only: exactly 4 items visible
 * - Small horizontal product cards
 * - Left to right scroll
 * - Compact minimal design
 * - Smaller optimized images
 * - Clean white background
 * - Subtle hover effect
 * - Name + price under image
 */
function renderRelatedProducts() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) return;
  
  const relatedProducts = getRelatedProducts(productId, 10);
  if (relatedProducts.length === 0) return;
  
  const container = document.getElementById('related-products');
  if (!container) return;
  
  if (relatedProducts.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  // Clean AliExpress-style compact cards - 4 visible on desktop
  container.innerHTML = relatedProducts.map(product => {
    const optimizedImage = product.image.replace(/w=\d+/, 'w=140').replace(/h=\d+/, 'h=100');
    return `
    <div class="flex-shrink-0 bg-white rounded border border-gray-200 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all duration-200"
         style="width: 140px;"
         onclick="navigateToProduct(${product.id})">
      <div class="bg-gray-50" style="height: 100px;">
        <img src="${optimizedImage}" 
             alt="${product.name}" 
             loading="lazy"
             class="w-full h-full"
             style="object-fit: cover;"
             onerror="this.src='https://via.placeholder.com/140x100?text=${encodeURIComponent(product.name)}'">
      </div>
      <div class="p-2">
        <h3 class="text-xs text-gray-800 leading-tight truncate" title="${product.name}">
          ${product.name}
        </h3>
        <p class="text-xs font-semibold text-gray-900 mt-1">
          ${formatPrice(product.price)}
        </p>
      </div>
    </div>
  `}).join('');
}

// ============================================
// PRODUCT DETAIL PAGE
// ============================================

/**
 * Load and display product detail
 */
function loadProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    window.location.href = 'index.html';
    return;
  }
  
  const product = getProductById(productId);
  if (!product) {
    window.location.href = 'index.html';
    return;
  }
  
  // Update page title
  document.title = `${product.name} - Lumora Candles`;
  
  // Update breadcrumb
  const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="index.html">Shop</a>
      <span>/</span>
      <span>${product.name}</span>
    `;
  }
  
  // Update product image
  const mainImage = document.getElementById('product-main-image');
  if (mainImage) {
    mainImage.src = product.image;
    mainImage.onerror = function() {
      this.src = `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}`;
    };
  }
  
  // Update product details
  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-category').textContent = product.category;
  document.getElementById('product-price').textContent = formatPrice(product.price);
  document.getElementById('product-description').textContent = product.description;
  
  // Update specs
  document.getElementById('spec-size').textContent = product.size;
  document.getElementById('spec-height').textContent = product.height;
  document.getElementById('spec-weight').textContent = product.weight;
  document.getElementById('spec-burn-time').textContent = product.burnTime;
  
  // Update details section
  document.getElementById('product-details-content').textContent = product.details;
  
  // Setup quantity selector
  setupQuantitySelector();
  
  // Setup action buttons
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const quantity = parseInt(document.getElementById('quantity-input').value);
      addToCart(product, quantity);
    });
  }
  
  const buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      const quantity = parseInt(document.getElementById('quantity-input').value);
      addToCart(product, quantity);
      setTimeout(() => {
        // In a real app, this would go to checkout
        showNotification('Proceeding to checkout...', 'info');
      }, 500);
    });
  }
  
  // Setup details toggle
  setupDetailsToggle();
  
  // Load related products
  renderRelatedProducts();
}

/**
 * Setup quantity selector
 */
function setupQuantitySelector() {
  const input = document.getElementById('quantity-input');
  const decreaseBtn = document.querySelector('.quantity-control button:first-child');
  const increaseBtn = document.querySelector('.quantity-control button:last-child');
  
  if (decreaseBtn && input) {
    decreaseBtn.addEventListener('click', () => {
      input.value = Math.max(1, parseInt(input.value) - 1);
    });
  }
  
  if (increaseBtn && input) {
    increaseBtn.addEventListener('click', () => {
      input.value = parseInt(input.value) + 1;
    });
  }
  
  if (input) {
    input.addEventListener('change', () => {
      input.value = Math.max(1, parseInt(input.value) || 1);
    });
  }
}

/**
 * Setup details toggle
 */
function setupDetailsToggle() {
  const toggle = document.querySelector('.details-toggle');
  const content = document.querySelector('.details-content');
  
  if (toggle && content) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      content.classList.toggle('active');
    });
  }
}

// ============================================
// ADMIN DASHBOARD
// ============================================

/**
 * Load and display products in admin
 */
function loadAdminProducts() {
  const products = getProducts();
  renderAdminProductsList(products);
}

/**
 * Render products list in admin
 */
function renderAdminProductsList(products) {
  const container = document.getElementById('products-list');
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No products yet</h2>
        <p>Add your first candle product to get started</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = products.map(product => `
    <div class="product-item">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/80x80?text=${encodeURIComponent(product.name)}'">
      <div class="product-item-info">
        <h4>${product.name}</h4>
        <p>${product.category} • ${product.size}</p>
        <div class="product-item-price">${formatPrice(product.price)}</div>
      </div>
      <div class="product-item-actions">
        <button class="btn-edit btn-small" onclick="editProduct(${product.id})">Edit</button>
        <button class="btn-danger btn-small" onclick="deleteProductAdmin(${product.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

/**
 * Open add/edit product form
 */
function openAddProductForm() {
  resetProductForm();
  document.getElementById('form-title').textContent = 'Add New Product';
  document.getElementById('product-id-input').value = '';
  openModal('product-modal');
}

/**
 * Edit product
 */
function editProduct(productId) {
  const product = getProductById(productId);
  if (!product) return;
  
  document.getElementById('form-title').textContent = 'Edit Product';
  document.getElementById('product-id-input').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-image-url').value = product.image;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-size').value = product.size;
  document.getElementById('product-height').value = product.height;
  document.getElementById('product-weight').value = product.weight;
  document.getElementById('product-burn-time').value = product.burnTime;
  document.getElementById('product-details').value = product.details;
  
  openModal('product-modal');
}

/**
 * Save product (add or update)
 */
function saveProduct(e) {
  e.preventDefault();
  
  const productId = document.getElementById('product-id-input').value;
  const productData = {
    name: document.getElementById('product-name').value,
    price: parseInt(document.getElementById('product-price').value),
    image: document.getElementById('product-image-url').value || 'https://via.placeholder.com/400x400?text=No+Image',
    description: document.getElementById('product-description').value,
    category: document.getElementById('product-category').value,
    size: document.getElementById('product-size').value,
    height: document.getElementById('product-height').value,
    weight: document.getElementById('product-weight').value,
    burnTime: document.getElementById('product-burn-time').value,
    details: document.getElementById('product-details').value
  };
  
  if (!productData.name || !productData.price) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  if (productId) {
    updateProduct(productId, productData);
    showNotification('Product updated successfully', 'success');
  } else {
    addProduct(productData);
    showNotification('Product added successfully', 'success');
  }
  
  closeModal('product-modal');
  loadAdminProducts();
}

/**
 * Delete product
 */
function deleteProductAdmin(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    deleteProduct(productId);
    showNotification('Product deleted successfully', 'success');
    loadAdminProducts();
  }
}

/**
 * Reset product form
 */
function resetProductForm() {
  document.getElementById('product-form').reset();
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize page on load
 */
document.addEventListener('DOMContentLoaded', () => {
  // Update cart badge
  updateCartBadge();
  
  // Setup modals
  setupModalClose('product-modal');
  
  // Setup form
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', saveProduct);
  }
  
  // Determine current page and load appropriate content
  const path = window.location.pathname;
  
  if (path.includes('index.html') || path.endsWith('/')) {
    // Products listing page
    const products = getProducts();
    renderProductsGrid(products);
    
    // Setup search if exists
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const results = searchProducts(e.target.value);
        renderProductsGrid(results);
      });
    }
  } else if (path.includes('product.html')) {
    // Product detail page
    loadProductDetail();
  } else if (path.includes('admin.html')) {
    // Admin page
    loadAdminProducts();
  }
});

/**
 * Setup navigation links
 */
function navigateToShop() {
  window.location.href = 'index.html';
}

function navigateToAdmin() {
  window.location.href = 'admin.html';
}
