"use client";

import WaitingDots from "@/app/components/WaitingDots";
import { useUpdateGameStatus } from "@/app/hooks/useUpdateGameStatus";
import { useInsideContext } from "@/app/inside/InsideContext";
import { Button } from "@heroui/button";
import { useRealtimeContext } from "./RealtimeContext";

export interface CursorMessage {
    x: number;
    y: number;
}

export default function Lobby() {
    const {
        games,
        gameUsers: allGameUsers,
        allUsers,
        loggedInUserId,
    } = useInsideContext();
    const { channel, readyUsers } = useRealtimeContext();
    const updateGameStatusMutation = useUpdateGameStatus();

    const share_code = window.location.pathname.split("/")[2];
    const gameData = games.find((g) => g.share_code === share_code);

    const gameUsersIds = allGameUsers
        .filter((gu) => gu.game_id === gameData?.id)
        .map((gu) => gu.user_id);
    const hostUserId = allGameUsers.find(
        (gu) => gu.game_id === gameData?.id && gu.is_host
    )?.user_id;
    const thisGamesUsers = allUsers.filter((gu) =>
        gameUsersIds.includes(gu.user_id)
    );
    const allPlayersAreConnected = thisGamesUsers.every((gu) =>
        readyUsers.includes(gu.user_id)
    );

    if (thisGamesUsers.length === 0 || !hostUserId || !gameData || !channel) {
        return <div>Game not found.</div>;
    }

    const handleStartGame = async () => {
        const { gameData: updatedGameData } =
            await updateGameStatusMutation.mutateAsync({
                ...gameData,
                status: gameData.status + 1,
            });

        if (!updatedGameData) {
            throw new Error(`Failed to edit game with id ${gameData.id}`);
        }

        channel.send({ type: "broadcast", event: "game-status-changed" });
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">
                Lobby for: {gameData.share_code}
            </h1>
            {!allPlayersAreConnected && (
                <p>
                    <span className="flex items-center">
                        <WaitingDots className="mr-1" />
                        Waiting for Players
                        <WaitingDots className="ml-1" />
                    </span>
                </p>
            )}
            {loggedInUserId !== hostUserId && allPlayersAreConnected && (
                <p>
                    <span>Waiting for host to start the game</span>
                    <WaitingDots className="ml-1" />
                </p>
            )}

            <div>
                {loggedInUserId === hostUserId && allPlayersAreConnected && (
                    <Button
                        className="text-lg"
                        onPress={() => handleStartGame()}
                    >
                        <span className="animate-pulse">Start Game</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
