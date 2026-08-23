/**
 * Resume Viewer & PDF Export Manager for Lavkush Jaiswal
 * GitHub: https://github.com/lavkush0101/
 * LinkedIn: https://www.linkedin.com/in/lavkush-jaiswal-62825a130/
 */

class ResumeViewer {
  constructor() {
    this.modal = document.getElementById("resumeModal");
    this.closeBtn = document.getElementById("resumeCloseBtn");
    this.printBtn = document.getElementById("resumePrintBtn");
    this.copyBtn = document.getElementById("resumeCopyMarkdownBtn");

    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    if (this.printBtn) {
      this.printBtn.addEventListener("click", () => {
        window.print();
      });
    }

    if (this.copyBtn) {
      this.copyBtn.addEventListener("click", () => {
        this.copyMarkdownResume();
      });
    }

    // Attach to any trigger buttons in page
    document.querySelectorAll(".trigger-resume-modal").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.open();
      });
    });
  }

  open() {
    if (this.modal) {
      this.renderResumeContent();
      this.modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }

  close() {
    if (this.modal) {
      this.modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  renderResumeContent() {
    const container = document.getElementById("resumeModalBody");
    if (!container) return;

    const p = PORTFOLIO_DATA.profile;

    container.innerHTML = `
      <div class="resume-document">
        <div class="resume-header">
          <h1 class="resume-name">${p.name}</h1>
          <div class="resume-title">${p.role}</div>
          <div class="resume-contact-line">
            <span>${p.location}</span> • 
            <a href="mailto:${p.email}">${p.email}</a> • 
            <span>📞 ${p.phone}</span> • 
            <a href="${p.github}" target="_blank">GitHub</a> • 
            <a href="${p.linkedin}" target="_blank">LinkedIn</a>
          </div>
        </div>

        <div class="resume-section">
          <h2 class="resume-sec-title">PROFESSIONAL SUMMARY</h2>
          <p class="resume-p">${p.bio}</p>
        </div>

        <div class="resume-section">
          <h2 class="resume-sec-title">TECHNICAL SKILLS</h2>
          ${PORTFOLIO_DATA.skills.map(cat => `
            <div class="resume-skill-row">
              <strong>${cat.category}:</strong> 
              ${cat.items.map(i => `${i.name} (${i.years})`).join(", ")}
            </div>
          `).join("")}
        </div>

        <div class="resume-section">
          <h2 class="resume-sec-title">PROFESSIONAL EXPERIENCE</h2>
          ${PORTFOLIO_DATA.experience.map(exp => `
            <div class="resume-job">
              <div class="resume-job-header">
                <div><strong>${exp.role}</strong> — <span class="resume-company">${exp.company}</span></div>
                <div class="resume-period">${exp.period} (${exp.location})</div>
              </div>
              <div class="resume-job-desc">${exp.description}</div>
              <ul class="resume-bullets">
                ${exp.achievements.map(ach => `<li>${ach}</li>`).join("")}
              </ul>
            </div>
          `).join("")}
        </div>

        <div class="resume-section">
          <h2 class="resume-sec-title">KEY AUTOMOTIVE & CLIENT PROJECTS</h2>
          ${PORTFOLIO_DATA.caseStudies.map(cs => `
            <div style="margin-bottom: 0.75rem;">
              <strong>${cs.title}</strong> (${cs.timeframe})<br>
              <span style="font-size: 0.88rem; color: #334155;">${cs.impactSummary}</span>
              <ul class="resume-bullets" style="margin-top: 0.25rem;">
                ${cs.architectureHighlights.map(h => `<li>${h}</li>`).join("")}
              </ul>
            </div>
          `).join("")}
        </div>

        <div class="resume-section">
          <h2 class="resume-sec-title">EDUCATION</h2>
          ${PORTFOLIO_DATA.education.map(edu => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.9rem;">
              <div><strong>${edu.degree}</strong> — ${edu.institution}</div>
              <div style="color: #64748b; font-family: var(--font-mono);">${edu.period} (${edu.location})</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  copyMarkdownResume() {
    const p = PORTFOLIO_DATA.profile;
    let md = `# ${p.name} - ${p.role}\n`;
    md += `${p.location} | Email: ${p.email} | Mobile: ${p.phone}\n`;
    md += `GitHub: ${p.github} | LinkedIn: ${p.linkedin}\n\n`;
    md += `## Professional Summary\n${p.bio}\n\n`;
    md += `## Technical Skills\n`;
    PORTFOLIO_DATA.skills.forEach(cat => {
      md += `- **${cat.category}**: ${cat.items.map(i => i.name).join(", ")}\n`;
    });
    md += `\n## Professional Experience\n`;
    PORTFOLIO_DATA.experience.forEach(exp => {
      md += `### ${exp.role} - ${exp.company} (${exp.period})\n`;
      md += `${exp.description}\n`;
      exp.achievements.forEach(ach => {
        md += `- ${ach}\n`;
      });
      md += `\n`;
    });
    md += `## Education\n`;
    PORTFOLIO_DATA.education.forEach(edu => {
      md += `- **${edu.degree}** — ${edu.institution} (${edu.period})\n`;
    });

    navigator.clipboard.writeText(md).then(() => {
      if (window.showToast) {
        window.showToast("📋 Markdown Resume copied to clipboard!");
      }
    });
  }
}

window.ResumeViewer = new ResumeViewer();
