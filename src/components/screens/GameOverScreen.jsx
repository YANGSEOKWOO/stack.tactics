import React from "react";

// 게임오버 화면 — 도달 스테이지 + 재시작.
export default function GameOverScreen({ stage, onRestart }) {
  return (
    <div className="over">
      <div className="t">// PRODUCTION DOWN</div>
      <div className="s">스테이지 {stage}까지 도달했어.</div>
      <button className="btn primary" style={{ marginTop: 18 }} onClick={onRestart}>재배포 ↻</button>
    </div>
  );
}
