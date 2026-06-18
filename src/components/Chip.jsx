import React from "react";

// 유닛 1개를 표현하는 칩(벤치/보드 공용). 카테고리 색·성급·능력치 표시.
export default function Chip({ u, sel, onClick }) {
  return (
    <div data-testid="unit-chip" data-name={u.name} className={"chip cat-" + u.cat + (u.composite ? " composite" : "") + (sel ? " sel" : "")}
      onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {u.star > 1 && <span className="star">{"★".repeat(u.star)}</span>}
      <span className="g">{u.glyph}</span>
      <span className="nm">{u.name}</span>
      <span className="st">{u.hp}♥ {u.atk}⚔</span>
    </div>
  );
}
