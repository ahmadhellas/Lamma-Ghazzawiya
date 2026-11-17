"use strict";

/* =========================================
   إعدادات نظام الطلبات
========================================= */

const ORDERS_STORAGE_KEY = "lammaOrders";

const orderStatuses = {
  new: "جديد",
  preparing: "قيد التحضير",
  ready: "جاهز",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const paymentMethods = {
  cash: "نقدًا عند الاستلام",
  card: "بطاقة",
};

/* =========================================
   بيانات تجريبية
========================================= */

const defaultOrders = [
  {
    id: 1001,
    customer: "أحمد محمد",
    phone: "0599000001",
    address: "غزة - الرمال",
    date: "2026-11-15 12:30",
    payment: "cash",
    status: "new",
    notes: "يرجى الاتصال قبل الوصول",
    items: [
      { name: "مشاوي مشكلة", price: 85, quantity: 2 },
      { name: "حمص بالطحينة", price: 18, quantity: 1 },
    ],
  },
  {
    id: 1002,
    customer: "محمد علي",
    phone: "0599000002",
    address: "غزة - النصر",
    date: "2026-11-15 13:15",
    payment: "card",
    status: "preparing",
    notes: "",
    items: [
      { name: "مقلوبة فلسطينية", price: 55, quantity: 2 },
      { name: "عصير برتقال طبيعي", price: 12, quantity: 2 },
    ],
  },
  {
    id: 1003,
    customer: "سارة خالد",
    phone: "0599000003",
    address: "غزة - الشاطئ",
    date: "2026-11-15 14:00",
    payment: "cash",
    status: "ready",
    notes: "بدون بصل",
    items: [
      { name: "مشاوي مشكلة", price: 85, quantity: 1 },
      { name: "كنافة نابلسية", price: 25, quantity: 2 },
    ],
  },
  {
    id: 1004,
    customer: "عمر حسن",
    phone: "0599000004",
    address: "غزة - تل الهوى",
    date: "2026-11-15 15:20",
    payment: "card",
    status: "delivered",
    notes: "",
    items: [
      { name: "مقلوبة فلسطينية", price: 55, quantity: 1 },
      { name: "حمص بالطحينة", price: 18, quantity: 2 },
    ],
  },
  {
    id: 1005,
    customer: "نور أحمد",
    phone: "0599000005",
    address: "غزة - الشيخ رضوان",
    date: "2026-11-15 16:10",
    payment: "cash",
    status: "cancelled",
    notes: "تم إلغاء الطلب من العميل",
    items: [{ name: "مشاوي مشكلة", price: 85, quantity: 1 }],
  },
];

/* =========================================
   أدوات مساعدة
========================================= */

function getOrders() {
  try {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);

    if (savedOrders === null) {
      saveOrders(defaultOrders);
      return [...defaultOrders];
    }

    const orders = JSON.parse(savedOrders);

    return Array.isArray(orders) ? orders : [...defaultOrders];
  } catch (error) {
    console.error("Error loading orders:", error);
    return [...defaultOrders];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function escapeHTML(value) {
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

function getOrderTotal(order) {
  if (!Array.isArray(order.items)) return 0;

  return order.items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;

    return total + price * quantity;
  }, 0);
}

function getOrderItemsCount(order) {
  if (!Array.isArray(order.items)) return 0;

  return order.items.reduce((total, item) => {
    return total + (Number(item.quantity) || 0);
  }, 0);
}

function formatPrice(price) {
  return `${Number(price).toFixed(2)} ₪`;
}

/* =========================================
   تحديث الإحصائيات
========================================= */

function updateOrderStatistics(orders) {
  const total = orders.length;

  const newCount = orders.filter((order) => order.status === "new").length;

  const preparingCount = orders.filter(
    (order) => order.status === "preparing",
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const sales = orders
    .filter((order) => order.status === "delivered")
    .reduce((totalSales, order) => {
      return totalSales + getOrderTotal(order);
    }, 0);

  document.getElementById("totalOrders").textContent = total;

  document.getElementById("newOrders").textContent = newCount;

  document.getElementById("preparingOrders").textContent = preparingCount;

  document.getElementById("deliveredOrders").textContent = deliveredCount;

  document.getElementById("totalSales").textContent = formatPrice(sales);
}

/* =========================================
   عرض الطلبات في الجدول
========================================= */

function renderOrders() {
  const tableBody = document.getElementById("ordersTableBody");

  if (!tableBody) return;

  const orders = getOrders();

  const searchValue = document
    .getElementById("orderSearch")
    .value.trim()
    .toLowerCase();

  const statusValue = document.getElementById("orderStatusFilter").value;

  const paymentValue = document.getElementById("orderPaymentFilter").value;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      String(order.id).includes(searchValue) ||
      String(order.customer).toLowerCase().includes(searchValue);

    const matchesStatus = statusValue === "all" || order.status === statusValue;

    const matchesPayment =
      paymentValue === "all" || order.payment === paymentValue;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  updateOrderStatistics(orders);

  const emptyMessage = document.getElementById("emptyOrders");

  if (filteredOrders.length === 0) {
    tableBody.innerHTML = "";
    emptyMessage.classList.remove("hidden");
    return;
  }

  emptyMessage.classList.add("hidden");

  tableBody.innerHTML = filteredOrders
    .map((order) => {
      const statusText = orderStatuses[order.status] || "غير معروف";

      const paymentText = paymentMethods[order.payment] || "غير محدد";

      return `
            <tr>

                <td>
                    <span class="order-number">
                        #${Number(order.id)}
                    </span>
                </td>

                <td>
                    <span class="customer-name">
                        ${escapeHTML(order.customer)}
                    </span>
                </td>

                <td>${escapeHTML(order.date)}</td>

                <td>${getOrderItemsCount(order)}</td>

                <td>
                    <span class="order-total">
                        ${formatPrice(getOrderTotal(order))}
                    </span>
                </td>

                <td>
                    <span class="payment-label">
                        ${escapeHTML(paymentText)}
                    </span>
                </td>

                <td>
                    <select
                        class="order-status-select"
                        data-order-status="${Number(order.id)}"
                        aria-label="تغيير حالة الطلب ${Number(order.id)}"
                    >
                        ${Object.entries(orderStatuses)
                          .map(
                            ([key, value]) => `
                            <option
                                value="${key}"
                                ${order.status === key ? "selected" : ""}
                            >
                                ${value}
                            </option>
                        `,
                          )
                          .join("")}
                    </select>
                </td>

                <td>
                    <button
                        class="order-view-btn"
                        data-view-order="${Number(order.id)}"
                    >
                        عرض التفاصيل
                    </button>
                </td>

            </tr>
        `;
    })
    .join("");
}

/* =========================================
   تغيير حالة الطلب
========================================= */

function changeOrderStatus(orderId, newStatus) {
  if (!Object.hasOwn(orderStatuses, newStatus)) {
    return;
  }

  const orders = getOrders();

  const order = orders.find((item) => Number(item.id) === Number(orderId));

  if (!order) return;

  order.status = newStatus;

  saveOrders(orders);

  renderOrders();
}

/* =========================================
   فتح تفاصيل الطلب
========================================= */

function showOrderDetails(orderId) {
  const orders = getOrders();

  const order = orders.find((item) => Number(item.id) === Number(orderId));

  if (!order) return;

  const modal = document.getElementById("orderModal");

  const detailsContent = document.getElementById("orderDetailsContent");

  document.getElementById("modalOrderNumber").textContent =
    `رقم الطلب: #${order.id}`;

  const itemsHTML = (order.items || [])
    .map((item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const subtotal = quantity * price;

      return `
            <div class="order-item-row">
                <span>
                    ${escapeHTML(item.name)}
                    × ${quantity}
                </span>

                <strong>${formatPrice(subtotal)}</strong>
            </div>
        `;
    })
    .join("");

  detailsContent.innerHTML = `

        <section class="order-detail-section">

            <h3>معلومات العميل</h3>

            <div class="order-detail-grid">

                <div class="order-detail-item">
                    <span>اسم العميل</span>
                    <strong>${escapeHTML(order.customer)}</strong>
                </div>

                <div class="order-detail-item">
                    <span>رقم الهاتف</span>
                    <strong>${escapeHTML(order.phone)}</strong>
                </div>

                <div class="order-detail-item">
                    <span>عنوان التوصيل</span>
                    <strong>${escapeHTML(order.address)}</strong>
                </div>

                <div class="order-detail-item">
                    <span>تاريخ الطلب</span>
                    <strong>${escapeHTML(order.date)}</strong>
                </div>

            </div>

        </section>

        <section class="order-detail-section">

            <h3>الوجبات المطلوبة</h3>

            <div class="order-items-list">
                ${itemsHTML || "<p>لا توجد تفاصيل للوجبات.</p>"}
            </div>

            <div class="order-grand-total">
                <span>الإجمالي</span>
                <span>${formatPrice(getOrderTotal(order))}</span>
            </div>

        </section>

        <section class="order-detail-section">

            <h3>معلومات إضافية</h3>

            <div class="order-detail-grid">

                <div class="order-detail-item">
                    <span>طريقة الدفع</span>
                    <strong>
                        ${escapeHTML(paymentMethods[order.payment] || "غير محدد")}
                    </strong>
                </div>

                <div class="order-detail-item">
                    <span>حالة الطلب</span>
                    <strong>
                        ${escapeHTML(orderStatuses[order.status] || "غير معروف")}
                    </strong>
                </div>

            </div>

            <div class="order-detail-item" style="margin-top: 12px;">
                <span>ملاحظات العميل</span>
                <strong>${escapeHTML(order.notes || "لا توجد ملاحظات")}</strong>
            </div>

        </section>
    `;

  modal.dataset.orderId = String(order.id);
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

/* =========================================
   حذف الطلب
========================================= */

function deleteOrder(orderId) {
  const confirmed = confirm("هل أنت متأكد من حذف هذا الطلب نهائيًا؟");

  if (!confirmed) return;

  const orders = getOrders();

  const updatedOrders = orders.filter(
    (order) => Number(order.id) !== Number(orderId),
  );

  saveOrders(updatedOrders);

  closeOrderModal();
  renderOrders();
}

/* =========================================
   إغلاق نافذة التفاصيل
========================================= */

function closeOrderModal() {
  const modal = document.getElementById("orderModal");

  modal.classList.add("hidden");

  document.body.style.overflow = "";
}

/* =========================================
   تشغيل النظام
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("ordersTableBody");

  if (!tableBody) return;

  /* عرض التاريخ الحالي */

  const dateElement = document.getElementById("currentDate");

  dateElement.textContent = new Date().toLocaleDateString("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* عرض الطلبات */

  renderOrders();

  /* البحث والتصفية */

  document
    .getElementById("orderSearch")
    .addEventListener("input", renderOrders);

  document
    .getElementById("orderStatusFilter")
    .addEventListener("change", renderOrders);

  document
    .getElementById("orderPaymentFilter")
    .addEventListener("change", renderOrders);

  /* تحديث القائمة */

  document
    .getElementById("refreshOrders")
    .addEventListener("click", renderOrders);

  /* أزرار عرض التفاصيل */

  tableBody.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-view-order]");

    if (!viewButton) return;

    showOrderDetails(Number(viewButton.dataset.viewOrder));
  });

  /* تغيير حالة الطلب */

  tableBody.addEventListener("change", (event) => {
    const statusSelect = event.target.closest("[data-order-status]");

    if (!statusSelect) return;

    changeOrderStatus(
      Number(statusSelect.dataset.orderStatus),
      statusSelect.value,
    );
  });

  /* أزرار إغلاق النافذة */

  document
    .getElementById("closeOrderModal")
    .addEventListener("click", closeOrderModal);

  document
    .getElementById("closeOrderModalBottom")
    .addEventListener("click", closeOrderModal);

  /* إغلاق النافذة عند الضغط خارجها */

  document.getElementById("orderModal").addEventListener("click", (event) => {
    if (event.target.id === "orderModal") {
      closeOrderModal();
    }
  });

  /* زر حذف الطلب داخل نافذة التفاصيل */

  const modalFooter = document.querySelector(".modal-footer");

  const deleteButton = document.createElement("button");

  deleteButton.type = "button";
  deleteButton.className = "delete-order-btn";
  deleteButton.textContent = "حذف الطلب";

  deleteButton.addEventListener("click", () => {
    const orderId = Number(
      document.getElementById("orderModal").dataset.orderId,
    );

    if (orderId) {
      deleteOrder(orderId);
    }
  });

  modalFooter.prepend(deleteButton);

  /* إغلاق النافذة باستخدام زر Escape */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOrderModal();
    }
  });
});
