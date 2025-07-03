import type { Metadata } from "next";
import { ReactNode } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { InsideDrawer } from "../components/InsideDrawer";
import { TanstackProvider } from "../components/TanstackProvider";
import "../globals.css";
import DrawerProvider from "@/app/inside/DrawerProvider";
import { InsideContextProvider } from "@/app/inside/InsideContext";

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME,
};

export default async function PlayLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <TanstackProvider>
            <InsideContextProvider>
                <DrawerProvider>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-grow flex items-center justify-center px-2 py-2 overflow-y-auto">
                            {children}
                        </main>
                        <Footer />
                    </div>
                    <InsideDrawer />
                </DrawerProvider>
            </InsideContextProvider>
        </TanstackProvider>
    );
}
