import { useInsertGameQuestion } from "@/app/hooks/useInsertGameQuestion";
import { useUpdateGameStatus } from "@/app/hooks/useUpdateGameStatus";
import { useInsideContext } from "@/app/inside/InsideContext";
import { Database } from "database.types";
import { useRealtimeContext } from "./RealtimeContext";

export function useStartGame() {
    const { channel } = useRealtimeContext();
    const { questions: allQuestions } = useInsideContext();
    const updateGameStatusMutation = useUpdateGameStatus();
    const insertGameQuestionMutation = useInsertGameQuestion();

    const startGame = async (
        gameData: Database["public"]["Tables"]["games"]["Row"]
    ) => {
        try {
            const randomQuestionId =
                allQuestions[Math.floor(Math.random() * allQuestions.length)]
                    .id;

            const insertResult = await insertGameQuestionMutation.mutateAsync({
                gameId: gameData.id,
                round: 1,
                questionId: randomQuestionId,
            });

            const updateResult = await updateGameStatusMutation.mutateAsync(
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

            if (!insertResult || !updateResult) {
                throw new Error(`Failed to edit game with id ${gameData.id}`);
            }
        } catch (error) {
            console.error("Failed to start game:", error);
            throw error;
        }
    };

    return {
        startGame,
        isStarting:
            updateGameStatusMutation.isPending ||
            insertGameQuestionMutation.isPending,
    };
}
