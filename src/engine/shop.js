import { DEFS } from "../data/units.js";
import { ODDS, START_LEVEL, MAX_LEVEL } from "../data/economy.js";
import { rng } from "./rng.js";

// 코스트별 구매 가능 기물 풀(합성 유닛 제외). 모듈 로드 시 1회 계산.
export const POOL_BY_COST = (() => {
  const p = { 1: [], 2: [], 3: [], 4: [] };
  for (const id in DEFS) if (!DEFS[id].composite) p[DEFS[id].cost].push(id);
  return p;
})();

// 레벨별 확률로 5칸 상점 슬롯을 굴린다.
export function rollShop(level) {
  const odds = ODDS[Math.max(START_LEVEL, Math.min(MAX_LEVEL, level))] || ODDS[MAX_LEVEL];
  return Array.from({ length: 5 }, () => {
    let r = rng(), acc = 0, cost = 1;
    for (let c = 0; c < 4; c++) { acc += odds[c]; if (r <= acc) { cost = c + 1; break; } }
    const pool = POOL_BY_COST[cost].length ? POOL_BY_COST[cost] : POOL_BY_COST[1];
    return pool[Math.floor(rng() * pool.length)];
  });
}
