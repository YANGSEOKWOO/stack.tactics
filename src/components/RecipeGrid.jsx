import React from "react";

// 합성 레시피 목록 — 카드 클릭 시 상세 모달. 재료가 모두 보드에 있으면 deploy 가능 표시.
export default function RecipeGrid({ recipeProg, onOpen }) {
  return (
    <div className="recipes">
      {recipeProg.map((rp) => (
        <div key={rp.makes} className={"recipe cat-" + rp.cat + (rp.deployable ? " ready" : "")} onClick={() => onOpen(rp.recipe)}>
          <div className="rh"><span className="rg">{rp.glyph}</span>{rp.makes}{rp.deployable && <span className="ready-tag">deploy 가능 ⚡</span>}</div>
          <div className="parts">
            {rp.parts.map((p, k) => <span key={p.name + k} className={"part" + (p.onBoard ? " have" : "")}>{p.name}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}
