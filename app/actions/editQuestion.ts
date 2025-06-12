"use client";

import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export const editQuestion = async (): Promise<
    Database["public"]["Tables"]["questions"]["Row"]
> => {
    const form = document.getElementById("edit-question-form");
    const questionIdInput = form?.querySelector("#question-id-input");
    const questionInput = form?.querySelector("#edit-question-input");
    const rankPromptInput = form?.querySelector("#edit-rank-prompt-input");

    if (!form || !questionIdInput || !questionInput || !rankPromptInput) {
        throw new Error("Proper form elements not found to insert question");
    }

    const questionId = (questionIdInput as HTMLInputElement).value;
    const pre_question = (questionInput as HTMLInputElement).value;
    const rankPrompt = (rankPromptInput as HTMLInputElement).value;

    const supabase = createClient();

    const { data, error } = await supabase
        .from("questions")
        .update({
            pre_question,
            rank_prompt: rankPrompt,
        })
        .eq("id", parseInt(questionId, 10))
        .select()
        .single();

    console.log("editQuestion data:", data);
    console.log("editQuestion error:", error);

    if (error || !data) {
        throw new Error(
            error?.message || `Failed to edit question with id ${questionId}`
        );
    }

    return data;
};
