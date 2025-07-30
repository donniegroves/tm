import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export async function fetchPreAnswers(): Promise<
    Database["public"]["Tables"]["pre_answers"]["Row"][]
> {
    const supabase = createClient();
    const { data: preAnswers, error } = await supabase
        .from("view_pre_answers")
        .select("*");

    if (error || !preAnswers) {
        throw new Error("Error fetching pre answers");
    }

    const mappedPreAnswers: Database["public"]["Tables"]["pre_answers"]["Row"][] =
        preAnswers.map((preAnswer) => {
            if (
                !preAnswer.created_at ||
                !preAnswer.game_id ||
                preAnswer.answer === null ||
                !preAnswer.question_id ||
                !preAnswer.updated_at ||
                !preAnswer.user_id
            ) {
                throw new Error("Pre answer data is incomplete");
            }

            return {
                created_at: preAnswer.created_at,
                game_id: preAnswer.game_id,
                answer: preAnswer.answer,
                question_id: preAnswer.question_id,
                updated_at: preAnswer.updated_at,
                user_id: preAnswer.user_id,
            };
        });

    return mappedPreAnswers;
}
