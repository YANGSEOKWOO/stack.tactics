import React from "react";
import { BTN_SM } from "./ui.js";

// 경제 바 — 레벨/경험치/경험치 구매/이자·연승연패.
export default function EconomyBar({ level, xp, xpNeed, gold, streak, streakType, onBuyXp }) {
  const pct = xpNeed ? Math.min(100, (xp / xpNeed) * 100) : 100;
  return (
    <div className="flex items-center gap-3 flex-wrap px-3.5 py-2.5 rounded-xl mb-3.5 border border-line bg-panel text-xs text-muted">
      <span className="text-cta font-extrabold font-display text-sm">Lv {level}</span>
      <div className="flex-1 min-w-[150px]">
        <span>XP {xp}/{xpNeed || "MAX"}</span>
        <div className="h-[7px] rounded-[5px] bg-bg overflow-hidden mt-[5px] border border-line">
          <div className="h-full rounded-[5px] bg-[linear-gradient(90deg,var(--cta),#818cf8)] shadow-[0_0_12px_-2px_var(--cta)] transition-[width] duration-300" style={{ width: pct + "%" }} />
        </div>
      </div>
      <button className={BTN_SM} onClick={onBuyXp}>경험치 +4 · 4g</button>
      <span>
        이자 +{Math.min(5, Math.floor(gold / 10))}
        {streak >= 2 && (
          <span className={streakType === "win" ? "text-emerald-400 font-bold" : "text-hp font-bold"}> · {streakType === "win" ? "연승" : "연패"} {streak}</span>
        )}
      </span>
    </div>
  );
}
