import React from "react";

const rk = "text-[9.5px] font-bold uppercase tracking-wider text-dim max-[480px]:hidden";
const pill = "inline-flex items-baseline gap-1.5 px-2.5 py-1 rounded-lg border bg-bg/40 text-[13px] font-bold tabular-nums max-[480px]:px-2";

// 상단 타이틀 바 + 자원 readout(체력·골드·스테이지) + 다크/라이트 토글.
export default function TopBar({ hp, gold, stage, theme, onToggleTheme }) {
  return (
    <div className="flex items-center justify-between gap-2.5 gap-y-2 px-3.5 py-2.5 rounded-xl border border-line bg-panel2 flex-wrap">
      <div className="flex items-center">
        <span className="flex gap-[7px] mr-2.5">
          <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f56] shadow-[0_0_8px_-1px_#ff5f56]" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#ffbd2e] shadow-[0_0_8px_-1px_#ffbd2e]" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#27c93f] shadow-[0_0_8px_-1px_#27c93f]" />
        </span>
        <span className="font-display font-bold tracking-tight text-[17px] text-ink max-[480px]:text-[15px]">stack.tactics</span>
        <span className="inline-block w-2 h-[15px] bg-prompt rounded-[1px] ml-1.5 align-[-2px] animate-blink shadow-[0_0_10px_var(--prompt)]" />
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <span data-testid="hp" className={pill + " text-hp border-hp/30"}><span className={rk}>hp</span> {hp}</span>
        <span data-testid="gold" className={pill + " text-gold border-gold/30"}><span className={rk}>gold</span> {gold}g</span>
        <span data-testid="stage" className={pill + " text-cta border-cta/25"}><span className={rk}>stage</span> {stage}</span>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
          title={theme === "dark" ? "라이트 모드" : "다크 모드"}
          className="w-8 h-8 grid place-items-center rounded-lg border border-line2 bg-bg/40 text-muted cursor-pointer transition hover:text-cta hover:border-cta focus-visible:outline-2 focus-visible:outline-cta focus-visible:outline-offset-2"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </div>
  );
}
