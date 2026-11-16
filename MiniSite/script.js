const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    showStatus("Please fill in all fields.", "error");
    return;
  }
  if (!form.email.checkValidity()) {
    showStatus("Please enter a valid email address.", "error");
    return;
  }

  // No backend yet: connect this form to an email service or API to send messages.
  showStatus(`Thanks, ${name}! Your message has been noted.`, "success");
  form.reset();
});

function showStatus(text, type) {
  status.textContent = text;
  status.className = `form-status ${type}`;
}
