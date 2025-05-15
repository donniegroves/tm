"use server";

import { createClient } from "@/utils/supabase/server";

export const insertQuestion = async (
    preQuestion: string,
    rankPrompt: string
) => {
    const supabase = await createClient();
    const { error, status } = await supabase
        .from("questions")
        .insert({ pre_question: preQuestion, rank_prompt: rankPrompt });

    if (error || status !== 201) {
        throw new Error();
    }
};
