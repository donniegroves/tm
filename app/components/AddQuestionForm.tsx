"use client";

import { Input } from "@heroui/input";

export default function AddQuestionForm() {
    return (
        <form
            id="add-question-form"
            role="form"
            className="flex flex-col gap-4"
        >
            <Input
                id="add-question-input"
                label="Question"
                placeholder="Enter your question"
                defaultValue="What's your favorite color?"
            />
            <Input
                id="rank-prompt-input"
                label="Rank Prompt"
                placeholder="Enter your rank prompt"
                defaultValue="Rank these from most to least favorite"
            />
        </form>
    );
}
