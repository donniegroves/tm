"use client";

import { useQuery } from "@tanstack/react-query";
import { Database } from "database.types";
import { createContext, ReactNode, useContext } from "react";
import { fetchAllUsers } from "../actions/fetchAllUsers";
import { fetchGameQuestions } from "../actions/fetchGameQuestions";
import { fetchGames } from "../actions/fetchGames";
import { fetchGameUsers } from "../actions/fetchGameUsers";
import { fetchLoggedInUserId } from "../actions/fetchLoggedInUserId";
import { fetchPreAnswers } from "../actions/fetchPreAnswers";
import { fetchQuestions } from "../actions/fetchQuestions";

export interface InsideContextType {
    loggedInUserId: Database["public"]["Tables"]["users"]["Row"]["user_id"];
    allUsers: Database["public"]["Tables"]["users"]["Row"][];
    games: Database["public"]["Tables"]["games"]["Row"][];
    questions: Database["public"]["Tables"]["questions"]["Row"][];
    gameUsers: Database["public"]["Tables"]["game_users"]["Row"][];
    gameQuestions: Database["public"]["Tables"]["game_questions"]["Row"][];
    preAnswers: Database["public"]["Tables"]["pre_answers"]["Row"][];
}

export const InsideContext = createContext<InsideContextType | undefined>(
    undefined
);

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
    const { data: gameUsers } = useQuery({
        queryKey: ["gameUsers"],
        queryFn: fetchGameUsers,
    });
    const { data: gameQuestions } = useQuery({
        queryKey: ["gameQuestions"],
        queryFn: fetchGameQuestions,
    });
    const { data: preAnswers } = useQuery({
        queryKey: ["preAnswers"],
        queryFn: fetchPreAnswers,
    });

    if (
        loggedInUserId === undefined ||
        allUsers === undefined ||
        games === undefined ||
        questions === undefined ||
        gameUsers === undefined ||
        gameQuestions === undefined ||
        preAnswers === undefined
    ) {
        return null;
    }

    return (
        <InsideContext.Provider
            value={{
                loggedInUserId,
                allUsers,
                games,
                questions,
                gameUsers,
                gameQuestions,
                preAnswers,
            }}
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
