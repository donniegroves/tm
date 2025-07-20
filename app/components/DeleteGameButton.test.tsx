import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DeleteGameButton from "./DeleteGameButton";

const mutateMock = jest.fn();
jest.mock("../hooks/useDeleteGame", () => ({
    useDeleteGame: () => ({ mutate: mutateMock }),
}));

describe("DeleteGameButton", () => {
    it("renders a button with text 'Delete' and calls setPendingRowId and mutate on click", async () => {
        const setPendingRowId = jest.fn();
        const gameId = 42;
        render(
            <DeleteGameButton
                gameId={gameId}
                setPendingRowId={setPendingRowId}
            />
        );
        const button = screen.getByRole("button", { name: /delete/i });
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        await waitFor(() => {
            expect(setPendingRowId).toHaveBeenCalledWith(gameId);
            expect(mutateMock).toHaveBeenCalledWith({ gameId });
        });
    });
});
