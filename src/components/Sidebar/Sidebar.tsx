import type { DiagramKind, NodeType } from "../../types/diagram";
import { NodeIcon } from "../NodeIcon/NodeIcon";
import styles from "./Sidebar.module.scss";

type LibraryItem = {
  type: NodeType;
  label: string;
  note: string;
};

const items: LibraryItem[] = [
  { type: "start-end", label: "Inicio / Fin", note: "Entradas y cierres" },
  { type: "process", label: "Proceso", note: "Paso del flujo" },
  { type: "decision", label: "Decision", note: "Condicion o branch" },
  { type: "database", label: "Base de datos", note: "Persistencia" },
  { type: "server", label: "Servidor", note: "Infraestructura" },
  { type: "client", label: "Cliente", note: "Frontend o consumidor" },
  { type: "api", label: "API", note: "Punto de integracion" },
  { type: "firewall", label: "Firewall", note: "Seguridad" },
  { type: "router", label: "Router", note: "Ruteo" },
  { type: "cloud", label: "Cloud", note: "Infra cloud" },
  { type: "microservice", label: "Microservicio", note: "Servicio desacoplado" },
  { type: "user", label: "Usuario", note: "Actor humano" },
  { type: "external-system", label: "Sistema externo", note: "Dependencia externa" },
  { type: "queue", label: "Queue", note: "Mensajeria" },
  { type: "container", label: "Contenedor", note: "Encapsulado" },
  { type: "network-node", label: "Nodo de red", note: "Punto de conexion" }
];

type Props = {
  kind: DiagramKind;
  onAddNode: (type: NodeType) => void;
};

export function Sidebar({ kind, onAddNode }: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <p className={styles.kicker}>Biblioteca</p>
        <h2>Componentes</h2>
        <span>Arrastra o agrega al canvas</span>
      </div>

      <div className={styles.kindBadge}>{kind}</div>

      <div className={styles.list}>
        {items.map((item) => (
          <button
            key={item.type}
            className={styles.libraryItem}
            draggable
            onDragStart={(event) =>
              event.dataTransfer.setData("application/node-type", item.type)
            }
            onClick={() => onAddNode(item.type)}
          >
            <NodeIcon type={item.type} className={styles.icon} />
            <div>
              <strong>{item.label}</strong>
              <span>{item.note}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

