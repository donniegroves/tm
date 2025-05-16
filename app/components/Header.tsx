import { Avatar } from "@heroui/avatar";
import { User } from "@supabase/supabase-js";
import HeaderProfileButton from "./HeaderProfileButton";

export default function Header({
    loggedInUser,
}: {
    loggedInUser: User & {
        access_level: number;
    };
}) {
    return (
        <header className="flex flex-row justify-between sticky top-0 py-4 mb-2 border-b bg-customlight dark:bg-customdark border-customdark dark:border-customlight z-10">
            <h1 className="text-xl font-semibold">
                {process.env.NEXT_PUBLIC_APP_NAME || "App"}
            </h1>
            <div
                className="flex items-center gap-2"
                title={`${loggedInUser.id} / ${loggedInUser.access_level}`}
            >
                <Avatar
                    size="sm"
                    classNames={{
                        img: "opacity-100",
                    }}
                    isBordered
                    radius="sm"
                    src={loggedInUser.user_metadata.avatar_url}
                    name={loggedInUser.user_metadata.full_name}
                />
                <div>
                    <div className="text-xs">
                        {loggedInUser.user_metadata.full_name}
                    </div>
                    <div className="text-[0.65rem]">{loggedInUser.email}</div>
                </div>
                <div>
                    <HeaderProfileButton />
                </div>
            </div>
        </header>
    );
}
