import { act, renderHook, waitFor } from "@testing-library/react";
import { updateGameStatus } from "../actions/updateGameStatus";
import { TanstackProvider } from "../components/TanstackProvider";
import { useUpdateGameStatus } from "../hooks/useUpdateGameStatus";
import { mockGamesData } from "./helpers/helpers";

jest.mock("../actions/updateGameStatus");

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

const mockUpdateGameStatus = updateGameStatus as jest.MockedFunction<
    typeof updateGameStatus
>;

describe("useUpdateGameStatus", () => {
    const mockGameData = mockGamesData[0];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("updates game status and invalidates games query", async () => {
        const updatedGameData = { ...mockGameData, status: 1 };
        mockUpdateGameStatus.mockResolvedValue({
            gameData: updatedGameData,
        });

        const { result } = renderHook(() => useUpdateGameStatus(), {
            wrapper: TanstackProvider,
        });

        act(() => {
            result.current.mutate(updatedGameData);
        });

        await waitFor(() => {
            expect(mockUpdateGameStatus).toHaveBeenCalledWith(updatedGameData);
            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ["games"],
            });
        });
    });

    it("returns the updated game data on success", async () => {
        const updatedGameData = { ...mockGameData, status: 2 };
        mockUpdateGameStatus.mockResolvedValue({
            gameData: updatedGameData,
        });

        const { result } = renderHook(() => useUpdateGameStatus(), {
            wrapper: TanstackProvider,
        });

        act(() => {
            result.current.mutate(updatedGameData);
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
            expect(result.current.data).toEqual({
                gameData: updatedGameData,
            });
        });
    });

    it("handles errors when update fails", async () => {
        const errorMessage = "Failed to edit game with id 111";
        mockUpdateGameStatus.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useUpdateGameStatus(), {
            wrapper: TanstackProvider,
        });

        act(() => {
            result.current.mutate(mockGameData);
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
            expect(result.current.error).toEqual(new Error(errorMessage));
        });
    });

    it("calls onSettled even when mutation fails", async () => {
        mockUpdateGameStatus.mockRejectedValue(new Error("Update failed"));

        const { result } = renderHook(() => useUpdateGameStatus(), {
            wrapper: TanstackProvider,
        });

        act(() => {
            result.current.mutate(mockGameData);
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ["games"],
            });
        });
    });

    it("can update different game statuses", async () => {
        const { result } = renderHook(() => useUpdateGameStatus(), {
            wrapper: TanstackProvider,
        });

        const resetGameData = { ...mockGameData, status: 0 };
        mockUpdateGameStatus.mockResolvedValue({
            gameData: resetGameData,
        });

        act(() => {
            result.current.mutate(resetGameData);
        });

        await waitFor(() => {
            expect(mockUpdateGameStatus).toHaveBeenCalledWith(resetGameData);
        });

        const inProgressGameData = { ...mockGameData, status: 1 };
        mockUpdateGameStatus.mockResolvedValue({
            gameData: inProgressGameData,
        });

        act(() => {
            result.current.mutate(inProgressGameData);
        });

        await waitFor(() => {
            expect(mockUpdateGameStatus).toHaveBeenCalledWith(
                inProgressGameData
            );
        });

        const completedGameData = { ...mockGameData, status: 2 };
        mockUpdateGameStatus.mockResolvedValue({
            gameData: completedGameData,
        });

        act(() => {
            result.current.mutate(completedGameData);
        });

        await waitFor(() => {
            expect(mockUpdateGameStatus).toHaveBeenCalledWith(
                completedGameData
            );
        });
    });
});
