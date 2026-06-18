import React from "react";

// 합성 레시피 목록 — 카드 클릭 시 상세 모달. 재료가 모두 보드에 있으면 deploy 가능 표시.
// (.recipe / .rh 클래스는 e2e 선택자에서 사용 → 유지)
export default function RecipeGrid({ recipeProg, onOpen }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 mb-3.5 max-[760px]:grid-cols-2 max-[480px]:grid-cols-1">
      {recipeProg.map((rp) => {
        const look = rp.deployable
          ? "border-[var(--edge)] bg-[var(--soft)] shadow-[0_0_22px_-8px_var(--acc)]"
          : "border-line bg-panel hover:border-[var(--edge)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-14px_var(--acc)]";
        return (
          <div key={rp.makes} onClick={() => onOpen(rp.recipe)}
            className={"recipe cat-" + rp.cat + " rounded-xl border px-[13px] py-[11px] cursor-pointer transition " + look}>
            <div className="rh flex items-center gap-2 text-[13px] font-bold text-[var(--acc)]">
              <span className="text-[17px] [filter:drop-shadow(0_0_6px_var(--soft))]">{rp.glyph}</span>{rp.makes}
              {rp.deployable && <span className="ml-auto text-[10px] text-[var(--acc)] font-bold">deploy 가능 ⚡</span>}
            </div>
            <div className="flex flex-wrap gap-[5px] mt-2">
              {rp.parts.map((p, k) => (
                <span key={p.name + k} className={"text-[11px] px-2 py-0.5 rounded-[7px] border " + (p.onBoard ? "bg-[var(--soft)] text-ink border-[var(--edge)]" : "bg-black/25 text-dim border-transparent")}>{p.name}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
