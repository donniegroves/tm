import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
    forgotPasswordAction,
    insertPublicUser,
    resetPasswordAction,
    signInAction,
    signInWithIdTokenAction,
    signOutAction,
    signUpAction,
} from "../actions";
import { Strings } from "../common-strings";

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

describe("insertPublicUser", () => {
    it("should insert a public user with the given userId", async () => {
        const mockUserId = "test-user-id";
        const mockInsert = jest.fn().mockResolvedValue({ error: null });
        const mockFrom = jest.fn(() => ({ insert: mockInsert }));
        const mockSupabase = { from: mockFrom };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(insertPublicUser(mockUserId)).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalledWith("users");
        expect(mockInsert).toHaveBeenCalledWith([
            {
                user_id: mockUserId,
                access_level: 0,
            },
        ]);
    });

    it("should throw an error if insertion fails", async () => {
        const mockUserId = "test-user-id";
        const mockInsert = jest
            .fn()
            .mockResolvedValue({ error: new Error("Insert failed") });
        const mockFrom = jest.fn(() => ({ insert: mockInsert }));
        const mockSupabase = { from: mockFrom };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(insertPublicUser(mockUserId)).rejects.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalledWith("users");
        expect(mockInsert).toHaveBeenCalledWith([
            {
                user_id: mockUserId,
                access_level: 0,
            },
        ]);
    });
});

describe("signInWithIdTokenAction", () => {
    it("should sign in with Google ID token and redirect to /inside", async () => {
        const mockResponse = { credential: "test-credential" };
        const mockNonce = "test-nonce";
        const mockUserId = "test-user-id";
        const mockSignInWithIdToken = jest.fn().mockResolvedValue({
            data: { user: { id: mockUserId } },
            error: null,
        });
        const mockFrom = jest.fn();
        const mockInsert = jest.fn().mockResolvedValue({ error: null });
        const mockSupabase = {
            auth: { signInWithIdToken: mockSignInWithIdToken },
            from: mockFrom.mockReturnValue({ insert: mockInsert }),
        };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(
            signInWithIdTokenAction(mockResponse, mockNonce, true)
        ).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockSignInWithIdToken).toHaveBeenCalledWith({
            provider: "google",
            token: mockResponse.credential,
            nonce: mockNonce,
        });
        expect(mockFrom).toHaveBeenCalledWith("users");
        expect(mockInsert).toHaveBeenCalledWith([
            {
                user_id: mockUserId,
                access_level: 0,
            },
        ]);
        expect(redirect).toHaveBeenCalledWith("/inside");
    });

    it("should throw an error if sign-in fails", async () => {
        const mockResponse = { credential: "test-credential" };
        const mockNonce = "test-nonce";
        const mockSignInWithIdToken = jest.fn().mockResolvedValue({
            data: null,
            error: new Error("Sign-in failed"),
        });
        const mockSupabase = {
            auth: { signInWithIdToken: mockSignInWithIdToken },
        };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(
            signInWithIdTokenAction(mockResponse, mockNonce, false)
        ).rejects.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockSignInWithIdToken).toHaveBeenCalledWith({
            provider: "google",
            token: mockResponse.credential,
            nonce: mockNonce,
        });
        expect(redirect).not.toHaveBeenCalled();
    });
});

describe("signUpAction", () => {
    it("should sign up a user and redirect to confirm-email", async () => {
        const mockEmail = "test@example.com";
        const mockPassword = "password123";
        const mockOrigin = "http://localhost:3000";
        const mockSignUp = jest.fn().mockResolvedValue({ error: null });
        const mockSupabase = { auth: { signUp: mockSignUp } };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);
        (headers as jest.Mock).mockReturnValue(
            new Map([["origin", mockOrigin]])
        );

        await expect(
            signUpAction(mockEmail, mockPassword)
        ).resolves.not.toThrow();

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
        const mockEmail = "test@example.com";
        const mockPassword = "password123";
        const mockSignUp = jest.fn().mockResolvedValue({
            error: { code: "user_already_exists" },
        });
        const mockSupabase = { auth: { signUp: mockSignUp } };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(signUpAction(mockEmail, mockPassword)).rejects.toThrow(
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
        const mockEmail = "test@example.com";
        const mockPassword = "password123";
        const mockSignUp = jest
            .fn()
            .mockResolvedValue({ error: new Error("Sign-up failed") });
        const mockSupabase = { auth: { signUp: mockSignUp } };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(signUpAction(mockEmail, mockPassword)).rejects.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockSignUp).toHaveBeenCalledWith({
            email: mockEmail,
            password: mockPassword,
            options: expect.any(Object),
        });
        expect(redirect).not.toHaveBeenCalled();
    });
});

describe("signInAction", () => {
    it("should sign in a user and redirect to /inside", async () => {
        const mockEmail = "test@example.com";
        const mockPassword = "password123";
        const mockSignInWithPassword = jest
            .fn()
            .mockResolvedValue({ error: null });
        const mockSupabase = {
            auth: { signInWithPassword: mockSignInWithPassword },
        };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(
            signInAction(mockEmail, mockPassword)
        ).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
            email: mockEmail,
            password: mockPassword,
        });
        expect(redirect).toHaveBeenCalledWith("/inside");
    });

    it("should throw an error if credentials are invalid", async () => {
        const mockEmail = "test@example.com";
        const mockPassword = "password123";
        const mockSignInWithPassword = jest.fn().mockResolvedValue({
            error: { code: "invalid_credentials" },
        });
        const mockSupabase = {
            auth: { signInWithPassword: mockSignInWithPassword },
        };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(signInAction(mockEmail, mockPassword)).rejects.toThrow(
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
        const mockEmail = "test@example.com";
        const mockPassword = "password123";
        const mockSignInWithPassword = jest
            .fn()
            .mockResolvedValue({ error: new Error("Sign-in failed") });
        const mockSupabase = {
            auth: { signInWithPassword: mockSignInWithPassword },
        };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(signInAction(mockEmail, mockPassword)).rejects.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
            email: mockEmail,
            password: mockPassword,
        });
        expect(redirect).not.toHaveBeenCalled();
    });
});

describe("forgotPasswordAction", () => {
    it("should send a password reset email", async () => {
        const mockEmail = "test@example.com";
        const mockOrigin = "http://localhost:3000";
        const mockResetPasswordForEmail = jest
            .fn()
            .mockResolvedValue({ error: null });
        const mockSupabase = {
            auth: { resetPasswordForEmail: mockResetPasswordForEmail },
        };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);
        (headers as jest.Mock).mockReturnValue(
            new Map([["origin", mockOrigin]])
        );

        await expect(forgotPasswordAction(mockEmail)).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(headers).toHaveBeenCalled();
        expect(mockResetPasswordForEmail).toHaveBeenCalledWith(mockEmail, {
            redirectTo: `${mockOrigin}/auth/callback?redirect_to=/inside/reset-password`,
        });
    });

    it("should throw an error if sending the email fails", async () => {
        const mockEmail = "test@example.com";
        const mockResetPasswordForEmail = jest.fn().mockResolvedValue({
            error: new Error("Failed to send email"),
        });
        const mockSupabase = {
            auth: { resetPasswordForEmail: mockResetPasswordForEmail },
        };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(forgotPasswordAction(mockEmail)).rejects.toThrow(
            Strings.FAILED_TO_SEND_EMAIL
        );

        expect(createClient).toHaveBeenCalled();
        expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
            mockEmail,
            expect.any(Object)
        );
    });
});

describe("resetPasswordAction", () => {
    it("should update the user's password and redirect to /inside", async () => {
        const mockPassword = "newPassword123";
        const mockUpdateUser = jest.fn().mockResolvedValue({ error: null });
        const mockSupabase = { auth: { updateUser: mockUpdateUser } };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(resetPasswordAction(mockPassword)).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockUpdateUser).toHaveBeenCalledWith({ password: mockPassword });
        expect(redirect).toHaveBeenCalledWith("/inside");
    });

    it("should throw an error if password update fails", async () => {
        const mockPassword = "newPassword123";
        const mockUpdateUser = jest.fn().mockResolvedValue({
            error: new Error("Password update failed"),
        });
        const mockSupabase = { auth: { updateUser: mockUpdateUser } };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(resetPasswordAction(mockPassword)).rejects.toThrow(
            "Password update failed."
        );

        expect(createClient).toHaveBeenCalled();
        expect(mockUpdateUser).toHaveBeenCalledWith({ password: mockPassword });
        expect(redirect).not.toHaveBeenCalled();
    });
});

describe("signOutAction", () => {
    it("should sign out the user and redirect to /login", async () => {
        const mockSignOut = jest.fn().mockResolvedValue({ error: null });
        const mockSupabase = { auth: { signOut: mockSignOut } };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(signOutAction()).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockSignOut).toHaveBeenCalled();
        expect(redirect).toHaveBeenCalledWith("/login");
    });
});
