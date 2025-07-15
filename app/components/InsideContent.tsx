import { MustacheSvg } from "./IconSvg";

export default function InsideContent() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <MustacheSvg />
            <h1 className="text-2xl font-bold">
                {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
        </div>
    );
}
