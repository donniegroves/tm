"use client";

import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export interface AddAnswerParams {
    gameId: Database["public"]["Tables"]["games"]["Row"]["id"];
    questionId: Database["public"]["Tables"]["questions"]["Row"]["id"];
    userId: Database["public"]["Tables"]["users"]["Row"]["user_id"];
    answer: Database["public"]["Tables"]["pre_answers"]["Row"]["answer"];
}

export const addAnswer = async (
    params: AddAnswerParams
): Promise<Database["public"]["Tables"]["pre_answers"]["Row"]> => {
    const supabase = createClient();

    const { data: addedAnswer, error } = await supabase
        .from("pre_answers")
        .upsert({
            question_id: params.questionId,
            game_id: params.gameId,
            user_id: params.userId,
            answer: params.answer,
        })
        .select()
        .single();

    if (error || !addedAnswer) {
        throw new Error(`Failed to add answer`);
    }

    return addedAnswer;
};
