import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
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

    if (purpose === DrawerFooterPurpose.ProfileUpdate) {
        const handleClose = () => setIsDrawerOpen(false);
        const handleSave = async () => {
            setIsDrawerActionLoading(true);
            await updateProfile(loggedInUserId);
            setIsDrawerActionLoading(false);
            setIsDrawerOpen(false);
        };

        return (
            <>
                <Button color="danger" variant="light" onPress={handleClose}>
                    Close
                </Button>
                <Button color="primary" onPress={handleSave}>
                    {isDrawerActionLoading ? (
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
