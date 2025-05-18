import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { insertPublicUser } from "../actions/insertPublicUser";
import { signInWithIdToken } from "../actions/signInWithIdToken";
import { getUserFromPublic } from "../helpers";
import { mockAuthUserRow } from "../test-helpers";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));
jest.mock("../helpers", () => {
    const actual = jest.requireActual("../helpers");
    return {
        ...actual,
        getUserFromPublic: jest.fn(),
    };
});
jest.mock("../actions/insertPublicUser", () => ({
    insertPublicUser: jest.fn(),
}));

const sbErrorResponse = {
    error: new Error("Error signing in with Google"),
};
const mockResponse = { credential: "mockCredential" };
const mockNonce = "mockNonce";

describe("signInWithIdToken", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("throws an error when supabase.auth.signInWithIdToken fails", async () => {
        const mockSupabase = {
            auth: {
                signInWithIdToken: jest.fn().mockResolvedValue(sbErrorResponse),
            },
        };
        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(
            signInWithIdToken(mockResponse, mockNonce)
        ).rejects.toThrow("Error signing in with Google");

        expect(createClient).toHaveBeenCalled();
        expect(mockSupabase.auth.signInWithIdToken).toHaveBeenCalledWith({
            provider: "google",
            token: mockResponse.credential,
            nonce: mockNonce,
        });
    });

    it("calls getUserFromPublic and calls insertPublicUser", async () => {
        const mockSupabase = {
            auth: {
                signInWithIdToken: jest.fn().mockResolvedValue({
                    data: {
                        user: mockAuthUserRow,
                        session: {
                            access_token: "garbage-access-token",
                            refresh_token: "garbage-refresh-token",
                            expires_in: 3600,
                            token_type: "garbage-token-type",
                            user: mockAuthUserRow,
                        },
                    },
                    error: null,
                }),
            },
        };
        (createClient as jest.Mock).mockResolvedValue(mockSupabase);
        (getUserFromPublic as jest.Mock).mockResolvedValue(null);
        (insertPublicUser as jest.Mock).mockResolvedValue({});

        await signInWithIdToken(mockResponse, mockNonce);

        expect(getUserFromPublic).toHaveBeenCalledWith(mockAuthUserRow.id);

        expect(insertPublicUser).toHaveBeenCalledWith({
            avatar_url: mockAuthUserRow.user_metadata.avatar_url,
            email: mockAuthUserRow.email,
            full_name: mockAuthUserRow.user_metadata.full_name,
            user_id: mockAuthUserRow.id,
        });

        expect(redirect).toHaveBeenCalledWith("/inside");
    });
});
