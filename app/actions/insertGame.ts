"use client";

import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export const insertGame = async (): Promise<
    Database["public"]["Tables"]["games"]["Row"]
> => {
    const form = document.getElementById("add-game-form");
    const hostInput = form?.querySelector("#host-input");
    const inviteesInput = form?.querySelector("#invitees-input");
    const shareCodeInput = form?.querySelector("#share-code-input");
    const aiBotsInput = form?.querySelector("#ai-bots-input");
    const secondsPerQuestionInput = form?.querySelector(
        "#question-duration-input"
    );
    const secondsPerRankingInput = form?.querySelector(
        "#ranking-duration-input"
    );

    if (
        !form ||
        !hostInput ||
        !inviteesInput ||
        !shareCodeInput ||
        !aiBotsInput ||
        !secondsPerQuestionInput ||
        !secondsPerRankingInput
    ) {
        throw new Error("Proper form elements not found to insert game");
    }
    const host_user_id = (hostInput as HTMLSelectElement).value;
    const invitees = (inviteesInput as HTMLSelectElement).value;
    const num_static_ai = Number((aiBotsInput as HTMLSelectElement).value);
    const share_code = (shareCodeInput as HTMLInputElement).value.trim();
    const seconds_per_pre = Number(
        (secondsPerQuestionInput as HTMLSelectElement).value
    );
    const seconds_per_rank = Number(
        (secondsPerRankingInput as HTMLSelectElement).value
    );

    const supabase = createClient();

    const {
        data: gameData,
        error: gameError,
        status: gameStatus,
    } = await supabase
        .from("games")
        .insert({
            host_user_id,
            num_static_ai,
            seconds_per_pre,
            seconds_per_rank,
            share_code,
        })
        .select()
        .single();

    if (gameError || gameStatus !== 201 || !gameData) {
        throw new Error(gameError?.message || `Failed to insert game`);
    }

    const inviteeArray = invitees.split(",").map((invitee) => invitee.trim());
    const { error: inviteeError, status: inviteeStatus } = await supabase
        .from("game_users")
        .insert(
            inviteeArray.map((invitee) => ({
                game_id: gameData.id,
                user_id: invitee,
            }))
        );

    if (inviteeError || inviteeStatus !== 201) {
        throw new Error(`Failed to insert invitees`);
    }

    return gameData;
};
