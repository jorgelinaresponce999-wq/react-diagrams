import { useMemo, useState } from "react";

const pillars = [
  {
    title: "Workspace unificado",
    description:
      "Un tablero limpio para operaciones, clientes y rendimiento con jerarquia visual clara.",
    icon: MonitorIcon
  },
  {
    title: "Datos conectados",
    description:
      "Estado de base de datos, sincronizacion y trazabilidad listos para una experiencia de producto seria.",
    icon: DatabaseIcon
  },
  {
    title: "Equipos y permisos",
    description:
      "Usuarios, roles y colaboracion presentados como una plataforma premium, no como un demo generico.",
    icon: UsersIcon
  }
];

const metrics = [
  { value: "99.98%", label: "uptime operativo" },
  { value: "24 ms", label: "latencia media" },
  { value: "1.2k", label: "usuarios activos" }
];

const modules = [
  "Infraestructura",
  "Clientes",
  "Permisos",
  "Facturacion",
  "Analitica",
  "Automatizaciones"
];

const workspaceStats = [
  { value: "128", label: "tickets activos", trend: "+12%" },
  { value: "86%", label: "automatizacion", trend: "+4%" },
  { value: "14", label: "alertas criticas", trend: "-8%" }
];

const pipelines = [
  { name: "Provisioning cloud", status: "Live", owner: "Infra", progress: 82 },
  { name: "Replica de datos", status: "Stable", owner: "Data", progress: 64 },
  { name: "Accesos enterprise", status: "Review", owner: "IAM", progress: 48 }
];

const activity = [
  "Database cluster sincronizado hace 2 min",
  "Nuevo usuario admin aprobado por seguridad",
  "Pipeline de facturacion desplegado en staging"
];

const navigationItems = [
  "Overview",
  "Infraestructura",
  "Base de datos",
  "Usuarios",
  "Seguridad"
];

const sectionDetails = {
  Overview: {
    title: "Centro operativo en tiempo real",
    description:
      "Monitorea flujos, salud del sistema y actividad reciente desde un solo tablero."
  },
  Infraestructura: {
    title: "Infraestructura y despliegues",
    description:
      "Sigue pipelines de cloud, estado de entornos y capacidad operativa."
  },
  "Base de datos": {
    title: "Estado de datos y replicas",
    description:
      "Controla sincronizacion, almacenamiento y trazabilidad de la capa de datos."
  },
  Usuarios: {
    title: "Accesos, roles y actividad",
    description:
      "Gestiona usuarios activos, permisos y aprobaciones de sesiones sensibles."
  },
  Seguridad: {
    title: "Alertas y proteccion",
    description:
      "Revisa aprobaciones, eventos recientes y focos de riesgo del sistema."
  }
};

function MonitorIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="10" y="12" width="44" height="29" rx="6" />
      <path d="M22 50h20" />
      <path d="M28 41v9" />
      <path d="M36 41v9" />
      <path d="M17 21h30" />
      <path d="M17 27h18" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="16" rx="18" ry="7" />
      <path d="M14 16v12c0 3.9 8.1 7 18 7s18-3.1 18-7V16" />
      <path d="M14 28v12c0 3.9 8.1 7 18 7s18-3.1 18-7V28" />
      <path d="M14 40v8c0 3.9 8.1 7 18 7s18-3.1 18-7v-8" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="24" cy="23" r="7" />
      <circle cx="42" cy="21" r="5" />
      <path d="M12 47c2.5-7.3 8-11 16-11s13.5 3.7 16 11" />
      <path d="M40 45c1.7-4.7 5.4-7.1 11-7.1 1.1 0 2.1.1 3 .3" />
    </svg>
  );
}

function SignalGrid() {
  return (
    <div className="signal-grid" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("Overview");
  const [showFlowComposer, setShowFlowComposer] = useState(false);
  const [draftCount, setDraftCount] = useState(3);
  const activeContent = useMemo(
    () => sectionDetails[activeSection],
    [activeSection]
  );

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark">N</div>
            <div>
              <p>Nova Control</p>
              <span>Premium platform interface</span>
            </div>
          </div>

          <nav className="topnav" aria-label="Principal">
            <a href="#workspace">Tablero</a>
            <a href="#signals">Senales</a>
            <a href="#modules">Modulos</a>
          </nav>
        </header>

        <div className="hero-grid">
          <section className="hero-copy">
            <p className="eyebrow">React + Vite premium</p>
            <h1>Una interfaz con presencia de producto real.</h1>
            <p className="lead">
              Ahora la base no solo tiene portada: incluye una superficie de
              trabajo clara, con modulos, panel operativo y lenguaje visual
              premium con iconos de PC, datos y usuarios.
            </p>

            <div className="hero-actions">
              <a className="primary-action" href="#workspace">
                Abrir tablero
              </a>
              <a className="secondary-action" href="#modules">
                Explorar modulos
              </a>
            </div>

            <div className="metric-row" aria-label="Metricas principales">
              {metrics.map((item) => (
                <article key={item.label} className="metric-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="hero-visual" aria-label="Vista previa del sistema">
            <div className="visual-frame">
              <div className="frame-top">
                <span className="status-dot" />
                <span className="status-dot" />
                <span className="status-dot" />
                <p>Control center</p>
              </div>

              <div className="frame-body">
                <aside className="rail">
                  <div className="rail-chip active">Overview</div>
                  <div className="rail-chip">Systems</div>
                  <div className="rail-chip">Users</div>
                  <div className="rail-chip">Storage</div>
                </aside>

                <div className="workspace-preview">
                  <div className="preview-card emphasis">
                    <div className="preview-heading">
                      <MonitorIcon />
                      <div>
                        <h2>Desktop orchestration</h2>
                        <p>Estado estable del centro operativo</p>
                      </div>
                    </div>
                    <div className="preview-bars">
                      <span style={{ width: "78%" }} />
                      <span style={{ width: "54%" }} />
                      <span style={{ width: "66%" }} />
                    </div>
                  </div>

                  <div className="preview-split">
                    <article className="preview-card">
                      <div className="preview-heading compact">
                        <DatabaseIcon />
                        <div>
                          <h2>Data fabric</h2>
                          <p>12 servicios sincronizados</p>
                        </div>
                      </div>
                      <SignalGrid />
                    </article>

                    <article className="preview-card">
                      <div className="preview-heading compact">
                        <UsersIcon />
                        <div>
                          <h2>Team access</h2>
                          <p>Roles, sesiones y actividad</p>
                        </div>
                      </div>
                      <div className="avatar-stack" aria-hidden="true">
                        <span>A</span>
                        <span>M</span>
                        <span>J</span>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="workspace-panel" id="workspace">
        <div className="workspace-header">
          <div>
            <p className="eyebrow">Tablero de trabajo</p>
            <h2>{activeContent.title}</h2>
            <p className="workspace-copy">{activeContent.description}</p>
          </div>
          <div className="workspace-actions">
            <button
              type="button"
              className="ghost-action"
              onClick={() => setActiveSection("Overview")}
            >
              Exportar
            </button>
            <button
              type="button"
              className="solid-action"
              onClick={() => {
                setShowFlowComposer((current) => !current);
                setDraftCount((current) => current + 1);
              }}
            >
              Nuevo flujo
            </button>
          </div>
        </div>

        <div className="workspace-layout">
          <aside className="workspace-sidebar">
            <div className="sidebar-block">
              <span className="sidebar-label">Navegacion</span>
              {navigationItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`sidebar-item ${
                    activeSection === item ? "active" : ""
                  }`}
                  onClick={() => setActiveSection(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="sidebar-block">
              <span className="sidebar-label">Salud del sistema</span>
              <div className="status-stack">
                <div className="status-card ok">
                  <strong>Cloud</strong>
                  <span>Operando normal</span>
                </div>
                <div className="status-card warn">
                  <strong>Data</strong>
                  <span>Replica con latencia</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="workspace-main">
            {showFlowComposer ? (
              <section className="composer-card" aria-label="Nuevo flujo">
                <div className="board-head">
                  <div>
                    <p className="board-label">Nuevo flujo</p>
                    <h3>Flow draft #{draftCount}</h3>
                  </div>
                  <span className="board-chip">Draft</span>
                </div>
                <div className="composer-grid">
                  <article className="composer-step">
                    <strong>1. Selecciona modulo</strong>
                    <span>{activeSection}</span>
                  </article>
                  <article className="composer-step">
                    <strong>2. Define responsables</strong>
                    <span>Infra · Data · Security</span>
                  </article>
                  <article className="composer-step">
                    <strong>3. Estado inicial</strong>
                    <span>Listo para aprobacion</span>
                  </article>
                </div>
              </section>
            ) : null}

            <div className="workspace-kpis">
              {workspaceStats.map((item) => (
                <article key={item.label} className="kpi-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <small>{item.trend} vs ayer</small>
                </article>
              ))}
            </div>

            <div className="workspace-grid">
              <section className="board-card board-card-large">
                <div className="board-head">
                  <div>
                    <p className="board-label">{activeSection}</p>
                    <h3>
                      {activeSection === "Overview"
                        ? "Flujos prioritarios"
                        : `Vista de ${activeSection}`}
                    </h3>
                  </div>
                  <span className="board-chip">Live sync</span>
                </div>

                <div className="pipeline-list">
                  {pipelines.map((item) => (
                    <article key={item.name} className="pipeline-row">
                      <div className="pipeline-copy">
                        <strong>{item.name}</strong>
                        <span>
                          {item.owner} · {item.status}
                        </span>
                      </div>
                      <div className="progress-wrap" aria-label={item.name}>
                        <div className="progress-track">
                          <span style={{ width: `${item.progress}%` }} />
                        </div>
                        <small>{item.progress}%</small>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="board-card">
                <div className="board-head">
                  <div>
                    <p className="board-label">Accesos</p>
                    <h3>Usuarios activos</h3>
                  </div>
                  <UsersIcon />
                </div>
                <div className="user-cluster" aria-hidden="true">
                  <span>AL</span>
                  <span>MR</span>
                  <span>JP</span>
                  <span>DV</span>
                </div>
                <p className="board-note">
                  {activeSection === "Usuarios"
                    ? "La navegacion ya cambia esta vista y prioriza accesos, sesiones y responsables."
                    : "Roles auditados, sesiones activas y permisos listos para aprobacion."}
                </p>
              </section>

              <section className="board-card">
                <div className="board-head">
                  <div>
                    <p className="board-label">Storage</p>
                    <h3>Estado de datos</h3>
                  </div>
                  <DatabaseIcon />
                </div>
                <div className="storage-bars" aria-hidden="true">
                  <span style={{ height: "74%" }} />
                  <span style={{ height: "48%" }} />
                  <span style={{ height: "82%" }} />
                  <span style={{ height: "61%" }} />
                  <span style={{ height: "69%" }} />
                </div>
                <p className="board-note">
                  {activeSection === "Base de datos"
                    ? "Esta vista queda enfocada en replicas, snapshots y consumo de storage."
                    : "Replicacion, snapshots y consumo en una sola superficie."}
                </p>
              </section>

              <section className="board-card board-card-wide">
                <div className="board-head">
                  <div>
                    <p className="board-label">Actividad</p>
                    <h3>Eventos recientes</h3>
                  </div>
                  <MonitorIcon />
                </div>
                <ul className="activity-list">
                  {activity.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="pillars" id="signals" aria-label="Capacidades">
        {pillars.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="pillar">
              <div className="pillar-icon">
                <Icon />
              </div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="module-band" id="modules">
        <div className="section-intro">
          <p className="eyebrow">Modulos listos para crecer</p>
          <h2>Una base visual que ya parece un SaaS premium.</h2>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <article key={module} className="module-card">
              <span className="module-dot" />
              <p>{module}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
