"use client";

import { useQuery } from "@tanstack/react-query";
import { Database } from "database.types";
import { createContext, ReactNode, useContext } from "react";
import { fetchAllUsers } from "../actions/fetchAllUsers";
import { fetchGames } from "../actions/fetchGames";
import { fetchLoggedInUserId } from "../actions/fetchLoggedInUserId";
import { fetchQuestions } from "../actions/fetchQuestions";

export interface InsideContextType {
    loggedInUserId: Database["public"]["Tables"]["users"]["Row"]["user_id"];
    allUsers: Database["public"]["Tables"]["users"]["Row"][];
    games: Database["public"]["Tables"]["games"]["Row"][];
    questions: Database["public"]["Tables"]["questions"]["Row"][];
}

const InsideContext = createContext<InsideContextType | undefined>(undefined);

export function InsideContextProvider({ children }: { children: ReactNode }) {
    const { data: loggedInUserId } = useQuery({
        queryKey: ["loggedInUserId"],
        queryFn: fetchLoggedInUserId,
    });
    const { data: allUsers } = useQuery({
        queryKey: ["allUsers"],
        queryFn: fetchAllUsers,
    });
    const { data: games } = useQuery({
        queryKey: ["games"],
        queryFn: fetchGames,
    });
    const { data: questions } = useQuery({
        queryKey: ["questions"],
        queryFn: fetchQuestions,
    });

    if (
        loggedInUserId === undefined ||
        allUsers === undefined ||
        games === undefined ||
        questions === undefined
    ) {
        return null;
    }

    return (
        <InsideContext.Provider
            value={{ loggedInUserId, allUsers, games, questions }}
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
