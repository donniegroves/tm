import { createClient } from "@/utils/supabase/client";
import { signUp } from "../actions/signUp";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(() => ({
        auth: {
            signUp: jest.fn(),
        },
    })),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

type SignupReturn = {
    data: {
        user: string; // not actually a string
    } | null;
    error:
        | {
              code?: string;
          }
        | Error
        | null;
};

const mockEmail = "test@example.com";
const mockPassword = "password123";
const mockOrigin = window.location.origin;

const setupSupabaseMock = (mockSignupReturn: SignupReturn) => {
    const mockSignUp = jest.fn().mockResolvedValue(mockSignupReturn);
    const mockSupabase = { auth: { signUp: mockSignUp } };
    (createClient as jest.Mock).mockReturnValue(mockSupabase); // Fixed to return the mockSupabase object synchronously

    return { mockSignUp, mockSupabase, createClient };
};

describe("signUp", () => {
    it("should sign up a user and redirect to confirm-email", async () => {
        const { mockSignUp } = setupSupabaseMock({
            data: { user: "test" },
            error: null,
        });

        await expect(signUp(mockEmail, mockPassword)).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockSignUp).toHaveBeenCalledWith({
            email: mockEmail,
            password: mockPassword,
            options: {
                emailRedirectTo: `${mockOrigin}/auth/callback`,
            },
        });
    });

    it("should throw an error if the user already exists", async () => {
        const { mockSignUp } = setupSupabaseMock({
            data: null,
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
    });

    it("should throw a generic error if sign-up fails", async () => {
        const { mockSignUp } = setupSupabaseMock({
            data: null,
            error: new Error("Sign-up failed"),
        });

        await expect(signUp(mockEmail, mockPassword)).rejects.toThrow("");

        expect(createClient).toHaveBeenCalled();
        expect(mockSignUp).toHaveBeenCalledWith({
            email: mockEmail,
            password: mockPassword,
            options: expect.any(Object),
        });
    });
});
