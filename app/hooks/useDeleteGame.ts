import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { Database } from "database.types";
import { deleteGame } from "../actions/deleteGame";

export function useDeleteGame(): UseMutationResult<
    void,
    Error,
    { gameId: number }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ gameId }) => deleteGame({ gameId }),
        onSettled: (_data, _error, variables) => {
            queryClient.setQueryData(
                ["games"],
                (oldData: Database["public"]["Tables"]["games"]["Row"][]) =>
                    oldData.filter((game) => game.id !== variables?.gameId)
            );
        },
    });
}
