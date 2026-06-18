---
name: tune-balance
description: stack.tactics의 밸런스 수치(능력치·경제·시너지·상점 확률·전투)를 조정할 때. "너무 강하다/약하다", 골드·이자·XP·승률·난이도 튜닝 요청 시 사용.
---

# 밸런스 튜닝

## 원칙
- 수치는 **`src/data/` 한 곳**에서만 바꾼다. 로직 분기는 `engine/`.
- 황금률(`docs/design.md` §2): **단일 전략 승률 60% 미만.** 한 레버를 당기면 반대 레버 확인.

## 수치 위치 (전체 색인은 `docs/balance.md`)

| 바꾸려는 것 | 파일 · 심볼 |
|---|---|
| 기물 HP/ATK/코스트 | `data/units.js` `DEFS` |
| 별업 배율 | `data/economy.js` `STAR_MULT` |
| 시너지 임계값 | `data/traits.js` `TRAIT_DEFS` |
| 시너지 효과량 | `engine/synergy.js` `computeBuffs` |
| 상점 확률 | `data/economy.js` `ODDS` |
| 레벨/XP 곡선 | `data/economy.js` `XP_TO_NEXT` |
| 시작 골드·체력 | `data/economy.js` `START_GOLD/HP` |
| 수입·이자·연승 | `state/useGame.js` `nextRound` |
| 판매 환급 | `state/useGame.js` `sell` |
| 적 난이도 | `data/bugs.js` `BUG_TYPES` + `engine/combat.js` `makeEnemies` |
| 전투 길이 | `engine/combat.js` `combatTick`(28틱), `state/useGame.js`(650ms) |

## 주의 — 두 곳을 같이 봐야 하는 짝
- 시너지: 임계값(`traits.js`)과 효과량(`synergy.js`)이 분리되어 있다. 둘 다 확인.
- 적: 배율(`bugs.js`)과 기본 스탯·스폰수(`combat.js makeEnemies`)가 분리.
- `TRAIT_DEFS`의 `desc` 문자열도 효과량과 일치하게 갱신(UI 표기).

## 검증
`npm run build` 후, 바꾼 수치를 `docs/assets.md`/`synergy.md` 표에 반영.
