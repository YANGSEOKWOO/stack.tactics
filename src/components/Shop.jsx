import React from "react";
import { DEFS } from "../data/units.js";

// 상점(npm install) — 5칸 슬롯. 골드 부족 시 비활성(poor), 구매 후 빈 슬롯.
export default function Shop({ shop, gold, onBuy }) {
  return (
    <div className="shop" data-testid="shop">
      {shop.map((defId, i) => {
        if (!defId) return <div key={i} className="scard slotempty" data-testid="shop-slot" />;
        const d = DEFS[defId];
        return (
          <div key={i} className={"scard cat-" + d.cat + (gold < d.cost ? " poor" : "")} data-testid="shop-card" data-cost={d.cost} onClick={() => onBuy(i)}>
            <span className="g">{d.glyph}</span>
            <span className="nm">{d.name}</span>
            <span className="st">{d.hp}♥ {d.atk}⚔</span>
            <span className="cost">{d.cost}g</span>
          </div>
        );
      })}
    </div>
  );
}
