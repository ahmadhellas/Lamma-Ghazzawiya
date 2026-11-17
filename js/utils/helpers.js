/* ========================================
   GENERAL HELPER FUNCTIONS
======================================== */

// Select one element
function selectElement(selector, parent = document) {
  return parent.querySelector(selector);
}

// Select multiple elements
function selectAll(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

// Format prices
function formatPrice(price) {
  return new Intl.NumberFormat("ar-PS", {
    style: "currency",
    currency: "ILS",
  }).format(price);
}

// Show notification
function showNotification(message, type = "success") {
  const oldNotification = document.querySelector(".notification");

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement("div");

  notification.className = `notification ${type}`;

  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");

    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Get URL parameter
function getURLParameter(name) {
  const params = new URLSearchParams(window.location.search);

  return params.get(name);
}
