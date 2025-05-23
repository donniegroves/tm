"use server";

import { createClient } from "@/utils/supabase/server";

export const updatePublicUserRow = async (
    userId: string,
    data: { username?: string; timezone?: string }
) => {
    const supabase = await createClient();
    const { error, status } = await supabase
        .from("users")
        .update(data)
        .eq("user_id", userId);

    if (error || status !== 204) {
        throw new Error();
    }
};
