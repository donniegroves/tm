import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useInsertQuestion } from "../hooks/useInsertQuestion";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useDrawer } from "../inside/DrawerProvider";
import { useInsideContext } from "../inside/InsideContext";

export enum DrawerFooterPurpose {
    ProfileUpdate = "profile-update",
    AddQuestion = "add-question",
    Reserved = "reserved", // Placeholder for future purposes
}

interface DrawerFooterProps {
    purpose: DrawerFooterPurpose;
}

export default function DrawerFooter({ purpose }: DrawerFooterProps) {
    const { loggedInUserId } = useInsideContext();
    const { setIsDrawerOpen, isDrawerActionLoading } = useDrawer();
    const updateProfileMutation = useUpdateProfile();
    const insertQuestionMutation = useInsertQuestion();

    function renderCloseButton() {
        return (
            <Button
                color="danger"
                variant="light"
                onPress={() => setIsDrawerOpen(false)}
            >
                Close
            </Button>
        );
    }

    function renderActionButton({
        label,
        onPress,
        loading,
    }: {
        label: string;
        onPress: () => void | Promise<void>;
        loading: boolean;
    }) {
        return (
            <Button color="primary" onPress={onPress}>
                {loading ? (
                    <Spinner color="white" size="sm" aria-label="Loading..." />
                ) : (
                    label
                )}
            </Button>
        );
    }

    if (purpose === DrawerFooterPurpose.ProfileUpdate) {
        return (
            <>
                {renderCloseButton()}
                {renderActionButton({
                    label: "Save",
                    onPress: () =>
                        updateProfileMutation.mutate({
                            userId: loggedInUserId,
                        }),
                    loading:
                        isDrawerActionLoading ||
                        updateProfileMutation.isPending,
                })}
            </>
        );
    }

    if (purpose === DrawerFooterPurpose.AddQuestion) {
        return (
            <>
                {renderCloseButton()}
                {renderActionButton({
                    label: "Add",
                    onPress: () => {
                        insertQuestionMutation.mutate();
                    },
                    loading:
                        isDrawerActionLoading ||
                        insertQuestionMutation.isPending,
                })}
            </>
        );
    }

    return null;
}
