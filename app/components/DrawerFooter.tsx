import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../actions/updateProfile";
import { useDrawer } from "../inside/DrawerProvider";
import { useInsideContext } from "../inside/InsideContext";

export enum DrawerFooterPurpose {
    ProfileUpdate = "profile-update",
    Reserved = "reserved", // Placeholder for future purposes
}

interface DrawerFooterProps {
    purpose: DrawerFooterPurpose;
}

export default function DrawerFooter({ purpose }: DrawerFooterProps) {
    const { loggedInUserId } = useInsideContext();
    const { setIsDrawerOpen, setIsDrawerActionLoading, isDrawerActionLoading } =
        useDrawer();
    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        mutationFn: updateProfile,
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

    if (purpose === DrawerFooterPurpose.ProfileUpdate) {
        const handleClose = () => setIsDrawerOpen(false);

        return (
            <>
                <Button color="danger" variant="light" onPress={handleClose}>
                    Close
                </Button>
                <Button
                    color="primary"
                    onPress={() => {
                        updateMutation.mutate({ userId: loggedInUserId });
                    }}
                >
                    {isDrawerActionLoading || updateMutation.isPending ? (
                        <>
                            <Spinner
                                color="white"
                                size="sm"
                                aria-label="Loading..."
                            />
                        </>
                    ) : (
                        "Save"
                    )}
                </Button>
            </>
        );
    } else {
        return null;
    }
}
