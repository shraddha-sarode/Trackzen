// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  offset: 100,
  once: true,
});

// Theme Toggle
const themeToggle = document.querySelector(".theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
  if (body.getAttribute("data-theme") === "dark") {
    body.removeAttribute("data-theme");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem("theme", "light");
  } else {
    body.setAttribute("data-theme", "dark");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("theme", "dark");
  }
});

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.setAttribute("data-theme", "dark");
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Mobile Menu
const mobileMenu = document.querySelector(".mobile-menu");
const navLinks = document.querySelector(".nav-links");

mobileMenu.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Close mobile menu if open
      navLinks.classList.remove("active");
      mobileMenu.classList.remove("active");
    }
  });
});

// Navbar Scroll Effect
const navbar = document.querySelector(".navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    navbar.classList.remove("scroll-up");
    return;
  }

  if (currentScroll > lastScroll && !navbar.classList.contains("scroll-down")) {
    // Scroll Down
    navbar.classList.remove("scroll-up");
    navbar.classList.add("scroll-down");
  } else if (
    currentScroll < lastScroll &&
    navbar.classList.contains("scroll-down")
  ) {
    // Scroll Up
    navbar.classList.remove("scroll-down");
    navbar.classList.add("scroll-up");
  }
  lastScroll = currentScroll;
});

// Feature Cards Hover Effect
const featureCards = document.querySelectorAll(".feature-card");

featureCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});

// Stats Counter Animation
const stats = document.querySelectorAll(".stat-number");
let animated = false;

function animateStats() {
  if (animated) return;

  stats.forEach((stat) => {
    const target = parseInt(stat.textContent);
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const interval = duration / 50;

    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        stat.textContent = target + (stat.textContent.includes("+") ? "+" : "");
        clearInterval(counter);
      } else {
        stat.textContent =
          Math.floor(current) + (stat.textContent.includes("+") ? "+" : "");
      }
    }, interval);
  });

  animated = true;
}

// Intersection Observer for Stats Animation
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStats();
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelector(".hero-stats").forEach((stats) => {
  statsObserver.observe(stats);
});

// Floating Elements Animation
const floatingElements = document.querySelectorAll(".float-item");

floatingElements.forEach((element, index) => {
  element.style.animationDelay = `${index * 0.5}s`;
});

// Update copyright year
document.getElementById("year").textContent = new Date().getFullYear();

// Add parallax effect to hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroSection = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");

  if (heroSection && heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
  }
});

// Add hover effect to social links
const socialLinks = document.querySelectorAll(".social-link");

socialLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    link.style.transform = "translateY(-5px)";
  });

  link.addEventListener("mouseleave", () => {
    link.style.transform = "translateY(0)";
  });
});

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
