"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {theme === "dark" ? (
        <Sun
          onClick={() => setTheme("light")}
          className="cursor-pointer text-foreground"
        />
      ) : (
        <Moon onClick={() => setTheme("dark")} className="cursor-pointer" />
      )}
    </div>
  );
}
