/* =========================================
   LAMMA GHAZZAWIYA - ADMIN DASHBOARD
========================================= */

(() => {
  "use strict";

  const ORDERS_KEY = "orders";
  const USERS_KEY = "users";
  const FOODS_KEYS = ["customFoods", "lammaFoods", "foods"];

  const $ = (selector) => document.querySelector(selector);

  // قراءة البيانات من التخزين
  function readData(key, fallback = []) {
    try {
      if (window.Storage && typeof Storage.get === "function") {
        const value = Storage.get(key, fallback);
        return Array.isArray(value) ? value : fallback;
      }

      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : fallback;
    } catch (error) {
      console.warn(`Could not read ${key}:`, error);
      return fallback;
    }
  }

  function getOrders() {
    if (typeof window.adminGetOrders === "function") {
      return window.adminGetOrders();
    }

    return readData(ORDERS_KEY);
  }

  function getUsers() {
    if (typeof window.adminGetUsers === "function") {
      return window.adminGetUsers();
    }

    return readData(USERS_KEY);
  }

  function getFoods() {
    for (const key of FOODS_KEYS) {
      const foods = readData(key, null);

      if (foods && foods.length) {
        return foods;
      }
    }

    return [];
  }

  function getOrderId(order) {
    return order.id || order.orderId || order.orderNumber || "—";
  }

  function getOrderDate(order) {
    return (
      order.createdAt ||
      order.orderDate ||
      order.created_at ||
      order.date ||
      null
    );
  }

  function getOrderTotal(order) {
    const total = Number(
      order.total ??
        order.totalPrice ??
        order.grandTotal ??
        order.finalTotal ??
        order.amount ??
        0,
    );

    if (Number.isFinite(total)) return total;
    return 0;
  }

  function getStatus(order) {
    const status = String(order.status || "pending").toLowerCase();

    const statuses = {
      new: "pending",
      pending: "pending",
      preparing: "processing",
      processing: "processing",
      ready: "ready",
      delivered: "completed",
      completed: "completed",
      cancelled: "cancelled",
      canceled: "cancelled",
    };

    return statuses[status] || status;
  }

  function formatPrice(price) {
    if (typeof window.adminFormatPrice === "function") {
      return window.adminFormatPrice(price);
    }

    if (typeof window.formatPrice === "function") {
      return window.formatPrice(price);
    }

    return `${Number(price || 0).toLocaleString("en-US")} ₪`;
  }

  function formatDate(date) {
    if (!date) return "غير محدد";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "غير محدد";

    return parsed.toLocaleDateString("ar", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  function escapeHTML(value) {
    if (typeof window.adminEscape === "function") {
      return window.adminEscape(value);
    }

    return String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[char],
    );
  }

  // حساب إحصائيات الطلبات
  function loadDashboardStatistics() {
    const orders = getOrders();
    const users = getUsers();
    const foods = getFoods();

    const pending = orders.filter(
      (order) => getStatus(order) === "pending",
    ).length;

    const processing = orders.filter(
      (order) => getStatus(order) === "processing",
    ).length;

    const completed = orders.filter(
      (order) => getStatus(order) === "completed",
    ).length;

    const sales = orders
      .filter((order) => getStatus(order) === "completed")
      .reduce((sum, order) => sum + getOrderTotal(order), 0);

    setText("dashboard-total-orders", orders.length);
    setText("dashboard-total-sales", formatPrice(sales));
    setText("dashboard-total-users", users.length);
    setText("dashboard-total-food", foods.length);

    setText("dashboard-pending-orders", pending);
    setText("dashboard-processing-orders", processing);
    setText("dashboard-completed-orders", completed);

    setText("sidebar-orders-count", pending + processing);
  }

  // عرض آخر الطلبات
  function loadRecentOrders() {
    const tableBody = $("#recent-orders-body");

    if (!tableBody) return;

    const orders = [...getOrders()].sort((a, b) => {
      const dateA = new Date(getOrderDate(a) || 0).getTime();
      const dateB = new Date(getOrderDate(b) || 0).getTime();

      return dateB - dateA;
    });

    const recentOrders = orders.slice(0, 5);

    if (!recentOrders.length) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        لا توجد طلبات حتى الآن
                    </td>
                </tr>
            `;
      return;
    }

    tableBody.innerHTML = recentOrders
      .map((order) => {
        const id = escapeHTML(getOrderId(order));
        const customer = escapeHTML(
          order.customerName ||
            order.name ||
            order.userName ||
            order.customer?.name ||
            "عميل",
        );

        const status = getStatus(order);

        const statusLabels = {
          pending: "جديد",
          processing: "قيد التحضير",
          ready: "جاهز",
          completed: "مكتمل",
          cancelled: "ملغي",
        };

        const total = formatPrice(getOrderTotal(order));
        const date = formatDate(getOrderDate(order));

        return `
                <tr>
                    <td>#${id}</td>
                    <td>${customer}</td>
                    <td>${escapeHTML(date)}</td>
                    <td>${escapeHTML(total)}</td>
                    <td>
                        <span class="status-badge status-${status}">
                            ${statusLabels[status] || status}
                        </span>
                    </td>
                </tr>
            `;
      })
      .join("");
  }

  // التاريخ الحالي
  function initializeDashboardDate() {
    const dateElement = $("#admin-current-date");
    const yearElement = $("#admin-current-year");

    if (dateElement) {
      dateElement.textContent = new Date().toLocaleDateString("ar", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // تحديث لوحة التحكم
  function refreshDashboard() {
    loadDashboardStatistics();
    loadRecentOrders();
    initializeDashboardDate();
  }

  // تشغيل لوحة التحكم
  document.addEventListener("DOMContentLoaded", () => {
    refreshDashboard();

    // تحديث البيانات عند العودة للصفحة
    window.addEventListener("storage", refreshDashboard);

    // تحديث دوري للإحصائيات
    setInterval(refreshDashboard, 30000);
  });

  // إتاحة الدوال للملفات الأخرى
  window.refreshDashboard = refreshDashboard;
  window.loadDashboardStatistics = loadDashboardStatistics;
  window.loadRecentOrders = loadRecentOrders;
})();
