"use client";

import { Button } from "@heroui/button";
import { useState } from "react";
import { getStatusUsingShareCode } from "../helpers";
import { useAddAnswer } from "../hooks/useAddAnswer";
import { useInsideContext } from "../inside/InsideContext";
import { useRealtimeContext } from "../play/[share_code]/RealtimeContext";

export default function PlayAnswerQuestionForm() {
    const { questions, gameQuestions, games, loggedInUserId } =
        useInsideContext();
    const { gameData, channel } = useRealtimeContext();
    const { round } = getStatusUsingShareCode(games);
    const addAnswerMutation = useAddAnswer();
    const [answer, setAnswer] = useState("");

    const gq = gameQuestions.find(
        (q) => q.round === round && q.game_id === gameData?.id
    );
    const question = questions.find((q) => q.id === gq?.question_id);

    const handleAddAnswer = () => {
        if (!gameData || !question || !answer.trim()) return;

        addAnswerMutation.mutate(
            {
                gameId: gameData?.id,
                questionId: question?.id,
                userId: loggedInUserId,
                answer: answer.trim(),
            },
            {
                onSuccess: () =>
                    channel?.send({
                        type: "broadcast",
                        event: "pre-answer-added",
                    }),
            }
        );
    };

    return (
        <>
            <div>Question here:</div>
            <pre>{question?.pre_question}</pre>
            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer..."
            />
            <Button onPress={handleAddAnswer} type="submit">
                Submit Answer
            </Button>
        </>
    );
}
