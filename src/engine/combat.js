import { BUG_TYPES } from "../data/bugs.js";
import { nextUid } from "./uid.js";
import { rng } from "./rng.js";

// 헥스 보드 전열 — 버그는 살아있는 유닛이 있는 가장 앞 행(row 0 = 최전방)부터 때린다.
// 뒷줄 캐리는 앞줄이 무너져야 노출된다 → 배치가 곧 전략.
export function unitRow(u) { return u.row ?? 0; }
export function rowName(r) { return r === 0 ? "1열(최전방)" : r + 1 + "열"; }
// 살아있는 유닛이 있는 가장 앞 행. 없으면 null.
export function frontRow(player) {
  let best = Infinity;
  for (const u of player) if (u.cur > 0) best = Math.min(best, unitRow(u));
  return best === Infinity ? null : best;
}

// 스테이지에 맞는 버그 웨이브 생성. 초반(≤2)엔 약한 버그만 등장.
export function makeEnemies(stage) {
  const n = Math.min(2 + stage, 8);
  const baseHp = 30 + stage * 15, baseAtk = 5 + stage * 2.4;
  const pool = stage <= 2 ? BUG_TYPES.filter((t) => ["npe", "404", "leak"].includes(t.id)) : BUG_TYPES;
  return Array.from({ length: n }, () => {
    const t = pool[Math.floor(rng() * pool.length)];
    const hp = Math.max(8, Math.round(baseHp * t.hpMul));
    return { uid: "e" + nextUid(), name: t.name, glyph: t.glyph, color: t.color, behavior: t.behavior, hp, cur: hp, atk: Math.max(1, Math.round(baseAtk * t.atkMul)), hit: false, lastDmg: 0, lastHeal: 0, died: false };
  });
}

// 전투 한 틱(라운드)을 순수 함수로 진행한다: 플레이어 일제 공격 → 버그 행동 → 회복 → 승패 판정.
// events: 이번 틱의 타격 목록 [{ src, dst, dmg, side: "p"|"e" }] — 표현 계층이 공격 모션을 그린다.
// MAX_TICKS 도달 시 총 잔여 체력으로 승패 결정.
export const MAX_TICKS = 28;
export function combatTick(c) {
  const reset = (u) => ({ ...u, hit: false, lastDmg: 0, lastHeal: 0, died: false });
  const player = c.player.map(reset);
  const enemy = c.enemy.map(reset);
  const events = [];
  const aliveP = () => player.filter((u) => u.cur > 0);
  const aliveE = () => enemy.filter((u) => u.cur > 0);
  const hitUnit = (src, u, d, side) => {
    if (u.cur > 0 && u.cur - d <= 0) u.died = true;
    u.cur -= d; u.hit = true; u.lastDmg += d;
    events.push({ src: src.uid, dst: u.uid, dmg: d, side });
  };
  // player attacks front bug
  for (const u of player) { if (u.cur <= 0) continue; const t = aliveE()[0]; if (t) hitUnit(u, t, u.atk, "p"); }
  // bugs attack the frontmost living row only.
  // an LB still standing load-balances incoming traffic across that row.
  const lbAlive = player.some((u) => u.defId === "LB" && u.cur > 0);
  for (const u of enemy) {
    if (u.cur <= 0 || u.died) continue;
    if (!aliveP().length) break;
    const fr = frontRow(player);
    if (fr === null) break;
    const exposed = player.filter((p) => p.cur > 0 && unitRow(p) === fr);
    const dmg = Math.max(1, Math.round(u.atk * (1 - c.buffs.dmgRed)));
    if (lbAlive && exposed.length > 1) {
      const each = Math.max(1, Math.round(dmg / exposed.length));
      for (const t of exposed) hitUnit(u, t, each, "e");
    } else if (u.behavior === "random") {
      hitUnit(u, exposed[Math.floor(rng() * exposed.length)], dmg, "e");
    } else if (u.behavior === "multi2") {
      hitUnit(u, exposed[0], Math.round(dmg * 0.6), "e");
      if (exposed[1]) hitUnit(u, exposed[1], Math.round(dmg * 0.6), "e");
    } else hitUnit(u, exposed[0], dmg, "e");
  }
  if (c.buffs.heal) {
    for (const u of player) {
      if (u.cur <= 0) continue;
      const before = u.cur; u.cur = Math.min(u.hp, u.cur + c.buffs.heal); u.lastHeal = u.cur - before;
    }
  }
  const tick = c.tick + 1;
  const pA = player.some((u) => u.cur > 0), eA = enemy.some((u) => u.cur > 0);
  let done = false, result = null;
  if (!eA) { done = true; result = "win"; }
  else if (!pA) { done = true; result = "lose"; }
  else if (tick >= MAX_TICKS) { done = true; result = player.reduce((s, u) => s + Math.max(0, u.cur), 0) >= enemy.reduce((s, u) => s + Math.max(0, u.cur), 0) ? "win" : "lose"; }
  return { ...c, player, enemy, events, tick, done, result };
}
