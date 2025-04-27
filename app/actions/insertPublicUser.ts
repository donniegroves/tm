"use server";

import { createClient } from "@/utils/supabase/server";

export const insertPublicUser = async (userId: string) => {
    const supabase = await createClient();
    const { error } = await supabase.from("users").insert([
        {
            user_id: userId,
            access_level: 0,
        },
    ]);

    if (error) {
        throw new Error();
    }
};
