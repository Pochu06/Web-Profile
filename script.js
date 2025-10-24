// Clean script: load data.json and populate the DOM safely
document.addEventListener('DOMContentLoaded', () => {
  async function init() {
    try {
      const res = await fetch('data.json');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      // About
      const navName = document.getElementById('nav-name');
      if (navName && data?.about?.name) navName.textContent = data.about.name;

      const aboutDescription = document.getElementById('about-description');
      if (aboutDescription) aboutDescription.textContent = data?.about?.description ?? '';

      const profilePic = document.getElementById('profile-pic');
      if (profilePic) {
        if (data?.about?.profilePic) {
          profilePic.src = data.about.profilePic;
          profilePic.alt = `${data?.about?.name ?? 'Profile'} photo`;
          profilePic.style.display = '';
        } else profilePic.style.display = 'none';
      }

      // Skills
      const skillsList = document.getElementById('skills-list');
      if (skillsList && Array.isArray(data.skills)) {
        skillsList.innerHTML = '';
        data.skills.forEach(skill => {
          const li = document.createElement('li');
          li.textContent = skill;
          skillsList.appendChild(li);
        });
      }

      // Projects
      const projectGrid = document.getElementById('project-grid');
      if (projectGrid && Array.isArray(data.projects)) {
        projectGrid.innerHTML = '';
        data.projects.forEach(project => {
          const card = document.createElement('div');
          card.className = 'project';

          const h3 = document.createElement('h3');
          h3.textContent = project.title ?? '';
          const p = document.createElement('p');
          p.textContent = project.description ?? '';

          card.appendChild(h3);
          card.appendChild(p);

          if (project.link) {
            const a = document.createElement('a');
            a.href = project.link;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = 'View on GitHub';
            card.appendChild(a);
          }

          projectGrid.appendChild(card);
        });
      }

      // Design works (optional)
      const designGrid = document.getElementById('design-grid');
      if (designGrid && Array.isArray(data.designWorks)) {
        designGrid.innerHTML = '';
        data.designWorks.forEach(work => {
          const item = document.createElement('div');
          item.className = 'design-item';

          if (work.image) {
            const img = document.createElement('img');
            img.src = work.image;
            img.alt = work.title ?? 'Design work';
            item.appendChild(img);
          }

          const t = document.createElement('h3');
          t.textContent = work.title ?? '';
          const d = document.createElement('p');
          d.textContent = work.description ?? '';
          item.appendChild(t);
          item.appendChild(d);

          designGrid.appendChild(item);
        });
      }

      // Contact
      const contactEmail = document.getElementById('contact-email');
      if (contactEmail && data?.contact?.email) {
        const email = data.contact.email;
        contactEmail.innerHTML = `Email: <a href=\"mailto:${email}\">${email}</a>`;
      }

      const contactLinkedin = document.getElementById('contact-linkedin');
      if (contactLinkedin && data?.contact?.linkedin) {
        const ln = data.contact.linkedin;
        contactLinkedin.innerHTML = `LinkedIn: <a href=\"${ln}\" target=\"_blank\" rel=\"noopener noreferrer\">${ln}</a>`;
      }

    } catch (error) {
      console.error('Error loading data:', error);
      const aboutDescription = document.getElementById('about-description');
      if (aboutDescription) aboutDescription.textContent = 'Failed to load content.';
    }
  }

  init();

  // Smooth scrolling for nav hash links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });

});