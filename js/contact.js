// =====================================
// CONTACT PAGE - LAMMA GHAZZAWIYA
// =====================================

const contactForm = document.getElementById("contact-form");
const contactSuccess = document.getElementById("contact-success");
const contactSubmit = document.getElementById("contact-submit");

// التحقق من صحة البريد الإلكتروني
function isValidContactEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// عرض رسالة الخطأ
function setContactError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  const group = field.closest(".contact-form-group");

  error.textContent = message;
  group.classList.toggle("invalid", message !== "");
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

// التحقق من جميع الحقول
function validateContactForm() {
  let valid = true;

  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const subject = document.getElementById("contact-subject").value.trim();
  const message = document.getElementById("contact-message").value.trim();

  if (name.length < 3) {
    setContactError("contact-name", "الاسم يجب أن يحتوي على 3 أحرف على الأقل.");
    valid = false;
  } else {
    setContactError("contact-name", "");
  }

  if (!isValidContactEmail(email)) {
    setContactError("contact-email", "يرجى إدخال بريد إلكتروني صحيح.");
    valid = false;
  } else {
    setContactError("contact-email", "");
  }

  if (subject.length < 3) {
    setContactError("contact-subject", "يرجى كتابة موضوع واضح للرسالة.");
    valid = false;
  } else {
    setContactError("contact-subject", "");
  }

  if (message.length < 10) {
    setContactError(
      "contact-message",
      "الرسالة يجب أن تحتوي على 10 أحرف على الأقل.",
    );
    valid = false;
  } else {
    setContactError("contact-message", "");
  }

  return valid;
}

// حفظ الرسالة
function saveContactMessage(messageData) {
  const messages = Storage.get("contactMessages") || [];

  const newMessage = {
    id: "MSG-" + Date.now().toString().slice(-9),
    name: messageData.name,
    email: messageData.email,
    subject: messageData.subject,
    category: messageData.category,
    message: messageData.message,
    date: new Date().toISOString(),
    status: "new",
  };

  messages.unshift(newMessage);

  Storage.set("contactMessages", messages);

  return newMessage;
}

// إرسال الرسالة
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateContactForm()) {
    const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');

    if (firstInvalid) {
      firstInvalid.focus();
    }

    return;
  }

  const messageData = {
    name: document.getElementById("contact-name").value.trim(),

    email: document.getElementById("contact-email").value.trim(),

    subject: document.getElementById("contact-subject").value.trim(),

    category: document.getElementById("contact-category").value,

    message: document.getElementById("contact-message").value.trim(),
  };

  contactSubmit.disabled = true;

  try {
    saveContactMessage(messageData);

    // إظهار رسالة النجاح
    contactSuccess.hidden = false;

    // إعادة ضبط النموذج
    contactForm.reset();

    // إزالة أخطاء الحقول
    contactForm.querySelectorAll(".contact-form-group").forEach((group) => {
      group.classList.remove("invalid");

      const error = group.querySelector(".contact-error");

      if (error) {
        error.textContent = "";
      }

      const field = group.querySelector("input, textarea");

      if (field) {
        field.removeAttribute("aria-invalid");
      }
    });

    // إظهار رسالة النجاح للمستخدم
    contactSuccess.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  } catch (error) {
    console.error("Contact message error:", error);

    alert("حدث خطأ أثناء حفظ رسالتك. حاول مرة أخرى.");
  } finally {
    contactSubmit.disabled = false;
  }
});

// إزالة الخطأ عند الكتابة
contactForm.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    const group = field.closest(".contact-form-group");

    if (!group) return;

    group.classList.remove("invalid");

    const error = group.querySelector(".contact-error");

    if (error) {
      error.textContent = "";
    }

    field.removeAttribute("aria-invalid");
  });
});

// صورة بديلة إذا لم يتم تحميل الصورة
document.querySelectorAll(".contact-side-image img").forEach((image) => {
  image.addEventListener(
    "error",
    () => {
      image.src =
        "https://placehold.co/900x600/493026/F3E5CC?text=Lamma+Ghazzawiya";
    },
    { once: true },
  );
});
