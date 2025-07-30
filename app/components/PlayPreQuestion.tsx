"use client";

import { useIsMaster } from "../hooks/useIsMaster";
import { useUpdateGameStatus } from "../hooks/useUpdateGameStatus";
import { useRealtimeContext } from "../play/[share_code]/RealtimeContext";
import { useLobbyHook } from "../play/[share_code]/useLobbyHook";
import PlayAnswerQuestionForm from "./PlayAnswerQuestionForm";

export default function PlayPreQuestion() {
    const { loggedInUserIsMaster } = useIsMaster();
    const { gameData, channel } = useRealtimeContext();
    const updateGameStatusMutation = useUpdateGameStatus();
    const { allAnswersSubmitted } = useLobbyHook();

    if (!gameData || !channel) {
        return <div>Game not found.</div>;
    }

    if (
        loggedInUserIsMaster &&
        allAnswersSubmitted &&
        updateGameStatusMutation.isIdle
    ) {
        updateGameStatusMutation.mutateAsync(
            {
                ...gameData,
                status: gameData.status + 1,
            },
            {
                onSuccess: () => {
                    channel?.send({
                        type: "broadcast",
                        event: "game-status-changed",
                    });
                },
            }
        );

        return null;
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">PreQuestion time!</h1>
            <div className="relative border border-gray-300 w-[400px] h-[300px]">
                {loggedInUserIsMaster && <div>You are the master!</div>}
                {!loggedInUserIsMaster && <PlayAnswerQuestionForm />}
            </div>
        </div>
    );
}
