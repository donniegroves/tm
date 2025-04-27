import { Strings } from "app/common-strings";
import { sha256 } from "js-sha256";
import { useEffect, useState } from "react";
import { signInWithIdToken } from "../actions/signInWithIdToken";

declare global {
    interface Window {
        handleSignInWithGoogle: (
            response: GoogleSignInResponse
        ) => Promise<void>;
    }
}

interface NonceObject {
    nonce: string;
    hashedNonce: string;
}

interface GoogleSignInResponse {
    credential: string;
}

const generateNonce = async () => {
    const nonce = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0")
    ).join("");

    const hashedNonce = sha256(nonce);
    return { nonce, hashedNonce };
};

export default function GoogleSignInButton({
    mode = "signin",
    setError,
}: {
    mode: "signin" | "signup"; // TODO: implement signup usage
    setError: (error: string) => void;
}) {
    const [nonceObject, setNonceObject] = useState<NonceObject | null>(null);

    useEffect(() => {
        generateNonce().then((nonce) => setNonceObject(nonce));
    }, []);

    if (typeof window === "undefined" || !nonceObject?.hashedNonce) {
        return null;
    }

    window.handleSignInWithGoogle = async (
        response: GoogleSignInResponse
    ): Promise<void> => {
        try {
            await signInWithIdToken(response, nonceObject?.nonce);
        } catch {
            setError(Strings.ERROR_SIGNING_IN);
        }
    };

    return (
        <>
            <div
                id="g_id_onload"
                data-client_id={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}
                data-context={mode}
                data-ux_mode="popup"
                data-callback="handleSignInWithGoogle"
                data-nonce={nonceObject.hashedNonce}
                data-auto_prompt="false"
                data-use_fedcm_for_prompt="true"
            ></div>

            <div
                className="g_id_signin"
                style={{ colorScheme: "light" }} // needed for dark and theme styling
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text={`${mode}_with`}
                data-size="large"
                data-logo_alignment="left"
            ></div>
        </>
    );
}
