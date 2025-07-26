import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Database } from "database.types";
import React from "react";
import { insertGameQuestion } from "../actions/insertGameQuestion";
import { TanstackProvider } from "../components/TanstackProvider";
import { useInsertGameQuestion } from "../hooks/useInsertGameQuestion";
import {
    defaultInsideContextValues,
    mockGameQuestionsData,
    mockGamesData,
    mockQuestionsData,
} from "./helpers/helpers";

jest.mock("../actions/insertGameQuestion", () => ({
    insertGameQuestion: jest.fn(async () => ({
        game_id: mockGamesData[0].id,
        round: 1,
        question_id: mockQuestionsData[0].id,
        created_at: mockGameQuestionsData[0].created_at,
        updated_at: mockGameQuestionsData[0].updated_at,
    })),
}));

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => defaultInsideContextValues,
}));

type GameQuestion = Database["public"]["Tables"]["game_questions"]["Row"];

describe("useInsertGameQuestion", () => {
    function useSetupCache(initialGameQuestions: GameQuestion[]) {
        const qc = useQueryClient();
        React.useEffect(() => {
            qc.setQueryData(["game_questions"], initialGameQuestions);
        }, [qc, initialGameQuestions]);
        return qc;
    }

    it("invalidates game_questions cache on success", async () => {
        const initialGameQuestions: GameQuestion[] = [
            mockGameQuestionsData[0],
            mockGameQuestionsData[1],
        ];
        let qc: QueryClient | undefined;
        const { result } = renderHook(
            () => {
                qc = useSetupCache(initialGameQuestions);
                return useInsertGameQuestion();
            },
            { wrapper: TanstackProvider }
        );

        act(() => {
            result.current.mutate({
                gameId: mockGamesData[0].id,
                round: 1,
                questionId: mockQuestionsData[0].id,
            });
        });
        await waitFor(() => result.current.isSuccess);

        expect(insertGameQuestion).toHaveBeenCalledWith({
            gameId: mockGamesData[0].id,
            round: 1,
            questionId: mockQuestionsData[0].id,
        });
        expect(result.current.isSuccess).toBe(true);
    });

    it("uses provided questionId when specified", async () => {
        const initialGameQuestions: GameQuestion[] = [];
        let qc: QueryClient | undefined;
        const { result } = renderHook(
            () => {
                qc = useSetupCache(initialGameQuestions);
                return useInsertGameQuestion();
            },
            { wrapper: TanstackProvider }
        );

        act(() => {
            result.current.mutate({
                gameId: mockGamesData[1].id,
                round: 2,
                questionId: mockQuestionsData[0].id,
            });
        });
        await waitFor(() => result.current.isSuccess);

        expect(insertGameQuestion).toHaveBeenCalledWith({
            gameId: mockGamesData[1].id,
            round: 2,
            questionId: mockQuestionsData[0].id,
        });
    });
});
