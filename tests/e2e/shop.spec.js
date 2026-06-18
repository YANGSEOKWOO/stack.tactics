import { test, expect } from "@playwright/test";
import { gotoGame, readGold } from "./helpers.js";

test.describe("상점 — 구매/리롤/경제", () => {
  test("리롤은 2골드를 소모한다", async ({ page }) => {
    await gotoGame(page);
    const before = await readGold(page);
    await page.getByRole("button", { name: /리롤/ }).click();
    await expect(page.getByTestId("gold")).toContainText(`${before - 2}g`);
  });

  test("구매하면 코스트만큼 골드가 줄고 벤치에 유닛이 생긴다", async ({ page }) => {
    await gotoGame(page);
    const before = await readGold(page);
    const card = page.locator('[data-testid="shop-card"]:not(.poor)').first();
    const cost = parseInt(await card.getAttribute("data-cost"), 10);
    await card.click();
    await expect(page.getByTestId("gold")).toContainText(`${before - cost}g`);
    await expect(page.getByTestId("bench").getByTestId("unit-chip")).toHaveCount(1);
  });

  test("빈 보드로 라운드를 시작하면 경고 토스트가 뜬다", async ({ page }) => {
    await gotoGame(page);
    await page.getByRole("button", { name: /라운드 시작/ }).click();
    await expect(page.getByText("보드에 유닛을 먼저 올려줘")).toBeVisible();
    // 전투로 진입하지 않는다.
    await expect(page.getByTestId("combat")).toHaveCount(0);
  });
});
