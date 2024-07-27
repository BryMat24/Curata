"use client";

import { Toggle } from "@/components/ui/toggle";
import { Sun, Github, Moon } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "@/context/themeContext";
import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const handleToggle = () => {
        toggleTheme(theme);
    };

    return (
        <div className="absolute left-0 right-0 flex justify-between p-5">
            <div>
                <Image
                    alt="favicon"
                    loading="lazy"
                    width={40}
                    height={40}
                    decoding="async"
                    data-nimg="1"
                    className="dark:invert"
                    style={{ color: "transparent" }}
                    src="/logo.svg"
                />
            </div>
            <div>
                <Toggle aria-label="Toggle bold" onClick={handleToggle}>
                    {theme === "light" ? <Sun /> : <Moon />}
                </Toggle>
                <Toggle aria-label="Toggle bold" className="">
                    <Link href="https://github.com/BryMat24/curata">
                        <Github />
                    </Link>
                </Toggle>
            </div>
        </div>
    );
};
