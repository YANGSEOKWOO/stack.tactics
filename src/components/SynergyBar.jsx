import React from "react";
import { TRAIT_DEFS } from "../data/traits.js";

// 시너지(트레잇) 현황 — 카테고리 카운트에 따른 단계 표시.
export default function SynergyBar({ counts }) {
  return (
    <div className="synergy">
      {TRAIT_DEFS.map((t) => {
        const n = counts[t.cat];
        const tier = n >= t.thr[1] ? 2 : n >= t.thr[0] ? 1 : 0;
        return (
          <div key={t.cat} className={"syn cat-" + t.cat + (tier ? " on" : "")}>
            <div className="sh"><span>{t.name}</span><span>{n}/{t.thr[tier === 2 ? 1 : 0]}</span></div>
            <div className="sc">{tier === 0 ? "비활성" : tier === 1 ? "단계 1" : "단계 2"}</div>
            <div className="sd">{t.desc}</div>
          </div>
        );
      })}
    </div>
  );
}
