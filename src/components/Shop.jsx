import React from "react";
import { DEFS } from "../data/units.js";
import { COST_TONE } from "./ui.js";

// 상점(npm install) — 5칸 슬롯. 코스트 등급 색 테두리, 골드 부족 시 비활성(poor), 구매 후 빈 슬롯.
// 모바일에선 가로 스와이프. (.poor 클래스는 e2e 선택자에서 사용 → 유지)
const CARD =
  "relative flex flex-col items-center justify-center gap-0.5 h-[88px] rounded-lg overflow-hidden transition select-none " +
  "max-[480px]:flex-[0_0_30%] max-[480px]:[scroll-snap-align:start] max-[480px]:h-[78px] land:h-[56px]";

export default function Shop({ shop, gold, onBuy }) {
  return (
    <div data-testid="shop" className="shop-scroll flex-1 min-w-0 grid grid-cols-5 gap-2 max-[480px]:flex max-[480px]:overflow-x-auto max-[480px]:[scroll-snap-type:x_mandatory] max-[480px]:pb-1">
      {shop.map((defId, i) => {
        if (!defId) {
          return (
            <div key={i} data-testid="shop-slot" className={CARD + " border border-dashed border-line"}>
              <span className="font-mono text-[10px] text-dim/70 uppercase tracking-wider">sold</span>
            </div>
          );
        }
        const d = DEFS[defId];
        const poor = gold < d.cost;
        const look =
          "border-[1.5px] border-b-[3px] " + COST_TONE[d.cost] + " bg-[color-mix(in_srgb,var(--acc)_10%,var(--surface))] " +
          (poor ? "poor opacity-45 cursor-not-allowed saturate-50" : "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-12px_var(--acc)]");
        return (
          <div key={i} data-testid="shop-card" data-cost={d.cost} onClick={() => onBuy(i)} className={CARD + " cat-" + d.cat + " " + look}>
            <span className={"absolute top-1 right-1.5 font-mono text-[11px] font-bold " + (poor ? "text-hp" : "text-gold")}>{d.cost}g</span>
            <span className="text-[22px] leading-none text-[var(--acc)] max-[480px]:text-[19px] land:text-[17px]">{d.glyph}</span>
            <span className="text-xs font-semibold text-ink land:text-[11px]">{d.name}</span>
            <span className="font-mono text-[10px] text-muted tabular-nums land:hidden">♥{d.hp} ⚔{d.atk}</span>
          </div>
        );
      })}
    </div>
  );
}
