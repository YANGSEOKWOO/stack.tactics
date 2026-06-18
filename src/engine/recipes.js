// 보드에서 레시피 재료들의 슬롯 인덱스를 찾는다. 하나라도 없으면 null.
// deploy 가능 여부 판정과 실제 deploy 양쪽에서 사용.
export function recipeBoardIndices(board, recipe) {
  const idx = [];
  for (const defId of recipe.need) {
    const i = board.findIndex((u, k) => u && u.defId === defId && !idx.includes(k));
    if (i === -1) return null;
    idx.push(i);
  }
  return idx;
}
