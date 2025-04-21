// Initialize cart from localStorage or as an empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to save cart to localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to add an item to the cart
function addToCart(productId, productName, productPrice, productImage) {
  // Ensure productPrice is a valid number
  productPrice = parseFloat(productPrice);
  if (isNaN(productPrice) || productPrice <= 0) {
    console.error(`Invalid price for product: ${productName}`);
    alert("Error: Invalid product price.");
    return;
  }

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice, // Ensure price is stored as a number
      image: productImage,
      quantity: 1,
    });
  }

  saveCartToLocalStorage(); // Save updated cart to localStorage
  alert(`${productName} has been added to the cart!`); // Notify the user
  console.log("Cart after adding item:", cart); // Debugging log
}

// Function to update the cart table
function updateCartTable() {
  const cartTableBody = document.querySelector("#cart tbody");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  if (!cartTableBody || !subtotalElement || !totalElement) {
    console.error("Cart table elements not found on this page.");
    return; // Exit if cart table elements are not present (e.g., on non-cart pages)
  }

  cartTableBody.innerHTML = ""; // Clear existing rows
  let subtotal = 0;

  cart.forEach(item => {
    // Ensure item.price is a valid number
    if (isNaN(item.price)) {
      console.error(`Invalid price for item: ${item.name}`, item);
      return; // Skip items with invalid prices
    }

    const row = document.createElement("tr");

    row.innerHTML = `
      <td><a href="#" onclick="removeFromCart('${item.id}')"><i class="far fa-times-circle"></i></a></td>
      <td><img src="${item.image}" alt="${item.name}"></td>
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)"></td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
    `;

    cartTableBody.appendChild(row);
    subtotal += item.price * item.quantity;
  });

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  totalElement.textContent = `$${subtotal.toFixed(2)}`;
  console.log("Cart table updated:", cart); // Debugging log
}

// Function to update item quantity
function updateQuantity(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = parseInt(quantity, 10);
    if (isNaN(item.quantity) || item.quantity <= 0) {
      item.quantity = 1; // Default to 1 if invalid quantity
    }
    saveCartToLocalStorage(); // Save updated cart to localStorage
    updateCartTable();
  }
}

// Function to remove an item from the cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToLocalStorage(); // Save updated cart to localStorage
  updateCartTable();
}

// Initialize the cart table on page load (only if on cart.html)
document.addEventListener("DOMContentLoaded", () => {
  const isCartPage = window.location.pathname.includes("cart.html");
  if (isCartPage) {
    console.log("Initializing cart table on cart.html");
    updateCartTable();
  }
});