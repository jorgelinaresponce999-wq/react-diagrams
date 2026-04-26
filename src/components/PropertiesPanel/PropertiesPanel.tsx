import type {
  DiagramConnectionData,
  DiagramNodeData,
  NodeType,
  NodeSizePreset
} from "../../types/diagram";
import { NodeIcon } from "../NodeIcon/NodeIcon";
import styles from "./PropertiesPanel.module.scss";

type Props = {
  selectedNode: DiagramNodeData | null;
  selectedConnection: DiagramConnectionData | null;
  onUpdateNode: (id: string, patch: Partial<DiagramNodeData>) => void;
  onDeleteNode: (id: string) => void;
  onUpdateConnection: (
    id: string,
    patch: Partial<DiagramConnectionData>
  ) => void;
  onDeleteConnection: (id: string) => void;
};

const nodeTypes: NodeType[] = [
  "start-end",
  "process",
  "decision",
  "database",
  "server",
  "client",
  "api",
  "firewall",
  "router",
  "cloud",
  "microservice",
  "user",
  "external-system",
  "queue",
  "container",
  "network-node"
];

export function PropertiesPanel({
  selectedNode,
  selectedConnection,
  onUpdateNode,
  onDeleteNode,
  onUpdateConnection,
  onDeleteConnection
}: Props) {
  return (
    <aside className={styles.panel}>
      <section className={styles.card}>
        <span className={styles.kicker}>Propiedades</span>

        {selectedNode ? (
          <>
            <div className={styles.selectionHead}>
              <NodeIcon type={selectedNode.icon} className={styles.selectionIcon} />
              <div>
                <h3>{selectedNode.label}</h3>
                <p>{selectedNode.type}</p>
              </div>
            </div>

            <label className={styles.field}>
              <span>Texto</span>
              <input
                value={selectedNode.label}
                onChange={(event) =>
                  onUpdateNode(selectedNode.id, { label: event.target.value })
                }
              />
            </label>

            <label className={styles.field}>
              <span>Descripcion</span>
              <textarea
                rows={4}
                value={selectedNode.description}
                onChange={(event) =>
                  onUpdateNode(selectedNode.id, {
                    description: event.target.value
                  })
                }
              />
            </label>

            <label className={styles.field}>
              <span>Tipo de componente</span>
              <select
                value={selectedNode.type}
                onChange={(event) =>
                  onUpdateNode(selectedNode.id, {
                    type: event.target.value as NodeType
                  })
                }
              >
                {nodeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Icono</span>
              <select
                value={selectedNode.icon}
                onChange={(event) =>
                  onUpdateNode(selectedNode.id, {
                    icon: event.target.value as NodeType
                  })
                }
              >
                {nodeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Tamano</span>
              <select
                value={selectedNode.sizePreset}
                onChange={(event) =>
                  onUpdateNode(selectedNode.id, {
                    sizePreset: event.target.value as NodeSizePreset
                  })
                }
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </label>

            <div className={styles.colorGrid}>
              <label className={styles.field}>
                <span>Fondo</span>
                <input
                  type="color"
                  value={selectedNode.style.backgroundColor}
                  onChange={(event) =>
                    onUpdateNode(selectedNode.id, {
                      style: {
                        ...selectedNode.style,
                        backgroundColor: event.target.value
                      }
                    })
                  }
                />
              </label>
              <label className={styles.field}>
                <span>Borde</span>
                <input
                  type="color"
                  value={selectedNode.style.borderColor}
                  onChange={(event) =>
                    onUpdateNode(selectedNode.id, {
                      style: {
                        ...selectedNode.style,
                        borderColor: event.target.value
                      }
                    })
                  }
                />
              </label>
            </div>

            <button
              className={styles.dangerButton}
              onClick={() => onDeleteNode(selectedNode.id)}
            >
              Eliminar componente
            </button>
          </>
        ) : selectedConnection ? (
          <>
            <div className={styles.selectionHead}>
              <div className={styles.connectionSwatch} />
              <div>
                <h3>{selectedConnection.label || "Conexion"}</h3>
                <p>Connection</p>
              </div>
            </div>

            <label className={styles.field}>
              <span>Texto de la relacion</span>
              <input
                value={selectedConnection.label}
                onChange={(event) =>
                  onUpdateConnection(selectedConnection.id, {
                    label: event.target.value
                  })
                }
              />
            </label>

            <label className={styles.field}>
              <span>Tipo de linea</span>
              <select
                value={selectedConnection.lineStyle}
                onChange={(event) =>
                  onUpdateConnection(selectedConnection.id, {
                    lineStyle: event.target.value as DiagramConnectionData["lineStyle"]
                  })
                }
              >
                <option value="straight">Recta</option>
                <option value="curved">Curva</option>
                <option value="orthogonal">Con codos</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Direccion</span>
              <select
                value={selectedConnection.direction}
                onChange={(event) =>
                  onUpdateConnection(selectedConnection.id, {
                    direction: event.target.value as DiagramConnectionData["direction"]
                  })
                }
              >
                <option value="single">Un solo sentido</option>
                <option value="double">Doble sentido</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Color</span>
              <input
                type="color"
                value={selectedConnection.color}
                onChange={(event) =>
                  onUpdateConnection(selectedConnection.id, {
                    color: event.target.value
                  })
                }
              />
            </label>

            <label className={styles.field}>
              <span>Grosor</span>
              <input
                type="range"
                min="1"
                max="6"
                value={selectedConnection.strokeWidth}
                onChange={(event) =>
                  onUpdateConnection(selectedConnection.id, {
                    strokeWidth: Number(event.target.value)
                  })
                }
              />
            </label>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={selectedConnection.dashed}
                onChange={(event) =>
                  onUpdateConnection(selectedConnection.id, {
                    dashed: event.target.checked
                  })
                }
              />
              <span>Linea punteada</span>
            </label>

            <button
              className={styles.dangerButton}
              onClick={() => onDeleteConnection(selectedConnection.id)}
            >
              Eliminar conexion
            </button>
          </>
        ) : (
          <p className={styles.emptyCopy}>
            Selecciona un componente o una conexion para editar sus propiedades.
          </p>
        )}
      </section>
    </aside>
  );
}

