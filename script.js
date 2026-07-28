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
  const mailFallback = document.querySelector("#mail-fallback");
  const mailLink = document.querySelector("#mail-link");
  const copyInquiry = document.querySelector("#copy-inquiry");
  let inquiryText = "";

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);
    const getValue = (name) => String(formData.get(name) || "未入力").trim();
    const type = getValue("ご相談内容");
    const name = getValue("お名前");
    const store = getValue("店舗名");
    const email = getValue("email");
    const phone = getValue("電話番号");
    const currentUrl = getValue("現在のURL");
    const message = getValue("お悩み・ご希望");

    const subject = `【Restaurant Revival】${type}｜${store}`;
    inquiryText = [
      "Restaurant Revivalへのお問い合わせ",
      "",
      `【ご相談内容】${type}`,
      `【お名前】${name}`,
      `【店舗名】${store}`,
      `【メールアドレス】${email}`,
      `【電話番号】${phone}`,
      `【現在のホームページ・掲載ページ】${currentUrl}`,
      "",
      "【お悩み・ご希望】",
      message
    ].join("\n");

    const mailto = `mailto:takuto.kobayashi1014@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(inquiryText)}`;
    if (mailLink) mailLink.href = mailto;
    if (mailFallback) {
      mailFallback.hidden = false;
      mailFallback.focus();
    }
    window.location.href = mailto;
  });

  if (copyInquiry) {
    copyInquiry.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(inquiryText);
        copyInquiry.textContent = "コピーしました";
      } catch {
        copyInquiry.textContent = "コピーできませんでした";
      }
      window.setTimeout(() => {
        copyInquiry.textContent = "問い合わせ内容をコピー";
      }, 2500);
    });
  }
}
