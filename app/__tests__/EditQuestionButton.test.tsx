import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import EditQuestionButton from "../components/EditQuestionButton";

jest.mock("@heroui/spinner", () => ({
    Spinner: () => <div data-testid="spinner" />,
}));

const mockSetIsDrawerOpen = jest.fn();
const mockSetDrawerContent = jest.fn();
jest.mock("../inside/DrawerProvider", () => {
    return {
        useDrawer: () => ({
            setIsDrawerOpen: mockSetIsDrawerOpen,
            setDrawerContent: mockSetDrawerContent,
        }),
    };
});

const mockSetPendingRowId = jest.fn();

describe("EditQuestionButton", () => {
    it("renders Edit by default and calls mutate on click", () => {
        render(
            <EditQuestionButton
                questionId={123}
                pendingRowId={-1}
                setPendingRowId={mockSetPendingRowId}
            />
        );

        const editButton = screen.getByText("Edit");
        expect(editButton).toBeInTheDocument();
    });

    it("shows spinner when isPending and variables match", () => {
        render(
            <EditQuestionButton
                questionId={123}
                pendingRowId={123}
                setPendingRowId={mockSetPendingRowId}
            />
        );

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("calls setPendingRowId with questionId on click", async () => {
        render(
            <EditQuestionButton
                questionId={123}
                pendingRowId={-1}
                setPendingRowId={mockSetPendingRowId}
            />
        );

        const editButton = screen.getByText("Edit");
        act(() => {
            fireEvent.click(editButton);
        });

        await waitFor(() => {
            expect(mockSetPendingRowId).toHaveBeenCalledWith(123);
            expect(mockSetIsDrawerOpen).toHaveBeenCalledWith(true);
            expect(mockSetDrawerContent).toHaveBeenCalled();
        });
    });
});
