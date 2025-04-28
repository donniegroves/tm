import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { forgotPassword } from "../actions/forgotPassword";
import { Strings } from "../common";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));
jest.mock("next/headers", () => ({
    headers: jest.fn(),
}));

const mockEmail = "test@example.com";
const mockOrigin = "http://localhost:3000";
let mockResetPasswordForEmail: jest.Mock;
let mockSupabase;

beforeEach(() => {
    jest.clearAllMocks();

    mockResetPasswordForEmail = jest.fn();
    mockSupabase = {
        auth: { resetPasswordForEmail: mockResetPasswordForEmail },
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
    (headers as jest.Mock).mockReturnValue(new Map([["origin", mockOrigin]]));
});

describe("forgotPasswordAction", () => {
    it("should send a password reset email", async () => {
        mockResetPasswordForEmail.mockResolvedValue({ error: null });

        await expect(forgotPassword(mockEmail)).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(headers).toHaveBeenCalled();
        expect(mockResetPasswordForEmail).toHaveBeenCalledWith(mockEmail, {
            redirectTo: `${mockOrigin}/auth/callback?redirect_to=/inside/reset-password`,
        });
    });

    it("should throw an error if sending the email fails", async () => {
        mockResetPasswordForEmail.mockResolvedValue({
            error: "Failed to send email",
        });

        await expect(forgotPassword(mockEmail)).rejects.toThrow(
            Strings.FAILED_TO_SEND_EMAIL
        );

        expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
            mockEmail,
            expect.any(Object)
        );
    });
});
