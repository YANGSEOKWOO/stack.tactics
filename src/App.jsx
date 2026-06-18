import React from "react";
import { useGame } from "./state/useGame.js";
import TopBar from "./components/TopBar.jsx";
import RecipeModal from "./components/RecipeModal.jsx";
import ShopScreen from "./components/screens/ShopScreen.jsx";
import CombatScreen from "./components/screens/CombatScreen.jsx";
import GameOverScreen from "./components/screens/GameOverScreen.jsx";

// 구성 루트 — 모든 상태/로직은 useGame 훅에, 표현은 화면 컴포넌트에 위임한다.
// 새 화면/시스템을 붙일 땐: data(수치) → engine(로직) → state(액션) → components(표현) 순으로 확장.
export default function App() {
  const game = useGame();
  return (
    <div className="tt">
      <TopBar hp={game.hp} gold={game.gold} stage={game.stage} />

      <div className="tagline"><span className="cm">// </span>HTML·CSS·JS를 모아 배포하고, 시너지를 쌓아 버그를 막아내세요.</div>

      {game.toast && <div className="toast">{game.toast}</div>}

      {game.phase === "gameover" ? (
        <GameOverScreen stage={game.stage} onRestart={game.restart} />
      ) : game.phase === "combat" ? (
        <CombatScreen combat={game.combat} onNext={game.nextRound} />
      ) : (
        <ShopScreen game={game} />
      )}

      {game.modal && (
        <RecipeModal recipe={game.modal} board={game.board} onClose={() => game.setModal(null)} onDeploy={game.deploy} />
      )}

      <div className="footer">
        같은 기물 3개 → 자동 ★★ (합성 유닛도 별업) · 카테고리 수만큼 시너지 발동 · 재료를 보드에 모아 레시피 모달에서 deploy · 전투는 아키텍처 다이어그램으로 버그와 싸움 · 경험치로 레벨업 → 보드 칸·고급 기물 확률 ↑
      </div>
    </div>
  );
}
