// 반복되는 Tailwind 클래스 묶음 — 컴포넌트에서 import 해 재사용(DRY). CSS 아님.
const FOCUS = " focus-visible:outline-2 focus-visible:outline-cta focus-visible:outline-offset-2";

export const BTN =
  "font-mono text-xs font-bold whitespace-nowrap rounded-[9px] border border-line2 bg-bg text-ink px-[15px] py-[7px] cursor-pointer transition hover:border-cta hover:text-cta hover:shadow-[0_0_16px_-8px_var(--cta)]" + FOCUS;

export const BTN_SM = BTN + " !px-[11px] !py-1 !text-[11px]";

export const BTN_PRIMARY =
  "font-mono text-xs font-extrabold whitespace-nowrap rounded-[9px] border border-transparent bg-cta text-[#04141a] px-[15px] py-[7px] cursor-pointer transition shadow-[0_8px_22px_-10px_var(--cta)] hover:brightness-110" + FOCUS;

export const BTN_DANGER =
  "font-mono text-[11px] font-bold whitespace-nowrap rounded-[9px] border border-hp/40 text-hp bg-hp/10 px-3 py-1 cursor-pointer transition hover:brightness-110";

export const BTN_DEPLOY =
  "font-mono text-xs font-extrabold rounded-[9px] border border-transparent text-[#04141a] bg-[var(--acc)] px-[15px] py-[7px] cursor-pointer shadow-[0_8px_22px_-10px_var(--acc)] transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none";

export const PANEL = "rounded-2xl border border-line bg-panel";

// 패널 헤더 ("라벨" + 우측 보조 정보/액션)
export const PANEL_HEAD = "flex items-center justify-between gap-2 mb-2 min-h-6 land:mb-1 land:min-h-0";
export const PANEL_TITLE = "text-[11px] font-bold uppercase tracking-[0.08em] text-muted";

// 상점 코스트 등급 색 (TFT 관례: 1 회색 · 2 초록 · 3 파랑 · 4 보라)
export const COST_TONE = {
  1: "text-slate-500 dark:text-slate-300 border-slate-400/50",
  2: "text-emerald-600 dark:text-emerald-400 border-emerald-500/60",
  3: "text-sky-600 dark:text-sky-400 border-sky-500/60",
  4: "text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/60",
};
