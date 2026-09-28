import { test, expect } from "@playwright/test";
import { gotoGame, placeUnits, nodeRows, BOARD_COLS } from "./helpers.js";

test.describe("전투 — 헥스 보드 전열", () => {
  test("유닛을 배치하고 라운드를 시작하면 전투 화면이 뜬다", async ({ page }) => {
    await gotoGame(page);
    const placed = await placeUnits(page, 3);
    expect(placed).toBeGreaterThan(0);
    await page.getByRole("button", { name: /라운드 시작/ }).click();
    await expect(page.getByTestId("combat")).toBeVisible();
    await expect(page.getByTestId("arch")).toBeVisible();
    await expect(page.getByTestId("bug-lane")).toBeVisible();
    await expect(page.getByTestId("ingress")).toBeVisible();
  });

  test("버그는 가장 앞 행(살아있는 유닛 기준)만 노출시킨다", async ({ page }) => {
    await gotoGame(page);
    // 서로 다른 행에 배치: 2열 · 3열 · 4열 (1열은 비워 둔다)
    const tiles = [BOARD_COLS + 1, BOARD_COLS * 2 + 3, BOARD_COLS * 3 + 5];
    const placed = await placeUnits(page, 3, tiles);
    expect(placed).toBeGreaterThan(0);
    await page.getByRole("button", { name: /라운드 시작/ }).click();
    await expect(page.getByTestId("arch-node").first()).toBeVisible();

    // 전투 시작 직후(모두 생존) — exposed 노드 = 유닛이 있는 가장 앞 행.
    const nodes = await nodeRows(page);
    expect(nodes.length).toBe(placed);
    const front = Math.min(...nodes.map((n) => n.row));
    for (const n of nodes) expect(n.exposed, `${n.row}행 노드의 노출 여부`).toBe(n.row === front);
    // 뒷줄은 절대 노출되지 않는다.
    expect(nodes.some((n) => n.row > front && n.exposed)).toBe(false);
  });

  test("전투는 승패 결과로 종료되고 다음 라운드로 넘어간다", async ({ page }) => {
    await gotoGame(page);
    const placed = await placeUnits(page, 3);
    expect(placed).toBeGreaterThan(0);
    const stageBefore = await page.getByTestId("stage").innerText();
    await page.getByRole("button", { name: /라운드 시작/ }).click();
    // 28틱 × 650ms 안에 반드시 종료된다.
    await expect(page.getByRole("button", { name: /다음 라운드/ })).toBeVisible({ timeout: 25000 });
    await page.getByRole("button", { name: /다음 라운드/ }).click();
    // 상점으로 복귀 + 스테이지 증가.
    await expect(page.getByTestId("shop")).toBeVisible();
    await expect(page.getByTestId("stage")).not.toHaveText(stageBefore);
  });
});
