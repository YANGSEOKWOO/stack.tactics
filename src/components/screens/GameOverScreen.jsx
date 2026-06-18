import React from "react";
import { BTN_PRIMARY } from "../ui.js";

// 게임오버 화면 — 도달 스테이지 + 재시작.
export default function GameOverScreen({ stage, onRestart }) {
  return (
    <div className="text-center py-14">
      <div className="text-[30px] font-extrabold font-display tracking-tight text-hp [text-shadow:0_0_26px_color-mix(in_srgb,var(--hp)_50%,transparent)]">// PRODUCTION DOWN</div>
      <div className="mt-2.5 text-muted">스테이지 {stage}까지 도달했어.</div>
      <button className={BTN_PRIMARY + " mt-[18px]"} onClick={onRestart}>재배포 ↻</button>
    </div>
  );
}
