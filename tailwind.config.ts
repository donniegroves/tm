import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(autocomplete|avatar|button|checkbox|chip|drawer|dropdown|form|input|select|spinner|table|ripple|listbox|divider|popover|scroll-shadow|modal|menu|spacer).js"
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
