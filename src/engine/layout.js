// 전투 화면의 아키텍처 다이어그램 배치 계산(0..100 퍼센트 좌표).
// 카테고리별 열로 노드를 세우고, 계층 간 연결선(edges)을 만든다. composite 는 frontend 열로 묶음.
export function archLayout(players) {
  const cols = { frontend: [], backend: [], database: [], infra: [] };
  players.forEach((p) => { const b = p.cat === "composite" ? "frontend" : p.cat; cols[b].push(p); });
  const colX = { frontend: 22, backend: 50, database: 78 };
  const placed = [];
  ["frontend", "backend", "database"].forEach((cat) => {
    const arr = cols[cat], n = arr.length;
    arr.forEach((p, i) => placed.push({ p, x: colX[cat], y: 40 + (i - (n - 1) / 2) * 19, cat }));
  });
  const inf = cols.infra, ni = inf.length;
  inf.forEach((p, i) => placed.push({ p, x: ni === 1 ? 50 : 22 + i * (56 / Math.max(1, ni - 1)), y: 86, cat: "infra" }));
  const centroid = (cat) => {
    const pts = placed.filter((q) => q.cat === cat);
    if (!pts.length) return null;
    return { x: colX[cat] || 50, y: pts.reduce((a, b) => a + b.y, 0) / pts.length };
  };
  const fe = centroid("frontend"), be = centroid("backend"), db = centroid("database");
  const edges = [];
  if (fe && be) edges.push({ x1: fe.x, y1: fe.y, x2: be.x, y2: be.y });
  if (be && db) edges.push({ x1: be.x, y1: be.y, x2: db.x, y2: db.y });
  if (fe && db && !be) edges.push({ x1: fe.x, y1: fe.y, x2: db.x, y2: db.y });
  if (inf.length) { const ic = { x: 50, y: 86 };[fe, be, db].forEach((cc) => { if (cc) edges.push({ x1: ic.x, y1: ic.y, x2: cc.x, y2: cc.y, infra: true }); }); }
  return { placed, edges };
}
