import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { updateProfile } from "../actions/updateProfile";
import DrawerFooter, { DrawerFooterPurpose } from "../components/DrawerFooter";

jest.mock("../actions/updateProfile", () => ({
    updateProfile: jest.fn(),
}));

const setIsDrawerOpen = jest.fn();

jest.mock("../inside/DrawerProvider", () => ({
    useDrawer: () => ({ setIsDrawerOpen }),
}));

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => ({ loggedInUserId: "user-123" }),
}));

describe("DrawerFooter", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls setIsDrawerOpen(false) when Close is pressed for profile-update", async () => {
        render(<DrawerFooter purpose={DrawerFooterPurpose.ProfileUpdate} />);

        await waitFor(() => {
            expect(screen.getByText("Close")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Close"));
        expect(setIsDrawerOpen).toHaveBeenCalledWith(false);
    });

    it("calls updateProfile with loggedInUserId when Save is pressed for profile-update", async () => {
        render(<DrawerFooter purpose={DrawerFooterPurpose.ProfileUpdate} />);

        await waitFor(() => {
            expect(screen.getByText("Save")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Save"));
        expect(updateProfile).toHaveBeenCalledWith("user-123");
    });

    it("throws if useDrawer is called outside of DrawerProvider", () => {
        const { useDrawer } = jest.requireActual("../inside/DrawerProvider");
        function TestComponent() {
            useDrawer();
            return null;
        }

        const spy = jest.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<TestComponent />)).toThrow(
            /useDrawer must be used within DrawerContext/
        );
        spy.mockRestore();
    });
});
