import { createClient } from "@/utils/supabase/client";
import { forgotPassword } from "../actions/forgotPassword";
import { Strings } from "../common";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

describe("forgotPasswordAction", () => {
    const mockEmail = "test@example.com";
    const mockOrigin = window.location.origin;
    let mockResetPasswordForEmail: jest.Mock;
    let mockSupabase: {
        auth: {
            resetPasswordForEmail: jest.Mock;
        };
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockResetPasswordForEmail = jest.fn();
        mockSupabase = {
            auth: { resetPasswordForEmail: mockResetPasswordForEmail },
        };

        (createClient as jest.Mock).mockReturnValue(mockSupabase);
    });

    it("should send a password reset email", async () => {
        mockResetPasswordForEmail.mockResolvedValue({ error: null });

        await expect(forgotPassword(mockEmail)).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
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
