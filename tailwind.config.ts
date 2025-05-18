import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/components/(avatar|button|dropdown|form|input|spinner|table|ripple|menu|divider|popover|checkbox|spacer).js",
    ],
    theme: {
        extend: {
            colors: {
                customdark: "#29231e",
                customlight: "#f8eed8",
                customaccent: "#983839",
            },
        },
    },
    darkMode: "class",
    plugins: [heroui()],
} satisfies Config;
