import { act, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import NavMenuItem from "../components/NavMenuItem";
import { renderWithContext } from "../test-helpers";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

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

describe("NavMenuItem", () => {
    it("renders label and icon", () => {
        renderWithContext(
            <NavMenuItem
                label={"Test"}
                icon={<span data-testid="icon">I</span>}
                href="/test"
            />
        );

        expect(screen.getByLabelText("Test")).toBeInTheDocument();
        expect(screen.getByText("Test")).toBeInTheDocument();
        expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("calls router.push on click", async () => {
        const push = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push });
        renderWithContext(
            <NavMenuItem
                label={"Test"}
                icon={<span data-testid="icon">I</span>}
                href="/test"
            />
        );
        const button = screen.getByLabelText("Test");
        act(() => {
            button.click();
        });

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith("/test");
        });
    });

    it("calls onPress when label is 'Settings' and Action button is clicked", async () => {
        renderWithContext(
            <NavMenuItem
                label={"Settings"}
                icon={<span data-testid="icon">I</span>}
                href="/settings"
            />
        );

        const button = screen.getByLabelText("Settings");
        act(() => {
            button.click();
        });
        await waitFor(() => {
            expect(setDrawerContent).toHaveBeenCalled();
            expect(setIsDrawerOpen).toHaveBeenCalledWith(true);
        });
    });
});
