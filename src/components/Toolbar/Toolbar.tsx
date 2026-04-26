import type { DiagramKind } from "../../types/diagram";
import styles from "./Toolbar.module.scss";

type Props = {
  name: string;
  kind: DiagramKind;
  canUndo: boolean;
  canRedo: boolean;
  showGrid: boolean;
  zoom: number;
  onNameChange: (value: string) => void;
  onKindChange: (kind: DiagramKind) => void;
  onNewDiagram: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onExportSvg: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleGrid: () => void;
};

export function Toolbar({
  name,
  kind,
  canUndo,
  canRedo,
  showGrid,
  zoom,
  onNameChange,
  onKindChange,
  onNewDiagram,
  onSave,
  onLoad,
  onExportJson,
  onImportJson,
  onExportSvg,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleGrid
}: Props) {
  return (
    <header className={styles.toolbar}>
      <div className={styles.identity}>
        <div className={styles.brandMark}>AD</div>
        <div className={styles.naming}>
          <input
            className={styles.nameInput}
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
          />
          <p className={styles.subtitle}>Editor visual de diagramas</p>
        </div>
      </div>

      <div className={styles.controls}>
        <select
          value={kind}
          className={styles.select}
          onChange={(event) => onKindChange(event.target.value as DiagramKind)}
        >
          <option value="flow">Flow</option>
          <option value="network">Network</option>
          <option value="architecture">Architecture</option>
          <option value="sequence">Sequence</option>
          <option value="systems">Systems</option>
        </select>

        <div className={styles.group}>
          <button onClick={onNewDiagram}>Nuevo</button>
          <button onClick={onSave}>Guardar</button>
          <button onClick={onLoad}>Cargar</button>
        </div>

        <div className={styles.group}>
          <button onClick={onExportJson}>Exportar JSON</button>
          <button onClick={onImportJson}>Importar JSON</button>
          <button onClick={onExportSvg}>Exportar SVG</button>
        </div>

        <div className={styles.group}>
          <button onClick={onUndo} disabled={!canUndo}>
            Deshacer
          </button>
          <button onClick={onRedo} disabled={!canRedo}>
            Rehacer
          </button>
        </div>

        <div className={styles.group}>
          <button onClick={onZoomOut}>-</button>
          <button onClick={onResetView}>{Math.round(zoom * 100)}%</button>
          <button onClick={onZoomIn}>+</button>
        </div>

        <button
          className={showGrid ? styles.activeButton : styles.toggleButton}
          onClick={onToggleGrid}
        >
          Grilla
        </button>
      </div>
    </header>
  );
}
