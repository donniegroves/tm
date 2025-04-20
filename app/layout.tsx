import { HeroUIProvider } from "@heroui/system";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
    title: "Base App",
    description: "Base App template",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider attribute="class">
                    <HeroUIProvider>{children}</HeroUIProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
