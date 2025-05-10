import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { resetPassword } from "../actions/resetPassword";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

const mockPassword = "newPassword123";

beforeEach(() => {
    jest.clearAllMocks();
});

const setupMocks = (updateUserReturn: { error: Error | null }) => {
    const mockUpdateUser = jest.fn().mockResolvedValue(updateUserReturn);
    const mockSupabase = { auth: { updateUser: mockUpdateUser } };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    return { mockUpdateUser, mockSupabase };
};

describe("resetPasswordAction", () => {
    it("should update the user's password and redirect to /inside", async () => {
        const { mockUpdateUser } = setupMocks({ error: null });

        await expect(resetPassword(mockPassword)).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockUpdateUser).toHaveBeenCalledWith({ password: mockPassword });
    });

    it("should throw an error if password update fails", async () => {
        const { mockUpdateUser } = setupMocks({
            error: new Error("Password update failed."),
        });

        await expect(resetPassword(mockPassword)).rejects.toThrow(
            "Password update failed."
        );

        expect(createClient).toHaveBeenCalled();
        expect(mockUpdateUser).toHaveBeenCalledWith({ password: mockPassword });
        expect(redirect).not.toHaveBeenCalled();
    });
});
