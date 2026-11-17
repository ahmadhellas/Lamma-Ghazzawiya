// =====================================
// CART PAGE - LAMMA GHAZZAWIYA
// =====================================

// عناصر الصفحة
const cartItemsContainer = document.getElementById("cart-items");
const cartLayout = document.getElementById("cart-layout");
const emptyCart = document.getElementById("empty-cart");

const cartItemsCount = document.getElementById("cart-items-count");
const summaryQuantity = document.getElementById("summary-quantity");

const subtotalElement = document.getElementById("subtotal");
const deliveryFeeElement = document.getElementById("delivery-fee");
const grandTotalElement = document.getElementById("grand-total");

const clearCartButton = document.getElementById("clear-cart");
const checkoutButton = document.getElementById("checkout-btn");

const DELIVERY_FEE = 10;

// قراءة السلة
function getCartItems() {
  const cart = Storage.get("cart");
  return Array.isArray(cart) ? cart : [];
}

// حفظ السلة
function saveCartItems(cart) {
  Storage.set("cart", cart);
}

// تنسيق السعر
function formatCartPrice(price) {
  return `${Number(price).toFixed(2).replace(/\.00$/, "")} ₪`;
}

// عرض المنتجات
function renderCart() {
  const cart = getCartItems();

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartLayout.hidden = true;
    emptyCart.hidden = false;

    updateCartSummary([]);
    updateCartBadge(0);

    return;
  }

  cartLayout.hidden = false;
  emptyCart.hidden = true;

  cart.forEach((item) => {
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const price = Number(item.price) || 0;
    const itemTotal = price * quantity;

    const cartItem = document.createElement("div");

    cartItem.className = "cart-item";

    cartItem.innerHTML = `
            <div class="cart-product">
                <img
                    src="${item.image || "https://placehold.co/200x200/493026/F3E5CC?text=Food"}"
                    alt="${item.name}"
                    onerror="this.src='https://placehold.co/200x200/493026/F3E5CC?text=Food'"
                >

                <div class="cart-product-info">
                    <h3>${item.name}</h3>
                    <span>وجبة من لمة غزّاوية</span>

                    <button class="remove-item" data-id="${item.id}">
                        <i class="fa-regular fa-trash-can"></i>
                        حذف الوجبة
                    </button>
                </div>
            </div>

            <div class="cart-item-price">
                ${formatCartPrice(price)}
            </div>

            <div class="cart-quantity">
                <button
                    class="increase-cart-item"
                    data-id="${item.id}"
                    aria-label="زيادة الكمية"
                >
                    <i class="fa-solid fa-plus"></i>
                </button>

                <span>${quantity}</span>

                <button
                    class="decrease-cart-item"
                    data-id="${item.id}"
                    aria-label="تقليل الكمية"
                >
                    <i class="fa-solid fa-minus"></i>
                </button>
            </div>

            <div class="cart-item-total">
                ${formatCartPrice(itemTotal)}
            </div>
        `;

    cartItemsContainer.appendChild(cartItem);
  });

  updateCartSummary(cart);
  updateCartBadge(cart);
}

// حساب المجموع وتحديث الملخص
function updateCartSummary(cart) {
  const totalQuantity = cart.reduce((total, item) => {
    return total + Math.max(1, Number(item.quantity) || 1);
  }, 0);

  const subtotal = cart.reduce((total, item) => {
    return (
      total +
      (Number(item.price) || 0) * Math.max(1, Number(item.quantity) || 1)
    );
  }, 0);

  const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
  const grandTotal = subtotal + deliveryFee;

  cartItemsCount.textContent = `${totalQuantity} منتجات`;
  summaryQuantity.textContent = totalQuantity;

  subtotalElement.textContent = formatCartPrice(subtotal);
  deliveryFeeElement.textContent = formatCartPrice(deliveryFee);
  grandTotalElement.textContent = formatCartPrice(grandTotal);

  checkoutButton.classList.toggle("disabled", cart.length === 0);
  checkoutButton.setAttribute("aria-disabled", cart.length === 0);
}

// تحديث عداد السلة في Navbar
function updateCartBadge(cartOrCount) {
  let total = 0;

  if (Array.isArray(cartOrCount)) {
    total = cartOrCount.reduce((sum, item) => {
      return sum + Math.max(1, Number(item.quantity) || 1);
    }, 0);
  } else {
    total = Number(cartOrCount) || 0;
  }

  const badge = document.getElementById("cart-count");

  if (badge) {
    badge.textContent = total;
  }
}

// زيادة أو تقليل الكمية أو حذف الوجبة
cartItemsContainer.addEventListener("click", (event) => {
  const increaseButton = event.target.closest(".increase-cart-item");
  const decreaseButton = event.target.closest(".decrease-cart-item");
  const removeButton = event.target.closest(".remove-item");

  const clickedButton = increaseButton || decreaseButton || removeButton;

  if (!clickedButton) return;

  const itemId = Number(clickedButton.dataset.id);
  let cart = getCartItems();

  const item = cart.find((product) => Number(product.id) === itemId);

  if (!item) return;

  if (increaseButton) {
    item.quantity = Math.max(1, Number(item.quantity) || 1) + 1;
  }

  if (decreaseButton) {
    item.quantity = Math.max(1, Number(item.quantity) || 1) - 1;
  }

  if (removeButton) {
    cart = cart.filter((product) => Number(product.id) !== itemId);
  }

  saveCartItems(cart);
  renderCart();
});

// إفراغ السلة
clearCartButton.addEventListener("click", () => {
  const cart = getCartItems();

  if (cart.length === 0) return;

  const confirmed = confirm("هل أنت متأكد من إفراغ سلة المشتريات؟");

  if (!confirmed) return;

  saveCartItems([]);
  renderCart();

  if (typeof showNotification === "function") {
    showNotification("تم إفراغ سلة المشتريات");
  }
});

// منع الانتقال للدفع إذا كانت السلة فارغة
checkoutButton.addEventListener("click", (event) => {
  if (getCartItems().length === 0) {
    event.preventDefault();
  }
});

// تشغيل الصفحة
renderCart();
