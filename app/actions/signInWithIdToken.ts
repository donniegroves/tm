"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserFromPublic, mapAuthUserRowToPublicUserRow } from "../helpers";
import { insertPublicUser } from "./insertPublicUser";
import { storeAvatar } from "./storeAvatar";

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
            const publicAvatarUrl = await storeAvatar(
                signInWithIdTokenData.user.id,
                signInWithIdTokenData.user.user_metadata.avatar_url
            );

            const publicUserRow = {
                ...mapAuthUserRowToPublicUserRow(signInWithIdTokenData.user),
                avatar_url: publicAvatarUrl,
            };

            await insertPublicUser({ userData: publicUserRow });
        }
    } catch {
        throw new Error("Error signing in with Google");
    }

    return redirect(`/inside`);
};
