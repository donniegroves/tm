"use client";

import { Button } from "@heroui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // mounted is necessary to prevent hydration warnings
    if (!mounted) {
        return null;
    }

    return (
        <div className="flex flex-col min-w-64">
            <div>The current theme is: {theme}.</div>
            <Button
                className="bg-customlight text-customdark outline my-2"
                onPress={() => setTheme("light")}
            >
                Light Mode
            </Button>
            <Button
                className="bg-customdark text-customlight outline mb-2"
                onPress={() => setTheme("dark")}
            >
                Dark Mode
            </Button>
            <Button
                className="bg-customdark text-customlight outline"
                onPress={() => setTheme("system")}
            >
                System Mode
            </Button>
        </div>
    );
}
