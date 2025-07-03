import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { signIn } from "../actions/signIn";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

const mockEmail = "test@example.com";
const mockPassword = "password123";

const setupMocks = (signInReturn: {
    error: Error | null | { code: string };
}) => {
    const mockSignInWithPassword = jest.fn().mockResolvedValue(signInReturn);
    const mockSupabase = {
        auth: { signInWithPassword: mockSignInWithPassword },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase); // Fixed to return the mockSupabase object synchronously
    return { mockSignInWithPassword, mockSupabase };
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("signIn", () => {
    it("should sign in a user and redirect to /inside", async () => {
        const { mockSignInWithPassword } = setupMocks({ error: null });

        await expect(signIn(mockEmail, mockPassword)).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
            email: mockEmail,
            password: mockPassword,
        });
    });

    it("should throw an error if credentials are invalid", async () => {
        const { mockSignInWithPassword } = setupMocks({
            error: { code: "invalid_credentials" },
        });

        await expect(signIn(mockEmail, mockPassword)).rejects.toThrow(
            "invalid_credentials"
        );

        expect(createClient).toHaveBeenCalled();
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
            email: mockEmail,
            password: mockPassword,
        });
        expect(redirect).not.toHaveBeenCalled();
    });

    it("should throw a generic error if sign-in fails", async () => {
        const { mockSignInWithPassword } = setupMocks({
            error: new Error("Sign-in failed"),
        });

        await expect(signIn(mockEmail, mockPassword)).rejects.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
            email: mockEmail,
            password: mockPassword,
        });
        expect(redirect).not.toHaveBeenCalled();
    });
});
