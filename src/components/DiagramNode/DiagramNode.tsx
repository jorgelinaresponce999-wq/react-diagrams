import type {
  ConnectorSide,
  DiagramNodeData,
  NodeType
} from "../../types/diagram";
import { NodeIcon } from "../NodeIcon/NodeIcon";
import styles from "./DiagramNode.module.scss";

type Props = {
  node: DiagramNodeData;
  selected: boolean;
  onSelect: (id: string) => void;
  onStartDrag: (
    event: React.PointerEvent<HTMLButtonElement>,
    nodeId: string
  ) => void;
  onHandleClick: (nodeId: string, side: ConnectorSide) => void;
};

const sides: ConnectorSide[] = ["top", "right", "bottom", "left"];

export function DiagramNode({
  node,
  selected,
  onSelect,
  onStartDrag,
  onHandleClick
}: Props) {
  return (
    <button
      type="button"
      className={`${styles.node} ${styles[node.type]} ${
        selected ? styles.selected : ""
      }`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.width}px`,
        height: `${node.height}px`,
        backgroundColor: node.style.backgroundColor,
        borderColor: node.style.borderColor
      }}
      data-x={node.x}
      data-y={node.y}
      onPointerDown={(event) => onStartDrag(event, node.id)}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(node.id);
      }}
    >
      {sides.map((side) => (
        <span
          key={side}
          className={`${styles.handle} ${styles[side]}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onHandleClick(node.id, side);
          }}
        />
      ))}

      <span className={styles.iconWrap}>
        <NodeIcon type={node.icon as NodeType} className={styles.icon} />
      </span>
      <strong>{node.label}</strong>
      <small>{node.description}</small>
    </button>
  );
}

