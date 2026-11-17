// =====================================
// AUTH SYSTEM - LAMMA GHAZZAWIYA
// =====================================

// مفاتيح التخزين
const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

// قراءة الحسابات المحفوظة
function getUsers() {
  return Storage.get(USERS_KEY) || [];
}

// حفظ الحسابات
function saveUsers(users) {
  Storage.set(USERS_KEY, users);
}

// إظهار رسالة للمستخدم
function showAuthAlert(elementId, message, type = "error") {
  const alertBox = document.getElementById(elementId);

  if (!alertBox) return;

  alertBox.textContent = message;
  alertBox.classList.toggle("success", type === "success");
  alertBox.hidden = false;
}

// إخفاء رسالة المستخدم
function hideAuthAlert(elementId) {
  const alertBox = document.getElementById(elementId);

  if (!alertBox) return;

  alertBox.hidden = true;
  alertBox.textContent = "";
}

// إظهار أو إخفاء كلمة المرور
document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const inputId = button.dataset.passwordTarget;
    const input = document.getElementById(inputId);

    if (!input) return;

    const icon = button.querySelector("i");

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
      button.setAttribute("aria-label", "إخفاء كلمة المرور");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
      button.setAttribute("aria-label", "إظهار كلمة المرور");
    }
  });
});

// التحقق من البريد الإلكتروني
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// إنشاء جلسة للمستخدم
function loginUser(user) {
  const currentUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role || "customer",
  };

  Storage.set(CURRENT_USER_KEY, currentUser);
}

// =====================================
// LOGIN
// =====================================

const loginForm = document.getElementById("login-form");

if (loginForm) {
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    hideAuthAlert("login-alert");

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    let valid = true;

    if (!isValidEmail(email)) {
      setLoginError("login-email", "يرجى إدخال بريد إلكتروني صحيح.");
      valid = false;
    } else {
      setLoginError("login-email", "");
    }

    if (!password) {
      setLoginError("login-password", "يرجى إدخال كلمة المرور.");
      valid = false;
    } else {
      setLoginError("login-password", "");
    }

    if (!valid) return;

    const users = getUsers();

    const user = users.find((item) => {
      return item.email.toLowerCase() === email && item.password === password;
    });

    if (!user) {
      showAuthAlert(
        "login-alert",
        "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      );
      return;
    }

    loginUser(user);

    showAuthAlert(
      "login-alert",
      "تم تسجيل الدخول بنجاح! جاري تحويلك...",
      "success",
    );

    const submitButton = document.getElementById("login-submit");
    submitButton.disabled = true;

    setTimeout(() => {
      window.location.href = "index.html";
    }, 900);
  });

  // إزالة الخطأ أثناء الكتابة
  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener("input", () => {
      setLoginError(input.id, "");
      hideAuthAlert("login-alert");
    });
  });
}

// دالة عرض أخطاء تسجيل الدخول
function setLoginError(inputId, message) {
  const input = document.getElementById(inputId);

  if (!input) return;

  const group = input.closest(".auth-field");
  const error = document.getElementById(`${inputId}-error`);

  group.classList.toggle("invalid", message !== "");
  error.textContent = message;
}

// =====================================
// REGISTER
// =====================================

const registerForm = document.getElementById("register-form");

if (registerForm) {
  const nameInput = document.getElementById("register-name");
  const emailInput = document.getElementById("register-email");
  const phoneInput = document.getElementById("register-phone");
  const passwordInput = document.getElementById("register-password");
  const confirmPasswordInput = document.getElementById(
    "register-confirm-password",
  );
  const termsInput = document.getElementById("accept-terms");

  // عرض مستوى قوة كلمة المرور
  function updatePasswordStrength() {
    const password = passwordInput.value;
    const progress = document.getElementById("strength-progress");
    const strengthText = document.getElementById("strength-text");

    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { width: "0%", text: "قوة كلمة المرور", color: "#c94b4b" },
      { width: "25%", text: "ضعيفة", color: "#c94b4b" },
      { width: "50%", text: "متوسطة", color: "#e09b36" },
      { width: "75%", text: "جيدة", color: "#6d9f55" },
      { width: "100%", text: "قوية", color: "#32834a" },
    ];

    const level = levels[score];

    progress.style.width = level.width;
    progress.style.backgroundColor = level.color;
    strengthText.textContent = level.text;
  }

  passwordInput.addEventListener("input", updatePasswordStrength);

  // تنظيف أخطاء التسجيل
  function setRegisterError(inputId, message) {
    const input = document.getElementById(inputId);

    if (!input) return;

    const group = input.closest(".auth-field");
    const error = document.getElementById(`${inputId}-error`);

    if (group) {
      group.classList.toggle("invalid", message !== "");
    }

    if (error) {
      error.textContent = message;
    }
  }

  // التحقق من البيانات
  function validateRegisterForm() {
    let valid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // الاسم
    if (name.length < 3) {
      setRegisterError(
        "register-name",
        "الاسم يجب أن يحتوي على 3 أحرف على الأقل.",
      );
      valid = false;
    } else {
      setRegisterError("register-name", "");
    }

    // البريد الإلكتروني
    if (!isValidEmail(email)) {
      setRegisterError("register-email", "يرجى إدخال بريد إلكتروني صحيح.");
      valid = false;
    } else {
      setRegisterError("register-email", "");
    }

    // رقم الهاتف اختياري، لكن إذا تم إدخاله نتحقق منه
    if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      setRegisterError("register-phone", "يرجى إدخال رقم هاتف صحيح.");
      valid = false;
    } else {
      setRegisterError("register-phone", "");
    }

    // كلمة المرور
    if (password.length < 8) {
      setRegisterError(
        "register-password",
        "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل.",
      );
      valid = false;
    } else {
      setRegisterError("register-password", "");
    }

    // تأكيد كلمة المرور
    if (confirmPassword !== password || !confirmPassword) {
      setRegisterError(
        "register-confirm-password",
        "كلمتا المرور غير متطابقتين.",
      );
      valid = false;
    } else {
      setRegisterError("register-confirm-password", "");
    }

    // الموافقة على الشروط
    const termsError = document.getElementById("register-terms-error");

    if (!termsInput.checked) {
      termsError.textContent = "يجب الموافقة على الشروط للمتابعة.";
      valid = false;
    } else {
      termsError.textContent = "";
    }

    return valid;
  }

  // إنشاء حساب جديد
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    hideAuthAlert("register-alert");

    if (!validateRegisterForm()) {
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;

    const users = getUsers();

    // منع تكرار البريد الإلكتروني
    const emailExists = users.some((user) => {
      return user.email.toLowerCase() === email;
    });

    if (emailExists) {
      showAuthAlert(
        "register-alert",
        "هذا البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول.",
      );
      return;
    }

    // بيانات الحساب الجديد
    const newUser = {
      id: "USER-" + Date.now(),
      name: name,
      email: email,
      phone: phone,
      password: password,
      role: "customer",
      createdAt: new Date().toISOString(),
    };

    try {
      // حفظ الحساب
      users.push(newUser);
      saveUsers(users);

      // تسجيل دخول المستخدم مباشرة
      loginUser(newUser);

      showAuthAlert(
        "register-alert",
        "تم إنشاء حسابك بنجاح! جاري تحويلك...",
        "success",
      );

      const submitButton = document.getElementById("register-submit");
      submitButton.disabled = true;

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);

      showAuthAlert(
        "register-alert",
        "حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.",
      );
    }
  });

  // إزالة الأخطاء أثناء الكتابة
  registerForm.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const error = document.getElementById(`${input.id}-error`);

      if (error) {
        error.textContent = "";
      }

      const group = input.closest(".auth-field");

      if (group) {
        group.classList.remove("invalid");
      }

      hideAuthAlert("register-alert");
    });
  });
}
