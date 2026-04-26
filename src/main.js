import React, { useEffect, useMemo, useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";

const html = htm.bind(React.createElement);

const palette = {
  accent: "#4f7cff",
  lineStrong: "#93a2bf",
};

const templates = {
  network: {
    label: "Network",
    summary: "Topology map for routers, services, and traffic edges.",
    nodes: [
      { id: "gateway", title: "Gateway", type: "network", x: 110, y: 130, tone: "accent", note: "External entry point" },
      { id: "firewall", title: "Firewall", type: "service", x: 330, y: 130, tone: "default", note: "Traffic inspection" },
      { id: "api", title: "API Cluster", type: "compute", x: 560, y: 90, tone: "default", note: "Core business services" },
      { id: "cache", title: "Redis Cache", type: "database", x: 560, y: 250, tone: "default", note: "Low-latency storage" },
      { id: "db", title: "Primary DB", type: "database", x: 810, y: 170, tone: "accentSoft", note: "Transactional data" },
    ],
    edges: [
      { id: "e1", source: "gateway", target: "firewall", label: "HTTPS" },
      { id: "e2", source: "firewall", target: "api", label: "gRPC" },
      { id: "e3", source: "api", target: "cache", label: "read/write" },
      { id: "e4", source: "api", target: "db", label: "SQL" },
    ],
  },
  flow: {
    label: "Flow",
    summary: "User and system sequence with clear decision points.",
    nodes: [
      { id: "entry", title: "Request", type: "pill", x: 110, y: 160, tone: "accent", note: "Start trigger" },
      { id: "validate", title: "Validate", type: "compute", x: 320, y: 160, tone: "default", note: "Input and policy checks" },
      { id: "decision", title: "Approved?", type: "decision", x: 560, y: 150, tone: "default", note: "Routing condition" },
      { id: "done", title: "Complete", type: "pill", x: 830, y: 80, tone: "accentSoft", note: "Success state" },
      { id: "retry", title: "Retry", type: "service", x: 830, y: 240, tone: "default", note: "Fallback path" },
    ],
    edges: [
      { id: "f1", source: "entry", target: "validate", label: "submit" },
      { id: "f2", source: "validate", target: "decision", label: "rules" },
      { id: "f3", source: "decision", target: "done", label: "yes" },
      { id: "f4", source: "decision", target: "retry", label: "no" },
    ],
  },
  architecture: {
    label: "Architecture",
    summary: "Layered system blueprint across client, services, and data.",
    nodes: [
      { id: "client", title: "Client App", type: "compute", x: 110, y: 90, tone: "accent", note: "Web + mobile surfaces" },
      { id: "edge", title: "Edge Layer", type: "service", x: 110, y: 260, tone: "default", note: "CDN and auth" },
      { id: "orchestrator", title: "Orchestrator", type: "compute", x: 410, y: 175, tone: "default", note: "Business workflows" },
      { id: "events", title: "Event Bus", type: "network", x: 710, y: 80, tone: "default", note: "Async events" },
      { id: "warehouse", title: "Warehouse", type: "database", x: 710, y: 270, tone: "accentSoft", note: "Analytics and reporting" },
    ],
    edges: [
      { id: "a1", source: "client", target: "orchestrator", label: "requests" },
      { id: "a2", source: "edge", target: "orchestrator", label: "trusted traffic" },
      { id: "a3", source: "orchestrator", target: "events", label: "publish" },
      { id: "a4", source: "orchestrator", target: "warehouse", label: "persist" },
    ],
  },
};

const nodeCatalog = [
  { type: "compute", label: "Process", description: "Main service or screen" },
  { type: "service", label: "Service", description: "Capability or subsystem" },
  { type: "database", label: "Database", description: "Structured storage" },
  { type: "network", label: "Network", description: "Gateway or edge route" },
  { type: "decision", label: "Decision", description: "Conditional branch" },
  { type: "pill", label: "Start / End", description: "Flow boundary" },
];

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneTemplate(key) {
  const template = templates[key];
  return {
    nodes: template.nodes.map((node) => ({ ...node })),
    edges: template.edges.map((edge) => ({ ...edge })),
    meta: {
      key,
      label: template.label,
      summary: template.summary,
    },
  };
}

function nodeSize(type) {
  if (type === "pill") return { width: 150, height: 56 };
  if (type === "decision") return { width: 132, height: 132 };
  if (type === "database") return { width: 164, height: 92 };
  if (type === "network") return { width: 170, height: 78 };
  return { width: 178, height: 86 };
}

function toneStyles(tone) {
  if (tone === "accent") {
    return {
      fill: "linear-gradient(135deg, #ffffff 0%, #edf4ff 100%)",
      border: "#8cb2ff",
      shadow: "0 24px 48px rgba(85, 126, 234, 0.16)",
    };
  }
  if (tone === "accentSoft") {
    return {
      fill: "linear-gradient(135deg, #ffffff 0%, #f4f7ff 100%)",
      border: "#bfd0ff",
      shadow: "0 20px 40px rgba(100, 120, 180, 0.12)",
    };
  }
  return {
    fill: "linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)",
    border: "#dbe3f0",
    shadow: "0 22px 38px rgba(15, 23, 42, 0.08)",
  };
}

function edgePath(source, target) {
  const startX = source.x + source.width;
  const startY = source.y + source.height / 2;
  const endX = target.x;
  const endY = target.y + target.height / 2;
  const midX = startX + (endX - startX) / 2;
  return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
}

function App() {
  const initial = useMemo(() => cloneTemplate("architecture"), []);
  const [nodes, setNodes] = useState(initial.nodes);
  const [edges, setEdges] = useState(initial.edges);
  const [meta, setMeta] = useState(initial.meta);
  const [selectedNodeId, setSelectedNodeId] = useState(initial.nodes[0]?.id ?? null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectionSourceId, setConnectionSourceId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;

  const diagramNodes = useMemo(
    () => nodes.map((node) => ({ ...node, ...nodeSize(node.type) })),
    [nodes]
  );

  const diagramEdges = useMemo(
    () =>
      edges
        .map((edge) => {
          const source = diagramNodes.find((node) => node.id === edge.source);
          const target = diagramNodes.find((node) => node.id === edge.target);
          if (!source || !target) return null;
          return { ...edge, sourceNode: source, targetNode: target };
        })
        .filter(Boolean),
    [edges, diagramNodes]
  );

  useEffect(() => {
    function onPointerMove(event) {
      if (!draggingId || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(24, event.clientX - rect.left - dragOffset.x);
      const y = Math.max(24, event.clientY - rect.top - dragOffset.y);
      setNodes((current) => current.map((node) => (node.id === draggingId ? { ...node, x, y } : node)));
    }

    function onPointerUp() {
      setDraggingId(null);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragOffset, draggingId]);

  function loadTemplate(key) {
    const next = cloneTemplate(key);
    setNodes(next.nodes);
    setEdges(next.edges);
    setMeta(next.meta);
    setSelectedNodeId(next.nodes[0]?.id ?? null);
    setConnectMode(false);
    setConnectionSourceId(null);
  }

  function addNode(type) {
    const definition = nodeCatalog.find((item) => item.type === type);
    const nextId = uid(type);
    const nextNode = {
      id: nextId,
      title: definition.label,
      type,
      x: 160 + nodes.length * 26,
      y: 100 + nodes.length * 18,
      tone: "default",
      note: definition.description,
    };
    setNodes((current) => [...current, nextNode]);
    setSelectedNodeId(nextId);
  }

  function updateNode(patch) {
    if (!selectedNodeId) return;
    setNodes((current) => current.map((node) => (node.id === selectedNodeId ? { ...node, ...patch } : node)));
  }

  function removeSelectedNode() {
    if (!selectedNodeId) return;
    setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
    setEdges((current) => current.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
    setConnectionSourceId(null);
  }

  function handleNodePointerDown(event, node) {
    const rect = event.currentTarget.getBoundingClientRect();
    setDraggingId(node.id);
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  function handleNodeClick(node) {
    setSelectedNodeId(node.id);
    if (!connectMode) return;

    if (!connectionSourceId) {
      setConnectionSourceId(node.id);
      return;
    }

    if (connectionSourceId === node.id) {
      setConnectionSourceId(null);
      return;
    }

    setEdges((current) => [
      ...current,
      { id: uid("edge"), source: connectionSourceId, target: node.id, label: "link" },
    ]);
    setConnectionSourceId(null);
  }

  const stats = [
    { label: "Nodes", value: String(nodes.length).padStart(2, "0") },
    { label: "Links", value: String(edges.length).padStart(2, "0") },
    { label: "Template", value: meta.label },
  ];

  return html`
    <div className="app-shell">
      <aside className="left-rail">
        <div>
          <div className="brand-lockup">
            <div className="brand-mark">DA</div>
            <div>
              <p className="eyebrow">Premium React Workspace</p>
              <h1>Diagram Atelier</h1>
            </div>
          </div>

          <div className="rail-section">
            <span className="section-label">Canvas presets</span>
            <div className="template-list">
              ${Object.entries(templates).map(
                ([key, template]) => html`
                  <button
                    key=${key}
                    className=${`template-button ${meta.key === key ? "is-active" : ""}`}
                    onClick=${() => loadTemplate(key)}
                  >
                    <span>${template.label}</span>
                    <small>${template.summary}</small>
                  </button>
                `
              )}
            </div>
          </div>

          <div className="rail-section">
            <span className="section-label">Add blocks</span>
            <div className="catalog-list">
              ${nodeCatalog.map(
                (item) => html`
                  <button key=${item.type} className="catalog-button" onClick=${() => addNode(item.type)}>
                    <strong>${item.label}</strong>
                    <small>${item.description}</small>
                  </button>
                `
              )}
            </div>
          </div>
        </div>

        <div className="rail-footer">
          <p>${meta.summary}</p>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="topbar-copy">
            <p className="eyebrow">White premium editor</p>
            <h2>Design clean network, flow and architecture diagrams.</h2>
          </div>
          <div className="topbar-actions">
            <button
              className=${`ghost-button ${connectMode ? "is-active" : ""}`}
              onClick=${() => {
                setConnectMode((value) => !value);
                setConnectionSourceId(null);
              }}
            >
              ${connectMode ? "Connecting" : "Connect nodes"}
            </button>
            <button className="primary-button">Share draft</button>
          </div>
        </header>

        <section className="stats-strip">
          ${stats.map(
            (item) => html`
              <div key=${item.label} className="stat-item">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
              </div>
            `
          )}
        </section>

        <section className="canvas-stage" ref=${canvasRef}>
          <div className="canvas-grid"></div>
          <svg className="edge-layer" viewBox="0 0 1200 720" preserveAspectRatio="none">
            <defs>
              <marker id="arrow" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto">
                <path d="M 0 0 L 14 7 L 0 14 z" fill=${palette.lineStrong}></path>
              </marker>
            </defs>
            ${diagramEdges.map(
              (edge) => html`
                <g key=${edge.id}>
                  <path
                    d=${edgePath(edge.sourceNode, edge.targetNode)}
                    fill="none"
                    stroke=${palette.lineStrong}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    markerEnd="url(#arrow)"
                  ></path>
                  <text
                    x=${(edge.sourceNode.x + edge.targetNode.x) / 2 + 18}
                    y=${(edge.sourceNode.y + edge.targetNode.y) / 2}
                    className="edge-label"
                  >
                    ${edge.label}
                  </text>
                </g>
              `
            )}
          </svg>

          ${diagramNodes.map((node) => {
            const tone = toneStyles(node.tone);
            const isSelected = selectedNodeId === node.id;
            const isConnectionSource = connectionSourceId === node.id;

            return html`
              <button
                key=${node.id}
                className=${`diagram-node type-${node.type} ${isSelected ? "is-selected" : ""} ${
                  isConnectionSource ? "is-armed" : ""
                }`}
                style=${{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${node.width}px`,
                  height: `${node.height}px`,
                  background: tone.fill,
                  borderColor: isSelected ? palette.accent : tone.border,
                  boxShadow: isSelected ? "0 24px 52px rgba(79, 124, 255, 0.18)" : tone.shadow,
                }}
                onPointerDown=${(event) => handleNodePointerDown(event, node)}
                onClick=${() => handleNodeClick(node)}
              >
                <span className="node-kicker">${node.type}</span>
                <strong>${node.title}</strong>
                <small>${node.note}</small>
              </button>
            `;
          })}

          <div className="canvas-overlay">
            <div>
              <span className="section-label">Interaction</span>
              <p>
                ${connectMode
                  ? connectionSourceId
                    ? "Select a target node to create the connection."
                    : "Select the first node to begin a connection."
                  : "Drag any block, switch templates, or add new nodes from the left rail."}
              </p>
            </div>
          </div>
        </section>
      </main>

      <aside className="inspector">
        <div className="inspector-panel">
          <span className="section-label">Selection</span>
          ${
            selectedNode
              ? html`
                  <div className="selection-header">
                    <h3>${selectedNode.title}</h3>
                    <p>${selectedNode.type}</p>
                  </div>

                  <label className="field">
                    <span>Title</span>
                    <input value=${selectedNode.title} onInput=${(event) => updateNode({ title: event.target.value })} />
                  </label>

                  <label className="field">
                    <span>Note</span>
                    <textarea rows="4" value=${selectedNode.note} onInput=${(event) => updateNode({ note: event.target.value })}></textarea>
                  </label>

                  <label className="field">
                    <span>Tone</span>
                    <select value=${selectedNode.tone} onChange=${(event) => updateNode({ tone: event.target.value })}>
                      <option value="default">Neutral</option>
                      <option value="accent">Accent</option>
                      <option value="accentSoft">Accent soft</option>
                    </select>
                  </label>

                  <div className="inspector-actions">
                    <button className="ghost-button" onClick=${removeSelectedNode}>Delete node</button>
                  </div>
                `
              : html`<p className="empty-note">Select a node to edit its properties.</p>`
          }
        </div>

        <div className="inspector-panel">
          <span className="section-label">Design notes</span>
          <ul className="note-list">
            <li>Bright editorial whites with quiet blue accents.</li>
            <li>Diagram blocks stay lightweight and spacious.</li>
            <li>Ready to evolve into full export, zoom, and collaboration flows.</li>
          </ul>
        </div>
      </aside>
    </div>
  `;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);
