"use client";

import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export const insertQuestion = async (): Promise<
    Database["public"]["Tables"]["questions"]["Row"]
> => {
    const form = document.getElementById("add-question-form");
    const questionInput = form?.querySelector("#add-question-input");
    const rankPromptInput = form?.querySelector("#rank-prompt-input");

    if (!form || !questionInput || !rankPromptInput) {
        throw new Error("Proper form elements not found to insert question");
    }

    const question = (questionInput as HTMLInputElement).value;
    const rankPrompt = (rankPromptInput as HTMLInputElement).value;

    const supabase = createClient();

    const { data, error, status } = await supabase
        .from("questions")
        .insert({
            pre_question: question,
            rank_prompt: rankPrompt,
        })
        .select()
        .single();

    if (error || status !== 201 || !data) {
        throw new Error(error?.message || `Failed to insert question`);
    }

    return data;
};
