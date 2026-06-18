import { DEFS } from "../data/units.js";
import { STAR_MULT } from "../data/economy.js";
import { nextUid } from "./uid.js";

// 정의 id + 성급 → 능력치가 계산된 인게임 유닛 인스턴스 생성.
export function makeUnit(defId, star = 1) {
  const d = DEFS[defId], m = STAR_MULT[star - 1];
  return {
    uid: nextUid(), defId, name: d.name, cat: d.cat, glyph: d.glyph, composite: !!d.composite,
    star, hp: Math.round(d.hp * m), atk: Math.round(d.atk * m),
  };
}
