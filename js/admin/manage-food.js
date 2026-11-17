"use strict";

/* =====================================
   إعدادات النظام
===================================== */

const FOOD_STORAGE_KEY = "lammaFoods";

const defaultFoods = [
  {
    id: 1,
    name: "مشاوي مشكلة",
    category: "مشاوي",
    price: 85,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
    description: "تشكيلة مميزة من اللحوم المشوية مع الخضار والصلصات.",
    available: true,
  },
  {
    id: 2,
    name: "مقلوبة فلسطينية",
    category: "وجبات رئيسية",
    price: 55,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500",
    description: "مقلوبة فلسطينية بالدجاج والباذنجان والأرز.",
    available: true,
  },
  {
    id: 3,
    name: "حمص بالطحينة",
    category: "مقبلات",
    price: 18,
    image: "https://images.unsplash.com/photo-1577906096429-f73c2c312435?w=500",
    description: "حمص طازج مع الطحينة وزيت الزيتون.",
    available: true,
  },
  {
    id: 4,
    name: "كنافة نابلسية",
    category: "حلويات",
    price: 25,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
    description: "كنافة ساخنة بالجبنة والقطر.",
    available: false,
  },
  {
    id: 5,
    name: "عصير برتقال طبيعي",
    category: "مشروبات",
    price: 12,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500",
    description: "عصير برتقال طبيعي طازج.",
    available: true,
  },
];

/* =====================================
   أدوات مساعدة
===================================== */

function getFoods() {
  try {
    const savedFoods = localStorage.getItem(FOOD_STORAGE_KEY);

    if (savedFoods === null) {
      localStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(defaultFoods));

      return [...defaultFoods];
    }

    const foods = JSON.parse(savedFoods);

    return Array.isArray(foods) ? foods : [...defaultFoods];
  } catch (error) {
    console.error("Error loading foods:", error);
    return [...defaultFoods];
  }
}

function saveFoods(foods) {
  localStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(foods));
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

function getFoodImage(image) {
  if (!image) return "";

  try {
    const url = new URL(image);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

function showMessage(message, type) {
  const messageElement = document.getElementById("formMessage");

  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.className = `form-message ${type}`;
}

/* =====================================
   صفحة إدارة الوجبات
===================================== */

function renderFoods() {
  const tableBody = document.getElementById("foodsTableBody");

  if (!tableBody) return;

  const foods = getFoods();

  const searchValue =
    document.getElementById("foodSearch")?.value.trim().toLowerCase() || "";

  const categoryValue =
    document.getElementById("categoryFilter")?.value || "all";

  const availabilityValue =
    document.getElementById("availabilityFilter")?.value || "all";

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = String(food.name).toLowerCase().includes(searchValue);

    const matchesCategory =
      categoryValue === "all" || food.category === categoryValue;

    const matchesAvailability =
      availabilityValue === "all" ||
      (availabilityValue === "available" && food.available) ||
      (availabilityValue === "unavailable" && !food.available);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  updateFoodStatistics(foods);

  const emptyMessage = document.getElementById("emptyFoods");

  if (filteredFoods.length === 0) {
    tableBody.innerHTML = "";
    emptyMessage?.classList.remove("hidden");
    return;
  }

  emptyMessage?.classList.add("hidden");

  tableBody.innerHTML = filteredFoods
    .map((food) => {
      const image = getFoodImage(food.image);

      return `
            <tr>
                <td>
                    ${
                      image
                        ? `<img class="food-image"
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(food.name)}"
                                onerror="this.style.display='none'">`
                        : `<span class="food-image">🍽️</span>`
                    }
                </td>

                <td>
                    <span class="food-name">
                        ${escapeHTML(food.name)}
                    </span>
                </td>

                <td>${escapeHTML(food.category)}</td>

                <td>
                    <span class="food-price">
                        ${Number(food.price).toFixed(2)} ₪
                    </span>
                </td>

                <td>
                    <span class="food-status ${
                      food.available ? "status-available" : "status-unavailable"
                    }">
                        ${food.available ? "متاحة" : "غير متاحة"}
                    </span>
                </td>

                <td>
                    <div class="food-actions">

                        <button
                            class="food-action-btn edit-food-btn"
                            data-action="edit"
                            data-id="${Number(food.id)}">
                            تعديل
                        </button>

                        <button
                            class="food-action-btn delete-food-btn"
                            data-action="delete"
                            data-id="${Number(food.id)}">
                            حذف
                        </button>

                    </div>
                </td>
            </tr>
        `;
    })
    .join("");
}

function updateFoodStatistics(foods) {
  const total = foods.length;

  const available = foods.filter((food) => food.available).length;

  const unavailable = total - available;

  const totalElement = document.getElementById("totalFoods");
  const availableElement = document.getElementById("availableFoods");
  const unavailableElement = document.getElementById("unavailableFoods");

  if (totalElement) totalElement.textContent = total;
  if (availableElement) availableElement.textContent = available;
  if (unavailableElement) unavailableElement.textContent = unavailable;
}

function handleFoodTableActions(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);

  if (!Number.isFinite(id)) return;

  if (button.dataset.action === "edit") {
    window.location.href = `add-food.html?id=${id}`;
    return;
  }

  if (button.dataset.action === "delete") {
    deleteFood(id);
  }
}

function deleteFood(id) {
  const confirmed = confirm("هل أنت متأكد من حذف هذه الوجبة؟");

  if (!confirmed) return;

  const foods = getFoods();

  const updatedFoods = foods.filter((food) => Number(food.id) !== id);

  saveFoods(updatedFoods);

  renderFoods();
}

/* =====================================
   صفحة إضافة وتعديل الوجبات
===================================== */

function setupFoodForm() {
  const form = document.getElementById("foodForm");

  if (!form) return;

  const params = new URLSearchParams(window.location.search);

  const foodId = Number(params.get("id"));

  const isEditing = Number.isInteger(foodId) && foodId > 0;

  const foods = getFoods();

  const existingFood = isEditing
    ? foods.find((food) => Number(food.id) === foodId)
    : null;

  if (isEditing && !existingFood) {
    showMessage("الوجبة المطلوبة غير موجودة.", "error");
    return;
  }

  if (existingFood) {
    document.getElementById("formTitle").textContent = "تعديل بيانات الوجبة ✏️";

    document.getElementById("saveFoodBtn").textContent = "حفظ التعديلات";

    document.getElementById("foodName").value = existingFood.name;
    document.getElementById("foodCategory").value = existingFood.category;
    document.getElementById("foodPrice").value = existingFood.price;
    document.getElementById("foodImage").value = existingFood.image || "";
    document.getElementById("foodDescription").value =
      existingFood.description || "";

    document.getElementById("foodAvailable").checked = Boolean(
      existingFood.available,
    );

    updateImagePreview(existingFood.image || "");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("foodName").value.trim();
    const category = document.getElementById("foodCategory").value;
    const price = Number(document.getElementById("foodPrice").value);
    const image = document.getElementById("foodImage").value.trim();
    const description = document.getElementById("foodDescription").value.trim();

    const available = document.getElementById("foodAvailable").checked;

    if (!name || !category || !description) {
      showMessage("يرجى تعبئة جميع الحقول المطلوبة.", "error");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      showMessage("يرجى إدخال سعر صحيح أكبر من صفر.", "error");
      return;
    }

    if (image && !getFoodImage(image)) {
      showMessage("يرجى إدخال رابط صورة صحيح يبدأ بـ http أو https.", "error");
      return;
    }

    const updatedFoods = getFoods();

    const foodData = {
      id: isEditing ? foodId : Date.now(),
      name,
      category,
      price,
      image,
      description,
      available,
    };

    if (isEditing) {
      const index = updatedFoods.findIndex(
        (food) => Number(food.id) === foodId,
      );

      if (index === -1) {
        showMessage("تعذر العثور على الوجبة لتعديلها.", "error");
        return;
      }

      updatedFoods[index] = foodData;
    } else {
      updatedFoods.unshift(foodData);
    }

    saveFoods(updatedFoods);

    showMessage(
      isEditing ? "تم تحديث بيانات الوجبة بنجاح." : "تمت إضافة الوجبة بنجاح.",
      "success",
    );

    setTimeout(() => {
      window.location.href = "manage-food.html";
    }, 900);
  });
}

/* =====================================
   معاينة الصورة
===================================== */

function updateImagePreview(imageUrl) {
  const preview = document.getElementById("imagePreview");

  if (!preview) return;

  const safeImage = getFoodImage(imageUrl);

  if (!safeImage) {
    preview.innerHTML = `
            <span>🍽️</span>
            <p>ستظهر صورة الوجبة هنا</p>
        `;

    return;
  }

  preview.innerHTML = `
        <img src="${escapeHTML(safeImage)}" alt="معاينة صورة الوجبة">
    `;

  const image = preview.querySelector("img");

  image.addEventListener("error", () => {
    preview.innerHTML = `
            <span>⚠️</span>
            <p>تعذر تحميل الصورة، تحقق من الرابط</p>
        `;
  });
}

/* =====================================
   تشغيل النظام
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("foodsTableBody");

  if (tableBody) {
    renderFoods();

    document
      .getElementById("foodSearch")
      ?.addEventListener("input", renderFoods);

    document
      .getElementById("categoryFilter")
      ?.addEventListener("change", renderFoods);

    document
      .getElementById("availabilityFilter")
      ?.addEventListener("change", renderFoods);

    tableBody.addEventListener("click", handleFoodTableActions);
  }

  const foodImageInput = document.getElementById("foodImage");

  foodImageInput?.addEventListener("input", (event) => {
    updateImagePreview(event.target.value.trim());
  });

  setupFoodForm();
});
