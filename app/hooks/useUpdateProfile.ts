import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import { updateProfile } from "../actions/updateProfile";
import { useDrawer } from "../inside/DrawerProvider";

export function useUpdateProfile(): UseMutationResult<
    void,
    Error,
    { userId: string }
> {
    const { setIsDrawerOpen, setIsDrawerActionLoading } = useDrawer();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (param) => updateProfile(param),
        onMutate: () => {
            setIsDrawerActionLoading(true);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        },
        onSettled: () => {
            setIsDrawerActionLoading(false);
            setIsDrawerOpen(false);
        },
    });
}
