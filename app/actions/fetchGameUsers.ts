import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export async function fetchGameUsers(): Promise<
    Database["public"]["Tables"]["game_users"]["Row"][]
> {
    const supabase = createClient();
    const { data: gameUsers, error } = await supabase
        .from("view_game_users")
        .select("*");

    if (error || !gameUsers) {
        throw new Error("Error fetching game users");
    }

    const mappedGameUsers: Database["public"]["Tables"]["game_users"]["Row"][] =
        gameUsers.map((gameUser) => {
            if (
                !gameUser.created_at ||
                !gameUser.game_id ||
                gameUser.is_host === null ||
                !gameUser.updated_at ||
                !gameUser.user_id
            ) {
                throw new Error("Game user data is incomplete");
            }
            return {
                created_at: gameUser.created_at,
                game_id: gameUser.game_id,
                is_host: gameUser.is_host,
                updated_at: gameUser.updated_at,
                user_id: gameUser.user_id,
            };
        });

    return mappedGameUsers;
}
