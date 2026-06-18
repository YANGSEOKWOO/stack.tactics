import React from "react";

// 상단 타이틀 바 + 자원 요약(체력·골드·스테이지).
export default function TopBar({ hp, gold, stage }) {
  return (
    <div className="bar">
      <div style={{ display: "flex", alignItems: "center" }}>
        <span className="dots">
          <span className="dot" style={{ background: "#ff5f56" }} />
          <span className="dot" style={{ background: "#ffbd2e" }} />
          <span className="dot" style={{ background: "#27c93f" }} />
        </span>
        <span className="brand">stack.tactics</span>
        <span className="curs" />
      </div>
      <div className="pills">
        <span className="pill" data-testid="hp" style={{ color: "#e11d48" }}>♥ {hp}</span>
        <span className="pill" data-testid="gold" style={{ color: "#b45309" }}>🪙 {gold}g</span>
        <span className="pill" data-testid="stage" style={{ color: "#475569" }}>stage {stage}</span>
      </div>
    </div>
  );
}
