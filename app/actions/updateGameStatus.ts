"use client";

import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export const updateGameStatus = async (
    gameId: Database["public"]["Tables"]["games"]["Row"]["id"],
    status: Database["public"]["Tables"]["games"]["Row"]["status"]
): Promise<boolean> => {
    const supabase = createClient();

    const { data: updatedGameData, error } = await supabase
        .from("games")
        .update({
            status,
        })
        .eq("id", gameId)
        .select()
        .single();

    if (error || !updatedGameData) {
        throw new Error(`Failed to edit game with id ${gameId}`);
    }

    return true;
};
