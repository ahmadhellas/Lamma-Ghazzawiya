// =====================================
// ABOUT PAGE - LAMMA GHAZZAWIYA
// =====================================

// إضافة تأثير ظهور العناصر عند الوصول إليها
const aboutAnimatedElements = document.querySelectorAll(
  ".story-content, .story-image, .value-card, .experience-content, .experience-image",
);

if ("IntersectionObserver" in window) {
  const aboutObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("about-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  aboutAnimatedElements.forEach((element) => {
    element.classList.add("about-reveal");
    aboutObserver.observe(element);
  });
}

// صورة بديلة عند فشل تحميل الصور
document
  .querySelectorAll(".about-hero, .about-story img, .about-experience img")
  .forEach((element) => {
    if (element.tagName === "IMG") {
      element.addEventListener(
        "error",
        () => {
          element.src =
            "https://placehold.co/900x650/493026/F3E5CC?text=Lamma+Ghazzawiya";
        },
        { once: true },
      );
    }
  });
