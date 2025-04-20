import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/components/(button|form|input|ripple|spinner).js",
    ],
    theme: {
        extend: {
            colors: {
                customdark: "#111111",
                customlight: "#dddddd",
            },
        },
    },
    darkMode: "class",
    plugins: [heroui()],
} satisfies Config;
