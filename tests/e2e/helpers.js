import { expect } from "@playwright/test";

// 아키텍처 방어 계층 — engine/combat.js 의 TIER_OF 와 동일해야 한다(테스트의 기대값 계산용).
export const TIER_OF = { infra: 0, frontend: 1, composite: 1, backend: 2, database: 3 };

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

// 보드 타일 0..count-1 에 유닛을 배치한다. 실제 배치 수 반환.
export async function placeUnits(page, count) {
  let placed = 0;
  for (let tile = 0; tile < count; tile++) {
    if (!(await ensureBenchUnit(page))) break;
    await page.getByTestId("bench").getByTestId("unit-chip").first().click();
    await page.getByTestId(`tile-${tile}`).click();
    await expect(page.getByTestId(`tile-${tile}`).getByTestId("unit-chip")).toBeVisible();
    placed++;
  }
  return placed;
}

// arch 노드들의 카테고리를 class(cat-*)에서 뽑아 배열로 반환.
export async function nodeCats(page) {
  const nodes = page.getByTestId("arch-node");
  const n = await nodes.count();
  const out = [];
  for (let i = 0; i < n; i++) {
    const cls = await nodes.nth(i).getAttribute("class");
    out.push({ cat: (cls.match(/cat-(\w+)/) || [])[1], exposed: cls.includes("exposed") });
  }
  return out;
}
