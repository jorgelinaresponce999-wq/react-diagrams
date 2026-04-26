export type DiagramKind =
  | "flow"
  | "network"
  | "architecture"
  | "sequence"
  | "systems";

export type NodeType =
  | "start-end"
  | "process"
  | "decision"
  | "database"
  | "server"
  | "client"
  | "api"
  | "firewall"
  | "router"
  | "cloud"
  | "microservice"
  | "user"
  | "external-system"
  | "queue"
  | "container"
  | "network-node";

export type ConnectorSide = "top" | "right" | "bottom" | "left";

export type ConnectionLineStyle = "straight" | "curved" | "orthogonal";

export type ArrowDirection = "single" | "double";

export type NodeSizePreset = "sm" | "md" | "lg";

export interface NodeStyle {
  backgroundColor: string;
  borderColor: string;
}

export interface DiagramNodeData {
  id: string;
  type: NodeType;
  icon: NodeType;
  label: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sizePreset: NodeSizePreset;
  style: NodeStyle;
}

export interface ConnectionAnchor {
  nodeId: string;
  side: ConnectorSide;
}

export interface DiagramConnectionData {
  id: string;
  source: ConnectionAnchor;
  target: ConnectionAnchor;
  label: string;
  lineStyle: ConnectionLineStyle;
  dashed: boolean;
  direction: ArrowDirection;
  color: string;
  strokeWidth: number;
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface DiagramDocument {
  id: string;
  name: string;
  kind: DiagramKind;
  nodes: DiagramNodeData[];
  connections: DiagramConnectionData[];
  viewport: CanvasViewport;
  showGrid: boolean;
  updatedAt: string;
}

export type Selection =
  | { type: "node"; id: string }
  | { type: "connection"; id: string }
  | null;

