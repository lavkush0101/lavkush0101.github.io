/**
 * Interactive Developer CLI Terminal Engine for Lavkush Jaiswal
 * GitHub: https://github.com/lavkush0101/
 * LinkedIn: https://www.linkedin.com/in/lavkush-jaiswal-62825a130/
 */

class DeveloperTerminal {
  constructor() {
    this.outputContainer = document.getElementById("terminalOutput");
    this.inputField = document.getElementById("terminalInput");
    this.terminalWindow = document.getElementById("terminalWindow");

    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => this.cmdHelp(),
      bio: () => this.cmdBio(),
      skills: () => this.cmdSkills(),
      stack: () => this.cmdSkills(),
      arch: () => this.cmdArch(),
      metrics: () => this.cmdMetrics(),
      projects: () => this.cmdProjects(),
      experience: () => this.cmdExperience(),
      education: () => this.cmdEducation(),
      resume: () => this.cmdResume(),
      contact: () => this.cmdContact(),
      github: () => `<div class="term-info">GitHub: <a href="${PORTFOLIO_DATA.profile.github}" target="_blank" style="color: var(--accent-cyan);">${PORTFOLIO_DATA.profile.github}</a></div>`,
      linkedin: () => `<div class="term-info">LinkedIn: <a href="${PORTFOLIO_DATA.profile.linkedin}" target="_blank" style="color: var(--accent-cyan);">${PORTFOLIO_DATA.profile.linkedin}</a></div>`,
      theme: (args) => this.cmdTheme(args),
      clear: () => this.cmdClear(),
      whoami: () => `<div class="term-info">guest@lavkush-aosp (Automotive OEM / Recruiter)</div>`,
      date: () => `<div class="term-info">${new Date().toUTCString()}</div>`,
      uptime: () => `<div class="term-info">6.9+ years production engineering (Harman / AOSP / AAOS)</div>`,
      version: () => `<div class="term-info">aosp-automotive-v14.0-harman (Android Auto & HAL Core)</div>`,
      "sudo hire": () => this.cmdSudoHire()
    };

    if (this.outputContainer && this.inputField) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const rawCmd = this.inputField.value.trim();
        if (rawCmd) {
          this.executeCommand(rawCmd);
          this.history.push(rawCmd);
          this.historyIndex = this.history.length;
        } else {
          this.appendPrompt("");
        }
        this.inputField.value = "";
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputField.value = this.history[this.historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputField.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.inputField.value = "";
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        this.autocomplete();
      }
    });

    const clearBtn = document.getElementById("termClearBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.cmdClear());
    }
  }

  autocomplete() {
    const current = this.inputField.value.toLowerCase().trim();
    const available = Object.keys(this.commands);
    const match = available.find(c => c.startsWith(current));
    if (match) {
      this.inputField.value = match;
    }
  }

  executeCommand(rawInput) {
    const parts = rawInput.trim().split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    this.appendPrompt(rawInput);

    if (rawInput.toLowerCase() === "sudo hire" || rawInput.toLowerCase() === "sudo hire me") {
      this.appendOutput(this.cmdSudoHire());
      return;
    }

    if (this.commands[cmd]) {
      const res = this.commands[cmd](args);
      if (res) {
        this.appendOutput(res);
      }
    } else {
      this.appendOutput(`
        <div class="term-error">command not found: "${cmd}". Type <span class="term-info">help</span> for a list of available commands.</div>
      `);
    }

    this.scrollToBottom();
  }

  appendPrompt(cmdText) {
    const line = document.createElement("div");
    line.className = "term-line";
    line.innerHTML = `
      <div class="term-cmd-row">
        <span class="term-prompt">guest@lavkush-aosp:~$</span>
        <span class="term-cmd-text">${this.escapeHtml(cmdText)}</span>
      </div>
    `;
    this.outputContainer.appendChild(line);
  }

  appendOutput(htmlContent) {
    const resultBox = document.createElement("div");
    resultBox.className = "term-result";
    resultBox.innerHTML = htmlContent;
    this.outputContainer.appendChild(resultBox);
  }

  scrollToBottom() {
    const body = document.getElementById("terminalBody");
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  cmdClear() {
    this.outputContainer.innerHTML = "";
    return "";
  }

  cmdHelp() {
    return `
      <table class="term-table">
        <thead>
          <tr><th>COMMAND</th><th>DESCRIPTION</th></tr>
        </thead>
        <tbody>
          <tr><td><span class="term-info">bio</span></td><td>Executive summary, role and automotive focus</td></tr>
          <tr><td><span class="term-info">github</span></td><td>Open official GitHub profile (github.com/lavkush0101)</td></tr>
          <tr><td><span class="term-info">linkedin</span></td><td>Open LinkedIn profile (linkedin.com/in/lavkush-jaiswal)</td></tr>
          <tr><td><span class="term-info">stack</span> / <span class="term-info">skills</span></td><td>AOSP, Android Auto, AIDL, MediaCodec & Jetpack matrix</td></tr>
          <tr><td><span class="term-info">arch</span></td><td>Automotive IVI, Android Auto Projection & ExoPlayer architectures</td></tr>
          <tr><td><span class="term-info">metrics</span></td><td>Key verified engineering impact metrics & stats</td></tr>
          <tr><td><span class="term-info">projects</span></td><td>MSIL Maruti IVI, PSA Android Auto & Ditty TV case studies</td></tr>
          <tr><td><span class="term-info">experience</span></td><td>Career history @ Harman, Chetu, Fusioni & Praxiv</td></tr>
          <tr><td><span class="term-info">education</span></td><td>B.Tech (Computer Science & Engineering) & schooling</td></tr>
          <tr><td><span class="term-info">resume</span></td><td>Open printable / ATS-friendly resume export</td></tr>
          <tr><td><span class="term-info">contact</span></td><td>Email (${PORTFOLIO_DATA.profile.email}) & Phone (${PORTFOLIO_DATA.profile.phone})</td></tr>
          <tr><td><span class="term-info">theme &lt;name&gt;</span></td><td>Switch theme: obsidian, matrix, nord, amber, light</td></tr>
          <tr><td><span class="term-info">sudo hire</span></td><td>Authorize immediate recruitment candidate offer</td></tr>
          <tr><td><span class="term-info">clear</span></td><td>Clear terminal screen buffer</td></tr>
        </tbody>
      </table>
    `;
  }

  cmdBio() {
    const p = PORTFOLIO_DATA.profile;
    return `
      <div><strong>${p.name}</strong> — <span class="term-info">${p.role}</span></div>
      <div class="term-muted">${p.location} | ${p.availability}</div>
      <p style="margin-top: 0.5rem; color: #cbd5e1;">${p.bio}</p>
      <div style="margin-top: 0.5rem;">
        <a href="${p.github}" target="_blank" style="color: var(--accent-cyan); margin-right: 1rem;">🐙 ${p.github}</a>
        <a href="${p.linkedin}" target="_blank" style="color: var(--accent-cyan);">💼 ${p.linkedin}</a>
      </div>
    `;
  }

  cmdSkills() {
    let out = `<div style="margin-bottom: 0.5rem; font-weight: bold;">TECHNICAL COMPETENCIES:</div>`;
    PORTFOLIO_DATA.skills.forEach(cat => {
      out += `<div style="color: var(--accent-cyan); margin-top: 0.5rem;">[${cat.category.toUpperCase()}]</div>`;
      out += `<div style="padding-left: 0.75rem;">`;
      cat.items.forEach(item => {
        out += `<span class="term-tag">${item.name} (${item.years})</span> `;
      });
      out += `</div>`;
    });
    return out;
  }

  cmdArch() {
    return `
      <div style="margin-bottom: 0.5rem; font-weight: bold;">AUTOMOTIVE & ANDROID ARCHITECTURES:</div>
      ${PORTFOLIO_DATA.architectures.map(a => `
        <div style="margin-bottom: 0.4rem;">
          ▸ <strong style="color: var(--accent-cyan);">${a.title}</strong><br>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${a.description}</span>
        </div>
      `).join("")}
    `;
  }

  cmdMetrics() {
    return `
      <table class="term-table">
        <thead><tr><th>METRIC</th><th>VALUE</th><th>DETAILS</th></tr></thead>
        <tbody>
          ${PORTFOLIO_DATA.profile.stats.map(s => `
            <tr>
              <td><strong>${s.label}</strong></td>
              <td class="term-success">${s.value} ${s.suffix}</td>
              <td class="term-muted">${s.detail}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  cmdProjects() {
    return `
      <div style="margin-bottom: 0.5rem; font-weight: bold;">KEY AUTOMOTIVE & CLIENT PROJECTS:</div>
      ${PORTFOLIO_DATA.caseStudies.map(cs => `
        <div style="margin-bottom: 0.75rem; border-left: 2px solid var(--accent-cyan); padding-left: 0.75rem;">
          <div class="term-info"><strong>${cs.title}</strong> (${cs.timeframe})</div>
          <div style="font-size: 0.8rem; color: #94a3b8;">${cs.impactSummary}</div>
          <div style="font-size: 0.75rem; color: var(--accent-emerald);">Tags: ${cs.tags.join(", ")}</div>
        </div>
      `).join("")}
    `;
  }

  cmdExperience() {
    return `
      <div style="margin-bottom: 0.5rem; font-weight: bold;">PROFESSIONAL EXPERIENCE:</div>
      ${PORTFOLIO_DATA.experience.map(exp => `
        <div style="margin-bottom: 0.6rem;">
          ▸ <strong>${exp.role}</strong> @ <span class="term-info">${exp.company}</span> (${exp.period})<br>
          <span style="font-size: 0.8rem; color: #94a3b8;">${exp.description}</span>
        </div>
      `).join("")}
    `;
  }

  cmdEducation() {
    return `
      <div style="margin-bottom: 0.5rem; font-weight: bold;">EDUCATION:</div>
      ${PORTFOLIO_DATA.education.map(edu => `
        <div style="margin-bottom: 0.4rem;">
          ▸ <strong>${edu.degree}</strong> — <span class="term-info">${edu.institution}</span> (${edu.period})
        </div>
      `).join("")}
    `;
  }

  cmdResume() {
    if (window.ResumeViewer) {
      window.ResumeViewer.open();
      return `<div class="term-success">Opening ATS-friendly resume export viewer...</div>`;
    }
    return `<div class="term-info">Resume modal loaded. Use the top navigation or print command to export.</div>`;
  }

  cmdContact() {
    const p = PORTFOLIO_DATA.profile;
    return `
      <table class="term-table">
        <tbody>
          <tr><td><strong>Email</strong></td><td><a href="mailto:${p.email}" style="color: var(--accent-cyan);">${p.email}</a></td></tr>
          <tr><td><strong>Mobile / WhatsApp</strong></td><td><a href="tel:${p.phone}" style="color: var(--accent-cyan);">${p.phone}</a></td></tr>
          <tr><td><strong>GitHub</strong></td><td><a href="${p.github}" target="_blank" style="color: var(--accent-cyan);">${p.github}</a></td></tr>
          <tr><td><strong>LinkedIn</strong></td><td><a href="${p.linkedin}" target="_blank" style="color: var(--accent-cyan);">${p.linkedin}</a></td></tr>
          <tr><td><strong>Location</strong></td><td>${p.location}</td></tr>
          <tr><td><strong>Status</strong></td><td><span class="term-success">${p.availability}</span></td></tr>
        </tbody>
      </table>
    `;
  }

  cmdTheme(args) {
    if (!args || args.length === 0) {
      return `<div class="term-warn">Usage: theme &lt;obsidian | matrix | nord | amber | light&gt;</div>`;
    }
    const themeName = args[0].toLowerCase();
    if (window.ThemeManager) {
      window.ThemeManager.applyTheme(themeName);
      return `<div class="term-success">Theme updated to: <strong>${themeName}</strong></div>`;
    }
    return `<div class="term-error">ThemeManager not initialized</div>`;
  }

  cmdSudoHire() {
    if (window.showToast) {
      window.showToast("🎉 Excellent choice! Priority recruitment inquiry initiated.");
    }
    return `
      <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--accent-emerald); padding: 1rem; border-radius: 6px; margin: 0.5rem 0;">
        <div class="term-success" style="font-size: 1.1rem; font-weight: bold;">[ACCESS GRANTED] Automotive & Android Framework Specialist Selected!</div>
        <p style="margin: 0.5rem 0; color: #ecfdf5;">Candidate Lavkush Jaiswal is ready for senior engineering discussions.</p>
        <div>Direct Email: <a href="mailto:${PORTFOLIO_DATA.profile.email}" style="color: var(--accent-cyan);">${PORTFOLIO_DATA.profile.email}</a> | Phone: <strong>${PORTFOLIO_DATA.profile.phone}</strong></div>
        <div style="margin-top: 0.4rem;">
          <a href="${PORTFOLIO_DATA.profile.github}" target="_blank" style="color: var(--accent-cyan); margin-right: 1rem;">GitHub: ${PORTFOLIO_DATA.profile.github}</a>
          <a href="${PORTFOLIO_DATA.profile.linkedin}" target="_blank" style="color: var(--accent-cyan);">LinkedIn: ${PORTFOLIO_DATA.profile.linkedin}</a>
        </div>
      </div>
    `;
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

window.DeveloperTerminal = DeveloperTerminal;
