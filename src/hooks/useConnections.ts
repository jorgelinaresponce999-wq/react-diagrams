import { useMemo, useState } from "react";
import type { ConnectionAnchor, DiagramConnectionData } from "../types/diagram";
import { uid } from "../utils/geometry";

export function useConnections(
  createConnection: (connection: DiagramConnectionData) => void
) {
  const [draftSource, setDraftSource] = useState<ConnectionAnchor | null>(null);

  const hasDraft = useMemo(() => Boolean(draftSource), [draftSource]);

  function beginOrCompleteConnection(anchor: ConnectionAnchor): void {
    if (!draftSource) {
      setDraftSource(anchor);
      return;
    }

    if (
      draftSource.nodeId === anchor.nodeId &&
      draftSource.side === anchor.side
    ) {
      setDraftSource(null);
      return;
    }

    createConnection({
      id: uid("connection"),
      source: draftSource,
      target: anchor,
      label: "relation",
      lineStyle: "curved",
      dashed: false,
      direction: "single",
      color: "#93aef7",
      strokeWidth: 2
    });
    setDraftSource(null);
  }

  function cancelDraftConnection(): void {
    setDraftSource(null);
  }

  return {
    draftSource,
    hasDraft,
    beginOrCompleteConnection,
    cancelDraftConnection
  };
}

