import { useState, useEffect, useRef } from "react";
import { DEFS } from "../data/units.js";
import { RECIPES } from "../data/recipes.js";
import {
  BOARD_MAX, BENCH_SLOTS, START_GOLD, START_HP, START_LEVEL, MAX_LEVEL, XP_TO_NEXT,
} from "../data/economy.js";
import { resetUid } from "../engine/uid.js";
import { makeUnit } from "../engine/units.js";
import { rollShop } from "../engine/shop.js";
import { processMerges } from "../engine/merge.js";
import { recipeBoardIndices } from "../engine/recipes.js";
import { computeCounts, computeBuffs } from "../engine/synergy.js";
import { makeEnemies, combatTick, TIER_OF } from "../engine/combat.js";

// 게임의 모든 상태와 액션을 캡슐화하는 훅. App/컴포넌트는 순수 표현(rendering)만 담당한다.
// 새 시스템(보스·증강체 등)을 붙일 땐 여기서 액션을 추가하고 engine/data 에 로직·수치를 둔다.
export function useGame() {
  const [gold, setGold] = useState(START_GOLD);
  const [hp, setHp] = useState(START_HP);
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
  const [modal, setModal] = useState(null); // recipe object
  const tref = useRef();
  const cap = level;

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
  function reroll() { if (phase !== "shop") return; if (gold < 2) return flash("골드가 부족해"); setGold((g) => g - 2); setShop(rollShop(level)); }
  function buyXp() {
    if (phase !== "shop") return;
    if (level >= MAX_LEVEL) return flash("이미 최대 레벨이야");
    if (gold < 4) return flash("골드가 부족해");
    let nXp = xp + 4, nLv = level;
    while (nLv < MAX_LEVEL && nXp >= XP_TO_NEXT[nLv]) { nXp -= XP_TO_NEXT[nLv]; nLv++; }
    setGold((g) => g - 4); setXp(nXp); setLevel(nLv);
    if (nLv > level) flash("레벨 " + nLv + "! 보드 " + nLv + "칸 해제");
  }
  function deploy(recipe) {
    const idx = recipeBoardIndices(board, recipe);
    if (!idx) return flash("보드에 재료를 모두 올려야 deploy할 수 있어");
    const nb = [...board]; const landing = Math.min(...idx);
    idx.forEach((i) => (nb[i] = null));
    nb[landing] = makeUnit(recipe.makes, 1);
    const m = processMerges(bench, nb); setBench(m.bench); setBoard(m.board); setSel(null); setModal(null);
    flash("⚡ " + DEFS[recipe.makes].name + " 배포 완료!");
  }
  function clickBench(i) {
    if (phase !== "shop") return;
    if (sel && sel.where === "board") {
      const u = board[sel.i]; if (!u) return setSel(null);
      const nb = [...board]; nb[sel.i] = null; settle([...bench, u], nb); setSel(null); return;
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
        const nb = [...board]; const a = nb[sel.i]; nb[sel.i] = nb[i]; nb[i] = a; settle(bench, nb); setSel(null);
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
        return { uid: u.uid, defId: u.defId, name: u.name, glyph: u.glyph, cat: u.cat, tier: TIER_OF[u.cat] ?? 1, star: u.star, composite: u.composite, hp: hpMax, cur: hpMax, atk: Math.round(u.atk * buffs.atkMult), hit: false, lastDmg: 0 };
      }),
      enemy: makeEnemies(stage), tick: 0, done: false, result: null, buffs,
    });
    setPhase("combat");
  }
  useEffect(() => {
    if (phase !== "combat" || !combat || combat.done) return;
    const t = setTimeout(() => setCombat((c) => combatTick(c)), 650);
    return () => clearTimeout(t);
  }, [phase, combat]);
  function nextRound() {
    const won = combat.result === "win";
    const nType = won ? "win" : "lose";
    const nStreak = streakType === nType ? streak + 1 : 1;
    let nXp = xp + 2, nLv = level;
    while (nLv < MAX_LEVEL && nXp >= XP_TO_NEXT[nLv]) { nXp -= XP_TO_NEXT[nLv]; nLv++; }
    let nhp = hp, dmg = 0;
    if (!won) { dmg = combat.enemy.filter((e) => e.cur > 0).length * 4 + stage; nhp = hp - dmg; }
    const interest = Math.min(5, Math.floor(gold / 10));
    const sBonus = nStreak >= 4 ? 3 : nStreak >= 3 ? 2 : nStreak >= 2 ? 1 : 0;
    const income = 5 + interest + sBonus;
    setStage((s) => s + 1); setCombat(null);
    if (nhp <= 0) { setHp(0); setPhase("gameover"); return; }
    setHp(nhp); setGold((g) => g + income); setLevel(nLv); setXp(nXp);
    setStreak(nStreak); setStreakType(nType); setShop(rollShop(nLv)); setPhase("shop");
    flash(won ? "라운드 승리 · +" + income + "g (이자 " + interest + " · 연승 " + nStreak + ")" : "라운드 패배 · -" + dmg + " 체력 (연패 " + nStreak + ")");
  }
  function restart() {
    resetUid(); setGold(START_GOLD); setHp(START_HP); setStage(1); setLevel(START_LEVEL); setXp(0);
    setStreak(0); setStreakType(null); setPhase("shop"); setShop(rollShop(START_LEVEL));
    setBench([]); setBoard(Array(BOARD_MAX).fill(null)); setSel(null); setCombat(null); setModal(null);
  }

  // 파생 값 — 매 렌더 계산.
  const counts = computeCounts(board);
  const recipeProg = RECIPES.map((r) => ({
    recipe: r, makes: DEFS[r.makes].name, cat: DEFS[r.makes].cat, glyph: DEFS[r.makes].glyph,
    parts: r.need.map((d) => ({ name: DEFS[d].name, onBoard: board.some((u) => u && u.defId === d) })),
    deployable: !!recipeBoardIndices(board, r),
  }));
  const xpNeed = XP_TO_NEXT[level] || 0;

  return {
    // 자원/진행
    gold, hp, stage, level, xp, streak, streakType, xpNeed, cap,
    // 보드 상태
    shop, bench, board, sel, counts, recipeProg,
    // 페이즈/전투/UI
    phase, combat, toast, modal,
    // 액션
    buy, reroll, buyXp, deploy, clickBench, clickBoard, sell,
    startCombat, nextRound, restart, setModal,
  };
}
