// 기물 정의 — 게임의 모든 유닛(컴포넌트 기물 + 합성 유닛)의 단일 출처.
// 밸런스 수치(hp/atk/cost)는 전부 여기서 관리한다. → docs/balance.md
//
// 필드:
//   cat        : 카테고리 = 시너지(트레잇) 단위. frontend|backend|database|infra|composite
//   cost       : 코스트 = 상점 희귀도. composite 유닛은 0(상점에 안 나옴, deploy로만 생성)
//   composite  : 합성 유닛 여부 (별업 가능, 상점 풀 제외)
//   traits     : 시너지 카운트 기여. 없으면 자기 cat에 1 기여로 간주(engine/synergy.js)
export const DEFS = {
  HTML: { name: "HTML", cat: "frontend", cost: 1, hp: 30, atk: 5, glyph: "</>" },
  CSS: { name: "CSS", cat: "frontend", cost: 1, hp: 25, atk: 4, glyph: "{ }" },
  JS: { name: "JS", cat: "frontend", cost: 2, hp: 35, atk: 9, glyph: "JS" },
  REACT: { name: "React", cat: "frontend", cost: 3, hp: 45, atk: 13, glyph: "⚛" },
  NODE: { name: "Node", cat: "backend", cost: 1, hp: 30, atk: 8, glyph: "⬡" },
  JAVA: { name: "Java", cat: "backend", cost: 2, hp: 55, atk: 7, glyph: "☕" },
  PYTHON: { name: "Python", cat: "backend", cost: 2, hp: 40, atk: 10, glyph: "🐍" },
  GO: { name: "Go", cat: "backend", cost: 3, hp: 45, atk: 14, glyph: "🐹" },
  REDIS: { name: "Redis", cat: "database", cost: 2, hp: 35, atk: 5, glyph: "◆" },
  MONGO: { name: "Mongo", cat: "database", cost: 2, hp: 45, atk: 9, glyph: "🍃" },
  POSTGRES: { name: "Postgres", cat: "database", cost: 3, hp: 70, atk: 6, glyph: "🐘" },
  VPC: { name: "VPC", cat: "infra", cost: 1, hp: 40, atk: 3, glyph: "☁" },
  SG: { name: "SG", cat: "infra", cost: 1, hp: 50, atk: 2, glyph: "🛡" },
  LB: { name: "LB", cat: "infra", cost: 2, hp: 35, atk: 5, glyph: "⇄" },
  DOCKER: { name: "Docker", cat: "infra", cost: 3, hp: 55, atk: 7, glyph: "🐳" },
  K8S: { name: "K8s", cat: "infra", cost: 4, hp: 95, atk: 8, glyph: "☸" },
  FRONTEND: { name: "Frontend", cat: "frontend", composite: true, cost: 0, hp: 95, atk: 20, glyph: "🖥", traits: { frontend: 2 } },
  BACKEND: { name: "Backend", cat: "backend", composite: true, cost: 0, hp: 115, atk: 16, glyph: "⚙", traits: { backend: 2 } },
  DATALAYER: { name: "DataLayer", cat: "database", composite: true, cost: 0, hp: 135, atk: 10, glyph: "🗄", traits: { database: 2 } },
  INFRA: { name: "Infra", cat: "infra", composite: true, cost: 0, hp: 180, atk: 9, glyph: "🏗", traits: { infra: 2 } },
  WEBAPP: { name: "Web App", cat: "composite", composite: true, cost: 0, hp: 230, atk: 34, glyph: "🌐", traits: { frontend: 2, backend: 2 } },
  FULLSTACK: { name: "Full Stack", cat: "composite", composite: true, cost: 0, hp: 360, atk: 50, glyph: "🚀", traits: { frontend: 2, backend: 2, database: 2 } },
};
