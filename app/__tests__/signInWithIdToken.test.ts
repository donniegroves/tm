import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { insertPublicUser } from "../actions/insertPublicUser";
import { signInWithIdToken } from "../actions/signInWithIdToken";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));
jest.mock("../actions/insertPublicUser", () => ({
    insertPublicUser: jest.fn(),
}));

const mockResponse = { credential: "test-credential" };
const mockNonce = "test-nonce";

beforeEach(() => {
    jest.clearAllMocks();
});

// TODO: need to type these parameters properly
const setupMocks = (signInWithIdTokenReturn, maybeSingleReturn) => {
    const mockFrom = jest.fn();
    const mockSelect = jest.fn();
    const mockEq = jest.fn();
    const mockMaybeSingle = jest.fn();

    const mockSignInWithIdToken = jest
        .fn()
        .mockResolvedValue(signInWithIdTokenReturn);

    const mockSupabase = {
        auth: { signInWithIdToken: mockSignInWithIdToken },
        from: mockFrom.mockReturnValue({
            select: mockSelect.mockReturnValue({
                eq: mockEq.mockReturnValue({
                    maybeSingle:
                        mockMaybeSingle.mockReturnValue(maybeSingleReturn),
                }),
            }),
        }),
    };
    (insertPublicUser as jest.Mock).mockResolvedValue(null);
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    return {
        mockSignInWithIdToken,
        mockSupabase,
        mockFrom,
        mockSelect,
        mockEq,
        mockMaybeSingle,
        createClient,
        insertPublicUser,
    };
};

describe("signInWithIdTokenAction", () => {
    it("should throw an error if sign-in fails", async () => {
        const { mockSignInWithIdToken, createClient } = setupMocks(
            {
                data: null,
                error: new Error("Sign-in failed"),
            },
            null
        );

        await expect(
            signInWithIdToken(mockResponse, mockNonce)
        ).rejects.toThrow("Error signing in with Google");

        expect(createClient).toHaveBeenCalled();
        expect(mockSignInWithIdToken).toHaveBeenCalledWith({
            provider: "google",
            token: mockResponse.credential,
            nonce: mockNonce,
        });
    });

    it("should throw an error if checking existing user fails", async () => {
        setupMocks(
            {
                data: { user: { id: "test-user-id" } },
                error: null,
            },
            {
                data: null,
                error: "error message received",
            }
        );

        await expect(
            signInWithIdToken(mockResponse, mockNonce)
        ).rejects.toThrow("Error checking existing user");
    });

    it("should call insertPublicUser if user does not exist, then redirect", async () => {
        const { mockMaybeSingle, insertPublicUser } = setupMocks(
            {
                data: { user: { id: "test-user-id" } },
                error: null,
            },

            {
                data: null, // Simulate user does not exist
                error: null,
            }
        );

        await expect(
            signInWithIdToken(mockResponse, mockNonce)
        ).resolves.not.toThrow();

        expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
        expect(insertPublicUser).toHaveBeenCalledWith("test-user-id");
        expect(redirect).toHaveBeenCalledWith("/inside");
    });
});
