"use client";

import { createClient } from "@/utils/supabase/client";

export const signIn = async (email: string, password: string) => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (error.code === "invalid_credentials") {
            throw new Error(error.code);
        } else {
            throw new Error();
        }
    }

    return { data, error: null };
};
