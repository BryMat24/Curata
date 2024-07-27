"use client";

import React, {
    FC,
    ReactNode,
    useState,
    createContext,
    useEffect,
} from "react";
import { ThemeContextType, ThemeType } from "@/types/theme";

export const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => {},
});

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeType>("light");

    useEffect(() => {
        const initialTheme = localStorage.getItem("theme") as ThemeType | null;
        setTheme(initialTheme ?? "light");
        if (initialTheme === "dark") {
            document.body.classList.add("dark");
        }
    }, []);

    const toggleTheme = (theme: string) => {
        const toggledTheme = theme === "light" ? "dark" : "light";
        setTheme(toggledTheme);
        localStorage.setItem("theme", toggledTheme);
        document.body.classList.toggle("dark");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
