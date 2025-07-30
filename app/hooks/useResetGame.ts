import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Database } from "database.types";
import { resetGame } from "../actions/resetGame";

export function useResetGame(): UseMutationResult<
    boolean,
    Error,
    {
        gameId: Database["public"]["Tables"]["games"]["Row"]["id"];
    }
> {
    return useMutation({
        mutationFn: ({
            gameId,
        }: {
            gameId: Database["public"]["Tables"]["games"]["Row"]["id"];
        }) => resetGame(gameId),
    });
}
