---
name: add-bug
description: stack.tactics에 새 적(버그) 종류나 새 공격 행동(behavior)을 추가할 때. NPE/DDoS 같은 버그 유형, 보스, 광역/다단히트 등 적 행동 패턴 추가 요청 시 사용.
---

# 적(버그) 추가

## 1. 버그 원형 추가 — `src/data/bugs.js`의 `BUG_TYPES`
```js
{ id: "xss", name: "XSS", glyph: "🐞", color: "#be123c", hpMul: 1.0, atkMul: 1.1, behavior: "front", note: "..." },
```
- `hpMul/atkMul`: 스테이지 기본 스탯에 곱하는 배율.
- `behavior`: 기존 값 `front`(앞열 단일) | `random`(무작위) | `multi2`(앞 2개 분산).

## 2. 새 behavior가 필요하면 — `src/engine/combat.js`의 `combatTick`
적 행동 분기는 `for (const u of enemy)` 루프 안에 있다. 새 패턴은 여기에 `else if (u.behavior === "...")` 추가.
- `hitUnit(target, dmg)` 헬퍼 사용. `aliveP()`로 살아있는 아군 접근.
- 피해엔 `c.buffs.dmgRed`(Infra 시너지)가 이미 반영됨(`dmg` 변수).

## 3. 스폰 규칙 — `src/engine/combat.js`의 `makeEnemies`
- 스테이지별 등장 수: `n = Math.min(2 + stage, 8)`.
- 초반(≤2) 약한 버그만 등장하는 `pool` 필터에 새 id를 넣을지 결정.
- 보스 라운드(예: 5스테이지마다)는 아직 미구현 — `makeEnemies(stage)`에 분기 추가하는 방식. `docs/design.md` §8 참고.

## 4. 검증
`npm run build`. 전투 화면(`CombatScreen`)은 `color`/`glyph`만으로 자동 렌더되므로 UI 수정 보통 불필요.
