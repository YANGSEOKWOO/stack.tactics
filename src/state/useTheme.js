import { useState, useEffect } from "react";

// 다크/라이트 테마 — localStorage 저장 + <html class="dark"> 토글.
// 초기값은 저장값 → 없으면 시스템 선호(없으면 다크: Deploy Console 기본).
const KEY = "tt-theme";

function initialTheme() {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState(initialTheme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(KEY, theme);
  }, [theme]);
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}
