"use client";

import { createClient } from "@/utils/supabase/client";

export const signUp = async (email: string, password: string) => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    if (error && error.code === "user_already_exists") {
        throw new Error(error.code);
    } else if (error || !data.user) {
        throw new Error();
    }

    return { data, error };
};
