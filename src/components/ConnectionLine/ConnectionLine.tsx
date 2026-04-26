import type { DiagramConnectionData, DiagramNodeData } from "../../types/diagram";
import { getConnectionPathData } from "../../utils/geometry";

type Props = {
  connection: DiagramConnectionData;
  nodes: DiagramNodeData[];
  selected: boolean;
  onSelect: (id: string) => void;
};

export function ConnectionLine({
  connection,
  nodes,
  selected,
  onSelect
}: Props) {
  const data = getConnectionPathData(connection, nodes);

  if (!data) {
    return null;
  }

  return (
    <g>
      <path
        d={data.path}
        fill="none"
        stroke={connection.color}
        strokeWidth={selected ? connection.strokeWidth + 1 : connection.strokeWidth}
        strokeLinecap="round"
        strokeDasharray={connection.dashed ? "8 8" : undefined}
        markerStart={connection.direction === "double" ? "url(#arrow-start)" : undefined}
        markerEnd="url(#arrow-end)"
        onClick={(event) => {
          event.stopPropagation();
          onSelect(connection.id);
        }}
      />
      {connection.label ? (
        <text
          x={data.labelX}
          y={data.labelY}
          fill="#cfe0ff"
          fontSize="12"
          textAnchor="middle"
        >
          {connection.label}
        </text>
      ) : null}
    </g>
  );
}

