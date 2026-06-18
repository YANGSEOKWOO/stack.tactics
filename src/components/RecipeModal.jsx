import React from "react";
import { DEFS } from "../data/units.js";
import { RECIPE_DESC } from "../data/recipes.js";
import { recipeBoardIndices } from "../engine/recipes.js";
import { BTN, BTN_DEPLOY } from "./ui.js";

const SUB = "text-[11px] text-dim font-bold mb-1.5 uppercase tracking-[0.5px]";

// 레시피 상세 모달 — 결과 유닛 능력치·재료·시너지 기여 + deploy 버튼.
export default function RecipeModal({ recipe, board, onClose, onDeploy }) {
  const out = DEFS[recipe.makes];
  const desc = RECIPE_DESC[recipe.makes] || { tier: "", text: "" };
  const deployable = !!recipeBoardIndices(board, recipe);
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-[18px] z-50 animate-[ttToast_0.15s_ease]" onClick={onClose}>
      <div className={"cat-" + out.cat + " w-full max-w-[460px] bg-surface rounded-[15px] border border-[var(--edge)] shadow-[0_30px_80px_-24px_#000,0_0_40px_-16px_var(--acc)] overflow-hidden"} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2.5 px-[18px] py-4 bg-[var(--soft)] border-b border-[var(--edge)]">
          <span className="text-[30px] [filter:drop-shadow(0_0_8px_var(--soft))]">{out.glyph}</span>
          <div>
            <div className="font-extrabold text-[17px] text-[var(--acc)] font-display">{out.name}</div>
            <div className="text-[11px] text-muted">{desc.tier} 유닛</div>
          </div>
          <button className="ml-auto bg-transparent border-0 text-[20px] text-dim cursor-pointer leading-none hover:text-ink" onClick={onClose}>✕</button>
        </div>
        <div className="px-[18px] py-4">
          <p className="mb-3 text-muted text-[13px]">{desc.text}</p>
          <div className="flex gap-3.5 my-2.5 text-[13px]">
            <span>❤️ HP <b>{out.hp}</b></span><span>⚔️ ATK <b>{out.atk}</b></span>
          </div>
          <div className={SUB}>재료</div>
          {recipe.need.map((id) => {
            const ing = DEFS[id];
            return (
              <div key={id} className="flex items-center gap-2 px-2.5 py-[7px] rounded-lg border border-line mb-1.5 bg-panel">
                <span className="text-[17px]">{ing.glyph}</span>
                <span className="font-bold text-xs">{ing.name}</span>
                <span className="ml-auto text-[11px] text-muted">{ing.hp}♥ {ing.atk}⚔{ing.composite ? " · 합성" : ""}</span>
              </div>
            );
          })}
          <div className={SUB + " mt-3"}>시너지 기여</div>
          <div className="text-xs text-muted">
            {Object.entries(out.traits || {}).map(([k, v]) => k + " +" + v).join(" · ")}
          </div>
        </div>
        <div className="px-[18px] py-3.5 border-t border-line flex gap-2.5 items-center justify-end">
          {!deployable && <span className="text-[11px] text-dim mr-auto">재료를 보드에 모두 올리면 배포할 수 있어요</span>}
          <button className={BTN} onClick={onClose}>닫기</button>
          <button className={BTN_DEPLOY} disabled={!deployable} onClick={() => deployable && onDeploy(recipe)}>deploy ⚡</button>
        </div>
      </div>
    </div>
  );
}
