import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Database } from "database.types";
import { addAnswer, AddAnswerParams } from "../actions/addAnswer";

export function useAddAnswer(): UseMutationResult<
    Database["public"]["Tables"]["pre_answers"]["Row"],
    Error,
    AddAnswerParams
> {
    return useMutation({
        mutationFn: (params: AddAnswerParams) => addAnswer(params),
    });
}
