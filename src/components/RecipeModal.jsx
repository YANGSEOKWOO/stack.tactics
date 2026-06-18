import React from "react";
import { DEFS } from "../data/units.js";
import { RECIPE_DESC } from "../data/recipes.js";
import { recipeBoardIndices } from "../engine/recipes.js";

// 레시피 상세 모달 — 결과 유닛 능력치·재료·시너지 기여 + deploy 버튼.
export default function RecipeModal({ recipe, board, onClose, onDeploy }) {
  const out = DEFS[recipe.makes];
  const desc = RECIPE_DESC[recipe.makes] || { tier: "", text: "" };
  const deployable = !!recipeBoardIndices(board, recipe);
  return (
    <div className="backdrop" onClick={onClose}>
      <div className={"modal cat-" + out.cat} onClick={(e) => e.stopPropagation()}>
        <div className="mh">
          <span className="mg">{out.glyph}</span>
          <div><div className="mt">{out.name}</div><div className="mtier">{desc.tier} 유닛</div></div>
          <button className="x" onClick={onClose}>✕</button>
        </div>
        <div className="mb">
          <p>{desc.text}</p>
          <div className="resultstat">
            <span>❤️ HP <b>{out.hp}</b></span><span>⚔️ ATK <b>{out.atk}</b></span>
          </div>
          <div className="sub">재료</div>
          {recipe.need.map((id) => {
            const ing = DEFS[id];
            return (
              <div key={id} className="ing">
                <span className="ig">{ing.glyph}</span>
                <span className="inm">{ing.name}</span>
                <span className="ist">{ing.hp}♥ {ing.atk}⚔{ing.composite ? " · 합성" : ""}</span>
              </div>
            );
          })}
          <div className="sub" style={{ marginTop: 12 }}>시너지 기여</div>
          <div style={{ fontSize: 12, color: "#475569" }}>
            {Object.entries(out.traits || {}).map(([k, v]) => k + " +" + v).join(" · ")}
          </div>
        </div>
        <div className="mf">
          {!deployable && <span style={{ fontSize: 11, color: "#94a3b8", marginRight: "auto" }}>재료를 보드에 모두 올리면 배포할 수 있어요</span>}
          <button className="btn" onClick={onClose}>닫기</button>
          <button className="btn deploy" disabled={!deployable} style={{ opacity: deployable ? 1 : 0.4, cursor: deployable ? "pointer" : "not-allowed" }} onClick={() => deployable && onDeploy(recipe)}>deploy ⚡</button>
        </div>
      </div>
    </div>
  );
}
