import React from "react";
import { BOARD_ROWS, BOARD_COLS } from "../data/economy.js";

// 헥스 칸 하나(바닥 평면). tile/fill 은 육각 타일 색, children 은 그 위에 서는 기물(<Piece>).
// ⚠ slot 은 preserve-3d 체인의 일부 — className 에 filter/opacity/overflow 계열 유틸 금지.
export function Hex({ tile = "", fill = "", className = "", style, children, slotRef, ...rest }) {
  return (
    <div ref={slotRef} className={"hex-slot " + className} style={style} {...rest}>
      <div className={"hex-clip hex-tile transition-colors " + tile}>
        <div className={"hex-clip absolute inset-[2.5px] transition-colors " + fill} />
      </div>
      {children}
    </div>
  );
}

// 칸 위에 서는 게임 말 — 발밑 그림자 + 빌보드(별 · HP 바 · 토큰 · 이름).
//   pieceClass : .piece 에 (사망 시 fx-fall/fx-fallen)
//   innerClass : .piece-inner 에 (피격 fx-hit-*, 선택 들어올림)
//   tokenRef   : 투사체 조준점(토큰 중심)
export function Piece({ glyph, label, star = 1, hp, tokenRef, round, ring = "", pieceClass = "", innerClass = "", innerStyle, children }) {
  return (
    <>
      <span className="hex-shadow" />
      <div className={"piece " + pieceClass}>
        <div className={"piece-inner " + innerClass} style={innerStyle}>
          {star > 1 && (
            <span className="mb-px text-[clamp(8px,calc(var(--hw)*0.14),12px)] leading-none text-gold [text-shadow:0_0_6px_var(--gold),0_1px_0_#000]">
              {"★".repeat(star)}
            </span>
          )}
          {hp}
          <div ref={tokenRef} className={"piece-token " + (round ? "rounded-full " : "rounded-[30%] ") + ring}>
            <span className="relative z-[1] leading-none text-[calc(var(--hw)*0.3)]">{glyph}</span>
          </div>
          {label && (
            <span className="mt-[5px] px-1 rounded bg-black/60 text-white font-semibold leading-[1.35] whitespace-nowrap text-[clamp(7px,calc(var(--hw)*0.13),10px)] land:hidden">
              {label}
            </span>
          )}
          {children}
        </div>
      </div>
    </>
  );
}

// 2.5D 벌집 보드 — rows×cols, 홀수 행 반 칸 들여쓰기, 바닥을 원근으로 눕힌다. 행 0(맨 위·가장 먼 쪽)이 전방.
// renderCell(index, row, col) 이 칸마다 <Hex> 를 돌려준다. 크기·기울기는 index.css 의 .hex-stage/.hex-grid.
export default function HexBoard({ renderCell, testId, rows = BOARD_ROWS, cols = BOARD_COLS, className = "" }) {
  return (
    <div className={"hex-wrap flex-1 min-h-0 " + className}>
      <div className="hex-stage" style={{ "--cols": cols, "--rows": rows }}>
        <div data-testid={testId} className="hex-grid">
          {Array.from({ length: rows }, (_, r) => (
            <div key={r} className="hex-row flex"
              style={{ marginLeft: r % 2 ? "calc(var(--hw) / 2)" : 0, marginTop: r ? "calc(var(--hw) * -0.2887)" : 0 }}>
              {Array.from({ length: cols }, (_, c) => renderCell(r * cols + c, r, c))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
