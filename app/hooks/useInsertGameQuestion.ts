import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { Database } from "database.types";
import { insertGameQuestion } from "../actions/insertGameQuestion";

export function useInsertGameQuestion(): UseMutationResult<
    Database["public"]["Tables"]["game_questions"]["Row"],
    Error,
    {
        gameId: Database["public"]["Tables"]["games"]["Row"]["id"];
        round: number;
        questionId: Database["public"]["Tables"]["questions"]["Row"]["id"];
    }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            gameId,
            round,
            questionId,
        }: {
            gameId: Database["public"]["Tables"]["games"]["Row"]["id"];
            round: number;
            questionId: Database["public"]["Tables"]["questions"]["Row"]["id"];
        }) => {
            // TODO: verify that this question+game+round combo is not already used

            return insertGameQuestion({
                gameId,
                round,
                questionId,
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["game_questions"] });
        },
    });
}
