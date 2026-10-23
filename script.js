
/* =========================================
   SKILLBRIDGE - STUDENT PLACEMENT SYSTEM
   JavaScript
========================================= */

const $ = (id) => document.getElementById(id);

const STORAGE = {
  students: "skillbridge_students",
  currentStudent: "skillbridge_current_student",
  applications: "skillbridge_applications"
};

const careerSkills = {
  web: ["HTML", "CSS", "JavaScript", "Git", "React"],
  python: ["Python", "OOP", "SQL", "Git", "Django"],
  data: ["Python", "SQL", "Excel", "Statistics", "Power BI"]
};

const jobs = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechNova Solutions",
    type: "Internship",
    location: "Remote",
    skills: ["HTML", "CSS", "JavaScript"],
    description: "Work on responsive websites and user interfaces."
  },
  {
    id: 2,
    title: "Python Developer Intern",
    company: "CodeCraft Technologies",
    type: "Internship",
    location: "Noida",
    skills: ["Python", "OOP", "SQL"],
    description: "Develop Python applications and work with databases."
  },
  {
    id: 3,
    title: "Junior Web Developer",
    company: "Digital Future",
    type: "Full-time",
    location: "Ghaziabad",
    skills: ["HTML", "CSS", "JavaScript", "Git"],
    description: "Build and maintain websites for business clients."
  },
  {
    id: 4,
    title: "Data Analyst Intern",
    company: "Insight Analytics",
    type: "Internship",
    location: "Remote",
    skills: ["Python", "SQL", "Excel"],
    description: "Analyze datasets and create useful reports."
  },
  {
    id: 5,
    title: "React Developer Intern",
    company: "WebSpark",
    type: "Internship",
    location: "Noida",
    skills: ["JavaScript", "React", "Git"],
    description: "Learn React and develop modern web applications."
  },
  {
    id: 6,
    title: "Junior Python Developer",
    company: "ByteWorks",
    type: "Full-time",
    location: "Delhi",
    skills: ["Python", "OOP", "SQL", "Django"],
    description: "Assist in developing backend applications."
  }
];

/* STORAGE HELPERS */

function getData(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error("Storage error:", error);
    return fallback;
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentStudent() {
  return getData(STORAGE.currentStudent, null);
}

function getApplications() {
  return getData(STORAGE.applications, []);
}

function showMessage(message, type = "info") {
  const element = $("authMessage");

  if (!element) return;

  element.textContent = message;
  element.style.color =
    type === "error" ? "#dc2626" :
    type === "success" ? "#16a34a" :
    "#2563eb";
}

/* LOGIN AND REGISTER TABS */

function showLoginForm() {
  $("loginForm").hidden = false;
  $("registerForm").hidden = true;

  $("showLogin").classList.add("active");
  $("showRegister").classList.remove("active");

  showMessage("");
}

function showRegisterForm() {
  $("loginForm").hidden = true;
  $("registerForm").hidden = false;

  $("showRegister").classList.add("active");
  $("showLogin").classList.remove("active");

  showMessage("");
}

/* REGISTER */

function registerStudent(event) {
  event.preventDefault();

  const name = $("studentName").value.trim();
  const email = $("registerEmail").value.trim().toLowerCase();
  const password = $("registerPassword").value;
  const course = $("studentCourse").value.trim();

  if (!name || !email || !password || !course) {
    showMessage("Please fill all fields.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must contain at least 6 characters.", "error");
    return;
  }

  const students = getData(STORAGE.students, []);

  const existingStudent = students.find(
    (student) => student.email === email
  );

  if (existingStudent) {
    showMessage("This email is already registered. Please login.", "error");
    return;
  }

  const student = {
    id: Date.now(),
    name,
    email,
    course,
    skills: [],
    createdAt: new Date().toISOString()
  };

  // Demo only: password is stored locally.
  // Do not use real or sensitive passwords here.
  student.demoPassword = password;

  students.push(student);
  saveData(STORAGE.students, students);

  saveData(STORAGE.currentStudent, student);

  $("registerForm").reset();

  showMessage("Registration successful! Welcome to SkillBridge.", "success");

  updateDashboard();
}

/* LOGIN */

function loginStudent(event) {
  event.preventDefault();

  const email = $("loginEmail").value.trim().toLowerCase();
  const password = $("loginPassword").value;

  const students = getData(STORAGE.students, []);

  const student = students.find(
    (item) =>
      item.email === email &&
      item.demoPassword === password
  );

  if (!student) {
    showMessage("Invalid email or password.", "error");
    return;
  }

  saveData(STORAGE.currentStudent, student);

  $("loginForm").reset();

  showMessage("Login successful!", "success");

  updateDashboard();
}

/* LOGOUT */

function logoutStudent() {
  localStorage.removeItem(STORAGE.currentStudent);

  showMessage("You have logged out.", "success");

  updateDashboard();
}

/* PROFILE */

function renderProfile() {
  const student = getCurrentStudent();
  const panel = $("profilePanel");

  if (!student) {
    panel.innerHTML = "<p>Login to view your student profile.</p>";
    return;
  }

  panel.innerHTML = `
    <h3>${escapeHTML(student.name)}</h3>
    <p><strong>Email:</strong> ${escapeHTML(student.email)}</p>
    <p><strong>Course:</strong> ${escapeHTML(student.course)}</p>
    <p><strong>Skills:</strong> ${
      student.skills.length
        ? student.skills.map(escapeHTML).join(", ")
        : "No skills added yet"
    }</p>
  `;
}

/* JOB LISTINGS */

function renderJobs() {
  const list = $("jobsList");

  if (!list) return;

  const search = $("jobSearch").value.trim().toLowerCase();
  const type = $("jobType").value;

  const filteredJobs = jobs.filter((job) => {
    const searchableText = [
      job.title,
      job.company,
      job.location,
      ...job.skills
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(search);
    const matchesType = type === "all" || job.type === type;

    return matchesSearch && matchesType;
  });

  if (filteredJobs.length === 0) {
    list.innerHTML = `
      <div class="panel">
        <p>No opportunities found. Try another search.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = filteredJobs.map((job) => `
    <article class="job-card">
      <h3>${escapeHTML(job.title)}</h3>
      <p class="job-company">${escapeHTML(job.company)}</p>
      <p>📍 ${escapeHTML(job.location)}</p>
      <p>💼 ${escapeHTML(job.type)}</p>
      <p>${escapeHTML(job.description)}</p>
      <div class="job-skills">
        Skills: ${job.skills.map(escapeHTML).join(", ")}
      </div>
      <button
        class="btn apply-btn"
        type="button"
        data-job-id="${job.id}">
        Apply Now
      </button>
    </article>
  `).join("");
}

/* APPLY FOR JOB */

function applyForJob(jobId) {
  const student = getCurrentStudent();

  if (!student) {
    showMessage("Please login before applying for a job.", "error");
    $("auth").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const job = jobs.find((item) => item.id === Number(jobId));

  if (!job) {
    showMessage("Job not found.", "error");
    return;
  }

  const applications = getApplications();

  const alreadyApplied = applications.some(
    (application) =>
      application.studentEmail === student.email &&
      application.jobId === job.id
  );

  if (alreadyApplied) {
    showMessage("You have already applied for this opportunity.", "error");
    return;
  }

  applications.push({
    id: Date.now(),
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    studentEmail: student.email,
    appliedAt: new Date().toISOString(),
    status: "Applied"
  });

  saveData(STORAGE.applications, applications);

  showMessage("Application submitted successfully!", "success");

  renderApplications();
  updateDashboard();
}

/* MY APPLICATIONS */

function renderApplications() {
  const panel = $("applicationsList");
  const student = getCurrentStudent();

  if (!student) {
    panel.innerHTML = "<p>Login to view your applications.</p>";
    return;
  }

  const applications = getApplications().filter(
    (application) => application.studentEmail === student.email
  );

  if (applications.length === 0) {
    panel.innerHTML = "<p>You have not applied for any opportunities yet.</p>";
    return;
  }

  panel.innerHTML = applications.map((application) => `
    <div class="application-item">
      <div>
        <h3>${escapeHTML(application.jobTitle)}</h3>
        <p>${escapeHTML(application.company)}</p>
        <p>Applied on: ${new Date(application.appliedAt).toLocaleDateString()}</p>
      </div>
      <span class="status">${escapeHTML(application.status)}</span>
    </div>
  `).join("");
}

/* SKILL ANALYZER */

function renderSkillChoices() {
  const role = $("careerRole").value;
  const skills = careerSkills[role];

  const container = $("skillChoices");

  container.innerHTML = skills.map((skill) => `
    <label>
      <input type="checkbox" value="${escapeHTML(skill)}">
      ${escapeHTML(skill)}
    </label>
  `).join("");
}

function analyzeSkills() {
  const role = $("careerRole").value;
  const requiredSkills = careerSkills[role];

  const selectedSkills = Array.from(
    $("skillChoices").querySelectorAll("input:checked")
  ).map((input) => input.value);

  const missingSkills = requiredSkills.filter(
    (skill) => !selectedSkills.includes(skill)
  );

  const readiness = Math.round(
    (selectedSkills.length / requiredSkills.length) * 100
  );

  const result = $("analysisResult");

  result.innerHTML = `
    <div class="panel">
      <h3>Career Readiness: ${readiness}%</h3>
      <p>You know ${selectedSkills.length} out of ${requiredSkills.length} required skills.</p>
      <p><strong>Skills to learn:</strong> ${
        missingSkills.length
          ? missingSkills.map(escapeHTML).join(", ")
          : "Great! You have selected all required skills."
      }</p>
    </div>
  `;

  const student = getCurrentStudent();

  if (student) {
    student.skills = selectedSkills;

    const students = getData(STORAGE.students, []);

    const index = students.findIndex(
      (item) => item.email === student.email
    );

    if (index !== -1) {
      students[index] = {
        ...students[index],
        skills: selectedSkills
      };

      saveData(STORAGE.students, students);
      saveData(STORAGE.currentStudent, student);
    }

    renderProfile();
  }
}

/* DASHBOARD COUNTS */

function updateDashboard() {
  const student = getCurrentStudent();

  $("jobCount").textContent = jobs.length;

  const studentApplications = student
    ? getApplications().filter(
        (application) => application.studentEmail === student.email
      )
    : [];

  $("applicationCount").textContent = studentApplications.length;

  $("loginNavBtn").textContent = student
    ? "My Account"
    : "Student Login";

  $("logoutBtn").hidden = !student;

  $("loginForm").hidden = Boolean(student);
  $("registerForm").hidden = true;

  $("showLogin").hidden = Boolean(student);
  $("showRegister").hidden = Boolean(student);

  renderProfile();
  renderApplications();
}

/* BASIC HTML ESCAPING */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

/* EVENT LISTENERS */

document.addEventListener("DOMContentLoaded", () => {
  $("loginForm").addEventListener("submit", loginStudent);

  $("registerForm").addEventListener("submit", registerStudent);

  $("showLogin").addEventListener("click", showLoginForm);

  $("showRegister").addEventListener("click", showRegisterForm);

  $("logoutBtn").addEventListener("click", logoutStudent);

  $("loginNavBtn").addEventListener("click", () => {
    $("auth").scrollIntoView({ behavior: "smooth" });
  });

  $("jobSearch").addEventListener("input", renderJobs);

  $("jobType").addEventListener("change", renderJobs);

  $("careerRole").addEventListener("change", renderSkillChoices);

  $("analyzeBtn").addEventListener("click", analyzeSkills);

  $("jobsList").addEventListener("click", (event) => {
    const button = event.target.closest(".apply-btn");

    if (button) {
      applyForJob(button.dataset.jobId);
    }
  });

  renderSkillChoices();
  renderJobs();
  updateDashboard();
});
