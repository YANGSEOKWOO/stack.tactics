import { expect } from "@playwright/test";

// 헥스 보드 열 수 — data/economy.js 의 BOARD_COLS 와 동일해야 한다(타일 인덱스 → 행 계산용).
export const BOARD_COLS = 7;

// 결정적 RNG(?seed=)로 게임을 연다.
export async function gotoGame(page, seed = 1) {
  await page.goto(`/?seed=${seed}`);
  await expect(page.getByText("stack.tactics")).toBeVisible();
}

// 상단 골드 표시를 숫자로 읽는다.
export async function readGold(page) {
  const txt = await page.getByTestId("gold").innerText();
  return parseInt(txt.replace(/[^0-9]/g, ""), 10);
}

// 살 수 있는(poor 아님) 첫 상점 카드를 구매. 성공 여부 반환.
export async function buyAffordable(page) {
  const card = page.locator('[data-testid="shop-card"]:not(.poor)').first();
  if ((await card.count()) === 0) return false;
  await card.click();
  return true;
}

// 벤치에 유닛이 최소 1개 있도록 보장(구매, 필요시 리롤).
export async function ensureBenchUnit(page) {
  const benchChips = page.getByTestId("bench").getByTestId("unit-chip");
  if ((await benchChips.count()) > 0) return true;
  for (let i = 0; i < 3; i++) {
    if (await buyAffordable(page)) return true;
    if ((await readGold(page)) < 2) return false;
    await page.getByRole("button", { name: /리롤/ }).click();
  }
  return false;
}

// 보드 타일(기본 0..count-1, tiles 로 지정 가능)에 유닛을 배치한다. 실제 배치 수 반환.
export async function placeUnits(page, count, tiles = Array.from({ length: count }, (_, i) => i)) {
  let placed = 0;
  for (const tile of tiles.slice(0, count)) {
    if (!(await ensureBenchUnit(page))) break;
    await page.getByTestId("bench").getByTestId("unit-chip").first().click();
    await page.getByTestId(`tile-${tile}`).click();
    await expect(page.getByTestId(`tile-${tile}`).getByTestId("unit-chip")).toBeVisible();
    placed++;
  }
  return placed;
}

// 전투 보드 노드들의 행(data-row)·노출 여부(class exposed)를 배열로 반환.
export async function nodeRows(page) {
  const nodes = page.getByTestId("arch-node");
  const n = await nodes.count();
  const out = [];
  for (let i = 0; i < n; i++) {
    const cls = await nodes.nth(i).getAttribute("class");
    const row = parseInt(await nodes.nth(i).getAttribute("data-row"), 10);
    out.push({ row, exposed: cls.includes("exposed") });
  }
  return out;
}
