import { createClient } from "@/utils/supabase/client";
import { updateProfile } from "../actions/updateProfile";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

const createClientMock = createClient as jest.Mock;

describe("updateProfile", () => {
    beforeEach(() => {
        createClientMock.mockReset();
    });

    it("calls supabase with username and timezone from the form", async () => {
        document.body.innerHTML = `
            <form id="profile-form">
                <input value="newuser" />
                <select><option value="Asia/Tokyo" selected>Asia/Tokyo</option></select>
            </form>
        `;

        const mockEq = jest
            .fn()
            .mockResolvedValue({ error: null, status: 204 });
        const mockUpdate = jest.fn(() => ({ eq: mockEq }));
        const mockFrom = jest.fn(() => ({ update: mockUpdate }));

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(
            updateProfile({ userId: "user-123" })
        ).resolves.not.toThrow();

        expect(createClientMock).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalledWith("users");
        expect(mockUpdate).toHaveBeenCalledWith({
            username: "newuser",
            timezone: "Asia/Tokyo",
        });
        expect(mockEq).toHaveBeenCalledWith("user_id", "user-123");
    });

    it("throws an error if supabase update fails", async () => {
        document.body.innerHTML = `
            <form id="profile-form">
                <input value="newuser" />
                <select><option value="Asia/Tokyo" selected>Asia/Tokyo</option></select>
            </form>
        `;

        const mockEq = jest
            .fn()
            .mockResolvedValue({ error: "error message!", status: 500 });
        const mockUpdate = jest.fn(() => ({ eq: mockEq }));
        const mockFrom = jest.fn(() => ({ update: mockUpdate }));

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(updateProfile({ userId: "user-123" })).rejects.toThrow(
            "Failed to update profile"
        );
    });

    it("throws an error if form elements are missing", async () => {
        document.body.innerHTML = `<form id="profile-form"></form>`;
        await expect(updateProfile({ userId: "user-123" })).rejects.toThrow(
            "Proper form elements not found to update profile"
        );
    });
});
