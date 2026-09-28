# 도메인 용어집 (Glossary)

> 코드·문서에서 반복되는 게임 용어. 처음 보는 코드를 읽기 전 이 표만 봐도 맥락이 잡힌다.

| 용어 | 코드상 표현 | 뜻 |
|---|---|---|
| 기물 / 유닛 | `DEFS[id]`, `makeUnit` | 보드·벤치에 올리는 개체. 컴포넌트 기물 + 합성 유닛. |
| 컴포넌트 기물 | `composite: false` | 상점에서 사는 기본 기물 (HTML, JS, Node…). |
| 합성 유닛 | `composite: true` | deploy 로만 만드는 상위 유닛 (Frontend, Web App…). 상점에 안 나옴. |
| 카테고리 | `cat` | frontend·backend·database·infra·composite. **시너지 단위**이자 색상 단위. |
| 코스트 | `cost` | 구매 가격 = 희귀도. 레벨↑ → 고코스트 등장 확률↑. |
| 성급 / 별업 | `star`, `STAR_MULT` | 같은 기물 3개 → ★ 1단계 상승(자동). 능력치 배율 적용. |
| 보드 | `board` (길이 `BOARD_MAX` = `BOARD_ROWS`×`BOARD_COLS` = 4×7) | TFT식 벌집(헥스) 배치 구역. 28칸 어디든 놓되 동시 배치 수는 `cap`(=레벨, 최대 10). 인덱스 → 행 `i / BOARD_COLS`. |
| 벤치 | `bench` (`BENCH_SLOTS`) | 대기 구역. 전투 참여 안 함. |
| deploy | `deploy(recipe)` | 보드의 재료를 합성 유닛으로 변환(수동, 가로축 성장). |
| 레시피 | `RECIPES`, `recipeBoardIndices` | 합성 조합 정의 (need → makes). |
| 시너지 / 트레잇 | `TRAIT_DEFS`, `computeCounts` | 보드의 카테고리 카운트가 임계값 넘으면 팀 버프 발동. |
| 버프 | `computeBuffs` | 시너지 결과 (atkMult·hpMult·heal·dmgRed). |
| 버그 | `BUG_TYPES`, `makeEnemies` | 적. 스테이지마다 웨이브로 유입. |
| 틱 | `combatTick`, `tick` | 전투 진행 단위(650ms). 28틱 도달 시 잔여 체력으로 승패. |
| 전열 / 최전방 | `unitRow`, `frontRow`, `rowName` | 버그는 살아있는 유닛이 있는 **가장 앞 행**(row 0 = 맨 위)만 때린다. 앞줄이 무너져야 뒷줄 노출 → 탱커 앞, 캐리 뒤. |
| 전투 이벤트 | `combat.events` | 틱마다 `{src, dst, dmg, side}` 타격 목록. 표현 계층이 돌진·투사체·피격 모션을 그린다. |
| 페이즈 | `phase` | `"shop"` | `"combat"` | `"gameover"`. |
| 이자 | `Math.floor(gold/10)` | 보유 골드 10당 +1g (최대 5). 경제 굴리기. |
| 연승/연패 | `streak`, `streakType` | 연속 승/패 보너스 골드. |

## 성장 두 축 (게임의 핵심 의사결정)

- **세로축 — 별업:** 같은 기물 깊게 (3개→★). 자동.
- **가로축 — 합성/deploy:** 다른 카테고리 넓게. 수동.
- 둘은 **자원 경쟁** 관계 — 자세한 설계 의도는 [`design.md`](design.md) §1~2.
