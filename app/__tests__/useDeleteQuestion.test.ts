import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { deleteQuestion } from "../actions/deleteQuestion";
import { TanstackProvider } from "../components/TanstackProvider";
import { useDeleteQuestion } from "../hooks/useDeleteQuestion";

jest.mock("../actions/deleteQuestion", () => ({
    deleteQuestion: jest.fn(async ({ questionId }) => {
        if (questionId === -1) throw new Error("fail");
        return undefined;
    }),
}));

type Question = { id: number; text: string };

describe("useDeleteQuestion", () => {
    function useSetupCache(initialQuestions: Question[]) {
        const qc = useQueryClient();
        React.useEffect(() => {
            qc.setQueryData(["questions"], initialQuestions);
        }, [qc, initialQuestions]);
        return qc;
    }

    it("removes the question from cache on success", async () => {
        const initialQuestions: Question[] = [
            { id: 1, text: "Q1" },
            { id: 2, text: "Q2" },
        ];
        let qc: QueryClient | undefined;
        const { result } = renderHook(
            () => {
                qc = useSetupCache(initialQuestions);
                return useDeleteQuestion();
            },
            { wrapper: TanstackProvider }
        );

        act(() => {
            result.current.mutate({ questionId: 1 });
        });
        await waitFor(() => result.current.isSuccess);

        expect(qc!.getQueryData(["questions"])).toEqual([
            { id: 2, text: "Q2" },
        ]);
        expect(deleteQuestion).toHaveBeenCalledWith({ questionId: 1 });
    });

    it("does not update cache if deleteQuestion throws", async () => {
        const initialQuestions: Question[] = [
            { id: 1, text: "Q1" },
            { id: 2, text: "Q2" },
        ];
        let qc: QueryClient | undefined;
        const { result } = renderHook(
            () => {
                qc = useSetupCache(initialQuestions);
                return useDeleteQuestion();
            },
            { wrapper: TanstackProvider }
        );

        act(() => {
            result.current.mutate({ questionId: -1 }); // -1 triggers error
        });
        await waitFor(() => result.current.isError || result.current.isSuccess);

        expect(qc!.getQueryData(["questions"])).toEqual(initialQuestions);
    });
});
