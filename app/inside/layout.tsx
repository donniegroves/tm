import type { Metadata } from "next";
import { ReactNode } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../globals.css";
import { fetchLayoutData } from "../helpers";
import { InsideContextProvider } from "./InsideContext";

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME,
};

export default async function InsideLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { loggedInUser, otherUsers, gamesData } = await fetchLayoutData();

    return (
        <div className="flex flex-col min-h-screen px-4">
            <Header loggedInUser={loggedInUser} />
            <main className="flex-grow container overflow-y-auto">
                <InsideContextProvider
                    loggedInUser={loggedInUser}
                    otherUsers={otherUsers}
                    visibleGames={gamesData}
                >
                    {children}
                </InsideContextProvider>
            </main>
            <Footer />
        </div>
    );
}
