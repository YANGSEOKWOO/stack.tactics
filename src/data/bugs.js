// 적(버그) 종류 — 전투 웨이브를 구성하는 적 원형. → engine/combat.js makeEnemies
// hpMul/atkMul: 스테이지 기본 수치에 곱하는 배율.
// behavior: front(앞열 단일) | random(무작위) | multi2(앞 2개 동시).
export const BUG_TYPES = [
  { id: "npe", name: "NullPointer", glyph: "💥", color: "#dc2626", hpMul: 0.65, atkMul: 1.15, behavior: "front", note: "빠르고 약함" },
  { id: "404", name: "404", glyph: "❓", color: "#d97706", hpMul: 0.9, atkMul: 1.0, behavior: "random", note: "무작위 타격" },
  { id: "leak", name: "MemoryLeak", glyph: "🫧", color: "#7c3aed", hpMul: 1.9, atkMul: 0.55, behavior: "front", note: "탱키" },
  { id: "race", name: "RaceCond", glyph: "⚡", color: "#0284c7", hpMul: 1.0, atkMul: 0.85, behavior: "multi2", note: "2개 동시 타격" },
  { id: "ddos", name: "DDoS", glyph: "🌊", color: "#0d9488", hpMul: 0.45, atkMul: 0.7, behavior: "front", note: "물량" },
  { id: "timeout", name: "Timeout", glyph: "⏱", color: "#475569", hpMul: 1.35, atkMul: 1.45, behavior: "front", note: "고타격" },
];
