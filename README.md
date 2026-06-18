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

## 프로젝트 구조

```
stack-tactics/
├─ index.html
├─ vite.config.js
├─ src/
│  ├─ main.jsx        # 진입점
│  ├─ App.jsx         # 게임 전체 (데이터·로직·UI·스타일)
│  └─ index.css       # 페이지 배경/정렬
└─ docs/
   └─ design.md       # 설계 · 밸런스 문서 (살아있는 문서)
```

> 지금은 `App.jsx` 한 파일에 다 들어있다. 규모가 커지면 `data / engine(전투·합성·경제) / components` 로 분리하는 게 다음 정리 과제.

## 기술 스택

- React 18 + Vite (JavaScript)
- 스타일은 컴포넌트 내장 CSS (외부 의존성 없음)

## 로드맵 (요약)

- [x] 코어 루프(상점·벤치·보드·전투)
- [x] 별업 + 합성(2단계) + 시너지 버프
- [x] 경제(이자·연승연패·레벨)
- [ ] 보스 라운드 / 증강체 보상
- [ ] 밸런스 튜닝
- [ ] (선택) 전투 비주얼 Phaser 이관, 멀티플레이

## 라이선스

[MIT](LICENSE)
