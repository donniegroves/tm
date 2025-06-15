import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { insertGame } from "../actions/insertGame";
import { TanstackProvider } from "../components/TanstackProvider";
import { useInsertGame } from "../hooks/useAddGame";

jest.mock("../actions/insertGame", () => ({
    insertGame: jest.fn(async () => ({ id: 42, name: "Game 42" })),
}));

jest.mock("../inside/DrawerProvider", () => ({
    useDrawer: () => ({
        setIsDrawerOpen: jest.fn(),
        setIsDrawerActionLoading: jest.fn(),
    }),
}));

type Game = { id: number; name: string };

describe("useInsertGame", () => {
    function useSetupCache(initialGames: Game[]) {
        const qc = useQueryClient();
        React.useEffect(() => {
            qc.setQueryData(["games"], initialGames);
        }, [qc, initialGames]);
        return qc;
    }

    it("adds the new game to the cache on success", async () => {
        const initialGames: Game[] = [
            { id: 1, name: "Game 1" },
            { id: 2, name: "Game 2" },
        ];
        let qc: QueryClient | undefined;
        const { result } = renderHook(
            () => {
                qc = useSetupCache(initialGames);
                return useInsertGame();
            },
            { wrapper: TanstackProvider }
        );

        act(() => {
            result.current.mutate();
        });
        await waitFor(() => result.current.isSuccess);

        expect(qc!.getQueryData(["games"])).toEqual([
            { id: 1, name: "Game 1" },
            { id: 2, name: "Game 2" },
            { id: 42, name: "Game 42" },
        ]);
        expect(insertGame).toHaveBeenCalled();
    });
});
