/* ========================================
   HOME PAGE JAVASCRIPT
======================================== */

// Featured meals
const featuredMeals = [
  {
    id: 1,
    name: "المقلوبة الفلسطينية",
    description: "أرز مع الدجاج والخضار والبهارات الشرقية الأصيلة.",
    price: 45,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600",
    category: "أطباق رئيسية",
    tag: "الأكثر طلباً",
  },

  {
    id: 2,
    name: "المشاوي المشكلة",
    description: "تشكيلة من الكباب والشيش طاووق واللحوم المشوية.",
    price: 65,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
    category: "مشاوي",
    tag: "مميز",
  },

  {
    id: 3,
    name: "المسخن الفلسطيني",
    description: "خبز الطابون مع الدجاج والبصل والسماق وزيت الزيتون.",
    price: 40,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600",
    category: "أطباق رئيسية",
    tag: "تراثي",
  },

  {
    id: 4,
    name: "الكنافة النابلسية",
    description: "كنافة ساخنة بالجبنة وقطر بطعم شرقي أصيل.",
    price: 25,
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600",
    category: "حلويات",
    tag: "تحلية",
  },
];

// Render featured meals
function renderFeaturedMeals() {
  const mealsContainer = document.querySelector("#featured-meals");

  if (!mealsContainer) return;

  mealsContainer.innerHTML = featuredMeals
    .map(
      (meal) => `

        <div class="meal-card">

            <div class="meal-image">

                <img
                    src="${meal.image}"
                    alt="${meal.name}"
                    loading="lazy"
                >

                <span class="meal-tag">
                    ${meal.tag}
                </span>

            </div>


            <div class="meal-info">

                <h3>${meal.name}</h3>

                <p>${meal.description}</p>


                <div class="meal-bottom">

                    <span class="meal-price">
                        ${formatPrice(meal.price)}
                    </span>

                    <button
                        class="add-cart-btn"
                        data-meal-id="${meal.id}"
                    >

                        <i class="fa-solid fa-plus"></i>

                        أضف للسلة

                    </button>

                </div>

            </div>

        </div>

    `,
    )
    .join("");

  // Add event listeners
  mealsContainer.querySelectorAll(".add-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const mealId = Number(button.dataset.mealId);

      addToCart(mealId);
    });
  });
}

// Add meal to cart
function addToCart(mealId) {
  const meal = featuredMeals.find((item) => item.id === mealId);

  if (!meal) return;

  const cart = Storage.get("cart", []);

  const existingItem = cart.find((item) => item.id === mealId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      image: meal.image,
      quantity: 1,
    });
  }

  const saved = Storage.set("cart", cart);

  if (!saved) {
    showNotification("تعذر حفظ الوجبة، حاول مرة أخرى.", "error");
    return;
  }

  updateCartCounter();

  showNotification("تمت إضافة الوجبة إلى السلة بنجاح ❤️");
}

// Initialize homepage
document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedMeals();
});
