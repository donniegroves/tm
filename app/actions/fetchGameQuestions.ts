import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export async function fetchGameQuestions(): Promise<
    Database["public"]["Tables"]["game_questions"]["Row"][]
> {
    const supabase = createClient();
    const { data: gameQuestions, error } = await supabase
        .from("game_questions")
        .select("*");

    if (error || !gameQuestions) {
        throw new Error("Error fetching game questions");
    }

    return gameQuestions;
}
