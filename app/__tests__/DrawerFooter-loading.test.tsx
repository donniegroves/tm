import { screen } from "@testing-library/react";
import DrawerFooter, { DrawerFooterPurpose } from "../components/DrawerFooter";
import { renderWithContext } from "../test-helpers";

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
        isDrawerActionLoading: true,
        setIsDrawerActionLoading,
    }),
}));

describe("DrawerFooter loading", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    it("renders spinner when isDrawerActionLoading is true", async () => {
        renderWithContext(
            <DrawerFooter purpose={DrawerFooterPurpose.ProfileUpdate} />
        );

        const saveButton = screen.getByRole("button", { name: "Loading..." });
        expect(saveButton).toBeInTheDocument();
    });
});
