---
name: add-component
description: stack.tactics에 새 UI 컴포넌트·화면을 추가하거나 기존 표현을 수정할 때. React 컴포넌트, 새 페이즈/화면, 스타일 추가 요청 시 사용.
---

# UI 컴포넌트/화면 추가

## 레이어 규칙
컴포넌트는 **표현 전용**이다. 상태는 props 로 받고 액션은 콜백으로 호출한다. 컴포넌트 안에서 게임 상태를 직접 만들지 않는다(→ `state/useGame.js`).

## 컴포넌트 추가 — `src/components/`
- 패턴: `Chip.jsx`, `Shop.jsx` 등 기존 파일 형태를 따른다(default export, 한 책임).
- 데이터 정의가 필요하면 `data/`에서 import(예: `Shop`이 `DEFS`). 로직은 `engine/`에서 import.
- 스타일: **Tailwind v4 유틸리티를 JSX에 직접** 쓴다. 색·표면·선은 시맨틱 토큰 유틸(`bg-panel`/`text-ink`/`border-line`/`text-muted`/`text-cta`…)을 써야 다크/라이트가 자동 전환된다. 카테고리 색이 필요하면 요소에 `cat-${cat}` 클래스를 주고 `text-[var(--acc)]`/`border-[var(--edge)]`/`bg-[var(--soft)]`로 참조. 반복되는 묶음은 `src/components/ui.js`(BTN/LABEL/CM 등)에서 import. 키프레임·다층 배경 등 유틸로 어려운 것만 `src/index.css`에 추가.

## 새 화면(페이즈) 추가 — `src/components/screens/`
1. `state/useGame.js`에 `phase` 새 값과 전환 액션 추가.
2. `screens/XScreen.jsx` 작성 — `game` 객체나 필요한 props 만 받음.
3. `App.jsx`의 페이즈 분기에 연결.

## 상태가 필요하면
새 `useState`·액션은 `useGame`에 추가하고 return 객체에 노출 → props/`game`으로 전달.
`App.jsx`는 `useGame()` 호출 + 화면 분기만 담당하는 얇은 루트로 유지.

## 검증
`npm run build`. 구조 변경 시 `docs/architecture.md` 디렉토리 맵 갱신.
