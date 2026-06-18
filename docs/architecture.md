# 아키텍처 — 코드 구조 / 확장 가이드

> 이 문서는 **코드를 어디서 고쳐야 하는지** 빠르게 찾기 위한 지도다.
> 게임 설계·밸런스 의도는 [`design.md`](design.md), 수치 표는 [`assets.md`](assets.md)·[`synergy.md`](synergy.md) 참고.

## 레이어 (의존 방향 단방향)

```
data  →  engine  →  state  →  components
(수치)   (순수 로직)  (상태/액션)  (표현/렌더)
```

- **data/** — 정적 정의·밸런스 수치. React/로직 없음. 게임 튜닝의 단일 출처.
- **engine/** — 순수 함수 게임 로직. React 의존 없음 → 단위 테스트 쉬움.
- **state/** — `useGame` 훅. 모든 `useState`·액션·전투 루프를 캡슐화.
- **components/** — 표현 전용. 상태는 props 로 받고, 액션은 콜백으로 호출.

> 규칙: 위 화살표 역방향 import 금지 (engine 이 components 를 import 하지 않는다).

## 디렉토리 맵

```
src/
├─ main.jsx                  진입점 (index.css 로드)
├─ index.css                 Tailwind v4 진입 + 테마 토큰(:root/.dark) + 키프레임
├─ App.jsx                   구성 루트 — useGame()/useTheme() + 페이즈별 화면 분기
│
├─ data/                     ── 정적 정의 (밸런스 단일 출처) ──
│  ├─ units.js               DEFS — 모든 기물/합성 유닛 (hp·atk·cost·cat·traits)
│  ├─ recipes.js             RECIPES(합성 트리) + RECIPE_DESC(모달 설명)
│  ├─ traits.js              TRAIT_DEFS — 시너지 임계값·설명
│  ├─ bugs.js                BUG_TYPES — 적 원형
│  └─ economy.js             보드/벤치 크기, 별업 배율, 레벨·XP, 상점 확률(ODDS)
│
├─ engine/                   ── 순수 게임 로직 ──
│  ├─ uid.js                 nextUid/resetUid — 유닛·적 공용 ID
│  ├─ units.js               makeUnit — 정의 → 인스턴스
│  ├─ shop.js                POOL_BY_COST, rollShop — 상점 굴리기
│  ├─ merge.js               processMerges — 3개 → 별업 자동 합성
│  ├─ recipes.js             recipeBoardIndices — deploy 가능 판정
│  ├─ synergy.js             computeCounts, computeBuffs — 시너지 카운트→버프
│  ├─ combat.js              makeEnemies, combatTick + 방어 계층(TIER_OF/unitTier/frontTierIdx)
│  ├─ layout.js              archLayout — 전투 아키텍처 다이어그램 좌표
│  └─ rng.js                 rng/setSeed — 시드 가능 난수(?seed= 시 결정적, 평소 Math.random)
│
├─ state/
│  ├─ useGame.js             모든 상태 + 액션(buy/deploy/startCombat/nextRound…)
│  └─ useTheme.js            다크/라이트 테마 (localStorage + <html class="dark">)
│
├─ components/               ── 표현 전용 (Tailwind 유틸리티) ──
│  ├─ ui.js                  공용 className 묶음(BTN/LABEL/CM…) — DRY
│  ├─ Chip.jsx               유닛 칩(보드/벤치 공용)
│  ├─ TopBar.jsx             상단 자원 바
│  ├─ EconomyBar.jsx         레벨·XP·이자·연승
│  ├─ BoardGrid.jsx          보드 그리드
│  ├─ SynergyBar.jsx         시너지 현황
│  ├─ Bench.jsx              벤치
│  ├─ RecipeGrid.jsx         레시피 목록
│  ├─ Shop.jsx               상점 5칸
│  ├─ RecipeModal.jsx        레시피 상세 + deploy
│  └─ screens/               페이즈별 화면 조합
│     ├─ ShopScreen.jsx      상점 페이즈
│     ├─ CombatScreen.jsx    전투 페이즈 (hpStyle 로컬 헬퍼 포함)
│     └─ GameOverScreen.jsx  게임오버
```

> **스타일:** Tailwind v4(`@tailwindcss/vite`). 유틸리티는 JSX에 직접, 반복은 `components/ui.js`로 묶는다.
> 색/표면/선은 시맨틱 토큰(`bg-panel`·`text-ink`·`border-line`…)으로, `:root`(라이트)/`.dark`(다크)에서 값이 바뀐다.
> 카테고리 색은 `.cat-*`가 `--acc`를 공급하고 `--soft/--edge`는 `color-mix`로 파생(테마 무관). 키프레임·다층 배경만 `index.css`에 직접 둔다.

## 데이터 흐름 (한 라운드)

1. **shop 페이즈** — `useGame` 상태(gold/bench/board…)를 `ShopScreen`이 렌더.
2. 구매/배치/합성 → `useGame` 액션이 `engine`(makeUnit·processMerges·recipeBoardIndices) 호출 후 상태 갱신.
3. **라운드 시작** → `startCombat`이 `computeBuffs(computeCounts(board))`로 버프 계산, `makeEnemies(stage)`로 적 생성, phase="combat".
4. **combat 페이즈** — `useGame`의 `useEffect`가 650ms마다 `combatTick` 실행. `CombatScreen`이 `archLayout`으로 렌더.
   - **방어 계층:** 버그는 살아있는 가장 바깥 계층(Infra→Frontend→Backend→Database, `TIER_OF`)만 때린다. 안쪽 캐리는 앞 계층이 무너져야 노출. LB 생존 시 해당 계층에 피해 분산.
5. **다음 라운드** → `nextRound`가 경제(이자·연승·XP) 정산 후 shop 으로 복귀. 체력 0 → gameover.

## 확장 시 보는 곳 (요약)

| 하고 싶은 일 | 보는 곳 | 스킬 |
|---|---|---|
| 기물 추가/수정 | `data/units.js` (+ recipes/economy) | `add-unit` |
| 합성 레시피 추가 | `data/recipes.js` | `add-recipe` |
| 적(버그) 추가 | `data/bugs.js` (+ combat 분기) | `add-bug` |
| 밸런스 수치 튜닝 | `data/*` | `tune-balance` |
| 전투 규칙 변경 | `engine/combat.js` | — |
| 새 UI/화면 | `components/` | `add-component` |
| 새 시스템(보스·증강체) | data→engine→state→components 순 | — |
