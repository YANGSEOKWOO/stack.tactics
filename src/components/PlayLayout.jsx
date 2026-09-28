import React from "react";
import SynergyBar from "./SynergyBar.jsx";
import RecipeGrid from "./RecipeGrid.jsx";

// 게임 HUD 레이아웃 — 상점·전투 페이즈 공용. 중앙 패널 높이를 고정해 페이즈 전환 시 화면이 튀지 않는다.
//   데스크톱:  [시너지 | center | 레시피] / [bench] / [tray]
//   휴대폰 가로: 데스크톱 배치를 한 화면(100dvh)에 압축 — TFT 모바일과 동일한 가로 HUD
//   세로 스택:  시너지 → center → bench → 레시피 → tray(하단 고정)
// landRecipes=false: 휴대폰 가로에서 레시피 패널을 숨기고 그 폭을 center 에 준다(전투 중엔 읽기 전용이라).
export default function PlayLayout({ counts, recipeProg, onOpenRecipe, center, bench, tray, landRecipes = true }) {
  const landCols = landRecipes ? "land:grid-cols-[132px_minmax(0,1fr)_150px]" : "land:grid-cols-[132px_minmax(0,1fr)]";
  return (
    <div className={"grid gap-3 mt-3 lg:grid-cols-[200px_minmax(0,1fr)_224px] land:flex-1 land:min-h-0 land:mt-1.5 land:gap-1.5 land:grid-rows-[minmax(0,1fr)_auto_auto] " + landCols}>
      <aside className="order-1 min-h-0 lg:h-[430px]"><SynergyBar counts={counts} /></aside>
      <section className="order-2 min-w-0 min-h-0 lg:h-[430px]">{center}</section>
      <aside className={"order-4 lg:order-3 land:order-3 lg:h-[430px] min-h-0" + (landRecipes ? "" : " land:hidden")}><RecipeGrid recipeProg={recipeProg} onOpen={onOpenRecipe} /></aside>
      <div className="order-3 lg:order-4 land:order-4 lg:col-span-3 land:col-span-3">{bench}</div>
      <div className="order-5 lg:col-span-3 land:col-span-3 stack:sticky stack:bottom-0 stack:z-20 stack:-mx-1 stack:pb-1">{tray}</div>
    </div>
  );
}

// 하단 트레이 공용 셸 (상점/전투 상태가 같은 자리·높이를 쓴다)
export const TRAY =
  "flex items-stretch gap-3 min-h-[116px] p-3 rounded-2xl border border-line bg-panel2 shadow-[0_-12px_30px_-18px_rgba(0,0,0,0.35)] narrow:flex-wrap land:min-h-0 land:p-1.5 land:gap-2 land:rounded-xl";
