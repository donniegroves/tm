"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserFromPublic } from "../helpers";
import { insertPublicUser } from "./insertPublicUser";

interface GoogleSignInResponse {
    credential: string;
}

export const signInWithIdToken = async (
    response: GoogleSignInResponse,
    nonHashedNonce: string
) => {
    try {
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

        const userExistsInPublictable = await getUserFromPublic(
            signInWithIdTokenData.user.id
        );

        if (!userExistsInPublictable) {
            await insertPublicUser(signInWithIdTokenData.user.id);
        }
    } catch {
        throw new Error("Error signing in with Google");
    }

    return redirect(`/inside`);
};
