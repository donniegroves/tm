import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export async function fetchGameUsers(): Promise<
    Database["public"]["Tables"]["game_users"]["Row"][]
> {
    const supabase = createClient();
    const { data: gameUsers, error } = await supabase
        .from("game_users")
        .select("*");

    if (error || !gameUsers) {
        throw new Error("Error fetching game users");
    }

    return gameUsers;
}
