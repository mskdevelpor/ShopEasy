// Shared store logic: product data, search, filtering, sorting and cart calculations.
let products = [...fallbackProducts];
const CART_KEY = 'shopeasy-cart';
const money = amount => `Rs. ${Number(amount).toLocaleString('en-PK', {maximumFractionDigits: 2})}`;

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (error) { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadges();
}
function updateCartBadges() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(node => { node.textContent = count; });
}
function addToCart(...items) {
  // Rest parameter lets this function accept one or more product IDs.
  const cart = getCart();
  items.forEach(id => {
    const product = products.find(item => item.id === Number(id));
    if (!product || !product.inStock) return;
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({id: product.id, quantity: 1});
  });
  saveCart(cart);
  showToast('Added to your cart');
}
function changeQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find(entry => entry.id === Number(id));
  if (!item) return;
  item.quantity += delta;
  saveCart(cart.filter(entry => entry.quantity > 0));
  renderCart();
  renderCheckoutSummary();
}
function removeFromCart(id) {
  saveCart(getCart().filter(item => item.id !== Number(id)));
  renderCart();
  renderCheckoutSummary();
  showToast('Item removed');
}
function getCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, entry) => {
    const product = products.find(item => item.id === entry.id);
    return sum + (product ? product.price * entry.quantity : 0);
  }, 0);
  const discount = subtotal >= 200 ? subtotal * 0.05 : 0;
  return {subtotal, discount, total: subtotal - discount};
}
function productCard(product) {
  return `<article class="product-card"><div class="product-art" role="img" aria-label="${product.name}"><span>${product.emoji || '📦'}</span></div><div class="product-info"><p class="category-tag">${product.category}</p><h3>${product.name}</h3><p class="rating">★ ${product.rating.toFixed(1)} <span>customer rating</span></p><div class="product-bottom"><strong>${money(product.price)}</strong><span class="stock ${product.inStock ? 'available' : 'unavailable'}">${product.inStock ? 'In stock' : 'Out of stock'}</span></div><div class="card-actions"><button class="btn btn-small" data-action="add" data-id="${product.id}" ${product.inStock ? '' : 'disabled'}>Add to cart</button><button class="details-btn" data-action="details" data-id="${product.id}">Details</button></div></div></article>`;
}
function renderProducts(list = products) {
  const grid = document.querySelector('#product-grid');
  if (!grid) return;
  grid.innerHTML = list.length ? list.map(productCard).join('') : '<p class="empty-state">No products match your search. Try another category or keyword.</p>';
}
function applyProductControls() {
  const search = (document.querySelector('#search-input')?.value || '').trim().toLowerCase();
  const category = document.querySelector('#category-filter')?.value || 'all';
  const sort = document.querySelector('#sort-select')?.value || 'featured';
  let result = products.filter(product => product.name.toLowerCase().includes(search) && (category === 'all' || product.category === category));
  // Spread creates a copy because sort() changes the array it is called on.
  if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
  if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
  renderProducts(result);
}
function renderCart() {
  const target = document.querySelector('#cart-content');
  if (!target) return;
  const cart = getCart();
  if (!cart.length) {
    target.innerHTML = '<section class="empty-card"><span>🛒</span><h2>Your cart is empty</h2><p>Explore the store and add something you like.</p><a class="btn" href="products.html">Browse products</a></section>';
    return;
  }
  const rows = cart.map(entry => {
    const product = products.find(item => item.id === entry.id);
    if (!product) return '';
    return `<tr><td><div class="cart-product"><span class="mini-art">${product.emoji}</span><div><strong>${product.name}</strong><small>${product.category}</small></div></div></td><td>${money(product.price)}</td><td><div class="quantity-control"><button data-action="minus" data-id="${product.id}" aria-label="Decrease quantity">−</button><span>${entry.quantity}</span><button data-action="plus" data-id="${product.id}" aria-label="Increase quantity">+</button></div></td><td>${money(product.price * entry.quantity)}</td><td><button class="remove-btn" data-action="remove" data-id="${product.id}">Remove</button></td></tr>`;
  }).join('');
  const totals = getCartTotals();
  target.innerHTML = `<section class="cart-table-wrap"><table class="cart-table"><thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr></thead><tbody>${rows}</tbody></table></section><aside class="summary-card"><h2>Order summary</h2><div class="summary-line"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div><div class="summary-line"><span>Discount (5% over Rs. 200)</span><strong>− ${money(totals.discount)}</strong></div><div class="summary-line grand-total"><span>Grand total</span><strong>${money(totals.total)}</strong></div><a class="btn btn-full" href="checkout.html">Continue to checkout</a><a class="text-link centered" href="products.html">Continue shopping</a></aside>`;
}
function renderCheckoutSummary() {
  const target = document.querySelector('#checkout-summary');
  if (!target) return;
  const cart = getCart();
  const totals = getCartTotals();
  const rows = cart.map(entry => { const p = products.find(item => item.id === entry.id); return p ? `<div class="summary-line"><span>${p.name} × ${entry.quantity}</span><strong>${money(p.price * entry.quantity)}</strong></div>` : ''; }).join('');
  target.innerHTML = `<h2>Order summary</h2>${rows || '<p>Your cart is empty. <a href="products.html">Browse products</a>.</p>'}<hr><div class="summary-line"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div><div class="summary-line"><span>Discount</span><strong>− ${money(totals.discount)}</strong></div><div class="summary-line grand-total"><span>Total</span><strong>${money(totals.total)}</strong></div>`;
}
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
  toast.textContent = message;
  toast.classList.add('visible');
  if (window.jQuery) $(toast).stop(true, true).fadeIn(150).delay(1200).fadeOut(300, function(){ this.classList.remove('visible'); });
}
function showProductDetails(id) {
  const product = products.find(item => item.id === Number(id));
  const panel = document.querySelector('#product-details');
  if (!product || !panel) return;
  panel.innerHTML = `<button class="details-close" type="button" aria-label="Close details">×</button><div class="detail-emoji">${product.emoji}</div><div><p class="eyebrow">PRODUCT DETAILS</p><h2>${product.name}</h2><p>${product.description}</p><p>Category: <strong>${product.category}</strong> · Rating: <strong>${product.rating}/5</strong></p><p class="detail-price">${money(product.price)}</p><p>${product.inStock ? 'Currently in stock.' : 'Currently out of stock.'}</p></div>`;
  panel.classList.remove('hidden');
  panel.scrollIntoView({behavior: 'smooth', block: 'nearest'});
}
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const group = field.type === 'radio' ? form.querySelectorAll(`[name="${field.name}"]`) : [field];
    if (field.type === 'radio' && !form.querySelector(`[name="${field.name}"]:checked`)) {
      const error = field.closest('fieldset')?.querySelector('.field-error'); if (error) error.textContent = 'Please choose a payment method.'; valid = false; return;
    }
    if (field.type === 'radio') return;
    let message = '';
    if (field.type === 'checkbox' && !field.checked) message = 'Please confirm before continuing.';
    else if (!field.checkValidity()) message = field.validity.valueMissing ? 'This field is required.' : field.validity.typeMismatch ? 'Please enter a valid value.' : field.validity.patternMismatch ? 'Please use a valid phone number.' : `Please enter at least ${field.minLength > 0 ? field.minLength : 1} characters or check this value.`;
    const error = field.parentElement.querySelector('.field-error');
    if (error) error.textContent = message;
    field.classList.toggle('invalid', Boolean(message));
    if (message) valid = false;
  });
  return valid;
}
function loadProducts() {
  if (!window.jQuery) { products = [...fallbackProducts]; afterProductsLoad(); return; }
  const loading = document.querySelector('#loading-message');
  if (loading) loading.textContent = 'Loading products…';
  $.getJSON('products.json').done(data => { products = data; if (loading) loading.textContent = `${products.length} products available`; afterProductsLoad(); })
    .fail(() => { products = [...fallbackProducts]; if (loading) loading.textContent = 'Using built-in product data.'; const error = document.querySelector('#error-message'); if (error) error.classList.remove('hidden'); afterProductsLoad(); });
}
function afterProductsLoad() {
  updateCartBadges();
  if (document.querySelector('#product-grid')) applyProductControls();
  const featured = document.querySelector('#featured-grid');
  if (featured) featured.innerHTML = products.filter(p => p.inStock).slice(0, 4).map(productCard).join('');
  renderCart(); renderCheckoutSummary();
}
