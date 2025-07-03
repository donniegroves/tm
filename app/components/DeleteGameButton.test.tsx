import { render, screen, fireEvent } from "@testing-library/react";
import DeleteGameButton from "./DeleteGameButton";
import React from "react";

const mutateMock = jest.fn();
jest.mock("../hooks/useDeleteGame", () => ({
    useDeleteGame: () => ({ mutate: mutateMock }),
}));

describe("DeleteGameButton", () => {
    it("renders a button with text 'Delete' and calls setPendingRowId and mutate on click", () => {
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
        expect(setPendingRowId).toHaveBeenCalledWith(gameId);
        expect(mutateMock).toHaveBeenCalledWith({ gameId });
    });
});
