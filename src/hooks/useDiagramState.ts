import { useMemo, useState } from "react";
import type {
  DiagramConnectionData,
  DiagramDocument,
  DiagramKind,
  DiagramNodeData,
  Selection
} from "../types/diagram";
import { getNodeDimensions, uid } from "../utils/geometry";
import { createNewDiagram } from "../utils/templates";

type HistoryState = {
  past: DiagramDocument[];
  present: DiagramDocument;
  future: DiagramDocument[];
};

export function useDiagramState(initialDocument: DiagramDocument) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialDocument,
    future: []
  });
  const [selection, setSelection] = useState<Selection>(null);

  const document = history.present;

  function commit(next: DiagramDocument): void {
    setHistory((current) => ({
      past: [...current.past, current.present],
      present: { ...next, updatedAt: new Date().toISOString() },
      future: []
    }));
  }

  function replace(next: DiagramDocument): void {
    setHistory({ past: [], present: next, future: [] });
    setSelection(null);
  }

  function updateDocument(
    updater: (current: DiagramDocument) => DiagramDocument
  ): void {
    commit(updater(history.present));
  }

  function setViewport(nextViewport: DiagramDocument["viewport"]): void {
    setHistory((current) => ({
      ...current,
      present: { ...current.present, viewport: nextViewport }
    }));
  }

  function setShowGrid(showGrid: boolean): void {
    updateDocument((current) => ({ ...current, showGrid }));
  }

  function setName(name: string): void {
    updateDocument((current) => ({ ...current, name }));
  }

  function createDiagram(kind: DiagramKind): void {
    replace(createNewDiagram(kind));
  }

  function loadDiagram(next: DiagramDocument): void {
    replace(next);
  }

  function addNode(
    nodeType: DiagramNodeData["type"],
    x: number,
    y: number
  ): string {
    const sizePreset = "md";
    const dimensions = getNodeDimensions(nodeType, sizePreset);
    const nextNode: DiagramNodeData = {
      id: uid("node"),
      type: nodeType,
      icon: nodeType,
      label: defaultNodeLabel(nodeType),
      description: "Nuevo componente",
      x,
      y,
      width: dimensions.width,
      height: dimensions.height,
      sizePreset,
      style: {
        backgroundColor: "#12203b",
        borderColor: "#5b83de"
      }
    };

    updateDocument((current) => ({
      ...current,
      nodes: [...current.nodes, nextNode]
    }));
    setSelection({ type: "node", id: nextNode.id });
    return nextNode.id;
  }

  function updateNode(id: string, patch: Partial<DiagramNodeData>): void {
    updateDocument((current) => ({
      ...current,
      nodes: current.nodes.map((node) => {
        if (node.id !== id) {
          return node;
        }

        const nextNode = { ...node, ...patch };
        if (patch.type || patch.sizePreset) {
          const dimensions = getNodeDimensions(
            nextNode.type,
            nextNode.sizePreset
          );
          nextNode.width = dimensions.width;
          nextNode.height = dimensions.height;
        }
        return nextNode;
      })
    }));
  }

  function removeNode(id: string): void {
    updateDocument((current) => ({
      ...current,
      nodes: current.nodes.filter((node) => node.id !== id),
      connections: current.connections.filter(
        (connection) =>
          connection.source.nodeId !== id && connection.target.nodeId !== id
      )
    }));
    setSelection(null);
  }

  function addConnection(connection: DiagramConnectionData): void {
    updateDocument((current) => ({
      ...current,
      connections: [...current.connections, connection]
    }));
    setSelection({ type: "connection", id: connection.id });
  }

  function updateConnection(
    id: string,
    patch: Partial<DiagramConnectionData>
  ): void {
    updateDocument((current) => ({
      ...current,
      connections: current.connections.map((connection) =>
        connection.id === id ? { ...connection, ...patch } : connection
      )
    }));
  }

  function removeConnection(id: string): void {
    updateDocument((current) => ({
      ...current,
      connections: current.connections.filter(
        (connection) => connection.id !== id
      )
    }));
    setSelection(null);
  }

  function undo(): void {
    setHistory((current) => {
      if (!current.past.length) {
        return current;
      }
      const previous = current.past[current.past.length - 1];
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future]
      };
    });
    setSelection(null);
  }

  function redo(): void {
    setHistory((current) => {
      if (!current.future.length) {
        return current;
      }
      const next = current.future[0];
      return {
        past: [...current.past, current.present],
        present: next,
        future: current.future.slice(1)
      };
    });
    setSelection(null);
  }

  const selectedNode = useMemo(
    () =>
      selection?.type === "node"
        ? document.nodes.find((node) => node.id === selection.id) ?? null
        : null,
    [document.nodes, selection]
  );

  const selectedConnection = useMemo(
    () =>
      selection?.type === "connection"
        ? document.connections.find(
            (connection) => connection.id === selection.id
          ) ?? null
        : null,
    [document.connections, selection]
  );

  return {
    document,
    selection,
    selectedNode,
    selectedConnection,
    setSelection,
    setViewport,
    setShowGrid,
    setName,
    createDiagram,
    loadDiagram,
    addNode,
    updateNode,
    removeNode,
    addConnection,
    updateConnection,
    removeConnection,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0
  };
}

function defaultNodeLabel(type: DiagramNodeData["type"]): string {
  const labels: Record<DiagramNodeData["type"], string> = {
    "start-end": "Start / End",
    process: "Process",
    decision: "Decision",
    database: "Database",
    server: "Server",
    client: "Client",
    api: "API",
    firewall: "Firewall",
    router: "Router",
    cloud: "Cloud",
    microservice: "Microservice",
    user: "User",
    "external-system": "External System",
    queue: "Queue",
    container: "Container",
    "network-node": "Network Node"
  };
  return labels[type];
}

