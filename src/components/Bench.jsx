import React from "react";
import Chip from "./Chip.jsx";

// 벤치 — 보드에 올리기 전 대기 유닛 목록.
export default function Bench({ bench, sel, onClickBench }) {
  return (
    <div className="bench" data-testid="bench">
      {bench.length === 0 && <span className="empty-hint">비어있음 — 아래 상점에서 기물을 사세요</span>}
      {bench.map((u, i) => <Chip key={u.uid} u={u} sel={sel && sel.where === "bench" && sel.i === i} onClick={() => onClickBench(i)} />)}
    </div>
  );
}
