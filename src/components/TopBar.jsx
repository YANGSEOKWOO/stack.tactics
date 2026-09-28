import React from "react";
import { START_HP } from "../data/economy.js";

const lbl = "text-[10px] font-bold uppercase tracking-wider text-dim";
const stat = "flex items-center gap-2 px-3 h-9 rounded-lg border border-line bg-bg/50 max-[480px]:px-2 land:h-7 land:px-2";

// 상단 HUD — 타이틀 + 체력 바 + 골드(이자·연승) + 스테이지 + 테마 토글.
export default function TopBar({ hp, gold, stage, interest, streak, streakType, theme, onToggleTheme }) {
  const hpPct = Math.max(0, Math.min(100, (hp / START_HP) * 100));
  const hpTone = hpPct > 50 ? "bg-emerald-500" : hpPct > 25 ? "bg-amber-500" : "bg-hp";
  return (
    <header className="flex items-center gap-2.5 flex-wrap px-3 py-2 rounded-xl border border-line bg-panel2 land:flex-nowrap land:py-1 land:px-2 land:gap-1.5">
      <div className="flex items-center mr-auto">
        <span className="flex gap-1.5 mr-2.5 max-[480px]:hidden land:hidden">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </span>
        <span className="font-display font-bold tracking-tight text-[17px] text-ink land:text-sm">stack.tactics</span>
      </div>

      <div data-testid="hp" className={stat + " min-w-[150px] narrow:min-w-0 narrow:basis-full narrow:order-last"}>
        <span className={lbl}>hp</span>
        <div className="flex-1 h-2 rounded-full bg-line overflow-hidden min-w-12">
          <div className={"h-full rounded-full transition-[width] duration-500 " + hpTone} style={{ width: hpPct + "%" }} />
        </div>
        <span className="font-mono text-[13px] font-bold text-ink tabular-nums">{hp}</span>
      </div>

      <div className={stat}>
        <span data-testid="gold" className="font-mono text-[13px] font-bold text-gold tabular-nums">
          <span className={lbl + " mr-1.5 max-[480px]:hidden"}>gold</span>{gold}g
        </span>
        <span className="text-[11px] text-muted whitespace-nowrap">
          이자 +{interest}
          {streak >= 2 && (
            <span className={"font-bold " + (streakType === "win" ? "text-emerald-500" : "text-hp")}>
              {" · "}{streakType === "win" ? "연승" : "연패"} {streak}
            </span>
          )}
        </span>
      </div>

      <div data-testid="stage" className={stat}>
        <span className={lbl}>stage</span> <span className="font-mono text-[13px] font-bold text-cta tabular-nums">{stage}</span>
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
        title={theme === "dark" ? "라이트 모드" : "다크 모드"}
        className="w-9 h-9 land:w-7 land:h-7 grid place-items-center rounded-lg border border-line bg-bg/50 text-muted cursor-pointer transition hover:text-cta hover:border-cta focus-visible:outline-2 focus-visible:outline-cta focus-visible:outline-offset-2"
      >
        {theme === "dark" ? "☀" : "☾"}
      </button>
    </header>
  );
}
