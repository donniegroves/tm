"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const resetPassword = async (password: string) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        throw new Error("Password update failed.");
    }

    return redirect(`/inside`);
};
