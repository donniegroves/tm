import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useInsertGame } from "../hooks/useAddGame";
import { useEditQuestion } from "../hooks/useEditQuestion";
import { useInsertQuestion } from "../hooks/useInsertQuestion";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useDrawer } from "../inside/DrawerProvider";
import { useInsideContext } from "../inside/InsideContext";
import { useEditGame } from "../hooks/useEditGame";

export enum DrawerFooterPurpose {
    ProfileUpdate = "profile-update",
    AddQuestion = "add-question",
    EditQuestion = "edit-question",
    AddGame = "add-game",
    EditGame = "edit-game",
    Reserved = "reserved", // Placeholder for future purposes
}

interface DrawerFooterProps {
    purpose: DrawerFooterPurpose;
    whenDoneFunction?: () => void;
    setPendingIdFunction?: (id: number) => void;
}

export default function DrawerFooter({
    purpose,
    whenDoneFunction,
    setPendingIdFunction,
}: DrawerFooterProps) {
    const { loggedInUserId } = useInsideContext();
    const { setIsDrawerOpen, isDrawerActionLoading } = useDrawer();
    const updateProfileMutation = useUpdateProfile();
    const insertQuestionMutation = useInsertQuestion();
    const editQuestionMutation = useEditQuestion();
    const insertGameMutation = useInsertGame();
    const editGameMutation = useEditGame();

    function renderCloseButton() {
        return (
            <Button
                color="danger"
                variant="light"
                onPress={() => {
                    setPendingIdFunction?.(-1);
                    setIsDrawerOpen(false);
                }}
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
                    onPress: async () => {
                        await updateProfileMutation.mutateAsync({
                            userId: loggedInUserId,
                        });
                        if (whenDoneFunction) {
                            whenDoneFunction();
                        }
                    },
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
                    onPress: async () => {
                        await insertQuestionMutation.mutateAsync();
                        if (whenDoneFunction) {
                            whenDoneFunction();
                        }
                    },
                    loading:
                        isDrawerActionLoading ||
                        insertQuestionMutation.isPending,
                })}
            </>
        );
    }

    if (purpose === DrawerFooterPurpose.EditQuestion) {
        return (
            <>
                {renderCloseButton()}
                {renderActionButton({
                    label: "Save",
                    onPress: async () => {
                        await editQuestionMutation.mutateAsync();
                        if (whenDoneFunction) {
                            whenDoneFunction();
                        }
                        if (setPendingIdFunction) {
                            setPendingIdFunction(-1);
                        }
                        setIsDrawerOpen(false);
                    },
                    loading:
                        isDrawerActionLoading ||
                        insertQuestionMutation.isPending,
                })}
            </>
        );
    }

    if (purpose === DrawerFooterPurpose.AddGame) {
        return (
            <>
                {renderCloseButton()}
                {renderActionButton({
                    label: "Add",
                    onPress: async () => {
                        await insertGameMutation.mutateAsync();
                        if (whenDoneFunction) {
                            whenDoneFunction();
                        }
                        if (setPendingIdFunction) {
                            setPendingIdFunction(-1);
                        }
                        setIsDrawerOpen(false);
                    },
                    loading:
                        isDrawerActionLoading ||
                        insertQuestionMutation.isPending,
                })}
            </>
        );
    }

    if (purpose === DrawerFooterPurpose.EditGame) {
        return (
            <>
                {renderCloseButton()}
                {renderActionButton({
                    label: "Save",
                    onPress: async () => {
                        await editGameMutation.mutateAsync();
                        if (whenDoneFunction) {
                            whenDoneFunction(); // TODO: check to see if we should use whenDoneFunction EVERYWHERE or just use onSettled
                        }
                        if (setPendingIdFunction) {
                            setPendingIdFunction(-1);
                        }
                        setIsDrawerOpen(false);
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
