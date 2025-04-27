"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUp = async (email: string, password: string) => {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error && error.code === "user_already_exists") {
        throw new Error(error.code);
    } else if (error) {
        throw new Error();
    }

    return redirect(`/confirm-email?email=${email}`);
};
