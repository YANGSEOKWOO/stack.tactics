import React from "react";

// 유닛 1개를 표현하는 칩(벤치/보드 공용). cat-* 가 --acc/--soft/--edge 를 공급한다.
// fill=true 면 보드 타일을 가득 채운다.
export default function Chip({ u, sel, onClick, fill }) {
  const size = fill ? "w-full h-full" : "w-[74px] h-[72px] max-[480px]:w-16 max-[480px]:h-16";
  const cls =
    "cat-" + u.cat + " " + size +
    " relative flex flex-col items-center justify-center gap-[3px] rounded-xl border-[1.5px] cursor-pointer" +
    " border-[var(--edge)] bg-[linear-gradient(180deg,var(--soft),rgba(0,0,0,0.18))]" +
    " transition-[transform,box-shadow,border-color] duration-100" +
    " hover:-translate-y-[3px] hover:border-[var(--acc)] hover:shadow-[0_10px_22px_-10px_var(--acc),0_0_18px_-8px_var(--acc)]" +
    (u.composite ? " shadow-[0_0_0_1px_var(--acc),0_0_22px_-8px_var(--acc)]" : "") +
    (sel ? " !border-cta shadow-[0_0_0_2px_var(--cta),0_0_22px_-6px_var(--cta)]" : "");
  return (
    <div data-testid="unit-chip" data-name={u.name} className={cls} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {u.star > 1 && (
        <span className="absolute -top-[9px] right-px text-xs text-gold [text-shadow:0_0_8px_var(--gold)]">{"★".repeat(u.star)}</span>
      )}
      <span className="text-[20px] leading-none text-[var(--acc)] [filter:drop-shadow(0_0_6px_var(--soft))]">{u.glyph}</span>
      <span className="text-[11px] font-bold text-[var(--acc)] max-w-full overflow-hidden text-ellipsis max-[480px]:text-[10px]">{u.name}</span>
      <span className="text-[10px] text-muted whitespace-nowrap tabular-nums">{u.hp}♥ {u.atk}⚔</span>
    </div>
  );
}
