document.getElementById("show-register").addEventListener("click", function () {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", function () {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
});

const loginButton = document.getElementById("login");
const registerButton = document.getElementById("register");

loginButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevents form submission

  // Get the username, email, and password values
  const usernameField = document.getElementById("username");
  const emailField = document.getElementById("email");
  const passwordField = document.getElementById("password");

  const username = usernameField.value.trim();
  const email = emailField.value.trim();
  const password = passwordField.value.trim();

  // Validation
  if (username === "") {
    alert("Please enter a valid username.");
  } else if (email === "") {
    alert("Please enter your email address.");
  } else if (!email.includes("@") || !email.includes(".")) {
    alert("Please enter a valid email address.");
  } else if (password === "") {
    alert("Please enter your password.");
  } else if (password.length <= 6) {
    alert("Your password is >6 Characters.");
  } else {
    alert("Login successful!");
    window.location.href = "community.html";
    // Clear the input fields
    usernameField.value = "";
    emailField.value = "";
    passwordField.value = "";

    // Example: Redirect to another page upon successful login
    // window.location.href = "dashboard.html";
  }
});
registerButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevents form submission

  const req_usernameField = document.getElementById("reg-username");
  const req_emailField = document.getElementById("reg-email");
  const req_passwordField = document.getElementById("reg-password");

  const con_passwordField = document.getElementById("reg-confirm-password");

  const req_username = req_usernameField.value.trim();
  const req_email = req_emailField.value.trim();
  const req_password = req_passwordField.value.trim();
  const con_password = con_passwordField.value.trim();

  if (req_username === "") {
    alert("Please enter a valid username.");
  } else if (req_email === "") {
    alert("Please enter your email address.");
  } else if (!req_email.includes("@") || !req_email.includes(".")) {
    alert("Please enter a valid email address.");
  } else if (req_password === "" || req_password <= 6) {
    alert("Please enter a valid password with at least 6 characters.");
  } else if (con_password !== req_password) {
    alert("Confirmation password does not match the entered password.");
  } else {
    alert("Login successful!");
    window.location.href = "community.html";
    // Clear the input fields
    req_usernameField.value = "";
    req_emailField.value = "";
    req_passwordField.value = "";
    con_passwordField.value = "";
  }
});
