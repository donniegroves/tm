"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { insertPublicUser } from "./insertPublicUser";

interface GoogleSignInResponse {
    credential: string;
}

export const signInWithIdToken = async (
    response: GoogleSignInResponse,
    nonHashedNonce: string
) => {
    const supabase = await createClient();
    const { data: signInWithIdTokenData, error: signInWithIdTokenError } =
        await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
            nonce: nonHashedNonce,
        });

    if (signInWithIdTokenError) {
        throw new Error("Error signing in with Google");
    }

    const { data: existingUserData, error: existingUserError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", signInWithIdTokenData.user.id)
        .maybeSingle();

    if (existingUserError) {
        throw new Error("Error checking existing user");
    }

    if (!existingUserData) {
        await insertPublicUser(signInWithIdTokenData.user.id);
    }

    return redirect(`/inside`);
};
