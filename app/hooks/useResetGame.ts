import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { Database } from "database.types";
import { resetGame } from "../actions/resetGame";

export function useResetGame(): UseMutationResult<
    boolean,
    Error,
    {
        gameId: Database["public"]["Tables"]["games"]["Row"]["id"];
    }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            gameId,
        }: {
            gameId: Database["public"]["Tables"]["games"]["Row"]["id"];
        }) => resetGame(gameId),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["rankings"] });
            queryClient.invalidateQueries({ queryKey: ["gameQuestions"] });
            queryClient.invalidateQueries({ queryKey: ["games"] });
        },
    });
}
