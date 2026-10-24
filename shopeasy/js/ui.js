// jQuery interactions and page event handlers.
$(document).ready(function () {
  loadProducts();

  // Navigation works on small screens too.
  $('.menu-toggle').on('click', function () { $('.nav').slideToggle(180).toggleClass('nav-open'); });
  $('.faq-question').on('click', function () {
    $(this).toggleClass('expanded').next('.faq-answer').slideToggle(220);
    $(this).find('span').text($(this).hasClass('expanded') ? '−' : '＋');
  });
  $('#search-input, #category-filter, #sort-select').on('input change', applyProductControls);

  // Event delegation handles product/cart buttons created dynamically by JavaScript.
  $(document).on('click', '[data-action]', function () {
    const action = this.dataset.action;
    const id = Number(this.dataset.id);
    if (action === 'add') addToCart(id);
    if (action === 'details') showProductDetails(id);
    if (action === 'plus') changeQuantity(id, 1);
    if (action === 'minus') changeQuantity(id, -1);
    if (action === 'remove') removeFromCart(id);
  });
  $(document).on('click', '.details-close', function () { $('#product-details').fadeOut(180, function () { $(this).addClass('hidden').show(); }); });

  // jQuery AJAX JSON loading is handled in loadProducts(), including failure fallback.
  $('#checkout-form').on('submit', function (event) {
    event.preventDefault();
    const message = document.querySelector('#checkout-message');
    if (!validateForm(this)) { message.textContent = 'Please correct the highlighted fields and try again.'; message.className = 'error-message'; return; }
    if (getCart().length === 0) { message.textContent = 'Your cart is empty. Add a product before placing an order.'; message.className = 'error-message'; return; }
    message.textContent = 'Demo order placed successfully! No payment was taken.';
    message.className = 'success-message';
    localStorage.removeItem(CART_KEY); updateCartBadges(); renderCheckoutSummary();
  });
  $('#contact-form').on('submit', function (event) {
    event.preventDefault();
    if (!this.checkValidity()) { this.reportValidity(); return; }
    $('#contact-message').text('Thank you! Your demo message has been recorded on this page.').hide().fadeIn(250);
    this.reset();
  });

  // Demonstrate jQuery method chaining and a small entrance animation.
  $('.site-header').addClass('header-ready').hide().fadeIn(220);
});
