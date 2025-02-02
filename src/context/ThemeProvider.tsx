import React, { useEffect, useState } from "react";

type ThemeType = "light" | "dark";

type ThemeContextType = {
  currentTheme: ThemeType;
  changeTheme: (theme: "light" | "dark") => void;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  currentTheme: "dark",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeTheme: () => {},
});

type Props = {
  children: React.ReactNode;
};

export default function ThemeContextProvider({ children }: Props) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(
    localStorage.getItem("theme") === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    const localTheme =
      localStorage.getItem("theme") === "dark" ? "dark" : "light";
    setCurrentTheme(localTheme);
  }, []);

  useEffect(() => {
    currentTheme == "dark"
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const changeTheme = (theme: "light" | "dark") => {
    setCurrentTheme(theme);
  };
  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
