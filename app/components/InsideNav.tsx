import { GamesSvg, QuestionSvg, SettingsSvg, UsersSvg } from "./IconSvg";
import NavMenuItem from "./NavMenuItem";

export default function InsideNav() {
    return (
        <nav className="flex flex-col items-center border-r-1 border-customlight/50 w-16 pt-2 gap-2 fixed h-screen bg-customaccent">
            <NavMenuItem
                icon={<GamesSvg />}
                label="Games"
                href="/inside/games"
            />
            <NavMenuItem
                icon={<UsersSvg />}
                label="Users"
                href="/inside/users"
            />
            <NavMenuItem
                icon={<QuestionSvg />}
                label="Questions"
                href="/inside/questions"
            />
            <NavMenuItem icon={<SettingsSvg />} label="Settings" />
        </nav>
    );
}
