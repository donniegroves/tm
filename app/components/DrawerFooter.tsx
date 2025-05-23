import { Button } from "@heroui/button";
import { updateProfile } from "../actions/updateProfile";
import { useDrawer } from "../inside/DrawerProvider";
import { useInsideContext } from "../inside/InsideContext";

export enum DrawerFooterPurpose {
    ProfileUpdate = "profile-update",
}

interface DrawerFooterProps {
    purpose: DrawerFooterPurpose;
}

export default function DrawerFooter({ purpose }: DrawerFooterProps) {
    const { loggedInUserId } = useInsideContext();
    const { setIsDrawerOpen } = useDrawer();

    if (purpose === DrawerFooterPurpose.ProfileUpdate) {
        const handleClose = () => setIsDrawerOpen(false);
        const handleSave = () => updateProfile(loggedInUserId);

        return (
            <>
                <Button color="danger" variant="light" onPress={handleClose}>
                    Close
                </Button>
                <Button color="primary" onPress={handleSave}>
                    Save
                </Button>
            </>
        );
    }
}
