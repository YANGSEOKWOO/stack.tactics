---
name: add-unit
description: stack.tactics 게임에 새 기물(유닛)을 추가하거나 기존 기물 능력치를 수정할 때. 컴포넌트 기물·합성 유닛 모두 포함. HTML/React/Node 같은 스택 기물, hp/atk/cost/카테고리 추가 요청 시 사용.
---

# 기물 추가/수정

## 1. 정의 추가 — `src/data/units.js`의 `DEFS`
키는 대문자 id. 필드:
- `name, cat, cost, hp, atk, glyph` (필수)
- `cat`: `frontend|backend|database|infra|composite`
- 합성 유닛이면 `composite: true, cost: 0, traits: { <cat>: 2 }`

```js
TYPESCRIPT: { name: "TypeScript", cat: "frontend", cost: 3, hp: 40, atk: 8, glyph: "TS" },
```

## 2. 상점 풀 — 자동
컴포넌트 기물은 `src/engine/shop.js`의 `POOL_BY_COST`가 `DEFS`에서 자동 수집한다. **별도 등록 불필요.**
단, `cost`는 1~4만 지원(`ODDS`/`POOL_BY_COST` 범위). 5코 기물은 `economy.js`의 `ODDS`·`shop.js` 확장 필요.

## 3. 합성 유닛이면 레시피도 — `src/data/recipes.js`
`add-recipe` 스킬 참고. `RECIPE_DESC`에 모달 설명도 추가.

## 4. 검증
- `npm run build`로 빌드 통과 확인.
- 수치 표 문서 갱신: `docs/assets.md`. 밸런스 의도는 `docs/balance.md` 황금률 확인.

## 주의
- `glyph`는 1~3자 이모지/문자. UI 칩 폭(74px) 고려.
- 합성 유닛은 `cost: 0`이어야 상점에 안 나온다.
