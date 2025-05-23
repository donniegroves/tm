import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HeaderProfileDropdown from "../components/HeaderProfileDropdown";

jest.mock("../actions/signOut", () => ({
    signOut: jest.fn(),
}));
jest.mock("../actions/updateProfile", () => ({
    updateProfile: jest.fn(),
}));
jest.mock("../inside/DrawerProvider");

import { signOut } from "../actions/signOut";
import DrawerProvider from "../inside/DrawerProvider";
import { InsideContextProvider } from "../inside/InsideContext";
import { mockPublicUserRow } from "../test-helpers";

// Set up mocks for DrawerProvider/useDrawer
const setDrawerContent = jest.fn();
const setIsDrawerOpen = jest.fn();

jest.mock("../inside/DrawerProvider", () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useDrawer: () => ({
        setDrawerContent,
        setIsDrawerOpen,
    }),
}));

const setup = () => {
    render(
        <InsideContextProvider
            loggedInUserId={mockPublicUserRow.user_id}
            allUsers={[mockPublicUserRow]}
            gamesData={[]}
            questions={[]}
        >
            <DrawerProvider>
                <HeaderProfileDropdown />
            </DrawerProvider>
        </InsideContextProvider>
    );
    fireEvent.click(screen.getByRole("button"));
};

describe("HeaderProfileDropdown", () => {
    it("renders the dropdown and menu items", async () => {
        setup();

        await waitFor(() => {
            expect(screen.getByText("Profile")).toBeInTheDocument();
            expect(screen.getByText("Sign out")).toBeInTheDocument();
        });
    });

    it("calls signOut when 'Sign out' is clicked", async () => {
        setup();

        fireEvent.click(screen.getByText("Sign out"));

        await waitFor(() => {
            expect(signOut).toHaveBeenCalled();
        });
    });

    it("opens the drawer when the trigger and then profile are clicked", async () => {
        setup();

        await waitFor(() => {
            expect(screen.getByText("Profile")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Profile"));

        await waitFor(() => {
            expect(setDrawerContent).toHaveBeenCalled();
            expect(setIsDrawerOpen).toHaveBeenCalledWith(true);
        });
    });
});
