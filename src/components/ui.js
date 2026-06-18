// 반복되는 Tailwind 클래스 묶음 — 컴포넌트에서 import 해 재사용(DRY). CSS 아님.
export const BTN =
  "font-mono text-xs font-bold rounded-[9px] border border-line2 bg-bg text-ink px-[15px] py-[7px] cursor-pointer transition hover:border-cta hover:text-cta hover:shadow-[0_0_16px_-8px_var(--cta)] focus-visible:outline-2 focus-visible:outline-cta focus-visible:outline-offset-2";

export const BTN_SM = BTN + " !px-[11px] !py-1 !text-[11px]";

export const BTN_PRIMARY =
  "font-mono text-xs font-extrabold rounded-[9px] border border-transparent bg-cta text-[#04141a] px-[15px] py-[7px] cursor-pointer transition shadow-[0_8px_22px_-10px_var(--cta)] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-cta focus-visible:outline-offset-2";

export const BTN_DANGER =
  "font-mono text-[11px] font-bold rounded-[9px] border border-hp/40 text-hp bg-hp/10 px-3 py-1 cursor-pointer transition hover:brightness-110";

export const BTN_DEPLOY =
  "font-mono text-xs font-extrabold rounded-[9px] border border-transparent text-[#04141a] bg-[var(--acc)] px-[15px] py-[7px] cursor-pointer shadow-[0_8px_22px_-10px_var(--acc)] transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none";

export const PANEL = "rounded-2xl border border-line bg-panel";

// 섹션 헤더 ("// 라벨" + 우측 액션)
export const LABEL = "text-xs text-muted mb-2 mx-0.5 flex items-center justify-between font-semibold max-[480px]:text-[11px]";
export const CM = "text-prompt font-bold";
