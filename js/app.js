/**
 * Main Application Orchestrator for Lavkush Jaiswal Portfolio
 */

// Toast notification helper
function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

document.addEventListener("DOMContentLoaded", () => {
  initTelemetryHUD();
  initMobileNav();
  renderHeroStats();
  renderCaseStudies();
  renderSkillsMatrix();
  renderExperienceTimeline();
  renderEngineeringTenets();
  renderPublications();
  renderOpenSource();
  initContactForm();
  initActiveNavObserver();

  // Initialize interactive engines
  if (window.SystemArchitectureVisualizer) {
    window.ArchitectureVisualizer = new window.SystemArchitectureVisualizer();
  }

  if (window.DeveloperTerminal) {
    window.Terminal = new window.DeveloperTerminal();
  }
});

// Mobile Nav Drawer Toggle
function initMobileNav() {
  const toggle = document.getElementById("mobileNavToggle");
  const drawer = document.getElementById("mobileNavDrawer");

  if (toggle && drawer) {
    toggle.addEventListener("click", () => {
      drawer.classList.toggle("open");
    });

    drawer.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        drawer.classList.remove("open");
      });
    });

    document.addEventListener("click", (e) => {
      if (!drawer.contains(e.target) && !toggle.contains(e.target)) {
        drawer.classList.remove("open");
      }
    });
  }
}

// Telemetry HUD Live Clock & Latency Jitter
function initTelemetryHUD() {
  const clockEl = document.getElementById("hudClock");
  const latencyEl = document.getElementById("hudLatency");

  function updateClock() {
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toISOString().substring(11, 19) + " UTC";
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  function jitterLatency() {
    if (latencyEl) {
      const jitter = (15.5 + Math.random() * 2.2).toFixed(1);
      latencyEl.textContent = `${jitter}ms`;
    }
  }
  setInterval(jitterLatency, 3500);
}

// Hero Stats Counters
function renderHeroStats() {
  const container = document.getElementById("statsStrip");
  if (!container) return;

  container.innerHTML = PORTFOLIO_DATA.profile.stats.map(s => `
    <div class="stat-card">
      <div class="stat-num">${s.value}</div>
      <div class="stat-suffix">${s.suffix}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-detail">${s.detail}</div>
    </div>
  `).join("");
}

// Deep-Dive Case Studies
function renderCaseStudies() {
  const container = document.getElementById("caseStudiesList");
  if (!container) return;

  container.innerHTML = PORTFOLIO_DATA.caseStudies.map(cs => `
    <article class="case-study-card">
      <div class="case-header">
        <div>
          <div class="case-meta">
            <span class="case-category">${cs.category}</span>
            <span class="case-timeframe">${cs.timeframe}</span>
          </div>
          <h3 class="case-title">${cs.title}</h3>
        </div>
      </div>

      <p class="case-summary">${cs.impactSummary}</p>

      <!-- Before vs After Metrics Grid -->
      <div class="case-metrics-grid">
        ${cs.stats.map(s => `
          <div class="case-metric-box">
            <div class="case-metric-label">${s.label}</div>
            <div class="case-metric-compare">
              <span class="compare-before">${s.before}</span>
              <span class="compare-after">${s.after}</span>
            </div>
            <span class="case-metric-badge">${s.highlight}</span>
          </div>
        `).join("")}
      </div>

      <!-- Problem & Solution Deep Dive -->
      <div class="case-deep-dive">
        <div class="deep-dive-box">
          <h4 class="deep-dive-title" style="color: var(--accent-rose);">
            <span>⚠️</span> Challenge & Automotive Bottlenecks
          </h4>
          <p>${cs.challenge}</p>
        </div>
        <div class="deep-dive-box">
          <h4 class="deep-dive-title" style="color: var(--accent-emerald);">
            <span>⚡</span> Architectural Solution & Execution
          </h4>
          <p>${cs.solution}</p>
        </div>
      </div>

      <!-- Key Architectural Highlights -->
      <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-primary);">
        Core Architecture Highlights:
      </h4>
      <ul class="arch-highlights-list">
        ${cs.architectureHighlights.map(h => `<li>${h}</li>`).join("")}
      </ul>

      <!-- Code Snippet -->
      <div class="code-preview-container">
        <div class="code-header">
          <span>${cs.codeSnippet.title}</span>
          <span class="code-lang-tag">${cs.codeSnippet.language}</span>
        </div>
        <pre><code>${escapeHtml(cs.codeSnippet.code)}</code></pre>
      </div>

      <!-- Tech Stack Tags -->
      <div class="tag-list">
        ${cs.tags.map(t => `<span class="tag-chip">${t}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

// Skills Competencies Matrix
function renderSkillsMatrix() {
  const container = document.getElementById("skillsGrid");
  if (!container) return;

  container.innerHTML = PORTFOLIO_DATA.skills.map(cat => `
    <div class="skill-card">
      <h3 class="skill-category-title">
        <span class="text-cyan">◆</span>
        <span>${cat.category}</span>
      </h3>
      <p class="skill-category-desc">${cat.description}</p>

      <div class="skill-items-list">
        ${cat.items.map(item => `
          <div class="skill-item">
            <div class="skill-item-header">
              <span class="skill-name">${item.name}</span>
              <span class="skill-years">${item.years}</span>
            </div>
            <div class="skill-bar-track">
              <div class="skill-bar-fill" style="width: ${item.level}%"></div>
            </div>
            <div class="skill-highlight">${item.highlight}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

// Experience Timeline
function renderExperienceTimeline() {
  const container = document.getElementById("experienceTimeline");
  if (!container) return;

  container.innerHTML = PORTFOLIO_DATA.experience.map(exp => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-role-header">
          <h3 class="timeline-role">${exp.role}</h3>
          <span class="timeline-period">${exp.period}</span>
        </div>
        <div class="timeline-company">${exp.company} • <span class="text-muted">${exp.location}</span></div>
        <p class="timeline-desc">${exp.description}</p>
        <ul class="timeline-achievements">
          ${exp.achievements.map(ach => `<li>${ach}</li>`).join("")}
        </ul>
      </div>
    </div>
  `).join("");
}

// Engineering Tenets
function renderEngineeringTenets() {
  const container = document.getElementById("tenetsGrid");
  if (!container) return;

  container.innerHTML = PORTFOLIO_DATA.tenets.map(tenet => `
    <div class="tenet-card">
      <div class="tenet-number">${tenet.number}</div>
      <h3 class="tenet-title">${tenet.title}</h3>
      <p class="tenet-principle">${tenet.principle}</p>
    </div>
  `).join("");
}

// Publications & RFCs
function renderPublications() {
  const container = document.getElementById("publicationsGrid");
  if (!container) return;

  container.innerHTML = PORTFOLIO_DATA.publications.map(pub => `
    <article class="pub-card">
      <div>
        <div class="pub-meta">
          <span class="pub-tag">${pub.category}</span>
          <span class="pub-read-time">${pub.readTime}</span>
        </div>
        <h3 class="pub-title">${pub.title}</h3>
        <p class="pub-abstract">${pub.abstract}</p>
      </div>
      <div style="margin-top: 1rem;">
        <a href="${pub.link}" target="_blank" class="pub-footer">
          <span>Read on GitHub</span>
          <span>→</span>
        </a>
      </div>
    </article>
  `).join("");
}

// Open Source / Featured Projects
function renderOpenSource() {
  const container = document.getElementById("ossGrid");
  if (!container) return;

  container.innerHTML = PORTFOLIO_DATA.openSource.map(oss => `
    <div class="oss-card">
      <div class="oss-header">
        <span class="oss-name">${oss.name}</span>
        <span class="oss-stars">★ ${oss.stars}</span>
      </div>
      <div class="oss-role">${oss.role} • <span style="color: var(--text-muted);">${oss.language}</span></div>
      <p class="oss-desc">${oss.description}</p>
      <a href="${oss.link}" target="_blank" class="pub-footer">
        <span>View on GitHub</span>
        <span>→</span>
      </a>
    </div>
  `).join("");
}

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("formName").value.trim();
    const email = document.getElementById("formEmail").value.trim();
    const message = document.getElementById("formMessage").value.trim();

    if (!name || !email || !message) {
      showToast("⚠️ Please fill out all required fields.");
      return;
    }

    showToast(`✉️ Thank you, ${name}! Your transmission has been dispatched.`);
    form.reset();
  });

  const copyEmailBtn = document.getElementById("copyEmailBtn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(PORTFOLIO_DATA.profile.email).then(() => {
        showToast("✉️ Email address copied to clipboard!");
      });
    });
  }
}

// Active Nav Highlight on Scroll
function initActiveNavObserver() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(sec => observer.observe(sec));
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
