import { updateProfile } from "../actions/updateProfile";
import { updatePublicUserRow } from "../actions/updatePublicUserRow";

jest.mock("../actions/updatePublicUserRow");

describe("updateProfile", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = "";
    });

    it("calls updatePublicUserRow with username and timezone from the form", () => {
        document.body.innerHTML = `
            <form id="profile-form">
                <input value="newuser" />
                <select><option value="Asia/Tokyo" selected>Asia/Tokyo</option></select>
            </form>
        `;
        updateProfile({ userId: "user-123" });
        expect(updatePublicUserRow).toHaveBeenCalledWith("user-123", {
            username: "newuser",
            timezone: "Asia/Tokyo",
        });
    });

    it("warns and does not call updatePublicUserRow if form is missing", () => {
        const warnSpy = jest
            .spyOn(console, "warn")
            .mockImplementation(() => {});
        updateProfile({ userId: "user-123" });
        expect(updatePublicUserRow).not.toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalledWith("Profile form not found");
        warnSpy.mockRestore();
    });

    it("calls updatePublicUserRow with undefined if fields are missing", () => {
        document.body.innerHTML = `<form id="profile-form"></form>`;
        updateProfile({ userId: "user-123" });
        expect(updatePublicUserRow).toHaveBeenCalledWith("user-123", {
            username: undefined,
            timezone: undefined,
        });
    });
});
