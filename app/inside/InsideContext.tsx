"use client";

import { User } from "@supabase/supabase-js";
import { Database } from "database.types";
import { createContext, ReactNode, useContext } from "react";

interface InsideContextType {
    loggedInUser: User & {
        access_level: number;
    };
    otherUsers: Database["public"]["Tables"]["users"]["Row"][];
    visibleGames: Database["public"]["Tables"]["games"]["Row"][];
    questions: Database["public"]["Tables"]["questions"]["Row"][];
}

const InsideContext = createContext<InsideContextType | undefined>(undefined);

export function InsideContextProvider({
    children,
    loggedInUser,
    otherUsers,
    visibleGames,
    questions,
}: {
    children: ReactNode;
    loggedInUser: InsideContextType["loggedInUser"];
    otherUsers: InsideContextType["otherUsers"];
    visibleGames: InsideContextType["visibleGames"];
    questions: InsideContextType["questions"];
}) {
    return (
        <InsideContext.Provider
            value={{ loggedInUser, otherUsers, visibleGames, questions }}
        >
            {children}
        </InsideContext.Provider>
    );
}

export function useInsideContext() {
    const context = useContext(InsideContext);
    if (!context) {
        throw new Error(
            "useInsideContext must be used within a InsideContextProvider"
        );
    }
    return context;
}
