import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { Database } from "database.types";
import { insertQuestion } from "../actions/insertQuestion";
import { useDrawer } from "../inside/DrawerProvider";

export function useInsertQuestion(): UseMutationResult<
    Database["public"]["Tables"]["questions"]["Row"],
    Error,
    void
> {
    const { setIsDrawerOpen, setIsDrawerActionLoading } = useDrawer();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => insertQuestion(),
        onMutate: () => {
            setIsDrawerActionLoading(true);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(
                ["questions"],
                (
                    oldData: Database["public"]["Tables"]["questions"]["Row"][] = []
                ) => [...oldData, data]
            );
        },
        onSettled: () => {
            setIsDrawerActionLoading(false);
            setIsDrawerOpen(false);
        },
    });
}
