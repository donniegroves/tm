import Image from "next/image";
import Link from "next/link";
import AvatarWithName from "./AvatarWithName";

export default function Header() {
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
            <AvatarWithName showProfileButton />
        </header>
    );
}
