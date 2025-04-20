"use client";

export default function HorizontalRule({ text }: { text?: string }) {
    if (!text) {
        return <hr className="w-full my-6 border-gray-300" />;
    }

    return (
        <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-500">{text}</span>
            <hr className="flex-grow border-gray-300" />
        </div>
    );
}
