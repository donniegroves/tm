"use client";

import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export type UpdateGameStatusReturn = {
    gameData: Database["public"]["Tables"]["games"]["Row"];
};

export const updateGameStatus = async (
    gameData: Database["public"]["Tables"]["games"]["Row"]
): Promise<UpdateGameStatusReturn> => {
    const supabase = createClient();

    const { data: updatedGameData, error } = await supabase
        .from("games")
        .update({
            status: gameData.status,
        })
        .eq("id", gameData.id)
        .select()
        .single();

    if (error || !updatedGameData) {
        throw new Error(`Failed to edit game with id ${gameData.id}`);
    }

    return { gameData: updatedGameData };
};
