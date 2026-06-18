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
    <div className="tt-bg font-mono text-ink text-[13.5px] leading-relaxed w-full max-w-[1060px] mx-auto p-5 rounded-2xl border border-line shadow-[0_40px_120px_-40px_rgba(0,0,0,0.55)] animate-boot max-[480px]:p-3">
      <TopBar hp={game.hp} gold={game.gold} stage={game.stage} theme={theme} onToggleTheme={toggle} />

      <div className="mt-3 mb-4 mx-0.5 text-[12.5px] text-muted flex items-center gap-2 flex-wrap">
        <span className="text-prompt font-bold">~/stack</span>
        <span className="text-cta font-extrabold">$</span>
        <span className="text-ink font-semibold">compose --deploy</span>
        <span className="inline-block w-2 h-[15px] bg-prompt rounded-[1px] align-[-2px] animate-blink shadow-[0_0_10px_var(--prompt)]" />
        <span className="text-dim max-[480px]:basis-full">// HTML·CSS·JS를 모아 배포하고 시너지를 쌓아 버그를 막아내세요</span>
      </div>

      {game.toast && (
        <div className="mb-3 px-3.5 py-2.5 rounded-[10px] text-center text-[13px] text-prompt font-bold border border-prompt/30 bg-prompt/10 shadow-[0_0_24px_-10px_var(--prompt)] animate-toast">
          {game.toast}
        </div>
      )}

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

      <div className="mt-3.5 border-t border-line pt-3 text-[11px] leading-[1.8] text-dim">
        같은 기물 3개 → 자동 ★★ (합성 유닛도 별업) · 카테고리 수만큼 시너지 발동 · 재료를 보드에 모아 레시피 모달에서 deploy · 전투는 아키텍처 다이어그램으로 버그와 싸움 · 경험치로 레벨업 → 보드 칸·고급 기물 확률 ↑
      </div>
    </div>
  );
}
