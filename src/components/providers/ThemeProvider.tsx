"use client";

import * as React from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Theme;
  themes: Theme[];
  systemTheme?: Theme;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = false,
  disableTransitionOnChange = false
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<Theme>(defaultTheme);

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setResolvedTheme(newTheme);

    const root = document.documentElement;

    if (disableTransitionOnChange) {
      const css = document.createElement("style");
      css.appendChild(
        document.createTextNode(
          "*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
        )
      );
      document.head.appendChild(css);
      window.getComputedStyle(document.body);
      setTimeout(() => document.head.removeChild(css), 1);
    }

    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
    } else {
      root.setAttribute(attribute, newTheme);
    }

    root.style.colorScheme = newTheme;
  }, [attribute, disableTransitionOnChange]);

  // Apply initial theme
  React.useEffect(() => {
    const root = document.documentElement;

    if (attribute === "class") {
      root.classList.add(defaultTheme);
    } else {
      root.setAttribute(attribute, defaultTheme);
    }

    root.style.colorScheme = defaultTheme;
    setResolvedTheme(defaultTheme);
  }, [attribute, defaultTheme]);

  const value = React.useMemo(() => ({
    theme,
    setTheme,
    resolvedTheme,
    themes: ["light", "dark"] as Theme[],
    systemTheme: undefined,
  }), [theme, resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
