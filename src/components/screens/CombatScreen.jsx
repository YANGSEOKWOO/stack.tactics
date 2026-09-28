import React, { useLayoutEffect, useRef, useState } from "react";
import PlayLayout, { TRAY } from "../PlayLayout.jsx";
import Bench from "../Bench.jsx";
import HexBoard, { Hex, Piece } from "../HexBoard.jsx";
import { BOARD_ROWS, BOARD_COLS } from "../../data/economy.js";
import { frontRow, unitRow, rowName, MAX_TICKS } from "../../engine/combat.js";
import { BTN_PRIMARY } from "../ui.js";

// 한 틱(650ms) 안의 모션 타임라인(ms). side "p" = 아군 공격, "e" = 버그 공격.
// 돌진 → 투사체 발사 → 착탄(피격 흔들림·섬광·데미지 숫자·HP 감소) 순으로 이어진다.
const LUNGE_AT = { p: 0, e: 170 };
const SHOT_AT = { p: 80, e: 250 };
const HIT_AT = { p: 270, e: 440 };
const HEAL_AT = 560;
// 아레나 = 적 진영 ENEMY_ROWS 행 + 아군 BOARD_ROWS 행을 한 바닥에. 바닥 기울기 보정(cos 52° ≈ 0.62).
const ENEMY_ROWS = 2;
const TILT_COS = 0.62;

// 체력 비율 → 체력바 너비/색. delay 로 착탄 시점에 맞춰 줄어든다.
function hpStyle(cur, max, delay) {
  const pct = Math.max(0, Math.round((cur / max) * 100));
  const bg = pct > 50 ? "#10b981" : pct > 25 ? "#f59e0b" : "#e11d48";
  return { width: pct + "%", background: bg, transition: `width 260ms ease-out ${delay}ms` };
}
const HpBar = ({ u, delay }) => (
  <div className="piece-hp"><div className="h-full" style={hpStyle(u.cur, u.hp, delay)} /></div>
);

// 데미지/회복 숫자. 큰 타격(최대 체력 20%↑)은 더 크게. 호출부에서 key={tick} 으로 매 틱 재마운트 → 애니메이션 재시작.
function Num({ value, max, heal, at }) {
  const big = !heal && value >= max * 0.2;
  return (
    <span style={{ "--hd": at + "ms" }}
      className={"fx-num pointer-events-none absolute left-1/2 -top-3 z-[4] font-mono font-extrabold whitespace-nowrap [text-shadow:0_1px_0_#000,0_0_8px_currentColor] " +
        (heal ? "text-emerald-400 text-[12px]" : big ? "text-[#ffd166] text-[18px]" : "text-white text-[14px]")}>
      {heal ? "+" + value : "-" + value}{big && "!"}
    </span>
  );
}

// 버그를 적 진영에 세운다: 전선에 가까운 행부터 가운데 정렬로 채움. (표현 전용 좌표)
function placeBugs(enemy) {
  const map = new Map();
  const put = (list, row) => {
    const start = Math.floor((BOARD_COLS - list.length) / 2);
    list.forEach((b, k) => map.set(row * BOARD_COLS + start + k, b));
  };
  put(enemy.slice(0, BOARD_COLS), ENEMY_ROWS - 1);
  put(enemy.slice(BOARD_COLS, BOARD_COLS * 2), 0);
  return map;
}

// 중앙 전투 영역 — 2.5D 바닥 하나에 위(먼 쪽) 버그 진영, 아래 아군 벌집. 아군 첫 줄이 최전방.
function CombatArena({ combat }) {
  const arenaRef = useRef(null);
  const tokens = useRef(new Map());
  const reg = (uid) => (el) => { if (el) tokens.current.set(uid, el); else tokens.current.delete(uid); };
  const [fx, setFx] = useState({ tick: -1, shots: [], sparks: [], lunge: {} });

  // 틱마다 이벤트(src→dst)를 실제 화면 좌표(토큰 중심)로 바꿔 돌진 벡터·투사체·스파크를 만든다(페인트 전).
  useLayoutEffect(() => {
    const root = arenaRef.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const center = (uid) => {
      const el = tokens.current.get(uid);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    };
    const byUid = new Map([...combat.player, ...combat.enemy].map((u) => [u.uid, u]));
    const shots = [], sparks = new Map(), lunge = {};
    (combat.events || []).forEach((ev, k) => {
      const a = center(ev.src), b = center(ev.dst);
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
      const reach = Math.min(24, len * 0.3);
      // 돌진은 바닥 평면에서 → 화면 y 는 기울기만큼 늘려 준다
      if (!lunge[ev.src]) lunge[ev.src] = { x: (dx / len) * reach, y: ((dy / len) * reach) / TILT_COS, side: ev.side };
      const src = byUid.get(ev.src);
      const color = ev.side === "p" ? `var(--cat-${src.cat})` : src.color;
      shots.push({ k, x: a.x, y: a.y, dx, dy, rot: (Math.atan2(dy, dx) * 180) / Math.PI, color, at: SHOT_AT[ev.side] + (k % 4) * 12 });
      if (!sparks.has(ev.dst)) sparks.set(ev.dst, { x: b.x, y: b.y, color, at: HIT_AT[ev.side] });
    });
    setFx({ tick: combat.tick, shots, sparks: [...sparks.values()], lunge });
  }, [combat.tick]);

  const fresh = fx.tick === combat.tick;
  const par = combat.tick % 2 ? "a" : "b";
  const exposedRow = frontRow(combat.player);
  const players = new Map(combat.player.map((p) => [(p.row + ENEMY_ROWS) * BOARD_COLS + p.col, p]));
  const bugs = placeBugs(combat.enemy);
  const aliveBugs = combat.enemy.filter((e) => e.cur > 0).length;
  const anyDied = combat.player.some((u) => u.died) || combat.enemy.some((u) => u.died);

  // 칸(slot) 모션: 돌진 벡터 + 피격/사망 타이밍(--hd, 자식 piece 들이 상속)
  const slotMotion = (u, hitAt) => {
    const L = fresh && fx.lunge[u.uid];
    return {
      cls: L ? " fx-lunge-" + par : "",
      style: { "--hd": hitAt + "ms", ...(L && { "--lx": L.x + "px", "--ly": L.y + "px", animationDelay: LUNGE_AT[L.side] + "ms" }) },
    };
  };
  const pieceCls = (u) => (u.died ? "fx-fall" : u.cur <= 0 ? "fx-fallen" : "");
  const innerCls = (u) => "relative " + (u.cur > 0 && u.hit ? "fx-hit-" + par : "");

  return (
    <div ref={arenaRef} data-testid="combat"
      className={"arena-bg relative h-full flex flex-col rounded-2xl border border-line overflow-hidden land:rounded-xl " + (anyDied ? "fx-shake-" + par : "")}>
      <div className="absolute top-2 inset-x-2.5 z-20 flex items-center justify-between gap-2 pointer-events-none land:top-1">
        <span data-testid="bug-lane" className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
          🐛 버그 <span className="font-mono text-hp normal-case">{aliveBugs}/{combat.enemy.length}</span>
        </span>
        {exposedRow !== null && (
          <span data-testid="ingress" className="text-[10.5px] font-bold text-hp bg-hp/10 border border-hp/30 rounded-md px-2 py-0.5 whitespace-nowrap">
            ▼ {rowName(exposedRow)} 노출
          </span>
        )}
      </div>

      <div data-testid="arch" className="flex-1 min-h-0 flex pt-5 land:pt-3">
        <HexBoard
          rows={ENEMY_ROWS + BOARD_ROWS}
          renderCell={(i, r) => {
            if (r < ENEMY_ROWS) {
              const b = bugs.get(i);
              const tint = r === ENEMY_ROWS - 1 ? "bg-hp/40" : "bg-hp/25";
              if (!b) return <Hex key={i} tile={tint} fill="bg-[color-mix(in_srgb,var(--hp)_8%,var(--panel2))]" />;
              const m = slotMotion(b, HIT_AT.p);
              return (
                <Hex key={b.uid} tile={tint} fill="bg-[color-mix(in_srgb,var(--hp)_14%,var(--panel2))]"
                  className={m.cls} style={{ ...m.style, "--acc": b.color }} title={`${b.name} · ${Math.max(0, b.cur)}/${b.hp} · ⚔${b.atk}`}>
                  <Piece glyph={b.glyph} round tokenRef={reg(b.uid)} hp={<HpBar u={b} delay={HIT_AT.p} />}
                    pieceClass={pieceCls(b)} innerClass={innerCls(b)}>
                    {b.lastDmg > 0 && <Num key={"d" + combat.tick} value={b.lastDmg} max={b.hp} at={HIT_AT.p} />}
                  </Piece>
                </Hex>
              );
            }
            const p = players.get(i);
            const pr = r - ENEMY_ROWS;
            const frontTile = pr === exposedRow;
            if (!p) return <Hex key={i} tile={frontTile ? "bg-hp/30" : "bg-line2/70"} fill="bg-panel2" />;
            const isExposed = p.cur > 0 && unitRow(p) === exposedRow;
            const m = slotMotion(p, HIT_AT.e);
            return (
              <Hex key={p.uid} data-testid="arch-node" data-row={p.row}
                className={"node cat-" + p.cat + (isExposed ? " exposed" : "") + m.cls} style={m.style}
                tile={isExposed ? "bg-hp animate-pulse" : "bg-[color-mix(in_srgb,var(--acc)_70%,transparent)]"}
                fill="bg-[color-mix(in_srgb,var(--acc)_26%,var(--panel2))]">
                <Piece glyph={p.glyph} star={p.star} tokenRef={reg(p.uid)} hp={<HpBar u={p} delay={HIT_AT.e} />}
                  ring={isExposed ? "!border-hp" : p.composite ? "!border-gold" : ""}
                  pieceClass={pieceCls(p)} innerClass={innerCls(p)}>
                  {p.lastDmg > 0 && <Num key={"d" + combat.tick} value={p.lastDmg} max={p.hp} at={HIT_AT.e} />}
                  {p.lastHeal > 0 && <Num key={"h" + combat.tick} value={p.lastHeal} heal at={HEAL_AT} />}
                </Piece>
              </Hex>
            );
          }}
        />
      </div>

      {/* 투사체 · 착탄 스파크 레이어 */}
      {fresh && (
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
          {fx.shots.map((s) => (
            <span key={combat.tick + "-s" + s.k} className="fx-shot"
              style={{ left: s.x, top: s.y, "--dx": s.dx + "px", "--dy": s.dy + "px", "--rot": s.rot + "deg", "--c": s.color, "--d": s.at + "ms" }} />
          ))}
          {fx.sparks.map((s, k) => (
            <span key={combat.tick + "-p" + k} className="fx-spark" style={{ left: s.x, top: s.y, "--c": s.color, "--d": s.at + "ms" }} />
          ))}
        </div>
      )}
    </div>
  );
}

// 하단 트레이 — 전투 진행도 · 적용 버프 · 결과 + 다음 라운드.
function CombatTray({ combat, onNext }) {
  const b = combat.buffs;
  const buffs = [
    b.atkMult > 1 && "공격 ×" + b.atkMult,
    b.hpMult > 1 && "체력 ×" + b.hpMult,
    b.heal > 0 && "회복 +" + b.heal + "/틱",
    b.dmgRed > 0 && "피해 -" + Math.round(b.dmgRed * 100) + "%",
  ].filter(Boolean);
  const pct = Math.min(100, (combat.tick / MAX_TICKS) * 100);
  const win = combat.result === "win";
  return (
    <div className={TRAY}>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-2 land:gap-1">
        <div className="flex items-baseline justify-between gap-2">
          {combat.done
            ? <span className={"font-display text-xl font-bold land:text-base " + (win ? "text-emerald-500" : "text-hp")}>{win ? "✓ 빌드 통과" : "✗ 빌드 실패"}</span>
            : <span className="text-sm font-semibold text-ink">테스트 실행 중<span className="animate-blink">…</span></span>}
          <span className="font-mono text-[11px] text-muted tabular-nums">tick {combat.tick}/{MAX_TICKS}</span>
        </div>
        <div className="h-1.5 rounded-full bg-line overflow-hidden">
          <div className="h-full rounded-full bg-cta transition-[width] duration-500" style={{ width: pct + "%" }} />
        </div>
        <div className="flex flex-wrap gap-1.5 text-[10.5px]">
          {buffs.length
            ? buffs.map((t) => <span key={t} className="px-1.5 py-px rounded border border-cta/30 bg-cta/10 text-cta font-semibold">{t}</span>)
            : <span className="text-dim">활성 시너지 없음</span>}
          <span className="text-dim land:hidden">· 버그는 앞줄부터 공격합니다</span>
        </div>
      </div>
      <div className="w-[160px] shrink-0 flex items-end narrow:w-full land:w-[130px]">
        {combat.done && <button className={BTN_PRIMARY + " w-full !py-3 !text-sm land:!py-2"} onClick={onNext}>다음 라운드 ▶</button>}
      </div>
    </div>
  );
}

// 전투 페이즈 — 같은 HUD 레이아웃에서 중앙만 전투로 교체(시너지·레시피는 읽기 전용).
export default function CombatScreen({ game }) {
  return (
    <PlayLayout
      counts={game.counts}
      recipeProg={game.recipeProg}
      landRecipes={false}
      center={<CombatArena combat={game.combat} />}
      bench={<Bench bench={game.bench} sel={null} onClickBench={() => {}} />}
      tray={<CombatTray combat={game.combat} onNext={game.nextRound} />}
    />
  );
}
