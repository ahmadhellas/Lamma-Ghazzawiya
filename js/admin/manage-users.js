"use strict";

/* =====================================
   إعدادات المستخدمين
===================================== */

const USERS_STORAGE_KEY = "lammaUsers";

const defaultUsers = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmad@example.com",
    phone: "0599000001",
    address: "غزة - الرمال",
    joinDate: "2026-10-01",
    active: true,
  },
  {
    id: 2,
    name: "سارة خالد",
    email: "sara@example.com",
    phone: "0599000002",
    address: "غزة - النصر",
    joinDate: "2026-10-05",
    active: true,
  },
  {
    id: 3,
    name: "محمد علي",
    email: "mohammed@example.com",
    phone: "0599000003",
    address: "غزة - الشاطئ",
    joinDate: "2026-10-10",
    active: false,
  },
  {
    id: 4,
    name: "نور حسن",
    email: "noor@example.com",
    phone: "0599000004",
    address: "غزة - تل الهوى",
    joinDate: "2026-11-01",
    active: true,
  },
  {
    id: 5,
    name: "عمر أحمد",
    email: "omar@example.com",
    phone: "0599000005",
    address: "غزة - الشيخ رضوان",
    joinDate: "2026-11-12",
    active: true,
  },
  {
    id: 6,
    name: "ليان محمود",
    email: "layan@example.com",
    phone: "0599000006",
    address: "غزة - الزيتون",
    joinDate: "2026-11-14",
    active: false,
  },
];

/* =====================================
   أدوات مساعدة
===================================== */

function getUsers() {
  try {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);

    if (savedUsers === null) {
      saveUsers(defaultUsers);
      return [...defaultUsers];
    }

    const users = JSON.parse(savedUsers);

    return Array.isArray(users) ? users : [...defaultUsers];
  } catch (error) {
    console.error("Error loading users:", error);
    return [...defaultUsers];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function escapeUserHTML(value) {
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

/* =====================================
   عدد طلبات المستخدم
===================================== */

function getUserOrdersCount(user) {
  try {
    const orders = JSON.parse(localStorage.getItem("lammaOrders") || "[]");

    if (!Array.isArray(orders)) return 0;

    return orders.filter((order) => {
      const sameUserId = Number(order.userId) === Number(user.id);

      const sameEmail =
        user.email &&
        String(order.email || "").toLowerCase() ===
          String(user.email).toLowerCase();

      const samePhone =
        user.phone && String(order.phone || "") === String(user.phone);

      return sameUserId || sameEmail || samePhone;
    }).length;
  } catch (error) {
    console.error("Error counting user orders:", error);
    return 0;
  }
}

/* =====================================
   تحديث الإحصائيات
===================================== */

function updateUsersStatistics(users) {
  const total = users.length;

  const active = users.filter((user) => user.active).length;

  const blocked = total - active;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const newUsers = users.filter((user) => {
    const joinDate = new Date(user.joinDate);

    return (
      !Number.isNaN(joinDate.getTime()) &&
      joinDate.getMonth() === currentMonth &&
      joinDate.getFullYear() === currentYear
    );
  }).length;

  document.getElementById("totalUsers").textContent = total;

  document.getElementById("activeUsers").textContent = active;

  document.getElementById("blockedUsers").textContent = blocked;

  document.getElementById("newUsers").textContent = newUsers;
}

/* =====================================
   عرض المستخدمين
===================================== */

function renderUsers() {
  const tableBody = document.getElementById("usersTableBody");

  if (!tableBody) return;

  const users = getUsers();

  const searchValue = document
    .getElementById("userSearch")
    .value.trim()
    .toLowerCase();

  const statusValue = document.getElementById("userStatusFilter").value;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      String(user.name || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(user.email || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(user.phone || "")
        .toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusValue === "all" ||
      (statusValue === "active" && user.active) ||
      (statusValue === "blocked" && !user.active);

    return matchesSearch && matchesStatus;
  });

  updateUsersStatistics(users);

  const emptyMessage = document.getElementById("emptyUsers");

  if (filteredUsers.length === 0) {
    tableBody.innerHTML = "";
    emptyMessage.classList.remove("hidden");
    return;
  }

  emptyMessage.classList.add("hidden");

  tableBody.innerHTML = filteredUsers
    .map((user) => {
      const firstLetter = String(user.name || "?").charAt(0);

      const ordersCount = getUserOrdersCount(user);

      return `
            <tr>

                <td>
                    <div class="user-info">
                        <div class="user-avatar">
                            ${escapeUserHTML(firstLetter)}
                        </div>

                        <span class="user-name">
                            ${escapeUserHTML(user.name)}
                        </span>
                    </div>
                </td>

                <td>
                    <span class="user-email">
                        ${escapeUserHTML(user.email)}
                    </span>
                </td>

                <td>${escapeUserHTML(user.phone)}</td>

                <td>${escapeUserHTML(user.joinDate)}</td>

                <td>${ordersCount}</td>

                <td>
                    <span class="user-status ${
                      user.active ? "user-active" : "user-blocked"
                    }">
                        ${user.active ? "نشط" : "موقوف"}
                    </span>
                </td>

                <td>
                    <div class="user-actions">

                        <button
                            class="user-action-btn user-view-btn"
                            data-user-action="view"
                            data-user-id="${Number(user.id)}">
                            التفاصيل
                        </button>

                        <button
                            class="user-action-btn user-toggle-btn"
                            data-user-action="toggle"
                            data-user-id="${Number(user.id)}">
                            ${user.active ? "إيقاف" : "تفعيل"}
                        </button>

                        <button
                            class="user-action-btn user-delete-btn"
                            data-user-action="delete"
                            data-user-id="${Number(user.id)}">
                            حذف
                        </button>

                    </div>
                </td>

            </tr>
        `;
    })
    .join("");
}

/* =====================================
   عرض تفاصيل المستخدم
===================================== */

function showUserDetails(userId) {
  const users = getUsers();

  const user = users.find((item) => Number(item.id) === Number(userId));

  if (!user) return;

  const content = document.getElementById("userDetailsContent");

  const ordersCount = getUserOrdersCount(user);

  content.innerHTML = `

        <div class="user-detail-item">
            <span>رقم المستخدم</span>
            <strong>#${Number(user.id)}</strong>
        </div>

        <div class="user-detail-item">
            <span>اسم المستخدم</span>
            <strong>${escapeUserHTML(user.name)}</strong>
        </div>

        <div class="user-detail-item">
            <span>البريد الإلكتروني</span>
            <strong>${escapeUserHTML(user.email)}</strong>
        </div>

        <div class="user-detail-item">
            <span>رقم الهاتف</span>
            <strong>${escapeUserHTML(user.phone)}</strong>
        </div>

        <div class="user-detail-item">
            <span>العنوان</span>
            <strong>${escapeUserHTML(user.address || "غير محدد")}</strong>
        </div>

        <div class="user-detail-item">
            <span>تاريخ التسجيل</span>
            <strong>${escapeUserHTML(user.joinDate)}</strong>
        </div>

        <div class="user-detail-item">
            <span>عدد الطلبات</span>
            <strong>${ordersCount}</strong>
        </div>

        <div class="user-detail-item">
            <span>حالة الحساب</span>
            <strong>${user.active ? "نشط" : "موقوف"}</strong>
        </div>
    `;

  document.getElementById("userModal").classList.remove("hidden");

  document.body.style.overflow = "hidden";
}

/* =====================================
   تفعيل وإيقاف المستخدم
===================================== */

function toggleUserStatus(userId) {
  const users = getUsers();

  const user = users.find((item) => Number(item.id) === Number(userId));

  if (!user) return;

  const action = user.active ? "إيقاف" : "تفعيل";

  const confirmed = confirm(`هل تريد ${action} حساب ${user.name}؟`);

  if (!confirmed) return;

  user.active = !user.active;

  saveUsers(users);

  renderUsers();
}

/* =====================================
   حذف المستخدم
===================================== */

function deleteUser(userId) {
  const users = getUsers();

  const user = users.find((item) => Number(item.id) === Number(userId));

  if (!user) return;

  const confirmed = confirm(`هل أنت متأكد من حذف حساب ${user.name}؟`);

  if (!confirmed) return;

  const updatedUsers = users.filter(
    (item) => Number(item.id) !== Number(userId),
  );

  saveUsers(updatedUsers);

  closeUserModal();

  renderUsers();
}

/* =====================================
   إغلاق نافذة التفاصيل
===================================== */

function closeUserModal() {
  const modal = document.getElementById("userModal");

  modal.classList.add("hidden");

  document.body.style.overflow = "";
}

/* =====================================
   تشغيل النظام
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("usersTableBody");

  if (!tableBody) return;

  /* التاريخ */

  document.getElementById("usersDate").textContent =
    new Date().toLocaleDateString("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  /* عرض المستخدمين */

  renderUsers();

  /* البحث */

  document.getElementById("userSearch").addEventListener("input", renderUsers);

  /* تصفية الحالة */

  document
    .getElementById("userStatusFilter")
    .addEventListener("change", renderUsers);

  /* تحديث القائمة */

  document
    .getElementById("refreshUsers")
    .addEventListener("click", renderUsers);

  /* أزرار المستخدمين */

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-user-action]");

    if (!button) return;

    const userId = Number(button.dataset.userId);

    const action = button.dataset.userAction;

    if (!Number.isFinite(userId)) return;

    if (action === "view") {
      showUserDetails(userId);
    }

    if (action === "toggle") {
      toggleUserStatus(userId);
    }

    if (action === "delete") {
      deleteUser(userId);
    }
  });

  /* إغلاق النافذة */

  document
    .getElementById("closeUserModal")
    .addEventListener("click", closeUserModal);

  document
    .getElementById("closeUserModalBottom")
    .addEventListener("click", closeUserModal);

  document.getElementById("userModal").addEventListener("click", (event) => {
    if (event.target.id === "userModal") {
      closeUserModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeUserModal();
    }
  });
});
