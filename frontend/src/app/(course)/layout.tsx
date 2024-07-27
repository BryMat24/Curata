import Menu from "@/components/Menu";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="py-7">
            <Menu />
            <main>{children}</main>
        </div>
    );
}
