"use client";

import { Button } from "@heroui/button";
import { Database } from "database.types";
import { useResetGame } from "../hooks/useResetGame";
import { useInsideContext } from "../inside/InsideContext";
import { useRealtimeContext } from "../play/[share_code]/RealtimeContext";
import AvatarWithName from "./AvatarWithName";

export default function UsersStatusPanel() {
    const {
        gameUsers: allGameUsers,
        allUsers,
        loggedInUserId,
    } = useInsideContext();
    const { channel, readyUsers, gameData } = useRealtimeContext();
    const resetGameMutation = useResetGame();

    if (!gameData || !channel) {
        return <div>Game not found.</div>;
    }

    const userIsHost = allGameUsers.some(
        (gu) =>
            gu.game_id === gameData.id &&
            gu.user_id === loggedInUserId &&
            gu.is_host
    );

    const users = allGameUsers
        .filter((gu) => gu.game_id === gameData.id)
        .map((gu) => allUsers.find((u) => u.user_id === gu.user_id))
        .filter(
            (user): user is Database["public"]["Tables"]["users"]["Row"] =>
                !!user
        );

    const handleReset = async () => {
        await resetGameMutation.mutateAsync({
            gameId: gameData.id,
        });

        channel.send({
            type: "broadcast",
            event: "game-status-changed",
        });
    };

    return (
        <div className="flex-shrink-0 w-32 flex items-center">
            <div>
                <h2 className="text-xl font-semibold underline text-center mb-4">
                    Contestants
                </h2>
                <div className="flex flex-col items-center gap-3">
                    {users.map((gu) => {
                        return (
                            <AvatarWithName
                                key={gu.user_id}
                                limitNameWidth={false}
                                userId={gu.user_id}
                                color={
                                    readyUsers.includes(gu.user_id)
                                        ? "primary"
                                        : "default"
                                }
                            />
                        );
                    })}
                    {userIsHost && (
                        <>
                            <hr className="my-4 w-full" />
                            <Button onPress={() => handleReset()} size="sm">
                                Reset game
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
