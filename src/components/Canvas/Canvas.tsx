import type {
  ConnectorSide,
  DiagramConnectionData,
  DiagramNodeData,
  Selection
} from "../../types/diagram";
import { ConnectionLine } from "../ConnectionLine/ConnectionLine";
import { DiagramNode } from "../DiagramNode/DiagramNode";
import styles from "./Canvas.module.scss";

type Props = {
  nodes: DiagramNodeData[];
  connections: DiagramConnectionData[];
  selection: Selection;
  viewport: { x: number; y: number; zoom: number };
  showGrid: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onCanvasPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  onCanvasPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onCanvasPointerUp: () => void;
  onWheel: (event: React.WheelEvent<HTMLDivElement>) => void;
  onDropLibraryItem: (event: React.DragEvent<HTMLDivElement>) => void;
  onSelectNode: (id: string) => void;
  onSelectConnection: (id: string) => void;
  onStartNodeDrag: (
    event: React.PointerEvent<HTMLButtonElement>,
    nodeId: string
  ) => void;
  onHandleClick: (nodeId: string, side: ConnectorSide) => void;
};

export function Canvas({
  nodes,
  connections,
  selection,
  viewport,
  showGrid,
  containerRef,
  onCanvasPointerDown,
  onCanvasPointerMove,
  onCanvasPointerUp,
  onWheel,
  onDropLibraryItem,
  onSelectNode,
  onSelectConnection,
  onStartNodeDrag,
  onHandleClick
}: Props) {
  return (
    <div
      ref={containerRef}
      className={styles.canvas}
      onPointerDown={onCanvasPointerDown}
      onPointerMove={onCanvasPointerMove}
      onPointerUp={onCanvasPointerUp}
      onWheel={onWheel}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDropLibraryItem}
    >
      {showGrid ? <div className={styles.grid} /> : null}

      <div
        className={styles.viewport}
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
        }}
      >
        <svg className={styles.connections} viewBox="0 0 1600 1200">
          <defs>
            <marker
              id="arrow-end"
              markerWidth="12"
              markerHeight="12"
              refX="10"
              refY="6"
              orient="auto"
            >
              <path d="M 0 0 L 12 6 L 0 12 z" fill="#93aef7" />
            </marker>
            <marker
              id="arrow-start"
              markerWidth="12"
              markerHeight="12"
              refX="2"
              refY="6"
              orient="auto-start-reverse"
            >
              <path d="M 12 0 L 0 6 L 12 12 z" fill="#93aef7" />
            </marker>
          </defs>
          {connections.map((connection) => (
            <ConnectionLine
              key={connection.id}
              connection={connection}
              nodes={nodes}
              selected={
                selection?.type === "connection" && selection.id === connection.id
              }
              onSelect={onSelectConnection}
            />
          ))}
        </svg>

        {nodes.map((node) => (
          <DiagramNode
            key={node.id}
            node={node}
            selected={selection?.type === "node" && selection.id === node.id}
            onSelect={onSelectNode}
            onStartDrag={onStartNodeDrag}
            onHandleClick={onHandleClick}
          />
        ))}
      </div>
    </div>
  );
}
