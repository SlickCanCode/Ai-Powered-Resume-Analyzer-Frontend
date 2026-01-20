const signinButton = document.getElementById("loginButton");

document.getElementById("signinForm").addEventListener("submit", async function (e) {
  e.preventDefault();
    signinButton.disabled = true;

  const user = {
    userNameOrEmail: document.getElementById("usernameOrEmail").value,
    password: document.getElementById("password").value
  };

  try {
    const response = await fetch("https://ai-powered-resume-analyzer-production-36ed.up.railway.app/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });
    data = await response.json();

    if (response.status === 200) {
    localStorage.setItem("token", data.jwt);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "/upload.html";

    } else{
        showToast(data.message, "danger");
    }
    signinButton.disabled = false;
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