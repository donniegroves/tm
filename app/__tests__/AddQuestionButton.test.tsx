import { act, fireEvent, render, screen } from "@testing-library/react";
import AddQuestionButton from "../components/AddQuestionButton";

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

describe("AddQuestionButton", () => {
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
        render(<AddQuestionButton />);
        expect(
            screen.getByRole("button", { name: "Add question" })
        ).toBeInTheDocument();
    });

    it("opens drawer with AddQuestionForm on click", async () => {
        render(<AddQuestionButton />);

        const button = screen.getByRole("button", { name: "Add question" });

        act(() => {
            fireEvent.click(button);
        });

        expect(mockDrawerState.setIsDrawerOpen).toHaveBeenCalledWith(true);
    });

    it("renders a button with spinner when loading", () => {
        mockDrawerState.isDrawerOpen = true;
        mockDrawerState.isDrawerActionLoading = true;
        mockDrawerState.drawerContent.header = (
            <div className="text-lg font-bold">Add a question</div>
        );

        render(<AddQuestionButton />);
        expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });

    it("no spinner displayed if using a different drawer", () => {
        mockDrawerState.isDrawerActionLoading = true;

        render(<AddQuestionButton />);
        expect(screen.getByText("Add question")).toBeInTheDocument();
    });
});
