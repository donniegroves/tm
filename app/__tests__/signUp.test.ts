import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signUp } from "../actions/signUp";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));
jest.mock("next/headers", () => ({
    headers: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

type SignupReturn = {
    error:
        | {
              code?: string;
          }
        | Error
        | null;
};

const mockEmail = "test@example.com";
const mockPassword = "password123";
const mockOrigin = "http://localhost:3000";

const setupSupabaseMock = (mockSignupReturn: SignupReturn) => {
    const mockSignUp = jest.fn().mockResolvedValue(mockSignupReturn);
    const mockSupabase = { auth: { signUp: mockSignUp } };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
    (headers as jest.Mock).mockReturnValue(new Map([["origin", mockOrigin]]));

    return { mockSignUp, mockSupabase, createClient, headers };
};

describe("signUp", () => {
    it("should sign up a user and redirect to confirm-email", async () => {
        const { mockSignUp, createClient, headers } = setupSupabaseMock({
            error: null,
        });

        await expect(signUp(mockEmail, mockPassword)).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(headers).toHaveBeenCalled();
        expect(mockSignUp).toHaveBeenCalledWith({
            email: mockEmail,
            password: mockPassword,
            options: {
                emailRedirectTo: `${mockOrigin}/auth/callback`,
            },
        });
        expect(redirect).toHaveBeenCalledWith(
            `/confirm-email?email=${mockEmail}`
        );
    });

    it("should throw an error if the user already exists", async () => {
        const { mockSignUp, createClient } = setupSupabaseMock({
            error: { code: "user_already_exists" },
        });

        await expect(signUp(mockEmail, mockPassword)).rejects.toThrow(
            "user_already_exists"
        );

        expect(createClient).toHaveBeenCalled();
        expect(mockSignUp).toHaveBeenCalledWith({
            email: mockEmail,
            password: mockPassword,
            options: expect.any(Object),
        });
        expect(redirect).not.toHaveBeenCalled();
    });

    it("should throw a generic error if sign-up fails", async () => {
        const { mockSignUp, createClient } = setupSupabaseMock({
            error: new Error("Sign-up failed"),
        });

        await expect(signUp(mockEmail, mockPassword)).rejects.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockSignUp).toHaveBeenCalledWith({
            email: mockEmail,
            password: mockPassword,
            options: expect.any(Object),
        });
        expect(redirect).not.toHaveBeenCalled();
    });
});
