import React from "react";
import { useGame } from "./state/useGame.js";
import { useTheme } from "./state/useTheme.js";
import TopBar from "./components/TopBar.jsx";
import RecipeModal from "./components/RecipeModal.jsx";
import ShopScreen from "./components/screens/ShopScreen.jsx";
import CombatScreen from "./components/screens/CombatScreen.jsx";
import GameOverScreen from "./components/screens/GameOverScreen.jsx";

// 구성 루트 — 모든 상태/로직은 useGame 훅에, 표현은 화면 컴포넌트에 위임한다.
// 새 화면/시스템을 붙일 땐: data(수치) → engine(로직) → state(액션) → components(표현) 순으로 확장.
export default function App() {
  const game = useGame();
  const { theme, toggle } = useTheme();
  return (
    <div className="tt-bg text-ink text-[13px] leading-relaxed w-full max-w-[1180px] mx-auto p-4 rounded-2xl border border-line shadow-[0_40px_120px_-40px_rgba(0,0,0,0.55)] animate-boot max-[480px]:p-2 max-[480px]:rounded-none max-[480px]:border-0 land:h-dvh land:max-w-none land:flex land:flex-col land:overflow-hidden land:rounded-none land:border-0 land:py-1.5 land:pl-[max(6px,env(safe-area-inset-left))] land:pr-[max(6px,env(safe-area-inset-right))]">
      <TopBar
        hp={game.hp} gold={game.gold} stage={game.stage} interest={game.interest}
        streak={game.streak} streakType={game.streakType} theme={theme} onToggleTheme={toggle}
      />

      <div className="hidden narrow:block mt-2 text-center text-[11px] text-dim">📱 가로로 돌리면 TFT처럼 한 화면에서 플레이할 수 있어요</div>

      {game.toast && (
        <div role="status" className="fixed top-4 left-1/2 -translate-x-1/2 z-40 max-w-[90vw] px-4 py-2.5 rounded-xl text-center text-[13px] font-semibold text-ink border border-cta/40 bg-surface shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5),0_0_24px_-12px_var(--cta)] animate-toast">
          {game.toast}
        </div>
      )}

      {game.phase === "gameover" ? (
        <GameOverScreen stage={game.stage} onRestart={game.restart} />
      ) : game.phase === "combat" ? (
        <CombatScreen game={game} />
      ) : (
        <ShopScreen game={game} />
      )}

      {game.modal && (
        <RecipeModal recipe={game.modal} board={game.board} onClose={() => game.setModal(null)} onDeploy={game.deploy} />
      )}
    </div>
  );
}
