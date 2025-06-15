"use client";

import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export const insertGame = async (): Promise<
    Database["public"]["Tables"]["games"]["Row"]
> => {
    // TODO: add invitee support
    const form = document.getElementById("add-game-form");
    const hostInput = form?.querySelector("#host-input");
    // const inviteesInput = form?.querySelector("#invitees-input");
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
        // !inviteesInput ||
        !shareCodeInput ||
        !aiBotsInput ||
        !secondsPerQuestionInput ||
        !secondsPerRankingInput
    ) {
        throw new Error("Proper form elements not found to insert game");
    }
    const host_user_id = (hostInput as HTMLSelectElement).value;
    // const invitees = (inviteesInput as HTMLSelectElement).value;
    const num_static_ai = Number((aiBotsInput as HTMLSelectElement).value);
    const share_code = (shareCodeInput as HTMLInputElement).value.trim();
    const seconds_per_pre = Number(
        (secondsPerQuestionInput as HTMLSelectElement).value
    );
    const seconds_per_rank = Number(
        (secondsPerRankingInput as HTMLSelectElement).value
    );

    const supabase = createClient();

    const { data, error, status } = await supabase
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

    if (error || status !== 201 || !data) {
        throw new Error(error?.message || `Failed to insert game`);
    }

    return data;
};
