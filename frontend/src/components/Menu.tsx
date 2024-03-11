import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { FunctionComponent } from "react";
import Link from "next/link";

interface Props {}

const Menu: FunctionComponent<Props> = () => {
    return (
        <nav className="absolute left-0 right-0 px-5 pt-5">
            <Link href="/">
                <div className="flex items-center gap-2 absolute cursor-pointer">
                    <img
                        alt="favicon"
                        loading="lazy"
                        width="35"
                        height="35"
                        decoding="async"
                        data-nimg="1"
                        className="dark:invert"
                        style={{ color: "transparent" }}
                        src="/logo.svg"
                    />
                    <h1 className="font-bold text-2xl">Curata</h1>
                </div>
            </Link>
            <div className="flex justify-center">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger className="cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-sun h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                            >
                                <circle cx="12" cy="12" r="4"></circle>
                                <path d="M12 2v2"></path>
                                <path d="M12 20v2"></path>
                                <path d="m4.93 4.93 1.41 1.41"></path>
                                <path d="m17.66 17.66 1.41 1.41"></path>
                                <path d="M2 12h2"></path>
                                <path d="M20 12h2"></path>
                                <path d="m6.34 17.66-1.41 1.41"></path>
                                <path d="m19.07 4.93-1.41 1.41"></path>
                            </svg>
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="cursor-pointer">
                                Light
                            </MenubarItem>
                            <MenubarItem className="cursor-pointer">
                                Dark
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Link href="/">Home 🏠</Link>
                        </MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Link href="/course"> Course Builder 🔨</Link>
                        </MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Link href="/summarize">AI Summarize✨</Link>
                        </MenubarTrigger>
                    </MenubarMenu>
                </Menubar>
            </div>
        </nav>
    );
};

export default Menu;
