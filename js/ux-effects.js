/**
 * Advanced UX Interactions, 3D Card Tilt, Sound Synthesizer & Scroll Animations
 * For Lavkush Jaiswal Senior Automotive & Android Framework Portfolio
 */

class PortfolioUxEngine {
  constructor() {
    this.soundEnabled = false;
    this.audioCtx = null;
    this.init();
  }

  init() {
    this.initMouseSpotlight();
    this.init3DCardTilt();
    this.initScrollReveal();
    this.initAudioSynthesizer();
    this.initEngineRevSimulation();
  }

  // 1. Cursor Following Ambient Spotlight Glow
  initMouseSpotlight() {
    const spotlight = document.createElement("div");
    spotlight.className = "cursor-spotlight";
    document.body.appendChild(spotlight);

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateSpotlight() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      spotlight.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`;
      requestAnimationFrame(animateSpotlight);
    }
    animateSpotlight();
  }

  // 2. 3D Card Tilt & Dynamic Specular Sheen on Hover
  init3DCardTilt() {
    const tiltCards = document.querySelectorAll(".stat-card, .case-study-card, .skill-card, .tenet-card, .pub-card, .oss-card, .cockpit-wrapper, .arch-container");

    tiltCards.forEach(card => {
      card.classList.add("tilt-card-3d");

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.setProperty("--sheen-x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--sheen-y", `${(y / rect.height) * 100}%`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
        card.style.transition = "transform 0.4s ease-out";
      });

      card.addEventListener("mouseenter", () => {
        card.style.transition = "none";
        this.playHudSound(800, 0.03, "sine");
      });
    });
  }

  // 3. Staggered Scroll-Triggered Reveal Animations
  initScrollReveal() {
    const revealElements = document.querySelectorAll(".section-header, .stat-card, .case-study-card, .skill-card, .tenet-card, .pub-card, .timeline-item, .contact-card");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => {
      el.classList.add("reveal-on-scroll");
      observer.observe(el);
    });
  }

  // 4. Web Audio API Futuristic HUD Sound Synthesizer (Pure JS, zero external files)
  initAudioSynthesizer() {
    // Add Sound FX toggle button to Telemetry HUD
    const hudGroup = document.querySelector(".telemetry-hud .hud-group:last-child");
    if (!hudGroup) return;

    const soundBtn = document.createElement("button");
    soundBtn.className = "hud-sound-toggle";
    soundBtn.id = "hudSoundToggle";
    soundBtn.innerHTML = `<span>🔇</span> <span>AUDIO FX: OFF</span>`;
    soundBtn.title = "Toggle Futuristic HUD Audio Feedback";
    hudGroup.appendChild(soundBtn);

    soundBtn.addEventListener("click", () => {
      this.soundEnabled = !this.soundEnabled;
      if (this.soundEnabled && !this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      soundBtn.innerHTML = this.soundEnabled 
        ? `<span>🔊</span> <span style="color: var(--accent-emerald);">AUDIO FX: ON</span>` 
        : `<span>🔇</span> <span>AUDIO FX: OFF</span>`;
      
      if (this.soundEnabled) {
        this.playHudSound(600, 0.08, "triangle");
        if (window.showToast) window.showToast("🔊 Futuristic Automotive HUD Audio Enabled");
      }
    });

    // Add sound feedback on all buttons & links
    document.querySelectorAll("button, .btn, .nav-link, .cockpit-tab-btn, .ioc-cat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.playHudSound(1200, 0.05, "sine");
      });
    });
  }

  playHudSound(freq = 880, duration = 0.05, type = "sine") {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context policy fallback
    }
  }

  // 5. Interactive Tachometer / Speedometer Rev Engine Simulation
  initEngineRevSimulation() {
    const clusterSpeed = document.getElementById("clusterSpeed");
    const clusterRpm = document.getElementById("clusterRpm");

    // Add Rev Engine Button to Cockpit Bezel
    const bezel = document.querySelector(".cockpit-bezel .cluster-metrics");
    if (bezel) {
      const revBtn = document.createElement("button");
      revBtn.className = "rev-engine-btn";
      revBtn.id = "revEngineBtn";
      revBtn.innerHTML = `<span>🏎️</span> <span>REV ACCELERATOR</span>`;
      revBtn.title = "Simulate CAN Engine RPM & Speed Pulse";
      bezel.appendChild(revBtn);

      revBtn.addEventListener("mousedown", () => this.revEngine(true));
      revBtn.addEventListener("mouseup", () => this.revEngine(false));
      revBtn.addEventListener("mouseleave", () => this.revEngine(false));
      revBtn.addEventListener("touchstart", () => this.revEngine(true));
      revBtn.addEventListener("touchend", () => this.revEngine(false));
    }
  }

  revEngine(isAccelerating) {
    const speedEl = document.getElementById("clusterSpeed");
    const rpmEl = document.getElementById("clusterRpm");

    if (isAccelerating) {
      if (speedEl) speedEl.textContent = "124 km/h";
      if (rpmEl) {
        rpmEl.textContent = "6200 RPM";
        rpmEl.style.color = "#ef4444";
      }
      this.playHudSound(240, 0.3, "sawtooth");
      if (window.showToast) window.showToast("🏎️ Throttle Opened: RPM -> 6200 | CAN Speed Pulse -> 124 km/h");
    } else {
      if (speedEl) speedEl.textContent = "68 km/h";
      if (rpmEl) {
        rpmEl.textContent = "2350 RPM";
        rpmEl.style.color = "#38bdf8";
      }
    }
  }
}

window.PortfolioUxEngine = PortfolioUxEngine;
