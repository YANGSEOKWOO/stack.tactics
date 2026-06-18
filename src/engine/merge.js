import { makeUnit } from "./units.js";

// 별업 자동 합성 — 같은 defId+성급 3개를 1개의 상위 성급으로 합친다(연쇄 처리).
// 보드 위에서 합쳐지면 가장 앞 슬롯에 착지, 아니면 벤치로.
export function processMerges(bench, board) {
  bench = [...bench]; board = [...board];
  while (true) {
    const locs = [];
    bench.forEach((u, i) => locs.push({ u, where: "bench", i }));
    board.forEach((u, i) => u && locs.push({ u, where: "board", i }));
    const groups = {};
    for (const l of locs) { if (l.u.star >= 3) continue; (groups[l.u.defId + "|" + l.u.star] ||= []).push(l); }
    const hit = Object.values(groups).find((g) => g.length >= 3);
    if (!hit) break;
    const three = hit.slice(0, 3);
    let landing = null;
    for (const t of three) {
      if (t.where === "bench") bench[t.i] = null;
      else { board[t.i] = null; if (landing === null) landing = t.i; }
    }
    bench = bench.filter(Boolean);
    const up = makeUnit(three[0].u.defId, three[0].u.star + 1);
    if (landing !== null) board[landing] = up; else bench.push(up);
  }
  return { bench: bench.filter(Boolean), board };
}
