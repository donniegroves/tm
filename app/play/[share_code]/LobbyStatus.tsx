import WaitingDots from "@/app/components/WaitingDots";

interface LobbyStatusProps {
    allPlayersAreConnected: boolean;
    loggedInUserIsHost: boolean;
}

export function LobbyStatus({
    allPlayersAreConnected,
    loggedInUserIsHost,
}: LobbyStatusProps) {
    if (!allPlayersAreConnected) {
        return (
            <p>
                <span className="flex items-center">
                    <WaitingDots className="mr-1" />
                    Waiting for Players
                    <WaitingDots className="ml-1" />
                </span>
            </p>
        );
    }

    if (!loggedInUserIsHost && allPlayersAreConnected) {
        return (
            <p>
                <span>Waiting for host to start the game</span>
                <WaitingDots className="ml-1" />
            </p>
        );
    }

    return null;
}
