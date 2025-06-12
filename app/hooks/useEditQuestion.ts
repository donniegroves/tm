import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { Database } from "database.types";
import { editQuestion } from "../actions/editQuestion";

export function useEditQuestion(): UseMutationResult<
    Database["public"]["Tables"]["questions"]["Row"],
    Error,
    void
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => editQuestion(),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["questions"] });
        },
    });
}
