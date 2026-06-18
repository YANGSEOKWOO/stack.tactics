import { test, expect } from "@playwright/test";
import { gotoGame } from "./helpers.js";

test.describe("스모크 — 초기 로딩", () => {
  test("초기 경제 상태와 상점 5칸이 보인다", async ({ page }) => {
    await gotoGame(page);
    await expect(page.getByTestId("hp")).toContainText("100");
    await expect(page.getByTestId("gold")).toContainText("12g");
    await expect(page.getByTestId("stage")).toContainText("stage 1");
    // 상점은 항상 5칸(카드 또는 빈 슬롯).
    await expect(page.getByTestId("shop").locator("> *")).toHaveCount(5);
    await expect(page.getByTestId("shop-card").first()).toBeVisible();
  });

  test("합성 레시피 6종이 렌더된다", async ({ page }) => {
    await gotoGame(page);
    // 레시피 카드 헤더(.rh)로 한정 — 재료 칩(.part)의 동일 텍스트와 구분.
    await expect(page.locator(".recipe")).toHaveCount(6);
    await expect(page.locator(".recipe .rh", { hasText: "Frontend" })).toBeVisible();
    await expect(page.locator(".recipe .rh", { hasText: "Full Stack" })).toBeVisible();
  });

  test("같은 시드는 같은 상점을 만든다(결정성)", async ({ page }) => {
    await gotoGame(page, 7);
    const first = await page.getByTestId("shop-card").first().getByText(/.+/).first().innerText();
    await page.reload();
    await expect(page.getByText("stack.tactics")).toBeVisible();
    const again = await page.getByTestId("shop-card").first().getByText(/.+/).first().innerText();
    expect(again).toBe(first);
  });
});
