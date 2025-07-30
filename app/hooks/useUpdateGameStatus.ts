import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Database } from "database.types";
import { updateGameStatus } from "../actions/updateGameStatus";

export function useUpdateGameStatus(): UseMutationResult<
    boolean,
    Error,
    Database["public"]["Tables"]["games"]["Row"]
> {
    return useMutation({
        mutationFn: async (
            gameData: Database["public"]["Tables"]["games"]["Row"]
        ) => updateGameStatus(gameData.id, gameData.status),
    });
}
