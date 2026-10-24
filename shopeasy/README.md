# ShopEasy — Web Engineering Assignment No. 2

A responsive front-end online store made with HTML5, CSS3, JavaScript (ES6), jQuery and a JSON product file. No backend or real payment service is used.

## Theme
Electronics and accessories store.

## Pages
- `index.html` — Home page, featured products and FAQ accordion
- `products.html` — Dynamic product grid, search, category filter, sort and product details
- `cart.html` — Cart table, quantity controls, remove buttons, subtotal, discount and grand total
- `checkout.html` — Checkout form with JavaScript validation and demo order confirmation
- `contact.html` — Contact form and store information

## Main features
- 12 products loaded with jQuery `$.getJSON()` from `products.json`, with fallback data in `js/data.js`
- Search with `filter()`, product details with `find()`, sorting on a copied array using spread syntax
- Cart totals with `reduce()`, `addToCart(...items)` using a rest parameter, and event delegation
- Cart saved in `localStorage`
- Responsive CSS Grid and Flexbox, two media-query breakpoints, focus and hover styles
- jQuery `$(document).ready()`, `.on()`, `.slideToggle()`, `.fadeIn()`, `.fadeOut()`, `.addClass()`, `.text()` and method chaining
- Checkout form checks; demo only, no payment is processed

## Run in VS Code
1. Extract the ZIP file.
2. Open the `shopeasy` folder in Visual Studio Code.
3. Install the **Live Server** extension if it is not installed.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Use the navigation links to test all pages. Do not open the HTML file by double-clicking, because browsers may block the JSON AJAX request from a local file.

## GitHub submission
Create a public GitHub repository named `shopeasy-web-engineering`, upload all files while keeping the folder structure, and submit the repository URL. Also create a ZIP of the project folder for the course portal.

## Suggested demo order
Home → Products (search/filter/sort/details) → Add to cart → Cart (quantity/remove/totals) → Checkout (test invalid form and successful demo order) → Contact.

## Student/team details
Add your name, course section and any team members here before submission.
