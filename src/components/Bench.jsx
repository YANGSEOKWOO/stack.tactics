import React from "react";
import Chip from "./Chip.jsx";
import { BENCH_SLOTS } from "../data/economy.js";
import { BTN_DANGER, PANEL_TITLE } from "./ui.js";

// 벤치 — 보드에 올리기 전 대기 유닛. 고정 BENCH_SLOTS 칸.
// 보드 유닛을 선택한 상태에서 빈 칸을 누르면 벤치로 회수. onSell 이 있으면 선택 시 판매 버튼 노출.
export default function Bench({ bench, sel, onClickBench, onSell }) {
  const slots = Array.from({ length: BENCH_SLOTS }, (_, i) => bench[i] || null);
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-line bg-panel narrow:flex-col narrow:items-stretch land:py-1 land:px-2 land:gap-2 land:rounded-xl">
      <div className="flex items-center justify-between gap-2 w-[88px] shrink-0 narrow:w-auto land:w-[64px]">
        <span className={PANEL_TITLE}>벤치 <span className="font-mono text-dim">{bench.length}/{BENCH_SLOTS}</span></span>
        {sel && onSell && <button className={BTN_DANGER + " hidden narrow:inline-block"} onClick={onSell}>판매</button>}
      </div>
      <div data-testid="bench" className="flex-1 grid grid-cols-9 gap-2 land:gap-1.5 max-[480px]:grid-cols-5 max-[480px]:gap-1.5">
        {slots.map((u, i) => (
          <div key={u ? u.uid : "e" + i}
            className={"h-[70px] min-w-0 rounded-lg max-[480px]:h-14 land:h-[42px] " + (u ? "" : "border border-dashed border-line " + (sel && sel.where === "board" ? "cursor-pointer border-cta/60 bg-cta/5" : ""))}
            onClick={() => !u && sel && sel.where === "board" && onClickBench(i)}>
            {u && <Chip u={u} sel={sel && sel.where === "bench" && sel.i === i} onClick={() => onClickBench(i)} />}
          </div>
        ))}
      </div>
      {onSell && (
        <div className="w-[72px] shrink-0 flex justify-end narrow:hidden land:w-[52px]">
          {sel ? <button className={BTN_DANGER} onClick={onSell}>판매</button> : <span className="text-[10px] text-dim text-right leading-tight land:hidden">선택 후<br />판매 가능</span>}
        </div>
      )}
    </div>
  );
}
