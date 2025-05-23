import { act, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import NavMenuItem from "../components/NavMenuItem";
import DrawerProvider from "../inside/DrawerProvider";
import { InsideContextProvider } from "../inside/InsideContext";
import { mockPublicUserRow } from "../test-helpers";

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

const setup = (label: string) => {
    render(
        <InsideContextProvider
            loggedInUserId={mockPublicUserRow.user_id}
            allUsers={[mockPublicUserRow]}
            gamesData={[]}
            questions={[]}
        >
            <DrawerProvider>
                <NavMenuItem
                    label={label}
                    icon={<span data-testid="icon">I</span>}
                    href="/test"
                />
            </DrawerProvider>
        </InsideContextProvider>
    );
};

describe("NavMenuItem", () => {
    it("renders label and icon", () => {
        setup("Test");

        expect(screen.getByLabelText("Test")).toBeInTheDocument();
        expect(screen.getByText("Test")).toBeInTheDocument();
        expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("calls router.push on click", async () => {
        const push = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push });
        setup("Test");
        const button = screen.getByLabelText("Test");
        act(() => {
            button.click();
        });

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith("/test");
        });
    });

    it("calls onPress when label is 'Settings' and Action button is clicked", async () => {
        setup("Settings");

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
