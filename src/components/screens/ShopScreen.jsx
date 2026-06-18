import React from "react";
import EconomyBar from "../EconomyBar.jsx";
import BoardGrid from "../BoardGrid.jsx";
import SynergyBar from "../SynergyBar.jsx";
import Bench from "../Bench.jsx";
import RecipeGrid from "../RecipeGrid.jsx";
import Shop from "../Shop.jsx";

// 상점 페이즈 화면 — 경제·보드·시너지·벤치·레시피·상점을 조합한다.
export default function ShopScreen({ game }) {
  return (
    <div>
      <EconomyBar
        level={game.level} xp={game.xp} xpNeed={game.xpNeed} gold={game.gold}
        streak={game.streak} streakType={game.streakType} onBuyXp={game.buyXp}
      />

      <div className="label">
        <span><span className="cm">// </span>보드 · deploy zone <span style={{ color: "#cbd5e1" }}>({game.board.filter(Boolean).length}/{game.cap})</span></span>
        <button className="btn primary" onClick={game.startCombat}>라운드 시작 ▶</button>
      </div>
      <BoardGrid board={game.board} cap={game.cap} sel={game.sel} onClickBoard={game.clickBoard} />

      <SynergyBar counts={game.counts} />

      <div className="label"><span><span className="cm">// </span>벤치</span></div>
      <Bench bench={game.bench} sel={game.sel} onClickBench={game.clickBench} />

      {game.sel && (
        <div className="selbar">
          <span>선택됨 — 보드 칸을 탭해 배치, 또는</span>
          <button className="btn danger" onClick={game.sell}>판매</button>
        </div>
      )}

      <div className="label"><span><span className="cm">// </span>합성 레시피 — 카드를 누르면 설명, 재료를 보드에 모으면 deploy</span></div>
      <RecipeGrid recipeProg={game.recipeProg} onOpen={game.setModal} />

      <div className="label">
        <span><span className="cm">// </span>상점 · npm install</span>
        <button className="btn" onClick={game.reroll}>리롤 ↻ 2g</button>
      </div>
      <Shop shop={game.shop} gold={game.gold} onBuy={game.buy} />
    </div>
  );
}
