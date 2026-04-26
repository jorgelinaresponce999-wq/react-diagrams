import { useEffect, useMemo, useRef } from "react";
import { Canvas } from "./components/Canvas/Canvas";
import { PropertiesPanel } from "./components/PropertiesPanel/PropertiesPanel";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { useCanvasInteractions } from "./hooks/useCanvasInteractions";
import { useConnections } from "./hooks/useConnections";
import { useDiagramState } from "./hooks/useDiagramState";
import type { DiagramDocument, DiagramKind, NodeType } from "./types/diagram";
import {
  buildSvgExportMarkup,
  screenToCanvasCoordinates
} from "./utils/geometry";
import {
  downloadSvg,
  exportDiagramAsJson,
  importDiagramFromFile,
  loadDiagramFromStorage,
  saveDiagramToStorage
} from "./utils/storage";
import { createNewDiagram } from "./utils/templates";
import styles from "./App.module.scss";

const defaultDocument = createNewDiagram("flow");

export default function App() {
  const {
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
    canUndo,
    canRedo
  } = useDiagramState(loadDiagramFromStorage() ?? defaultDocument);

  const importRef = useRef<HTMLInputElement | null>(null);

  const {
    draftSource,
    beginOrCompleteConnection,
    cancelDraftConnection
  } = useConnections(addConnection);

  const {
    containerRef,
    startNodeDrag,
    onCanvasPointerDown,
    onCanvasPointerMove,
    onCanvasPointerUp,
    onWheel,
    zoomIn,
    zoomOut,
    resetView
  } = useCanvasInteractions({
    viewport: document.viewport,
    setViewport,
    onNodeMove: (nodeId, x, y) => updateNode(nodeId, { x, y })
  });

  useEffect(() => {
    saveDiagramToStorage(document);
  }, [document]);

  useEffect(() => {
    function handleDelete(event: KeyboardEvent) {
      if (event.key !== "Delete") {
        return;
      }

      if (selection?.type === "node") {
        removeNode(selection.id);
      } else if (selection?.type === "connection") {
        removeConnection(selection.id);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        cancelDraftConnection();
        setSelection(null);
      }
    }

    window.addEventListener("keydown", handleDelete);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleDelete);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [cancelDraftConnection, removeConnection, removeNode, selection, setSelection]);

  function handleDropLibraryItem(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData(
      "application/node-type"
    ) as NodeType;

    if (!nodeType || !containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const point = screenToCanvasCoordinates(
      event.clientX,
      event.clientY,
      rect,
      document.viewport
    );
    addNode(nodeType, point.x, point.y);
  }

  function handleImportFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    importDiagramFromFile(file)
      .then((nextDocument) => loadDiagram(nextDocument as DiagramDocument))
      .finally(() => {
        if (importRef.current) {
          importRef.current.value = "";
        }
      });
  }

  const documentForExport = useMemo(
    () => ({
      ...document,
      updatedAt: new Date().toISOString()
    }),
    [document]
  );

  function handleCanvasBackgroundPointerDown(
    event: React.PointerEvent<HTMLDivElement>
  ): void {
    setSelection(null);
    onCanvasPointerDown(event);
  }

  return (
    <div className={styles.appShell}>
      <Toolbar
        name={document.name}
        kind={document.kind}
        canUndo={canUndo}
        canRedo={canRedo}
        showGrid={document.showGrid}
        zoom={document.viewport.zoom}
        onNameChange={setName}
        onKindChange={(kind) => createDiagram(kind as DiagramKind)}
        onNewDiagram={() => createDiagram(document.kind)}
        onSave={() => saveDiagramToStorage(document)}
        onLoad={() => {
          const stored = loadDiagramFromStorage();
          if (stored) {
            loadDiagram(stored);
          }
        }}
        onExportJson={() => exportDiagramAsJson(documentForExport)}
        onImportJson={() => importRef.current?.click()}
        onExportSvg={() =>
          downloadSvg(
            buildSvgExportMarkup(
              document.name,
              document.nodes,
              document.connections
            ),
            `${document.name.replace(/\s+/g, "-").toLowerCase()}.svg`
          )
        }
        onUndo={undo}
        onRedo={redo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onToggleGrid={() => setShowGrid(!document.showGrid)}
      />

      <div className={styles.editorShell}>
        <Sidebar kind={document.kind} onAddNode={(type) => addNode(type, 180, 160)} />

        <section className={styles.canvasSection}>
          <Canvas
            nodes={document.nodes}
            connections={document.connections}
            selection={selection}
            viewport={document.viewport}
            showGrid={document.showGrid}
            containerRef={containerRef}
            onCanvasPointerDown={handleCanvasBackgroundPointerDown}
            onCanvasPointerMove={onCanvasPointerMove}
            onCanvasPointerUp={onCanvasPointerUp}
            onWheel={onWheel}
            onDropLibraryItem={handleDropLibraryItem}
            onSelectNode={(id) => setSelection({ type: "node", id })}
            onSelectConnection={(id) => setSelection({ type: "connection", id })}
            onStartNodeDrag={startNodeDrag}
            onHandleClick={(nodeId, side) =>
              beginOrCompleteConnection({ nodeId, side })
            }
          />

          <div className={styles.statusRow}>
            <span>{document.kind} diagram</span>
            <span>{document.nodes.length} nodos</span>
            <span>{document.connections.length} conexiones</span>
            <span>
              {draftSource
                ? `Conectando desde ${draftSource.side}`
                : "Listo para editar"}
            </span>
          </div>
        </section>

        <PropertiesPanel
          selectedNode={selectedNode}
          selectedConnection={selectedConnection}
          onUpdateNode={updateNode}
          onDeleteNode={removeNode}
          onUpdateConnection={updateConnection}
          onDeleteConnection={removeConnection}
        />
      </div>

      <input
        ref={importRef}
        hidden
        type="file"
        accept="application/json"
        onChange={handleImportFileChange}
      />
    </div>
  );
}
