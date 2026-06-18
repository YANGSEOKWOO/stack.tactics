import React from "react";
import Chip from "./Chip.jsx";

// 보드(deploy zone) 그리드. cap 이상 슬롯은 잠금(🔒).
export default function BoardGrid({ board, cap, sel, onClickBoard }) {
  return (
    <div data-testid="board" className="board-grid grid grid-cols-4 gap-2.5 p-3.5 rounded-2xl mb-3.5 border border-line max-[480px]:gap-[7px] max-[480px]:p-2.5">
      {board.map((u, i) => {
        const locked = i >= cap;
        const base = "min-w-0 h-[74px] flex items-center justify-center rounded-[10px] text-base transition duration-100 max-[480px]:h-[62px] ";
        const look = locked
          ? "border-[1.5px] border-line bg-black/20 opacity-50 text-dim"
          : u
            ? ""
            : "border-[1.5px] border-dashed border-line2 bg-white/[0.012] text-dim cursor-pointer hover:border-cta hover:bg-cta/10 hover:text-cta";
        return (
          <div key={i} data-testid={"tile-" + i} className={base + look} onClick={() => onClickBoard(i)}>
            {locked ? "🔒" : u && <Chip u={u} fill sel={sel && sel.where === "board" && sel.i === i} onClick={() => onClickBoard(i)} />}
          </div>
        );
      })}
    </div>
  );
}
