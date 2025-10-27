// Load data from data.json
async function loadData() {
  // Show loading state
  document.querySelectorAll('section').forEach(section => {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Loading';
    section.appendChild(loading);
  });

  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Remove loading states
    document.querySelectorAll('.loading').forEach(el => el.remove());
    
    populatePage(data);
  } catch (error) {
    console.error('Error loading data:', error);
    document.querySelectorAll('.loading').forEach(el => el.remove());
    document.querySelectorAll('section').forEach(section => {;
      section.appendChild(errorMsg);
    });
  }
}

// Update page title and copyright year
function updateMetadata(name) {
  document.title = `${name} - Portfolio`;
  document.querySelector('footer p').textContent = 
    `© ${new Date().getFullYear()} ${name}. All rights reserved.`;
}

// Populate page with data
function populatePage(data) {
  // Header and metadata
  const name = data.personal.name;
  document.getElementById('nav-name').textContent = name;
  updateMetadata(name);

  // About
  document.getElementById('bio').textContent = data.personal.bio;

  // Skills
  const skillsList = document.getElementById('skills-list');
  data.skills.forEach(skill => {
    const skillDiv = document.createElement('div');
    skillDiv.className = 'skill';
    skillDiv.innerHTML = `
      <h3>${skill.name}</h3>
      <div class="skill-bar">
        <div class="skill-fill" style="width: 0%;"></div>
      </div>
    `;
    skillsList.appendChild(skillDiv);
    // Animate skill bar
    setTimeout(() => {
      skillDiv.querySelector('.skill-fill').style.width = `${skill.level}%`;
    }, 500);
  });

  // Projects
  const projectsList = document.getElementById('projects-list');
  function renderProjects(category = 'all') {
    projectsList.innerHTML = '';
    const filteredProjects = data.projects.filter(p => category === 'all' || p.category === category);
    
    if (filteredProjects.length === 0) {
      projectsList.innerHTML = '<p class="no-results">No projects found in this category.</p>';
      return;
    }

    filteredProjects.forEach(project => {
      const projectDiv = document.createElement('div');
      projectDiv.className = 'project';
      projectDiv.dataset.category = project.category;
      projectDiv.innerHTML = `
        <img src="${project.image}" alt="${project.title}" 
             onerror="this.src='https://via.placeholder.com/300x200?text=Project+Image'">
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <a href="${project.link}" target="_blank" class="project-link">View Project</a>
        </div>
      `;
      projectsList.appendChild(projectDiv);
    });
  }
  renderProjects();

  // Project filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.category);
    });
  });

  // Experience
  const experienceList = document.getElementById('experience-list');
  data.experience.forEach(exp => {
    const expDiv = document.createElement('div');
    expDiv.className = 'experience-item';
    expDiv.innerHTML = `
      <h3>${exp.job} at ${exp.company}</h3>
      <p>${exp.duration}</p>
      <p>${exp.description}</p>
    `;
    experienceList.appendChild(expDiv);
  });

  // Contact
  document.getElementById('email').textContent = data.personal.email;
  document.getElementById('email').href = `mailto:${data.personal.email}`;
  document.getElementById('linkedin').href = data.personal.social.linkedin;
  document.getElementById('github').href = data.personal.social.github;
}

// Mobile menu toggle
document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('active');
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
    // Close mobile menu after click
    document.querySelector('.nav-links').classList.remove('active');
  });
});

// Initialize
loadData();