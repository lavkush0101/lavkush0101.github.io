/**
 * Automotive IVI Cockpit & Tier-1 OEM Simulator
 * Dual Circular Gauges, MSIL 60+ Features & Android Auto Engine
 * For Lavkush Jaiswal Portfolio
 */

class AutomotiveCockpitSimulator {
  constructor() {
    this.currentMode = "msil-diag"; // 'msil-diag' | 'android-auto' | 'aosp-ipc'
    this.currentIocTab = "camera-svs"; // 'camera-svs' | 'ioc-hw' | 'audio-radio' | 'security-logging'
    this.steeringAngle = 14;
    this.selectedCarColor = "#38bdf8"; // Nexa Blue
    this.sarEnabled = true;
    this.isPlayingMedia = true;
    this.speedKmH = 68;
    this.rpm = 2350;
    this.canPacketCount = 1420;

    this.container = document.getElementById("cockpitStage");
    this.tabButtons = document.querySelectorAll(".cockpit-tab-btn");

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.bindTabs();
    this.startDualGaugeSimulation();
    this.renderMode(this.currentMode);
  }

  bindTabs() {
    this.tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode");
        this.switchMode(mode);
      });
    });
  }

  switchMode(mode) {
    this.currentMode = mode;
    this.tabButtons.forEach(b => b.classList.toggle("active", b.getAttribute("data-mode") === mode));
    this.renderMode(mode);
  }

  startDualGaugeSimulation() {
    const speedArc = document.getElementById("speedDialArc");
    const speedVal = document.getElementById("speedDialVal");
    const rpmArc = document.getElementById("rpmDialArc");
    const rpmVal = document.getElementById("rpmDialVal");
    const canEl = document.getElementById("clusterCanPackets");

    // Dynamic natural cruising variations
    setInterval(() => {
      if (window.isManualRevving) return;

      this.speedKmH = (65 + Math.sin(Date.now() / 3000) * 7).toFixed(0);
      this.rpm = (2250 + Math.sin(Date.now() / 2000) * 260).toFixed(0);
      this.canPacketCount += Math.floor(Math.random() * 4) + 1;

      this.updateGaugesUI(this.speedKmH, this.rpm);

      if (canEl) canEl.textContent = `CAN: 0x18DA${(this.canPacketCount % 9999).toString(16).toUpperCase()}`;
    }, 1200);

    // Bind Accelerator Rev Button
    const revBtn = document.getElementById("throttleRevBtn");
    if (revBtn) {
      const startRev = () => {
        window.isManualRevving = true;
        this.updateGaugesUI(128, 6400, true);
        if (window.UxEngine) window.UxEngine.playHudSound(260, 0.35, "sawtooth");
        if (window.showToast) window.showToast("🏎️ Throttle Opened: 6400 RPM Redline | CAN Speed Pulse 128 km/h");
      };

      const stopRev = () => {
        window.isManualRevving = false;
        this.updateGaugesUI(68, 2350, false);
      };

      revBtn.addEventListener("mousedown", startRev);
      revBtn.addEventListener("mouseup", stopRev);
      revBtn.addEventListener("mouseleave", stopRev);
      revBtn.addEventListener("touchstart", startRev);
      revBtn.addEventListener("touchend", stopRev);
    }
  }

  updateGaugesUI(speed, rpm, isRedlining = false) {
    const speedArc = document.getElementById("speedDialArc");
    const speedVal = document.getElementById("speedDialVal");
    const rpmArc = document.getElementById("rpmDialArc");
    const rpmVal = document.getElementById("rpmDialVal");

    // Speed: 0 to 200 km/h mapped to 200 -> 0 stroke-dashoffset
    const speedOffset = Math.max(0, 200 - (speed / 200) * 200);
    // RPM: 0 to 8000 RPM mapped to 200 -> 0 stroke-dashoffset
    const rpmOffset = Math.max(0, 200 - (rpm / 8000) * 200);

    if (speedVal) speedVal.textContent = speed;
    if (rpmVal) rpmVal.textContent = (rpm / 1000).toFixed(1) + "k";

    if (speedArc) speedArc.style.strokeDashoffset = speedOffset;
    if (rpmArc) {
      rpmArc.style.strokeDashoffset = rpmOffset;
      rpmArc.style.stroke = isRedlining ? "#ef4444" : "url(#cyanPurpleGrad)";
    }
  }

  renderMode(mode) {
    if (!this.container) return;

    if (mode === "msil-diag") {
      this.renderMsilDiagnostic();
    } else if (mode === "android-auto") {
      this.renderAndroidAuto();
    } else if (mode === "aosp-ipc") {
      this.renderAospIpc();
    }
  }

  /* ==========================================================================
     MODE 1: MSIL 60+ DIAGNOSTIC & IOC HARDWARE CONTROLLER
     ========================================================================== */
  renderMsilDiagnostic() {
    this.container.innerHTML = `
      <div class="msil-master-grid">
        <!-- Left: RVC & SVS 360° Camera Viewport -->
        <div class="camera-viewport" id="cameraViewport">
          <svg class="guideline-svg" viewBox="0 0 400 300" id="guidelineSvg">
            ${this.generateGuidelinePaths(this.steeringAngle)}
          </svg>

          <div class="sonar-pulse-ring"></div>

          <div style="display: flex; justify-content: space-between; align-items: center; z-index: 5;">
            <span class="can-live-pulse-badge" style="background: rgba(239, 68, 68, 0.2); border-color: #ef4444; color: #ef4444;">
              ● RVC / SVS CAM HAL (ACTIVE)
            </span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #22c55e; font-weight: bold;">
              LATENCY: 18ms (ZERO-DROP)
            </span>
          </div>

          <!-- Dynamic Steering Angle Slider -->
          <div class="steering-slider-box">
            <label>
              <span>DYNAMIC STEERING ANGLE: <strong id="steeringAngleLabel" style="color: #38bdf8;">${this.steeringAngle}°</strong></span>
              <span>CAN SWC SYNC</span>
            </label>
            <input type="range" id="steeringAngleSlider" min="-35" max="35" value="${this.steeringAngle}" step="1">
          </div>

          <!-- SVS 3D Vehicle Body Color Selector -->
          <div class="svs-car-box">
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #cbd5e1; font-weight: 600;">
              SVS 3D Vehicle Body Color:
            </span>
            <div class="color-swatches">
              <button class="swatch-btn ${this.selectedCarColor === '#38bdf8' ? 'active' : ''}" data-color="#38bdf8" style="background: #38bdf8;" title="Nexa Blue Metallic"></button>
              <button class="swatch-btn ${this.selectedCarColor === '#f1f5f9' ? 'active' : ''}" data-color="#f1f5f9" style="background: #f1f5f9;" title="Pearl Arctic White"></button>
              <button class="swatch-btn ${this.selectedCarColor === '#64748b' ? 'active' : ''}" data-color="#64748b" style="background: #64748b;" title="Metallic Magma Grey"></button>
              <button class="swatch-btn ${this.selectedCarColor === '#ef4444' ? 'active' : ''}" data-color="#ef4444" style="background: #ef4444;" title="Auburn Red"></button>
            </div>
          </div>
        </div>

        <!-- Right: 60+ Feature IOC & Sub-system Matrix -->
        <div class="ioc-controller-panel">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h4 style="font-size: 1.1rem; color: #ffffff; margin: 0;">MSIL 60+ Diagnostic Features Hub</h4>
            <span class="can-live-pulse-badge">60+ Features Built</span>
          </div>

          <!-- IOC Category Navigation -->
          <div class="ioc-category-nav">
            <button class="ioc-cat-btn ${this.currentIocTab === 'camera-svs' ? 'active' : ''}" data-tab="camera-svs">
              📷 Camera & SVS
            </button>
            <button class="ioc-cat-btn ${this.currentIocTab === 'ioc-hw' ? 'active' : ''}" data-tab="ioc-hw">
              🔌 USB & IOC HW
            </button>
            <button class="ioc-cat-btn ${this.currentIocTab === 'audio-radio' ? 'active' : ''}" data-tab="audio-radio">
              📻 Arkamys & Radio
            </button>
            <button class="ioc-cat-btn ${this.currentIocTab === 'security-logging' ? 'active' : ''}" data-tab="security-logging">
              🔒 SELinux & Logs
            </button>
          </div>

          <!-- Dynamic Feature Grid -->
          <div class="ioc-grid" id="iocGridContainer">
            ${this.renderIocTabContent(this.currentIocTab)}
          </div>

          <!-- S@R & Speed Restriction Lockout Toggle -->
          <div class="sar-toggle-row">
            <div>
              <span style="color: #ffffff; font-weight: bold;">S@R Content Restriction (Speed Lockout)</span>
              <div style="font-size: 0.7rem; color: var(--text-muted);">Locks video & soft keyboard when vehicle speed > 5 km/h</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="sarToggleInput" ${this.sarEnabled ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- Live Automotive Debug Log Stream -->
          <div class="log-stream-box" id="liveLogStream">
            <span class="log-highlight">[IOC_HAL]</span> CAN SWC Resistance: 3.2 kOhm (VOL_UP pressed) -> <span style="color: #22c55e;">SELinux allowed</span>
          </div>
        </div>
      </div>
    `;

    this.bindMsilEvents();
  }

  generateGuidelinePaths(angle) {
    const offset = angle * 2.2;
    return `
      <defs>
        <linearGradient id="cyanPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#a855f7" />
        </linearGradient>
      </defs>

      <!-- Green Safe Zone (3.0m) -->
      <path d="M 120 280 Q ${160 + offset * 0.4} 210, ${180 + offset} 140" class="guideline-path-green" />
      <path d="M 280 280 Q ${240 + offset * 0.4} 210, ${220 + offset} 140" class="guideline-path-green" />
      <line x1="${180 + offset}" y1="140" x2="${220 + offset}" y2="140" stroke="#22c55e" stroke-width="2.5" />

      <!-- Yellow Caution Zone (2.0m) -->
      <path d="M 110 280 Q ${150 + offset * 0.6} 230, ${170 + offset * 0.7} 190" class="guideline-path-yellow" />
      <path d="M 290 280 Q ${250 + offset * 0.6} 230, ${230 + offset * 0.7} 190" class="guideline-path-yellow" />
      <line x1="${170 + offset * 0.7}" y1="190" x2="${230 + offset * 0.7}" y2="190" stroke="#eab308" stroke-width="3" />

      <!-- Red Stop Zone (0.5m) -->
      <path d="M 100 280 Q ${140 + offset * 0.8} 250, ${160 + offset * 0.8} 240" class="guideline-path-red" />
      <path d="M 300 280 Q ${260 + offset * 0.8} 250, ${240 + offset * 0.8} 240" class="guideline-path-red" />
      <line x1="${160 + offset * 0.8}" y1="240" x2="${240 + offset * 0.8}" y2="240" stroke="#ef4444" stroke-width="3.5" />
    `;
  }

  renderIocTabContent(tab) {
    if (tab === "camera-svs") {
      return `
        <div class="ioc-feature-card">
          <div class="feat-tag">RVC GUIDELINES</div>
          <div class="feat-val">Static & Dynamic Overlay</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">SVS 360° BIRD VIEW</div>
          <div class="feat-val">4-Camera Fish-Eye Stitch</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">CAMERA CALIBRATION</div>
          <div class="feat-val">Matrix Distortion Corrected</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">SVS BODY COLOR</div>
          <div class="feat-val" id="currentColorLabel">Nexa Blue Metallic</div>
        </div>
      `;
    } else if (tab === "ioc-hw") {
      return `
        <div class="ioc-feature-card">
          <div class="feat-tag">USB PORT 1 (OTG/HOST)</div>
          <div class="feat-val">CarPlay / AA (5V / 2.1A)</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">USB PORT 2 (MEDIA)</div>
          <div class="feat-val">Mass Storage (High-Speed)</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">STEERING WHEEL (SWC)</div>
          <div class="feat-val">CAN SW Matrix (6 Keys OK)</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">HARDKEYS & KNOB</div>
          <div class="feat-val">Rotary Encoder & Backlight</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">FAN & HVAC IOC</div>
          <div class="feat-val">CAN Blower Steps 1-7 OK</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">SPEED PULSE SENSOR</div>
          <div class="feat-val">4 Pulse / Rev (VSS Sensor)</div>
        </div>
      `;
    } else if (tab === "audio-radio") {
      return `
        <div class="ioc-feature-card">
          <div class="feat-tag">ARKAMYS 3D SOUND</div>
          <div class="feat-val">Spatial Staging & EQ Filter</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">DUAL-MIC BEAMFORMING</div>
          <div class="feat-val">Noise Canceling (SNR 68dB)</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">RADIO TUNER (FM/AM)</div>
          <div class="feat-val">RDS AF / TA / TP Auto-Scan</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">DAB+ DIGITAL RADIO</div>
          <div class="feat-val">Band III (DLS Dynamic Text)</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">LOUDNESS DSP</div>
          <div class="feat-val">Dynamic Bass Compensation</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">SPEAKER CHANNELS</div>
          <div class="feat-val">4x45W High-Power Out</div>
        </div>
      `;
    } else if (tab === "security-logging") {
      return `
        <div class="ioc-feature-card">
          <div class="feat-tag">SELINUX DOMAIN</div>
          <div class="feat-val">Enforcing (harman_te)</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">SECURITY PIN LOG</div>
          <div class="feat-val">Dealer Auth Gateway OK</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">BT SNOOP LOGGING</div>
          <div class="feat-val">HCI Capture Enabled</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">CRASH DUMP EXTRACTOR</div>
          <div class="feat-val">Kernel dmesg & Tombstones</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">DIAGNOSTIC MODES</div>
          <div class="feat-val">Factory / Dealer / Eng Mode</div>
        </div>
        <div class="ioc-feature-card">
          <div class="feat-tag">CAN BUS ENCRYPTION</div>
          <div class="feat-val">SecOC Auth Verified</div>
        </div>
      `;
    }
  }

  bindMsilEvents() {
    // Steering Angle Slider
    const slider = document.getElementById("steeringAngleSlider");
    const angleLabel = document.getElementById("steeringAngleLabel");
    const guidelineSvg = document.getElementById("guidelineSvg");

    if (slider) {
      slider.addEventListener("input", (e) => {
        this.steeringAngle = parseInt(e.target.value, 10);
        if (angleLabel) angleLabel.textContent = `${this.steeringAngle}°`;
        if (guidelineSvg) guidelineSvg.innerHTML = this.generateGuidelinePaths(this.steeringAngle);
      });
    }

    // Color Swatches for SVS Car Color
    document.querySelectorAll(".swatch-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".swatch-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedCarColor = btn.getAttribute("data-color");
        const title = btn.getAttribute("title");
        const colorLabel = document.getElementById("currentColorLabel");
        if (colorLabel) colorLabel.textContent = title;
        if (window.showToast) {
          window.showToast(`🎨 SVS 3D Body Color set to ${title}`);
        }
      });
    });

    // IOC Tabs
    document.querySelectorAll(".ioc-cat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".ioc-cat-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentIocTab = btn.getAttribute("data-tab");
        const grid = document.getElementById("iocGridContainer");
        if (grid) grid.innerHTML = this.renderIocTabContent(this.currentIocTab);
      });
    });

    // S@R Toggle
    const sarToggle = document.getElementById("sarToggleInput");
    if (sarToggle) {
      sarToggle.addEventListener("change", (e) => {
        this.sarEnabled = e.target.checked;
        if (window.showToast) {
          window.showToast(this.sarEnabled ? "🔒 S@R Content Restriction Enabled (Speed Lockout Active)" : "⚠️ S@R Content Restriction Disabled");
        }
      });
    }

    // Cycle simulated debug logs
    this.startLogSimulation();
  }

  startLogSimulation() {
    const logBox = document.getElementById("liveLogStream");
    const logs = [
      "<span class='log-highlight'>[IOC_HAL]</span> Port 1 USB Accessory Handshake -> <span style='color: #22c55e;'>SUCCESS (5V/2.1A)</span>",
      "<span class='log-highlight'>[CAN_SWC]</span> SW_CAN_01: Steering Angle Rx 14.5 deg -> <span style='color: #38bdf8;'>RVC Guideline Recalculated</span>",
      "<span class='log-highlight'>[ARKAMYS_DSP]</span> 3D Audio Spatial filter applied to 4-channel speaker outputs",
      "<span class='log-highlight'>[SELINUX]</span> harman_diagnostic_service domain verification: <span style='color: #22c55e;'>PASSED (Enforcing)</span>",
      "<span class='log-highlight'>[S@R_LOCKOUT]</span> Speed > 5 km/h detected -> Video playback locked for driver safety",
      "<span class='log-highlight'>[BT_SNOOP]</span> HCI snoop packet dumped to /data/vendor/logs/btsnoop.log",
      "<span class='log-highlight'>[RADIO_TUNER]</span> DAB+ Band III Ensemble synchronized (Bitrate: 128 kbps AAC)"
    ];
    let logIdx = 0;

    setInterval(() => {
      if (logBox) {
        logBox.innerHTML = logs[logIdx % logs.length];
        logIdx++;
      }
    }, 2800);
  }

  /* ==========================================================================
     MODE 2: ANDROID AUTO WIRELESS PROJECTION
     ========================================================================== */
  renderAndroidAuto() {
    this.container.innerHTML = `
      <div class="auto-screen">
        <div class="auto-rail">
          <div class="rail-group">
            <button class="rail-btn active" title="Google Maps Navigation">🗺️</button>
            <button class="rail-btn" title="Spotify Media Playback">🎵</button>
            <button class="rail-btn" title="Phone Calls">📞</button>
            <button class="rail-btn" title="App Drawer">▦</button>
          </div>
          <div class="rail-group">
            <button class="rail-btn" id="asstVoiceTrigger" title="Google Assistant Voice">🎙️</button>
          </div>
        </div>

        <div class="auto-content">
          <div class="map-widget">
            <div class="map-canvas-bg"></div>
            
            <div class="nav-direction-box">
              <div class="nav-arrow-icon">↱</div>
              <div class="nav-text">
                <h4>In 300m, Turn Right</h4>
                <p>Towards Electronic City Expressway • 12 mins remaining</p>
              </div>
            </div>

            <div class="map-car-cursor">🚗</div>

            <div style="position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #38bdf8; background: rgba(56,189,248,0.15); padding: 0.2rem 0.5rem; border-radius: 4px;">
                ⚡ Wi-Fi P2P 5GHz Active
              </span>
              <span style="font-family: var(--font-mono); font-size: 0.8rem; color: #22c55e; font-weight: bold;">
                60 FPS (MediaCodec HW)
              </span>
            </div>
          </div>

          <div class="side-widgets">
            <div class="media-widget">
              <div class="media-header">
                <div class="album-art">📻</div>
                <div class="track-info">
                  <h5>High-Bandwidth Audio Stream</h5>
                  <p>ExoPlayer Automotive • 24-bit / 48kHz</p>
                </div>
              </div>

              <div class="waveform-bars">
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
              </div>

              <div class="media-controls">
                <button class="ctrl-btn" title="Previous Track">⏮</button>
                <button class="ctrl-btn" id="cockpitPlayPause" style="background: #38bdf8; color: #040914; font-weight: bold;">
                  ${this.isPlayingMedia ? '⏸' : '▶'}
                </button>
                <button class="ctrl-btn" title="Next Track">⏭</button>
              </div>
            </div>

            <div class="assistant-widget" id="cockpitAsstWidget">
              <div class="assistant-info">
                <span style="font-size: 1.1rem;">🎙️</span>
                <span style="font-size: 0.8rem; color: #cbd5e1; font-weight: 500;" id="asstStatusText">
                  Google Assistant Ready
                </span>
              </div>
              <div class="assistant-dots">
                <span class="asst-dot asst-dot-1"></span>
                <span class="asst-dot asst-dot-2"></span>
                <span class="asst-dot asst-dot-3"></span>
                <span class="asst-dot asst-dot-4"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindAndroidAutoEvents();
  }

  bindAndroidAutoEvents() {
    const playBtn = document.getElementById("cockpitPlayPause");
    const voiceBtn = document.getElementById("asstVoiceTrigger");
    const asstText = document.getElementById("asstStatusText");

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        this.isPlayingMedia = !this.isPlayingMedia;
        playBtn.textContent = this.isPlayingMedia ? '⏸' : '▶';
        const waveBars = document.querySelectorAll(".wave-bar");
        waveBars.forEach(bar => {
          bar.style.animationPlayState = this.isPlayingMedia ? 'running' : 'paused';
        });
        if (window.showToast) {
          window.showToast(this.isPlayingMedia ? "🎵 MediaCodec audio stream resumed" : "⏸️ Media stream paused");
        }
      });
    }

    if (voiceBtn && asstText) {
      voiceBtn.addEventListener("click", () => {
        asstText.textContent = "Listening for automotive VR command...";
        asstText.style.color = "#38bdf8";
        if (window.showToast) {
          window.showToast("🎙️ Google Assistant VR/ASR Voice Recognition Triggered");
        }
        setTimeout(() => {
          asstText.textContent = "Navigating to Tech Park • Audio Ducked";
          asstText.style.color = "#22c55e";
        }, 1800);
        setTimeout(() => {
          asstText.textContent = "Google Assistant Ready";
          asstText.style.color = "#cbd5e1";
        }, 4000);
      });
    }
  }

  /* ==========================================================================
     MODE 3: AOSP & SELINUX BINDER IPC PIPELINE
     ========================================================================== */
  renderAospIpc() {
    this.container.innerHTML = `
      <div class="ipc-screen">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h4 style="font-size: 1.1rem; color: #ffffff; margin: 0;">AOSP Framework & SELinux Binder IPC Pipeline</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.2rem 0 0 0;">
              Zero-Trust process isolation from HMI application to Automotive HAL drivers
            </p>
          </div>
          <span class="can-live-pulse-badge">Binder IPC: 1.2ms</span>
        </div>

        <div class="ipc-pipeline-row">
          <div class="ipc-node">
            <span style="font-family: var(--font-mono); font-size: 0.65rem; color: #38bdf8;">LAYER 1: USER HMI</span>
            <div style="font-size: 0.95rem; font-weight: bold; color: #ffffff; margin: 0.3rem 0;">Diagnostic App</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">Kotlin / MVVM</div>
          </div>

          <div class="ipc-arrow">➔</div>

          <div class="ipc-node">
            <span style="font-family: var(--font-mono); font-size: 0.65rem; color: #a855f7;">LAYER 2: IPC PROXY</span>
            <div style="font-size: 0.95rem; font-weight: bold; color: #ffffff; margin: 0.3rem 0;">AIDL Interface</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">Binder Transaction</div>
          </div>

          <div class="ipc-arrow">➔</div>

          <div class="ipc-node">
            <span style="font-family: var(--font-mono); font-size: 0.65rem; color: #fbbf24;">LAYER 3: SECURITY</span>
            <div style="font-size: 0.95rem; font-weight: bold; color: #ffffff; margin: 0.3rem 0;">SELinux Policy</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">Type Enforcement (.te)</div>
          </div>

          <div class="ipc-arrow">➔</div>

          <div class="ipc-node">
            <span style="font-family: var(--font-mono); font-size: 0.65rem; color: #22c55e;">LAYER 4: HARDWARE</span>
            <div style="font-size: 0.95rem; font-weight: bold; color: #ffffff; margin: 0.3rem 0;">C++ HAL & JNI</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">Kernel Driver Interface</div>
          </div>
        </div>

        <div style="background: #040810; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.78rem; color: #cbd5e1;">
          <span style="color: #38bdf8;">[AOSP SYSTEM_SERVER LOG]</span>:
          <code>Binder call dispatched: IDiagnosticService::getUsbPortStatus(port=1) -> UID 1000 allowed by SELinux domain [harman_diagnostic_service] -> HAL response 0x00 (SUCCESS) in 1.2ms</code>
        </div>
      </div>
    `;
  }
}

window.AutomotiveCockpitSimulator = AutomotiveCockpitSimulator;
