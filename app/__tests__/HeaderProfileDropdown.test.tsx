import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { signOut } from "../actions/signOut";
import HeaderProfileDropdown from "../components/HeaderProfileDropdown";
import {
    mockUseInsideContext,
    setMockInsideContext,
} from "./helpers/helper-InsideContext";

jest.mock("../actions/signOut", () => ({
    signOut: jest.fn(),
}));
jest.mock("../actions/updateProfile", () => ({
    updateProfile: jest.fn(),
}));
jest.mock("../inside/DrawerProvider");

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

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => mockUseInsideContext(),
}));
beforeEach(() => {
    setMockInsideContext();
});

describe("HeaderProfileDropdown", () => {
    it("renders the dropdown and menu items", async () => {
        render(<HeaderProfileDropdown />);
        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(screen.getByText("Profile")).toBeInTheDocument();
            expect(screen.getByText("Sign out")).toBeInTheDocument();
        });
    });

    it("calls signOut when 'Sign out' is clicked", async () => {
        render(<HeaderProfileDropdown />);
        fireEvent.click(screen.getByRole("button"));

        fireEvent.click(screen.getByText("Sign out"));

        await waitFor(() => {
            expect(signOut).toHaveBeenCalled();
        });
    });

    it("opens the drawer when the trigger and then profile are clicked", async () => {
        render(<HeaderProfileDropdown />);
        fireEvent.click(screen.getByRole("button"));

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
