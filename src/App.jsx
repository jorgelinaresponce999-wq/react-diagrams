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
            <a href="#modules">Modulos</a>
            <a href="#signals">Senales</a>
            <a href="#signals">Equipos</a>
          </nav>
        </header>

        <div className="hero-grid">
          <section className="hero-copy">
            <p className="eyebrow">React + Vite premium</p>
            <h1>Una interfaz con presencia de producto real.</h1>
            <p className="lead">
              Ahora la base se ve como una plataforma moderna: mas jerarquia,
              mejor densidad visual y un lenguaje premium con iconos de PC,
              datos y usuarios integrados en la experiencia.
            </p>

            <div className="hero-actions">
              <a className="primary-action" href="#signals">
                Ver experiencia
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
