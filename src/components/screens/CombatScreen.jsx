import React from "react";
import { archLayout } from "../../engine/layout.js";
import { frontTierIdx, unitTier, TIER_NAME } from "../../engine/combat.js";
import { BTN_PRIMARY, CM } from "../ui.js";

// 체력 비율 → 체력바 너비/색.
function hpStyle(cur, max) {
  const pct = Math.max(0, Math.round((cur / max) * 100));
  const grad = pct > 50 ? "linear-gradient(90deg,#34d399,#10b981)" : pct > 25 ? "linear-gradient(90deg,#fbbf24,#f59e0b)" : "linear-gradient(90deg,#fb7185,#e11d48)";
  return { width: pct + "%", background: grad };
}

// 전투 페이즈 화면 — 좌: 아키텍처 토폴로지(플레이어), 우: 버그 레인.
export default function CombatScreen({ combat, onNext }) {
  const layout = archLayout(combat.player);
  const exposedTier = frontTierIdx(combat.player);
  return (
    <div data-testid="combat">
      <div className="flex flex-col items-center gap-1 text-xs text-muted mb-2 font-semibold">
        <span><span className={CM}>// </span>테스트 실행 중... tick {combat.tick}</span>
        <span className="text-[11px] text-dim font-normal text-center">버그는 외곽 계층부터 공격 — 안쪽 계층은 앞이 무너져야 노출됩니다</span>
      </div>

      <div className="flex gap-3.5 flex-wrap mt-2 max-[760px]:flex-col">
        <div data-testid="arch" className="arch-grid relative flex-1 min-w-[300px] h-[380px] rounded-2xl border border-line overflow-hidden max-[760px]:min-w-0 max-[760px]:w-full max-[760px]:h-[320px]">
          {exposedTier !== null && (
            <div data-testid="ingress" className="absolute top-2 right-2.5 z-[2] text-[10px] font-bold text-hp bg-hp/10 border border-hp/30 rounded-[7px] px-2 py-[3px]">
              🌐 트래픽 유입 → {TIER_NAME[exposedTier]} 노출
            </div>
          )}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {layout.edges.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} className="flow"
                stroke={e.infra ? "#34d39b" : "#7c8aa5"} strokeWidth="1.4" vectorEffect="non-scaling-stroke" opacity="0.6" />
            ))}
          </svg>
          {layout.placed.map(({ p, x, y }) => {
            const isExposed = p.cur > 0 && unitTier(p) === exposedTier;
            const state = p.cur <= 0
              ? "opacity-20 grayscale"
              : p.hit
                ? "!border-hp bg-hp/15"
                : isExposed
                  ? "exposed shadow-[0_0_0_2px_var(--hp),0_0_18px_-2px_var(--hp)] animate-exposed"
                  : "";
            return (
              <div key={p.uid} data-testid="arch-node"
                className={"node cat-" + p.cat + " absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 w-[78px] px-1 py-1.5 rounded-[10px] border-[1.5px] border-[var(--edge)] bg-[color-mix(in_srgb,var(--acc)_10%,var(--panel))] shadow-[0_6px_18px_-10px_#000] transition " + state}
                style={{ left: x + "%", top: y + "%" }}>
                {p.lastDmg > 0 && <span key={combat.tick} className="absolute -top-1 right-0.5 text-sm font-extrabold text-hp [text-shadow:0_0_8px_var(--hp)] animate-pop">-{p.lastDmg}</span>}
                <span className="text-[18px] text-[var(--acc)]">{p.glyph}</span>
                <span className="text-[10px] font-bold text-[var(--acc)]">{p.name}</span>
                <div className="h-1.5 rounded bg-bg overflow-hidden mt-1 w-full border border-line"><div className="h-full rounded transition-[width] duration-300" style={hpStyle(p.cur, p.hp)} /></div>
              </div>
            );
          })}
        </div>

        <div data-testid="bug-lane" className="w-[220px] rounded-2xl border border-line bg-panel p-[11px] max-[760px]:w-full">
          <div className="text-xs font-bold text-hp mb-2.5">🐛 버그 유입 ({combat.enemy.filter((e) => e.cur > 0).length})</div>
          {combat.enemy.map((u) => (
            <div key={u.uid} className={"relative flex items-center gap-2.5 px-2.5 py-[7px] rounded-[9px] border border-line mb-[7px] bg-tile transition " + (u.cur <= 0 ? "opacity-20 grayscale" : u.hit ? "bg-gold/10" : "")}>
              {u.lastDmg > 0 && <span key={combat.tick} className="absolute -top-1 right-0.5 text-sm font-extrabold text-hp [text-shadow:0_0_8px_var(--hp)] animate-pop">-{u.lastDmg}</span>}
              <span className="text-[18px]">{u.glyph}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold" style={{ color: u.color }}>{u.name}</div>
                <div className="h-1.5 rounded bg-bg overflow-hidden mt-1 w-full border border-line"><div className="h-full rounded transition-[width] duration-300" style={hpStyle(u.cur, u.hp)} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {combat.done && (
        <div className="text-center mt-4">
          <div className={"text-[19px] font-extrabold " + (combat.result === "win" ? "text-emerald-400" : "text-hp")}>
            {combat.result === "win" ? "✓ 빌드 통과" : "✗ 빌드 실패"}
          </div>
          <button className={BTN_PRIMARY + " mt-3"} onClick={onNext}>다음 라운드 ▶</button>
        </div>
      )}
    </div>
  );
}
