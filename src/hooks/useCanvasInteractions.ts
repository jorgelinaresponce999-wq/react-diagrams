import { useRef, useState } from "react";
import type { CanvasViewport } from "../types/diagram";
import {
  screenToCanvasCoordinates,
  snapToGrid
} from "../utils/geometry";

interface UseCanvasInteractionsOptions {
  viewport: CanvasViewport;
  setViewport: (next: CanvasViewport) => void;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
}

export function useCanvasInteractions({
  viewport,
  setViewport,
  onNodeMove
}: UseCanvasInteractionsOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [draggingOffset, setDraggingOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, originX: 0, originY: 0 });

  function startNodeDrag(
    event: React.PointerEvent<HTMLButtonElement>,
    nodeId: string
  ): void {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const canvasPoint = screenToCanvasCoordinates(
      event.clientX,
      event.clientY,
      rect,
      viewport
    );

    const nodeElement = event.currentTarget;
    const nodeLeft = Number(nodeElement.dataset.x ?? 0);
    const nodeTop = Number(nodeElement.dataset.y ?? 0);

    setDraggingNodeId(nodeId);
    setDraggingOffset({
      x: canvasPoint.x - nodeLeft,
      y: canvasPoint.y - nodeTop
    });
    event.stopPropagation();
  }

  function onCanvasPointerDown(
    event: React.PointerEvent<HTMLDivElement>
  ): void {
    if (event.target !== event.currentTarget) {
      return;
    }

    setIsPanning(true);
    setPanStart({
      x: event.clientX,
      y: event.clientY,
      originX: viewport.x,
      originY: viewport.y
    });
  }

  function onCanvasPointerMove(
    event: React.PointerEvent<HTMLDivElement>
  ): void {
    if (!containerRef.current) {
      return;
    }

    if (draggingNodeId) {
      const rect = containerRef.current.getBoundingClientRect();
      const point = screenToCanvasCoordinates(
        event.clientX,
        event.clientY,
        rect,
        viewport
      );
      onNodeMove(
        draggingNodeId,
        snapToGrid(point.x - draggingOffset.x),
        snapToGrid(point.y - draggingOffset.y)
      );
      return;
    }

    if (isPanning) {
      setViewport({
        ...viewport,
        x: panStart.originX + event.clientX - panStart.x,
        y: panStart.originY + event.clientY - panStart.y
      });
    }
  }

  function onCanvasPointerUp(): void {
    setDraggingNodeId(null);
    setIsPanning(false);
  }

  function zoomIn(): void {
    setViewport({ ...viewport, zoom: Math.min(2.2, viewport.zoom + 0.1) });
  }

  function zoomOut(): void {
    setViewport({ ...viewport, zoom: Math.max(0.45, viewport.zoom - 0.1) });
  }

  function resetView(): void {
    setViewport({ x: 120, y: 80, zoom: 1 });
  }

  function onWheel(event: React.WheelEvent<HTMLDivElement>): void {
    event.preventDefault();
    const nextZoom =
      event.deltaY < 0
        ? Math.min(2.2, viewport.zoom + 0.08)
        : Math.max(0.45, viewport.zoom - 0.08);
    setViewport({ ...viewport, zoom: nextZoom });
  }

  return {
    containerRef,
    isPanning,
    startNodeDrag,
    onCanvasPointerDown,
    onCanvasPointerMove,
    onCanvasPointerUp,
    onWheel,
    zoomIn,
    zoomOut,
    resetView
  };
}

