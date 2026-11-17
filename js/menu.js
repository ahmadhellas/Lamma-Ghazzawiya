// =====================================
// MENU PAGE - LAMMA GHAZZAWIYA
// =====================================

// عناصر الصفحة
const foodGrid = document.getElementById("food-grid");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");
const categoryFilter = document.getElementById("category-filter");
const sortSelect = document.getElementById("sort-select");
const priceRange = document.getElementById("price-range");
const priceValue = document.getElementById("price-value");
const foodTotal = document.getElementById("food-total");
const emptyState = document.getElementById("empty-state");
const resetFiltersBtn = document.getElementById("reset-filters");

// بيانات الوجبات
const foods = [
  {
    id: 1,
    name: "المقلوبة الفلسطينية",
    category: "main",
    categoryName: "أطباق رئيسية",
    price: 45,
    description:
      "أرز متبل مع الدجاج والباذنجان والزهرة، على الطريقة الفلسطينية الأصيلة.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 2,
    name: "المسخّن الغزّاوي",
    category: "main",
    categoryName: "أطباق رئيسية",
    price: 50,
    description: "خبز طابون مع الدجاج والبصل والسماق وزيت الزيتون الفلسطيني.",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 3,
    name: "المنسف البلدي",
    category: "main",
    categoryName: "أطباق رئيسية",
    price: 65,
    description: "أرز ولحم طري مع الجميد واللوز المحمص، وجبة أصيلة للمناسبات.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 4,
    name: "دجاج مشوي",
    category: "grills",
    categoryName: "مشاوي",
    price: 40,
    description: "دجاج متبل بتوابل خاصة ومشوي حتى يصبح ذهبيًا وشهيًا.",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 5,
    name: "كباب مشوي",
    category: "grills",
    categoryName: "مشاوي",
    price: 55,
    description: "قطع كباب متبلة ومشوية على الفحم مع الخضار الطازجة.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 6,
    name: "مشاوي مشكلة",
    category: "grills",
    categoryName: "مشاوي",
    price: 75,
    description: "تشكيلة من الكباب والدجاج واللحم المشوي لعشاق المشاوي.",
    image:
      "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 7,
    name: "حمص بالطحينة",
    category: "appetizers",
    categoryName: "مقبلات",
    price: 15,
    description: "حمص كريمي مع الطحينة وزيت الزيتون ورشة من السماق.",
    image:
      "https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 8,
    name: "فلافل فلسطينية",
    category: "appetizers",
    categoryName: "مقبلات",
    price: 12,
    description: "حبات فلافل مقرمشة من الخارج وطرية من الداخل.",
    image:
      "https://images.unsplash.com/photo-1593001874117-c99c800e3eb8?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 9,
    name: "سلطة عربية",
    category: "appetizers",
    categoryName: "مقبلات",
    price: 14,
    description: "خضار طازجة مع الليمون وزيت الزيتون والنعناع.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 10,
    name: "كنافة نابلسية",
    category: "desserts",
    categoryName: "حلويات",
    price: 25,
    description: "كنافة ساخنة بالجبنة والقطر والفستق الحلبي.",
    image:
      "https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 11,
    name: "بقلاوة شرقية",
    category: "desserts",
    categoryName: "حلويات",
    price: 20,
    description: "طبقات عجين رقيقة محشوة بالمكسرات والقطر.",
    image:
      "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 12,
    name: "مهلبية بالفستق",
    category: "desserts",
    categoryName: "حلويات",
    price: 18,
    description: "حلوى الحليب الناعمة بنكهة ماء الزهر والفستق.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=85",
  },
];

// حالة الفلاتر
let selectedCategory = "all";
let searchText = "";
let maxPrice = Number(priceRange.value);

// عرض الوجبات
function displayFoods(items) {
  foodGrid.innerHTML = "";

  foodTotal.textContent = `${items.length} وجبة`;

  if (items.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  items.forEach((food) => {
    const card = document.createElement("article");
    card.className = "food-card";

    card.innerHTML = `
            <div class="food-image">
                <img
                    src="${food.image}"
                    alt="${food.name}"
                    loading="lazy"
                    onerror="this.src='https://placehold.co/600x400/493026/F3E5CC?text=Lamma+Ghazzawiya'"
                >
                <span class="food-category">${food.categoryName}</span>
            </div>

            <div class="food-content">
                <h3>
                    <a href="food-details.html?id=${food.id}" class="food-details-link">
                    ${food.name}
                    </a>
                </h3>

                <p class="food-description">
                    ${food.description}
                </p>

                <div class="food-card-bottom">
                    <span class="food-price">${food.price} ₪</span>

                    <button
                        class="add-cart-btn"
                        data-food-id="${food.id}"
                    >
                        <i class="fa-solid fa-cart-plus"></i>
                        أضف للسلة
                    </button>
                </div>
            </div>
        `;

    foodGrid.appendChild(card);
  });
}

// تطبيق البحث والفلاتر والترتيب
function filterFoods() {
  let filteredFoods = [...foods];

  // فلترة حسب التصنيف
  if (selectedCategory !== "all") {
    filteredFoods = filteredFoods.filter((food) => {
      return food.category === selectedCategory;
    });
  }

  // البحث باسم الوجبة
  if (searchText.trim() !== "") {
    filteredFoods = filteredFoods.filter((food) => {
      return food.name.includes(searchText);
    });
  }

  // فلترة حسب السعر
  filteredFoods = filteredFoods.filter((food) => {
    return food.price <= maxPrice;
  });

  // الترتيب
  const sortValue = sortSelect.value;

  if (sortValue === "low-high") {
    filteredFoods.sort((a, b) => a.price - b.price);
  } else if (sortValue === "high-low") {
    filteredFoods.sort((a, b) => b.price - a.price);
  } else if (sortValue === "name") {
    filteredFoods.sort((a, b) => a.name.localeCompare(b.name, "ar"));
  }

  displayFoods(filteredFoods);
}

// البحث
searchInput.addEventListener("input", () => {
  searchText = searchInput.value.trim();

  clearSearchBtn.classList.toggle("visible", searchInput.value.length > 0);

  filterFoods();
});

// مسح البحث
clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchText = "";
  clearSearchBtn.classList.remove("visible");
  filterFoods();
});

// اختيار التصنيف
categoryFilter.addEventListener("click", (event) => {
  const button = event.target.closest(".category-btn");

  if (!button) return;

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  button.classList.add("active");
  selectedCategory = button.dataset.category;

  filterFoods();
});

// الترتيب
sortSelect.addEventListener("change", filterFoods);

// فلترة السعر
priceRange.addEventListener("input", () => {
  maxPrice = Number(priceRange.value);
  priceValue.textContent = `${maxPrice} ₪`;

  filterFoods();
});

// إضافة وجبة إلى السلة
foodGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-cart-btn");

  if (!button) return;

  const foodId = Number(button.dataset.foodId);
  const selectedFood = foods.find((food) => food.id === foodId);

  if (!selectedFood) return;

  // قراءة السلة الحالية من LocalStorage
  let cart = Storage.get("cart") || [];

  // التحقق إذا كانت الوجبة موجودة مسبقاً
  const existingFood = cart.find((item) => {
    return Number(item.id) === selectedFood.id;
  });

  if (existingFood) {
    existingFood.quantity += 1;
  } else {
    cart.push({
      id: selectedFood.id,
      name: selectedFood.name,
      price: selectedFood.price,
      image: selectedFood.image,
      quantity: 1,
    });
  }

  // حفظ السلة
  Storage.set("cart", cart);

  // تحديث عداد السلة
  updateMenuCartCount();

  // إشعار المستخدم
  showMenuNotification(`تمت إضافة ${selectedFood.name} إلى السلة`);
});

// تحديث عداد السلة
function updateMenuCartCount() {
  const cart = Storage.get("cart") || [];

  const totalQuantity = cart.reduce((total, item) => {
    return total + Number(item.quantity || 1);
  }, 0);

  const cartCount = document.getElementById("cart-count");

  if (cartCount) {
    cartCount.textContent = totalQuantity;
  }
}

// إشعار إضافة الوجبة
function showMenuNotification(message) {
  if (typeof showNotification === "function") {
    showNotification(message);
    return;
  }

  let notification = document.getElementById("menu-notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.id = "menu-notification";

    notification.style.cssText = `
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 9999;
            background: #17110F;
            color: #F3E5CC;
            padding: 15px 22px;
            border-right: 4px solid #D99A3D;
            border-radius: 8px;
            font-family: Cairo, sans-serif;
            font-size: 14px;
            box-shadow: 0 8px 25px rgba(0,0,0,.2);
            transition: opacity .3s;
        `;

    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.style.opacity = "1";

  clearTimeout(notification.hideTimer);

  notification.hideTimer = setTimeout(() => {
    notification.style.opacity = "0";
  }, 2500);
}

// إعادة ضبط جميع الفلاتر
resetFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchText = "";

  selectedCategory = "all";

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === "all");
  });

  sortSelect.value = "default";

  priceRange.value = priceRange.max;
  maxPrice = Number(priceRange.max);
  priceValue.textContent = `${maxPrice} ₪`;

  clearSearchBtn.classList.remove("visible");

  filterFoods();
});

// تشغيل الصفحة
filterFoods();
updateMenuCartCount();
