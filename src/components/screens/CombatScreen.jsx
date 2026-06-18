import React from "react";
import { archLayout } from "../../engine/layout.js";
import { frontTierIdx, unitTier, TIER_NAME } from "../../engine/combat.js";

// 체력 비율 → 체력바 너비/색.
function hpStyle(cur, max) {
  const pct = Math.max(0, Math.round((cur / max) * 100));
  const grad = pct > 50 ? "linear-gradient(90deg,#34d399,#10b981)" : pct > 25 ? "linear-gradient(90deg,#fbbf24,#f59e0b)" : "linear-gradient(90deg,#fb7185,#e11d48)";
  return { width: pct + "%", background: grad };
}

// 전투 페이즈 화면 — 좌: 아키텍처 다이어그램(플레이어), 우: 버그 레인.
export default function CombatScreen({ combat, onNext }) {
  const layout = archLayout(combat.player);
  const exposedTier = frontTierIdx(combat.player);
  return (
    <div data-testid="combat">
      <div className="label" style={{ justifyContent: "center", flexDirection: "column", gap: 4 }}>
        <span><span className="cm">// </span>테스트 실행 중... tick {combat.tick}</span>
        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>
          버그는 외곽 계층부터 공격 — 안쪽 계층은 앞이 무너져야 노출됩니다
        </span>
      </div>
      <div className="combatwrap">
        <div className="arch" data-testid="arch">
          {exposedTier !== null && (
            <div className="ingress" data-testid="ingress">🌐 트래픽 유입 → {TIER_NAME[exposedTier]} 노출</div>
          )}
          <svg className="archsvg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {layout.edges.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} className="flow"
                stroke={e.infra ? "#0f9d76" : "#94a3b8"} strokeWidth="1.4"
                vectorEffect="non-scaling-stroke" opacity="0.6" />
            ))}
          </svg>
          {layout.placed.map(({ p, x, y }) => (
            <div key={p.uid} data-testid="arch-node" className={"node cat-" + p.cat + (p.cur <= 0 ? " dead" : "") + (p.hit ? " hit" : "") + (p.cur > 0 && unitTier(p) === exposedTier ? " exposed" : "")} style={{ left: x + "%", top: y + "%" }}>
              {p.lastDmg > 0 && <span key={combat.tick} className="dmgpop">-{p.lastDmg}</span>}
              <span className="ng">{p.glyph}</span>
              <span className="nn">{p.name}</span>
              <div className="hpbar"><div className="hpfill" style={hpStyle(p.cur, p.hp)} /></div>
            </div>
          ))}
        </div>
        <div className="lane" data-testid="bug-lane">
          <div className="lh">🐛 버그 유입 ({combat.enemy.filter((e) => e.cur > 0).length})</div>
          {combat.enemy.map((u) => (
            <div key={u.uid} className={"bug" + (u.cur <= 0 ? " dead" : "") + (u.hit ? " hit" : "")}>
              {u.lastDmg > 0 && <span key={combat.tick} className="dmgpop">-{u.lastDmg}</span>}
              <span className="bg">{u.glyph}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="bn" style={{ color: u.color }}>{u.name}</div>
                <div className="hpbar"><div className="hpfill" style={hpStyle(u.cur, u.hp)} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {combat.done && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: combat.result === "win" ? "#059669" : "#dc2626" }}>
            {combat.result === "win" ? "✓ 빌드 통과" : "✗ 빌드 실패"}
          </div>
          <button className="btn primary" style={{ marginTop: 11 }} onClick={onNext}>다음 라운드 ▶</button>
        </div>
      )}
    </div>
  );
}
