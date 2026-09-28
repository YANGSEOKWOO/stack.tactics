# stack.tactics

> 개발 스택을 조립해 버그를 막아내는 PvE 오토배틀러 (롤토체스류).

`HTML + CSS + JS`를 사서 보드에 올리고 **deploy**하면 `Frontend`로 합성되고,
백엔드·데이터·인프라까지 쌓으면 `Web App` → `Full Stack`으로 진화한다.
카테고리를 모을수록 **시너지 버프**가 켜지고, 라운드마다 밀려오는 버그(NPE, MemLeak, 404…)와 자동 전투한다.

현재 **플레이 가능한 프로토타입(버티컬 슬라이스)** 단계다.

## 핵심 메커니즘

두 축으로 성장한다.

- **세로축 — 별업:** 같은 기물 3개 → ★★ (합성 유닛도 별업 가능)
- **가로축 — 합성/deploy:** 서로 다른 카테고리를 보드에 모아 수동 `deploy`로 합성 유닛 생성

여기에 **경제**(이자·연승연패·경험치 레벨업), **시너지 버프**(Frontend/Backend/Database/Infra), **코스트 등급별 상점 확률**이 얹힌다. 자세한 설계·밸런스는 [`docs/design.md`](docs/design.md) 참고.

## 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

요구사항: Node.js 18+

## 테스트 (E2E)

[Playwright](https://playwright.dev) 기반 E2E. dev 서버는 자동 기동(이미 떠 있으면 재사용)된다.

```bash
npx playwright install chromium  # 최초 1회 (브라우저 다운로드)
npm run test:e2e                 # 헤드리스 실행
npm run test:e2e:ui              # UI 모드(디버깅)
npm run test:e2e:report          # 마지막 HTML 리포트 열기
```

- 스펙: `tests/e2e/` — 스모크 / 상점 경제 / 전투(헥스 보드 전열)
- **결정적 RNG:** `?seed=<n>` 쿼리가 있으면 상점·전투 난수가 재현된다(`src/engine/rng.js`). 없으면 평소처럼 `Math.random()`이라 프로덕션엔 영향 없음.
- 선택자는 `data-testid`로 안정화(`hp`/`gold`/`stage`/`shop`/`board`/`tile-N`/`bench`/`unit-chip`/`arch`/`arch-node`/`bug-lane`/`ingress`).

## 프로젝트 구조

```
stack-tactics/
├─ CLAUDE.md          # 작업용 라우팅 테이블 (어떤 문서/스킬을 볼지)
├─ index.html
├─ vite.config.js
├─ playwright.config.js
├─ tests/e2e/         # Playwright E2E 스펙 + helpers
├─ src/
│  ├─ main.jsx        # 진입점
│  ├─ App.jsx         # 구성 루트 (useGame + 화면 분기, 얇음)
│  ├─ data/           # 정적 정의·밸런스 수치 (단일 출처)
│  ├─ engine/         # 순수 게임 로직 (합성·시너지·전투·상점)
│  ├─ state/          # useGame 훅 (상태 + 액션) · useTheme (다크/라이트)
│  ├─ components/     # 표현 전용 컴포넌트 (+ screens/, ui.js)
│  └─ index.css       # Tailwind 진입 + 테마 토큰(:root/.dark) + 키프레임
├─ docs/              # 설계·아키텍처·밸런스·용어 문서
└─ .claude/skills/    # 작업별 스킬 (add-unit, add-recipe, tune-balance …)
```

> 레이어는 단방향(`data → engine → state → components`)으로 분리되어 있다.
> 구조·확장 가이드는 [`docs/architecture.md`](docs/architecture.md), 코드 작업 진입점은 [`CLAUDE.md`](CLAUDE.md) 참고.

## 기술 스택

- React 18 + Vite (JavaScript)
- **Tailwind CSS v4** (`@tailwindcss/vite`) — 유틸리티 기반, 시맨틱 토큰으로 **다크/라이트 테마** 전환
- 폰트: IBM Plex Sans KR(본문) + JetBrains Mono(숫자·코드) + Space Grotesk(디스플레이) (Google Fonts)
- 게임 HUD 레이아웃 — 데스크톱 / **휴대폰 가로(TFT 모바일식 한 화면)** / 세로 스택
- Playwright E2E

## 로드맵 (요약)

- [x] 코어 루프(상점·벤치·보드·전투)
- [x] 별업 + 합성(2단계) + 시너지 버프
- [x] 경제(이자·연승연패·레벨)
- [ ] 보스 라운드 / 증강체 보상
- [ ] 밸런스 튜닝
- [ ] (선택) 전투 비주얼 Phaser 이관, 멀티플레이

## 라이선스

[MIT](LICENSE)
