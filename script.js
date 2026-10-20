const careerSkills = {
  "Data Analyst": [
    "Python", "SQL", "Excel", "Statistics"
  ],
  "Web Developer": [
    "HTML", "CSS", "JavaScript", "React", "Git"
  ],
  "Python Developer": [
    "Python", "SQL", "Git"
  ],
  "Java Developer": [
    "Java", "SQL", "Git"
  ]
};

const learningResources = {
  "HTML": "Learn HTML basics and semantic elements",
  "CSS": "Practice layouts, Flexbox and responsive design",
  "JavaScript": "Study variables, functions and DOM manipulation",
  "Python": "Practice Python fundamentals and problem solving",
  "SQL": "Learn SELECT, JOIN, GROUP BY and queries",
  "Excel": "Practice formulas, charts and pivot tables",
  "Statistics": "Study probability, averages and data interpretation",
  "Java": "Learn OOP, collections and exception handling",
  "React": "Study components, props and state",
  "Git": "Learn version control and Git commands"
};

const analyzeBtn = document.getElementById("analyzeBtn");

analyzeBtn.addEventListener("click", function () {
  const career = document.getElementById("career").value;

  const selectedSkills = Array.from(
    document.querySelectorAll(
      '.skills-grid input[type="checkbox"]:checked'
    )
  ).map(input => input.value);

  const requiredSkills = careerSkills[career];

  const matchedSkills = requiredSkills.filter(skill =>
    selectedSkills.includes(skill)
  );

  const missingSkills = requiredSkills.filter(skill =>
    !selectedSkills.includes(skill)
  );

  const score = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100
  );

  document.getElementById("careerResult").textContent =
    "Target career: " + career;

  document.getElementById("score").textContent = score + "%";

  document.getElementById("scoreText").textContent =
    "You have " + matchedSkills.length + " out of " +
    requiredSkills.length + " selected target skills.";

  const gapList = document.getElementById("gapList");
  gapList.innerHTML = "";

  if (missingSkills.length === 0) {
    gapList.innerHTML =
      "<li>Great! You selected all the listed target skills.</li>";
  } else {
    missingSkills.forEach(skill => {
      const li = document.createElement("li");
      li.textContent = skill;
      gapList.appendChild(li);
    });
  }

  const roadmapList = document.getElementById("roadmapList");
  roadmapList.innerHTML = "";

  if (missingSkills.length === 0) {
    const li = document.createElement("li");
    li.textContent =
      "Build a practical project and keep improving your skills.";
    roadmapList.appendChild(li);
  } else {
    missingSkills.forEach(skill => {
      const li = document.createElement("li");
      li.textContent = learningResources[skill];
      roadmapList.appendChild(li);
    });
  }

  document.getElementById("results").hidden = false;

  document.getElementById("results").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});
