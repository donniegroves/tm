"use client";

import { Button } from "@heroui/button";
import { LobbyStatus } from "./LobbyStatus";
import { useRealtimeContext } from "./RealtimeContext";
import { useLobbyHook } from "./useLobbyHook";
import { useStartGame } from "./useStartGame";

export interface CursorMessage {
    x: number;
    y: number;
}

export default function Lobby() {
    const { channel } = useRealtimeContext();
    const {
        loggedInUserIsHost,
        allPlayersAreConnected,
        isGameReady,
        gameData,
    } = useLobbyHook();
    const { startGame, isStarting } = useStartGame();

    if (!isGameReady || !gameData || !channel) {
        return <div>Game not found.</div>;
    }

    const handleStartGame = () => startGame(gameData);
    const canStartGame = loggedInUserIsHost && allPlayersAreConnected;

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">
                Lobby for: {gameData.share_code}
            </h1>

            <LobbyStatus
                allPlayersAreConnected={allPlayersAreConnected}
                loggedInUserIsHost={loggedInUserIsHost}
            />

            <div>
                {canStartGame && (
                    <Button
                        className="text-lg"
                        onPress={handleStartGame}
                        isLoading={isStarting}
                        isDisabled={isStarting}
                    >
                        <span className="animate-pulse">Start Game</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
