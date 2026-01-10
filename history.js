let token = localStorage.getItem("token");

  if (!token || token === "undefined") {
    logoutUser();
  }

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/signin.html";
}


function setScore(score, element) {
    const circle = element.querySelector(".ring-progress");
    const text = element.getElementById("scoreText");

    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset =
      circumference - (score / 100) * circumference;

    text.textContent = `${score}/100`;
  }
function setAnalysis(analysis, name, element) {
  const analysisPart = element.querySelector(`.${name}`);
  for(i = 0; i < analysis.length;i++) {
   let item =  document.createElement("li");
   item.textContent = analysis[i];
   analysisPart.appendChild(item);
  }
  }
function setJobLinks(list, element) {
  const ul = element.querySelector(".jobMatches");

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

//get User info
const user = JSON.parse(localStorage.getItem("user"));
getResumes();

const template = document.getElementById("analysis-template");
const container = document.getElementById("history");
//Resume History request
async function getResumes() {

 try {
      const response = await fetch(`http://localhost:8080/api/v1/users/${user.id}/resumes`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.status === 401|| response.status === 404) {
        logoutUser();
      }
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      setResumes(data);
    const analysisSections = document.querySelectorAll(".analyze-container");
    analysisSections.forEach(analysisSection => {
          analysisSection.classList.add("is-mounted");
    requestAnimationFrame(() => {
      analysisSection.classList.add("is-visible");
    });
    })

    } catch (error) {
        console.log(error);
    }  

  }

function setResumes(resumes) {
  if (resumes.length > 0) {

  resumes.forEach(resume => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".resume-title").textContent = resume.name;
    const analysis = resume.analysis;
    if (analysis != null) {
          setScore(analysis.score,clone);
    setAnalysis(analysis.strengths, "strengths", clone);
    setAnalysis(analysis.weaknesses, "weaknesses", clone);
    setAnalysis(analysis.improvementSuggestions, "improvementSuggestions", clone);
    setJobLinks(analysis.jobRecommendations, clone);

    }
    analysisDropdown(clone);
    container.innerHTML = "";
    container.appendChild(clone);
  });

  }else{
    showNoHistory();
  }

}

function showNoHistory(){
  const noResumes = document.createElement("div");
  noResumes.classList.add("no-resumes");
  noResumes.innerHTML = "<h1>No Resumes Yet</h1>"
  container.appendChild(noResumes);
}

function analysisDropdown(element) {
  const strengthsContainer = element.querySelector(".one");
const strengthsDropdown = element.querySelector(".str");
const strengthsIcon = strengthsContainer.querySelector(".dd-svg");

const weaknessContainer = element.querySelector(".two");
const weaknessDropdown = element.querySelector(".weak");
const weaknessIcon = weaknessContainer.querySelector(".dd-svg");

const improvementsContainer = element.querySelector(".three");
const improvementDropdown = element.querySelector(".impr");
const improvementIcon = improvementsContainer.querySelector(".dd-svg");

const jobMatchContainer = element.querySelector(".four");
const jobMatchDropdown = element.querySelector(".job");
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
}



function toggleDropdown(dropdown, icon) {
 const isOpen = dropdown.style.display === "block";

dropdown.style.display = isOpen ? "none" : "block";

icon.src = isOpen
  ? "images/caret-right-fill.svg"   // closed state
  : "images/caret-down-fill.svg";   // open state
}

