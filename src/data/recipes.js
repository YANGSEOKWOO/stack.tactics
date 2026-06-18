// 합성 레시피 — 컴포넌트 → 시스템 → 플랫폼 테크 트리. → docs/domain-glossary.md
// need[] 의 모든 재료를 보드에 올리면 deploy 가능. makes 는 data/units.js 의 키.
export const RECIPES = [
  { need: ["HTML", "CSS", "JS"], makes: "FRONTEND" },
  { need: ["NODE", "JAVA", "PYTHON"], makes: "BACKEND" },
  { need: ["REDIS", "MONGO", "POSTGRES"], makes: "DATALAYER" },
  { need: ["VPC", "SG", "LB"], makes: "INFRA" },
  { need: ["FRONTEND", "BACKEND"], makes: "WEBAPP" },
  { need: ["WEBAPP", "DATALAYER"], makes: "FULLSTACK" },
];

// 레시피 모달에 노출되는 플레이버 설명. key = RECIPES[].makes
export const RECIPE_DESC = {
  FRONTEND: { tier: "시스템", text: "사용자에게 보이는 화면 계층. HTML 구조 + CSS 스타일 + JS 동작을 합쳐 렌더한다." },
  BACKEND: { tier: "시스템", text: "비즈니스 로직과 API. 요청을 처리하고 데이터를 가공한다." },
  DATALAYER: { tier: "시스템", text: "데이터 저장·캐시 계층. 지속성과 빠른 조회를 담당한다." },
  INFRA: { tier: "시스템", text: "네트워크·보안·로드밸런싱 기반. 시스템을 떠받친다." },
  WEBAPP: { tier: "플랫폼", text: "프론트엔드 + 백엔드를 묶은 동작하는 웹 애플리케이션." },
  FULLSTACK: { tier: "플랫폼", text: "웹앱 + 데이터까지 갖춘 완성형 시스템. 최강의 단일 유닛." },
};
