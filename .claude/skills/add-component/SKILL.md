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
- 스타일: 클래스명을 쓰고 규칙은 `src/styles/game.css`에 추가. 모든 규칙은 `.tt` 스코프 하위(예: `.tt .myclass`).

## 새 화면(페이즈) 추가 — `src/components/screens/`
1. `state/useGame.js`에 `phase` 새 값과 전환 액션 추가.
2. `screens/XScreen.jsx` 작성 — `game` 객체나 필요한 props 만 받음.
3. `App.jsx`의 페이즈 분기에 연결.

## 상태가 필요하면
새 `useState`·액션은 `useGame`에 추가하고 return 객체에 노출 → props/`game`으로 전달.
`App.jsx`는 `useGame()` 호출 + 화면 분기만 담당하는 얇은 루트로 유지.

## 검증
`npm run build`. 구조 변경 시 `docs/architecture.md` 디렉토리 맵 갱신.
