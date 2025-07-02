import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { TanstackProvider } from "../components/TanstackProvider";
import { useDeleteGame } from "../hooks/useDeleteGame";
import { deleteGame } from "../actions/deleteGame";

jest.mock("../actions/deleteGame", () => ({
    deleteGame: jest.fn(async ({ gameId }) => {
        if (gameId === -1) throw new Error("fail");
        return undefined;
    }),
}));

type Game = { id: number; text: string };

describe("useDeleteGame", () => {
    function useSetupCache(initialGames: Game[]) {
        const qc = useQueryClient();
        React.useEffect(() => {
            qc.setQueryData(["games"], initialGames);
        }, [qc, initialGames]);
        return qc;
    }

    it("removes the game from cache on success", async () => {
        const initialGames: Game[] = [
            { id: 1, text: "G1" },
            { id: 2, text: "G2" },
        ];
        let qc: QueryClient | undefined;
        const { result } = renderHook(
            () => {
                qc = useSetupCache(initialGames);
                return useDeleteGame();
            },
            { wrapper: TanstackProvider }
        );

        act(() => {
            result.current.mutate({ gameId: 1 });
        });
        await waitFor(() => result.current.isSuccess);

        expect(qc!.getQueryData(["games"])).toEqual([{ id: 2, text: "G2" }]);
        expect(deleteGame).toHaveBeenCalledWith({ gameId: 1 });
    });

    it("does not update cache if deleteGame throws", async () => {
        const initialGames: Game[] = [
            { id: 1, text: "G1" },
            { id: 2, text: "G2" },
        ];
        let qc: QueryClient | undefined;
        const { result } = renderHook(
            () => {
                qc = useSetupCache(initialGames);
                return useDeleteGame();
            },
            { wrapper: TanstackProvider }
        );

        act(() => {
            result.current.mutate({ gameId: -1 }); // -1 triggers error
        });
        await waitFor(() => result.current.isError || result.current.isSuccess);

        expect(qc!.getQueryData(["games"])).toEqual(initialGames);
    });
});
