"use client";

import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/dropdown";
import { signOut } from "../actions/signOut";
import { useDrawer } from "../inside/DrawerProvider";
import { useInsideContext } from "../inside/InsideContext";
import DrawerFooter, { DrawerFooterPurpose } from "./DrawerFooter";
import { DownArrowSvg, SignOutSvg, UserIcon } from "./IconSvg";
import ProfileForm from "./ProfileForm";

export default function HeaderProfileDropdown() {
    const { loggedInUserId } = useInsideContext();
    const { setIsDrawerOpen, setDrawerContent } = useDrawer();

    return (
        <Dropdown classNames={{ content: "min-w-32" }}>
            <DropdownTrigger>
                <div role="button">
                    <DownArrowSvg
                        className="dark:fill-customlight fill-customdark"
                        fill="#ffffff"
                        height={12}
                        width={12}
                    />
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                    startContent={<UserIcon size={16} />}
                    key="profile"
                    onPress={() => {
                        setDrawerContent({
                            header: (
                                <div className="text-lg font-bold">
                                    Profile &amp; Settings
                                </div>
                            ),
                            body: <ProfileForm userId={loggedInUserId} />,
                            footer: (
                                <DrawerFooter
                                    purpose={DrawerFooterPurpose.ProfileUpdate}
                                />
                            ),
                        });
                        setIsDrawerOpen(true);
                    }}
                >
                    Profile
                </DropdownItem>
                <DropdownItem
                    startContent={<SignOutSvg size={16} />}
                    key="signout"
                    onPress={async () => {
                        await signOut();
                    }}
                >
                    Sign out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
