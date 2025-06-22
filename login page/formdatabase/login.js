const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

const passwordInput = document.getElementById("password");
const warning = document.getElementById("password-warning");

passwordInput.addEventListener("input", function () {
  const value = passwordInput.value;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[@$!%*?&]/.test(value);
  const isLengthValid = value.length >= 8;

  if (
    !hasUpperCase ||
    !hasLowerCase ||
    !hasNumber ||
    !hasSpecialChar ||
    !isLengthValid
  ) {
    warning.style.display = "block";

    let message = "Your password must include:";
    if (!hasUpperCase) message += "\n- At least one uppercase letter";
    if (!hasLowerCase) message += "\n- At least one lowercase letter";
    if (!hasNumber) message += "\n- At least one number";
    if (!hasSpecialChar)
      message += "\n- At least one special character (@$!%*?&)";
    if (!isLengthValid) message += "\n- Minimum 8 characters";

    warning.textContent = message;
    passwordInput.style.border = "2px solid red";
  } else {
    warning.style.display = "none";
    passwordInput.style.border = "2px solid green";
  }
});
const emailInput = document.querySelector('input[name="email"]');
const emailWarning = document.createElement("small");
emailWarning.style.color = "red";
emailWarning.style.display = "none";
emailInput.parentNode.appendChild(emailWarning);

emailInput.addEventListener("input", function () {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value)) {
    emailWarning.style.display = "block";
    emailWarning.textContent =
      "Invalid email format! Example: user@example.com";
    emailInput.style.border = "2px solid red";
  } else {
    emailWarning.style.display = "none";
    emailInput.style.border = "2px solid green";
  }
});
