"use client";

import { createClient } from "@/utils/supabase/client";
import { Strings } from "../common";

export const forgotPassword = async (email: string) => {
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?redirect_to=/inside/reset-password`,
    });

    if (error) {
        throw new Error(Strings.FAILED_TO_SEND_EMAIL);
    }

    return;
};
