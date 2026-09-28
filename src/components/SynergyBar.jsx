import React from "react";
import { TRAIT_DEFS } from "../data/traits.js";
import { PANEL_HEAD, PANEL_TITLE } from "./ui.js";

// 시너지(트레잇) 패널 — 카운트를 칸(pip)으로, 임계값마다 구분선. 데스크톱은 세로, 모바일은 2×2.
export default function SynergyBar({ counts }) {
  return (
    <div className="h-full p-3 rounded-2xl border border-line bg-panel land:p-1.5 land:rounded-xl land:overflow-y-auto">
      <div className={PANEL_HEAD}><span className={PANEL_TITLE}>시너지</span></div>
      <div className="flex flex-col gap-2 land:gap-1 stack:grid stack:grid-cols-2 max-[380px]:grid-cols-1">
        {TRAIT_DEFS.map((t) => {
          const n = counts[t.cat];
          const tier = n >= t.thr[1] ? 2 : n >= t.thr[0] ? 1 : 0;
          const on = tier > 0;
          const max = t.thr[1];
          return (
            <div key={t.cat}
              className={"cat-" + t.cat + " rounded-lg border px-2.5 py-2 land:px-2 land:py-0.5 transition " +
                (on ? "border-[var(--edge)] bg-[var(--soft)]" : "border-line")}>
              <div className="flex items-center justify-between gap-2">
                <span className={"text-xs font-bold " + (on ? "text-[var(--acc)]" : "text-muted")}>{t.name}</span>
                <span className={"font-mono text-[11px] font-bold tabular-nums " + (on ? "text-[var(--acc)]" : "text-dim")}>
                  {n}<span className="text-dim font-normal">/{t.thr[tier === 2 ? 1 : 0]}</span>
                </span>
              </div>
              <div className="flex items-center gap-[3px] mt-1.5 land:mt-0.5">
                {Array.from({ length: max }, (_, k) => (
                  <React.Fragment key={k}>
                    {k === t.thr[0] && <span className="w-px h-2.5 bg-line2 mx-0.5" />}
                    <span className={"flex-1 h-1.5 rounded-full " + (k < n ? "bg-[var(--acc)]" : "bg-line")} />
                  </React.Fragment>
                ))}
              </div>
              <div className={"text-[10.5px] mt-1.5 leading-snug land:hidden " + (on ? "text-ink/80" : "text-dim")}>{t.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
