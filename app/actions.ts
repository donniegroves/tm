"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Strings } from "./common-strings";

interface GoogleSignInResponse {
    credential: string;
}

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

export const signInWithIdTokenAction = async (
    response: GoogleSignInResponse,
    nonHashedNonce: string,
    signingUp: boolean
) => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
        nonce: nonHashedNonce,
    });

    if (error) {
        throw new Error();
    }

    if (signingUp) {
        await insertPublicUser(data.user.id);
    }

    return redirect(`/inside`);
};

export const signUpAction = async (email: string, password: string) => {
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

export const signInAction = async (email: string, password: string) => {
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

export const forgotPasswordAction = async (email: string) => {
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

export const resetPasswordAction = async (password: string) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        throw new Error("Password update failed.");
    }

    return redirect(`/inside`);
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
};
