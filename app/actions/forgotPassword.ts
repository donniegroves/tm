"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { Strings } from "../common";

export const forgotPassword = async (email: string) => {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/inside/reset-password`,
    });

    if (error) {
        throw new Error(Strings.FAILED_TO_SEND_EMAIL);
    }

    return;
};
