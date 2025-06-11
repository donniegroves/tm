import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { Database } from "database.types";
import { deleteQuestion } from "../actions/deleteQuestion";

export function useDeleteQuestion(): UseMutationResult<
    void,
    Error,
    { questionId: number }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ questionId }) => deleteQuestion({ questionId }),
        onSettled: (_data, _error, variables) => {
            queryClient.setQueryData(
                ["questions"],
                (oldData: Database["public"]["Tables"]["questions"]["Row"][]) =>
                    oldData.filter(
                        (question) => question.id !== variables?.questionId
                    )
            );
        },
    });
}
