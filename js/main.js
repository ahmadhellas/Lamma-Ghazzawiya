/* ========================================
   MAIN JAVASCRIPT
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      menuToggle.classList.toggle("active");
    });
  }

  // Close mobile menu after clicking a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks?.classList.remove("active");

      menuToggle?.classList.remove("active");
    });
  });

  // Update cart counter
  updateCartCounter();

  // Current year
  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

// Update cart counter
function updateCartCounter() {
  const cart = Storage.get("cart", []);

  const totalItems = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  document.querySelectorAll(".cart-count").forEach((counter) => {
    counter.textContent = totalItems;
  });
}
