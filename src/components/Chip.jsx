import React from "react";

// 유닛 1개를 표현하는 칩(보드/벤치 공용). 부모 슬롯 크기를 가득 채운다.
// cat-* 가 --acc/--soft/--edge 를 공급한다.
export default function Chip({ u, sel, onClick }) {
  const cls =
    "cat-" + u.cat +
    " relative w-full h-full min-w-0 flex flex-col items-center justify-center gap-0.5 rounded-lg border-[1.5px] cursor-pointer select-none" +
    " border-[var(--edge)] bg-[color-mix(in_srgb,var(--acc)_12%,var(--surface))]" +
    " transition-[transform,box-shadow,border-color] duration-100" +
    " hover:-translate-y-0.5 hover:border-[var(--acc)] hover:shadow-[0_8px_20px_-10px_var(--acc)]" +
    (u.composite ? " border-[var(--acc)] shadow-[inset_0_0_0_1px_var(--edge),0_0_18px_-8px_var(--acc)]" : "") +
    (sel ? " !border-cta ring-2 ring-cta ring-offset-2 ring-offset-panel -translate-y-0.5" : "");
  return (
    <div data-testid="unit-chip" data-name={u.name} className={cls} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {u.star > 1 && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 rounded-full bg-gold text-[9px] leading-[15px] font-bold text-surface whitespace-nowrap shadow-[0_2px_8px_-2px_var(--gold)]">
          {"★".repeat(u.star)}
        </span>
      )}
      <span className="text-[20px] leading-none text-[var(--acc)] max-[480px]:text-[17px] land:text-[16px]">{u.glyph}</span>
      <span className="text-[11px] font-semibold text-ink max-w-full px-1 truncate max-[480px]:text-[10px] land:text-[10px] land:leading-tight">{u.name}</span>
      <span className="font-mono text-[10px] text-muted whitespace-nowrap tabular-nums max-[480px]:hidden land:hidden">
        <span className="text-hp/80">♥</span>{u.hp} <span className="text-gold/90">⚔</span>{u.atk}
      </span>
    </div>
  );
}
