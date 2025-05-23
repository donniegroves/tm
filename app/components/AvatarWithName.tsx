"use client";

import { Avatar } from "@heroui/avatar";
import { useInsideContext } from "../inside/InsideContext";
import HeaderProfileDropdown from "./HeaderProfileDropdown";

interface AvatarWithNameProps {
    showProfileButton?: boolean;
    limitNameWidth?: boolean;
    userId?: string;
}

export default function AvatarWithName({
    showProfileButton = false,
    limitNameWidth = true,
    userId,
}: AvatarWithNameProps) {
    const { allUsers, loggedInUserId } = useInsideContext();

    const userIdToUse = userId ?? loggedInUserId;
    const userData = allUsers.find((user) => user.user_id === userIdToUse);

    const nameClass = limitNameWidth ? "max-w-24" : "max-w-full";

    return (
        <div className="flex items-center gap-2">
            <Avatar
                size="sm"
                isBordered
                radius="sm"
                src={
                    userData?.avatar_url == null
                        ? undefined
                        : userData?.avatar_url
                }
                name={
                    userData?.full_name == null
                        ? undefined
                        : userData?.full_name
                }
                title={`${userData?.user_id} / ${userData?.access_level}`}
            />
            <div className={nameClass}>
                <div className="text-xs truncate">{userData?.full_name}</div>
                <div className="text-[0.65rem] text-customlight/50 truncate">
                    {userData?.username}
                </div>
            </div>
            {showProfileButton && (
                <div>
                    <HeaderProfileDropdown />
                </div>
            )}
        </div>
    );
}
