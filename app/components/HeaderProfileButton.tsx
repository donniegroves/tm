"use client";

import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/dropdown";
import { signOut } from "../actions/signOut";
import { DownArrowSvg, SignOutSvg, UserIcon } from "./IconSvg";

export default function HeaderProfileButton() {
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
