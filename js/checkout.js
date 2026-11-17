// =====================================
// CHECKOUT PAGE - LAMMA GHAZZAWIYA
// =====================================

const DELIVERY_FEE = 10;

// عناصر الصفحة
const checkoutForm = document.getElementById("checkout-form");
const checkoutLayout = document.getElementById("checkout-layout");
const checkoutEmpty = document.getElementById("checkout-empty");
const orderSuccess = document.getElementById("order-success");

const checkoutItems = document.getElementById("checkout-items");

const subtotalElement = document.getElementById("checkout-subtotal");
const deliveryElement = document.getElementById("checkout-delivery");
const totalElement = document.getElementById("checkout-total");

const placeOrderButton = document.getElementById("place-order-btn");

// قراءة السلة
function getCheckoutCart() {
  const cart = Storage.get("cart");
  return Array.isArray(cart) ? cart : [];
}

// تنسيق السعر
function formatCheckoutPrice(price) {
  return `${Number(price).toFixed(2).replace(/\.00$/, "")} ₪`;
}

// حساب المجموع
function calculateCheckoutTotals(cart) {
  const subtotal = cart.reduce((total, item) => {
    return (
      total +
      (Number(item.price) || 0) * Math.max(1, Number(item.quantity) || 1)
    );
  }, 0);

  const delivery = cart.length > 0 ? DELIVERY_FEE : 0;

  return {
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
}

// تحديث عداد السلة
function updateCheckoutCartBadge() {
  const cart = getCheckoutCart();

  const count = cart.reduce((total, item) => {
    return total + Math.max(1, Number(item.quantity) || 1);
  }, 0);

  const badge = document.getElementById("cart-count");

  if (badge) {
    badge.textContent = count;
  }
}

// عرض عناصر الطلب
function renderCheckoutItems() {
  const cart = getCheckoutCart();

  if (cart.length === 0) {
    checkoutLayout.hidden = true;
    checkoutEmpty.hidden = false;
    return;
  }

  checkoutLayout.hidden = false;
  checkoutEmpty.hidden = true;

  checkoutItems.innerHTML = "";

  cart.forEach((item) => {
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const price = Number(item.price) || 0;

    const itemElement = document.createElement("div");

    itemElement.className = "checkout-item";

    itemElement.innerHTML = `
            <img
                src="${item.image || "https://placehold.co/200x200/493026/F3E5CC?text=Food"}"
                alt="${item.name}"
                onerror="this.src='https://placehold.co/200x200/493026/F3E5CC?text=Food'"
            >

            <div class="checkout-item-info">
                <h4>${item.name}</h4>
                <span>الكمية: ${quantity}</span>
            </div>

            <span class="checkout-item-price">
                ${formatCheckoutPrice(price * quantity)}
            </span>
        `;

    checkoutItems.appendChild(itemElement);
  });

  const totals = calculateCheckoutTotals(cart);

  subtotalElement.textContent = formatCheckoutPrice(totals.subtotal);
  deliveryElement.textContent = formatCheckoutPrice(totals.delivery);
  totalElement.textContent = formatCheckoutPrice(totals.total);
}

// عرض وإخفاء أخطاء الحقول
function showFieldError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  const field = document.getElementById(fieldId);
  const group = field.closest(".form-group");

  errorElement.textContent = message;
  group.classList.toggle("invalid", message !== "");

  field.setAttribute("aria-invalid", message ? "true" : "false");
}

// التحقق من بيانات النموذج
function validateCheckoutForm() {
  let isValid = true;

  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const email = document.getElementById("customer-email").value.trim();
  const city = document.getElementById("customer-city").value.trim();
  const address = document.getElementById("customer-address").value.trim();

  // الاسم
  if (name.length < 3) {
    showFieldError("customer-name", "يرجى إدخال اسم صحيح (3 أحرف على الأقل).");
    isValid = false;
  } else {
    showFieldError("customer-name", "");
  }

  // الهاتف
  const normalizedPhone = phone.replace(/[\s()-]/g, "");

  if (!/^\+?\d{9,15}$/.test(normalizedPhone)) {
    showFieldError("customer-phone", "يرجى إدخال رقم هاتف صحيح.");
    isValid = false;
  } else {
    showFieldError("customer-phone", "");
  }

  // البريد الإلكتروني - اختياري
  if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError("customer-email", "يرجى إدخال بريد إلكتروني صحيح.");
    isValid = false;
  } else {
    showFieldError("customer-email", "");
  }

  // المدينة
  if (city.length < 2) {
    showFieldError("customer-city", "يرجى إدخال اسم المدينة أو المنطقة.");
    isValid = false;
  } else {
    showFieldError("customer-city", "");
  }

  // العنوان
  if (address.length < 5) {
    showFieldError("customer-address", "يرجى إدخال عنوان تفصيلي.");
    isValid = false;
  } else {
    showFieldError("customer-address", "");
  }

  return isValid;
}

// تحديث شكل اختيار طريقة الدفع
function setupPaymentOptions() {
  const paymentOptions = document.querySelectorAll(".payment-option");

  paymentOptions.forEach((option) => {
    const radio = option.querySelector('input[type="radio"]');

    radio.addEventListener("change", () => {
      paymentOptions.forEach((item) => {
        item.classList.remove("selected");
      });

      if (radio.checked) {
        option.classList.add("selected");
      }
    });
  });
}

// إنشاء رقم الطلب
function generateOrderId() {
  return "LG-" + Date.now().toString().slice(-9);
}

// حفظ الطلب
function saveNewOrder(customerData, cart, paymentMethod) {
  const totals = calculateCheckoutTotals(cart);

  const order = {
    id: generateOrderId(),

    date: new Date().toISOString(),

    customer: {
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
      city: customerData.city,
      address: customerData.address,
    },

    notes: customerData.notes,

    paymentMethod: paymentMethod,

    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image: item.image,
      quantity: Math.max(1, Number(item.quantity) || 1),
    })),

    subtotal: totals.subtotal,
    deliveryFee: totals.delivery,
    total: totals.total,

    status: "pending",
  };

  // قراءة الطلبات السابقة
  const previousOrders = Storage.get("orders") || [];

  // إضافة الطلب الجديد
  previousOrders.unshift(order);

  // حفظ جميع الطلبات
  Storage.set("orders", previousOrders);

  return order;
}

// عرض رسالة نجاح الطلب
function showOrderSuccess(orderId) {
  checkoutLayout.hidden = true;
  checkoutEmpty.hidden = true;
  orderSuccess.hidden = false;

  document.getElementById("success-order-id").textContent = orderId;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// إرسال النموذج
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const cart = getCheckoutCart();

  // التأكد من وجود منتجات
  if (cart.length === 0) {
    checkoutLayout.hidden = true;
    checkoutEmpty.hidden = false;
    return;
  }

  // التحقق من البيانات
  if (!validateCheckoutForm()) {
    const firstInvalid = checkoutForm.querySelector('[aria-invalid="true"]');

    if (firstInvalid) {
      firstInvalid.focus();
    }

    return;
  }

  // قراءة بيانات العميل
  const customerData = {
    name: document.getElementById("customer-name").value.trim(),

    phone: document.getElementById("customer-phone").value.trim(),

    email: document.getElementById("customer-email").value.trim(),

    city: document.getElementById("customer-city").value.trim(),

    address: document.getElementById("customer-address").value.trim(),

    notes: document.getElementById("order-notes").value.trim(),
  };

  // طريقة الدفع
  const selectedPayment = document.querySelector(
    'input[name="payment"]:checked',
  );

  const paymentMethod = selectedPayment ? selectedPayment.value : "cash";

  // منع الضغط المتكرر
  placeOrderButton.disabled = true;

  try {
    // حفظ الطلب
    const newOrder = saveNewOrder(customerData, cart, paymentMethod);

    // إفراغ السلة بعد نجاح الحفظ
    Storage.set("cart", []);

    // تحديث العداد
    updateCheckoutCartBadge();

    // إظهار النجاح
    showOrderSuccess(newOrder.id);
  } catch (error) {
    console.error("Order saving error:", error);

    alert("حدث خطأ أثناء حفظ الطلب. حاول مرة أخرى.");

    placeOrderButton.disabled = false;
  }
});

// عند تعديل أي حقل، إزالة الخطأ بعد تصحيحه
checkoutForm.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    const group = field.closest(".form-group");

    if (group) {
      group.classList.remove("invalid");

      const error = group.querySelector(".field-error");

      if (error) {
        error.textContent = "";
      }

      field.removeAttribute("aria-invalid");
    }
  });
});

// تشغيل الصفحة
renderCheckoutItems();
updateCheckoutCartBadge();
setupPaymentOptions();
