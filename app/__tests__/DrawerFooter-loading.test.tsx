import { render, screen } from "@testing-library/react";
import DrawerFooter, { DrawerFooterPurpose } from "../components/DrawerFooter";
import { TanstackProvider } from "../components/TanstackProvider";
import { mockUseInsideContext, setMockInsideContext } from "../test-helpers";

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

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => mockUseInsideContext(),
}));
beforeEach(() => {
    setMockInsideContext();
});

describe("DrawerFooter loading", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    it("renders spinner when isDrawerActionLoading is true", async () => {
        render(
            <TanstackProvider>
                <DrawerFooter purpose={DrawerFooterPurpose.ProfileUpdate} />
            </TanstackProvider>
        );

        const saveButton = screen.getByRole("button", { name: "Loading..." });
        expect(saveButton).toBeInTheDocument();
    });
});
