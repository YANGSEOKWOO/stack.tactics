# 밸런스 — 수치가 사는 곳 (허브)

> 밸런스 튜닝은 **코드의 `data/` 한 곳**에서만 한다. 이 문서는 "어떤 수치가 어느 파일에 있는지"의 색인이다.
> 설계 의도·황금률은 [`design.md`](design.md), 수치 표는 [`assets.md`](assets.md)·[`synergy.md`](synergy.md).

## 수치 → 파일 매핑

| 수치 종류 | 파일 | 심볼 |
|---|---|---|
| 기물 HP/ATK/코스트/glyph | `src/data/units.js` | `DEFS` |
| 합성 유닛 능력치·트레잇 기여 | `src/data/units.js` | `DEFS[*].composite/traits` |
| 합성 조합 | `src/data/recipes.js` | `RECIPES` |
| 시너지 임계값·설명 | `src/data/traits.js` | `TRAIT_DEFS` |
| 시너지 **버프 효과량** | `src/engine/synergy.js` | `computeBuffs` |
| 적 배율·행동 | `src/data/bugs.js` | `BUG_TYPES` |
| 적 스폰 수·기본 스탯 | `src/engine/combat.js` | `makeEnemies` |
| 보드(헥스 행×열)/벤치 크기, 별업 배율 | `src/data/economy.js` | `BOARD_ROWS`, `BOARD_COLS`, `BENCH_SLOTS`, `STAR_MULT` |
| 시작 자원·레벨 상한(= 최대 배치 수) | `src/data/economy.js` | `START_GOLD/HP/LEVEL`, `MAX_LEVEL` |
| 레벨·XP 곡선 | `src/data/economy.js` | `XP_TO_NEXT` |
| 레벨별 상점 확률 | `src/data/economy.js` | `ODDS` |
| 라운드 수입·이자·연승 보너스 | `src/state/useGame.js` | `nextRound` |
| 판매 환급 | `src/state/useGame.js` | `sell` |
| 전투 틱 길이·종료 조건 | `src/state/useGame.js` / `src/engine/combat.js` | `useEffect`(650ms) / `combatTick`(28틱) |

## 황금률 (design.md §2)

> 어떤 단일 전략도 60% 이상 승률을 내면 안 된다. 조합 다양성이 보상받아야 한다.

수치를 바꾸면 위 두 축(별업 vs 합성)·경제 vs 전력 균형이 흔들리는지 확인할 것. → `tune-balance` 스킬.
