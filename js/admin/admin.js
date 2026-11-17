// =====================================
// ADMIN SYSTEM - LAMMA GHAZZAWIYA
// =====================================

// بيانات المدير التجريبية
// ملاحظة: هذه البيانات للواجهة التجريبية فقط.
const ADMIN_EMAIL = "admin@lamma.com";
const ADMIN_PASSWORD = "Admin123";

const ADMIN_SESSION_KEY = "lammaAdminSession";

// =====================================
// STORAGE FUNCTIONS
// =====================================

// قراءة البيانات من Storage مع دعم أسماء المفاتيح القديمة
function adminReadArray(keys) {
  for (const key of keys) {
    const value = Storage.get(key);

    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
  }

  // إذا كانت المفاتيح موجودة لكنها تحتوي مصفوفات فارغة
  for (const key of keys) {
    const value = Storage.get(key);

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function adminGetOrders() {
  return adminReadArray(["lammaOrders", "orders"]);
}

function adminGetUsers() {
  return adminReadArray(["lammaUsers", "users"]);
}

function adminGetFoods() {
  return adminReadArray(["customFoods", "lammaFoods", "foods"]);
}

function adminGetSession() {
  return Storage.get(ADMIN_SESSION_KEY);
}

// =====================================
// COMMON FUNCTIONS
// =====================================

function adminEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[char];
  });
}

function adminFormatPrice(value) {
  const number = Number(value) || 0;
  return `${number.toFixed(2)} ₪`;
}

function adminShowAlert(message, type = "error") {
  const alert = document.getElementById("admin-login-alert");

  if (!alert) return;

  alert.textContent = message;
  alert.classList.toggle("success", type === "success");
  alert.hidden = false;
}

// =====================================
// ADMIN LOGIN PAGE
// =====================================

const adminLoginForm = document.getElementById("admin-login-form");

if (adminLoginForm) {
  // إذا كان المدير مسجلًا بالفعل
  if (adminGetSession()?.loggedIn === true) {
    window.location.replace("dashboard.html");
  }

  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");

  // إظهار وإخفاء كلمة المرور
  const passwordToggle = document.getElementById("toggle-admin-password");

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";

      passwordInput.type = isPassword ? "text" : "password";

      passwordToggle.innerHTML = isPassword
        ? '<i class="fa-regular fa-eye-slash"></i>'
        : '<i class="fa-regular fa-eye"></i>';
    });
  }

  // تعبئة بيانات المدير التجريبية
  const demoButton = document.getElementById("fill-admin-demo");

  if (demoButton) {
    demoButton.addEventListener("click", () => {
      if (emailInput) emailInput.value = ADMIN_EMAIL;
      if (passwordInput) passwordInput.value = ADMIN_PASSWORD;

      const alert = document.getElementById("admin-login-alert");

      if (alert) alert.hidden = true;
    });
  }

  // تسجيل الدخول
  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput?.value.trim().toLowerCase() || "";
    const password = passwordInput?.value || "";

    if (!email || !password) {
      adminShowAlert("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      adminShowAlert("بيانات الدخول غير صحيحة.");
      return;
    }

    // حفظ جلسة المدير
    Storage.set(ADMIN_SESSION_KEY, {
      loggedIn: true,
      email: ADMIN_EMAIL,
      role: "admin",
      loginAt: new Date().toISOString(),
    });

    adminShowAlert("تم تسجيل الدخول بنجاح. جاري فتح لوحة التحكم...", "success");

    const submitButton = document.getElementById("admin-login-submit");

    if (submitButton) {
      submitButton.disabled = true;
    }

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  });
}

// =====================================
// ADMIN AUTHENTICATION
// =====================================

function protectAdminPage() {
  const isDashboard = document.body.classList.contains("admin-dashboard-page");

  if (!isDashboard) return;

  const session = adminGetSession();

  if (!session || session.loggedIn !== true || session.role !== "admin") {
    window.location.replace("admin-login.html");
  }
}

protectAdminPage();

// =====================================
// ADMIN LOGOUT
// =====================================

const logoutButton = document.getElementById("admin-logout");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    Storage.remove(ADMIN_SESSION_KEY);
    window.location.replace("admin-login.html");
  });
}

// =====================================
// SIDEBAR MOBILE
// =====================================

const sidebar = document.getElementById("admin-sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarOverlay = document.getElementById("admin-sidebar-overlay");

function closeAdminSidebar() {
  sidebar?.classList.remove("open");
  sidebarOverlay?.classList.remove("open");
}

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    sidebar?.classList.toggle("open");
    sidebarOverlay?.classList.toggle("open");
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeAdminSidebar);
}

// إغلاق القائمة عند الضغط على أحد روابطها
if (sidebar) {
  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeAdminSidebar);
  });
}

// =====================================
// DASHBOARD - ORDER HELPERS
// =====================================

function getDashboardOrderId(order) {
  return order.id || order.orderId || order.orderNumber || "غير محدد";
}

function getDashboardOrderDate(order) {
  const dateValue =
    order.date || order.createdAt || order.orderDate || order.created_at;

  if (!dateValue) return null;

  const date = new Date(dateValue);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getDashboardOrderTotal(order) {
  const rawTotal =
    order.total ?? order.totalPrice ?? order.grandTotal ?? order.finalTotal;

  if (rawTotal !== undefined && rawTotal !== null && rawTotal !== "") {
    const total = Number(rawTotal);

    if (Number.isFinite(total)) {
      return total;
    }
  }

  const items = order.items || order.cart || order.products || [];

  if (!Array.isArray(items)) return 0;

  return items.reduce((sum, item) => {
    const price = Number(item.price ?? item.salePrice ?? 0) || 0;

    const quantity = Number(item.quantity ?? item.qty ?? 1) || 1;

    return sum + price * quantity;
  }, 0);
}

// =====================================
// ORDER STATUS
// =====================================

function getDashboardStatus(order) {
  const status = String(
    order.status || order.orderStatus || "pending",
  ).toLowerCase();

  const statusMap = {
    pending: {
      label: "قيد المراجعة",
      className: "pending",
      key: "pending",
    },

    new: {
      label: "قيد المراجعة",
      className: "pending",
      key: "pending",
    },

    processing: {
      label: "قيد التجهيز",
      className: "processing",
      key: "processing",
    },

    preparing: {
      label: "قيد التجهيز",
      className: "processing",
      key: "processing",
    },

    ready: {
      label: "جاهز للاستلام",
      className: "ready",
      key: "ready",
    },

    completed: {
      label: "مكتمل",
      className: "completed",
      key: "completed",
    },

    delivered: {
      label: "تم التوصيل",
      className: "completed",
      key: "completed",
    },

    cancelled: {
      label: "ملغي",
      className: "cancelled",
      key: "cancelled",
    },

    canceled: {
      label: "ملغي",
      className: "cancelled",
      key: "cancelled",
    },
  };

  return (
    statusMap[status] || {
      label: "قيد المراجعة",
      className: "pending",
      key: "pending",
    }
  );
}

// =====================================
// DATE FORMATTING
// =====================================

function formatDashboardDate(date) {
  if (!date) return "غير محدد";

  return new Intl.DateTimeFormat("ar-PS", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// =====================================
// DASHBOARD STATISTICS
// =====================================

function loadDashboardStatistics() {
  const orders = adminGetOrders();
  const users = adminGetUsers();
  const foods = adminGetFoods();

  // إجمالي المبيعات من جميع الطلبات المسجلة
  const totalSales = orders.reduce((sum, order) => {
    return sum + getDashboardOrderTotal(order);
  }, 0);

  // إحصائيات حالات الطلبات
  const pendingOrders = orders.filter((order) => {
    return getDashboardStatus(order).key === "pending";
  }).length;

  const processingOrders = orders.filter((order) => {
    return getDashboardStatus(order).key === "processing";
  }).length;

  const completedOrders = orders.filter((order) => {
    return getDashboardStatus(order).key === "completed";
  }).length;

  const readyOrders = orders.filter((order) => {
    return getDashboardStatus(order).key === "ready";
  }).length;

  // تحديث عناصر لوحة التحكم
  const totalOrdersElement = document.getElementById("dashboard-total-orders");

  const totalSalesElement = document.getElementById("dashboard-total-sales");

  const totalUsersElement = document.getElementById("dashboard-total-users");

  const totalFoodElement = document.getElementById("dashboard-total-food");

  const pendingElement = document.getElementById("dashboard-pending-orders");

  const processingElement = document.getElementById(
    "dashboard-processing-orders",
  );

  const completedElement = document.getElementById(
    "dashboard-completed-orders",
  );

  const sidebarOrdersElement = document.getElementById("sidebar-orders-count");

  if (totalOrdersElement) {
    totalOrdersElement.textContent = orders.length;
  }

  if (totalSalesElement) {
    totalSalesElement.textContent = adminFormatPrice(totalSales);
  }

  if (totalUsersElement) {
    totalUsersElement.textContent = users.length;
  }

  if (totalFoodElement) {
    // القائمة الأساسية تحتوي 12 وجبة، ونضيف الوجبات المخصصة
    totalFoodElement.textContent = 12 + foods.length;
  }

  if (pendingElement) {
    pendingElement.textContent = pendingOrders;
  }

  if (processingElement) {
    processingElement.textContent = processingOrders;
  }

  if (completedElement) {
    completedElement.textContent = completedOrders;
  }

  if (sidebarOrdersElement) {
    sidebarOrdersElement.textContent =
      pendingOrders + processingOrders + readyOrders;
  }
}

// =====================================
// RECENT ORDERS TABLE
// =====================================

function loadRecentOrders() {
  const orders = adminGetOrders();

  const tableBody = document.getElementById("recent-orders-body");

  if (!tableBody) return;

  if (orders.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="admin-table-empty">
          لا توجد طلبات حتى الآن.
        </td>
      </tr>
    `;

    return;
  }

  // ترتيب الطلبات من الأحدث إلى الأقدم
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = getDashboardOrderDate(a)?.getTime() || 0;

    const dateB = getDashboardOrderDate(b)?.getTime() || 0;

    return dateB - dateA;
  });

  // عرض آخر 6 طلبات
  const recentOrders = sortedOrders.slice(0, 6);

  tableBody.innerHTML = recentOrders
    .map((order) => {
      const customer = order.customer || order.customerInfo || order.user || {};

      const customerName =
        order.customerName ||
        (typeof customer === "string" ? customer : customer.name) ||
        customer.fullName ||
        order.name ||
        "عميل";

      const status = getDashboardStatus(order);

      return `
        <tr>
          <td>
            <strong>
              #${adminEscape(getDashboardOrderId(order))}
            </strong>
          </td>

          <td>
            ${adminEscape(customerName)}
          </td>

          <td>
            ${adminEscape(formatDashboardDate(getDashboardOrderDate(order)))}
          </td>

          <td>
            <strong>
              ${adminFormatPrice(getDashboardOrderTotal(order))}
            </strong>
          </td>

          <td>
            <span class="admin-table-status ${status.className}">
              ${status.label}
            </span>
          </td>
        </tr>
      `;
    })
    .join("");
}

// =====================================
// DASHBOARD DATE AND YEAR
// =====================================

function initializeAdminDate() {
  const dateElement = document.getElementById("admin-current-date");

  const yearElement = document.getElementById("admin-current-year");

  if (dateElement) {
    dateElement.textContent = new Intl.DateTimeFormat("ar-PS", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// =====================================
// REFRESH DASHBOARD
// =====================================

function refreshAdminDashboard() {
  loadDashboardStatistics();
  loadRecentOrders();
  initializeAdminDate();
}

// =====================================
// INITIALIZE DASHBOARD
// =====================================

if (document.body.classList.contains("admin-dashboard-page")) {
  refreshAdminDashboard();
}
