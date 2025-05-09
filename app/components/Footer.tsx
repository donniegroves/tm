export default function Footer() {
    return (
        <footer className="sticky bottom-0 py-2 border-t border-customdark dark:border-customlight bg-customlight dark:bg-customdark text-center text-sm text-customdark dark:text-customlight z-10">
            &copy; {new Date().getFullYear()}{" "}
            {process.env.NEXT_PUBLIC_APP_NAME || "App"}. All rights reserved.
        </footer>
    );
}
