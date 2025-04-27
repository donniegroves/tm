"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signIn = async (email: string, password: string) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
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

    return redirect("/inside");
};
