"use client";

import { Database } from "database.types";
import { createContext, ReactNode, useContext } from "react";

export interface InsideContextType {
    loggedInUserId: Database["public"]["Tables"]["users"]["Row"]["user_id"];
    allUsers: Database["public"]["Tables"]["users"]["Row"][];
    gamesData: Database["public"]["Tables"]["games"]["Row"][];
    questions: Database["public"]["Tables"]["questions"]["Row"][];
}

const InsideContext = createContext<InsideContextType | undefined>(undefined);

export function InsideContextProvider({
    children,
    loggedInUserId,
    allUsers,
    gamesData,
    questions,
}: {
    children: ReactNode;
    loggedInUserId: InsideContextType["loggedInUserId"];
    allUsers: InsideContextType["allUsers"];
    gamesData: InsideContextType["gamesData"];
    questions: InsideContextType["questions"];
}) {
    return (
        <InsideContext.Provider
            value={{ loggedInUserId, allUsers, gamesData, questions }}
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
