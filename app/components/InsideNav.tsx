import { GamesSvg, QuestionSvg, SettingsSvg, UsersSvg } from "./IconSvg";
import NavMenuItem from "./NavMenuItem";

const navItems = [
    {
        icon: <GamesSvg />,
        label: "Games",
        href: "/inside/games",
    },
    {
        icon: <UsersSvg />,
        label: "Users",
        href: "/inside/users",
    },
    {
        icon: <QuestionSvg />,
        label: "Questions",
        href: "/inside/questions",
    },
    {
        icon: <SettingsSvg />,
        label: "Settings",
    },
];

export default function InsideNav() {
    return (
        <nav className="flex flex-col items-center border-r-1 border-customlight/50 w-16 pt-2 gap-2 fixed h-screen bg-customaccent">
            {navItems.map((item) => (
                <NavMenuItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                />
            ))}
        </nav>
    );
}
