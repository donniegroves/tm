"use server";

import { createClient } from "@/utils/supabase/server";
import { AccessLevel } from "../common";

export const insertPublicUser = async (userId: string) => {
    const supabase = await createClient();
    const { error } = await supabase.from("users").insert([
        {
            user_id: userId,
            access_level: AccessLevel.USER,
        },
    ]);

    if (error) {
        throw new Error();
    }
};
