"use client";

import { createClient } from "@/utils/supabase/client";

export const deleteGame = async ({ gameId }: { gameId: number }) => {
    const supabase = createClient();
    const { error, status } = await supabase
        .from("games")
        .delete()
        .eq("id", gameId);

    if (error || status !== 204) {
        throw new Error(
            error?.message || `Failed to delete game with id ${gameId}`
        );
    }
};
