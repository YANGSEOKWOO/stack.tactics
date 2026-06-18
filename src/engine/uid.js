// 유닛/적 공용 단조 증가 ID 발급기. 게임 재시작 시 resetUid()로 초기화.
let counter = 1;
export function nextUid() { return counter++; }
export function resetUid() { counter = 1; }
