"use client";

import { getStatusUsingShareCode } from "../helpers";
import { useInsideContext } from "../inside/InsideContext";
import { useRealtimeContext } from "../play/[share_code]/RealtimeContext";

export default function PlayPreQuestion() {
    const { questions, gameQuestions, games } = useInsideContext();
    const { round } = getStatusUsingShareCode(games);
    const { gameData } = useRealtimeContext();

    const gq = gameQuestions.find(
        (q) => q.round === round && q.game_id === gameData?.id
    );

    const question = questions.find((q) => q.id === gq?.question_id);

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">PreQuestion!</h1>
            <div className="relative border border-gray-300 w-[400px] h-[300px]">
                <div>Question here:</div>
                <pre>{question?.pre_question}</pre>
                <input type="text" />
            </div>
        </div>
    );
}
