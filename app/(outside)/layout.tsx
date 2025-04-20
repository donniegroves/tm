import type { Metadata } from "next";
import Script from "next/script";
import { ReactNode } from "react";
import "../globals.css";

export const metadata: Metadata = {
    title: "Base App",
    description: "Base App template",
};

export default function OutsideLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                async
            />

            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <div className="w-80">{children}</div>
            </div>
        </>
    );
}
