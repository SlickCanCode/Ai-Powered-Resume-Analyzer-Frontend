const signupButton = document.querySelector(".signup-button");

document.getElementById("signup-form").addEventListener("submit", async function (e) {
  e.preventDefault();
    signupButton.disabled = true;

  const user = {
    userName: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {
    const response = await fetch("http://localhost:8080/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });
    data = await response.json();

    if (response.status === 201) {
    console.log("User registered successfully");
    localStorage.setItem("token", data.jwt);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "/upload.html";
    
    } else {
        showToast(data.message[0], "danger");
    }

  } catch (error) {
    console.error("Error:", error);
  }
});



//Toast caller 
function showToast(message, type = "primary") {
  const toastEl = document.getElementById("appToast");
  const toastBody = document.getElementById("toastMessage");

  toastBody.textContent = message;

  toastEl.className = `toast align-items-center text-bg-${type} border-0`;

  const toast = new bootstrap.Toast(toastEl, {
    delay: 3000
  });

  toast.show();
}