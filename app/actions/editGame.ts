"use client";

import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export type EditGameDataReturn = {
    gameData: Database["public"]["Tables"]["games"]["Row"];
    gameUsersData: Database["public"]["Tables"]["game_users"]["Row"][];
};

export const editGame = async (): Promise<EditGameDataReturn> => {
    const form = document.getElementById("edit-game-form");
    const gameIdInput = form?.querySelector("#game-id-input");
    const hostInput = form?.querySelector("#host-input");
    const inviteesInput = form?.querySelector("#invitees-input");
    const shareCodeInput = form?.querySelector("#share-code-input");
    const aiBotsInput = form?.querySelector("#ai-bots-input");
    const questionDurationInput = form?.querySelector(
        "#question-duration-input"
    );
    const rankingDurationInput = form?.querySelector("#ranking-duration-input");

    if (
        !form ||
        !gameIdInput ||
        !hostInput ||
        !inviteesInput ||
        !shareCodeInput ||
        !aiBotsInput ||
        !questionDurationInput ||
        !rankingDurationInput
    ) {
        throw new Error("Proper form elements not found to edit game");
    }

    const host = (hostInput as HTMLInputElement).value;
    const gameId = (gameIdInput as HTMLInputElement).value;
    const invitees = (inviteesInput as HTMLInputElement).value;
    const shareCode = (shareCodeInput as HTMLInputElement).value;
    const aiBots = (aiBotsInput as HTMLInputElement).value;
    const questionDuration = (questionDurationInput as HTMLInputElement).value;
    const rankingDuration = (rankingDurationInput as HTMLInputElement).value;

    const supabase = createClient();

    const { data: updatedGameData, error } = await supabase
        .from("games")
        .update({
            host_user_id: host,
            share_code: shareCode,
            num_static_ai: parseInt(aiBots, 10),
            seconds_per_pre: parseInt(questionDuration, 10),
            seconds_per_rank: parseInt(rankingDuration, 10),
        })
        .eq("id", parseInt(gameId, 10))
        .select()
        .single();

    if (error || !updatedGameData) {
        throw new Error(`Failed to edit game with id ${gameId}`);
    }

    const { error: deleteError } = await supabase
        .from("game_users")
        .delete()
        .eq("game_id", parseInt(gameId, 10));

    if (deleteError) {
        throw new Error(`Failed to delete invitees for game with id ${gameId}`);
    }

    const inviteesArray = invitees.split(",").map((userId) => userId.trim());
    const { data: inviteesData, error: insertError } = await supabase
        .from("game_users")
        .insert(
            inviteesArray.map((userId) => ({
                game_id: parseInt(gameId, 10),
                user_id: userId,
            }))
        )
        .select();

    if (insertError) {
        throw new Error(`Failed to add invitees for game with id ${gameId}`);
    }

    return { gameData: updatedGameData, gameUsersData: inviteesData };
};
