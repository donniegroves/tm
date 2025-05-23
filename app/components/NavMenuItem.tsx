"use client";

import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useDrawer } from "../inside/DrawerProvider";
import { useInsideContext } from "../inside/InsideContext";
import DrawerFooter, { DrawerFooterPurpose } from "./DrawerFooter";
import ProfileForm from "./ProfileForm";

export default function NavMenuItem({
    label,
    icon,
    href,
}: {
    label: string;
    icon: ReactNode;
    href?: string;
}) {
    const { allUsers, loggedInUserId } = useInsideContext();
    const loggedInUser = allUsers.find(
        (user) => user.user_id === loggedInUserId
    );

    const { setIsDrawerOpen, setDrawerContent } = useDrawer();
    const router = useRouter();

    const handlePress = () => {
        if ((loggedInUser && label === "Settings") || !href) {
            setDrawerContent({
                header: (
                    <div className="text-lg font-bold">
                        Profile &amp; Settings
                    </div>
                ),
                body: <ProfileForm userId={loggedInUserId} />,
                footer: (
                    <DrawerFooter purpose={DrawerFooterPurpose.ProfileUpdate} />
                ),
            });
            setIsDrawerOpen(true);
        } else {
            router.push(href);
        }
    };

    return (
        <>
            <Button
                className="flex flex-col items-center w-14 h-14 text-customlight"
                isIconOnly
                size="sm"
                aria-label={label}
                variant="light"
                onPress={handlePress}
            >
                {icon}
                <div className="text-xs">{label}</div>
            </Button>
        </>
    );
}
