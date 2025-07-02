import { render, screen } from "@testing-library/react";
import DeleteGameButton from "../components/DeleteGameButton";
import { useDeleteGame } from "../hooks/useDeleteGame";

const mockMutate = jest.fn();
jest.mock("../hooks/useDeleteGame");

function setup(isPending = false, variables = {}) {
    (useDeleteGame as jest.Mock).mockReturnValue({
        mutateAsync: mockMutate,
        isPending,
        variables,
    });
}

const mockSetPendingRowId = jest.fn();

describe("DeleteGameButton", () => {
    it("renders a button with text 'Delete'", () => {
        setup();
        render(<DeleteGameButton gameId={123} setPendingRowId={() => {}} />);
        expect(
            screen.getByRole("button", { name: /delete/i })
        ).toBeInTheDocument();
    });
});
