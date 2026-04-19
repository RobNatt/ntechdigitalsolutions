import React from "react";

export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora-background">
        <div className="aurora-gradient aurora-gradient-1"></div>
        <div className="aurora-gradient aurora-gradient-2"></div>
        <div className="aurora-gradient aurora-gradient-3"></div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
