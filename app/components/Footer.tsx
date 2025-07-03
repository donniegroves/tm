export default function Footer() {
    return (
        <footer className="w-full bottom-0 py-1 border-t border-customdark/50 dark:border-customlight/50 bg-customlight dark:bg-customdark text-center text-xs text-customdark dark:text-customlight z-10">
            &copy; {new Date().getFullYear()}{" "}
            {process.env.NEXT_PUBLIC_APP_NAME || "App"}. All rights reserved.
        </footer>
    );
}
