"use client";

import { Button } from "@heroui/button";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Database } from "database.types";
import { useUpdateGameStatus } from "../hooks/useUpdateGameStatus";
import { useInsideContext } from "../inside/InsideContext";
import AvatarWithName from "./AvatarWithName";

interface UsersStatusPanel {
    channel: RealtimeChannel;
    gameData: Database["public"]["Tables"]["games"]["Row"];
    readyUsers: Database["public"]["Tables"]["users"]["Row"]["user_id"][];
}

export default function UsersStatusPanel({
    channel,
    readyUsers,
    gameData,
}: UsersStatusPanel) {
    const {
        gameUsers: allGameUsers,
        allUsers,
        loggedInUserId,
    } = useInsideContext();

    const userIsHost = allGameUsers.some(
        (gu) =>
            gu.game_id === gameData.id &&
            gu.user_id === loggedInUserId &&
            gu.is_host
    );

    const updateGameStatusMutation = useUpdateGameStatus();

    const users = allGameUsers
        .filter((gu) => gu.game_id === gameData.id)
        .map((gu) => allUsers.find((u) => u.user_id === gu.user_id))
        .filter(
            (user): user is Database["public"]["Tables"]["users"]["Row"] =>
                !!user
        );

    const handleReset = async () => {
        await updateGameStatusMutation.mutateAsync({
            ...gameData,
            status: 0,
        });

        channel.send({
            type: "broadcast",
            event: "game-status-changed",
        });

        window.location.reload();
    };

    return (
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
    );
}
