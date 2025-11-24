import React from "react";

type ModalType = "error" | "success" | "warning" | "info";

type ModalVariant = "message" | "default";

import "@/styles/Modal.css";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  type?: ModalType;
  variant?: ModalVariant;
}

export default function Modal({ show, onClose, children, type = "info", variant = "default" }: ModalProps) {
  if (!show) return null;
  let borderColor = "#0070f3", icon = "ℹ️";
  if (type === "error") { borderColor = "#e00"; icon = "❌"; }
  else if (type === "success") { borderColor = "#0a0"; icon = "✅"; }
  else if (type === "warning") { borderColor = "#f5a623"; icon = "⚠️"; }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={variant === "message" ? { borderTop: `6px solid ${borderColor}` } : {}}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {variant === "message" && <div className="modal-icon" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}
