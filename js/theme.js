/**
 * Theme Engine - Manages color palettes, persistence, and accessibility
 */

const THEMES = [
  { id: "obsidian", name: "Obsidian Dark", color: "#38bdf8" },
  { id: "matrix", name: "Matrix Green", color: "#34d399" },
  { id: "nord", name: "Nord Arctic", color: "#88c0d0" },
  { id: "amber", name: "Midnight Amber", color: "#fbbf24" },
  { id: "light", name: "Clean Minimal", color: "#0284c7" }
];

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem("portfolio_theme") || "obsidian";
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.renderThemeMenu();
    this.bindEvents();
  }

  applyTheme(themeId) {
    if (!THEMES.some(t => t.id === themeId)) {
      themeId = "obsidian";
    }
    this.currentTheme = themeId;
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("portfolio_theme", themeId);

    // Update active state in UI
    const activeLabel = document.getElementById("currentThemeLabel");
    const activeThemeObj = THEMES.find(t => t.id === themeId);
    if (activeLabel && activeThemeObj) {
      activeLabel.textContent = activeThemeObj.name;
    }

    // Trigger re-render of canvas visualizer if present
    if (window.ArchitectureVisualizer) {
      window.ArchitectureVisualizer.updateTheme();
    }
  }

  renderThemeMenu() {
    const menu = document.getElementById("themeMenu");
    if (!menu) return;

    menu.innerHTML = THEMES.map(theme => `
      <button class="theme-option ${theme.id === this.currentTheme ? 'active' : ''}" data-theme="${theme.id}">
        <span class="theme-dot" style="background-color: ${theme.color}"></span>
        <span>${theme.name}</span>
      </button>
    `).join("");
  }

  bindEvents() {
    const btn = document.getElementById("themeSelectBtn");
    const menu = document.getElementById("themeMenu");

    if (btn && menu) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("open");
      });

      document.addEventListener("click", () => {
        menu.classList.remove("open");
      });

      menu.addEventListener("click", (e) => {
        const option = e.target.closest(".theme-option");
        if (option) {
          const theme = option.getAttribute("data-theme");
          this.applyTheme(theme);
          this.renderThemeMenu();
          menu.classList.remove("open");
        }
      });
    }
  }
}

window.ThemeManager = new ThemeManager();
