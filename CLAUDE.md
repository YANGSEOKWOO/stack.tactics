# CLAUDE.md — stack.tactics

> **개발 스택을 조립해 버그를 막아내는 PvE 오토배틀러** (React + Vite, JS).
> 이 파일은 **라우팅 테이블**이다. 전부 읽지 말고, 작업에 맞는 문서/스킬만 골라 그때 참조한다.
> 상세는 링크 대상에 있으니 여기서는 "어디를 볼지"만 판단한다.

## 30초 요약

- 두 성장 축: **별업**(같은 기물 3개→★, 세로) / **합성·deploy**(다른 카테고리 조합, 가로).
- 레이어 단방향: `data(수치) → engine(순수 로직) → state(useGame 훅) → components(표현)`.
- 빌드 검증: `npm run build` (개발: `npm run dev`).
- 밸런스 수치는 **`src/data/` 한 곳**에서만 바꾼다.

## 📁 문서 라우팅 — "필요할 때만 펼친다"

| 알고 싶은 것 / 작업 | 먼저 볼 곳 |
|---|---|
| 코드 구조·어느 파일을 고치나 | [`docs/architecture.md`](docs/architecture.md) |
| 게임 용어가 헷갈림 | [`docs/domain-glossary.md`](docs/domain-glossary.md) |
| 밸런스 수치가 어디 사는지 | [`docs/balance.md`](docs/balance.md) |
| 게임 설계·의도·로드맵 | [`docs/design.md`](docs/design.md) |
| 기물 능력치 표 | [`docs/assets.md`](docs/assets.md) |
| 시너지/트레잇 표 | [`docs/synergy.md`](docs/synergy.md) |

## 🛠 스킬 라우팅 — 작업 유형 → 스킬 (tool calling 처럼 호출)

해당 작업이면 `.claude/skills/<name>` 스킬을 호출해 그 절차·파일만 로드한다.

| 작업 | 스킬 | 핵심 파일 |
|---|---|---|
| 기물 추가/능력치 수정 | `add-unit` | `src/data/units.js` |
| 합성 레시피 추가 | `add-recipe` | `src/data/recipes.js` |
| 적(버그)·행동 추가 | `add-bug` | `src/data/bugs.js`, `src/engine/combat.js` |
| 밸런스 튜닝 | `tune-balance` | `src/data/*` |
| UI 컴포넌트/화면 | `add-component` | `src/components/` |

## 규칙 (꼭 지킬 것)

1. **레이어 역방향 import 금지** — `engine`/`data`는 React·components를 모른다.
2. **수치는 `data/`, 로직은 `engine/`, 상태·액션은 `state/useGame.js`, 표현은 `components/`.** `App.jsx`는 얇게 유지.
3. 데이터만 추가하면 UI에 자동 반영되는 구조(기물·레시피·버그) — 불필요한 컴포넌트 수정 금지.
4. 변경 후 **`npm run build` 통과** 확인, 관련 `docs/` 표 갱신.
5. 밸런스 변경은 [`docs/design.md`](docs/design.md) **황금률(단일 전략 승률 <60%)** 위배 여부 점검.
