"use client";

import { createClient } from "@/utils/supabase/client";

export const resetPassword = async (password: string) => {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        throw new Error("Password update failed.");
    }
};
