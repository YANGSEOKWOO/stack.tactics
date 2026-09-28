import React from "react";
import PlayLayout, { TRAY } from "../PlayLayout.jsx";
import EconomyBar from "../EconomyBar.jsx";
import BoardGrid from "../BoardGrid.jsx";
import Bench from "../Bench.jsx";
import Shop from "../Shop.jsx";
import { BTN, BTN_PRIMARY } from "../ui.js";

// 상점 페이즈 — 중앙 보드, 하단 트레이(레벨 · 상점 · 리롤/라운드 시작).
export default function ShopScreen({ game }) {
  return (
    <PlayLayout
      counts={game.counts}
      recipeProg={game.recipeProg}
      onOpenRecipe={game.setModal}
      center={<BoardGrid board={game.board} cap={game.cap} sel={game.sel} onClickBoard={game.clickBoard} />}
      bench={<Bench bench={game.bench} sel={game.sel} onClickBench={game.clickBench} onSell={game.sell} />}
      tray={
        <div className={TRAY}>
          <EconomyBar level={game.level} xp={game.xp} xpNeed={game.xpNeed} onBuyXp={game.buyXp} />
          <div className="w-px bg-line narrow:hidden" />
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 narrow:basis-full narrow:order-first">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted land:hidden narrow:hidden">상점 <span className="font-mono normal-case text-dim">npm install</span></span>
            <Shop shop={game.shop} gold={game.gold} onBuy={game.buy} />
          </div>
          <div className="w-[132px] shrink-0 flex flex-col gap-2 land:w-[108px] land:gap-1.5 justify-end narrow:w-auto narrow:flex-1 narrow:flex-row narrow:items-end">
            <button className={BTN + " w-full"} onClick={game.reroll}>리롤 ↻ 2g</button>
            <button className={BTN_PRIMARY + " w-full !py-3 !text-sm land:!py-2 land:!text-xs narrow:!py-2"} onClick={game.startCombat}>라운드 시작 ▶</button>
          </div>
        </div>
      }
    />
  );
}
