import type { Metadata } from "next";
import { ReactNode } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import InsideNav from "../components/InsideNav";
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
    const { loggedInUserId, allUsers, gamesData, questions } =
        await fetchLayoutData();

    const loggedInUser = allUsers.find(
        (user) => user.user_id === loggedInUserId
    );

    if (!loggedInUser) {
        throw new Error("Logged in user not found in all users");
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header loggedInUser={loggedInUser} />
            <div className="flex flex-row h-full">
                <InsideNav />
                <main className="flex-grow container px-2 py-2 overflow-y-auto ml-16">
                    <InsideContextProvider
                        loggedInUserId={loggedInUserId}
                        allUsers={allUsers}
                        gamesData={gamesData}
                        questions={questions}
                    >
                        {children}
                    </InsideContextProvider>
                </main>
            </div>
            <Footer />
        </div>
    );
}
