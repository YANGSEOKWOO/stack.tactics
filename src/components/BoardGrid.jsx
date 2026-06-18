import React from "react";
import Chip from "./Chip.jsx";

// 보드(deploy zone) 그리드. cap 이상 슬롯은 잠금(🔒).
export default function BoardGrid({ board, cap, sel, onClickBoard }) {
  return (
    <div className="board" data-testid="board">
      {board.map((u, i) => (
        <div key={i} data-testid={"tile-" + i} className={"tile" + (i >= cap ? " locked" : u ? "" : " empty")} onClick={() => onClickBoard(i)}>
          {i >= cap ? "🔒" : u && <Chip u={u} sel={sel && sel.where === "board" && sel.i === i} onClick={() => onClickBoard(i)} />}
        </div>
      ))}
    </div>
  );
}
