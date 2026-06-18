import React from "react";
import { TRAIT_DEFS } from "../data/traits.js";

// 시너지(트레잇) 현황 — 카테고리 카운트에 따른 단계 표시.
export default function SynergyBar({ counts }) {
  return (
    <div className="flex gap-2.5 flex-wrap mb-3.5 max-[760px]:gap-[7px]">
      {TRAIT_DEFS.map((t) => {
        const n = counts[t.cat];
        const tier = n >= t.thr[1] ? 2 : n >= t.thr[0] ? 1 : 0;
        const on = tier > 0;
        const look = on
          ? "opacity-100 border-[var(--edge)] bg-[var(--soft)] shadow-[0_0_22px_-10px_var(--acc),inset_0_0_0_1px_var(--edge)]"
          : "opacity-55 border-line bg-panel";
        return (
          <div key={t.cat} className={"cat-" + t.cat + " flex-1 min-w-[150px] rounded-xl border px-3 py-[9px] transition max-[760px]:min-w-[132px] " + look}>
            <div className="flex items-center justify-between font-bold text-[var(--acc)] text-xs">
              <span>{t.name}</span><span>{n}/{t.thr[tier === 2 ? 1 : 0]}</span>
            </div>
            <div className="text-[11px] text-muted mt-0.5">{tier === 0 ? "비활성" : tier === 1 ? "단계 1" : "단계 2"}</div>
            <div className="text-[10px] text-dim mt-[3px]">{t.desc}</div>
          </div>
        );
      })}
    </div>
  );
}
