import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { insertQuestion } from "../actions/insertQuestion";
import { TanstackProvider } from "../components/TanstackProvider";
import { useInsertQuestion } from "../hooks/useInsertQuestion";

jest.mock("../actions/insertQuestion", () => ({
    insertQuestion: jest.fn(async () => ({ id: 3, text: "Q3" })),
}));

jest.mock("../inside/DrawerProvider", () => ({
    useDrawer: () => ({
        setIsDrawerOpen: jest.fn(),
        setIsDrawerActionLoading: jest.fn(),
    }),
}));

type Question = { id: number; text: string };

describe("useInsertQuestion", () => {
    function useSetupCache(initialQuestions: Question[]) {
        const qc = useQueryClient();
        React.useEffect(() => {
            qc.setQueryData(["questions"], initialQuestions);
        }, [qc, initialQuestions]);
        return qc;
    }

    it("adds the new question to the cache on success", async () => {
        const initialQuestions: Question[] = [
            { id: 1, text: "Q1" },
            { id: 2, text: "Q2" },
        ];
        let qc: QueryClient | undefined;
        const { result } = renderHook(
            () => {
                qc = useSetupCache(initialQuestions);
                return useInsertQuestion();
            },
            { wrapper: TanstackProvider }
        );

        act(() => {
            result.current.mutate();
        });
        await waitFor(() => result.current.isSuccess);

        expect(qc!.getQueryData(["questions"])).toEqual([
            { id: 1, text: "Q1" },
            { id: 2, text: "Q2" },
            { id: 3, text: "Q3" },
        ]);
        expect(insertQuestion).toHaveBeenCalled();
    });
});
