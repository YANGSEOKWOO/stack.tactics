import React, { useState, useEffect, useRef } from "react";

// ============================ Game data =====================================
// cat: frontend | backend | database | infra | composite(themed)
const DEFS = {
  // ---- frontend ----
  HTML: { name: "HTML", cat: "frontend", cost: 1, hp: 30, atk: 5, glyph: "</>" },
  CSS: { name: "CSS", cat: "frontend", cost: 1, hp: 25, atk: 4, glyph: "{ }" },
  JS: { name: "JS", cat: "frontend", cost: 2, hp: 35, atk: 9, glyph: "JS" },
  REACT: { name: "React", cat: "frontend", cost: 3, hp: 45, atk: 13, glyph: "⚛" },
  // ---- backend ----
  NODE: { name: "Node", cat: "backend", cost: 1, hp: 30, atk: 8, glyph: "⬡" },
  JAVA: { name: "Java", cat: "backend", cost: 2, hp: 55, atk: 7, glyph: "☕" },
  PYTHON: { name: "Python", cat: "backend", cost: 2, hp: 40, atk: 10, glyph: "🐍" },
  GO: { name: "Go", cat: "backend", cost: 3, hp: 45, atk: 14, glyph: "🐹" },
  // ---- database ----
  REDIS: { name: "Redis", cat: "database", cost: 2, hp: 35, atk: 5, glyph: "◆" },
  MONGO: { name: "Mongo", cat: "database", cost: 2, hp: 45, atk: 9, glyph: "🍃" },
  POSTGRES: { name: "Postgres", cat: "database", cost: 3, hp: 70, atk: 6, glyph: "🐘" },
  // ---- infra ----
  VPC: { name: "VPC", cat: "infra", cost: 1, hp: 40, atk: 3, glyph: "☁" },
  SG: { name: "SG", cat: "infra", cost: 1, hp: 50, atk: 2, glyph: "🛡" },
  LB: { name: "LB", cat: "infra", cost: 2, hp: 35, atk: 5, glyph: "⇄" },
  DOCKER: { name: "Docker", cat: "infra", cost: 3, hp: 55, atk: 7, glyph: "🐳" },
  K8S: { name: "K8s", cat: "infra", cost: 4, hp: 95, atk: 8, glyph: "☸" },
  // ---- composites (built via deploy, not in shop) ----
  FRONTEND: { name: "Frontend", cat: "frontend", composite: true, cost: 0, hp: 95, atk: 20, glyph: "🖥", traits: { frontend: 2 } },
  BACKEND: { name: "Backend", cat: "backend", composite: true, cost: 0, hp: 115, atk: 16, glyph: "⚙", traits: { backend: 2 } },
  DATALAYER: { name: "DataLayer", cat: "database", composite: true, cost: 0, hp: 135, atk: 10, glyph: "🗄", traits: { database: 2 } },
  INFRA: { name: "Infra", cat: "infra", composite: true, cost: 0, hp: 180, atk: 9, glyph: "🏗", traits: { infra: 2 } },
  WEBAPP: { name: "Web App", cat: "composite", composite: true, cost: 0, hp: 230, atk: 34, glyph: "🌐", traits: { frontend: 2, backend: 2 } },
  FULLSTACK: { name: "Full Stack", cat: "composite", composite: true, cost: 0, hp: 360, atk: 50, glyph: "🚀", traits: { frontend: 2, backend: 2, database: 2 } },
};

const RECIPES = [
  { need: ["HTML", "CSS", "JS"], makes: "FRONTEND" },
  { need: ["NODE", "JAVA", "PYTHON"], makes: "BACKEND" },
  { need: ["REDIS", "MONGO", "POSTGRES"], makes: "DATALAYER" },
  { need: ["VPC", "SG", "LB"], makes: "INFRA" },
  { need: ["FRONTEND", "BACKEND"], makes: "WEBAPP" },
  { need: ["WEBAPP", "DATALAYER"], makes: "FULLSTACK" },
];

const TRAIT_DEFS = [
  { cat: "frontend", name: "Frontend", thr: [2, 4], desc: "공격력 +20% / +45%" },
  { cat: "backend", name: "Backend", thr: [2, 4], desc: "최대 체력 +25% / +50%" },
  { cat: "database", name: "Database", thr: [2, 3], desc: "초당 회복 +5 / +12" },
  { cat: "infra", name: "Infra", thr: [2, 3], desc: "받는 피해 -15% / -30%" },
];

const BOARD_MAX = 8;
const BENCH_SLOTS = 9;
const STAR_MULT = [1, 1.8, 3.2];
const START_LEVEL = 4;
const XP_TO_NEXT = { 4: 6, 5: 10, 6: 16, 7: 24 }; // lvl cap 8
const ODDS = { // shop cost odds [1,2,3,4] by level
  4: [0.55, 0.30, 0.13, 0.02], 5: [0.45, 0.33, 0.18, 0.04],
  6: [0.35, 0.35, 0.22, 0.08], 7: [0.28, 0.32, 0.28, 0.12], 8: [0.22, 0.30, 0.30, 0.18],
};
const POOL_BY_COST = (() => {
  const p = { 1: [], 2: [], 3: [], 4: [] };
  for (const id in DEFS) if (!DEFS[id].composite) p[DEFS[id].cost].push(id);
  return p;
})();

let UID = 1;
function makeUnit(defId, star = 1) {
  const d = DEFS[defId], m = STAR_MULT[star - 1];
  return {
    uid: UID++, defId, name: d.name, cat: d.cat, glyph: d.glyph, composite: !!d.composite,
    star, hp: Math.round(d.hp * m), atk: Math.round(d.atk * m),
  };
}
function rollShop(level) {
  const odds = ODDS[Math.max(4, Math.min(8, level))] || ODDS[8];
  return Array.from({ length: 5 }, () => {
    let r = Math.random(), acc = 0, cost = 1;
    for (let c = 0; c < 4; c++) { acc += odds[c]; if (r <= acc) { cost = c + 1; break; } }
    const pool = POOL_BY_COST[cost].length ? POOL_BY_COST[cost] : POOL_BY_COST[1];
    return pool[Math.floor(Math.random() * pool.length)];
  });
}

function processMerges(bench, board) {
  bench = [...bench]; board = [...board];
  while (true) {
    const locs = [];
    bench.forEach((u, i) => locs.push({ u, where: "bench", i }));
    board.forEach((u, i) => u && locs.push({ u, where: "board", i }));
    const groups = {};
    for (const l of locs) {
      if (l.u.star >= 3) continue;            // composites CAN star-up now
      (groups[l.u.defId + "|" + l.u.star] ||= []).push(l);
    }
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
function recipeBoardIndices(board, recipe) {
  const idx = [];
  for (const defId of recipe.need) {
    const i = board.findIndex((u, k) => u && u.defId === defId && !idx.includes(k));
    if (i === -1) return null;
    idx.push(i);
  }
  return idx;
}

function traitContribution(u) {
  const d = DEFS[u.defId];
  if (d.traits) return d.traits;
  return { [u.cat]: 1 };
}
function computeCounts(board) {
  const c = { frontend: 0, backend: 0, database: 0, infra: 0 };
  for (const u of board) if (u) { const t = traitContribution(u); for (const k in t) c[k] += t[k]; }
  return c;
}
function computeBuffs(c) {
  return {
    atkMult: c.frontend >= 4 ? 1.45 : c.frontend >= 2 ? 1.2 : 1,
    hpMult: c.backend >= 4 ? 1.5 : c.backend >= 2 ? 1.25 : 1,
    heal: c.database >= 3 ? 12 : c.database >= 2 ? 5 : 0,
    dmgRed: c.infra >= 3 ? 0.30 : c.infra >= 2 ? 0.15 : 0,
  };
}

function makeEnemies(stage) {
  const n = Math.min(2 + stage, 6);
  const bugs = ["Bug", "NPE", "404", "RaceCond", "MemLeak", "Timeout"];
  return Array.from({ length: n }, (_, i) => {
    const hp = Math.round(36 + stage * 18);
    return { uid: "e" + UID++, name: bugs[i % bugs.length], glyph: "🐛", hp, cur: hp, atk: Math.round(6 + stage * 2.6), hit: false, lastDmg: 0 };
  });
}
function combatTick(c) {
  const player = c.player.map((u) => ({ ...u, hit: false, lastDmg: 0 }));
  const enemy = c.enemy.map((u) => ({ ...u, hit: false, lastDmg: 0 }));
  const fa = (a) => a.find((u) => u.cur > 0);
  for (const u of player) { if (u.cur <= 0) continue; const t = fa(enemy); if (t) { t.cur -= u.atk; t.hit = true; t.lastDmg += u.atk; } }
  for (const u of enemy) {
    if (u.cur <= 0) continue; const t = fa(player);
    if (t) { const d = Math.max(1, Math.round(u.atk * (1 - c.buffs.dmgRed))); t.cur -= d; t.hit = true; t.lastDmg += d; }
  }
  if (c.buffs.heal) for (const u of player) if (u.cur > 0) u.cur = Math.min(u.hp, u.cur + c.buffs.heal);
  const tick = c.tick + 1;
  const pA = player.some((u) => u.cur > 0), eA = enemy.some((u) => u.cur > 0);
  let done = false, result = null;
  if (!eA) { done = true; result = "win"; }
  else if (!pA) { done = true; result = "lose"; }
  else if (tick >= 26) {
    done = true;
    result = player.reduce((s, u) => s + Math.max(0, u.cur), 0) >= enemy.reduce((s, u) => s + Math.max(0, u.cur), 0) ? "win" : "lose";
  }
  return { ...c, player, enemy, tick, done, result };
}

// ============================ Styles ========================================
const CSS = `
.tt{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;color:#c8d3e3;width:100%;max-width:760px;margin:0 auto;
  padding:16px;border-radius:16px;border:1px solid #1c2740;font-size:12.5px;line-height:1.45;
  background:radial-gradient(120% 120% at 0% 0%,#111a2c 0%,#0b1019 55%,#090d15 100%);}
.tt *{box-sizing:border-box;}
.tt .cat-frontend{--acc:#ffb86c;--edge:#5a4326;--cbg:#1c160e;}
.tt .cat-backend{--acc:#c39bff;--edge:#433463;--cbg:#171029;}
.tt .cat-database{--acc:#7dd3fc;--edge:#26475e;--cbg:#0c1a24;}
.tt .cat-infra{--acc:#34d399;--edge:#1f5341;--cbg:#0c1f18;}
.tt .cat-composite{--acc:#67e8f9;--edge:#2b5a6c;--cbg:#0c2030;}

.tt .bar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 13px;border-radius:11px;
  border:1px solid #1f2b44;background:linear-gradient(180deg,#162236,#101827);}
.tt .dots{display:flex;gap:6px;margin-right:8px;}
.tt .dot{width:11px;height:11px;border-radius:50%;}
.tt .brand{font-weight:700;letter-spacing:.4px;color:#eaf1fb;font-size:14px;}
.tt .curs{display:inline-block;width:7px;height:14px;background:#67e8f9;margin-left:4px;vertical-align:-2px;border-radius:1px;animation:ttBlink 1.1s steps(1) infinite;}
@keyframes ttBlink{50%{opacity:0;}}
.tt .pills{display:flex;gap:7px;flex-wrap:wrap;}
.tt .pill{display:flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;border:1px solid #243149;background:#0d1422;font-size:11px;white-space:nowrap;}
.tt .tagline{margin:9px 2px 12px;color:#5a677f;font-size:11px;}
.tt .cm{color:#3c465f;}

.tt .toast{margin:0 0 11px;padding:8px 12px;border-radius:9px;text-align:center;font-size:12px;color:#bfeefc;
  border:1px solid #2a5d70;background:linear-gradient(180deg,#0e2733,#0b1b25);box-shadow:0 0 18px -6px #67e8f9;animation:ttToast .25s ease;}
@keyframes ttToast{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:none;}}

.tt .label{font-size:11px;color:#6b7790;margin:0 2px 6px;display:flex;align-items:center;justify-content:space-between;}

.tt .econ{display:flex;align-items:center;gap:11px;flex-wrap:wrap;padding:8px 11px;border-radius:11px;margin-bottom:12px;
  border:1px solid #1f2b44;background:linear-gradient(180deg,#121b2c,#0e1422);font-size:11px;}
.tt .xpwrap{flex:1;min-width:120px;}
.tt .xptrack{height:6px;border-radius:4px;background:#1a2236;overflow:hidden;margin-top:4px;}
.tt .xpfill{height:100%;border-radius:4px;background:linear-gradient(90deg,#38bdf8,#818cf8);transition:width .3s;}

.tt .synergy{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:12px;}
.tt .syn{flex:1;min-width:120px;border-radius:10px;border:1px solid #202a40;background:#0e1422;padding:7px 9px;opacity:.55;transition:.2s;}
.tt .syn.on{opacity:1;border-color:var(--acc);box-shadow:0 0 14px -5px var(--acc);}
.tt .syn .sh{display:flex;align-items:center;justify-content:space-between;font-weight:700;color:var(--acc);font-size:11px;}
.tt .syn .sc{font-size:10px;color:#9aa6bd;}
.tt .syn .sd{font-size:9px;color:#5d6880;margin-top:2px;}

.tt .board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:12px;border-radius:13px;margin-bottom:13px;
  border:1px solid #202c46;
  background:radial-gradient(circle at 1px 1px,#1a2740 1px,transparent 0) 0 0/15px 15px,linear-gradient(180deg,#0f1626,#0b101b);}
.tt .tile{min-width:0;height:62px;display:flex;align-items:center;justify-content:center;border-radius:10px;border:1px dashed #28344f;transition:border-color .12s,background .12s;}
.tt .tile.empty{cursor:pointer;}
.tt .tile.empty:hover{border-color:#3f5c8c;background:#121b2e;}
.tt .tile.locked{border-style:solid;border-color:#1a2335;color:#2c3650;cursor:not-allowed;font-size:14px;}

.tt .bench{display:flex;flex-wrap:wrap;gap:8px;padding:12px;border-radius:13px;margin-bottom:11px;min-height:74px;
  border:1px solid #202c46;background:linear-gradient(180deg,#0f1626,#0b101b);align-items:center;}
.tt .empty-hint{color:#475168;font-size:11px;}

.tt .chip{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
  width:62px;height:60px;border-radius:11px;border:1px solid var(--edge);cursor:pointer;
  background:linear-gradient(180deg,var(--cbg),#0c1019);transition:transform .12s,box-shadow .12s,border-color .12s;}
.tt .tile .chip{width:100%;height:100%;}
.tt .chip:hover{transform:translateY(-2px);border-color:var(--acc);box-shadow:0 5px 16px rgba(0,0,0,.5);}
.tt .chip.sel{border-color:#67e8f9;box-shadow:0 0 0 2px rgba(103,232,249,.55),0 5px 16px rgba(0,0,0,.5);}
.tt .chip .g{font-size:17px;line-height:1;color:var(--acc);}
.tt .chip .nm{font-size:10px;font-weight:700;color:var(--acc);max-width:100%;overflow:hidden;text-overflow:ellipsis;}
.tt .chip .st{font-size:9px;color:#7884a0;white-space:nowrap;}
.tt .chip .star{position:absolute;top:-8px;right:1px;font-size:11px;color:#ffd76a;text-shadow:0 0 5px rgba(255,215,106,.7);}
.tt .chip.composite .g{filter:drop-shadow(0 0 6px var(--acc));}
.tt .chip.composite{animation:ttPulse 2.6s ease-in-out infinite;}
@keyframes ttPulse{0%,100%{box-shadow:0 0 0 1px var(--edge),0 0 12px -4px var(--acc);}50%{box-shadow:0 0 0 1px var(--acc),0 0 18px 0 var(--acc);}}

.tt .selbar{display:flex;align-items:center;gap:9px;margin-bottom:11px;font-size:11px;color:#7884a0;}

.tt .recipes{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:13px;}
.tt .recipe{border-radius:12px;border:1px solid var(--edge);padding:9px 11px;background:linear-gradient(180deg,var(--cbg),#0c1019);transition:box-shadow .25s,border-color .25s;}
.tt .recipe.ready{border-color:var(--acc);box-shadow:0 0 18px -4px var(--acc);}
.tt .recipe .rh{display:flex;align-items:center;justify-content:space-between;gap:7px;font-size:12px;font-weight:700;color:var(--acc);}
.tt .recipe .rg{font-size:15px;}
.tt .parts{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px;}
.tt .part{font-size:10px;padding:2px 7px;border-radius:7px;background:#19223a;color:#56637e;}
.tt .part.have{background:#23314c;color:#dde7f6;}

.tt .shop{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;}
.tt .scard{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;height:84px;
  border-radius:11px;border:1px solid var(--edge);cursor:pointer;overflow:hidden;
  background:linear-gradient(180deg,var(--cbg),#0c1019);transition:transform .12s,box-shadow .12s;}
.tt .scard::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--acc);}
.tt .scard:hover{transform:translateY(-3px);box-shadow:0 7px 20px rgba(0,0,0,.55);}
.tt .scard.poor{opacity:.45;cursor:not-allowed;}
.tt .scard.poor:hover{transform:none;box-shadow:none;}
.tt .scard .g{font-size:20px;color:var(--acc);}
.tt .scard .nm{font-size:11px;font-weight:700;color:var(--acc);}
.tt .scard .st{font-size:9px;color:#7884a0;}
.tt .scard .cost{font-size:10px;color:#ffd76a;margin-top:1px;}
.tt .scard.slotempty{border-style:dashed;cursor:default;background:none;}
.tt .scard.slotempty::before{display:none;}

.tt .btn{font-family:inherit;font-size:11px;border-radius:9px;border:1px solid #2a3956;background:#131d2e;color:#c8d3e3;padding:6px 13px;cursor:pointer;transition:border-color .12s,color .12s,box-shadow .12s;}
.tt .btn:hover{border-color:#67e8f9;color:#c8f3fc;}
.tt .btn.primary{border-color:#2c7186;background:linear-gradient(180deg,#114a5d,#0c2f3e);color:#caf4fc;font-weight:700;}
.tt .btn.primary:hover{box-shadow:0 0 16px -3px #67e8f9;}
.tt .btn.danger{border-color:#6e2c3d;color:#fda4b4;padding:3px 10px;}
.tt .btn.small{padding:3px 10px;font-size:10px;}
.tt .btn.deploy{padding:2px 9px;font-size:10px;border-color:var(--acc);color:var(--acc);background:transparent;}
.tt .btn.deploy:hover{background:var(--acc);color:#0b1019;box-shadow:0 0 12px -3px var(--acc);}

.tt .arena{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:6px;}
.tt .side .sh{font-size:11px;margin-bottom:7px;}
.tt .formation{display:flex;flex-direction:column;gap:7px;}
.tt .ava{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 6px;border-radius:10px;
  border:1px solid #233149;background:#0f1727;transition:background .35s,transform .1s;}
.tt .ava.hit{background:#3a1622;border-color:#7e3047;}
.tt .ava.dead{opacity:.24;filter:grayscale(1);}
.tt .ava .avg{font-size:21px;}
.tt .ava .avn{font-size:10px;color:#aeb9cf;}
.tt .ava .avhp{font-size:9px;color:#7884a0;}
.tt .ava .hpbar{width:100%;}
.tt .hpbar{height:6px;border-radius:4px;background:#1a2236;overflow:hidden;margin-top:3px;}
.tt .hpfill{height:100%;border-radius:4px;transition:width .4s ease;}
.tt .dmgpop{position:absolute;top:2px;right:6px;font-size:13px;font-weight:800;color:#fb7185;text-shadow:0 0 6px rgba(251,113,133,.6);animation:ttPop .85s ease-out forwards;}
@keyframes ttPop{0%{opacity:1;transform:translateY(0);}100%{opacity:0;transform:translateY(-20px);}}

.tt .over{text-align:center;padding:46px 0;}
.tt .over .t{font-size:24px;font-weight:800;color:#fb7185;letter-spacing:.5px;}
.tt .over .s{margin-top:7px;color:#7884a0;}

.tt .footer{margin-top:13px;border-top:1px solid #1b2538;padding-top:10px;font-size:10.5px;line-height:1.7;color:#54607a;}
`;

// ============================ UI bits =======================================
function hpStyle(cur, max) {
  const pct = Math.max(0, Math.round((cur / max) * 100));
  const grad = pct > 50 ? "linear-gradient(90deg,#34d399,#10b981)"
    : pct > 25 ? "linear-gradient(90deg,#fbbf24,#f59e0b)"
    : "linear-gradient(90deg,#fb7185,#e11d48)";
  return { width: pct + "%", background: grad };
}
function Chip({ u, sel, onClick }) {
  return (
    <div className={"chip cat-" + u.cat + (u.composite ? " composite" : "") + (sel ? " sel" : "")}
      onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {u.star > 1 && <span className="star">{"★".repeat(u.star)}</span>}
      <span className="g">{u.glyph}</span>
      <span className="nm">{u.name}</span>
      <span className="st">{u.hp}♥ {u.atk}⚔</span>
    </div>
  );
}
function Ava({ u, tick }) {
  return (
    <div className={"ava" + (u.cur <= 0 ? " dead" : "") + (u.hit ? " hit" : "")}>
      {u.lastDmg > 0 && <span key={tick} className="dmgpop">-{u.lastDmg}</span>}
      <span className="avg">{u.glyph}</span>
      <span className="avn">{u.name}{u.star > 1 ? " " + "★".repeat(u.star) : ""}</span>
      <div className="hpbar"><div className="hpfill" style={hpStyle(u.cur, u.hp)} /></div>
      <span className="avhp">{Math.max(0, Math.round(u.cur))}/{u.hp}</span>
    </div>
  );
}

// ============================ App ===========================================
export default function App() {
  const [gold, setGold] = useState(12);
  const [hp, setHp] = useState(100);
  const [stage, setStage] = useState(1);
  const [level, setLevel] = useState(START_LEVEL);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [streakType, setStreakType] = useState(null);
  const [phase, setPhase] = useState("shop");
  const [shop, setShop] = useState(() => rollShop(START_LEVEL));
  const [bench, setBench] = useState([]);
  const [board, setBoard] = useState(Array(BOARD_MAX).fill(null));
  const [sel, setSel] = useState(null);
  const [combat, setCombat] = useState(null);
  const [toast, setToast] = useState("");
  const tref = useRef();
  const cap = level; // unlocked board slots

  function flash(m) { setToast(m); clearTimeout(tref.current); tref.current = setTimeout(() => setToast(""), 1900); }
  function settle(nb, brd) { const m = processMerges(nb, brd); setBench(m.bench); setBoard(m.board); }

  function buy(i) {
    if (phase !== "shop") return;
    const defId = shop[i]; if (!defId) return;
    const cost = DEFS[defId].cost;
    if (gold < cost) return flash("골드가 부족해");
    if (bench.filter(Boolean).length >= BENCH_SLOTS) return flash("벤치가 가득 찼어");
    setGold((g) => g - cost);
    setShop((s) => s.map((v, k) => (k === i ? null : v)));
    settle([...bench, makeUnit(defId)], board);
  }
  function reroll() {
    if (phase !== "shop") return;
    if (gold < 2) return flash("골드가 부족해");
    setGold((g) => g - 2); setShop(rollShop(level));
  }
  function buyXp() {
    if (phase !== "shop") return;
    if (level >= 8) return flash("이미 최대 레벨이야");
    if (gold < 4) return flash("골드가 부족해");
    let nXp = xp + 4, nLv = level;
    while (nLv < 8 && nXp >= XP_TO_NEXT[nLv]) { nXp -= XP_TO_NEXT[nLv]; nLv++; }
    setGold((g) => g - 4); setXp(nXp); setLevel(nLv);
    if (nLv > level) flash("레벨 " + nLv + "! 보드 " + nLv + "칸 해제");
  }
  function deploy(recipe) {
    if (phase !== "shop") return;
    const idx = recipeBoardIndices(board, recipe);
    if (!idx) return flash("보드에 재료를 모두 올려야 deploy할 수 있어");
    const nb = [...board]; const landing = Math.min(...idx);
    idx.forEach((i) => (nb[i] = null));
    nb[landing] = makeUnit(recipe.makes, 1);
    const m = processMerges(bench, nb); setBench(m.bench); setBoard(m.board); setSel(null);
    flash("⚡ " + DEFS[recipe.makes].name + " 배포 완료!");
  }
  function clickBench(i) {
    if (phase !== "shop") return;
    if (sel && sel.where === "board") {
      const u = board[sel.i]; if (!u) return setSel(null);
      const nb = [...board]; nb[sel.i] = null;
      settle([...bench, u], nb); setSel(null); return;
    }
    setSel(sel && sel.where === "bench" && sel.i === i ? null : { where: "bench", i });
  }
  function clickBoard(i) {
    if (phase !== "shop") return;
    if (i >= cap) return flash("레벨업으로 해제되는 슬롯이야");
    if (sel) {
      if (sel.where === "bench") {
        const u = bench[sel.i]; if (!u) return setSel(null);
        const nb = [...board];
        if (nb[i]) { const sw = nb[i]; nb[i] = u; settle(bench.filter((_, k) => k !== sel.i).concat(sw), nb); }
        else { nb[i] = u; settle(bench.filter((_, k) => k !== sel.i), nb); }
        setSel(null);
      } else {
        if (sel.i === i) return setSel(null);
        const nb = [...board]; const a = nb[sel.i]; nb[sel.i] = nb[i]; nb[i] = a;
        settle(bench, nb); setSel(null);
      }
      return;
    }
    if (board[i]) setSel({ where: "board", i });
  }
  function sell() {
    if (!sel) return;
    const u = sel.where === "bench" ? bench[sel.i] : board[sel.i]; if (!u) return;
    const refund = u.composite ? 3 * u.star : Math.max(1, DEFS[u.defId].cost) * u.star;
    setGold((g) => g + refund);
    if (sel.where === "bench") settle(bench.filter((_, k) => k !== sel.i), board);
    else { const nb = [...board]; nb[sel.i] = null; settle(bench, nb); }
    setSel(null); flash("판매 +" + refund + "g");
  }
  function startCombat() {
    const units = board.filter(Boolean);
    if (!units.length) return flash("보드에 유닛을 먼저 올려줘");
    const buffs = computeBuffs(computeCounts(board));
    setSel(null);
    setCombat({
      player: units.map((u) => {
        const hpMax = Math.round(u.hp * buffs.hpMult);
        return { uid: u.uid, name: u.name, glyph: u.glyph, cat: u.cat, star: u.star, composite: u.composite, hp: hpMax, cur: hpMax, atk: Math.round(u.atk * buffs.atkMult), hit: false, lastDmg: 0 };
      }),
      enemy: makeEnemies(stage), tick: 0, done: false, result: null, buffs,
    });
    setPhase("combat");
  }
  useEffect(() => {
    if (phase !== "combat" || !combat || combat.done) return;
    const t = setTimeout(() => setCombat((c) => combatTick(c)), 620);
    return () => clearTimeout(t);
  }, [phase, combat]);

  function nextRound() {
    const won = combat.result === "win";
    const nType = won ? "win" : "lose";
    const nStreak = streakType === nType ? streak + 1 : 1;
    let nXp = xp + 2, nLv = level;
    while (nLv < 8 && nXp >= XP_TO_NEXT[nLv]) { nXp -= XP_TO_NEXT[nLv]; nLv++; }
    let nhp = hp, dmg = 0;
    if (!won) { dmg = combat.enemy.filter((e) => e.cur > 0).length * 4 + stage; nhp = hp - dmg; }
    const interest = Math.min(5, Math.floor(gold / 10));
    const sBonus = nStreak >= 4 ? 3 : nStreak >= 3 ? 2 : nStreak >= 2 ? 1 : 0;
    const income = 5 + interest + sBonus;
    setStage((s) => s + 1); setCombat(null);
    if (nhp <= 0) { setHp(0); setPhase("gameover"); return; }
    setHp(nhp); setGold((g) => g + income); setLevel(nLv); setXp(nXp);
    setStreak(nStreak); setStreakType(nType); setShop(rollShop(nLv)); setPhase("shop");
    flash(won ? "라운드 승리 · +" + income + "g (이자 " + interest + " · 연승 " + nStreak + ")"
      : "라운드 패배 · -" + dmg + " 체력 (연패 " + nStreak + ")");
  }
  function restart() {
    UID = 1; setGold(12); setHp(100); setStage(1); setLevel(START_LEVEL); setXp(0);
    setStreak(0); setStreakType(null); setPhase("shop"); setShop(rollShop(START_LEVEL));
    setBench([]); setBoard(Array(BOARD_MAX).fill(null)); setSel(null); setCombat(null);
  }

  const counts = computeCounts(board);
  const recipeProg = RECIPES.map((r) => ({
    recipe: r, makes: DEFS[r.makes].name, cat: DEFS[r.makes].cat, glyph: DEFS[r.makes].glyph,
    parts: r.need.map((d) => ({ name: DEFS[d].name, onBoard: board.some((u) => u && u.defId === d) })),
    deployable: !!recipeBoardIndices(board, r),
  }));
  const xpNeed = XP_TO_NEXT[level] || 0;

  return (
    <div className="tt">
      <style>{CSS}</style>

      <div className="bar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="dots">
            <span className="dot" style={{ background: "#ff5f56" }} />
            <span className="dot" style={{ background: "#ffbd2e" }} />
            <span className="dot" style={{ background: "#27c93f" }} />
          </span>
          <span className="brand">stack.tactics</span>
          <span className="curs" />
        </div>
        <div className="pills">
          <span className="pill" style={{ color: "#fb7185" }}>♥ {hp}</span>
          <span className="pill" style={{ color: "#ffd76a" }}>🪙 {gold}g</span>
          <span className="pill" style={{ color: "#7e8ba6" }}>stage {stage}</span>
        </div>
      </div>

      <div className="tagline"><span className="cm">// </span>HTML·CSS·JS를 모아 배포하고, 시너지를 쌓아 버그를 막아내세요.</div>

      {toast && <div className="toast">{toast}</div>}

      {phase === "gameover" ? (
        <div className="over">
          <div className="t"><span className="cm">// </span>PRODUCTION DOWN</div>
          <div className="s">스테이지 {stage}까지 도달했어.</div>
          <button className="btn primary" style={{ marginTop: 18 }} onClick={restart}>재배포 ↻</button>
        </div>
      ) : phase === "combat" ? (
        <div>
          <div className="label" style={{ justifyContent: "center" }}>
            <span><span className="cm">// </span>테스트 실행 중... tick {combat.tick}</span>
          </div>
          <div className="arena">
            <div className="side">
              <div className="sh" style={{ color: "#34d399" }}>내 스택</div>
              <div className="formation">{combat.player.map((u) => <Ava key={u.uid} u={u} tick={combat.tick} />)}</div>
            </div>
            <div className="side">
              <div className="sh" style={{ color: "#fb7185", textAlign: "right" }}>버그 유입</div>
              <div className="formation">{combat.enemy.map((u) => <Ava key={u.uid} u={u} tick={combat.tick} />)}</div>
            </div>
          </div>
          {combat.done && (
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: combat.result === "win" ? "#4ade80" : "#fb7185" }}>
                {combat.result === "win" ? "✓ 빌드 통과" : "✗ 빌드 실패"}
              </div>
              <button className="btn primary" style={{ marginTop: 10 }} onClick={nextRound}>다음 라운드 ▶</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* economy bar */}
          <div className="econ">
            <span style={{ color: "#818cf8", fontWeight: 700 }}>Lv {level}</span>
            <div className="xpwrap">
              <span style={{ color: "#7884a0" }}>XP {xp}/{xpNeed || "MAX"}</span>
              <div className="xptrack"><div className="xpfill" style={{ width: (xpNeed ? Math.min(100, (xp / xpNeed) * 100) : 100) + "%" }} /></div>
            </div>
            <button className="btn small" onClick={buyXp}>경험치 +4 · 4g</button>
            <span style={{ color: "#7884a0" }}>
              이자 +{Math.min(5, Math.floor(gold / 10))}
              {streak >= 2 && <span style={{ color: streakType === "win" ? "#4ade80" : "#fb7185" }}> · {streakType === "win" ? "연승" : "연패"} {streak}</span>}
            </span>
          </div>

          <div className="label">
            <span><span className="cm">// </span>보드 · deploy zone <span style={{ color: "#3c465f" }}>({board.filter(Boolean).length}/{cap})</span></span>
            <button className="btn primary" onClick={startCombat}>라운드 시작 ▶</button>
          </div>
          <div className="board">
            {board.map((u, i) => (
              <div key={i} className={"tile" + (i >= cap ? " locked" : u ? "" : " empty")} onClick={() => clickBoard(i)}>
                {i >= cap ? "🔒" : u && <Chip u={u} sel={sel && sel.where === "board" && sel.i === i} onClick={() => clickBoard(i)} />}
              </div>
            ))}
          </div>

          {/* synergy strip */}
          <div className="synergy">
            {TRAIT_DEFS.map((t) => {
              const n = counts[t.cat];
              const tier = n >= t.thr[1] ? 2 : n >= t.thr[0] ? 1 : 0;
              return (
                <div key={t.cat} className={"syn cat-" + t.cat + (tier ? " on" : "")}>
                  <div className="sh"><span>{t.name}</span><span>{n}/{t.thr[tier === 2 ? 1 : 0]}</span></div>
                  <div className="sc">{tier === 0 ? "비활성" : tier === 1 ? "단계 1" : "단계 2"}</div>
                  <div className="sd">{t.desc}</div>
                </div>
              );
            })}
          </div>

          <div className="label"><span><span className="cm">// </span>벤치</span></div>
          <div className="bench">
            {bench.length === 0 && <span className="empty-hint">비어있음 — 아래 상점에서 기물을 사세요</span>}
            {bench.map((u, i) => <Chip key={u.uid} u={u} sel={sel && sel.where === "bench" && sel.i === i} onClick={() => clickBench(i)} />)}
          </div>

          {sel && (
            <div className="selbar">
              <span>선택됨 — 보드 칸을 탭해 배치, 또는</span>
              <button className="btn danger" onClick={sell}>판매</button>
            </div>
          )}

          <div className="label"><span><span className="cm">// </span>합성 레시피 — 재료를 보드에 모은 뒤 deploy</span></div>
          <div className="recipes">
            {recipeProg.map((rp) => (
              <div key={rp.makes} className={"recipe cat-" + rp.cat + (rp.deployable ? " ready" : "")}>
                <div className="rh">
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}><span className="rg">{rp.glyph}</span>{rp.makes}</span>
                  {rp.deployable && <button className="btn deploy" onClick={() => deploy(rp.recipe)}>deploy ⚡</button>}
                </div>
                <div className="parts">
                  {rp.parts.map((p, k) => <span key={p.name + k} className={"part" + (p.onBoard ? " have" : "")}>{p.name}</span>)}
                </div>
              </div>
            ))}
          </div>

          <div className="label">
            <span><span className="cm">// </span>상점 · npm install</span>
            <button className="btn" onClick={reroll}>리롤 ↻ 2g</button>
          </div>
          <div className="shop">
            {shop.map((defId, i) => {
              if (!defId) return <div key={i} className="scard slotempty" />;
              const d = DEFS[defId];
              return (
                <div key={i} className={"scard cat-" + d.cat + (gold < d.cost ? " poor" : "")} onClick={() => buy(i)}>
                  <span className="g">{d.glyph}</span>
                  <span className="nm">{d.name}</span>
                  <span className="st">{d.hp}♥ {d.atk}⚔</span>
                  <span className="cost">{d.cost}g</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="footer">
        같은 기물 3개 → 자동 ★★ (합성 유닛도 별업 가능) · 보드 카테고리 수만큼 시너지 버프 발동 · 재료를 보드에 모아 deploy로 합성 (2단계: Web App → Full Stack) · 경험치를 사서 레벨업하면 보드 칸·고급 기물 확률 ↑ · 골드를 모으면 이자, 연속 승/패는 보너스
      </div>
    </div>
  );
}
