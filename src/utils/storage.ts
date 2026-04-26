import type { DiagramDocument } from "../types/diagram";

const STORAGE_KEY = "diagram-editor-document";

export function saveDiagramToStorage(document: DiagramDocument): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
}

export function loadDiagramFromStorage(): DiagramDocument | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DiagramDocument;
  } catch {
    return null;
  }
}

export function exportDiagramAsJson(document: DiagramDocument): void {
  const blob = new Blob([JSON.stringify(document, null, 2)], {
    type: "application/json"
  });
  downloadBlob(blob, `${document.name.replace(/\s+/g, "-").toLowerCase()}.json`);
}

export function importDiagramFromFile(file: File): Promise<DiagramDocument> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)) as DiagramDocument);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function downloadSvg(markup: string, fileName: string): void {
  const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, fileName);
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

