import React from "react";

// 경제 바 — 레벨/경험치/경험치 구매/이자·연승연패.
export default function EconomyBar({ level, xp, xpNeed, gold, streak, streakType, onBuyXp }) {
  return (
    <div className="econ">
      <span style={{ color: "#6366f1", fontWeight: 700 }}>Lv {level}</span>
      <div className="xpwrap">
        <span style={{ color: "#64748b" }}>XP {xp}/{xpNeed || "MAX"}</span>
        <div className="xptrack"><div className="xpfill" style={{ width: (xpNeed ? Math.min(100, (xp / xpNeed) * 100) : 100) + "%" }} /></div>
      </div>
      <button className="btn small" onClick={onBuyXp}>경험치 +4 · 4g</button>
      <span style={{ color: "#64748b" }}>
        이자 +{Math.min(5, Math.floor(gold / 10))}
        {streak >= 2 && <span style={{ color: streakType === "win" ? "#059669" : "#dc2626" }}> · {streakType === "win" ? "연승" : "연패"} {streak}</span>}
      </span>
    </div>
  );
}
