import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { editGame, EditGameDataReturn } from "../actions/editGame";

export function useEditGame(): UseMutationResult<
    EditGameDataReturn,
    Error,
    void
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => editGame(),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["games"] });
            queryClient.invalidateQueries({ queryKey: ["gameUsers"] });
        },
    });
}
