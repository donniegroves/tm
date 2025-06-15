import { act, fireEvent, render, screen } from "@testing-library/react";
import AddGameButton from "../components/AddGameButton";

let mockDrawerState = {
    setIsDrawerOpen: jest.fn(),
    setDrawerContent: jest.fn(),
    isDrawerOpen: false,
    isDrawerActionLoading: false,
    drawerContent: { header: <div>test!</div>, body: null, footer: null },
};

jest.mock("../inside/DrawerProvider", () => ({
    useDrawer: () => mockDrawerState,
}));

describe("AddGameButton", () => {
    beforeEach(() => {
        mockDrawerState = {
            setIsDrawerOpen: jest.fn(),
            setDrawerContent: jest.fn(),
            isDrawerOpen: false,
            isDrawerActionLoading: false,
            drawerContent: {
                header: <div>test!</div>,
                body: null,
                footer: null,
            },
        };
    });

    it("renders a button", () => {
        render(<AddGameButton />);
        expect(
            screen.getByRole("button", { name: "Add game" })
        ).toBeInTheDocument();
    });

    it("opens drawer with AddGameForm on click", async () => {
        render(<AddGameButton />);

        const button = screen.getByRole("button", { name: "Add game" });

        act(() => {
            fireEvent.click(button);
        });

        expect(mockDrawerState.setIsDrawerOpen).toHaveBeenCalledWith(true);
        expect(mockDrawerState.setDrawerContent).toHaveBeenCalled();
    });

    it("renders a button with spinner when loading", () => {
        mockDrawerState.isDrawerOpen = true;
        mockDrawerState.isDrawerActionLoading = true;
        mockDrawerState.drawerContent.header = (
            <div className="text-lg font-bold">Add a game</div>
        );

        render(<AddGameButton />);
        expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });

    it("no spinner displayed if using a different drawer", () => {
        mockDrawerState.isDrawerActionLoading = true;

        render(<AddGameButton />);
        expect(screen.getByText("Add game")).toBeInTheDocument();
    });
});
