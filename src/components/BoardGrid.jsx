import React from "react";
import HexBoard, { Hex, Piece } from "./HexBoard.jsx";
import { PANEL_HEAD, PANEL_TITLE } from "./ui.js";

// 보드(deploy zone) — TFT식 2.5D 벌집 판. 28칸 어디든 배치하되 동시 배치 수는 cap(=레벨).
// 맨 위(가장 먼) 행이 최전방(버그가 먼저 때림) → 탱커는 앞, 캐리는 뒤.
export default function BoardGrid({ board, cap, sel, onClickBoard }) {
  const used = board.filter(Boolean).length;
  const placing = sel && sel.where === "bench";
  const full = used >= cap;
  return (
    <div className="arena-bg h-full flex flex-col p-3 rounded-2xl border border-line land:p-1.5 land:rounded-xl">
      <div className={PANEL_HEAD}>
        <span className={PANEL_TITLE}>
          보드 <span className={"font-mono normal-case " + (full ? "text-gold" : "text-dim")}>{used}/{cap}기</span>
        </span>
        <span className={"text-[11px] " + (placing ? (full ? "text-gold font-semibold" : "text-cta font-semibold") : "text-dim")}>
          {placing ? (full ? "배치 한도 — 기존 유닛 칸을 눌러 교체" : "배치할 칸을 선택하세요") : sel ? "다른 칸을 눌러 자리 바꾸기" : "▲ 먼 줄이 최전방 · 먼저 맞습니다"}
        </span>
      </div>
      <div className="flex-1 min-h-0 flex">
        <HexBoard
          testId="board"
          renderCell={(i, r) => {
            const u = board[i];
            const selected = sel && sel.where === "board" && sel.i === i;
            const canDrop = placing && (!!u || !full);
            const front = r === 0;
            return (
              <Hex key={i} data-testid={"tile-" + i} onClick={() => onClickBoard(i)}
                className={"cursor-pointer " + (u ? "cat-" + u.cat : "")}
                tile={selected ? "bg-cta" : canDrop ? "bg-cta/45" : front ? "bg-hp/35" : "bg-line2"}
                fill={u
                  ? "bg-[color-mix(in_srgb,var(--acc)_28%,var(--panel2))]"
                  : (front ? "bg-[color-mix(in_srgb,var(--hp)_10%,var(--panel2))]" : "bg-panel2") + " hover:bg-cta/20"}>
                {u && (
                  <div data-testid="unit-chip" data-name={u.name} className="absolute inset-0 [transform-style:preserve-3d]">
                    <Piece glyph={u.glyph} label={u.name} star={u.star}
                      ring={u.composite ? "!border-gold" : ""}
                      innerClass={selected ? "!-translate-y-2 [filter:drop-shadow(0_0_8px_var(--cta))]" : ""} />
                  </div>
                )}
              </Hex>
            );
          }}
        />
      </div>
    </div>
  );
}
