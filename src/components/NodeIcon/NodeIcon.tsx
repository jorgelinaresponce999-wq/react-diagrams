import type { NodeType } from "../../types/diagram";

type Props = {
  type: NodeType;
  className?: string;
};

export function NodeIcon({ type, className }: Props) {
  if (type === "database") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <ellipse cx="12" cy="5" rx="7" ry="3.2" />
        <path d="M5 5v6c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2V5" />
        <path d="M5 11v6c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2v-6" />
      </svg>
    );
  }

  if (type === "decision") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M12 2l9 10-9 10L3 12 12 2z" />
      </svg>
    );
  }

  if (type === "user") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="12" cy="7.5" r="3.2" />
        <path d="M5 20c1.4-3.9 4-5.8 7-5.8s5.6 1.9 7 5.8" />
      </svg>
    );
  }

  if (type === "cloud") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M7 18a4 4 0 0 1-.8-7.9A5.8 5.8 0 0 1 17.1 8a3.7 3.7 0 1 1 .9 10H7z" />
      </svg>
    );
  }

  if (type === "router" || type === "network-node") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="4" y="9" width="16" height="6" rx="2" />
        <path d="M9 7l3-3 3 3" />
        <path d="M9 17l3 3 3-3" />
      </svg>
    );
  }

  if (type === "firewall") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M6 4h12v16H6z" />
        <path d="M6 10h12" />
        <path d="M10 4v16" />
      </svg>
    );
  }

  if (type === "queue") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="4" y="5" width="16" height="4" rx="1.5" />
        <rect x="4" y="10" width="16" height="4" rx="1.5" />
        <rect x="4" y="15" width="16" height="4" rx="1.5" />
      </svg>
    );
  }

  if (type === "start-end") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="6" />
      </svg>
    );
  }

  if (type === "container") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2.5" />
        <path d="M9 4v16" />
        <path d="M15 4v16" />
      </svg>
    );
  }

  if (type === "api" || type === "microservice" || type === "server") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="5" y="4" width="14" height="16" rx="2.5" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    );
  }

  if (type === "external-system") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="4" y="4" width="12" height="12" rx="2" />
        <path d="M12 12l8 8" />
        <path d="M15 20h5v-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 9h8" />
      <path d="M8 15h8" />
    </svg>
  );
}

