"use client";

import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export const resetGame = async (
    gameId: Database["public"]["Tables"]["games"]["Row"]["id"]
): Promise<boolean> => {
    const supabase = createClient();

    const { error: error1 } = await supabase
        .from("rankings")
        .delete()
        .eq("game_id", gameId);

    const { error: error2 } = await supabase
        .from("game_questions")
        .delete()
        .eq("game_id", gameId);

    const { error: error3 } = await supabase
        .from("games")
        .update({
            status: 0,
        })
        .eq("id", gameId);

    if (error1 || error2 || error3) {
        throw new Error(`Failed to reset game with id ${gameId}`);
    }

    return true;
};
