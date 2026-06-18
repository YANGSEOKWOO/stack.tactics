import { BUG_TYPES } from "../data/bugs.js";
import { nextUid } from "./uid.js";
import { rng } from "./rng.js";

// 아키텍처 방어 계층 — 버그(유입 트래픽)는 가장 바깥 계층부터 때린다.
// 안쪽(backend/database 캐리)은 앞 계층이 무너져야 노출된다.
export const TIER_OF = { infra: 0, frontend: 1, composite: 1, backend: 2, database: 3 };
export const TIER_NAME = ["Infra(외곽)", "Frontend", "Backend", "Database(심층)"];
export function unitTier(u) { return u.tier ?? TIER_OF[u.cat] ?? 1; }
// 살아있는 유닛이 있는 가장 바깥(작은 인덱스) 계층. 없으면 null.
export function frontTierIdx(player) {
  let best = Infinity;
  for (const u of player) if (u.cur > 0) best = Math.min(best, unitTier(u));
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
    return { uid: "e" + nextUid(), name: t.name, glyph: t.glyph, color: t.color, behavior: t.behavior, hp, cur: hp, atk: Math.max(1, Math.round(baseAtk * t.atkMul)), hit: false, lastDmg: 0 };
  });
}

// 전투 한 틱(라운드)을 순수 함수로 진행한다: 플레이어 일제 공격 → 버그 행동 → 회복 → 승패 판정.
// 28틱 도달 시 총 잔여 체력으로 승패 결정.
export function combatTick(c) {
  const player = c.player.map((u) => ({ ...u, hit: false, lastDmg: 0 }));
  const enemy = c.enemy.map((u) => ({ ...u, hit: false, lastDmg: 0 }));
  const aliveP = () => player.filter((u) => u.cur > 0);
  const aliveE = () => enemy.filter((u) => u.cur > 0);
  const hitUnit = (u, d) => { u.cur -= d; u.hit = true; u.lastDmg += d; };
  // player attacks front bug
  for (const u of player) { if (u.cur <= 0) continue; const t = aliveE()[0]; if (t) hitUnit(t, u.atk); }
  // bugs attack through the architecture: only the frontmost living tier is exposed.
  // an LB still standing load-balances incoming traffic across that tier.
  const lbAlive = player.some((u) => u.defId === "LB" && u.cur > 0);
  for (const u of enemy) {
    if (u.cur <= 0) continue;
    if (!aliveP().length) break;
    const ft = frontTierIdx(player);
    if (ft === null) break;
    const exposed = player.filter((p) => p.cur > 0 && unitTier(p) === ft);
    const dmg = Math.max(1, Math.round(u.atk * (1 - c.buffs.dmgRed)));
    if (lbAlive && exposed.length > 1) {
      const each = Math.max(1, Math.round(dmg / exposed.length));
      for (const t of exposed) hitUnit(t, each);
    } else if (u.behavior === "random") {
      hitUnit(exposed[Math.floor(rng() * exposed.length)], dmg);
    } else if (u.behavior === "multi2") {
      hitUnit(exposed[0], Math.round(dmg * 0.6));
      if (exposed[1]) hitUnit(exposed[1], Math.round(dmg * 0.6));
    } else hitUnit(exposed[0], dmg);
  }
  if (c.buffs.heal) for (const u of player) if (u.cur > 0) u.cur = Math.min(u.hp, u.cur + c.buffs.heal);
  const tick = c.tick + 1;
  const pA = player.some((u) => u.cur > 0), eA = enemy.some((u) => u.cur > 0);
  let done = false, result = null;
  if (!eA) { done = true; result = "win"; }
  else if (!pA) { done = true; result = "lose"; }
  else if (tick >= 28) { done = true; result = player.reduce((s, u) => s + Math.max(0, u.cur), 0) >= enemy.reduce((s, u) => s + Math.max(0, u.cur), 0) ? "win" : "lose"; }
  return { ...c, player, enemy, tick, done, result };
}
