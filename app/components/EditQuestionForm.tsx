"use client";

import { Input } from "@heroui/input";
import { useInsideContext } from "../inside/InsideContext";

export default function EditQuestionForm({
    questionId,
}: {
    questionId: number;
}) {
    const { questions } = useInsideContext();

    const currentQuestionData = questions?.find((q) => q.id === questionId);
    const currentQuestion = currentQuestionData?.pre_question;
    const currentRankPrompt = currentQuestionData?.rank_prompt;

    return (
        <form
            id="edit-question-form"
            role="form"
            className="flex flex-col gap-4"
        >
            <Input
                id="question-id-input"
                type="hidden"
                value={questionId.toString()}
            />
            <Input
                id="edit-question-input"
                label="Question"
                placeholder="Enter your question"
                defaultValue={currentQuestion || "What is your favorite color?"}
            />
            <Input
                id="edit-rank-prompt-input"
                label="Rank Prompt"
                placeholder="Enter your rank prompt"
                defaultValue={
                    currentRankPrompt ||
                    "Rank these from most to least favorite"
                }
            />
        </form>
    );
}
