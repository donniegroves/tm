import { act, renderHook, waitFor } from "@testing-library/react";
import { editGame } from "../actions/editGame";
import { TanstackProvider } from "../components/TanstackProvider";
import { useEditGame } from "../hooks/useEditGame";

jest.mock("../actions/editGame", () => ({
    editGame: jest.fn(async ({ gameId }) => {
        if (gameId === -1) throw new Error("fail");
        return undefined;
    }),
}));

const mockInvalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => {
    const actual = jest.requireActual("@tanstack/react-query");
    return {
        ...actual,
        useQueryClient: () => ({
            invalidateQueries: mockInvalidateQueries,
        }),
    };
});

describe("useEditGame", () => {
    it("edits a game and invalidates games query", async () => {
        const { result } = renderHook(() => useEditGame(), {
            wrapper: TanstackProvider,
        });

        act(() => {
            result.current.mutate();
        });

        await waitFor(() => {
            expect(editGame).toHaveBeenCalled();
            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ["games"],
            });
        });
    });
});
