import React from "react";
import { PANEL_HEAD, PANEL_TITLE } from "./ui.js";

// 합성 레시피 패널 — 행 클릭 시 상세 모달(onOpen 없으면 읽기 전용). 재료가 모두 보드에 있으면 deploy 표시.
// (.recipe / .rh 클래스는 e2e 선택자에서 사용 → 유지)
export default function RecipeGrid({ recipeProg, onOpen }) {
  const ready = recipeProg.filter((r) => r.deployable).length;
  return (
    <div className="h-full flex flex-col p-3 rounded-2xl border border-line bg-panel land:p-1.5 land:rounded-xl">
      <div className={PANEL_HEAD}>
        <span className={PANEL_TITLE}>합성 레시피</span>
        {ready > 0 && <span className="text-[10px] font-bold text-cta land:hidden">⚡ {ready}개 deploy 가능</span>}
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 land:gap-1 -mr-1 pr-1 stack:grid stack:grid-cols-2 max-[480px]:grid-cols-1">
        {recipeProg.map((rp) => {
          const have = rp.parts.filter((p) => p.onBoard).length;
          const look = rp.deployable
            ? "border-[var(--acc)] bg-[var(--soft)] shadow-[0_0_18px_-8px_var(--acc)]"
            : "border-line hover:border-[var(--edge)]";
          return (
            <div key={rp.makes} onClick={() => onOpen && onOpen(rp.recipe)}
              className={"recipe cat-" + rp.cat + " rounded-lg border px-2.5 py-2 land:px-2 land:py-1 transition " + (onOpen ? "cursor-pointer " : "") + look}>
              <div className="rh flex items-center gap-1.5 text-xs font-bold text-[var(--acc)]">
                <span className="text-[15px] leading-none">{rp.glyph}</span>{rp.makes}
                <span className={"ml-auto font-mono text-[10px] " + (rp.deployable ? "text-[var(--acc)]" : "text-dim")}>
                  {rp.deployable ? "deploy ⚡" : have + "/" + rp.parts.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5 land:hidden">
                {rp.parts.map((p, k) => (
                  <span key={p.name + k}
                    className={"text-[10px] px-1.5 py-px rounded border " +
                      (p.onBoard ? "text-ink border-[var(--edge)] bg-[var(--soft)] font-semibold" : "text-dim border-dashed border-line2")}>
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
