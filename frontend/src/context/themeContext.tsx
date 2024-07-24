"use client";

import React, { FC, ReactNode, useState, createContext } from "react";
import { ThemeContextType, ThemeType } from "@/types/theme";

export const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => {},
});

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeType>("light");

    const toggleTheme = (theme: string) => {
        setTheme(theme === "light" ? "dark" : "light");
        document.body.classList.toggle("dark");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
