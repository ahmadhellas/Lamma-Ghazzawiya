// ==========================================
// LAMMA GHAZZAWIYA - VALIDATION SYSTEM
// ==========================================

const Validation = {
  // التحقق من أن الحقل غير فارغ
  isRequired(value) {
    return value !== null && value !== undefined && String(value).trim() !== "";
  },

  // التحقق من البريد الإلكتروني
  isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    return emailRegex.test(String(email).trim());
  },

  // التحقق من طول النص
  minLength(value, length) {
    return String(value).trim().length >= length;
  },

  // التحقق من الحد الأقصى لطول النص
  maxLength(value, length) {
    return String(value).trim().length <= length;
  },

  // التحقق من كلمة المرور
  isStrongPassword(password) {
    return typeof password === "string" && password.length >= 8;
  },

  // التحقق من تطابق كلمتي المرور
  passwordsMatch(password, confirmPassword) {
    return password === confirmPassword;
  },

  // التحقق من رقم الهاتف
  isPhone(phone) {
    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
    return phoneRegex.test(String(phone).trim());
  },

  // التحقق من الأرقام فقط
  isNumber(value) {
    return value !== "" && value !== null && Number.isFinite(Number(value));
  },

  // التحقق من أن الرقم موجب
  isPositiveNumber(value) {
    return this.isNumber(value) && Number(value) > 0;
  },

  // التحقق من السعر
  isValidPrice(price) {
    return this.isNumber(price) && Number(price) >= 0;
  },

  // التحقق من الكميات
  isValidQuantity(quantity) {
    return Number.isInteger(Number(quantity)) && Number(quantity) > 0;
  },

  // التحقق من صحة النص
  isValidText(value) {
    return this.isRequired(value) && String(value).trim().length >= 2;
  },

  // التحقق من رابط الصورة
  isValidImageUrl(url) {
    if (!this.isRequired(url)) return false;

    try {
      const parsedUrl = new URL(url);

      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  },

  // التحقق من تاريخ صالح
  isValidDate(date) {
    if (!this.isRequired(date)) return false;

    const parsedDate = new Date(date);

    return !Number.isNaN(parsedDate.getTime());
  },

  // التحقق من اختيار Checkbox
  isChecked(checkbox) {
    return checkbox === true;
  },

  // التحقق من صحة نموذج كامل
  validateForm(formData, rules) {
    const errors = {};

    Object.keys(rules).forEach((field) => {
      const value = formData[field];
      const fieldRules = rules[field];

      for (const rule of fieldRules) {
        let valid = true;

        switch (rule.type) {
          case "required":
            valid = this.isRequired(value);
            break;

          case "email":
            valid = this.isEmail(value);
            break;

          case "minLength":
            valid = this.minLength(value, rule.value);
            break;

          case "maxLength":
            valid = this.maxLength(value, rule.value);
            break;

          case "password":
            valid = this.isStrongPassword(value);
            break;

          case "phone":
            valid = this.isPhone(value);
            break;

          case "number":
            valid = this.isNumber(value);
            break;

          case "positiveNumber":
            valid = this.isPositiveNumber(value);
            break;

          default:
            valid = true;
        }

        if (!valid) {
          errors[field] = rule.message;
          break;
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // عرض رسالة الخطأ بجانب الحقل
  showError(input, message) {
    if (!input) return;

    input.classList.add("is-invalid");

    let errorElement = input.parentElement?.querySelector(".validation-error");

    if (!errorElement) {
      errorElement = document.createElement("small");
      errorElement.className = "validation-error";

      input.insertAdjacentElement("afterend", errorElement);
    }

    errorElement.textContent = message;
  },

  // إزالة رسالة الخطأ
  clearError(input) {
    if (!input) return;

    input.classList.remove("is-invalid");

    const errorElement =
      input.parentElement?.querySelector(".validation-error");

    if (errorElement) {
      errorElement.remove();
    }
  },

  // التحقق من حقل وإظهار النتيجة
  validateField(input, rules) {
    if (!input) return false;

    this.clearError(input);

    const value = input.value;

    for (const rule of rules) {
      let valid = true;

      switch (rule.type) {
        case "required":
          valid = this.isRequired(value);
          break;

        case "email":
          valid = this.isEmail(value);
          break;

        case "password":
          valid = this.isStrongPassword(value);
          break;

        case "phone":
          valid = this.isPhone(value);
          break;

        case "minLength":
          valid = this.minLength(value, rule.value);
          break;

        case "maxLength":
          valid = this.maxLength(value, rule.value);
          break;

        default:
          valid = true;
      }

      if (!valid) {
        this.showError(input, rule.message);
        return false;
      }
    }

    return true;
  },

  // مسح جميع أخطاء النموذج
  clearFormErrors(form) {
    if (!form) return;

    form
      .querySelectorAll(".is-invalid")
      .forEach((input) => this.clearError(input));

    form
      .querySelectorAll(".validation-error")
      .forEach((error) => error.remove());
  },
};

// ==========================================
// EXPORT
// ==========================================

if (typeof window !== "undefined") {
  window.Validation = Validation;
}
