import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { Database } from "database.types";
import {
    updateGameStatus,
    UpdateGameStatusReturn,
} from "../actions/updateGameStatus";

export function useUpdateGameStatus(): UseMutationResult<
    UpdateGameStatusReturn,
    Error,
    Database["public"]["Tables"]["games"]["Row"]
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (gameData: Database["public"]["Tables"]["games"]["Row"]) =>
            updateGameStatus(gameData),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["games"] });
        },
    });
}
