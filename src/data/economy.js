// 경제·진행 상수 — 보드/벤치 크기, 별업 배율, 레벨·경험치·상점 확률.
// 밸런스 튜닝의 단일 출처. → docs/balance.md
// 보드 = TFT식 벌집(헥스) 판. 행 0 이 최전방(버그 쪽). 칸은 BOARD_ROWS×BOARD_COLS 이고,
// 동시에 올릴 수 있는 기물 수는 레벨(cap)만큼이다.
export const BOARD_ROWS = 4;
export const BOARD_COLS = 7;
export const BOARD_MAX = BOARD_ROWS * BOARD_COLS; // 보드 칸 총 개수(28)
export const BENCH_SLOTS = 9;     // 벤치 수용량
export const STAR_MULT = [1, 1.8, 3.2]; // ★1/★2/★3 능력치 배율

export const START_GOLD = 12;
export const START_HP = 100;
export const START_LEVEL = 4;
export const MAX_LEVEL = 10;      // = 최대 배치 기물 수

// 현재 레벨 → 다음 레벨까지 필요한 XP. MAX_LEVEL 도달 시 더 없음.
export const XP_TO_NEXT = { 4: 6, 5: 10, 6: 16, 7: 24, 8: 34, 9: 46 };

// 레벨별 상점 코스트 등장 확률 [1코, 2코, 3코, 4코]. (TFT 방식)
export const ODDS = {
  4: [0.55, 0.30, 0.13, 0.02], 5: [0.45, 0.33, 0.18, 0.04],
  6: [0.35, 0.35, 0.22, 0.08], 7: [0.28, 0.32, 0.28, 0.12], 8: [0.22, 0.30, 0.30, 0.18],
  9: [0.16, 0.26, 0.33, 0.25], 10: [0.12, 0.22, 0.34, 0.32],
};
