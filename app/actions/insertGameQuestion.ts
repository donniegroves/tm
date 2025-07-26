"use client";

import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export const insertGameQuestion = async ({
    gameId,
    round,
    questionId,
}: {
    gameId: Database["public"]["Tables"]["games"]["Row"]["id"];
    round: number;
    questionId: Database["public"]["Tables"]["questions"]["Row"]["id"];
}): Promise<Database["public"]["Tables"]["game_questions"]["Row"]> => {
    const supabase = createClient();

    const { data, error, status } = await supabase
        .from("game_questions")
        .insert({
            game_id: gameId,
            round,
            question_id: questionId,
        })
        .select()
        .single();

    if (error || status !== 201 || !data) {
        throw new Error(error?.message || `Failed to insert game question`);
    }

    return data;
};
