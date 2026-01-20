let token = localStorage.getItem("token");

  if (!token || token === "undefined") {
    logoutUser();
  }

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/signin.html";
}
const userName = document.querySelector(".user-name");
const userEmail = document.querySelector(".user-email");

//get User info
const user = JSON.parse(localStorage.getItem("user"));
userName.innerHTML = user.userName;
userEmail.innerHTML = user.email;

const profileView = document.querySelector(".profile-view");
const formView = document.querySelector(".profile-form");
const editButton = document.querySelector(".edit-button");


editButton.addEventListener("click", showForm);

function showForm() {
    formView.style.display = "block";
    document.getElementById("user-name").value = userName.textContent;
    document.getElementById("user-email").value = userEmail.textContent;
    profileView.style.display = "none";
}

//Post Request for Profile
const saveButton = document.querySelector(".save-button");
const form = document.getElementById("form-section");
form.addEventListener("submit",async function (e) {
  e.preventDefault();
  saveButton.disabled = true;
    const userRequest = {
    userName: document.getElementById("user-name").value,
    email: document.getElementById("user-email").value,
  };
     try {
      const response = await fetch(`https://ai-powered-resume-analyzer-production-36ed.up.railway.app/api/v1/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userRequest)
      });

      if (response.status === 401|| response.status === 404) {
        logoutUser();
      }
      const data = await response.json();
      saveButton.disabled = false;
      if (!response.ok) {
        throw new Error(data.message);
      }
      user.userName = data.userName;
      user.email = data.email;
      localStorage.setItem("user", JSON.stringify(user));
      showToast(`Successfully Updated`, "success");
      showProfile();
    } catch (error) {
      console.log(error);
      showToast(`${error}`, "danger");
    }
      
});


function showProfile() {
    formView.style.display = "none";
    profileView.style.display = "block";
    userName.innerHTML = user.userName;
    userEmail.innerHTML = user.email;
}

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


//logout 
document.querySelector(".logout-button").addEventListener("click", logoutUser);