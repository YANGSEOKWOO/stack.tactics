---
name: add-recipe
description: stack.tactics에 새 합성 레시피(deploy 조합)를 추가할 때. 컴포넌트→시스템→플랫폼 테크 트리 확장, 재료 조합으로 만드는 합성 유닛 정의 요청 시 사용.
---

# 합성 레시피 추가

## 1. 결과 유닛이 있는지 확인 — `src/data/units.js`
`makes`가 가리킬 합성 유닛이 `DEFS`에 `composite: true`로 있어야 한다. 없으면 `add-unit` 먼저.

## 2. 레시피 추가 — `src/data/recipes.js`의 `RECIPES`
```js
{ need: ["REACT", "JS"], makes: "SPA" },
```
- `need`: 재료 id 배열(`DEFS` 키). 다른 합성 유닛도 재료로 가능(예: WEBAPP).
- `makes`: 결과 유닛 id.
- **순서 주의:** `recipeBoardIndices`가 `need` 순서대로 보드에서 찾는다. 2단계 합성은 1단계 결과보다 뒤에 둘 것(목록 순서가 모달 표시 순서).

## 3. 모달 설명 — `RECIPE_DESC`에 같은 key 추가
```js
SPA: { tier: "시스템", text: "..." },
```

## 4. 동작 원리 (참고)
- deploy 가능 판정·실행: `src/engine/recipes.js` `recipeBoardIndices`
- deploy 액션: `src/state/useGame.js` `deploy()` — 재료 제거 후 가장 앞 슬롯에 결과 배치, 이후 별업 자동 합성 처리.
- 별도 코드 수정 없이 데이터만 추가하면 UI(`RecipeGrid`/`RecipeModal`)에 자동 반영.

## 5. 검증
`npm run build` + `docs/assets.md` 합성 유닛 표 갱신.
