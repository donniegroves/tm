import { updateProfile } from "../actions/updateProfile";
import { updatePublicUserRow } from "../actions/updatePublicUserRow";

jest.mock("../actions/updatePublicUserRow", () => ({
    updatePublicUserRow: jest.fn(),
}));

describe("updateProfile", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls updatePublicUserRow with username and timezone from the form", () => {
        document.body.innerHTML = `
            <form id="profile-form">
                <input value="testuser" />
                <select><option value="America/New_York" selected>America/New_York</option></select>
            </form>
        `;
        updateProfile("user-123");
        expect(updatePublicUserRow).toHaveBeenCalledWith("user-123", {
            username: "testuser",
            timezone: "America/New_York",
        });
    });

    it("warns and does not call updatePublicUserRow if form is not found", () => {
        document.body.innerHTML = "";
        const warnSpy = jest
            .spyOn(console, "warn")
            .mockImplementation(() => {});
        updateProfile("user-123");
        expect(warnSpy).toHaveBeenCalledWith("Profile form not found");
        expect(updatePublicUserRow).not.toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it("calls updatePublicUserRow with undefined if fields are missing", () => {
        document.body.innerHTML = `<form id="profile-form"></form>`;
        updateProfile("user-123");
        expect(updatePublicUserRow).toHaveBeenCalledWith("user-123", {
            username: undefined,
            timezone: undefined,
        });
    });
});
