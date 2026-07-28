const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

function closeMenu() {
  if (!nav || !menuButton) return;
  nav.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "メニューを開く");
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  });

  document.querySelectorAll(".nav a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach((element) => observer.observe(element));
}

const copyButton = document.querySelector(".copy-button");
if (copyButton) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copy);
      copyButton.textContent = "コピーしました";
    } catch {
      copyButton.textContent = "長押ししてコピーしてください";
    }
    window.setTimeout(() => {
      copyButton.textContent = "メールアドレスをコピー";
    }, 2500);
  });
}

const inquiryType = document.querySelector("#inquiry-type");
document.querySelectorAll("[data-inquiry-type]").forEach((link) => {
  link.addEventListener("click", () => {
    if (inquiryType) inquiryType.value = link.dataset.inquiryType;
  });
});

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const submitButton = contactForm.querySelector(".submit-button");
  contactForm.addEventListener("submit", (event) => {
    if (!contactForm.checkValidity()) {
      event.preventDefault();
      contactForm.reportValidity();
      return;
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "送信しています…";
    }
  });
}

const params = new URLSearchParams(window.location.search);
const formSuccess = document.querySelector("#form-success");
const formError = document.querySelector("#form-error");
if (params.get("sent") === "1" && formSuccess) {
  formSuccess.hidden = false;
  formSuccess.focus();
}
if (params.get("send") === "error" && formError) {
  formError.hidden = false;
  formError.focus();
}
if (params.has("sent") || params.has("send")) {
  params.delete("sent");
  params.delete("send");
  const cleanQuery = params.toString();
  const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", cleanUrl);
}
