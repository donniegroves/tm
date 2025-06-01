import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { updateProfile } from "../actions/updateProfile";
import DrawerFooter, { DrawerFooterPurpose } from "../components/DrawerFooter";
import { TanstackProvider } from "../components/TanstackProvider";
import {
    mockAllUsers,
    mockUseInsideContext,
    setMockInsideContext,
} from "../test-helpers";

jest.mock("../actions/updateProfile", () => ({
    updateProfile: jest.fn(() => {
        return Promise.resolve();
    }),
}));

const setDrawerContent = jest.fn();
const setIsDrawerOpen = jest.fn();
const setIsDrawerActionLoading = jest.fn();
jest.mock("../inside/DrawerProvider", () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useDrawer: () => ({
        isDrawerOpen: false,
        setIsDrawerOpen,
        drawerContent: null,
        setDrawerContent,
        isDrawerActionLoading: false,
        setIsDrawerActionLoading,
    }),
}));

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => mockUseInsideContext(),
}));
beforeEach(() => {
    setMockInsideContext();
});

describe("DrawerFooter", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    it("renders nothing for non-profile-update purposes", () => {
        const { container } = render(
            <TanstackProvider>
                <DrawerFooter purpose={DrawerFooterPurpose.Reserved} />
            </TanstackProvider>
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("calls setIsDrawerOpen(false) when Close is pressed for profile-update", async () => {
        render(
            <TanstackProvider>
                <DrawerFooter purpose={DrawerFooterPurpose.ProfileUpdate} />
            </TanstackProvider>
        );

        const closeButton = screen.getByRole("button", { name: "Close" });
        const saveButton = screen.getByRole("button", { name: "Save" });

        await waitFor(() => {
            expect(closeButton).toBeInTheDocument();
            expect(saveButton).toBeInTheDocument();
        });

        fireEvent.click(closeButton);
        await waitFor(() => {
            expect(setIsDrawerOpen).toHaveBeenCalledWith(false);
        });
    });

    it("calls updateProfile with loggedInUserId when Save is pressed for profile-update", async () => {
        render(
            <TanstackProvider>
                <DrawerFooter purpose={DrawerFooterPurpose.ProfileUpdate} />
            </TanstackProvider>
        );

        const closeButton = screen.getByRole("button", { name: "Close" });
        const saveButton = screen.getByRole("button", { name: "Save" });

        await waitFor(() => {
            expect(closeButton).toBeInTheDocument();
            expect(saveButton).toBeInTheDocument();
        });

        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(setIsDrawerActionLoading).toHaveBeenNthCalledWith(1, true);
            expect(updateProfile).toHaveBeenCalledWith({
                userId: mockAllUsers[0].user_id,
            });
            expect(setIsDrawerActionLoading).toHaveBeenNthCalledWith(2, false);
            expect(setIsDrawerOpen).toHaveBeenCalledWith(false);
        });
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
