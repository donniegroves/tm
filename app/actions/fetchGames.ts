import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export async function fetchGames(): Promise<
    Database["public"]["Tables"]["games"]["Row"][]
> {
    const supabase = createClient();
    const { data: games, error } = await supabase.from("games").select("*");

    if (error || !games) {
        throw new Error("Error fetching games");
    }

    return games;
}
