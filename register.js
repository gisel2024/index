// Runs on register.html
const form = document.getElementById("registerForm");
const errorBox = document.getElementById("formError");

form.addEventListener("submit", function (event) {
  event.preventDefault(); 

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;


  if (name === "" || email === "" || password === "") {
    return showError("Please fill in every field.");
  }
  if (!email.includes("@") || !email.includes(".")) {
    return showError("Enter a valid email, like you@email.com.");
  }
  if (password.length < 6) {
    return showError("Password must have at least 6 characters.");
  }

  // (localStorage) ruajtja e userit ne browser
  const user = { name: name, email: email };
  localStorage.setItem("user", JSON.stringify(user));

  
  window.location.href = "index.html";
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}
