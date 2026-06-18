// 시드 가능한 난수원(mulberry32). URL에 ?seed= 가 있을 때만 결정적으로 동작하고,
// 평소(프로덕션)엔 그냥 Math.random()을 쓴다 → e2e 테스트에서만 재현성을 켠다.
let _seed = null;
if (typeof window !== "undefined") {
  const s = new URLSearchParams(window.location.search).get("seed");
  if (s !== null) _seed = (parseInt(s, 10) || 1) | 0;
}

export function rng() {
  if (_seed === null) return Math.random();
  _seed = (_seed + 0x6d2b79f5) | 0;
  let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// 런타임에 시드를 주입/해제(테스트 편의). null이면 다시 Math.random.
export function setSeed(s) { _seed = s == null ? null : (s | 0); }
