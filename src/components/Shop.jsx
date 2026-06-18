import React from "react";
import { DEFS } from "../data/units.js";

// 상점(npm install) — 5칸 슬롯. 골드 부족 시 비활성(poor), 구매 후 빈 슬롯.
// 모바일에선 가로 스와이프 선반. (.poor 클래스는 e2e 선택자에서 사용 → 유지)
const CARD =
  "relative flex flex-col items-center justify-center gap-0.5 h-24 rounded-xl border-[1.5px] overflow-hidden transition " +
  "max-[480px]:flex-[0_0_33%] max-[480px]:[scroll-snap-align:start] max-[480px]:h-[88px]";

export default function Shop({ shop, gold, onBuy }) {
  return (
    <div data-testid="shop" className="shop-scroll grid grid-cols-5 gap-2.5 max-[480px]:flex max-[480px]:overflow-x-auto max-[480px]:[scroll-snap-type:x_mandatory] max-[480px]:pb-1">
      {shop.map((defId, i) => {
        if (!defId) return <div key={i} data-testid="shop-slot" className={CARD + " border-dashed border-line bg-black/20"} />;
        const d = DEFS[defId];
        const poor = gold < d.cost;
        const look =
          "border-[var(--edge)] cursor-pointer bg-[linear-gradient(180deg,var(--soft),rgba(0,0,0,0.22))] " +
          "before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-[3px] before:bg-[var(--acc)] before:shadow-[0_0_12px_var(--acc)] " +
          (poor ? "poor opacity-40 cursor-not-allowed grayscale-[0.4]" : "hover:-translate-y-[3px] hover:shadow-[0_14px_28px_-12px_var(--acc),0_0_22px_-8px_var(--acc)]");
        return (
          <div key={i} data-testid="shop-card" data-cost={d.cost} onClick={() => onBuy(i)} className={CARD + " cat-" + d.cat + " " + look}>
            <span className="text-[23px] text-[var(--acc)] [filter:drop-shadow(0_0_7px_var(--soft))] max-[480px]:text-[20px]">{d.glyph}</span>
            <span className="text-xs font-bold text-[var(--acc)]">{d.name}</span>
            <span className="text-[10px] text-muted tabular-nums">{d.hp}♥ {d.atk}⚔</span>
            <span className="text-[11px] text-gold font-bold mt-px">{d.cost}g</span>
          </div>
        );
      })}
    </div>
  );
}
