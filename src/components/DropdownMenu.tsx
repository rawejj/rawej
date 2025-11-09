"use client";
import React from "react";

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  menuStyle?: React.CSSProperties;
  backdropTestId?: string;
  role?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  children,
  style = {},
  menuStyle = {},
  backdropTestId,
  role = "menu",
}) => {
  if (!isOpen) return null;
  return (
    <>
      {/* Backdrop to close dropdown */}
      <div
        data-testid={backdropTestId}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
        }}
      />
      {/* Dropdown */}
      <div
        role={role}
        style={{
          position: "absolute",
          top: "calc(100% + 0.5rem)",
          right: 0,
          borderRadius: "12px",
          overflow: "hidden",
          zIndex: 1000,
          animation: "slideIn 0.2s ease-out",
          ...style,
          ...menuStyle,
        }}
      >
        {children}
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};
