import React from "react";
import Chip from "./Chip.jsx";

// 벤치 — 보드에 올리기 전 대기 유닛 목록.
export default function Bench({ bench, sel, onClickBench }) {
  return (
    <div data-testid="bench" className="flex flex-wrap gap-2.5 p-3.5 rounded-2xl mb-3 min-h-[90px] border border-line bg-panel items-center max-[480px]:p-2.5 max-[480px]:gap-2">
      {bench.length === 0 && <span className="text-dim text-xs">비어있음 — 아래 상점에서 기물을 사세요</span>}
      {bench.map((u, i) => <Chip key={u.uid} u={u} sel={sel && sel.where === "bench" && sel.i === i} onClick={() => onClickBench(i)} />)}
    </div>
  );
}
