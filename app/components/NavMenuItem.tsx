"use client";

import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function NavMenuItem({
    label,
    icon,
    href,
}: {
    label: string;
    icon: ReactNode;
    href: string;
}) {
    const router = useRouter();

    return (
        <Button
            className="flex flex-col items-center w-14 h-14"
            isIconOnly
            size="sm"
            aria-label={label}
            variant="light"
            onPress={() => router.push(href)}
        >
            {icon}
            <div className="text-xs">{label}</div>
        </Button>
    );
}
