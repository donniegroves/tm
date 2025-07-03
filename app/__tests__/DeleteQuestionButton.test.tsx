import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import DeleteQuestionButton from "../components/DeleteQuestionButton";
import { useDeleteQuestion } from "../hooks/useDeleteQuestion";

jest.mock("@heroui/spinner", () => ({
    Spinner: () => <div data-testid="spinner" />,
}));

const mockMutate = jest.fn();
jest.mock("../hooks/useDeleteQuestion");

function setup(isPending = false, variables = {}) {
    (useDeleteQuestion as jest.Mock).mockReturnValue({
        mutateAsync: mockMutate,
        isPending,
        variables,
    });
}

const mockSetPendingRowId = jest.fn();

describe("DeleteQuestionButton", () => {
    it("renders Delete by default and calls mutate on click", async () => {
        setup();
        render(
            <DeleteQuestionButton
                questionId={123}
                setPendingRowId={mockSetPendingRowId}
            />
        );

        const deleteButton = screen.getByText("Delete");
        expect(deleteButton).toBeInTheDocument();

        act(() => {
            fireEvent.click(deleteButton);
        });

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledTimes(1);
            expect(mockSetPendingRowId).toHaveBeenCalledWith(123);
        });
        expect(mockMutate).toHaveBeenCalledWith({ questionId: 123 });
    });

    it("shows spinner when isPending and variables match", () => {
        setup(true, { questionId: 123 });
        render(
            <DeleteQuestionButton
                questionId={123}
                setPendingRowId={mockSetPendingRowId}
            />
        );

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("shows Delete if isPending but variables do not match", () => {
        setup(true, { questionId: 456 });
        render(
            <DeleteQuestionButton
                questionId={123}
                setPendingRowId={mockSetPendingRowId}
            />
        );
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });
});
