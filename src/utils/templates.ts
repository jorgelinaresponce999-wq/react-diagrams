import type {
  DiagramDocument,
  DiagramKind,
  DiagramNodeData,
  NodeType
} from "../types/diagram";
import { getNodeDimensions, uid } from "./geometry";

type NodeSeed = {
  type: NodeType;
  label: string;
  description: string;
  x: number;
  y: number;
  icon?: NodeType;
};

function makeNode(seed: NodeSeed, color = "#12203b", border = "#5b83de"): DiagramNodeData {
  const sizePreset = "md";
  const dimensions = getNodeDimensions(seed.type, sizePreset);
  return {
    id: uid("node"),
    type: seed.type,
    icon: seed.icon ?? seed.type,
    label: seed.label,
    description: seed.description,
    x: seed.x,
    y: seed.y,
    sizePreset,
    width: dimensions.width,
    height: dimensions.height,
    style: {
      backgroundColor: color,
      borderColor: border
    }
  };
}

export function createNewDiagram(kind: DiagramKind): DiagramDocument {
  const nameMap: Record<DiagramKind, string> = {
    flow: "Flow Diagram",
    network: "Network Diagram",
    architecture: "Architecture Diagram",
    sequence: "Sequence Diagram",
    systems: "Systems Diagram"
  };

  const base = {
    id: uid("diagram"),
    name: nameMap[kind],
    kind,
    viewport: {
      x: 120,
      y: 80,
      zoom: 1
    },
    showGrid: true,
    updatedAt: new Date().toISOString()
  };

  if (kind === "network") {
    const gateway = makeNode(
      { type: "router", label: "Gateway", description: "Entrada publica", x: 80, y: 110 },
      "#153160",
      "#69a6ff"
    );
    const api = makeNode({ type: "api", label: "API", description: "Servicios core", x: 460, y: 90 });
    const db = makeNode(
      { type: "database", label: "Database", description: "Persistencia", x: 760, y: 140 },
      "#183258",
      "#77f1d2"
    );

    return {
      ...base,
      nodes: [
        gateway,
        makeNode({ type: "firewall", label: "Firewall", description: "Seguridad", x: 260, y: 110 }),
        api,
        makeNode({ type: "cloud", label: "Cloud", description: "Infra cloud", x: 460, y: 260 }),
        db
      ],
      connections: [
        {
          id: uid("connection"),
          source: { nodeId: gateway.id, side: "right" },
          target: { nodeId: api.id, side: "left" },
          label: "HTTPS",
          lineStyle: "curved",
          dashed: false,
          direction: "single",
          color: "#93aef7",
          strokeWidth: 2
        },
        {
          id: uid("connection"),
          source: { nodeId: api.id, side: "right" },
          target: { nodeId: db.id, side: "left" },
          label: "SQL",
          lineStyle: "orthogonal",
          dashed: false,
          direction: "single",
          color: "#7fe7cb",
          strokeWidth: 2
        }
      ]
    };
  }

  if (kind === "architecture") {
    const client = makeNode(
      { type: "client", label: "Client App", description: "Web y mobile", x: 90, y: 90 },
      "#153160",
      "#69a6ff"
    );
    const service = makeNode({ type: "microservice", label: "Core Service", description: "Orquestacion", x: 430, y: 150 });
    const queue = makeNode({ type: "queue", label: "Queue", description: "Mensajeria", x: 760, y: 80 });

    return {
      ...base,
      nodes: [
        client,
        makeNode({ type: "container", label: "Edge Layer", description: "Gateway y auth", x: 90, y: 260 }),
        service,
        queue,
        makeNode(
          { type: "database", label: "Warehouse", description: "BI y analytics", x: 760, y: 260 },
          "#183258",
          "#77f1d2"
        )
      ],
      connections: [
        {
          id: uid("connection"),
          source: { nodeId: client.id, side: "right" },
          target: { nodeId: service.id, side: "left" },
          label: "requests",
          lineStyle: "curved",
          dashed: false,
          direction: "single",
          color: "#93aef7",
          strokeWidth: 2
        },
        {
          id: uid("connection"),
          source: { nodeId: service.id, side: "right" },
          target: { nodeId: queue.id, side: "left" },
          label: "events",
          lineStyle: "straight",
          dashed: true,
          direction: "single",
          color: "#7fe7cb",
          strokeWidth: 2
        }
      ]
    };
  }

  if (kind === "sequence") {
    const user = makeNode(
      { type: "user", label: "User", description: "Actor", x: 80, y: 110 },
      "#153160",
      "#69a6ff"
    );
    const api = makeNode({ type: "api", label: "API", description: "Endpoint", x: 360, y: 110 });
    const service = makeNode({ type: "microservice", label: "Service", description: "Business logic", x: 640, y: 110 });
    const db = makeNode(
      { type: "database", label: "DB", description: "Storage", x: 920, y: 110 },
      "#183258",
      "#77f1d2"
    );

    return {
      ...base,
      nodes: [user, api, service, db],
      connections: [
        {
          id: uid("connection"),
          source: { nodeId: user.id, side: "right" },
          target: { nodeId: api.id, side: "left" },
          label: "request()",
          lineStyle: "straight",
          dashed: false,
          direction: "single",
          color: "#93aef7",
          strokeWidth: 2
        },
        {
          id: uid("connection"),
          source: { nodeId: api.id, side: "right" },
          target: { nodeId: service.id, side: "left" },
          label: "validate()",
          lineStyle: "straight",
          dashed: false,
          direction: "single",
          color: "#93aef7",
          strokeWidth: 2
        },
        {
          id: uid("connection"),
          source: { nodeId: service.id, side: "right" },
          target: { nodeId: db.id, side: "left" },
          label: "query()",
          lineStyle: "straight",
          dashed: true,
          direction: "double",
          color: "#7fe7cb",
          strokeWidth: 2
        }
      ]
    };
  }

  if (kind === "systems") {
    const crm = makeNode(
      { type: "external-system", label: "CRM", description: "Sistema externo", x: 80, y: 160 },
      "#153160",
      "#69a6ff"
    );
    const api = makeNode({ type: "api", label: "Integration API", description: "Puente", x: 380, y: 160 });

    return {
      ...base,
      nodes: [
        crm,
        api,
        makeNode({ type: "queue", label: "Queue", description: "Eventos", x: 680, y: 90 }),
        makeNode({ type: "container", label: "ERP", description: "Sistema core", x: 680, y: 250 }),
        makeNode(
          { type: "user", label: "Operator", description: "Supervision", x: 980, y: 160 },
          "#183258",
          "#77f1d2"
        )
      ],
      connections: [
        {
          id: uid("connection"),
          source: { nodeId: crm.id, side: "right" },
          target: { nodeId: api.id, side: "left" },
          label: "sync",
          lineStyle: "curved",
          dashed: false,
          direction: "single",
          color: "#93aef7",
          strokeWidth: 2
        }
      ]
    };
  }

  const start = makeNode(
    { type: "start-end", label: "Start", description: "Inicio", x: 90, y: 160 },
    "#153160",
    "#69a6ff"
  );
  const process = makeNode({ type: "process", label: "Process", description: "Accion principal", x: 350, y: 145 });
  const decision = makeNode({ type: "decision", label: "Decision", description: "Condicion", x: 650, y: 120 });

  return {
    ...base,
    nodes: [
      start,
      process,
      decision,
      makeNode(
        { type: "start-end", label: "Done", description: "Exito", x: 960, y: 70 },
        "#183258",
        "#77f1d2"
      ),
      makeNode({ type: "process", label: "Retry", description: "Alternativa", x: 930, y: 250 })
    ],
    connections: [
      {
        id: uid("connection"),
        source: { nodeId: start.id, side: "right" },
        target: { nodeId: process.id, side: "left" },
        label: "next",
        lineStyle: "straight",
        dashed: false,
        direction: "single",
        color: "#93aef7",
        strokeWidth: 2
      },
      {
        id: uid("connection"),
        source: { nodeId: process.id, side: "right" },
        target: { nodeId: decision.id, side: "left" },
        label: "validate",
        lineStyle: "curved",
        dashed: false,
        direction: "single",
        color: "#93aef7",
        strokeWidth: 2
      }
    ]
  };
}

