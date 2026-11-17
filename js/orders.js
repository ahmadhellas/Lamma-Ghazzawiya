// =====================================
// MY ORDERS - LAMMA GHAZZAWIYA
// =====================================

// عناصر الصفحة
const ordersList = document.getElementById("orders-list");
const ordersEmpty = document.getElementById("orders-empty");
const ordersNoResults = document.getElementById("orders-no-results");

const searchInput = document.getElementById("orders-search");
const filterSelect = document.getElementById("orders-filter");
const sortSelect = document.getElementById("orders-sort");

const orderModal = document.getElementById("order-modal");
const orderModalBody = document.getElementById("order-modal-body");

// قراءة المستخدم الحالي
const loggedInUser = Storage.get("currentUser");

// قراءة الطلبات
let allOrders = Storage.get("orders") || [];

// =====================================
// HELPERS
// =====================================

// حماية النصوص عند إضافتها إلى HTML
function escapeOrderHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

// تنسيق السعر
function orderPrice(value) {
  const number = Number(value);

  return `${Number.isFinite(number) ? number.toFixed(2) : "0.00"} ₪`;
}

// قراءة تاريخ الطلب
function getOrderDate(order) {
  const dateValue =
    order.date || order.createdAt || order.orderDate || order.created_at || "";

  if (!dateValue) return null;

  const date = new Date(dateValue);

  return Number.isNaN(date.getTime()) ? null : date;
}

// تنسيق التاريخ
function formatOrderDate(order) {
  const date = getOrderDate(order);

  if (!date) return "تاريخ غير محدد";

  return new Intl.DateTimeFormat("ar-PS", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// الحصول على رقم الطلب
function getOrderId(order) {
  return order.id || order.orderId || order.orderNumber || "غير محدد";
}

// الحصول على عناصر الطلب
function getOrderItems(order) {
  const items = order.items || order.cart || order.products || [];

  return Array.isArray(items) ? items : [];
}

// الحصول على اسم الوجبة
function getItemName(item) {
  return item.name || item.title || item.foodName || item.productName || "وجبة";
}

// الحصول على صورة الوجبة
function getItemImage(item) {
  return (
    item.image ||
    item.imageUrl ||
    item.img ||
    "https://placehold.co/100x100/493026/F3E5CC?text=Food"
  );
}

// الحصول على سعر الوجبة
function getItemPrice(item) {
  return Number(item.price ?? item.salePrice ?? item.unitPrice ?? 0) || 0;
}

// الحصول على كمية الوجبة
function getItemQuantity(item) {
  return Math.max(1, Number(item.quantity ?? item.qty ?? 1) || 1);
}

// حساب مجموع العناصر
function calculateItemsTotal(order) {
  return getOrderItems(order).reduce((total, item) => {
    return total + getItemPrice(item) * getItemQuantity(item);
  }, 0);
}

// الحصول على المبلغ الإجمالي
function getOrderTotal(order) {
  const total = Number(
    order.total ?? order.totalPrice ?? order.grandTotal ?? order.finalTotal,
  );

  return Number.isFinite(total) ? total : calculateItemsTotal(order);
}

// الحصول على رسوم التوصيل
function getDeliveryFee(order) {
  return (
    Number(order.deliveryFee ?? order.delivery ?? order.shipping ?? 0) || 0
  );
}

// الحصول على المجموع قبل التوصيل
function getSubtotal(order) {
  const subtotal = Number(order.subtotal ?? order.subTotal ?? order.itemsTotal);

  if (Number.isFinite(subtotal)) return subtotal;

  return Math.max(0, getOrderTotal(order) - getDeliveryFee(order));
}

// =====================================
// ORDER STATUS
// =====================================

function getOrderStatus(order) {
  const rawStatus = String(order.status || order.orderStatus || "pending")
    .toLowerCase()
    .trim();

  const statuses = {
    pending: {
      key: "pending",
      label: "قيد المراجعة",
      className: "status-pending",
    },

    new: {
      key: "pending",
      label: "قيد المراجعة",
      className: "status-pending",
    },

    processing: {
      key: "processing",
      label: "قيد التجهيز",
      className: "status-processing",
    },

    preparing: {
      key: "processing",
      label: "قيد التجهيز",
      className: "status-processing",
    },

    completed: {
      key: "completed",
      label: "مكتمل",
      className: "status-completed",
    },

    delivered: {
      key: "completed",
      label: "تم التوصيل",
      className: "status-completed",
    },

    cancelled: {
      key: "cancelled",
      label: "ملغي",
      className: "status-cancelled",
    },

    canceled: {
      key: "cancelled",
      label: "ملغي",
      className: "status-cancelled",
    },
  };

  return (
    statuses[rawStatus] || {
      key: "pending",
      label: "قيد المراجعة",
      className: "status-unknown",
    }
  );
}

// =====================================
// USER ORDERS
// =====================================

function getUserOrders() {
  if (!Array.isArray(allOrders)) {
    allOrders = [];
  }

  // إذا لم يكن المستخدم مسجلًا، لا نعرض تفاصيل الطلبات
  if (!loggedInUser) {
    return [];
  }

  const userEmail = String(loggedInUser.email || "").toLowerCase();

  // نربط الطلبات بالبريد الإلكتروني إن كان محفوظًا داخل الطلب.
  // الطلبات القديمة التي لا تحتوي على بريد تبقى ظاهرة.
  return allOrders.filter((order) => {
    const customer = order.customer || order.customerInfo || order.user || {};

    const orderEmail = String(
      order.email || order.customerEmail || customer.email || "",
    ).toLowerCase();

    return !orderEmail || orderEmail === userEmail;
  });
}

// =====================================
// STATISTICS
// =====================================

function updateOrderStatistics(orders) {
  const total = orders.length;

  const pending = orders.filter((order) => {
    return (
      getOrderStatus(order).key === "pending" ||
      getOrderStatus(order).key === "processing"
    );
  }).length;

  const completed = orders.filter((order) => {
    return getOrderStatus(order).key === "completed";
  }).length;

  const spent = orders.reduce((sum, order) => {
    return sum + getOrderTotal(order);
  }, 0);

  document.getElementById("total-orders").textContent = total;

  document.getElementById("pending-orders").textContent = pending;

  document.getElementById("completed-orders").textContent = completed;

  document.getElementById("total-spent").textContent = orderPrice(spent);

  document.getElementById("orders-count-label").textContent =
    `${total} ${total === 1 ? "طلب" : "طلبات"}`;
}

// =====================================
// ORDER CARD
// =====================================

function createOrderCard(order) {
  const id = getOrderId(order);
  const status = getOrderStatus(order);
  const items = getOrderItems(order);
  const total = getOrderTotal(order);

  const itemsPreview = items
    .slice(0, 3)
    .map((item) => {
      const name = escapeOrderHTML(getItemName(item));
      const image = escapeOrderHTML(getItemImage(item));
      const quantity = getItemQuantity(item);

      return `
            <div class="order-item-chip">
                <img src="${image}" alt="${name}"
                     onerror="this.src='https://placehold.co/100x100/493026/F3E5CC?text=Food'">

                <div>
                    <strong>${name}</strong>
                    <small>الكمية: ${quantity}</small>
                </div>
            </div>
        `;
    })
    .join("");

  const moreItems =
    items.length > 3
      ? `<span class="order-more-items">+ ${items.length - 3} وجبات أخرى</span>`
      : "";

  return `
        <article class="order-card">

            <div class="order-card-header">
                <div>
                    <span class="order-number-label">رقم الطلب</span>
                    <strong class="order-number">#${escapeOrderHTML(id)}</strong>
                    <span class="order-date">${escapeOrderHTML(formatOrderDate(order))}</span>
                </div>

                <span class="order-status ${status.className}">
                    ${status.label}
                </span>
            </div>

            <div class="order-card-body">

                <div class="order-items-preview">
                    ${itemsPreview || "<span>لا توجد تفاصيل للوجبات</span>"}
                    ${moreItems}
                </div>

                <div class="order-total">
                    <span>المبلغ الإجمالي</span>
                    <strong>${orderPrice(total)}</strong>
                </div>

            </div>

            <div class="order-card-footer">
                <span class="order-items-count">
                    <i class="fa-solid fa-bag-shopping"></i>
                    ${items.length} وجبة
                </span>

                <button
                    type="button"
                    class="order-details-btn"
                    data-order-id="${escapeOrderHTML(id)}"
                >
                    عرض التفاصيل
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
            </div>

        </article>
    `;
}

// =====================================
// RENDER ORDERS
// =====================================

function renderOrders() {
  const userOrders = getUserOrders();

  updateOrderStatistics(userOrders);

  // لا يوجد مستخدم مسجل
  if (!loggedInUser) {
    ordersList.innerHTML = "";
    ordersEmpty.hidden = false;
    ordersNoResults.hidden = true;

    ordersEmpty.querySelector("h3").textContent = "سجل الدخول لمشاهدة طلباتك";

    ordersEmpty.querySelector("p").textContent =
      "يجب تسجيل الدخول أولًا حتى تتمكن من متابعة طلباتك.";

    ordersEmpty.querySelector("a").href = "login.html";
    ordersEmpty.querySelector("a").innerHTML =
      'تسجيل الدخول <i class="fa-solid fa-arrow-left"></i>';

    return;
  }

  // لا توجد طلبات
  if (userOrders.length === 0) {
    ordersList.innerHTML = "";
    ordersEmpty.hidden = false;
    ordersNoResults.hidden = true;

    return;
  }

  ordersEmpty.hidden = true;

  // البحث
  const searchValue = searchInput.value.trim().toLowerCase();

  let filteredOrders = userOrders.filter((order) => {
    const id = String(getOrderId(order)).toLowerCase();

    return id.includes(searchValue);
  });

  // الفلترة حسب الحالة
  const selectedStatus = filterSelect.value;

  if (selectedStatus !== "all") {
    filteredOrders = filteredOrders.filter((order) => {
      return getOrderStatus(order).key === selectedStatus;
    });
  }

  // الترتيب
  switch (sortSelect.value) {
    case "newest":
      filteredOrders.sort((a, b) => {
        return (
          (getOrderDate(b)?.getTime() || 0) - (getOrderDate(a)?.getTime() || 0)
        );
      });
      break;

    case "oldest":
      filteredOrders.sort((a, b) => {
        return (
          (getOrderDate(a)?.getTime() || 0) - (getOrderDate(b)?.getTime() || 0)
        );
      });
      break;

    case "highest":
      filteredOrders.sort((a, b) => {
        return getOrderTotal(b) - getOrderTotal(a);
      });
      break;

    case "lowest":
      filteredOrders.sort((a, b) => {
        return getOrderTotal(a) - getOrderTotal(b);
      });
      break;
  }

  // لا توجد نتائج
  if (filteredOrders.length === 0) {
    ordersList.innerHTML = "";
    ordersNoResults.hidden = false;
    return;
  }

  ordersNoResults.hidden = true;

  ordersList.innerHTML = filteredOrders.map(createOrderCard).join("");
}

// =====================================
// ORDER DETAILS MODAL
// =====================================

function showOrderDetails(orderId) {
  const orders = getUserOrders();

  const order = orders.find((item) => {
    return String(getOrderId(item)) === String(orderId);
  });

  if (!order) return;

  const items = getOrderItems(order);
  const status = getOrderStatus(order);

  document.getElementById("modal-order-title").textContent =
    `طلب رقم #${getOrderId(order)}`;

  const customer = order.customer || order.customerInfo || order.user || {};

  const customerName =
    order.customerName ||
    customer.name ||
    order.name ||
    loggedInUser?.name ||
    "غير محدد";

  const customerPhone =
    order.phone ||
    order.customerPhone ||
    customer.phone ||
    loggedInUser?.phone ||
    "غير محدد";

  const address =
    order.address || order.customerAddress || customer.address || "غير محدد";

  const itemsHTML = items
    .map((item) => {
      const name = escapeOrderHTML(getItemName(item));
      const image = escapeOrderHTML(getItemImage(item));
      const quantity = getItemQuantity(item);
      const price = getItemPrice(item);
      const itemTotal = price * quantity;

      return `
            <div class="modal-order-item">

                <img
                    src="${image}"
                    alt="${name}"
                    onerror="this.src='https://placehold.co/100x100/493026/F3E5CC?text=Food'"
                >

                <div class="modal-order-item-info">
                    <strong>${name}</strong>
                    <small>${orderPrice(price)} × ${quantity}</small>
                </div>

                <span class="modal-order-item-price">
                    ${orderPrice(itemTotal)}
                </span>

            </div>
        `;
    })
    .join("");

  const subtotal = getSubtotal(order);
  const delivery = getDeliveryFee(order);
  const total = getOrderTotal(order);

  orderModalBody.innerHTML = `
        <h3 class="modal-section-title">معلومات الطلب</h3>

        <div class="modal-order-info">

            <div class="modal-info-item">
                <span>رقم الطلب</span>
                <strong>#${escapeOrderHTML(getOrderId(order))}</strong>
            </div>

            <div class="modal-info-item">
                <span>تاريخ الطلب</span>
                <strong>${escapeOrderHTML(formatOrderDate(order))}</strong>
            </div>

            <div class="modal-info-item">
                <span>حالة الطلب</span>
                <strong>${status.label}</strong>
            </div>

            <div class="modal-info-item">
                <span>اسم العميل</span>
                <strong>${escapeOrderHTML(customerName)}</strong>
            </div>

            <div class="modal-info-item">
                <span>رقم الهاتف</span>
                <strong>${escapeOrderHTML(customerPhone)}</strong>
            </div>

            <div class="modal-info-item">
                <span>العنوان</span>
                <strong>${escapeOrderHTML(address)}</strong>
            </div>

        </div>

        <h3 class="modal-section-title">الوجبات المطلوبة</h3>

        <div class="modal-order-items">
            ${itemsHTML || "<p>لا توجد تفاصيل للوجبات.</p>"}
        </div>

        <h3 class="modal-section-title">ملخص الحساب</h3>

        <div class="modal-order-summary">

            <div class="modal-summary-row">
                <span>مجموع الوجبات</span>
                <strong>${orderPrice(subtotal)}</strong>
            </div>

            <div class="modal-summary-row">
                <span>رسوم التوصيل</span>
                <strong>${orderPrice(delivery)}</strong>
            </div>

            <div class="modal-summary-row final-total">
                <span>الإجمالي النهائي</span>
                <strong>${orderPrice(total)}</strong>
            </div>

        </div>
    `;

  orderModal.classList.add("open");
  orderModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

// إغلاق نافذة التفاصيل
function closeOrderModal() {
  orderModal.classList.remove("open");
  orderModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document
  .getElementById("close-order-modal")
  .addEventListener("click", closeOrderModal);

document
  .getElementById("order-modal-overlay")
  .addEventListener("click", closeOrderModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && orderModal.classList.contains("open")) {
    closeOrderModal();
  }
});

// =====================================
// EVENTS
// =====================================

// فتح تفاصيل الطلب
ordersList.addEventListener("click", (event) => {
  const button = event.target.closest(".order-details-btn");

  if (!button) return;

  showOrderDetails(button.dataset.orderId);
});

// البحث
searchInput.addEventListener("input", renderOrders);

// الفلاتر
filterSelect.addEventListener("change", renderOrders);
sortSelect.addEventListener("change", renderOrders);

// إعادة ضبط البحث والفلاتر
document.getElementById("reset-orders-filter").addEventListener("click", () => {
  searchInput.value = "";
  filterSelect.value = "all";
  sortSelect.value = "newest";

  renderOrders();
});

// =====================================
// USER NAME
// =====================================

if (loggedInUser) {
  document.getElementById("orders-user-name").textContent =
    loggedInUser.name || "عميلنا العزيز";
}

// =====================================
// INITIALIZE
// =====================================

renderOrders();
