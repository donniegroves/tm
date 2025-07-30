"use client";

import { Button } from "@heroui/button";
import { Database } from "database.types";
import { getStatusUsingShareCode } from "../helpers";
import { useIsMaster } from "../hooks/useIsMaster";
import { useResetGame } from "../hooks/useResetGame";
import { useInsideContext } from "../inside/InsideContext";
import { useRealtimeContext } from "../play/[share_code]/RealtimeContext";
import AvatarWithName from "./AvatarWithName";
import { CheckmarkSvg } from "./IconSvg";

export default function UsersStatusPanel() {
    const {
        gameUsers: allGameUsers,
        allUsers,
        games,
        loggedInUserId,
        preAnswers,
    } = useInsideContext();
    const { channel, readyUsers, gameData } = useRealtimeContext();
    const { status } = getStatusUsingShareCode(games);
    const resetGameMutation = useResetGame();
    const { currentMasterUserId } = useIsMaster();

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
        await resetGameMutation.mutateAsync(
            {
                gameId: gameData.id,
            },
            {
                onSuccess: () => {
                    channel.send({
                        type: "broadcast",
                        event: "game-reset",
                    });
                },
            }
        );
    };

    const isDuringPreQuestion = status === "pre-question";
    const classForWidth = isDuringPreQuestion ? "w-40" : "w-32";

    return (
        <div className={`flex-shrink-0 ${classForWidth} flex items-center`}>
            <div>
                <h2 className="text-xl font-semibold underline text-center mb-4">
                    Contestants
                </h2>
                <div className="flex flex-col items-center gap-3">
                    {users.map((gu) => {
                        const hasAnswered = preAnswers.some(
                            (answer) => answer.user_id === gu.user_id
                        );
                        return (
                            <div key={gu.user_id} className="flex flex-row">
                                {isDuringPreQuestion && (
                                    <CheckmarkSvg
                                        size={20}
                                        className={`${
                                            hasAnswered ||
                                            currentMasterUserId === gu.user_id
                                                ? "text-customlight/100"
                                                : "text-customlight/15"
                                        } mr-4 mt-1`}
                                    />
                                )}
                                <AvatarWithName
                                    limitNameWidth={false}
                                    userId={gu.user_id}
                                    color={
                                        readyUsers.includes(gu.user_id)
                                            ? "primary"
                                            : "default"
                                    }
                                />
                            </div>
                        );
                    })}
                    {/* TODO: extract this reset game button out */}
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
