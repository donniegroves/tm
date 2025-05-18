import { Avatar } from "@heroui/avatar";
import { Database } from "database.types";
import Image from "next/image";
import Link from "next/link";
import HeaderProfileButton from "./HeaderProfileButton";

export default function Header({
    loggedInUser,
}: {
    loggedInUser: Database["public"]["Tables"]["users"]["Row"];
}) {
    return (
        <header className="flex flex-row justify-between sticky top-0 px-3 py-1 bg-white dark:bg-black z-10 border-b-1 border-customlight/50">
            <div className="flex flex-row items-center gap-1">
                <Link href={"/inside"}>
                    <Image src="/logo.png" alt="Logo" width={40} height={40} />
                </Link>

                <h1 className="text-xl font-semibold">
                    {process.env.NEXT_PUBLIC_APP_NAME || "App"}
                </h1>
            </div>

            <div
                className="flex items-center gap-2"
                title={`${loggedInUser.user_id} / ${loggedInUser.access_level}`}
            >
                <Avatar
                    size="sm"
                    classNames={{
                        img: "opacity-100",
                    }}
                    isBordered
                    radius="sm"
                    src={loggedInUser.avatar_url ?? undefined}
                    name={loggedInUser.full_name ?? undefined}
                />
                <div>
                    <div className="text-xs">{loggedInUser.full_name}</div>
                    <div className="text-[0.65rem]">{loggedInUser.email}</div>
                </div>
                <div>
                    <HeaderProfileButton />
                </div>
            </div>
        </header>
    );
}
