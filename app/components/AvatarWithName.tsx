import { Avatar } from "@heroui/avatar";
import { Database } from "database.types";
import HeaderProfileButton from "./HeaderProfileButton";

interface AvatarWithNameProps {
    user: Database["public"]["Tables"]["users"]["Row"];
    showProfileButton?: boolean;
    limitNameWidth?: boolean;
}

export default function AvatarWithName({
    user,
    showProfileButton = false,
    limitNameWidth = true,
}: AvatarWithNameProps) {
    const nameClass = limitNameWidth ? "max-w-24" : "max-w-full";

    return (
        <div className="flex items-center gap-2">
            <Avatar
                size="sm"
                isBordered
                radius="sm"
                src={user.avatar_url ?? undefined}
                name={user.full_name ?? undefined}
                title={`${user.user_id} / ${user.access_level}`}
            />
            <div className={nameClass}>
                <div className="text-xs truncate">{user.full_name}</div>
                <div className="text-[0.65rem] text-customlight/50 truncate">
                    {user.username}
                </div>
            </div>
            {showProfileButton && (
                <div>
                    <HeaderProfileButton />
                </div>
            )}
        </div>
    );
}
