/**
 * Interactive System Architecture Visualizer Engine
 * Renders dynamic node graphs, animated packet flows, and interactive node telemetry.
 */

class SystemArchitectureVisualizer {
  constructor() {
    this.currentScenarioIndex = 0;
    this.isPlaying = true;
    this.speedMultiplier = 1;
    this.selectedNodeId = null;
    this.packets = [];
    this.animFrameId = null;

    this.container = document.getElementById("archStage");
    this.svg = document.getElementById("archSvgOverlay");
    this.nodesGrid = document.getElementById("archNodesGrid");
    this.inspector = document.getElementById("nodeInspector");

    if (this.container && this.svg && this.nodesGrid) {
      this.init();
    }
  }

  init() {
    this.renderTabs();
    this.loadScenario(0);
    this.bindControls();
    this.startAnimationLoop();

    window.addEventListener("resize", () => {
      this.drawConnections();
    });
  }

  getScenario() {
    return PORTFOLIO_DATA.architectures[this.currentScenarioIndex];
  }

  renderTabs() {
    const tabsContainer = document.getElementById("archTabs");
    if (!tabsContainer) return;

    tabsContainer.innerHTML = PORTFOLIO_DATA.architectures.map((arch, index) => `
      <button class="arch-tab-btn ${index === this.currentScenarioIndex ? 'active' : ''}" data-index="${index}">
        <span>●</span>
        <span>${arch.title}</span>
      </button>
    `).join("");

    tabsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".arch-tab-btn");
      if (btn) {
        const index = parseInt(btn.getAttribute("data-index"), 10);
        this.loadScenario(index);
      }
    });
  }

  loadScenario(index) {
    this.currentScenarioIndex = index;
    const scenario = this.getScenario();

    // Update Tab UI
    document.querySelectorAll(".arch-tab-btn").forEach((btn, idx) => {
      btn.classList.toggle("active", idx === index);
    });

    // Update scenario description & metrics
    const descEl = document.getElementById("archScenarioDesc");
    if (descEl) {
      descEl.textContent = scenario.description;
    }

    const metricsEl = document.getElementById("archScenarioMetrics");
    if (metricsEl) {
      metricsEl.innerHTML = Object.entries(scenario.metrics).map(([k, v]) => `
        <div class="case-metric-box">
          <div class="case-metric-label">${k.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
          <div class="compare-after">${v}</div>
        </div>
      `).join("");
    }

    // Render Nodes
    this.renderNodes(scenario.nodes);

    // Auto-select first node
    if (scenario.nodes.length > 0) {
      this.selectNode(scenario.nodes[0].id);
    }

    // Wait for DOM layout then draw SVG connections
    setTimeout(() => {
      this.drawConnections();
      this.spawnPackets();
    }, 50);
  }

  renderNodes(nodes) {
    this.nodesGrid.innerHTML = nodes.map(node => `
      <div class="arch-node" id="node-${node.id}" data-id="${node.id}">
        <span class="node-type-badge node-type-${node.type}">${node.type}</span>
        <div class="node-name">${node.name}</div>
        <div class="node-tech">${node.tech}</div>
        <div class="node-footer">
          <span>Latency</span>
          <span class="node-latency">${node.latency}</span>
        </div>
      </div>
    `).join("");

    // Add node click listeners
    this.nodesGrid.querySelectorAll(".arch-node").forEach(el => {
      el.addEventListener("click", () => {
        const nodeId = el.getAttribute("data-id");
        this.selectNode(nodeId);
      });
    });
  }

  selectNode(nodeId) {
    this.selectedNodeId = nodeId;
    const scenario = this.getScenario();
    const node = scenario.nodes.find(n => n.id === nodeId);

    if (!node) return;

    // Update node visual active states
    this.nodesGrid.querySelectorAll(".arch-node").forEach(el => {
      el.classList.toggle("selected", el.getAttribute("data-id") === nodeId);
    });

    // Render Inspector
    if (this.inspector) {
      this.inspector.innerHTML = `
        <div class="inspector-info">
          <h4>${node.name}</h4>
          <div class="inspector-role">Role: ${node.role}</div>
          <p class="inspector-desc">${node.details}</p>
          <div class="inspector-meta-row">
            <div class="inspector-meta-item"><span>Stack: </span><strong>${node.tech}</strong></div>
            <div class="inspector-meta-item"><span>Avg Overhead: </span><strong>${node.latency}</strong></div>
            <div class="inspector-meta-item"><span>Layer: </span><strong>${node.type.toUpperCase()}</strong></div>
          </div>
        </div>
        <div class="inspector-code-box">
          <div class="inspector-code-header">
            <span>Implementation / Configuration Spec</span>
            <span style="color: var(--accent-cyan)">ACTIVE NODE</span>
          </div>
          <pre><code>${this.escapeHtml(node.code)}</code></pre>
        </div>
      `;
    }
  }

  drawConnections() {
    const scenario = this.getScenario();
    if (!this.svg || !scenario) return;

    const svgRect = this.svg.getBoundingClientRect();
    this.svg.setAttribute("viewBox", `0 0 ${svgRect.width} ${svgRect.height}`);

    let pathsHtml = "";

    scenario.connections.forEach((conn, idx) => {
      const fromEl = document.getElementById(`node-${conn.from}`);
      const toEl = document.getElementById(`node-${conn.to}`);

      if (fromEl && toEl) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = (fromRect.left + fromRect.right) / 2 - svgRect.left;
        const y1 = (fromRect.top + fromRect.bottom) / 2 - svgRect.top;
        const x2 = (toRect.left + toRect.right) / 2 - svgRect.left;
        const y2 = (toRect.top + toRect.bottom) / 2 - svgRect.top;

        // Smooth bezier curve
        const dx = x2 - x1;
        const dy = y2 - y1;
        const cx1 = x1 + dx * 0.5;
        const cy1 = y1;
        const cx2 = x1 + dx * 0.5;
        const cy2 = y2;

        const pathD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

        pathsHtml += `
          <path id="path-${conn.from}-${conn.to}" d="${pathD}" class="arch-line" />
        `;
      }
    });

    this.svg.innerHTML = pathsHtml;
  }

  spawnPackets() {
    this.packets = [];
    const scenario = this.getScenario();
    scenario.connections.forEach(conn => {
      for (let i = 0; i < 3; i++) {
        this.packets.push({
          from: conn.from,
          to: conn.to,
          progress: i * 0.33,
          speed: 0.005 + Math.random() * 0.003
        });
      }
    });
  }

  startAnimationLoop() {
    const render = () => {
      if (this.isPlaying) {
        this.updatePackets();
      }
      this.animFrameId = requestAnimationFrame(render);
    };
    this.animFrameId = requestAnimationFrame(render);
  }

  updatePackets() {
    if (!this.svg) return;

    // Remove existing packet elements
    this.svg.querySelectorAll(".flow-packet").forEach(el => el.remove());

    const scenario = this.getScenario();

    this.packets.forEach(packet => {
      packet.progress += packet.speed * this.speedMultiplier;
      if (packet.progress >= 1) {
        packet.progress = 0;
      }

      const pathEl = document.getElementById(`path-${packet.from}-${packet.to}`);
      if (pathEl) {
        const totalLen = pathEl.getTotalLength();
        const pt = pathEl.getPointAtLength(packet.progress * totalLen);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", pt.x);
        circle.setAttribute("cy", pt.y);
        circle.setAttribute("r", "4.5");
        circle.setAttribute("class", "flow-packet");
        this.svg.appendChild(circle);
      }
    });
  }

  bindControls() {
    const playPauseBtn = document.getElementById("simPlayPause");
    const speedBtn = document.getElementById("simSpeed");

    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", () => {
        this.isPlaying = !this.isPlaying;
        playPauseBtn.innerHTML = this.isPlaying ? `<span>⏸</span> Pause` : `<span>▶</span> Play`;
      });
    }

    if (speedBtn) {
      speedBtn.addEventListener("click", () => {
        if (this.speedMultiplier === 1) this.speedMultiplier = 2;
        else if (this.speedMultiplier === 2) this.speedMultiplier = 4;
        else this.speedMultiplier = 1;

        speedBtn.innerHTML = `<span>⚡</span> ${this.speedMultiplier}x Speed`;
      });
    }
  }

  updateTheme() {
    this.drawConnections();
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

window.SystemArchitectureVisualizer = SystemArchitectureVisualizer;
