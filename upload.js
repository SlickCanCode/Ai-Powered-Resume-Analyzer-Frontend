
let token = localStorage.getItem("token");

  if (!token || token === "undefined") {
    logoutUser();
  }

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/signin.html";
}


//get User info
const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
//set Welcome Header
const welcomeHeader = document.querySelector(".welcome-header");
welcomeHeader.innerHTML = `Welcome ${user.userName}`;


//upload file
const uploadedFile = document.getElementById("fileUpload");
uploadedFile.addEventListener("change", uploadFile);
const fileUploadLabel = document.querySelector(".file-upload");
const bigSpan = document.querySelector(".Big-span");

async function uploadFile(event) {
  const files = event.target.files;

  if (files && files.length > 0) {
        const file = files[0];

        const formData = new FormData();
    formData.append("file", file); 
    // fileUploadLabel.innerHTML = "";    
    let innerHTML = '<div><p class="Big-span" style="margin:0">Validating File</p></div><div class="spinner-border text-primary"><span class="visually-hidden">Loading...</span></div>'
    toggleInnerHTML(fileUploadLabel, innerHTML)
    fileUploadLabel.classList.add("uploading-state");


    try {
      const response = await fetch(`http://ai-powered-resume-analyzer-production-36ed.up.railway.app/api/v1/users/${user.id}/resumes`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 401|| response.status === 404) {
        logoutUser();
      }
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      document.querySelector(".Big-span").textContent = "Uploaded Successfully ✔️";
      document.querySelector(".spinner-border").remove();
      sessionStorage.setItem("resumeId", data.resumeId);
    } catch (error) {
      console.log(error);
      toggleInnerHTML(fileUploadLabel)
      fileUploadLabel.classList.remove("uploading-state");
      showToast(`Error uploading resume ${error}`, "danger");
    }
      }
}


//Analyze resume
const analyzeResumeButton = document.querySelector(".analyze-button");
analyzeResumeButton.addEventListener("click", analyzeResume);
const analysisSection = document.querySelector(".analyze-container");
const uploadSection = document.querySelector(".upload-container");
async function analyzeResume() {
  const resumeId = sessionStorage.getItem("resumeId");
  const jobDescription = document.getElementById("jobDescription").value;
  if (resumeId === null) {
    showToast("Please upload resume file");
    return;
  }else if(jobDescription === "") {
    showToast("Please type in your job description for meaningful analysis score");
    return;
  }
  toggleInnerHTML(analyzeResumeButton, '<div class="spinner-border text-light"><span class="visually-hidden">Loading...</span></div>')
  try {
    const response = await fetch(
      `http://ai-powered-resume-analyzer-production-36ed.up.railway.app/api/v1/resumes/${resumeId}/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "Authorization": `Bearer ${token}`
        },
        body: jobDescription
      }
    );

        const data = await response.json();
    if (!response.ok) {
      throw new Error(`Analysis failed!${data.message}`);
    }
    setScore(data.score);
    setAnalysis(data.strengths, "strengths");
    setAnalysis(data.weaknesses, "weaknesses");
    setAnalysis(data.improvementSuggestions, "improvementSuggestions");
    setJobLinks(data.jobRecommendations);
    analysisSection.classList.add("is-mounted");
    uploadSection.style.display = "none";
    requestAnimationFrame(() => {
      analysisSection.classList.add("is-visible");
    });

  } catch (error) {   
      toggleInnerHTML(analyzeResumeButton)
    showToast(error, "danger");
  }
}

// Score loader
function setScore(score) {
    const circle = document.querySelector(".ring-progress");
    const text = document.getElementById("scoreText");

    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset =
      circumference - (score / 100) * circumference;

    text.textContent = `${score}/100`;
  }

//analysis setter
function setAnalysis(analysis, name) {
  const analysisPart = document.querySelector(`.${name}`);
  for(i = 0; i < analysis.length;i++) {
   let item =  document.createElement("li");
   item.textContent = analysis[i];
   analysisPart.appendChild(item);
  }
}

function setJobLinks(list) {
  const ul = document.querySelector(".jobMatches");

  // Clear existing content (important if re-rendering)
  ul.innerHTML = "";

  list.forEach(item => {
    const li = document.createElement("li");

    const a = document.createElement("a");
    a.href = item.link;
    a.textContent = item.platform;
    a.target = "_blank"; // open in new tab
    a.rel = "noopener noreferrer";

    li.appendChild(a);
    ul.appendChild(li);
  });
}

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

//Element toggler 
function toggleInnerHTML(element, newHTML = "none") {
  // First time: store original HTML
  if (!element.dataset.originalHtml) {
    element.dataset.originalHtml = element.innerHTML;
    element.dataset.toggled = "false";
  }

  if (element.dataset.toggled === "false") {
    element.innerHTML = newHTML;
    element.dataset.toggled = "true";
  } else {
    element.innerHTML = element.dataset.originalHtml;
    element.dataset.toggled = "false";
  }
}

//Analysis Dropdown

const strengthsContainer = document.querySelector(".one");
const strengthsDropdown = document.querySelector(".str");
const strengthsIcon = strengthsContainer.querySelector(".dd-svg");

const weaknessContainer = document.querySelector(".two");
const weaknessDropdown = document.querySelector(".weak");
const weaknessIcon = weaknessContainer.querySelector(".dd-svg");

const improvementsContainer = document.querySelector(".three");
const improvementDropdown = document.querySelector(".impr");
const improvementIcon = improvementsContainer.querySelector(".dd-svg");

const jobMatchContainer = document.querySelector(".four");
const jobMatchDropdown = document.querySelector(".job");
const jobMatchIcon = jobMatchContainer.querySelector(".dd-svg");

strengthsContainer.addEventListener("click", () => {
  toggleDropdown(strengthsDropdown, strengthsIcon);
});

weaknessContainer.addEventListener("click", () => {
  toggleDropdown(weaknessDropdown, weaknessIcon);
});

improvementsContainer.addEventListener("click", () => {
  toggleDropdown(improvementDropdown, improvementIcon);
});

jobMatchContainer.addEventListener("click", () => {
  toggleDropdown(jobMatchDropdown, jobMatchIcon);
})

function toggleDropdown(dropdown, icon) {
 const isOpen = dropdown.style.display === "block";

dropdown.style.display = isOpen ? "none" : "block";

icon.src = isOpen
  ? "images/caret-right-fill.svg"   // closed state
  : "images/caret-down-fill.svg";   // open state
}


