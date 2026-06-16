"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme }>({ theme: "light" });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const clickTimestamps = useRef<number[]>([]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Only trigger on "empty" background clicks — ignore interactive elements
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, input, textarea, select, [role='button']")
      ) {
        return;
      }

      const now = Date.now();
      clickTimestamps.current.push(now);

      // Keep only the last 3 timestamps
      if (clickTimestamps.current.length > 3) {
        clickTimestamps.current = clickTimestamps.current.slice(-3);
      }

      // Check if we have 3 clicks within 500ms window
      if (clickTimestamps.current.length === 3) {
        const [first, , third] = clickTimestamps.current;
        if (third - first <= 600) {
          toggleTheme();
          clickTimestamps.current = [];
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [toggleTheme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
