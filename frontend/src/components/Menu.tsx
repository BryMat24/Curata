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
        <div className="absolute left-[50%] translate-x-[-50%]">
            <Menubar>
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
    );
};

export default Menu;
