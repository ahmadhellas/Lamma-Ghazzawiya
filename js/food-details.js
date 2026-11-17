// =====================================
// FOOD DETAILS - LAMMA GHAZZAWIYA
// =====================================

// بيانات الوجبات
// يجب أن تتطابق أرقام id مع الأرقام الموجودة في menu.js

const foodDetails = [
  {
    id: 1,
    name: "المقلوبة الفلسطينية",
    category: "أطباق رئيسية",
    price: 45,
    description:
      "أرز متبل مع الدجاج والباذنجان والزهرة، على الطريقة الفلسطينية الأصيلة. طبق يجمع نكهة البيت الفلسطيني مع التوابل الغنية ويُقدّم ساخنًا.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 2,
    name: "المسخّن الغزّاوي",
    category: "أطباق رئيسية",
    price: 50,
    description:
      "خبز طابون مع الدجاج والبصل والسماق وزيت الزيتون الفلسطيني. نكهة تراثية مميزة من المطبخ الفلسطيني.",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 3,
    name: "المنسف البلدي",
    category: "أطباق رئيسية",
    price: 65,
    description:
      "أرز ولحم طري مع الجميد واللوز المحمص. وجبة مميزة للمناسبات واللّمات العائلية.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 4,
    name: "دجاج مشوي",
    category: "مشاوي",
    price: 40,
    description:
      "دجاج متبل بتوابل خاصة ومشوي حتى يصبح ذهبيًا وشهيًا، ويُقدّم مع إضافات طازجة.",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 5,
    name: "كباب مشوي",
    category: "مشاوي",
    price: 55,
    description:
      "قطع كباب متبلة ومشوية على الفحم مع الخضار الطازجة، لعشاق النكهة المشوية الأصيلة.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 6,
    name: "مشاوي مشكلة",
    category: "مشاوي",
    price: 75,
    description:
      "تشكيلة من الكباب والدجاج واللحم المشوي على الفحم، مناسبة للمشاركة مع العائلة والأصدقاء.",
    image:
      "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 7,
    name: "حمص بالطحينة",
    category: "مقبلات",
    price: 15,
    description:
      "حمص كريمي مع الطحينة وزيت الزيتون ورشة من السماق. طبق جانبي لذيذ يُحضّر يوميًا.",
    image:
      "https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 8,
    name: "فلافل فلسطينية",
    category: "مقبلات",
    price: 12,
    description:
      "حبات فلافل مقرمشة من الخارج وطرية من الداخل، بتتبيلة شرقية شهية.",
    image:
      "https://images.unsplash.com/photo-1593001874117-c99c800e3eb8?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 9,
    name: "سلطة عربية",
    category: "مقبلات",
    price: 14,
    description:
      "خضار طازجة مقطعة مع الليمون وزيت الزيتون والنعناع، لتضيف انتعاشًا إلى وجبتك.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 10,
    name: "كنافة نابلسية",
    category: "حلويات",
    price: 25,
    description:
      "كنافة ساخنة بالجبنة والقطر والفستق الحلبي، بطعم شرقي غني ومميز.",
    image:
      "https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 11,
    name: "بقلاوة شرقية",
    category: "حلويات",
    price: 20,
    description: "طبقات عجين رقيقة ومقرمشة محشوة بالمكسرات ومغطاة بالقطر.",
    image:
      "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 12,
    name: "مهلبية بالفستق",
    category: "حلويات",
    price: 18,
    description:
      "حلوى الحليب الناعمة بنكهة ماء الزهر ومزيّنة بالفستق، خيار خفيف ولذيذ بعد الطعام.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=85",
  },
];

// عناصر الصفحة
const detailsContainer = document.getElementById("details-container");
const notFoundContainer = document.getElementById("details-not-found");

const detailsImage = document.getElementById("details-image");
const detailsName = document.getElementById("details-name");
const detailsCategory = document.getElementById("details-category");
const detailsDescription = document.getElementById("details-description");
const detailsPrice = document.getElementById("details-price");

const quantityValue = document.getElementById("quantity-value");
const increaseButton = document.getElementById("increase-quantity");
const decreaseButton = document.getElementById("decrease-quantity");
const addCartButton = document.getElementById("add-details-cart");

// الكمية الافتراضية
let quantity = 1;

// قراءة رقم الوجبة من رابط الصفحة
const urlParameters = new URLSearchParams(window.location.search);
const foodId = Number(urlParameters.get("id"));

// البحث عن الوجبة
const selectedFood = foodDetails.find((food) => {
  return food.id === foodId;
});

// عرض تفاصيل الوجبة
function displayFoodDetails() {
  // إذا لم نجد الوجبة
  if (!selectedFood) {
    detailsContainer.hidden = true;
    notFoundContainer.hidden = false;
    return;
  }

  // إظهار بيانات الوجبة
  detailsImage.src = selectedFood.image;
  detailsImage.alt = selectedFood.name;

  detailsImage.onerror = function () {
    this.src =
      "https://placehold.co/900x700/493026/F3E5CC?text=Lamma+Ghazzawiya";
  };

  detailsName.textContent = selectedFood.name;
  detailsCategory.textContent = selectedFood.category;
  detailsDescription.textContent = selectedFood.description;
  detailsPrice.textContent = `${selectedFood.price} ₪`;

  // تغيير عنوان الصفحة
  document.title = `${selectedFood.name} | لمة غزّاوية`;
}

// زيادة الكمية
increaseButton.addEventListener("click", () => {
  quantity++;

  quantityValue.textContent = quantity;
});

// تقليل الكمية
decreaseButton.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantityValue.textContent = quantity;
  }
});

// إضافة الوجبة إلى السلة
addCartButton.addEventListener("click", () => {
  if (!selectedFood) return;

  // قراءة السلة الحالية
  let cart = Storage.get("cart") || [];

  // البحث عن الوجبة داخل السلة
  const existingFood = cart.find((item) => {
    return Number(item.id) === selectedFood.id;
  });

  if (existingFood) {
    // زيادة الكمية إذا كانت الوجبة موجودة
    existingFood.quantity = Number(existingFood.quantity || 1) + quantity;
  } else {
    // إضافة وجبة جديدة
    cart.push({
      id: selectedFood.id,
      name: selectedFood.name,
      price: selectedFood.price,
      image: selectedFood.image,
      quantity: quantity,
    });
  }

  // حفظ السلة
  Storage.set("cart", cart);

  // تحديث عداد السلة
  updateDetailsCartCount();

  // إظهار إشعار
  if (typeof showNotification === "function") {
    showNotification(`تمت إضافة ${quantity} من ${selectedFood.name} إلى السلة`);
  } else {
    alert("تمت إضافة الوجبة إلى السلة بنجاح!");
  }
});

// تحديث عداد السلة
function updateDetailsCartCount() {
  const cart = Storage.get("cart") || [];

  const totalQuantity = cart.reduce((total, item) => {
    return total + Number(item.quantity || 1);
  }, 0);

  const cartCount = document.getElementById("cart-count");

  if (cartCount) {
    cartCount.textContent = totalQuantity;
  }
}

// تشغيل الصفحة
displayFoodDetails();
updateDetailsCartCount();
