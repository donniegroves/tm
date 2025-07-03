"use client";

import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
} from "@heroui/drawer";
import { useDrawer } from "../inside/DrawerProvider";

export function InsideDrawer() {
    const { drawerContent, isDrawerOpen } = useDrawer();

    return (
        <Drawer
            hideCloseButton
            className="h-full max-w-sm"
            isOpen={isDrawerOpen}
        >
            <DrawerContent>
                {() => (
                    <>
                        <DrawerHeader className="py-4">
                            {drawerContent.header}
                        </DrawerHeader>
                        <DrawerBody>{drawerContent.body}</DrawerBody>
                        <DrawerFooter>{drawerContent.footer}</DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
