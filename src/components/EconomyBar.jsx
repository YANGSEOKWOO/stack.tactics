import React from "react";
import { BTN_SM } from "./ui.js";

// 레벨 블록 — 레벨/경험치 바/경험치 구매. 하단 트레이 좌측에 둔다(보드 칸 = 레벨).
// 좁은 세로 화면에선 한 줄(Lv · 바 · 버튼)로 눕혀 트레이 높이를 줄인다.
export default function EconomyBar({ level, xp, xpNeed, onBuyXp }) {
  const pct = xpNeed ? Math.min(100, (xp / xpNeed) * 100) : 100;
  return (
    <div className="w-[150px] shrink-0 flex flex-col justify-center gap-1.5 narrow:w-auto narrow:basis-full narrow:flex-row narrow:items-center narrow:gap-2.5 land:w-[112px] land:gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display font-bold text-cta text-lg leading-none land:text-sm">Lv {level}</span>
        <span className="font-mono text-[10px] text-muted tabular-nums">XP {xp}/{xpNeed || "MAX"}</span>
      </div>
      <div className="h-1.5 rounded-full bg-line overflow-hidden narrow:flex-1">
        <div className="h-full rounded-full bg-cta transition-[width] duration-300" style={{ width: pct + "%" }} />
      </div>
      <button className={BTN_SM + " w-full narrow:w-auto"} onClick={onBuyXp}>경험치 +4 · 4g</button>
    </div>
  );
}
