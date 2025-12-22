

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

    // let loadingText = document.createElement("div");
    // loadingText.innerHTML = '<p class="Big-span" style="margin:0">Validating File</p>';
    // let spinner = document.createElement("div");
    // spinner.className = "spinner-border text-primary";
    // spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    // fileUploadLabel.appendChild(loadingText);
    // fileUploadLabel.appendChild(spinner);

    try {
      const response = await fetch("http://localhost:8080/resume/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      document.querySelector(".Big-span").textContent = "Uploaded Successfully ✔️";
      document.querySelector(".spinner-border").remove();
      sessionStorage.setItem("resumeId", data.resumeId);
      


    } catch (error) {
      toggleInnerHTML(fileUploadLabel)
      fileUploadLabel.classList.remove("uploading-state");
      showToast(`Error uploading resume ${error}`, "danger");
    }
      }
}

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
      `http://localhost:8080/resume/analyze/${resumeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain"
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

//Toast caller 
function showToast(message, type = "primary") {
  const toastEl = document.getElementById("appToast");
  const toastBody = document.getElementById("toastMessage");

  // Set message
  toastBody.textContent = message;

  // Reset & apply color
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;

  // Show toast
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




