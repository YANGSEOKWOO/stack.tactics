import { DEFS } from "../data/units.js";

// 한 유닛의 시너지 기여. traits 가 있으면 그 값, 없으면 자기 카테고리에 1.
export function traitContribution(u) { const d = DEFS[u.defId]; return d.traits || { [u.cat]: 1 }; }

// 보드 전체의 카테고리별 시너지 카운트 합산.
export function computeCounts(board) {
  const c = { frontend: 0, backend: 0, database: 0, infra: 0 };
  for (const u of board) if (u) { const t = traitContribution(u); for (const k in t) c[k] += t[k]; }
  return c;
}

// 카운트 → 실제 전투 버프. 임계값은 data/traits.js(TRAIT_DEFS)와 함께 관리.
export function computeBuffs(c) {
  return {
    atkMult: c.frontend >= 4 ? 1.45 : c.frontend >= 2 ? 1.2 : 1,
    hpMult: c.backend >= 4 ? 1.5 : c.backend >= 2 ? 1.25 : 1,
    heal: c.database >= 3 ? 12 : c.database >= 2 ? 5 : 0,
    dmgRed: c.infra >= 3 ? 0.30 : c.infra >= 2 ? 0.15 : 0,
  };
}
