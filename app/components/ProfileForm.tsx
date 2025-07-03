"use client";

import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { timezones } from "../common";
import { useInsideContext } from "../inside/InsideContext";

interface ProfileFormProps {
    userId?: string;
}

export default function ProfileForm({ userId }: ProfileFormProps) {
    const { allUsers, loggedInUserId } = useInsideContext();
    const userIdToUse = userId ?? loggedInUserId;

    const userData = allUsers.find((user) => user.user_id === userIdToUse);

    return (
        <form id="profile-form" className="flex flex-col gap-4">
            <Input
                label="Username"
                placeholder="Enter your username"
                defaultValue={userData?.username ?? undefined}
            />
            <Select
                label="Preferred timezone"
                defaultSelectedKeys={
                    userData?.timezone ? [userData.timezone] : []
                }
            >
                {timezones.map((timezone) => (
                    <SelectItem key={timezone.key}>{timezone.label}</SelectItem>
                ))}
            </Select>
        </form>
    );
}
