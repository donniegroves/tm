import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import EditGameButton from "../components/EditGameButton";

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

describe("EditGameButton", () => {
    it("renders Edit by default and calls mutate on click", () => {
        render(
            <EditGameButton
                gameId={123}
                pendingRowId={-1}
                setPendingRowId={mockSetPendingRowId}
            />
        );

        const editButton = screen.getByText("Edit");
        expect(editButton).toBeInTheDocument();
    });

    it("shows spinner when isPending and variables match", () => {
        render(
            <EditGameButton
                gameId={123}
                pendingRowId={123}
                setPendingRowId={mockSetPendingRowId}
            />
        );

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("calls setPendingRowId with gameId on click", async () => {
        render(
            <EditGameButton
                gameId={123}
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
