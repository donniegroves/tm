"use client";

import ThemeSwitcher from "./ThemeSwitcher";

export default function FrontPageContent() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-4xl font-bold mb-10">Base App</h1>
            <ThemeSwitcher />
        </div>
    );
}
