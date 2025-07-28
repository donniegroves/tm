import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { Database } from "database.types";
import { addAnswer, AddAnswerParams } from "../actions/addAnswer";

export function useAddAnswer(): UseMutationResult<
    Database["public"]["Tables"]["pre_answers"]["Row"],
    Error,
    AddAnswerParams
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: AddAnswerParams) => addAnswer(params),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["preAnswers"] });
        },
    });
}
