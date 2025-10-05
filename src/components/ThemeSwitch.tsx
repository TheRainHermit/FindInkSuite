import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeSwitch = () => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    // On mount, check localStorage
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setIsDark(true);
    if (theme === "light") setIsDark(false);
  }, []);

  return (
    <button
      onClick={() => setIsDark((v) => !v)}
      className="p-2 rounded-full border bg-card text-foreground hover:bg-muted transition"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeSwitch;