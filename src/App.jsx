import { useMemo, useRef, useState } from "react";

const templates = {
  network: {
    label: "Network",
    description: "Topologia de red con entrada, servicios y almacenamiento.",
    nodes: [
      { id: "gateway", title: "Gateway", type: "network", x: 80, y: 110, tone: "accent", note: "Entrada publica" },
      { id: "firewall", title: "Firewall", type: "service", x: 290, y: 110, tone: "default", note: "Inspeccion" },
      { id: "api", title: "API Cluster", type: "compute", x: 540, y: 70, tone: "default", note: "Servicios core" },
      { id: "cache", title: "Redis Cache", type: "database", x: 540, y: 230, tone: "default", note: "Lectura rapida" },
      { id: "db", title: "Primary DB", type: "database", x: 840, y: 150, tone: "accentSoft", note: "Datos transaccionales" }
    ],
    edges: [
      { id: "e1", source: "gateway", target: "firewall", label: "HTTPS" },
      { id: "e2", source: "firewall", target: "api", label: "gRPC" },
      { id: "e3", source: "api", target: "cache", label: "cache" },
      { id: "e4", source: "api", target: "db", label: "SQL" }
    ]
  },
  flow: {
    label: "Flow",
    description: "Secuencia con validacion, decision y rutas de salida.",
    nodes: [
      { id: "start", title: "Request", type: "pill", x: 90, y: 160, tone: "accent", note: "Inicio" },
      { id: "validate", title: "Validate", type: "compute", x: 300, y: 140, tone: "default", note: "Reglas y permisos" },
      { id: "decision", title: "Approved?", type: "decision", x: 550, y: 120, tone: "default", note: "Branch" },
      { id: "success", title: "Complete", type: "pill", x: 840, y: 70, tone: "accentSoft", note: "Exito" },
      { id: "retry", title: "Retry", type: "service", x: 820, y: 250, tone: "default", note: "Fallback" }
    ],
    edges: [
      { id: "f1", source: "start", target: "validate", label: "submit" },
      { id: "f2", source: "validate", target: "decision", label: "rules" },
      { id: "f3", source: "decision", target: "success", label: "yes" },
      { id: "f4", source: "decision", target: "retry", label: "no" }
    ]
  },
  architecture: {
    label: "Architecture",
    description: "Capas de cliente, edge, orquestacion y datos.",
    nodes: [
      { id: "client", title: "Client App", type: "compute", x: 90, y: 80, tone: "accent", note: "Web y mobile" },
      { id: "edge", title: "Edge Layer", type: "network", x: 90, y: 250, tone: "default", note: "CDN y auth" },
      { id: "core", title: "Orchestrator", type: "service", x: 410, y: 160, tone: "default", note: "Workflows" },
      { id: "events", title: "Event Bus", type: "service", x: 760, y: 80, tone: "default", note: "Eventos async" },
      { id: "warehouse", title: "Warehouse", type: "database", x: 760, y: 260, tone: "accentSoft", note: "BI" }
    ],
    edges: [
      { id: "a1", source: "client", target: "core", label: "requests" },
      { id: "a2", source: "edge", target: "core", label: "trusted" },
      { id: "a3", source: "core", target: "events", label: "publish" },
      { id: "a4", source: "core", target: "warehouse", label: "persist" }
    ]
  }
};

const nodeCatalog = [
  { type: "compute", label: "Process", note: "Servicio o pantalla principal" },
  { type: "service", label: "Service", note: "Modulo o capability" },
  { type: "database", label: "Database", note: "Persistencia estructurada" },
  { type: "network", label: "Network", note: "Gateway o capa edge" },
  { type: "decision", label: "Decision", note: "Branch condicional" },
  { type: "pill", label: "Start / End", note: "Inicio o cierre" }
];

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneTemplate(key) {
  const template = templates[key];
  return {
    meta: {
      key,
      label: template.label,
      description: template.description
    },
    nodes: template.nodes.map((node) => ({ ...node })),
    edges: template.edges.map((edge) => ({ ...edge }))
  };
}

function getNodeSize(type) {
  if (type === "pill") {
    return { width: 150, height: 58 };
  }
  if (type === "decision") {
    return { width: 126, height: 126 };
  }
  if (type === "database") {
    return { width: 172, height: 92 };
  }
  if (type === "network") {
    return { width: 170, height: 78 };
  }
  return { width: 182, height: 88 };
}

function edgePath(source, target) {
  const startX = source.x + source.width;
  const startY = source.y + source.height / 2;
  const endX = target.x;
  const endY = target.y + target.height / 2;
  const midX = startX + (endX - startX) / 2;
  return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
}

function toneClass(tone) {
  if (tone === "accent") {
    return "tone-accent";
  }
  if (tone === "accentSoft") {
    return "tone-soft";
  }
  return "tone-default";
}

export default function App() {
  const initial = useMemo(() => cloneTemplate("architecture"), []);
  const [meta, setMeta] = useState(initial.meta);
  const [nodes, setNodes] = useState(initial.nodes);
  const [edges, setEdges] = useState(initial.edges);
  const [selectedNodeId, setSelectedNodeId] = useState(initial.nodes[0]?.id ?? null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectionSourceId, setConnectionSourceId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const diagramNodes = useMemo(
    () => nodes.map((node) => ({ ...node, ...getNodeSize(node.type) })),
    [nodes]
  );

  const diagramEdges = useMemo(
    () =>
      edges
        .map((edge) => {
          const source = diagramNodes.find((node) => node.id === edge.source);
          const target = diagramNodes.find((node) => node.id === edge.target);
          if (!source || !target) {
            return null;
          }
          return { ...edge, sourceNode: source, targetNode: target };
        })
        .filter(Boolean),
    [diagramNodes, edges]
  );

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;

  function loadTemplate(key) {
    const next = cloneTemplate(key);
    setMeta(next.meta);
    setNodes(next.nodes);
    setEdges(next.edges);
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
      x: 140 + nodes.length * 24,
      y: 110 + nodes.length * 20,
      tone: "default",
      note: definition.note
    };

    setNodes((current) => [...current, nextNode]);
    setSelectedNodeId(nextId);
  }

  function updateSelectedNode(patch) {
    if (!selectedNodeId) {
      return;
    }
    setNodes((current) =>
      current.map((node) =>
        node.id === selectedNodeId ? { ...node, ...patch } : node
      )
    );
  }

  function removeSelectedNode() {
    if (!selectedNodeId) {
      return;
    }
    setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
    setEdges((current) =>
      current.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId
      )
    );
    setSelectedNodeId(null);
    setConnectionSourceId(null);
  }

  function startDrag(event, node) {
    const rect = event.currentTarget.getBoundingClientRect();
    setDraggingId(node.id);
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }

  function handleCanvasPointerMove(event) {
    if (!draggingId || !canvasRef.current) {
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const nextX = Math.max(24, event.clientX - rect.left - dragOffset.x);
    const nextY = Math.max(24, event.clientY - rect.top - dragOffset.y);
    setNodes((current) =>
      current.map((node) =>
        node.id === draggingId ? { ...node, x: nextX, y: nextY } : node
      )
    );
  }

  function handleCanvasPointerUp() {
    setDraggingId(null);
  }

  function handleNodeClick(nodeId) {
    setSelectedNodeId(nodeId);
    if (!connectMode) {
      return;
    }

    if (!connectionSourceId) {
      setConnectionSourceId(nodeId);
      return;
    }

    if (connectionSourceId === nodeId) {
      setConnectionSourceId(null);
      return;
    }

    setEdges((current) => [
      ...current,
      { id: uid("edge"), source: connectionSourceId, target: nodeId, label: "link" }
    ]);
    setConnectionSourceId(null);
  }

  return (
    <main className="diagram-app">
      <aside className="left-panel">
        <div>
          <div className="brand-lockup">
            <div className="brand-mark">AD</div>
            <div>
              <p className="eyebrow">Premium diagram editor</p>
              <h1>app.diagrams</h1>
            </div>
          </div>

          <section className="panel-group">
            <span className="panel-label">Templates</span>
            <div className="template-list">
              {Object.entries(templates).map(([key, template]) => (
                <button
                  key={key}
                  type="button"
                  className={`template-button ${
                    meta.key === key ? "active" : ""
                  }`}
                  onClick={() => loadTemplate(key)}
                >
                  <strong>{template.label}</strong>
                  <span>{template.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel-group">
            <span className="panel-label">Add blocks</span>
            <div className="catalog-list">
              {nodeCatalog.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  className="catalog-button"
                  onClick={() => addNode(item.type)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.note}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="panel-footer">
          <p>{meta.description}</p>
        </div>
      </aside>

      <section className="workspace-shell">
        <header className="workspace-topbar">
          <div>
            <p className="eyebrow">Canvas</p>
            <h2>{meta.label} diagram</h2>
          </div>
          <div className="topbar-actions">
            <button
              type="button"
              className={`ghost-button ${connectMode ? "active" : ""}`}
              onClick={() => {
                setConnectMode((current) => !current);
                setConnectionSourceId(null);
              }}
            >
              {connectMode ? "Conectando" : "Conectar nodos"}
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => addNode("compute")}
            >
              Nuevo bloque
            </button>
          </div>
        </header>

        <section className="stats-strip">
          <article className="stat-card">
            <span>Nodos</span>
            <strong>{nodes.length}</strong>
          </article>
          <article className="stat-card">
            <span>Conexiones</span>
            <strong>{edges.length}</strong>
          </article>
          <article className="stat-card">
            <span>Seleccion</span>
            <strong>{selectedNode?.title ?? "None"}</strong>
          </article>
        </section>

        <section
          ref={canvasRef}
          className="canvas-shell"
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
        >
          <div className="canvas-grid" />

          <svg className="edge-layer" viewBox="0 0 1200 720" preserveAspectRatio="none">
            <defs>
              <marker
                id="arrow"
                markerWidth="12"
                markerHeight="12"
                refX="10"
                refY="6"
                orient="auto"
              >
                <path d="M 0 0 L 12 6 L 0 12 z" fill="#93aef7" />
              </marker>
            </defs>
            {diagramEdges.map((edge) => (
              <g key={edge.id}>
                <path
                  d={edgePath(edge.sourceNode, edge.targetNode)}
                  fill="none"
                  stroke="#93aef7"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(edge.sourceNode.x + edge.targetNode.x) / 2 + 16}
                  y={(edge.sourceNode.y + edge.targetNode.y) / 2}
                  className="edge-label"
                >
                  {edge.label}
                </text>
              </g>
            ))}
          </svg>

          {diagramNodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className={`diagram-node type-${node.type} ${toneClass(
                node.tone
              )} ${selectedNodeId === node.id ? "selected" : ""} ${
                connectionSourceId === node.id ? "armed" : ""
              }`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${node.width}px`,
                height: `${node.height}px`
              }}
              onPointerDown={(event) => startDrag(event, node)}
              onClick={() => handleNodeClick(node.id)}
            >
              <span className="node-kicker">{node.type}</span>
              <strong>{node.title}</strong>
              <small>{node.note}</small>
            </button>
          ))}

          <div className="canvas-hint">
            <span>Hint</span>
            <p>
              {connectMode
                ? connectionSourceId
                  ? "Selecciona un nodo destino para crear la conexion."
                  : "Selecciona el primer nodo para empezar una conexion."
                : "Arrastra nodos, cambia template y edita propiedades desde el panel derecho."}
            </p>
          </div>
        </section>
      </section>

      <aside className="right-panel">
        <section className="inspector-card">
          <span className="panel-label">Inspector</span>
          {selectedNode ? (
            <>
              <div className="selection-head">
                <h3>{selectedNode.title}</h3>
                <p>{selectedNode.type}</p>
              </div>

              <label className="field">
                <span>Titulo</span>
                <input
                  value={selectedNode.title}
                  onChange={(event) =>
                    updateSelectedNode({ title: event.target.value })
                  }
                />
              </label>

              <label className="field">
                <span>Nota</span>
                <textarea
                  rows="4"
                  value={selectedNode.note}
                  onChange={(event) =>
                    updateSelectedNode({ note: event.target.value })
                  }
                />
              </label>

              <label className="field">
                <span>Tono</span>
                <select
                  value={selectedNode.tone}
                  onChange={(event) =>
                    updateSelectedNode({ tone: event.target.value })
                  }
                >
                  <option value="default">Neutral</option>
                  <option value="accent">Accent</option>
                  <option value="accentSoft">Soft</option>
                </select>
              </label>

              <button
                type="button"
                className="danger-button"
                onClick={removeSelectedNode}
              >
                Eliminar nodo
              </button>
            </>
          ) : (
            <p className="empty-copy">
              Selecciona un nodo para editarlo o crea uno nuevo desde la izquierda.
            </p>
          )}
        </section>

        <section className="inspector-card">
          <span className="panel-label">Canvas state</span>
          <div className="mini-stats">
            <article>
              <strong>{meta.label}</strong>
              <span>Template activo</span>
            </article>
            <article>
              <strong>{connectMode ? "On" : "Off"}</strong>
              <span>Modo conexiones</span>
            </article>
            <article>
              <strong>{selectedNode ? "1" : "0"}</strong>
              <span>Nodo seleccionado</span>
            </article>
          </div>
        </section>
      </aside>
    </main>
  );
}
