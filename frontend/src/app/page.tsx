import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <main>
            <div className="min-h-screen flex flex-col items-center justify-center gap-5 animated-background">
                <h1 className="text-5xl font-bold">Curata 🤖.</h1>
                <p className="text-2xl">
                    Your all-in-one AI Study Assistant curated to elevate your
                    learning experience
                </p>
                <Link href="/course">
                    <Button>Get Started</Button>
                </Link>
            </div>
        </main>
    );
}
