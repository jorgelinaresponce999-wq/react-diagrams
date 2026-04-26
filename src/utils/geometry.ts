import type {
  ConnectionAnchor,
  ConnectionLineStyle,
  ConnectorSide,
  DiagramConnectionData,
  DiagramNodeData,
  NodeSizePreset,
  NodeType
} from "../types/diagram";

export const GRID_SIZE = 32;

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getNodeDimensions(
  type: NodeType,
  sizePreset: NodeSizePreset
): { width: number; height: number } {
  const scale = sizePreset === "sm" ? 0.86 : sizePreset === "lg" ? 1.16 : 1;

  if (type === "start-end") {
    return { width: Math.round(156 * scale), height: Math.round(58 * scale) };
  }
  if (type === "decision") {
    return { width: Math.round(130 * scale), height: Math.round(130 * scale) };
  }
  if (type === "database") {
    return { width: Math.round(168 * scale), height: Math.round(96 * scale) };
  }
  if (type === "user") {
    return { width: Math.round(156 * scale), height: Math.round(92 * scale) };
  }
  return { width: Math.round(180 * scale), height: Math.round(88 * scale) };
}

export function getHandlePosition(
  node: DiagramNodeData,
  side: ConnectorSide
): { x: number; y: number } {
  if (side === "top") {
    return { x: node.x + node.width / 2, y: node.y };
  }
  if (side === "right") {
    return { x: node.x + node.width, y: node.y + node.height / 2 };
  }
  if (side === "bottom") {
    return { x: node.x + node.width / 2, y: node.y + node.height };
  }
  return { x: node.x, y: node.y + node.height / 2 };
}

export function buildConnectionPath(
  source: { x: number; y: number },
  target: { x: number; y: number },
  style: ConnectionLineStyle
): string {
  if (style === "straight") {
    return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  }

  if (style === "orthogonal") {
    const midX = source.x + (target.x - source.x) / 2;
    return `M ${source.x} ${source.y} L ${midX} ${source.y} L ${midX} ${target.y} L ${target.x} ${target.y}`;
  }

  const deltaX = Math.abs(target.x - source.x);
  const deltaY = Math.abs(target.y - source.y);
  const controlOffset = Math.max(42, Math.max(deltaX, deltaY) * 0.38);
  const c1x = source.x + controlOffset;
  const c1y = source.y;
  const c2x = target.x - controlOffset;
  const c2y = target.y;
  return `M ${source.x} ${source.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${target.x} ${target.y}`;
}

export function getConnectionPathData(
  connection: DiagramConnectionData,
  nodes: DiagramNodeData[]
): { path: string; labelX: number; labelY: number } | null {
  const sourceNode = nodes.find((node) => node.id === connection.source.nodeId);
  const targetNode = nodes.find((node) => node.id === connection.target.nodeId);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const source = getHandlePosition(sourceNode, connection.source.side);
  const target = getHandlePosition(targetNode, connection.target.side);
  const path = buildConnectionPath(source, target, connection.lineStyle);

  return {
    path,
    labelX: source.x + (target.x - source.x) / 2,
    labelY: source.y + (target.y - source.y) / 2 - 10
  };
}

export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function screenToCanvasCoordinates(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  viewport: { x: number; y: number; zoom: number }
): { x: number; y: number } {
  const x = (clientX - rect.left - viewport.x) / viewport.zoom;
  const y = (clientY - rect.top - viewport.y) / viewport.zoom;
  return { x, y };
}

export function buildSvgExportMarkup(
  name: string,
  nodes: DiagramNodeData[],
  connections: DiagramConnectionData[]
): string {
  const width = 1600;
  const height = 900;
  const nodeMarkup = nodes
    .map((node) => {
      const radius = node.type === "start-end" ? 999 : 20;
      return `
        <g>
          <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="${radius}" fill="${node.style.backgroundColor}" stroke="${node.style.borderColor}" stroke-width="2" />
          <text x="${node.x + 16}" y="${node.y + 28}" fill="#eaf2ff" font-family="Arial" font-size="16" font-weight="700">${escapeXml(node.label)}</text>
          <text x="${node.x + 16}" y="${node.y + 50}" fill="#9eb0d3" font-family="Arial" font-size="12">${escapeXml(node.description)}</text>
        </g>
      `;
    })
    .join("");

  const connectionMarkup = connections
    .map((connection) => {
      const data = getConnectionPathData(connection, nodes);
      if (!data) {
        return "";
      }
      return `
        <g>
          <path d="${data.path}" fill="none" stroke="${connection.color}" stroke-width="${connection.strokeWidth}" ${
            connection.dashed ? 'stroke-dasharray="8 8"' : ""
          } />
          <text x="${data.labelX}" y="${data.labelY}" fill="#cfe0ff" font-family="Arial" font-size="12">${escapeXml(connection.label)}</text>
        </g>
      `;
    })
    .join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#08111e" />
      <text x="32" y="40" fill="#eaf2ff" font-family="Arial" font-size="20" font-weight="700">${escapeXml(name)}</text>
      ${connectionMarkup}
      ${nodeMarkup}
    </svg>
  `;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
