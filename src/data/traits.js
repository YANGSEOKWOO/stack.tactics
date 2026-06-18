// 시너지(트레잇) 정의 — 보드 위 카테고리 카운트에 따른 전체 버프 임계값.
// 실제 버프 수치 계산은 engine/synergy.js 의 computeBuffs 와 함께 관리한다.
// thr: [단계1 임계값, 단계2 임계값]
export const TRAIT_DEFS = [
  { cat: "frontend", name: "Frontend", thr: [2, 4], desc: "공격력 +20% / +45%" },
  { cat: "backend", name: "Backend", thr: [2, 4], desc: "최대 체력 +25% / +50%" },
  { cat: "database", name: "Database", thr: [2, 3], desc: "초당 회복 +5 / +12" },
  { cat: "infra", name: "Infra", thr: [2, 3], desc: "받는 피해 -15% / -30%" },
];
