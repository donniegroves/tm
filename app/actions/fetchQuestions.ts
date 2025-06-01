import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export async function fetchQuestions(): Promise<
    Database["public"]["Tables"]["questions"]["Row"][]
> {
    const supabase = createClient();
    const { data: questions, error } = await supabase
        .from("questions")
        .select("*");

    if (error || !questions) {
        throw new Error("Error fetching questions");
    }

    return questions;
}
