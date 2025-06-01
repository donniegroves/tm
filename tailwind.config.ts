import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/components/(avatar|button|checkbox|drawer|dropdown|form|input|select|spinner|table|ripple|modal|menu|divider|popover|listbox|scroll-shadow|spacer).js",
    ],
    theme: {
        extend: {
            colors: {
                customdark: "#29231e",
                customlight: "#f8eed8",
                customaccent: "#983839",
            },
            blur: {
                xs: "2px",
            },
        },
    },
    darkMode: "class",
    plugins: [heroui()],
} satisfies Config;
