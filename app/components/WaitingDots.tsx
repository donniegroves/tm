interface WaitingDotsProps {
    className?: string;
}

export default function WaitingDots({ className = "" }: WaitingDotsProps) {
    return (
        <>
            <style jsx>{`
                @keyframes waitingDots {
                    0%,
                    66.67% {
                        opacity: 0;
                    }
                    33.33% {
                        opacity: 1;
                    }
                }
            `}</style>
            <span className={className}>
                <span className="animate-[waitingDots_1.5s_ease-in-out_infinite]">
                    .
                </span>
                <span className="animate-[waitingDots_1.5s_ease-in-out_infinite] [animation-delay:0.5s]">
                    .
                </span>
                <span className="animate-[waitingDots_1.5s_ease-in-out_infinite] [animation-delay:1s]">
                    .
                </span>
            </span>
        </>
    );
}
