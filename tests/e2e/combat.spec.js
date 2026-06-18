import { test, expect } from "@playwright/test";
import { gotoGame, placeUnits, nodeCats, TIER_OF } from "./helpers.js";

test.describe("전투 — 계층 방어 아키텍처", () => {
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

  test("버그는 가장 바깥(최소 tier) 계층만 노출시킨다", async ({ page }) => {
    await gotoGame(page);
    const placed = await placeUnits(page, 3);
    expect(placed).toBeGreaterThan(0);
    await page.getByRole("button", { name: /라운드 시작/ }).click();
    await expect(page.getByTestId("arch-node").first()).toBeVisible();

    // 전투 시작 직후(모두 생존) — exposed 노드 = 보드에 존재하는 가장 바깥 계층.
    const cats = await nodeCats(page);
    expect(cats.length).toBe(placed);
    const tiers = cats.map((c) => TIER_OF[c.cat] ?? 1);
    const outer = Math.min(...tiers);
    for (const c of cats) {
      const expected = (TIER_OF[c.cat] ?? 1) === outer;
      expect(c.exposed, `${c.cat} 노드의 노출 여부`).toBe(expected);
    }
    // 안쪽 계층(outer보다 깊은)은 절대 노출되지 않는다.
    const deeperExposed = cats.some((c) => (TIER_OF[c.cat] ?? 1) > outer && c.exposed);
    expect(deeperExposed).toBe(false);
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
