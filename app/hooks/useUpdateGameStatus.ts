import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { Database } from "database.types";
import { updateGameStatus } from "../actions/updateGameStatus";

export function useUpdateGameStatus(): UseMutationResult<
    boolean,
    Error,
    Database["public"]["Tables"]["games"]["Row"]
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (gameData: Database["public"]["Tables"]["games"]["Row"]) =>
            updateGameStatus(gameData.id, gameData.status),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["games"] });
        },
    });
}
