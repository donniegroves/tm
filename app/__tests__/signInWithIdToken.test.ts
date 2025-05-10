import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { insertPublicUser } from "../actions/insertPublicUser";
import { signInWithIdToken } from "../actions/signInWithIdToken";
import { getUserFromPublic } from "../helpers";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));
jest.mock("../helpers", () => ({
    getUserFromPublic: jest.fn(),
}));
jest.mock("../actions/insertPublicUser", () => ({
    insertPublicUser: jest.fn(),
}));

const sbErrorResponse = {
    error: new Error("Error signing in with Google"),
};
const sbSuccessResponse = {
    data: {
        user: {
            id: "123",
        },
    },
};
const publicFalseResponse = null;

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
                signInWithIdToken: jest
                    .fn()
                    .mockResolvedValue(sbSuccessResponse),
            },
        };
        (createClient as jest.Mock).mockResolvedValue(mockSupabase);
        (getUserFromPublic as jest.Mock).mockResolvedValue(publicFalseResponse);
        (insertPublicUser as jest.Mock).mockResolvedValue({});

        await signInWithIdToken(mockResponse, mockNonce);

        expect(getUserFromPublic).toHaveBeenCalledWith(
            sbSuccessResponse.data.user.id
        );
        expect(insertPublicUser).toHaveBeenCalledWith(
            sbSuccessResponse.data.user.id
        );

        expect(redirect).toHaveBeenCalledWith("/inside");
    });
});
