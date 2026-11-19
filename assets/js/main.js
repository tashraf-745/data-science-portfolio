function renderProjects() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((p) => `
    <article class="project-card">
      <div class="project-card__top">
        <h3>${p.title}</h3>
        <div class="project-card__stat">
          <span class="project-card__stat-value">${p.stat.value}</span>
          <span class="project-card__stat-label">${p.stat.label}</span>
        </div>
      </div>
      <p>${p.description}</p>
      <div class="chip-row">
        ${p.tags.map((t) => `<span class="chip">${t}</span>`).join('')}
      </div>
      <div class="project-card__links">
        <a href="${p.repoUrl}" target="_blank" rel="noopener">Code →</a>
        ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener">Live demo →</a>` : ''}
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderProjects);
