import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { Database } from "database.types";
import { insertGame } from "../actions/insertGame";
import { useDrawer } from "../inside/DrawerProvider";

export function useInsertGame(): UseMutationResult<
    Database["public"]["Tables"]["games"]["Row"],
    Error,
    void
> {
    const { setIsDrawerOpen, setIsDrawerActionLoading } = useDrawer();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => insertGame(),
        onMutate: () => {
            setIsDrawerActionLoading(true);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(
                ["games"],
                (
                    oldData: Database["public"]["Tables"]["games"]["Row"][] = []
                ) => [...oldData, data]
            );
        },
        onSettled: () => {
            setIsDrawerActionLoading(false);
            setIsDrawerOpen(false);
        },
    });
}
